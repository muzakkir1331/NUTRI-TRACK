import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Flame, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Tag
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export const CANTEEN_PRODUCTS = [
  {
    id: 'nasi_lemak_bungkus',
    name: 'Nasi Lemak Daun Pisang',
    category: 'Sarapan / Makanan Berat',
    stall: 'Gerai 1: Makanan Tradisi',
    serving: '1 bungkus (180g)',
    kcal: 380,
    kj: 1590,
    sugarG: 6,
    sodiumMg: 520,
    fatG: 14,
    trafficLight: 'kuning',
    trafficReason: 'Lemak daripada santan sederhana, gula dalam sambal sederhana.',
    ingredients: 'Beras, santan, ikan bilis, telur rebus separuh, sambal tumis, timun.',
    healthScore: 70
  },
  {
    id: 'bihun_goreng',
    name: 'Bihun Goreng Sayur & Telur',
    category: 'Sarapan / Mi',
    stall: 'Gerai 2: Selera Timur',
    serving: '1 pinggan (200g)',
    kcal: 310,
    kj: 1297,
    sugarG: 3,
    sodiumMg: 460,
    fatG: 9,
    trafficLight: 'hijau',
    trafficReason: 'Rendah lemak tepu, mengandungi taugeh dan sawi segar serta telur.',
    ingredients: 'Bihun beras, telur, sawi, taugeh, minyak sawit sedikit, bawang.',
    healthScore: 85
  },
  {
    id: 'roti_sosej_keju',
    name: 'Roti Sosej & Sos Keju',
    category: 'Roti / Pastri Koperasi',
    stall: 'Koperasi Sekolah',
    serving: '1 ketul (110g)',
    kcal: 340,
    kj: 1422,
    sugarG: 8,
    sodiumMg: 680,
    fatG: 18,
    trafficLight: 'merah',
    trafficReason: 'Tinggi natrium (garam) dan lemak tepu daripada daging terproses (sosej) dan sos keju.',
    ingredients: 'Tepung gandum, sosej ayam terproses, marjerin, sos keju sintetik, pengawet.',
    healthScore: 40
  },
  {
    id: 'keropok_lekor_goreng',
    name: 'Keropok Lekor Goreng (5 Batang)',
    category: 'Gorengan / Snek Panas',
    stall: 'Gerai 3: Snek Gorengan',
    serving: '5 batang + sos cili (150g)',
    kcal: 390,
    kj: 1632,
    sugarG: 14,
    sodiumMg: 580,
    fatG: 21,
    trafficLight: 'merah',
    trafficReason: 'Minyak serapan tinggi semasa menggoreng rendam, sos cili tinggi sirap gula.',
    ingredients: 'Ikan hancur, tepung sagu, garam, minyak masak sawit, sos cili botol.',
    healthScore: 45
  },
  {
    id: 'sandwic_telur_hancur',
    name: 'Sandwic Telur & Salad Gandum',
    category: 'Snek Sihat Kantin',
    stall: 'Gerai Sihat 1Malaysia',
    serving: '1 set (120g)',
    kcal: 220,
    kj: 920,
    sugarG: 2,
    sodiumMg: 280,
    fatG: 7,
    trafficLight: 'hijau',
    trafficReason: 'Protein tinggi, garam rendah, menggunakan roti gandum penuh kaya pelawas.',
    ingredients: 'Roti mil penuh, telur rebus hancur, salad, sedikit lada sulah, mayonis rendah lemak.',
    healthScore: 92
  },
  {
    id: 'kacang_kuda_rebus',
    name: 'Kacang Kuda Rebus Panas',
    category: 'Snek Kekacang',
    stall: 'Koperasi Sekolah',
    serving: '1 cawan kecil (130g)',
    kcal: 170,
    kj: 711,
    sugarG: 3,
    sodiumMg: 120,
    fatG: 3,
    trafficLight: 'hijau',
    trafficReason: 'Kaya serat (pelawas) dan protein tumbuhan tanpa minyak.',
    ingredients: 'Kacang kuda tulen, secubit garam, daun kari rebusan.',
    healthScore: 96
  },
  {
    id: 'air_sirap_limau',
    name: 'Air Sirap Ros Ais',
    category: 'Minuman Manis',
    stall: 'Gerai Minuman Kantin',
    serving: '1 cawan besar (300ml)',
    kcal: 140,
    kj: 586,
    sugarG: 32, // Lebih 7 sudu teh gula!
    sodiumMg: 15,
    fatG: 0,
    trafficLight: 'merah',
    trafficReason: 'Kandungan gula bebas melebihi had maksimum harian seorang murid (7 sudu teh gula).',
    ingredients: 'Air, sirap berperisa ros, gula pasir, pewarna carmoisine.',
    healthScore: 30
  },
  {
    id: 'air_soya_kotak',
    name: 'Susu Soya Rendah Gula',
    category: 'Minuman Koperasi',
    stall: 'Koperasi Sekolah',
    serving: '1 pek kotak (250ml)',
    kcal: 110,
    kj: 460,
    sugarG: 7,
    sodiumMg: 60,
    fatG: 2.5,
    trafficLight: 'hijau',
    trafficReason: 'Protein tumbuhan isoflavon, paras gula terkawal di bawah had KKM.',
    ingredients: 'Kacang soya bukan GMO, air bertapis, sedikit gula tebu perang.',
    healthScore: 88
  }
];

export default function CanteenCatalog() {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(CANTEEN_PRODUCTS[0]);
  const [filterCategory, setFilterCategory] = useState('Semua');

  const categories = ['Semua', 'Makanan Utama', 'Roti / Pastri Koperasi', 'Snek Sihat Kantin', 'Minuman'];

  const filteredProducts = CANTEEN_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.stall.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCategory === 'Semua' || p.category.includes(filterCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Carian & Filter */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <span>Katalog Makanan & Label Nutrisi Kantin/Koperasi</span>
          </h3>
          <p className="text-xs text-slate-400">
            Kaji fakta nutrisi sebenar bagi hidangan yang dijual di sekolah untuk membuat pilihan bijak.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari makanan kantin..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Senarai Makanan Kantin (6 Kolum) */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Pilih Hidangan ({filteredProducts.length}):
          </span>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => { soundFx.playClick(); setSelectedProduct(p); }}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                  selectedProduct?.id === p.id
                    ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-200">{p.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.trafficLight === 'hijau' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      p.trafficLight === 'kuning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {p.trafficLight}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 block">{p.stall} • {p.serving}</span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-amber-400 block">{p.kcal} kcal</span>
                  <span className="text-[11px] text-slate-500 font-mono">{p.kj} kJ</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Fakta Nutrisi Interaktif (Nutrition Label Sheet) (6 Kolum) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5">
          <div className="border-b-4 border-slate-700 pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">FAKTA NUTRISI MAKANAN</span>
            <h4 className="text-2xl font-black text-white mt-1">{selectedProduct.name}</h4>
            <p className="text-xs text-slate-400">{selectedProduct.stall} | {selectedProduct.category}</p>
          </div>

          {/* Saiz Hidangan & Kalori */}
          <div className="border-b-8 border-slate-700 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Saiz Hidangan:</span>
              <strong className="text-sm text-white">{selectedProduct.serving}</strong>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Jumlah Kalori:</span>
              <div className="text-3xl font-black text-amber-400 flex items-center gap-1">
                <Flame className="w-5 h-5 fill-amber-400" />
                <span>{selectedProduct.kcal}</span>
                <span className="text-xs font-normal text-slate-400">kcal</span>
              </div>
              <span className="text-xs text-cyan-400 font-mono">({selectedProduct.kj} kJ)</span>
            </div>
          </div>

          {/* Ujian Paras Gula, Garam & Lemak */}
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
              <span className="font-bold">Jumlah Lemak</span>
              <span className="font-mono font-bold text-white">{selectedProduct.fatG} g</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
              <span className="font-bold">Gula Bebas</span>
              <span className={`font-mono font-bold ${selectedProduct.sugarG > 15 ? 'text-rose-400' : 'text-white'}`}>
                {selectedProduct.sugarG} g {selectedProduct.sugarG > 15 && '(Tinggi!)'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
              <span className="font-bold">Natrium (Garam)</span>
              <span className={`font-mono font-bold ${selectedProduct.sodiumMg > 500 ? 'text-rose-400' : 'text-white'}`}>
                {selectedProduct.sodiumMg} mg {selectedProduct.sodiumMg > 500 && '(Tinggi!)'}
              </span>
            </div>
          </div>

          {/* Analisis Lampu Isyarat */}
          <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
            selectedProduct.trafficLight === 'hijau' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' :
            selectedProduct.trafficLight === 'kuning' ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' :
            'bg-rose-950/20 border-rose-500/30 text-rose-300'
          }`}>
            <div className="font-bold flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${
                selectedProduct.trafficLight === 'hijau' ? 'bg-emerald-400' :
                selectedProduct.trafficLight === 'kuning' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              <span className="uppercase tracking-wider">Status Lampu Isyarat: {selectedProduct.trafficLight}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {selectedProduct.trafficReason}
            </p>
          </div>

          {/* Ramuan Utama */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <span className="font-bold text-slate-300 block mb-1">Ramuan:</span>
            {selectedProduct.ingredients}
          </div>

        </div>

      </div>

    </div>
  );
}
