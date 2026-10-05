# RuangKode — Master Implementation Plan & Task List

> **Platform Edukasi Pemrograman Python Interaktif untuk Mahasiswa Indonesia**  
> *Prinsip: Learn → Code → Run → Understand → Progress*

---

## 📊 Status Ringkasan Proyek

| Modul | Status | Keterangan |
| :--- | :---: | :--- |
| **Fondasi & Setup Basis Data** | ✅ Selesai | Next.js 16 + TypeScript + Tailwind CSS + Prisma ORM (10 Model Data) |
| **Autentikasi & Otorisasi** | ✅ Selesai | JWT HttpOnly Cookie, Register, Login, Logout, Route Middleware |
| **Landing Page** | ✅ Selesai | Hero, Playground Preview, Feature Showcase, Silabus, FAQ, Footer |
| **Dashboard Mahasiswa** | ✅ Selesai | Proportions Polish, Stats, Roadmap Accordion, Badges, Hydration Clean |
| **Interactive Workspace (IDE)** | ✅ Selesai | 3-Panel Split, Monaco Editor, Pyodide WASM, Auto-Evaluation, Submissions |
| **Profil & Riwayat Belajar** | ✅ Selesai | Ringkasan XP, Streak, Badges, Riwayat Pengerjaan Exercise |
| **Admin Panel & CMS** | ✅ Selesai | Manajemen Course, Chapter, Lesson, Exercise & Test Cases |
| **Modul A (Learning Aids)** | ✅ Selesai | Hints Bertingkat, Visual Diff Output, Modern Modal Reset Code |
| **Modul B (Gamifikasi & Audio)** | ✅ Selesai | Web Audio API Sound Effects, Multi-Burst Confetti, Weekly Leaderboard |
| **Modul C (Kelulusan & Sertifikat)** | ✅ Selesai | Kredensial Unik RK-PY-2026, Landscape Print A4, QR Code, Public Verification |
| **Modul D (Optimasi Teknis & Aksesibilitas)** | ✅ Selesai | Split Resizer Workspace, Dark/Light Mode Global, Cache Storage Pyodide |


---

## 🎯 Rencana Detail & Checklist Tugas

### Fase 1: Fondasi & Basis Data (Core Foundation)
- [x] Inisialisasi arsitektur Next.js 16 App Router dengan TypeScript dan Tailwind CSS.
- [x] Konfigurasi Prisma ORM dengan schema lengkap:
  - `User`, `Account`, `Session`, `UserStats`
  - `Course`, `Chapter`, `Lesson`
  - `Exercise`, `TestCase`, `Submission`, `LessonProgress`
- [x] Pembuatan data seed komprehensif (`prisma/seed.ts`):
  - 4 Chapter Python Fundamental (Pengenalan, Variabel & Tipe Data, Struktur Kontrol, Fungsi).
  - 10 Lesson interaktif lengkap dengan materi Markdown, starter code, instruksi, dan test cases.
  - Akun demo Mahasiswa (`siswa@ruangkode.com`) dan Admin (`admin@ruangkode.com`).

### Fase 2: Autentikasi & Keamanan (Auth System)
- [x] Implementasi hashing password aman menggunakan `bcryptjs`.
- [x] Manajemen session berbasis stateless JWT token yang disimpan dalam `httpOnly`, `sameSite: lax` cookie.
- [x] API endpoint auth:
  - `POST /api/auth/register` (validasi email, password, duplikasi)
  - `POST /api/auth/login` (verifikasi kredensial)
  - `POST /api/auth/logout` (penghapusan session cookie)
  - `GET /api/auth/me` (profil aktif)
- [x] Next.js Edge Middleware (`middleware.ts`) untuk proteksi rute (`/dashboard`, `/profile`, `/learn`, `/admin`).

### Fase 3: Landing Page & Pengalaman Pengguna Awal
- [x] Header navigasi responsif dengan status login dinamis.
- [x] Hero section dengan value proposition jelas dan CTA interaktif.
- [x] Live Interactive Code Preview demo tanpa registrasi (Pyodide playground).
- [x] Grid fitur keunggulan (Eksekusi Cepat di Browser, Kurikulum Terstruktur, Auto Check).
- [x] Silabus interaktif Python Fundamental.
- [x] Section FAQ dan footer profesional.

### Fase 4: Dashboard Mahasiswa (Student Learning Hub)
- [x] Sidebar navigasi modern dengan collapsible mobile drawer.
- [x] Header minimalis dengan input pencarian topik dan user badge avatar.
- [x] Banner selamat datang dengan ilustrasi developer coding vektor bersih & tombol lanjut belajar.
- [x] Target Belajar card dengan visual progress ring & countdown waktu belajar.
- [x] 4 Metrik Kartu Statistik:
  - Streak harian dengan indikator dot 7 hari.
  - Total XP terkumpul & level saat ini.
  - Progress materi selesai (progress bar & persentase).
  - Jam belajar terakumulasi.
- [x] Silabus Roadmap Course dengan sistem Accordion:
  - Status lesson (Selesai dengan centang hijau, Aktif sedang dipelajari, dan Terkunci).
- [x] Card Riwayat Aktivitas Terakhir (quick link langsung kembali ke materi).
- [x] Card Pencapaian (Badges) interaktif (First Lesson, Python Beginner, Consistent Learner).
- [x] Resolusi tuntas Hydration Mismatch dari ekstensi browser (`bis_skin_checked`) via pre-hydration cleaner script dan client-mount guard.

### Fase 5: Interactive Learning Workspace (Core Learning Engine)
- [x] Tata letak 3-panel split screen responsif:
  - **Panel Kiri**: Materi pembelajaran, instruksi exercise, dan task list terstruktur.
  - **Panel Kanan Atas**: Monaco Code Editor dengan tema gelap premium (`vs-dark`), syntax highlighting Python, line numbers, dan auto-indent.
  - **Panel Kanan Bawah**: Terminal interaktif tabbed (Console Output & Test Results).
- [x] Integrasi Pyodide (Python WebAssembly) client-side:
  - Eksekusi kode Python 100% aman dan instan di dalam browser tanpa dependensi server execution.
  - Intersepsi stdout/stderr untuk menampilkan output terminal secara realtime.
- [x] Sistem Evaluasi Otomatis (Auto-Check):
  - Eksekusi test cases (input/output matching).
  - Tampilan visual status lolos/gagal per test case.
  - Penghitungan dan penambahan XP secara instan saat exercise berhasil diselesaikan.
  - Pembaruan otomatis status `LessonProgress` di database.
- [x] Navigasi Materi Pintar (Sebelumnya & Selanjutnya) yang terkunci secara berurutan sesuai pencapaian.

### Fase 6: Halaman Profil & Statistik Mahasiswa
- [x] Header profil pengguna dengan inisial dan level mahasiswa.
- [x] Visualisasi rekap statistik belajar (Total XP, Streak Harian, Materi Tuntas, Exercise Diselesaikan).
- [x] Koleksi Badges pencapaian lengkap dengan deskripsi dan status unlock.
- [x] Tabel riwayat submission kode terakhir beserta status kelulusan dan timestamp.
- [x] Form pengaturan akun dan ganti kata sandi.

### Fase 7: Admin Panel & Content Management (CMS)
- [x] Dashboard analitik admin untuk memantau ringkasan mahasiswa dan materi.
- [x] Manajemen Course & Chapter.
- [x] Editor materi Lesson dengan dukungan format Markdown.
- [x] Manajemen Exercise dan Test Cases (Input, Expected Output, Hidden/Visible).

---

## 🚀 Rencana Fitur Lanjutan & Peningkatan (Next Iterations)

### Modul A: Pengayaan Pembelajaran & Bantuan (Learning Aids)
- [x] **Sistem Hints Bertingkat (Hint System)**:
  - Mahasiswa dapat membuka petunjuk secara bertahap (Tingkat 1 Konsep Dasar, Tingkat 2 Struktur Kode, Solusi Acuan).
  - Terbuka otomatis secara progresif atau manual dengan bantuan tombol "Buka Hint Berikutnya".
  - Banner panduan cerdas di panel console saat submit test case gagal.
- [x] **Visual Test Case Diff**:
  - Komponen [DiffViewer.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/workspace/DiffViewer.tsx) yang membandingkan *Actual Output* vs *Expected Output*.
  - Mode tampilan Side-by-Side dan Baris Bertingkat (Unified).
  - Diagnosis pintar: pendeteksi output kosong, kesalahan huruf besar/kecil (case sensitive), perbedaan spasi/newline, dan tanda baca.
- [x] **Tombol Reset Code**:
  - Modal konfirmasi modern dan elegan ([ResetConfirmModal.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/workspace/ResetConfirmModal.tsx)) menggantikan `window.confirm`.
  - Toast feedback saat kode berhasil dikembalikan ke starter template awal.

### Modul B: Audio & Gamifikasi Interaktif
- [x] **Sound Effects & Micro-Interactions**:
  - Modul sintesis audio Web Audio API murni ([sound.ts](file:///Users/juliansa/Documents/project2026/kelaskode/lib/sound.ts)) tanpa dependensi MP3 eksternal.
  - Efek suara Run (`playRun`), Chime sukses arpeggio 4-nada (`playSuccess`), dan Nada lembut evaluasi belum lolos (`playFailure`).
  - Tombol kontrol mute/unmute efek suara di navbar workspace belajar.
  - Konfeti perayaan multi-cannon saat exercise berhasil diselesaikan ([ExerciseSuccessModal.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/workspace/ExerciseSuccessModal.tsx)).
- [x] **Weekly Leaderboard (Papan Peringkat Mingguan)**:
  - Halaman penuh [Leaderboard Mahasiswa](file:///Users/juliansa/Documents/project2026/kelaskode/app/leaderboard/page.tsx) dengan podium Top 3 (Emas, Perak, Perunggu).
  - API endpoint `/api/leaderboard` dengan perankingan dinamis berdasarkan XP dan streak.
  - Sticky card "Posisi Kamu" lengkap dengan indikator selisih XP untuk menyalip peringkat di atasnya.
  - Widget preview Top Mahasiswa Mingguan di Dashboard utama ([DashboardClient.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/dashboard/DashboardClient.tsx)).
  - Integrasi link Leaderboard pada Sidebar dan Navbar utama.
  - Data peer mahasiswa aktif Indonesia seeded (`scripts/seed_peers.ts`).

### Modul C: Kelulusan & Sertifikat Digital (Certification & Verification)
- [x] **Model Basis Data & Kredensial Unik**:
  - Model `Certificate` di Prisma schema ([schema.prisma](file:///Users/juliansa/Documents/project2026/kelaskode/prisma/schema.prisma)) dengan relasi ke `User` dan `Course`.
  - Generator format nomor sertifikat resmi anti-duplikasi `RK-PY-2026-XXXXX` ([certificate.ts](file:///Users/juliansa/Documents/project2026/kelaskode/lib/certificate.ts)).
  - API endpoint pengecekan dan klaim kelulusan `POST /api/certificate/claim`.
- [x] **Sertifikat Digital Interaktif & Print-Ready (A4 Landscape)**:
  - Halaman sertifikat resmi ([CertificateViewClient.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/certificate/CertificateViewClient.tsx)) berorientasi landscape A4 dengan CSS `@media print`.
  - Ornamen dual-line border emas & navy, Golden Seal Stamp timbul 3D, tanda tangan instruktur & direktur kurikulum, dan QR Code dinamis berbasis `qrcode.react`.
  - Tombol aksi: Cetak / Simpan PDF langsung via browser print engine, Bagikan Kredensial ke LinkedIn, dan Salin Tautan Sertifikat.
- [x] **Portal Verifikasi Publik (Public Verification Portal)**:
  - Rute verifikasi dinamis `/verify/[certificateNumber]` ([PublicVerificationClient.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/certificate/PublicVerificationClient.tsx)) yang dapat diakses publik tanpa perlu login.
  - Tampilan status validitas, identitas penerima, tanggal terbit, kompetensi kelulusan yang dikuasai, dan tombol verifikasi sertifikat lain.
  - Halaman indeks pencarian verifikasi `/verify` untuk memasukkan nomor sertifikat manual.
- [x] **Integrasi Dashboard & Profil Mahasiswa**:
  - Banner selebrasi kelulusan 100% di Dashboard utama ([DashboardClient.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/dashboard/DashboardClient.tsx)) dengan audio chime dan konfeti saat klaim.
  - Seksi "Sertifikat Kelulusan Resmi" di halaman Profil ([page.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/app/profile/page.tsx)) dengan tautan langsung ke view sertifikat dan halaman verifikasi publik.

### Modul D: Optimasi Teknis & Aksesibilitas
- [x] **Workspace Split Resizer**:
  - Handle drag-and-drop dinamis antar panel materi, Monaco Editor, dan konsol output di [LearningWorkspaceClient.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/workspace/LearningWorkspaceClient.tsx).
  - Batas rasio minimum & maksimum (20% - 60%) agar teks materi maupun editor tidak terpotong.
  - Fitur double-click pada divider resizer untuk mereset lebar panel kembali ke proporsi default seimbang (30% materi : 45% editor : 25% konsol).
- [x] **Dark / Light Theme Toggle Global**:
  - Pengontrol tema terpadu ([theme.ts](file:///Users/juliansa/Documents/project2026/kelaskode/lib/theme.ts)) yang membaca preferensi `localStorage` dan system color-scheme.
  - Script anti-FOUC (Flash of Unstyled Content) di `head` [layout.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/app/layout.tsx) sebelum React hidrasi.
  - Tombol toggle Sun / Moon minimalis ([ThemeToggle.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/theme/ThemeToggle.tsx)) di Sidebar [AppShell.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/layout/AppShell.tsx), [WorkspaceNavbar.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/workspace/WorkspaceNavbar.tsx), dan [Navbar.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/Navbar.tsx).
  - Sinkronisasi instan tema Monaco Editor (`vs-dark` vs `light`) via `MutationObserver` pada tag `<html>`.
- [x] **Offline Resilience & Cache Storage**:
  - Hook status jaringan ([offline.ts](file:///Users/juliansa/Documents/project2026/kelaskode/lib/offline.ts)) dengan banner peringatan offline amber di [AppShell.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/layout/AppShell.tsx) & badge status di [WorkspaceNavbar.tsx](file:///Users/juliansa/Documents/project2026/kelaskode/components/workspace/WorkspaceNavbar.tsx).
  - Cache Storage browser API (`ruangkode-pyodide-v1`) untuk file Pyodide CDN di [pyodide.ts](file:///Users/juliansa/Documents/project2026/kelaskode/lib/pyodide.ts), sehingga script runtime Python tersimpan offline setelah load pertama.

---

## 🛠️ Informasi Lingkungan Pengembangan
- **Aplikasi**: `http://localhost:3000`
- **Kredensial Mahasiswa Demo**: `siswa@ruangkode.com` / `password123`
- **Kredensial Admin Demo**: `admin@ruangkode.com` / `admin123`
- **Database**: SQLite via Prisma ORM (`prisma/dev.db`)
