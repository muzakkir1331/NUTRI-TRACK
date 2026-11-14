export const FOOD_CLASSES_DATA = [
  {
    id: "karbohidrat",
    name: "Karbohidrat",
    subtitle: "Sumber Utama Tenaga Segera Tubuh",
    energyValue: "16.7 kJ / g (4 kcal / g)",
    elements: "Karbon (C), Hidrogen (H), Oksigen (O)",
    color: "amber",
    badge: "Pembekal Tenaga",
    functions: [
      "Membekalkan tenaga utama untuk aktiviti harian dan fungsi otak",
      "Dipecahkan kepada glukosa semasa pencernaan untuk respirasi sel",
      "Disimpan sebagai glikogen di dalam hati dan otot jika berlebihan"
    ],
    sources: [
      { name: "Nasi Putih / Beras Perang", tag: "Makanan Asasi Malaysia", emoji: "🍚" },
      { name: "Ubi Kayu & Keledek", tag: "Karbohidrat Kompleks", emoji: "🍠" },
      { name: "Roti Canai / Capati", tag: "Snek Kantin Sekolah", emoji: "🫓" },
      { name: "Jagung Manis", tag: "Bijirin Bijian", emoji: "🌽" }
    ],
    deficiencyEffects: "Kelesuan, pengsan, hipoglisemia (kurang gula dalam darah), dan penurunan berat badan mendadak.",
    excessEffects: "Kegendutan (obesiti) dan risiko penyakit kencing manis (Diabetes melitus jenis 2).",
    labTest: "Ujian Iodin (Kanji) & Ujian Benedict (Gula Penurun)"
  },
  {
    id: "protein",
    name: "Protein",
    subtitle: "Bahan Binaan Tisu, Pertumbuhan & Pembaikan Sel",
    energyValue: "16.7 kJ / g (4 kcal / g)",
    elements: "Karbon (C), Hidrogen (H), Oksigen (O), Nitrogen (N), kadangkala Sulfur & Fosforus",
    color: "emerald",
    badge: "Pertumbuhan & Enzim",
    functions: [
      "Membina sel-sel baharu untuk tumbesaran kanak-kanak dan remaja",
      "Membaiki tisu badan yang rosak dan menyembuhkan luka",
      "Membentuk enzim, hormon, antibodi, dan hemoglobin darah"
    ],
    sources: [
      { name: "Ikan Kembung / Tongkol", tag: "Protein Haiwan Berkualiti", emoji: "🐟" },
      { name: "Telur Ayam", tag: "Makanan Super Sekolah", emoji: "🥚" },
      { name: "Tempe & Tauhu", tag: "Protein Tumbuhan / Kekacang", emoji: "🥢" },
      { name: "Susu Segar & Dadih", tag: "Kalsium + Protein", emoji: "🥛" }
    ],
    deficiencyEffects: "Penyakit Kwashiorkor (perut buncit, otot susut), Marasmus, tumbesaran terbantut, luka lambat sembuh.",
    excessEffects: "Beban asid urik tinggi yang boleh membebankan buah pinggang dan risiko gout.",
    labTest: "Ujian Millon (Mendakan Merah Bata)"
  },
  {
    id: "lemak",
    name: "Lemak",
    subtitle: "Penyimpan Tenaga Padat & Penebat Haba Badan",
    energyValue: "37.6 kJ / g (9 kcal / g)",
    elements: "Karbon (C), Hidrogen (H), Oksigen (O) dengan nisbah oksigen sangat rendah",
    color: "rose",
    badge: "Penebat & Pelarut",
    functions: [
      "Membekalkan tenaga dua kali ganda lebih padat berbanding karbohidrat",
      "Bertindak sebagai penebat haba untuk mengawal suhu badan di bawah kulit",
      "Melindungi organ dalaman (buah pinggang, jantung) daripada hentakan",
      "Melarutkan vitamin larut lemak: Vitamin A, D, E, dan K"
    ],
    sources: [
      { name: "Minyak Kelapa Sawit", tag: "Minyak Masak Tempatan", emoji: "🌴" },
      { name: "Kacang Tanah & Gajus", tag: "Lemak Tidak Tepu", emoji: "🥜" },
      { name: "Santan Kelapa", tag: "Masakan Tradisi", emoji: "🥥" },
      { name: "Mentega / Marjerin", tag: "Lemak Tepu", emoji: "🧈" }
    ],
    deficiencyEffects: "Mudah berasa sejuk, kulit kering, dan kegagalan penyerapan vitamin A, D, E, dan K.",
    excessEffects: "Penyumbatan salur arteri (arteriosklerosis), tekanan darah tinggi, dan serangan penyakit jantung.",
    labTest: "Ujian Alkohol-Emulsi (Etanol) & Tompok Lut Sinar"
  },
  {
    id: "vitamin",
    name: "Vitamin",
    subtitle: "Pengekal Kesihatan Tubuh & Pelindung Imuniti",
    energyValue: "0 kJ (Tidak membekalkan tenaga)",
    elements: "Sebatian organik berbeza-beza mengikut jenis",
    color: "cyan",
    badge: "Kesihatan & Imuniti",
    classification: [
      { type: "Larut Air", items: "Vitamin B & Vitamin C (perlu diambil setiap hari kerana disingkir melalui air kencing jika berlebihan)" },
      { type: "Larut Lemak", items: "Vitamin A, D, E & K (disimpan di dalam hati dan tisu lemak badan)" }
    ],
    subTypes: [
      { code: "A", name: "Vitamin A (Retinol)", role: "Kesihatan mata & penglihatan malam, kulit sihat", source: "Lobak merah, hati, betik", deficiency: "Rabun malam (Night blindness), kulit kering" },
      { code: "B", name: "Vitamin B Kompleks", role: "Fungsi sistem saraf, pembentukan sel darah merah", source: "Yis, beras perang, hati ayam", deficiency: "Beri-beri, anemia, kebas kaki tangan" },
      { code: "C", name: "Vitamin C (Asid Askorbik)", role: "Kesihatan gusi/gigi, imuniti, penyembuhan luka", source: "Jambu batu, oren, limau, tomato", deficiency: "Skurvi (gusi berdarah, gigi goyang)" },
      { code: "D", name: "Vitamin D (Kalsiferol)", role: "Membantu penyerapan kalsium untuk tulang & gigi", source: "Cahaya matahari pagi, kuning telur, minyak ikan", deficiency: "Riket (tulang lembut & kaki melengkung)" },
      { code: "E", name: "Vitamin E (Tokoferol)", role: "Antioksidan, kesihatan kulit dan sistem pembiakan", source: "Minyak sayuran, biji bunga matahari", deficiency: "Kemandulan, kerosakan sel darah merah" },
      { code: "K", name: "Vitamin K (Filokuinon)", role: "Membantu proses pembekuan darah semasa luka", source: "Bayam, kubis, brokoli, kuning telur", deficiency: "Darah lambat membeku, pendarahan berlebihan" }
    ],
    functions: [
      "Memelihara kesihatan mata, kulit, gusi, tulang, dan sistem saraf",
      "Membina ketahanan badan dan sistem imuniti melawan jangkitan penyakit",
      "Mengawal atur proses metabolik penting dalam sel"
    ],
    sources: [
      { name: "Jambu Batu & Limau", tag: "Kaya Vitamin C", emoji: "🍈" },
      { name: "Lobak Merah & Betik", tag: "Kaya Vitamin A", emoji: "🥕" },
      { name: "Sayuran Berdaun Hijau (Bayam)", tag: "Kaya Vitamin K & Asid Folik", emoji: "🥬" },
      { name: "Sinar Matahari Pagi", tag: "Sintesis Vitamin D Semula Jadi", emoji: "☀️" }
    ],
    deficiencyEffects: "Skurvi, Riket, Rabun Malam, Beri-beri, dan darah lambat membeku mengikut jenis vitamin.",
    excessEffects: "Hipervitaminosis (terutamanya bagi vitamin larut lemak A dan D jika diambil melalui suplemen berlebihan).",
    labTest: "Ujian DCPIP (Penentuan kandungan Vitamin C)"
  },
  {
    id: "mineral",
    name: "Mineral",
    subtitle: "Bahan Bukan Organik Pengawal Atur Proses Badan",
    energyValue: "0 kJ (Tidak membekalkan tenaga)",
    elements: "Unsur bukan organik",
    color: "indigo",
    badge: "Tulang, Darah & Enzim",
    subTypes: [
      { code: "Ca", name: "Kalsium", role: "Membina tulang dan gigi yang kuat, bantu pembekuan darah", source: "Susu, keju, ikan bilis bersama tulang", deficiency: "Riket, osteoporosis (tulang rapuh)" },
      { code: "Fe", name: "Besi (Ferum)", role: "Membina hemoglobin dalam sel darah merah untuk angkut oksigen", source: "Hati, daging merah, bayam, kerang", deficiency: "Anemia (pucat, cepat letih, pening)" },
      { code: "I", name: "Iodin", role: "Sintesis hormon tiroksina oleh kelenjar tiroid", source: "Garam beriodin, makanan laut, rumpai laut", deficiency: "Goiter (bengkak pada leher / kelenjar tiroid)" },
      { code: "Na", name: "Natrium", role: "Mengekalkan keseimbangan bendalir badan dan fungsi saraf", source: "Garam masakan, makanan proses", deficiency: "Kekejangan otot (muscle cramps)" },
      { code: "P", name: "Fosforus", role: "Membina tulang/gigi dan sintesis molekul tenaga ATP", source: "Keju, telur, daging, kekacang", deficiency: "Riket, gigi rapuh" },
      { code: "K", name: "Kalium", role: "Fungsi pengecutan otot dan penghantaran impuls saraf", source: "Pisang, air kelapa, kentang", deficiency: "Kelumpuhan otot, degupan jantung tidak sekata" }
    ],
    functions: [
      "Menguatkan struktur rangka tulang dan enamel gigi",
      "Membentuk komponen hemoglobin darah (Besi) dan hormon tiroid (Iodin)",
      "Mengekalkan keseimbangan cecair dan kepekatan elektrolit dalam tubuh"
    ],
    sources: [
      { name: "Ikan Bilis & Susu", tag: "Kaya Kalsium", emoji: "🥛" },
      { name: "Bayam & Hati Lembu", tag: "Kaya Besi (Ferum)", emoji: "🥩" },
      { name: "Garam Beriodin & Makanan Laut", tag: "Kaya Iodin", emoji: "🧂" },
      { name: "Pisang Berangan & Kelapa", tag: "Kaya Kalium", emoji: "🍌" }
    ],
    deficiencyEffects: "Osteoporosis, Anemia, Goiter, dan kekejangan otot.",
    excessEffects: "Tekanan darah tinggi (hipertensi) jika mengambil natrium/garam berlebihan.",
    labTest: "Analisis Spektroskopi Unsur Makmal"
  },
  {
    id: "pelawas",
    name: "Pelawas (Serat)",
    subtitle: "Penggalak Peristalsis & Pencegah Sembelit Usus",
    energyValue: "0 kJ (Tidak dicernakan oleh enzim manusia)",
    elements: "Polisakarida selulosa daripada dinding sel tumbuhan",
    color: "emerald",
    badge: "Kesihatan Usus",
    functions: [
      "Merangsang proses peristalsis (pengecutan beritma otot salur pencernaan)",
      "Menyerap air untuk membentuk tinja (feses) yang lembut dan mudah disingkirkan",
      "Mencegah sembelit dan mengurangkan risiko kanser usus besar (kanser kolon)",
      "Membantu mengawal paras glukosa darah dan kolesterol"
    ],
    sources: [
      { name: "Bendi & Ulam-ulaman", tag: "Serat Larut Air Tinggi", emoji: "🌿" },
      { name: "Roti Bijirin Penuh & Oat", tag: "Bijirin Kompleks", emoji: "🍞" },
      { name: "Betik & Epal", tag: "Buah Berserat Segar", emoji: "🍎" },
      { name: "Kacang Peas & Dal", tag: "Kekacang Berkhasiat", emoji: "🫘" }
    ],
    deficiencyEffects: "Sembelit (kesukaran membuang air besar), buasir, dan peningkatan risiko kanser usus besar.",
    excessEffects: "Kembung perut atau angin sekiranya diambil secara mendadak tanpa bekalan air mencukupi.",
    labTest: "Ujian Pengekstrakan Selulosa Dinding Sel"
  },
  {
    id: "air",
    name: "Air",
    subtitle: "Medium Biokimia, Pelarut Sejagat & Pengawal Suhu",
    energyValue: "0 kJ (Komponen asas kehidupan)",
    elements: "Molekul H₂O (Hidrogen & Oksigen)",
    color: "cyan",
    badge: "Pelarut Sejagat",
    functions: [
      "Membentuk kira-kira 70% daripada jisim tubuh manusia",
      "Bertindak sebagai pelarut bahan kimia untuk semua tindak balas biokimia sel",
      "Mengangkut nutrien, hormon, dan gas oksigen ke sel serta menyingkirkan bahan kumuh",
      "Mengawal atur suhu badan melalui proses perpeluhan dan sejatan"
    ],
    sources: [
      { name: "Air Kosong / Air Masak", tag: "Pilihan Terbaik Sekolah", emoji: "💧" },
      { name: "Tembikai & Timun", tag: "Kandungan Air > 90%", emoji: "🍉" },
      { name: "Air Kelapa Muda", tag: "Elektrolit Semula Jadi", emoji: "🥥" },
      { name: "Sup Sayur Jernih", tag: "Hidangan Kantin Sihat", emoji: "🥣" }
    ],
    deficiencyEffects: "Dehidrasi (kekeringan air), pening kepala, kulit hilang keanjalan, halusinasi, dan kegagalan buah pinggang.",
    excessEffects: "Keracunan air (hiponatremia) akibat pencairan melampau paras garam dalam darah (jarang berlaku).",
    labTest: "Ujian Kertas Kobalt(II) Klorida (Biru bertukar Merah Jambu)"
  }
];
