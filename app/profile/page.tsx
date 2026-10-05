import Link from 'next/link';
import { redirect } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  User as UserIcon,
  Mail,
  Shield,
  Zap,
  Flame,
  CheckCircle2,
  Calendar,
  Code2,
  Award,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Trophy,
  History,
  Activity,
} from 'lucide-react';
const timeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' tahun yang lalu';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' bulan yang lalu';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' hari yang lalu';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' jam yang lalu';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' menit yang lalu';
  return Math.floor(seconds) + ' detik yang lalu';
};
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect('/login?callbackUrl=/profile');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      stats: true,
      certificates: {
        include: {
          course: true,
        },
        orderBy: { issuedAt: 'desc' },
      },
      submissions: {
        include: {
          exercise: {
            include: {
              lesson: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <AppShell
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    >
      <main className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-12 font-sans">
        {/* Cover Photo Area */}
        <div className="h-48 sm:h-64 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-10 space-y-6">
          
          {/* Main Profile Card */}
          <div className="rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm backdrop-blur-xl relative">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end">
              
              {/* Avatar */}
              <div className="relative group">
                <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-slate-900 dark:bg-slate-800 border-4 border-white dark:border-slate-900 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-90"></div>
                  <span className="relative z-10">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                {user.role === 'ADMIN' && (
                  <div className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-sm" title="Administrator">
                    <Shield className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center justify-center sm:justify-start gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Bergabung {new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Action Buttons / Badges */}
              <div className="flex items-center gap-3 w-full sm:w-auto mb-2">
                <div className="flex-1 sm:flex-none flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span>{user.stats?.xp || 0} XP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Stats & Activity */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Highlight Stats */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    Statistik Belajar
                  </h3>
                </div>
                <div className="p-2 grid grid-cols-2 gap-2">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-1 items-center justify-center text-center">
                    <Flame className="h-6 w-6 text-orange-500 mb-1" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{user.stats?.streak || 1}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Day Streak</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-1 items-center justify-center text-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mb-1" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{user.stats?.completedLessonsCount || 0}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Lessons</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-1 items-center justify-center text-center">
                    <Code2 className="h-6 w-6 text-blue-500 mb-1" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{user.stats?.completedExercisesCount || 0}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Exercises</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-1 items-center justify-center text-center">
                    <GraduationCap className="h-6 w-6 text-amber-500 mb-1" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{user.certificates.length}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Certificates</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Certificates & Timeline */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Certificates Section */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="p-5 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    Sertifikat Kelulusan
                  </h3>
                  {user.certificates.length > 0 && (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                      {user.certificates.length} Total
                    </span>
                  )}
                </div>
                
                <div className="p-5 sm:p-6">
                  {user.certificates.length > 0 ? (
                    <div className="grid gap-4">
                      {user.certificates.map((cert) => (
                        <div key={cert.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-sm shrink-0">
                              <GraduationCap className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-white">{cert.course.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{cert.certificateNumber}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <ShieldCheck className="h-3 w-3" /> Terverifikasi
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Link href={`/verify/${cert.certificateNumber}`} className="flex-1 sm:flex-none justify-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                              Validasi
                            </Link>
                            <Link href={`/certificate/${cert.certificateNumber}`} className="flex-1 sm:flex-none justify-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition">
                              Lihat <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                        <Award className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Belum ada sertifikat</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Selesaikan course untuk mendapatkan sertifikat kelulusan pertamamu.</p>
                      <Link href="/" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition">
                        Mulai Belajar
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="p-5 sm:px-6 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <History className="h-4 w-4 text-purple-500" />
                    Aktivitas Terakhir
                  </h3>
                </div>
                
                <div className="p-5 sm:p-6">
                  {user.submissions.length > 0 ? (
                    <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-6">
                      {user.submissions.map((sub, idx) => (
                        <div key={sub.id} className="relative pl-6">
                          <span className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                            sub.status === 'PASSED' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}></span>
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 flex items-center gap-2">
                              {timeAgo(new Date(sub.createdAt))}
                            </p>
                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-4">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {sub.status === 'PASSED' ? 'Menyelesaikan' : 'Mencoba'} <span className="font-bold">{sub.exercise.lesson.title}</span>
                              </p>
                              {sub.status === 'PASSED' ? (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                  <CheckCircle2 className="h-3 w-3" /> Berhasil Lolos
                                </div>
                              ) : (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider">
                                  Gagal / Error
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada aktivitas coding yang terekam.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
