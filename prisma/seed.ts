import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting RuangKode database seeding...');

  // Clean existing data
  await prisma.certificate.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();
  await prisma.userStats.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPasswordStudent = await bcrypt.hash('password123', 10);
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);

  const studentUser = await prisma.user.create({
    data: {
      name: 'Juliansa',
      email: 'siswa@ruangkode.com',
      password: hashedPasswordStudent,
      role: 'STUDENT',
      stats: {
        create: {
          xp: 20,
          streak: 2,
          completedLessonsCount: 1,
          completedExercisesCount: 1,
        },
      },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin RuangKode',
      email: 'admin@ruangkode.com',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
      stats: {
        create: {
          xp: 150,
          streak: 7,
          completedLessonsCount: 10,
          completedExercisesCount: 10,
        },
      },
    },
  });

  console.log('✓ Users created: siswa@ruangkode.com & admin@ruangkode.com');

  // Create Course: Python Fundamental
  const course = await prisma.course.create({
    data: {
      slug: 'python-fundamental',
      title: 'Python Fundamental',
      description: 'Pelajari dasar-dasar pemrograman Python dari nol hingga mahir dengan latihan langsung di browser.',
      level: 'Beginner',
      isPublished: true,
      order: 1,
    },
  });

  console.log(`✓ Course created: ${course.title}`);

  // Chapter 1: Python Basics
  const chapter1 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: 'Chapter 1 — Python Basics',
      description: 'Pondasi utama bahasa Python, variabel, tipe data, dan operator dasar.',
      order: 1,
    },
  });

  // Chapter 2: Control Flow
  const chapter2 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: 'Chapter 2 — Control Flow',
      description: 'Mengarahkan jalannya program dengan logika percabangan dan perulangan.',
      order: 2,
    },
  });

  // Chapter 3: Data Structures
  const chapter3 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: 'Chapter 3 — Data Structures',
      description: 'Menyimpan dan mengelola kumpulan data secara efisien dengan list.',
      order: 3,
    },
  });

  // Chapter 4: Modular Code
  const chapter4 = await prisma.chapter.create({
    data: {
      courseId: course.id,
      title: 'Chapter 4 — Modular Code',
      description: 'Menulis kode yang rapi, terstruktur, dan dapat digunakan kembali menggunakan fungsi.',
      order: 4,
    },
  });

  // 10 Lessons Definitions
  const lessonsData = [
    {
      chapterId: chapter1.id,
      slug: '01-introduction-to-python',
      title: '01. Introduction to Python',
      order: 1,
      description: 'Mengenal bahasa pemrograman Python dan fungsi print() pertama kamu.',
      learningObjectives: JSON.stringify([
        'Memahami apa itu bahasa pemrograman Python dan keunggulannya',
        'Mengetahui fungsi print() untuk menampilkan teks ke layar',
        'Menjalankan program Python pertama langsung di browser',
      ]),
      content: `## Selamat Datang di Python!

Python adalah salah satu bahasa pemrograman paling populer di dunia karena sintaksisnya yang bersih, ringkas, dan mudah dipahami, menyerupai bahasa Inggris sehari-hari.

Python digunakan secara luas di berbagai bidang industri:
* **Pengembangan Web** (Backend development)
* **Data Science & AI** (Machine Learning, Analisis Data)
* **Otomasi & Scripting** (Tugas otomatis)

### Fungsi \`print()\`
Dalam Python, kita menggunakan fungsi bawaan bernama \`print()\` untuk menampilkan teks atau hasil perhitungan ke terminal/layar.

\`\`\`python
print("Halo, Dunia!")
print("Selamat datang di RuangKode!")
\`\`\`

Teks yang diapit oleh tanda petik dua (\`"\`) atau tanda petik satu (\`'\`) disebut sebagai **String**.`,
      exampleCode: `print("Halo, Dunia!")\nprint("Selamat datang di RuangKode!")`,
      starterCode: `# Tulis kode kamu di bawah ini untuk mencetak "Halo, RuangKode!"\n`,
      hints: JSON.stringify([
        'Gunakan tanda petik dua atau satu untuk membungkus teks.',
        'Contoh: print("Halo, RuangKode!")',
      ]),
      exercise: {
        title: 'Tantangan: Cetak Halo RuangKode',
        description: 'Tuliskan perintah Python yang mencetak persis kalimat: `Halo, RuangKode!` ke terminal.',
        difficulty: 'EASY',
        starterCode: `# Tulis kode kamu di sini\n`,
        solutionCode: `print("Halo, RuangKode!")`,
        testCases: [
          {
            input: '',
            expectedOutput: 'Halo, RuangKode!',
            order: 1,
            isHidden: false,
          },
        ],
      },
    },
    {
      chapterId: chapter1.id,
      slug: '02-variables',
      title: '02. Variables',
      order: 2,
      description: 'Menyimpan dan mengelola data dalam memori program menggunakan variabel.',
      learningObjectives: JSON.stringify([
        'Memahami konsep wadah penyimpan nilai (variabel)',
        'Melakukan proses assignment menggunakan tanda sama dengan (=)',
        'Menampilkan nilai variabel menggunakan print()',
      ]),
      content: `## Apa itu Variabel?

Variabel dapat dibayangkan seperti sebuah kotak berlabel tempat kita menyimpan data atau informasi di dalam memori komputer.

Di Python, kamu tidak perlu mendeklarasikan tipe data secara eksplisit. Python otomatis mendeteksi tipe datanya saat kamu melakukan pemberian nilai (**assignment**) menggunakan tanda sama dengan (\`=\`).

\`\`\`python
nama = "Juliansa"
umur = 22

print(nama)
print(umur)
\`\`\`

### Aturan Penamaan Variabel:
1. Harus dimulai dengan huruf atau garis bawah (\`_\`).
2. Tidak boleh diawali oleh angka.
3. Bersifat **case-sensitive** (\`nama\` berbeda dengan \`Nama\`).
4. Gunakan gaya penamaan \`snake_case\` untuk variabel multi-kata (contoh: \`nama_lengkap\`).`,
      exampleCode: `nama = "Juliansa"\numur = 22\n\nprint(nama)\nprint(umur)`,
      starterCode: `# Buat variable nama dan umur, lalu tampilkan keduanya\n`,
      hints: JSON.stringify([
        'Buat variable nama = "Juliansa"',
        'Buat variable umur = 22',
        'Gunakan print(nama) lalu print(umur)',
      ]),
      exercise: {
        title: 'Tantangan: Buat Variabel Nama dan Umur',
        description: 'Buatlah variabel `nama` bernilai `"Juliansa"` dan variabel `umur` bernilai `22`. Kemudian cetak nilai `nama` pada baris pertama dan `umur` pada baris kedua menggunakan `print()`.',
        difficulty: 'EASY',
        starterCode: `# Buat variable nama dan umur di sini\n`,
        solutionCode: `nama = "Juliansa"\numur = 22\nprint(nama)\nprint(umur)`,
        testCases: [
          {
            input: '',
            expectedOutput: 'Juliansa\n22',
            order: 1,
            isHidden: false,
          },
        ],
      },
    },
    {
      chapterId: chapter1.id,
      slug: '03-data-types',
      title: '03. Data Types',
      order: 3,
      description: 'Mengenal tipe data dasar Python: String, Integer, Float, dan Boolean.',
      learningObjectives: JSON.stringify([
        'Membedakan tipe data int, float, str, dan bool',
        'Menggunakan fungsi type() untuk memeriksa tipe data',
        'Menghindari error akibat ketidakcocokan tipe data',
      ]),
      content: `## Tipe Data Dasar di Python

Setiap nilai di Python memiliki tipe data. Tipe data memberitahu komputer operasi apa saja yang bisa dilakukan terhadap nilai tersebut.

Empat tipe data paling mendasar:
1. **Integer (\`int\`)**: Bilangan bulat, contoh: \`10\`, \`-5\`, \`0\`
2. **Float (\`float\`)**: Bilangan desimal/pecahan, contoh: \`3.14\`, \`175.5\`
3. **String (\`str\`)**: Teks karakter, contoh: \`"Belajar Python"\`
4. **Boolean (\`bool\`)**: Nilai kebenaran logika: \`True\` atau \`False\`

### Memeriksa Tipe Data dengan \`type()\`
Kamu dapat mengetahui tipe data dari sebuah nilai atau variabel menggunakan fungsi \`type()\`:

\`\`\`python
tinggi = 175.5
print(type(tinggi)) # Output: <class 'float'>
\`\`\``,
      exampleCode: `angka = 100\ndesimal = 3.14\nteks = "RuangKode"\nstatus = True\n\nprint(type(angka))\nprint(type(desimal))\nprint(type(teks))\nprint(type(status))`,
      starterCode: `# Buat variable tinggi bernilai 175.5 dan cetak type(tinggi)\n`,
      hints: JSON.stringify([
        'Definisikan: tinggi = 175.5',
        'Cetak tipenya dengan: print(type(tinggi))',
      ]),
      exercise: {
        title: 'Tantangan: Cek Tipe Data Float',
        description: 'Buatlah variabel bernama `tinggi` dengan nilai desimal `175.5`. Kemudian cetak tipe data variabel tersebut menggunakan `print(type(tinggi))`.',
        difficulty: 'EASY',
        starterCode: `# Tulis kode di sini\n`,
        solutionCode: `tinggi = 175.5\nprint(type(tinggi))`,
        testCases: [
          {
            input: '',
            expectedOutput: "<class 'float'>",
            order: 1,
            isHidden: false,
          },
        ],
      },
    },
    {
      chapterId: chapter1.id,
      slug: '04-operators',
      title: '04. Operators',
      order: 4,
      description: 'Melakukan operasi aritmatika, perbandingan, dan logika matematika pada Python.',
      learningObjectives: JSON.stringify([
        'Menggunakan operator aritmatika: +, -, *, /, //, %, **',
        'Memahami perbedaan pembagian biasa (/) dan pembagian bulat (//)',
        'Memahami fungsi operator sisa bagi modulus (%)',
      ]),
      content: `## Operator Aritmatika di Python

Python menyediakan operator aritmatika lengkap:

| Operator | Operasi | Contoh | Hasil |
| :--- | :--- | :--- | :--- |
| \`+\` | Penjumlahan | \`10 + 5\` | \`15\` |
| \`-\` | Pengurangan | \`10 - 5\` | \`5\` |
| \`*\` | Perkalian | \`10 * 5\` | \`50\` |
| \`/\` | Pembagian (float) | \`10 / 4\` | \`2.5\` |
| \`//\` | Pembagian Bulat | \`10 // 4\` | \`2\` |
| \`%\` | Modulus (Sisa Bagi) | \`10 % 4\` | \`2\` |
| \`**\` | Pemangkatan | \`2 ** 3\` | \`8\` |

Operator modulus (\`%\`) sangat berguna dalam pemrograman, misalnya untuk memeriksa apakah suatu bilangan ganjil atau genap.`,
      exampleCode: `a = 29\nb = 4\n\nprint("Hasil bagi bulat:", a // b)\nprint("Sisa bagi (modulus):", a % b)`,
      starterCode: `# Hitung sisa bagi dari 29 dibagi 4 dan cetak hasilnya\n`,
      hints: JSON.stringify([
        'Gunakan operator modulus %',
        'print(29 % 4)',
      ]),
      exercise: {
        title: 'Tantangan: Hitung Sisa Bagi Modulus',
        description: 'Hitunglah sisa bagi (modulus) dari bilangan `29` dibagi `4`, lalu cetak hasil angka tersebut ke layar.',
        difficulty: 'EASY',
        starterCode: `# Cetak hasil 29 % 4 di sini\n`,
        solutionCode: `print(29 % 4)`,
        testCases: [
          {
            input: '',
            expectedOutput: '1',
            order: 1,
            isHidden: false,
          },
        ],
      },
    },
    {
      chapterId: chapter1.id,
      slug: '05-string',
      title: '05. String',
      order: 5,
      description: 'Bekerja dengan teks, f-string formatting, dan method bawaan manipulasi string.',
      learningObjectives: JSON.stringify([
        'Memahami method manipulasi string seperti .upper(), .lower(), .replace()',
        'Menggunakan f-string untuk menggabungkan variabel ke dalam teks',
        'Mengetahui panjang string menggunakan fungsi len()',
      ]),
      content: `## Bekerja dengan String di Python

String memiliki banyak method bawaan yang mempermudah pengolahan teks:

* \`.upper()\` : Mengubah seluruh karakter menjadi huruf kapital.
* \`.lower()\` : Mengubah seluruh karakter menjadi huruf kecil.
* \`.title()\` : Mengubah huruf awal setiap kata menjadi kapital.
* \`len()\`    : Menghitung jumlah karakter dalam string.

\`\`\`python
teks = "halo dunia"
print(teks.upper()) # HALO DUNIA
print(len(teks))    # 10
\`\`\`

### Formatted String (f-string)
Cara modern dan paling rapi untuk menyisipkan variabel ke dalam teks adalah menggunakan prefix \`f\`:

\`\`\`python
bahasa = "Python"
pesan = f"Saya sedang belajar {bahasa}!"
print(pesan)
\`\`\``,
      exampleCode: `teks = "belajar python di ruangkode"\nprint(teks.upper())\nprint(f"Panjang karakter: {len(teks)}")`,
      starterCode: `teks = "belajar python menyenangkan"\n# Cetak variabel teks dalam huruf kapital semua\n`,
      hints: JSON.stringify([
        'Panggil method .upper() pada variabel teks.',
        'Contoh: print(teks.upper())',
      ]),
      exercise: {
        title: 'Tantangan: Mengubah String Menjadi Huruf Kapital',
        description: 'Terdapat variabel `teks = "belajar python menyenangkan"`. Gunakan method `.upper()` untuk mengubah teks menjadi huruf kapital semua, lalu cetak hasilnya.',
        difficulty: 'EASY',
        starterCode: `teks = "belajar python menyenangkan"\n# Tulis kode kamu di sini\n`,
        solutionCode: `teks = "belajar python menyenangkan"\nprint(teks.upper())`,
        testCases: [
          {
            input: '',
            expectedOutput: 'BELAJAR PYTHON MENYENANGKAN',
            order: 1,
            isHidden: false,
          },
        ],
      },
    },
    {
      chapterId: chapter2.id,
      slug: '06-conditional',
      title: '06. Conditional (If / Else)',
      order: 6,
      description: 'Membuat keputusan cerdas dalam program menggunakan percabangan if, elif, dan else.',
      learningObjectives: JSON.stringify([
        'Memahami alur logika percabangan kondisional',
        'Menerapkan if, elif, dan else dengan indentasi 4 spasi',
        'Menggunakan operator pembanding: ==, !=, >, <, >=, <=',
      ]),
      content: `## Percabangan Logika: If, Elif, Else

Program komputer menjadi pintar karena mampu mengambil keputusan berdasarkan kondisi tertentu.

\`\`\`python
skor = 85

if skor >= 80:
    print("Sangat Baik")
elif skor >= 70:
    print("Baik")
else:
    print("Perlu Peningkatan")
\`\`\`

> **PENTING: Indentasi di Python**
> Python menggunakan spasi/indentasi (umumnya 4 spasi) untuk menentukan blok kode. Jangan lupa memberikan tanda titik dua (\`:\`) di akhir kondisi \`if\`!`,
      exampleCode: `nilai = 85\n\nif nilai >= 70:\n    print("Selamat, kamu lulus!")\nelse:\n    print("Tetap semangat, coba lagi!")`,
      starterCode: `skor = 75\n# Buat kondisi: jika skor >= 70 cetak "Lulus", selain itu cetak "Remedial"\n`,
      hints: JSON.stringify([
        'Gunakan if skor >= 70: diikuti indentasi print("Lulus")',
        'Gunakan else: diikuti print("Remedial")',
      ]),
      exercise: {
        title: 'Tantangan: Cek Kelulusan Siswa',
        description: 'Diberikan variabel `skor = 75`. Jika `skor >= 70`, cetak `"Lulus"`. Jika tidak, cetak `"Remedial"`.',
        difficulty: 'EASY',
        starterCode: `skor = 75\n# Tulis percabangan di sini\n`,
        solutionCode: `skor = 75\nif skor >= 70:\n    print("Lulus")\nelse:\n    print("Remedial")`,
        testCases: [
          {
            input: '',
            expectedOutput: 'Lulus',
            order: 1,
            isHidden: false,
          },
        ],
      },
    },
    {
      chapterId: chapter2.id,
      slug: '07-for-loop',
      title: '07. For Loop',
      order: 7,
      description: 'Mengulang baris perintah secara otomatis dengan perulangan for dan fungsi range().',
      learningObjectives: JSON.stringify([
        'Memahami cara kerja perulangan for di Python',
        'Menggunakan fungsi range(start, stop, step)',
        'Melakukan iterasi deret angka secara terstruktur',
      ]),
      content: `## Perulangan dengan \`for\`

Perulangan (loop) digunakan ketika kita ingin mengeksekusi sekumpulan instruksi berkali-kali tanpa menulis kode berulang secara manual.

Fungsi \`range(start, stop)\` menghasilkan deret angka mulai dari \`start\` hingga sebelum angka \`stop\` (stop bersifat eksklusif).

\`\`\`python
for i in range(1, 4):
    print(i)
\`\`\`

Output dari kode di atas adalah:
\`\`\`text
1
2
3
\`\`\`

Perhatikan bahwa angka \`4\` tidak dicetak karena batas akhir \`stop\` tidak diikutsertakan.`,
      exampleCode: `for angka in range(1, 6):\n    print(f"Iterasi ke-{angka}")`,
      starterCode: `# Cetak angka 1 sampai 5 menggunakan for loop dan range()\n`,
      hints: JSON.stringify([
        'Gunakan range(1, 6) karena batas akhir 6 tidak dihitung.',
        'for i in range(1, 6):\n    print(i)',
      ]),
      exercise: {
        title: 'Tantangan: Cetak Angka 1 sampai 5',
        description: 'Gunakan perulangan `for` bersama fungsi `range()` untuk mencetak angka `1` sampai `5` (setiap angka di baris baru).',
        difficulty: 'EASY',
        starterCode: `# Tulis for loop kamu di sini\n`,
        solutionCode: `for i in range(1, 6):\n    print(i)`,
        testCases: [
          {
            input: '',
            expectedOutput: '1\n2\n3\n4\n5',
            order: 1,
            isHidden: false,
          },
        ],
      },
    },
    {
      chapterId: chapter2.id,
      slug: '08-while-loop',
      title: '08. While Loop',
      order: 8,
      description: 'Menjalankan perulangan selama suatu kondisi logika bernilai True.',
      learningObjectives: JSON.stringify([
        'Memahami perbedaan for loop dan while loop',
        'Mengatur variabel counter agar tidak terjadi infinite loop',
        'Menggunakan kondisi boolean sebagai pengontrol iterasi',
      ]),
      content: `## Perulangan \`while\`

Berbeda dengan \`for\` yang biasanya mengulang elemen yang sudah terdefinisi panjangnya, perulangan \`while\` akan terus berjalan **selama kondisinya bernilai \`True\`**.

\`\`\`python
hitung = 1
while hitung <= 3:
    print(hitung)
    hitung += 1  # Wajib dinaikkan agar loop tidak berjalan selamanya
\`\`\`

> **Perhatian:**
> Pastikan ada perubahan nilai pada variabel kondisi (seperti \`hitung += 1\`) di dalam badan loop untuk mencegah program mengalami *infinite loop* (macet).`,
      exampleCode: `x = 1\nwhile x <= 3:\n    print(f"Nilai x: {x}")\n    x += 1`,
      starterCode: `x = 1\n# Gunakan while loop untuk mencetak x dari 1 sampai 3\n`,
      hints: JSON.stringify([
        'Kondisinya adalah: while x <= 3:',
        'Cetak x dengan print(x)',
        'Jangan lupa tambahkan x += 1 di setiap putaran',
      ]),
      exercise: {
        title: 'Tantangan: Perulangan While Sederhana',
        description: 'Diberikan variabel `x = 1`. Gunakan perulangan `while` untuk mencetak nilai `x` dan tambahkan `1` ke `x` hingga nilai `x` mencapai `3`. Cetak angka 1, 2, dan 3 masing-masing di baris baru.',
        difficulty: 'EASY',
        starterCode: `x = 1\n# Tulis kode while loop di sini\n`,
        solutionCode: `x = 1\nwhile x <= 3:\n    print(x)\n    x += 1`,
        testCases: [
          {
            input: '',
            expectedOutput: '1\n2\n3',
            order: 1,
            isHidden: false,
          },
        ],
      },
    },
    {
      chapterId: chapter3.id,
      slug: '09-list',
      title: '09. List',
      order: 9,
      description: 'Menyimpan koleksi data berurutan, indexing 0-based, dan method append.',
      learningObjectives: JSON.stringify([
        'Membuat dan menginisialisasi List dengan kurung siku [ ]',
        'Mengakses elemen menggunakan indeks (dimulai dari 0)',
        'Menambahkan elemen baru ke akhir list dengan .append()',
      ]),
      content: `## Struktur Data: List

List adalah struktur data di Python yang digunakan untuk menyimpan kumpulan item berurutan dalam satu variabel. List didefinisikan menggunakan tanda kurung siku \`[\` dan \`]\`.

\`\`\`python
buah = ["Apel", "Jeruk", "Mangga"]
print(buah[0])  # Mengakses elemen pertama: "Apel"
\`\`\`

### Menambahkan Elemen dengan \`.append()\`
Untuk menyisipkan data baru ke posisi paling akhir dari sebuah list:

\`\`\`python
buah.append("Pisang")
print(buah)  # ['Apel', 'Jeruk', 'Mangga', 'Pisang']
\`\`\``,
      exampleCode: `hobi = ["koding", "membaca"]\nhobi.append("gaming")\nprint(hobi)\nprint(f"Hobi favorit: {hobi[0]}")`,
      starterCode: `# Buat list hobi = ["koding", "membaca", "gaming"]\n# Tambahkan "musik" dengan .append(), lalu cetak list hobi\n`,
      hints: JSON.stringify([
        'hobi = ["koding", "membaca", "gaming"]',
        'hobi.append("musik")',
        'print(hobi)',
      ]),
      exercise: {
        title: 'Tantangan: Mengelola List Hobi',
        description: 'Buatlah variabel list bernama `hobi` yang berisi 3 elemen string: `"koding"`, `"membaca"`, `"gaming"`. Kemudian tambahkan string `"musik"` ke dalam list menggunakan method `.append()`. Terakhir, cetak seluruh isi list `hobi` menggunakan `print()`.',
        difficulty: 'MEDIUM',
        starterCode: `# Tulis kode kamu di sini\n`,
        solutionCode: `hobi = ["koding", "membaca", "gaming"]\nhobi.append("musik")\nprint(hobi)`,
        testCases: [
          {
            input: '',
            expectedOutput: "['koding', 'membaca', 'gaming', 'musik']",
            order: 1,
            isHidden: false,
          },
        ],
      },
    },
    {
      chapterId: chapter4.id,
      slug: '10-functions',
      title: '10. Functions',
      order: 10,
      description: 'Menulis blok kode modular yang reusable menggunakan kata kunci def dan return.',
      learningObjectives: JSON.stringify([
        'Mendefinisikan fungsi sendiri dengan def nama_fungsi(parameter)',
        'Mengirimkan argumen dan mengembalikan nilai dengan return',
        'Memanggil fungsi dan memanfaatkan hasilnya dalam program',
      ]),
      content: `## Membuat Fungsi dengan \`def\`

Fungsi adalah blok kode terorganisir yang dirancang untuk melakukan tugas tertentu dan dapat dipanggil berulang kali. Ini mencegah kita menulis kode yang sama berulang-ulang (prinsip *Don't Repeat Yourself* / DRY).

\`\`\`python
def sapa(nama):
    return f"Halo, {nama}!"

pesan = sapa("Andi")
print(pesan)  # Halo, Andi!
\`\`\`

### Komponen Fungsi:
1. Kata kunci \`def\` diikuti nama fungsi dan tanda kurung \`()\`.
2. **Parameter** di dalam tanda kurung untuk menerima input data.
3. Kata kunci \`return\` untuk mengembalikan nilai hasil pemrosesan.`,
      exampleCode: `def hitung_luas_persegi(sisi):\n    return sisi * sisi\n\nluas = hitung_luas_persegi(5)\nprint(f"Luas persegi: {luas}")`,
      starterCode: `# Definisikan fungsi tambah(a, b) yang mengembalikan a + b\n# Panggil fungsi tersebut dengan argumen 15 dan 25, lalu cetak hasilnya\n`,
      hints: JSON.stringify([
        'def tambah(a, b):\n    return a + b',
        'print(tambah(15, 25))',
      ]),
      exercise: {
        title: 'Tantangan: Buat Fungsi Penjumlahan',
        description: 'Buatlah sebuah fungsi bernama `tambah(a, b)` yang menerima dua parameter dan mengembalikan hasil penjumlahan `a + b`. Panggil fungsi tersebut dengan nilai `15` dan `25`, lalu cetak hasilnya menggunakan `print()`.',
        difficulty: 'MEDIUM',
        starterCode: `# Tulis fungsi tambah dan panggil di sini\n`,
        solutionCode: `def tambah(a, b):\n    return a + b\n\nprint(tambah(15, 25))`,
        testCases: [
          {
            input: '',
            expectedOutput: '40',
            order: 1,
            isHidden: false,
          },
        ],
      },
    },
  ];

  // Insert lessons and exercises
  for (const lData of lessonsData) {
    const lesson = await prisma.lesson.create({
      data: {
        chapterId: lData.chapterId,
        slug: lData.slug,
        title: lData.title,
        order: lData.order,
        description: lData.description,
        learningObjectives: lData.learningObjectives,
        content: lData.content,
        exampleCode: lData.exampleCode,
        starterCode: lData.starterCode,
        hints: lData.hints,
        isPublished: true,
      },
    });

    const ex = await prisma.exercise.create({
      data: {
        lessonId: lesson.id,
        title: lData.exercise.title,
        description: lData.exercise.description,
        difficulty: lData.exercise.difficulty,
        starterCode: lData.exercise.starterCode,
        solutionCode: lData.exercise.solutionCode,
      },
    });

    for (const tc of lData.exercise.testCases) {
      await prisma.testCase.create({
        data: {
          exerciseId: ex.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          order: tc.order,
          isHidden: tc.isHidden,
        },
      });
    }

    console.log(`  ✓ Lesson & Exercise seeded: ${lesson.title}`);
  }

  // Enroll demo student in the course
  await prisma.enrollment.create({
    data: {
      userId: studentUser.id,
      courseId: course.id,
    },
  });

  // Mark first lesson as completed for student demo
  const firstLesson = await prisma.lesson.findFirst({
    where: { slug: '01-introduction-to-python' },
    include: { exercises: true },
  });

  if (firstLesson) {
    await prisma.lessonProgress.create({
      data: {
        userId: studentUser.id,
        lessonId: firstLesson.id,
        status: 'COMPLETED',
        isCompleted: true,
        completedAt: new Date(),
        lastCode: 'print("Halo, RuangKode!")',
      },
    });

    if (firstLesson.exercises[0]) {
      await prisma.submission.create({
        data: {
          userId: studentUser.id,
          exerciseId: firstLesson.exercises[0].id,
          code: 'print("Halo, RuangKode!")',
          status: 'PASSED',
          output: 'Halo, RuangKode!',
        },
      });
    }
  }

  console.log('✅ RuangKode database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
