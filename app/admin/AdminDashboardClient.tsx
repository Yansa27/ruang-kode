'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  FileCode,
  Shield,
  Layers,
  Sparkles,
  Users,
  Code2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

interface LessonItem {
  id: string;
  slug: string;
  title: string;
  order: number;
  isPublished: boolean;
  exercises: {
    id: string;
    title: string;
    testCases: { id: string }[];
  }[];
}

interface ChapterItem {
  id: string;
  title: string;
  order: number;
  lessons: LessonItem[];
}

interface CourseItem {
  id: string;
  slug: string;
  title: string;
  level: string;
  isPublished: boolean;
  chapters: ChapterItem[];
}

interface AdminDashboardClientProps {
  courses: CourseItem[];
  stats: {
    totalUsers: number;
    totalLessons: number;
    totalSubmissions: number;
    totalCertificates: number;
    chartData: { name: string; users: number; submissions: number }[];
    submissionPieData: { name: string; value: number; color: string }[];
    enrollmentBarData: { name: string; students: number }[];
  };
}

export default function AdminDashboardClient({
  courses,
  stats,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [courseList, setCourseList] = useState(courses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [chapterId, setChapterId] = useState(courses[0]?.chapters[0]?.id || '');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [learningObjectives, setLearningObjectives] = useState('');
  const [content, setContent] = useState('');
  const [exampleCode, setExampleCode] = useState('');
  const [starterCode, setStarterCode] = useState('');
  const [hints, setHints] = useState('');
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleTogglePublish = async (lessonId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/lessons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lessonId, isPublished: !currentStatus }),
      });

      if (res.ok) {
        setCourseList((prev) =>
          prev.map((c) => ({
            ...c,
            chapters: c.chapters.map((ch) => ({
              ...ch,
              lessons: ch.lessons.map((l) =>
                l.id === lessonId ? { ...l, isPublished: !currentStatus } : l
              ),
            })),
          }))
        );
        router.refresh();
      }
    } catch (e) {
      console.error('Toggle error:', e);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Apakah kamu yakin ingin menghapus lesson ini beserta exercisenya?')) return;

    try {
      const res = await fetch(`/api/admin/lessons?id=${lessonId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCourseList((prev) =>
          prev.map((c) => ({
            ...c,
            chapters: c.chapters.map((ch) => ({
              ...ch,
              lessons: ch.lessons.filter((l) => l.id !== lessonId),
            })),
          }))
        );
        router.refresh();
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId,
          title,
          slug,
          description,
          learningObjectives: learningObjectives.split('\n').filter(Boolean),
          content,
          exampleCode,
          starterCode,
          hints,
          exerciseTitle,
          expectedOutput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat lesson');
      }

      setIsModalOpen(false);
      // Reset form
      setTitle('');
      setSlug('');
      setDescription('');
      setContent('');
      setExerciseTitle('');
      setExpectedOutput('');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* CMS Top Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium">Total Akun Terdaftar</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <BookOpen className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium">Total Lesson</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.totalLessons}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Code2 className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium">Sukses Submissions</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.totalSubmissions}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium">Sertifikat Terbit</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.totalCertificates}</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-6">Tren Pendaftar & Eksekusi Kode (7 Hari)</h2>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="submissions" name="Submissions" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="users" name="Pendaftar Baru" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart & Pie Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
            <h2 className="text-sm font-bold text-slate-900 mb-6">Distribusi Course</h2>
            <div className="flex-1 min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.enrollmentBarData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Bar dataKey="students" name="Siswa Aktif" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
            <h2 className="text-sm font-bold text-slate-900 mb-2">Rasio Evaluasi Kode</h2>
            <div className="flex-1 min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.submissionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {stats.submissionPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Main CMS Management Content */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Manajemen Konten Kurikulum</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola course, chapter, materi lesson, dan test case evaluasi.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Lesson Baru</span>
          </button>
        </div>

        {/* Courses & Chapters table */}
        <div className="mt-6 space-y-6">
          {courseList.map((course) => (
            <div key={course.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
                  <span className="text-xs text-slate-500">
                    Slug: <code className="font-mono">{course.slug}</code> • Level: {course.level}
                  </span>
                </div>
              </div>

              {course.chapters.map((chapter) => (
                <div key={chapter.id} className="rounded-lg border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-semibold text-xs text-slate-700 flex items-center justify-between">
                    <span>{chapter.title}</span>
                    <span className="text-slate-400 font-normal">{chapter.lessons.length} Lesson</span>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {chapter.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/50 transition"
                      >
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-900">{lesson.title}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            /{course.slug}/{lesson.slug}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                              lesson.isPublished
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {lesson.isPublished ? 'Published' : 'Draft'}
                          </span>

                          <button
                            onClick={() => handleTogglePublish(lesson.id, lesson.isPublished)}
                            title={lesson.isPublished ? 'Unpublish' : 'Publish'}
                            className="rounded p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                          >
                            {lesson.isPublished ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            title="Hapus Lesson"
                            className="rounded p-1 text-red-400 hover:text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tambah Lesson */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Tambah Lesson Baru</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tambahkan materi pelajaran dan latihan koding interaktif.
            </p>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateLesson} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Pilih Chapter</label>
                <select
                  value={chapterId}
                  onChange={(e) => setChapterId(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {courseList.flatMap((c) =>
                    c.chapters.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {c.title} — {ch.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Judul Lesson</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!slug) {
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '')
                        );
                      }
                    }}
                    placeholder="Contoh: 11. Dictionary"
                    className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Slug URL</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="11-dictionary"
                    className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Deskripsi Singkat</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Penjelasan ringkas tentang materi ini"
                  className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">
                  Tujuan Pembelajaran (1 poin per baris)
                </label>
                <textarea
                  rows={2}
                  value={learningObjectives}
                  onChange={(e) => setLearningObjectives(e.target.value)}
                  placeholder="Memahami sintaks key-value&#10;Mengakses data dictionary"
                  className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">
                  Konten Materi (Markdown)
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="## Penjelasan Materi...&#10;&#10;Contoh teks penjelasan..."
                  className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Judul Tantangan (Exercise)</label>
                  <input
                    type="text"
                    value={exerciseTitle}
                    onChange={(e) => setExerciseTitle(e.target.value)}
                    placeholder="Tantangan: Buat Dictionary Mahasiswa"
                    className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">
                    Expected Output (Keluaran yang Diharapkan)
                  </label>
                  <input
                    type="text"
                    value={expectedOutput}
                    onChange={(e) => setExpectedOutput(e.target.value)}
                    placeholder="Contoh: {'nama': 'Budi', 'umur': 20}"
                    className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
