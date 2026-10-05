import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      chapterId,
      title,
      slug,
      description,
      learningObjectives,
      content,
      exampleCode,
      starterCode,
      hints,
      exerciseTitle,
      exerciseDesc,
      difficulty,
      expectedOutput,
    } = body;

    if (!chapterId || !title || !slug || !description || !content) {
      return NextResponse.json({ error: 'Kolom wajib belum lengkap.' }, { status: 400 });
    }

    // Determine lesson order
    const lastLesson = await prisma.lesson.findFirst({
      where: { chapterId },
      orderBy: { order: 'desc' },
    });
    const order = (lastLesson?.order || 0) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        chapterId,
        title,
        slug: slug.toLowerCase().trim().replace(/\s+/g, '-'),
        description,
        learningObjectives: JSON.stringify(
          Array.isArray(learningObjectives) ? learningObjectives : [learningObjectives]
        ),
        content,
        exampleCode: exampleCode || null,
        starterCode: starterCode || '# Tulis kode kamu di sini\n',
        hints: hints ? JSON.stringify([hints]) : null,
        order,
        isPublished: true,
      },
    });

    if (exerciseTitle && expectedOutput) {
      const exercise = await prisma.exercise.create({
        data: {
          lessonId: lesson.id,
          title: exerciseTitle,
          description: exerciseDesc || 'Selesaikan tantangan berikut sesuai instruksi materi.',
          starterCode: starterCode || '# Tulis kode kamu di sini\n',
          difficulty: difficulty || 'EASY',
        },
      });

      await prisma.testCase.create({
        data: {
          exerciseId: exercise.id,
          expectedOutput: expectedOutput.trim(),
          order: 1,
        },
      });
    }

    return NextResponse.json({ success: true, lesson });
  } catch (error: any) {
    console.error('Admin create lesson error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, isPublished } = await request.json();
    if (!id || typeof isPublished !== 'boolean') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const updated = await prisma.lesson.update({
      where: { id },
      data: { isPublished },
    });

    return NextResponse.json({ success: true, lesson: updated });
  } catch (error: any) {
    console.error('Admin toggle lesson error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });
    }

    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin delete lesson error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
