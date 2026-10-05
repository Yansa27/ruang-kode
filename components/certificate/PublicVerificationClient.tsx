'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  Calendar,
  Award,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

interface VerifiedCertificate {
  certificateNumber: string;
  issuedAt: string;
  metadata?: string | null;
  user: {
    name: string;
    email: string;
  };
  course: {
    title: string;
    level: string;
    slug: string;
    chapters: {
      title: string;
      lessons: { title: string }[];
    }[];
  };
}

interface PublicVerificationClientProps {
  initialCertificateNumber?: string;
  certificate?: VerifiedCertificate | null;
  notFoundState?: boolean;
}

export default function PublicVerificationClient({
  initialCertificateNumber = '',
  certificate,
  notFoundState = false,
}: PublicVerificationClientProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(initialCertificateNumber);
  const [copied, setCopied] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = searchInput.trim().toUpperCase();
    if (cleanId) {
      router.push(`/verify/${cleanId}`);
    }
  };

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Mask email for privacy (e.g., b***@example.com)
  const maskEmail = (email: string) => {
    const [user, domain] = email.split('@');
    if (!domain) return email;
    const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
    return `${maskedUser}@${domain}`;
  };

  const formattedDate = certificate
    ? new Date(certificate.issuedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-150">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-2xs">
            <Terminal className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
              Ruang<span className="text-blue-600 dark:text-blue-400">Kode</span>
            </span>
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
              VERIFY
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <ThemeToggle size="sm" />
          <Link
            href="/login"
            className="rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
          >
            Masuk Platform
          </Link>
        </div>
      </header>

      {/* Main Verification Canvas */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Search Bar / Input Card */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Portal Validasi Kredensial Publik</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Verifikasi Keaslian Sertifikat Digital
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Masukkan Nomor Kredensial Sertifikat (contoh: <code className="font-mono text-blue-600 dark:text-blue-400 font-bold">RK-PY-2026-A89F2</code>) untuk memastikan validitasnya.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto pt-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="RK-PY-2026-XXXXX"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 py-2 pl-9 pr-3 text-xs sm:text-sm font-mono uppercase text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xs transition shrink-0"
            >
              Cek Validitas
            </button>
          </form>
        </div>

        {/* Verification Result: FOUND & VERIFIED */}
        {certificate && (
          <div className="rounded-2xl border border-emerald-200/90 dark:border-emerald-900/60 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Status Header Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xs">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      SERTIFIKAT RESMI TERVERIFIKASI
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    Kredensial Sah & Terdaftar di Basis Data
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin Bukti'}</span>
                </button>

                <Link
                  href={`/certificate/${certificate.certificateNumber}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition"
                >
                  <span>Lihat Lembar Sertifikat</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Recipient & Credential Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Nama Penerima
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {certificate.user.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Akun: {maskEmail(certificate.user.email)}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Program Kursus
                </p>
                <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                  {certificate.course.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tingkat: {certificate.course.level} • 10 Modul Interaktif
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Nomor Kredensial
                </p>
                <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  {certificate.certificateNumber}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Status: Aktif & Permanen
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tanggal Terbit
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {formattedDate}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Penerbit: RuangKode Indonesia
                </p>
              </div>
            </div>

            {/* Curriculum Competencies Mastered */}
            <div className="pt-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Kompetensi & Bab Kurikulum yang Diselesaikan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {certificate.course.chapters.map((ch, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{ch.title}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        {ch.lessons.length} Lesson interaktif & evaluasi koding lolos 100%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Verification Result: NOT FOUND */}
        {notFoundState && (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-slate-900 p-8 shadow-xs text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto shadow-2xs">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 rounded-md bg-red-100 dark:bg-red-950 px-2 py-0.5 text-xs font-bold text-red-700 dark:text-red-300">
                SERTIFIKAT TIDAK DITEMUKAN
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                Nomor Kredensial Tidak Terdaftar
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Kredensial dengan kode <code className="font-mono font-bold text-red-600 dark:text-red-400">{initialCertificateNumber}</code> tidak ditemukan di basis data resmi RuangKode. Pastikan tidak ada kesalahan ketik pada format ID.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
