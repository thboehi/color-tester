"use client";
import { useState, useEffect } from 'react';
import ColorResults from '../components/ColorResults';
import Footer from '../components/Footer';
import AnalysisHistory from '../components/AnalysisHistory';
import Image from 'next/image';

export default function WebsiteTester() {
    const [url, setUrl] = useState('');
    const [theme, setTheme] = useState('dark');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [analysisHistory, setAnalysisHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    // Charger l'historique depuis localStorage au montage
    useEffect(() => {
        const savedHistory = localStorage.getItem('website-analysis-history');
        if (savedHistory) {
            setAnalysisHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Sauvegarder dans localStorage
    const saveToHistory = (newResult) => {
        const analysisItem = {
            id: Date.now(),
            url: newResult.metadata.url,
            theme: newResult.metadata.theme,
            timestamp: newResult.metadata.timestamp,
            siteMetadata: newResult.siteMetadata,
            darkPercentage: newResult.darkPercentage,
            lightPercentage: newResult.lightPercentage,
            dominantColors: newResult.dominantColors.slice(0, 3),
            // Sauvegarder toutes les données importantes
            allDominantColors: newResult.dominantColors,
            totalColors: newResult.totalColors,
            screenshot: newResult.screenshot // Sauvegarder aussi le screenshot
        };

        const updatedHistory = [analysisItem, ...analysisHistory.slice(0, 9)];
        setAnalysisHistory(updatedHistory);
        localStorage.setItem('website-analysis-history', JSON.stringify(updatedHistory));
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/analyze-website', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, theme })
            });
            const data = await response.json();
            setResults(data);
            saveToHistory(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Nouvelle fonction pour charger directement depuis l'historique
    const handleSelectFromHistory = (historyItem) => {
        // Reconstituer l'objet résultat à partir des données sauvegardées
        const reconstructedResult = {
            dominantColors: historyItem.allDominantColors || historyItem.dominantColors,
            darkPercentage: historyItem.darkPercentage,
            lightPercentage: historyItem.lightPercentage,
            totalColors: historyItem.totalColors,
            screenshot: historyItem.screenshot,
            siteMetadata: historyItem.siteMetadata,
            metadata: {
                url: historyItem.url,
                theme: historyItem.theme,
                timestamp: historyItem.timestamp
            }
        };

        // Mettre à jour l'interface
        setResults(reconstructedResult);
        setUrl(historyItem.url);
        setTheme(historyItem.theme || 'dark');
        setShowHistory(false);
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Bouton pour retourner à la page principale */}
            <div className="absolute top-5 left-5 z-50 group">
                <button
                    onClick={() => window.location.href = '/'}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-gray-400/20 hover:bg-white/20 transition-all duration-500 cursor-pointer text-gray-500 hover:w-auto hover:px-4 hover:gap-2"
                >
                    <Image src="/arrow-left.svg" alt="Home" width={10} height={10} className="w-4 h-4" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm overflow-hidden max-w-0 group-hover:max-w-xs">
                        Home
                    </span>
                </button>
            </div>

            {/* Bouton pour afficher l'historique */}
            {analysisHistory.length > 0 && (
                <div className="absolute top-5 right-5 z-50 group">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-gray-400/20 hover:bg-white/20 transition-all duration-500 cursor-pointer text-gray-500 hover:w-auto hover:px-4 hover:gap-2"
                    >
                        <span className="text-lg">
                            {showHistory ? '×' : '📋'}
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm overflow-hidden max-w-0 group-hover:max-w-xs">
                            {showHistory ? 'Close' : `History (${analysisHistory.length})`}
                        </span>
                    </button>
                </div>
            )}

            {/* Panel de l'historique */}
            {showHistory && (
                <AnalysisHistory 
                    history={analysisHistory}
                    onSelect={handleSelectFromHistory}
                    onClose={() => setShowHistory(false)}
                />
            )}

            <main className="flex flex-col items-center justify-start pt-20 pb-32 px-4 md:px-8 font-[family-name:var(--font-geist-mono)]">
                <div className="max-w-4xl w-full space-y-6 md:space-y-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-400 text-center">
                        Website Color Analyzer
                    </h1>
                    
                    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                        {/* Explication et sélecteur de thème */}
                        <div className="text-center space-y-3">
                            <p className="text-sm text-gray-500 max-w-lg mx-auto px-4">
                                Choose which system theme to simulate when analyzing the website. 
                                Many modern websites adapt their colors based on your system preferences.
                            </p>
                            
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`cursor-pointer px-3 md:px-4 py-2 rounded-full text-sm transition-all ${
                                        theme === 'dark' 
                                            ? 'bg-gray-600 text-white border border-gray-400/40' 
                                            : 'bg-white/10 text-gray-500 hover:bg-white/20 border border-gray-400/20'
                                    }`}
                                >
                                    🌙 Dark Theme
                                </button>
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`cursor-pointer px-3 md:px-4 py-2 rounded-full text-sm transition-all ${
                                        theme === 'light' 
                                            ? 'bg-gray-200 text-gray-900 border border-gray-400/40' 
                                            : 'bg-white/10 text-gray-500 hover:bg-white/20 border border-gray-400/20'
                                    }`}
                                >
                                    ☀️ Light Theme
                                </button>
                            </div>
                            
                            <p className="text-xs text-gray-600">
                                Currently simulating: <span className="font-medium">{theme === 'dark' ? '🌙 Dark' : '☀️ Light'} system theme</span>
                            </p>
                        </div>

                        {/* URL et bouton d'analyse - responsive */}
                        <div className="flex flex-col md:flex-row gap-4 mt-6">
                            <input
                                type="url"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1 px-6 md:px-8 py-2 bg-white/0 backdrop-blur-sm border border-gray-400/20 rounded-full text-gray-500 placeholder-gray-600 focus:outline-none focus:border-gray-400/40 transition-all"
                            />
                            <button
                                onClick={handleAnalyze}
                                disabled={!url || isAnalyzing}
                                className="bg-white/0 hover:bg-gray-400/10 flex items-center justify-center px-6 md:px-8 py-2 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <p className="text-gray-500">
                                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                                </p>
                            </button>
                        </div>
                    </div>

                    {results && <ColorResults results={results} />}
                </div>
            </main>

            <Footer />
        </div>
    );
}