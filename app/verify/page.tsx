import PublicVerificationClient from '@/components/certificate/PublicVerificationClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Verifikasi Sertifikat Resmi — RuangKode',
  description: 'Validasi dan periksa keabsahan sertifikat kelulusan digital pemrograman Python dari RuangKode.',
};

export default function VerifyGeneralPage() {
  return <PublicVerificationClient />;
}
