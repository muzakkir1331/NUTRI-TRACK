import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Volume2, 
  VolumeX, 
  Star, 
  User, 
  Home, 
  Camera,
  Activity,
  Flame,
  Scale,
  Bot
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function Header({ 
  currentView, 
  onNavigateHome, 
  totalStars = 0,
  userProfile,
  onOpenProfile,
  onOpenScanner,
  onOpenChatBot
}) {
  const [isMuted, setIsMuted] = useState(soundFx.isMuted());

  useEffect(() => {
    setIsMuted(soundFx.isMuted());
  }, []);

  const handleToggleSound = () => {
    const nextState = soundFx.toggleMute();
    setIsMuted(nextState);
    if (!nextState) {
      soundFx.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tajuk Utama */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { soundFx.playClick(); onNavigateHome(); }}
              className="flex items-center gap-3 group text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl p-1"
              aria-label="Kembali ke Landing Hub"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:border-emerald-400 transition-all shadow-lg shadow-emerald-950/30">
                <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    Nutri-Track
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    KSSM Bab 3.0
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Ekosistem Kesihatan & Makmal Sains Tingkatan 2
                </p>
              </div>
            </button>
          </div>

          {/* Bahagian Kanan: Butang Imbas, Profil Kesihatan, Bintang & Audio */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Butang Penasihat Kesihatan AI */}
            <button
              onClick={() => { soundFx.playClick(); onOpenChatBot(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 text-teal-300 border border-teal-500/40 shadow-sm transition-all"
              title="Tanya Penasihat Kesihatan & Diet AI (NutriBot)"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Penasihat AI</span>
            </button>

            {/* Butang Imbas Makanan AI */}
            <button
              onClick={() => { soundFx.playClick(); onOpenScanner(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/40 shadow-sm transition-all"
              title="Imbas gambar makanan & kira kalori"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Imbas Makanan</span>
            </button>

            {/* Butang Kembali Home jika di dalam Modul */}
            {currentView !== 'hub' && (
              <button
                onClick={() => { soundFx.playClick(); onNavigateHome(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                <Home className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">Hub Utama</span>
              </button>
            )}

            {/* Profil Kesihatan Murid (BMI & Keperluan Kalori) */}
            {userProfile ? (
              <button
                onClick={() => { soundFx.playClick(); onOpenProfile(); }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-xs transition-all group"
                title="Klik untuk kemas kini profil berat, tinggi, usia & rutin"
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    userProfile.bmiColor === 'emerald' ? 'bg-emerald-400' :
                    userProfile.bmiColor === 'amber' ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />
                  <span className="font-bold text-white max-w-[80px] sm:max-w-[110px] truncate">
                    {userProfile.name}
                  </span>
                </div>
                <div className="hidden lg:flex items-center gap-2 border-l border-slate-800 pl-2 text-slate-400">
                  <span className="flex items-center gap-0.5 text-emerald-400 font-mono">
                    <Scale className="w-3 h-3" />
                    BMI: {userProfile.bmi}
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-400 font-mono">
                    <Flame className="w-3 h-3" />
                    {userProfile.tdeeKcal} kcal
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => { soundFx.playClick(); onOpenProfile(); }}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-600/30 transition-all"
              >
                Tetap Profil Kesihatan
              </button>
            )}

            {/* Bintang & Skor Terkumpul */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold shadow-inner">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{totalStars}</span>
            </div>

            {/* Suis Audio Makmal */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition-all ${
                isMuted 
                  ? 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-slate-400' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
              title={isMuted ? "Hidupkan kesan audio makmal" : "Bisukan audio (Mute)"}
              aria-label="Kawalan Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
