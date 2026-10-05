'use client';

import { useState } from 'react';
import NextLink from 'next/link';
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
  ShieldCheck,
  Award,
  Medal,
  Crown
} from 'lucide-react';

interface ReferredUser {
  id: string;
  name: string;
  joinedAt: Date;
  xp: number;
  streak: number;
}

interface ReferralClientProps {
  user: {
    id: string;
    name: string;
    referralCode: string;
    xp: number;
    referralCount: number;
  };
  referredUsers?: ReferredUser[];
}

const TIERS = [
  { count: 1, label: 'Starter', icon: ShieldCheck, xp: 150 },
  { count: 3, label: 'Advocate', icon: Award, xp: 450 },
  { count: 5, label: 'Ambassador', icon: Medal, xp: 750 },
  { count: 10, label: 'Partner', icon: Crown, xp: 1500 },
];

export default function ReferralClient({ user, referredUsers = [] }: ReferralClientProps) {
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
    const msg = `Belajar coding Python gratis di RuangKode. Daftar menggunakan link ini untuk mendapatkan XP tambahan:\n\n${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const currentTier = TIERS.filter((t) => user.referralCount >= t.count).pop();
  const nextTier = TIERS.find((t) => user.referralCount < t.count);
  const progressToNext = nextTier
    ? (user.referralCount / nextTier.count) * 100
    : 100;

  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">Referral Program</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Undang rekan Anda dan dapatkan reward XP.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-sm">
            <div className="text-center px-3 border-r border-slate-200 dark:border-slate-800">
              <div className="text-lg font-semibold text-slate-900 dark:text-white">{user.referralCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">Referred</div>
            </div>
            <div className="text-center px-3">
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{user.referralCount * 150}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">XP Earned</div>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Bagikan Tautan Anda</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Link Copy */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Tautan Referral</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={referralLink}
                  className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300 font-mono focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(referralLink, 'link')}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition shrink-0"
                  title="Salin Tautan"
                >
                  {copied === 'link' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Code Copy */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Kode Unik</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono font-medium text-center tracking-widest">
                  {user.referralCode}
                </div>
                <button
                  onClick={() => copyToClipboard(user.referralCode, 'code')}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition shrink-0"
                  title="Salin Kode"
                >
                  {copied === 'code' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/60">
            <button
              onClick={shareWhatsApp}
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#128C7E] px-4 py-2 text-sm font-medium text-white transition shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              Kirim via WhatsApp
            </button>
          </div>
        </div>

        {/* Progress & Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Status Kemitraan</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Tingkatkan status Anda dengan mengundang lebih banyak rekan.</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {currentTier ? currentTier.label : 'Beginner'}
                </span>
                <span className="text-slate-500">
                  {nextTier ? `${user.referralCount} / ${nextTier.count}` : 'Max Level'}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              {nextTier && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  Undang {nextTier.count - user.referralCount} pengguna lagi untuk mencapai status <strong>{nextTier.label}</strong>.
                </p>
              )}
            </div>
          </div>

          {/* Tiers List */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Pencapaian</h2>
            <div className="space-y-4">
              {TIERS.map((tier) => {
                const achieved = user.referralCount >= tier.count;
                return (
                  <div key={tier.count} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${achieved ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-500'}`}>
                        <tier.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${achieved ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                          {tier.label}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {tier.count} Undangan
                        </div>
                      </div>
                    </div>
                    {achieved ? (
                      <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">+{tier.xp} XP</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Referred Users List */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mt-6">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Teman yang Kamu Ajak ({referredUsers.length})
            </h2>
          </div>
          
          <div className="p-0">
            {referredUsers.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {referredUsers.map((rUser) => (
                  <div key={rUser.id} className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-lg">
                        {rUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <NextLink href={`/u/${rUser.id}`} className="font-semibold text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
                          {rUser.name}
                        </NextLink>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>Bergabung {new Date(rUser.joinedAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div className="hidden sm:block">
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{rUser.streak} Hari</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Streak</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{rUser.xp}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">XP</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center px-4">
                <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Belum ada teman yang bergabung</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ayo bagikan link referralmu dan dapatkan XP bersama!</p>
              </div>
            )}
          </div>
        </div>


        {/* Mechanism */}
        <div className="bg-transparent pt-4">
          <p className="text-xs text-slate-500 text-center max-w-lg mx-auto">
            Setiap pendaftaran yang berhasil melalui tautan atau kode referral Anda akan memberikan <strong>+150 XP</strong> untuk Anda dan <strong>+100 XP</strong> untuk rekan yang mendaftar. Berlaku secara otomatis.
          </p>
        </div>

      </div>
    </main>
  );
}
