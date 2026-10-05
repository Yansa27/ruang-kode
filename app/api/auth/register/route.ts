import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, createSessionToken } from '@/lib/auth';

// Generate a short unique referral code
function generateReferralCode(name: string): string {
  const prefix = name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const { name, email, password, phoneNumber, institution, referralCode: usedReferralCode } = await request.json();

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

    // Validate referral code if provided
    let referrer = null;
    if (usedReferralCode?.trim()) {
      referrer = await prisma.user.findUnique({
        where: { referralCode: usedReferralCode.trim().toUpperCase() },
        include: { stats: true },
      });
    }

    const hashedPassword = await hashPassword(password);

    // Generate a unique referral code for the new user
    let newUserReferralCode = generateReferralCode(name);
    // Ensure uniqueness
    while (await prisma.user.findUnique({ where: { referralCode: newUserReferralCode } })) {
      newUserReferralCode = generateReferralCode(name);
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phoneNumber: phoneNumber?.trim() || null,
        institution: institution?.trim() || null,
        referralCode: newUserReferralCode,
        referredByCode: referrer ? usedReferralCode.trim().toUpperCase() : null,
        role: 'STUDENT',
        stats: {
          create: {
            xp: referrer ? 100 : 0,  // Bonus 100 XP for new user if referred
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
        referralCode: true,
      },
    });

    // Reward referrer: +150 XP and increment referralCount
    if (referrer && referrer.stats) {
      await prisma.userStats.update({
        where: { userId: referrer.id },
        data: {
          xp: { increment: 150 },
          referralCount: { increment: 1 },
        },
      });
    }

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

