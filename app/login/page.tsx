'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Terminal, Lock, Mail, ArrowRight, AlertCircle, Check } from 'lucide-react';

import { toast } from 'sonner';
import AuthAside from '@/components/layout/AuthAside';

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const toastId = toast.loading('Memproses login...');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login gagal.');
      }

      toast.success('Login berhasil! Mengarahkan...', { id: toastId });
      window.location.href = callbackUrl;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba lagi.';
      toast.error(message, { id: toastId });
      setError(message);
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="auth-page min-h-screen flex">
      <AuthAside />

      {/* Right Panel - Login Form */}
      <div className="auth-form-panel flex-1 flex flex-col justify-center bg-white py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
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
              Selamat Datang Kembali
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Silakan masuk ke akunmu untuk melanjutkan. Belum punya akun?{' '}
              <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Daftar sekarang
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

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="login-field-1" className="block text-sm font-medium text-slate-700 mb-1.5">Alamat Email</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input id="login-field-1"
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
                <label htmlFor="login-field-2" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input id="login-field-2"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 transition-all"
                >
                  <span>{isLoading ? 'Memproses login...' : 'Masuk ke Dashboard'}</span>
                  {!isLoading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-slate-500 font-medium">Atau gunakan mode demo</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('siswa@ruangkode.com', 'password123')}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-100 bg-white py-2.5 px-4 text-sm font-semibold text-slate-700 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>Siswa</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@ruangkode.com', 'admin123')}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-100 bg-white py-2.5 px-4 text-sm font-semibold text-slate-700 hover:border-purple-100 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <Check className="h-4 w-4 text-purple-600" />
                  <span>Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">Memuat halaman login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
