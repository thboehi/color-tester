import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const website = searchParams.get('website') || 'Unknown Website';
    const score = parseInt(searchParams.get('score')) || 0;
    
    // Nettoyer l'URL pour l'affichage
    const cleanUrl = website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Définir la couleur et le message selon le score
    let bgColor, textColor, message, emoji;
    if (score >= 70) {
        bgColor = '#10B981'; // green-500
        textColor = '#FFFFFF';
        message = 'Eco-Efficient';
        emoji = '🌱';
    } else if (score >= 50) {
        bgColor = '#F59E0B'; // yellow-500
        textColor = '#000000';
        message = 'Moderately Efficient';
        emoji = '⚡';
    } else {
        bgColor = '#EF4444'; // red-500
        textColor = '#FFFFFF';
        message = 'Needs Optimization';
        emoji = '⚠️';
    }

    // URL complète vers le logo (nécessaire pour l'intégration externe)
    const logoUrl = `https://ct.thbo.ch/colors-tools-icon.svg`;

    const svg = `
        <svg width="320" height="120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${bgColor};stop-opacity:0.8" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/>
                </filter>
            </defs>
            
            <!-- Background -->
            <rect width="320" height="120" rx="12" fill="url(#bg)" filter="url(#shadow)"/>
            
            <!-- Dark overlay for contrast -->
            <rect width="320" height="120" rx="12" fill="rgba(0,0,0,0.1)"/>
            
            <!-- Top section -->
            <text x="16" y="25" font-family="ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace" font-size="11" font-weight="600" fill="${textColor}" opacity="0.9">
                ${cleanUrl}
            </text>
            
            <!-- Main message -->
            <text x="16" y="48" font-family="ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace" font-size="16" font-weight="bold" fill="${textColor}">
                ${emoji} ${message}
            </text>
            
            <!-- Score -->
            <text x="16" y="73" font-family="ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace" font-size="24" font-weight="bold" fill="${textColor}">
                ${score}% Dark Colors
            </text>
            
            <!-- Attribution -->
            <text x="16" y="93" font-family="ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace" font-size="9" font-weight="500" fill="${textColor}" opacity="0.8">
                Analyzed by Color Tools
            </text>
            
            <!-- Logo externe -->
            <image x="275" y="40" width="30" height="30" href="${logoUrl}" opacity="0.9"/>
            
            <!-- Lien vers le site -->
            <text x="16" y="105" font-family="ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace" font-size="8" font-weight="400" fill="${textColor}" opacity="0.6">
                ct.thbo.ch
            </text>
        </svg>
    `;

    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=3600',
            'Access-Control-Allow-Origin': '*', // Important pour l'intégration externe
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}