import React, { useState } from 'react';
import { 
  Utensils, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Award, 
  Flame, 
  Layers, 
  Info, 
  Droplet, 
  ChevronRight,
  Box,
  ArrowRight
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import { fireConfetti } from '../../utils/confetti';

// Pilihan Makanan Tempatan Mengikut Bahagian Pinggan Sihat
const PANTRY_ITEMS = {
  carbs: [
    { id: 'c1', name: 'Nasi Beras Perang', emoji: '🌾', kcal: 150, desc: 'Karbohidrat kompleks kaya pelawas' },
    { id: 'c2', name: 'Nasi Putih Sukatan 1 Cawan', emoji: '🍚', kcal: 200, desc: 'Sumber tenaga utama Malaysia' },
    { id: 'c3', name: 'Ubi Keledek Rebus', emoji: '🍠', kcal: 130, desc: 'Indeks glisemik rendah & vitamin A' },
    { id: 'c4', name: 'Roti Bijirin Penuh (2 Keping)', emoji: '🍞', kcal: 140, desc: 'Serat bran pemakanan sihat' }
  ],
  protein: [
    { id: 'p1', name: 'Ikan Kembung Bakar', emoji: '🐟', kcal: 160, desc: 'Kaya asid lemak Omega-3 & protein' },
    { id: 'p2', name: 'Dada Ayam Panggang', emoji: '🍗', kcal: 180, desc: 'Protein tanpa lemak tepu tinggi' },
    { id: 'p3', name: 'Telur Rebus (1 Biji)', emoji: '🥚', kcal: 75, desc: 'Protein standard rujukan biologi' },
    { id: 'p4', name: 'Tempe & Tauhu Kukus', emoji: '🥢', kcal: 120, desc: 'Protein tumbuhan & kalsium' }
  ],
  veggies: [
    { id: 'v1', name: 'Ulam Raja & Timun Segar', emoji: '🥒', kcal: 25, desc: 'Kaya antioksidan & air' },
    { id: 'v2', name: 'Bayam Celur Bawang Putih', emoji: '🥬', kcal: 35, desc: 'Zat besi (ferum) & vitamin K' },
    { id: 'v3', name: 'Bendi Rebus / Bendi Celur', emoji: '🌿', kcal: 30, desc: 'Serat berlendir pengawal glukosa' }
  ],
  fruits: [
    { id: 'f1', name: 'Buah Betik Potong', emoji: '🍈', kcal: 50, desc: 'Vitamin C & enzim papain' },
    { id: 'f2', name: 'Pisang Berangan', emoji: '🍌', kcal: 90, desc: 'Kaya mineral kalium' },
    { id: 'f3', name: 'Tembikai Merah Potong', emoji: '🍉', kcal: 45, desc: 'Hidrasi tinggi (92% air)' }
  ]
};

// Data Piramid Makanan Malaysia (4 Aras)
const PYRAMID_LEVELS = [
  {
    level: 4,
    name: 'Aras 4: Lemak, Minyak, Gula & Garam',
    slogan: 'MAKAN PALING SEDIKIT (HADKAN)',
    servings: 'Minyak < 5 sudu teh, Gula < 10 sudu teh, Garam < 1 sudu teh sehari',
    color: 'border-rose-500 bg-rose-950/30 text-rose-300',
    examples: 'Minyak masak, mentega, santan pekat, krimer manis, kerepek masin',
    risk: 'Pengambilan berlebihan meningkatkan risiko kegendutan, hipertensi dan penyakit jantung.'
  },
  {
    level: 3,
    name: 'Aras 3: Ikan, Ayam, Daging, Telur, Kekacang & Susu',
    slogan: 'MAKAN SEDERHANA',
    servings: '1 sajian ikan, 1-2 sajian ayam/daging/telur, 1-2 sajian susu/produk tenusu sehari',
    color: 'border-amber-500 bg-amber-950/30 text-amber-300',
    examples: 'Ikan kembung, ayam, daging tanpa lemak, tempe, tauhu, susu segar, yogurt',
    risk: 'Perlu untuk pembinaan sel baru, enzim, dan pembaikan tisu badan.'
  },
  {
    level: 2,
    name: 'Aras 2: Nasi, Mi, Roti, Bijirin & Ubi',
    slogan: 'MAKAN BANYAK (MENGIKUT KEPERLUAN)',
    servings: '3 hingga 5 sajian sehari (pilih bijirin penuh)',
    color: 'border-yellow-500 bg-yellow-950/30 text-yellow-300',
    examples: 'Beras perang, roti gandum penuh, oat, ubi keledek, jagung manis',
    risk: 'Membekalkan tenaga utama glukosa untuk aktiviti harian dan fungsi otak.'
  },
  {
    level: 1,
    name: 'Aras 1: Sayur-sayuran dan Buah-buahan',
    slogan: 'MAKAN PALING BANYAK (DASAR PIRAMID)',
    servings: 'Sekurang-kurangnya 3 sajian sayur-sayuran & 2 sajian buah-buahan setiap hari',
    color: 'border-emerald-500 bg-emerald-950/30 text-emerald-300',
    examples: 'Bayam, sawi, bendi, ulam-ulaman, betik, pisang, jambu batu, epal',
    risk: 'Kaya dengan vitamin, mineral dan pelawas untuk mencegah sembelit dan menguatkan imuniti.'
  }
];

export default function HealthyPlateSimulator({ onSwitchTo3D }) {
  const [activeTab, setActiveTab] = useState('plate'); // 'plate' | 'pyramid'

  // Pilihan Semasa di Pinggan Murid
  const [selectedCarb, setSelectedCarb] = useState(null);
  const [selectedProtein, setSelectedProtein] = useState(null);
  const [selectedVeggie, setSelectedVeggie] = useState(null);
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [hasWater, setHasWater] = useState(true);

  // Penilaian Keseimbangan Pinggan
  const evaluatePlate = () => {
    let score = 0;
    const checks = [];

    if (selectedCarb) {
      score += 25;
      checks.push('Suku Karbohidrat diisi');
    }
    if (selectedProtein) {
      score += 25;
      checks.push('Suku Protein diisi');
    }
    if (selectedVeggie) {
      score += 25;
      checks.push('Sayur-sayuran diisi');
    }
    if (selectedFruit) {
      score += 25;
      checks.push('Buah-buahan diisi');
    }

    const totalKcal = (selectedCarb?.kcal || 0) + (selectedProtein?.kcal || 0) + (selectedVeggie?.kcal || 0) + (selectedFruit?.kcal || 0);

    return { score, checks, totalKcal };
  };

  const plateStatus = evaluatePlate();

  // Tetapkan Pinggan Ideal Contoh KKM
  const handleSetIdealPlate = () => {
    soundFx.playSuccess();
    fireConfetti();
    setSelectedCarb(PANTRY_ITEMS.carbs[0]);
    setSelectedProtein(PANTRY_ITEMS.protein[0]);
    setSelectedVeggie(PANTRY_ITEMS.veggies[0]);
    setSelectedFruit(PANTRY_ITEMS.fruits[0]);
    setHasWater(true);
  };

  const handleResetPlate = () => {
    soundFx.playClick();
    setSelectedCarb(null);
    setSelectedProtein(null);
    setSelectedVeggie(null);
    setSelectedFruit(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Pengenalan Simulator Pinggan Sihat */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standard Pembelajaran: SP 3.2.1 & 3.2.2</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Utensils className="w-6 h-6 text-emerald-400" />
              <span>Simulator Pinggan Sihat Malaysia & Piramid Makanan</span>
            </h2>
            <p className="text-sm text-slate-400">
              Kuasai konsep gizi seimbang Kementerian Kesihatan Malaysia (KKM): Prinsip <strong>Suku-Suku Separuh</strong> dan 4 aras Piramid Makanan.
            </p>
          </div>

          {/* Suis Tab Pinggan Sihat vs Piramid Makanan */}
          <div className="flex flex-wrap items-center gap-2">
            {onSwitchTo3D && (
              <button
                onClick={() => { soundFx.playClick(); onSwitchTo3D(); }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center gap-2 shadow-lg shadow-amber-500/20 border border-amber-400/40 transition-all hover:scale-105"
              >
                <Box className="w-4 h-4 text-slate-950 animate-pulse" />
                <span>Buka Piramid 3D WebGL</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            )}

            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                onClick={() => { soundFx.playClick(); setActiveTab('plate'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'plate'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pinggan Sihat
              </button>
              <button
                onClick={() => { soundFx.playClick(); setActiveTab('pyramid'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'pyramid'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Piramid Makanan (2D)
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'plate' ? (
        /* Paparan Pinggan Sihat Malaysia */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Kolum Visual Pinggan Sihat Maya (5 Kolum) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between space-y-6">
            
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Pinggan Sihat Maya</span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                {plateStatus.totalKcal} kcal
              </span>
            </div>

            {/* Ilustrasi Pinggan Suku-Suku Separuh */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-slate-700 bg-slate-950 shadow-2xl p-2 flex flex-col overflow-hidden">
              
              {/* Separuh Atas: Dibahagi dua kepada Suku Karbohidrat & Suku Protein */}
              <div className="h-1/2 w-full flex border-b-2 border-dashed border-emerald-500/50">
                
                {/* Suku 1: Karbohidrat (Kiri Atas) */}
                <div 
                  className={`w-1/2 h-full border-r-2 border-dashed border-emerald-500/50 p-2 flex flex-col items-center justify-center text-center transition-all ${
                    selectedCarb ? 'bg-amber-950/25' : 'bg-slate-900/40 hover:bg-slate-900/60'
                  }`}
                >
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">SUKU (25%)</span>
                  <span className="text-xs font-bold text-slate-300">Karbohidrat</span>
                  {selectedCarb ? (
                    <div className="mt-1 animate-fadeIn">
                      <span className="text-2xl">{selectedCarb.emoji}</span>
                      <p className="text-[11px] font-semibold text-white truncate max-w-[90px]">{selectedCarb.name}</p>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 italic mt-1">Kosong</span>
                  )}
                </div>

                {/* Suku 2: Protein (Kanan Atas) */}
                <div 
                  className={`w-1/2 h-full p-2 flex flex-col items-center justify-center text-center transition-all ${
                    selectedProtein ? 'bg-emerald-950/25' : 'bg-slate-900/40 hover:bg-slate-900/60'
                  }`}
                >
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">SUKU (25%)</span>
                  <span className="text-xs font-bold text-slate-300">Protein</span>
                  {selectedProtein ? (
                    <div className="mt-1 animate-fadeIn">
                      <span className="text-2xl">{selectedProtein.emoji}</span>
                      <p className="text-[11px] font-semibold text-white truncate max-w-[90px]">{selectedProtein.name}</p>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 italic mt-1">Kosong</span>
                  )}
                </div>

              </div>

              {/* Separuh Bawah: Sayur-sayuran dan Buah-buahan (50%) */}
              <div 
                className={`h-1/2 w-full p-2 flex flex-col items-center justify-center text-center transition-all ${
                  (selectedVeggie || selectedFruit) ? 'bg-teal-950/20' : 'bg-slate-900/30'
                }`}
              >
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">SEPARUH (50%)</span>
                <span className="text-xs font-bold text-slate-300">Sayur-sayuran & Buah-buahan</span>
                
                <div className="flex items-center justify-center gap-4 mt-1">
                  <div className="text-center">
                    {selectedVeggie ? (
                      <div>
                        <span className="text-xl">{selectedVeggie.emoji}</span>
                        <p className="text-[10px] font-medium text-slate-300">{selectedVeggie.name}</p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500">Pilih Sayur</span>
                    )}
                  </div>

                  <div className="text-center border-l border-slate-800 pl-3">
                    {selectedFruit ? (
                      <div>
                        <span className="text-xl">{selectedFruit.emoji}</span>
                        <p className="text-[10px] font-medium text-slate-300">{selectedFruit.name}</p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500">Pilih Buah</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Tambahan Segelas Air Kosong */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <Droplet className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span className="text-slate-300">Segelas Air Kosong (0 kcal)</span>
              <span className="text-[11px] text-emerald-400 font-bold ml-auto">Disarankan KKM</span>
            </div>

            {/* Bar Skor Keseimbangan */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Skor Keseimbangan Nutrisi:</span>
                <span className="font-extrabold text-emerald-400 text-sm">{plateStatus.score}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${plateStatus.score}%` }}
                />
              </div>
            </div>

            {/* Butang Tindakan */}
            <div className="w-full flex items-center gap-2">
              <button
                onClick={handleSetIdealPlate}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Cadangan Pinggan Ideal KKM
              </button>
              <button
                onClick={handleResetPlate}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs"
                title="Kosongkan Pinggan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Kolum Pilihan Pantri Makanan Tempatan (7 Kolum) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Bahagian 1: Suku Karbohidrat */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">1</span>
                Pilih Suku Karbohidrat (Tenaga Segera):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PANTRY_ITEMS.carbs.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { soundFx.playClick(); setSelectedCarb(c); }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedCarb?.id === c.id
                        ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-lg">{c.emoji}</div>
                    <div className="truncate font-semibold">{c.name}</div>
                    <div className="text-[10px] text-amber-400 font-mono">{c.kcal} kcal</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bahagian 2: Suku Protein */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
                Pilih Suku Protein (Bina Otot & Sel):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PANTRY_ITEMS.protein.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { soundFx.playClick(); setSelectedProtein(p); }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedProtein?.id === p.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-lg">{p.emoji}</div>
                    <div className="truncate font-semibold">{p.name}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">{p.kcal} kcal</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bahagian 3: Separuh Sayur & Buah */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">3</span>
                Pilih Separuh Pinggan: Sayur-sayuran & Buah-buahan (Vitamin & Serat):
              </span>

              {/* Pilihan Sayur */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">A. Sayur-sayuran:</span>
                <div className="grid grid-cols-3 gap-2">
                  {PANTRY_ITEMS.veggies.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => { soundFx.playClick(); setSelectedVeggie(v); }}
                      className={`p-2 rounded-xl border text-left text-xs transition-all ${
                        selectedVeggie?.id === v.id
                          ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-base">{v.emoji}</div>
                      <div className="truncate">{v.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pilihan Buah */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">B. Buah-buahan Segar:</span>
                <div className="grid grid-cols-3 gap-2">
                  {PANTRY_ITEMS.fruits.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => { soundFx.playClick(); setSelectedFruit(f); }}
                      className={`p-2 rounded-xl border text-left text-xs transition-all ${
                        selectedFruit?.id === f.id
                          ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="text-base">{f.emoji}</div>
                      <div className="truncate">{f.name}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Ulasan Kesihatan Pinggan */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Status Keputusan Pinggan Sihat:
              </span>
              <p className="text-slate-300">
                {plateStatus.score === 100 
                  ? 'Tahniah! Pinggan anda memenuhi piawaian Suku-Suku Separuh Kementerian Kesihatan Malaysia secara sempurna!' 
                  : `Pinggan belum lengkap (${plateStatus.score}%). Pastikan Suku Karbohidrat, Suku Protein, serta Separuh Sayur dan Buah diisi sepenuhnya.`}
              </p>
            </div>

          </div>

        </div>
      ) : (
        /* Paparan Piramid Makanan Malaysia (4 Aras) */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Garis Panduan Diet Malaysia (KKM & WHO)
            </span>
            <h3 className="text-2xl font-bold text-white">4 Aras Piramid Makanan Malaysia</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Piramid makanan ialah panduan visual untuk memilih kuantiti makanan harian yang seimbang daripada 7 kelas makanan.
            </p>
          </div>

          {/* Piramid Interaktif */}
          <div className="max-w-3xl mx-auto space-y-3">
            {PYRAMID_LEVELS.map((pl) => (
              <div
                key={pl.level}
                className={`p-5 rounded-2xl border ${pl.color} transition-all hover:scale-[1.01] shadow-lg`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
                  <div className="font-extrabold text-base text-white">{pl.name}</div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">{pl.slogan}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-white/60 block font-semibold mb-0.5">Saranan Sajian Harian:</span>
                    <p className="text-white font-medium">{pl.servings}</p>
                  </div>
                  <div>
                    <span className="text-white/60 block font-semibold mb-0.5">Contoh Makanan:</span>
                    <p className="text-white/90">{pl.examples}</p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-white/80">
                  <strong>Penerangan Sains DSKP:</strong> {pl.risk}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
