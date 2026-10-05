'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Flame, Zap, CheckCircle2, ChevronRight, Menu, Volume2, VolumeX, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { soundFx } from '@/lib/sound';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useNetworkStatus } from '@/lib/offline';

interface WorkspaceNavbarProps {
  courseTitle: string;
  courseSlug: string;
  chapterTitle: string;
  lessonTitle: string;
  progressPercent: number;
  completedLessonsCount: number;
  totalLessons: number;
  userStats?: {
    xp: number;
    streak: number;
  } | null;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function WorkspaceNavbar({
  courseTitle,
  courseSlug,
  chapterTitle,
  lessonTitle,
  progressPercent,
  completedLessonsCount,
  totalLessons,
  userStats,
  onToggleSidebar,
  isSidebarOpen,
}: WorkspaceNavbarProps) {
  const [soundOn, setSoundOn] = useState(true);
  const isOnline = useNetworkStatus();

  useEffect(() => {
    setSoundOn(soundFx.isEnabled());
  }, []);

  return (
    <header suppressHydrationWarning className="h-13 border-b border-slate-200 bg-white px-3 sm:px-4 flex items-center justify-between shrink-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Sembunyikan Silabus' : 'Tampilkan Silabus'}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link
          href={`/learn/${courseSlug}`}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Kembali ke Silabus</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span>/</span>
          <span className="text-slate-600 font-medium truncate max-w-[150px]">{chapterTitle}</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-[200px]">{lessonTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Course Progress mini-bar */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs">
          <span className="text-slate-500 font-medium">Progres:</span>
          <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-semibold text-slate-700">{progressPercent}%</span>
        </div>

        {/* User stats */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <div
            title="Streak harian"
            className="flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-orange-700"
          >
            <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
            <span>{userStats?.streak || 1}d</span>
          </div>

          <div
            title="Total XP"
            className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700"
          >
            <Zap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{userStats?.xp || 0} XP</span>
          </div>
        </div>

        {/* Offline Badge */}
        {!isOnline && (
          <div
            title="Koneksi terputus, eksekusi Python WebAssembly tetap berfungsi!"
            className="flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800"
          >
            <WifiOff className="h-3 w-3 text-amber-600" />
            <span className="hidden sm:inline">Offline</span>
          </div>
        )}

        {/* Sound FX Toggle */}
        <button
          type="button"
          onClick={() => setSoundOn(soundFx.toggle())}
          title={soundOn ? 'Efek Suara Aktif (Klik untuk mute)' : 'Efek Suara Mute (Klik untuk aktifkan)'}
          className={`flex h-7 w-7 items-center justify-center rounded-lg border transition ${
            soundOn
              ? 'border-blue-200 bg-blue-50/80 text-blue-600 hover:bg-blue-100'
              : 'border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100'
          }`}
        >
          {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </button>

        {/* Global Theme Toggle */}
        <ThemeToggle size="sm" />
      </div>
    </header>
  );
}
