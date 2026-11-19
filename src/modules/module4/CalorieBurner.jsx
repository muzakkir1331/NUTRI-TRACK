import React, { useState } from 'react';
import { 
  Flame, 
  Activity, 
  Sparkles, 
  Timer, 
  Bike, 
  Zap, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const SPORTS_ACTIVITIES = [
  { id: 'running', name: 'Larian Merentas Desa', ratePerMin: 11, icon: '🏃', desc: 'Aktiviti aerobik intensiti tinggi' },
  { id: 'football', name: 'Bola Sepak / Futsal', ratePerMin: 9.5, icon: '⚽', desc: 'Pergerakan kardiovaskular berterusan' },
  { id: 'badminton', name: 'Bermain Badminton', ratePerMin: 8, icon: '🏸', desc: 'Sukan ketangkasan & kardio' },
  { id: 'cycling', name: 'Berbasikal ke Sekolah', ratePerMin: 7, icon: '🚴', desc: 'Pengangkutan aktif harian' },
  { id: 'stairs', name: 'Menaiki Tangga Sekolah', ratePerMin: 10, icon: '🪜', desc: 'Senaman bebanan kaki yang efektif' },
  { id: 'sweeping', name: 'Menyapu Kelas / Gotong-royong', ratePerMin: 4, icon: '🧹', desc: 'Aktiviti fizikal ringan sekolah' }
];

const SNACK_OPTIONS = [
  { id: 'karipap', name: '2 Biji Karipap Kentang', emoji: '🥟', kcal: 280 },
  { id: 'nasi_lemak', name: '1 Bungkus Nasi Lemak', emoji: '🍚', kcal: 390 },
  { id: 'air_boba', name: '1 Cawan Air Manis / Boba', emoji: '🧋', kcal: 290 },
  { id: 'donut', name: '1 Biji Donut Coklat', emoji: '🍩', kcal: 260 },
  { id: 'mee_goreng', name: '1 Pinggan Mee Goreng Kantin', emoji: '🍝', kcal: 540 }
];

export default function CalorieBurner() {
  const [selectedSnack, setSelectedSnack] = useState(SNACK_OPTIONS[0]);
  const [selectedSport, setSelectedSport] = useState(SPORTS_ACTIVITIES[0]);

  // Kiraan Minit Yang Diperlukan
  const minutesNeeded = Math.round(selectedSnack.kcal / selectedSport.ratePerMin);
  const stepsEquivalent = Math.round(selectedSnack.kcal * 22); // Anggaran 1 kcal ≈ 20-25 langkah kaki

  return (
    <div className="space-y-6">
      
      {/* Pengenalan Pembakar Kalori */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Standard Pembelajaran: SP 3.2.3</span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Flame className="w-6 h-6 text-rose-400" />
          <span>Kalkulator Bakar Kalori Aktiviti Sukan & PJ Sekolah</span>
        </h2>
        <p className="text-sm text-slate-400">
          Uji berapa minit aktiviti fizikal atau sukan yang diperlukan untuk membakar kalori bagi snek yang anda makan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolum Kiri: Pilih Snek Makanan (5 Kolum) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block border-b border-slate-800 pb-2">
            1. Pilih Snek Yang Dimakan:
          </span>

          <div className="space-y-2">
            {SNACK_OPTIONS.map((snack) => (
              <button
                key={snack.id}
                onClick={() => { soundFx.playClick(); setSelectedSnack(snack); }}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedSnack.id === snack.id
                    ? 'bg-rose-500/20 border-rose-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{snack.emoji}</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-200">{snack.name}</span>
                </div>
                <span className="text-xs font-black text-amber-400 font-mono">{snack.kcal} kcal</span>
              </button>
            ))}
          </div>
        </div>

        {/* Kolum Kanan: Pilih Aktiviti Sukan & Keputusan Masa (7 Kolum) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block border-b border-slate-800 pb-2">
            2. Pilih Aktiviti Fizikal / Sukan:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SPORTS_ACTIVITIES.map((sport) => (
              <button
                key={sport.id}
                onClick={() => { soundFx.playClick(); setSelectedSport(sport); }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedSport.id === sport.id
                    ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-2xl mb-1">{sport.icon}</div>
                <div className="font-bold text-xs truncate text-slate-200">{sport.name}</div>
                <div className="text-[10px] text-cyan-400 mt-0.5">~{sport.ratePerMin} kcal/min</div>
              </button>
            ))}
          </div>

          {/* Kotak Keputusan Masa Yang Diperlukan */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-950 to-rose-950/20 border border-rose-500/30 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Masa Diperlukan Untuk Membakar {selectedSnack.name} ({selectedSnack.kcal} kcal):
            </span>

            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl font-black text-rose-400">{minutesNeeded}</span>
              <span className="text-xl font-bold text-white text-left">
                Minit <br />
                <span className="text-xs font-normal text-slate-400">{selectedSport.name}</span>
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-around text-xs text-slate-400">
              <div>
                <span className="block font-bold text-white font-mono">{stepsEquivalent}</span>
                <span>Langkah Kaki Setara</span>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <span className="block font-bold text-cyan-400 font-mono">
                  {Math.round(selectedSnack.kcal * 4.184)} kJ
                </span>
                <span>Tenaga Dibakar</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <strong>Mesej Kesihatan:</strong> Untuk membakar satu hidangan makanan ringan seperti biskut atau minuman manis memerlukan usaha fizikal yang agak lama. Oleh itu, kawalan kuantiti makanan adalah kunci utama menjaga berat badan seimbang!
          </div>

        </div>

      </div>

    </div>
  );
}
