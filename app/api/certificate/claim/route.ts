import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getOrCreateCertificate, checkCertificateEligibility } from '@/lib/certificate';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const courseSlug = body.courseSlug || 'python-fundamental';

    const eligibility = await checkCertificateEligibility(user.id, courseSlug);
    if (!eligibility.eligible) {
      return NextResponse.json(
        {
          error: 'Kamu belum menyelesaikan semua materi di course ini.',
          completedLessons: eligibility.completedLessons,
          totalLessons: eligibility.totalLessons,
        },
        { status: 400 }
      );
    }

    const { certificate, isNew } = await getOrCreateCertificate(user.id, courseSlug);

    return NextResponse.json({
      success: true,
      isNew,
      certificateNumber: certificate.certificateNumber,
      certificate,
    });
  } catch (error: any) {
    console.error('Error claiming certificate:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal menerbitkan sertifikat' },
      { status: 500 }
    );
  }
}
