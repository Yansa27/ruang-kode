import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/layout/Footer';
import AppShell from '@/components/layout/AppShell';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  BookOpen,
  ArrowRight,
  Code2,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const user = await getCurrentUser();

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      chapters: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!course) {
    notFound();
  }

  let userWithStats = null;
  const completedLessonMap = new Map<string, boolean>();
  const inProgressLessonMap = new Map<string, boolean>();

  if (user) {
    userWithStats = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        stats: true,
        lessonProgress: true,
      },
    });

    userWithStats?.lessonProgress.forEach((lp) => {
      if (lp.isCompleted) {
        completedLessonMap.set(lp.lessonId, true);
      } else if (lp.status === 'IN_PROGRESS') {
        inProgressLessonMap.set(lp.lessonId, true);
      }
    });
  }

  const allLessons = course.chapters.flatMap((ch) => ch.lessons);
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => completedLessonMap.get(l.id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Next lesson to resume
  const nextLesson = allLessons.find((l) => !completedLessonMap.get(l.id)) || allLessons[0];

  const content = (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition">Beranda</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/dashboard" className="hover:text-slate-900 transition">Courses</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900 font-semibold">{course.title}</span>
      </div>

      {/* Course Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 -left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-blue-500/20 ring-1 ring-blue-400/30 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-sm shadow-inner uppercase tracking-wider">
                {course.level}
              </span>
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                {course.chapters.length} Chapter
              </span>
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5" />
                {totalLessons} Pelajaran
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 max-w-2xl">
              {course.description}
            </p>
          </div>

          {nextLesson && (
            <div className="shrink-0 flex items-center">
              <Link
                href={`/learn/${course.slug}/${nextLesson.slug}`}
                className="group relative inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <PlayCircle className="h-4 w-4" />
                </div>
                <span>{completedCount > 0 ? 'Lanjutkan Belajar' : 'Mulai Pelajaran Pertama'}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Progress section if user is logged in */}
        {user && (
          <div className="relative z-10 bg-slate-800/50 backdrop-blur-md border-t border-slate-700/50 px-6 sm:px-10 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Progres Kelulusan Materi
              </span>
              <span className="text-white bg-slate-700/80 px-2.5 py-1 rounded-md shadow-inner">
                {completedCount} dari {totalLessons} Selesai ({progressPercent}%)
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-900 shadow-inner ring-1 ring-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Curriculum Chapters List */}
      <div className="space-y-6 mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Silabus & Materi Pembelajaran</h2>
          <span className="text-sm font-medium text-slate-500">{totalLessons} Pelajaran Tersedia</span>
        </div>

        <div className="space-y-5">
          {course.chapters.map((chapter, chIdx) => (
            <div
              key={chapter.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold text-sm">
                    {chIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{chapter.title}</h3>
                    {chapter.description && (
                      <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{chapter.description}</p>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">
                    {chapter.lessons.length} Lesson
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {chapter.lessons.map((lesson, lIdx) => {
                  const isCompleted = completedLessonMap.get(lesson.id);
                  const isInProgress = inProgressLessonMap.get(lesson.id);

                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/${course.slug}/${lesson.slug}`}
                      className="flex items-center justify-between p-5 hover:bg-slate-50/80 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center">
                          {isCompleted ? (
                            <div className="rounded-full bg-emerald-100 p-1">
                              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            </div>
                          ) : isInProgress ? (
                            <div className="rounded-full bg-blue-100 p-1">
                              <PlayCircle className="h-5 w-5 text-blue-600" />
                            </div>
                          ) : (
                            <div className="rounded-full bg-slate-100 p-1 group-hover:bg-blue-50 transition-colors">
                              <Circle className="h-5 w-5 text-slate-300 group-hover:text-blue-400" />
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {lesson.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wide uppercase ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20'
                              : isInProgress
                              ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-500/20'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isCompleted
                            ? 'Selesai'
                            : isInProgress
                            ? 'Diproses'
                            : 'Materi Baru'}
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 group-hover:bg-blue-600 transition-colors">
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
        </div>
  );

  if (userWithStats) {
    return (
      <AppShell
        user={{
          id: userWithStats.id,
          name: userWithStats.name,
          email: userWithStats.email,
          role: userWithStats.role,
        }}
        courseSlug={courseSlug}
      >
        <main className="p-4 sm:p-6 lg:p-8">
          {content}
        </main>
      </AppShell>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar user={null} />
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        {content}
      </main>
      <Footer />
    </div>
  );
}
