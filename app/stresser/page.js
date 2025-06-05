"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";

export default function Home() {
  const [bgColor, setBgColor] = useState("bg-black");
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashSpeed, setFlashSpeed] = useState(200); // en millisecondes
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const flashingIntervalRef = useRef(null);
  const colorPairRef = useRef({ current: "bg-white", opposite: "bg-black" });
  const wakeLockRef = useRef(null);

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

  return (
    <div className={`flex relative flex-col items-center justify-center min-h-screen ${bgColor}`}>
      {/* Bouton pour afficher/masquer les contrôles */}
      <button 
        onClick={toggleControls}
        className="absolute top-5 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-gray-400/20 hover:bg-white/20 transition-all cursor-pointer"
      >
        <span className="text-gray-500 text-lg">
          {controlsVisible ? '×' : '+'}
        </span>
      </button>
      {/* Bouton pour retourner à la page principale */}
      <div className="absolute top-5 left-5 z-50 group">
        <button
          onClick={() => window.location.href = '/'}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-gray-400/20 hover:bg-white/20 transition-all duration-300 cursor-pointer text-gray-500 hover:w-auto hover:px-4 hover:gap-2"
        >
          <Image src="/arrow-left.svg" alt="Home" width={10} height={10} className="w-4 h-4" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm overflow-hidden max-w-0 group-hover:max-w-xs">
            Home
          </span>
        </button>
      </div>
      
      <main className={`flex flex-col gap-6 items-center justify-center min-h-screen py-2 font-[family-name:var(--font-geist-mono)] transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Boutons de couleurs */}
        <button onClick={() => setBgColor("bg-black")} className="bg-white/0 hover:bg-gray-400/10 flex items-center justify-between px-8 py-1 z-50 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all">
          <p className="text-gray-500">Black</p>
        </button>
        <button onClick={() => setBgColor("bg-white")} className="bg-white/0 hover:bg-gray-400/10 flex items-center justify-between px-8 py-1 z-50 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all">
          <p className="text-gray-500">White</p>
        </button>
        
        <button onClick={() => setBgColor("bg-red-full")} className="bg-white/0 hover:bg-gray-400/10 flex items-center justify-between px-8 py-1 z-50 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all">
          <p className="text-gray-500">Red</p>
        </button>
        <button onClick={() => setBgColor("bg-green-full")} className="bg-white/0 hover:bg-gray-400/10 flex items-center justify-between px-8 py-1 z-50 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all">
          <p className="text-gray-500">Green</p>
        </button>
        <button onClick={() => setBgColor("bg-blue-full")} className="bg-white/0 hover:bg-gray-400/10 flex items-center justify-between px-8 py-1 z-50 rounded-full backdrop-blur-sm border border-gray-400/20 cursor-pointer transition-all">
          <p className="text-gray-500">Blue</p>
        </button>
        
        {/* Contrôles pour le mode clignotement */}
        <div className="flex flex-col gap-4 items-center mt-6">
          <button 
            onClick={toggleFlashing} 
            className={`bg-white/0 hover:bg-gray-400/10 flex items-center justify-between px-8 py-1 z-50 rounded-full backdrop-blur-sm border ${isFlashing ? 'border-red-400' : 'border-gray-400/20'} cursor-pointer transition-all`}
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
      
      <Footer />
    </div>
  );
}