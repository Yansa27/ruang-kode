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
      <main className="min-h-screen bg-white dark:bg-[#0A0A0A] pb-12 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-3xl font-medium text-slate-700 dark:text-slate-300">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                {user.role === 'ADMIN' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 pt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Bergabung {new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Minimal Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total XP', value: user.stats?.xp || 0, icon: Zap },
              { label: 'Day Streak', value: user.stats?.streak || 1, icon: Flame },
              { label: 'Lessons', value: user.stats?.completedLessonsCount || 0, icon: CheckCircle2 },
              { label: 'Exercises', value: user.stats?.completedExercisesCount || 0, icon: Code2 },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
                  <stat.icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Certificates */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Sertifikat</h2>
                <span className="text-xs text-slate-500">{user.certificates.length} Total</span>
              </div>
              
              {user.certificates.length > 0 ? (
                <div className="space-y-3">
                  {user.certificates.map((cert) => (
                    <div key={cert.id} className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">{cert.course.title}</h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{cert.certificateNumber}</span>
                          </div>
                        </div>
                        <Award className="h-5 w-5 text-slate-300 dark:text-slate-700" />
                      </div>
                      
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Link href={`/verify/${cert.certificateNumber}`} className="text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" /> Validasi
                        </Link>
                        <Link href={`/certificate/${cert.certificateNumber}`} className="text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 transition flex items-center gap-1">
                          Lihat PDF <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada sertifikat.</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Aktivitas Terakhir</h2>
              
              {user.submissions.length > 0 ? (
                <div className="space-y-4">
                  {user.submissions.map((sub) => (
                    <div key={sub.id} className="flex gap-4">
                      <div className="flex flex-col items-center mt-1">
                        <div className={`h-2 w-2 rounded-full ${sub.status === 'PASSED' ? 'bg-slate-400 dark:bg-slate-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        <div className="w-px h-full bg-slate-100 dark:bg-slate-800/60 my-1"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm text-slate-900 dark:text-slate-200">
                          {sub.status === 'PASSED' ? 'Menyelesaikan' : 'Mencoba'} <span className="font-medium">{sub.exercise.lesson.title}</span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {timeAgo(new Date(sub.createdAt))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada aktivitas terekam.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </AppShell>
  );
}
