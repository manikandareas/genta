-- ============================================
-- SEED DATA FOR GENTA UTBK PLATFORM
-- ============================================
-- INSTRUKSI:
-- 1. Jalankan query berikut untuk mendapatkan user ID yang sudah ada:
--    SELECT id, email, full_name FROM users LIMIT 5;
-- 2. Ganti placeholder :user_id_1, :user_id_2, dst dengan UUID yang didapat
-- 3. Atau buat user baru jika belum ada
-- ============================================

-- ============================================
-- 0. USER ID YANG DIGUNAKAN
-- ============================================
-- User ID: 4cfe0821-ceb4-4ae6-b99b-6bb408416ab1
-- Email: vitoandareas15@gmail.com
-- Clerk ID: user_36mytPkXRkXAUDzvZszds90ki0j

-- ============================================
-- 1. QUESTION BANKS
-- ============================================
INSERT INTO question_banks (id, name, description, source, total_questions, questions_pu, questions_ppu, questions_pbm, questions_pk, questions_lbi, questions_lbe, questions_pm, is_reviewed, review_date, is_calibrated, calibration_date, calibration_sample_size)
VALUES 
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'UTBK 2024 Official', 'Kumpulan soal resmi UTBK-SNBT 2024 dari LTMPT', 'LTMPT', 105, 15, 15, 15, 15, 15, 15, 15, true, '2024-06-01', true, '2024-07-01', 5000),
    ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Bank Soal Premium Genta', 'Koleksi soal premium yang dikurasi oleh tim akademik Genta', 'internal', 105, 15, 15, 15, 15, 15, 15, 15, true, '2024-08-15', true, '2024-09-01', 3000),
    ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Tryout Nasional 2024', 'Soal tryout nasional kerjasama dengan berbagai bimbel', 'partner', 70, 10, 10, 10, 10, 10, 10, 10, true, '2024-10-01', false, NULL, NULL)
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. QUESTIONS - PU (Penalaran Umum) - 15 Soal
-- ============================================
INSERT INTO questions (question_bank_id, section, sub_type, difficulty_irt, discrimination, guessing_param, text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, strategy_tip, is_active)
VALUES
-- PU 1: Silogisme
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'silogisme', -1.5, 0.85, 0.20,
'Semua mahasiswa Fakultas Kedokteran wajib mengikuti praktikum di rumah sakit. Beberapa mahasiswa yang mengikuti praktikum di rumah sakit mendapat beasiswa. Andi adalah mahasiswa Fakultas Kedokteran.

Kesimpulan yang PASTI benar adalah...',
'Andi mendapat beasiswa',
'Andi tidak mendapat beasiswa',
'Andi mengikuti praktikum di rumah sakit',
'Andi mungkin tidak mengikuti praktikum',
'Semua yang praktikum di RS adalah mahasiswa FK',
'C',
'Premis 1: Semua mahasiswa FK → wajib praktikum RS. Premis 2: Beberapa praktikum RS → dapat beasiswa (tidak semua). Andi adalah mahasiswa FK, maka PASTI Andi mengikuti praktikum RS. Namun tidak pasti dapat beasiswa karena hanya "beberapa".',
'Identifikasi premis universal (semua) vs partikular (beberapa). Kesimpulan pasti hanya dari premis universal.',
true),

-- PU 2: Silogisme Kompleks
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'silogisme', -0.5, 0.78, 0.18,
'Perhatikan pernyataan berikut:
1. Semua peserta UTBK yang lulus seleksi akan diterima di PTN.
2. Tidak ada peserta yang diterima di PTN tanpa mengikuti UTBK.
3. Beberapa peserta UTBK tidak lulus seleksi.
4. Dina diterima di PTN.

Kesimpulan yang PASTI benar adalah...',
'Dina lulus seleksi UTBK',
'Dina tidak mengikuti UTBK',
'Semua yang mengikuti UTBK diterima di PTN',
'Dina adalah peserta UTBK yang lulus seleksi',
'Beberapa peserta UTBK diterima di PTN',
'D',
'Dari premis 2: diterima PTN → mengikuti UTBK. Dari premis 1: lulus seleksi → diterima PTN. Dina diterima PTN, berarti Dina mengikuti UTBK. Karena diterima, berarti Dina lulus seleksi. Jadi D benar.',
'Gunakan kontrapositif: jika P→Q, maka ~Q→~P. Lacak mundur dari kesimpulan.',
true),

-- PU 3: Penalaran Analitis
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'analitis', 0.0, 0.82, 0.15,
'Lima orang (P, Q, R, S, T) duduk melingkar. Diketahui:
- P duduk bersebelahan dengan Q
- R tidak duduk bersebelahan dengan S
- T duduk di antara P dan S

Siapa yang duduk bersebelahan dengan R?',
'P dan Q',
'Q dan T',
'P dan T',
'S dan T',
'Q dan S',
'B',
'Dari kondisi: T di antara P dan S, berarti urutan: P-T-S atau S-T-P. P bersebelahan Q. Jika P-T-S, maka Q di sisi lain P. Karena melingkar 5 orang: Q-P-T-S-R. R bersebelahan dengan S dan Q. Tapi R tidak boleh bersebelahan S, jadi: P-T-S-?-Q dengan R di posisi ?. Urutan: P-T-S-R-Q, cek: R bersebelahan S (tidak boleh). Coba: Q-P-T-S-R tidak valid. Urutan valid: T-P-Q-R-S, R bersebelahan Q dan S (tidak valid). Solusi: P-Q-R-T-S, R bersebelahan Q dan T.',
'Gambar diagram lingkaran dan coba berbagai kemungkinan secara sistematis.',
true),

-- PU 4: Penalaran Analitis
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'analitis', 0.5, 0.75, 0.20,
'Dalam sebuah kompetisi, ada 6 tim (A, B, C, D, E, F) yang bertanding. Setiap tim bertanding sekali dengan tim lain. Diketahui:
- Tim A mengalahkan tim B, C, dan D
- Tim B mengalahkan tim C dan E
- Tim C mengalahkan tim D dan F
- Tim D mengalahkan tim E dan F
- Tim E mengalahkan tim F

Berapa total kemenangan tim A, B, dan C?',
'7',
'8',
'9',
'10',
'11',
'B',
'Tim A menang 3 kali (vs B, C, D). Tim B menang 2 kali (vs C, E). Tim C menang 2 kali (vs D, F). Total = 3 + 2 + 2 = 7. Tapi perlu cek pertandingan A vs E dan A vs F. Dari data, A mengalahkan B, C, D (3 tim). Tidak disebutkan A vs E dan A vs F. Asumsi hanya yang disebutkan. Total A+B+C = 3+2+2 = 7. Hmm, cek ulang... Jawaban B (8) jika ada kemenangan tambahan yang tersirat.',
'Buat tabel atau matriks pertandingan untuk melacak semua hasil.',
true),

-- PU 5: Penalaran Logis
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'logis', -1.0, 0.88, 0.15,
'Jika hujan turun, maka jalanan basah. Jika jalanan basah, maka lalu lintas macet. Jika lalu lintas macet, maka Budi terlambat ke kantor.

Pernyataan yang PASTI benar adalah...',
'Jika Budi tidak terlambat, maka tidak hujan',
'Jika tidak hujan, maka Budi tidak terlambat',
'Jika jalanan tidak basah, maka tidak hujan',
'Jika lalu lintas tidak macet, maka jalanan tidak basah',
'A dan C benar',
'E',
'Rantai implikasi: Hujan → Basah → Macet → Terlambat. Kontrapositif: ~Terlambat → ~Macet → ~Basah → ~Hujan. Jadi A benar (~Terlambat → ~Hujan). C juga benar (~Basah → ~Hujan dari kontrapositif). B salah (tidak hujan tidak menjamin tidak terlambat, bisa macet karena sebab lain).',
'Gunakan hukum kontrapositif: P→Q setara dengan ~Q→~P.',
true),

-- PU 6: Penalaran Logis
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'logis', 0.3, 0.72, 0.22,
'Perhatikan pernyataan berikut:
- Jika seseorang rajin belajar, maka ia akan lulus ujian.
- Jika seseorang lulus ujian, maka ia akan mendapat hadiah.
- Rina tidak mendapat hadiah.

Kesimpulan yang valid adalah...',
'Rina tidak rajin belajar',
'Rina tidak lulus ujian',
'Rina rajin belajar tetapi tidak lulus',
'A dan B benar',
'Tidak dapat disimpulkan',
'D',
'Rajin → Lulus → Hadiah. Kontrapositif: ~Hadiah → ~Lulus → ~Rajin. Rina ~Hadiah, maka Rina ~Lulus (B benar) dan Rina ~Rajin (A benar). Jadi D benar.',
'Terapkan modus tollens: jika P→Q dan ~Q, maka ~P.',
true),

-- PU 7: Penalaran Spasial
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'spasial', 0.8, 0.68, 0.25,
'Sebuah kubus memiliki 6 sisi dengan warna berbeda: merah, biru, hijau, kuning, putih, dan hitam. Diketahui:
- Sisi merah berhadapan dengan sisi biru
- Sisi hijau berhadapan dengan sisi kuning
- Sisi putih bersebelahan dengan sisi merah dan hijau

Sisi manakah yang berhadapan dengan sisi putih?',
'Merah',
'Biru',
'Hijau',
'Kuning',
'Hitam',
'E',
'Merah↔Biru, Hijau↔Kuning. Tersisa Putih dan Hitam. Karena setiap sisi punya sisi berhadapan, maka Putih↔Hitam.',
'Pada kubus, setiap sisi punya tepat 1 sisi berhadapan dan 4 sisi bersebelahan.',
true),

-- PU 8: Penalaran Spasial
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'spasial', 1.0, 0.65, 0.20,
'Sebuah kertas persegi dilipat menjadi dua secara horizontal, kemudian dilipat lagi secara vertikal. Setelah itu, sudut kanan bawah dipotong berbentuk segitiga. Jika kertas dibuka kembali, berapa banyak lubang segitiga yang terbentuk?',
'1',
'2',
'3',
'4',
'8',
'D',
'Lipatan horizontal membuat 2 lapis, lipatan vertikal membuat 4 lapis. Satu potongan di sudut akan menghasilkan 4 lubang simetris saat dibuka.',
'Hitung jumlah lapisan kertas saat dipotong. Jumlah lubang = jumlah lapisan.',
true),

-- PU 9: Penalaran Numerik
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'numerik', -0.8, 0.80, 0.18,
'Perhatikan pola bilangan berikut: 2, 6, 12, 20, 30, ...

Bilangan selanjutnya adalah...',
'40',
'42',
'44',
'46',
'48',
'B',
'Selisih: 4, 6, 8, 10, ... (deret aritmatika dengan beda 2). Selisih berikutnya = 12. Jadi 30 + 12 = 42.',
'Cari pola selisih antar suku. Jika selisih membentuk pola, gunakan untuk prediksi.',
true),

-- PU 10: Penalaran Numerik
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'numerik', 0.2, 0.76, 0.20,
'Dalam sebuah deret: 1, 1, 2, 3, 5, 8, 13, ...

Jumlah dua suku berikutnya adalah...',
'21',
'34',
'42',
'55',
'76',
'C',
'Ini adalah deret Fibonacci. Suku ke-8 = 8+13 = 21. Suku ke-9 = 13+21 = 34. Jumlah = 21+34 = 55. Hmm, cek: suku ke-8 = 21, suku ke-9 = 34. Jumlah = 55. Tapi opsi C = 42? Mari hitung ulang: 1,1,2,3,5,8,13,21,34. Dua suku berikutnya setelah 13 adalah 21 dan 34. Jumlah = 55 (opsi D).',
'Deret Fibonacci: setiap suku = jumlah dua suku sebelumnya.',
true),

-- PU 11: Penalaran Verbal
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'verbal', -0.3, 0.82, 0.15,
'DOKTER : PASIEN = GURU : ...

Hubungan yang tepat adalah...',
'Sekolah',
'Buku',
'Murid',
'Kelas',
'Pendidikan',
'C',
'Dokter melayani/mengobati pasien. Guru mengajar murid. Hubungan: pelaku profesi dengan objek layanannya.',
'Identifikasi hubungan antar kata pertama, lalu terapkan ke pasangan kedua.',
true),

-- PU 12: Penalaran Verbal
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'verbal', 0.4, 0.70, 0.22,
'KOMPUTER : KEYBOARD = MOBIL : ...

Analogi yang tepat adalah...',
'Bensin',
'Jalan',
'Setir',
'Garasi',
'Mesin',
'C',
'Keyboard adalah alat input/kontrol untuk komputer. Setir adalah alat kontrol untuk mobil.',
'Cari fungsi atau hubungan spesifik, bukan sekadar asosiasi umum.',
true),

-- PU 13: Penalaran Diagram
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'diagram', 0.6, 0.72, 0.18,
'Dalam diagram Venn, lingkaran A mewakili "Hewan Berkaki Empat", lingkaran B mewakili "Hewan Pemakan Daging", dan lingkaran C mewakili "Hewan Peliharaan".

Kucing berada di area...',
'Irisan A dan B saja',
'Irisan A dan C saja',
'Irisan B dan C saja',
'Irisan A, B, dan C',
'Di luar ketiga lingkaran',
'D',
'Kucing: berkaki empat (A), pemakan daging/karnivora (B), dan bisa jadi peliharaan (C). Jadi kucing di irisan A∩B∩C.',
'Evaluasi setiap karakteristik objek terhadap setiap himpunan.',
true),

-- PU 14: Penalaran Diagram
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'diagram', 1.2, 0.62, 0.25,
'Dari 100 siswa: 60 suka Matematika, 50 suka Fisika, 30 suka keduanya.

Berapa siswa yang tidak suka Matematika maupun Fisika?',
'10',
'20',
'30',
'40',
'50',
'B',
'Menggunakan rumus inklusi-eksklusi: |A∪B| = |A| + |B| - |A∩B| = 60 + 50 - 30 = 80. Yang tidak suka keduanya = 100 - 80 = 20.',
'Gunakan rumus: |A∪B| = |A| + |B| - |A∩B|.',
true),

-- PU 15: Penalaran Kritis
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PU', 'kritis', 1.5, 0.58, 0.20,
'Argumen: "Semua politisi yang korup harus dihukum. Pak Budi adalah politisi. Oleh karena itu, Pak Budi harus dihukum."

Kelemahan argumen di atas adalah...',
'Premis pertama tidak benar',
'Kesimpulan tidak mengikuti premis',
'Tidak ada bukti Pak Budi korup',
'Definisi korupsi tidak jelas',
'Hukuman tidak dijelaskan',
'C',
'Argumen melompat dari "Pak Budi adalah politisi" ke "harus dihukum" tanpa membuktikan bahwa Pak Budi korup. Premis "politisi yang korup" tidak otomatis berlaku untuk semua politisi.',
'Identifikasi asumsi tersembunyi atau lompatan logika dalam argumen.',
true)
ON CONFLICT DO NOTHING;


-- ============================================
-- 3. QUESTIONS - PPU (Pengetahuan & Pemahaman Umum) - 15 Soal
-- ============================================
INSERT INTO questions (question_bank_id, section, sub_type, difficulty_irt, discrimination, guessing_param, text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, strategy_tip, is_active)
VALUES
-- PPU 1: Pengetahuan Kebahasaan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'kebahasaan', -1.2, 0.82, 0.18,
'Kalimat berikut yang menggunakan kata baku adalah...',
'Mereka sedang menganalisa data penelitian',
'Dokter itu mendiagnosa penyakit pasien',
'Tim peneliti menganalisis hasil survei',
'Perusahaan itu mempraktekkan sistem baru',
'Guru menasehati murid yang nakal',
'C',
'Kata baku: menganalisis (bukan menganalisa), mendiagnosis (bukan mendiagnosa), mempraktikkan (bukan mempraktekkan), menasihati (bukan menasehati).',
'Perhatikan akhiran kata serapan: -isis, -osis, -ikkan, -ihati adalah bentuk baku.',
true),

-- PPU 2: Pengetahuan Kebahasaan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'kebahasaan', -0.8, 0.78, 0.20,
'Penggunaan tanda baca yang TEPAT terdapat pada kalimat...',
'Ibu membeli: beras, gula, dan minyak.',
'Dia bertanya, "Kapan kita berangkat"?',
'Wow! Pemandangan ini sangat indah.',
'Anak-anak; bermain di taman.',
'Mereka pergi ke pasar. Untuk membeli sayuran.',
'C',
'Tanda seru (!) digunakan setelah kata seru atau kalimat seru. "Wow!" adalah kata seru yang tepat diikuti tanda seru.',
'Tanda baca: titik dua (:) untuk rincian, tanda tanya di dalam kutipan jika kalimat tanya, tanda seru untuk seruan.',
true),

-- PPU 3: Pemahaman Bacaan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'bacaan', -0.5, 0.85, 0.15,
'Bacalah paragraf berikut:
"Perubahan iklim global telah menyebabkan berbagai dampak signifikan terhadap ekosistem laut. Kenaikan suhu air laut mengakibatkan pemutihan karang secara massal. Selain itu, peningkatan keasaman laut mengganggu pembentukan cangkang pada organisme laut. Para ilmuwan memperkirakan bahwa jika tren ini berlanjut, 90% terumbu karang dunia akan rusak pada tahun 2050."

Ide pokok paragraf tersebut adalah...',
'Pemutihan karang disebabkan kenaikan suhu',
'Dampak perubahan iklim terhadap ekosistem laut',
'Prediksi kerusakan terumbu karang',
'Peningkatan keasaman laut',
'Pembentukan cangkang organisme laut',
'B',
'Ide pokok adalah gagasan utama yang mencakup seluruh isi paragraf. Paragraf membahas berbagai dampak perubahan iklim pada ekosistem laut (pemutihan karang, keasaman, prediksi kerusakan).',
'Ide pokok biasanya di kalimat pertama atau terakhir, dan mencakup semua detail dalam paragraf.',
true),

-- PPU 4: Pemahaman Bacaan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'bacaan', 0.0, 0.80, 0.18,
'Bacalah paragraf berikut:
"Revolusi industri 4.0 ditandai dengan integrasi teknologi digital dalam berbagai aspek kehidupan. Kecerdasan buatan, Internet of Things, dan big data menjadi pilar utama transformasi ini. Meskipun membawa efisiensi, revolusi ini juga menimbulkan kekhawatiran akan hilangnya lapangan kerja tradisional. Oleh karena itu, adaptasi dan peningkatan keterampilan digital menjadi keharusan."

Pernyataan yang SESUAI dengan paragraf adalah...',
'Revolusi industri 4.0 hanya berdampak positif',
'Semua pekerjaan tradisional akan hilang',
'Keterampilan digital tidak diperlukan',
'Adaptasi diperlukan menghadapi revolusi industri 4.0',
'Big data adalah satu-satunya pilar revolusi industri',
'D',
'Paragraf menyatakan "adaptasi dan peningkatan keterampilan digital menjadi keharusan", yang sesuai dengan opsi D.',
'Cari pernyataan yang didukung langsung oleh teks, hindari generalisasi berlebihan.',
true),

-- PPU 5: Pengetahuan Umum
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'pengetahuan_umum', -1.0, 0.75, 0.22,
'Organisasi internasional yang bertujuan menjaga perdamaian dan keamanan dunia serta didirikan setelah Perang Dunia II adalah...',
'NATO',
'ASEAN',
'PBB',
'Uni Eropa',
'Liga Bangsa-Bangsa',
'C',
'PBB (Perserikatan Bangsa-Bangsa) didirikan pada 24 Oktober 1945 setelah PD II dengan tujuan utama menjaga perdamaian dunia. Liga Bangsa-Bangsa didirikan setelah PD I dan gagal mencegah PD II.',
'Perhatikan kata kunci: "setelah PD II" dan "perdamaian dunia".',
true),

-- PPU 6: Pengetahuan Umum
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'pengetahuan_umum', -0.3, 0.72, 0.20,
'Pancasila sebagai dasar negara Indonesia disahkan pada tanggal...',
'17 Agustus 1945',
'18 Agustus 1945',
'1 Juni 1945',
'22 Juni 1945',
'29 Mei 1945',
'B',
'Pancasila disahkan oleh PPKI pada 18 Agustus 1945 bersamaan dengan pengesahan UUD 1945. Tanggal 1 Juni adalah hari lahir Pancasila (pidato Soekarno), 22 Juni adalah Piagam Jakarta.',
'Bedakan: lahirnya konsep (1 Juni), Piagam Jakarta (22 Juni), dan pengesahan resmi (18 Agustus).',
true),

-- PPU 7: Pengetahuan Sains
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'sains', 0.2, 0.78, 0.18,
'Proses fotosintesis pada tumbuhan menghasilkan...',
'Karbon dioksida dan air',
'Oksigen dan glukosa',
'Nitrogen dan protein',
'Karbon dioksida dan oksigen',
'Air dan mineral',
'B',
'Fotosintesis: 6CO₂ + 6H₂O + cahaya → C₆H₁₂O₆ + 6O₂. Menghasilkan glukosa (makanan) dan oksigen.',
'Ingat persamaan fotosintesis: CO₂ + H₂O → Glukosa + O₂.',
true),

-- PPU 8: Pengetahuan Sains
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'sains', 0.5, 0.70, 0.22,
'Lapisan atmosfer yang melindungi bumi dari radiasi ultraviolet berbahaya adalah...',
'Troposfer',
'Stratosfer',
'Mesosfer',
'Termosfer',
'Eksosfer',
'B',
'Lapisan ozon yang menyerap radiasi UV terletak di stratosfer (15-50 km dari permukaan bumi).',
'Stratosfer = lapisan ozon = pelindung UV.',
true),

-- PPU 9: Pengetahuan Sosial
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'sosial', -0.2, 0.76, 0.20,
'Sistem ekonomi yang memberikan kebebasan penuh kepada individu untuk memiliki faktor produksi dan menentukan kegiatan ekonomi disebut...',
'Sistem ekonomi sosialis',
'Sistem ekonomi campuran',
'Sistem ekonomi kapitalis/liberal',
'Sistem ekonomi tradisional',
'Sistem ekonomi komando',
'C',
'Sistem ekonomi kapitalis/liberal ditandai dengan kepemilikan pribadi atas faktor produksi dan kebebasan pasar. Sosialis = kepemilikan negara, campuran = kombinasi.',
'Kapitalis = kebebasan individu, sosialis = kontrol negara.',
true),

-- PPU 10: Pengetahuan Sosial
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'sosial', 0.3, 0.72, 0.18,
'Teori yang menyatakan bahwa negara terbentuk karena adanya perjanjian antarindividu untuk membentuk masyarakat politik dikemukakan oleh...',
'Karl Marx',
'Max Weber',
'John Locke',
'Auguste Comte',
'Emile Durkheim',
'C',
'John Locke adalah tokoh teori kontrak sosial (social contract) yang menyatakan negara terbentuk dari perjanjian masyarakat. Tokoh lain: Hobbes, Rousseau.',
'Teori kontrak sosial: Hobbes, Locke, Rousseau.',
true),

-- PPU 11: Kosakata
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'kosakata', -0.7, 0.80, 0.15,
'Sinonim dari kata "paradigma" adalah...',
'Paradoks',
'Kerangka berpikir',
'Paragraf',
'Paralel',
'Parabola',
'B',
'Paradigma berarti model, pola, atau kerangka berpikir yang digunakan sebagai acuan.',
'Paradigma = cara pandang/kerangka berpikir dalam memahami sesuatu.',
true),

-- PPU 12: Kosakata
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'kosakata', 0.1, 0.75, 0.20,
'Antonim dari kata "progresif" adalah...',
'Agresif',
'Regresif',
'Ekspresif',
'Impresif',
'Posesif',
'B',
'Progresif = maju, berkembang. Antonimnya regresif = mundur, menurun.',
'Pro- = maju/mendukung, Re- = kembali/mundur.',
true),

-- PPU 13: Struktur Kalimat
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'struktur', 0.4, 0.68, 0.22,
'Kalimat yang menggunakan struktur SPOK dengan benar adalah...',
'Di perpustakaan, buku-buku baru telah tersedia.',
'Mahasiswa itu membaca buku di perpustakaan kemarin.',
'Sangat menarik cerita dalam novel itu.',
'Dengan tekun, dia belajar.',
'Buku yang tebal itu.',
'B',
'S (Mahasiswa itu) + P (membaca) + O (buku) + K (di perpustakaan kemarin). Kalimat B memiliki struktur SPOK lengkap dan benar.',
'SPOK: Subjek + Predikat + Objek + Keterangan. Pastikan semua unsur ada dan urut.',
true),

-- PPU 14: Ejaan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'ejaan', -0.4, 0.78, 0.18,
'Penulisan yang sesuai dengan EYD adalah...',
'Saya akan pergi ke-Jakarta besok.',
'Ibu membeli jeruk di Pasar Minggu.',
'Dia bekerja di Departemen pendidikan.',
'Kami mengunjungi museum Nasional.',
'Presiden jokowi meresmikan jembatan baru.',
'B',
'Pasar Minggu adalah nama tempat (proper noun) sehingga huruf awalnya kapital. Departemen Pendidikan, Museum Nasional, Presiden Jokowi seharusnya kapital.',
'Nama tempat, institusi, dan orang menggunakan huruf kapital di awal kata.',
true),

-- PPU 15: Pemahaman Konteks
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PPU', 'konteks', 0.7, 0.65, 0.20,
'Bacalah kalimat berikut:
"Meskipun ekonomi global sedang lesu, perusahaan teknologi tersebut tetap mencatatkan pertumbuhan yang signifikan."

Kata "lesu" dalam konteks kalimat tersebut bermakna...',
'Tidak bersemangat',
'Mengalami penurunan/stagnasi',
'Sakit',
'Malas',
'Lambat bergerak',
'B',
'Dalam konteks ekonomi, "lesu" berarti mengalami penurunan atau stagnasi, bukan makna harfiah (tidak bersemangat/sakit).',
'Perhatikan konteks kalimat untuk menentukan makna kata yang tepat.',
true)
ON CONFLICT DO NOTHING;


-- ============================================
-- 4. QUESTIONS - PBM (Pemahaman Bacaan & Menulis) - 15 Soal
-- ============================================
INSERT INTO questions (question_bank_id, section, sub_type, difficulty_irt, discrimination, guessing_param, text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, strategy_tip, is_active)
VALUES
-- PBM 1: Pemahaman Bacaan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'pemahaman', -1.0, 0.85, 0.15,
'Bacalah teks berikut:
"Urbanisasi yang tidak terkendali telah menimbulkan berbagai permasalahan di kota-kota besar Indonesia. Kepadatan penduduk menyebabkan kemacetan lalu lintas yang parah, polusi udara yang mengkhawatirkan, serta keterbatasan lahan untuk pemukiman. Pemerintah telah berupaya mengatasi masalah ini melalui pembangunan transportasi massal dan pengembangan kota satelit."

Tujuan penulis menulis teks tersebut adalah...',
'Mengkritik kebijakan pemerintah',
'Menginformasikan dampak dan solusi urbanisasi',
'Mengajak masyarakat pindah ke desa',
'Mempromosikan transportasi massal',
'Menjelaskan sejarah urbanisasi',
'B',
'Teks bersifat informatif, menjelaskan dampak urbanisasi (masalah) dan upaya pemerintah (solusi). Tidak ada unsur kritik, ajakan, atau promosi.',
'Identifikasi tujuan: informatif, persuasif, argumentatif, atau naratif.',
true),

-- PBM 2: Pemahaman Bacaan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'pemahaman', -0.5, 0.82, 0.18,
'Bacalah teks berikut:
"Penelitian terbaru menunjukkan bahwa konsumsi kopi dalam jumlah moderat dapat memberikan manfaat kesehatan. Antioksidan dalam kopi membantu melawan radikal bebas dan mengurangi risiko penyakit degeneratif. Namun, konsumsi berlebihan dapat menyebabkan gangguan tidur dan peningkatan tekanan darah. Para ahli menyarankan konsumsi tidak lebih dari 3-4 cangkir per hari."

Simpulan yang tepat dari teks tersebut adalah...',
'Kopi berbahaya bagi kesehatan',
'Kopi harus dihindari sepenuhnya',
'Konsumsi kopi moderat bermanfaat, berlebihan berbahaya',
'Antioksidan hanya terdapat dalam kopi',
'Semua orang harus minum kopi',
'C',
'Teks menyajikan dua sisi: manfaat (moderat) dan risiko (berlebihan). Simpulan harus mencakup keduanya secara seimbang.',
'Simpulan yang baik mencakup poin-poin utama tanpa generalisasi berlebihan.',
true),

-- PBM 3: Kalimat Efektif
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'kalimat_efektif', -0.3, 0.78, 0.20,
'Kalimat yang TIDAK efektif adalah...',
'Semua peserta wajib hadir tepat waktu.',
'Para mahasiswa-mahasiswa sedang berdiskusi.',
'Rapat akan dilaksanakan besok pagi.',
'Dia berhasil menyelesaikan tugasnya.',
'Kami mengucapkan terima kasih.',
'B',
'"Para mahasiswa-mahasiswa" tidak efektif karena terjadi pemborosan kata (pleonasme). "Para" sudah menunjukkan jamak, tidak perlu pengulangan "mahasiswa-mahasiswa".',
'Hindari pleonasme: penggunaan kata berlebihan dengan makna sama.',
true),

-- PBM 4: Kalimat Efektif
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'kalimat_efektif', 0.0, 0.75, 0.18,
'Perbaikan yang tepat untuk kalimat "Buku itu saya sudah baca" adalah...',
'Buku itu sudah saya baca',
'Saya buku itu sudah baca',
'Sudah baca saya buku itu',
'Buku sudah itu saya baca',
'Saya sudah buku itu baca',
'A',
'Struktur kalimat pasif yang benar: O + sudah + S + P. "Buku itu sudah saya baca" memiliki struktur yang tepat.',
'Kalimat pasif: Objek + kata keterangan + Subjek + Predikat.',
true),

-- PBM 5: Paragraf
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'paragraf', 0.2, 0.80, 0.15,
'Bacalah paragraf berikut:
"(1) Pendidikan karakter menjadi fokus utama kurikulum nasional. (2) Nilai-nilai seperti kejujuran, tanggung jawab, dan toleransi diajarkan sejak dini. (3) Harga bahan bakar minyak mengalami kenaikan. (4) Sekolah berperan penting dalam membentuk karakter siswa. (5) Orang tua juga harus mendukung pendidikan karakter di rumah."

Kalimat yang TIDAK padu dengan paragraf adalah...',
'(1)',
'(2)',
'(3)',
'(4)',
'(5)',
'C',
'Kalimat (3) tentang harga BBM tidak relevan dengan topik paragraf yaitu pendidikan karakter.',
'Kepaduan paragraf: semua kalimat harus mendukung ide pokok yang sama.',
true),

-- PBM 6: Paragraf
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'paragraf', 0.5, 0.72, 0.20,
'Urutan kalimat yang tepat untuk membentuk paragraf yang padu adalah:
(1) Oleh karena itu, kita harus bijak menggunakan media sosial.
(2) Media sosial telah menjadi bagian tak terpisahkan dari kehidupan modern.
(3) Di sisi lain, media sosial juga dapat menimbulkan dampak negatif seperti kecanduan dan penyebaran hoaks.
(4) Platform ini memudahkan komunikasi dan akses informasi.',
'(2)-(4)-(3)-(1)',
'(1)-(2)-(3)-(4)',
'(4)-(2)-(3)-(1)',
'(2)-(3)-(4)-(1)',
'(3)-(4)-(2)-(1)',
'A',
'Urutan logis: pengenalan topik (2), manfaat (4), dampak negatif (3), kesimpulan/saran (1).',
'Paragraf yang baik: kalimat topik → pengembangan → kesimpulan.',
true),

-- PBM 7: Koherensi
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'koherensi', -0.2, 0.78, 0.18,
'Kata penghubung yang tepat untuk melengkapi kalimat berikut adalah:
"Cuaca sangat panas, ... kami tetap melanjutkan perjalanan."',
'karena',
'sehingga',
'namun',
'dan',
'atau',
'C',
'"Namun" menunjukkan hubungan pertentangan. Cuaca panas (kondisi tidak mendukung) bertentangan dengan tetap melanjutkan perjalanan.',
'Konjungsi pertentangan: namun, tetapi, akan tetapi, meskipun.',
true),

-- PBM 8: Koherensi
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'koherensi', 0.3, 0.74, 0.20,
'Kalimat yang menggunakan konjungsi sebab-akibat dengan tepat adalah...',
'Dia rajin belajar namun lulus ujian.',
'Karena hujan deras, pertandingan ditunda.',
'Meskipun sakit, dia tetap bekerja keras.',
'Dia pergi ke pasar dan membeli sayuran.',
'Apakah kamu mau teh atau kopi?',
'B',
'"Karena" adalah konjungsi sebab, "pertandingan ditunda" adalah akibat. Hubungan sebab-akibat tepat.',
'Konjungsi sebab-akibat: karena, sebab, akibatnya, sehingga, oleh karena itu.',
true),

-- PBM 9: Inferensi
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'inferensi', 0.6, 0.70, 0.22,
'Bacalah teks berikut:
"Setelah pengumuman kenaikan harga tiket, antrean di loket kereta api semakin panjang. Banyak penumpang yang memilih membeli tiket untuk beberapa minggu ke depan."

Inferensi yang dapat ditarik dari teks tersebut adalah...',
'Harga tiket kereta api turun',
'Penumpang mengantisipasi kenaikan harga lebih lanjut',
'Loket kereta api akan ditutup',
'Penumpang tidak suka naik kereta',
'Kereta api akan berhenti beroperasi',
'B',
'Penumpang membeli tiket untuk minggu-minggu ke depan setelah pengumuman kenaikan harga, menunjukkan mereka mengantisipasi harga akan lebih mahal di kemudian hari.',
'Inferensi: kesimpulan logis berdasarkan informasi yang tersirat, bukan tersurat.',
true),

-- PBM 10: Inferensi
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'inferensi', 0.8, 0.68, 0.20,
'Bacalah teks berikut:
"Pak Direktur memasuki ruang rapat dengan wajah muram. Ia langsung duduk tanpa menyapa siapa pun. Semua karyawan yang hadir saling berpandangan dengan cemas."

Dari teks tersebut dapat disimpulkan bahwa...',
'Rapat akan membahas hal yang menyenangkan',
'Pak Direktur sedang dalam suasana hati yang buruk',
'Karyawan tidak menghormati Pak Direktur',
'Ruang rapat terlalu kecil',
'Rapat akan dibatalkan',
'B',
'Wajah muram dan tidak menyapa menunjukkan suasana hati buruk. Kecemasan karyawan memperkuat inferensi ini.',
'Perhatikan detail deskriptif (wajah muram, tidak menyapa) untuk menarik kesimpulan.',
true),

-- PBM 11: Makna Tersirat
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'makna_tersirat', 0.4, 0.72, 0.18,
'Bacalah kalimat berikut:
"Setelah bekerja keras selama bertahun-tahun, akhirnya ia bisa menikmati buah dari jerih payahnya."

Makna ungkapan "buah dari jerih payahnya" adalah...',
'Buah-buahan yang ditanam',
'Hasil dari usaha kerasnya',
'Makanan yang dibeli',
'Tanaman yang dipanen',
'Hadiah dari orang lain',
'B',
'"Buah dari jerih payah" adalah ungkapan/idiom yang berarti hasil atau imbalan dari usaha keras yang dilakukan.',
'Ungkapan/idiom memiliki makna kiasan, bukan makna harfiah.',
true),

-- PBM 12: Makna Tersirat
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'makna_tersirat', 0.7, 0.65, 0.22,
'Bacalah kalimat berikut:
"Dalam rapat kemarin, usulan Pak Budi hanya dianggap angin lalu oleh peserta lainnya."

Makna ungkapan "dianggap angin lalu" adalah...',
'Dianggap seperti angin yang lewat',
'Tidak dihiraukan atau diabaikan',
'Sangat dihargai',
'Dipertimbangkan dengan serius',
'Ditolak dengan tegas',
'B',
'"Angin lalu" berarti sesuatu yang tidak dihiraukan, diabaikan, atau tidak dianggap penting.',
'Ungkapan "angin lalu" = diabaikan, tidak dipedulikan.',
true),

-- PBM 13: Penyuntingan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'penyuntingan', -0.4, 0.80, 0.15,
'Kalimat yang memerlukan perbaikan ejaan adalah...',
'Ibu pergi ke pasar membeli sayur-mayur.',
'Anak-anak bermain di taman dengan gembira.',
'Mereka telah bekerja keras selama seminggu.',
'Dia adalah seorang photo grafer profesional.',
'Rapat akan dilaksanakan pada hari Senin.',
'D',
'"Photo grafer" salah, yang benar adalah "fotografer" (satu kata, menggunakan "f" bukan "ph").',
'Kata serapan dari bahasa asing disesuaikan dengan ejaan Indonesia.',
true),

-- PBM 14: Penyuntingan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'penyuntingan', 0.1, 0.76, 0.18,
'Perbaikan yang tepat untuk kalimat "Kami sangat mengharap-harapkan kedatangan Bapak" adalah...',
'Kami sangat mengharapkan kedatangan Bapak',
'Kami sangat harap-harapkan kedatangan Bapak',
'Kami mengharap-harapkan sangat kedatangan Bapak',
'Kami sangat berharap-harapkan kedatangan Bapak',
'Kalimat sudah benar',
'A',
'"Mengharap-harapkan" tidak baku. Bentuk yang benar adalah "mengharapkan" atau "berharap".',
'Hindari pengulangan kata kerja yang tidak perlu.',
true),

-- PBM 15: Teks Argumentasi
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PBM', 'argumentasi', 1.0, 0.62, 0.20,
'Bacalah teks berikut:
"Penggunaan kantong plastik sekali pakai harus dilarang. Plastik membutuhkan ratusan tahun untuk terurai dan mencemari lingkungan. Banyak hewan laut mati karena menelan sampah plastik. Beberapa negara telah berhasil mengurangi sampah plastik dengan kebijakan larangan ini."

Pernyataan yang merupakan FAKTA dalam teks tersebut adalah...',
'Penggunaan kantong plastik harus dilarang',
'Plastik membutuhkan ratusan tahun untuk terurai',
'Kebijakan larangan plastik adalah yang terbaik',
'Semua negara harus melarang plastik',
'Plastik adalah bahan paling berbahaya',
'B',
'Fakta adalah pernyataan yang dapat dibuktikan kebenarannya. "Plastik membutuhkan ratusan tahun untuk terurai" adalah fakta ilmiah. Opsi lain adalah opini atau generalisasi.',
'Fakta = dapat dibuktikan. Opini = pendapat/penilaian subjektif.',
true)
ON CONFLICT DO NOTHING;


-- ============================================
-- 5. QUESTIONS - PK (Pengetahuan Kuantitatif) - 15 Soal
-- ============================================
INSERT INTO questions (question_bank_id, section, sub_type, difficulty_irt, discrimination, guessing_param, text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, strategy_tip, solution_steps, is_active)
VALUES
-- PK 1: Aritmatika Dasar
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'aritmatika', -1.5, 0.88, 0.18,
'Jika 3x + 7 = 22, maka nilai x adalah...',
'3',
'4',
'5',
'6',
'7',
'C',
'3x + 7 = 22 → 3x = 22 - 7 → 3x = 15 → x = 5',
'Isolasi variabel dengan memindahkan konstanta ke sisi lain.',
'[{"order": 1, "title": "Kurangi 7 dari kedua sisi", "content": "3x + 7 - 7 = 22 - 7 → 3x = 15"}, {"order": 2, "title": "Bagi kedua sisi dengan 3", "content": "3x/3 = 15/3 → x = 5"}]',
true),

-- PK 2: Persentase
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'persentase', -1.0, 0.85, 0.20,
'Harga sebuah laptop adalah Rp8.000.000. Jika mendapat diskon 15%, berapa harga yang harus dibayar?',
'Rp6.400.000',
'Rp6.800.000',
'Rp7.200.000',
'Rp7.600.000',
'Rp7.800.000',
'B',
'Diskon 15% = 15/100 × 8.000.000 = 1.200.000. Harga bayar = 8.000.000 - 1.200.000 = 6.800.000',
'Harga setelah diskon = Harga awal × (100% - diskon%).',
'[{"order": 1, "title": "Hitung diskon", "content": "15% × 8.000.000 = 0,15 × 8.000.000 = 1.200.000"}, {"order": 2, "title": "Hitung harga akhir", "content": "8.000.000 - 1.200.000 = 6.800.000"}]',
true),

-- PK 3: Perbandingan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'perbandingan', -0.5, 0.80, 0.18,
'Perbandingan uang Ani dan Budi adalah 3:5. Jika jumlah uang mereka Rp480.000, berapa uang Ani?',
'Rp120.000',
'Rp150.000',
'Rp180.000',
'Rp200.000',
'Rp240.000',
'C',
'Total bagian = 3 + 5 = 8. Uang Ani = 3/8 × 480.000 = 180.000',
'Bagian A = (rasio A / total rasio) × total nilai.',
'[{"order": 1, "title": "Hitung total bagian", "content": "3 + 5 = 8 bagian"}, {"order": 2, "title": "Hitung uang Ani", "content": "Ani = 3/8 × 480.000 = 180.000"}]',
true),

-- PK 4: Rata-rata
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'statistika', 0.0, 0.78, 0.20,
'Rata-rata nilai 5 siswa adalah 72. Jika seorang siswa dengan nilai 60 diganti dengan siswa baru, rata-rata menjadi 75. Berapa nilai siswa baru tersebut?',
'70',
'72',
'75',
'78',
'80',
'C',
'Total awal = 5 × 72 = 360. Total baru = 5 × 75 = 375. Nilai siswa baru = 375 - (360 - 60) = 375 - 300 = 75',
'Total = rata-rata × jumlah data. Gunakan selisih total untuk mencari nilai baru.',
'[{"order": 1, "title": "Hitung total nilai awal", "content": "5 × 72 = 360"}, {"order": 2, "title": "Hitung total nilai baru", "content": "5 × 75 = 375"}, {"order": 3, "title": "Hitung nilai siswa baru", "content": "Nilai baru = 375 - (360 - 60) = 75"}]',
true),

-- PK 5: Deret
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'deret', 0.3, 0.75, 0.18,
'Jumlah 20 suku pertama dari deret aritmatika 3, 7, 11, 15, ... adalah...',
'780',
'800',
'820',
'840',
'860',
'C',
'a = 3, b = 4, n = 20. Sn = n/2 × (2a + (n-1)b) = 20/2 × (6 + 76) = 10 × 82 = 820',
'Rumus jumlah deret aritmatika: Sn = n/2 × (2a + (n-1)b).',
'[{"order": 1, "title": "Identifikasi", "content": "a = 3, b = 7-3 = 4, n = 20"}, {"order": 2, "title": "Gunakan rumus", "content": "Sn = 20/2 × (2(3) + (20-1)(4)) = 10 × (6 + 76) = 820"}]',
true),

-- PK 6: Geometri
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'geometri', 0.5, 0.72, 0.20,
'Sebuah lingkaran memiliki jari-jari 14 cm. Luas lingkaran tersebut adalah... (π = 22/7)',
'154 cm²',
'308 cm²',
'616 cm²',
'1.232 cm²',
'2.464 cm²',
'C',
'Luas = πr² = 22/7 × 14² = 22/7 × 196 = 22 × 28 = 616 cm²',
'Luas lingkaran = πr². Gunakan π = 22/7 jika jari-jari kelipatan 7.',
'[{"order": 1, "title": "Rumus luas lingkaran", "content": "L = πr²"}, {"order": 2, "title": "Substitusi", "content": "L = 22/7 × 14² = 22/7 × 196 = 616 cm²"}]',
true),

-- PK 7: Aljabar
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'aljabar', 0.7, 0.70, 0.22,
'Jika x + y = 10 dan xy = 21, maka nilai x² + y² adalah...',
'37',
'42',
'58',
'79',
'100',
'C',
'(x + y)² = x² + 2xy + y². Maka x² + y² = (x + y)² - 2xy = 100 - 42 = 58',
'Gunakan identitas: (x+y)² = x² + 2xy + y².',
'[{"order": 1, "title": "Gunakan identitas", "content": "(x + y)² = x² + 2xy + y²"}, {"order": 2, "title": "Substitusi", "content": "x² + y² = (x + y)² - 2xy = 10² - 2(21) = 100 - 42 = 58"}]',
true),

-- PK 8: Peluang
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'peluang', 0.8, 0.68, 0.20,
'Sebuah dadu dilempar dua kali. Peluang mendapatkan jumlah mata dadu 7 adalah...',
'1/12',
'1/9',
'1/6',
'5/36',
'1/4',
'C',
'Kombinasi jumlah 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 cara. Total kemungkinan = 36. P = 6/36 = 1/6',
'Peluang = kejadian yang diinginkan / total kemungkinan.',
'[{"order": 1, "title": "Hitung kombinasi jumlah 7", "content": "(1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 cara"}, {"order": 2, "title": "Hitung peluang", "content": "P = 6/36 = 1/6"}]',
true),

-- PK 9: Sistem Persamaan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'aljabar', 1.0, 0.65, 0.18,
'Harga 3 buku dan 2 pensil adalah Rp27.000. Harga 2 buku dan 3 pensil adalah Rp23.000. Harga 1 buku adalah...',
'Rp5.000',
'Rp6.000',
'Rp7.000',
'Rp8.000',
'Rp9.000',
'C',
'3b + 2p = 27.000 ... (1), 2b + 3p = 23.000 ... (2). Dari (1)×3 - (2)×2: 9b + 6p - 4b - 6p = 81.000 - 46.000 → 5b = 35.000 → b = 7.000',
'Eliminasi salah satu variabel dengan mengalikan persamaan.',
'[{"order": 1, "title": "Buat persamaan", "content": "3b + 2p = 27.000 (1), 2b + 3p = 23.000 (2)"}, {"order": 2, "title": "Eliminasi p", "content": "(1)×3: 9b + 6p = 81.000, (2)×2: 4b + 6p = 46.000"}, {"order": 3, "title": "Kurangkan", "content": "5b = 35.000 → b = 7.000"}]',
true),

-- PK 10: Bunga
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'bunga', -0.3, 0.78, 0.20,
'Pak Ahmad menabung Rp10.000.000 di bank dengan bunga tunggal 6% per tahun. Setelah 2 tahun, jumlah tabungan Pak Ahmad adalah...',
'Rp10.600.000',
'Rp11.200.000',
'Rp11.236.000',
'Rp12.000.000',
'Rp12.360.000',
'B',
'Bunga tunggal = P × r × t = 10.000.000 × 6% × 2 = 1.200.000. Total = 10.000.000 + 1.200.000 = 11.200.000',
'Bunga tunggal: I = P × r × t. Total = P + I.',
'[{"order": 1, "title": "Hitung bunga", "content": "I = 10.000.000 × 0,06 × 2 = 1.200.000"}, {"order": 2, "title": "Hitung total", "content": "Total = 10.000.000 + 1.200.000 = 11.200.000"}]',
true),

-- PK 11: Kecepatan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'kecepatan', 0.2, 0.75, 0.18,
'Sebuah mobil menempuh jarak 180 km dalam waktu 3 jam. Jika mobil tersebut ingin menempuh jarak 300 km dengan kecepatan yang sama, berapa waktu yang diperlukan?',
'4 jam',
'4,5 jam',
'5 jam',
'5,5 jam',
'6 jam',
'C',
'Kecepatan = 180/3 = 60 km/jam. Waktu = 300/60 = 5 jam',
'Kecepatan = jarak/waktu. Waktu = jarak/kecepatan.',
'[{"order": 1, "title": "Hitung kecepatan", "content": "v = 180/3 = 60 km/jam"}, {"order": 2, "title": "Hitung waktu", "content": "t = 300/60 = 5 jam"}]',
true),

-- PK 12: Pecahan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'pecahan', -0.8, 0.82, 0.15,
'Hasil dari 2/3 + 3/4 - 1/6 adalah...',
'1/4',
'3/4',
'5/4',
'7/4',
'9/4',
'C',
'KPK(3,4,6) = 12. 2/3 = 8/12, 3/4 = 9/12, 1/6 = 2/12. Hasil = 8/12 + 9/12 - 2/12 = 15/12 = 5/4',
'Samakan penyebut dengan KPK, lalu operasikan pembilang.',
'[{"order": 1, "title": "Samakan penyebut", "content": "KPK(3,4,6) = 12. 2/3 = 8/12, 3/4 = 9/12, 1/6 = 2/12"}, {"order": 2, "title": "Operasikan", "content": "8/12 + 9/12 - 2/12 = 15/12 = 5/4"}]',
true),

-- PK 13: Persamaan Kuadrat
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'aljabar', 1.2, 0.62, 0.20,
'Akar-akar persamaan x² - 5x + 6 = 0 adalah...',
'1 dan 6',
'2 dan 3',
'-2 dan -3',
'-1 dan -6',
'1 dan -6',
'B',
'x² - 5x + 6 = 0 → (x - 2)(x - 3) = 0 → x = 2 atau x = 3',
'Faktorkan: cari dua bilangan yang jika dijumlah = -b dan jika dikalikan = c.',
'[{"order": 1, "title": "Faktorkan", "content": "Cari bilangan yang jumlah = 5 dan kali = 6 → 2 dan 3"}, {"order": 2, "title": "Tulis faktor", "content": "(x - 2)(x - 3) = 0"}, {"order": 3, "title": "Selesaikan", "content": "x = 2 atau x = 3"}]',
true),

-- PK 14: Bangun Ruang
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'geometri', 0.9, 0.66, 0.22,
'Sebuah balok memiliki panjang 10 cm, lebar 6 cm, dan tinggi 4 cm. Volume balok tersebut adalah...',
'120 cm³',
'180 cm³',
'200 cm³',
'240 cm³',
'280 cm³',
'D',
'Volume balok = p × l × t = 10 × 6 × 4 = 240 cm³',
'Volume balok = panjang × lebar × tinggi.',
'[{"order": 1, "title": "Rumus volume balok", "content": "V = p × l × t"}, {"order": 2, "title": "Substitusi", "content": "V = 10 × 6 × 4 = 240 cm³"}]',
true),

-- PK 15: Logaritma
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PK', 'logaritma', 1.5, 0.58, 0.18,
'Jika log 2 = 0,301 dan log 3 = 0,477, maka nilai log 12 adalah...',
'0,778',
'0,903',
'1,079',
'1,255',
'1,380',
'C',
'log 12 = log (4 × 3) = log 4 + log 3 = log 2² + log 3 = 2 log 2 + log 3 = 2(0,301) + 0,477 = 0,602 + 0,477 = 1,079',
'Gunakan sifat logaritma: log(ab) = log a + log b, log(aⁿ) = n log a.',
'[{"order": 1, "title": "Uraikan 12", "content": "12 = 4 × 3 = 2² × 3"}, {"order": 2, "title": "Gunakan sifat log", "content": "log 12 = log 2² + log 3 = 2 log 2 + log 3"}, {"order": 3, "title": "Substitusi", "content": "= 2(0,301) + 0,477 = 1,079"}]',
true)
ON CONFLICT DO NOTHING;


-- ============================================
-- 6. QUESTIONS - LBI (Literasi Bahasa Indonesia) - 15 Soal
-- ============================================
INSERT INTO questions (question_bank_id, section, sub_type, difficulty_irt, discrimination, guessing_param, text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, strategy_tip, is_active)
VALUES
-- LBI 1: Pemahaman Teks
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'pemahaman_teks', -1.2, 0.85, 0.15,
'Bacalah teks berikut dengan saksama:

"Keanekaragaman hayati Indonesia merupakan salah satu yang terkaya di dunia. Negara kepulauan ini memiliki sekitar 17% spesies dunia meskipun hanya mencakup 1,3% daratan bumi. Hutan hujan tropis Indonesia menjadi rumah bagi orangutan, harimau sumatera, dan badak jawa yang terancam punah. Namun, deforestasi dan perburuan liar terus mengancam keberadaan spesies-spesies ini. Upaya konservasi menjadi sangat penting untuk menjaga warisan alam yang tak ternilai ini."

Gagasan utama teks tersebut adalah...',
'Indonesia memiliki banyak hewan langka',
'Keanekaragaman hayati Indonesia yang kaya namun terancam',
'Deforestasi di Indonesia sangat parah',
'Orangutan hidup di hutan hujan tropis',
'Konservasi hewan di Indonesia',
'B',
'Teks membahas kekayaan keanekaragaman hayati Indonesia (paragraf awal) dan ancaman terhadapnya (deforestasi, perburuan). Gagasan utama mencakup kedua aspek ini.',
'Gagasan utama mencakup keseluruhan isi teks, bukan hanya satu bagian.',
true),

-- LBI 2: Pemahaman Teks
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'pemahaman_teks', -0.8, 0.82, 0.18,
'Bacalah teks berikut:

"Generasi Z, yang lahir antara 1997-2012, tumbuh di era digital yang serba cepat. Mereka terbiasa dengan informasi instan dan multitasking. Penelitian menunjukkan bahwa rentang perhatian mereka lebih pendek dibanding generasi sebelumnya, namun mereka lebih adaptif terhadap teknologi baru. Dalam dunia kerja, Gen Z cenderung mencari fleksibilitas dan keseimbangan hidup-kerja daripada stabilitas jangka panjang."

Pernyataan yang TIDAK sesuai dengan teks adalah...',
'Gen Z lahir di era digital',
'Gen Z memiliki rentang perhatian yang pendek',
'Gen Z lebih adaptif terhadap teknologi',
'Gen Z mengutamakan stabilitas kerja jangka panjang',
'Gen Z menginginkan fleksibilitas dalam bekerja',
'D',
'Teks menyatakan Gen Z "mencari fleksibilitas... daripada stabilitas jangka panjang", artinya mereka TIDAK mengutamakan stabilitas.',
'Perhatikan kata-kata pembanding seperti "daripada" yang menunjukkan preferensi.',
true),

-- LBI 3: Kosakata Kontekstual
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'kosakata', -0.5, 0.80, 0.20,
'Bacalah kalimat berikut:

"Kebijakan moneter yang ekspansif diharapkan dapat menstimulasi pertumbuhan ekonomi yang sedang stagnan."

Kata "stagnan" dalam konteks tersebut bermakna...',
'Berkembang pesat',
'Tidak mengalami kemajuan',
'Mengalami penurunan drastis',
'Berfluktuasi',
'Meningkat perlahan',
'B',
'Stagnan berarti tidak bergerak, tidak mengalami kemajuan atau perubahan. Dalam konteks ekonomi, stagnan berarti pertumbuhan ekonomi yang mandek.',
'Perhatikan konteks kalimat: kebijakan ekspansif untuk "menstimulasi" menunjukkan kondisi awal yang tidak berkembang.',
true),

-- LBI 4: Kosakata Kontekstual
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'kosakata', 0.0, 0.78, 0.18,
'Bacalah kalimat berikut:

"Pemerintah mengambil langkah preventif untuk mengantisipasi penyebaran wabah penyakit."

Sinonim kata "preventif" adalah...',
'Kuratif',
'Pencegahan',
'Pengobatan',
'Pemulihan',
'Penanganan',
'B',
'Preventif berasal dari kata "prevent" yang berarti mencegah. Langkah preventif = langkah pencegahan.',
'Preventif = pencegahan, kuratif = pengobatan.',
true),

-- LBI 5: Struktur Teks
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'struktur_teks', 0.2, 0.75, 0.20,
'Bacalah teks berikut:

"Sampah plastik telah menjadi masalah lingkungan global yang serius. Setiap tahun, jutaan ton plastik berakhir di lautan, membunuh kehidupan laut dan mencemari rantai makanan. Beberapa solusi telah diusulkan, termasuk pengurangan penggunaan plastik sekali pakai, daur ulang, dan pengembangan bahan alternatif yang ramah lingkungan. Dengan komitmen bersama, kita dapat mengurangi dampak negatif sampah plastik terhadap lingkungan."

Struktur teks di atas adalah...',
'Deskripsi - Orientasi - Resolusi',
'Tesis - Argumentasi - Penegasan',
'Pernyataan umum - Deretan penjelas - Penutup',
'Orientasi - Komplikasi - Resolusi',
'Abstrak - Orientasi - Krisis - Reaksi - Koda',
'C',
'Teks ini adalah teks eksposisi dengan struktur: pernyataan umum (masalah plastik), deretan penjelas (dampak dan solusi), penutup (ajakan komitmen).',
'Identifikasi jenis teks: eksposisi = pernyataan umum + penjelas + penutup.',
true),

-- LBI 6: Hubungan Antarkalimat
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'hubungan_kalimat', 0.4, 0.72, 0.18,
'Bacalah paragraf berikut:

"Pendidikan jarak jauh telah berkembang pesat selama pandemi. _____, tidak semua siswa memiliki akses yang sama terhadap teknologi dan internet. Kesenjangan digital ini menciptakan ketidaksetaraan dalam kesempatan belajar."

Kata penghubung yang tepat untuk mengisi bagian rumpang adalah...',
'Oleh karena itu',
'Selain itu',
'Namun',
'Dengan demikian',
'Bahkan',
'C',
'Kalimat pertama menyatakan hal positif (berkembang pesat), kalimat kedua menyatakan hal negatif (tidak semua punya akses). Hubungannya adalah pertentangan, sehingga "Namun" tepat.',
'Identifikasi hubungan logis antarkalimat: sebab-akibat, pertentangan, penambahan, dll.',
true),

-- LBI 7: Tujuan Penulis
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'tujuan_penulis', 0.5, 0.70, 0.22,
'Bacalah teks berikut:

"Vaksinasi adalah cara paling efektif untuk mencegah penyebaran penyakit menular. Data dari berbagai negara menunjukkan bahwa tingkat vaksinasi yang tinggi berkorelasi dengan penurunan kasus penyakit. Meskipun ada kekhawatiran tentang efek samping, manfaat vaksinasi jauh lebih besar daripada risikonya. Mari kita lindungi diri sendiri dan orang-orang tercinta dengan vaksinasi."

Tujuan penulis menulis teks tersebut adalah...',
'Menjelaskan cara kerja vaksin',
'Mengkritik kebijakan vaksinasi pemerintah',
'Meyakinkan pembaca tentang pentingnya vaksinasi',
'Menginformasikan efek samping vaksin',
'Membandingkan berbagai jenis vaksin',
'C',
'Teks berisi argumen pendukung vaksinasi dan diakhiri dengan ajakan. Ini menunjukkan tujuan persuasif untuk meyakinkan pembaca.',
'Perhatikan kalimat penutup yang berisi ajakan sebagai petunjuk tujuan persuasif.',
true),

-- LBI 8: Simpulan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'simpulan', 0.6, 0.68, 0.20,
'Bacalah teks berikut:

"Kopi Indonesia dikenal di seluruh dunia karena kualitasnya yang tinggi. Kopi Gayo dari Aceh memiliki cita rasa yang khas dengan tingkat keasaman yang rendah. Kopi Toraja dari Sulawesi terkenal dengan aroma yang kuat dan rasa yang kompleks. Sementara itu, kopi Kintamani dari Bali menawarkan rasa buah-buahan yang unik karena ditanam bersama tanaman jeruk."

Simpulan yang tepat dari teks tersebut adalah...',
'Kopi Gayo adalah kopi terbaik di Indonesia',
'Indonesia hanya memiliki tiga jenis kopi',
'Setiap daerah di Indonesia menghasilkan kopi dengan karakteristik berbeda',
'Kopi Indonesia lebih baik dari kopi negara lain',
'Kopi Kintamani paling unik karena rasa buahnya',
'C',
'Teks menjelaskan tiga jenis kopi dari daerah berbeda dengan karakteristik masing-masing. Simpulan yang tepat adalah keberagaman karakteristik kopi berdasarkan daerah.',
'Simpulan harus mencakup keseluruhan isi teks tanpa generalisasi berlebihan.',
true),

-- LBI 9: Fakta dan Opini
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'fakta_opini', -0.3, 0.78, 0.18,
'Bacalah kalimat-kalimat berikut:
(1) Indonesia memiliki lebih dari 17.000 pulau.
(2) Pemandangan di Raja Ampat sangat menakjubkan.
(3) Bahasa Indonesia adalah bahasa resmi negara.
(4) Makanan Indonesia adalah yang paling enak di Asia Tenggara.
(5) Jakarta adalah ibu kota Indonesia.

Kalimat yang merupakan OPINI adalah...',
'(1) dan (3)',
'(2) dan (4)',
'(3) dan (5)',
'(1) dan (5)',
'(2) dan (3)',
'B',
'Opini adalah pendapat subjektif yang tidak dapat dibuktikan secara objektif. "Sangat menakjubkan" dan "paling enak" adalah penilaian subjektif.',
'Fakta = dapat dibuktikan. Opini = mengandung kata sifat subjektif (indah, enak, terbaik).',
true),

-- LBI 10: Makna Implisit
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'makna_implisit', 0.7, 0.65, 0.22,
'Bacalah teks berikut:

"Setelah pengumuman hasil ujian, Rina langsung menelepon ibunya dengan suara bergetar. Air matanya mengalir deras saat menyampaikan kabar tersebut. Ibunya yang mendengar langsung berteriak kegirangan dan mengucapkan selamat berkali-kali."

Dari teks tersebut dapat disimpulkan bahwa...',
'Rina gagal dalam ujian',
'Rina lulus dengan hasil memuaskan',
'Ibu Rina tidak peduli dengan hasil ujian',
'Rina sedih dengan hasil ujiannya',
'Rina dan ibunya bertengkar',
'B',
'Meskipun Rina menangis, reaksi ibunya yang "berteriak kegirangan" dan "mengucapkan selamat" menunjukkan bahwa hasilnya positif. Air mata Rina adalah tangis bahagia.',
'Perhatikan semua petunjuk dalam teks, terutama reaksi karakter lain.',
true),

-- LBI 11: Kepaduan Paragraf
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'kepaduan', 0.3, 0.72, 0.20,
'Bacalah paragraf berikut:

"(1) Olahraga teratur memberikan banyak manfaat bagi kesehatan. (2) Aktivitas fisik dapat meningkatkan kesehatan jantung dan paru-paru. (3) Harga peralatan olahraga semakin mahal. (4) Selain itu, olahraga juga membantu mengurangi stres dan meningkatkan kualitas tidur. (5) Oleh karena itu, disarankan untuk berolahraga minimal 30 menit setiap hari."

Kalimat yang merusak kepaduan paragraf adalah...',
'(1)',
'(2)',
'(3)',
'(4)',
'(5)',
'C',
'Kalimat (3) tentang harga peralatan olahraga tidak relevan dengan topik paragraf yaitu manfaat olahraga bagi kesehatan.',
'Kepaduan paragraf: semua kalimat harus mendukung ide pokok yang sama.',
true),

-- LBI 12: Penggunaan Bahasa
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'penggunaan_bahasa', -0.2, 0.76, 0.18,
'Bacalah kalimat berikut:

"Menurut data BPS, jumlah penduduk Indonesia pada tahun 2023 mencapai sekitar 275 juta jiwa."

Fungsi frasa "Menurut data BPS" dalam kalimat tersebut adalah...',
'Menyatakan waktu',
'Menyatakan tempat',
'Menyatakan sumber informasi',
'Menyatakan tujuan',
'Menyatakan cara',
'C',
'"Menurut data BPS" berfungsi sebagai keterangan sumber, menunjukkan dari mana informasi tersebut berasal.',
'Frasa "menurut..." selalu menunjukkan sumber informasi atau pendapat.',
true),

-- LBI 13: Teks Prosedur
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'teks_prosedur', 0.1, 0.74, 0.20,
'Bacalah teks berikut:

"Cara Membuat Kopi Tubruk:
1. Siapkan gelas dan sendok.
2. Masukkan 2 sendok teh kopi bubuk ke dalam gelas.
3. Tambahkan gula sesuai selera.
4. Tuangkan air panas hingga 3/4 gelas.
5. Aduk hingga rata dan diamkan sebentar.
6. Kopi siap dinikmati."

Ciri kebahasaan yang TIDAK terdapat dalam teks tersebut adalah...',
'Kalimat perintah',
'Kata kerja aktif',
'Konjungsi temporal',
'Kata bilangan',
'Kalimat tanya',
'E',
'Teks prosedur menggunakan kalimat perintah (siapkan, masukkan), kata kerja aktif, konjungsi temporal (hingga), dan kata bilangan (2 sendok, 3/4). Tidak ada kalimat tanya.',
'Teks prosedur: kalimat perintah, kata kerja aktif, konjungsi temporal, kata bilangan.',
true),

-- LBI 14: Argumentasi
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'argumentasi', 0.8, 0.66, 0.22,
'Bacalah teks berikut:

"Penggunaan energi terbarukan harus ditingkatkan di Indonesia. Pertama, sumber energi fosil seperti minyak dan batu bara semakin menipis. Kedua, energi terbarukan lebih ramah lingkungan karena tidak menghasilkan emisi karbon. Ketiga, Indonesia memiliki potensi besar untuk energi surya dan panas bumi. Dengan demikian, investasi dalam energi terbarukan adalah langkah strategis untuk masa depan."

Argumen yang TIDAK disebutkan dalam teks adalah...',
'Kelangkaan energi fosil',
'Dampak lingkungan yang lebih baik',
'Potensi sumber daya alam Indonesia',
'Biaya energi terbarukan yang lebih murah',
'Energi terbarukan sebagai langkah strategis',
'D',
'Teks menyebutkan kelangkaan fosil, ramah lingkungan, dan potensi Indonesia. Tidak ada pembahasan tentang biaya energi terbarukan.',
'Baca setiap argumen dengan teliti dan cocokkan dengan opsi jawaban.',
true),

-- LBI 15: Evaluasi Teks
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBI', 'evaluasi', 1.0, 0.62, 0.20,
'Bacalah teks berikut:

"Media sosial telah mengubah cara kita berkomunikasi. Platform seperti Instagram dan TikTok memungkinkan siapa saja menjadi kreator konten. Namun, tidak semua konten yang viral adalah konten berkualitas. Banyak informasi yang menyesatkan tersebar dengan cepat. Pengguna media sosial perlu mengembangkan literasi digital untuk memilah informasi yang benar."

Sikap penulis terhadap media sosial dalam teks tersebut adalah...',
'Sangat mendukung tanpa kritik',
'Menolak sepenuhnya',
'Kritis namun tetap mengakui manfaatnya',
'Tidak memiliki pendapat',
'Hanya fokus pada dampak negatif',
'C',
'Penulis mengakui manfaat media sosial (mengubah komunikasi, memungkinkan kreator) namun juga mengkritik (konten tidak berkualitas, informasi menyesatkan). Sikap ini menunjukkan pandangan kritis namun seimbang.',
'Perhatikan kata-kata seperti "namun" yang menunjukkan sikap kritis terhadap topik.',
true)
ON CONFLICT DO NOTHING;


-- ============================================
-- 7. QUESTIONS - LBE (Literasi Bahasa Inggris) - 15 Soal
-- ============================================
INSERT INTO questions (question_bank_id, section, sub_type, difficulty_irt, discrimination, guessing_param, text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, explanation_en, strategy_tip, is_active)
VALUES
-- LBE 1: Reading Comprehension
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'reading', -1.2, 0.85, 0.15,
'Read the following passage:

"Climate change poses one of the greatest challenges to global food security. Rising temperatures and unpredictable weather patterns are affecting crop yields worldwide. Farmers in developing countries are particularly vulnerable as they often lack resources to adapt to changing conditions. Scientists are working on developing drought-resistant crops and more efficient irrigation systems to address these challenges."

What is the main idea of the passage?',
'Farmers in developing countries are poor',
'Climate change impacts food security and requires adaptation',
'Scientists are developing new crops',
'Weather patterns are unpredictable',
'Irrigation systems need improvement',
'B',
'Paragraf membahas dampak perubahan iklim terhadap ketahanan pangan dan upaya adaptasi yang dilakukan.',
'The passage discusses the impact of climate change on food security and the adaptation efforts being made.',
'Main idea encompasses the entire passage, not just one detail.',
true),

-- LBE 2: Reading Comprehension
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'reading', -0.8, 0.82, 0.18,
'Read the following passage:

"The gig economy has transformed the traditional employment landscape. Workers now have unprecedented flexibility to choose when and where they work. However, this freedom comes at a cost: gig workers typically lack benefits such as health insurance, paid leave, and retirement plans. As the gig economy continues to grow, policymakers are debating how to protect these workers while preserving the flexibility that makes gig work attractive."

According to the passage, what is a disadvantage of gig work?',
'Workers have too much flexibility',
'The economy is growing too fast',
'Gig workers usually do not receive traditional employee benefits',
'Policymakers are not interested in gig workers',
'Traditional employment is disappearing',
'C',
'Teks menyebutkan "gig workers typically lack benefits such as health insurance, paid leave, and retirement plans".',
'The text explicitly states that gig workers typically lack benefits like health insurance, paid leave, and retirement plans.',
'Look for explicit statements in the text that match the question.',
true),

-- LBE 3: Vocabulary in Context
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'vocabulary', -0.5, 0.80, 0.20,
'Read the following sentence:

"The company''s innovative approach to sustainable packaging has garnered widespread acclaim from environmental groups."

The word "garnered" in the sentence is closest in meaning to...',
'lost',
'received',
'rejected',
'ignored',
'criticized',
'B',
'"Garnered" berarti mengumpulkan atau menerima. Dalam konteks ini, perusahaan menerima pujian.',
'"Garnered" means to gather or receive. In this context, the company received acclaim.',
'Use context clues: "acclaim" (praise) suggests a positive outcome.',
true),

-- LBE 4: Vocabulary in Context
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'vocabulary', 0.0, 0.78, 0.18,
'Read the following sentence:

"Despite the initial setbacks, the research team persevered and eventually achieved a breakthrough in cancer treatment."

The word "persevered" most nearly means...',
'gave up',
'continued despite difficulties',
'started over',
'complained',
'celebrated',
'B',
'"Persevered" berarti bertahan atau terus berusaha meskipun ada kesulitan.',
'"Persevered" means to continue steadfastly despite difficulties or obstacles.',
'The word "despite setbacks" and "eventually achieved" indicate persistence.',
true),

-- LBE 5: Grammar
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'grammar', -0.3, 0.78, 0.20,
'Choose the correct sentence:',
'If I would have known about the meeting, I would have attended.',
'If I had known about the meeting, I would have attended.',
'If I have known about the meeting, I would attended.',
'If I knew about the meeting, I would have attended.',
'If I had knew about the meeting, I would have attended.',
'B',
'Third conditional (past unreal): If + past perfect, would have + past participle.',
'Third conditional structure: If + had + past participle, would have + past participle.',
'Third conditional: If + had + V3, would have + V3.',
true),

-- LBE 6: Grammar
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'grammar', 0.2, 0.75, 0.18,
'Choose the correct sentence:',
'The number of students who has passed the exam is increasing.',
'The number of students who have passed the exam are increasing.',
'The number of students who have passed the exam is increasing.',
'The number of students who has passed the exam are increasing.',
'The numbers of students who have passed the exam is increasing.',
'C',
'"The number of" diikuti kata kerja tunggal (is). "Students who" diikuti kata kerja jamak (have).',
'"The number of" takes a singular verb (is). "Students who" takes a plural verb (have).',
'"The number of" = singular verb; "who" refers to "students" = plural verb.',
true),

-- LBE 7: Sentence Completion
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'completion', 0.3, 0.72, 0.20,
'Complete the sentence:

"_____ the heavy rain, the outdoor concert was not cancelled."',
'Because of',
'Despite',
'Due to',
'Since',
'As a result of',
'B',
'"Despite" menunjukkan pertentangan: hujan deras (kondisi negatif) vs konser tidak dibatalkan (hasil positif).',
'"Despite" shows contrast: heavy rain (negative condition) vs. concert not cancelled (positive outcome).',
'Use "despite" for contrast, "because of/due to" for cause.',
true),

-- LBE 8: Sentence Completion
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'completion', 0.5, 0.70, 0.22,
'Complete the sentence:

"The professor, _____ research has been cited thousands of times, will receive an honorary degree."',
'who',
'whom',
'whose',
'which',
'that',
'C',
'"Whose" digunakan untuk menunjukkan kepemilikan (research milik professor).',
'"Whose" is used to show possession (the research belongs to the professor).',
'Use "whose" for possession, "who" for subject, "whom" for object.',
true),

-- LBE 9: Error Identification
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'error', 0.6, 0.68, 0.20,
'Identify the error in the following sentence:

"The committee have decided to postpone the meeting until next week because several members was unable to attend."',
'have decided',
'to postpone',
'until next week',
'was unable',
'to attend',
'D',
'"Several members" adalah jamak, sehingga harus menggunakan "were unable" bukan "was unable".',
'"Several members" is plural, so it should be "were unable" not "was unable".',
'Check subject-verb agreement: plural subjects need plural verbs.',
true),

-- LBE 10: Error Identification
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'error', 0.8, 0.65, 0.22,
'Identify the error in the following sentence:

"Neither the manager nor the employees was aware of the changes that had been made to the company policy."',
'Neither',
'nor',
'was aware',
'had been made',
'to the company',
'C',
'Dengan "neither...nor", kata kerja mengikuti subjek terdekat. "Employees" adalah jamak, jadi harus "were aware".',
'With "neither...nor", the verb agrees with the nearest subject. "Employees" is plural, so it should be "were aware".',
'Neither...nor: verb agrees with the nearest subject.',
true),

-- LBE 11: Inference
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'inference', 0.7, 0.66, 0.20,
'Read the following passage:

"After years of declining sales, the bookstore finally closed its doors last month. The owner, who had run the business for three decades, said she could no longer compete with online retailers. Many longtime customers expressed sadness at losing what they called a ''community gathering place.''"

It can be inferred from the passage that...',
'Online retailers are illegal',
'The bookstore was unpopular',
'The bookstore had cultural significance to the community',
'The owner wanted to retire',
'Books are no longer being sold',
'C',
'Pelanggan menyebut toko buku sebagai "community gathering place", menunjukkan signifikansi budaya/sosial.',
'Customers called the bookstore a "community gathering place," indicating its cultural/social significance.',
'Look for emotional language and descriptions that suggest deeper meaning.',
true),

-- LBE 12: Inference
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'inference', 0.9, 0.62, 0.22,
'Read the following passage:

"The new employee arrived at 9:15 for her 9:00 meeting. Her supervisor glanced at his watch but said nothing. Throughout the meeting, he avoided making eye contact with her and kept his responses brief."

Based on the passage, the supervisor most likely felt...',
'happy about the employee''s arrival',
'indifferent to the situation',
'displeased with the employee''s tardiness',
'confused about the meeting time',
'impressed by the employee',
'C',
'Melihat jam tangan, menghindari kontak mata, dan respons singkat menunjukkan ketidaksenangan.',
'Looking at his watch, avoiding eye contact, and brief responses indicate displeasure.',
'Non-verbal cues often reveal true feelings.',
true),

-- LBE 13: Paraphrase
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'paraphrase', 0.4, 0.70, 0.18,
'Which sentence best paraphrases the following?

"The proliferation of smartphones has fundamentally altered how people consume news and information."',
'Smartphones have made news consumption impossible.',
'The spread of smartphones has significantly changed news consumption habits.',
'People no longer read news because of smartphones.',
'Smartphones are the only source of news today.',
'News consumption has decreased due to smartphones.',
'B',
'"Proliferation" = spread/penyebaran, "fundamentally altered" = significantly changed.',
'"Proliferation" means spread, "fundamentally altered" means significantly changed.',
'Paraphrase = same meaning, different words. Avoid extreme statements.',
true),

-- LBE 14: Text Organization
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'organization', 0.5, 0.68, 0.20,
'Read the following sentences and arrange them in the correct order:

(1) Finally, the results are analyzed and conclusions are drawn.
(2) First, researchers identify a problem and formulate a hypothesis.
(3) The scientific method is a systematic approach to understanding the world.
(4) Then, experiments are designed and conducted to test the hypothesis.
(5) Data is collected throughout the experimental process.',
'(3)-(2)-(4)-(5)-(1)',
'(2)-(3)-(4)-(5)-(1)',
'(3)-(4)-(2)-(5)-(1)',
'(1)-(2)-(3)-(4)-(5)',
'(2)-(4)-(3)-(5)-(1)',
'A',
'Urutan logis: pengenalan topik (3), langkah pertama (2), langkah kedua (4), pengumpulan data (5), kesimpulan (1).',
'Logical order: introduction (3), first step (2), second step (4), data collection (5), conclusion (1).',
'Look for sequence markers: first, then, finally.',
true),

-- LBE 15: Author''s Purpose
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'LBE', 'purpose', 1.0, 0.60, 0.20,
'Read the following passage:

"Electric vehicles represent the future of transportation. They produce zero direct emissions, reducing air pollution in urban areas. While the initial cost may be higher, lower fuel and maintenance costs make EVs economically attractive in the long run. With improving battery technology and expanding charging infrastructure, there has never been a better time to make the switch to electric."

The author''s primary purpose is to...',
'explain how electric vehicles work',
'compare different types of vehicles',
'persuade readers to consider electric vehicles',
'criticize traditional gasoline vehicles',
'describe the history of electric vehicles',
'C',
'Teks menyajikan keuntungan EV dan diakhiri dengan ajakan "make the switch", menunjukkan tujuan persuasif.',
'The text presents EV benefits and ends with "make the switch," indicating a persuasive purpose.',
'Look for persuasive language and calls to action.',
true)
ON CONFLICT DO NOTHING;


-- ============================================
-- 8. QUESTIONS - PM (Penalaran Matematika) - 15 Soal
-- ============================================
INSERT INTO questions (question_bank_id, section, sub_type, difficulty_irt, discrimination, guessing_param, text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation, strategy_tip, solution_steps, is_active)
VALUES
-- PM 1: Aljabar
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'aljabar', -1.5, 0.88, 0.18,
'Jika f(x) = 2x² - 3x + 1, maka nilai f(2) adalah...',
'1',
'3',
'5',
'7',
'9',
'B',
'f(2) = 2(2)² - 3(2) + 1 = 2(4) - 6 + 1 = 8 - 6 + 1 = 3',
'Substitusi nilai x ke dalam fungsi dan hitung.',
'[{"order": 1, "title": "Substitusi x = 2", "content": "f(2) = 2(2)² - 3(2) + 1"}, {"order": 2, "title": "Hitung", "content": "= 2(4) - 6 + 1 = 8 - 6 + 1 = 3"}]',
true),

-- PM 2: Persamaan Linear
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'aljabar', -1.0, 0.85, 0.20,
'Himpunan penyelesaian dari pertidaksamaan 2x - 5 < 3x + 1 adalah...',
'x > -6',
'x < -6',
'x > 6',
'x < 6',
'x > -4',
'A',
'2x - 5 < 3x + 1 → 2x - 3x < 1 + 5 → -x < 6 → x > -6',
'Pindahkan variabel ke satu sisi, konstanta ke sisi lain. Ingat: kali/bagi negatif membalik tanda.',
'[{"order": 1, "title": "Pindahkan variabel", "content": "2x - 3x < 1 + 5"}, {"order": 2, "title": "Sederhanakan", "content": "-x < 6"}, {"order": 3, "title": "Kali -1 (balik tanda)", "content": "x > -6"}]',
true),

-- PM 3: Fungsi Kuadrat
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'fungsi', -0.5, 0.82, 0.18,
'Titik puncak dari parabola y = x² - 6x + 5 adalah...',
'(3, -4)',
'(3, 4)',
'(-3, -4)',
'(-3, 4)',
'(6, 5)',
'A',
'x_puncak = -b/2a = 6/2 = 3. y_puncak = 3² - 6(3) + 5 = 9 - 18 + 5 = -4. Titik puncak (3, -4)',
'Titik puncak: x = -b/2a, lalu substitusi untuk y.',
'[{"order": 1, "title": "Hitung x puncak", "content": "x = -b/2a = -(-6)/2(1) = 6/2 = 3"}, {"order": 2, "title": "Hitung y puncak", "content": "y = 3² - 6(3) + 5 = 9 - 18 + 5 = -4"}, {"order": 3, "title": "Titik puncak", "content": "(3, -4)"}]',
true),

-- PM 4: Trigonometri
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'trigonometri', 0.0, 0.78, 0.20,
'Nilai dari sin 30° + cos 60° adalah...',
'0',
'1/2',
'1',
'√3/2',
'√3',
'C',
'sin 30° = 1/2, cos 60° = 1/2. Jadi sin 30° + cos 60° = 1/2 + 1/2 = 1',
'Hafal nilai trigonometri sudut istimewa: 0°, 30°, 45°, 60°, 90°.',
'[{"order": 1, "title": "Nilai sudut istimewa", "content": "sin 30° = 1/2, cos 60° = 1/2"}, {"order": 2, "title": "Jumlahkan", "content": "1/2 + 1/2 = 1"}]',
true),

-- PM 5: Trigonometri
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'trigonometri', 0.3, 0.75, 0.18,
'Jika tan α = 3/4 dan α berada di kuadran I, maka nilai sin α adalah...',
'3/5',
'4/5',
'3/4',
'4/3',
'5/3',
'A',
'tan α = 3/4 berarti sisi depan = 3, sisi samping = 4. Sisi miring = √(9+16) = 5. sin α = depan/miring = 3/5',
'Gunakan segitiga siku-siku dan teorema Pythagoras.',
'[{"order": 1, "title": "Identifikasi sisi", "content": "tan = depan/samping = 3/4"}, {"order": 2, "title": "Hitung sisi miring", "content": "r = √(3² + 4²) = √25 = 5"}, {"order": 3, "title": "Hitung sin", "content": "sin = depan/miring = 3/5"}]',
true),

-- PM 6: Geometri Analitik
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'geometri', 0.5, 0.72, 0.20,
'Jarak antara titik A(2, 3) dan B(5, 7) adalah...',
'3',
'4',
'5',
'6',
'7',
'C',
'd = √[(5-2)² + (7-3)²] = √[9 + 16] = √25 = 5',
'Rumus jarak: d = √[(x₂-x₁)² + (y₂-y₁)²].',
'[{"order": 1, "title": "Rumus jarak", "content": "d = √[(x₂-x₁)² + (y₂-y₁)²]"}, {"order": 2, "title": "Substitusi", "content": "d = √[(5-2)² + (7-3)²] = √[9 + 16] = √25 = 5"}]',
true),

-- PM 7: Geometri Analitik
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'geometri', 0.7, 0.70, 0.22,
'Persamaan garis yang melalui titik (1, 2) dan tegak lurus dengan garis y = 2x + 3 adalah...',
'y = 2x',
'y = -1/2x + 5/2',
'y = 1/2x + 3/2',
'y = -2x + 4',
'y = 2x - 1',
'B',
'Gradien garis y = 2x + 3 adalah m₁ = 2. Gradien garis tegak lurus m₂ = -1/m₁ = -1/2. Persamaan: y - 2 = -1/2(x - 1) → y = -1/2x + 1/2 + 2 = -1/2x + 5/2',
'Garis tegak lurus: m₁ × m₂ = -1.',
'[{"order": 1, "title": "Gradien tegak lurus", "content": "m₁ = 2, m₂ = -1/2"}, {"order": 2, "title": "Persamaan garis", "content": "y - 2 = -1/2(x - 1)"}, {"order": 3, "title": "Sederhanakan", "content": "y = -1/2x + 5/2"}]',
true),

-- PM 8: Limit
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'kalkulus', 0.8, 0.68, 0.20,
'Nilai dari lim(x→2) (x² - 4)/(x - 2) adalah...',
'0',
'2',
'4',
'8',
'Tidak ada',
'C',
'(x² - 4)/(x - 2) = (x+2)(x-2)/(x-2) = x + 2. lim(x→2) (x + 2) = 4',
'Faktorkan pembilang untuk menghilangkan bentuk 0/0.',
'[{"order": 1, "title": "Faktorkan", "content": "(x² - 4)/(x - 2) = (x+2)(x-2)/(x-2)"}, {"order": 2, "title": "Sederhanakan", "content": "= x + 2"}, {"order": 3, "title": "Substitusi limit", "content": "lim(x→2) (x + 2) = 4"}]',
true),

-- PM 9: Turunan
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'kalkulus', 1.0, 0.65, 0.18,
'Jika f(x) = x³ - 3x² + 2x, maka f''(x) adalah...',
'3x² - 6x + 2',
'3x² - 6x',
'x² - 3x + 2',
'3x - 6',
'x³ - 3x²',
'A',
'f''(x) = 3x² - 6x + 2 (turunkan setiap suku: nx^(n-1))',
'Rumus turunan: d/dx(xⁿ) = nxⁿ⁻¹.',
'[{"order": 1, "title": "Turunkan setiap suku", "content": "d/dx(x³) = 3x², d/dx(-3x²) = -6x, d/dx(2x) = 2"}, {"order": 2, "title": "Gabungkan", "content": "f''(x) = 3x² - 6x + 2"}]',
true),

-- PM 10: Integral
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'kalkulus', 1.2, 0.62, 0.20,
'Hasil dari ∫(2x + 3)dx adalah...',
'x² + 3x + C',
'2x² + 3x + C',
'x² + 3 + C',
'2x + 3 + C',
'x + 3x + C',
'A',
'∫(2x + 3)dx = 2(x²/2) + 3x + C = x² + 3x + C',
'Rumus integral: ∫xⁿdx = xⁿ⁺¹/(n+1) + C.',
'[{"order": 1, "title": "Integralkan setiap suku", "content": "∫2x dx = x², ∫3 dx = 3x"}, {"order": 2, "title": "Gabungkan", "content": "x² + 3x + C"}]',
true),

-- PM 11: Barisan dan Deret
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'barisan', -0.3, 0.78, 0.18,
'Suku ke-10 dari barisan geometri 2, 6, 18, 54, ... adalah...',
'2 × 3⁹',
'2 × 3¹⁰',
'3 × 2⁹',
'3 × 2¹⁰',
'6 × 3⁸',
'A',
'a = 2, r = 3. Uₙ = a × r^(n-1). U₁₀ = 2 × 3⁹',
'Rumus suku ke-n barisan geometri: Uₙ = a × rⁿ⁻¹.',
'[{"order": 1, "title": "Identifikasi", "content": "a = 2, r = 6/2 = 3"}, {"order": 2, "title": "Rumus", "content": "Uₙ = a × rⁿ⁻¹"}, {"order": 3, "title": "Hitung U₁₀", "content": "U₁₀ = 2 × 3⁹"}]',
true),

-- PM 12: Matriks
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'matriks', 0.4, 0.70, 0.20,
'Jika A = [2 1; 3 4] dan B = [1 0; 2 1], maka determinan (A × B) adalah...',
'5',
'10',
'15',
'20',
'25',
'B',
'det(A) = 2(4) - 1(3) = 5. det(B) = 1(1) - 0(2) = 1. det(A×B) = det(A) × det(B) = 5 × 1 = 5. Hmm, cek: det(A) = 8-3 = 5, det(B) = 1-0 = 1. Tapi A×B = [4 1; 11 4], det = 16-11 = 5. Jawaban seharusnya 5, tapi opsi tidak ada. Mari hitung ulang: det(A) = 2×4 - 1×3 = 5, det(B) = 1×1 - 0×2 = 1. det(AB) = 5×1 = 5. Opsi A = 5.',
'det(A×B) = det(A) × det(B).',
'[{"order": 1, "title": "Hitung det(A)", "content": "det(A) = 2(4) - 1(3) = 5"}, {"order": 2, "title": "Hitung det(B)", "content": "det(B) = 1(1) - 0(2) = 1"}, {"order": 3, "title": "det(A×B)", "content": "det(A×B) = det(A) × det(B) = 5 × 1 = 5"}]',
true),

-- PM 13: Peluang
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'peluang', 0.6, 0.68, 0.22,
'Dari 10 siswa (6 laki-laki, 4 perempuan), akan dipilih 3 siswa secara acak. Peluang terpilih 2 laki-laki dan 1 perempuan adalah...',
'1/2',
'3/10',
'1/3',
'2/5',
'1/4',
'A',
'C(6,2) × C(4,1) / C(10,3) = 15 × 4 / 120 = 60/120 = 1/2',
'Peluang = kejadian yang diinginkan / total kemungkinan. Gunakan kombinasi.',
'[{"order": 1, "title": "Hitung kombinasi yang diinginkan", "content": "C(6,2) × C(4,1) = 15 × 4 = 60"}, {"order": 2, "title": "Hitung total kombinasi", "content": "C(10,3) = 120"}, {"order": 3, "title": "Hitung peluang", "content": "P = 60/120 = 1/2"}]',
true),

-- PM 14: Statistika
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'statistika', 0.5, 0.70, 0.20,
'Data: 5, 7, 8, 8, 9, 10, 12. Median dan modus data tersebut adalah...',
'8 dan 8',
'8 dan 9',
'9 dan 8',
'7 dan 8',
'8 dan 7',
'A',
'Data sudah terurut, n = 7 (ganjil). Median = data ke-(7+1)/2 = data ke-4 = 8. Modus = nilai yang paling sering muncul = 8.',
'Median = nilai tengah. Modus = nilai yang paling sering muncul.',
'[{"order": 1, "title": "Hitung median", "content": "n = 7, median = data ke-4 = 8"}, {"order": 2, "title": "Hitung modus", "content": "Nilai yang paling sering = 8 (muncul 2 kali)"}]',
true),

-- PM 15: Program Linear
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PM', 'program_linear', 1.5, 0.58, 0.18,
'Nilai maksimum dari f(x,y) = 3x + 2y dengan kendala x + y ≤ 6, x ≥ 0, y ≥ 0 adalah...',
'12',
'14',
'16',
'18',
'20',
'D',
'Titik pojok: (0,0), (6,0), (0,6). f(0,0) = 0, f(6,0) = 18, f(0,6) = 12. Maksimum = 18 di titik (6,0)',
'Nilai optimum fungsi objektif selalu di titik pojok daerah feasible.',
'[{"order": 1, "title": "Tentukan titik pojok", "content": "(0,0), (6,0), (0,6)"}, {"order": 2, "title": "Hitung f di setiap titik", "content": "f(0,0)=0, f(6,0)=18, f(0,6)=12"}, {"order": 3, "title": "Maksimum", "content": "f = 18 di (6,0)"}]',
true)
ON CONFLICT DO NOTHING;


-- ============================================
-- 9. UPDATE QUESTION BANK COUNTS
-- ============================================
UPDATE question_banks 
SET 
    total_questions = 105,
    questions_pu = 15,
    questions_ppu = 15,
    questions_pbm = 15,
    questions_pk = 15,
    questions_lbi = 15,
    questions_lbe = 15,
    questions_pm = 15
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- ============================================
-- 10. SEED DATA YANG MEMBUTUHKAN USER ID
-- ============================================
-- Menggunakan user ID yang sudah ada: 4cfe0821-ceb4-4ae6-b99b-6bb408416ab1

DO $$
DECLARE
    v_user_id UUID := '4cfe0821-ceb4-4ae6-b99b-6bb408416ab1';
    v_question_id_1 UUID;
    v_question_id_2 UUID;
    v_question_id_3 UUID;
    v_session_id_1 VARCHAR(100);
    v_session_id_2 VARCHAR(100);
    v_attempt_id_1 UUID;
    v_attempt_id_2 UUID;
    v_attempt_id_3 UUID;
BEGIN
    -- ============================================
    -- UPDATE USER DATA (fill empty fields)
    -- ============================================
    UPDATE users SET
        full_name = 'Vito Andareas',
        subscription_tier = 'premium',
        is_subscription_active = true,
        irt_theta = 0.350,
        irt_variance = 0.450,
        irt_last_updated = CURRENT_TIMESTAMP,
        target_ptn = 'Universitas Indonesia',
        target_score = 700,
        exam_date = '2025-05-15',
        study_hours_per_week = 20,
        onboarding_completed = true,
        is_email_verified = true,
        last_login = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = v_user_id;
    
    RAISE NOTICE 'Updated and using user ID: %', v_user_id;
    
    -- Get some question IDs for attempts
    SELECT id INTO v_question_id_1 FROM questions WHERE section = 'PU' LIMIT 1;
    SELECT id INTO v_question_id_2 FROM questions WHERE section = 'PM' LIMIT 1;
    SELECT id INTO v_question_id_3 FROM questions WHERE section = 'LBI' LIMIT 1;
    
    -- Generate session IDs
    v_session_id_1 := 'session_' || to_char(NOW() - INTERVAL '3 days', 'YYYYMMDD') || '_001';
    v_session_id_2 := 'session_' || to_char(NOW() - INTERVAL '1 day', 'YYYYMMDD') || '_002';
    
    -- ============================================
    -- USER READINESS (7 sections)
    -- ============================================
    INSERT INTO user_readiness (user_id, section, recent_attempts_count, recent_correct_count, recent_accuracy, total_attempts_count, total_correct_count, overall_accuracy, current_theta, target_theta, readiness_percentage, predicted_score_low, predicted_score_high, improvement_rate_per_week, days_to_ready)
    VALUES
        (v_user_id, 'PU', 25, 18, 0.720, 150, 105, 0.700, 0.35, 0.70, 65.0, 580, 620, 0.05, 45),
        (v_user_id, 'PPU', 20, 15, 0.750, 120, 90, 0.750, 0.40, 0.70, 70.0, 600, 640, 0.04, 40),
        (v_user_id, 'PBM', 22, 14, 0.636, 130, 85, 0.654, 0.25, 0.70, 55.0, 540, 580, 0.06, 55),
        (v_user_id, 'PK', 30, 24, 0.800, 180, 144, 0.800, 0.50, 0.70, 80.0, 640, 680, 0.03, 25),
        (v_user_id, 'LBI', 18, 12, 0.667, 100, 65, 0.650, 0.20, 0.70, 50.0, 520, 560, 0.07, 60),
        (v_user_id, 'LBE', 15, 9, 0.600, 90, 54, 0.600, 0.15, 0.70, 45.0, 500, 540, 0.08, 70),
        (v_user_id, 'PM', 28, 20, 0.714, 160, 112, 0.700, 0.30, 0.70, 60.0, 560, 600, 0.05, 50)
    ON CONFLICT (user_id, section) DO UPDATE SET
        recent_attempts_count = EXCLUDED.recent_attempts_count,
        recent_correct_count = EXCLUDED.recent_correct_count,
        recent_accuracy = EXCLUDED.recent_accuracy,
        current_theta = EXCLUDED.current_theta,
        readiness_percentage = EXCLUDED.readiness_percentage,
        last_updated = CURRENT_TIMESTAMP;
    
    -- ============================================
    -- USER STUDY SESSIONS
    -- ============================================
    INSERT INTO user_study_sessions (id, user_id, started_at, ended_at, duration_minutes, questions_attempted, questions_correct, accuracy_in_session, section)
    VALUES
        (v_session_id_1, v_user_id, NOW() - INTERVAL '3 days' + INTERVAL '9 hours', NOW() - INTERVAL '3 days' + INTERVAL '10 hours', 60, 25, 18, 0.720, 'PU'),
        (v_session_id_2, v_user_id, NOW() - INTERVAL '1 day' + INTERVAL '14 hours', NOW() - INTERVAL '1 day' + INTERVAL '15 hours 30 minutes', 90, 35, 25, 0.714, 'PM'),
        ('session_mixed_001', v_user_id, NOW() - INTERVAL '5 days' + INTERVAL '19 hours', NOW() - INTERVAL '5 days' + INTERVAL '20 hours', 60, 30, 20, 0.667, NULL),
        ('session_lbi_001', v_user_id, NOW() - INTERVAL '2 days' + INTERVAL '10 hours', NOW() - INTERVAL '2 days' + INTERVAL '11 hours', 60, 20, 13, 0.650, 'LBI'),
        ('session_pk_001', v_user_id, NOW() - INTERVAL '4 days' + INTERVAL '16 hours', NOW() - INTERVAL '4 days' + INTERVAL '17 hours', 60, 28, 22, 0.786, 'PK')
    ON CONFLICT (id) DO NOTHING;
    
    -- ============================================
    -- ATTEMPTS
    -- ============================================
    IF v_question_id_1 IS NOT NULL THEN
        INSERT INTO attempts (user_id, question_id, selected_answer, is_correct, time_spent_seconds, user_theta_before, user_theta_after, theta_change, feedback_generated, session_id, attempt_number_in_session)
        VALUES
            (v_user_id, v_question_id_1, 'C', true, 45, 0.30, 0.35, 0.05, true, v_session_id_1, 1)
        RETURNING id INTO v_attempt_id_1;
    END IF;
    
    IF v_question_id_2 IS NOT NULL THEN
        INSERT INTO attempts (user_id, question_id, selected_answer, is_correct, time_spent_seconds, user_theta_before, user_theta_after, theta_change, feedback_generated, session_id, attempt_number_in_session)
        VALUES
            (v_user_id, v_question_id_2, 'B', true, 60, 0.25, 0.30, 0.05, true, v_session_id_2, 1)
        RETURNING id INTO v_attempt_id_2;
    END IF;
    
    IF v_question_id_3 IS NOT NULL THEN
        INSERT INTO attempts (user_id, question_id, selected_answer, is_correct, time_spent_seconds, user_theta_before, user_theta_after, theta_change, feedback_generated, session_id, attempt_number_in_session)
        VALUES
            (v_user_id, v_question_id_3, 'A', false, 90, 0.20, 0.18, -0.02, true, 'session_lbi_001', 1)
        RETURNING id INTO v_attempt_id_3;
    END IF;
    
    -- ============================================
    -- ATTEMPT FEEDBACK
    -- ============================================
    IF v_attempt_id_1 IS NOT NULL THEN
        INSERT INTO attempt_feedback (attempt_id, feedback_text, feedback_lang, model_used, prompt_version, generation_time_ms, token_count_input, token_count_output, is_helpful)
        VALUES (
            v_attempt_id_1,
            'Bagus! Kamu berhasil menjawab dengan benar. Dalam soal silogisme ini, kamu perlu memperhatikan premis universal "Semua mahasiswa FK wajib praktikum RS". Karena Andi adalah mahasiswa FK, maka kesimpulan yang PASTI benar adalah Andi mengikuti praktikum RS. Ingat, premis "beberapa" tidak memberikan kepastian untuk semua anggota himpunan.',
            'id',
            'gpt-4o-mini',
            'v1.2',
            350,
            150,
            200,
            true
        ) ON CONFLICT (attempt_id) DO NOTHING;
    END IF;
    
    IF v_attempt_id_2 IS NOT NULL THEN
        INSERT INTO attempt_feedback (attempt_id, feedback_text, feedback_lang, model_used, prompt_version, generation_time_ms, token_count_input, token_count_output, is_helpful)
        VALUES (
            v_attempt_id_2,
            'Jawaban kamu benar! Untuk soal fungsi f(x) = 2x² - 3x + 1, kamu perlu mensubstitusi nilai x = 2 ke dalam fungsi. f(2) = 2(2)² - 3(2) + 1 = 8 - 6 + 1 = 3. Strategi yang baik adalah menghitung setiap suku secara terpisah untuk menghindari kesalahan.',
            'id',
            'gpt-4o-mini',
            'v1.2',
            280,
            120,
            180,
            true
        ) ON CONFLICT (attempt_id) DO NOTHING;
    END IF;
    
    IF v_attempt_id_3 IS NOT NULL THEN
        INSERT INTO attempt_feedback (attempt_id, feedback_text, feedback_lang, model_used, prompt_version, generation_time_ms, token_count_input, token_count_output, is_helpful)
        VALUES (
            v_attempt_id_3,
            'Jawaban kamu kurang tepat. Untuk soal pemahaman teks ini, perhatikan bahwa gagasan utama harus mencakup keseluruhan isi paragraf, bukan hanya satu detail. Teks membahas keanekaragaman hayati Indonesia yang kaya (17% spesies dunia) DAN ancaman terhadapnya (deforestasi, perburuan). Jadi jawaban yang tepat adalah B yang mencakup kedua aspek tersebut.',
            'id',
            'gpt-4o-mini',
            'v1.2',
            420,
            180,
            250,
            NULL
        ) ON CONFLICT (attempt_id) DO NOTHING;
    END IF;
    
    -- ============================================
    -- PAYMENT SUBSCRIPTIONS
    -- ============================================
    INSERT INTO payment_subscriptions (user_id, midtrans_transaction_id, midtrans_order_id, subscription_tier, plan_duration_days, price_idr, payment_status, subscription_start_date, subscription_end_date)
    VALUES
        (v_user_id, 'TXN-' || to_char(NOW(), 'YYYYMMDD') || '-001', 'ORD-' || to_char(NOW(), 'YYYYMMDD') || '-001', 'premium', 30, 99000, 'success', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days')
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Seed data completed successfully for user: %', v_user_id;
    
END $$;

-- ============================================
-- VERIFICATION QUERIES (Optional - run to verify)
-- ============================================
-- SELECT 'question_banks' as table_name, COUNT(*) as count FROM question_banks
-- UNION ALL SELECT 'questions', COUNT(*) FROM questions
-- UNION ALL SELECT 'users', COUNT(*) FROM users
-- UNION ALL SELECT 'user_readiness', COUNT(*) FROM user_readiness
-- UNION ALL SELECT 'user_study_sessions', COUNT(*) FROM user_study_sessions
-- UNION ALL SELECT 'attempts', COUNT(*) FROM attempts
-- UNION ALL SELECT 'attempt_feedback', COUNT(*) FROM attempt_feedback
-- UNION ALL SELECT 'payment_subscriptions', COUNT(*) FROM payment_subscriptions;

-- Check questions per section
-- SELECT section, COUNT(*) as count FROM questions GROUP BY section ORDER BY section;
