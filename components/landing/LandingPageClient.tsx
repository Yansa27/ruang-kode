'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle2, Loader2, Trophy } from 'lucide-react';

const CODE_LINES = [
  { text: '# Mari berhitung nilai rata-rata', type: 'comment' },
  { text: 'def hitung_rata_rata(nilai):', type: 'code' },
  { text: '    total = sum(nilai)', type: 'code' },
  { text: '    return total / len(nilai)', type: 'code' },
  { text: '', type: 'blank' },
  { text: 'skor_akhir = [85, 92, 78, 90]', type: 'code' },
  { text: 'print(hitung_rata_rata(skor_akhir))', type: 'code' },
];

const OUTPUT_LINES = [
  { text: 'Memuat Python 3.12 (WebAssembly)...', type: 'info', delay: 200 },
  { text: '86.25', type: 'result', delay: 600 },
  { text: '', type: 'blank', delay: 800 },
  { text: '✓ Test Case Lulus: Hasil Sesuai', type: 'pass', delay: 1000 },
  { text: '🎉 +20 XP didapatkan!', type: 'xp', delay: 1400 },
];

export default function LandingPageClient() {
  const [codeVisible, setCodeVisible] = useState(0);
  const [running, setRunning] = useState(false);
  const [outputVisible, setOutputVisible] = useState(0);
  const [done, setDone] = useState(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAll = () => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  };

  const runDemo = () => {
    clearAll();
    setCodeVisible(0);
    setRunning(false);
    setOutputVisible(0);
    setDone(false);

    // Type code line by line
    CODE_LINES.forEach((_, i) => {
      const t = setTimeout(() => setCodeVisible(i + 1), i * 150 + 300);
      timeoutRefs.current.push(t);
    });

    // After code finishes, show running state
    const runDelay = CODE_LINES.length * 150 + 600;
    const t1 = setTimeout(() => setRunning(true), runDelay);
    timeoutRefs.current.push(t1);

    // Reveal output lines
    OUTPUT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setRunning(false);
        setOutputVisible(i + 1);
        if (i === OUTPUT_LINES.length - 1) setDone(true);
      }, runDelay + line.delay);
      timeoutRefs.current.push(t);
    });
  };

  // Auto-play on mount
  useEffect(() => {
    const t = setTimeout(runDemo, 600);
    return () => clearAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLineColor = (type: string) => {
    switch (type) {
      case 'comment': return 'text-slate-400 italic';
      case 'code': return 'text-slate-700';
      case 'blank': return '';
      default: return 'text-slate-700';
    }
  };

  const getOutputColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-slate-400 text-[11px]';
      case 'result': return 'text-slate-800 font-bold text-sm';
      case 'pass': return 'text-emerald-600 font-semibold';
      case 'xp': return 'text-amber-500 font-bold';
      case 'blank': return '';
      default: return 'text-slate-600';
    }
  };

  // Friendly Python syntax highlight
  const highlight = (text: string) => {
    if (!text) return <span>&nbsp;</span>;
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: text
            .replace(/(&)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/(#.*)$/, '<span class="text-slate-400 italic">$1</span>')
            .replace(/\b(def|return|sum|len|print)\b/g, '<span class="text-indigo-600 font-bold">$1</span>')
            .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-amber-600 font-semibold">$1</span>')
            .replace(/\b(hitung_rata_rata|nilai|total|skor_akhir)\b/g, '<span class="text-blue-600">$1</span>'),
        }}
      />
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 min-h-[280px] bg-white dark:bg-[#0B0F19]">
      {/* Left: Code Editor (3/5 width) */}
      <div className="sm:col-span-3 p-6 font-mono text-[13px] border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0B0F19]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Editor Kode</span>
          <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="space-y-1.5 leading-relaxed">
          {CODE_LINES.map((line, i) => (
            <div
              key={i}
              className={`flex gap-4 transition-opacity duration-150 ${
                i < codeVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="w-5 text-right font-semibold text-slate-300 dark:text-slate-700 shrink-0 select-none">{i + 1}</span>
              <span className={getLineColor(line.type)}>
                {i < codeVisible ? highlight(line.text) : <span>&nbsp;</span>}
                {i === codeVisible - 1 && !done && (
                  <span className="inline-block w-1.5 h-3.5 bg-blue-500 ml-1 animate-pulse align-middle rounded-sm" />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Terminal Output (2/5 width) */}
      <div className="sm:col-span-2 p-6 font-mono text-[13px] bg-slate-900 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Output Terminal</span>
          <button
            onClick={runDemo}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 px-2.5 py-1 text-[10px] font-bold text-blue-400 transition-colors font-sans"
          >
            {running ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Play className="h-3 w-3 fill-blue-400" />
            )}
            {running ? 'Running' : 'Run Ulang'}
          </button>
        </div>

        <div className="space-y-2 flex-1">
          {running && outputVisible === 0 && (
            <div className="flex items-center gap-2 text-slate-400 animate-pulse font-sans text-xs font-medium">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Memproses kode...</span>
            </div>
          )}
          {OUTPUT_LINES.map((line, i) => (
            <div
              key={i}
              className={`transition-all duration-300 ${
                i < outputVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className={getOutputColor(line.type)}>{line.text || '\u00A0'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
