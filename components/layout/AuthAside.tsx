import Brand from './Brand';
import { ArrowUpRight, Check } from 'lucide-react';
export default function AuthAside() {
  return <aside className="auth-aside"><Brand inverse /><div className="auth-story"><p className="eyebrow">BELAJAR. COBA. TUMBUH.</p><h1>Langkah kecilmu.<br />Masa depan<br /><span>yang lebih luas.</span></h1><p>Tidak harus langsung jago. Mulai dari satu baris kode, lalu temukan apa yang bisa kamu bangun.</p><div className="auth-code"><span>perjalanan.py <ArrowUpRight size={16} /></span><code><i># Mulai dari sini</i><br />while semangat:<br />&nbsp;&nbsp;belajar()<br />&nbsp;&nbsp;coba_lagi()</code><div><Check size={15} /> Setiap percobaan adalah kemajuan.</div></div></div><p className="auth-aside-footer">RuangKode · Ruang untuk developer berikutnya.</p></aside>;
}
