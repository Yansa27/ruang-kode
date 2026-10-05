import { notFound } from 'next/navigation';
import { getCertificateByNumber } from '@/lib/certificate';
import CertificateViewClient from '@/components/certificate/CertificateViewClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface CertificatePageProps {
  params: Promise<{
    certificateNumber: string;
  }>;
}

export async function generateMetadata({ params }: CertificatePageProps): Promise<Metadata> {
  const { certificateNumber } = await params;
  const cert = await getCertificateByNumber(certificateNumber);

  if (!cert) {
    return {
      title: 'Sertifikat Tidak Ditemukan — RuangKode',
    };
  }

  return {
    title: `Sertifikat Kelulusan ${cert.user.name} — ${cert.course.title} | RuangKode`,
    description: `Verifikasi sertifikat resmi kelulusan ${cert.user.name} pada program ${cert.course.title} di platform RuangKode.`,
  };
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { certificateNumber } = await params;
  const certificate = await getCertificateByNumber(certificateNumber);

  if (!certificate) {
    notFound();
  }

  return (
    <CertificateViewClient
      certificate={{
        id: certificate.id,
        certificateNumber: certificate.certificateNumber,
        issuedAt: certificate.issuedAt.toISOString(),
        metadata: certificate.metadata,
        user: {
          id: certificate.user.id,
          name: certificate.user.name,
          email: certificate.user.email,
        },
        course: {
          id: certificate.course.id,
          title: certificate.course.title,
          slug: certificate.course.slug,
          level: certificate.course.level,
        },
      }}
    />
  );
}
