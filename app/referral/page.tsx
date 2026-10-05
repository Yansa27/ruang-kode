import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import AppShell from '@/components/layout/AppShell';
import ReferralClient from '@/components/referral/ReferralClient';

export const dynamic = 'force-dynamic';

export default async function ReferralPage() {
  const session = await getCurrentUser();
  if (!session) redirect('/login?callbackUrl=/referral');

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      stats: true,
    },
  });

  if (!user) redirect('/dashboard');

  // Generate referral code if user doesn't have one
  if (!user.referralCode) {
    function generateReferralCode(name: string): string {
      const prefix = name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
      const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
      return `${prefix}-${suffix}`;
    }

    let code = generateReferralCode(user.name);
    while (await prisma.user.findUnique({ where: { referralCode: code } })) {
      code = generateReferralCode(user.name);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: code },
    });

    user.referralCode = code;
  }

  // Count how many people used this user's referral code and get their basic info
  const referredUsers = await prisma.user.findMany({
    where: { referredByCode: user.referralCode! },
    select: {
      id: true,
      name: true,
      createdAt: true,
      stats: {
        select: { xp: true, streak: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedReferredUsers = referredUsers.map(u => ({
    id: u.id,
    name: u.name,
    joinedAt: u.createdAt,
    xp: u.stats?.xp || 0,
    streak: u.stats?.streak || 1,
  }));

  return (
    <AppShell
      user={{
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
      }}
    >
      <ReferralClient
        user={{
          id: user.id,
          name: user.name,
          referralCode: user.referralCode!,
          xp: user.stats?.xp ?? 0,
          referralCount: referredUsers.length,
        }}
        referredUsers={formattedReferredUsers}
      />
    </AppShell>
  );
}
