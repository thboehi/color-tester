export default function ColorDetectionSection() {
    return (
        <section className="animate-fadeInUp">
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    🎨 Color Detection & Classification
                </h2>

                <div className="space-y-8">
                    <p className="text-gray-300 text-lg">
                        This algorithm employs sophisticated color detection that goes beyond simple luminance, 
                        incorporating saturation and value analysis for OLED-optimized classification.
                    </p>

                    <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">🔄 Enhanced Detection Logic</h3>
                        
                        <div className="space-y-4">
                            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                                <h4 className="font-semibold text-red-300 mb-2">🔵 Blue Light Special Case</h4>
                                <div className="bg-black/50 p-3 rounded font-mono text-sm">
                                    <div className="text-green-400">// Pure blue colors were missed by luminance-only detection</div>
                                    <div className="text-white">if (b &gt; 200 && r &lt; 120 && g &lt; 120) return false;</div>
                                </div>
                                <p className="text-gray-300 text-sm mt-2">
                                    Pure blue colors have relatively low calculated luminance but are visually bright. 
                                    This special case ensures they're correctly classified as "light" colors.
                                </p>
                            </div>

                            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                                <h4 className="font-semibold text-green-300 mb-2">🌈 High Saturation Detection</h4>
                                <div className="bg-black/50 p-3 rounded font-mono text-sm">
                                    <div className="text-green-400">// Convert to HSV color space</div>
                                    <div className="text-white">const saturation = max === 0 ? 0 : (max - min) / max;</div>
                                    <div className="text-white">const value = max;</div>
                                    <div className="text-white">if (saturation &gt; 0.8 && value &gt; 0.6) return false;</div>
                                </div>
                                <p className="text-gray-300 text-sm mt-2">
                                    Highly saturated, bright colors are visually prominent and classified as "light" 
                                    regardless of their calculated luminance value.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-6 text-center">
                            <div className="text-3xl mb-3">🔵</div>
                            <h4 className="font-semibold text-blue-300 mb-2">Blue Detection</h4>
                            <p className="text-gray-300 text-sm">
                                Catches pure blues that have low calculated luminance but high visual brightness
                            </p>
                        </div>

                        <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-6 text-center">
                            <div className="text-3xl mb-3">🌈</div>
                            <h4 className="font-semibold text-purple-300 mb-2">Saturation Analysis</h4>
                            <p className="text-gray-300 text-sm">
                                HSV color space analysis for vibrant color detection
                            </p>
                        </div>

                        <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6 text-center">
                            <div className="text-3xl mb-3">💡</div>
                            <h4 className="font-semibold text-green-300 mb-2">Luminance Check</h4>
                            <p className="text-gray-300 text-sm">
                                Final validation using W3C standard luminance calculation
                            </p>
                        </div>
                    </div>

                    <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                        <h4 className="font-semibold text-yellow-300 mb-2">🔬 Color Science Insight</h4>
                        <p className="text-gray-300">
                            This algorithm prioritizes perceptual accuracy over mathematical purity. Pure mathematical 
                            luminance doesn't always match visual perception, especially for saturated colors like pure blue. 
                            These adjustments ensure the classification matches human color perception.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}