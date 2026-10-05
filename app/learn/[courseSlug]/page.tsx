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
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {course.level}
                  </span>
                  <span className="text-xs text-slate-500">• {course.chapters.length} Chapter</span>
                  <span className="text-xs text-slate-500">• {totalLessons} Pelajaran Interaktif</span>
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {course.title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-xl">
                  {course.description}
                </p>
              </div>

              {nextLesson && (
                <div className="shrink-0">
                  <Link
                    href={`/learn/${course.slug}/${nextLesson.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>{completedCount > 0 ? 'Lanjutkan Belajar' : 'Mulai Pelajaran Pertama'}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Progress section if user is logged in */}
            {user && (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">Progres Kelulusan Materi</span>
                  <span className="text-blue-600">{completedCount} dari {totalLessons} Selesai ({progressPercent}%)</span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Curriculum Chapters List */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Silabus & Materi Pembelajaran</h2>

            <div className="space-y-5">
              {course.chapters.map((chapter, chIdx) => (
                <div
                  key={chapter.id}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs"
                >
                  <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3.5 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{chapter.title}</h3>
                      {chapter.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{chapter.description}</p>
                      )}
                    </div>
                    <span className="rounded bg-slate-200/70 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {chapter.lessons.length} Lesson
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {chapter.lessons.map((lesson, lIdx) => {
                      const isCompleted = completedLessonMap.get(lesson.id);
                      const isInProgress = inProgressLessonMap.get(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          href={`/learn/${course.slug}/${lesson.slug}`}
                          className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center">
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                              ) : isInProgress ? (
                                <PlayCircle className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-slate-300 group-hover:text-slate-400" />
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                {lesson.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                                isCompleted
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : isInProgress
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {isCompleted
                                ? 'Selesai'
                                : isInProgress
                                ? 'Sedang Dipelajari'
                                : 'Belum Dimulai'}
                            </span>
                            <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-blue-600 transition" />
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
