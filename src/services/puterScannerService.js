// Perkhidmatan Integrasi Puter.js AI untuk Pengecaman Imej Makanan & Pengiraan Kalori
// Menggunakan Puter.js Vision (Multimodal AI) tanpa memerlukan kunci API peribadi

import { puter } from '@heyputer/puter.js';

export { puter };

/**
 * Semak status log masuk pengguna ke akaun Puter
 */
export async function isPuterSignedIn() {
  try {
    if (typeof window === 'undefined' || !puter?.auth) return false;
    return puter.auth.isSignedIn();
  } catch {
    return false;
  }
}

/**
 * Log masuk Puter secara interaktif
 */
export async function signInWithPuter() {
  try {
    if (typeof window === 'undefined' || !puter?.auth) return null;
    return await puter.auth.signIn();
  } catch (err) {
    console.warn('Puter sign in error:', err);
    throw err;
  }
}

/**
 * Memastikan output JSON sentiasa sah, lengkap dan tidak menyebabkan 'undefined' pada komponen React.
 */
function normalizeNutritionData(parsed, tdeeKcal = 2000) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Format tindak balas AI tidak mengandungi data JSON yang sah.');
  }

  // Ekstrak makronutrien dengan selamat (nombor integer positif)
  const rawMacros = parsed.macros || {};
  const carbs = Math.max(0, Math.round(Number(rawMacros.carbs ?? parsed.carbs ?? 50) || 50));
  const protein = Math.max(0, Math.round(Number(rawMacros.protein ?? parsed.protein ?? 18) || 18));
  const fat = Math.max(0, Math.round(Number(rawMacros.fat ?? parsed.fat ?? 14) || 14));

  // Kira kalori mengikut formula KSSM jika tiada atau tidak sah
  let caloriesKcal = Math.round(Number(parsed.caloriesKcal || parsed.calories || 0));
  if (!caloriesKcal || isNaN(caloriesKcal) || caloriesKcal <= 0) {
    caloriesKcal = Math.round((carbs * 4) + (protein * 4) + (fat * 9));
  }

  let caloriesKj = Math.round(Number(parsed.caloriesKj || 0));
  if (!caloriesKj || isNaN(caloriesKj) || caloriesKj <= 0) {
    caloriesKj = Math.round(caloriesKcal * 4.184);
  }

  // Lampu isyarat
  let trafficLight = String(parsed.trafficLight || '').toLowerCase().trim();
  if (!['hijau', 'kuning', 'merah'].includes(trafficLight)) {
    if (fat > 20 || caloriesKcal > 550) trafficLight = 'merah';
    else if (fat > 10 || caloriesKcal > 350) trafficLight = 'kuning';
    else trafficLight = 'hijau';
  }

  let trafficLightLabel = String(parsed.trafficLightLabel || '');
  if (!trafficLightLabel) {
    trafficLightLabel = trafficLight === 'hijau' ? 'Hijau (Pilihan Sihat)' :
                        trafficLight === 'kuning' ? 'Kuning (Kawal Kekerapan)' : 'Merah (Hadkan Pengambilan)';
  }

  // Aktiviti pembakaran kalori
  let burnActivities = [];
  if (Array.isArray(parsed.burnActivities) && parsed.burnActivities.length > 0) {
    burnActivities = parsed.burnActivities.map((act) => ({
      name: String(act?.name || 'Aktiviti Fizikal'),
      durationMin: Math.max(10, Math.round(Number(act?.durationMin || 30) || 30)),
      icon: String(act?.icon || '🏃')
    }));
  } else {
    burnActivities = [
      { name: 'Bermain Badminton', durationMin: Math.max(15, Math.round(caloriesKcal / 8)), icon: '🏸' },
      { name: 'Larian Sukan PJ', durationMin: Math.max(15, Math.round(caloriesKcal / 10)), icon: '🏃' },
      { name: 'Berbasikal Santai', durationMin: Math.max(20, Math.round(caloriesKcal / 7)), icon: '🚴' }
    ];
  }

  return {
    name: String(parsed.name || 'Hidangan Makanan Terimbas'),
    category: String(parsed.category || 'Makanan Utama'),
    emoji: String(parsed.emoji || '🍽️'),
    servingSize: String(parsed.servingSize || '1 hidangan sederhana (~250g)'),
    caloriesKcal,
    caloriesKj,
    macros: {
      carbs,
      protein,
      fat
    },
    trafficLight,
    trafficLightLabel,
    burnActivities,
    tags: Array.isArray(parsed.tags) && parsed.tags.length > 0 
      ? parsed.tags.map(String) 
      : ['Nutrisi KSSM', 'Tenaga Seimbang'],
    healthTip: String(parsed.healthTip || 'Amalkan konsep Pinggan Sihat Malaysia (Suku-Suku Separuh) dan minum air mencukupi.')
  };
}

/**
 * Menganalisis imej makanan menggunakan Puter.js Vision AI
 * @param {string} base64DataUrl - Format "data:image/jpeg;base64,..."
 * @param {object} userProfile - Profil kesihatan murid (TDEE, umur, jantina)
 * @returns {Promise<object>} Objek data nutrisi berformat KSSM yang dijamin lengkap
 */
export async function analyzeFoodWithPuter(base64DataUrl, userProfile = null) {
  if (!puter?.ai?.chat) {
    throw new Error('Puter.js AI belum sedia atau gagal dimuatkan.');
  }

  const tdeeKcal = userProfile?.tdeeKcal || 2000;
  const studentAge = userProfile?.age || 14;
  const studentGender = userProfile?.gender || 'lelaki';

  const systemPrompt = `
Anda ialah pakar nutrisi dan guru Sains KSSM Tingkatan 2 Malaysia yang sangat teliti.
Tugas anda ialah mengecam dan menganalisis imej makanan/minuman yang diberikan dengan ketepatan tinggi, berpandukan sukatan DSKP Sains Tingkatan 2 (Bab 3.0 Nutrisi):

Piawaian formula tenaga saintifik KSSM:
- 1 g Karbohidrat = 16.7 kJ (4 kcal)
- 1 g Protein = 16.7 kJ (4 kcal)
- 1 g Lemak = 37.6 kJ (9 kcal)
- 1 kcal ≈ 4.184 kJ

Profil Murid:
- Umur: ${studentAge} tahun
- Jantina: ${studentGender}
- Keperluan Kalori Harian (TDEE): ${tdeeKcal} kcal

Kembalikan jawapan HANYA dalam format JSON tulen (tanpa sebarang pembungkus markdown seperti \`\`\`json) dengan struktur tepat berikut:
{
  "name": "Nama makanan spesifik (cth: Nasi Lemak Ayam Goreng, Mee Sup, Karipap Kentang, Roti Canai)",
  "category": "Makanan Utama | Snek Kantin | Minuman | Buah-buahan",
  "emoji": "emoji makanan sesuai (cth: 🍚, 🍗, 🍜, 🥟, 🥪, 🍎)",
  "servingSize": "anggaran saiz hidangan (cth: 1 pinggan sederhana ~300g)",
  "caloriesKcal": 550,
  "caloriesKj": 2301,
  "macros": {
    "carbs": 65,
    "protein": 22,
    "fat": 21
  },
  "trafficLight": "hijau | kuning | merah",
  "trafficLightLabel": "Hijau (Pilihan Sihat) | Kuning (Sederhana) | Merah (Tinggi Lemak/Gula/Garam)",
  "burnActivities": [
    { "name": "Bermain Badminton", "durationMin": 45, "icon": "🏸" },
    { "name": "Larian Sukan PJ", "durationMin": 35, "icon": "🏃" },
    { "name": "Berbasikal", "durationMin": 40, "icon": "🚴" }
  ],
  "tags": ["tag 1", "tag 2", "tag 3"],
  "healthTip": "Ulasan nutrisi mendalam dalam Bahasa Melayu yang mendidik murid tentang khasiat atau risiko makanan ini berdasarkan sukatan Sains Tingkatan 2."
}
`;

  let lastError = null;

  // Model-model multimodal yang disokong Puter (cuba gemini-1.5-flash dahulu, jika gagal cuba gpt-4o-mini)
  const modelsToTry = ['gemini-1.5-flash', 'gpt-4o-mini'];

  for (const modelName of modelsToTry) {
    try {
      const response = await puter.ai.chat(
        systemPrompt + '\n\nPENTING: Kembalikan HANYA format JSON sah di atas tanpa sebarang teks pengenalan atau penutup.',
        base64DataUrl,
        { model: modelName }
      );

      // Tangani pelbagai jenis output tindak balas
      let rawText = '';
      if (typeof response === 'string') {
        rawText = response;
      } else if (response?.message?.content) {
        if (typeof response.message.content === 'string') {
          rawText = response.message.content;
        } else if (Array.isArray(response.message.content)) {
          rawText = response.message.content
            .map(part => (typeof part === 'string' ? part : part?.text || ''))
            .join(' ');
        }
      }

      if (!rawText) {
        throw new Error(`Model ${modelName} tidak mengembalikan sebarang teks.`);
      }

      // Cari kurungan JSON { ... } dalam teks
      const firstBrace = rawText.indexOf('{');
      const lastBrace = rawText.lastIndexOf('}');

      if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        throw new Error('Tindak balas AI tidak mengandungi blok JSON { ... } yang lengkap.');
      }

      const jsonSubstring = rawText.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(jsonSubstring);

      // Normalkan data untuk mengelakkan ralat render React
      return normalizeNutritionData(parsed, tdeeKcal);

    } catch (err) {
      console.warn(`Percubaan Puter AI dengan model ${modelName} gagal:`, err);
      lastError = err;
    }
  }

  throw new Error(lastError?.message || 'Gagal memproses imej makanan melalui Puter.js AI.');
}

// Alias bagi menyokong keserasian kod
export const analyzeFoodWithGemini = analyzeFoodWithPuter;
export function getStoredGeminiApiKey() { return ''; }
export function saveStoredGeminiApiKey() {}
