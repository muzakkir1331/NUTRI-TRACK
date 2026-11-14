import React, { useState } from 'react';
import { 
  HeartPulse, 
  Layers, 
  Droplet, 
  ArrowLeft, 
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import ViskingVsVillus from './ViskingVsVillus';
import ThreeSystemsMap from './ThreeSystemsMap';
import FiberWaterTracker from './FiberWaterTracker';
import { soundFx } from '../../utils/soundEffects';

export default function Module6({ onNavigateHome, onAwardStars }) {
  const [activeTab, setActiveTab] = useState('visking');

  const handleTabChange = (tabKey) => {
    soundFx.playClick();
    setActiveTab(tabKey);
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Bar Navigasi Atas & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { soundFx.playClick(); onNavigateHome(); }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Hab Utama</span>
          </button>
          
          <ChevronRight className="w-4 h-4 text-slate-600 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base sm:text-lg">Kumpulan 6</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                SP 3.4.1 – 3.4.3
              </span>
            </div>
            <p className="text-xs text-slate-400">Tiub Visking vs Vilus, Peta 3 Sistem Badan & Penjejak Serat & Hidrasi</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Ganjaran: <strong>3 Bintang Nutrisi</strong></span>
        </div>
      </div>

      {/* Tab Navigasi Kumpulan 6 */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-2xl">
        <button
          onClick={() => handleTabChange('visking')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'visking'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tiub Visking vs Vilus</span>
        </button>

        <button
          onClick={() => handleTabChange('systems')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'systems'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Peta 3 Sistem Badan</span>
        </button>

        <button
          onClick={() => handleTabChange('fiber')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'fiber'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>Penjejak Serat & Air</span>
        </button>
      </div>

      <div className="transition-opacity duration-300">
        {activeTab === 'visking' && <ViskingVsVillus />}
        {activeTab === 'systems' && <ThreeSystemsMap />}
        {activeTab === 'fiber' && <FiberWaterTracker />}
      </div>

      {/* Kad Penutup Modul & Tuntut Bintang */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Selesai Meneroka Kumpulan 6?</span>
          </h4>
          <p className="text-xs text-slate-300">
            Tuntut 3 Bintang Pencapaian anda untuk dimasukkan ke dalam rekod KSSM Ekosistem Kesihatan Sekolah.
          </p>
        </div>
        <button
          onClick={() => onAwardStars(3)}
          className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2 flex-shrink-0"
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>Tuntut 3 Bintang</span>
        </button>
      </div>

    </div>
  );
}
