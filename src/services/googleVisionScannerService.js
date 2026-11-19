// Perkhidmatan Integrasi Google Cloud Vision AI untuk Pengecaman Imej Makanan & Analisis Nutrisi KSSM
// Menggunakan Google Cloud Vision REST API (Label Detection, Web Detection & Object Localization)

const STORAGE_KEY = 'google_cloud_vision_api_key';

/**
 * Dapatkan Kunci API Google Cloud Vision daripada LocalStorage atau Environment Variables
 */
export function getStoredGoogleVisionApiKey() {
  try {
    if (typeof window === 'undefined') return '';
    const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('gemini_api_key') || '';
    if (stored) return stored;
    return (import.meta.env?.VITE_GOOGLE_VISION_API_KEY || import.meta.env?.VITE_GOOGLE_API_KEY || '');
  } catch {
    return '';
  }
}

/**
 * Simpan Kunci API Google Cloud Vision ke LocalStorage
 */
export function saveStoredGoogleVisionApiKey(apiKey) {
  try {
    if (typeof window === 'undefined') return;
    const cleanKey = (apiKey || '').trim();
    if (cleanKey) {
      localStorage.setItem(STORAGE_KEY, cleanKey);
      // Simpan juga ke gemini_api_key untuk kemudahan perkongsian Google Cloud Key
      localStorage.setItem('gemini_api_key', cleanKey);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.warn('Gagal menyimpan API Key:', err);
  }
}

/**
 * Semak sama ada pengguna telah memasukkan Kunci API Google Cloud Vision
 */
export function hasGoogleVisionApiKey() {
  return Boolean(getStoredGoogleVisionApiKey());
}

// Pangkalan Pengetahuan Makanan Tempatan Kantin Sekolah & Nutrisi KSSM Tingkatan 2
const MALAYSIAN_FOOD_DATABASE = [
  {
    keywords: ['nasi lemak', 'coconut rice', 'sambal', 'ikan bilis', 'nasi', 'lemak'],
    name: 'Nasi Lemak Telur & Sambal',
    category: 'Makanan Utama',
    emoji: '🍚',
    caloriesKcal: 420,
    caloriesKj: 1757,
    servingSize: '1 pinggan sederhana (230g)',
    macros: { carbs: 58, protein: 12, fat: 16 },
    trafficLight: 'kuning',
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
    keywords: ['chicken rice', 'nasi ayam', 'steamed chicken', 'hainanese', 'roast chicken'],
    name: 'Nasi Ayam Panggang Kantin',
    category: 'Makanan Utama',
    emoji: '🍗',
    caloriesKcal: 560,
    caloriesKj: 2343,
    servingSize: '1 hidangan lengkap bersama sup (320g)',
    macros: { carbs: 65, protein: 28, fat: 20 },
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
    keywords: ['fried noodles', 'mee goreng', 'mie goreng', 'chow mein', 'noodles', 'yellow noodle', 'spaghetti', 'pasta'],
    name: 'Mee Goreng Mamak Kantin',
    category: 'Makanan Utama',
    emoji: '🍝',
    caloriesKcal: 610,
    caloriesKj: 2552,
    servingSize: '1 pinggan (280g)',
    macros: { carbs: 78, protein: 14, fat: 26 },
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
    keywords: ['curry puff', 'karipap', 'empanada', 'samosa', 'pastry', 'turnover'],
    name: 'Karipap Kentang (2 Biji)',
    category: 'Snek Koperasi',
    emoji: '🥟',
    caloriesKcal: 280,
    caloriesKj: 1171,
    servingSize: '2 biji karipap goreng (100g)',
    macros: { carbs: 32, protein: 4, fat: 15 },
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
    keywords: ['roti canai', 'paratha', 'roti prata', 'flatbread', 'dhal', 'dal'],
    name: 'Roti Canai & Kuah Dal',
    category: 'Sarapan / Snek',
    emoji: '🫓',
    caloriesKcal: 340,
    caloriesKj: 1423,
    servingSize: '1 keping roti bersama kuah dal (150g)',
    macros: { carbs: 46, protein: 7, fat: 14 },
    trafficLight: 'kuning',
    trafficLightLabel: 'Kuning (Kawal Lemak Majerin)',
    burnActivities: [
      { name: 'Bermain Bola Jaring', durationMin: 35, icon: '🏐' },
      { name: 'Berjalan Santai', durationMin: 45, icon: '🚶' }
    ],
    tags: ['Tepung Gandum', 'Kuah Dal Berkhasiat', 'Lemak Majerin'],
    healthTip: 'Pilih kuah dal yang kaya dengan protein tumbuhan dan serat, kurangkan kuah kari berminyak atau gula pekat.'
  },
  {
    keywords: ['sandwich', 'submarine sandwich', 'egg sandwich', 'toast', 'bread', 'roti'],
    name: 'Sandwich Telur & Salad Roti Gandum',
    category: 'Snek Sihat',
    emoji: '🥪',
    caloriesKcal: 210,
    caloriesKj: 878,
    servingSize: '1 set (2 keping roti gandum penuh)',
    macros: { carbs: 24, protein: 11, fat: 7 },
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
    keywords: ['watermelon', 'tembikai', 'melon', 'citrullus'],
    name: 'Tembikai Merah Potong',
    category: 'Buah-buahan',
    emoji: '🍉',
    caloriesKcal: 60,
    caloriesKj: 251,
    servingSize: '2 potong sederhana (200g)',
    macros: { carbs: 14, protein: 1.2, fat: 0.3 },
    trafficLight: 'hijau',
    trafficLightLabel: 'Hijau (Pilihan Sangat Sihat)',
    burnActivities: [
      { name: 'Berjalan Kaki ke Pagar', durationMin: 10, icon: '🚶' }
    ],
    tags: ['Hidrasi Tinggi (92% Air)', 'Vitamin C & A', 'Sangat Rendah Kalori'],
    healthTip: 'Sangat baik untuk menghidratkan badan selepas bersukan di bawah cuaca panas Malaysia.'
  },
  {
    keywords: ['banana', 'pisang', 'plantain'],
    name: 'Pisang Berangan Segar',
    category: 'Buah-buahan',
    emoji: '🍌',
    caloriesKcal: 95,
    caloriesKj: 397,
    servingSize: '1 biji sederhana (100g)',
    macros: { carbs: 23, protein: 1.2, fat: 0.3 },
    trafficLight: 'hijau',
    trafficLightLabel: 'Hijau (Tenaga Segera Alami)',
    burnActivities: [
      { name: 'Aktiviti Regangan PJ', durationMin: 15, icon: '🤸' }
    ],
    tags: ['Kalium Tinggi', 'Tenaga Cepat', 'Serat Pektin'],
    healthTip: 'Kaya dengan kalium untuk fungsi saraf dan mencegah kekejangan otot semasa aktiviti sukan sekolah.'
  },
  {
    keywords: ['apple', 'epal', 'malus'],
    name: 'Epal Hijau / Merah Segar',
    category: 'Buah-buahan',
    emoji: '🍎',
    caloriesKcal: 72,
    caloriesKj: 301,
    servingSize: '1 biji sederhana (140g)',
    macros: { carbs: 19, protein: 0.4, fat: 0.2 },
    trafficLight: 'hijau',
    trafficLightLabel: 'Hijau (Snek Sempurna)',
    burnActivities: [
      { name: 'Jalan Santai Koridor', durationMin: 12, icon: '🚶' }
    ],
    tags: ['Antioksidan', 'Serat Larut Air', 'Gigi Bersih'],
    healthTip: 'Mengandungi serat pektin yang melambatkan penyerapan gula dan mengekalkan rasa kenyang lebih lama.'
  },
  {
    keywords: ['chickpea', 'garbanzo', 'kacang kuda', 'legume', 'bean', 'kacang'],
    name: 'Kacang Kuda Rebus',
    category: 'Snek Sihat',
    emoji: '🫘',
    caloriesKcal: 160,
    caloriesKj: 669,
    servingSize: '1 cawan kecil (120g)',
    macros: { carbs: 26, protein: 9, fat: 2.5 },
    trafficLight: 'hijau',
    trafficLightLabel: 'Hijau (Kaya Pelawas & Protein)',
    burnActivities: [
      { name: 'Berjalan Menaiki Tangga', durationMin: 18, icon: '🪜' },
      { name: 'Bermain Bola Jaring', durationMin: 20, icon: '🏐' }
    ],
    tags: ['Tinggi Serat (Pelawas)', 'Tanpa Minyak', 'Kenyang Lama'],
    healthTip: 'Kaya dengan serat pemakanan (pelawas) yang melancarkan peristalsis usus dan mencegah sembelit mengikut DSKP SP 3.4.3.'
  },
  {
    keywords: ['chocolate drink', 'milo', 'chocolate milk', 'hot chocolate', 'malt drink', 'coklat'],
    name: 'Air Coklat Malt Kotak (200ml)',
    category: 'Minuman Koperasi',
    emoji: '🧃',
    caloriesKcal: 155,
    caloriesKj: 648,
    servingSize: '1 pek kotak (200ml)',
    macros: { carbs: 24, protein: 4, fat: 4.5 },
    trafficLight: 'kuning',
    trafficLightLabel: 'Kuning (Kandungan Gula Tambahan)',
    burnActivities: [
      { name: 'Lari Ulang-Alik Padang', durationMin: 18, icon: '🏃' },
      { name: 'Bermain Ping Pong', durationMin: 25, icon: '🏓' }
    ],
    tags: ['Mengandungi Gula Tambahan', 'Kalsium & Vitamin B'],
    healthTip: 'Membekalkan tenaga tetapi mempunyai gula bebas yang agak tinggi. Hadkan pengambilan harian dan utamakan air kosong.'
  },
  {
    keywords: ['fried chicken', 'crispy chicken', 'ayam goreng', 'drumstick'],
    name: 'Ayam Goreng Rangup Kantin',
    category: 'Lauk Protein',
    emoji: '🍗',
    caloriesKcal: 320,
    caloriesKj: 1339,
    servingSize: '1 ketul bahagian paha/dada (120g)',
    macros: { carbs: 10, protein: 26, fat: 19 },
    trafficLight: 'kuning',
    trafficLightLabel: 'Kuning (Kawal Bahagian Goreng)',
    burnActivities: [
      { name: 'Larian Sukan PJ', durationMin: 35, icon: '🏃' },
      { name: 'Bermain Badminton', durationMin: 40, icon: '🏸' }
    ],
    tags: ['Tinggi Protein', 'Kulit Tepung Rangup', 'Minyak Goreng'],
    healthTip: 'Kaya dengan protein untuk pembaikan sel tubuh. Untuk mengurangkan kalori lemak, tanggalkan kulit luar yang berminyak.'
  },
  {
    keywords: ['rice', 'steamed rice', 'white rice', 'nasi putih', 'curry rice', 'nasi campur'],
    name: 'Nasi Putih Bersama Lauk Campur',
    category: 'Makanan Utama',
    emoji: '🍛',
    caloriesKcal: 450,
    caloriesKj: 1883,
    servingSize: '1 pinggan lengkap (260g)',
    macros: { carbs: 64, protein: 18, fat: 13 },
    trafficLight: 'kuning',
    trafficLightLabel: 'Kuning (Amalkan Suku-Suku Separuh)',
    burnActivities: [
      { name: 'Bermain Futsal', durationMin: 45, icon: '⚽' },
      { name: 'Berbasikal', durationMin: 40, icon: '🚴' }
    ],
    tags: ['Karbohidrat Asas', 'Lauk Campur', 'Suku-Suku Separuh'],
    healthTip: 'Isi pinggan mengikut formula Pinggan Sihat Malaysia: 1/4 nasi putih, 1/4 lauk protein (ikan/ayam), dan 1/2 sayur-sayuran segar.'
  },
  {
    keywords: ['soup', 'noodle soup', 'bihun sup', 'mee sup', 'broth', 'laksa'],
    name: 'Bihun Sup Ayam Sayuran',
    category: 'Makanan Utama',
    emoji: '🥣',
    caloriesKcal: 330,
    caloriesKj: 1381,
    servingSize: '1 mangkuk sederhana bersama sup (350g)',
    macros: { carbs: 48, protein: 19, fat: 7 },
    trafficLight: 'hijau',
    trafficLightLabel: 'Hijau (Pilihan Rendah Minyak)',
    burnActivities: [
      { name: 'Jogging Padang', durationMin: 32, icon: '🏃' },
      { name: 'Senaman Lompat Tali', durationMin: 28, icon: '🪢' }
    ],
    tags: ['Sup Bersih', 'Rendah Lemak', 'Sayur Sawi'],
    healthTip: 'Pilihan hidangan berkuah yang jauh lebih sihat berbanding mee goreng kerana tidak menggunakan minyak masak yang banyak.'
  },
  {
    keywords: ['burger', 'hamburger', 'fast food', 'cheeseburger', 'patty'],
    name: 'Burger Ayam / Daging Kantin',
    category: 'Snek / Makanan Segera',
    emoji: '🍔',
    caloriesKcal: 410,
    caloriesKj: 1715,
    servingSize: '1 biji burger sederhana (160g)',
    macros: { carbs: 42, protein: 18, fat: 19 },
    trafficLight: 'merah',
    trafficLightLabel: 'Merah (Tinggi Lemak & Sos Manis)',
    burnActivities: [
      { name: 'Bermain Bola Sepak', durationMin: 45, icon: '⚽' },
      { name: 'Larian Kardio', durationMin: 40, icon: '🏃' }
    ],
    tags: ['Daging Terproses', 'Sos Berperisa', 'Roti Putih'],
    healthTip: 'Daging burger mengandungi natrium dan lemak tepu yang tinggi. Minta lebihkan timun, kubis atau salad tanpa mayonis berlebihan.'
  },
  {
    keywords: ['pizza', 'cheese pizza', 'pepperoni'],
    name: 'Pizza Keju & Sayuran (1 Keping)',
    category: 'Snek / Makanan Segera',
    emoji: '🍕',
    caloriesKcal: 260,
    caloriesKj: 1088,
    servingSize: '1 keping sederhana (110g)',
    macros: { carbs: 30, protein: 11, fat: 10 },
    trafficLight: 'kuning',
    trafficLightLabel: 'Kuning (Kawal Porsi Makan)',
    burnActivities: [
      { name: 'Bermain Badminton', durationMin: 30, icon: '🏸' },
      { name: 'Berjalan Pantas', durationMin: 40, icon: '🚶' }
    ],
    tags: ['Keju Mozzarella', 'Tepung Roti', 'Sos Tomato'],
    healthTip: 'Membekalkan kalsium daripada keju, namun hadkan kepada 1-2 keping untuk mengelakkan lebihan pengambilan kalori dan garam.'
  },
  {
    keywords: ['salad', 'green salad', 'lettuce', 'vegetable', 'cucumber', 'vegetables', 'sayur'],
    name: 'Salad Sayuran Segar & Telur',
    category: 'Snek Sihat / Sayuran',
    emoji: '🥗',
    caloriesKcal: 140,
    caloriesKj: 586,
    servingSize: '1 mangkuk sederhana (180g)',
    macros: { carbs: 12, protein: 8, fat: 6 },
    trafficLight: 'hijau',
    trafficLightLabel: 'Hijau (Kaya Vitamin & Mineral)',
    burnActivities: [
      { name: 'Berjalan Santai', durationMin: 20, icon: '🚶' }
    ],
    tags: ['Pelawas Tinggi', 'Vitamin A, C & K', 'Rendah Kalori'],
    healthTip: 'Membekalkan serat pemakanan optimum dan mikronutrien penting untuk mengekalkan keimunan badan murid sekolah.'
  },
  {
    keywords: ['egg', 'boiled egg', 'fried egg', 'poached egg', 'telur'],
    name: 'Telur Rebus / Mata (1 Biji)',
    category: 'Lauk Protein',
    emoji: '🥚',
    caloriesKcal: 78,
    caloriesKj: 326,
    servingSize: '1 biji saiz gred A (55g)',
    macros: { carbs: 0.6, protein: 6.3, fat: 5.3 },
    trafficLight: 'hijau',
    trafficLightLabel: 'Hijau (Protein Piawai Emas)',
    burnActivities: [
      { name: 'Regangan Badan', durationMin: 12, icon: '🤸' }
    ],
    tags: ['Protein Berkualiti Tinggi', 'Kolin Otak', 'Vitamin D'],
    healthTip: 'Telur mengandungi kesemua 9 asid amino perlu dan kolin yang penting untuk keupayaan daya ingatan dan pembelajaran murid.'
  }
];

/**
 * Panggil API Google Cloud Vision REST
 */
export async function callGoogleCloudVisionApi(base64DataUrl, apiKey) {
  if (!apiKey) {
    throw new Error('Kunci API Google Cloud Vision tidak ditemui. Sila masukkan kunci API dalam tetapan.');
  }

  // Bersihkan data URL scheme sekiranya ada ("data:image/jpeg;base64,...")
  const base64Content = base64DataUrl.replace(/^data:image\/[a-z0-9+]+;base64,/i, '').trim();

  const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${encodeURIComponent(apiKey)}`;

  const requestBody = {
    requests: [
      {
        image: {
          content: base64Content
        },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 15 },
          { type: 'WEB_DETECTION', maxResults: 10 },
          { type: 'OBJECT_LOCALIZATION', maxResults: 8 }
        ]
      }
    ]
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `Ralat HTTP ${response.status}: ${response.statusText}`;
    throw new Error(`Google Cloud Vision API: ${message}`);
  }

  const data = await response.json();
  const result = data?.responses?.[0];

  if (result?.error) {
    throw new Error(`Google Cloud Vision API: ${result.error.message}`);
  }

  return result;
}

/**
 * Memadankan label-label Google Cloud Vision kepada entiti makanan KSSM
 */
function matchVisionLabelsToFood(visionResult) {
  const labelAnnotations = visionResult?.labelAnnotations || [];
  const webDetection = visionResult?.webDetection || {};
  const webEntities = webDetection?.webEntities || [];
  const bestGuessLabels = webDetection?.bestGuessLabels || [];
  const localizedObjects = visionResult?.localizedObjectAnnotations || [];

  // Kumpul semua frasa dan penerangan yang dikesan oleh Google Cloud Vision
  const detectedPhrases = [];

  for (const bg of bestGuessLabels) {
    if (bg?.label) detectedPhrases.push({ text: bg.label.toLowerCase(), weight: 3.0 });
  }

  for (const entity of webEntities) {
    if (entity?.description) {
      detectedPhrases.push({
        text: entity.description.toLowerCase(),
        weight: (entity.score || 1.0) * 2.0
      });
    }
  }

  for (const label of labelAnnotations) {
    if (label?.description) {
      detectedPhrases.push({
        text: label.description.toLowerCase(),
        weight: (label.score || 0.8) * 1.5
      });
    }
  }

  for (const obj of localizedObjects) {
    if (obj?.name) {
      detectedPhrases.push({
        text: obj.name.toLowerCase(),
        weight: (obj.score || 0.7) * 1.2
      });
    }
  }

  // Cari padanan terbaik dalam pangkalan data makanan Malaysia
  let bestFood = null;
  let highestScore = 0;
  let matchedKeyword = '';

  for (const food of MALAYSIAN_FOOD_DATABASE) {
    let score = 0;
    for (const kw of food.keywords) {
      const kwLower = kw.toLowerCase();
      for (const phrase of detectedPhrases) {
        if (phrase.text.includes(kwLower) || kwLower.includes(phrase.text)) {
          score += phrase.weight;
          if (!matchedKeyword) matchedKeyword = kw;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestFood = food;
    }
  }

  // Senarai tag ringkas yang dikesan oleh Google Cloud Vision
  const topVisionLabels = labelAnnotations
    .slice(0, 5)
    .map(l => `${l.description} (${Math.round((l.score || 0.8) * 100)}%)`);

  if (bestFood && highestScore > 0) {
    return {
      food: bestFood,
      confidenceScore: Math.min(Math.round(highestScore * 20 + 60), 99),
      visionLabels: topVisionLabels,
      bestMatchKeyword: matchedKeyword
    };
  }

  // Jika tiada padanan langsung, gunakan label makanan am daripada Vision
  const primaryLabel = labelAnnotations[0]?.description || webEntities[0]?.description || 'Hidangan Makanan';
  const calculatedConfidence = Math.round((labelAnnotations[0]?.score || 0.85) * 100);

  // Estimasi sintetik KSSM jika makanan tidak berada dalam pangkalan data tempatan
  const syntheticFood = {
    name: primaryLabel,
    category: 'Hidangan Makanan Terimbas',
    emoji: '🍽️',
    caloriesKcal: 380,
    caloriesKj: 1590,
    servingSize: '1 hidangan sederhana (~250g)',
    macros: { carbs: 50, protein: 16, fat: 13 },
    trafficLight: 'kuning',
    trafficLightLabel: 'Kuning (Pilihan Sederhana)',
    burnActivities: [
      { name: 'Jogging Padang', durationMin: 38, icon: '🏃' },
      { name: 'Bermain Badminton', durationMin: 42, icon: '🏸' },
      { name: 'Berjalan Santai', durationMin: 55, icon: '🚶' }
    ],
    tags: ['Google Cloud Vision', 'Pengesanan Pintar', primaryLabel],
    healthTip: `Dikesan sebagai "${primaryLabel}" melalui Google Cloud Vision AI. Amalkan konsep Pinggan Sihat Malaysia (Suku-Suku Separuh) dan minum air secukupnya.`
  };

  return {
    food: syntheticFood,
    confidenceScore: calculatedConfidence,
    visionLabels: topVisionLabels,
    bestMatchKeyword: primaryLabel
  };
}

/**
 * Normalkan objek nutrisi bagi memastikan konsistensi paparan komponen React
 */
function normalizeNutritionData(foodItem, visionMeta, tdeeKcal = 2000) {
  const carbs = Math.max(0, Math.round(Number(foodItem.macros?.carbs || 50)));
  const protein = Math.max(0, Math.round(Number(foodItem.macros?.protein || 18)));
  const fat = Math.max(0, Math.round(Number(foodItem.macros?.fat || 14)));

  // Kira kalori & kJ berasaskan formula DSKP KSSM Sains Tingkatan 2
  let caloriesKcal = Math.round(Number(foodItem.caloriesKcal || 0));
  if (!caloriesKcal || caloriesKcal <= 0) {
    caloriesKcal = Math.round((carbs * 4) + (protein * 4) + (fat * 9));
  }

  let caloriesKj = Math.round(Number(foodItem.caloriesKj || 0));
  if (!caloriesKj || caloriesKj <= 0) {
    caloriesKj = Math.round(caloriesKcal * 4.184);
  }

  let trafficLight = String(foodItem.trafficLight || '').toLowerCase().trim();
  if (!['hijau', 'kuning', 'merah'].includes(trafficLight)) {
    if (fat > 20 || caloriesKcal > 550) trafficLight = 'merah';
    else if (fat > 10 || caloriesKcal > 350) trafficLight = 'kuning';
    else trafficLight = 'hijau';
  }

  let trafficLightLabel = foodItem.trafficLightLabel || (
    trafficLight === 'hijau' ? 'Hijau (Pilihan Sihat)' :
    trafficLight === 'kuning' ? 'Kuning (Kawal Kekerapan)' : 'Merah (Hadkan Pengambilan)'
  );

  return {
    name: foodItem.name || 'Hidangan Makanan',
    category: foodItem.category || 'Makanan Utama',
    emoji: foodItem.emoji || '🍽️',
    servingSize: foodItem.servingSize || '1 hidangan sederhana (~250g)',
    caloriesKcal,
    caloriesKj,
    macros: { carbs, protein, fat },
    trafficLight,
    trafficLightLabel,
    burnActivities: foodItem.burnActivities || [
      { name: 'Bermain Badminton', durationMin: Math.max(15, Math.round(caloriesKcal / 8)), icon: '🏸' },
      { name: 'Larian Sukan PJ', durationMin: Math.max(15, Math.round(caloriesKcal / 10)), icon: '🏃' },
      { name: 'Berbasikal Santai', durationMin: Math.max(20, Math.round(caloriesKcal / 7)), icon: '🚴' }
    ],
    tags: Array.isArray(foodItem.tags) ? foodItem.tags : ['Google Cloud Vision', 'Nutrisi KSSM'],
    healthTip: foodItem.healthTip || 'Amalkan pemakanan seimbang berpandukan Pinggan Sihat Malaysia (Suku-Suku Separuh).',
    visionLabels: visionMeta?.visionLabels || ['Food', 'Dish', 'Cuisine'],
    confidenceScore: visionMeta?.confidenceScore || 92,
    provider: 'Google Cloud Vision AI'
  };
}

/**
 * Menganalisis imej makanan menggunakan Google Cloud Vision AI
 * @param {string} base64DataUrl - Format "data:image/jpeg;base64,..."
 * @param {object} userProfile - Profil kesihatan murid (TDEE, umur, jantina)
 * @param {string} [overrideApiKey] - Kunci API khusus jika diberi
 * @returns {Promise<object>} Objek data nutrisi berformat KSSM lengkap
 */
export async function analyzeFoodWithGoogleVision(base64DataUrl, userProfile = null, overrideApiKey = null) {
  const apiKey = overrideApiKey || getStoredGoogleVisionApiKey();
  const tdeeKcal = userProfile?.tdeeKcal || 2000;

  if (apiKey) {
    try {
      // Panggil Google Cloud Vision REST API
      const visionResponse = await callGoogleCloudVisionApi(base64DataUrl, apiKey);
      const matchResult = matchVisionLabelsToFood(visionResponse);
      return normalizeNutritionData(matchResult.food, matchResult, tdeeKcal);
    } catch (err) {
      console.warn('Ralat Google Cloud Vision API sebenar:', err);
      throw err;
    }
  }

  // Sekiranya belum ada API key, berikan mesej yang jelas
  throw new Error('Kunci API Google Cloud Vision diperlukan untuk imbasan imej langsung. Sila klik butang 🔑 Kunci API di penjuru atas untuk memasukkan Google Cloud Vision API Key anda.');
}

// Eksport alias keserasian untuk mengelakkan sebarang ralat import lama
export const analyzeFoodWithPuter = analyzeFoodWithGoogleVision;
export const analyzeFoodWithGemini = analyzeFoodWithGoogleVision;
export function isPuterSignedIn() { return false; }
export async function signInWithPuter() { return null; }
export const getStoredGeminiApiKey = getStoredGoogleVisionApiKey;
export const saveStoredGeminiApiKey = saveStoredGoogleVisionApiKey;
