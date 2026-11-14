import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowLeft, 
  Award,
  ChevronRight
} from 'lucide-react';
import CanteenCatalog from './CanteenCatalog';
import TrafficLightSystem from './TrafficLightSystem';
import HealthySnackSwaps from './HealthySnackSwaps';
import { soundFx } from '../../utils/soundEffects';

export default function Module3({ onNavigateHome, onAwardStars }) {
  const [activeTab, setActiveTab] = useState('catalog');

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
              <span className="font-bold text-white text-base sm:text-lg">Kumpulan 3</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                SP 3.2.2 & 3.2.3
              </span>
            </div>
            <p className="text-xs text-slate-400">Audit Kantin, Sistem Lampu Isyarat Kesihatan & Snek Alternatif Sihat</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Ganjaran: <strong>3 Bintang Nutrisi</strong></span>
        </div>
      </div>

      {/* Tab Navigasi Kumpulan 3 */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-2xl">
        <button
          onClick={() => handleTabChange('catalog')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'catalog'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Katalog Fakta Nutrisi</span>
        </button>

        <button
          onClick={() => handleTabChange('traffic')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'traffic'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sistem Lampu Isyarat</span>
        </button>

        <button
          onClick={() => handleTabChange('swaps')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'swaps'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Snek Alternatif Sihat</span>
        </button>
      </div>

      <div className="transition-opacity duration-300">
        {activeTab === 'catalog' && <CanteenCatalog />}
        {activeTab === 'traffic' && <TrafficLightSystem />}
        {activeTab === 'swaps' && <HealthySnackSwaps />}
      </div>

      {/* Kad Penutup Modul & Tuntut Bintang */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Selesai Meneroka Kumpulan 3?</span>
          </h4>
          <p className="text-xs text-slate-300">
            Tuntut 3 Bintang Pencapaian anda untuk dimasukkan ke dalam rekod KSSM Ekosistem Kesihatan Sekolah.
          </p>
        </div>
        <button
          onClick={() => onAwardStars(3)}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 flex-shrink-0"
        >
          <Award className="w-4 h-4 text-slate-950" />
          <span>Tuntut 3 Bintang</span>
        </button>
      </div>

    </div>
  );
}
