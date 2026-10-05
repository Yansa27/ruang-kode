'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { getStoredTheme, toggleTheme, Theme } from '@/lib/theme';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export default function ThemeToggle({ className = '', size = 'sm' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getStoredTheme());
    setMounted(true);

    const onThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: Theme }>;
      if (customEvent.detail?.theme) {
        setTheme(customEvent.detail.theme);
      } else {
        setTheme(getStoredTheme());
      }
    };

    window.addEventListener('ruangkode-theme-change', onThemeChange);
    window.addEventListener('storage', onThemeChange);
    return () => {
      window.removeEventListener('ruangkode-theme-change', onThemeChange);
      window.removeEventListener('storage', onThemeChange);
    };
  }, []);

  const handleToggle = () => {
    toggleTheme();
  };

  if (!mounted) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 ${
          size === 'sm' ? 'h-7 w-7' : 'h-8 w-8'
        } ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
      className={`flex items-center justify-center rounded-lg border transition ${
        size === 'sm' ? 'h-7 w-7' : 'h-8 w-8'
      } ${
        theme === 'dark'
          ? 'border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700'
          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      } ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      ) : (
        <Moon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      )}
    </button>
  );
}
