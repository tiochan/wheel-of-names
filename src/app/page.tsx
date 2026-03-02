'use client';

import React, { useEffect, useState } from 'react';
import WheelOfNames from '@/components/WheelOfNames';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function Home() {
  const [names, setNames] = useState<string[]>(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']);
  const [newName, setNewName] = useState('');
  const [hasSpun, setHasSpun] = useState(false);
  const [initialNames, setInitialNames] = useState<string[]>(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']);

  // Load names from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wheelOfNames');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNames(parsed);
        setInitialNames(parsed);
      } catch {}
    }
  }, []);

  // Save names to localStorage whenever names change, but only before first spin
  useEffect(() => {
    if (!hasSpun) {
      localStorage.setItem('wheelOfNames', JSON.stringify(names));
    }
  }, [names, hasSpun]);

  const addName = () => {
    if (newName.trim() && !names.includes(newName.trim())) {
      setNames([...names, newName.trim()]);
      setNewName('');
    }
  };

  const removeName = (index: number) => {
    setNames(names.filter((_, i: number) => i !== index));
  };

  // Remove winner by name, and mark that a spin has occurred
  const removeWinner = (winner: string) => {
    setNames((prev) => prev.filter((name) => name !== winner));
    setHasSpun(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addName();
    }
  };

  // Reset to original list
  const resetNames = () => {
    setNames(initialNames);
    setHasSpun(false);
  };

  // Shuffle names randomly
  const shuffleNames = () => {
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setNames(shuffled);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Names Management Panel */}
          <div className="xl:w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Manage Names</h2>
              <ThemeSwitcher />
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a name..."
                className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
              />
              <button
                onClick={addName}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-md transition-colors whitespace-nowrap"
                title="Add name"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              <button
                onClick={resetNames}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-md transition-colors whitespace-nowrap"
                title="Reset to original list"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>

            <div className="space-y-2 min-h-[100px] max-h-[60vh] overflow-y-auto">
              {names.map((name: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-gray-800 dark:text-gray-200">{name}</span>
                  <button
                    onClick={() => removeName(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Total names: {names.length}
            </div>
          </div>

          {/* Wheel */}
          <div className="xl:w-2/3">
            <WheelOfNames names={names} onRemoveName={removeWinner} onShuffleNames={shuffleNames} />
          </div>
        </div>
      </div>
    </div>
  );
}