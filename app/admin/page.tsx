import { redirect } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';
import { Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { stats: true },
  });

  const courses = await prisma.course.findMany({
    include: {
      chapters: {
        include: {
          lessons: {
            include: {
              exercises: {
                include: {
                  testCases: true,
                },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  });

  const totalUsers = await prisma.user.count({ where: { role: 'STUDENT' } });
  const totalLessons = await prisma.lesson.count();
  const totalCertificates = await prisma.certificate.count();
  const totalSubmissions = await prisma.submission.count({ where: { status: 'PASSED' } });
  
  // Dummy data for the past 7 days chart
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const chartData = days.map((day) => ({
    name: day,
    users: Math.floor(Math.random() * 50) + 10,
    submissions: Math.floor(Math.random() * 200) + 50,
  }));
  
  return (
    <AppShell
      user={{
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
      }}
    >
      <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
            <Shield className="h-4.5 w-4.5" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Admin Content Management System
            </h1>
            <p className="text-xs text-slate-500">
              Panel administrator RuangKode untuk mengelola materi dan latihan.
            </p>
          </div>
        </div>

        <AdminDashboardClient
          courses={courses}
          stats={{
            totalUsers,
            totalLessons,
            totalSubmissions,
            totalCertificates,
            chartData,
          }}
        />
      </main>
    </AppShell>
  );
}
