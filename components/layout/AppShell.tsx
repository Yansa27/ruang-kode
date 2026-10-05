'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Trophy,
  User as UserIcon,
  Shield,
  Search,
  Bell,
  Terminal,
  LogOut,
  Menu,
  X,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useNetworkStatus } from '@/lib/offline';
import CommandPalette from '@/components/layout/CommandPalette';

interface AppShellUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AppShellProps {
  user: AppShellUser;
  children: React.ReactNode;
  courseSlug?: string;
}

export default function AppShell({
  user,
  children,
  courseSlug = 'python-fundamental',
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isOnline = useNetworkStatus();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global Cmd+K / Ctrl+K to open Command Palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive: pathname === '/dashboard',
    },
    {
      href: `/learn/${courseSlug}`,
      label: 'Course',
      icon: BookOpen,
      isActive: pathname.startsWith('/learn'),
    },
    {
      href: '/leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      isActive: pathname === '/leaderboard',
    },
    {
      href: '/profile',
      label: 'Progress & Profil',
      icon: TrendingUp,
      isActive: pathname === '/profile',
    },
  ];

  if (!mounted) {
    return <div suppressHydrationWarning className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950" />;
  }

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-150"
    >
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* UNIFIED LEFT SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-xl lg:shadow-none' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs ring-1 ring-blue-500/20 group-hover:scale-105 transition-transform duration-150">
              <Terminal className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  Ruang<span className="text-blue-600 dark:text-blue-400">Kode</span>
                </span>
                <span className="rounded-md bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-wide">
                  PRO
                </span>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                Platform Belajar Python
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup Menu"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 lg:hidden transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Sidebar Body */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          {/* Section: Menu Utama */}
          <div>
            <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Menu Utama
            </p>
            <nav className="space-y-1.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-medium transition group ${
                      item.isActive
                        ? 'bg-blue-50/90 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-semibold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-colors ${
                        item.isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.href === '/leaderboard' && (
                      <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                    )}
                  </Link>
                );
              })}

              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    pathname === '/admin'
                      ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 shadow-sm'
                      : 'text-purple-700 dark:text-purple-400 hover:bg-purple-50/60 dark:hover:bg-purple-950/30'
                  }`}
                >
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="flex-1">Admin Panel</span>
                  <span className="rounded bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300">
                    CMS
                  </span>
                </Link>
              )}
            </nav>
          </div>

          {/* Section: Kurikulum & Jalur Belajar */}
          <div>
            <div className="flex items-center justify-between px-3 mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Jalur Belajar
              </p>
              <span className="text-xs text-slate-400 font-mono">1/3</span>
            </div>
            <div className="space-y-1.5">
              <Link
                href={`/learn/${courseSlug}`}
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-white border border-slate-200/60 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 shrink-0" />
                  <span className="truncate font-semibold">Python Fundamental</span>
                </div>
                <span className="rounded bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                  Aktif
                </span>
              </Link>

              <div className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                  <span className="truncate">Struktur Data Python</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Segera</span>
              </div>

              <div className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                  <span className="truncate">Web Backend Python</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Segera</span>
              </div>
            </div>
          </div>

          {/* Quick Learning Resume Card */}
          <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-300">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Lanjutkan Belajar
              </span>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                Python 101
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Kuasai sintaksis dasar dan evaluasi kode otomatis secara langsung di browser.
            </p>
            <Link
              href={`/learn/${courseSlug}`}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-sm font-semibold text-white shadow-sm transition-all"
            >
              <span>Buka IDE Belajar</span>
              <span className="text-sm">→</span>
            </Link>
          </div>
        </div>

        {/* Anchored Bottom User Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 min-w-0 flex-1 rounded-xl p-2 hover:bg-white dark:hover:bg-slate-800 transition group"
            >
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {user.role === 'ADMIN' ? 'Administrator' : 'Mahasiswa'}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 shrink-0">
              <ThemeToggle size="md" />
              <button
                onClick={handleLogout}
                title="Keluar Akun"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW CANVAS */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Offline Banner if disconnected */}
        {!isOnline && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2">
            <WifiOff className="h-3.5 w-3.5" />
            <span>Mode Offline Aktif — Python WebAssembly tetap dapat dijalankan secara lokal di browser!</span>
          </div>
        )}

        {/* UNIFIED TOP HEADER */}
        <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Search Bar → Opens Command Palette */}
            <button
              onClick={() => setCmdOpen(true)}
              className="relative w-full hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 py-1.5 pl-3 pr-10 text-xs text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-600 transition group"
              aria-label="Buka Command Palette"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 text-left">Cari course, materi, atau perintah...</span>
              <span className="absolute right-2.5 flex items-center gap-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                <kbd className="px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">⌘</kbd>
                <kbd className="px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">K</kbd>
              </span>
            </button>
          </div>

          {/* Right Header: Theme Toggle, Notification & User Pill */}
          <div className="flex items-center gap-2.5">
            {/* Global Theme Toggle */}
            <ThemeToggle size="md" />

            <button
              title="Notifikasi"
              className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* User Profile Capsule */}
            <Link
              href="/profile"
              className="flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 pr-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-2xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {user.role === 'ADMIN' ? 'Administrator' : 'Mahasiswa'}
                </p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        userRole={user.role}
        courseSlug={courseSlug}
      />
    </div>
  );
}
