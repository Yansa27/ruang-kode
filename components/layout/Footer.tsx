import Link from 'next/link';
import Brand from './Brand';
export default function Footer() {
  return <footer className="site-footer"><div className="page-width footer-top"><div><Brand /><p>Ruang untuk belajar. Keberanian untuk mencoba.</p></div><nav aria-label="Navigasi footer"><Link href="/learn/python-fundamental">Kelas Python</Link><Link href="/leaderboard">Leaderboard</Link><Link href="/verify">Verifikasi sertifikat</Link></nav></div><div className="page-width footer-bottom"><span>© {new Date().getFullYear()} RuangKode</span><span>Dibuat untuk perjalanan belajarmu.</span></div></footer>;
}
