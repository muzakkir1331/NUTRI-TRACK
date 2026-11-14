import React, { useState } from 'react';
import { 
  FlaskConical, 
  Flame, 
  Pipette, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles,
  Thermometer,
  ShieldAlert
} from 'lucide-react';
import { FOOD_SAMPLES, LAB_TESTS_DATA } from '../../data/labTestsData';
import { soundFx } from '../../utils/soundEffects';

export default function FoodLabSimulator() {
  const [selectedTestId, setSelectedTestId] = useState('iodine');
  const [selectedSampleId, setSelectedSampleId] = useState('kanji');
  
  // Fasa langkah eksperimen: 'idle' -> 'sample_added' -> 'reagent_added' -> 'heating' -> 'completed'
  const [labState, setLabState] = useState('sample_added');
  const [isHeating, setIsHeating] = useState(false);
  const [heatingProgress, setHeatingProgress] = useState(0);

  const currentTest = LAB_TESTS_DATA.find(t => t.id === selectedTestId);
  const currentSample = FOOD_SAMPLES.find(s => s.id === selectedSampleId);
  const testResult = currentSample?.results[selectedTestId];

  // Tukar jenis ujian
  const handleSelectTest = (testId) => {
    soundFx.playClick();
    setSelectedTestId(testId);
    setLabState('sample_added');
    setIsHeating(false);
    setHeatingProgress(0);
  };

  // Tukar sampel makanan
  const handleSelectSample = (sampleId) => {
    soundFx.playClick();
    setSelectedSampleId(sampleId);
    setLabState('sample_added');
    setIsHeating(false);
    setHeatingProgress(0);
  };

  // Titiskan reagen menggunakan pipet
  const handleAddReagent = () => {
    soundFx.playDrop();
    setLabState('reagent_added');
    
    // Jika ujian tidak perlukan pemanasan, terus ke 'completed' selepas 600ms
    if (!currentTest.requiresHeat) {
      setTimeout(() => {
        soundFx.playBubble();
        setLabState('completed');
      }, 700);
    }
  };

  // Pemanasan kukus air panas
  const handleStartHeating = () => {
    soundFx.playBurner();
    setIsHeating(true);
    setLabState('heating');
    setHeatingProgress(20);

    const interval = setInterval(() => {
      setHeatingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsHeating(false);
          soundFx.playBubble();
          setLabState('completed');
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Cuci tabung uji
  const handleResetLab = () => {
    soundFx.playClick();
    setLabState('sample_added');
    setIsHeating(false);
    setHeatingProgress(0);
  };

  // Tentukan warna cecair tabung uji mengikut status
  const getTestTubeLiquidColor = () => {
    if (labState === 'sample_added') {
      return currentSample.color;
    }
    if (labState === 'reagent_added' || labState === 'heating') {
      // Warna campuran sebelum reaksi lengkap
      return currentTest.reagentColor;
    }
    if (labState === 'completed') {
      return testResult.color;
    }
    return '#e2e8f0';
  };

  return (
    <div className="space-y-6">
      
      {/* Pengenalan Simulator Makmal */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standard Pembelajaran: SP 3.1.2 (Eksperimen Wajib)</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Simulator Maya 4 Ujian Makmal Makanan</h2>
            <p className="text-sm text-slate-400">
              Jalankan eksperimen biokimia untuk menguji kehadiran Kanji, Gula Penurun, Protein, dan Lemak secara interaktif.
            </p>
          </div>

          <button
            onClick={handleResetLab}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all self-start md:self-auto"
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>Bersihkan Tabung Uji</span>
          </button>
        </div>

        {/* Pemilih 4 Jenis Ujian Makmal */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {LAB_TESTS_DATA.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectTest(t.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedTestId === t.id
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/40'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm">{t.name}</div>
              <div className="text-[11px] text-slate-400 truncate">{t.target}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Meja Makmal Maya: Susunan Tabung Uji & Panel Kawalan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolum Kiri: Meja Kerja & Tabung Uji Maya (5 Kolum) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
          
          {/* Label Makmal & Petunjuk Reagen */}
          <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-3 z-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Ujian Aktif:</span>
              <p className="text-sm font-bold text-emerald-400">{currentTest.name}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Reagen:</span>
              <p className="text-xs font-semibold text-slate-300">{currentTest.reagentLabel}</p>
            </div>
          </div>

          {/* Animasi Pipet & Titisan jika reagent sedang ditambah */}
          {labState === 'reagent_added' && (
            <div className="absolute top-20 z-20 flex flex-col items-center animate-bounce">
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500 text-slate-950 shadow-lg">
                Menitiskan {currentTest.reagent}...
              </div>
              <div className="w-2.5 h-4 bg-cyan-400 rounded-full mt-2 animate-ping" />
            </div>
          )}

          {/* Visual Tabung Uji Makmal */}
          <div className="relative my-8 flex flex-col items-center">
            
            {/* Pemegang Tabung Uji / Rak Makmal */}
            <div className="w-36 h-3 bg-slate-700 rounded-full shadow-md z-10 mb-[-6px]" />

            {/* Badan Tabung Uji Kaca */}
            <div className="w-20 h-64 border-4 border-slate-400/40 rounded-b-full bg-slate-950/40 backdrop-blur-sm relative overflow-hidden flex flex-col justify-end p-1 shadow-2xl">
              
              {/* Garisan Skala Isipadu Tabung Uji */}
              <div className="absolute top-8 left-2 w-3 h-0.5 bg-slate-500/50" />
              <div className="absolute top-16 left-2 w-4 h-0.5 bg-slate-500/50" />
              <div className="absolute top-24 left-2 w-3 h-0.5 bg-slate-500/50" />
              <div className="absolute top-32 left-2 w-4 h-0.5 bg-slate-500/50" />

              {/* Cecair di dalam Tabung Uji */}
              <div
                className="w-full rounded-b-full transition-all duration-700 relative overflow-hidden"
                style={{
                  height: labState === 'sample_added' ? '40%' : '65%',
                  backgroundColor: getTestTubeLiquidColor(),
                  boxShadow: `inset 0 0 15px rgba(0,0,0,0.4)`
                }}
              >
                {/* Buih-buih semasa pemanasan atau reaksi */}
                {(isHeating || labState === 'completed') && (
                  <div className="absolute inset-0 flex justify-around items-end pb-2 opacity-60">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bubble" />
                    <span className="w-2 h-2 bg-white rounded-full animate-bubble" style={{ animationDelay: '0.4s' }} />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bubble" style={{ animationDelay: '0.8s' }} />
                  </div>
                )}

                {/* Mendakan merah bata atau emulsi putih jika ada */}
                {labState === 'completed' && testResult.precipitate && (
                  <div 
                    className="absolute bottom-0 inset-x-0 h-6 rounded-b-full opacity-90 transition-all duration-1000"
                    style={{ backgroundColor: testResult.color }}
                  />
                )}
              </div>

              {/* Kilauan Kaca Tabung Uji */}
              <div className="absolute top-0 right-2 w-1.5 h-48 bg-white/10 rounded-full pointer-events-none" />
            </div>

            {/* Kukus Air Panas / Penunu Bunsen jika sedang memanaskan */}
            {isHeating && (
              <div className="mt-2 flex flex-col items-center animate-pulse z-10">
                <Flame className="w-8 h-8 text-amber-500 animate-bounce" />
                <span className="text-[11px] font-mono font-bold text-amber-400">
                  Kukus Air Panas 100°C ({heatingProgress}%)
                </span>
              </div>
            )}
          </div>

          {/* Status Label Cecair Terkini */}
          <div className="w-full text-center p-3 rounded-2xl bg-slate-950/80 border border-slate-800 z-10">
            <span className="text-[11px] text-slate-500 block uppercase font-bold">Warna Cecair:</span>
            <span className="text-sm font-bold text-white">
              {labState === 'completed' ? testResult.name : (labState === 'sample_added' ? currentSample.name : 'Campuran Reagen')}
            </span>
          </div>

        </div>

        {/* Kolum Kanan: Panel Tindakan & Keputusan Inferens (7 Kolum) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Langkah 1: Pilih Sampel Makanan */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">1</span>
                Pilih Sampel Makanan:
              </span>
              <span className="text-xs text-slate-400 font-mono">Nutrien Jangkaan: {currentSample.nutrient}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FOOD_SAMPLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSample(s.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                    selectedSampleId === s.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="truncate">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Langkah 2 & 3: Tambah Reagen & Pemanasan */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
              Lakukan Tindakan Makmal:
            </span>

            <div className="flex flex-wrap items-center gap-3">
              
              {/* Butang Titiskan Reagen */}
              <button
                onClick={handleAddReagent}
                disabled={labState !== 'sample_added'}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  labState === 'sample_added'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Pipette className="w-4 h-4" />
                <span>Titiskan {currentTest.reagent}</span>
              </button>

              {/* Butang Pemanasan (jika diperlukan) */}
              {currentTest.requiresHeat && (
                <button
                  onClick={handleStartHeating}
                  disabled={labState !== 'reagent_added' || isHeating}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                    labState === 'reagent_added' && !isHeating
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950/40 animate-pulse'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Thermometer className="w-4 h-4" />
                  <span>Panaskan Dalam Kukus Air (Water Bath)</span>
                </button>
              )}

            </div>

            {/* Prosedur Ringkas */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Prosedur Eksperimen DSKP:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
                {currentTest.procedure.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Langkah 4: Kad Laporan & Inferens Saintifik */}
          {labState === 'completed' && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Laporan Keputusan Makmal
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                  testResult.positive 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  Keputusan: {testResult.positive ? 'POSITIF (Hadir)' : 'NEGATIF (Tiada)'}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  <strong className="text-white">Pemerhatian:</strong> Cecair bertukar kepada{' '}
                  <span className="font-bold text-emerald-400">{testResult.name}</span>.
                </p>
                <p>
                  <strong className="text-white">Inferens Saintifik:</strong> {currentTest.inference}
                </p>
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-300 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span><strong>Langkah Berjaga-jaga:</strong> {currentTest.precaution}</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
