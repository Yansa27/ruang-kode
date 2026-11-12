import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | RuangKode',
    default: 'RuangKode — Belajar Coding. Langsung Praktik.',
  },
  description:
    'Platform pembelajaran pemrograman Python interaktif untuk mahasiswa Indonesia. Tulis kode, jalankan langsung di browser, dan kuasai konsepnya tanpa install apapun.',
  keywords: ['belajar coding', 'python', 'belajar python', 'coding interaktif', 'mahasiswa IT', 'ruangkode'],
  authors: [{ name: 'RuangKode Team' }],
  creator: 'RuangKode',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://ruangkode.com',
    title: 'RuangKode — Belajar Coding. Langsung Praktik.',
    description: 'Platform pembelajaran pemrograman Python interaktif untuk mahasiswa Indonesia.',
    siteName: 'RuangKode',
    images: [
      {
        url: 'https://ruangkode.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RuangKode - Belajar Python Interaktif',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RuangKode — Belajar Coding. Langsung Praktik.',
    description: 'Platform pembelajaran pemrograman Python interaktif untuk mahasiswa Indonesia.',
    images: ['https://ruangkode.com/og-image.png'],
  },
};

import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var th=localStorage.getItem('ruangkode_theme');var d=th==='dark'||(!th&&!window.matchMedia('(prefers-color-scheme: light)').matches);if(d){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 transition-colors duration-150"
      >
        <NextTopLoader
          color="#13745b"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #13745b,0 0 5px #13745b"
          zIndex={1600}
        />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
