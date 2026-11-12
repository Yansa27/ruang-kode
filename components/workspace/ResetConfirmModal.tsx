'use client';

import { RotateCcw, AlertCircle, X } from '@/components/ui/icons';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: ResetConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xl transition-all dark:bg-slate-900 dark:border-slate-800"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
            <RotateCcw className="h-5 w-5" />
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Kembalikan ke Kode Awal?
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed dark:text-slate-400">
            Semua perubahan kode yang sudah kamu tulis pada latihan ini akan diganti kembali dengan template starter code awal.
          </p>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition dark:text-slate-100 dark:border-slate-800"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-red-700 transition"
          >
            Ya, Reset Kode
          </button>
        </div>
      </div>
    </div>
  );
}
