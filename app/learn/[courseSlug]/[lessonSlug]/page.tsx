import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import LearningWorkspaceClient from '@/components/workspace/LearningWorkspaceClient';

export const dynamic = 'force-dynamic';

export default async function LessonWorkspacePage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const session = await getCurrentUser();

  if (!session) {
    redirect(`/login?callbackUrl=/learn/${courseSlug}/${lessonSlug}`);
  }

  // Fetch course with full chapters & lessons
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      chapters: {
        include: {
          lessons: {
            select: {
              id: true,
              slug: true,
              title: true,
              order: true,
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!course) {
    notFound();
  }

  // Find target lesson
  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      chapter: { courseId: course.id },
    },
    include: {
      chapter: true,
      exercises: {
        include: {
          testCases: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  // Fetch user stats and lesson progress
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      stats: true,
      lessonProgress: true,
    },
  });

  const currentProgress = user?.lessonProgress.find((p) => p.lessonId === lesson.id);
  const completedLessonIds = (user?.lessonProgress || [])
    .filter((p) => p.isCompleted)
    .map((p) => p.lessonId);

  // Parse objectives and hints safely
  let learningObjectives: string[] = [];
  try {
    learningObjectives = JSON.parse(lesson.learningObjectives);
  } catch {
    learningObjectives = [lesson.learningObjectives];
  }

  let hints: string[] = [];
  if (lesson.hints) {
    try {
      hints = JSON.parse(lesson.hints);
    } catch {
      hints = [lesson.hints];
    }
  }

  const exercise = lesson.exercises[0] || null;

  return (
    <LearningWorkspaceClient
      key={lesson.id}
      course={{
        id: course.id,
        slug: course.slug,
        title: course.title,
      }}
      currentChapter={{
        id: lesson.chapter.id,
        title: lesson.chapter.title,
      }}
      lesson={{
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        learningObjectives,
        content: lesson.content,
        exampleCode: lesson.exampleCode,
        starterCode: lesson.starterCode,
        hints,
        exercise: exercise
          ? {
              id: exercise.id,
              title: exercise.title,
              description: exercise.description,
              difficulty: exercise.difficulty,
              starterCode: exercise.starterCode,
              solutionCode: exercise.solutionCode,
              testCases: exercise.testCases.map((tc) => ({
                id: tc.id,
                order: tc.order,
                expectedOutput: tc.expectedOutput,
                input: tc.input,
                isHidden: tc.isHidden,
              })),
            }
          : null,
      }}
      chapters={course.chapters.map((ch) => ({
        id: ch.id,
        title: ch.title,
        order: ch.order,
        lessons: ch.lessons,
      }))}
      initialCode={currentProgress?.lastCode || null}
      completedLessonIds={completedLessonIds}
      userStats={user?.stats || null}
    />
  );
}
