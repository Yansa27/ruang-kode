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
} from 'lucide-react';

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
      <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Profile Header Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {user.name}
                  </h1>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{user.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {user.role === 'ADMIN' ? 'Administrator' : 'Mahasiswa'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-medium">Total XP</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {user.stats?.xp || 0}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-medium">Streak Belajar</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {user.stats?.streak || 1} Hari
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium">Lesson Selesai</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {user.stats?.completedLessonsCount || 0}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Code2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium">Exercise Lolos</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {user.stats?.completedExercisesCount || 0}
              </p>
            </div>
          </div>

          {/* Sertifikat Kelulusan Resmi */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Sertifikat Kelulusan Resmi</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Kredensial digital resmi dengan QR code dan verifikasi publik.</p>
                </div>
              </div>
              {user.certificates.length > 0 && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {user.certificates.length} Sertifikat Terbit
                </span>
              )}
            </div>

            {user.certificates.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-1">
                {user.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-xs">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                            {cert.course.title}
                          </h3>
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {cert.certificateNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                          <span>Diterbitkan: {new Date(cert.issuedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5" /> Terverifikasi
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-700">
                      <Link
                        href={`/verify/${cert.certificateNumber}`}
                        className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                        Verifikasi
                      </Link>
                      <Link
                        href={`/certificate/${cert.certificateNumber}`}
                        className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
                      >
                        <span>Lihat & Cetak</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 p-5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                <GraduationCap className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Belum Ada Sertifikat yang Diklaim</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Selesaikan 100% materi dan latihan pada kursus untuk membuka dan mengklaim sertifikat kelulusan berlisensi resmi.
                </p>
                <Link
                  href="/learn/python-fundamental"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Lanjutkan Belajar →
                </Link>
              </div>
            )}
          </div>

          {/* Recent Submissions */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Riwayat Pengumpulan Kode (Submissions)</h2>

            {user.submissions.length > 0 ? (
              <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                {user.submissions.map((sub) => (
                  <div key={sub.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {sub.exercise.lesson.title} — {sub.exercise.title}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {new Date(sub.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>

                    <span
                      className={`rounded px-2.5 py-1 text-[11px] font-bold ${
                        sub.status === 'PASSED'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50'
                          : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200/50 dark:border-red-800/50'
                      }`}
                    >
                      {sub.status === 'PASSED' ? 'Lolos (PASSED)' : 'Belum Lolos'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Belum ada riwayat pengerjaan exercise.</p>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}

