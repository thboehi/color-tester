export default function OledOptimizationSection() {
    return (
        <section className="animate-fadeInUp">
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    ⚡ OLED-Specific Optimizations
                </h2>

                <div className="space-y-8">
                    <p className="text-gray-300 text-lg">
                        OLED displays have unique energy characteristics that differ fundamentally from LCD technology. 
                        This algorithm is specifically optimized for these properties.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">🔋 OLED vs LCD Energy</h3>
                            <div className="space-y-4">
                                <div className="bg-green-900/20 border border-green-600/30 rounded p-4">
                                    <h4 className="font-semibold text-green-300 mb-2">✅ OLED Advantages</h4>
                                    <ul className="text-gray-300 text-sm space-y-1">
                                        <li>• Black pixels consume ~0 power</li>
                                        <li>• Per-pixel power control</li>
                                        <li>• Linear power-to-brightness relationship</li>
                                        <li>• No backlight energy waste</li>
                                    </ul>
                                </div>
                                <div className="bg-red-900/20 border border-red-600/30 rounded p-4">
                                    <h4 className="font-semibold text-red-300 mb-2">⚠️ OLED Challenges</h4>
                                    <ul className="text-gray-300 text-sm space-y-1">
                                        <li>• Bright colors very energy-intensive</li>
                                        <li>• Saturated colors = high consumption</li>
                                        <li>• White can use 3x more than dark themes</li>
                                        <li>• Any bright pixel consumes proportional power</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">📊 Energy Efficiency Scale</h3>
                            <div className="space-y-3">
                                <div className="bg-green-600/20 p-3 rounded flex justify-between items-center">
                                    <span className="text-green-300 font-semibold">Excellent (70%+ dark)</span>
                                    <span className="text-green-400">⚡⚡⚡</span>
                                </div>
                                <div className="bg-yellow-600/20 p-3 rounded flex justify-between items-center">
                                    <span className="text-yellow-300 font-semibold">Good (50-70% dark)</span>
                                    <span className="text-yellow-400">⚡⚡</span>
                                </div>
                                <div className="bg-orange-600/20 p-3 rounded flex justify-between items-center">
                                    <span className="text-orange-300 font-semibold">Moderate (30-50% dark)</span>
                                    <span className="text-orange-400">⚡</span>
                                </div>
                                <div className="bg-red-600/20 p-3 rounded flex justify-between items-center">
                                    <span className="text-red-300 font-semibold">Poor (&lt;30% dark)</span>
                                    <span className="text-red-400">💥</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">🎯 Algorithm Adaptations</h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-blue-300 mb-3">🔵 Blue Detection Fix</h4>
                                <div className="bg-black/50 p-3 rounded font-mono text-sm mb-3">
                                    <div className="text-white">if (b &gt; 200 && r &lt; 120 && g &lt; 120) &#123;</div>
                                    <div className="text-white">  return false; // Visually bright</div>
                                    <div className="text-white">&#125;</div>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    Pure blues have low calculated luminance but appear bright to human vision. 
                                    This ensures they're correctly classified as "light" colors.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-purple-300 mb-3">🌈 Saturation Impact</h4>
                                <div className="bg-black/50 p-3 rounded font-mono text-sm mb-3">
                                    <div className="text-white">if (saturation &gt; 0.8 && value &gt; 0.6) &#123;</div>
                                    <div className="text-white">  return false; // Vivid colors</div>
                                    <div className="text-white">&#125;</div>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    Highly saturated colors are visually prominent and require multiple subpixels 
                                    to be active, increasing overall power consumption.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-900/20 border-l-4 border-blue-400 p-6 rounded-r-lg">
                        <h4 className="font-semibold text-blue-300 mb-2">📱 Real-World Impact</h4>
                        <p className="text-gray-300 mb-4">
                            Studies show that switching from light to dark themes can improve OLED device battery 
                            life by 20-40% during typical usage patterns. This algorithm helps quantify this potential 
                            energy saving for any website.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-green-900/20 p-3 rounded">
                                <div className="font-semibold text-green-300">Dark Theme</div>
                                <div className="text-gray-300">20-60% energy savings</div>
                            </div>
                            <div className="bg-red-900/20 p-3 rounded">
                                <div className="font-semibold text-red-300">Light Theme</div>
                                <div className="text-gray-300">Baseline consumption</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}