'use client';

import { useState, useEffect } from 'react';

const CONSENT_KEY = 'localStorage-consent';

export default function LocalStorageConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem(CONSENT_KEY);
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Storage Notice
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed">
          We use cookies and local storage only to make our site work and remember your preferences. We do not use them for tracking or analytics.
        </p>
        <button
          onClick={handleAccept}
          className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}