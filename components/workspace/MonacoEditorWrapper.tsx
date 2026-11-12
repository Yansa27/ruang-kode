'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { OnMount } from '@monaco-editor/react';
import type { SaveStatus } from '@/lib/draft-saver';
import { Play, RotateCcw, Send, Loader2, CheckCircle2 } from '@/components/ui/icons';

// Lazy load Monaco Editor
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#1e1e1e] text-xs text-slate-400">
      <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />
      <span>Memuat Monaco Code Editor...</span>
    </div>
  ),
});

interface MonacoEditorWrapperProps {
  code: string;
  onChange: (value: string | undefined) => void;
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  saveStatus: SaveStatus;
  onRetrySave: () => void;
}

export default function MonacoEditorWrapper({
  code,
  onChange,
  onRun,
  onSubmit,
  onReset,
  isRunning,
  isSubmitting,
  saveStatus,
  onRetrySave,
}: MonacoEditorWrapperProps) {
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [isDark, setIsDark] = useState(true);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);
  const actions = useRef({ onRun, onSubmit, isRunning, isSubmitting });
  useEffect(() => { actions.current = { onRun, onSubmit, isRunning, isSubmitting }; }, [onRun, onSubmit, isRunning, isSubmitting]);

  // Detect & sync Monaco theme with global dark/light mode
  useEffect(() => {
    const updateTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDark(dark);
      setEditorTheme(dark ? 'vs-dark' : 'light');
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleEditorMount = useCallback<OnMount>((editor, monaco) => {
    const cursorSubscription = editor.onDidChangeCursorPosition((event) => {
      setCursorLine(event.position.lineNumber);
      setCursorCol(event.position.column);
    });
    editor.onDidDispose(() => cursorSubscription.dispose());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (!actions.current.isRunning && !actions.current.isSubmitting) actions.current.onRun();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      if (!actions.current.isRunning && !actions.current.isSubmitting) actions.current.onSubmit();
    });
  }, []);

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  const toolbarBg = isDark ? 'bg-[#252526]' : 'bg-slate-100';
  const toolbarBorder = isDark ? 'border-slate-700/80' : 'border-slate-200';
  const statusBg = isDark ? 'bg-[#007acc]' : 'bg-blue-600';
  const editorBg = isDark ? 'bg-[#1e1e1e]' : 'bg-white';

  return (
    <div suppressHydrationWarning className={`code-editor flex h-full flex-col ${editorBg} border-r ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
      {/* ── Editor Top Toolbar ── */}
      <div
        className={`flex h-11 items-center justify-between border-b ${toolbarBorder} ${toolbarBg} px-3 shrink-0 select-none`}
      >
        {/* File name + language badge */}
        <div className="flex items-center gap-2">
          <span className={`flex h-2 w-2 rounded-full ${isRunning || isSubmitting ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
          <span className={`font-mono text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            solution.py
          </span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] ${isDark ? 'bg-slate-700/80 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
            Python
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Reset */}
          <button
            onClick={onReset}
            disabled={isRunning || isSubmitting}
            title="Reset kode ke template awal"
            className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs transition disabled:opacity-40 ${
              isDark
                ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Divider */}
          <div className={`w-px h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />

          {/* Run */}
          <button
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            title={`Run code (${modKey}+Enter)`}
            className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition disabled:opacity-40 ${
              isDark
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
            ) : (
              <Play className="h-3.5 w-3.5 text-blue-400 " />
            )}
            <span>{isRunning ? 'Running...' : 'Run'}</span>
            <kbd
              className={`hidden sm:inline-block text-[9px] font-mono px-1 rounded ${
                isDark ? 'bg-slate-600 text-slate-400' : 'bg-slate-300 text-slate-500'
              }`}
            >
              {modKey}↵
            </kbd>
          </button>

          {/* Submit */}
          <button
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            title={`Submit & evaluate (${modKey}+Shift+Enter)`}
            className="flex items-center gap-1.5 rounded bg-blue-600 px-3.5 py-1 text-xs font-semibold text-white shadow-xs hover:bg-blue-500 disabled:opacity-40 transition"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
            <kbd className="hidden sm:inline-block text-[9px] font-mono px-1 rounded bg-blue-500 text-blue-200">
              {modKey}⇧↵
            </kbd>
          </button>
        </div>
      </div>

      {/* ── Monaco Code Editor ── */}
      <div className="flex-1 w-full overflow-hidden">
        <Editor
          height="100%"
          language="python"
          theme={editorTheme}
          value={code}
          onChange={onChange}
          onMount={handleEditorMount}
          options={{
            fontSize: 13.5,
            fontFamily: "var(--font-geist-mono), 'Fira Code', Menlo, Monaco, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
          }}
        />
      </div>

      {/* ── Status Bar (VS Code-style) ── */}
      <div
        className={`${statusBg} flex h-6 shrink-0 items-center justify-between px-3 text-[10px] font-medium text-white/90 select-none`}
      >
        {/* Left: cursor position */}
        <div className="editor-status-details flex min-w-0 items-center gap-3 overflow-hidden whitespace-nowrap">
          <span>Ln {cursorLine}, Col {cursorCol}</span>
          <span className="opacity-60">|</span>
          <span>Python 3.12 WebAssembly</span>
          <span className="opacity-60">|</span>
          <span>UTF-8</span>
          <span className="opacity-60">|</span>
          <span>Spaces: 4</span>
        </div>

        {/* Right: auto-save status */}
        <div className="flex shrink-0 items-center gap-1.5" role="status" aria-live="polite">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="h-2.5 w-2.5 animate-spin opacity-70" />
              <span className="opacity-70">Menyimpan...</span>
            </>
          )}
          {saveStatus === 'error' && <button onClick={onRetrySave} className="text-amber-200 underline">Gagal menyimpan · Coba lagi</button>}
          {saveStatus === 'saved' && (
            <>
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-300" />
              <span>Tersimpan Otomatis</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
