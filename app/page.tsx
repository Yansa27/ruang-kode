import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/layout/Footer';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ArrowUpRight, ArrowRight, Check, Code2, BookOpen, Terminal, Trophy } from '@/components/ui/icons';
import LandingPageClient from '@/components/landing/LandingPageClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Belajar Python, satu baris setiap hari', description: 'Belajar Python dari dasar, praktik langsung di browser, dan lihat progresmu di RuangKode.' };

export default async function HomePage() {
  const user = await getCurrentUser();
  const course = await prisma.course.findFirst({ where: { slug: 'python-fundamental' }, include: { chapters: { orderBy: { order: 'asc' }, include: { lessons: { select: { id: true }, orderBy: { order: 'asc' } } } } } });
  const totalLessons = course?.chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0) ?? 0;
  return <div className="marketing-page">
    <Navbar user={user} />
    <main id="main-content">
      <section className="home-hero page-width">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> RUANG UNTUK MULAI, BERANI MENCOBA.</div>
          <h1>Dari penasaran,<br />jadi bisa <span>ngoding.</span></h1>
          <p>Belajar Python dari nol dengan cara yang paling masuk akal: langsung praktik. Buka browser, tulis kode, dan lihat hasilnya.</p>
          <div className="hero-actions"><Link className="button-primary" href={user ? '/dashboard' : '/register'}>{user ? 'Kembali ke dashboard' : 'Mulai belajar gratis'}<ArrowUpRight size={19} /></Link><a className="button-text" href="#kurikulum">Lihat kurikulum <ArrowRight size={17} /></a></div>
          <div className="hero-benefits"><span><Check size={15} /> Tanpa instalasi</span><span><Check size={15} /> Bahasa Indonesia</span><span><Check size={15} /> Untuk pemula</span></div>
        </div>
        <div className="hero-preview"><div className="preview-caption"><span><span className="status-dot" /> RUANG PRAKTIKMU</span><span>Python / 01</span></div><LandingPageClient /><div className="preview-footnote"><Code2 size={17} /><span>Kesalahan itu bagian dari belajar. Coba lagi, sampai bisa.</span></div></div>
      </section>
      <div className="learning-strip"><div className="page-width"><span>BELAJAR DENGAN MELAKUKAN</span><span><BookOpen size={18} /> Materi bertahap</span><span><Terminal size={18} /> Editor interaktif</span><span><Check size={18} /> Evaluasi otomatis</span><span><Trophy size={18} /> XP & sertifikat</span></div></div>
      <section id="kurikulum" className="curriculum-section page-width">
        <div className="section-heading"><div><p className="eyebrow">JALUR BELAJAR</p><h2>Fondasi kecil.<br />Kemungkinan besar.</h2></div><p>Mulai dari dasar Python, lalu bangun pemahamanmu lewat latihan di setiap materi. Satu langkah dalam satu waktu.</p></div>
        <div className="curriculum-layout"><div className="course-feature"><span className="course-language">py<span>_</span></span><div><span className="course-level">PEMULA</span><h3>Python Fundamental</h3><p>Kenali sintaks, pahami logika, dan tulis program pertamamu.</p></div><div className="course-meta"><span>{course?.chapters.length ?? 0} bab</span><span>{totalLessons} materi</span><span>Praktik mandiri</span></div><Link href="/learn/python-fundamental" className="button-primary">Buka kelas Python <ArrowUpRight size={18} /></Link></div>
          <div className="chapter-list">{course?.chapters.length ? course.chapters.map((chapter, index) => <Link href="/learn/python-fundamental" className="chapter-row" key={chapter.id}><span className="chapter-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{chapter.title}</h3><p>{chapter.lessons.length} materi interaktif</p></div><ArrowUpRight size={21} /></Link>) : <div className="chapter-row"><p>Kurikulum sedang disiapkan. Kembali lagi segera.</p></div>}</div></div>
      </section>
      <section className="practice-section"><div className="page-width practice-layout"><div><p className="eyebrow">BUKAN SEKADAR MENONTON</p><h2>Paham karena<br />kamu mencobanya.</h2><p>Belajar bukan tentang menghafal semua sintaks. Ini tentang menemukan cara memecahkan masalah dengan kode.</p><Link className="button-text" href={user ? '/dashboard' : '/register'}>Temukan ritme belajarmu <ArrowRight size={18} /></Link></div><div className="practice-steps">{[{ number: '01', title: 'Baca konsepnya', text: 'Materi ringkas dalam bahasa Indonesia, dengan contoh yang bisa kamu ikuti.' }, { number: '02', title: 'Tulis dan jalankan', text: 'Editor Python langsung di browser. Tidak perlu mengatur lingkungan development.' }, { number: '03', title: 'Lihat hasil. Coba lagi.', text: 'Periksa hasil latihanmu, perbaiki kode, dan lanjutkan ke tantangan berikutnya.' }].map(step => <div className="practice-step" key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></div>)}</div></div></section>
      <section className="closing-section page-width"><div><p className="eyebrow">BARIS PERTAMAMU MENUNGGU</p><h2>Semua developer<br />pernah mulai dari nol.</h2></div><div><p>Sekarang giliranmu. Siapkan rasa ingin tahu,<br />ruang belajarnya sudah ada.</p><Link className="button-primary" href={user ? '/dashboard' : '/register'}>{user ? 'Lanjutkan perjalananmu' : 'Buat akun gratis'}<ArrowUpRight size={19} /></Link></div></section>
    </main><Footer />
  </div>;
}
