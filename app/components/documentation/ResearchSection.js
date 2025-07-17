"use client";
import { useState, useEffect } from 'react';

export default function ResearchSection() {
    const [showMemoire, setShowMemoire] = useState(false);
    const [memoireLastModified, setMemoireLastModified] = useState(null);

    useEffect(() => {
        // Fetch last modified date
        fetch('/memoire_boehiT.pdf', { method: 'HEAD' })
            .then(response => {
                const lastModified = response.headers.get('last-modified');
                if (lastModified) {
                    setMemoireLastModified(new Date(lastModified).toLocaleDateString('fr-FR'));
                }
            })
            .catch(() => {
                // Fallback if we can't get the date
                setMemoireLastModified('En cours');
            });
    }, []);

    return (
        <section className="animate-fadeInUp">
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    📚 Research & References
                </h2>

                <div className="space-y-8">
                    <p className="text-gray-300 text-lg">
                        This algorithm is based on established research in color science, display technology, 
                        and energy efficiency. Here are the key sources and standards that inform this approach.
                    </p>

                    {/* Mémoire Section - Featured */}
                    <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-600/50 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-blue-300 mb-2">🎓 Master's Thesis (2025)</h3>
                                <h4 className="text-lg font-medium text-white mb-2">
                                    L'utilisation de couleurs sombres dans l'interface des sites web ou applications permet-elle une réduction significative de la consommation énergétique des écrans ?
                                </h4>
                                <p className="text-gray-300 text-sm mb-3">
                                    This tool is directly inspired by and implements concepts from this research thesis, 
                                    which explores the energy impact of dark color usage in web interfaces.
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span>📅 Dernière modification: {memoireLastModified || 'Chargement...'}</span>
                                    <span>🎯 En cours de rédaction</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowMemoire(!showMemoire)}
                                className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-colors text-sm"
                            >
                                {showMemoire ? '📖 Masquer le mémoire' : '📖 Lire le mémoire'}
                            </button>
                            <a
                                href="/memoire_boehiT.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-colors text-sm"
                            >
                                📄 Ouvrir dans un nouvel onglet
                            </a>
                        </div>

                        {showMemoire && (
                            <div className="mt-6 border border-gray-600/30 rounded-lg overflow-hidden">
                                <div className="bg-gray-800/50 p-3 flex items-center justify-between">
                                    <span className="text-gray-300 text-sm">Mémoire - Version PDF intégrée</span>
                                    <button
                                        onClick={() => setShowMemoire(false)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <iframe
                                    src="/memoire_boehiT.pdf"
                                    className="w-full h-96 bg-white"
                                    title="Mémoire - L'utilisation de couleurs sombres dans l'interface des sites web"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">🏛️ Standards & Specifications</h3>
                            <div className="space-y-4">
                                <div className="bg-blue-900/20 border border-blue-600/30 rounded p-4">
                                    <h4 className="font-semibold text-blue-300 mb-2">W3C WCAG 2.1</h4>
                                    <p className="text-gray-300 text-sm mb-2">
                                        Web Content Accessibility Guidelines - Relative Luminance calculation standard
                                    </p>
                                    <a href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" 
                                       className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
                                       target="_blank" rel="noopener noreferrer">
                                        → W3C Contrast Guidelines
                                    </a>
                                </div>
                                
                                <div className="bg-green-900/20 border border-green-600/30 rounded p-4">
                                    <h4 className="font-semibold text-green-300 mb-2">sRGB Color Space</h4>
                                    <p className="text-gray-300 text-sm mb-2">
                                        Standard RGB color space with gamma correction (IEC 61966-2-1)
                                    </p>
                                    <a href="https://www.color.org/srgb.pdf" 
                                       className="text-green-400 hover:text-green-300 text-xs transition-colors"
                                       target="_blank" rel="noopener noreferrer">
                                        → sRGB Specification
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">🔬 Academic Research</h3>
                            <div className="space-y-4">
                                <div className="bg-purple-900/20 border border-purple-600/30 rounded p-4">
                                    <h4 className="font-semibold text-purple-300 mb-2">OLED Power Consumption</h4>
                                    <p className="text-gray-300 text-sm mb-2">
                                        "Understanding OLED Display Power Draw" - Analysis of per-pixel power consumption patterns
                                    </p>
                                    <span className="text-purple-400 text-xs">
                                        Dong et al., IEEE 2019
                                    </span>
                                </div>
                                
                                <div className="bg-orange-900/20 border border-orange-600/30 rounded p-4">
                                    <h4 className="font-semibold text-orange-300 mb-2">Dark Mode Energy Impact</h4>
                                    <p className="text-gray-300 text-sm mb-2">
                                        "Dark Mode vs Light Mode: Which is Better for Battery Life?" - Comprehensive mobile energy study
                                    </p>
                                    <span className="text-orange-400 text-xs">
                                        Purdue University, 2021
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">📊 Key Research Findings</h3>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-blue-900/20 p-4 rounded text-center">
                                <div className="text-3xl mb-2">📱</div>
                                <div className="font-semibold text-blue-300 mb-2">Mobile Impact</div>
                                <div className="text-gray-300 text-sm">
                                    Dark themes can extend battery life by 20-40% on OLED smartphones during typical usage
                                </div>
                            </div>
                            
                            <div className="bg-green-900/20 p-4 rounded text-center">
                                <div className="text-3xl mb-2">🌐</div>
                                <div className="font-semibold text-green-300 mb-2">Web Interface Impact</div>
                                <div className="text-gray-300 text-sm">
                                    Research shows significant energy reduction potential through strategic dark color usage in web design
                                </div>
                            </div>
                            
                            <div className="bg-purple-900/20 p-4 rounded text-center">
                                <div className="text-3xl mb-2">⚫</div>
                                <div className="font-semibold text-purple-300 mb-2">True Black</div>
                                <div className="text-gray-300 text-sm">
                                    OLED pixels displaying true black (RGB: 0,0,0) consume virtually zero power unlike LCD backlights
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">🛠️ Implementation Details</h3>
                        
                        <div className="space-y-4">
                            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded p-4">
                                <h4 className="font-semibold text-yellow-300 mb-2">Color Science Libraries</h4>
                                <ul className="text-gray-300 text-sm space-y-1">
                                    <li>• Sharp.js for high-performance image processing</li>
                                    <li>• Custom luminance calculations following W3C standards</li>
                                    <li>• HSV color space conversion for saturation analysis</li>
                                    <li>• Statistical sampling with confidence interval validation</li>
                                </ul>
                            </div>
                            
                            <div className="bg-cyan-900/20 border border-cyan-600/30 rounded p-4">
                                <h4 className="font-semibold text-cyan-300 mb-2">Browser Technologies</h4>
                                <ul className="text-gray-300 text-sm space-y-1">
                                    <li>• Puppeteer for automated screenshot capture</li>
                                    <li>• CSS media queries for theme simulation</li>
                                    <li>• Full-page rendering with dynamic content loading</li>
                                    <li>• Real-time color analysis pipeline</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-900/20 border-l-4 border-green-400 p-6 rounded-r-lg">
                        <h4 className="font-semibold text-green-300 mb-2">🌱 Environmental Impact</h4>
                        <p className="text-gray-300">
                            By promoting energy-efficient web design through color analysis, this tool contributes to reducing 
                            global energy consumption. With billions of OLED devices worldwide, even small optimizations 
                            in web design can have significant cumulative environmental benefits.
                        </p>
                    </div>

                    <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-6">
                        <h4 className="font-semibold text-white mb-4">📖 Additional References</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h5 className="font-semibold text-gray-300 mb-2">Color Science</h5>
                                <ul className="space-y-1 text-gray-400">
                                    <li>• Hunt, R.W.G. "The Reproduction of Colour" (6th Edition)</li>
                                    <li>• Fairchild, M.D. "Color Appearance Models" (3rd Edition)</li>
                                    <li>• CIE Technical Report on Colorimetry Standards</li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-semibold text-gray-300 mb-2">Display Technology</h5>
                                <ul className="space-y-1 text-gray-400">
                                    <li>• OLED Industry Standards (SEMI International)</li>
                                    <li>• IEEE Standards for Display Measurements</li>
                                    <li>• Energy Star Display Efficiency Guidelines</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}