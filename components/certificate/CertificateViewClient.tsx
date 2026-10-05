'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Printer,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Download,
  ExternalLink,
  Award,
} from 'lucide-react';

interface CertificateData {
  id: string;
  certificateNumber: string;
  issuedAt: string | Date;
  metadata?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    slug: string;
    level: string;
  };
}

interface CertificateViewClientProps {
  certificate: CertificateData;
}

export default function CertificateViewClient({ certificate }: CertificateViewClientProps) {
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${certificate.certificateNumber}`
    : `/verify/${certificate.certificateNumber}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
      certificate.course.title
    )}&organizationName=RuangKode&issueYear=${new Date(certificate.issuedAt).getFullYear()}&issueMonth=${
      new Date(certificate.issuedAt).getMonth() + 1
    }&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(
      certificate.certificateNumber
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 sm:px-6 flex flex-col items-center">
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="w-full max-w-5xl mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Dashboard</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-2xs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Tautan Tersalin!' : 'Salin Tautan'}</span>
          </button>

          <button
            onClick={shareToLinkedIn}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#0077b5]/30 bg-[#0077b5]/10 px-3 py-1.5 text-xs font-semibold text-[#0077b5] dark:text-[#38a0dc] hover:bg-[#0077b5]/20 transition shadow-2xs"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Bagikan ke LinkedIn</span>
          </button>

          <Link
            href={`/verify/${certificate.certificateNumber}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shadow-2xs"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Halaman Verifikasi Publik</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div
        id="certificate-paper"
        className="w-full max-w-5xl bg-white text-slate-900 shadow-2xl rounded-2xl border-8 border-slate-900 p-8 sm:p-12 relative overflow-hidden print:m-0 print:border-4 print:shadow-none print:max-w-none print:w-full print:rounded-none"
        style={{
          aspectRatio: '1.414 / 1', // Standard A4 Landscape ratio
        }}
      >
        {/* Decorative Gold Foil Outer Ring Accent */}
        <div className="absolute inset-2 sm:inset-3 border border-amber-600/30 rounded-xl pointer-events-none" />
        <div className="absolute inset-3 sm:inset-4 border-2 border-slate-900/80 rounded-lg pointer-events-none" />

        {/* Corner Ornaments */}
        <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
        <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
        <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-amber-600 pointer-events-none" />

        {/* Subtle Watermark Logo in Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <Award className="w-96 h-96 text-slate-900" />
        </div>

        {/* Certificate Content Grid */}
        <div className="relative z-10 h-full flex flex-col justify-between text-center px-4 sm:px-12 py-4">
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 mb-1">
              <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                &gt;_
              </div>
              <span className="text-base font-extrabold tracking-wider uppercase text-slate-900">
                RUANGKODE INDONESIA
              </span>
            </div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-500">
              LEMBAGA PENGEMBANGAN KOMPETENSI TEKNOLOGI & PEMROGRAMAN
            </p>
            <div className="pt-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 uppercase font-serif">
                Sertifikat Kelulusan
              </h1>
              <p className="text-xs sm:text-sm font-medium italic text-slate-500 tracking-wide mt-0.5">
                Certificate of Technical Mastery & Completion
              </p>
            </div>
          </div>

          {/* Student Recipient Section */}
          <div className="py-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              Diberikan dengan penuh apresiasi kepada:
            </p>
            <div className="my-2 border-b-2 border-slate-900/30 pb-1 max-w-lg mx-auto">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-serif">
                {certificate.user.name}
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-600 max-w-2xl mx-auto leading-relaxed mt-2">
              Atas dedikasi dan keberhasilannya menyelesaikan seluruh kurikulum materi interaktif,
              studi kasus algoritma, dan tantangan koding berbasis evaluasi otomatis pada program:
            </p>
            <div className="mt-2">
              <span className="inline-block text-base sm:text-xl font-bold text-blue-700 bg-blue-50/80 px-4 py-1 rounded-lg border border-blue-200">
                {certificate.course.title}
              </span>
            </div>
          </div>

          {/* Verification, Seal & Signatures Footer */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-3 items-end text-left gap-4">
            {/* Left: QR Code & Verification Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {/* Embedded SVG QR Code representation */}
                <div className="h-14 w-14 bg-slate-900 p-1.5 rounded-lg shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-white p-1 grid grid-cols-3 grid-rows-3 gap-0.5">
                    <div className="bg-slate-900 rounded-xs" />
                    <div className="bg-slate-900 rounded-xs" />
                    <div className="bg-white" />
                    <div className="bg-slate-900 rounded-xs" />
                    <div className="bg-slate-900 rounded-xs" />
                    <div className="bg-slate-900 rounded-xs" />
                    <div className="bg-white" />
                    <div className="bg-slate-900 rounded-xs" />
                    <div className="bg-slate-900 rounded-xs" />
                  </div>
                </div>
                <div className="text-[10px] space-y-0.5">
                  <p className="font-bold text-slate-900">ID Kredensial:</p>
                  <p className="font-mono text-slate-700 font-semibold">{certificate.certificateNumber}</p>
                  <p className="text-slate-500">Terbit: {formattedDate}</p>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 truncate max-w-[220px]">
                Validasi: ruangkode.id/verify/{certificate.certificateNumber}
              </p>
            </div>

            {/* Center: Official Golden Verification Stamp */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-full border-4 border-double border-amber-600 bg-gradient-to-tr from-amber-50 to-amber-100 p-1 flex flex-col items-center justify-center shadow-xs">
                <ShieldCheck className="h-6 w-6 text-amber-600 mb-0.5" />
                <span className="text-[8px] font-black uppercase tracking-widest text-amber-800">
                  VERIFIED
                </span>
                <span className="text-[7px] font-bold text-amber-700">RUANGKODE</span>
              </div>
              <span className="mt-1 text-[9px] font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                <span>Terverifikasi Resmi</span>
              </span>
            </div>

            {/* Right: Academic Signatures */}
            <div className="text-right space-y-1">
              <div className="inline-block text-center">
                {/* Stylized Digital Signature Graphic */}
                <div className="h-9 flex items-center justify-center">
                  <span className="font-serif italic text-lg sm:text-xl font-bold text-slate-800 select-none tracking-wider">
                    Ir. Hendra Wijaya, M.Kom
                  </span>
                </div>
                <div className="border-t border-slate-900/60 pt-1">
                  <p className="text-[11px] font-bold text-slate-900">Ir. Hendra Wijaya, M.Kom</p>
                  <p className="text-[9px] text-slate-500 font-medium">Head of Academic & Learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print-specific style rules */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
          #certificate-paper {
            border-width: 3px !important;
            box-shadow: none !important;
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
