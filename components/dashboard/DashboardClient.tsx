'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import confetti from 'canvas-confetti';
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
  Lock,
  Star,
  Check,
  Trophy,
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
            <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="max-w-md z-10">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                    <Sparkles className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    <span>Selamat Datang di RuangKode! 👋</span>
                  </div>

                  <h1 className="mt-2.5 text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                    Semangat Belajar, <span className="text-blue-600 dark:text-blue-400">{user.name}!</span>
                  </h1>

                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Kamu sudah menyelesaikan <span className="font-semibold text-slate-900 dark:text-white">{completedCount} dari {totalLessons} materi</span> di course Python Fundamental. Terus konsisten, hasil besar selalu dimulai dari langkah kecil!
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
                      <span>Lihat Course</span>
                    </Link>
                  </div>
                </div>

                {/* Clean Developer Vector Illustration */}
                <div className="relative w-full sm:w-52 h-36 sm:h-40 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xs shrink-0 self-center">
                  <Image
                    src="/images/student_coding.jpg"
                    alt="Mahasiswa belajar koding Python"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 220px"
                    priority
                  />
                  <div className="absolute top-2 right-2 rounded-md bg-white/95 dark:bg-slate-900/95 px-2 py-0.5 text-[9px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                    Python 3.12
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Target Belajar Berikutnya (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-[#0F172A] p-5 sm:p-6 text-white shadow-xs flex flex-col justify-between">
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
                    <span>Buka Coding Workspace</span>
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
          </div>

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
              <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
                  <Zap className="h-3 w-3 fill-emerald-600 text-emerald-600" />
                  <span>+30 XP per exercise selesai</span>
                </span>
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
              <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-end text-[10px] font-bold text-blue-600 dark:text-blue-400">
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
              <div className="mt-3 border-t border-slate-100 dark:border-slate-800 pt-2.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60">
                  <Check className="h-3 w-3" />
                  <span>100% Evaluasi Otomatis</span>
                </span>
                <Link
                  href="/profile"
                  className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Lihat Selesai
                </Link>
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

              {/* Daftar Chapter Accordion */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Daftar Chapter</h3>
                  <Link
                    href={`/learn/${course.slug}`}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Lihat Silabus Lengkap</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {course.chapters.map((chapter) => {
                    const isExpanded = expandedChapter === chapter.id;
                    const chLessons = chapter.lessons;
                    const chDone = chLessons.filter((l) => completedSet.has(l.id)).length;
                    const isAllDone = chDone === chLessons.length && chLessons.length > 0;

                    return (
                      <div
                        key={chapter.id}
                        className="rounded-xl border border-slate-200/90 dark:border-slate-800 overflow-hidden transition"
                      >
                        <button
                          onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                          className="w-full flex items-center justify-between p-3.5 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition text-left"
                        >
                          <div className="flex items-center gap-3">
                            {isAllDone ? (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </div>
                            ) : (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                                {chapter.order}
                              </div>
                            )}
                            <div>
                              <p className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                                {chapter.title}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {chDone} dari {chLessons.length} lesson selesai
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hidden sm:inline">
                              {isExpanded ? 'Tutup Detail' : 'Lihat Detail'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                            {chLessons.map((lesson) => {
                              const isLessonDone = completedSet.has(lesson.id);
                              const isNext = nextLesson?.id === lesson.id;

                              return (
                                <div
                                  key={lesson.id}
                                  className={`flex items-center justify-between p-3 px-4 text-xs transition ${
                                    isNext ? 'bg-blue-50/40 dark:bg-blue-950/30' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    {isLessonDone ? (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    ) : isNext ? (
                                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white shrink-0">
                                        <Play className="h-2 w-2 fill-white" />
                                      </div>
                                    ) : (
                                      <Circle className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                                    )}
                                    <div>
                                      <span
                                        className={`font-semibold ${
                                          isNext ? 'text-blue-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'
                                        }`}
                                      >
                                        {lesson.title}
                                      </span>
                                      <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1">
                                        {lesson.description}
                                      </p>
                                    </div>
                                  </div>

                                  <Link
                                    href={`/learn/${course.slug}/${lesson.slug}`}
                                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition shrink-0 ${
                                      isNext
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                                        : isLessonDone
                                        ? 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                    }`}
                                  >
                                    {isNext ? 'Mulai' : isLessonDone ? 'Ulangi' : 'Buka'}
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
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
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/60">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-2xs">
                        1
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">Budi Santoso</span>
                    </div>
                    <span className="font-bold text-amber-800 dark:text-amber-400 text-[11px] flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-amber-500 text-amber-500" />
                      240 XP
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        2
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">Siti Rahma</span>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-slate-400 text-slate-400" />
                      190 XP
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 dark:bg-amber-900/60 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                        3
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">Ahmad Fauzi</span>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1">
                      <Zap className="h-3 w-3 fill-slate-400 text-slate-400" />
                      140 XP
                    </span>
                  </div>
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
