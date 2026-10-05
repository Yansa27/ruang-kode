# PRD — RuangKode

## 1. Product Overview

**RuangKode** adalah platform pembelajaran pemrograman interaktif yang ditujukan terutama untuk mahasiswa Indonesia.

Konsep utama RuangKode adalah:

> **Learn → Code → Run → Understand → Progress**

Pengguna tidak hanya membaca materi, tetapi langsung menulis dan menjalankan kode di dalam browser.

Pada tahap MVP, platform hanya berfokus pada:

* Python Fundamental
* Interactive coding playground
* Lesson-based learning
* Exercise dan auto-check
* Progress tracking

Platform harus memiliki UI modern, clean, profesional, dan terasa seperti produk edtech sungguhan. Hindari tampilan yang terlalu ramai, terlalu banyak gradient, atau terlihat seperti website yang dibuat AI.

---

# 2. Product Goals

## Primary Goals

1. Mahasiswa dapat belajar Python secara bertahap.
2. Mahasiswa dapat menulis kode langsung di browser.
3. Mahasiswa dapat menjalankan kode tanpa melakukan setup Python di komputer.
4. Mahasiswa dapat mengerjakan exercise.
5. Sistem dapat mengevaluasi jawaban pengguna.
6. Sistem menyimpan progress pembelajaran.
7. Pengalaman belajar terasa sederhana dan tidak membingungkan bagi pemula.

## Non-Goals untuk MVP

Jangan implementasikan terlebih dahulu:

* Multi-language
* Marketplace course
* Payment
* Certificate
* Chat AI tutor
* Social feed
* Live class
* Instructor marketplace
* Mobile application
* Advanced analytics
* Enterprise/campus management

Fitur-fitur tersebut dapat dipertimbangkan setelah MVP stabil.

---

# 3. Target Users

## Primary User

Mahasiswa Indonesia yang:

* sedang belajar pemrograman
* masih pemula
* sering kesulitan melakukan setup environment
* ingin belajar melalui praktik langsung
* membutuhkan materi yang terstruktur

## Secondary User

Admin/content creator yang membuat:

* course
* chapter
* lesson
* exercise
* test case

---

# 4. Core User Journey

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Pilih Course
   ↓
Python Fundamental
   ↓
Pilih Lesson
   ↓
Baca Materi
   ↓
Tulis Code
   ↓
Run Code
   ↓
Lihat Output
   ↓
Submit Exercise
   ↓
Auto Evaluation
   ↓
Exercise Passed
   ↓
Progress Updated
   ↓
Next Lesson
```

---

# 5. Technology Stack

## Frontend & Application

* Next.js
* TypeScript
* App Router
* React
* Tailwind CSS
* shadcn/ui

Next.js digunakan sebagai full-stack application.

Jangan menggunakan Laravel atau backend framework terpisah untuk MVP.

## Database

Gunakan:

* PostgreSQL
* Prisma ORM

## Authentication

Gunakan Auth.js atau solusi authentication yang stabil dan sesuai dengan Next.js.

Authentication minimal:

* Register
* Login
* Logout
* Session
* Protected dashboard
* Protected learning page

## Code Editor

Gunakan:

* Monaco Editor

Editor harus mendukung:

* syntax highlighting
* line numbers
* code editing
* keyboard shortcuts
* basic autocomplete
* dark editor theme

## Python Execution

Untuk MVP gunakan:

**Pyodide**

Python dijalankan langsung di browser menggunakan WebAssembly.

Jangan menjalankan arbitrary user Python code secara langsung menggunakan Node.js `child_process`, `exec`, `spawn`, atau mekanisme server-side yang tidak terisolasi.

Advanced sandbox execution dapat ditambahkan pada fase berikutnya menggunakan Judge0/Piston.

---

# 6. Application Structure

Gunakan struktur Next.js App Router yang rapi.

Contoh:

```text
app/
├── page.tsx
│
├── login/
│   └── page.tsx
│
├── register/
│   └── page.tsx
│
├── dashboard/
│   └── page.tsx
│
├── learn/
│   └── [courseSlug]/
│       └── [lessonSlug]/
│           └── page.tsx
│
├── profile/
│   └── page.tsx
│
├── admin/
│   ├── page.tsx
│   ├── courses/
│   ├── lessons/
│   └── exercises/
│
└── api/
    ├── progress/
    ├── submissions/
    └── ...
```

Gunakan reusable components.

Contoh:

```text
components/
├── layout/
├── navbar/
├── sidebar/
├── course/
├── lesson/
├── editor/
├── exercise/
├── progress/
└── ui/
```

---

# 7. Main Pages

## 7.1 Landing Page

Landing page sederhana.

Sections:

### Hero

Headline:

> Belajar Coding. Langsung Praktik.

Subheadline:

> Pelajari pemrograman melalui materi interaktif dan coding playground langsung di browser.

CTA:

> Mulai Belajar

Secondary CTA:

> Lihat Course

### Course Preview

Tampilkan:

* Python Fundamental
* Beginner
* jumlah lesson
* progress jika user sudah login

### How It Works

```text
1. Pelajari
2. Tulis Code
3. Jalankan
4. Selesaikan Challenge
```

### Footer

Minimal dan profesional.

---

# 8. Dashboard

Setelah login, user diarahkan ke:

```text
/dashboard
```

Dashboard menampilkan:

### Greeting

```text
Selamat datang kembali, Juliansa 👋
Lanjutkan belajar dari tempat terakhir kamu.
```

### Current Course

Card:

```text
Python Fundamental

████████████░░░░ 72%

9 / 12 lessons completed

[Continue Learning]
```

### Learning Statistics

Minimal:

* Lessons Completed
* Exercises Completed
* Current Streak
* XP

Untuk MVP statistik boleh menggunakan data sederhana.

### Recent Activity

Contoh:

```text
✓ Variable selesai
✓ Conditional selesai
✓ Function selesai
```

---

# 9. Course Page

URL:

```text
/learn/python-fundamental
```

Layout:

```text
┌─────────────────────────────────────────────┐
│ Python Fundamental                          │
│ Beginner                                    │
│                                             │
│ █████████████░░░ 72%                        │
└─────────────────────────────────────────────┘

Chapter 1 — Python Basics

✓ Introduction
✓ Variables
✓ Data Types
✓ Operators

Chapter 2 — Control Flow

✓ If / Else
→ Loops
○ Nested Loops

Chapter 3 — Functions

○ Functions
○ Parameters
○ Return Value
```

Setiap lesson memiliki status:

* Locked
* Not Started
* In Progress
* Completed

---

# 10. Learning Workspace

Ini adalah fitur terpenting dalam MVP.

URL:

```text
/learn/python-fundamental/variables
```

Desktop layout harus memiliki tiga area:

```text
┌───────────────────────────────────────────────────────────┐
│ Navbar                                                    │
├──────────────┬─────────────────────────┬──────────────────┤
│              │                         │                  │
│   LESSON     │       CODE EDITOR       │      OUTPUT      │
│              │                         │                  │
│  Introduction│  1 | name = "John"     │  Hello John     │
│  Variables   │  2 | print(name)       │                  │
│  Data Types  │  3 |                   │  ✓ Success       │
│  Operators   │                         │                  │
│              │                         │                  │
│              │  [Run] [Reset] [Submit] │                  │
└──────────────┴─────────────────────────┴──────────────────┘
```

## Responsive Behavior

Desktop:

```text
Sidebar | Editor | Output
```

Tablet:

```text
Sidebar
Editor + Output
```

Mobile:

Gunakan tab:

```text
Materi | Code | Output
```

Jangan memaksakan tiga kolom pada mobile.

---

# 11. Lesson Content

Setiap lesson memiliki:

```text
Title
Description
Learning Objectives
Content
Example Code
Exercise
Starter Code
Hints
```

Contoh:

## Lesson: Variables

### Learning Objective

Setelah menyelesaikan lesson ini, mahasiswa memahami:

* konsep variable
* assignment
* tipe data sederhana
* penggunaan variable dalam output

### Content

```python
name = "Juliansa"
age = 22

print(name)
print(age)
```

### Exercise

> Buat variable `name` berisi nama kamu dan tampilkan menggunakan `print()`.

---

# 12. Code Editor

Gunakan Monaco Editor.

Default language:

```text
Python
```

Default starter code:

```python
# Tulis kode kamu di sini

```

Features:

* line number
* syntax highlighting
* indentation
* keyboard shortcuts
* reset code
* run code
* submit code

---

# 13. Python Execution

Gunakan Pyodide.

Flow:

```text
User clicks Run
        ↓
Get code from Monaco
        ↓
Initialize Pyodide
        ↓
Execute Python
        ↓
Capture stdout
        ↓
Display output
```

Output harus menangani:

### Success

```text
Hello World
```

### Error

```text
NameError: name 'hello' is not defined
```

Error harus ditampilkan dengan UI yang jelas.

Jangan menampilkan raw browser exception jika bisa diubah menjadi pesan yang lebih mudah dipahami.

---

# 14. Exercise System

Exercise memiliki:

```text
id
lessonId
title
description
starterCode
solutionCode
difficulty
```

Test case:

```text
id
exerciseId
input
expectedOutput
```

Untuk MVP, evaluation dapat dilakukan dengan mekanisme sederhana yang aman dan kompatibel dengan Pyodide.

Jangan menggunakan `eval()` terhadap input user sebagai mekanisme utama evaluation.

---

# 15. Exercise UX

Contoh:

```text
┌───────────────────────────────────────┐
│ Challenge                             │
├───────────────────────────────────────┤
│ Buat variable bernama age             │
│ dengan nilai 22.                      │
│                                       │
│ [Hint]                                │
│                                       │
│              [Run Code]               │
│              [Submit]                 │
└───────────────────────────────────────┘
```

Jika berhasil:

```text
✓ Exercise Completed

Good job!

+10 XP

[Next Lesson →]
```

Jika gagal:

```text
✕ Belum berhasil

Output kamu belum sesuai dengan
expected output.

Coba periksa kembali kode kamu.
```

---

# 16. Progress System

Simpan progress per user dan lesson.

Status:

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
```

Progress course:

```text
completed lessons / total lessons * 100
```

Contoh:

```text
7 / 10 lessons

70%
```

Progress harus tersimpan di database.

User dapat meninggalkan halaman dan kembali tanpa kehilangan progress.

---

# 17. XP System

Implementasi sederhana.

Contoh:

```text
Complete Lesson      +10 XP
Complete Exercise    +20 XP
Complete Chapter     +50 XP
```

Jangan membuat sistem XP terlalu kompleks pada MVP.

---

# 18. Database Schema

Gunakan Prisma.

Minimal model:

```text
User
Course
Chapter
Lesson
Exercise
TestCase
Enrollment
LessonProgress
Submission
UserStats
```

Relasi:

```text
User
 ├── Enrollment
 ├── LessonProgress
 ├── Submission
 └── UserStats

Course
 └── Chapter
      └── Lesson
           └── Exercise
                └── TestCase
```

---

# 19. Admin

MVP membutuhkan admin sederhana untuk mengelola content.

Admin dapat:

* melihat course
* membuat course
* membuat chapter
* membuat lesson
* membuat exercise
* membuat test case
* mengedit content
* publish/unpublish lesson

Admin UI tidak perlu sangat kompleks.

Prioritaskan functionality.

---

# 20. Seed Data

Application harus memiliki seed data.

Buat satu course:

```text
Python Fundamental
```

Isi minimal 10 lesson:

```text
01 Introduction to Python
02 Variables
03 Data Types
04 Operators
05 String
06 Conditional
07 For Loop
08 While Loop
09 List
10 Functions
```

Setiap lesson minimal memiliki:

* explanation
* example code
* one exercise

---

# 21. UI/UX Direction

Design harus:

* clean
* modern
* professional
* educational
* minimal
* readable
* fast
* responsive

Hindari:

* excessive gradients
* excessive glassmorphism
* terlalu banyak animasi
* neon cyberpunk
* terlalu banyak rounded cards
* AI-generated looking UI
* dashboard yang terlalu penuh

Gunakan visual hierarchy yang kuat.

Prioritaskan typography dan spacing.

---

# 22. Color Direction

Gunakan warna dasar:

```text
Background:
#FFFFFF / #F8FAFC

Text:
#0F172A

Muted:
#64748B

Border:
#E2E8F0

Primary:
#2563EB

Success:
#16A34A

Error:
#DC2626
```

Jangan menggunakan terlalu banyak warna.

Primary color digunakan untuk:

* CTA
* active state
* progress
* links
* important actions

---

# 23. Navigation

Desktop navbar:

```text
RuangKode

Learn
Courses
Progress

                Search
                Profile
```

Learning workspace memiliki sidebar lesson.

Sidebar harus dapat:

* collapse
* expand
* menunjukkan progress
* menunjukkan lesson active
* menunjukkan completed state

---

# 24. Authentication

Required:

```text
/register
/login
/logout
```

User yang belum login tidak dapat mengakses:

```text
/dashboard
/learn/*
/profile
```

Admin routes harus protected.

---

# 25. Security Requirements

Penting:

1. Jangan menjalankan arbitrary Python menggunakan Node.js server.
2. Pyodide digunakan untuk execution client-side.
3. Jangan menyimpan password plain text.
4. Gunakan secure authentication.
5. Validasi semua server input.
6. Gunakan authorization untuk admin.
7. Jangan expose database credentials ke client.
8. Environment secrets hanya berada di `.env`.
9. Jangan menggunakan `eval()` untuk menjalankan arbitrary user code.
10. Jangan menganggap client-side validation sebagai security.

---

# 26. Performance

Target MVP:

* Fast initial load
* Lazy load Monaco Editor
* Lazy load Pyodide
* Jangan load Pyodide pada landing page.
* Jangan load Monaco sebelum user membuka coding workspace.
* Gunakan Server Components jika memungkinkan.
* Gunakan Client Components hanya ketika diperlukan.
* Gunakan pagination pada admin/data-heavy pages.

Pyodide harus di-load secara lazy ketika user membuka lesson yang membutuhkan coding.

---

# 27. Error Handling

Harus ada state untuk:

```text
Loading
Empty
Success
Error
Unauthorized
Not Found
```

Contoh:

```text
Pyodide sedang dimuat...

Menyiapkan Python environment...
```

Jangan menampilkan blank screen ketika Pyodide sedang loading.

---

# 28. Accessibility

Minimal:

* keyboard navigation
* semantic HTML
* sufficient contrast
* visible focus state
* button labels jelas
* form error messages
* editor tidak menjadi satu-satunya cara memahami exercise

---

# 29. Development Principles

Gunakan prinsip:

* Type-safe
* Reusable components
* Clean architecture
* Separation of concerns
* Server Components by default
* Client Components only when interaction requires them
* Avoid unnecessary dependencies
* Avoid premature abstraction
* Avoid overengineering

Jangan membuat architecture yang terlalu kompleks untuk MVP.

---

# 30. Definition of Done

MVP dianggap selesai jika:

### Authentication

* [ ] Register berhasil
* [ ] Login berhasil
* [ ] Logout berhasil
* [ ] Protected routes bekerja

### Course

* [ ] Python Fundamental tersedia
* [ ] Chapter tersedia
* [ ] Lesson tersedia
* [ ] Lesson dapat dibuka

### Learning Workspace

* [ ] Sidebar lesson bekerja
* [ ] Content lesson tampil
* [ ] Monaco Editor bekerja
* [ ] Python syntax highlighting bekerja
* [ ] Pyodide dapat di-load
* [ ] Python dapat dijalankan
* [ ] stdout dapat ditampilkan
* [ ] error dapat ditampilkan
* [ ] Reset code bekerja

### Exercise

* [ ] Exercise tersedia
* [ ] Starter code tersedia
* [ ] User dapat submit
* [ ] Test case berjalan
* [ ] Success state tampil
* [ ] Failed state tampil

### Progress

* [ ] Lesson completion tersimpan
* [ ] Course progress dihitung
* [ ] Dashboard menampilkan progress
* [ ] User dapat melanjutkan dari lesson terakhir

### Admin

* [ ] Admin dapat membuat course
* [ ] Admin dapat membuat lesson
* [ ] Admin dapat membuat exercise
* [ ] Admin dapat publish/unpublish content

### Responsive

* [ ] Desktop
* [ ] Tablet
* [ ] Mobile

---

# 31. Implementation Order

Implementasikan secara berurutan.

## Phase 1

Project foundation:

```text
Next.js
TypeScript
Tailwind
shadcn/ui
Prisma
PostgreSQL
Auth
```

## Phase 2

Build:

```text
Landing Page
Navbar
Auth
Dashboard
```

## Phase 3

Build:

```text
Course
Chapter
Lesson
Database relationships
```

## Phase 4

Build coding workspace:

```text
Monaco Editor
Pyodide
Run
Output
Reset
```

## Phase 5

Build:

```text
Exercise
Test Case
Submit
Evaluation
```

## Phase 6

Build:

```text
Progress
XP
Lesson completion
Dashboard statistics
```

## Phase 7

Build:

```text
Admin CMS
```

## Phase 8

Polish:

```text
Responsive
Loading states
Error states
Accessibility
Performance
Security
```

---

# 32. Important Development Constraint

**DO NOT implement future features before the MVP works.**

Do not add:

* AI tutor
* chatbot
* payment
* certificate
* leaderboard
* multi-language
* social features
* notifications
* complex gamification

until the following flow works perfectly:

```text
Register
 ↓
Login
 ↓
Dashboard
 ↓
Python Course
 ↓
Lesson
 ↓
Read Material
 ↓
Write Python
 ↓
Run Code
 ↓
See Output
 ↓
Submit Exercise
 ↓
Pass
 ↓
Progress Updated
 ↓
Next Lesson
```

This flow is the core product.

---

# 33. Expected Initial Result

At the end of the first implementation, the application should feel like a small but polished version of an interactive coding learning platform.

A user should be able to:

1. Register.
2. Login.
3. See Python Fundamental course.
4. Open a lesson.
5. Read the lesson.
6. Write Python code in Monaco Editor.
7. Run the code using Pyodide.
8. See the output.
9. Complete an exercise.
10. Receive pass/fail feedback.
11. Gain XP.
12. See their progress.
13. Continue to the next lesson.

Focus on making this experience **stable, fast, clean, and enjoyable** before expanding the feature set.
