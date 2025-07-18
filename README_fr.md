# Color Tools - OLED Energy Efficiency Analyzer

<div align="center">

**[🇺🇸 English](README.md)** | **🇫🇷 Français**

</div>

![Color Tools](./public/og.png)

## 🎯 Présentation

**Color Tools** est une suite d'outils web innovants conçus pour analyser et optimiser l'efficacité énergétique des interfaces web sur les écrans OLED. Ce projet, développé dans le cadre de mon mémoire de bachelor à la SAE Institute, explore l'impact significatif que peuvent avoir les choix de couleurs sur la consommation énergétique des appareils mobiles modernes.

### Pourquoi ce projet ?

Avec la démocratisation des écrans OLED dans les smartphones, tablettes et ordinateurs portables, la relation entre les couleurs affichées et la consommation d'énergie devient cruciale. Contrairement aux écrans LCD, les pixels OLED noirs ne consomment pratiquement aucune énergie, créant ainsi une opportunité d'optimisation énergétique par le design.

### À quoi ça sert ?

- **🔍 Website Analyzer** : Analyse en temps réel le ratio de couleurs sombres/claires de n'importe quel site web
- **⚡ Color Stresser** : Teste différentes couleurs et motifs pour mesurer leur impact énergétique
- **🔬 Algorithm Documentation** : Documentation complète de l'algorithme d'analyse des couleurs
- **🏆 Badge Generator** : Génère des badges dynamiques pour afficher le score d'efficacité énergétique

## 🛠️ Technologies & Librairies

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework React avec App Router
- **[React 19](https://react.dev/)** - Bibliothèque UI avec les dernières fonctionnalités
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utilitaire
- **[React Toastify](https://github.com/fkhadra/react-toastify)** - Notifications toast élégantes

### Backend & Analyse
- **[Puppeteer](https://pptr.dev/)** - Automation de navigateur pour captures d'écran
- **[@sparticuz/chromium](https://github.com/Sparticuz/chromium)** - Chromium optimisé pour déploiements serverless
- **[Sharp](https://sharp.pixelplumbing.com/)** - Traitement d'images haute performance

### Développement
- **[ESLint](https://eslint.org/)** - Linting JavaScript/React
- **[Next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)** - Optimisation automatique des polices (Geist)

## 🚀 Installation & Hébergement Local

### Prérequis
- Node.js 18+ 
- npm, yarn, pnpm ou bun

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/color-tester.git
cd color-tester
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configuration de l'environnement
Créer un fichier `.env.local` à la racine :
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Démarrer le serveur de développement
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Le projet sera accessible sur [http://localhost:3000](http://localhost:3000)

### 5. Backend (Important !)

⚠️ **Note importante** : Pour que l'analyse de sites web fonctionne, vous devez également démarrer le backend séparément.

👉 **[Lien vers le backend Color Tools API](https://github.com/thboehi/color-tools-backend)**

Le backend gère l'analyse des sites web via Puppeteer et doit être démarré sur le port 3001 pour que l'application frontend fonctionne correctement.

### Scripts disponibles
```bash
npm run dev      # Démarrage en mode développement avec Turbopack
npm run build    # Build de production
npm run start    # Démarrage du serveur de production
npm run lint     # Vérification ESLint
```

## 🎨 Fonctionnalités Principales

### Website Analyzer
- Analyse automatique du ratio couleurs sombres/claires
- Capture d'écran en temps réel
- Calcul de score d'efficacité énergétique OLED
- Historique des analyses
- Export des résultats

### Color Stresser
- Test de différents motifs et couleurs
- Calculateur de coût énergétique
- Simulation de consommation en temps réel
- Mode comparaison
- Guide d'utilisation intégré

### Badge Generator
- Génération de badges SVG dynamiques
- Formats multiples (HTML, Markdown, URL directe)
- Intégration facile sur sites web et README
- Cache optimisé pour les performances

### Documentation Algorithme
- Explication détaillée des calculs de luminance
- Standards W3C et sRGB
- Références scientifiques
- Accès au mémoire de recherche (PDF intégré)

## 🙏 Remerciements

- **SAE Institute** pour l'encadrement et les ressources académiques
- **Communauté open source** pour les bibliothèques exceptionnelles utilisées
- **W3C** pour les standards de luminance et d'accessibilité
- **Équipe Vercel** pour Next.js et l'écosystème de déploiement
- **Contributeurs Puppeteer & Sharp** pour les outils d'analyse d'images
- **Tous les testeurs** qui ont contribué à améliorer l'expérience utilisateur

Un merci particulier à la communauté de développeurs qui s'intéresse à l'optimisation énergétique et au développement durable dans le web.

## 🎓 Conclusion

Color Tools représente une approche innovante pour sensibiliser et outiller les développeurs web dans la création d'interfaces plus respectueuses de l'environnement. En combinant analyse technique rigoureuse et interface utilisateur intuitive, ce projet démontre qu'il est possible de concilier performance, esthétique et efficacité énergétique.

L'impact environnemental du numérique étant de plus en plus préoccupant, des outils comme Color Tools contribuent à démocratiser les bonnes pratiques d'éco-conception web. Chaque pixel compte, et ensemble, nous pouvons faire une différence significative.

---

**🌱 Pour un web plus vert, un pixel à la fois.**

[![OLED Energy Efficiency](https://ct.thbo.ch/api/badge?website=https://ct.thbo.ch&score=85)](https://ct.thbo.ch)

---

📧 **Contact** : [thomas@thbo.ch](mailto:thoma@thbo.ch)  
🌐 **Portfolio** : [thbo.ch](https://thbo.ch)  
🎓 **Institution** : SAE Institute Geneva