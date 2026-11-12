import Link from 'next/link';
import { redirect } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  Calendar,
  Code2,
  Award,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Zap,
  BookOpen,
  Activity,
  History,
  Mail
} from '@/components/ui/icons';

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
  return 'baru saja';
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
        take: 8,
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
      <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] pb-12 font-sans">
        
        {/* Subtle Geometric Header Pattern */}
        <div className="h-40 w-full bg-slate-900 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column - Profile Identity & Main XP */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Identity Card */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-sm flex flex-col items-center text-center">
                <div className="h-28 w-28 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border-4 border-white dark:border-[#111827] shadow-sm flex items-center justify-center text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {user.name}
                </h1>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{user.email}</span>
                </div>
                
                <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5"/> Member sejak</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {new Date(user.createdAt).getFullYear()}
                  </span>
                </div>
              </div>

              {/* XP Bento Box */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-sm overflow-hidden relative group">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap className="w-32 h-32 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Total Pengalaman</h3>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{user.stats?.xp || 0}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold mb-1">XP</span>
                </div>
              </div>

            </div>

            {/* Right Column - Bento Stats & Content */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Bento Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-sm flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                    <Flame className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Streak Belajar</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{user.stats?.streak || 1} Hari</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-sm flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Materi Selesai</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{user.stats?.completedLessonsCount || 0}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-sm flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Kode Berhasil</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{user.stats?.completedExercisesCount || 0}</p>
                  </div>
                </div>

              </div>

              {/* Certificates Row */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    Sertifikat Kredensial
                  </h3>
                </div>
                <div className="p-6">
                  {user.certificates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.certificates.map((cert) => (
                        <div key={cert.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                          <div>
                            <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                              <ShieldCheck className="h-4 w-4" />
                            </div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug mb-1">
                              {cert.course.title}
                            </h4>
                            <p className="text-xs font-mono text-slate-500">ID: {cert.certificateNumber}</p>
                          </div>
                          <div className="mt-5 flex gap-2">
                            <Link href={`/verify/${cert.certificateNumber}`} className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg transition">
                              Validasi
                            </Link>
                            <Link href={`/certificate/${cert.certificateNumber}`} className="text-[11px] font-semibold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                              Lihat PDF <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                      <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                        <Award className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Belum Ada Sertifikat</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs">Selesaikan minimal satu course untuk mencetak kredensial digital Anda.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <History className="h-4 w-4 text-blue-500" />
                    Riwayat Koding
                  </h3>
                </div>
                <div className="p-6">
                  {user.submissions.length > 0 ? (
                    <div className="space-y-5">
                      {user.submissions.map((sub) => (
                        <div key={sub.id} className="flex items-start gap-4">
                          <div className={`mt-0.5 shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                            sub.status === 'PASSED' 
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {sub.status === 'PASSED' ? <CheckCircle2 className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 border-b border-slate-100 dark:border-slate-800/80 pb-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {sub.status === 'PASSED' ? 'Berhasil menyelesaikan' : 'Mencoba tantangan'} 
                                <span className="font-bold"> {sub.exercise.lesson.title}</span>
                              </p>
                              <span className="text-xs text-slate-500 whitespace-nowrap">
                                {timeAgo(new Date(sub.createdAt))}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-slate-500">Riwayat aktivitas masih kosong.</p>
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
