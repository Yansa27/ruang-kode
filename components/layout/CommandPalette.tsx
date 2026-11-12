'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  BookOpen,
  Trophy,
  User,
  Shield,
  LogOut,
  Sun,
  Moon,
  Award,
  FileText,
  ChevronRight,
  Hash,
  Code2,
  ShieldCheck,
} from '@/components/ui/icons';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  group: string;
  action: () => void;
  keywords?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  userRole?: string;
  courseSlug?: string;
}

export default function CommandPalette({
  open,
  onClose,
  userRole,
  courseSlug = 'python-fundamental',
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
      onClose();
    },
    [router, onClose]
  );

  const toggleTheme = useCallback(() => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ruangkode-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ruangkode-theme', 'dark');
    }
    onClose();
  }, [onClose]);

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    onClose();
  }, [router, onClose]);

  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');

  const allCommands: CommandItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Halaman utama belajar & progres',
      icon: <LayoutDashboard className="h-4 w-4" />,
      group: 'Navigasi',
      action: () => navigate('/dashboard'),
      keywords: 'beranda home main',
    },
    {
      id: 'learn',
      label: 'Buka Course',
      description: 'Python Fundamental — materi & latihan',
      icon: <BookOpen className="h-4 w-4" />,
      group: 'Navigasi',
      action: () => navigate(`/learn/${courseSlug}`),
      keywords: 'belajar kode coding python materi lesson',
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      description: 'Papan peringkat mahasiswa mingguan',
      icon: <Trophy className="h-4 w-4" />,
      group: 'Navigasi',
      action: () => navigate('/leaderboard'),
      keywords: 'ranking peringkat skor xp',
    },
    {
      id: 'profile',
      label: 'Profil & Statistik',
      description: 'XP, streak, riwayat, dan sertifikat',
      icon: <User className="h-4 w-4" />,
      group: 'Navigasi',
      action: () => navigate('/profile'),
      keywords: 'akun user statistik xp badge',
    },
    {
      id: 'verify',
      label: 'Verifikasi Sertifikat',
      description: 'Cek keaslian sertifikat kelulusan',
      icon: <ShieldCheck className="h-4 w-4" />,
      group: 'Navigasi',
      action: () => navigate('/verify'),
      keywords: 'sertifikat credential cek validasi',
    },
    ...(userRole === 'ADMIN'
      ? [
          {
            id: 'admin',
            label: 'Admin Panel',
            description: 'Manajemen course, lesson, dan exercise',
            icon: <Shield className="h-4 w-4" />,
            group: 'Admin',
            action: () => navigate('/admin'),
            keywords: 'cms content manage admin',
          },
        ]
      : []),
    {
      id: 'toggle-theme',
      label: isDark ? 'Mode Terang' : 'Mode Gelap',
      description: isDark ? 'Beralih ke tampilan terang' : 'Beralih ke tampilan gelap',
      icon: isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
      group: 'Pengaturan',
      action: toggleTheme,
      keywords: 'tema dark light mode gelap terang',
    },
    {
      id: 'logout',
      label: 'Keluar Akun',
      description: 'Logout dari sesi saat ini',
      icon: <LogOut className="h-4 w-4 text-red-500" />,
      group: 'Pengaturan',
      action: handleLogout,
      keywords: 'logout signout keluar exit',
    },
  ];

  const filtered = query.trim()
    ? allCommands.filter((cmd) => {
        const q = query.toLowerCase();
        return (
          cmd.label.toLowerCase().includes(q) ||
          (cmd.description?.toLowerCase().includes(q) ?? false) ||
          (cmd.keywords?.toLowerCase().includes(q) ?? false)
        );
      })
    : allCommands;

  // Group filtered commands
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  // Reset when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        flatFiltered[activeIndex]?.action();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, flatFiltered, activeIndex, onClose]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  let globalIndex = 0;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Palette Panel */}
      <div
        className="relative w-full max-w-xl rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari perintah, halaman, atau pengaturan..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-400 bg-slate-50 dark:bg-slate-800">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <ul
          ref={listRef}
          className="max-h-80 overflow-y-auto py-2"
          role="listbox"
        >
          {Object.entries(grouped).length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-slate-400">
              Tidak ada perintah yang cocok dengan &ldquo;{query}&rdquo;
            </li>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <li key={group}>
                {/* Group Header */}
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group}
                </p>
                <ul>
                  {items.map((cmd) => {
                    const itemIndex = globalIndex++;
                    const isActive = itemIndex === activeIndex;
                    return (
                      <li
                        key={cmd.id}
                        data-active={isActive}
                        role="option"
                        aria-selected={isActive}
                        onClick={cmd.action}
                        onMouseEnter={() => setActiveIndex(itemIndex)}
                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span
                          className={`shrink-0 ${
                            isActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {cmd.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{cmd.label}</p>
                          {cmd.description && (
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                              {cmd.description}
                            </p>
                          )}
                        </div>
                        {isActive && (
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-blue-500 dark:text-blue-400" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))
          )}
        </ul>

        {/* Footer Hints */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2 flex items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono">↑↓</kbd>
            Navigasi
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono">↵</kbd>
            Pilih
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono">Esc</kbd>
            Tutup
          </span>
        </div>
      </div>
    </div>
  );
}
