# Nutri-Track: Ekosistem Kesihatan Sekolah (Bab 3.0 Nutrisi)

Aplikasi web pendidikan interaktif Sains KSSM Tingkatan 2 yang memaparkan ekosistem kesihatan sekolah komprehensif berpandukan Dokumen Standard Kurikulum dan Pentaksiran (DSKP) Kementerian Pendidikan Malaysia (KPM) dan Garis Panduan Kementerian Kesihatan Malaysia (KKM).

---

## 🌟 Ciri-Ciri Utama

1. **Soal Selidik Kesihatan Asas (*Onboarding*):**
   - Mengambil data berat badan (kg), ketinggian (cm), usia, jantina, dan tahap rutin aktiviti harian.
   - Mengira secara masa nyata:
     - Indeks Jisim Badan (**BMI**) & status berat mengikut piawaian KKM.
     - Kadar Metabolisme Asas (**BMR** formula Mifflin-St Jeor).
     - Keperluan Tenaga Harian (**TDEE**) dalam unit **kcal** dan **kilojoule (kJ)**.

2. **Pengimbas Makanan Pintar (Puter.js Vision AI):**
   - Dikuasakan oleh multimodal **Puter.js Vision AI** tanpa memerlukan konfigurasi kunci API secara manual.
   - Mengesan jenis makanan, saiz hidangan, pengiraan kalori (kcal & kJ), pecahan 3 makronutrien (Karbohidrat, Protein, Lemak), Sistem Lampu Isyarat KKM, dan durasi sukan/senaman untuk membakar kalori hidangan tersebut.

3. **NutriBot: Penasihat Kesihatan & Diet AI:**
   - Pembimbing peribadi murid berasaskan sukatan Sains Tingkatan 2.
   - Merancang pecahan kalori harian (Sarapan 30%, Makan Tengah Hari Kantin 35%, Makan Malam 25%, Snek 10%).
   - Memberi cadangan senaman yang disesuaikan secara khusus mengikut skor BMI murid.

4. **6 Kumpulan Modul DSKP KSSM Sains Tingkatan 2:**
   - **Kumpulan 1 (SP 3.1.1 & 3.1.2):** Ensiklopedia 7 Kelas Makanan, Simulator 4 Ujian Makmal Biokimia (Iodin, Benedict, Millon, Alkohol-Emulsi), dan Klinik Diagnosis Kekurangan Nutrien.
   - **Kumpulan 2 (SP 3.2.1 & 3.2.2):** Kalkulator Profil Kalori 6 Faktor DSKP, Simulator Pinggan Sihat Malaysia (Suku-Suku Separuh), dan Penukar Unit Tenaga (kcal $\longleftrightarrow$ kJ).
   - **Kumpulan 3 (SP 3.2.2 & 3.2.3):** Katalog Fakta Nutrisi Kantin/Koperasi Sekolah, Sistem Lampu Isyarat Kesihatan (Merah/Kuning/Hijau), dan Penjana Pertukaran Snek Sihat.
   - **Kumpulan 4 (SP 3.2.3):** Kalkulator BMI Murid, Dashboard Statistik Obesiti Sekolah (Carta Pai & Graf Palang SVG), dan Kalkulator Bakar Kalori Aktiviti Sukan.
   - **Kumpulan 5 (SP 3.3.1):** Peta Interaktif Salur Pencernaan & Animasi Peristalsis, Simulator Enzim (Amilase, Protease, Lipase), dan Eksperimen Tindakan Air Liur Mengkaji Kesan Suhu (0°C, 37°C, 60°C).
   - **Kumpulan 6 (SP 3.4.1–3.4.3):** Simulator Tiub Visking vs Struktur Vilus Usus Kecil, Peta Hubungkait 3 Sistem Tubuh (Pencernaan, Respirasi, Peredaran Darah $\longrightarrow$ Respirasi Sel), dan Penjejak Hidrasi & Pelawas Mencegah Sembelit dan Kanser Kolon.

5. **Audio Makmal Web Audio API & Sistem Ganjaran Bintang:**
   - Kesan bunyi sintesis prosedur makmal (titisan pipet, gelembung cecair, pembakar bunsen, loceng kejayaan).
   - Penjejak bintang nutrisi disimpan secara setempat (`localStorage`).

---

## 🚀 Cara Menjalankan Aplikasi Secara Tempatan

### Keperluan Sistem:
- Node.js (v18.0.0 atau ke atas)
- npm

### Langkah Pemasangan:

```bash
# 1. Pasang kebergantungan (dependencies)
npm install

# 2. Jalankan pelayan pembangunan (development server)
npm run dev

# 3. Bina untuk pengeluaran (production build)
npm run build
```

Buka pelayar web anda di `http://localhost:5173` atau `http://localhost:3000`.

---

## 🛠️ Teknologi & Pakej Digunakan

- **React 18** (Vite)
- **Tailwind CSS**
- **@heyputer/puter.js** (Puter.js Cloud AI & Vision)
- **Lucide React** (Ikon sains & antaramuka)
- **Canvas-Confetti** (Animasi kejayaan pembelajaran)
- **Web Audio API** (Zero-dependency sound effects)

---

## 📖 Rujukan Kurikulum
- Dokumen Standard Kurikulum dan Pentaksiran (DSKP) Sains Tingkatan 2 (KSSM), Bahagian Pembangunan Kurikulum (BPK), Kementerian Pendidikan Malaysia.
- Panduan Pemakanan Sihat & Konsep Suku-Suku Separuh, Bahagian Pemakanan, Kementerian Kesihatan Malaysia (KKM).
