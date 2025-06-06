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
    const [loadingDots, setLoadingDots] = useState('');
    const [isHistoryModalClosing, setIsHistoryModalClosing] = useState(false);
    const [isAnalyzingModalClosing, setIsAnalyzingModalClosing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // Nouvel état pour suivre l'étape actuelle
    // DEBUG: Simulate analysis for testing purposes
    const simulateFakeAnalysis = true; // Set to true to simulate analysis for testing

    // Animation des points de chargement
    useEffect(() => {
        if (isAnalyzing) {
            // Animation des points
            const dotsInterval = setInterval(() => {
                setLoadingDots(prev => {
                    if (prev === '...') return '';
                    return prev + '.';
                });
            }, 500);

            // Gestion des étapes progressives
            setCurrentStep(0);
            const stepInterval = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev < 2) return prev + 1;
                    return prev;
                });
            }, 3000); // 3 secondes entre chaque étape

            return () => {
                clearInterval(dotsInterval);
                clearInterval(stepInterval);
            };
        } else {
            setLoadingDots('');
            setCurrentStep(0);
        }
    }, [isAnalyzing]);

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
            screenshot: newResult.screenshot || null,
            screenshotSize: newResult.metadata?.screenshotSize || null
        };

        const updatedHistory = [analysisItem, ...analysisHistory.slice(0, 9)];
        setAnalysisHistory(updatedHistory);
        localStorage.setItem('website-analysis-history', JSON.stringify(updatedHistory));
    };

    const handleAnalyze = async () => {
        
        // Debug : Simuler une analyse pour les tests
        if (simulateFakeAnalysis) {
            setIsAnalyzing(true);
            //Ajoute une légère pause pour simuler l'analyse
            await new Promise(resolve => setTimeout(resolve, 10000));
            
            // Animation de fermeture
            setIsAnalyzingModalClosing(true);
            setTimeout(() => {
                setIsAnalyzing(false);
                setIsAnalyzingModalClosing(false);
            }, 300);
            return;
        }

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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

            const response = await fetch(`${apiUrl}/analyze-website`, {
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

            // Animation de fermeture avant d'afficher les résultats
            setIsAnalyzingModalClosing(true);
            setTimeout(() => {
                setResults(data);
                saveToHistory(data);
                setIsAnalyzing(false);
                setIsAnalyzingModalClosing(false);
            }, 300);
            
            // Toast de succès
            toast.success('Website analysis completed successfully!', {
                className: '!bg-green-500/10 !border-green-400/30 !text-green-400',
                progressClassName: '!bg-green-400/40'
            });
            
        } catch (error) {
            console.error('Analysis error:', error);
            
            // Animation de fermeture en cas d'erreur
            setIsAnalyzingModalClosing(true);
            setTimeout(() => {
                setIsAnalyzing(false);
                setIsAnalyzingModalClosing(false);
            }, 300);
            
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
                timestamp: historyItem.timestamp || new Date().toISOString(),
                screenshotSize: historyItem.screenshotSize || null,
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

    // Fonction pour fermer la modal History avec animation
    const closeHistoryModal = () => {
        setIsHistoryModalClosing(true);
        setTimeout(() => {
            setShowHistory(false);
            setIsHistoryModalClosing(false);
        }, 300);
    };

    // Gestion de la touche Escape pour fermer la modal d'historique
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                if (showHistory) closeHistoryModal();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [showHistory]);

    return (
        <div className="min-h-screen bg-black">
            {/* Overlay de chargement */}
            {isAnalyzing && (
                <div 
                    className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
                        isAnalyzingModalClosing 
                            ? 'bg-black/0 backdrop-blur-none' 
                            : 'bg-black/80 backdrop-blur-sm'
                    }`}
                    style={{
                        animation: isAnalyzingModalClosing 
                            ? 'fadeOut 0.3s ease-out forwards' 
                            : 'fadeIn 0.3s ease-out forwards'
                    }}
                >
                    <div 
                        className={`max-w-md mx-4 p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-gray-400/20 text-center space-y-6 transition-all duration-300 ${
                            isAnalyzingModalClosing 
                                ? 'scale-95 opacity-0 translate-y-4' 
                                : 'scale-100 opacity-100 translate-y-0'
                        }`}
                        style={{
                            animation: isAnalyzingModalClosing 
                                ? 'slideOut 0.3s ease-out forwards' 
                                : 'slideIn 0.3s ease-out forwards'
                        }}
                    >
                        {/* Spinner animé avec animation d'apparition */}
                        <div className="flex justify-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <div className="w-12 h-12 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
                        </div>
                        
                        {/* Titre avec animation */}
                        <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <h3 className="text-xl font-semibold text-gray-300">
                                Analyzing website{loadingDots}
                            </h3>
                            <p className="text-sm text-gray-500">
                                This may take up to a minute
                            </p>
                        </div>
                        
                        {/* Messages d'information avec animations échelonnées et apparition progressive */}
                        <div className="space-y-3 text-xs text-gray-600 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <div className={`flex items-center justify-center gap-2 transition-all duration-500 ${
                                currentStep >= 0 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                            }`}>
                                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    currentStep >= 0 ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'
                                }`}></span>
                                <span className={currentStep >= 0 ? 'text-blue-300' : 'text-gray-600'}>
                                    Taking screenshot with {theme} theme
                                </span>
                                {currentStep > 0 && <span className="text-green-400 ml-1">✓</span>}
                            </div>
                            
                            <div className={`flex items-center justify-center gap-2 transition-all duration-500 ${
                                currentStep >= 1 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                            }`} style={{ transitionDelay: currentStep >= 1 ? '0ms' : '500ms' }}>
                                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    currentStep >= 1 ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
                                }`}></span>
                                <span className={currentStep >= 1 ? 'text-green-300' : 'text-gray-600'}>
                                    Analyzing color composition
                                </span>
                                {currentStep > 1 && <span className="text-green-400 ml-1">✓</span>}
                            </div>
                            
                            <div className={`flex items-center justify-center gap-2 transition-all duration-500 ${
                                currentStep >= 2 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                            }`} style={{ transitionDelay: currentStep >= 2 ? '0ms' : '1000ms' }}>
                                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    currentStep >= 2 ? 'bg-yellow-400 animate-pulse' : 'bg-gray-600'
                                }`}></span>
                                <span className={currentStep >= 2 ? 'text-yellow-300' : 'text-gray-600'}>
                                    Extracting metadata
                                </span>
                                {/* On peut ajouter une coche verte à la fin de l'analyse */}
                            </div>
                        </div>
                        
                        {/* Avertissement avec animation */}
                        <div className="pt-4 border-t border-gray-400/10 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                                <span className="text-yellow-400 animate-pulse">⚠️</span>
                                Please do not close this page
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Boutons navigation */}
            <div className="absolute top-5 left-5 z-40 group">
                <button
                    onClick={() => window.location.href = '/'}
                    disabled={isAnalyzing}
                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-gray-400/20 hover:bg-white/20 transition-all duration-500 cursor-pointer text-gray-500 hover:w-auto hover:px-4 hover:gap-2 ${
                        isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <Image src="/arrow-left.svg" alt="Home" width={10} height={10} className="w-4 h-4" />
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm overflow-hidden max-w-0 group-hover:max-w-xs">
                        Home
                    </span>
                </button>
            </div>

            {analysisHistory.length > 0 && (
                <div className="absolute top-5 right-5 z-40 group">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        disabled={isAnalyzing}
                        className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-gray-400/20 hover:bg-white/20 transition-all duration-500 cursor-pointer text-gray-500 hover:w-auto hover:px-4 hover:gap-2 ${
                            isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
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

            {showHistory && !isAnalyzing && (
                <AnalysisHistory 
                    history={analysisHistory}
                    onSelect={(item) => {
                        handleSelectFromHistory(item);
                        closeHistoryModal();
                    }}
                    onClose={closeHistoryModal}
                    isClosing={isHistoryModalClosing}
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
                                    disabled={isAnalyzing}
                                    className={`cursor-pointer px-3 md:px-4 py-2 rounded-full text-sm transition-all ${
                                        theme === 'dark' 
                                            ? 'bg-gray-600 text-white border border-gray-400/40' 
                                            : 'bg-white/10 text-gray-500 hover:bg-white/20 border border-gray-400/20'
                                    } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    🌙 Dark Theme
                                </button>
                                <button
                                    onClick={() => setTheme('light')}
                                    disabled={isAnalyzing}
                                    className={`cursor-pointer px-3 md:px-4 py-2 rounded-full text-sm transition-all ${
                                        theme === 'light' 
                                            ? 'bg-gray-200 text-gray-900 border border-gray-400/40' 
                                            : 'bg-white/10 text-gray-500 hover:bg-white/20 border border-gray-400/20'
                                    } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                disabled={isAnalyzing}
                                className={`flex-1 px-6 md:px-8 py-2 bg-white/0 backdrop-blur-sm border border-gray-400/20 rounded-full text-gray-500 placeholder-gray-600 focus:outline-none focus:border-gray-400/40 transition-all ${
                                    isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
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

                    {results && !isAnalyzing && <ColorResults results={results} />}
                </div>
            </main>

            <Footer />
        </div>
    );
}