"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [bgColor, setBgColor] = useState("bg-black");
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashSpeed, setFlashSpeed] = useState(200);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [showPriceCalculatorModal, setShowPriceCalculatorModal] = useState(false);
  
  // États pour le calculateur de prix avec comparaison
  const [currency, setCurrency] = useState('EUR');
  const [averageWatts, setAverageWatts] = useState('');
  const [averageWatts2, setAverageWatts2] = useState(''); // Nouveau pour la comparaison
  const [consumptionPeriod, setConsumptionPeriod] = useState('');
  const [pricePerKwh, setPricePerKwh] = useState('');
  const [periodUnit, setPeriodUnit] = useState('hours');
  const [enableComparison, setEnableComparison] = useState(false); // Nouvelle state pour activer la comparaison

  const flashingIntervalRef = useRef(null);
  const colorPairRef = useRef({ current: "bg-white", opposite: "bg-black" });
  const wakeLockRef = useRef(null);

  // Charger la monnaie depuis localStorage au chargement
  useEffect(() => {
    const savedCurrency = localStorage.getItem('colorTesterCurrency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Sauvegarder la monnaie dans localStorage quand elle change
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('colorTesterCurrency', newCurrency);
  };

  // Symboles de monnaie
  const currencySymbols = {
    'EUR': '€',
    'USD': '$',
    'GBP': '£',
    'CHF': 'CHF',
    'CAD': 'C$',
    'JPY': '¥'
  };

  // Calcul du coût (fonction mise à jour pour supporter la comparaison)
  const calculateCost = (watts = averageWatts) => {
    if (!watts || !consumptionPeriod || !pricePerKwh) return 0;
    
    const wattsValue = parseFloat(watts);
    const period = parseFloat(consumptionPeriod);
    const price = parseFloat(pricePerKwh);
    
    // Convertir la période en heures
    let hoursMultiplier = 1;
    switch (periodUnit) {
      case 'minutes':
        hoursMultiplier = 1/60;
        break;
      case 'hours':
        hoursMultiplier = 1;
        break;
      case 'days':
        hoursMultiplier = 24;
        break;
      case 'weeks':
        hoursMultiplier = 24 * 7;
        break;
      case 'months':
        hoursMultiplier = 24 * 30;
        break;
      case 'years':
        hoursMultiplier = 24 * 365;
        break;
    }
    
    const totalHours = period * hoursMultiplier;
    const kWh = (wattsValue * totalHours) / 1000;
    const totalCost = kWh * price;
    
    return totalCost;
  };

  // Calcul de la différence entre les deux consommations
  const calculateDifference = () => {
    if (!enableComparison || !averageWatts || !averageWatts2) return null;
    
    const cost1 = calculateCost(averageWatts);
    const cost2 = calculateCost(averageWatts2);
    const difference = cost2 - cost1;
    const percentageDiff = cost1 > 0 ? ((difference / cost1) * 100) : 0;
    
    return { difference, percentageDiff, cost1, cost2 };
  };

  const formatCost = (cost) => {
    const symbol = currencySymbols[currency];
    if (currency === 'JPY') {
      return `${symbol}${Math.round(cost)}`;
    }
    return `${cost < 1 ? cost.toFixed(4) : cost.toFixed(2)} ${symbol}`;
  };

  // Fonction pour obtenir la couleur opposée
  const getOppositeColor = (color) => {
    switch (color) {
      case "bg-white": return "bg-black";
      case "bg-black": return "bg-white";
      case "bg-red-full": return "bg-cyan-500";
      case "bg-green-full": return "bg-pink-500";
      case "bg-blue-full": return "bg-yellow-500";
      default: return "bg-black";
    }
  };

  // Fonction pour activer le WakeLock
  const requestWakeLock = async () => {
    try {
      // Vérifier si l'API WakeLock est disponible
      if ('wakeLock' in navigator) {
        // Demander un verrou d'écran
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        setWakeLockActive(true);
        
        // Gérer la libération du verrou
        wakeLockRef.current.addEventListener('release', () => {
          setWakeLockActive(false);
          wakeLockRef.current = null;
        });
        
        console.log('Wake Lock activé');
      } else {
        console.log('Wake Lock API non supportée par ce navigateur');
      }
    } catch (err) {
      console.error(`Erreur lors de l'activation du Wake Lock: ${err.message}`);
    }
  };

  // Fonction pour désactiver le WakeLock
  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setWakeLockActive(false);
        console.log('Wake Lock désactivé');
      } catch (err) {
        console.error(`Erreur lors de la désactivation du Wake Lock: ${err.message}`);
      }
    }
  };

  // Activer WakeLock au chargement de la page
  useEffect(() => {
    requestWakeLock();
    
    // Réactiver le WakeLock lorsque la page redevient visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) {
        requestWakeLock();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Nettoyer lors du démontage du composant
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, []);

  // Mettre à jour la paire de couleurs lorsque bgColor change et qu'on ne clignote pas
  useEffect(() => {
    if (!isFlashing) {
      const opposite = getOppositeColor(bgColor);
      colorPairRef.current = { current: bgColor, opposite: opposite };
    }
  }, [bgColor, isFlashing]);

  // Gérer le clignotement
  useEffect(() => {
    if (isFlashing) {
      flashingIntervalRef.current = setInterval(() => {
        setBgColor(prev => {
          return prev === colorPairRef.current.current 
            ? colorPairRef.current.opposite 
            : colorPairRef.current.current;
        });
      }, flashSpeed);
    } else {
      if (flashingIntervalRef.current) {
        clearInterval(flashingIntervalRef.current);
        setBgColor(colorPairRef.current.current);
      }
    }

    return () => {
      if (flashingIntervalRef.current) {
        clearInterval(flashingIntervalRef.current);
      }
    };
  }, [isFlashing, flashSpeed]);

  // Gestionnaire pour activer/désactiver le mode clignotement
  const toggleFlashing = () => {
    setIsFlashing(!isFlashing);
  };

  // Gestionnaire pour changer la vitesse
  const handleSpeedChange = (e) => {
    setFlashSpeed(Number(e.target.value));
  };

  // Gestionnaire pour afficher/masquer les contrôles
  const toggleControls = () => {
    setControlsVisible(!controlsVisible);
  };

  // États pour les animations des modales
  const [isHowToModalClosing, setIsHowToModalClosing] = useState(false);
  const [isPriceCalculatorModalClosing, setIsPriceCalculatorModalClosing] = useState(false);

  // Fonction pour fermer la modal How To avec animation
  const closeHowToModal = () => {
    setIsHowToModalClosing(true);
    setTimeout(() => {
      setShowHowToModal(false);
      setIsHowToModalClosing(false);
    }, 300); // Durée de l'animation de fermeture
  };

  // Fonction pour fermer la modal Price Calculator avec animation
  const closePriceCalculatorModal = () => {
    setIsPriceCalculatorModalClosing(true);
    setTimeout(() => {
      setShowPriceCalculatorModal(false);
      setIsPriceCalculatorModalClosing(false);
      document.body.style.overflow = 'unset'; // Restaurer le scroll
    }, 300);
  };

  // Fermer les modales avec Escape (avec animation)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showHowToModal) closeHowToModal();
        if (showPriceCalculatorModal) closePriceCalculatorModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showHowToModal, showPriceCalculatorModal]);

  return (
    <div className={`flex relative flex-col items-center justify-center min-h-screen ${bgColor}`}>
      {/* Bouton pour afficher/masquer les contrôles */}
      <button 
        onClick={toggleControls}
        className="absolute top-5 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-gray-400/20 hover:bg-white/20 transition-all duration-500 cursor-pointer"
      >
        <span className="text-gray-500 text-lg">
          {controlsVisible ? '×' : '+'}
        </span>
      </button>

      {/* Bouton pour retourner à la page principale */}
      <div className="absolute top-5 left-5 z-50 group">
        <button
          onClick={() => window.location.href = '/'}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-gray-400/20 hover:bg-white/20 transition-all duration-500 cursor-pointer text-gray-500 hover:w-auto hover:px-4 hover:gap-2"
        >
          <Image src="/arrow-left.svg" alt="Home" width={10} height={10} className="w-4 h-4" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap text-sm overflow-hidden max-w-0 group-hover:max-w-xs">
            Home
          </span>
        </button>
      </div>
      
      {/* Contenu principal avec contrôles */}
      <main className={`flex flex-col gap-6 items-center justify-center min-h-screen py-2 font-[family-name:var(--font-geist-mono)] transition-opacity duration-500 ${controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Boutons de couleurs */}
        <button onClick={() => setBgColor("bg-black")} className="bg-white/0 hover:bg-gray-400/10 flex items-center justify-between px-8 py-1 z-50 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all duration-500 ">
          <p className="text-gray-500">Black</p>
        </button>
        <button onClick={() => setBgColor("bg-white")} className="bg-white/0 hover:bg-gray-400/10 flex items-center justify-between px-8 py-1 z-50 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all duration-500 ">
          <p className="text-gray-500">White</p>
        </button>
        
        <button onClick={() => setBgColor("bg-red-full")} className="bg-white/0 hover:bg-gray-400/10 flex items-center justify-between px-8 py-1 z-50 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all duration-500 ">
          <p className="text-gray-500">Red</p>
        </button>
        <button onClick={() => setBgColor("bg-green-full")} className="bg-white/0 hover:bg-gray-400/10 flex items-center justify-between px-8 py-1 z-50 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all duration-500 ">
          <p className="text-gray-500">Green</p>
        </button>
        <button onClick={() => setBgColor("bg-blue-full")} className="bg-white/0 hover:bg-gray-400/10 flex items-center justify-between px-8 py-1 z-50 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all duration-500 ">
          <p className="text-gray-500">Blue</p>
        </button>
        
        {/* Contrôles pour le mode clignotement */}
        <div className="flex flex-col gap-4 items-center mt-6">
          <button 
            onClick={toggleFlashing} 
            className={`bg-white/0 hover:bg-gray-400/10 flex items-center justify-between px-8 py-1 z-50 rounded-full backdrop-blur-sm border ${isFlashing ? 'border-red-400' : 'border-gray-400/20'} cursor-pointer transition-all duration-500 `}
          >
            <p className={`${isFlashing ? 'text-red-500' : 'text-gray-500'}`}>
              {isFlashing ? 'Stop Flashing' : 'Start Flashing'}
            </p>
          </button>
          
          <div className="flex items-center gap-4">
            <label htmlFor="speed-control" className="text-gray-500">Speed:</label>
            <input
              id="speed-control"
              type="range"
              min="20"
              max="200"
              step="20"
              value={flashSpeed}
              onChange={handleSpeedChange}
              className="w-40"
            />
            <span className="text-gray-500">{flashSpeed} ms</span>
          </div>
        </div>

        {/* Boutons How To et Price Calculator avec animations au clic */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowHowToModal(true)}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all duration-300 text-gray-500 text-sm hover:scale-105 active:scale-95"
          >
            How To
          </button>
          <button
            onClick={() => {
              setShowPriceCalculatorModal(true);
              document.body.style.overflow = 'hidden'; // Bloquer le scroll du body
            }}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all duration-300 text-gray-500 text-sm hover:scale-105 active:scale-95"
          >
            Price Calculator
          </button>
        </div>
        
        {/* Indicateur de Wake Lock */}
        <div className="mt-4">
            <p className={`text-xs ${wakeLockActive ? 'text-green-500' : 'text-red-500'}`}>
            {wakeLockActive 
                ? '✓ Screen lock disabled (While staying on this page, the screen sleep mode is disabled)' 
                : '✗ Screen lock still enabled (Your screen might turn off during the test, check the console for more details)'}
            </p>
        </div>
      </main>

      {/* Modal How To - Avec animations fluides */}
      {showHowToModal && (
        <div 
          className={`fixed inset-0 z-[100] flex items-center justify-center cursor-pointer transition-all duration-300 ${
            isHowToModalClosing 
              ? 'bg-black/0 backdrop-blur-none' 
              : 'bg-black/70 backdrop-blur-sm'
          }`}
          onClick={closeHowToModal}
          style={{
            animation: isHowToModalClosing 
              ? 'fadeOut 0.3s ease-out forwards' 
              : 'fadeIn 0.3s ease-out forwards'
          }}
        >
          <div 
            className={`bg-gray-950/95 backdrop-blur-sm rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto m-4 relative cursor-default border border-gray-700/50 transition-all duration-300 ${
              isHowToModalClosing 
                ? 'scale-95 opacity-0 translate-y-4' 
                : 'scale-100 opacity-100 translate-y-0'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: isHowToModalClosing 
                ? 'slideOut 0.3s ease-out forwards' 
                : 'slideIn 0.3s ease-out forwards'
            }}
          >
            {/* Header avec animation sur le bouton de fermeture */}
            <div className="sticky top-0 bg-gray-950/95 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">How to Measure Screen Power Consumption</h2>
              <button
                onClick={closeHowToModal}
                className="text-gray-400 hover:text-white text-2xl cursor-pointer hover:bg-gray-900/50 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 hover:rotate-90 hover:scale-110"
              >
                ×
              </button>
            </div>
            
            {/* Content avec animation d'apparition progressive */}
            <div className="px-6 py-6 space-y-6 animate-slideInContent">
              {/* Introduction */}
              <section className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-xl font-semibold text-white mb-3">📋 Overview</h3>
                <p className="text-gray-300 leading-relaxed">
                  This guide will help you measure your screen's power consumption using digital energy meters. 
                  Understanding your display's energy usage is crucial for optimizing power efficiency and calculating operational costs.
                </p>
              </section>

              {/* Equipment needed */}
              <section className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-xl font-semibold text-white mb-3">🔧 Equipment Needed</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><strong className="text-white">Digital Power Meter</strong> (Kill A Watt, Steffen, or similar)</li>
                  <li><strong className="text-white">Computer/Device</strong> with the screen you want to test (OLED screens will have much more significant results)</li>
                  <li><strong className="text-white">Stable Power Source</strong> (wall outlet)</li>
                  <li><strong className="text-white">Timer or Stopwatch</strong> for accurate measurements</li>
                </ul>
              </section>

              {/* Step by step */}
              <section className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-xl font-semibold text-white mb-3">📝 Step-by-Step Process</h3>
                <div className="space-y-4">
                  <div className="bg-gray-900/50 border border-gray-700/50 p-4 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                    <h4 className="font-semibold text-white mb-2">Step 1: Setup</h4>
                    <p className="text-gray-300">Connect your digital power meter between the wall outlet and your device's power cable.</p>
                  </div>
                  
                  <div className="bg-gray-900/50 border border-gray-700/50 p-4 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                    <h4 className="font-semibold text-white mb-2">Step 2: Test Different Colors</h4>
                    <p className="text-gray-300">Use this color tester to display different colors (black, white, red, green, blue) for 5 minutes each. Record the power consumption for each color.</p>
                  </div>
                  
                  <div className="bg-gray-900/50 border border-gray-700/50 p-4 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                    <h4 className="font-semibold text-white mb-2">Step 3: Test Flashing Mode</h4>
                    <p className="text-gray-300">Test the flashing mode at different speeds to see how rapid changes affect power consumption.</p>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-700/50 p-4 rounded-lg hover:bg-gray-800/50 transition-colors duration-200">
                    <h4 className="font-semibold text-white mb-2">Step 4: Use price calculator</h4>
                    <p className="text-gray-300">See how much you would pay for 8 hours of navigating in the web in dark or light mode.</p>
                  </div>
                </div>
              </section>

              {/* Tips */}
              <section className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-xl font-semibold text-white mb-3">💡 Pro Tips</h3>
                <div className="bg-blue-900/30 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>Take multiple measurements and calculate averages for accuracy</li>
                    <li>Ensure room temperature is consistent during testing</li>
                    <li>Test at different brightness levels if possible</li>
                    <li>For OLED screens, black pixels consume significantly less power</li>
                  </ul>
                </div>
              </section>

              {/* Image placeholder */}
              <section className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                <h3 className="text-xl font-semibold text-white mb-3">📸 Setup Example</h3>
                <div className="bg-gray-800/30 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <div className="text-gray-400">
                    <Image src="/img/img1.webp" alt="Installation" width={1920} height={1440} className="mx-auto mt-4 rounded-lg" />
                    <Image src="/img/img2.webp" alt="Installation" width={1920} height={1440} className="mx-auto mt-4 rounded-lg" />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Modal Price Calculator - Avec animations fluides */}
      {showPriceCalculatorModal && (
        <div 
          className={`fixed inset-0 z-[100] flex items-center justify-center cursor-pointer transition-all duration-300 ${
            isPriceCalculatorModalClosing 
              ? 'bg-black/0 backdrop-blur-none' 
              : 'bg-black/70 backdrop-blur-sm'
          }`}
          onClick={closePriceCalculatorModal}
          style={{
            animation: isPriceCalculatorModalClosing 
              ? 'fadeOut 0.3s ease-out forwards' 
              : 'fadeIn 0.3s ease-out forwards'
          }}
        >
          <div 
            className={`bg-gray-950/95 backdrop-blur-sm rounded-lg max-w-5xl h-[90vh] m-4 relative cursor-default border border-gray-700/50 transition-all duration-300 flex flex-col ${
              isPriceCalculatorModalClosing 
                ? 'scale-95 opacity-0 translate-y-4' 
                : 'scale-100 opacity-100 translate-y-0'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: isPriceCalculatorModalClosing 
                ? 'slideOut 0.3s ease-out forwards' 
                : 'slideIn 0.3s ease-out forwards'
            }}
          >
            {/* Header avec animation sur le bouton de fermeture */}
            <div className="sticky top-0 bg-gray-950/95 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-2xl font-bold text-white">Power Consumption Cost Calculator</h2>
              <button
                onClick={closePriceCalculatorModal}
                className="text-gray-400 hover:text-white text-2xl cursor-pointer hover:bg-gray-900/50 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 hover:rotate-90 hover:scale-110"
              >
                ×
              </button>
            </div>
            
            {/* Content avec animation d'apparition progressive */}
            <div className="px-6 py-6 space-y-6 animate-slideInContent overflow-y-auto flex-1">
              {/* Introduction */}
              <div className="bg-blue-900/30 border-l-4 border-blue-400 p-4 rounded-r-lg animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                <p className="text-gray-300">
                  Calculate how much your screen's power consumption will cost you over time. 
                  Enter your measurements and electricity rates below.
                </p>
              </div>

              {/* Option de comparaison */}
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 animate-fadeInUp hover:bg-gray-700/30 transition-colors duration-200" style={{ animationDelay: '0.2s' }}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableComparison}
                    onChange={(e) => setEnableComparison(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 cursor-pointer transition-all duration-200"
                  />
                  <span className="text-white font-medium">Enable comparison mode</span>
                  <span className="text-gray-400 text-sm">(Compare dark vs light mode, different devices, etc.)</span>
                </label>
              </div>

              {/* Formulaire avec animations */}
              <div className="grid md:grid-cols-2 gap-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                {/* Paramètres communs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">
                    General Settings
                  </h3>

                  {/* Monnaie */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-900/50 cursor-pointer backdrop-blur-sm"
                    >
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="GBP">British Pound (£)</option>
                      <option value="CHF">Swiss Franc (CHF)</option>
                      <option value="CAD">Canadian Dollar (C$)</option>
                      <option value="JPY">Japanese Yen (¥)</option>
                    </select>
                  </div>

                  {/* Prix par kWh */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Price per kWh ({currencySymbols[currency]})
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      min="0"
                      value={pricePerKwh}
                      onChange={(e) => setPricePerKwh(e.target.value)}
                      placeholder="e.g., 0.15"
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-900/50 placeholder-gray-400 cursor-text backdrop-blur-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Check your electricity bill for this rate
                    </p>
                  </div>

                  {/* Période de consommation */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Usage Period
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={consumptionPeriod}
                        onChange={(e) => setConsumptionPeriod(e.target.value)}
                        placeholder="e.g., 8"
                        className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-900/50 placeholder-gray-400 cursor-text backdrop-blur-sm"
                      />
                      <select
                        value={periodUnit}
                        onChange={(e) => setPeriodUnit(e.target.value)}
                        className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-900/50 cursor-pointer backdrop-blur-sm"
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Calculs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700/50 pb-2">
                    Power Consumption
                  </h3>

                  {/* Premier calcul */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      {enableComparison ? 'Scenario 1 - Power Consumption (Watts)' : 'Average Power Consumption (Watts)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={averageWatts}
                      onChange={(e) => setAverageWatts(e.target.value)}
                      placeholder={enableComparison ? "e.g., 120 (dark mode)" : "e.g., 150"}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-900/50 placeholder-gray-400 cursor-text backdrop-blur-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {enableComparison ? 'First scenario power consumption' : 'Use your power meter readings from the How To guide'}
                    </p>
                  </div>

                  {/* Deuxième calcul (si comparaison activée) */}
                  {enableComparison && (
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Scenario 2 - Power Consumption (Watts)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={averageWatts2}
                        onChange={(e) => setAverageWatts2(e.target.value)}
                        placeholder="e.g., 180 (light mode)"
                        className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-gray-900/50 placeholder-gray-400 cursor-text backdrop-blur-sm"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Second scenario power consumption for comparison
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Résultats avec animations */}
              <div className={`grid ${enableComparison ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-6 animate-fadeInUp`} style={{ animationDelay: '0.4s' }}>
                {/* Premier résultat */}
                <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">
                    💰 {enableComparison ? 'Scenario 1 - Cost Calculation' : 'Cost Calculation'}
                  </h4>
                  
                  {averageWatts && consumptionPeriod && pricePerKwh ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Power consumption:</span>
                        <span className="font-medium text-white">{averageWatts}W</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Usage period:</span>
                        <span className="font-medium text-white">{consumptionPeriod} {periodUnit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Energy used:</span>
                        <span className="font-medium text-white">
                          {((parseFloat(averageWatts) * parseFloat(consumptionPeriod) * 
                            (periodUnit === 'minutes' ? 1/60 : 
                             periodUnit === 'hours' ? 1 :
                             periodUnit === 'days' ? 24 :
                             periodUnit === 'weeks' ? 24*7 :
                             periodUnit === 'months' ? 24*30 : 24*365)) / 1000).toFixed(3)} kWh
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Rate:</span>
                        <span className="font-medium text-white">{pricePerKwh} {currencySymbols[currency]}/kWh</span>
                      </div>
                      <hr className="my-2 border-gray-600"/>
                      <div className="flex justify-between text-lg font-bold text-green-400">
                        <span>Total Cost:</span>
                        <span>{formatCost(calculateCost(averageWatts))}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Fill in all fields above to see the calculation
                    </p>
                  )}
                </div>

                {/* Deuxième résultat (si comparaison activée) */}
                {enableComparison && (
                  <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">
                      💰 Scenario 2 - Cost Calculation
                    </h4>
                    
                    {averageWatts2 && consumptionPeriod && pricePerKwh ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Power consumption:</span>
                          <span className="font-medium text-white">{averageWatts2}W</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Usage period:</span>
                          <span className="font-medium text-white">{consumptionPeriod} {periodUnit}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Energy used:</span>
                          <span className="font-medium text-white">
                            {((parseFloat(averageWatts2) * parseFloat(consumptionPeriod) * 
                              (periodUnit === 'minutes' ? 1/60 : 
                               periodUnit === 'hours' ? 1 :
                               periodUnit === 'days' ? 24 :
                               periodUnit === 'weeks' ? 24*7 :
                               periodUnit === 'months' ? 24*30 : 24*365)) / 1000).toFixed(3)} kWh
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Rate:</span>
                          <span className="font-medium text-white">{pricePerKwh} {currencySymbols[currency]}/kWh</span>
                        </div>
                        <hr className="my-2 border-gray-600"/>
                        <div className="flex justify-between text-lg font-bold text-green-400">
                          <span>Total Cost:</span>
                          <span>{formatCost(calculateCost(averageWatts2))}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        Fill in all fields above to see the calculation
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Comparaison des résultats */}
              {enableComparison && calculateDifference() && (
                <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    📊 Comparison Results
                  </h4>
                  
                  {(() => {
                    const diff = calculateDifference();
                    const isScenario2Higher = diff.difference > 0;
                    const absPercentage = Math.abs(diff.percentageDiff);
                    
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Cost difference:</span>
                          <span className={`font-medium ${isScenario2Higher ? 'text-red-400' : 'text-green-400'}`}>
                            {isScenario2Higher ? '+' : ''}{formatCost(diff.difference)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Percentage difference:</span>
                          <span className={`font-medium ${isScenario2Higher ? 'text-red-400' : 'text-green-400'}`}>
                            {isScenario2Higher ? '+' : '-'}{absPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <hr className="my-2 border-purple-600/30"/>
                        <div className="text-sm text-gray-300">
                          {isScenario2Higher 
                            ? `Scenario 2 costs ${formatCost(Math.abs(diff.difference))} more than Scenario 1`
                            : `Scenario 1 costs ${formatCost(Math.abs(diff.difference))} more than Scenario 2`
                          }
                          {absPercentage > 10 && (
                            <span className="block text-xs text-yellow-400 mt-1">
                              💡 Significant difference detected - consider switching to the more efficient option!
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Tips */}
              <div className="bg-yellow-900/30 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                <h5 className="font-medium text-yellow-300 mb-1">💡 Tips</h5>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Different colors may have different power consumption</li>
                  <li>• OLED screens: black pixels use less power</li>
                  <li>• Test at your usual brightness setting</li>
                  <li>• Consider standby power consumption too</li>
                  {enableComparison && <li>• Use comparison to test dark vs light themes, different devices, or brightness levels</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ...existing content... */}

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(8px);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            backdrop-filter: blur(8px);
          }
          to {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInContent {
          animation: fadeInUp 0.4s ease-out forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}