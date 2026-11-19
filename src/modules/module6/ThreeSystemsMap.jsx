import React, { useState } from 'react';
import { 
  HeartPulse, 
  Wind, 
  Utensils, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import { fireConfetti } from '../../utils/confetti';

export default function ThreeSystemsMap() {
  const [activeStep, setActiveStep] = useState('all');
  const [isSimulatingEnergy, setIsSimulatingEnergy] = useState(false);

  const handleSimulateRespiration = () => {
    soundFx.playSuccess();
    fireConfetti();
    setIsSimulatingEnergy(true);
    setTimeout(() => {
      setIsSimulatingEnergy(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Hubungkait 3 Sistem */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Standard Pembelajaran: SP 3.4.2 (Asimilasi & Penjanaan Tenaga)</span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-violet-400" />
          <span>Peta Hubungkait 3 Sistem Utama Tubuh (Respirasi Sel)</span>
        </h2>
        <p className="text-sm text-slate-400">
          Kaji bagaimana Sistem Pencernaan, Sistem Peredaran Darah, dan Sistem Respirasi bekerjasama membekalkan glukosa dan oksigen untuk menjana tenaga hidup (ATP).
        </p>
      </div>

      {/* Gambar Rajah Rangkaian 3 Sistem Interaktif */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sistem 1: Pencernaan */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">1</span>
            <Utensils className="w-5 h-5 text-amber-400" />
          </div>

          <h3 className="text-lg font-bold text-white">Sistem Pencernaan</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Memecahkan makanan kompleks kepada molekul glukosa dan asid amino, lalu menyerapnya melalui vilus usus kecil ke dalam kapilari darah.
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-400 font-mono">
            Output: Glukosa Terlarut
          </div>
        </div>

        {/* Sistem 2: Respirasi */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">2</span>
            <Wind className="w-5 h-5 text-cyan-400" />
          </div>

          <h3 className="text-lg font-bold text-white">Sistem Respirasi</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Menyedut gas Oksigen (O₂) melalui alveolus paru-paru ke dalam hemoglobin darah, serta menghembuskan gas sisa Karbon Dioksida (CO₂).
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-400 font-mono">
            Output: Gas Oksigen (O₂)
          </div>
        </div>

        {/* Sistem 3: Peredaran Darah */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-rose-500/30 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">3</span>
            <HeartPulse className="w-5 h-5 text-rose-400" />
          </div>

          <h3 className="text-lg font-bold text-white">Sistem Peredaran Darah</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Jantung mengepam darah beroksigen dan kaya glukosa ke trilion sel tubuh manusia untuk melangsungkan proses asimilasi dan respirasi sel.
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-rose-400 font-mono">
            Fungsi: Pengangkutan & Penghantaran
          </div>
        </div>

      </div>

      {/* Titik Integrasi Akhir: Respirasi Sel di Mitokondria Sel Badan */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Puncak Integrasi:</span>
            <h4 className="text-xl font-bold text-white mt-0.5">Penjanaan Tenaga di Dalam Sel (Respirasi Sel)</h4>
          </div>

          <button
            onClick={handleSimulateRespiration}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-violet-950/40"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Jana Tenaga Sel (Simulasi)</span>
          </button>
        </div>

        {/* Persamaan Biokimia Respirasi Sel */}
        <div className={`p-6 rounded-2xl bg-slate-950 border text-center space-y-3 transition-all duration-700 ${
          isSimulatingEnergy ? 'border-amber-400 shadow-2xl shadow-amber-500/20 bg-amber-950/20' : 'border-slate-800'
        }`}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Persamaan Perkataan Respirasi Sel (DSKP Sains Tingkatan 2):
          </span>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-lg font-mono font-bold">
            <span className="text-amber-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">Glukosa</span>
            <span className="text-slate-500">+</span>
            <span className="text-cyan-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">Oksigen</span>
            <span className="text-slate-500">➔</span>
            <span className="text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">Karbon Dioksida</span>
            <span className="text-slate-500">+</span>
            <span className="text-cyan-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">Air</span>
            <span className="text-slate-500">+</span>
            <span className={`px-4 py-1.5 rounded-xl font-extrabold ${
              isSimulatingEnergy ? 'bg-amber-400 text-slate-950 animate-bounce' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              Tenaga (ATP)
            </span>
          </div>

          <p className="text-xs text-slate-400 max-w-xl mx-auto pt-2">
            Tenaga yang dihasilkan digunakan oleh murid untuk berfikir, berjalan ke sekolah, mengekalkan suhu badan, dan melakukan aktiviti sukan harian.
          </p>
        </div>

      </div>

    </div>
  );
}
