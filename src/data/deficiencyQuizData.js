export const DEFICIENCY_QUIZ_DATA = [
  {
    id: 1,
    patientName: "Adik Aiman (9 Tahun)",
    avatar: "👦",
    complaint: "Gusi kerap berdarah secara spontan semasa memberus gigi, terdapat bintik-bintik lebam merah pada kulit lengan, dan luka jatuh basikal 3 minggu lepas masih belum sembuh sepenuhnya.",
    symptoms: [
      "Gusi bengkak dan mudah berdarah",
      "Kulit berbintik lebam (pendarahan kapilari)",
      "Luka lambat sembuh dan sendi berasa lenguh"
    ],
    diagnosisOptions: [
      { text: "Skurvi (Kekurangan Vitamin C)", isCorrect: true },
      { text: "Riket (Kekurangan Vitamin D)", isCorrect: false },
      { text: "Kwashiorkor (Kekurangan Protein)", isCorrect: false },
      { text: "Goiter (Kekurangan Iodin)", isCorrect: false }
    ],
    dietOptions: [
      { text: "Jambu batu, limau, oren, dan buah betik segar", isCorrect: true },
      { text: "Minyak sapi, mentega, dan santan pekat", isCorrect: false },
      { text: "Garam beriodin dan rumpai laut", isCorrect: false },
      { text: "Hati lembu dan kerang rebus", isCorrect: false }
    ],
    explanation: "Vitamin C (asid askorbik) sangat mustahil untuk sintesis gentian kolagen yang mencantumkan sel-sel tisu gusi dan dinding kapilari darah. Kekurangannya menyebabkan penyakit Skurvi. Jambu batu merupakan salah satu buah tempatan yang mempunyai kepekatan Vitamin C tertinggi!"
  },
  {
    id: 2,
    patientName: "Adik Baby Dania (3 Tahun)",
    avatar: "👧",
    complaint: "Perut membesar secara abnormal (membuncit dengan cecair edema), namun otot-otot di lengan dan pahanya sangat kurus dan susut. Kulitnya mengelupas dan rambutnya menjadi kusam kemerah-merahan.",
    symptoms: [
      "Perut buncit akibat pengumpulan cecair (edema)",
      "Kehilangan jisim otot yang ketara",
      "Tumbesaran fizikal dan perkembangan mental terbantut"
    ],
    diagnosisOptions: [
      { text: "Kwashiorkor (Kekurangan Protein Teruk)", isCorrect: true },
      { text: "Beri-beri (Kekurangan Vitamin B1)", isCorrect: false },
      { text: "Anemia (Kekurangan Zat Besi)", isCorrect: false },
      { text: "Rabun Malam (Kekurangan Vitamin A)", isCorrect: false }
    ],
    dietOptions: [
      { text: "Susu kaya protein, telur rebus, ikan, sup ayam, dan tempe", isCorrect: true },
      { text: "Air gula sirap pekat dan nasi kosong sahaja", isCorrect: false },
      { text: "Minyak masak kelapa sawit sahaja", isCorrect: false },
      { text: "Ulam pucuk paku mentah tanpa protein", isCorrect: false }
    ],
    explanation: "Kwashiorkor berpunca daripada kekurangan protein yang parah dalam diet (biasanya berlaku kepada kanak-kanak yang disapih dengan diet berkanji tanpa sumber protein). Protein amat penting untuk membina tisu baharu dan mengekalkan tekanan osmotik darah."
  },
  {
    id: 3,
    patientName: "Puan Salmah (38 Tahun)",
    avatar: "👩",
    complaint: "Terdapat benjolan bengkak yang semakin membesar di bahagian hadapan leher (kawasan kelenjar tiroid). Beliau tinggal di kawasan pedalaman tanah tinggi dan sering berasa letih serta sukar menelan makanan.",
    symptoms: [
      "Pembengkakan besar di pangkal leher (kelenjar tiroid)",
      "Kadar metabolisme badan rendah dan cepat penat",
      "Kekurangan bekalan makanan laut dalam diet seharian"
    ],
    diagnosisOptions: [
      { text: "Goiter (Kekurangan Mineral Iodin)", isCorrect: true },
      { text: "Osteoporosis (Kekurangan Kalsium)", isCorrect: false },
      { text: "Skurvi (Kekurangan Vitamin C)", isCorrect: false },
      { text: "Marasmus (Kekurangan Karbohidrat)", isCorrect: false }
    ],
    dietOptions: [
      { text: "Penggunaan garam beriodin, ikan laut, kerang, dan rumpai laut", isCorrect: true },
      { text: "Makan ubi kayu rebus tanpa garam", isCorrect: false },
      { text: "Minum air suling tanpa mineral", isCorrect: false },
      { text: "Kurangkan semua jenis makanan laut", isCorrect: false }
    ],
    explanation: "Kelenjar tiroid memerlukan mineral Iodin untuk merembeskan hormon tiroksina yang mengawal metabolisme badan. Apabila iodin tidak mencukupi, kelenjar tiroid terpaksa membesar (hipertrofi) membentuk Goiter untuk cuba memerangkap iodin yang sedikit."
  },
  {
    id: 4,
    patientName: "Nurul (Murid 2 Arif - 14 Tahun)",
    avatar: "🧕",
    complaint: "Kerap mengadu pening kepala, muka dan tapak tangan kelihatan sangat pucat, dan mudah sesak nafas atau berdebar-debar apabila menaiki tangga ke kelas tingkat tiga.",
    symptoms: [
      "Wajah, bibir, dan dasar kuku kelihatan pucat lesu",
      "Kerap pening, letih berterusan, dan sukar fokus di dalam kelas",
      "Kadar hemoglobin dalam darah berada di bawah paras normal"
    ],
    diagnosisOptions: [
      { text: "Anemia (Kekurangan Mineral Besi/Ferum)", isCorrect: true },
      { text: "Rabun Malam (Kekurangan Vitamin A)", isCorrect: false },
      { text: "Riket (Kekurangan Vitamin D)", isCorrect: false },
      { text: "Beri-beri (Kekurangan Vitamin B)", isCorrect: false }
    ],
    dietOptions: [
      { text: "Bayam, hati ayam, kerang, daging merah, dan ulam pegaga", isCorrect: true },
      { text: "Air teh pekat setiap kali selepas makan", isCorrect: false },
      { text: "Gula-gula dan minuman berkarbonat", isCorrect: false },
      { text: "Nasi pulut santan sahaja", isCorrect: false }
    ],
    explanation: "Zat Besi (Ferum) merupakan komponen teras molekul hemoglobin dalam sel darah merah. Hemoglobin berfungsi mengangkut gas oksigen dari paru-paru ke seluruh sel badan. Kekurangan besi menyebabkan sel kurang mendapat oksigen untuk respirasi sel, lalu pesakit menjadi pucat dan lesu."
  },
  {
    id: 5,
    patientName: "Adik Zikri (5 Tahun)",
    avatar: "🧒",
    complaint: "Tulang kedua-dua belah kakinya melengkung ke luar membentuk huruf 'O' (bow-legs) ketika berjalan. Tulang pergelangan tangan membesar dan giginya lambat tumbuh serta rapuh.",
    symptoms: [
      "Tulang kaki bengkok (bentuk 'O' atau 'X') akibat menampung berat badan",
      "Tulang lembut dan lemah (penulangan tidak sempurna)",
      "Kerap berada di dalam rumah tanpa pendedahan cahaya matahari"
    ],
    diagnosisOptions: [
      { text: "Riket (Kekurangan Vitamin D / Kalsium)", isCorrect: true },
      { text: "Kwashiorkor (Kekurangan Protein)", isCorrect: false },
      { text: "Goiter (Kekurangan Iodin)", isCorrect: false },
      { text: "Skurvi (Kekurangan Vitamin C)", isCorrect: false }
    ],
    dietOptions: [
      { text: "Susu diperkaya, keju, minyak ikan, kuning telur, dan berjemur matahari pagi", isCorrect: true },
      { text: "Makan kerepek kentang masin", isCorrect: false },
      { text: "Minum minuman berkarbonat tinggi fosfat", isCorrect: false },
      { text: "Nasi putih kosong sahaja", isCorrect: false }
    ],
    explanation: "Vitamin D membantu usus kecil menyerap Kalsium dan Fosforus untuk membina garam kalsium fosfat dalam matriks tulang. Tanpa Vitamin D yang mencukupi, tulang kanak-kanak menjadi lembut dan membengkok di bawah beban tubuh, dinamakan Riket."
  },
  {
    id: 6,
    patientName: "Encik Ramli (45 Tahun)",
    avatar: "👨",
    complaint: "Penglihatan matanya sangat kabur dan sukar melihat objek pada waktu senja atau dalam keadaan bilik malap, walaupun pada waktu siang penglihatannya normal. Kornea matanya juga mula kering.",
    symptoms: [
      "Hilang keupayaan menyesuaikan diri untuk melihat dalam cahaya malap (senja/malam)",
      "Lapisan kornea mata kering dan bersisik (xerophthalmia)",
      "Jarang memakan sayur-sayuran jingga atau kuning"
    ],
    diagnosisOptions: [
      { text: "Rabun Malam (Kekurangan Vitamin A)", isCorrect: true },
      { text: "Katarak Mata", isCorrect: false },
      { text: "Beri-beri (Kekurangan Vitamin B)", isCorrect: false },
      { text: "Anemia (Kekurangan Zat Besi)", isCorrect: false }
    ],
    dietOptions: [
      { text: "Lobak merah, betik, labu, hati lembu, dan minyak hati ikan", isCorrect: true },
      { text: "Beras putih kisar halus tanpa lauk", isCorrect: false },
      { text: "Air batu campur manis", isCorrect: false },
      { text: "Keropok lekor goreng", isCorrect: false }
    ],
    explanation: "Vitamin A (retinol/karotena) amat penting untuk pembentukan pigmen rodopsin pada sel rod retina mata yang membolehkan penglihatan dalam cahaya malap. Kekurangan Vitamin A menyebabkan Rabun Malam dan kerosakan kekal pada kornea jika tidak dirawat."
  }
];
