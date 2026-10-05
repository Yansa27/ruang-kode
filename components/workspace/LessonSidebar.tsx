'use client';

import Link from 'next/link';
import { CheckCircle2, Circle, PlayCircle, X } from 'lucide-react';

interface LessonItem {
  id: string;
  slug: string;
  title: string;
  order: number;
}

interface ChapterItem {
  id: string;
  title: string;
  order: number;
  lessons: LessonItem[];
}

interface LessonSidebarProps {
  chapters: ChapterItem[];
  currentLessonSlug: string;
  courseSlug: string;
  completedLessonIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

export default function LessonSidebar({
  chapters,
  currentLessonSlug,
  courseSlug,
  completedLessonIds,
  isOpen,
  onClose,
}: LessonSidebarProps) {
  const completedSet = new Set(completedLessonIds);

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl md:static md:shadow-none transition-all shrink-0">
      {/* Sidebar Header */}
      <div className="flex h-13 items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Silabus Materi
        </h2>
        <button
          onClick={onClose}
          aria-label="Tutup Silabus"
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 md:hidden transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Chapters & Lessons list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="space-y-1.5">
            <h3 className="px-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {chapter.title}
            </h3>

            <div className="space-y-0.5">
              {chapter.lessons.map((lesson) => {
                const isActive = lesson.slug === currentLessonSlug;
                const isCompleted = completedSet.has(lesson.id);

                return (
                  <Link
                    key={lesson.id}
                    href={`/learn/${courseSlug}/${lesson.slug}`}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-semibold'
                        : isCompleted
                        ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : isActive ? (
                        <PlayCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                    <span className="truncate">{lesson.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
