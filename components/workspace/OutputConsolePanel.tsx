'use client';

import { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  GitCompare,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from '@/components/ui/icons';
import DiffViewer from './DiffViewer';

interface TestCaseResult {
  order: number;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  isHidden?: boolean;
}

interface OutputConsolePanelProps {
  output: string;
  error?: string | null;
  pyodideStatus: string;
  executionTimeMs?: number | null;
  testCaseResults?: TestCaseResult[] | null;
  activeTab: 'output' | 'testcases';
  onTabChange: (tab: 'output' | 'testcases') => void;
  onClearOutput: () => void;
  onOpenHints?: () => void;
  failedAttempts?: number;
}

export default function OutputConsolePanel({
  output,
  error,
  pyodideStatus,
  executionTimeMs,
  testCaseResults,
  activeTab,
  onTabChange,
  onClearOutput,
  onOpenHints,
  failedAttempts = 0,
}: OutputConsolePanelProps) {
  const [expandedDiffs, setExpandedDiffs] = useState<Record<number, boolean>>({});

  const toggleDiff = (order: number) => {
    setExpandedDiffs((prev) => ({
      ...prev,
      [order]: !prev[order],
    }));
  };

  const hasTests = testCaseResults && testCaseResults.length > 0;
  const allTestsPassed = hasTests && testCaseResults.every((tc) => tc.passed);
  const failedCount = hasTests ? testCaseResults.filter((tc) => !tc.passed).length : 0;

  return (
    <div suppressHydrationWarning className="flex h-full flex-col bg-[#18181b] text-slate-200">
      {/* Console Header Tabs */}
      <div className="flex h-11 items-center justify-between border-b border-slate-800 bg-[#202023] px-3 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onTabChange('output')}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition ${
              activeTab === 'output'
                ? 'bg-slate-700/80 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-blue-400" />
            <span>Output Console</span>
          </button>

          <button
            onClick={() => onTabChange('testcases')}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition ${
              activeTab === 'testcases'
                ? 'bg-slate-700/80 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2
              className={`h-3.5 w-3.5 ${
                hasTests
                  ? allTestsPassed
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                  : 'text-slate-400'
              }`}
            />
            <span>Test Case</span>
            {hasTests && (
              <span
                className={`ml-1 rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                  allTestsPassed
                    ? 'bg-emerald-950 text-emerald-300'
                    : 'bg-red-950 text-red-300'
                }`}
              >
                {testCaseResults.filter((t) => t.passed).length}/{testCaseResults.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {executionTimeMs !== undefined && executionTimeMs !== null && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{executionTimeMs}ms</span>
            </span>
          )}

          <button
            onClick={onClearOutput}
            title="Bersihkan Console"
            className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Runtime Status Notice */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#141416] px-3 py-1.5 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              pyodideStatus.includes('Siap') || pyodideStatus.includes('siap')
                ? 'bg-emerald-500 animate-pulse'
                : 'bg-amber-500 animate-spin'
            }`}
          />
          <span>{pyodideStatus}</span>
        </div>
        <span className="text-[10px] text-slate-500">Pyodide WebAssembly</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs console-scrollbar">
        {activeTab === 'output' ? (
          <div>
            {output ? (
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans">
                  Standar Output (stdout):
                </span>
                <pre className="whitespace-pre-wrap rounded-lg bg-slate-900/90 border border-slate-800 p-3 text-emerald-300 leading-relaxed font-mono">
                  {output}
                </pre>
              </div>
            ) : null}

            {error && (
              <div className="mt-3 rounded-lg border border-red-500/40 bg-red-950/40 p-3.5 text-red-200 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-sans font-bold text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Python Execution Error</span>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-[11px] text-red-300 leading-relaxed">
                  {error}
                </pre>
              </div>
            )}

            {!output && !error && (
              <div className="flex h-48 flex-col items-center justify-center text-center text-slate-500 font-sans text-xs">
                <Terminal className="h-8 w-8 text-slate-600 mb-2" />
                <p>Belum ada output yang dihasilkan.</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Tulis kode di editor dan klik tombol <span className="font-semibold text-slate-400">Run</span> atau <span className="font-semibold text-slate-400">Submit</span>.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Test Cases Tab */
          <div className="space-y-4 font-sans">
            {/* Friendly Assistance Banner if failed */}
            {hasTests && !allTestsPassed && failedAttempts >= 1 && onOpenHints && (
              <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-300">
                      Butuh petunjuk?
                    </p>
                    <p className="text-[11px] text-amber-200/80">
                      Kamu sudah mencoba {failedAttempts}x. Buka Hint di panel materi untuk panduan langkah demi langkah.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenHints}
                  className="rounded-lg bg-amber-500/20 border border-amber-400/40 px-3 py-1 text-xs font-semibold text-amber-200 hover:bg-amber-500/30 transition shrink-0 ml-3"
                >
                  Buka Hint
                </button>
              </div>
            )}

            {hasTests ? (
              <div className="space-y-3">
                {testCaseResults.map((tc, idx) => {
                  const isDiffOpen = expandedDiffs[tc.order] ?? !tc.passed;

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border p-3.5 text-xs transition ${
                        tc.passed
                          ? 'border-emerald-500/40 bg-emerald-950/20'
                          : 'border-red-500/40 bg-red-950/20'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <div className="flex items-center gap-2">
                          {tc.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className="text-slate-200">Test Case #{tc.order}</span>
                          {tc.isHidden && (
                            <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] text-slate-400 font-normal">
                              Hidden
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!tc.passed && (
                            <button
                              type="button"
                              onClick={() => toggleDiff(tc.order)}
                              className="flex items-center gap-1 rounded bg-slate-800/80 hover:bg-slate-700/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 transition"
                            >
                              <GitCompare className="h-3 w-3 text-blue-400" />
                              <span>{isDiffOpen ? 'Sembunyikan Diff' : 'Visual Diff'}</span>
                              {isDiffOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                          )}
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              tc.passed
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {tc.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>
                      </div>

                      {/* Visual Diff View when Failed & Expanded */}
                      {!tc.passed && isDiffOpen ? (
                        <div className="mt-3">
                          <DiffViewer
                            expected={tc.expectedOutput}
                            actual={tc.actualOutput}
                          />
                        </div>
                      ) : (
                        /* Standard View */
                        <div className="mt-3 space-y-2 font-mono text-[11px]">
                          <div>
                            <span className="text-[10px] text-slate-400 font-sans block">
                              Expected Output:
                            </span>
                            <pre className="mt-1 rounded bg-slate-900/90 p-2 text-slate-300">
                              {tc.expectedOutput}
                            </pre>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 font-sans block">
                              Your Output:
                            </span>
                            <pre
                              className={`mt-1 rounded bg-slate-900/90 p-2 ${
                                tc.passed ? 'text-emerald-300' : 'text-red-300'
                              }`}
                            >
                              {tc.actualOutput || '(Tidak ada output)'}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center text-center text-slate-500 text-xs">
                <CheckCircle2 className="h-8 w-8 text-slate-600 mb-2" />
                <p>Klik tombol Submit untuk menjalankan auto-check test case.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
