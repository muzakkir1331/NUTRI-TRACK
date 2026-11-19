// Perkhidmatan Integrasi Google Gemini AI & Puter.js untuk Chatbot Penasihat Kesihatan & Nutrisi
// Menggunakan Puter.js (Free Cloud AI) dan Gemini 1.5 Flash untuk interaksi perbualan peribadi

import { puter } from '@heyputer/puter.js';
import { getStoredGeminiApiKey } from './geminiScannerService';

export { puter };

/**
 * Semak status log masuk Puter
 */
export async function getPuterAuthStatus() {
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
export async function signInPuter() {
  try {
    if (typeof window === 'undefined' || !puter?.auth) return null;
    return await puter.auth.signIn();
  } catch (err) {
    console.warn('Puter sign in error:', err);
    throw err;
  }
}

/**
 * Menghasilkan teks perbualan AI menggunakan Puter.js / Google Gemini
 * dengan sokongan fallback pintar (rule-based expert system) jika offline.
 */
export async function sendHealthAdvisorMessage(conversationHistory, userProfile) {
  const apiKey = getStoredGeminiApiKey();

  const studentName = userProfile?.name || 'Murid';
  const age = userProfile?.age || 14;
  const gender = userProfile?.gender || 'lelaki';
  const weight = userProfile?.weight || 48;
  const height = userProfile?.height || 155;
  const bmi = userProfile?.bmi || 20.0;
  const bmiCategory = userProfile?.bmiCategory || 'Berat Unggul (Normal)';
  const bmr = userProfile?.bmr || 1350;
  const tdeeKcal = userProfile?.tdeeKcal || 1850;
  const tdeeKj = userProfile?.tdeeKj || Math.round(tdeeKcal * 4.184);
  const activityLabel = userProfile?.activityLabel || 'Ringan (Aktiviti Sekolah Biasa)';

  const systemInstruction = `
Anda ialah "NutriBot", Pembimbing Maya & Penasihat Kesihatan & Diet Sekolah yang pakar dalam Sukatan KSSM Sains Tingkatan 2 (Bab 3.0 Nutrisi) dan Panduan Pemakanan Sihat KKM (Kementerian Kesihatan Malaysia).

Data Fizikal & Kesihatan Murid Semasa:
- Nama: ${studentName}
- Umur: ${age} tahun (Tingkatan 2)
- Jantina: ${gender}
- Berat: ${weight} kg
- Tinggi: ${height} cm
- Indeks Jisim Badan (BMI): ${bmi} (${bmiCategory})
- Kadar Metabolisme Asas (BMR): ${bmr} kcal/hari
- Keperluan Tenaga Harian (TDEE): ${tdeeKcal} kcal/hari (${tdeeKj} kJ/hari)
- Tahap Rutin Aktiviti Fizikal: ${activityLabel}

Peranan & Nada Anda:
1. Mesra, memberi sokongan positif, mendidik, dan saintifik berpandukan buku teks Sains Tingkatan 2.
2. Setiap kali memberi nasihat diet, sesuaikan dengan angka kalori harian murid (${tdeeKcal} kcal) dan kategori BMI (${bmiCategory}).
3. Berikan contoh makanan tempatan Malaysia yang lazim dijumpai di kantin atau rumah (contoh: nasi putih, ayam kukus/bakar, sayur bayam, tembikai, epal, telur rebus, ulam-ulaman).
4. Kaitkan dengan prinsip saintifik DSKP Tingkatan 2:
   - Pinggan Sihat Malaysia (Suku-Suku Separuh: 1/4 karbohidrat, 1/4 protein, 1/2 buah & sayur-sayuran).
   - 7 kelas makanan (karbohidrat, protein, lemak, vitamin, mineral, pelawas/serat, air).
   - Nisbah pembakaran tenaga: 1g karbohidrat = 16.7 kJ (4 kcal), 1g protein = 16.7 kJ (4 kcal), 1g lemak = 37.6 kJ (9 kcal).
   - Kepentingan pelawas dan hidrasi (8 gelas air / 2 liter) untuk mengelakkan sembelit dan mengurangkan risiko kanser usus besar (SP 3.4.3).
5. Jika mencadangkan senaman, berikan cadangan yang selamat mengikut BMI murid (cth: jika berlebihan berat badan, cadangkan senaman kardio impak rendah seperti berenang, berbasikal, atau jalan laju untuk melindungi sendi lutut).
6. Gunakan format yang kemas: perenggan pendek, senarai bertitik (bullet points), dan emoji yang menarik. Pastikan panjang respons padat, tidak meleret-leret.
`;

  // 1. Cuba guna Puter.js AI terlebih dahulu jika tiada API key peribadi atau sebagai pilihan utama
  try {
    if (puter?.ai?.chat) {
      const puterMessages = [
        { role: 'system', content: systemInstruction },
        ...conversationHistory.slice(-8).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      ];

      // Panggil Puter AI dengan model pilihan (gemini-1.5-flash / gpt-4o-mini)
      const puterResp = await puter.ai.chat(puterMessages, { model: 'gemini-1.5-flash' });
      const textOutput = puterResp?.message?.content || (typeof puterResp === 'string' ? puterResp : null);
      if (textOutput) {
        return textOutput.trim();
      }
    }
  } catch (puterErr) {
    console.warn('Puter.js AI chat unavailable/error, trying direct Gemini API or fallback:', puterErr);
  }

  // 2. Jika Puter tidak aktif, cuba guna kunci Gemini API langsung jika ada
  if (apiKey) {
    try {
      const formattedContents = [
        {
          role: 'user',
          parts: [{ text: `Arahan Sistem & Konteks: ${systemInstruction}\n\nSila akui peranan anda sebagai NutriBot.` }]
        },
        {
          role: 'model',
          parts: [{ text: `Hai ${studentName}! Saya NutriBot, penasihat kesihatan dan nutrisi peribadi anda. Berdasarkan BMI anda (${bmi} - ${bmiCategory}) dan keperluan kalori harian anda iaitu ${tdeeKcal} kcal, saya sedia membimbing anda mengenai pelan pemakanan seimbang, pemilihan makanan kantin, serta senaman yang sesuai untuk menyokong tumbesaran sihat anda!` }]
        }
      ];

      const recentMessages = conversationHistory.slice(-8);
      for (const msg of recentMessages) {
        formattedContents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: formattedContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return reply.trim();
        }
      }
    } catch (err) {
      console.warn('Direct Gemini API failed:', err);
    }
  }

  // 3. Fallback Pintar (Rule-based Expert System) jika kedua-dua Puter & Gemini offline
  return generateSmartFallbackResponse(conversationHistory, userProfile);
}

/**
 * Enjin Pakar Kesihatan Pintar (Rule-Based Fallback)
 * Berfungsi 100% tanpa internet atau jika API key belum dimasukkan.
 * Menghasilkan jawapan spesifik kepada data BMI, BMR, TDEE, diet, dan senaman murid.
 */
function generateSmartFallbackResponse(conversationHistory, userProfile) {
  const lastUserMsg = conversationHistory[conversationHistory.length - 1]?.text?.toLowerCase() || '';
  const name = userProfile?.name || 'Murid';
  const bmi = userProfile?.bmi || 20.0;
  const category = userProfile?.bmiCategory || 'Berat Unggul (Normal)';
  const tdee = userProfile?.tdeeKcal || 1850;
  const bmr = userProfile?.bmr || 1350;
  const age = userProfile?.age || 14;
  const gender = userProfile?.gender || 'lelaki';

  // 1. Pecahan Kalori & Diet Harian
  if (lastUserMsg.includes('pecahan kalori') || lastUserMsg.includes('sarapan') || lastUserMsg.includes('makan') || lastUserMsg.includes('diet') || lastUserMsg.includes('menu')) {
    const breakfastKcal = Math.round(tdee * 0.30);
    const lunchKcal = Math.round(tdee * 0.35);
    const dinnerKcal = Math.round(tdee * 0.25);
    const snackKcal = Math.round(tdee * 0.10);

    return `Hai **${name}**! Berdasarkan keperluan tenaga harian anda sebanyak **${tdee} kcal (${Math.round(tdee * 4.184)} kJ)**, berikut ialah cadangan pecahan kalori mengikut garis panduan pemakanan sihat KKM:

🍽️ **Pecahan Kalori Harian Anda:**
1. **Sarapan Pagi (30% ~ ${breakfastKcal} kcal):**
   - Memberi tenaga permulaan untuk fokus di dalam kelas.
   - *Cadangan:* 2 keping roti bijirin penuh + 1 biji telur rebus + segelas susu suam.
2. **Makan Tengah Hari di Kantin (35% ~ ${lunchKcal} kcal):**
   - Amalkan konsep **Pinggan Sihat Malaysia (Suku-Suku Separuh)**:
     - 🍚 **Suku Pinggan:** Nasi putih / beras perang (karbohidrat kompleks).
     - 🍗 **Suku Pinggan:** Ayam panggang / ikan kukus / tauhu (protein tumbesaran).
     - 🥦 **Separuh Pinggan:** Sayur campur & buah tembikai/pisang (pelawas & vitamin).
3. **Makan Malam (25% ~ ${dinnerKcal} kcal):**
   - Hidangan lebih ringan diambil sebelum jam 8.00 malam.
   - *Cadangan:* Sup sayur bersama isi ayam, ikan bakar, dan ulam-ulaman.
4. **Snek Sihat Waktu Rehat (10% ~ ${snackKcal} kcal):**
   - *Cadangan:* Segenggam kekacang badam, yogurt asli, atau sebiji epal merah.

Kekalkan amalan ini untuk mengekalkan status **${category}** anda!`;
  }

  // 2. Senaman & Pembakaran Kalori
  if (lastUserMsg.includes('senaman') || lastUserMsg.includes('bakar kalori') || lastUserMsg.includes('sukan') || lastUserMsg.includes('aktiviti') || lastUserMsg.includes('lari')) {
    if (bmi >= 25.0) {
      return `Berdasarkan status BMI anda iaitu **${bmi} (${category})**, strategi senaman yang paling berkesan dan selamat ialah **Kardio Impak Rendah** untuk melindungi sendi lutut anda:

🏃‍♂️ **Cadangan Rutin Senaman Anda:**
- **Berjalan Pantas (Brisk Walk) / Berbasikal:** 30–45 minit sehari (membakar ~180 - 240 kcal).
- **Berenang:** Sangat ideal kerana air menyokong berat badan anda sambil menggerakkan seluruh otot tubuh.
- **Badminton Santai:** 3 kali seminggu bersama rakan sekolah.

💡 **Tips Kesihatan:**
Untuk menurunkan berat badan secara sihat, sasarkan defisit kalori sederhana sebanyak **300–400 kcal** sehari dari TDEE anda (${tdee} kcal). Elakkan berlapar secara drastik kerana remaja memerlukan protein dan kalsium untuk tumbesaran tulang!`;
    } else if (bmi < 18.5) {
      return `Status BMI anda menunjukkan **${bmi} (${category})**. Matlamat senaman anda bukanlah untuk mengurangkan berat badan, sebaliknya untuk **Membina Jisim Otot (Lean Muscle)** dan merangsang selera makan yang sihat:

💪 **Cadangan Rutin Senaman Anda:**
- **Senaman Rintangan Berat Badan:** Tekan tubi lutut (*modified push-ups*), cangkung (*bodyweight squats*), dan *plank* (3 set, 10 ulangan).
- **Sukan Pasukan Sekolah:** Bola keranjang, futsal, atau badminton untuk membina ketumpatan tulang dan ketangkasan.
- **Kekerapan:** 3–4 hari seminggu (30 minit setiap sesi).

💡 **Tips Pemakanan:**
Pastikan anda menambah pengambilan protein berkhasiat (telur, susu, kekacang, daging tanpa lemak) dan jangan melangkau waktu makan utama!`;
    } else {
      return `Hebat **${name}**! BMI anda berada pada julat unggul iaitu **${bmi} (${category})**. Matlamat anda ialah mengekalkan kecergasan kardiovaskular dan stamina mental:

🏸 **Cadangan Rutin Senaman KKM:**
- **Latihan Aerobik:** Joging santai, berbasikal ke sekolah, atau bermain badminton (30 minit sehari, 4-5 kali seminggu).
- **Kekuatan Otot:** Senaman lantai (*core workout*) 2 kali seminggu.
- **Ujian SEGAK Sekolah:** Amalkan naik turun bangku dan jangkauan melunjur secara berkala untuk mengekalkan gred A.

Senaman yang konsisten memastikan pembakaran kalori anda seimbang dengan pengambilan makanan sebanyak **${tdee} kcal**!`;
    }
  }

  // 3. Air Minuman & Serat (SP 3.4.3)
  if (lastUserMsg.includes('air') || lastUserMsg.includes('sembelit') || lastUserMsg.includes('serat') || lastUserMsg.includes('pelawas') || lastUserMsg.includes('hidrasi')) {
    return `💧 **Panduan Hidrasi & Pelawas KSSM Sains (SP 3.4.3):**

Sebagai murid berusia **${age} tahun** dengan rutin aktiviti harian:
- **Keperluan Air:** Sekurang-kurangnya **8 gelas (2.0 Liter)** sehari. Bawa botol air 1 liter ke sekolah dan habiskan sebelum sesi petang.
- **Keperluan Pelawas:** Sasarkan **20 – 30 gram serat** sehari daripada sayur-sayuran, buah-buahan, dan oat.

⚠️ **Mengapa Penting Mencegah Sembelit?**
1. Apabila tinja bergerak perlahan dalam usus besar (kolon), air diserap secara berlebihan, menjadikan tinja keras dan menyebabkan rasa sakit atau risiko buasir.
2. Penyingkiran tinja yang lancar memastikan sisa toksik dan bahan karsinogen tidak bertakung lama di dinding usus, sekaligus merendahkan risiko kanser kolon.`;
  }

  // 4. Makanan Kantin & Lampu Isyarat (SP 3.2.2 & 3.2.3)
  if (lastUserMsg.includes('kantin') || lastUserMsg.includes('koperasi') || lastUserMsg.includes('snek') || lastUserMsg.includes('lampu isyarat')) {
    return `🏪 **Tips Memilih Makanan Kantin Menggunakan Sistem Lampu Isyarat (SP 3.2.2 & 3.2.3):**

🟢 **Zon Hijau (Pilihan Utama - Kerap Diambil):**
- Nasi putih separuh pinggan bersama ikan bakar / ayam kukus.
- Buah-buahan segar (tembikai potong, pisang, epal).
- Air mineral kosong atau susu segar rendah lemak.

🟡 **Zon Kuning (Pilihan Sederhana - Kawal Kuantiti):**
- Bihun sup, mee sup, sandwich telur, atau kuih apam kukus.
- Ambil tidak melebihi 2-3 kali seminggu.

🔴 **Zon Merah (Hadkan - Tinggi Lemak, Garam & Gula):**
- Sosej goreng, nugget, keropok lekor goreng celup minyak lama.
- Minuman manis berperisa kordial atau air berkarbonat di kantin.
- Mengandungi kalori padat yang boleh melepasi had **${tdee} kcal** harian anda!`;
  }

  // 5. Analisis Umum BMI & Profil
  if (lastUserMsg.includes('bmi') || lastUserMsg.includes('berat') || lastUserMsg.includes('tinggi') || lastUserMsg.includes('normal')) {
    return `📊 **Analisis Profil Kesihatan Anda:**
- **Jisim Badan:** ${userProfile?.weight || 48} kg
- **Ketinggian:** ${userProfile?.height || 155} cm
- **Skor BMI:** **${bmi}**
- **Kategori:** **${category}**
- **Kadar Metabolisme Asas (BMR):** **${bmr} kcal** (tenaga minimum saat berehat)
- **Keperluan Harian (TDEE):** **${tdee} kcal (${Math.round(tdee * 4.184)} kJ)**

${bmi >= 18.5 && bmi <= 24.9 
  ? `Status anda adalah sangat baik! Anda berada dalam julat berat unggul sihat mengikut piawaian KKM dan Sains Tingkatan 2.` 
  : bmi < 18.5 
  ? `BMI anda berada di bawah julat normal. Pastikan anda mengambil makanan berkalori sihat dan kaya nutrien untuk menyokong proses akil baligh dan tumbesaran.` 
  : `BMI anda melebihi julat ideal. Anda digalakkan meningkatkan aktiviti fizikal sekurang-kurangnya 30 minit sehari dan mengurangkan makanan bergoreng serta minuman bergula.`}`;
  }

  // 6. Respon Lalai (Default Helpful Advice)
  return `Hai **${name}**! Sebagai penasihat nutrisi anda, saya sedia menjawab sebarang soalan mengenai:

1. 🥗 **Pecahan Kalori & Menu Diet:** Berapa kalori sarapan, makan tengah hari kantin, dan makan malam mengikut TDEE anda (${tdee} kcal).
2. 🏃 **Rutin Senaman:** Senaman kardio atau kekuatan yang sesuai untuk BMI anda (${bmi}).
3. 🍎 **Panduan Snek Kantin:** Cara menggunakan Sistem Lampu Isyarat KKM.
4. 💧 **Hidrasi & Serat:** Mengapa serat penting mencegah sembelit dan kanser usus (SP 3.4.3).

Ada apa-apa soalan spesifik yang ingin anda ketahui hari ini? Sila pilih soalan cadangan di bawah atau taip soalan anda!`;
}
