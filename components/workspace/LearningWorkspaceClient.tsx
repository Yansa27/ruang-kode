'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import WorkspaceNavbar from './WorkspaceNavbar';
import LessonSidebar from './LessonSidebar';
import LessonContentPanel from './LessonContentPanel';
import OutputConsolePanel from './OutputConsolePanel';
import ExerciseSuccessModal from './ExerciseSuccessModal';
import ResetConfirmModal from './ResetConfirmModal';
import { runPythonCode } from '@/lib/pyodide';
import { soundFx } from '@/lib/sound';
import { BookOpen, Code2, Terminal, CheckCircle2 } from 'lucide-react';

const MonacoEditorWrapper = dynamic(() => import('./MonacoEditorWrapper'), { ssr: false, loading: () => <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900"><div className="animate-pulse flex flex-col items-center"><Code2 className="h-8 w-8 text-slate-300 mb-2" /><span className="text-xs text-slate-400">Memuat Editor...</span></div></div> });

interface TestCaseItem {
  id: string;
  order: number;
  expectedOutput: string;
  input?: string | null;
  isHidden: boolean;
}

interface ExerciseData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  starterCode: string;
  solutionCode?: string | null;
  testCases: TestCaseItem[];
}

interface LessonData {
  id: string;
  slug: string;
  title: string;
  description: string;
  learningObjectives: string[];
  content: string;
  exampleCode?: string | null;
  starterCode?: string | null;
  hints: string[];
  exercise?: ExerciseData | null;
}

interface ChapterData {
  id: string;
  title: string;
  order: number;
  lessons: {
    id: string;
    slug: string;
    title: string;
    order: number;
  }[];
}

interface LearningWorkspaceClientProps {
  course: {
    id: string;
    slug: string;
    title: string;
  };
  currentChapter: {
    id: string;
    title: string;
  };
  lesson: LessonData;
  chapters: ChapterData[];
  initialCode?: string | null;
  completedLessonIds: string[];
  userStats?: {
    xp: number;
    streak: number;
  } | null;
}

export default function LearningWorkspaceClient({
  course,
  currentChapter,
  lesson,
  chapters,
  initialCode,
  completedLessonIds: initialCompletedLessonIds,
  userStats: initialUserStats,
}: LearningWorkspaceClientProps) {
  // Code state
  const defaultStarter = lesson.exercise?.starterCode || lesson.starterCode || '# Tulis kode Python kamu di sini\n';
  const [code, setCode] = useState<string>(initialCode || defaultStarter);

  // Runtime and console states
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [pyodideStatus, setPyodideStatus] = useState<string>('Python WebAssembly Siap');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modul A states: Hints, Reset Modal, Failed Attempts
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isHintsOpen, setIsHintsOpen] = useState<boolean>(false);
  const [resetToast, setResetToast] = useState<boolean>(false);

  // Modul D states: Split panel resizer (percentages)
  const [leftWidth, setLeftWidth] = useState<number>(30);
  const [rightWidth, setRightWidth] = useState<number>(30);
  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);
  const workspaceContainerRef = useRef<HTMLDivElement>(null);

  // Layout states
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'materi' | 'code' | 'output'>('code');
  const [consoleTab, setConsoleTab] = useState<'output' | 'testcases'>('output');

  // Drag handler for panel resizers
  useEffect(() => {
    if (!isResizing) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!workspaceContainerRef.current) return;
      const rect = workspaceContainerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const relativeX = clientX - rect.left;
      const totalWidth = rect.width;

      if (isResizing === 'left') {
        const newLeft = Math.min(Math.max((relativeX / totalWidth) * 100, 20), 45);
        setLeftWidth(newLeft);
      } else if (isResizing === 'right') {
        const fromRight = totalWidth - relativeX;
        const newRight = Math.min(Math.max((fromRight / totalWidth) * 100, 20), 45);
        setRightWidth(newRight);
      }
    };

    const handlePointerUp = () => {
      setIsResizing(null);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isResizing]);

  // Test case evaluation states
  const [testCaseResults, setTestCaseResults] = useState<any[] | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [earnedXp, setEarnedXp] = useState<number>(0);
  const [nextLessonSlug, setNextLessonSlug] = useState<string | null>(null);

  // Progress state
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(initialCompletedLessonIds);
  const [userStats, setUserStats] = useState(initialUserStats);

  const totalLessons = chapters.flatMap((c) => c.lessons).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0;

  // Auto-save draft code debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code && code !== defaultStarter) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId: lesson.id, code }),
        }).catch(() => {});
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [code, lesson.id, defaultStarter]);

  // Helper to normalize outputs for fair comparison (ignore trailing spaces and newlines)
  const normalizeOutput = (str: string) => {
    return str
      .trim()
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');
  };

  // Run Code
  const handleRun = async () => {
    soundFx.playRun();
    setIsRunning(true);
    setError(null);
    setPyodideStatus('Menjalankan kode Python...');

    // Switch view on mobile to output
    if (window.innerWidth < 768) {
      setMobileTab('output');
    }
    setConsoleTab('output');

    try {
      const result = await runPythonCode(code, (status) => setPyodideStatus(status));
      setOutput(result.output);
      setError(result.error || null);
      setExecutionTimeMs(result.executionTimeMs);
      setPyodideStatus('Python 3.12 Siap');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan eksekusi.');
      setPyodideStatus('Python Error');
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Exercise
  const handleSubmit = async () => {
    if (!lesson.exercise) {
      handleRun();
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setPyodideStatus('Mengevaluasi jawaban...');
    setConsoleTab('testcases');

    if (window.innerWidth < 768) {
      setMobileTab('output');
    }

    try {
      // 1. Run user code in Pyodide
      const result = await runPythonCode(code, (status) => setPyodideStatus(status));
      setOutput(result.output);
      setError(result.error || null);
      setExecutionTimeMs(result.executionTimeMs);

      const normalizedActual = normalizeOutput(result.output);

      // 2. Evaluate test cases
      const testCases = lesson.exercise.testCases || [];
      const evaluatedTests = testCases.map((tc) => {
        const normalizedExpected = normalizeOutput(tc.expectedOutput);
        const passed = result.success && normalizedActual === normalizedExpected;

        return {
          order: tc.order,
          expectedOutput: tc.expectedOutput,
          actualOutput: result.output,
          passed,
          isHidden: tc.isHidden,
        };
      });

      setTestCaseResults(evaluatedTests);

      const allPassed = evaluatedTests.length > 0 && evaluatedTests.every((t) => t.passed);
      const submissionStatus = allPassed ? 'PASSED' : 'FAILED';

      if (!allPassed) {
        setFailedAttempts((prev) => prev + 1);
      } else {
        setFailedAttempts(0);
      }

      // 3. Send submission to API
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: lesson.exercise.id,
          lessonId: lesson.id,
          code,
          status: submissionStatus,
          output: result.output,
          errorMessage: result.error,
        }),
      });

      const data = await response.json();

      if (data.status === 'PASSED') {
        soundFx.playSuccess();
        setPyodideStatus('Selamat! Seluruh test case berhasil.');
        setEarnedXp(data.earnedXp || 20);

        if (!completedLessonIds.includes(lesson.id)) {
          setCompletedLessonIds((prev) => [...prev, lesson.id]);
        }

        if (data.userStats) {
          setUserStats(data.userStats);
        }

        setNextLessonSlug(data.nextLessonSlug);
        setShowSuccessModal(true);
      } else {
        soundFx.playFailure();
        setPyodideStatus('Jawaban belum sesuai. Silakan periksa kembali.');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengevaluasi submission.');
      setPyodideStatus('Evaluasi gagal');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open reset confirmation modal
  const handleOpenResetModal = () => {
    setIsResetModalOpen(true);
  };

  // Execute reset code
  const handleConfirmReset = () => {
    setCode(defaultStarter);
    setOutput('');
    setError(null);
    setTestCaseResults(null);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  // Open hints from console
  const handleOpenHints = () => {
    setIsHintsOpen(true);
    if (window.innerWidth < 768) {
      setMobileTab('materi');
    }
  };

  const handleCopyExample = (exampleSnippet: string) => {
    setCode((prev) => `${prev.trim()}\n\n# Contoh yang disalin:\n${exampleSnippet}`);
  };

  return (
    <div suppressHydrationWarning className="flex h-screen flex-col bg-slate-100 overflow-hidden font-sans">
      {/* Workspace Top Navigation Bar */}
      <WorkspaceNavbar
        courseTitle={course.title}
        courseSlug={course.slug}
        chapterTitle={currentChapter.title}
        lessonTitle={lesson.title}
        progressPercent={progressPercent}
        completedLessonsCount={completedLessonIds.length}
        totalLessons={totalLessons}
        userStats={userStats}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Mobile Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 md:hidden shrink-0">
        <button
          onClick={() => setMobileTab('materi')}
          className={`flex-1 py-2 text-center text-xs font-semibold flex items-center justify-center gap-1.5 ${
            mobileTab === 'materi'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Materi</span>
        </button>
        <button
          onClick={() => setMobileTab('code')}
          className={`flex-1 py-2 text-center text-xs font-semibold flex items-center justify-center gap-1.5 ${
            mobileTab === 'code'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>Editor</span>
        </button>
        <button
          onClick={() => setMobileTab('output')}
          className={`flex-1 py-2 text-center text-xs font-semibold flex items-center justify-center gap-1.5 ${
            mobileTab === 'output'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>Output</span>
        </button>
      </div>

      {/* Main Workspace Body */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Course Syllabus Sidebar */}
        <LessonSidebar
          chapters={chapters}
          currentLessonSlug={lesson.slug}
          courseSlug={course.slug}
          completedLessonIds={completedLessonIds}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* 3-Panel Desktop Layout with Split Resizers */}
        <div
          ref={workspaceContainerRef}
          className={`flex flex-1 overflow-hidden ${
            isResizing ? 'select-none cursor-col-resize' : ''
          }`}
        >
          {/* Panel 1: Lesson Material (Resizable on desktop) */}
          <div
            style={{ width: `${leftWidth}%` }}
            className={`w-full shrink-0 h-full ${
              mobileTab === 'materi' ? 'block' : 'hidden md:block'
            }`}
          >
            <LessonContentPanel
              title={lesson.title}
              description={lesson.description}
              learningObjectives={lesson.learningObjectives}
              content={lesson.content}
              exampleCode={lesson.exampleCode}
              hints={lesson.hints}
              exercise={lesson.exercise}
              onCopyExampleToEditor={handleCopyExample}
              failedAttempts={failedAttempts}
              isHintsOpen={isHintsOpen}
              onToggleHints={setIsHintsOpen}
            />
          </div>

          {/* Resizer Handle 1 (Materi <-> Editor) */}
          <div
            onMouseDown={() => setIsResizing('left')}
            onTouchStart={() => setIsResizing('left')}
            onDoubleClick={() => setLeftWidth(30)}
            title="Tarik untuk atur lebar panel materi (Klik 2x untuk reset)"
            className="hidden md:flex w-1.5 shrink-0 bg-slate-200 dark:bg-slate-800 hover:bg-blue-500 active:bg-blue-600 cursor-col-resize items-center justify-center transition-colors group z-20"
          >
            <div className="h-6 w-0.5 rounded-full bg-slate-400 group-hover:bg-white" />
          </div>

          {/* Panel 2: Code Editor (Flex-1) */}
          <div
            className={`flex-1 h-full min-w-0 ${
              mobileTab === 'code' ? 'block' : 'hidden md:block'
            }`}
          >
            <MonacoEditorWrapper
              code={code}
              onChange={(val) => setCode(val || '')}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={handleOpenResetModal}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Resizer Handle 2 (Editor <-> Console) */}
          <div
            onMouseDown={() => setIsResizing('right')}
            onTouchStart={() => setIsResizing('right')}
            onDoubleClick={() => setRightWidth(30)}
            title="Tarik untuk atur lebar console output (Klik 2x untuk reset)"
            className="hidden md:flex w-1.5 shrink-0 bg-slate-200 dark:bg-slate-800 hover:bg-blue-500 active:bg-blue-600 cursor-col-resize items-center justify-center transition-colors group z-20"
          >
            <div className="h-6 w-0.5 rounded-full bg-slate-400 group-hover:bg-white" />
          </div>

          {/* Panel 3: Output & Test Case Console (Resizable on desktop) */}
          <div
            style={{ width: `${rightWidth}%` }}
            className={`w-full shrink-0 h-full ${
              mobileTab === 'output' ? 'block' : 'hidden md:block'
            }`}
          >
            <OutputConsolePanel
              output={output}
              error={error}
              pyodideStatus={pyodideStatus}
              executionTimeMs={executionTimeMs}
              testCaseResults={testCaseResults}
              activeTab={consoleTab}
              onTabChange={setConsoleTab}
              onClearOutput={() => {
                setOutput('');
                setError(null);
                setTestCaseResults(null);
              }}
              onOpenHints={handleOpenHints}
              failedAttempts={failedAttempts}
            />
          </div>
        </div>
      </div>

      {/* Modern Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      {/* Reset Toast Notification */}
      {resetToast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Kode berhasil dikembalikan ke template awal!</span>
        </div>
      )}

      {/* Exercise Success Modal */}
      <ExerciseSuccessModal
        isOpen={showSuccessModal}
        earnedXp={earnedXp}
        nextLessonSlug={nextLessonSlug}
        courseSlug={course.slug}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
