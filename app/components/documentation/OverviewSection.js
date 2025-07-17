export default function OverviewSection() {
    return (
        <section className="animate-fadeInUp">
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    🔬 Algorithm Overview
                </h2>
                
                <div className="prose prose-invert max-w-none space-y-6">
                    <p className="text-gray-300 text-lg leading-relaxed">
                        This algorithm analyzes the color composition of websites to determine their energy efficiency 
                        on OLED displays. It combines advanced color science, perceptual luminance calculations, 
                        and OLED-specific optimizations to provide accurate energy consumption estimates.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mt-8">
                        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-blue-300 mb-4">🎯 Key Features</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>• W3C WCAG 2.1 compliant luminance calculation</li>
                                <li>• OLED-specific color analysis</li>
                                <li>• Perceptual color grouping</li>
                                <li>• Intelligent pixel sampling</li>
                                <li>• Real-time screenshot analysis</li>
                            </ul>
                        </div>

                        <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-green-300 mb-4">📈 Process Flow</h3>
                            <ol className="space-y-2 text-gray-300">
                                <li>1. Capture full-page screenshot</li>
                                <li>2. Sample pixels with intelligent spacing</li>
                                <li>3. Calculate perceptual luminance</li>
                                <li>4. Apply OLED-specific detection</li>
                                <li>5. Group and analyze dominant colors</li>
                                <li>6. Generate energy efficiency metrics</li>
                            </ol>
                        </div>
                    </div>

                    <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r-lg mt-8">
                        <h4 className="font-semibold text-yellow-300 mb-2">⚡ OLED Energy Efficiency</h4>
                        <p className="text-gray-300">
                            Unlike LCD displays that use a constant backlight, OLED pixels emit their own light. 
                            Dark pixels consume significantly less power, making color composition analysis crucial 
                            for energy optimization.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}