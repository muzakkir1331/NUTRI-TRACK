import React, { useState } from 'react';
import { 
  Scale, 
  Ruler, 
  Sparkles, 
  Heart, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Flame,
  ArrowRight
} from 'lucide-react';
import { calculateBMI } from '../../utils/calorieCalculator';
import { soundFx } from '../../utils/soundEffects';

export default function BMICalculator({ userProfile }) {
  const [weight, setWeight] = useState(userProfile?.weight || 50);
  const [height, setHeight] = useState(userProfile?.height || 158);
  const [gender, setGender] = useState(userProfile?.gender || 'lelaki');
  const [age, setAge] = useState(userProfile?.age || 14);

  const bmiData = calculateBMI(weight, height);

  // Peratusan posisi meter BMI (julat 14 hingga 36)
  const meterPercent = Math.min(Math.max(((bmiData.bmi - 14) / (36 - 14)) * 100, 0), 100);

  return (
    <div className="space-y-6">
      
      {/* Pengenalan Kalkulator BMI */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Standard Pembelajaran: SP 3.2.3</span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Scale className="w-6 h-6 text-rose-400" />
          <span>Kalkulator Indeks Jisim Badan (BMI) Murid Sekolah</span>
        </h2>
        <p className="text-sm text-slate-400">
          Ukur status jisim badan anda mengikut formula piawaian sains dan carta pengelasan Kementerian Kesihatan Malaysia.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Panel Input Ukuran (5 Kolum) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block border-b border-slate-800 pb-2">
            Data Fizikal Murid:
          </span>

          {/* Jantina */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 block font-semibold">Jantina</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { soundFx.playClick(); setGender('lelaki'); }}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  gender === 'lelaki' ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                👦 Lelaki
              </button>
              <button
                type="button"
                onClick={() => { soundFx.playClick(); setGender('perempuan'); }}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  gender === 'perempuan' ? 'bg-pink-500/20 border-pink-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                👧 Perempuan
              </button>
            </div>
          </div>

          {/* Umur */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 block font-semibold">Umur (Tingkatan)</label>
            <input
              type="number"
              min={11}
              max={19}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white"
            />
          </div>

          {/* Berat Badan */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Berat Badan:</span>
              <strong className="text-white font-mono">{weight} kg</strong>
            </div>
            <input
              type="range"
              min={30}
              max={120}
              step={0.5}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Ketinggian */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Ketinggian:</span>
              <strong className="text-white font-mono">{height} cm ({(height / 100).toFixed(2)} m)</strong>
            </div>
            <input
              type="range"
              min={120}
              max={195}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Formula KSSM */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 font-mono space-y-1">
            <p className="font-bold text-slate-300 font-sans">Formula DSKP Sains T2:</p>
            <p>BMI = Jisim (kg) ÷ [Tinggi (m)]²</p>
            <p>= {weight} ÷ [{(height/100).toFixed(2)}]²</p>
            <p className="font-bold text-emerald-400 font-sans mt-1">= {bmiData.bmi} kg/m²</p>
          </div>

        </div>

        {/* Panel Meter & Ulasan Kesihatan (7 Kolum) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hasil Keputusan BMI</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                bmiData.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                bmiData.color === 'amber' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {bmiData.category}
              </span>
            </div>

            {/* Paparan Nilai Angka Besar */}
            <div className="text-center py-6">
              <span className="text-5xl sm:text-6xl font-black text-white">{bmiData.bmi}</span>
              <span className="text-sm font-normal text-slate-400 block mt-1">Indeks Jisim Badan (kg/m²)</span>
            </div>

            {/* Meter Garisan Spektrum KKM */}
            <div className="space-y-2">
              <div className="relative w-full h-4 rounded-full overflow-hidden flex bg-slate-800">
                <div style={{ width: '20%' }} className="bg-amber-400 h-full" title="Kurang Berat (<18.5)" />
                <div style={{ width: '35%' }} className="bg-emerald-500 h-full" title="Normal (18.5 - 24.9)" />
                <div style={{ width: '25%' }} className="bg-orange-500 h-full" title="Berlebihan (25.0 - 29.9)" />
                <div style={{ width: '20%' }} className="bg-rose-600 h-full" title="Obesiti (>=30.0)" />
              </div>

              {/* Jarum Penunjuk */}
              <div className="relative w-full h-3">
                <div 
                  className="absolute -top-1 w-3 h-3 bg-white rounded-full shadow-lg border border-slate-900 -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${meterPercent}%` }}
                />
              </div>

              {/* Label Zon */}
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>&lt;18.5 (Kurang)</span>
                <span>18.5 - 24.9 (Normal)</span>
                <span>25.0 - 29.9 (Lebih)</span>
                <span>&ge;30.0 (Obes)</span>
              </div>
            </div>
          </div>

          {/* Ulasan Klinikal KKM */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Saranan Kesihatan Berdasarkan Kategori Anda:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {bmiData.advice}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
