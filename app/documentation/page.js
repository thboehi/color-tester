"use client";
import { useState } from 'react';
import Footer from '../components/Footer';

// Import des composants de documentation
import OverviewSection from '../components/documentation/OverviewSection';
import LuminanceSection from '../components/documentation/LuminanceSection';
import ColorDetectionSection from '../components/documentation/ColorDetectionSection';
import SamplingSection from '../components/documentation/SamplingSection';
import OledOptimizationSection from '../components/documentation/OledOptimizationSection';
import ResearchSection from '../components/documentation/ResearchSection';

export default function DocumentationPage() {
    const [activeSection, setActiveSection] = useState('overview');

    const sections = [
        { id: 'overview', title: 'Overview', icon: '🔬' },
        { id: 'luminance', title: 'Luminance Calculation', icon: '💡' },
        { id: 'color-detection', title: 'Color Detection', icon: '🎨' },
        { id: 'sampling', title: 'Pixel Sampling', icon: '📊' },
        { id: 'oled-optimization', title: 'OLED Optimization', icon: '⚡' },
        { id: 'research', title: 'Research & References', icon: '📚' }
    ];

    const renderActiveSection = () => {
        switch(activeSection) {
            case 'overview':
                return <OverviewSection />;
            case 'luminance':
                return <LuminanceSection />;
            case 'color-detection':
                return <ColorDetectionSection />;
            case 'sampling':
                return <SamplingSection />;
            case 'oled-optimization':
                return <OledOptimizationSection />;
            case 'research':
                return <ResearchSection />;
            default:
                return <OverviewSection />;
        }
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Navigation */}
            <div className="absolute top-5 left-5 z-40 group">
                <button
                    onClick={() => window.location.href = '/'}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-gray-400/20 hover:bg-white/20 transition-all duration-500 cursor-pointer text-gray-500 hover:w-auto hover:px-4 hover:gap-2"
                >
                    <span className="text-lg">←</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm overflow-hidden max-w-0 group-hover:max-w-xs">
                        Home
                    </span>
                </button>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Documentation
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        How this tool analyzes website color composition and energy efficiency for OLED displays
                    </p>
                </div>

                {/* Table of Contents */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                                activeSection === section.id
                                    ? 'bg-white/20 text-white border border-gray-400/40'
                                    : 'bg-white/5 text-gray-400 border border-gray-400/10 hover:bg-white/10 hover:text-gray-300 cursor-pointer'
                            }`}
                        >
                            <span className="mr-2">{section.icon}</span>
                            {section.title}
                        </button>
                    ))}
                </div>

                {/* Content Sections */}
                <div className="space-y-16">
                    {renderActiveSection()}
                </div>
            </main>

            <Footer />
        </div>
    );
}