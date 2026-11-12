import { redirect } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';
import { Shield } from '@/components/ui/icons';

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
  
  // Get real data for the past 7 days chart
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentUsers = await prisma.user.findMany({
    where: { role: 'STUDENT', createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true },
  });

  const recentSubmissions = await prisma.submission.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true },
  });

  // Aggregate by day
  const daysMap = new Map<string, { users: number; submissions: number }>();
  
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toLocaleDateString('id-ID', { weekday: 'short' });
    daysMap.set(dayStr, { users: 0, submissions: 0 });
  }

  recentUsers.forEach((u) => {
    const dayStr = u.createdAt.toLocaleDateString('id-ID', { weekday: 'short' });
    if (daysMap.has(dayStr)) {
      daysMap.get(dayStr)!.users += 1;
    }
  });

  recentSubmissions.forEach((s) => {
    const dayStr = s.createdAt.toLocaleDateString('id-ID', { weekday: 'short' });
    if (daysMap.has(dayStr)) {
      daysMap.get(dayStr)!.submissions += 1;
    }
  });

  // Convert map to array and reverse so it goes from oldest to newest
  const chartData = Array.from(daysMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .reverse();

  // Pie chart data: Submission pass vs fail
  const passedSubmissions = await prisma.submission.count({ where: { status: 'PASSED' } });
  const failedSubmissions = await prisma.submission.count({ where: { status: 'FAILED' } });
  
  const submissionPieData = [
    { name: 'Berhasil', value: passedSubmissions, color: '#10b981' }, // emerald
    { name: 'Gagal / Error', value: failedSubmissions, color: '#ef4444' }, // red
  ];

  // Bar chart data: Most enrolled courses
  const enrollmentsGrouped = await prisma.enrollment.groupBy({
    by: ['courseId'],
    _count: { userId: true },
  });

  // Map courseId to course title
  const enrollmentBarData = enrollmentsGrouped.map((e) => {
    const course = courses.find((c) => c.id === e.courseId);
    return {
      name: course ? course.title : 'Unknown',
      students: e._count.userId,
    };
  });
  // Get current community link
  const communityLinkSetting = await prisma.setting.findUnique({
    where: { key: 'community_link' }
  });
  const communityLink = communityLinkSetting?.value || '';
  
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
            submissionPieData,
            enrollmentBarData,
          }}
          initialCommunityLink={communityLink}
        />
      </main>
    </AppShell>
  );
}
