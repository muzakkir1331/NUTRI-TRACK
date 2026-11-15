import React, { useState } from 'react';
import { 
  FlaskConical, 
  BookOpen, 
  Stethoscope, 
  ArrowLeft, 
  Sparkles, 
  Award,
  ChevronRight,
  Box
} from 'lucide-react';
import FoodEncyclopedia from './FoodEncyclopedia';
import FoodLabSimulator from './FoodLabSimulator';
import FoodLab3DViewer from './FoodLab3DViewer';
import DeficiencyQuiz from './DeficiencyQuiz';
import { soundFx } from '../../utils/soundEffects';

export default function Module1({ onNavigateHome, onAwardStars }) {
  // Tab aktif: 'encyclopedia' | 'lab3d' | 'simulator' | 'quiz'
  const [activeTab, setActiveTab] = useState('lab3d');

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
            aria-label="Kembali ke Hub Utama"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Hab Utama</span>
          </button>
          
          <ChevronRight className="w-4 h-4 text-slate-600 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base sm:text-lg">Kumpulan 1</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                SP 3.1.1 & 3.1.2
              </span>
            </div>
            <p className="text-xs text-slate-400">Kelas Makanan, Ujian Biokimia Makmal & Penyakit Kekurangan</p>
          </div>
        </div>

        {/* Status Modul */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Ganjaran: <strong>3 Bintang Nutrisi</strong></span>
        </div>
      </div>

      {/* Tab Navigasi Sub-Modul */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-4xl">
        <button
          onClick={() => handleTabChange('lab3d')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'lab3d'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 border border-emerald-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Box className={`w-4 h-4 ${activeTab === 'lab3d' ? 'text-slate-950 animate-pulse' : 'text-emerald-400'}`} />
          <span>Makmal 3D WebGL</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-950/30 text-slate-950 font-extrabold border border-slate-950/20">
            3D Maya
          </span>
        </button>

        <button
          onClick={() => handleTabChange('encyclopedia')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'encyclopedia'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>7 Kelas Makanan</span>
        </button>

        <button
          onClick={() => handleTabChange('simulator')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'simulator'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Simulator 2D Makmal</span>
        </button>

        <button
          onClick={() => handleTabChange('quiz')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'quiz'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Klinik Diagnosis</span>
        </button>
      </div>

      {/* Kandungan Tab Aktif */}
      <div className="transition-opacity duration-300">
        {activeTab === 'lab3d' && <FoodLab3DViewer />}
        {activeTab === 'encyclopedia' && <FoodEncyclopedia />}
        {activeTab === 'simulator' && <FoodLabSimulator onSwitchTo3D={() => handleTabChange('lab3d')} />}
        {activeTab === 'quiz' && <DeficiencyQuiz onAwardStars={onAwardStars} />}
      </div>

      {/* Kad Penutup Modul & Tuntut Bintang */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Selesai Meneroka Kumpulan 1?</span>
          </h4>
          <p className="text-xs text-slate-300">
            Tuntut 3 Bintang Pencapaian anda untuk dimasukkan ke dalam rekod KSSM Ekosistem Kesihatan Sekolah.
          </p>
        </div>
        <button
          onClick={() => onAwardStars(3)}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 flex-shrink-0"
        >
          <Award className="w-4 h-4 text-slate-950" />
          <span>Tuntut 3 Bintang</span>
        </button>
      </div>

    </div>
  );
}
