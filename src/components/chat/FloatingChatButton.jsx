import React from 'react';
import { Bot, Sparkles, MessageCircle } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function FloatingChatButton({ onClick, userProfile }) {
  const handleClick = () => {
    soundFx.playClick();
    onClick();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
      
      {/* Label Tooltip Mengambang */}
      <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs font-semibold text-slate-200 shadow-xl backdrop-blur-md opacity-90 group-hover:opacity-100 transition-all pointer-events-none transform group-hover:-translate-x-1">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
        <span>Tanya Penasihat AI</span>
      </div>

      {/* Butang Utama Mengambang */}
      <button
        onClick={handleClick}
        className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
        aria-label="Buka Chatbot Penasihat Kesihatan NutriBot AI"
        title="Buka NutriBot AI - Penasihat Kesihatan & Diet Sekolah"
      >
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
          <Bot className="w-7 h-7 animate-pulse" />
        </div>

        {/* Status Aktif Pulsing Dot */}
        <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950" />
        </span>
      </button>

    </div>
  );
}
