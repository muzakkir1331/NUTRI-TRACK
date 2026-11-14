import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Sparkles, 
  Calculator,
  Info
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function TrafficLightSystem() {
  // Input penguji snek
  const [testFat, setTestFat] = useState(4);
  const [testSugar, setTestSugar] = useState(6);
  const [testSodium, setTestSodium] = useState(250);

  // Penentuan Lampu Isyarat Mengikut Garis Panduan KKM & KPM
  const determineColor = (val, thresholds) => {
    if (val <= thresholds.green) return 'hijau';
    if (val <= thresholds.yellow) return 'kuning';
    return 'merah';
  };

  const fatStatus = determineColor(testFat, { green: 3, yellow: 17.5 });
  const sugarStatus = determineColor(testSugar, { green: 5, yellow: 22.5 });
  const sodiumStatus = determineColor(testSodium, { green: 120, yellow: 600 });

  // Status Keseluruhan (Paling teruk menentukan status)
  let overallStatus = 'hijau';
  if (fatStatus === 'merah' || sugarStatus === 'merah' || sodiumStatus === 'merah') {
    overallStatus = 'merah';
  } else if (fatStatus === 'kuning' || sugarStatus === 'kuning' || sodiumStatus === 'kuning') {
    overallStatus = 'kuning';
  }

  return (
    <div className="space-y-6">
      
      {/* Pengenalan Sistem Lampu Isyarat */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Standard Pembelajaran: SP 3.2.3</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Sistem Lampu Isyarat Kesihatan Makanan Sekolah</h2>
        <p className="text-sm text-slate-400">
          Sistem pelabelan pemakanan berpandukan warna memudahkan murid dan guru mengenal pasti makanan sihat, sederhana, atau makanan yang perlu dihadkan.
        </p>
      </div>

      {/* 3 Petunjuk Lampu Isyarat (Piawaian KKM) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Hijau */}
        <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-xl font-black text-emerald-400">HIJAU (Pilihan Sihat)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Makanan yang rendah lemak tepu, rendah gula, dan rendah garam. Mengandungi pelawas atau protein berkhasiat.
          </p>
          <div className="p-3 rounded-xl bg-slate-950/80 text-xs text-slate-400 space-y-1">
            <p>• Lemak: &le; 3.0 g / 100g</p>
            <p>• Gula: &le; 5.0 g / 100g</p>
            <p>• Natrium: &le; 120 mg / 100g</p>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 block">Saranan: Boleh dimakan setiap hari.</span>
        </div>

        {/* Kuning */}
        <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/40 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500" />
            <h3 className="text-xl font-black text-amber-400">KUNING (Sederhana)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Makanan dalam julat sederhana. Boleh diambil tetapi perlu mengawal saiz hidangan dan kekerapan pengambilan.
          </p>
          <div className="p-3 rounded-xl bg-slate-950/80 text-xs text-slate-400 space-y-1">
            <p>• Lemak: 3.1 – 17.5 g / 100g</p>
            <p>• Gula: 5.1 – 22.5 g / 100g</p>
            <p>• Natrium: 121 – 600 mg / 100g</p>
          </div>
          <span className="text-[11px] font-bold text-amber-400 block">Saranan: Ambil secara berkala, jangan berlebihan.</span>
        </div>

        {/* Merah */}
        <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/40 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-rose-500" />
            <h3 className="text-xl font-black text-rose-400">MERAH (Hadkan / Elak)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tinggi lemak, minyak, gula tambahan atau garam. Berisiko menyebabkan kegendutan, kerosakan gigi, dan penyakit kronik.
          </p>
          <div className="p-3 rounded-xl bg-slate-950/80 text-xs text-slate-400 space-y-1">
            <p>• Lemak: &gt; 17.5 g / 100g</p>
            <p>• Gula: &gt; 22.5 g / 100g (atau &gt; 11.25g minuman)</p>
            <p>• Natrium: &gt; 600 mg / 100g</p>
          </div>
          <span className="text-[11px] font-bold text-rose-400 block">Saranan: Hadkan pengambilan seminggu sekali atau elakkan.</span>
        </div>

      </div>

      {/* Kalkulator Penentu Warna Lampu Isyarat untuk Snek Murid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              <span>Uji Snek Pilihan Anda: Penjana Warna Automatik</span>
            </h3>
            <p className="text-xs text-slate-400">Masukkan nilai nutrisi snek untuk melihat warna lampu isyaratnya:</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-400 block uppercase">Jumlah Lemak (g/100g):</label>
            <input
              type="number"
              min={0}
              value={testFat}
              onChange={(e) => setTestFat(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-lg font-bold text-white"
            />
            <span className={`text-[11px] font-bold block capitalize ${
              fatStatus === 'hijau' ? 'text-emerald-400' : fatStatus === 'kuning' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              Status Lemak: {fatStatus}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-400 block uppercase">Kandungan Gula (g/100g):</label>
            <input
              type="number"
              min={0}
              value={testSugar}
              onChange={(e) => setTestSugar(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-lg font-bold text-white"
            />
            <span className={`text-[11px] font-bold block capitalize ${
              sugarStatus === 'hijau' ? 'text-emerald-400' : sugarStatus === 'kuning' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              Status Gula: {sugarStatus}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-400 block uppercase">Natrium / Garam (mg/100g):</label>
            <input
              type="number"
              min={0}
              value={testSodium}
              onChange={(e) => setTestSodium(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-lg font-bold text-white"
            />
            <span className={`text-[11px] font-bold block capitalize ${
              sodiumStatus === 'hijau' ? 'text-emerald-400' : sodiumStatus === 'kuning' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              Status Natrium: {sodiumStatus}
            </span>
          </div>

        </div>

        {/* Keputusan Lampu Isyarat Keseluruhan */}
        <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          overallStatus === 'hijau' ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' :
          overallStatus === 'kuning' ? 'bg-amber-950/30 border-amber-500/40 text-amber-300' :
          'bg-rose-950/30 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-slate-950 ${
              overallStatus === 'hijau' ? 'bg-emerald-400' :
              overallStatus === 'kuning' ? 'bg-amber-400' : 'bg-rose-400'
            }`}>
              !
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold block">Keputusan Keseluruhan:</span>
              <div className="text-xl font-extrabold text-white uppercase">Kategori Lampu Isyarat {overallStatus}</div>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-md">
            {overallStatus === 'hijau' ? 'Snek ini sangat baik untuk diet harian sekolah anda.' :
             overallStatus === 'kuning' ? 'Snek ini boleh diambil sekali-sekala. Jangan jadikannya hidangan harian.' :
             'Snek ini mengandungi paras nutrien bahaya yang tinggi. Cari alternatif snek yang lebih sihat!'}
          </p>
        </div>

      </div>

    </div>
  );
}
