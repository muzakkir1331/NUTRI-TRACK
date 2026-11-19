import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  HeartHandshake, 
  TrendingDown, 
  Award,
  Zap
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import { fireConfetti } from '../../utils/confetti';

const SNACK_SWAPS_DATA = [
  {
    id: 'swap1',
    unhealthy: {
      name: 'Keropok Lekor Goreng (5 Batang)',
      emoji: '🥟',
      kcal: 390,
      sugarG: 14,
      fatG: 21,
      badReason: 'Menyerap minyak gorengan rendam yang banyak dan sos cili tinggi gula proses.'
    },
    healthy: {
      name: 'Kacang Kuda Rebus Daun Kari',
      emoji: '🫘',
      kcal: 170,
      sugarG: 3,
      fatG: 3,
      goodReason: 'Kaya dengan protein tumbuhan dan pelawas (serat) yang melancarkan pencernaan tanpa lemak tepu.'
    }
  },
  {
    id: 'swap2',
    unhealthy: {
      name: 'Air Sirap Manis / Air Boba',
      emoji: '🧋',
      kcal: 260,
      sugarG: 38, // 9 sudu teh gula!
      fatG: 8,
      badReason: 'Gula bebas yang melampau menyebabkan lonjakan glukosa darah dan risiko karies gigi serta obesiti.'
    },
    healthy: {
      name: 'Air Kelapa Muda / Air Kosong + Hirisan Lemon',
      emoji: '🥥',
      kcal: 40,
      sugarG: 6,
      fatG: 0,
      goodReason: 'Membekalkan elektrolit semula jadi dan menghidratkan tubuh tanpa membebankan pankreas.'
    }
  },
  {
    id: 'swap3',
    unhealthy: {
      name: 'Roti Sosej & Sos Keju',
      emoji: '🌭',
      kcal: 340,
      sugarG: 8,
      fatG: 18,
      badReason: 'Sosej mengandungi garam natrium dan bahan pengawet nitrit yang tinggi.'
    },
    healthy: {
      name: 'Sandwic Roti Gandum & Telur Rebus',
      emoji: '🥪',
      kcal: 220,
      sugarG: 2,
      fatG: 7,
      goodReason: 'Membekalkan protein berkualiti tinggi dan kolina untuk kecergasan sel otak murid.'
    }
  },
  {
    id: 'swap4',
    unhealthy: {
      name: 'Kerepek Kentang Masin (1 Paket)',
      emoji: '🍟',
      kcal: 280,
      sugarG: 1,
      fatG: 16,
      badReason: 'Tinggi natrium (>550mg) yang boleh meningkatkan tekanan darah dan membebankan buah pinggang.'
    },
    healthy: {
      name: 'Jagung Manis Rebus Cawan',
      emoji: '🌽',
      kcal: 120,
      sugarG: 4,
      fatG: 1.5,
      goodReason: 'Mengandungi antioksidan lutein untuk kesihatan mata dan serat selulosa semula jadi.'
    }
  }
];

export default function HealthySnackSwaps() {
  const [selectedSwap, setSelectedSwap] = useState(SNACK_SWAPS_DATA[0]);

  const caloriesSaved = selectedSwap.unhealthy.kcal - selectedSwap.healthy.kcal;
  const sugarSavedG = selectedSwap.unhealthy.sugarG - selectedSwap.healthy.sugarG;
  const sugarSavedSpoons = +(sugarSavedG / 4).toFixed(1); // 1 sudu teh gula ≈ 4g
  const fatSavedG = selectedSwap.unhealthy.fatG - selectedSwap.healthy.fatG;

  const handleSelect = (swap) => {
    soundFx.playSuccess();
    fireConfetti();
    setSelectedSwap(swap);
  };

  return (
    <div className="space-y-6">
      
      {/* Pengenalan Snek Alternatif */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Standard Pembelajaran: SP 3.2.3 (Amalan Pemakanan Sihat)</span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <HeartHandshake className="w-6 h-6 text-cyan-400" />
          <span>Penjana Cadangan Alternatif Snek Sihat Kantin</span>
        </h2>
        <p className="text-sm text-slate-400">
          Ubah tabiat snek harian anda dengan menggantikan snek tinggi kalori dan gula kepada pilihan lebih berkhasiat tanpa mengorbankan kelazatan.
        </p>
      </div>

      {/* Pilihan Senarai Pertukaran */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SNACK_SWAPS_DATA.map((swap) => (
          <button
            key={swap.id}
            onClick={() => handleSelect(swap)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedSwap.id === swap.id
                ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-2xl mb-1">{swap.unhealthy.emoji} ➔ {swap.healthy.emoji}</div>
            <div className="font-bold text-xs truncate text-slate-200">{swap.unhealthy.name}</div>
            <div className="text-[11px] text-emerald-400 font-semibold">Tukar ke pilihan sihat</div>
          </button>
        ))}
      </div>

      {/* Paparan Perbandingan Sebelum vs Selepas (Side-by-side) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Snek Kurang Sihat (5 Kolum) */}
        <div className="md:col-span-5 bg-gradient-to-b from-rose-950/20 to-slate-950 border border-rose-500/30 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Pilihan Kurang Sihat (Kantin)</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">Merah</span>
          </div>

          <div className="text-center py-3">
            <span className="text-6xl">{selectedSwap.unhealthy.emoji}</span>
            <h4 className="text-xl font-bold text-white mt-2">{selectedSwap.unhealthy.name}</h4>
            <div className="text-2xl font-black text-rose-400 mt-1">{selectedSwap.unhealthy.kcal} kcal</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span>Gula Bebas:</span>
              <strong className="text-rose-400">{selectedSwap.unhealthy.sugarG} g (~{+(selectedSwap.unhealthy.sugarG / 4).toFixed(1)} sudu teh)</strong>
            </div>
            <div className="flex justify-between">
              <span>Jumlah Lemak:</span>
              <strong className="text-rose-400">{selectedSwap.unhealthy.fatG} g</strong>
            </div>
          </div>

          <p className="text-xs text-rose-300/90 italic">
            "{selectedSwap.unhealthy.badReason}"
          </p>
        </div>

        {/* Statistik Penjimatan (2 Kolum) */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 animate-bounce" />
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Kalori Dijimatkan</span>
            <span className="text-2xl font-black text-emerald-400">-{caloriesSaved}</span>
            <span className="text-xs text-slate-500 block">kcal</span>
          </div>

          <div className="pt-2 border-t border-slate-800 w-full">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Gula Dijimatkan</span>
            <span className="text-lg font-bold text-cyan-400">-{sugarSavedSpoons}</span>
            <span className="text-[11px] text-slate-500 block">Sudu Teh</span>
          </div>
        </div>

        {/* Snek Alternatif Sihat (5 Kolum) */}
        <div className="md:col-span-5 bg-gradient-to-b from-emerald-950/20 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Alternatif Disarankan KKM</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Hijau</span>
          </div>

          <div className="text-center py-3">
            <span className="text-6xl">{selectedSwap.healthy.emoji}</span>
            <h4 className="text-xl font-bold text-white mt-2">{selectedSwap.healthy.name}</h4>
            <div className="text-2xl font-black text-emerald-400 mt-1">{selectedSwap.healthy.kcal} kcal</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span>Gula Semula Jadi:</span>
              <strong className="text-emerald-400">{selectedSwap.healthy.sugarG} g</strong>
            </div>
            <div className="flex justify-between">
              <span>Jumlah Lemak:</span>
              <strong className="text-emerald-400">{selectedSwap.healthy.fatG} g (Sangat Rendah)</strong>
            </div>
          </div>

          <p className="text-xs text-emerald-300/90 leading-relaxed">
            "{selectedSwap.healthy.goodReason}"
          </p>
        </div>

      </div>

    </div>
  );
}
