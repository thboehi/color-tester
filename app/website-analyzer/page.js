"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ColorResults from '../components/ColorResults';
import Footer from '../components/Footer';
import AnalysisHistory from '../components/AnalysisHistory';
import Image from 'next/image';
import { validateWebsiteUrl } from '../utils/urlValidator';

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

    // Sauvegarder dans localStorage avec vérifications
    const saveToHistory = (newResult) => {
        if (!newResult || !newResult.metadata) {
            console.error('Invalid result data:', newResult);
            return;
        }

        const analysisItem = {
            id: Date.now(),
            url: newResult.metadata?.url || url,
            theme: newResult.metadata?.theme || theme,
            timestamp: newResult.metadata?.timestamp || new Date().toISOString(),
            siteMetadata: newResult.siteMetadata || {},
            darkPercentage: newResult.darkPercentage || 0,
            lightPercentage: newResult.lightPercentage || 0,
            dominantColors: Array.isArray(newResult.dominantColors) ? newResult.dominantColors.slice(0, 3) : [],
            allDominantColors: Array.isArray(newResult.dominantColors) ? newResult.dominantColors : [],
            totalColors: newResult.totalColors || 0,
            screenshot: newResult.screenshot || null
        };

        const updatedHistory = [analysisItem, ...analysisHistory.slice(0, 9)];
        setAnalysisHistory(updatedHistory);
        localStorage.setItem('website-analysis-history', JSON.stringify(updatedHistory));
    };

    const handleAnalyze = async () => {
        // Validation de l'URL
        const validation = validateWebsiteUrl(url);
        if (!validation.valid) {
            toast.error(validation.error, {
                className: '!bg-red-500/10 !border-red-400/30 !text-red-400',
                progressClassName: '!bg-red-400/40'
            });
            return;
        }

        setIsAnalyzing(true);
        
        try {
            const response = await fetch('/api/analyze-website', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, theme })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data) {
                throw new Error('No data received from API');
            }

            // Ajouter des métadonnées par défaut si elles manquent
            if (!data.metadata) {
                data.metadata = {
                    url: url,
                    theme: theme,
                    timestamp: new Date().toISOString()
                };
            }

            // Vérifier les autres champs essentiels
            data.dominantColors = data.dominantColors || [];
            data.darkPercentage = data.darkPercentage || 0;
            data.lightPercentage = data.lightPercentage || 0;
            data.siteMetadata = data.siteMetadata || {};

            setResults(data);
            saveToHistory(data);
            
            // Toast de succès
            toast.success('Website analysis completed successfully!', {
                className: '!bg-green-500/10 !border-green-400/30 !text-green-400',
                progressClassName: '!bg-green-400/40'
            });
            
        } catch (error) {
            console.error('Analysis error:', error);
            
            // Toast d'erreur avec message personnalisé
            const errorMessage = error.message.includes('timeout') 
                ? 'The website took too long to respond. Please try again.'
                : error.message.includes('network')
                ? 'Network error. Please check your connection and try again.'
                : error.message.includes('fetch')
                ? 'Unable to access the website. Please verify the URL.'
                : error.message || 'An error occurred during analysis. Please try again.';
                
            toast.error(errorMessage, {
                className: '!bg-red-500/10 !border-red-400/30 !text-red-400',
                progressClassName: '!bg-red-400/40'
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Fonction pour charger directement depuis l'historique
    const handleSelectFromHistory = (historyItem) => {
        if (!historyItem) {
            console.error('Invalid history item');
            return;
        }

        const reconstructedResult = {
            dominantColors: historyItem.allDominantColors || historyItem.dominantColors || [],
            darkPercentage: historyItem.darkPercentage || 0,
            lightPercentage: historyItem.lightPercentage || 0,
            totalColors: historyItem.totalColors || 0,
            screenshot: historyItem.screenshot || null,
            siteMetadata: historyItem.siteMetadata || {},
            metadata: {
                url: historyItem.url || '',
                theme: historyItem.theme || 'dark',
                timestamp: historyItem.timestamp || new Date().toISOString()
            }
        };

        setResults(reconstructedResult);
        setUrl(historyItem.url || '');
        setTheme(historyItem.theme || 'dark');
        setShowHistory(false);
        
        toast.info('Analysis loaded from history', {
            className: '!bg-blue-500/10 !border-blue-400/30 !text-blue-400',
            progressClassName: '!bg-blue-400/40'
        });
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Boutons navigation */}
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