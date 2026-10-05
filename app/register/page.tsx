'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal, Lock, Mail, User, ArrowRight, AlertCircle, Phone, Building2, Gift } from 'lucide-react';

import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [institution, setInstitution] = useState('');
  const [referralCode, setReferralCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('ref') || '';
    }
    return '';
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const toastId = toast.loading('Mendaftarkan akun...');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phoneNumber, institution, referralCode: referralCode.trim() || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registrasi gagal.');
      }

      toast.success('Pendaftaran berhasil! Mengarahkan...', { id: toastId });
      window.location.href = '/dashboard';
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-slate-900 relative overflow-hidden px-12 py-16">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-200">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Ruang<span className="text-blue-400">Kode</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Investasi Terbaik <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Untuk Masa Depanmu</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed mb-8">
            Daftar sekarang dan dapatkan akses ke seluruh materi pembelajaran coding. Praktik langsung di browser, kumpulkan XP, dan raih sertifikat kelulusan.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">🎯</div>
              <span>Belajar Terstruktur</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">💻</div>
              <span>Live Code Editor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">🏆</div>
              <span>Sertifikat Resmi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">⚡</div>
              <span>Evaluasi Otomatis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex flex-col justify-center bg-white py-10 px-4 sm:px-6 lg:px-20 xl:px-24 h-screen overflow-y-auto">
        <div className="mx-auto w-full max-w-sm lg:w-[400px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <Terminal className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Ruang<span className="text-blue-600">Kode</span>
              </span>
            </Link>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Buat Akun Baru
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap *</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="block w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="block w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nomor HP (WhatsApp) *</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="08123456789"
                    className="block w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Asal Sekolah/Kampus/Instansi *</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Building2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Contoh: Universitas Indonesia"
                    className="block w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password *</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="block w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Kode Referral <span className="text-slate-400 font-normal text-xs">(opsional)</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Gift className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: BUD-A3FZ2"
                    className="block w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm font-mono tracking-wider"
                  />
                </div>
                {referralCode && (
                  <p className="text-[11px] text-indigo-600 mt-1 flex items-center gap-1">
                    <Gift className="h-3 w-3" />
                    Kode referral terdeteksi — kamu akan dapat bonus +100 XP!
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 transition-all"
                >
                  <span>{isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}</span>
                  {!isLoading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
