export interface StoryScene {
  title: string;
  situation: string;
  idea: string;
  code: string;
  output: string;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
}

// A shared setting connects concepts without changing the graded exercises in the database.
export const lessonStories: Record<string, StoryScene> = {
  '01-introduction-to-python': {
    title: 'Hari pertama di Kedai Kode',
    situation: 'Bayangkan kamu membantu Nara membuka kedai kecil di kampus. Sebelum menerima pesanan, Nara ingin komputer menyapa setiap pengunjung. Tapi layar masih kosong. Bagaimana kita membuatnya berbicara?',
    idea: 'Kamu memberi instruksi, Python menjalankannya. Untuk menampilkan pesan, gunakan print(). Bungkus teks dengan tanda petik, lalu letakkan di dalam kurung.',
    code: 'print("Selamat datang di Kedai Kode!")', output: 'Selamat datang di Kedai Kode!',
    question: 'Nara ingin menampilkan teks Halo. Instruksi mana yang benar?', choices: ['print("Halo")', 'print(Halo)', '"print(Halo)"'], answer: 0,
    explanation: 'print("Halo") menampilkan teks. Tanpa tanda petik, Halo dianggap nama variabel. Jika seluruh instruksi dibungkus petik, itu hanya teks, bukan pemanggilan fungsi.',
  },
  '02-variables': {
    title: 'Satu label untuk setiap pesanan',
    situation: 'Pengunjung pertama datang: Nara mencatat nama dan jumlah pesanannya. Kalau semua informasi hanya diingat, mudah tertukar. Kita butuh tempat menyimpan data dengan nama yang jelas.',
    idea: 'Variabel adalah nama yang merujuk ke sebuah nilai. Tanda = menyimpan nilai di sebelah kanan ke nama di sebelah kiri. Nilainya bisa diganti saat pesanan berubah.',
    code: 'pesanan = "Teh hangat"\njumlah = 2\nprint(pesanan)\nprint(jumlah)', output: 'Teh hangat\n2',
    question: 'Setelah jumlah = 2 lalu jumlah = 3, apa isi jumlah?', choices: ['2', '3', '5'], answer: 1,
    explanation: 'Assignment kedua mengganti nilai sebelumnya. jumlah sekarang bernilai 3, bukan menjumlahkan 2 dan 3.',
  },
  '03-data-types': {
    title: 'Catatan yang tidak semuanya angka',
    situation: 'Di buku pesanan, Nara menulis nama minuman, jumlah gelas, berat kopi, dan status pembayaran. Semuanya data, tetapi tidak semuanya bisa diperlakukan dengan cara yang sama.',
    idea: 'Teks memakai str, bilangan bulat memakai int, bilangan desimal memakai float, dan benar/salah memakai bool. type() membantu mengenali tipe sebuah nilai.',
    code: 'minuman = "Kopi"\njumlah = 2\nberat = 12.5\nlunas = True\nprint(type(berat))', output: "<class 'float'>",
    question: 'Apa tipe nilai "2" jika ditulis dengan tanda petik?', choices: ['int', 'float', 'str'], answer: 2,
    explanation: 'Tanda petik membuat "2" menjadi teks (str). Nilai 2 tanpa petik adalah bilangan bulat (int).',
  },
  '04-operators': {
    title: 'Membagi kue tanpa menebak',
    situation: 'Ada 17 kue di kedai. Nara ingin memasukkan masing-masing 5 kue ke sebuah kotak. Berapa kotak penuh yang bisa dibuat, dan berapa kue yang tersisa?',
    idea: 'Python bisa menghitung seperti kalkulator. // menghitung hasil bagi bulat, sedangkan % memberikan sisa pembagian. Gunakan * untuk perkalian dan / untuk pembagian biasa.',
    code: 'kue = 17\nprint(kue // 5)\nprint(kue % 5)', output: '3\n2',
    question: 'Berapa hasil 17 % 5?', choices: ['3', '2', '3.4'], answer: 1,
    explanation: 'Tiga kotak memakai 15 kue. Tersisa 2 kue. Operator % mengambil sisa itu.',
  },
  '05-string': {
    title: 'Nama pelanggan di gelas',
    situation: 'Nama pelanggan masuk sebagai "nara", tetapi label gelas harus mudah dibaca. Daripada mengetik ulang semua nama, kita bisa meminta Python merapikan teksnya.',
    idea: 'String adalah teks. Metode .upper() menghasilkan versi huruf kapital. String asli tidak berubah, jadi simpan atau cetak hasilnya.',
    code: 'nama = "nara"\nlabel = nama.upper()\nprint(label)', output: 'NARA',
    question: 'Apa yang dihasilkan "kopi".upper()?', choices: ['Kopi', 'KOPI', 'kopi'], answer: 1,
    explanation: '.upper() mengubah semua huruf menjadi kapital. Hasilnya adalah string baru: KOPI.',
  },
  '06-conditional': {
    title: 'Bonus untuk pesanan besar',
    situation: 'Nara menawarkan kue gratis untuk pelanggan yang membeli setidaknya 3 minuman. Komputer perlu memilih: beri bonus atau tampilkan ucapan terima kasih biasa.',
    idea: 'if menjalankan kode saat kondisi benar. else menangani kondisi sebaliknya. Indentasi menunjukkan instruksi mana yang termasuk dalam setiap pilihan.',
    code: 'jumlah = 3\nif jumlah >= 3:\n    print("Bonus kue!")\nelse:\n    print("Terima kasih!")', output: 'Bonus kue!',
    question: 'Jika jumlah = 2, pesan apa yang tampil?', choices: ['Bonus kue!', 'Terima kasih!', 'Keduanya'], answer: 1,
    explanation: '2 >= 3 bernilai False. Python melewati blok if dan menjalankan blok else.',
  },
  '07-for-loop': {
    title: 'Memanggil antrean satu per satu',
    situation: 'Tiga pesanan sudah siap. Nara tidak ingin menulis instruksi yang sama tiga kali hanya untuk memanggil nomor antrean yang berbeda.',
    idea: 'for mengulang instruksi untuk setiap item. range(1, 4) menghasilkan 1, 2, 3. Angka batas akhir, yaitu 4, tidak ikut.',
    code: 'for nomor in range(1, 4):\n    print(nomor)', output: '1\n2\n3',
    question: 'Angka mana yang TIDAK muncul dari range(1, 4)?', choices: ['1', '3', '4'], answer: 2,
    explanation: 'range berhenti sebelum batas akhir. Karena itu range(1, 4) hanya menghasilkan 1, 2, dan 3.',
  },
  '08-while-loop': {
    title: 'Melayani selama masih ada pesanan',
    situation: 'Nara terus melayani selama ada pesanan yang belum selesai. Setelah satu pesanan selesai, jumlahnya berkurang. Ketika habis, saatnya istirahat.',
    idea: 'while mengulang selama kondisi bernilai True. Ubah nilai yang diperiksa agar kondisi akhirnya menjadi False; kalau tidak, perulangan bisa berjalan tanpa henti.',
    code: 'sisa = 3\nwhile sisa > 0:\n    print(sisa)\n    sisa -= 1\nprint("Selesai")', output: '3\n2\n1\nSelesai',
    question: 'Mengapa sisa -= 1 diperlukan?', choices: ['Agar teks menjadi kapital', 'Agar perulangan akhirnya berhenti', 'Agar sisa selalu bertambah'], answer: 1,
    explanation: 'Nilai sisa berkurang sampai 0. Saat sisa > 0 tidak lagi benar, while berhenti.',
  },
  '09-list': {
    title: 'Menu yang bisa bertambah',
    situation: 'Kedai awalnya menjual kopi dan teh. Besok ada cokelat juga. Menyimpan setiap minuman dalam variabel terpisah akan merepotkan saat menu semakin panjang.',
    idea: 'List menyimpan beberapa nilai dalam urutan. Indeks dimulai dari 0. .append() menambahkan item baru di akhir list.',
    code: 'menu = ["Kopi", "Teh"]\nmenu.append("Cokelat")\nprint(menu[0])\nprint(len(menu))', output: 'Kopi\n3',
    question: 'Pada menu di atas, apa nilai menu[1]?', choices: ['Kopi', 'Teh', 'Cokelat'], answer: 1,
    explanation: 'Indeks 0 adalah Kopi, indeks 1 adalah Teh, dan indeks 2 adalah Cokelat.',
  },
  '10-functions': {
    title: 'Resep yang bisa dipakai ulang',
    situation: 'Setiap transaksi, Nara menghitung harga dikali jumlah. Daripada menyalin rumus berkali-kali, kita bungkus langkahnya dalam satu resep bernama fungsi.',
    idea: 'def mendefinisikan fungsi. Parameter menerima data dari pemanggil, dan return mengembalikan hasil. Fungsi baru bekerja saat dipanggil.',
    code: 'def total(harga, jumlah):\n    return harga * jumlah\n\nprint(total(5000, 2))', output: '10000',
    question: 'Apa hasil total(5000, 3)?', choices: ['5003', '15000', '5000'], answer: 1,
    explanation: 'harga menerima 5000 dan jumlah menerima 3. Fungsi mengembalikan hasil perkaliannya: 15000.',
  },
  '11-dictionary': {
    title: 'Mencari harga lewat nama',
    situation: 'Nara tahu nama minumannya, tetapi tidak hafal posisi setiap item di menu. Akan lebih nyaman jika harga bisa dicari langsung dengan kata "Kopi".',
    idea: 'Dictionary memasangkan key dengan value. Key seperti label yang unik, sehingga data dapat diambil lewat namanya, bukan posisi.',
    code: 'harga = {"Kopi": 12000, "Teh": 8000}\nprint(harga["Teh"])', output: '8000',
    question: 'Pada contoh ini, manakah key?', choices: ['8000', '"Teh"', '12000'], answer: 1,
    explanation: '"Teh" adalah key untuk menemukan value 8000. Pasangan ditulis key: value.',
  },
  '12-modules': {
    title: 'Meminjam alat yang sudah tersedia',
    situation: 'Nara ingin menghitung sisi sebuah meja persegi dari luasnya. Kita membutuhkan akar kuadrat. Tidak perlu membuat perhitungannya dari awal: Python sudah punya alatnya.',
    idea: 'Modul adalah kumpulan kode yang bisa digunakan kembali. import math membuka akses ke fungsi matematika, termasuk math.sqrt().',
    code: 'import math\n\nluas = 81\nprint(math.sqrt(luas))', output: '9.0',
    question: 'Apa yang perlu dilakukan sebelum memakai math.sqrt()?', choices: ['import math', 'print(math)', 'math = 81'], answer: 0,
    explanation: 'import math membuat modul math tersedia. Setelah itu kita bisa memanggil fungsi di dalamnya.',
  },
  '13-intro-oop': {
    title: 'Cetak biru sebuah minuman',
    situation: 'Kedai semakin ramai. Setiap minuman punya informasi dan tindakan yang serupa. Nara membutuhkan cetak biru agar kita tidak mengatur semuanya satu per satu.',
    idea: 'Class adalah cetak biru; object adalah hasil yang dibuat darinya. Method adalah fungsi di dalam class. self merujuk pada object yang sedang memakai method.',
    code: 'class Minuman:\n    def sajikan(self):\n        print("Minuman siap!")\n\nkopi = Minuman()\nkopi.sajikan()', output: 'Minuman siap!',
    question: 'Pada contoh ini, apa itu kopi?', choices: ['Nama modul', 'Object dari class Minuman', 'Kata kunci Python'], answer: 1,
    explanation: 'Minuman() membuat object baru. Variabel kopi merujuk pada object itu dan bisa memanggil method sajikan().',
  },
  '14-oop-init': {
    title: 'Setiap minuman punya identitas',
    situation: 'Cetak biru sudah ada, tetapi kopi dan teh masih tampak sama bagi program. Nara ingin setiap minuman langsung memiliki nama dan harga saat dibuat.',
    idea: '__init__ dijalankan saat object dibuat. Simpan data pada self agar setiap object punya nilai atributnya sendiri.',
    code: 'class Minuman:\n    def __init__(self, nama, harga):\n        self.nama = nama\n        self.harga = harga\n\nteh = Minuman("Teh", 8000)\nprint(teh.nama)', output: 'Teh',
    question: 'Apa nilai teh.harga?', choices: ['"Teh"', '8000', '0'], answer: 1,
    explanation: 'Argumen kedua, 8000, masuk ke parameter harga dan disimpan sebagai self.harga pada object teh.',
  },
};

/** Split at Markdown block boundaries, never inside fenced code or a table/list block. */
export function splitLessonContent(content: string): string[] {
  const blocks: string[] = [];
  let block: string[] = [];
  let fence: string | null = null;
  for (const line of content.split('\n')) {
    const marker = line.trim().match(/^(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
    }
    if (!fence && !line.trim() && block.length) { blocks.push(block.join('\n')); block = []; }
    else block.push(line);
  }
  if (block.length) blocks.push(block.join('\n'));
  const slides: string[] = [];
  let current = '';
  for (const part of blocks.filter(part => part.trim())) {
    if (current && (current.length + part.length > 750 || /^#{1,3} /.test(part)) && !/^#{1,3} [^\n]+$/.test(current)) {
      slides.push(current); current = '';
    }
    current += (current ? '\n\n' : '') + part;
  }
  if (current) slides.push(current);
  return slides;
}
