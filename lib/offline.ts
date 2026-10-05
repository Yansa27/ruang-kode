'use client';

import { useState, useEffect } from 'react';

// Hook to monitor browser online/offline status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Cache helper to store Pyodide assets locally in Cache Storage
export async function cachePyodideScript(url: string): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;
  try {
    const cache = await caches.open('ruangkode-pyodide-v1');
    const match = await cache.match(url);
    if (!match) {
      await cache.add(url);
    }
    return true;
  } catch (e) {
    console.warn('Pyodide offline caching not available:', e);
    return false;
  }
}
