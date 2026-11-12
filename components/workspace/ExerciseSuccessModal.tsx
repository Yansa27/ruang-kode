'use client';

import { useEffect } from 'react';
import { CheckCircle2, Zap, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface ExerciseSuccessModalProps {
  isOpen: boolean;
  earnedXp: number;
  nextLessonSlug?: string | null;
  courseSlug: string;
  onClose: () => void;
}

export default function ExerciseSuccessModal({
  isOpen,
  earnedXp,
  nextLessonSlug,
  courseSlug,
  onClose,
}: ExerciseSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire celebratory multi-cannon confetti burst
      try {
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2563eb', '#38bdf8', '#16a34a', '#f59e0b', '#8b5cf6'],
          });

          setTimeout(() => {
            confetti.default({
              particleCount: 40,
              angle: 60,
              spread: 55,
              origin: { x: 0.05, y: 0.7 },
              colors: ['#2563eb', '#f59e0b'],
            });
            confetti.default({
              particleCount: 40,
              angle: 120,
              spread: 55,
              origin: { x: 0.95, y: 0.7 },
              colors: ['#10b981', '#6366f1'],
            });
          }, 200);
        });
      } catch (e) {
        // Fallback if canvas is unavailable
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-center dark:bg-slate-900 dark:border-slate-800">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Exercise Completed!
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Luar biasa! Solusi kamu lolos seluruh test case dengan sempurna.
        </p>

        {earnedXp > 0 && (
          <div className="my-5 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-bold text-amber-800 shadow-xs">
            <Zap className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>+{earnedXp} XP Diperoleh</span>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          {nextLessonSlug ? (
            <Link
              href={`/learn/${courseSlug}/${nextLessonSlug}`}
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <span>Lanjut ke Lesson Berikutnya</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              href={`/learn/${courseSlug}`}
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Selamat! Course Telah Selesai</span>
            </Link>
          )}

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition dark:text-slate-100 dark:border-slate-800"
          >
            Tetap di Halaman Ini
          </button>
        </div>
      </div>
    </div>
  );
}
