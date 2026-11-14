import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Scale, 
  Ruler, 
  Clock, 
  User, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  ACTIVITY_FACTORS, 
  calculateBMI, 
  calculateBMR, 
  calculateTDEE 
} from '../../utils/calorieCalculator';
import { soundFx } from '../../utils/soundEffects';
import { fireConfetti } from '../../utils/confetti';

export default function OnboardingProfileModal({ isOpen, onClose, onSaveProfile, initialProfile }) {
  const [name, setName] = useState('Murid 2 Arif');
  const [gender, setGender] = useState('lelaki');
  const [age, setAge] = useState(14); // Tingkatan 2 kebiasaannya 14 tahun
  const [weight, setWeight] = useState(48); // kg
  const [height, setHeight] = useState(155); // cm
  const [activity, setActivity] = useState('light'); // rutin aktiviti sekolah

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name || 'Murid 2 Arif');
      setGender(initialProfile.gender || 'lelaki');
      setAge(initialProfile.age || 14);
      setWeight(initialProfile.weight || 48);
      setHeight(initialProfile.height || 155);
      setActivity(initialProfile.activity || 'light');
    }
  }, [initialProfile, isOpen]);

  if (!isOpen) return null;

  // Kiraan Masa Nyata (Live Calculation)
  const bmiResult = calculateBMI(weight, height);
  const calorieResult = calculateTDEE(weight, height, age, gender, activity);

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.playSuccess();
    fireConfetti();

    const profileData = {
      name: name.trim() || 'Murid 2 Arif',
      gender,
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      activity,
      bmi: bmiResult.bmi,
      bmiCategory: bmiResult.category,
      bmiColor: bmiResult.color,
      bmiAdvice: bmiResult.advice,
      bmr: calorieResult.bmr,
      tdeeKcal: calorieResult.tdeeKcal,
      tdeeKj: calorieResult.tdeeKj,
      activityLabel: calorieResult.factorName,
      updatedAt: new Date().toISOString()
    };

    onSaveProfile(profileData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/30 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-fadeIn">
        
        {/* Header Modal */}
        <div className="text-center space-y-2 border-b border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KSSM Sains Tingkatan 2: SP 3.2.1 & 3.2.3</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Profil Kesihatan & Kalkulator Kalori Murid
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Isikan 4 soalan asas fizikal anda (berat, tinggi, rutin, dan usia) untuk menentukan keperluan kalori harian serta status BMI mengikut piawaian Kementerian Kesihatan Malaysia.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Baris 1: Nama & Jantina */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                Nama Murid / Kelas
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={25}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-white focus:outline-none"
                placeholder="Contoh: Amirul (2 Arif)"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Jantina (Mempengaruhi Formula BMR)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { soundFx.playClick(); setGender('lelaki'); }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    gender === 'lelaki'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  👦 Lelaki
                </button>
                <button
                  type="button"
                  onClick={() => { soundFx.playClick(); setGender('perempuan'); }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    gender === 'perempuan'
                      ? 'bg-pink-500/20 border-pink-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  👧 Perempuan
                </button>
              </div>
            </div>
          </div>

          {/* Baris 2: Umur, Berat (kg) & Tinggi (cm) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Umur */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Usia / Umur
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={11}
                  max={19}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm font-bold text-white focus:outline-none text-center"
                />
                <span className="text-xs text-slate-400">Tahun</span>
              </div>
            </div>

            {/* Berat Badan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                Berat Badan (kg)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={25}
                  max={150}
                  step={0.5}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm font-bold text-white focus:outline-none text-center"
                />
                <span className="text-xs text-slate-400">kg</span>
              </div>
            </div>

            {/* Ketinggian */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-indigo-400" />
                Tinggi (cm)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={100}
                  max={210}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm font-bold text-white focus:outline-none text-center"
                />
                <span className="text-xs text-slate-400">cm</span>
              </div>
            </div>

          </div>

          {/* Baris 3: Rutin / Tahap Aktiviti Fizikal Harian */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Tahap Rutin & Aktiviti Fizikal Sekolah (Faktor Tenaga DSKP)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ACTIVITY_FACTORS.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => { soundFx.playClick(); setActivity(act.id); }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    activity === act.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-950/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-200">
                    <span>{act.icon}</span>
                    <span>{act.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {act.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Kad Keputusan Masa Nyata (Live BMI & Calorie Result) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-950 to-emerald-950/30 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Kotak BMI */}
            <div className="space-y-1 border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-400">Indeks Jisim Badan (BMI):</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  bmiResult.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300' :
                  bmiResult.color === 'amber' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {bmiResult.category}
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white">
                {bmiResult.bmi} <span className="text-xs font-normal text-slate-400">kg/m²</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {bmiResult.advice}
              </p>
            </div>

            {/* Kotak Keperluan Kalori Harian */}
            <div className="space-y-1 sm:pl-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-400">Keperluan Kalori (TDEE):</span>
                <span className="text-[11px] font-mono text-cyan-400 font-semibold">{calorieResult.tdeeKj} kJ</span>
              </div>
              <div className="text-3xl font-extrabold text-amber-400 flex items-center gap-1.5">
                <Flame className="w-6 h-6 fill-amber-400 text-amber-400" />
                <span>{calorieResult.tdeeKcal}</span>
                <span className="text-xs font-normal text-slate-300">kcal / hari</span>
              </div>
              <p className="text-[11px] text-slate-400">
                BMR Asas: <strong>{calorieResult.bmr} kcal</strong> (kadar tenaga rehat organ badan).
              </p>
            </div>

          </div>

          {/* Butang Tindakan */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-all"
            >
              <span>Simpan Profil & Masuk Aplikasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
