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
  ChevronRight,
  Trophy,
  Zap
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden font-sans">
      <Navbar user={userWithStats} />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] -z-10" />
        
        <div className="relative max-w-5xl mx-auto w-full z-10">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-8 shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            Platform Belajar Koding #1 untuk Mahasiswa
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-[76px] font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.15]">
            Jago Koding Tanpa <br className="hidden md:block" />
            <span className="text-blue-600">Ribet Instalasi.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            Cara paling gampang buat mahasiswa belajar Python. Baca materi seru, tulis kode langsung di browser, dan raih sertifikatmu sekarang juga!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            {user ? (
              <Link
                href="/dashboard"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
              >
                Gas Lanjut Belajar!
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                href="/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
              >
                Mulai Belajar Gratis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <Link
              href="/learn/python-fundamental"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              Intip Kurikulumnya
            </Link>
          </div>
        </div>

        {/* Friendly Terminal Preview */}
        <div className="relative w-full max-w-4xl mx-auto px-4 z-10">
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-2xl overflow-hidden text-left ring-4 ring-white">
            <div className="flex items-center px-4 py-3 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="mx-auto text-xs font-semibold text-slate-500 bg-slate-200/50 px-3 py-1 rounded-md">
                latihan_pertama.py
              </div>
              <div className="w-12" /> {/* Spacer */}
            </div>
            <div className="bg-white">
              <LandingPageClient />
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="border-y border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-slate-100">
            {[
              { value: totalLessons, label: 'Modul Seru' },
              { value: '4', label: 'Chapter Padat' },
              { value: '100%', label: 'Jalan di Browser' },
              { value: 'XP', label: 'Sistem Gamifikasi' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center text-center px-4">
                <div className="text-3xl font-extrabold text-blue-600 mb-1">{value}</div>
                <div className="text-sm font-semibold text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl mb-16 text-center mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Kenapa Belajar di <span className="text-blue-600">RuangKode?</span>
            </h2>
            <p className="text-lg text-slate-600">
              Kami merancang platform ini khusus untuk mahasiswa yang ingin belajar tanpa stres dengan hal-hal teknis yang rumit di awal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Cpu,
                title: 'Langsung Koding di Browser',
                desc: 'Nggak usah repot install Python atau text editor. Buka browser, langsung tulis kode, dan lihat hasilnya detik itu juga!',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: CheckCircle2,
                title: 'Sistem Koreksi Otomatis',
                desc: 'Setiap jawabanmu akan langsung dinilai oleh test case pintar kami. Nggak perlu nunggu asisten lab buat ngecek kodinganmu.',
                color: 'bg-emerald-100 text-emerald-600',
              },
              {
                icon: Trophy,
                title: 'Belajar Sambil Main Game',
                desc: 'Kumpulkan XP, pertahankan streak harianmu, dan balapan nilai sama mahasiswa lain di fitur Leaderboard.',
                color: 'bg-amber-100 text-amber-600',
              },
              {
                icon: Code2,
                title: 'Kurikulum Ramah Pemula',
                desc: 'Dari sekadar nulis "Hello World" sampai bikin fungsi yang kompleks, semua disusun rapi banget biar gampang dicerna.',
                color: 'bg-indigo-100 text-indigo-600',
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex gap-6 rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${color}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW ── */}
      <section className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Cara Kerjanya Gampang Banget
            </h2>
            <p className="text-lg text-slate-600">Nggak pake teori panjang lebar. Langsung praktik!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Baca', desc: 'Pahami konsepnya lewat materi yang ringkas.' },
              { num: '2', title: 'Tulis', desc: 'Praktikkan kodingannya di editor canggih.' },
              { num: '3', title: 'Run', desc: 'Pencet tombol run buat lihat hasil kodemu.' },
              { num: '4', title: 'Lulus!', desc: 'Pecahkan masalahnya dan raih XP-mu.' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="relative p-8 rounded-3xl border border-slate-100 bg-slate-50 text-center hover:-translate-y-1 transition-transform">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-black text-blue-600 mb-4">
                  {num}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-blue-600 text-white relative overflow-hidden">
        {/* Soft background shape */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-50" />
        
        <div className="mx-auto max-w-3xl text-center relative z-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md mb-8">
            <Zap className="h-10 w-10 text-white fill-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Siap Jadi Programmer?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
            Jangan tunda lagi. Bikin akun gratismu sekarang dan rasakan sendiri serunya koding di RuangKode.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-blue-600 shadow-xl hover:bg-blue-50 transition-colors"
              >
                Balik ke Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-blue-600 shadow-xl hover:bg-blue-50 transition-colors"
              >
                Daftar Akun Gratis
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-blue-400 bg-transparent px-8 py-4 text-base font-bold text-white hover:bg-blue-500 transition-colors"
            >
              Sudah Punya Akun
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
