import React, { useState } from 'react';
import { 
  FlaskConical, 
  Utensils, 
  ShoppingBag, 
  Activity, 
  GitBranch, 
  HeartPulse, 
  ArrowRight, 
  Camera,
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Info, 
  BookOpen,
  Award,
  Flame,
  Scale,
  Edit3,
  Bot,
  MessageCircle
} from 'lucide-react';
import { MODULES_META } from '../../data/modulesMeta';
import { soundFx } from '../../utils/soundEffects';

const ICON_MAP = {
  FlaskConical,
  Utensils,
  ShoppingBag,
  Activity,
  GitBranch,
  HeartPulse
};

export default function LandingHub({ 
  onSelectModule, 
  completedModules = [], 
  userProfile, 
  onOpenProfile, 
  onOpenScanner,
  onOpenChatBot
}) {
  const [selectedPreview, setSelectedPreview] = useState(null);

  const handleCardClick = (mod) => {
    soundFx.playClick();
    if (mod.status === 'active') {
      onSelectModule(mod.id);
    } else {
      setSelectedPreview(mod);
    }
  };

  return (
    <div className="space-y-10 py-6">
      
      {/* Hero Banner Ekosistem Kesihatan Sekolah */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Pendidikan Sains KSSM Tingkatan 2 — Bab 3.0 Nutrisi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Nutri-Track: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Ekosistem Kesihatan Sekolah
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Selamat datang, <strong className="text-emerald-400">{userProfile?.name || 'Murid'}</strong>! Terokai 6 modul pembelajaran sains komprehensif daripada ujian biokimia makmal makanan, profil kalori, audit nutrisi kantin, hingga ke penyerapan vilus dan peranan 3 sistem tubuh manusia.
          </p>

          {/* Kad Status Kemajuan & Butang Tindakan Pantas */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => { soundFx.playClick(); onSelectModule(1); }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all"
            >
              <span>Mula Makmal Kumpulan 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { soundFx.playClick(); onOpenScanner(); }}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-bold text-sm sm:text-base flex items-center gap-2 transition-all"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Imbas Foto Makanan</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); onOpenChatBot(); }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 border border-teal-500/40 text-teal-300 font-bold text-sm sm:text-base flex items-center gap-2 transition-all shadow-sm"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Tanya Penasihat AI</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Kemajuan: <strong>{completedModules.length} / 6</strong> Modul</span>
            </div>
          </div>
        </div>
      </section>

      {/* Widget Profil Kesihatan Murid (BMI & Keperluan Kalori Harian) */}
      {userProfile && (
        <section className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-400" />
                Profil Fizikal Anda
              </span>
              <button
                onClick={() => { soundFx.playClick(); onOpenProfile(); }}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Ubah Data</span>
              </button>
            </div>
            <div className="text-xl font-bold text-white">{userProfile.name}</div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Jantina: <strong className="text-slate-200 capitalize">{userProfile.gender}</strong> | Usia: <strong className="text-slate-200">{userProfile.age} Tahun</strong></p>
              <p>Berat: <strong className="text-slate-200">{userProfile.weight} kg</strong> | Tinggi: <strong className="text-slate-200">{userProfile.height} cm</strong></p>
              <p>Rutin: <strong className="text-slate-200">{userProfile.activityLabel}</strong></p>
            </div>
          </div>

          <div className="md:col-span-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Indeks Jisim Badan (BMI):</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                userProfile.bmiColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-300' :
                userProfile.bmiColor === 'amber' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {userProfile.bmiCategory}
              </span>
            </div>
            <div className="text-3xl font-black text-white">{userProfile.bmi} <span className="text-xs font-normal text-slate-400">kg/m²</span></div>
            <p className="text-[11px] text-slate-400 leading-tight">{userProfile.bmiAdvice}</p>
          </div>

          <div className="md:col-span-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Keperluan Kalori Harian:</span>
              <span className="text-[11px] font-mono text-cyan-400 font-bold">{userProfile.tdeeKj} kJ</span>
            </div>
            <div className="text-3xl font-black text-amber-400 flex items-center gap-1.5">
              <Flame className="w-6 h-6 fill-amber-400 text-amber-400" />
              <span>{userProfile.tdeeKcal}</span>
              <span className="text-xs font-normal text-slate-400">kcal / hari</span>
            </div>
            <p className="text-[11px] text-slate-400">BMR Asas Tubuh: <strong>{userProfile.bmr} kcal</strong></p>
          </div>

          {/* Bar Pintas Penasihat AI Berasaskan BMI & Kalori */}
          <div className="md:col-span-12 p-3.5 rounded-2xl bg-gradient-to-r from-teal-950/60 via-slate-950 to-slate-950 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-300">
                Ingin tahu pelan diet pecahan kalori (<strong>{userProfile.tdeeKcal} kcal</strong>) dan senaman terbaik untuk BMI <strong className="text-emerald-400">{userProfile.bmi}</strong> anda?
              </p>
            </div>
            <button
              onClick={() => { soundFx.playClick(); onOpenChatBot(); }}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 shadow-md shadow-teal-500/20"
            >
              <span>Tanya NutriBot AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </section>
      )}

      {/* Grid Kad Navigasi 6 Kumpulan Modul */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>Modul Pembelajaran DSKP KSSM</span>
            </h2>
            <p className="text-sm text-slate-400">Pilih mana-mana modul di bawah untuk memulakan sesi makmal anda</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Bab 3: 3.1 hingga 3.4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES_META.map((mod) => {
            const IconComponent = ICON_MAP[mod.icon] || FlaskConical;
            const isActive = mod.status === 'active';
            const isCompleted = completedModules.includes(mod.id);

            return (
              <div
                key={mod.id}
                onClick={() => handleCardClick(mod)}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all cursor-pointer text-left glass-panel ${
                  isActive 
                    ? 'border-emerald-500/40 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-950/40 hover:-translate-y-1' 
                    : 'border-slate-800/80 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
                }`}
              >
                {/* Header Kad: SP & Status Badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-slate-800/80 text-emerald-300 border border-slate-700">
                      {mod.sp}
                    </span>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Sedia Diteroka
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/60 text-slate-400 border border-slate-700/60">
                        <Lock className="w-3 h-3 text-slate-500" />
                        Pratonton
                      </span>
                    )}
                  </div>

                  {/* Ikon & Tajuk */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`p-3 rounded-xl border ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-800/50 text-slate-400 border-slate-700'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-emerald-400/90 font-medium">
                        {mod.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {mod.description}
                  </p>

                  {/* Senarai Topik Sub-Modul */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Kandungan Utama:</p>
                    {mod.topics.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Kad: Butang Tindakan */}
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                    <Award className="w-3.5 h-3.5" />
                    <span>3 Bintang Tersedia</span>
                  </div>

                  <div className={`flex items-center gap-1 text-xs font-bold ${
                    isActive ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    <span>{isActive ? 'Masuk Makmal' : 'Lihat Rancangan'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Info Tambahan DSKP & Fakta Nutrisi Cepat */}
      <section className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-3">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Fakta Sains Pantas: Nilai Tenaga 3 Makronutrien Utama (DSKP Sains Tingkatan 2)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-amber-400 block">1g Karbohidrat</span>
            <span>= 16.7 kJ (4 kcal) tenaga</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-emerald-400 block">1g Protein</span>
            <span>= 16.7 kJ (4 kcal) tenaga</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-bold text-rose-400 block">1g Lemak (Paling Padat)</span>
            <span>= 37.6 kJ (9 kcal) tenaga</span>
          </div>
        </div>
      </section>

      {/* Modal Pratonton Kurikulum untuk Modul Fasa Seterusnya */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-800 text-emerald-300 border border-slate-700">
                {selectedPreview.sp}
              </span>
              <span className="text-xs text-amber-400 font-medium">Modul Fasa Seterusnya</span>
            </div>

            <h3 className="text-xl font-bold text-white">
              {selectedPreview.title}
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedPreview.description}
            </p>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <p className="text-xs font-semibold text-slate-300">Komponen Yang Bakal Diterbitkan:</p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                {selectedPreview.topics.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedPreview(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
