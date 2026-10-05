import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentUser();

    // Fetch all student users with stats
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        stats: {
          select: {
            xp: true,
            streak: true,
            completedLessonsCount: true,
            completedExercisesCount: true,
            lastActiveAt: true,
          },
        },
      },
      orderBy: {
        stats: {
          xp: 'desc',
        },
      },
      take: 50,
    });

    // Map ranks
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
        isCurrentUser: session ? session.id === s.id : false,
      };
    });

    let currentUserData = null;
    if (session) {
      const userIndex = rankedStudents.findIndex((s) => s.id === session.id);
      if (userIndex !== -1) {
        const userRank = rankedStudents[userIndex];
        const nextUserAbove = userIndex > 0 ? rankedStudents[userIndex - 1] : null;
        currentUserData = {
          ...userRank,
          nextRankXpDifference: nextUserAbove ? nextUserAbove.xp - userRank.xp + 10 : 0,
          aboveUserName: nextUserAbove ? nextUserAbove.name : null,
        };
      }
    }

    return NextResponse.json({
      leaderboard: rankedStudents,
      currentUser: currentUserData,
      totalParticipants: rankedStudents.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data papan peringkat.' },
      { status: 500 }
    );
  }
}
