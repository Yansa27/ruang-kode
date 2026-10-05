import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseSlug = searchParams.get('courseSlug') || 'python-fundamental';

    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        chapters: {
          include: {
            lessons: {
              select: { id: true, slug: true, title: true, order: true },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const allLessons = course.chapters.flatMap((ch) => ch.lessons);
    const totalLessons = allLessons.length;

    const userProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: session.id,
        lessonId: { in: allLessons.map((l) => l.id) },
      },
    });

    const completedLessonIds = userProgress
      .filter((p) => p.isCompleted)
      .map((p) => p.lessonId);

    const percentage = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0;

    return NextResponse.json({
      courseId: course.id,
      courseSlug: course.slug,
      totalLessons,
      completedLessonsCount: completedLessonIds.length,
      percentage,
      completedLessonIds,
      progressList: userProgress,
    });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Save draft code as user types or runs without submitting
export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId, code } = await request.json();
    if (!lessonId || typeof code !== 'string') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

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
        lastCode: code,
      },
      update: {
        lastCode: code,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Progress POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
