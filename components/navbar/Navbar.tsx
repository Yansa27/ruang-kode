'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Brand from '@/components/layout/Brand';
import ThemeToggle from '@/components/theme/ThemeToggle';

interface NavbarProps { user?: { id: string; name: string; email: string; role: string } | null }
export default function Navbar({ user }: NavbarProps) {
  const [open, setOpen] = useState(false);
  return <header className="site-nav"><div className="page-width nav-inner"><Brand /><nav className="desktop-nav" aria-label="Navigasi utama"><Link href="/#kurikulum">Kurikulum</Link><Link href="/leaderboard">Leaderboard</Link><Link href="/verify">Sertifikat</Link></nav><div className="nav-actions"><ThemeToggle /><Link className="nav-login" href={user ? '/dashboard' : '/login'}>{user ? 'Dashboard' : 'Masuk'}</Link><Link className="button-primary nav-signup" href={user ? '/learn/python-fundamental' : '/register'}>{user ? 'Belajar' : 'Mulai belajar'}<ArrowUpRight size={16} /></Link><button className="icon-button mobile-menu-button" aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></div>{open && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Navigasi seluler"><Link onClick={() => setOpen(false)} href="/#kurikulum">Kurikulum</Link><Link href="/leaderboard">Leaderboard</Link><Link href="/verify">Verifikasi sertifikat</Link><Link href={user ? '/dashboard' : '/login'}>{user ? 'Dashboard' : 'Masuk ke akun'}</Link><Link href="/register">Mulai belajar gratis</Link></nav>}</header>;
}
