"use client"

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 w-full flex flex-col items-center justify-center py-4 bg-gradient-to-t from-black/20 via-transparent to-transparent backdrop-blur-sm z-40">
            <div className="text-center space-y-1 opacity-10 hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs text-gray-400 max-w-md mx-auto px-4">
                    This app was made for my Bachelor to test the energy consumption of different types of screen.
                </p>
                <div className="text-xs text-gray-500 flex items-center justify-center gap-2">
                    <span>Made by</span>
                    <a
                        href="https://thbo.ch"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                    >
                        thbo
                    </a>
                    <span>•</span>
                    <span>© {new Date().getFullYear()}</span>
                </div>
            </div>
        </footer>
    );
}