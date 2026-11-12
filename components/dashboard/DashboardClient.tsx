'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { soundFx } from '@/lib/sound';
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Award,
  User as UserIcon,
  Search,
  Bell,
  Play,
  CheckCircle2,
  Circle,
  Flame,
  Zap,
  Code2,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Terminal,
  LogOut,
  Menu,
  X,
  Target,
  Quote,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Star,
  Check,
  Trophy,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

interface LessonItem {
  id: string;
  slug: string;
  title: string;
  order: number;
  description: string;
}

interface ChapterItem {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  lessons: LessonItem[];
}

interface CourseData {
  id: string;
  slug: string;
  title: string;
  level: string;
  chapters: ChapterItem[];
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  stats?: {
    xp: number;
    streak: number;
    completedLessonsCount: number;
    completedExercisesCount: number;
  } | null;
}

interface ActivityItem {
  id: string;
  isCompleted: boolean;
  updatedAt: string | Date;
  lesson: {
    id: string;
    title: string;
    slug: string;
    chapter: {
      title: string;
    };
  };
}

interface DashboardClientProps {
  user: UserData;
  course: CourseData;
  completedLessonIds: string[];
  recentActivities: ActivityItem[];
  nextLesson?: LessonItem | null;
  certificateNumber?: string | null;
  topStudents?: { id: string; name: string; xp: number; rank: number }[];
  communityLink?: string | null;
}

// Authentic SVG Python Logo
function PythonLogo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} aria-label="Python Logo">
      <path
        fill="#387EB8"
        d="M63.7 3.5c-15.5 0-24.8 6.8-24.8 19.8v14.4h25.4v3.6H27.9C12.3 41.3 0 51.6 0 71.7c0 20.3 10.8 30.6 25.4 30.6h7.7v-10.8c0-14.7 12.3-25.2 27-25.2h25.2c12.2 0 21.6-9.8 21.6-21.6V23.3c0-13-10.3-19.8-23.2-19.8zm-13.9 7.6c2.7 0 4.9 2.2 4.9 4.9s-2.2 4.9-4.9 4.9-4.9-2.2-4.9-4.9 2.2-4.9 4.9-4.9z"
      />
      <path
        fill="#FFE052"
        d="M64.3 124.5c15.5 0 24.8-6.8 24.8-19.8V90.3H63.7v-3.6h36.4c15.6 0 27.9-10.3 27.9-30.4 0-20.3-10.8-30.6-25.4-30.6h-7.7v10.8c0 14.7-12.3 25.2-27 25.2H42.7c-12.2 0-21.6 9.8-21.6 21.6v21.4c0 13 10.3 19.8 23.2 19.8zm13.9-7.6c-2.7 0-4.9-2.2-4.9-4.9s2.2-4.9 4.9-4.9 4.9-2.2 4.9-4.9 2.2-4.9 4.9-4.9z"
      />
    </svg>
  );
}

export default function DashboardClient({
  user,
  course,
  completedLessonIds: initialCompletedIds,
  recentActivities,
  nextLesson,
  certificateNumber,
  topStudents = [],
  communityLink,
}: DashboardClientProps) {
  const router = useRouter();
  const [isClaiming, setIsClaiming] = useState(false);
  const [currentCertNum, setCurrentCertNum] = useState<string | null>(certificateNumber || null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(
    course.chapters[0]?.id || null
  );

  const handleClaimCertificate = async () => {
    setIsClaiming(true);
    try {
      const res = await fetch('/api/certificate/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug: course.slug }),
      });
      const data = await res.json();
      if (res.ok && data.certificateNumber) {
        setCurrentCertNum(data.certificateNumber);
        soundFx.playSuccess();
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          router.push(`/certificate/${data.certificateNumber}`);
        }, 1200);
      } else {
        alert(data.error || 'Gagal menerbitkan sertifikat');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan jaringan saat menerbitkan sertifikat');
    } finally {
      setIsClaiming(false);
    }
  };

  const completedSet = new Set(initialCompletedIds);
  const allLessons = course.chapters.flatMap((c) => c.lessons);
  const totalLessons = allLessons.length;
  const completedCount = completedSet.size;
  const inProgressCount = Math.max(0, nextLesson && !completedSet.has(nextLesson.id) ? 1 : 0);
  const notStartedCount = Math.max(0, totalLessons - completedCount - inProgressCount);
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Level & XP
  const totalXp = user.stats?.xp || 0;
  const userLevel = Math.floor(totalXp / 100) + 1;
  const xpCurrentLevel = totalXp % 100;
  const xpForNextLevel = 100;

  // Streak Days
  const daysOfWeek = [
    { label: 'Sen', active: true },
    { label: 'Sel', active: true },
    { label: 'Rab', active: user.stats?.streak ? user.stats.streak >= 3 : false },
    { label: 'Kam', active: false },
    { label: 'Jum', active: false },
    { label: 'Sab', active: false },
    { label: 'Min', active: false },
  ];

  // Badges data with clean minimal aesthetic
  const badges = [
    {
      id: 'first_lesson',
      title: 'First Lesson',
      xp: '+50 XP',
      icon: <Star className="h-4 w-4 fill-emerald-600 text-emerald-600" />,
      badgeBg: 'bg-emerald-50 border-emerald-200/80 text-emerald-800',
      pillBg: 'bg-emerald-100/70 text-emerald-800',
      unlocked: completedCount >= 1,
    },
    {
      id: 'python_beginner',
      title: 'Python Beginner',
      xp: '+100 XP',
      icon: <PythonLogo className="h-4 w-4" />,
      badgeBg: 'bg-blue-50 border-blue-200/80 text-blue-800',
      pillBg: 'bg-blue-100/70 text-blue-800',
      unlocked: completedCount >= 3,
    },
    {
      id: 'consistent',
      title: 'Consistent',
      xp: '+150 XP',
      icon: <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />,
      badgeBg: 'bg-amber-50 border-amber-200/80 text-amber-800',
      pillBg: 'bg-amber-100/70 text-amber-800',
      unlocked: (user.stats?.streak || 0) >= 2,
    },
  ];

  return (
    <AppShell user={user} courseSlug={course.slug}>
      {/* DASHBOARD CONTENT BODY */}
      <main className="p-4 sm:p-6 lg:p-7 space-y-5 max-w-7xl w-full mx-auto">
        <header className="dashboard-heading"><div><p className="eyebrow">PERJALANAN BELAJARMU</p><h1>Selamat belajar, {user.name.split(' ')[0]}.</h1><p>Tidak perlu terburu-buru. Lanjutkan satu langkah hari ini.</p></div><Link href={`/learn/${course.slug}`} className="button-text">Lihat jalur belajar <ArrowRight size={16} /></Link></header>
        {/* Certificate Completion & Claim Banner */}
        {progressPercent >= 100 && (
          <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-blue-500/10 dark:from-amber-950/40 dark:via-slate-900 dark:to-blue-950/30 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-xs shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    100% SELESAI
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Kelulusan Terpenuhi
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {currentCertNum
                    ? 'Selamat! Sertifikat Kelulusan Resmi Kamu Telah Terbit'
                    : 'Selamat! Kamu Berhak Mendapatkan Sertifikat Kelulusan'}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {currentCertNum
                    ? `ID Kredensial: ${currentCertNum} • Terverifikasi permanen di sistem RuangKode`
                    : 'Klaim sertifikat digital berstandar industri dengan QR Code verifikasi resmi.'}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {currentCertNum ? (
                <Link
                  href={`/certificate/${currentCertNum}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition"
                >
                  <Award className="h-4 w-4" />
                  <span>Buka Sertifikat Digital</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <button
                  onClick={handleClaimCertificate}
                  disabled={isClaiming}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition disabled:opacity-50"
                >
                  <Award className="h-4 w-4" />
                  <span>{isClaiming ? 'Menerbitkan...' : 'Klaim Sertifikat Sekarang'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ROW 1: Hero Welcome Banner & Target Belajar Berikutnya */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Hero Card (~7-8 cols) */}
            <div className="dashboard-welcome lg:col-span-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="max-w-md z-10">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                    <Sparkles className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    <span>CERITA KEDAI KODE</span>
                  </div>

                  <h2 className="mt-2.5 text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                    Dari satu cerita, jadi satu kemampuan.
                  </h2>

                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Kamu sudah menyelesaikan <span className="font-semibold text-slate-900 dark:text-white">{completedCount} dari {totalLessons} materi</span> di Python Fundamental. Ikuti ceritanya, pahami konsepnya, lalu coba sendiri.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    {nextLesson && (
                      <Link
                        href={`/learn/${course.slug}/${nextLesson.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition"
                      >
                        <span>Lanjut Belajar</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}

                    <Link
                      href={`/learn/${course.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                      <span>Lihat kelas</span>
                    </Link>
                  </div>
                </div>

                <div className="dashboard-progress" aria-label={`Progres kelas ${progressPercent}%`}><div style={{ background: `conic-gradient(var(--primary) ${progressPercent}%, var(--border) 0)` }}><span><strong>{progressPercent}%</strong><small>perjalananmu</small></span></div><p>{completedCount} / {totalLessons} materi selesai</p></div>
              </div>
            </div>

            {/* Right Card: Target Belajar Berikutnya (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-[#173c2b] p-5 sm:p-6 text-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-blue-400">
                    <Target className="h-3.5 w-3.5" />
                    <span>Target Belajar Berikutnya</span>
                  </span>
                  <span className="rounded-md bg-slate-800/90 border border-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                    +10 Menit
                  </span>
                </div>

                <div className="mt-3.5">
                  <h3 className="text-[15px] font-bold text-white tracking-tight">
                    {nextLesson ? nextLesson.title : 'Selamat! Seluruh materi selesai'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {nextLesson ? nextLesson.description : 'Kamu telah menyelesaikan semua bab kurikulum Python Fundamental.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3.5">
                {nextLesson && (
                  <Link
                    href={`/learn/${course.slug}/${nextLesson.slug}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-500 transition"
                  >
                    <Play className="h-3 w-3 fill-white" />
                    <span>Lanjutkan cerita</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-auto" />
                  </Link>
                )}

                {/* Level Progress Gauge */}
                <div className="border-t border-slate-800 pt-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Level {userLevel}</span>
                    <span className="font-semibold text-slate-300">
                      {xpCurrentLevel} / {xpForNextLevel} XP Ke Level {userLevel + 1}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${(xpCurrentLevel / xpForNextLevel) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Third Card: Community Banner (Full width on mobile, spans 12 cols if put outside, or maybe replace right card below?) 
                Actually let's just add it as a new row or inside the right sidebar */}
          </div>
          
          {/* Komunitas Banner (Full width) */}
          {communityLink && (
            <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/20 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shrink-0">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Gabung Komunitas RuangKode</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                    Tanya jawab seputar materi dan diskusikan kode yang sedang kamu pelajari.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <a
                  href={communityLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition"
                >
                  <span>Buka grup diskusi</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}

          {/* ROW 2: 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1: Streak Belajar */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:border-slate-300 dark:hover:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Streak Belajar</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/60">
                  <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {user.stats?.streak || 1}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Hari Berturut-turut</span>
              </div>
              {/* 7-Day Tracker */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2.5">
                {daysOfWeek.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-slate-400 font-medium">{d.label}</span>
                    <div
                      className={`h-2 w-2 rounded-full transition ${
                        d.active ? 'bg-orange-500 ring-2 ring-orange-200 dark:ring-orange-900' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Stat 2: Pengalaman (XP) */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:border-slate-300 dark:hover:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Pengalaman (XP)</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/60">
                  <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {totalXp}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Total XP Terkumpul</span>
              </div>
              <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-end justify-between">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
                  <Zap className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                  <span>+30 XP per exercise selesai</span>
                </span>
                <svg className="w-16 h-6 text-blue-500 opacity-60" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0 25 Q 15 25, 25 15 T 50 15 T 75 5 T 100 0" />
                </svg>
              </div>
            </div>

            {/* Stat 3: Lesson Selesai */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:border-slate-300 dark:hover:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Lesson Selesai</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {completedCount}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">dari {totalLessons} Materi</span>
              </div>
              <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center gap-3">
                <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {progressPercent}%
                </div>
              </div>
            </div>

            {/* Stat 4: Exercise Lolos */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:border-slate-300 dark:hover:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Exercise Lolos</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Code2 className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {user.stats?.completedExercisesCount || 0}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Tantangan Diselesaikan</span>
              </div>
              <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-3 flex items-end justify-between">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
                  <Check className="h-3 w-3" />
                  <span>100% Evaluasi Otomatis</span>
                </span>
                <div className="flex items-end gap-1 h-6">
                  <div className="w-1.5 h-3 bg-emerald-200 rounded-t-sm"></div>
                  <div className="w-1.5 h-4 bg-emerald-300 rounded-t-sm"></div>
                  <div className="w-1.5 h-2 bg-emerald-200 rounded-t-sm"></div>
                  <div className="w-1.5 h-5 bg-emerald-400 rounded-t-sm"></div>
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-t-sm"></div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3: Course Curriculum & Right Sidebars */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 8 Cols: Course Roadmap */}
            <div className="lg:col-span-8 space-y-5">
              {/* Course Card */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Course yang Sedang Kamu Ikuti</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{progressPercent}%</span>
                </div>

                <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-2 shrink-0">
                      <PythonLogo className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">{course.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {course.level} • {course.chapters.length} Chapter • {totalLessons} Lesson
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/learn/${course.slug}/${nextLesson ? nextLesson.slug : ''}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition shrink-0"
                  >
                    <span>Lanjutkan</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Daftar Chapter Horizontal Scroll */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-bold">Daftar Chapter</span>
                  </div>
                  <Link
                    href={`/learn/${course.slug}`}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Lihat Silabus Lengkap</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                  {course.chapters.map((chapter, i) => {
                    const isFirst = i === 0;
                    const chLessons = chapter.lessons;
                    const chDone = chLessons.filter((l) => completedSet.has(l.id)).length;
                    const isAllDone = chDone === chLessons.length && chLessons.length > 0;
                    const isLocked = !isFirst && !isAllDone && chDone === 0 && !completedSet.has(course.chapters[i-1]?.lessons[course.chapters[i-1]?.lessons.length - 1]?.id || '');
                    const isCurrent = !isLocked && !isAllDone;

                    return (
                      <Link
                        key={chapter.id}
                        href={isLocked ? '#' : `/learn/${course.slug}`}
                        className={`min-w-[200px] sm:min-w-[220px] rounded-xl border p-4 shrink-0 snap-start flex flex-col gap-2 transition-all ${
                          isCurrent 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                            : isAllDone
                              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800/80 opacity-70 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          {isCurrent ? (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white">
                              <Play className="h-3.5 w-3.5 fill-white" />
                            </div>
                          ) : isAllDone ? (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                              <span className="text-[10px]"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                            </div>
                          )}
                          {!isCurrent && <ChevronRight className={`h-4 w-4 ${isLocked ? 'text-slate-300' : 'text-slate-400'}`} />}
                        </div>
                        <div>
                          <p className={`text-[10px] font-semibold mb-0.5 ${isCurrent ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                            Chapter {chapter.order}
                          </p>
                          <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                            {chapter.title}
                          </h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Activity Timeline, Badges & Progress Ring */}
            <div className="lg:col-span-4 space-y-5">
              {/* Aktivitas Terbaru Card */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Aktivitas Terbaru</span>
                  </h3>
                </div>

                <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {recentActivities.length > 0 ? (
                    recentActivities.slice(0, 4).map((act) => (
                      <div key={act.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/learn/${course.slug}/${act.lesson.slug}`}
                            className="font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 truncate block transition"
                          >
                            {act.lesson.title}
                          </Link>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {act.lesson.chapter.title}
                          </span>
                        </div>
                        <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                          {act.isCompleted ? 'Selesai' : 'Aktif'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-3">Belum ada riwayat aktivitas.</p>
                  )}
                </div>
              </div>

              {/* Pencapaian (Badges) Card */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Pencapaian</span>
                  </h3>
                  <Link href="/profile" className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700">
                    Lihat Semua
                  </Link>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  {badges.map((b) => (
                    <div
                      key={b.id}
                      className={`rounded-xl border p-2.5 flex flex-col items-center justify-between transition ${
                        b.unlocked
                          ? b.badgeBg
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 opacity-40 text-slate-400'
                      }`}
                    >
                      <div className="h-7 w-7 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-2xs border border-slate-100 dark:border-slate-700">
                        {b.icon}
                      </div>
                      <p className="mt-1.5 font-bold text-[10px] truncate max-w-full">{b.title}</p>
                      <span className={`mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full ${b.pillBg}`}>
                        {b.xp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard Top Mahasiswa Card */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    <span>Top Mahasiswa Pekan Ini</span>
                  </h3>
                  <Link
                    href="/leaderboard"
                    className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition"
                  >
                    Lihat Semua
                  </Link>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  {topStudents.length > 0 ? (
                    topStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between p-2 rounded-xl border ${
                          student.rank === 1
                            ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-200/70 dark:border-amber-900/60'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shadow-2xs ${
                              student.rank === 1
                                ? 'bg-amber-500 text-white'
                                : student.rank === 2
                                ? 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-200'
                                : student.rank === 3
                                ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {student.rank}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                            {student.name}
                          </span>
                        </div>
                        <span
                          className={`font-bold text-[11px] flex items-center gap-1 ${
                            student.rank === 1
                              ? 'text-amber-800 dark:text-amber-400'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <Zap
                            className={`h-3 w-3 ${
                              student.rank === 1 ? 'fill-amber-500 text-amber-500' : 'fill-slate-400 text-slate-400'
                            }`}
                          />
                          {student.xp} XP
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-slate-400">Belum ada data peringkat.</div>
                  )}
                </div>

                <Link
                  href="/leaderboard"
                  className="mt-3 block w-full text-center rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition"
                >
                  Cek Peringkat Kamu →
                </Link>
              </div>

              {/* Rangkuman Progress Ring Gauge */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  Rangkuman Progress
                </h3>

                <div className="mt-4 flex items-center gap-4">
                  {/* SVG Radial Gauge */}
                  <div className="relative flex h-16 w-16 items-center justify-center shrink-0">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100 dark:text-slate-800"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600 transition-all duration-700"
                        strokeDasharray={`${progressPercent}, 100`}
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-xs font-bold text-slate-900 dark:text-white">
                      {progressPercent}%
                    </span>
                  </div>

                  <div className="flex-1 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Lesson Selesai</span>
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{completedCount}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>Dalam Proses</span>
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{inProgressCount}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span>Belum Dibuka</span>
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{notStartedCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Minimalist Quote Box */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 p-4 text-xs text-slate-700 dark:text-slate-300">
                <Quote className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mb-1" />
                <p className="italic text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                  &ldquo;Kebiasaan kecil setiap hari akan membawa hasil besar.&rdquo;
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">— RuangKode</p>
              </div>
            </div>
          </div>
        </main>
    </AppShell>
  );
}
