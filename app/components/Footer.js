"use client"

export default function Footer() {
    return (
        <footer className="w-full mt-auto border-t border-gray-800/50 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left section - Project info */}
                    <div className="text-center md:text-left space-y-2 opacity-70 md:opacity-50 md:hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm text-gray-300 font-medium">
                            Color Tools for OLED Optimization
                        </p>
                        <p className="text-xs text-gray-400 max-w-md">
                            Research project studying energy consumption patterns in web interfaces for OLED displays
                        </p>
                    </div>

                    {/* Center section - Links */}
                    <div className="flex items-center gap-6 text-xs">
                        <a
                            href="/documentation"
                            className="text-gray-400 hover:text-blue-300 transition-colors duration-200 hover:underline"
                        >
                            📚 Research
                        </a>
                        <a
                            href="https://github.com/thboehi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-300 transition-colors duration-200 hover:underline"
                        >
                            🐙 GitHub
                        </a>
                        <a
                            href="https://paypal.me/Boehi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-green-300 transition-colors duration-200 hover:underline"
                        >
                            💚 Support
                        </a>
                    </div>

                    {/* Right section - Credits */}
                    <div className="text-center md:text-right space-y-1 opacity-70 md:opacity-50 md:hover:opacity-100 transition-opacity duration-300">
                        <div className="text-xs text-gray-400 flex items-center justify-center md:justify-end gap-2">
                            <span>Created by</span>
                            <a
                                href="https://thbo.ch"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium"
                            >
                                Thomas Boehi
                            </a>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center justify-center md:justify-end gap-2">
                            
                            <span>© {new Date().getFullYear()}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom separator */}
                <div className="mt-6 pt-4 border-t border-gray-800/30">
                    <p className="text-center text-xs text-gray-500 opacity-60">
                        Bachelor thesis research • Energy-efficient web design • OLED display optimization
                    </p>
                </div>
            </div>
        </footer>
    );
}