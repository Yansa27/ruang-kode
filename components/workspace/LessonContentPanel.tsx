'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  CheckCircle,
  HelpCircle,
  Lightbulb,
  Copy,
  ChevronDown,
  ChevronUp,
  Target,
  FileCode,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertTriangle,
  BookOpen,
  X,
} from '@/components/ui/icons';

interface ExerciseData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  starterCode: string;
  solutionCode?: string | null;
}

interface LessonContentPanelProps {
  title: string;
  description: string;
  learningObjectives: string[];
  content: string;
  exampleCode?: string | null;
  hints?: string[];
  exercise?: ExerciseData | null;
  onCopyExampleToEditor?: (code: string) => void;
  failedAttempts?: number;
  isHintsOpen?: boolean;
  onToggleHints?: (open: boolean) => void;
}

export default function LessonContentPanel({
  title,
  description,
  learningObjectives,
  content,
  exampleCode,
  hints = [],
  exercise,
  onCopyExampleToEditor,
  failedAttempts = 0,
  isHintsOpen: externalHintsOpen,
  onToggleHints,
}: LessonContentPanelProps) {
  const [internalHintsOpen, setInternalHintsOpen] = useState(false);
  const isHintsOpen = externalHintsOpen !== undefined ? externalHintsOpen : internalHintsOpen;
  const setIsHintsOpen = (val: boolean) => {
    setInternalHintsOpen(val);
    if (onToggleHints) onToggleHints(val);
  };

  const [isTheoryModalOpen, setIsTheoryModalOpen] = useState(false);

  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [copiedExample, setCopiedExample] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const hintsRef = useRef<HTMLDivElement>(null);

  // Auto-unlock additional hints if user failed multiple times
  useEffect(() => {
    if (failedAttempts >= 2 && unlockedLevel < 2 && hints.length >= 2) {
      setUnlockedLevel(2);
    }
  }, [failedAttempts, unlockedLevel, hints.length]);

  // Scroll to hints when opened externally
  useEffect(() => {
    if (isHintsOpen && hintsRef.current) {
      hintsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isHintsOpen]);

  const handleCopyExample = (code: string) => {
    if (onCopyExampleToEditor) {
      onCopyExampleToEditor(code);
      setCopiedExample(true);
      setTimeout(() => setCopiedExample(false), 2000);
    }
  };

  const handleCopySolution = (code: string) => {
    if (onCopyExampleToEditor) {
      onCopyExampleToEditor(code);
      setCopiedSolution(true);
      setTimeout(() => setCopiedSolution(false), 2000);
    }
  };

  const unlockNextHint = () => {
    if (unlockedLevel < hints.length) {
      setUnlockedLevel((prev) => prev + 1);
    }
  };

  return (
    <div suppressHydrationWarning className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Title & Description */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Learning Objectives */}
      {learningObjectives.length > 0 && (
        <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-3.5 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-blue-900 dark:text-blue-300">
            <Target className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Tujuan Pembelajaran:</span>
          </div>
          <ul className="mt-2 space-y-1.5 text-blue-950 dark:text-blue-200">
            {learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500 dark:text-blue-400 font-bold">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lesson Material Body */}
      <div className="prose prose-sm prose-slate dark:prose-invert max-w-none space-y-3 text-xs leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre: ({ node, ...props }) => (
              <pre {...props} className="rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-slate-200 overflow-x-auto" />
            ),
            code: ({ node, ...props }) => (
              <code {...props} className="rounded text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1 py-0.5" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Interactive Example Code Box */}
      {exampleCode && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <FileCode className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Contoh Kode Pembelajaran</span>
            </span>
            <button
              onClick={() => handleCopyExample(exampleCode)}
              className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <Copy className="h-3 w-3" />
              <span>{copiedExample ? 'Tersalin ke Editor!' : 'Gunakan di Editor'}</span>
            </button>
          </div>
          <pre className="p-3 text-[11px] font-mono text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/30 overflow-x-auto">
            {exampleCode}
          </pre>
        </div>
      )}

      {/* Mode Fokus Baca Button */}
      <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kurang Fokus?</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Buka materi dalam mode layar penuh (Pop-up).
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsTheoryModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition shrink-0"
        >
          <BookOpen className="h-4 w-4" />
          <span>Mode Fokus</span>
        </button>
      </div>

      {/* Centered Modal for Theory Content */}
      {isTheoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsTheoryModalOpen(false)} 
          />

          {/* Modal panel */}
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Teori: {title}</span>
              </div>
              <button
                onClick={() => setIsTheoryModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-xs leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre: ({ node, ...props }) => (
                      <pre {...props} className="rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-slate-200 overflow-x-auto my-3 border border-slate-700 shadow-inner" />
                    ),
                    code: ({ node, ...props }) => (
                      <code {...props} className="rounded text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 border border-blue-100 dark:border-blue-900/30" />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {/* Interactive Example Code Box */}
              {exampleCode && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 overflow-hidden shadow-2xs mt-4">
                  <div className="flex items-center justify-between px-3 py-2.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <FileCode className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Contoh Kode Acuan</span>
                    </span>
                    <button
                      onClick={() => handleCopyExample(exampleCode)}
                      className="flex items-center gap-1.5 rounded-md bg-white dark:bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 shadow-2xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{copiedExample ? 'Tersalin!' : 'Salin Code'}</span>
                    </button>
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/30 overflow-x-auto">
                    {exampleCode}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exercise Challenge Box */}
      {exercise && (
        <div className="rounded-2xl border-2 border-blue-500/20 bg-blue-50/20 dark:bg-blue-900/10 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white shadow-2xs">
                <Target size={14} />
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{exercise.title}</h3>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Tantangan Praktek Langsung</span>
              </div>
            </div>
            <span className="rounded-md bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:text-blue-300">
              {exercise.difficulty}
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/80 dark:bg-slate-900/50 border border-blue-100 dark:border-blue-900/40 rounded-xl p-3">
            {exercise.description}
          </p>

          {/* Gradual Multi-Tier Hints Section */}
          {hints.length > 0 && (
            <div ref={hintsRef} className="border-t border-blue-100/80 dark:border-blue-900/40 pt-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsHintsOpen(!isHintsOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                >
                  <Lightbulb className="h-4 w-4 text-amber-500 " />
                  <span>Petunjuk Pengerjaan (Hint)</span>
                  <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700/50 px-1.5 py-0.2 text-[10px] font-bold text-amber-800 dark:text-amber-300 ml-1">
                    {Math.min(unlockedLevel, hints.length)} / {hints.length}
                  </span>
                  {isHintsOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {isHintsOpen && unlockedLevel < hints.length && (
                  <button
                    type="button"
                    onClick={unlockNextHint}
                    className="flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border border-amber-200/80 dark:border-amber-700/50 px-2 py-0.5 rounded-md transition"
                  >
                    <Unlock className="h-3 w-3" />
                    <span>Buka Hint Berikutnya</span>
                  </button>
                )}
              </div>

              {isHintsOpen && (
                <div className="mt-3 space-y-2.5">
                  {hints.map((hint, idx) => {
                    const isUnlocked = idx < unlockedLevel;

                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border p-3 text-xs transition ${
                          isUnlocked
                            ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-[11px] flex items-center gap-1.5">
                            {isUnlocked ? (
                              <>
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white text-[9px] font-bold">
                                  {idx + 1}
                                </span>
                                <span className="text-amber-900 dark:text-amber-300">
                                  {idx === 0 ? 'Tingkat 1: Konsep Dasar' : idx === 1 ? 'Tingkat 2: Struktur Kode' : `Tingkat ${idx + 1}: Bantuan Lanjutan`}
                                </span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-3.5 w-3.5 text-slate-400" />
                                <span>Tingkat {idx + 1}: Terkunci</span>
                              </>
                            )}
                          </span>

                          {!isUnlocked && (
                            <button
                              type="button"
                              onClick={unlockNextHint}
                              className="text-[10px] font-semibold text-blue-600 hover:underline"
                            >
                              Buka Sekarang
                            </button>
                          )}
                        </div>

                        {isUnlocked ? (
                          <div className="pl-5 text-amber-900 leading-relaxed font-sans text-xs">
                            <pre className="whitespace-pre-wrap font-sans text-xs">{hint}</pre>
                          </div>
                        ) : (
                          <div className="pl-5 text-[11px] text-slate-400 italic">
                            Petunjuk ini dapat dibuka setelah kamu mencoba latihan atau klik &quot;Buka Sekarang&quot;.
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Solution Reveal Option after 3 attempts or if unlocked */}
                  {exercise.solutionCode && (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                          <span>Kunci Solusi Latihan</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => setShowSolution(!showSolution)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {showSolution ? (
                            <>
                              <EyeOff className="h-3 w-3" />
                              <span>Sembunyikan Solusi</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3" />
                              <span>Lihat Solusi</span>
                            </>
                          )}
                        </button>
                      </div>

                      {showSolution ? (
                        <div className="space-y-2 pt-1 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Kode Solusi Acuan:</span>
                            <button
                              type="button"
                              onClick={() => handleCopySolution(exercise.solutionCode!)}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              {copiedSolution ? 'Tersalin ke Editor!' : 'Salin ke Editor'}
                            </button>
                          </div>
                          <pre className="rounded-lg bg-slate-900 p-2.5 font-mono text-[11px] text-emerald-300 overflow-x-auto">
                            {exercise.solutionCode}
                          </pre>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400">
                          Cobalah berpikir dan mencoba terlebih dahulu sebelum mengintip solusi lengkap.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
