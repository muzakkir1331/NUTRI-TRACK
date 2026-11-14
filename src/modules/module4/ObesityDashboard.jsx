import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  Sparkles, 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

// Data Kajian Simulasi Kesihatan Sekolah Menengah Malaysia (NHMS)
const SCHOOL_OBESITY_DATA = {
  all: {
    totalStudents: 1200,
    breakdown: [
      { label: 'Berat Unggul (Normal)', pct: 58, count: 696, color: '#10b981' },
      { label: 'Berlebihan Berat Badan', pct: 18, count: 216, color: '#f59e0b' },
      { label: 'Obesiti', pct: 12, count: 144, color: '#f43f5e' },
      { label: 'Kurang Berat Badan', pct: 12, count: 144, color: '#38bdf8' }
    ],
    forms: [
      { form: 'Tingkatan 1', obesityRate: 26, totalStudents: 250 },
      { form: 'Tingkatan 2', obesityRate: 31, totalStudents: 245 },
      { form: 'Tingkatan 3', obesityRate: 33, totalStudents: 240 },
      { form: 'Tingkatan 4', obesityRate: 29, totalStudents: 235 },
      { form: 'Tingkatan 5', obesityRate: 27, totalStudents: 230 }
    ]
  },
  male: {
    totalStudents: 620,
    breakdown: [
      { label: 'Berat Unggul (Normal)', pct: 54, count: 335, color: '#10b981' },
      { label: 'Berlebihan Berat Badan', pct: 20, count: 124, color: '#f59e0b' },
      { label: 'Obesiti', pct: 15, count: 93, color: '#f43f5e' },
      { label: 'Kurang Berat Badan', pct: 11, count: 68, color: '#38bdf8' }
    ],
    forms: [
      { form: 'Tingkatan 1', obesityRate: 30, totalStudents: 130 },
      { form: 'Tingkatan 2', obesityRate: 36, totalStudents: 125 },
      { form: 'Tingkatan 3', obesityRate: 38, totalStudents: 125 },
      { form: 'Tingkatan 4', obesityRate: 34, totalStudents: 120 },
      { form: 'Tingkatan 5', obesityRate: 31, totalStudents: 120 }
    ]
  },
  female: {
    totalStudents: 580,
    breakdown: [
      { label: 'Berat Unggul (Normal)', pct: 62, count: 360, color: '#10b981' },
      { label: 'Berlebihan Berat Badan', pct: 16, count: 93, color: '#f59e0b' },
      { label: 'Obesiti', pct: 9, count: 52, color: '#f43f5e' },
      { label: 'Kurang Berat Badan', pct: 13, count: 75, color: '#38bdf8' }
    ],
    forms: [
      { form: 'Tingkatan 1', obesityRate: 22, totalStudents: 120 },
      { form: 'Tingkatan 2', obesityRate: 25, totalStudents: 120 },
      { form: 'Tingkatan 3', obesityRate: 27, totalStudents: 115 },
      { form: 'Tingkatan 4', obesityRate: 24, totalStudents: 115 },
      { form: 'Tingkatan 5', obesityRate: 23, totalStudents: 110 }
    ]
  }
};

export default function ObesityDashboard() {
  const [filterGender, setFilterGender] = useState('all'); // 'all' | 'male' | 'female'

  const currentData = SCHOOL_OBESITY_DATA[filterGender];

  return (
    <div className="space-y-6">
      
      {/* Header Dashboard */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kajian Kesihatan Remaja: SP 3.2.3</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-rose-400" />
            <span>Dashboard Statistik Obesiti & Kesihatan Sekolah</span>
          </h2>
          <p className="text-sm text-slate-400">
            Analisis data demografi taburan jisim badan murid sekolah menengah berdasarkan data kajian Tinjauan Kebangsaan Kesihatan (NHMS Remaja).
          </p>
        </div>

        {/* Butang Penapis Jantina */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => { soundFx.playClick(); setFilterGender('all'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterGender === 'all' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Keseluruhan
          </button>
          <button
            onClick={() => { soundFx.playClick(); setFilterGender('male'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterGender === 'male' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lelaki
          </button>
          <button
            onClick={() => { soundFx.playClick(); setFilterGender('female'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterGender === 'female' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Perempuan
          </button>
        </div>
      </div>

      {/* Grid Visualisasi: Graf Palang & Carta Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Graf Palang: Kadar Obesiti Mengikut Tingkatan (7 Kolum) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Trend Obesiti & Berat Berlebihan</span>
              <h4 className="text-lg font-bold text-white mt-0.5">Kadar Obesiti Mengikut Tingkatan (%)</h4>
            </div>
            <span className="text-xs text-slate-500 font-mono">1,200 Sampel Murid</span>
          </div>

          {/* Visual Graf Palang SVG Interaktif */}
          <div className="space-y-4 pt-2">
            {currentData.forms.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">{item.form}</span>
                  <span className="text-rose-400 font-mono">{item.obesityRate}% Obes / Berlebihan</span>
                </div>
                <div className="w-full bg-slate-950 h-5 rounded-xl overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-lg transition-all duration-700"
                    style={{ width: `${(item.obesityRate / 45) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-bold text-slate-200">Inferens DSKP Sains Tingkatan 2:</span>
            <p>
              Kadar obesiti mencapai kemuncak pada <strong>Tingkatan 2 dan Tingkatan 3 (31% - 33%)</strong>. Ini berkait rapat dengan peralihan tabiat pembelian snek tinggi gula di kantin serta peningkatan masa skrin berbanding aktiviti fizikal luar bilik darjah.
            </p>
          </div>
        </div>

        {/* Carta Donut / Komposisi Berat Badan Sekolah (5 Kolum) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Komposisi Keseluruhan</span>
              <h4 className="text-lg font-bold text-white mt-0.5">Pecahan Status BMI Murid</h4>
            </div>

            {/* Senarai Kategori Pecahan */}
            <div className="space-y-3 mt-4">
              {currentData.breakdown.map((b, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: b.color }} />
                    <div>
                      <span className="text-xs font-bold text-white block">{b.label}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{b.count} orang murid</span>
                    </div>
                  </div>
                  <span className="text-lg font-black font-mono" style={{ color: b.color }}>{b.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cadangan Tindakan Sekolah */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Inisiatif Sekolah Sihat KPM:
            </span>
            <p className="leading-relaxed">
              Menggalakkan kempen "1 Murid 1 Sukan", memperbanyakkan jualan buah-buahan potong segar di kantin, dan menyekat penjualan minuman bergula melebihi paras yang ditetapkan.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
