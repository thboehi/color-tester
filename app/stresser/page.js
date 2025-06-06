"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";

export default function Home() {
  const [bgColor, setBgColor] = useState("bg-black");
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashSpeed, setFlashSpeed] = useState(200);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [showPriceCalculatorModal, setShowPriceCalculatorModal] = useState(false);
  
  // États pour le calculateur de prix
  const [currency, setCurrency] = useState('EUR');
  const [averageWatts, setAverageWatts] = useState('');
  const [consumptionPeriod, setConsumptionPeriod] = useState('');
  const [pricePerKwh, setPricePerKwh] = useState('');
  const [periodUnit, setPeriodUnit] = useState('hours');

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

  // Calcul du coût
  const calculateCost = () => {
    if (!averageWatts || !consumptionPeriod || !pricePerKwh) return 0;
    
    const watts = parseFloat(averageWatts);
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
    const kWh = (watts * totalHours) / 1000;
    const totalCost = kWh * price;
    
    return totalCost;
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

  // Fermer les modales avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowHowToModal(false);
        setShowPriceCalculatorModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

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

      {/* Boutons How To et Price Calculator */}
      <div className="absolute bottom-5 left-5 z-50 flex flex-col gap-2">
        <button
          onClick={() => setShowHowToModal(true)}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all duration-500 text-gray-500 text-sm"
        >
          How To
        </button>
        <button
          onClick={() => setShowPriceCalculatorModal(true)}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all duration-500 text-gray-500 text-sm"
        >
          Price Calculator
        </button>
      </div>
      
      {/* ...existing main content... */}
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
        
        {/* Indicateur de Wake Lock */}
        <div className="mt-4">
            <p className={`text-xs ${wakeLockActive ? 'text-green-500' : 'text-red-500'}`}>
            {wakeLockActive 
                ? '✓ Screen lock disabled (While staying on this page, the screen sleep mode is disabled)' 
                : '✗ Screen lock still enabled (Your screen might turn off during the test, check the console for more details)'}
            </p>
        </div>
      </main>

      {/* Modal How To */}
      {showHowToModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer"
          onClick={() => setShowHowToModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto m-4 relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">How to Measure Screen Power Consumption</h2>
              <button
                onClick={() => setShowHowToModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
              >
                ×
              </button>
            </div>
            
            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Introduction */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📋 Overview</h3>
                <p className="text-gray-700 leading-relaxed">
                  This guide will help you measure your screen's power consumption using digital energy meters. 
                  Understanding your display's energy usage is crucial for optimizing power efficiency and calculating operational costs.
                </p>
              </section>

              {/* Equipment needed */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">🔧 Equipment Needed</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Digital Power Meter</strong> (Kill A Watt, Steffen, or similar)</li>
                  <li><strong>Computer/Device</strong> with the screen you want to test (OLED Screen will have much signicants results)</li>
                  <li><strong>Stable Power Source</strong> (wall outlet)</li>
                  <li><strong>Timer or Stopwatch</strong> for accurate measurements</li>
                </ul>
              </section>

              {/* Step by step */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📝 Step-by-Step Process</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Step 1: Setup</h4>
                    <p className="text-gray-700">Connect your digital power meter between the wall outlet and your device's power cable.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Step 2: Test Different Colors</h4>
                    <p className="text-gray-700">Use this color tester to display different colors (black, white, red, green, blue) for 5 minutes each. Record the power consumption for each color.</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Step 3: Test Flashing Mode</h4>
                    <p className="text-gray-700">Test the flashing mode at different speeds to see how rapid changes affect power consumption.</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Step 4: Use price calculator</h4>
                    <p className="text-gray-700">See how much you would pay for 8 hours of navigating in the web in dark or light mode.</p>
                  </div>
                </div>
              </section>

              {/* Tips */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">💡 Pro Tips</h3>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Take multiple measurements and calculate averages for accuracy</li>
                    <li>Ensure room temperature is consistent during testing</li>
                    <li>Test at different brightness levels if possible</li>
                    <li>For OLED screens, black pixels consume significantly less power</li>
                  </ul>
                </div>
              </section>

              {/* Image placeholder */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">📸 Setup Example</h3>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-gray-500">
                    <Image src="/img/img1.webp" alt="Installation" width={1920} height={1440} className="mx-auto mt-4" />
                    <Image src="/img/img2.webp" alt="Installation" width={1920} height={1440} className="mx-auto mt-4" />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Modal Price Calculator */}
      {showPriceCalculatorModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer"
          onClick={() => setShowPriceCalculatorModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto m-4 relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Power Consumption Cost Calculator</h2>
              <button
                onClick={() => setShowPriceCalculatorModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
              >
                ×
              </button>
            </div>
            
            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Introduction */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-gray-800">
                  Calculate how much your screen's power consumption will cost you over time. 
                  Enter your measurements and electricity rates below.
                </p>
              </div>

              {/* Formulaire */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Monnaie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white cursor-pointer"
                    >
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="GBP">British Pound (£)</option>
                      <option value="CHF">Swiss Franc (CHF)</option>
                      <option value="CAD">Canadian Dollar (C$)</option>
                      <option value="JPY">Japanese Yen (¥)</option>
                    </select>
                  </div>

                  {/* Watts moyens */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Average Power Consumption (Watts)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={averageWatts}
                      onChange={(e) => setAverageWatts(e.target.value)}
                      placeholder="e.g., 150"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 cursor-text"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Use your power meter readings from the How To guide
                    </p>
                  </div>

                  {/* Prix par kWh */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Price per kWh ({currencySymbols[currency]})
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      min="0"
                      value={pricePerKwh}
                      onChange={(e) => setPricePerKwh(e.target.value)}
                      placeholder="e.g., 0.15"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 cursor-text"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Check your electricity bill for this rate
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Période de consommation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500 cursor-text"
                      />
                      <select
                        value={periodUnit}
                        onChange={(e) => setPeriodUnit(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white cursor-pointer"
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

                  {/* Résultat */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">💰 Cost Calculation</h4>
                    
                    {averageWatts && consumptionPeriod && pricePerKwh ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-800">Power consumption:</span>
                          <span className="font-medium text-gray-900">{averageWatts}W</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-800">Usage period:</span>
                          <span className="font-medium text-gray-900">{consumptionPeriod} {periodUnit}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-800">Energy used:</span>
                          <span className="font-medium text-gray-900">
                            {((parseFloat(averageWatts) * parseFloat(consumptionPeriod) * 
                              (periodUnit === 'minutes' ? 1/60 : 
                               periodUnit === 'hours' ? 1 :
                               periodUnit === 'days' ? 24 :
                               periodUnit === 'weeks' ? 24*7 :
                               periodUnit === 'months' ? 24*30 : 24*365)) / 1000).toFixed(3)} kWh
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-800">Rate:</span>
                          <span className="font-medium text-gray-900">{pricePerKwh} {currencySymbols[currency]}/kWh</span>
                        </div>
                        <hr className="my-2 border-gray-300"/>
                        <div className="flex justify-between text-lg font-bold text-green-700">
                          <span>Total Cost:</span>
                          <span>{formatCost(calculateCost())}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 text-sm">
                        Fill in all fields above to see the calculation
                      </p>
                    )}
                  </div>

                  {/* Tips */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                    <h5 className="font-medium text-yellow-900 mb-1">💡 Tips</h5>
                    <ul className="text-xs text-yellow-800 space-y-1">
                      <li>• Different colors may have different power consumption</li>
                      <li>• OLED screens: black pixels use less power</li>
                      <li>• Test at your usual brightness setting</li>
                      <li>• Consider standby power consumption too</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ...existing content... */}
    </div>
  );
}