import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { exerciseId, lessonId, code, status, output, errorMessage } = await request.json();

    if (!exerciseId || !lessonId || typeof code !== 'string') {
      return NextResponse.json({ error: 'Data submission tidak lengkap.' }, { status: 400 });
    }

    // Record submission
    const submission = await prisma.submission.create({
      data: {
        userId: session.id,
        exerciseId,
        code,
        status,
        output: output || null,
        errorMessage: errorMessage || null,
      },
    });

    let earnedXp = 0;
    let isFirstCompletion = false;

    // Check previous completion
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.id,
          lessonId,
        },
      },
    });

    if (status === 'PASSED') {
      if (!existingProgress || !existingProgress.isCompleted) {
        isFirstCompletion = true;
        earnedXp = 30; // 10 XP for lesson + 20 XP for exercise
      }

      // Update lesson progress
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: session.id,
            lessonId,
          },
        },
        create: {
          userId: session.id,
          lessonId,
          status: 'COMPLETED',
          isCompleted: true,
          completedAt: new Date(),
          lastCode: code,
        },
        update: {
          status: 'COMPLETED',
          isCompleted: true,
          completedAt: new Date(),
          lastCode: code,
        },
      });

      // Update user stats
      if (isFirstCompletion) {
        await prisma.userStats.upsert({
          where: { userId: session.id },
          create: {
            userId: session.id,
            xp: earnedXp,
            completedLessonsCount: 1,
            completedExercisesCount: 1,
            lastActiveAt: new Date(),
          },
          update: {
            xp: { increment: earnedXp },
            completedLessonsCount: { increment: 1 },
            completedExercisesCount: { increment: 1 },
            lastActiveAt: new Date(),
          },
        });
      }
    } else {
      // Save code in progress
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: session.id,
            lessonId,
          },
        },
        create: {
          userId: session.id,
          lessonId,
          status: 'IN_PROGRESS',
          isCompleted: false,
          lastCode: code,
        },
        update: {
          lastCode: code,
        },
      });
    }

    // Determine next lesson
    const currentLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        chapter: {
          include: {
            course: {
              include: {
                chapters: {
                  include: {
                    lessons: {
                      orderBy: { order: 'asc' },
                    },
                  },
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    let nextLessonSlug: string | null = null;
    if (currentLesson) {
      const allLessons = currentLesson.chapter.course.chapters.flatMap((ch) => ch.lessons);
      const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
      if (currentIndex !== -1 && currentIndex + 1 < allLessons.length) {
        nextLessonSlug = allLessons[currentIndex + 1].slug;
      }
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      status,
      earnedXp,
      isFirstCompletion,
      nextLessonSlug,
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses submission.' },
      { status: 500 }
    );
  }
}
