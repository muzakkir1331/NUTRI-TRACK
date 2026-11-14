import React, { useState } from 'react';
import { 
  Zap, 
  Flame, 
  ArrowRightLeft, 
  Sparkles, 
  Calculator, 
  Activity, 
  Lightbulb, 
  BookOpen,
  Info
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function EnergyConverter() {
  const [activeTab, setActiveTab] = useState('converter'); // 'converter' | 'macronutrient'

  // Nilai Penukar Kalori <-> kJ
  const [inputKcal, setInputKcal] = useState(250);
  const [inputKj, setInputKj] = useState(1046);

  // Nilai Input Label Makronutrien
  const [carbsG, setCarbsG] = useState(24);
  const [proteinG, setProteinG] = useState(8);
  const [fatG, setFatG] = useState(6);

  // Tukar kcal -> kJ
  const handleKcalChange = (val) => {
    const num = Math.max(0, Number(val));
    setInputKcal(num);
    setInputKj(Math.round(num * 4.184));
  };

  // Tukar kJ -> kcal
  const handleKjChange = (val) => {
    const num = Math.max(0, Number(val));
    setInputKj(num);
    setInputKcal(Math.round(num / 4.184));
  };

  // Pengiraan Nilai Tenaga Makronutrien KSSM Sains
  // 1g Karbohidrat = 16.7 kJ
  // 1g Protein = 16.7 kJ
  // 1g Lemak = 37.6 kJ
  const carbsKj = +(carbsG * 16.7).toFixed(1);
  const proteinKj = +(proteinG * 16.7).toFixed(1);
  const fatKj = +(fatG * 37.6).toFixed(1);
  const totalKj = +(carbsKj + proteinKj + fatKj).toFixed(1);
  const totalKcal = Math.round(totalKj / 4.184);

  // Peratusan Sumbangan Tenaga
  const carbsPct = totalKj > 0 ? Math.round((carbsKj / totalKj) * 100) : 0;
  const proteinPct = totalKj > 0 ? Math.round((proteinKj / totalKj) * 100) : 0;
  const fatPct = totalKj > 0 ? Math.round((fatKj / totalKj) * 100) : 0;

  // Setara Tenaga Fizikal Dunia Sebenar
  const runningMins = Math.round(inputKcal / 10);
  const badmintonMins = Math.round(inputKcal / 8);
  const bulbHours = +(inputKj / 360).toFixed(1); // Mentol 100W menggunakan 360 kJ/jam

  return (
    <div className="space-y-6">
      
      {/* Header Penukar Tenaga */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standard Pembelajaran: SP 3.2.2</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" />
              <span>Penukar Unit Tenaga & Kalkulator Nilai Tenaga Makanan</span>
            </h2>
            <p className="text-sm text-slate-400">
              Pelajari hubungan antara Kalori (kcal) dan Kilojoule (kJ), serta cara menghitung nilai tenaga daripada label makanan mengikut formula Sains Tingkatan 2.
            </p>
          </div>

          {/* Suis Tab */}
          <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              onClick={() => { soundFx.playClick(); setActiveTab('converter'); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'converter'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Penukar kcal ⟷ kJ
            </button>
            <button
              onClick={() => { soundFx.playClick(); setActiveTab('macronutrient'); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'macronutrient'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kalkulator Makronutrien Label
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'converter' ? (
        /* Tab 1: Penukar Pantas Dua Hala kcal <-> kJ */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel Interaktif Input Dua Hala (6 Kolum) */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4" />
                Penukaran Dua Hala Segera
              </span>
              <span className="text-xs text-slate-400 font-mono">1 kcal ≈ 4.184 kJ</span>
            </div>

            {/* Input Kalori (kcal) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Nilai Kalori (kcal):</span>
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={5000}
                  value={inputKcal}
                  onChange={(e) => handleKcalChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-2xl font-black text-amber-400 focus:outline-none focus:border-amber-500"
                />
                <span className="text-sm font-bold text-slate-400">kcal</span>
              </div>
              <input
                type="range"
                min={0}
                max={2000}
                step={25}
                value={inputKcal}
                onChange={(e) => handleKcalChange(e.target.value)}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Input Kilojoule (kJ) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Nilai Tenaga Kilojoule (kJ):</span>
                <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={20000}
                  value={inputKj}
                  onChange={(e) => handleKjChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-2xl font-black text-cyan-400 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-sm font-bold text-slate-400">kJ</span>
              </div>
              <input
                type="range"
                min={0}
                max={8400}
                step={100}
                value={inputKj}
                onChange={(e) => handleKjChange(e.target.value)}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Formula KSSM Sains */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-slate-300">Piawaian Sukatan Sains KSSM:</span>
              <p>• 1 kalori (kcal) = 4.2 kilojoule (kJ) dalam anggaran mudah bilik darjah.</p>
              <p>• 1 kilojoule (kJ) = 1,000 joule (J).</p>
            </div>

          </div>

          {/* Panel Setara Tenaga Fizikal Dunia Sebenar (6 Kolum) */}
          <div className="lg:col-span-6 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  Setara Tenaga Fizikal Dunia Sebenar
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  Tenaga sebanyak <strong className="text-white">{inputKcal} kcal ({inputKj} kJ)</strong> mencukupi untuk:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                  <span className="text-3xl p-2 rounded-xl bg-slate-900">🏃</span>
                  <div>
                    <span className="text-xs text-slate-400 block font-bold">Larian Sukan Sekolah:</span>
                    <span className="text-xl font-extrabold text-white">{runningMins} Minit</span>
                    <span className="text-xs text-slate-500 block">Larian sederhana padang sekolah</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                  <span className="text-3xl p-2 rounded-xl bg-slate-900">🏸</span>
                  <div>
                    <span className="text-xs text-slate-400 block font-bold">Bermain Badminton:</span>
                    <span className="text-xl font-extrabold text-white">{badmintonMins} Minit</span>
                    <span className="text-xs text-slate-500 block">Aktiviti waktu riadah petang</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                  <span className="text-3xl p-2 rounded-xl bg-slate-950">💡</span>
                  <div>
                    <span className="text-xs text-slate-400 block font-bold">Tenaga Elektrik Setara:</span>
                    <span className="text-xl font-extrabold text-white">{bulbHours} Jam</span>
                    <span className="text-xs text-slate-500 block">Membekalkan elektrik mentol lampu 100W</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300">
              <span className="font-bold text-emerald-400">Konsep Sains:</span> Tenaga kimia yang tersimpan dalam ikatan molekul makanan dibebaskan semasa proses respirasi sel di dalam mitokondria untuk melakukan kerja biologi.
            </div>

          </div>

        </div>
      ) : (
        /* Tab 2: Kalkulator Makronutrien Label Makanan */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Input Gram Makronutrien (5 Kolum) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" />
                Data Fakta Nutrisi Makanan
              </span>
              <p className="text-xs text-slate-400 mt-1">Masukkan gram (g) daripada label bungkusan makanan:</p>
            </div>

            {/* Karbohidrat */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">Karbohidrat (16.7 kJ/g)</span>
                <span className="font-mono text-slate-400">{carbsKj} kJ</span>
              </div>
              <input
                type="number"
                min={0}
                value={carbsG}
                onChange={(e) => setCarbsG(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                placeholder="Gram Karbohidrat"
              />
            </div>

            {/* Protein */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400">Protein (16.7 kJ/g)</span>
                <span className="font-mono text-slate-400">{proteinKj} kJ</span>
              </div>
              <input
                type="number"
                min={0}
                value={proteinG}
                onChange={(e) => setProteinG(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                placeholder="Gram Protein"
              />
            </div>

            {/* Lemak */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-400">Lemak (37.6 kJ/g)</span>
                <span className="font-mono text-slate-400">{fatKj} kJ</span>
              </div>
              <input
                type="number"
                min={0}
                value={fatG}
                onChange={(e) => setFatG(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-rose-500"
                placeholder="Gram Lemak"
              />
            </div>

            {/* Contoh Pratetap Cepat */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <span className="text-[11px] text-slate-500 uppercase font-bold block">Uji Contoh Label Makanan:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setCarbsG(18); setProteinG(2); setFatG(6); soundFx.playClick(); }}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-white"
                >
                  Biskut Coklat
                </button>
                <button
                  onClick={() => { setCarbsG(45); setProteinG(18); setFatG(12); soundFx.playClick(); }}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-white"
                >
                  Nasi Ayam
                </button>
                <button
                  onClick={() => { setCarbsG(25); setProteinG(7); setFatG(1); soundFx.playClick(); }}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 hover:text-white"
                >
                  Kacang Kuda
                </button>
              </div>
            </div>

          </div>

          {/* Pengiraan Langkah Demi Langkah & Graf Sumbangan (7 Kolum) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Langkah Pengiraan Nilai Tenaga DSKP Sains Tingkatan 2
              </span>
            </div>

            {/* Formula Terperinci */}
            <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
              <p className="text-slate-400">Jumlah Tenaga (kJ) =</p>
              <p className="pl-3">({carbsG}g × 16.7 kJ) + ({proteinG}g × 16.7 kJ) + ({fatG}g × 37.6 kJ)</p>
              <p className="pl-3">= <span className="text-amber-400">{carbsKj} kJ</span> + <span className="text-emerald-400">{proteinKj} kJ</span> + <span className="text-rose-400">{fatKj} kJ</span></p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold text-sm">
                <span className="text-white">= {totalKj} Kilojoule (kJ)</span>
                <span className="text-amber-400">≈ {totalKcal} Kalori (kcal)</span>
              </div>
            </div>

            {/* Peratusan Sumbangan Tenaga */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Pecahan Peratusan Sumbangan Tenaga Makanan:
              </span>

              {/* Bar Komposit */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div style={{ width: `${carbsPct}%` }} className="bg-amber-400 h-full" title="Karbohidrat" />
                <div style={{ width: `${proteinPct}%` }} className="bg-emerald-400 h-full" title="Protein" />
                <div style={{ width: `${fatPct}%` }} className="bg-rose-400 h-full" title="Lemak" />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-bold block">{carbsPct}%</span>
                  <span className="text-[10px] text-slate-400">Karbohidrat</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400 font-bold block">{proteinPct}%</span>
                  <span className="text-[10px] text-slate-400">Protein</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-rose-400 font-bold block">{fatPct}%</span>
                  <span className="text-[10px] text-slate-400">Lemak</span>
                </div>
              </div>
            </div>

            {/* Inferens Sains */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
              <strong className="text-amber-400">Ulasan Sains:</strong> Lemak mempunyai nilai tenaga dua kali ganda lebih tinggi ($37.6\text{ kJ/g}$) berbanding karbohidrat dan protein ($16.7\text{ kJ/g}$) kerana mengandungi nisbah atom hidrogen dan karbon yang lebih tinggi berbanding oksigen.
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
