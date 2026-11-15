import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  ZoomIn, 
  ArrowRight, 
  Droplet, 
  Layers, 
  Heart,
  Box
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function ViskingVsVillus({ onSwitchTo3D }) {
  const [activeView, setActiveView] = useState('visking'); // 'visking' | 'villus'

  // Status Eksperimen Tiub Visking
  const [viskingTime, setViskingTime] = useState(0); // 0 atau 30 minit
  const [testedReagent, setTestedReagent] = useState(null); // 'iodine' | 'benedict'

  const handleTestVisking = (reagent) => {
    soundFx.playDrop();
    setTestedReagent(reagent);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Visking vs Vilus */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standard Pembelajaran: SP 3.4.1 (Proses Penyerapan)</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Simulator Eksperimen Tiub Visking vs Struktur Vilus</h2>
            <p className="text-sm text-slate-400">
              Bandingkan model mekanikal usus kecil menggunakan tiub Visking dengan struktur mikroskopik sebenar Vilus manusia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onSwitchTo3D && (
              <button
                onClick={() => { soundFx.playClick(); onSwitchTo3D(); }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white flex items-center gap-2 shadow-lg shadow-violet-600/25 border border-violet-400/40 transition-all hover:scale-105"
              >
                <Box className="w-4 h-4 text-violet-300 animate-pulse" />
                <span>Buka Model 3D Vilus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                onClick={() => { soundFx.playClick(); setActiveView('visking'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === 'visking' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Model Tiub Visking
              </button>
              <button
                onClick={() => { soundFx.playClick(); setActiveView('villus'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === 'villus' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Keratan Rentas Vilus
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'visking' ? (
        /* Tab 1: Eksperimen Tiub Visking */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Kolum Visual Tabung Didih & Tiub Visking (5 Kolum) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between min-h-[460px] space-y-4">
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-violet-400 uppercase">Radas Makmal:</span>
              <span className="text-xs text-slate-400 font-mono">Masa: {viskingTime} Minit</span>
            </div>

            {/* Visual Tabung Didih & Tiub Visking */}
            <div className="relative my-4 flex flex-col items-center">
              
              {/* Tabung Didih Luar (Berisi Air Suling) */}
              <div className="w-32 h-72 border-4 border-slate-500/30 rounded-b-full bg-cyan-950/20 backdrop-blur-sm relative overflow-hidden flex flex-col justify-end p-2 shadow-2xl">
                
                {/* Air Suling Luar */}
                <div className="w-full h-[85%] bg-cyan-500/10 rounded-b-full relative flex items-center justify-center">
                  
                  {/* Molekul Glukosa Kecil yang meresap keluar jika minit 30 */}
                  {viskingTime === 30 && (
                    <div className="absolute inset-0 flex flex-wrap gap-2 p-2 items-center justify-center opacity-70 animate-pulse">
                      <span className="text-[10px] bg-amber-400/80 text-slate-950 px-1 rounded font-bold">Glukosa</span>
                      <span className="text-[10px] bg-amber-400/80 text-slate-950 px-1 rounded font-bold">Glukosa</span>
                      <span className="text-[10px] bg-amber-400/80 text-slate-950 px-1 rounded font-bold">Glukosa</span>
                    </div>
                  )}

                  {/* Tiub Visking di Dalam */}
                  <div className="w-16 h-48 border-2 border-dashed border-amber-500/60 rounded-full bg-amber-950/30 p-2 flex flex-col items-center justify-center text-center shadow-lg">
                    <span className="text-[9px] font-bold text-amber-300 uppercase">Tiub Visking</span>
                    <span className="text-[9px] text-slate-300 block mt-1">Kanji + Glukosa</span>
                    <span className="text-xs mt-1">🟡 🍬</span>
                  </div>

                </div>

                <div className="text-[10px] text-center text-cyan-400 font-mono mt-1">Air Suling (Di Luar)</div>
              </div>

            </div>

            {/* Kawalan Masa Eksperimen */}
            <div className="w-full flex items-center gap-2">
              <button
                onClick={() => { soundFx.playClick(); setViskingTime(0); setTestedReagent(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                  viskingTime === 0 ? 'bg-violet-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Minit 0 (Awal)
              </button>
              <button
                onClick={() => { soundFx.playBubble(); setViskingTime(30); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                  viskingTime === 30 ? 'bg-violet-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Minit 30 (Resapan)
              </button>
            </div>

          </div>

          {/* Kolum Kanan: Ujian Makmal Air Luar & Analisis Sains (7 Kolum) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pengujian Cecair Luar (Air Suling)</span>
              <h4 className="text-xl font-bold text-white mt-1">Uji Molekul Yang Meresap Keluar</h4>
            </div>

            {/* Butang Ujian Reagen Iodin vs Benedict */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleTestVisking('iodine')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  testedReagent === 'iodine'
                    ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm">Ujian Iodin (Kanji)</div>
                <div className="text-[11px] text-slate-500 mt-1">Uji kehadiran molekul kanji di luar</div>
              </button>

              <button
                onClick={() => handleTestVisking('benedict')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  testedReagent === 'benedict'
                    ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm">Ujian Benedict (Glukosa)</div>
                <div className="text-[11px] text-slate-500 mt-1">Uji kehadiran gula penurun di luar</div>
              </button>
            </div>

            {/* Keputusan Ujian Reagen */}
            {testedReagent && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-violet-500/40 space-y-3 animate-fadeIn">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400" />
                  Keputusan Ujian {testedReagent === 'iodine' ? 'Larutan Iodin' : 'Larutan Benedict'}:
                </span>

                {testedReagent === 'iodine' && (
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p>• <strong>Pemerhatian:</strong> Larutan iodin <span className="text-amber-400 font-bold">KEKAL KUNING / PERANG</span> (Tiada warna biru tua).</p>
                    <p>• <strong>Inferens:</strong> Molekul kanji <strong className="text-rose-400">TIDAK MERESAP</strong> keluar kerana saiz molekulnya terlalu besar untuk menembusi liang seni membran tiub Visking.</p>
                  </div>
                )}

                {testedReagent === 'benedict' && (
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p>• <strong>Pemerhatian:</strong> Terbentuk <span className="text-rose-400 font-bold">MENDAKAN MERAH BATA</span> (selepas dipanaskan dalam kukus air).</p>
                    <p>• <strong>Inferens:</strong> Molekul glukosa yang bersaiz kecil <strong className="text-emerald-400">BERJAYA MERESAP</strong> keluar menembusi liang tiub Visking ke dalam air suling.</p>
                  </div>
                )}
              </div>
            )}

            {/* Analisis Padanan Biologi */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-white block">Analogi Model Tiub Visking terhadap Usus Kecil:</span>
              <div className="grid grid-cols-2 gap-2 text-slate-400">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-slate-200 block">Tiub Visking:</strong>
                  Mewakili dinding usus kecil (membran separa telap).
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-slate-200 block">Air Suling Luar:</strong>
                  Mewakili aliran darah / plasma kapilari.
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Tab 2: Keratan Rentas Struktur Vilus Usus Kecil */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Mikroskopik Biologi</span>
            <h3 className="text-2xl font-black text-white mt-1">Keratan Rentas Vilus & Salur Penyerapan Nutrien</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bahagian Kapilari Darah */}
            <div className="p-5 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-rose-500" />
                <h4 className="text-lg font-bold text-white">1. Kapilari Darah (Jaringan Salur Darah)</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Jaringan kapilari darah yang sangat halus dengan dinding sel setebal satu sel sahaja untuk memendekkan jarak resapan nutrien.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-rose-400 block">Nutrien Yang Diserap ke Kapilari Darah:</span>
                <p>• Glukosa (gula ringkas)</p>
                <p>• Asid amino (daripada protein)</p>
                <p>• Vitamin larut air: <strong>Vitamin B & Vitamin C</strong></p>
                <p>• Garam mineral & Air</p>
              </div>
              <span className="text-[11px] text-slate-400 block font-mono">Dihantar ke: Vena porta hepar ➔ Hati ➔ Sel tubuh</span>
            </div>

            {/* Bahagian Lakteal (Salur Limfa) */}
            <div className="p-5 rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-400" />
                <h4 className="text-lg font-bold text-white">2. Lakteal (Salur Sistem Limfa)</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Salur limfa utama yang terletak di bahagian tengah vilus untuk menyerap nutrien larut lemak yang tidak dapat meresap terus ke dalam darah.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-amber-400 block">Nutrien Yang Diserap ke Lakteal:</span>
                <p>• Asid Lemak</p>
                <p>• Gliserol</p>
                <p>• Vitamin larut lemak: <strong>Vitamin A, D, E & K</strong></p>
              </div>
              <span className="text-[11px] text-slate-400 block font-mono">Dihantar ke: Duktus toraks ➔ Sistem peredaran darah</span>
            </div>

          </div>

          {/* Ciri-Ciri Penyesuaian Vilus DSKP */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
            <span className="font-bold text-white block">3 Ciri Penyesuaian Vilus Untuk Memaksimalkan Penyerapan:</span>
            <ul className="space-y-1 list-disc list-inside text-slate-400">
              <li><strong>Luas Permukaan Besar:</strong> Berjuta-juta unjuran vilus dan mikrovilus menambah luas permukaan berlipat kali ganda.</li>
              <li><strong>Dinding Sangat Nipis:</strong> Epitelium vilus hanya setebal satu lapisan sel, mempercepatkan kadar resapan nutrien.</li>
              <li><strong>Jaringan Salur Darah Padat:</strong> Memastikan kecerunan kepekatan resapan sentiasa tinggi untuk aliran nutrien berterusan.</li>
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}
