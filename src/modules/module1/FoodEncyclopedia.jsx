import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Flame, 
  AlertTriangle, 
  Beaker, 
  CheckCircle2, 
  ChevronRight,
  Info
} from 'lucide-react';
import { FOOD_CLASSES_DATA } from '../../data/foodClassesData';
import { soundFx } from '../../utils/soundEffects';

export default function FoodEncyclopedia() {
  const [selectedClassId, setSelectedClassId] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const filteredList = FOOD_CLASSES_DATA.filter((item) => {
    const matchesFilter = selectedClassId === 'semua' || item.id === selectedClassId;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.functions.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.sources.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.deficiencyEffects.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCardClick = (item) => {
    soundFx.playClick();
    setActiveModalItem(item);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Ensiklopedia */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standard Pembelajaran: SP 3.1.1</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Ensiklopedia 7 Kelas Makanan</h2>
            <p className="text-sm text-slate-400">
              Terokai 7 kelas nutrien penting yang diperlukan oleh badan manusia untuk kesihatan optimum, tumbesaran, dan bekalan tenaga.
            </p>
          </div>

          {/* Kotak Carian */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari makanan, penyakit, fungsi..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tab Penapis Kelas Makanan */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 pb-1">
          <button
            onClick={() => { soundFx.playClick(); setSelectedClassId('semua'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedClassId === 'semua'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Semua (7)
          </button>
          {FOOD_CLASSES_DATA.map((fc) => (
            <button
              key={fc.id}
              onClick={() => { soundFx.playClick(); setSelectedClassId(fc.id); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedClassId === fc.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {fc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Kad 7 Kelas Makanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="group relative rounded-2xl p-6 glass-panel border border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/30 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Badge & Nilai Tenaga */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.badge}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                  <Flame className="w-3 h-3 text-amber-400" />
                  {item.energyValue}
                </span>
              </div>

              {/* Tajuk & Keterangan Ringkas */}
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-4">
                {item.subtitle}
              </p>

              {/* Senarai Sumber Makanan Tempatan */}
              <div className="space-y-2 mb-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sumber Utama:</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.sources.map((src, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300"
                    >
                      <span>{src.emoji}</span>
                      <span>{src.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Fungsi Teras */}
              <div className="space-y-1 text-xs text-slate-300">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Fungsi Teras:</p>
                <p className="line-clamp-2 text-slate-400">
                  {item.functions[0]}
                </p>
              </div>
            </div>

            {/* Butang Buka Terperinci */}
            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>Maklumat Saintifik Penuh</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Terperinci Nutrien & Ujian Makmal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {activeModalItem.badge}
                  </span>
                  <span className="text-xs text-amber-400 font-mono font-semibold">
                    {activeModalItem.energyValue}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeModalItem.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {activeModalItem.subtitle}
                </p>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Unsur Kimia & Fungsi Tubuh */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Unsur Kimia Terkandung</p>
                <p className="text-xs sm:text-sm text-slate-200 font-mono font-medium">
                  {activeModalItem.elements}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Ujian Makmal Berkaitan</p>
                <p className="text-xs sm:text-sm text-emerald-400 font-medium flex items-center gap-1.5">
                  <Beaker className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{activeModalItem.labTest}</span>
                </p>
              </div>
            </div>

            {/* Senarai Fungsi Lengkap */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Fungsi Biologi Dalam Tubuh Manusia:</p>
              <ul className="space-y-2">
                {activeModalItem.functions.map((fn, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{fn}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Jika Vitamin atau Mineral: Papar Jadual Sub-Jenis */}
            {activeModalItem.subTypes && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pecahan Jenis, Fungsi & Kesan Kekurangan:</p>
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {activeModalItem.subTypes.map((st, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{st.name}</span>
                        <span className="text-[11px] font-semibold text-emerald-400">{st.source}</span>
                      </div>
                      <p className="text-slate-300"><strong>Fungsi:</strong> {st.role}</p>
                      <p className="text-rose-400"><strong>Penyakit Kekurangan:</strong> {st.deficiency}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kesan Kekurangan & Berlebihan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs space-y-1">
                <p className="font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Kesan Kekurangan</span>
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {activeModalItem.deficiencyEffects}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs space-y-1">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Kesan Pengambilan Berlebihan</span>
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {activeModalItem.excessEffects}
                </p>
              </div>
            </div>

            {/* Butang Tutup */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModalItem(null)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm"
              >
                Selesai Membaca
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
