'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Terminal,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    stats?: {
      xp: number;
      streak: number;
    } | null;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { href: '/learn/python-fundamental', label: 'Kurikulum' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/verify', label: 'Verifikasi' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md border-slate-200 py-3'
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="mx-auto flex items-center justify-between px-6 max-w-7xl">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm group-hover:scale-105 transition-transform">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Ruang<span className="text-blue-600">Kode</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-blue-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className={`text-sm font-bold transition-colors ${
                  pathname === '/dashboard'
                    ? 'text-blue-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Profilku
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-100 px-5 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {isLoggingOut ? 'Keluar...' : 'Keluar'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                >
                  Daftar Gratis
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 absolute top-full left-0 right-0 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-base font-bold text-slate-600 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block text-base font-bold text-slate-600 hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block text-base font-bold text-slate-600 hover:text-blue-600"
                >
                  Profilku
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="block text-base font-bold text-slate-600 hover:text-red-600 text-left w-full pt-2 border-t border-slate-100 mt-2"
                >
                  Keluar
                </button>
              </>
            )}
            {!user && (
              <div className="pt-4 flex flex-col gap-3 border-t border-slate-100 mt-2">
                <Link
                  href="/login"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 text-base font-bold text-slate-700"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white shadow-md shadow-blue-500/20"
                >
                  Daftar Gratis
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
