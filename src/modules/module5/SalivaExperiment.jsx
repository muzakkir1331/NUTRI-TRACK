import React, { useState } from 'react';
import { 
  Thermometer, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  Beaker, 
  ShieldAlert,
  Flame,
  Snowflake
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const TEST_TUBES = [
  {
    id: 'tube_0',
    temp: '0°C',
    label: 'Tabung P (Kukus Air Berais)',
    state: 'Enzim Tidak Aktif',
    color: '#0284c7',
    icon: Snowflake,
    results: [
      { min: 0, color: '#1e1b4b', label: 'Biru Tua' },
      { min: 10, color: '#1e1b4b', label: 'Biru Tua' },
      { min: 20, color: '#1e1b4b', label: 'Biru Tua' },
      { min: 30, color: '#1e1b4b', label: 'Biru Tua' }
    ],
    inference: 'Pada suhu 0°C, molekul kanji dan enzim amilase bergerak sangat perlahan (tenaga kinetik rendah). Enzim tidak aktif dan kanji tidak dihidrolisis, maka ujian iodin kekal berwarna BIRU TUA.'
  },
  {
    id: 'tube_37',
    temp: '37°C',
    label: 'Tabung Q (Suhu Badan Optimum)',
    state: 'Enzim Sangat Aktif (Optimum)',
    color: '#10b981',
    icon: Thermometer,
    results: [
      { min: 0, color: '#1e1b4b', label: 'Biru Tua' },
      { min: 10, color: '#312e81', label: 'Biru Pudar' },
      { min: 20, color: '#d97706', label: 'Kekal Kuning/Perang' },
      { min: 30, color: '#d97706', label: 'Kekal Kuning/Perang' }
    ],
    inference: 'Suhu 37°C ialah suhu badan manusia yang optimum. Enzim amilase menghidrolisiskan kanji kepada maltosa sepenuhnya dalam masa 20 minit. Tiada lagi kanji tersisa, maka warna iodin kekal KUNING/PERANG.'
  },
  {
    id: 'tube_60',
    temp: '60°C',
    label: 'Tabung R (Air Panas 60°C)',
    state: 'Enzim Ternyahasli (Denatured)',
    color: '#f43f5e',
    icon: Flame,
    results: [
      { min: 0, color: '#1e1b4b', label: 'Biru Tua' },
      { min: 10, color: '#1e1b4b', label: 'Biru Tua' },
      { min: 20, color: '#1e1b4b', label: 'Biru Tua' },
      { min: 30, color: '#1e1b4b', label: 'Biru Tua' }
    ],
    inference: 'Pada suhu tinggi 60°C, struktur protein enzim amilase musnah dan tapak aktifnya berubah bentuk (TERNYAHASLI). Enzim kehilangan fungsi kekal dan kanji tidak dapat dicernakan. Warna iodin kekal BIRU TUA.'
  }
];

export default function SalivaExperiment() {
  const [selectedTube, setSelectedTube] = useState(TEST_TUBES[1]); // lalai 37°C
  const [currentMinute, setCurrentMinute] = useState(20);

  const handleSelectTube = (tube) => {
    soundFx.playClick();
    setSelectedTube(tube);
  };

  const handleSelectMinute = (m) => {
    soundFx.playDrop();
    setCurrentMinute(m);
  };

  const currentResult = selectedTube.results.find(r => r.min === currentMinute);

  return (
    <div className="space-y-6">
      
      {/* Header Eksperimen Air Liur */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Eksperimen Wajib KSSM: SP 3.3.1</span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Thermometer className="w-6 h-6 text-indigo-400" />
          <span>Eksperimen Kesan Suhu Terhadap Tindakan Amilase Air Liur</span>
        </h2>
        <p className="text-sm text-slate-400">
          Uji campuran larutan kanji 1% + amilase air liur pada 3 suhu berbeza (0°C, 37°C, 60°C) menggunakan titisan larutan iodin pada jubin berlekuk setiap 10 minit.
        </p>
      </div>

      {/* Pemilihan 3 Tabung Suhu */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TEST_TUBES.map((tube) => {
          const IconComponent = tube.icon;
          return (
            <button
              key={tube.id}
              onClick={() => handleSelectTube(tube)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedTube.id === tube.id
                  ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-lg text-white">{tube.temp}</span>
                <IconComponent className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xs font-bold text-slate-200">{tube.label}</div>
              <div className="text-[11px] text-slate-400 mt-1">{tube.state}</div>
            </button>
          );
        })}
      </div>

      {/* Meja Eksperimen: Jubin Berlekuk & Garis Masa Iodin */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Jubin Berlekuk Ujian Iodin</span>
            <h3 className="text-xl font-bold text-white mt-0.5">Ujian pada {selectedTube.label} ({selectedTube.temp})</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Pilih Minit Ujian:</span>
            {[0, 10, 20, 30].map((m) => (
              <button
                key={m}
                onClick={() => handleSelectMinute(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentMinute === m
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {m} Min
              </button>
            ))}
          </div>
        </div>

        {/* Jubin Berlekuk 4 Lekuk (Spotting Tile) */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
            Pemerhatian Warna Titisan Iodin pada Jubin Berlekuk:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {selectedTube.results.map((res) => {
              const isSelected = res.min === currentMinute;
              return (
                <div
                  key={res.min}
                  onClick={() => handleSelectMinute(res.min)}
                  className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                    isSelected ? 'bg-slate-900 border-amber-500 scale-105 shadow-xl' : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-slate-400 block mb-2">Minit ke-{res.min}</span>
                  
                  {/* Lekuk Jubin & Cecair Iodin */}
                  <div className="w-16 h-16 rounded-full mx-auto border-4 border-slate-700 p-1 flex items-center justify-center bg-slate-950 shadow-inner">
                    <div 
                      className="w-12 h-12 rounded-full transition-all duration-700 shadow-md"
                      style={{ backgroundColor: res.color }}
                    />
                  </div>

                  <span className="text-xs font-bold text-white block mt-2">{res.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Laporan Inferens Saintifik Eksperimen */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            Inferens & Kesimpulan Saintifik (DSKP KSSM):
          </span>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {selectedTube.inference}
          </p>
        </div>

      </div>

    </div>
  );
}
