"use client";
import DynamicButton from "./components/DynamicButton";
import Footer from "./components/Footer";

export default function Home() {

  return (
    <div className={`flex relative flex-col items-center justify-center min-h-screen bg-black`}>
      <main className={`flex flex-col gap-6 items-center justify-center min-h-screen py-2 font-[family-name:var(--font-geist-mono)] transition-opacity duration-300 `}>
        <DynamicButton
          title="Color Stresser"
          description="Test energy consumption with different screen colors and patterns"
          onClick={() => window.location.href = '/stresser'}
          variant="primary"
        />
        <DynamicButton
          title="Website Tester"
          description="Test the ratio between dark and light colors on your website"
          onClick={() => window.location.href = '/website-analyzer'}
          variant="default"
        />
      </main>
      <Footer />
    </div>
  );
}