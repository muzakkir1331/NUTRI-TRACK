import React, { useState } from 'react';
import { 
  Droplet, 
  Apple, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Activity, 
  HeartHandshake, 
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import { fireConfetti } from '../../utils/confetti';

export default function FiberWaterTracker() {
  // Kawalan Pengambilan Harian
  const [glassesOfWater, setGlassesOfWater] = useState(8); // 8 gelas = 2000ml (Saranan KKM)
  const [fiberGrams, setFiberGrams] = useState(25); // 25g (Saranan KKM: 20-30g)

  // Status Kuiz Ringkas SP 3.4.3
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);

  // Kiraan Status Kesihatan Kolon
  const waterMl = glassesOfWater * 250;
  
  // Penilaian Kesihatan Usus Berdasarkan Serat & Air
  const getGutStatus = () => {
    if (glassesOfWater < 5 && fiberGrams < 15) {
      return {
        level: 'danger',
        label: 'Sembelit Teruk & Berisiko Tinggi',
        color: 'text-rose-400',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/30',
        fecesType: 'Jenis 1 - 2 (Skala Bristol): Berketul keras seperti kacang, sukar dikeluarkan.',
        transitTime: '72+ jam (Sangat Lambat)',
        colonCondition: 'Dinding kolon menyerap semula terlalu banyak air. Toksik karsinogen bertakung lama.',
        riskConstipation: 'Sangat Tinggi (Risiko Buasir)',
        riskCancer: 'Meningkat (Toksik bertakung)',
        advice: 'Tingkatkan segera air kepada sekurang-kurangnya 8 gelas dan makan lebih banyak sayur-sayuran, buah-buahan, dan bijirin.'
      };
    } else if (glassesOfWater < 6 || fiberGrams < 18) {
      return {
        level: 'warning',
        label: 'Kurang Optimum (Kecenderungan Sembelit)',
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        fecesType: 'Jenis 2 - 3 (Skala Bristol): Agak keras dan berbonggol, memerlukan tenaga semasa membuang air.',
        transitTime: '48 - 60 jam (Lambat)',
        colonCondition: 'Peristalsis kurang aktif kerana jisim tinja kecil dan kelembapan tidak mencukupi.',
        riskConstipation: 'Sederhana',
        riskCancer: 'Sederhana Rendah',
        advice: 'Tambah 2-3 gelas air lagi dan amalkan makan sebiji epal atau pisang serta ulam-ulaman waktu makan tengah hari.'
      };
    } else {
      return {
        level: 'good',
        label: 'Kolon Sihat & Penyahtinjaan Lancar',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        fecesType: 'Jenis 3 - 4 (Skala Bristol): Lembut, licin berbentuk sosej. Mudah disingkirkan tanpa meneran.',
        transitTime: '24 - 36 jam (Ideal)',
        colonCondition: 'Serat mengembang menyerap air, menambah saiz tinja lalu merangsang peristalsis dengan sempurna.',
        riskConstipation: 'Sangat Rendah (Bebas Sembelit)',
        riskCancer: 'Rendah (Toksik disingkirkan cepat)',
        advice: 'Syabas! Amalan hidrasi dan pengambilan pelawas anda menepati saranan Kementerian Kesihatan Malaysia (KKM).'
      };
    }
  };

  const status = getGutStatus();

  const handleAdjustWater = (delta) => {
    soundFx.playClick();
    setGlassesOfWater((prev) => Math.min(14, Math.max(0, prev + delta)));
  };

  const handleAdjustFiber = (delta) => {
    soundFx.playClick();
    setFiberGrams((prev) => Math.min(45, Math.max(0, prev + delta)));
  };

  const handleResetToIdeal = () => {
    soundFx.playSuccess();
    setGlassesOfWater(8);
    setFiberGrams(25);
  };

  const handleQuizAnswer = (optionIndex) => {
    setSelectedQuizAnswer(optionIndex);
    if (optionIndex === 1) {
      soundFx.playSuccess();
      fireConfetti();
      setQuizFeedback({
        isCorrect: true,
        message: 'Tepat sekali! Pelawas (serat) menyerap air, menambah saiz tinja dan merangsang peristalsis di usus besar untuk mencegah sembelit.'
      });
    } else {
      soundFx.playDrop();
      setQuizFeedback({
        isCorrect: false,
        message: 'Kurang tepat. Pelawas tidak dicerna menjadi glukosa kerana manusia tiada enzim selulase. Fungsinya adalah menambah jisim tinja dan merangsang pengecutan peristalsis.'
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header SP 3.4.3 */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Standard Pembelajaran: SP 3.4.3 (Penyahtinjaan & Kesihatan Usus)</span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Droplet className="w-6 h-6 text-cyan-400" />
          <span>Penjejak Serat & Hidrasi Harian: Cegah Sembelit & Kanser Kolon</span>
        </h2>
        <p className="text-sm text-slate-400">
          Uji bagaimana nisbah air dan pelawas (serat) mempengaruhi kelajuan transit tinja di usus besar, mencegah sembelit, dan mengurangkan pendedahan karsinogen kolon.
        </p>
      </div>

      {/* Grid Utama: Kawalan & Visualisasi Kesihatan Kolon */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bahagian Kiri: Kawalan Input Pengambilan Murid (5 Kolum) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-violet-400" />
                <span>Simulasi Pengambilan Harian</span>
              </h3>
              <button
                onClick={handleResetToIdeal}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                title="Tetapkan ke aras saranan KKM"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Saranan KKM</span>
              </button>
            </div>

            {/* Kawalan 1: Air Minuman Harian */}
            <div className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-cyan-400" />
                  Air Minuman Harian
                </span>
                <span className="text-sm font-bold font-mono text-cyan-400">
                  {glassesOfWater} Gelas ({waterMl} ml)
                </span>
              </div>

              {/* Bar Visual Gelas Air */}
              <div className="grid grid-cols-7 gap-1 py-1">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    onClick={() => { soundFx.playClick(); setGlassesOfWater(i + 1); }}
                    className={`h-7 rounded cursor-pointer transition-all flex items-center justify-center text-[10px] font-bold ${
                      i < glassesOfWater 
                        ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30' 
                        : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                    }`}
                    title={`${i + 1} Gelas (${(i + 1) * 250} ml)`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>0 Gelas</span>
                <span className="text-emerald-400 font-semibold">Saranan KKM: 8 Gelas (2.0L)</span>
                <span>14 Gelas</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleAdjustWater(-1)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Minus className="w-3.5 h-3.5" /> Tolak 1 Gelas
                </button>
                <button
                  onClick={() => handleAdjustWater(1)}
                  className="flex-1 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah 1 Gelas
                </button>
              </div>
            </div>

            {/* Kawalan 2: Serat / Pelawas Harian */}
            <div className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Apple className="w-4 h-4 text-emerald-400" />
                  Pelawas / Serat Makanan
                </span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {fiberGrams} Gram
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={fiberGrams}
                onChange={(e) => {
                  soundFx.playClick();
                  setFiberGrams(parseInt(e.target.value, 10));
                }}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>0g (Tiada Serat)</span>
                <span className="text-emerald-400 font-semibold">Saranan KKM: 20 - 30g</span>
                <span>45g (Tinggi)</span>
              </div>

              {/* Butang Pintas Makanan Tinggi Serat */}
              <div className="pt-2">
                <p className="text-[11px] text-slate-400 mb-2 font-medium">Tambah sumber pelawas lazim:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    onClick={() => handleAdjustFiber(4)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/50 flex items-center justify-between"
                  >
                    <span>🥬 Sayur Bayam</span>
                    <span className="text-emerald-400 font-bold font-mono">+4g</span>
                  </button>
                  <button
                    onClick={() => handleAdjustFiber(5)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/50 flex items-center justify-between"
                  >
                    <span>🥣 Semangkuk Oat</span>
                    <span className="text-emerald-400 font-bold font-mono">+5g</span>
                  </button>
                  <button
                    onClick={() => handleAdjustFiber(4)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/50 flex items-center justify-between"
                  >
                    <span>🍎 Sebiji Epal</span>
                    <span className="text-emerald-400 font-bold font-mono">+4g</span>
                  </button>
                  <button
                    onClick={() => handleAdjustFiber(6)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left border border-slate-700/50 flex items-center justify-between"
                  >
                    <span>🥜 Kacang Pis</span>
                    <span className="text-emerald-400 font-bold font-mono">+6g</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bahagian Kanan: Status Kolon & Kesan Kesihatan (7 Kolum) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Kad Status Utama Penyahtinjaan */}
          <div className={`rounded-3xl p-6 border ${status.bgColor} ${status.borderColor} shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${status.bgColor} ${status.color} ${status.borderColor}`}>
                Status Penyahtinjaan Usus
              </span>
              <span className="text-xs font-mono text-slate-400">DSKP Sains Tingkatan 2</span>
            </div>

            <h3 className={`text-2xl font-black ${status.color} mb-3`}>
              {status.label}
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-400">Ciri-Ciri Tinja (Feses):</div>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">
                  {status.fecesType}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Masa Transit Usus Besar:</span>
                  <span className="text-sm font-bold text-white font-mono">{status.transitTime}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Risiko Sembelit:</span>
                  <span className={`text-sm font-bold font-mono ${status.color}`}>{status.riskConstipation}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-xs font-semibold text-slate-400">Mekanisme Sains Di Dalam Kolon:</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {status.colonCondition}
                </p>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <HeartHandshake className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Nasihat Pemakanan:</strong> {status.advice}
                </p>
              </div>
            </div>
          </div>

          {/* Infografik Sains: Mengapa Sembelit Membawa Kepada Kanser Kolon? */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Hubungkait Sembelit & Risiko Kanser Usus Besar (SP 3.4.3)</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-bold text-cyan-400">1. Penyerapan Semula Air</div>
                <p className="text-slate-300">
                  Fungsi utama usus besar adalah menyerap semula air dan garam mineral. Jika tinja lambat bergerak, terlalu banyak air diserap keluar, menyebabkan tinja keras.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-bold text-amber-400">2. Meneran & Buasir</div>
                <p className="text-slate-300">
                  Tinja yang keras memerlukan pengecutan abdomen kuat (meneran). Tekanan berulang boleh merosakkan salur darah di rektum dan dubur, mengakibatkan buasir.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-bold text-rose-400">3. Toksik Karsinogen</div>
                <p className="text-slate-300">
                  Bahan toksik daripada makanan yang tidak disingkirkan bertakung di dinding kolon. Pendedahan berpanjangan merangsang mutasi sel epitelium usus dan risiko kanser.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Kuiz Ringkas Pemantapan Konsep SP 3.4.3 */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-violet-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-white text-base">Kuiz Refleksi SP 3.4.3: Mengapa Manusia Memerlukan Pelawas?</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 font-mono">Soalan Objektif</span>
        </div>

        <p className="text-sm text-slate-300">
          Manusia tidak menghasilkan enzim selulase untuk mencerna selulosa (pelawas). Mengapakah pelawas tetap menjadi kelas makanan yang wajib diambil setiap hari?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {[
            { id: 0, text: "A. Untuk dibakar bagi membekalkan tenaga ATP utama sel badan." },
            { id: 1, text: "B. Untuk menyerap air, menambah jisim tinja dan merangsang peristalsis usus." },
            { id: 2, text: "C. Untuk membunuh semua bakteria yang hidup di dalam rektum." },
            { id: 3, text: "D. Untuk menggantikan fungsi enzim protease dalam mencernakan protein daging." }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => handleQuizAnswer(option.id)}
              className={`p-3.5 rounded-2xl text-left text-xs font-medium border transition-all ${
                selectedQuizAnswer === option.id
                  ? (option.id === 1 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-rose-950/60 border-rose-500 text-rose-200')
                  : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>

        {quizFeedback && (
          <div className={`p-4 rounded-2xl border text-xs flex items-start gap-2.5 transition-all ${
            quizFeedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {quizFeedback.isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <strong>{quizFeedback.isCorrect ? 'Tahniah!' : 'Perhatian:'}</strong> {quizFeedback.message}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
