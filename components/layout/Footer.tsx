import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white">
            <Terminal className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-slate-800">RuangKode</span>
          <span className="text-slate-400">— Platform Edukasi Koding Interaktif Mahasiswa</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/learn/python-fundamental" className="hover:text-slate-900 transition">
            Python Fundamental
          </Link>
          <Link href="/dashboard" className="hover:text-slate-900 transition">
            Dashboard
          </Link>
          <span className="text-slate-400">© {new Date().getFullYear()} RuangKode. Semua Hak Dilindungi.</span>
        </div>
      </div>
    </footer>
  );
}
