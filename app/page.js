"use client";
import Image from "next/image";
import DynamicButton from "./components/DynamicButton";
import Footer from "./components/Footer";

export default function Home() {

  return (
    <div className={`flex relative flex-col items-center justify-center min-h-screen bg-black`}>
      <main className={`flex flex-col gap-6 items-center justify-center font-[family-name:var(--font-geist-mono)] transition-opacity duration-300 py-16 pb-32`}>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-200 text-center">
          Color Tools
        </h1>
        <Image src="/colors-tools-icon.svg" alt="Logo" width={100} height={100} className="mb-0" />
        
        {/* By thbo */}
        <p className="text-gray-400 text-center max-w-2xl mb-8">
          Created by <a href="https://thbo.ch/" className="text-blue-500 hover:underline">Thomas</a>
        </p>
        <p className="text-gray-400 text-center max-w-2xl mb-8">
          Explore my tools to analyze and stress test colors on your website. Perfect for developers and designers looking to optimize their color schemes.
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 my-8">
          <div className="group flex flex-col items-center text-center max-w-xs">
            <a
              href="/website-analyzer"
              className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all duration-300 text-gray-500 hover:scale-105 active:scale-95 mb-3"
            >
              🔍 Website Analyzer
            </a>
            <p className="text-gray-500 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150 hidden md:block">
              Analyze the ratio between dark and light colors on any website to optimize for OLED energy efficiency
            </p>
          </div>
          
          <div className="group flex flex-col items-center text-center max-w-xs">
            <a
              href="/stresser"
              className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all duration-300 text-gray-500 hover:scale-105 active:scale-95 mb-3"
            >
              ⚡ Color Stresser
            </a>
            <p className="text-gray-500 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150 hidden md:block">
              Test different colors and patterns to see their energy consumption impact on OLED displays
            </p>
          </div>
          
          <div className="group flex flex-col items-center text-center max-w-xs">
            <a
              href="/documentation"
              className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all duration-300 text-gray-500 hover:scale-105 active:scale-95 mb-3"
            >
              🔬 Algorithm Documentation
            </a>
            <p className="text-gray-500 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150 hidden md:block">
              Deep dive into the algorithm behind color analysis, luminance calculations, and OLED optimizations
            </p>
          </div>
        </div>
        
        <DynamicButton
          title="Support"
          description="Help me improve and maintain these tools"
          href={'https://paypal.me/Boehi'}
          variant="secondary"
          openInNewTab={true}
        />
      </main>
      <Footer />
    </div>
  );
}