import React, { useState } from 'react';
import { 
  Utensils, 
  Scale, 
  Zap, 
  ArrowLeft, 
  Sparkles, 
  Award, 
  ChevronRight,
  Box,
  Layers
} from 'lucide-react';
import FoodPyramid3DViewer from './FoodPyramid3DViewer';
import CalorieFactorsCalculator from './CalorieFactorsCalculator';
import HealthyPlateSimulator from './HealthyPlateSimulator';
import EnergyConverter from './EnergyConverter';
import { soundFx } from '../../utils/soundEffects';

export default function Module2({ onNavigateHome, onAwardStars, userProfile }) {
  // Tab aktif: 'pyramid3d' | 'factors' | 'plate' | 'converter'
  const [activeTab, setActiveTab] = useState('pyramid3d');

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
            aria-label="Kembali ke Hab Utama"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Hab Utama</span>
          </button>
          
          <ChevronRight className="w-4 h-4 text-slate-600 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base sm:text-lg">Kumpulan 2</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                SP 3.2.1 & 3.2.2
              </span>
            </div>
            <p className="text-xs text-slate-400">Profil Kalori 6 Faktor, Pinggan Sihat Suku-Suku Separuh & Penukar Unit Tenaga</p>
          </div>
        </div>

        {/* Status Modul & Ganjaran */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Ganjaran: <strong>3 Bintang Nutrisi</strong></span>
        </div>
      </div>

      {/* Tab Navigasi Sub-Modul Kumpulan 2 */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-4xl">
        <button
          onClick={() => handleTabChange('pyramid3d')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'pyramid3d'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 border border-amber-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Box className={`w-4 h-4 ${activeTab === 'pyramid3d' ? 'text-slate-950 animate-pulse' : 'text-amber-400'}`} />
          <span>3D Piramid Makanan</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-950/20 text-slate-950 font-extrabold border border-slate-950/20">
            3D WebGL
          </span>
        </button>

        <button
          onClick={() => handleTabChange('factors')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'factors'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Kalkulator 6 Faktor</span>
        </button>

        <button
          onClick={() => handleTabChange('plate')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'plate'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Pinggan Sihat</span>
        </button>

        <button
          onClick={() => handleTabChange('converter')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'converter'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Penukar Tenaga</span>
        </button>
      </div>

      {/* Kandungan Tab Aktif */}
      <div className="transition-opacity duration-300">
        {activeTab === 'pyramid3d' && <FoodPyramid3DViewer />}
        {activeTab === 'factors' && <CalorieFactorsCalculator userProfile={userProfile} />}
        {activeTab === 'plate' && <HealthyPlateSimulator onSwitchTo3D={() => handleTabChange('pyramid3d')} />}
        {activeTab === 'converter' && <EnergyConverter />}
      </div>

      {/* Kad Penutup Modul & Tuntut Bintang */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Selesai Meneroka Kumpulan 2?</span>
          </h4>
          <p className="text-xs text-slate-300">
            Tuntut 3 Bintang Pencapaian anda untuk dimasukkan ke dalam rekod KSSM Ekosistem Kesihatan Sekolah.
          </p>
        </div>
        <button
          onClick={() => onAwardStars(3)}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 flex-shrink-0"
        >
          <Award className="w-4 h-4 text-slate-950" />
          <span>Tuntut 3 Bintang</span>
        </button>
      </div>

    </div>
  );
}
