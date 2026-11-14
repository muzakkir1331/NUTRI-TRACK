import React, { useState } from 'react';
import { 
  Scale, 
  Flame, 
  Activity, 
  Sparkles, 
  Info, 
  Users, 
  Sun, 
  Snowflake, 
  HeartPulse, 
  Briefcase,
  Clock,
  ArrowRight
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

// Faktor 1-6 DSKP Sains Tingkatan 2
const AGE_GROUPS = [
  { id: 'kanak', label: 'Kanak-kanak (7-12 Tahun)', multiplier: 0.85, note: 'Tumbesaran aktif tetapi saiz tubuh kecil' },
  { id: 'remaja', label: 'Remaja (13-17 Tahun)', multiplier: 1.15, note: 'Metabolisme tinggi & lonjakan tumbesaran puberti' },
  { id: 'dewasa', label: 'Dewasa (18-59 Tahun)', multiplier: 1.0, note: 'Keperluan metabolisme stabil' },
  { id: 'warga_emas', label: 'Warga Emas (60+ Tahun)', multiplier: 0.8, note: 'Metabolisme berkurang & kurang aktif secara fizikal' }
];

const HEALTH_CONDITIONS = [
  { id: 'sihat', label: 'Sihat Normal', multiplier: 1.0, note: 'Kadar metabolik asas biasa' },
  { id: 'sembuh', label: 'Sedang Sembuh Daripada Sakit', multiplier: 1.15, note: 'Perlukan tenaga & protein tambahan membaiki sel' },
  { id: 'hamil', label: 'Ibu Mengandung / Menyusu', multiplier: 1.25, note: 'Membekalkan nutrien untuk perkembangan janin/bayi' }
];

const CLIMATES = [
  { id: 'tropika', label: 'Iklim Tropika (Malaysia)', multiplier: 1.0, icon: Sun, note: 'Suhu panas lembap, kehilangan haba terkawal' },
  { id: 'sejuk', label: 'Iklim Sejuk / Sederhana', multiplier: 1.2, icon: Snowflake, note: 'Perlu lebih tenaga dibakar untuk mengekalkan suhu badan 37°C' }
];

const OCCUPATIONS = [
  { id: 'sedentari', label: 'Pekerja Pejabat / Pelajar Sedentari', multiplier: 1.2, desc: 'Duduk berjam-jam, kurang pergerakan fizikal' },
  { id: 'sederhana', label: 'Pelajar Aktif / Guru Bergerak', multiplier: 1.5, desc: 'Banyak berjalan, naik tangga, aktiviti harian biasa' },
  { id: 'berat', label: 'Buruh Binaan / Atlet Sukan', multiplier: 1.85, desc: 'Menggunakan tenaga otot maksimum secara berterusan' }
];

export default function CalorieFactorsCalculator({ userProfile }) {
  // Profil 1 (Murid / Individu A)
  const [profileA, setProfileA] = useState({
    name: userProfile?.name || 'Murid 2 Arif',
    gender: userProfile?.gender || 'lelaki',
    weight: userProfile?.weight || 48,
    height: userProfile?.height || 155,
    ageGroup: 'remaja',
    health: 'sihat',
    climate: 'tropika',
    occupation: 'sederhana'
  });

  // Profil 2 (Individu B untuk Perbandingan)
  const [profileB, setProfileB] = useState({
    name: 'Pekerja Pejabat Dewasa',
    gender: 'lelaki',
    weight: 70,
    height: 172,
    ageGroup: 'dewasa',
    health: 'sihat',
    climate: 'tropika',
    occupation: 'sedentari'
  });

  const [compareMode, setCompareMode] = useState(false);

  // Kiraan Keperluan Kalori berasaskan 6 Faktor
  const calculateFactorsCalorie = (p) => {
    // 1. Asas BMR (Saiz badan & Jantina)
    let bmr = (10 * p.weight) + (6.25 * p.height) - (5 * (p.ageGroup === 'remaja' ? 14 : p.ageGroup === 'kanak' ? 10 : p.ageGroup === 'dewasa' ? 30 : 65));
    if (p.gender === 'lelaki') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // Gandaan 6 Faktor
    const ageMult = AGE_GROUPS.find(a => a.id === p.ageGroup)?.multiplier || 1.0;
    const healthMult = HEALTH_CONDITIONS.find(h => h.id === p.health)?.multiplier || 1.0;
    const climateMult = CLIMATES.find(c => c.id === p.climate)?.multiplier || 1.0;
    const occMult = OCCUPATIONS.find(o => o.id === p.occupation)?.multiplier || 1.2;

    const totalKcal = Math.round(bmr * ageMult * healthMult * climateMult * (occMult / 1.2));
    const totalKj = Math.round(totalKcal * 4.184);

    return { bmr: Math.round(bmr), totalKcal, totalKj };
  };

  const resA = calculateFactorsCalorie(profileA);
  const resB = calculateFactorsCalorie(profileB);

  return (
    <div className="space-y-6">
      
      {/* Pengenalan Kalkulator 6 Faktor */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standard Pembelajaran: SP 3.2.1</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Kalkulator Kalori 6 Faktor DSKP</h2>
            <p className="text-sm text-slate-400">
              Ketahui bagaimana 6 faktor biologi & persekitaran (Saiz badan, Umur, Jantina, Kesihatan, Iklim, dan Pekerjaan) mempengaruhi keperluan tenaga harian manusia.
            </p>
          </div>

          <button
            onClick={() => { soundFx.playClick(); setCompareMode(!compareMode); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              compareMode 
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-950/40' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{compareMode ? 'Tutup Perbandingan' : 'Bandingkan 2 Individu'}</span>
          </button>
        </div>
      </div>

      {/* Grid Profil & Input 6 Faktor */}
      <div className={`grid grid-cols-1 ${compareMode ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'} gap-6`}>
        
        {/* Kotak Profil A (Murid) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              {compareMode ? 'Individu A (Murid)' : 'Profil 6 Faktor Anda'}
            </span>
            <span className="text-xs text-slate-400 font-mono">SP 3.2.1 KSSM</span>
          </div>

          {/* 1. Saiz Badan (Berat & Tinggi) & Jantina */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Saiz Badan & Jantina:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Jantina</label>
                <select
                  value={profileA.gender}
                  onChange={(e) => setProfileA({ ...profileA, gender: e.target.value })}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="lelaki">Lelaki</option>
                  <option value="perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Berat (kg)</label>
                <input
                  type="number"
                  value={profileA.weight}
                  onChange={(e) => setProfileA({ ...profileA, weight: Number(e.target.value) })}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tinggi (cm)</label>
                <input
                  type="number"
                  value={profileA.height}
                  onChange={(e) => setProfileA({ ...profileA, height: Number(e.target.value) })}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold"
                />
              </div>
            </div>
          </div>

          {/* 2. Peringkat Umur */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              2. Umur:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AGE_GROUPS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { soundFx.playClick(); setProfileA({ ...profileA, ageGroup: a.id }); }}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    profileA.ageGroup === a.id
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>{a.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{a.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Keadaan Kesihatan */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              3. Keadaan Kesihatan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {HEALTH_CONDITIONS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => { soundFx.playClick(); setProfileA({ ...profileA, health: h.id }); }}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    profileA.health === h.id
                      ? 'bg-rose-500/20 border-rose-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>{h.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Iklim & Suhu Persekitaran */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              4. Iklim Persekitaran:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CLIMATES.map((c) => {
                const IconComponent = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => { soundFx.playClick(); setProfileA({ ...profileA, climate: c.id }); }}
                    className={`p-2.5 rounded-xl border text-left text-xs flex items-center gap-2 transition-all ${
                      profileA.climate === c.id
                        ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-amber-400" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Pekerjaan & Aktiviti Fizikal */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              5 & 6. Pekerjaan & Tahap Aktiviti Fizikal:
            </label>
            <div className="space-y-2">
              {OCCUPATIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => { soundFx.playClick(); setProfileA({ ...profileA, occupation: o.id }); }}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all ${
                    profileA.occupation === o.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{o.label}</div>
                  <div className="text-[11px] text-slate-500">{o.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Kotak Keputusan Keperluan Kalori Profil A */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-bold block">Keperluan Tenaga Harian:</span>
            <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-6 h-6 fill-amber-400" />
              <span>{resA.totalKcal}</span>
              <span className="text-sm font-normal text-slate-300">kcal / hari</span>
            </div>
            <div className="text-xs font-mono text-cyan-400">{resA.totalKj} Kilojoule (kJ)</div>
            <p className="text-[11px] text-slate-500 mt-1">BMR asas tubuh: {resA.bmr} kcal</p>
          </div>

        </div>

        {/* Kotak Profil B (Untuk Perbandingan) */}
        {compareMode && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Individu B (Perbandingan)
              </span>
              <span className="text-xs text-slate-400 font-mono">Perbandingan Serentak</span>
            </div>

            {/* Input Individu B */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Jantina</label>
                  <select
                    value={profileB.gender}
                    onChange={(e) => setProfileB({ ...profileB, gender: e.target.value })}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="lelaki">Lelaki</option>
                    <option value="perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Berat (kg)</label>
                  <input
                    type="number"
                    value={profileB.weight}
                    onChange={(e) => setProfileB({ ...profileB, weight: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Tinggi (cm)</label>
                  <input
                    type="number"
                    value={profileB.height}
                    onChange={(e) => setProfileB({ ...profileB, height: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Peringkat Umur</label>
                <select
                  value={profileB.ageGroup}
                  onChange={(e) => setProfileB({ ...profileB, ageGroup: e.target.value })}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  {AGE_GROUPS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Pekerjaan & Tahap Aktiviti</label>
                <select
                  value={profileB.occupation}
                  onChange={(e) => setProfileB({ ...profileB, occupation: e.target.value })}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  {OCCUPATIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Iklim</label>
                <select
                  value={profileB.climate}
                  onChange={(e) => setProfileB({ ...profileB, climate: e.target.value })}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  {CLIMATES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>

            {/* Kotak Keputusan Keperluan Kalori Profil B */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 text-center space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-bold block">Keperluan Tenaga Harian:</span>
              <div className="text-3xl font-black text-cyan-400 flex items-center justify-center gap-1">
                <Flame className="w-6 h-6 fill-cyan-400" />
                <span>{resB.totalKcal}</span>
                <span className="text-sm font-normal text-slate-300">kcal / hari</span>
              </div>
              <div className="text-xs font-mono text-cyan-300">{resB.totalKj} Kilojoule (kJ)</div>
              <p className="text-[11px] text-slate-500 mt-1">BMR asas tubuh: {resB.bmr} kcal</p>
            </div>

            {/* Ulasan Perbezaan Sains DSKP */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-emerald-400 block">Analisis Perbandingan Sains:</span>
              <p>
                Perbezaan tenaga: <strong className="text-white">{Math.abs(resA.totalKcal - resB.totalKcal)} kcal</strong>. 
                {resA.totalKcal > resB.totalKcal 
                  ? ' Individu A memerlukan lebih banyak kalori kerana aktiviti fizikal lebih padat atau faktor umur remaja.' 
                  : ' Individu B memerlukan lebih banyak kalori disebabkan oleh saiz tubuh lebih besar atau beban kerja.'}
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
