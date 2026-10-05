import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, createSessionToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password, phoneNumber, institution } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, Email, dan Password wajib diisi.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan login.' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phoneNumber: phoneNumber?.trim() || null,
        institution: institution?.trim() || null,
        role: 'STUDENT',
        stats: {
          create: {
            xp: 0,
            streak: 1,
            completedLessonsCount: 0,
            completedExercisesCount: 0,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Auto-enroll in Python Fundamental course
    const pythonCourse = await prisma.course.findFirst({
      where: { slug: 'python-fundamental' },
    });

    if (pythonCourse) {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: pythonCourse.id,
        },
      });
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'STUDENT' | 'ADMIN',
    });

    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set('ruangkode_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat mendaftar.' },
      { status: 500 }
    );
  }
}
