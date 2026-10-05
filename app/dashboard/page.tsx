import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/layout/Footer';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      stats: true,
      lessonProgress: {
        include: {
          lesson: {
            include: {
              chapter: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  // Fetch Python Fundamental course with full chapter & lesson hierarchy
  const course = await prisma.course.findUnique({
    where: { slug: 'python-fundamental' },
    include: {
      chapters: {
        include: {
          lessons: {
            select: {
              id: true,
              slug: true,
              title: true,
              order: true,
              description: true,
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!course) {
    redirect('/');
  }

  const allLessons = course.chapters.flatMap((ch) => ch.lessons);
  const completedLessonIds = user.lessonProgress
    .filter((lp) => lp.isCompleted)
    .map((lp) => lp.lessonId);

  const completedSet = new Set(completedLessonIds);

  // Find next lesson to tackle: first uncompleted lesson
  const nextLesson = allLessons.find((l) => !completedSet.has(l.id)) || allLessons[0];

  // Map recent activities with serialization-safe structure
  const recentActivities = user.lessonProgress.slice(0, 6).map((act) => ({
    id: act.id,
    isCompleted: act.isCompleted,
    updatedAt: act.updatedAt.toISOString(),
    lesson: {
      id: act.lesson.id,
      title: act.lesson.title,
      slug: act.lesson.slug,
      chapter: {
        title: act.lesson.chapter.title,
      },
    },
  }));

  const certificate = await prisma.certificate.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  // Fetch top 3 students by XP
  const topStudentsRaw = await prisma.userStats.findMany({
    take: 3,
    orderBy: { xp: 'desc' },
    include: { user: { select: { name: true } } },
  });
  
  const topStudents = topStudentsRaw.map((s, index) => ({
    id: s.userId,
    name: s.user.name,
    xp: s.xp,
    rank: index + 1,
  }));

  // Fetch Community Link Setting
  const communityLinkSetting = await prisma.setting.findUnique({
    where: { key: 'community_link' }
  });
  const communityLink = communityLinkSetting?.value || null;

  return (
    <DashboardClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        stats: user.stats,
      }}
      course={{
        id: course.id,
        slug: course.slug,
        title: course.title,
        level: course.level,
        chapters: course.chapters,
      }}
      completedLessonIds={completedLessonIds}
      recentActivities={recentActivities}
      nextLesson={nextLesson || null}
      certificateNumber={certificate?.certificateNumber || null}
      topStudents={topStudents}
      communityLink={communityLink}
    />
  );
}
