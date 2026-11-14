import React, { useState } from 'react';
import { 
  Stethoscope, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  HeartHandshake, 
  Apple, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { DEFICIENCY_QUIZ_DATA } from '../../data/deficiencyQuizData';
import { soundFx } from '../../utils/soundEffects';
import { fireConfetti, fireSchoolPrideConfetti } from '../../utils/confetti';

export default function DeficiencyQuiz({ onAwardStars }) {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentCase = DEFICIENCY_QUIZ_DATA[currentCaseIndex];

  // Pemilihan jawapan diagnosis
  const handleSelectDiagnosis = (opt) => {
    if (isAnswerSubmitted) return;
    soundFx.playClick();
    setSelectedDiagnosis(opt);
  };

  // Pemilihan jawapan diet
  const handleSelectDiet = (opt) => {
    if (isAnswerSubmitted) return;
    soundFx.playClick();
    setSelectedDiet(opt);
  };

  // Hantar jawapan kes klinikal
  const handleSubmitCase = () => {
    if (!selectedDiagnosis || !selectedDiet) return;
    setIsAnswerSubmitted(true);

    const isDiagnosisCorrect = selectedDiagnosis.isCorrect;
    const isDietCorrect = selectedDiet.isCorrect;

    if (isDiagnosisCorrect && isDietCorrect) {
      soundFx.playSuccess();
      setScore((prev) => prev + 1);
    } else {
      soundFx.playError();
    }
  };

  // Pindah ke kes seterusnya
  const handleNextCase = () => {
    soundFx.playClick();
    if (currentCaseIndex < DEFICIENCY_QUIZ_DATA.length - 1) {
      setCurrentCaseIndex((prev) => prev + 1);
      setSelectedDiagnosis(null);
      setSelectedDiet(null);
      setIsAnswerSubmitted(false);
    } else {
      // Tamat kuiz
      setIsQuizCompleted(true);
      fireSchoolPrideConfetti();
      if (onAwardStars) {
        onAwardStars(3); // Anugerahkan 3 bintang jika lengkap
      }
    }
  };

  // Ulang semula kuiz
  const handleRestartQuiz = () => {
    soundFx.playClick();
    setCurrentCaseIndex(0);
    setSelectedDiagnosis(null);
    setSelectedDiet(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Klinik Mini */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standard Pembelajaran: SP 3.1.1 (Aplikasi Kesihatan)</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-emerald-400" />
              <span>Klinik Diagnosis Penyakit Kekurangan Nutrien</span>
            </h2>
            <p className="text-sm text-slate-400">
              Bertindak sebagai Pegawai Perubatan Sains Sekolah: Analisis simptom pesakit, buat diagnosis penyakit kekurangan nutrien, dan cadangkan preskripsi makanan pembetulan!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
              Kes: <strong className="text-emerald-400">{currentCaseIndex + 1}</strong> / {DEFICIENCY_QUIZ_DATA.length}
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
              Skor: <strong className="text-amber-400">{score}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Skrin Kuiz Utama atau Skrin Sijil Tamat */}
      {!isQuizCompleted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Kad Profil Pesakit (5 Kolum) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <span className="text-4xl p-2 rounded-2xl bg-slate-950 border border-slate-800">
                {currentCase.avatar}
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Kad Pesakit #{currentCase.id}</span>
                <h3 className="text-xl font-bold text-white">{currentCase.patientName}</h3>
              </div>
            </div>

            {/* Aduan Utama Pesakit */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Aduan Klinikal & Gejala:
              </span>
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                "{currentCase.complaint}"
              </p>
            </div>

            {/* Senarai Tanda-tanda Simptom */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tanda Klinikal Utama:</span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentCase.symptoms.map((sym, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Panel Interaktif Diagnosis & Diet (7 Kolum) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Langkah 1: Diagnosis Penyakit */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">1</span>
                Pilih Diagnosis Penyakit Kekurangan:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentCase.diagnosisOptions.map((opt, idx) => {
                  const isSelected = selectedDiagnosis?.text === opt.text;
                  let cardStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (isAnswerSubmitted) {
                    if (opt.isCorrect) {
                      cardStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected && !opt.isCorrect) {
                      cardStyle = 'bg-rose-950/40 border-rose-500 text-rose-300';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-emerald-500/20 border-emerald-500 text-white font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectDiagnosis(opt)}
                      disabled={isAnswerSubmitted}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${cardStyle}`}
                    >
                      <span>{opt.text}</span>
                      {isAnswerSubmitted && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isAnswerSubmitted && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Langkah 2: Preskripsi Makanan Pembetulan */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">2</span>
                Cadangkan Diet Makanan Pemulihan:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentCase.dietOptions.map((opt, idx) => {
                  const isSelected = selectedDiet?.text === opt.text;
                  let cardStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (isAnswerSubmitted) {
                    if (opt.isCorrect) {
                      cardStyle = 'bg-cyan-950/40 border-cyan-500 text-cyan-300 font-bold';
                    } else if (isSelected && !opt.isCorrect) {
                      cardStyle = 'bg-rose-950/40 border-rose-500 text-rose-300';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-cyan-500/20 border-cyan-500 text-white font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectDiet(opt)}
                      disabled={isAnswerSubmitted}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${cardStyle}`}
                    >
                      <span>{opt.text}</span>
                      {isAnswerSubmitted && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                      {isAnswerSubmitted && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Penjelasan Saintifik Selepas Jawapan Dihantar */}
            {isAnswerSubmitted && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-2 animate-fadeIn">
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Ulasan Saintifik & Rasional Rawatan:
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentCase.explanation}
                </p>
              </div>
            )}

            {/* Butang Navigasi Kuiz */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitCase}
                  disabled={!selectedDiagnosis || !selectedDiet}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    selectedDiagnosis && selectedDiet
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Sahkan Diagnosis & Diet
                </button>
              ) : (
                <button
                  onClick={handleNextCase}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40"
                >
                  <span>{currentCaseIndex < DEFICIENCY_QUIZ_DATA.length - 1 ? 'Kes Seterusnya' : 'Lihat Keputusan Keseluruhan'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* Paparan Keputusan Akhir Selesai Kuiz */
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/50">
            <Award className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Tahniah! Lencana 'Doktor Nutrisi Sekolah' Telah Dibuka
            </span>
            <h3 className="text-3xl font-extrabold text-white">Sesi Klinik Lengkap!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Anda telah berjaya menyelesaikan kesemua 6 kes klinikal kekurangan nutrien berpandukan DSKP Sains Tingkatan 2.
            </p>
          </div>

          {/* Markah & Bintang */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-xs mx-auto">
            <span className="text-xs text-slate-400 block uppercase font-bold">Skor Kes Tepat:</span>
            <span className="text-4xl font-extrabold text-emerald-400">{score} / {DEFICIENCY_QUIZ_DATA.length}</span>
            <span className="text-xs text-amber-400 block mt-1 font-semibold">+3 Bintang Nutrisi Diperoleh</span>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-200 border border-slate-700 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Ulang Semula Klinik</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
