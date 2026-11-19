import React, { useState } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Info,
  Droplet,
  Box
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const ORGANS = [
  {
    id: 'mulut',
    name: '1. Mulut & Kelenjar Air Liur',
    icon: '👄',
    type: 'Pencernaan Fizikal & Kimia',
    ph: 'pH 6.5 – 7.5 (Neutral)',
    secretions: 'Air liur mengandungi enzim Amilase Air Liur & mukus',
    action: 'Gigi mengunyah makanan (pencernaan fizikal). Enzim amilase mencernakan kanji kepada maltosa (gula kompleks). Bolus makanan dibentuk oleh lidah.',
    equation: 'Kanji + Air --(Amilase Air Liur)--> Maltosa',
    funFact: 'Kelenjar air liur manusia merembeskan kira-kira 1 hingga 1.5 liter air liur setiap hari!'
  },
  {
    id: 'esofagus',
    name: '2. Esofagus (Peristalsis)',
    icon: '🥖',
    type: 'Pengangkutan Bolus',
    ph: 'Neutral',
    secretions: 'Mukus pelincir',
    action: 'Tiub berotot menghubungkan mulut ke perut. Bolus ditolak ke bawah melalui proses Peristalsis (pengecutan dan pengenduran beritma otot dinding esofagus). Tiada pencernaan kimia berlaku di sini.',
    equation: 'Pengecutan Otot Lingkaran & Membujur (Peristalsis)',
    funFact: 'Oleh kerana peristalsis berlaku secara mekanikal, anda masih boleh menelan makanan walaupun berada dalam keadaan terbalik!'
  },
  {
    id: 'perut',
    name: '3. Perut (Gaster)',
    icon: '🫀',
    type: 'Pencernaan Fizikal & Kimia',
    ph: 'pH 1.5 – 2.0 (Sangat Asid)',
    secretions: 'Jus Gastrik: Asid hidroklorik (HCl), enzim Protease (Pepsin) & Mukus',
    action: 'Dinding perut berotot tebal menggaul makanan menjadi separa cecair (kim). Asid hidroklorik membunuh bakteria dan menyediakan medium berasid untuk pepsin memecahkan protein menjadi polipeptida.',
    equation: 'Protein --(Pepsin / Medium Asid)--> Polipeptida',
    funFact: 'Lapisan mukus tebal melindungi dinding perut daripada dicerna oleh asid dan enzimnya sendiri.'
  },
  {
    id: 'duodenum',
    name: '4. Duodenum (Usus Kecil Permulaan)',
    icon: '🥨',
    type: 'Pencernaan Kimia & Emulsi',
    ph: 'pH 7.5 – 8.0 (Sedikit Beralkali)',
    secretions: 'Jus Hempedu (daripada Hati/Pundi Hempedu) & Jus Pankreas',
    action: 'Hempedu mengemulsikan lemak menjadi titisan halus (tindakan fizikal). Jus pankreas merembeskan Amilase Pankreas, Tripsin (Protease), dan Lipase untuk menyambung pencernaan.',
    equation: 'Lemak --(Hempedu)--> Titisan Halus; Kanji --(Amilase)--> Maltosa; Polipeptida --(Tripsin)--> Peptida; Lemak --(Lipase)--> Asid Lemak + Gliserol',
    funFact: 'Hati menghasilkan jus hempedu yang disimpan di dalam pundi hempedu sebelum disalurkan ke duodenum.'
  },
  {
    id: 'usus_kecil',
    name: '5. Usus Kecil (Ileum)',
    icon: '🌀',
    type: 'Pencernaan Lengkap & Penyerapan',
    ph: 'pH 7.5 – 8.0 (Beralkali)',
    secretions: 'Jus Usus: Enzim Maltase & Protease (Peptidase)',
    action: 'Semua pencernaan makanan selesai di sini. Maltosa dicernakan kepada glukosa. Peptida dicernakan kepada asid amino. Dinding ileum dilitupi jutaan unjuran vilus halus untuk penyerapan nutrien ringkas ke dalam darah.',
    equation: 'Maltosa --(Maltase)--> Glukosa; Peptida --(Peptidase)--> Asid Amino',
    funFact: 'Panjang usus kecil manusia adalah sekitar 6 meter dengan luas permukaan penyerapan sebesar gelanggang tenis!'
  },
  {
    id: 'kolon',
    name: '6. Usus Besar (Kolon)',
    icon: '🔄',
    type: 'Penyerapan Semula Air & Pembentukan Tinja',
    ph: 'Neutral',
    secretions: 'Mukus pelicin tinja',
    action: 'Makanan yang tidak tercerna (terutamanya pelawas/serat selulosa) masuk ke kolon. Penyerapan semula air dan garam mineral berlaku di sini. Saki-baki pepejal membentuk tinja (feses).',
    equation: 'Penyerapan Semula Air & Mineral',
    funFact: 'Bakteria baik di dalam usus besar membantu menghasilkan Vitamin K dan Vitamin B12 untuk tubuh kita.'
  },
  {
    id: 'rektum',
    name: '7. Rektum & Dubur',
    icon: '🚪',
    type: 'Penyingkiran Tinja (Penyahtinjaan)',
    ph: 'Neutral',
    secretions: 'Tiada',
    action: 'Tinja disimpan sementara di dalam rektum. Apabila rektum penuh, otot rektum mengecut dan tinja disingkirkan keluar melalui bukaan dubur dalam proses penyahtinjaan (defekasi).',
    equation: 'Proses Penyahtinjaan (Defekasi)',
    funFact: 'Pengambilan pelawas (serat) yang cukup menghalang sembelit dengan melembutkan tinja.'
  }
];

export default function DigestionMap({ onSwitchTo3D }) {
  const [selectedOrgan, setSelectedOrgan] = useState(ORGANS[0]);
  const [isSimulatingPeristalsis, setIsSimulatingPeristalsis] = useState(false);

  const handleSelectOrgan = (organ) => {
    soundFx.playClick();
    setSelectedOrgan(organ);
  };

  const handleAnimatePeristalsis = () => {
    soundFx.playBubble();
    setIsSimulatingPeristalsis(true);
    setTimeout(() => {
      setIsSimulatingPeristalsis(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Pengenalan Peta Salur Pencernaan */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Standard Pembelajaran: SP 3.3.1</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-indigo-400" />
            <span>Peta Interaktif Salur Pencernaan Manusia</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Telusuri perjalanan makanan sepanjang 9 meter salur pencernaan: daripada proses pengunyahan mekanikal di mulut sehingga penyahtinjaan di dubur.
          </p>
        </div>

        {onSwitchTo3D && (
          <button
            onClick={() => { soundFx.playClick(); onSwitchTo3D(); }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/25 shrink-0 border border-indigo-400/40 transition-all hover:scale-105"
          >
            <Box className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>Buka Model 3D WebGL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Navigasi Aliran Salur Pencernaan (Langkah Demi Langkah) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {ORGANS.map((org) => (
          <button
            key={org.id}
            onClick={() => handleSelectOrgan(org)}
            className={`p-2.5 rounded-2xl border text-center transition-all ${
              selectedOrgan.id === org.id
                ? 'bg-indigo-500/20 border-indigo-500 text-white font-bold shadow-lg shadow-indigo-950/40'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <div className="text-2xl mb-1">{org.icon}</div>
            <div className="text-[11px] truncate">{org.name.split('.')[1] || org.name}</div>
          </button>
        ))}
      </div>

      {/* Paparan Terperinci Organ Dipilih */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolum Kiri: Visual Organ & Simulasi Peristalsis (5 Kolum) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Organ Terpilih:</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
              {selectedOrgan.ph}
            </span>
          </div>

          {/* Visual Kad Besar */}
          <div className="text-center py-6 space-y-2">
            <span className="text-7xl block animate-bounce" style={{ animationDuration: '3s' }}>
              {selectedOrgan.icon}
            </span>
            <h3 className="text-2xl font-black text-white">{selectedOrgan.name}</h3>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {selectedOrgan.type}
            </span>
          </div>

          {/* Simulasi Gelombang Peristalsis Esofagus / Salur Pencernaan */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Simulasi Peristalsis Berotot
              </span>
              <button
                onClick={handleAnimatePeristalsis}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
              >
                Gerakkan Bolus
              </button>
            </div>

            {/* Animasi Gelombang Salur */}
            <div className="w-full h-8 bg-slate-900 rounded-xl overflow-hidden relative flex items-center border border-slate-800">
              <div 
                className={`w-6 h-6 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 absolute transition-all duration-1000 ${
                  isSimulatingPeristalsis ? 'left-[85%]' : 'left-2'
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] text-slate-600 font-mono pointer-events-none">
                <span>Pengecutan Otot</span>
                <span>Pengenduran</span>
                <span>Pengecutan</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              Gelombang peristalsis menolak makanan sepanjang salur pencernaan tanpa dipengaruhi tarikan graviti.
            </p>
          </div>

          {/* Fakta Menarik */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300">
            <strong>Fakta Sains:</strong> {selectedOrgan.funFact}
          </div>

        </div>

        {/* Kolum Kanan: Tindakan Biokimia & Persamaan Enzim (7 Kolum) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Perincian Proses Biologi</span>
            <h4 className="text-xl font-extrabold text-white mt-1">Mekanisme Tindakan di {selectedOrgan.name.split('.')[1]}</h4>
          </div>

          {/* Rembesan Cecair & Enzim */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Rembesan Cecair / Enzim:</span>
            <p className="text-sm font-bold text-emerald-400">{selectedOrgan.secretions}</p>
          </div>

          {/* Tindakan Pencernaan */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Huraian Tindakan Pencernaan:</span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-950 border border-slate-800">
              {selectedOrgan.action}
            </p>
          </div>

          {/* Persamaan Tindak Balas Kimia Enzim */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Persamaan Tindak Balas Kimia KSSM:
            </span>
            <div className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-amber-300 font-semibold border border-slate-800">
              {selectedOrgan.equation}
            </div>
          </div>

          {/* Organ Sampingan Terlibat */}
          <div className="p-3.5 rounded-xl bg-slate-950 text-xs text-slate-400 space-y-1 border border-slate-800">
            <strong className="text-slate-200">Peranan Organ Sampingan:</strong>
            <p>• <strong>Hati:</strong> Merembeskan jus hempedu untuk mengemulsi lemak (memecahkan lemak kepada titisan halus secara fizikal).</p>
            <p>• <strong>Pundi Hempedu:</strong> Menyimpan dan memekatkan jus hempedu sebelum dilepaskan ke duodenum.</p>
            <p>• <strong>Pankreas:</strong> Merembeskan jus pankreas yang mengandungi amilase, tripsin, dan lipase.</p>
          </div>

        </div>

      </div>

    </div>
  );
}
