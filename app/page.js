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
        <DynamicButton
          title="Color Stresser"
          description="Test energy consumption with different screen colors and patterns"
          href={'/stresser'}
          variant="primary"
        />
        <DynamicButton
          title="Website Tester"
          description="Test the ratio between dark and light colors on your website"
          href={'/website-analyzer'}
          variant="primary"
        />
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