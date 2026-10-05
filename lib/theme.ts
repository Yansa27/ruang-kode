'use client';

// Lightweight, zero-flash global theme manager for RuangKode

export type Theme = 'light' | 'dark';

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem('ruangkode_theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try {
    localStorage.setItem('ruangkode_theme', theme);
  } catch {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ruangkode-theme-change', { detail: { theme } }));
  }
}

export function toggleTheme(): Theme {
  const isCurrentlyDark = typeof document !== 'undefined' 
    ? document.documentElement.classList.contains('dark')
    : getStoredTheme() === 'dark';
  const next: Theme = isCurrentlyDark ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
