import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function Brand({ href = '/', inverse = false }: { href?: string; inverse?: boolean }) {
  return <Link href={href} className={`brand ${inverse ? 'brand-inverse' : ''}`} aria-label="RuangKode beranda"><span className="brand-symbol"><Terminal size={22} strokeWidth={2.5} /></span><span>ruang<span className="brand-accent">kode</span><span className="brand-dot">.</span></span></Link>;
}
