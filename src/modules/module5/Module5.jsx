import React, { useState } from 'react';
import { 
  GitBranch, 
  Scissors, 
  Thermometer, 
  ArrowLeft, 
  Award,
  ChevronRight,
  Box,
  Sparkles,
  Zap
} from 'lucide-react';
import Digestion3DViewer from './Digestion3DViewer';
import Enzyme3DViewer from './Enzyme3DViewer';
import DigestionMap from './DigestionMap';
import EnzymeSimulator from './EnzymeSimulator';
import SalivaExperiment from './SalivaExperiment';
import { soundFx } from '../../utils/soundEffects';

export default function Module5({ onNavigateHome, onAwardStars }) {
  const [activeTab, setActiveTab] = useState('3d');

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
              <span className="font-bold text-white text-base sm:text-lg">Kumpulan 5</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                SP 3.3.1
              </span>
            </div>
            <p className="text-xs text-slate-400">Salur Pencernaan, Simulator Enzim & Eksperimen Air Liur (Kesan Suhu)</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Ganjaran: <strong>3 Bintang Nutrisi</strong></span>
        </div>
      </div>

      {/* Tab Navigasi Kumpulan 5 */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-5xl">
        <button
          onClick={() => handleTabChange('3d')}
          className={`flex-1 min-w-[155px] py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === '3d'
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Box className={`w-4 h-4 ${activeTab === '3d' ? 'text-emerald-300 animate-pulse' : 'text-slate-400'}`} />
          <span>3D Anatomi Salur</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            3D
          </span>
        </button>

        <button
          onClick={() => handleTabChange('enzyme3d')}
          className={`flex-1 min-w-[155px] py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'enzyme3d'
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Zap className={`w-4 h-4 ${activeTab === 'enzyme3d' ? 'text-amber-300 animate-pulse' : 'text-slate-400'}`} />
          <span>3D Enzim (Kunci-Mangga)</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
            3D
          </span>
        </button>

        <button
          onClick={() => handleTabChange('map')}
          className={`flex-1 min-w-[140px] py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'map'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Peta 2D Salur</span>
        </button>

        <button
          onClick={() => handleTabChange('enzymes')}
          className={`flex-1 min-w-[140px] py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'enzymes'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Simulator 2D Enzim</span>
        </button>

        <button
          onClick={() => handleTabChange('saliva')}
          className={`flex-1 min-w-[140px] py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'saliva'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>Eksperimen Air Liur</span>
        </button>
      </div>

      <div className="transition-opacity duration-300">
        {activeTab === '3d' && <Digestion3DViewer />}
        {activeTab === 'enzyme3d' && <Enzyme3DViewer />}
        {activeTab === 'map' && <DigestionMap onSwitchTo3D={() => handleTabChange('3d')} />}
        {activeTab === 'enzymes' && <EnzymeSimulator onSwitchTo3D={() => handleTabChange('enzyme3d')} />}
        {activeTab === 'saliva' && <SalivaExperiment />}
      </div>

      {/* Kad Penutup Modul & Tuntut Bintang */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/30 to-blue-900/30 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Selesai Meneroka Kumpulan 5?</span>
          </h4>
          <p className="text-xs text-slate-300">
            Tuntut 3 Bintang Pencapaian anda untuk dimasukkan ke dalam rekod KSSM Ekosistem Kesihatan Sekolah.
          </p>
        </div>
        <button
          onClick={() => onAwardStars(3)}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 flex-shrink-0"
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>Tuntut 3 Bintang</span>
        </button>
      </div>

    </div>
  );
}
