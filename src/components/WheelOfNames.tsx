'use client';

import React, { useState, useRef, useEffect } from 'react';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import './WheelOfNames.css'; // Import custom CSS for highlight animation

interface WheelOfNamesProps {
  names: string[];
  onRemoveName?: (name: string) => void;
  onShuffleNames?: () => void;
}

export default function WheelOfNames({ names, onRemoveName, onShuffleNames }: WheelOfNamesProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [, setHighlightedIndex] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const fireworksConductor = useRef<{ run: (options: { speed: number; duration: number }) => void } | null>(null);
  const [spinStrength, setSpinStrength] = useState(3);
  const [isCharging, setIsCharging] = useState(false);
  const chargingInterval = useRef<NodeJS.Timeout | null>(null);

  // Helper to trigger fireworks
  const fireFireworks = () => {
    if (fireworksConductor.current) {
      fireworksConductor.current.run({ speed: 3, duration: 1800 });
    }
  };

  // Use fireFireworks to avoid unused warning
  useEffect(() => {
    // Function is available for future use
    void fireFireworks;
  }, [fireFireworks]);

  // Cleanup charging interval on unmount
  useEffect(() => {
    return () => {
      if (chargingInterval.current) {
        clearInterval(chargingInterval.current);
      }
    };
  }, []);

  const handleMouseDown = () => {
    if (isSpinning || names.length === 0) return;

    setIsCharging(true);
    setSpinStrength(3);

    chargingInterval.current = setInterval(() => {
      setSpinStrength(prev => Math.min(prev + 1, 10));
    }, 200);
  };

  const handleMouseUp = () => {
    if (!isCharging) return;

    setIsCharging(false);
    if (chargingInterval.current) {
      clearInterval(chargingInterval.current);
      chargingInterval.current = null;
    }

    spinWheel();
  };

  const spinWheel = () => {
    if (isSpinning || names.length === 0) return;

    setIsSpinning(true);
    setSelectedName(null);
    setHighlightedIndex(null);
    setShowFireworks(false);

    const selectedIndex = Math.floor(Math.random() * names.length);
    const segmentAngle = 360 / names.length;

    // Add randomness: ±2 rotations from the charged amount
    const randomVariation = Math.floor(Math.random() * 5) - 2; // -2 to +2
    const extraSpins = Math.max(3, spinStrength + randomVariation);

    // Add random angle offset within the segment for more variation
    const randomAngleOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);

    // Calculate the current position
    const currentRotation = rotation % 360;
    // Calculate the angle to bring the selected segment to the pointer
    const targetAngle = 360 - (selectedIndex * segmentAngle + segmentAngle / 2 + randomAngleOffset);
    // Calculate the new rotation
    const newRotation = rotation + extraSpins * 360 + ((targetAngle - currentRotation + 360) % 360);
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedName(names[selectedIndex]);
      setHighlightedIndex(selectedIndex);
      setShowFireworks(true);
      setTimeout(() => {
        if (fireworksConductor.current) {
          fireworksConductor.current.run({ speed: 3, duration: 1800 });
        }
        setTimeout(() => setShowFireworks(false), 2000);
      }, 100);
      setTimeout(() => setHighlightedIndex(null), 1800);
    }, 3000);
  };

  const segmentAngle = 360 / names.length;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8 pt-12">
      <h1 className="text-4xl font-bold text-white mb-8">Wheel of Names</h1>

      <div className="relative">
        {/* Fireworks Animation (preset) */}
        {showFireworks && (
          <Fireworks
            onInit={({ conductor }) => {
              fireworksConductor.current = conductor;
            }}
            style={{ position: 'fixed', pointerEvents: 'none', width: '100vw', height: '100vh', top: 0, left: 0 }}
          />
        )}

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400"></div>
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="w-80 h-80 rounded-full border-8 border-yellow-400 relative overflow-hidden transition-transform duration-3000 ease-out"
          style={{
            background: `conic-gradient(${names.map((_, index) => {
              const hue = (index * 137.5) % 360;
              return `hsl(${hue}, 70%, 60%) ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`;
            }).join(', ')})`,
            transform: `rotate(${rotation}deg)`
          }}
        >
          {names.map((name, index) => (
            <div
              key={index}
              className={"absolute w-full h-full flex items-center justify-center text-white font-bold text-sm"}
              style={{
                transform: `rotate(${index * segmentAngle + segmentAngle / 2}deg)`,
                transformOrigin: '50% 50%'
              }}
            >
              <span
                className="absolute"
                style={{
                  transform: `translateY(-120px) rotate(0deg)`
                }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Charging instruction - always takes up space */}
      <div className="mt-8 text-white text-sm text-center h-5">
        {!isSpinning && (
          <span className="opacity-75">Hold button to charge spin power!</span>
        )}
      </div>

      {/* Spin Button with Progress Bar */}
      <div className="mt-4 flex flex-col items-center">
        {/* Progress bar above button */}
        <div className="mb-3 w-64">
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-200 rounded-full"
              style={{
                width: `${((spinStrength - 3) / 7) * 100}%`,
                boxShadow: isCharging ? '0 0 10px rgba(251, 191, 36, 0.8)' : 'none'
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/60 mt-1">
            <span>Light</span>
            <span className="font-bold text-yellow-300">{isCharging && `Power: ${Math.round(((spinStrength - 3) / 7) * 100)}%`}</span>
            <span>Max</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 items-center">
          {/* Shuffle Button */}
          {onShuffleNames && (
            <button
              onClick={onShuffleNames}
              disabled={isSpinning || names.length === 0}
              className="p-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-full shadow-lg transition-colors duration-200"
              title="Shuffle names order"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </button>
          )}

          {/* Spin Button */}
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            disabled={isSpinning || names.length === 0}
            className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-black font-bold text-xl rounded-full shadow-lg transition-all duration-200"
            style={{
              transform: isCharging ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isCharging ? '0 0 20px rgba(251, 191, 36, 0.6)' : undefined
            }}
          >
            {isSpinning ? 'Spinning...' : isCharging ? 'Release to Spin!' : 'Hold to Spin!'}
          </button>
        </div>
      </div>

      {/* Winner display - always takes up space */}
      <div className="mt-8" style={{ minHeight: selectedName ? 'auto' : '0' }}>
        {selectedName && (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">Winner:</h2>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 text-center mt-2">{selectedName}</p>
            {onRemoveName && (
              <button
                className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full font-bold shadow"
                onClick={() => onRemoveName(selectedName)}
              >
                Remove Winner
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}