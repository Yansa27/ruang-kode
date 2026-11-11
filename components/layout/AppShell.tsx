'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, Trophy, Users, UserRound, Shield, Search, LogOut, Menu, X, ArrowUpRight, WifiOff } from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useNetworkStatus } from '@/lib/offline';
import CommandPalette from './CommandPalette';
import Brand from './Brand';

interface AppShellProps { user: { id: string; name: string; email: string; role: string }; children: React.ReactNode; courseSlug?: string }
export default function AppShell({ user, children, courseSlug = 'python-fundamental' }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const online = useNetworkStatus();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(value => !value); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  const links = [
    { href: '/dashboard', label: 'Ringkasan', icon: LayoutDashboard },
    { href: `/learn/${courseSlug}`, label: 'Kelas saya', icon: BookOpen },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/referral', label: 'Ajak teman', icon: Users },
    { href: '/profile', label: 'Profil & pencapaian', icon: UserRound },
    ...(user.role === 'ADMIN' ? [{ href: '/admin', label: 'Kelola platform', icon: Shield }] : []),
  ];
  async function logout() {
    try { const res = await fetch('/api/auth/logout', { method: 'POST' }); if (!res.ok) throw new Error(); router.push('/login'); router.refresh(); }
    catch { setLogoutError('Gagal keluar. Silakan coba lagi.'); }
  }
  return <div className="app-shell">
    <a className="skip-link" href="#app-content">Lewati ke konten</a>
    {open && <button className="sidebar-overlay" aria-label="Tutup navigasi" onClick={() => setOpen(false)} />}
    <aside className={`app-sidebar ${open ? 'is-open' : ''}`} aria-label="Navigasi aplikasi"><div className="sidebar-brand"><Brand href="/dashboard" /><button className="icon-button mobile-menu-button" aria-label="Tutup menu" onClick={() => setOpen(false)}><X size={20} /></button></div><div className="sidebar-body"><p className="sidebar-label">WORKSPACE</p><nav>{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? 'page' : undefined} className={`sidebar-link ${pathname === href || pathname.startsWith(href + '/') ? 'active' : ''}`}><Icon size={19} /><span>{label}</span></Link>)}</nav><div className="sidebar-course"><p className="sidebar-label">SEDANG DIPELAJARI</p><Link href={`/learn/${courseSlug}`}><span className="course-mini">py</span><div><strong>Python Fundamental</strong><span>Jalur untuk pemula</span></div></Link></div><div className="sidebar-note"><span className="status-dot" /><h3>Sedikit, tapi konsisten.</h3><p>Satu materi hari ini adalah satu langkah lebih dekat ke tujuanmu.</p><Link href={`/learn/${courseSlug}`}>Buka ruang belajar <ArrowUpRight size={16} /></Link></div></div><div className="sidebar-user"><Link href="/profile"><span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span><span><strong>{user.name}</strong><small>{user.role === 'ADMIN' ? 'Administrator' : 'Akun pelajar'}</small></span></Link><button className="icon-button" onClick={logout} aria-label="Keluar akun"><LogOut size={18} /></button>{logoutError && <p role="alert">{logoutError}</p>}</div></aside>
    <div className="app-canvas"><header className="app-header"><div className="app-breadcrumb"><button className="icon-button mobile-menu-button" onClick={() => setOpen(true)} aria-label="Buka menu" aria-expanded={open}><Menu size={21} /></button><span>Ruang belajarmu</span><span>/</span><strong>{links.find(link => pathname === link.href)?.label ?? 'RuangKode'}</strong></div><div className="header-tools"><button className="app-search" onClick={() => setSearchOpen(true)} aria-label="Cari materi dan halaman"><Search size={17} /><span>Cari sesuatu…</span><kbd>⌘ K</kbd></button><ThemeToggle /><Link href="/profile" className="user-avatar" aria-label="Buka profil">{user.name.charAt(0).toUpperCase()}</Link></div></header>{!online && <div className="offline-banner"><WifiOff size={16} /> Kamu sedang offline. Kode yang sudah dimuat tetap bisa dijalankan.</div>}<div id="app-content" className="app-content">{children}</div></div><CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} userRole={user.role} courseSlug={courseSlug} />
  </div>;
}
