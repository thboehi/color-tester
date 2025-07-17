export default function LuminanceSection() {
    return (
        <section className="animate-fadeInUp">
            <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    💡 Luminance Calculation
                </h2>

                <div className="space-y-8">
                    <p className="text-gray-300 text-lg">
                        I use the W3C WCAG 2.1 standard for calculating relative luminance, which accounts 
                        for human visual perception and gamma correction.
                    </p>

                    <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">📐 Mathematical Formula</h3>
                        
                        <div className="bg-black/50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            <div className="text-green-400 mb-2">// Step 1: Normalize RGB values (0-1)</div>
                            <div className="text-white">const rs = r / 255;</div>
                            <div className="text-white">const gs = g / 255;</div>
                            <div className="text-white">const bs = b / 255;</div>
                            
                            <div className="text-green-400 mt-4 mb-2">// Step 2: Apply gamma correction</div>
                            <div className="text-white">const rLin = rs ≤ 0.04045 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);</div>
                            <div className="text-white">const gLin = gs ≤ 0.04045 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);</div>
                            <div className="text-white">const bLin = bs ≤ 0.04045 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);</div>
                            
                            <div className="text-green-400 mt-4 mb-2">// Step 3: Calculate relative luminance</div>
                            <div className="text-yellow-300">luminance = 0.2126 × rLin + 0.7152 × gLin + 0.0722 × bLin;</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
                            <h4 className="font-semibold text-blue-300 mb-3">🔍 Why Gamma Correction?</h4>
                            <p className="text-gray-300 text-sm">
                                Human vision responds non-linearly to light intensity. Gamma correction 
                                converts sRGB values to linear light values, ensuring accurate perceptual 
                                luminance calculations.
                            </p>
                        </div>

                        <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-6">
                            <h4 className="font-semibold text-purple-300 mb-3">📊 Coefficient Rationale</h4>
                            <p className="text-gray-300 text-sm">
                                The coefficients (0.2126, 0.7152, 0.0722) reflect human eye sensitivity: 
                                we're most sensitive to green, moderately to red, and least to blue light.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-6">
                        <h4 className="font-semibold text-white mb-3">🎯 Threshold Selection</h4>
                        <p className="text-gray-300 mb-4">
                            Colors are classified as "dark" when relative luminance ≤ 0.15, corresponding 
                            to approximately 38% brightness on most displays.
                        </p>
                        <div className="bg-black/30 p-3 rounded text-sm">
                            <span className="text-cyan-400">isDark = </span>
                            <span className="text-white">luminance ≤ 0.15</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}