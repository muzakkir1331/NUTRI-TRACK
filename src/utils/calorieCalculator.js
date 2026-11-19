// Pengiraan Indeks Jisim Badan (BMI) & Keperluan Kalori Harian (BMR & TDEE)
// Berpandukan DSKP Sains Tingkatan 2 (SP 3.2.1, 3.2.2 & 3.2.3) dan Garis Panduan KKM

export const ACTIVITY_FACTORS = [
  {
    id: 'sedentary',
    label: 'Sedentari / Sangat Pasif',
    desc: 'Banyak duduk, membaca, tiada aktiviti fizikal berat atau sukan',
    factor: 1.2,
    icon: '🪑'
  },
  {
    id: 'light',
    label: 'Ringan (Aktiviti Sekolah Biasa)',
    desc: 'Jalan kaki ke sekolah, naik tangga, kelas PJ 1-2 kali seminggu',
    factor: 1.375,
    icon: '🚶'
  },
  {
    id: 'moderate',
    label: 'Sederhana Aktif (Kokurikulum / Sukan)',
    desc: 'Bermain sukan (badminton, bola) atau berbasikal 3-5 hari seminggu',
    factor: 1.55,
    icon: '🏸'
  },
  {
    id: 'very_active',
    label: 'Sangat Aktif (Atlet Sekolah)',
    desc: 'Latihan intensif sukan / merentas desa 6-7 hari seminggu',
    factor: 1.725,
    icon: '🏃'
  }
];

// Pengiraan BMI
export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0) return { bmi: 0, category: 'Tidak Sah', color: 'slate' };
  
  const heightM = heightCm / 100;
  const bmi = +(weightKg / (heightM * heightM)).toFixed(1);

  let category = 'Berat Unggul';
  let color = 'emerald';
  let advice = 'Tahniah! Berat badan anda berada dalam julat sihat. Kekalkan pemakanan seimbang dan senaman.';

  if (bmi < 18.5) {
    category = 'Kurang Berat Badan';
    color = 'amber';
    advice = 'Anda disarankan mengambil lebih banyak nutrien berkhasiat seperti protein dan karbohidrat kompleks.';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = 'Berat Unggul (Normal)';
    color = 'emerald';
    advice = 'Jisim badan ideal! Teruskan gaya hidup sihat dan amalan Pinggan Sihat Malaysia.';
  } else if (bmi >= 25.0 && bmi <= 29.9) {
    category = 'Berlebihan Berat Badan';
    color = 'rose';
    advice = 'Tingkatkan aktiviti fizikal sekurang-kurangnya 30 minit sehari dan kurangkan makanan tinggi gula serta lemak tepu.';
  } else {
    category = 'Obesiti';
    color = 'rose';
    advice = 'Berisiko menghidap penyakit kardiovaskular dan diabetes. Dapatkan nasihat guru kesihatan atau doktor.';
  }

  return { bmi, category, color, advice };
}

// Pengiraan BMR (Formula Mifflin-St Jeor)
export function calculateBMR(weightKg, heightCm, ageYears, gender = 'lelaki') {
  if (!weightKg || !heightCm || !ageYears) return 0;
  
  // Formula:
  // Lelaki: 10 * weight + 6.25 * height - 5 * age + 5
  // Perempuan: 10 * weight + 6.25 * height - 5 * age - 161
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears);
  if (gender === 'lelaki') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  return Math.round(bmr);
}

// Pengiraan TDEE (Keperluan Kalori Harian Mengambil Kira 6 Faktor DSKP)
export function calculateTDEE(weightKg, heightCm, ageYears, gender, activityLevel) {
  const bmr = calculateBMR(weightKg, heightCm, ageYears, gender);
  const activity = ACTIVITY_FACTORS.find(a => a.id === activityLevel) || ACTIVITY_FACTORS[1];
  const tdeeKcal = Math.round(bmr * activity.factor);
  const tdeeKj = Math.round(tdeeKcal * 4.184); // 1 kcal = 4.184 kJ
  return { bmr, tdeeKcal, tdeeKj, factorName: activity.label };
}
