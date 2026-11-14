export const SCANNABLE_FOODS = [
  {
    id: 'nasi_lemak',
    name: 'Nasi Lemak Telur & Sambal',
    category: 'Makanan Utama',
    emoji: '🍚',
    caloriesKcal: 420,
    caloriesKj: 1757,
    servingSize: '1 pinggan sederhana (230g)',
    macros: {
      carbs: 58,    // 58g * 16.7 = ~968 kJ
      protein: 12,  // 12g * 16.7 = ~200 kJ
      fat: 16       // 16g * 37.6 = ~601 kJ
    },
    trafficLight: 'kuning', // Sederhana
    trafficLightLabel: 'Kuning (Kawal Kekerapan)',
    burnActivities: [
      { name: 'Jogging Padang Sekolah', durationMin: 42, icon: '🏃' },
      { name: 'Bermain Badminton', durationMin: 48, icon: '🏸' },
      { name: 'Berjalan Pantas', durationMin: 65, icon: '🚶' }
    ],
    tags: ['Santan', 'Tinggi Karbohidrat', 'Protein Telur'],
    healthTip: 'Kandungan santan menyumbang lemak tepu. Minta lebihkan timun segar dan elakkan menambah sambal bergula secara berlebihan.'
  },
  {
    id: 'nasi_ayam',
    name: 'Nasi Ayam Panggang Kantin',
    category: 'Makanan Utama',
    emoji: '🍗',
    caloriesKcal: 560,
    caloriesKj: 2343,
    servingSize: '1 hidangan lengkap bersama sup (320g)',
    macros: {
      carbs: 65,
      protein: 28,
      fat: 20
    },
    trafficLight: 'kuning',
    trafficLightLabel: 'Kuning (Pilihan Seimbang)',
    burnActivities: [
      { name: 'Larian Sukan PJ', durationMin: 55, icon: '🏃' },
      { name: 'Berenang', durationMin: 45, icon: '🏊' },
      { name: 'Menaiki Tangga Sekolah', durationMin: 50, icon: '🪜' }
    ],
    tags: ['Tinggi Protein', 'Ayam Panggang', 'Sup Sayur'],
    healthTip: 'Pilihan protein yang baik untuk tumbesaran remaja. Buang kulit ayam untuk menjimatkan kira-kira 80 kcal lemak tepu.'
  },
  {
    id: 'mee_goreng',
    name: 'Mee Goreng Mamak Kantin',
    category: 'Makanan Utama',
    emoji: '🍝',
    caloriesKcal: 610,
    caloriesKj: 2552,
    servingSize: '1 pinggan (280g)',
    macros: {
      carbs: 78,
      protein: 14,
      fat: 26
    },
    trafficLight: 'merah',
    trafficLightLabel: 'Merah (Tinggi Minyak & Natrium)',
    burnActivities: [
      { name: 'Bermain Bola Sepak', durationMin: 60, icon: '⚽' },
      { name: 'Berbasikal Pantas', durationMin: 55, icon: '🚴' },
      { name: 'Larian Merentas Desa', durationMin: 50, icon: '🏃' }
    ],
    tags: ['Berminyak', 'Tinggi Garam', 'Karbohidrat Ringkas'],
    healthTip: 'Mengandungi paras minyak dan natrium (garam) yang tinggi. Disarankan makan tidak melebihi 1 kali seminggu dan minta lebihkan sawi.'
  },
  {
    id: 'karipap',
    name: 'Karipap Kentang (2 Biji)',
    category: 'Snek Koperasi',
    emoji: '🥟',
    caloriesKcal: 280,
    caloriesKj: 1171,
    servingSize: '2 biji karipap goreng (100g)',
    macros: {
      carbs: 32,
      protein: 4,
      fat: 15
    },
    trafficLight: 'merah',
    trafficLightLabel: 'Merah (Tinggi Lemak Tepu)',
    burnActivities: [
      { name: 'Lompat Tali (Skipping)', durationMin: 25, icon: '🪢' },
      { name: 'Membersihkan Bilik Darjah', durationMin: 45, icon: '🧹' }
    ],
    tags: ['Goreng Rendam', 'Lemak Trans', 'Pastri Tepung'],
    healthTip: 'Kerak pastri yang digoreng menyerap minyak dengan banyak. Gantikan dengan pau kukus atau kacang kuda rebus untuk pilihan lebih sihat.'
  },
  {
    id: 'sandwich_telur',
    name: 'Sandwich Telur & Salad Roti Gandum',
    category: 'Snek Sihat',
    emoji: '🥪',
    caloriesKcal: 210,
    caloriesKj: 878,
    servingSize: '1 set (2 keping roti gandum penuh)',
    macros: {
      carbs: 24,
      protein: 11,
      fat: 7
    },
    trafficLight: 'hijau',
    trafficLightLabel: 'Hijau (Pilihan Sihat Cemerlang)',
    burnActivities: [
      { name: 'Jalan Santai Padang', durationMin: 30, icon: '🚶' },
      { name: 'Berbasikal Santai', durationMin: 22, icon: '🚴' }
    ],
    tags: ['Serat Tinggi', 'Protein Berkualiti', 'Rendah Lemak'],
    healthTip: 'Kombinasi ideal karbohidrat kompleks daripada bijirin penuh dan protein telur untuk daya tumpuan otak di dalam kelas.'
  },
  {
    id: 'buah_tembikai',
    name: 'Tembikai Merah Potong',
    category: 'Buah-buahan',
    emoji: '🍉',
    caloriesKcal: 60,
    caloriesKj: 251,
    servingSize: '2 potong sederhana (200g)',
    macros: {
      carbs: 14,
      protein: 1.2,
      fat: 0.3
    },
    trafficLight: 'hijau',
    trafficLightLabel: 'Hijau (Pilihan Sangat Sihat)',
    burnActivities: [
      { name: 'Berjalan Kaki ke Pagar', durationMin: 10, icon: '🚶' }
    ],
    tags: ['Hidrasi Tinggi (92% Air)', 'Vitamin C & A', 'Sangat Rendah Kalori'],
    healthTip: 'Sangat baik untuk menghidratkan badan selepas bersukan di bawah cuaca panas Malaysia.'
  },
  {
    id: 'kacang_kuda',
    name: 'Kacang Kuda Rebus',
    category: 'Snek Sihat',
    emoji: '🫘',
    caloriesKcal: 160,
    caloriesKj: 669,
    servingSize: '1 cawan kecil (120g)',
    macros: {
      carbs: 26,
      protein: 9,
      fat: 2.5
    },
    trafficLight: 'hijau',
    trafficLightLabel: 'Hijau (Kaya Pelawas & Protein)',
    burnActivities: [
      { name: 'Berjalan Menaiki Tangga', durationMin: 18, icon: '🪜' },
      { name: 'Bermain Bola Jaring', durationMin: 20, icon: '🏐' }
    ],
    tags: ['Tinggi Serat (Pelawas)', 'Tanpa Minyak', 'Kenyang Lama'],
    healthTip: 'Kaya dengan serat pemakanan (pelawas) yang melancarkan peristalsis usus dan mencegah sembelit.'
  },
  {
    id: 'air_milo',
    name: 'Air Coklat Malt Kotak (200ml)',
    category: 'Minuman Koperasi',
    emoji: '🧃',
    caloriesKcal: 155,
    caloriesKj: 648,
    servingSize: '1 pek kotak (200ml)',
    macros: {
      carbs: 24,
      protein: 4,
      fat: 4.5
    },
    trafficLight: 'kuning',
    trafficLightLabel: 'Kuning (Kandungan Gula Tambahan)',
    burnActivities: [
      { name: 'Lari Ulang-Alik Padang', durationMin: 18, icon: '🏃' },
      { name: 'Bermain Ping Pong', durationMin: 25, icon: '🏓' }
    ],
    tags: ['Mengandungi 4 Sudu Teh Gula', 'Kalsium & Vitamin B'],
    healthTip: 'Membekalkan tenaga tetapi mempunyai gula bebas yang agak tinggi. Hadkan pengambilan harian dan utamakan air kosong.'
  }
];
