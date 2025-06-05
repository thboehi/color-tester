import puppeteer from 'puppeteer';
import sharp from 'sharp';

export async function POST(request) {
    try {
        const { url, theme = 'dark' } = await request.json();
        
        // 1. Capturer le screenshot et récupérer les métadonnées
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Configurer le thème
        await page.emulateMediaFeatures([
            { name: 'prefers-color-scheme', value: theme }
        ]);
        
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Récupérer les métadonnées du site
        const siteMetadata = await page.evaluate(() => {
            const title = document.title || 'No title';
            const description = document.querySelector('meta[name="description"]')?.content || 
                              document.querySelector('meta[property="og:description"]')?.content || 
                              'No description available';
            
            // Chercher le favicon
            let favicon = document.querySelector('link[rel="icon"]')?.href ||
                         document.querySelector('link[rel="shortcut icon"]')?.href ||
                         document.querySelector('link[rel="apple-touch-icon"]')?.href ||
                         '/favicon.ico';
            
            // Si le favicon est relatif, le rendre absolu
            if (favicon && !favicon.startsWith('http')) {
                favicon = new URL(favicon, window.location.origin).href;
            }
            
            return { title, description, favicon };
        });
        
        const screenshot = await page.screenshot({ fullPage: true });
        await browser.close();
        
        // 2. Analyser les couleurs
        const colorAnalysis = await analyzeColors(screenshot);
        
        // 3. Convertir le screenshot en base64 pour l'envoyer
        const screenshotBase64 = screenshot.toString('base64');
        
        return Response.json({
            ...colorAnalysis,
            screenshot: `data:image/png;base64,${screenshotBase64}`,
            siteMetadata,
            metadata: {
                url: url,
                theme: theme,
                timestamp: new Date().toISOString(),
                screenshotSize: screenshot.length
            }
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

// Fonction améliorée pour calculer la luminance perceptuelle
function getRelativeLuminance(r, g, b) {
    // Normaliser les valeurs RGB (0-1)
    const rs = r / 255;
    const gs = g / 255;
    const bs = b / 255;
    
    // Appliquer la correction gamma
    const rLin = rs <= 0.04045 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const gLin = gs <= 0.04045 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const bLin = bs <= 0.04045 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
    
    // Calculer la luminance relative selon les standards W3C
    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

// Fonction pour déterminer si une couleur est sombre ou claire
function isDarkColor(r, g, b) {
    const luminance = getRelativeLuminance(r, g, b);
    
    // Cas spécial pour les bleus vifs (économie d'énergie OLED)
    if (b > 200 && r < 120 && g < 120) {
        // Les bleus purs sont énergétiquement coûteux sur OLED
        return false; // Considérer comme "clair" pour l'efficacité énergétique
    }
    
    // Calculer saturation et valeur (HSV)
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const saturation = max === 0 ? 0 : (max - min) / max;
    const value = max;
    
    // Couleurs très saturées et vives → considérer comme claires
    if (saturation > 0.8 && value > 0.6) {
        return false;
    }
    
    // Sinon, utiliser la luminance standard
    return luminance < 0.15;
}

async function analyzeColors(imageBuffer) {
    const image = sharp(imageBuffer);
    const { data, info } = await image
        .raw()
        .toBuffer({ resolveWithObject: true });
    
    const colorMap = new Map();
    const totalPixels = info.width * info.height;
    let darkPixels = 0;
    let lightPixels = 0;
    
    // Analyser chaque pixel (avec échantillonnage pour les performances)
    const samplingRate = 12;
    
    for (let i = 0; i < data.length; i += samplingRate) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Utiliser la nouvelle fonction de détection
        if (isDarkColor(r, g, b)) {
            darkPixels++;
        } else {
            lightPixels++;
        }
        
        // Grouper les couleurs similaires pour les couleurs dominantes
        const colorKey = `${Math.floor(r/10)*10}-${Math.floor(g/10)*10}-${Math.floor(b/10)*10}`;
        colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }
    
    // Calculer les vraies pourcentages basées sur tous les pixels échantillonnés
    const totalSampledPixels = darkPixels + lightPixels;
    const darkPercentage = (darkPixels / totalSampledPixels) * 100;
    const lightPercentage = (lightPixels / totalSampledPixels) * 100;
    
    // Convertir les couleurs dominantes en pourcentages
    const colors = Array.from(colorMap.entries())
        .map(([color, count]) => {
            const [r, g, b] = color.split('-').map(Number);
            const luminance = getRelativeLuminance(r, g, b);
            
            return {
                rgb: { r, g, b },
                hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
                percentage: (count / totalSampledPixels) * 100,
                brightness: luminance * 255, // Pour compatibilité avec l'affichage
                luminance: luminance, // Vraie luminance perceptuelle
                isDark: isDarkColor(r, g, b)
            };
        })
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 20);
    
    return {
        dominantColors: colors,
        darkPercentage: darkPercentage,
        lightPercentage: lightPercentage,
        totalColors: colorMap.size
    };
}