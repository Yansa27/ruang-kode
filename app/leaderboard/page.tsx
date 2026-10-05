import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import LeaderboardClient from '@/components/leaderboard/LeaderboardClient';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect('/login?callbackUrl=/leaderboard');
  }

  // Fetch all students ordered by XP
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: {
      id: true,
      name: true,
      role: true,
      stats: {
        select: {
          xp: true,
          streak: true,
          completedLessonsCount: true,
        },
      },
    },
    orderBy: {
      stats: {
        xp: 'desc',
      },
    },
  });

  const rankedStudents = students.map((s, index) => {
    const xp = s.stats?.xp || 0;
    const level = Math.floor(xp / 100) + 1;
    return {
      id: s.id,
      name: s.name,
      rank: index + 1,
      xp,
      level,
      streak: s.stats?.streak || 0,
      completedLessons: s.stats?.completedLessonsCount || 0,
      isCurrentUser: session.id === s.id,
    };
  });

  const userIndex = rankedStudents.findIndex((s) => s.id === session.id);
  let currentUserData = null;
  if (userIndex !== -1) {
    const userRank = rankedStudents[userIndex];
    const nextUserAbove = userIndex > 0 ? rankedStudents[userIndex - 1] : null;
    currentUserData = {
      ...userRank,
      nextRankXpDifference: nextUserAbove ? nextUserAbove.xp - userRank.xp + 10 : 0,
      aboveUserName: nextUserAbove ? nextUserAbove.name : null,
    };
  }

  return (
    <LeaderboardClient
      user={{
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
      }}
      initialLeaderboard={rankedStudents}
      currentUser={currentUserData}
      totalParticipants={rankedStudents.length}
    />
  );
}
