"use client";
import Image from "next/image";
import DynamicButton from "./components/DynamicButton";
import Footer from "./components/Footer";

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Arrière-plan animé sophistiqué */}
      <div className="absolute inset-0">
        {/* Gradient de base */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        
        {/* Orbes animés */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Lignes subtiles */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <main className="flex-1 flex flex-col gap-8 items-center justify-center font-[family-name:var(--font-geist-mono)] px-6 py-16 relative z-10">
        {/* Header avec effet glassmorphism */}
        <div className="text-center space-y-6 mb-8">
          {/* Badge premium */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            OLED Energy Efficiency Tools
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Color Tools
          </h1>
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
              <Image 
                src="/colors-tools-icon.svg" 
                alt="Logo" 
                width={120} 
                height={120} 
                className="relative drop-shadow-2xl" 
              />
            </div>
          </div>
        </div>

        {/* Description avec glassmorphism */}
        <div className="max-w-4xl text-center space-y-4 mb-12">
          <p className="text-gray-300 text-lg leading-relaxed">
            Created by <a href="https://thbo.ch/" className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30 hover:decoration-blue-300">Thomas</a>
          </p>
          <p className="text-gray-400 text-base leading-relaxed bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            Explore cutting-edge tools to analyze and optimize colors on your website. 
            Perfect for developers and designers looking to create energy-efficient, 
            beautiful interfaces for OLED displays.
          </p>
        </div>
        
        {/* Cards améliorées avec hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          <div className="group relative">
            {/* Effet de lueur au hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105">
              <a
                href="/website-analyzer"
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="text-4xl mb-2">🔍</div>
                <h3 className="text-xl font-semibold text-white">Website Analyzer</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Analyze the ratio between dark and light colors on any website to optimize for OLED energy efficiency
                </p>
                
                {/* Indicateur interactif */}
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                </div>
              </a>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105">
              <a
                href="/stresser"
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="text-xl font-semibold text-white">Color Stresser</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Test different colors and patterns to see their energy consumption impact on OLED displays
                </p>
                
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                </div>
              </a>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105">
              <a
                href="/documentation"
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="text-4xl mb-2">🔬</div>
                <h3 className="text-xl font-semibold text-white">Algorithm Documentation</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Deep dive into the algorithm behind color analysis, luminance calculations, and OLED optimizations
                </p>
                
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Support button amélioré */}
        <div className="mt-12">
          <DynamicButton
            title="Support"
            description="Help me improve and maintain these tools"
            href={'https://paypal.me/Boehi'}
            variant="secondary"
            openInNewTab={true}
          />
        </div>

        {/* Dots décoratifs */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse delay-200"></div>
          <div className="w-2 h-2 bg-white/20 rounded-full animate-pulse delay-400"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}