import prisma from '@/lib/prisma';
import crypto from 'crypto';

export function generateCertificateNumber(courseSlug: string): string {
  const prefix = courseSlug.includes('python') ? 'RK-PY' : 'RK-DEV';
  const year = new Date().getFullYear();
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${year}-${randomSuffix}`;
}

export interface EligibilityResult {
  eligible: boolean;
  totalLessons: number;
  completedLessons: number;
  courseTitle: string;
}

export async function checkCertificateEligibility(
  userId: string,
  courseSlug: string = 'python-fundamental'
): Promise<EligibilityResult> {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      chapters: {
        include: {
          lessons: {
            where: { isPublished: true },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!course) {
    return { eligible: false, totalLessons: 0, completedLessons: 0, courseTitle: '' };
  }

  const allLessonIds = course.chapters.flatMap((ch) => ch.lessons.map((l) => l.id));
  const totalLessons = allLessonIds.length;

  const completedProgress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: allLessonIds },
      isCompleted: true,
    },
  });

  const completedLessons = completedProgress.length;
  const eligible = totalLessons > 0 && completedLessons >= totalLessons;

  return {
    eligible,
    totalLessons,
    completedLessons,
    courseTitle: course.title,
  };
}

export async function getOrCreateCertificate(
  userId: string,
  courseSlug: string = 'python-fundamental'
) {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      chapters: {
        include: {
          lessons: {
            where: { isPublished: true },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!course) {
    throw new Error('Course tidak ditemukan');
  }

  // Check if certificate already exists
  const existing = await prisma.certificate.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      course: {
        select: { id: true, title: true, slug: true, level: true },
      },
    },
  });

  if (existing) {
    return { certificate: existing, isNew: false };
  }

  // Verify completion eligibility
  const allLessonIds = course.chapters.flatMap((ch) => ch.lessons.map((l) => l.id));
  const completedProgress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: allLessonIds },
      isCompleted: true,
    },
  });

  if (completedProgress.length < allLessonIds.length) {
    throw new Error('Mahasiswa belum menyelesaikan seluruh materi course ini.');
  }

  // Get user stats for metadata snapshot
  const userStats = await prisma.userStats.findUnique({
    where: { userId },
  });

  const certificateNumber = generateCertificateNumber(courseSlug);
  const metadata = JSON.stringify({
    totalLessons: allLessonIds.length,
    finalXp: userStats?.xp || 0,
    completionStreak: userStats?.streak || 1,
    grade: 'LULUS DENGAN PUJIAN (DISTINCTION)',
  });

  const newCertificate = await prisma.certificate.create({
    data: {
      certificateNumber,
      userId,
      courseId: course.id,
      metadata,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      course: {
        select: { id: true, title: true, slug: true, level: true },
      },
    },
  });

  return { certificate: newCertificate, isNew: true };
}

export async function getCertificateByNumber(certificateNumber: string) {
  return prisma.certificate.findUnique({
    where: { certificateNumber },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          level: true,
          chapters: {
            select: {
              title: true,
              lessons: {
                select: { title: true },
              },
            },
          },
        },
      },
    },
  });
}
