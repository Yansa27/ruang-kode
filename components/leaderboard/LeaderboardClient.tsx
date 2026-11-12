'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Crown,
  Flame,
  Zap,
  Search,
  Calendar,
} from '@/components/ui/icons';
import AppShell from '@/components/layout/AppShell';

interface StudentRank {
  id: string;
  name: string;
  rank: number;
  xp: number;
  level: number;
  streak: number;
  completedLessons: number;
  isCurrentUser: boolean;
}

interface CurrentUserRank extends StudentRank {
  nextRankXpDifference?: number;
  aboveUserName?: string | null;
}

interface LeaderboardClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  initialLeaderboard: StudentRank[];
  currentUser: CurrentUserRank | null;
  totalParticipants: number;
}

export default function LeaderboardClient({
  user,
  initialLeaderboard,
  currentUser,
  totalParticipants,
}: LeaderboardClientProps) {
  const [activePeriod, setActivePeriod] = useState<'weekly' | 'alltime'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students based on search query
  const filteredList = initialLeaderboard.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top1 = initialLeaderboard[0];
  const top2 = initialLeaderboard[1];
  const top3 = initialLeaderboard[2];

  return (
    <AppShell user={user}>
      <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        {/* Banner Hero & Period Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
              <Trophy className="h-3 w-3 text-amber-500" />
              <span>Leaderboard Mahasiswa</span>
            </div>
            <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl tracking-tight dark:text-slate-100">
              Papan Peringkat Prestasi
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Diperbarui secara realtime berdasarkan perolehan XP dan konsistensi streak pengerjaan materi.
            </p>
          </div>

          {/* Period Toggle Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 self-start sm:self-auto border border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => setActivePeriod('weekly')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activePeriod === 'weekly'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Pekan Ini</span>
            </button>
            <button
              onClick={() => setActivePeriod('alltime')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activePeriod === 'alltime'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Sepanjang Waktu</span>
            </button>
          </div>
        </div>

        {/* TOP 3 PODIUM */}
        {initialLeaderboard.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-2">
            {/* Rank 2 (Silver) */}
            <div className="order-2 md:order-1 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs text-center flex flex-col items-center dark:bg-slate-900 dark:border-slate-800">
              <div className="relative mb-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 border-2 border-slate-300 text-base font-bold text-slate-700 shadow-2xs dark:text-slate-100">
                  {top2.name.charAt(0)}
                </div>
                <div className="absolute -top-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 border border-white text-slate-700 text-xs font-black shadow-2xs dark:text-slate-100">
                  2
                </div>
              </div>
              <Link href={`/u/${top2.id}`} className="font-bold text-sm text-slate-900 mt-1 truncate max-w-[180px] hover:text-blue-600 transition dark:text-slate-100">
                {top2.name}
              </Link>
              <p className="text-[10px] text-slate-400">Level {top2.level} Mahasiswa</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-100 dark:border-slate-800">
                  <Zap className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                  <span>{top2.xp} XP</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span>{top2.streak}d</span>
                </span>
              </div>
            </div>

            {/* Rank 1 (Gold - Elevated) */}
            <div className="order-1 md:order-2 rounded-2xl border-2 border-amber-300 bg-linear-to-b from-amber-50/50 to-white p-6 shadow-md text-center flex flex-col items-center relative -mt-2">
              <div className="absolute -top-3.5 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-black text-white shadow-xs">
                <Crown className="h-3 w-3 " />
                <span>PERINGKAT #1</span>
              </div>
              <div className="relative mt-2 mb-2">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 border-2 border-amber-400 text-xl font-bold text-amber-900 shadow-xs">
                  {top1.name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 border border-white text-white text-xs font-black shadow-xs">
                  👑
                </div>
              </div>
              <Link href={`/u/${top1.id}`} className="font-bold text-base text-slate-900 mt-1 truncate max-w-[200px] hover:text-blue-600 transition dark:text-slate-100">
                {top1.name}
              </Link>
              <p className="text-xs text-amber-700 font-semibold">Paling Aktif Pekan Ini</p>
              <div className="mt-3.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800 shadow-2xs">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>{top1.xp} XP</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 border border-orange-200 px-2.5 py-1 text-xs font-semibold text-orange-800">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span>{top1.streak} Hari</span>
                </span>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="order-3 md:order-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs text-center flex flex-col items-center dark:bg-slate-900 dark:border-slate-800">
              <div className="relative mb-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 border-2 border-amber-200 text-base font-bold text-amber-800 shadow-2xs">
                  {top3.name.charAt(0)}
                </div>
                <div className="absolute -top-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 border border-white text-amber-800 text-xs font-black shadow-2xs">
                  3
                </div>
              </div>
              <Link href={`/u/${top3.id}`} className="font-bold text-sm text-slate-900 mt-1 truncate max-w-[180px] hover:text-blue-600 transition dark:text-slate-100">
                {top3.name}
              </Link>
              <p className="text-[10px] text-slate-400">Level {top3.level} Mahasiswa</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  <Zap className="h-3 w-3 text-amber-500" />
                  <span>{top3.xp} XP</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span>{top3.streak}d</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* LOGGED IN USER STANDING CARD (STICKY MOTIVATION) */}
        {currentUser && (
          <div className="rounded-2xl border-2 border-blue-500/30 bg-blue-50/50 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-xs">
                #{currentUser.rank}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Posisi Kamu: Peringkat #{currentUser.rank}
                  </span>
                  <span className="rounded bg-blue-100 px-2 py-0.2 text-[10px] font-bold text-blue-800">
                    Kamu
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {currentUser.aboveUserName && currentUser.nextRankXpDifference ? (
                    <span>
                      Butuh <strong className="text-blue-700 font-bold">+{currentUser.nextRankXpDifference} XP</strong> lagi untuk menyalip <span className="font-semibold text-slate-800 dark:text-slate-100">{currentUser.aboveUserName}</span>!
                    </span>
                  ) : (
                    <span>Hebat! Kamu memimpin di posisi puncak pekan ini.</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-xl bg-white border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-900 shadow-2xs dark:bg-slate-900">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>{currentUser.xp} XP</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-white border border-orange-200 px-3 py-1.5 text-xs font-bold text-orange-800 shadow-2xs dark:bg-slate-900">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span>{currentUser.streak} Hari</span>
              </div>
              <Link
                href="/learn/python-fundamental"
                className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
              >
                Lanjut Belajar
              </Link>
            </div>
          </div>
        )}

        {/* FULL RANKING TABLE */}
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden dark:bg-slate-900 dark:border-slate-800">
          {/* Table Header & Search */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Seluruh Mahasiswa Terdaftar
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                {totalParticipants} Peserta
              </span>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama mahasiswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition dark:text-slate-100 dark:border-slate-800"
              />
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-100 text-xs">
            {filteredList.map((student) => {
              return (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-3.5 sm:px-5 transition ${
                    student.isCurrentUser
                      ? 'bg-blue-50/60 font-semibold'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Rank Badge */}
                    <div className="w-7 text-center shrink-0">
                      {student.rank === 1 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-2xs">
                          1
                        </span>
                      ) : student.rank === 2 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-slate-800 text-[11px] font-bold shadow-2xs dark:text-slate-100">
                          2
                        </span>
                      ) : student.rank === 3 ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-amber-900 text-[11px] font-bold shadow-2xs">
                          3
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">
                          #{student.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar Initial */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 shrink-0">
                      {student.name.charAt(0)}
                    </div>

                    {/* Name & Role */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/u/${student.id}`} className="font-semibold text-slate-900 truncate hover:text-blue-600 transition dark:text-slate-100">
                          {student.name}
                        </Link>
                        {student.isCurrentUser && (
                          <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-800">
                            Kamu
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Level {student.level} • {student.completedLessons} Materi Selesai
                      </span>
                    </div>
                  </div>

                  {/* Right Stats: Streak & XP */}
                  <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    <div className="hidden sm:flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Flame className="h-3.5 w-3.5 text-orange-500" />
                      <span className="font-semibold text-slate-700 dark:text-slate-100">{student.streak}d</span>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-blue-700 min-w-[70px] justify-end">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span>{student.xp} XP</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredList.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                Tidak ada mahasiswa yang cocok dengan pencarian &quot;{searchQuery}&quot;.
              </div>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
