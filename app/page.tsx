import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/layout/Footer';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  ArrowRight,
  Code2,
  CheckCircle2,
  Play,
  Layers,
  BookOpen,
  Cpu,
  Terminal,
  Trophy,
  Zap,
  Sparkles,
  Users
} from 'lucide-react';
import LandingPageClient from '@/components/landing/LandingPageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'RuangKode — Belajar Coding Python. Langsung Praktik di Browser.',
  description:
    'Platform pembelajaran pemrograman interaktif untuk mahasiswa Indonesia. Kuasai Python dengan coding langsung di browser, tanpa instalasi apapun.',
};

export default async function HomePage() {
  const user = await getCurrentUser();

  let userWithStats = null;
  let courseProgress = 0;

  if (user) {
    userWithStats = await prisma.user.findUnique({
      where: { id: user.id },
      include: { stats: true, lessonProgress: true },
    });
    const completedCount = userWithStats?.lessonProgress.filter((p) => p.isCompleted).length || 0;
    courseProgress = Math.min(100, Math.round((completedCount / 10) * 100));
  }

  const course = await prisma.course.findFirst({
    where: { slug: 'python-fundamental' },
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            select: { id: true, title: true, slug: true, order: true },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  const totalLessons = course?.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0) || 10;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden font-sans">
      <Navbar user={userWithStats} />

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20"
             style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-300/30 to-transparent dark:from-blue-900/20 rounded-full blur-3xl -z-10" />
        
        <div className="relative max-w-5xl mx-auto w-full z-10 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-900/30 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-blue-700 dark:text-blue-300 mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            Platform Belajar Koding #1 untuk Mahasiswa
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
            Jago Koding Tanpa <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Ribet Instalasi.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            Cara gampang buat mahasiswa belajar Python. Tulis kode langsung di browser, dapatkan koreksi otomatis, dan raih prestasimu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto">
            {user ? (
              <Link
                href="/dashboard"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 transition-all"
              >
                Gas Lanjut Belajar!
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                href="/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 transition-all"
              >
                Mulai Belajar Gratis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <Link
              href="/learn/python-fundamental"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              Intip Kurikulum
            </Link>
          </div>
        </div>

        {/* HERO TERMINAL PREVIEW */}
        <div className="relative w-full max-w-5xl mx-auto px-4 z-10 perspective-1000">
          <div className="transform-gpu transition-all hover:scale-[1.02] duration-500 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden ring-1 ring-white/20">
            <div className="flex items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                <span className="h-3.5 w-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                <span className="h-3.5 w-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              </div>
              <div className="mx-auto flex items-center gap-2 px-4 py-1.5 rounded-md bg-slate-100/50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Terminal className="h-3 w-3" />
                <span>latihan_pertama.py</span>
              </div>
              <div className="w-16" /> {/* Spacer */}
            </div>
            <div className="bg-white/80 dark:bg-[#0B0F19]/80">
              <LandingPageClient />
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS LOGOS ── */}
      <section className="py-12 border-y border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
            {[
              { value: totalLessons, label: 'Modul Interaktif' },
              { value: '4', label: 'Chapter Pembelajaran' },
              { value: '100%', label: 'Eksekusi di Browser' },
              { value: 'XP & Peringkat', label: 'Sistem Gamifikasi' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center text-center p-4">
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</div>
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO BOX FEATURES ── */}
      <section className="py-24 px-6 relative">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl mb-16 text-center mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
              Platform Cerdas untuk <br /> <span className="text-blue-600 dark:text-blue-400">Calon Developer</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Kami menghilangkan semua kerumitan setup awal. Kamu hanya perlu fokus menulis kode dan memecahkan masalah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
            
            {/* Bento 1: Large */}
            <div className="md:col-span-2 rounded-[2rem] bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 p-8 border border-blue-100 dark:border-blue-900/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
              <Cpu className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Mesin Python di Browser</h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md leading-relaxed">
                Berkat WebAssembly, kodinganmu dieksekusi secara instan dan aman langsung di komputermu sendiri. Nol latensi.
              </p>
            </div>

            {/* Bento 2: Tall */}
            <div className="md:row-span-2 rounded-[2rem] bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
              <Trophy className="h-10 w-10 text-amber-500 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Sistem Gamifikasi</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                Setiap baris kode yang kamu tulis membawamu naik level. Bersainglah di Leaderboard dan tunjukkan siapa yang paling konsisten.
              </p>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">1</div>
                  <div>
                    <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded-full mb-1" />
                    <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">2</div>
                  <div>
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded-full mb-1" />
                    <div className="h-2 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bento 3: Square */}
            <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Koreksi Otomatis</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Nggak perlu ragu kodemu benar atau salah. Test case pintar kami memvalidasi logikamu seketika.
              </p>
            </div>

            {/* Bento 4: Square */}
            <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
              <Users className="h-10 w-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ajak Teman</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Belajar koding lebih seru bareng teman. Undang temanmu dan dapatkan XP tambahan setiap mereka menyelesaikan materi.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── WORKFLOW ── */}
      <section className="py-24 px-6 bg-white dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              Cara Kerjanya Gampang Banget
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">Nggak pake teori panjang lebar. Langsung praktik!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Baca', desc: 'Pahami konsepnya lewat materi yang ringkas.' },
              { num: '2', title: 'Tulis', desc: 'Praktikkan kodingannya di editor canggih.' },
              { num: '3', title: 'Run', desc: 'Pencet tombol run buat lihat hasil kodemu.' },
              { num: '4', title: 'Lulus!', desc: 'Pecahkan masalahnya dan raih XP-mu.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="relative p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-2xl font-black text-blue-600 dark:text-blue-400 mb-4">
                  {num}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-900" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] mix-blend-multiply opacity-50" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px] mix-blend-multiply opacity-50" />
        
        <div className="mx-auto max-w-3xl text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Saatnya Mulai Baris Kodemu Sendiri.
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan mahasiswa lain yang sudah mulai belajar Python dari nol tanpa kendala teknis.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-10 py-5 text-lg font-bold text-blue-600 shadow-2xl hover:scale-105 hover:bg-slate-50 transition-all"
          >
            Daftar Sekarang — Gratis!
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
