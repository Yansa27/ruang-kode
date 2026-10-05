import { getCertificateByNumber } from '@/lib/certificate';
import PublicVerificationClient from '@/components/certificate/PublicVerificationClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface VerifyPageProps {
  params: Promise<{
    certificateNumber: string;
  }>;
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { certificateNumber } = await params;
  const cert = await getCertificateByNumber(certificateNumber);

  if (!cert) {
    return {
      title: 'Verifikasi Sertifikat Tidak Ditemukan — RuangKode',
    };
  }

  return {
    title: `Verifikasi Resmi: ${cert.user.name} — ${cert.course.title} | RuangKode`,
    description: `Hasil verifikasi publik keabsahan kredensial ${cert.certificateNumber} atas nama ${cert.user.name}.`,
  };
}

export default async function VerifyCertificatePage({ params }: VerifyPageProps) {
  const { certificateNumber } = await params;
  const certificate = await getCertificateByNumber(certificateNumber);

  if (!certificate) {
    return (
      <PublicVerificationClient
        initialCertificateNumber={certificateNumber}
        notFoundState={true}
      />
    );
  }

  return (
    <PublicVerificationClient
      initialCertificateNumber={certificate.certificateNumber}
      certificate={{
        certificateNumber: certificate.certificateNumber,
        issuedAt: certificate.issuedAt.toISOString(),
        metadata: certificate.metadata,
        user: {
          name: certificate.user.name,
          email: certificate.user.email,
        },
        course: {
          title: certificate.course.title,
          level: certificate.course.level,
          slug: certificate.course.slug,
          chapters: certificate.course.chapters.map((ch) => ({
            title: ch.title,
            lessons: ch.lessons,
          })),
        },
      }}
    />
  );
}
