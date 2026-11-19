import React from 'react';
import { BookOpen, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur text-slate-400 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-bold text-slate-200">Nutri-Track: Ekosistem Kesihatan Sekolah</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              KSSM Sains Tingkatan 2
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Dibina berasaskan Dokumen Standard Kurikulum dan Pentaksiran (DSKP) Sains Tingkatan 2, Bab 3.0 Nutrisi (SP 3.1.1 hingga SP 3.4.3). Menyokong pembelajaran bilik darjah abad ke-21 (PAK-21).
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Kementerian Pendidikan Malaysia</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Garis Panduan KKM & WHO</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
        <p>© 2026 Inisiatif Pendidikan Digital Sains Sekolah Malaysia.</p>
        <p className="flex items-center gap-1">
          Dihasilkan untuk menyemai budaya pemakanan sihat murid sekolah <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
        </p>
      </div>
    </footer>
  );
}
