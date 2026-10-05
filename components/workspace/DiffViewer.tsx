'use client';

import { useMemo, useState } from 'react';
import { AlertCircle, Columns, List, Check, HelpCircle } from 'lucide-react';

interface DiffViewerProps {
  expected: string;
  actual: string;
}

export default function DiffViewer({ expected, actual }: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  // Compute diagnostics
  const diagnosis = useMemo(() => {
    const expTrim = expected.trim();
    const actTrim = actual.trim();

    if (!actTrim) {
      return {
        type: 'empty',
        message: 'Kode kamu tidak mencetak apapun ke terminal. Pastikan ada fungsi print() yang dieksekusi.',
        badge: 'Output Kosong',
      };
    }

    if (expTrim.toLowerCase() === actTrim.toLowerCase() && expTrim !== actTrim) {
      return {
        type: 'case',
        message: 'Perhatikan huruf besar dan huruf kecil (Python bersifat case-sensitive).',
        badge: 'Perbedaan Kapitalisasi',
      };
    }

    const expNoSpace = expTrim.replace(/\s+/g, '');
    const actNoSpace = actTrim.replace(/\s+/g, '');
    if (expNoSpace === actNoSpace && expTrim !== actTrim) {
      return {
        type: 'whitespace',
        message: 'Teks sudah benar tetapi ada kelebihan/kekurangan spasi atau baris baru (newline).',
        badge: 'Perbedaan Spasi / Format',
      };
    }

    const expPunct = expTrim.replace(/[^a-zA-Z0-9]/g, '');
    const actPunct = actTrim.replace(/[^a-zA-Z0-9]/g, '');
    if (expPunct === actPunct && expTrim !== actTrim) {
      return {
        type: 'punctuation',
        message: 'Periksa tanda baca seperti tanda seru (!), koma (,), atau titik (.).',
        badge: 'Perbedaan Tanda Baca',
      };
    }

    return null;
  }, [expected, actual]);

  // Line-by-line comparison
  const expectedLines = useMemo(() => expected.split('\n'), [expected]);
  const actualLines = useMemo(() => actual.split('\n'), [actual]);
  const maxLines = Math.max(expectedLines.length, actualLines.length);

  return (
    <div className="space-y-2.5 rounded-lg border border-slate-800 bg-[#161618] p-3 text-xs">
      {/* Diagnostic Tip */}
      {diagnosis && (
        <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-950/20 p-2.5 text-[11px] text-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-amber-300 mr-1.5">
              [{diagnosis.badge}]
            </span>
            <span>{diagnosis.message}</span>
          </div>
        </div>
      )}

      {/* Toolbar Switcher */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans border-b border-slate-800 pb-2">
        <span className="font-medium text-slate-300">Detail Perbedaan Output:</span>
        <div className="flex items-center gap-1 rounded bg-slate-800/80 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium transition ${
              viewMode === 'split'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="h-3 w-3" />
            <span>Side-by-Side</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('unified')}
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium transition ${
              viewMode === 'unified'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="h-3 w-3" />
            <span>Baris Bertingkat</span>
          </button>
        </div>
      </div>

      {/* Diff Table View */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
          {/* Expected Side */}
          <div className="rounded border border-emerald-500/30 bg-emerald-950/20 p-2.5">
            <div className="flex items-center justify-between text-[10px] font-sans font-semibold text-emerald-400 mb-1.5">
              <span>Ekspektasi (Yang Seharusnya):</span>
              <span className="rounded bg-emerald-900/60 px-1.5 py-0.2">Benar</span>
            </div>
            <div className="space-y-1 overflow-x-auto">
              {expectedLines.map((line, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-slate-500 select-none w-4 text-right text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="text-emerald-300 whitespace-pre">
                    {line || <span className="text-slate-600 italic">(baris kosong)</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actual Side */}
          <div className="rounded border border-red-500/30 bg-red-950/20 p-2.5">
            <div className="flex items-center justify-between text-[10px] font-sans font-semibold text-red-400 mb-1.5">
              <span>Hasil Kode Kamu:</span>
              <span className="rounded bg-red-900/60 px-1.5 py-0.2">Salah</span>
            </div>
            <div className="space-y-1 overflow-x-auto">
              {actualLines.length > 0 && actual.trim() ? (
                actualLines.map((line, idx) => {
                  const isMatch = line === expectedLines[idx];
                  return (
                    <div
                      key={idx}
                      className={`flex gap-2 rounded px-1 -mx-1 ${
                        isMatch ? 'bg-transparent' : 'bg-red-500/10'
                      }`}
                    >
                      <span className="text-slate-500 select-none w-4 text-right text-[10px]">
                        {idx + 1}
                      </span>
                      <span
                        className={`whitespace-pre ${
                          isMatch ? 'text-slate-300' : 'text-red-300 font-bold'
                        }`}
                      >
                        {line || <span className="text-slate-600 italic">(baris kosong)</span>}
                      </span>
                    </div>
                  );
                })
              ) : (
                <span className="text-slate-500 italic text-[11px] block pt-1">
                  (Tidak ada output yang dihasilkan)
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Unified Line-by-Line View */
        <div className="space-y-1.5 rounded border border-slate-800 bg-slate-900/80 p-2.5 font-mono text-[11px] overflow-x-auto">
          {Array.from({ length: maxLines }).map((_, idx) => {
            const expLine = expectedLines[idx];
            const actLine = actualLines[idx];
            const isMatch = expLine !== undefined && actLine !== undefined && expLine === actLine;

            return (
              <div key={idx} className="space-y-0.5 border-b border-slate-800/50 pb-1.5 last:border-0 last:pb-0">
                <div className="text-[9px] text-slate-500 font-sans">Baris {idx + 1}:</div>
                {expLine !== undefined && (
                  <div className="flex items-center gap-2 rounded bg-emerald-950/40 px-2 py-0.5 text-emerald-300">
                    <span className="text-emerald-500 font-bold w-3 select-none">+</span>
                    <span className="whitespace-pre">{expLine}</span>
                  </div>
                )}
                {actLine !== undefined ? (
                  <div
                    className={`flex items-center gap-2 rounded px-2 py-0.5 ${
                      isMatch
                        ? 'bg-slate-800/40 text-slate-300'
                        : 'bg-red-950/40 text-red-300 font-semibold'
                    }`}
                  >
                    <span
                      className={`font-bold w-3 select-none ${
                        isMatch ? 'text-slate-500' : 'text-red-400'
                      }`}
                    >
                      {isMatch ? ' ' : '-'}
                    </span>
                    <span className="whitespace-pre">{actLine}</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-red-400/80 italic pl-5">
                    (Baris ini belum tercetak pada output kamu)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
