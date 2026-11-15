import React, { useState } from 'react';
import { 
  Scissors, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Layers, 
  Zap, 
  Info,
  Beaker,
  Box,
  ArrowRight
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import { fireConfetti } from '../../utils/confetti';

const ENZYME_DATA = [
  {
    id: 'amylase',
    name: 'Enzim Amilase',
    target: 'Kanji (Karbohidrat Kompleks)',
    substrateName: 'Rantai Polimer Kanji (Glukosa Berantai Panjang)',
    producedAt: 'Kelenjar Air Liur & Pankreas',
    siteOfAction: 'Mulut & Duodenum',
    optimumPh: 'pH 6.8 – 7.2 (Neutral / Sedikit Beralkali)',
    endProduct: 'Maltosa (Disakarida 2 unit glukosa)',
    substrateVisual: ['🟡', '🟡', '🟡', '🟡', '🟡', '🟡'],
    productVisual: ['[🟡-🟡]', '[🟡-🟡]', '[🟡-🟡]'],
    color: 'amber',
    equation: 'Kanji + Air --(Amilase)--> Maltosa'
  },
  {
    id: 'protease',
    name: 'Enzim Protease (Pepsin & Tripsin)',
    target: 'Protein (Rantai Polipeptida)',
    substrateName: 'Rantai Asid Amino Polipeptida Kompleks',
    producedAt: 'Dinding Perut (Pepsin) & Pankreas (Tripsin)',
    siteOfAction: 'Perut (pH 2 Asid) & Duodenum (pH 8 Alkali)',
    optimumPh: 'Perut: pH 2.0 | Duodenum: pH 8.0',
    endProduct: 'Polipeptida ➔ Peptida ➔ Asid Amino Ringkas',
    substrateVisual: ['🟢', '🟢', '🟢', '🟢', '🟢', '🟢'],
    productVisual: ['🟢', '🟢', '🟢', '🟢', '🟢', '🟢'],
    color: 'emerald',
    equation: 'Protein --(Pepsin/Tripsin/Peptidase)--> Asid Amino'
  },
  {
    id: 'lipase',
    name: 'Enzim Lipase',
    target: 'Lemak / Lipid (Trigliserida Teremulsi)',
    substrateName: 'Molekul Lipid (1 Gliserol + 3 Asid Lemak)',
    producedAt: 'Pankreas & Kelenjar Usus',
    siteOfAction: 'Duodenum & Usus Kecil',
    optimumPh: 'pH 7.5 – 8.0 (Beralkali dengan bantuan jus hempedu)',
    endProduct: 'Asid Lemak + Gliserol (Molekul Larut Lemak)',
    substrateVisual: ['🔴', '🔵', '🔵', '🔵'],
    productVisual: ['[Gliserol: 🔴]', '+', '[3 Asid Lemak: 🔵 🔵 🔵]'],
    color: 'rose',
    equation: 'Lemak Teremulsi + Air --(Lipase)--> Asid Lemak + Gliserol'
  }
];

export default function EnzymeSimulator({ onSwitchTo3D }) {
  const [selectedEnzyme, setSelectedEnzyme] = useState(ENZYME_DATA[0]);
  const [isCleaving, setIsCleaving] = useState(false);
  const [isDigested, setIsDigested] = useState(false);

  const handleSelect = (enzyme) => {
    soundFx.playClick();
    setSelectedEnzyme(enzyme);
    setIsCleaving(false);
    setIsDigested(false);
  };

  const handleTriggerDigestion = () => {
    soundFx.playBubble();
    setIsCleaving(true);
    setTimeout(() => {
      setIsCleaving(false);
      setIsDigested(true);
      soundFx.playSuccess();
      fireConfetti();
    }, 1200);
  };

  const handleReset = () => {
    soundFx.playClick();
    setIsCleaving(false);
    setIsDigested(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Pengenalan Simulator Enzim */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Standard Pembelajaran: SP 3.3.1 (Biokimia Pencernaan)</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Scissors className="w-6 h-6 text-indigo-400" />
            <span>Simulator Molekul Enzim Pencernaan (Mangkin Biologi)</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Enzim ialah mangkin biologi protein yang mempercepatkan tindak balas hidrolisis molekul makanan kompleks kepada unit ringkas yang boleh diserap oleh sel tubuh.
          </p>
        </div>

        {onSwitchTo3D && (
          <button
            onClick={() => { soundFx.playClick(); onSwitchTo3D(); }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 shrink-0 border border-indigo-400/40 transition-all hover:scale-105"
          >
            <Box className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Buka Enzim 3D (Kunci & Mangga)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Pemilih 3 Kategori Enzim */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ENZYME_DATA.map((e) => (
          <button
            key={e.id}
            onClick={() => handleSelect(e)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedEnzyme.id === e.id
                ? 'bg-indigo-500/20 border-indigo-500 text-white font-bold shadow-lg shadow-indigo-950/40'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-base font-extrabold text-white mb-1">{e.name}</div>
            <div className="text-xs text-amber-400 font-semibold">{e.target}</div>
            <div className="text-[11px] text-slate-500 mt-1">{e.siteOfAction}</div>
          </button>
        ))}
      </div>

      {/* Meja Visual Pemecahan Rantai Molekul */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Ujian Tindak Balas Enzim:</span>
            <h3 className="text-2xl font-black text-white mt-0.5">{selectedEnzyme.name} ➔ {selectedEnzyme.target}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerDigestion}
              disabled={isCleaving || isDigested}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                !isDigested && !isCleaving
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/40 animate-pulse'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>{isCleaving ? 'Enzim Sedang Menghidrolisis...' : 'Rembeskan Enzim & Cerna'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Ulang Semula"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zon Animasi Molekul Rantai */}
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[220px] space-y-5 text-center relative overflow-hidden">
          
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {!isDigested ? `Substrat Kompleks: ${selectedEnzyme.substrateName}` : `Hasil Akhir Pencernaan: ${selectedEnzyme.endProduct}`}
          </div>

          {/* Rantai Sebelum vs Selepas Digunting Enzim */}
          {!isDigested ? (
            <div className={`flex items-center justify-center gap-2 text-4xl transition-all duration-700 ${
              isCleaving ? 'animate-bounce text-indigo-400 scale-110' : ''
            }`}>
              {selectedEnzyme.substrateVisual.map((item, idx) => (
                <span key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3 text-3xl animate-fadeIn">
              {selectedEnzyme.productVisual.map((item, idx) => (
                <span key={idx} className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold text-sm sm:text-base font-mono">
                  {item}
                </span>
              ))}
            </div>
          )}

          {isCleaving && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 animate-pulse">
              <Scissors className="w-3.5 h-3.5" />
              <span>Ikatan kimia polimer sedang diputuskan secara hidrolisis...</span>
            </div>
          )}

          {isDigested && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pencernaan Lengkap! Molekul ringkas sedia diserap oleh Vilus usus kecil.</span>
            </div>
          )}

        </div>

        {/* Data Saintifik Enzim KSSM */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-bold uppercase block">Rembesan & Lokasi:</span>
            <p className="text-slate-200 font-semibold">{selectedEnzyme.producedAt}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-bold uppercase block">pH Optimum Tindakan:</span>
            <p className="text-amber-400 font-semibold">{selectedEnzyme.optimumPh}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-bold uppercase block">Hasil Pencernaan:</span>
            <p className="text-emerald-400 font-semibold">{selectedEnzyme.endProduct}</p>
          </div>
        </div>

        {/* Persamaan Biokimia */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs font-mono text-cyan-300">
          <strong>Persamaan KSSM:</strong> {selectedEnzyme.equation}
        </div>

      </div>

    </div>
  );
}
