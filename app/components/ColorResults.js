"use client";

import BadgeGenerator from './BadgeGenerator';

export default function ColorResults({ results }) {
    // Vérifications défensives
    if (!results) return null;

    const { 
        dominantColors = [], 
        darkPercentage = 0, 
        lightPercentage = 0, 
        screenshot, 
        metadata = {}, 
        totalColors = 0,
        siteMetadata = {}
    } = results;
    
    // Fonction pour déterminer l'efficacité énergétique
    const getEnergyEfficiency = () => {
        if (darkPercentage >= 70) {
            return {
                level: 'excellent',
                color: 'text-green-400',
                icon: '✓',
                message: 'Excellent for OLED screens - Very energy efficient'
            };
        } else if (darkPercentage >= 50) {
            return {
                level: 'good',
                color: 'text-yellow-400',
                icon: '⚡',
                message: 'Good energy efficiency on OLED screens'
            };
        } else if (darkPercentage >= 30) {
            return {
                level: 'moderate',
                color: 'text-orange-400',
                icon: '⚖️',
                message: 'Moderate energy consumption on OLED screens'
            };
        } else {
            return {
                level: 'poor',
                color: 'text-red-400',
                icon: '⚠',
                message: 'High energy consumption on OLED screens'
            };
        }
    };

    const energyInfo = getEnergyEfficiency();
    
    return (
        <div className="space-y-8 animate-fadeInUp">
            {/* Recommandations énergétiques améliorées */}
            <div className="bg-white/0 backdrop-blur-sm border border-gray-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-400 mb-4 text-center">
                    Energy Efficiency Score
                </h3>
                <div className="text-center space-y-4">
                    {/* Score visuel */}
                    <div className="flex items-center justify-center space-x-4">
                        <div className={`text-3xl ${energyInfo.color}`}>
                            {energyInfo.icon}
                        </div>
                        <div className={`text-2xl font-bold ${energyInfo.color}`}>
                            {darkPercentage.toFixed(0)}%
                        </div>
                    </div>
                    
                    {/* Message */}
                    <div className={`${energyInfo.color} text-sm font-medium`}>
                        {energyInfo.message}
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                        <div 
                            className={`h-3 rounded-full transition-all duration-1000 ${
                                energyInfo.level === 'excellent' ? 'bg-green-400' :
                                energyInfo.level === 'good' ? 'bg-yellow-400' :
                                energyInfo.level === 'moderate' ? 'bg-orange-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${darkPercentage}%` }}
                        ></div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                        Dark pixels consume significantly less energy on OLED displays
                    </div>
                </div>
            </div>

            {/* Badge Generator - REPOSITIONNÉ EN HAUT avec design amélioré */}
            <div className="relative">
                {/* Effet de brillance en arrière-plan */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-lg border-2 border-gray-600/50 rounded-2xl p-6 shadow-2xl">
                    {/* Header avec badge premium */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                                ✨ NEW
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                                Share Your Score
                            </h3>
                        </div>
                        <div className="text-3xl animate-pulse">🏆</div>
                    </div>

                    {/* Call to action principal */}
                    <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-green-900/30 rounded-xl border border-blue-500/30">
                        <p className="text-lg font-semibold text-white mb-2">
                            🚀 Showcase your energy-efficient website!
                        </p>
                        <p className="text-gray-300 text-sm">
                            Get a beautiful badge that links back to Color Tools and drives more traffic to your site
                        </p>
                    </div>

                    <BadgeGenerator results={results} />
                </div>
            </div>
            
            {/* Ratio Dark/Light */}
            <div className="bg-white/0 backdrop-blur-sm border border-gray-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-400 mb-4 text-center">
                    Dark vs Light Ratio
                </h3>
                <div className="flex h-12 rounded-full overflow-hidden border border-gray-400/20">
                    <div 
                        className="bg-gray-900 flex items-center justify-center text-white text-sm font-medium transition-all duration-500"
                        style={{ width: `${darkPercentage}%` }}
                    >
                        {darkPercentage > 10 && `${darkPercentage.toFixed(1)}%`}
                    </div>
                    <div 
                        className="bg-gray-100 flex items-center justify-center text-gray-900 text-sm font-medium transition-all duration-500"
                        style={{ width: `${lightPercentage}%` }}
                    >
                        {lightPercentage > 10 && `${lightPercentage.toFixed(1)}%`}
                    </div>
                </div>
                <div className="flex justify-between mt-3 text-xs text-gray-500">
                    <span>{darkPercentage.toFixed(1)}% Dark Colors</span>
                    <span>{lightPercentage.toFixed(1)}% Light Colors</span>
                </div>
            </div>

            {/* Screenshot du site */}
            {screenshot && (
                <div className="bg-white/0 backdrop-blur-sm border border-gray-400/20 rounded-2xl p-6 flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-gray-400 mb-4 text-center">
                        Website Screenshot
                    </h3>
                    <div className="w-fit relative overflow-hidden rounded-xl border border-gray-400/20">
                        <img 
                            src={screenshot} 
                            alt="Website screenshot" 
                            className="w-full h-auto max-h-96 object-contain bg-black"
                        />
                    </div>
                    {metadata && (
                        <div className="mt-3 text-xs text-gray-500 text-center">
                            Captured: {new Date(metadata.timestamp).toLocaleString()} • 
                            Size: {(metadata.screenshotSize / 1024).toFixed(0)} KB
                        </div>
                    )}
                </div>
            )}
            
            {/* Couleurs dominantes */}
            <div className="bg-white/0 backdrop-blur-sm border border-gray-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-400 mb-6 text-center">
                    Dominant Colors
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dominantColors.slice(0, 8).map((color, index) => (
                        <div key={index} className="group">
                            <div 
                                className="w-full h-20 rounded-xl mb-3 border border-gray-400/20 transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                style={{ backgroundColor: color.hex }}
                                title={`${color.hex} - ${color.percentage.toFixed(1)}%`}
                            ></div>
                            <div className="text-center space-y-1">
                                <div className="text-xs text-gray-400 font-mono">
                                    {color.hex}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {color.percentage.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Statistiques supplémentaires */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/0 backdrop-blur-sm border border-gray-400/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-400">
                        {totalColors || dominantColors.length}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Unique Colors
                    </div>
                </div>
                <div className="bg-white/0 backdrop-blur-sm border border-gray-400/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-400">
                        {dominantColors[0]?.percentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Most Dominant
                    </div>
                </div>
                <div className="bg-white/0 backdrop-blur-sm border border-gray-400/20 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-400">
                        {darkPercentage > lightPercentage ? 'Dark' : 'Light'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Theme Detected
                    </div>
                </div>
            </div>
        </div>
    );
}