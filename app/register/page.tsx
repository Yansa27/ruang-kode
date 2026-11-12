'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Terminal, Lock, Mail, User, ArrowRight, AlertCircle, Phone, Building2, Gift } from '@/components/ui/icons';

import { toast } from 'sonner';
import AuthAside from '@/components/layout/AuthAside';

export default function RegisterPage() {
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba lagi.';
      toast.error(message, { id: toastId });
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex">
      <AuthAside />

      {/* Right Panel - Register Form */}
      <div className="auth-form-panel flex-1 flex flex-col justify-center bg-white py-10 px-4 sm:px-6 lg:px-20 xl:px-24 min-h-screen">
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
                <label htmlFor="register-field-1" className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap *</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input id="register-field-1"
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
                <label htmlFor="register-field-2" className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input id="register-field-2"
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
                <label htmlFor="register-field-3" className="block text-sm font-medium text-slate-700 mb-1.5">Nomor HP (WhatsApp) *</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input id="register-field-3"
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
                <label htmlFor="register-field-4" className="block text-sm font-medium text-slate-700 mb-1.5">Asal Sekolah/Kampus/Instansi *</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Building2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <input id="register-field-4"
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
                <label htmlFor="register-field-5" className="block text-sm font-medium text-slate-700 mb-1.5">Password *</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input id="register-field-5"
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
                <label htmlFor="register-field-6" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Kode Referral <span className="text-slate-400 font-normal text-xs">(opsional)</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Gift className="h-5 w-5 text-slate-400" />
                  </div>
                  <input id="register-field-6"
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
