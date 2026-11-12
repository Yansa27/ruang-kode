# Pengalaman belajar RuangKode

Materi dibuka dalam mode cerita. Ruang praktik merupakan mode terpisah agar pembaca bisa fokus pada satu konsep sebelum melihat editor, console, dan detail latihan.

## Alur setiap materi

1. **Cerita:** situasi di Kedai Kode bersama Nara dan tujuan belajar dari database.
2. **Konsep:** penjelasan singkat tentang alat Python yang menyelesaikan situasi itu.
3. **Contoh:** kode dan tombol untuk mengungkap hasil yang sudah disiapkan. Ini bukan eksekusi kode; kode bebas dijalankan di ruang praktik.
4. **Cek pemahaman:** pertanyaan pilihan ganda dengan umpan balik dan kesempatan mengulang tanpa penalti XP.
5. **Misi:** latihan asli dari database dan tombol menuju editor.

Cerita dapat dibuka kembali tanpa menghapus draft editor. Slide tidak mengubah status kelulusan, XP, atau hasil penilaian. Semua materi asli tersedia di bagian catatan materi. Navigasi slide tidak dikunci oleh jawaban kuis; pengguna dapat mengulang atau langsung praktik.

## Pemeliharaan

- `lib/lesson-stories.ts`: cerita, contoh, output, dan pertanyaan untuk 14 slug Python yang ada.
- `components/workspace/LessonStory.tsx`: tampilan dan interaksi slide.
- Materi dengan slug baru memakai pemecahan Markdown menjadi slide otomatis sampai cerita khusus ditambahkan.
- Cerita dikurasi dalam source. Perubahan materi melalui CMS tidak otomatis menulis ulang cerita khusus; periksa keduanya ketika konsep berubah.
- Posisi slide dipertahankan selama berpindah mode pada halaman yang sama, tetapi kembali ke awal setelah reload. Draft kode mengikuti mekanisme penyimpanan aplikasi yang sudah ada.

## Verifikasi

- `node --import tsx --test lib/lesson-stories.test.ts`: validitas cerita dan pemecahan Markdown.
- `npx tsc --noEmit`: pemeriksaan tipe.
- `npm run build -- --webpack`: build produksi yang berhasil di lingkungan ini; Turbopack terhalang pembatasan port subprocess.
- Browser: halaman publik 1440px/390px, halaman akun, slide, hasil contoh, jawaban benar/salah, perpindahan mode, draft editor, dan mode gelap mobile.
- Seluruh 14 contoh cerita dijalankan dengan Python dan dicocokkan dengan output yang ditampilkan.

Lint repository secara keseluruhan masih memiliki temuan pada kode lama. Komponen cerita dan data cerita lulus pemeriksaan ESLint terarah.
