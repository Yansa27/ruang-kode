'use client';

import { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Share2,
  Zap,
  Gift,
  Link,
  MessageCircle,
  Trophy,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ReferralClientProps {
  user: {
    id: string;
    name: string;
    referralCode: string;
    xp: number;
    referralCount: number;
  };
}

const TIERS = [
  { count: 1, label: 'Penyebar Semangat', emoji: '🌱', xp: 150 },
  { count: 3, label: 'Juru Dakwah Koding', emoji: '🔥', xp: 450 },
  { count: 5, label: 'Campus Ambassador', emoji: '🏆', xp: 750 },
  { count: 10, label: 'Legend Recruiter', emoji: '👑', xp: 1500 },
];

export default function ReferralClient({ user }: ReferralClientProps) {
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  const referralLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/register?ref=${user.referralCode}`
      : `/register?ref=${user.referralCode}`;

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const shareWhatsApp = () => {
    const msg = `Hei! Ayo belajar coding bareng di RuangKode 🚀 Platform belajar Python interaktif gratis. Daftar lewat link ini dan kita berdua dapat bonus XP!\n\n👉 ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const currentTier = TIERS.filter((t) => user.referralCount >= t.count).pop();
  const nextTier = TIERS.find((t) => user.referralCount < t.count);
  const progressToNext = nextTier
    ? (user.referralCount / nextTier.count) * 100
    : 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Hero Header */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Program Ajak Teman</h1>
                <p className="text-indigo-200 text-xs mt-0.5">Ajak teman, berdua dapat hadiah XP!</p>
              </div>
            </div>

            <p className="text-white/80 text-sm leading-relaxed max-w-lg">
              Setiap teman yang mendaftar pakai kode kamu, <strong className="text-white">kamu dapat +150 XP</strong> dan mereka dapat <strong className="text-white">bonus +100 XP</strong> langsung sebagai selamat datang. Semakin banyak teman, semakin banyak XP-mu! 🚀
            </p>

            <div className="mt-4 flex gap-3 flex-wrap">
              <div className="rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2.5 text-center">
                <div className="text-2xl font-black">{user.referralCount}</div>
                <div className="text-[11px] text-indigo-200 mt-0.5">Teman Diajak</div>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2.5 text-center">
                <div className="text-2xl font-black">{user.referralCount * 150}</div>
                <div className="text-[11px] text-indigo-200 mt-0.5">XP Didapat</div>
              </div>
              {currentTier && (
                <div className="rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2.5 text-center">
                  <div className="text-2xl">{currentTier.emoji}</div>
                  <div className="text-[11px] text-indigo-200 mt-0.5">{currentTier.label}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Referral Code Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Gift className="h-5 w-5 text-indigo-500" />
            Kode Referral Kamu
          </h2>

          {/* Code */}
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1">KODE REFERRAL</p>
              <p className="text-xl font-black tracking-widest text-slate-900 dark:text-white font-mono">
                {user.referralCode}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(user.referralCode, 'code')}
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-16 w-16 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition shadow-xs"
            >
              {copied === 'code' ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
              <span className="text-[10px] font-semibold">{copied === 'code' ? 'Disalin!' : 'Salin'}</span>
            </button>
          </div>

          {/* Link */}
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Link className="h-3.5 w-3.5" />
              Link Undangan
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                {referralLink}
              </div>
              <button
                onClick={() => copyToClipboard(referralLink, 'link')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 hover:border-indigo-200 transition shrink-0"
              >
                {copied === 'link' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied === 'link' ? 'Tersalin!' : 'Salin Link'}
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={shareWhatsApp}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Share via WhatsApp</span>
            </button>
            <button
              onClick={() => copyToClipboard(referralLink, 'link')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <Share2 className="h-4 w-4" />
              <span>Salin Link</span>
            </button>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                Progress ke Tier Berikutnya
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {user.referralCount} / {nextTier.count} teman
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ajak <strong className="text-slate-700 dark:text-slate-200">{nextTier.count - user.referralCount} teman lagi</strong> untuk dapat badge{' '}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {nextTier.emoji} {nextTier.label}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Reward Tiers */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Milestone & Hadiah
          </h2>
          <div className="space-y-3">
            {TIERS.map((tier) => {
              const achieved = user.referralCount >= tier.count;
              return (
                <div
                  key={tier.count}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                    achieved
                      ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tier.emoji}</span>
                    <div>
                      <p className={`text-xs font-bold ${achieved ? 'text-indigo-800 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                        {tier.label}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Ajak {tier.count} teman
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${achieved ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      <Zap className={`h-3.5 w-3.5 ${achieved ? 'fill-indigo-500 text-indigo-500' : 'fill-slate-400 text-slate-400'}`} />
                      +{tier.xp} XP kumulatif
                    </span>
                    {achieved && (
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                        Tercapai ✓
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Cara Kerja</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Share2, num: '1', title: 'Bagikan Kode', desc: 'Kirim kode atau link referralmu ke teman, grup kelas, atau media sosial.' },
              { icon: Users, num: '2', title: 'Teman Daftar', desc: 'Teman kamu mendaftar menggunakan kode referralmu saat registrasi.' },
              { icon: Zap, num: '3', title: 'Berdua Dapat XP', desc: 'Kamu dapat +150 XP, teman barumu langsung dapat +100 XP selamat datang.' },
            ].map((step) => (
              <div key={step.num} className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">{step.num}</span>
                  {step.num !== '3' && <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600 hidden sm:block" />}
                </div>
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
