export const FOOD_SAMPLES = [
  {
    id: "kanji",
    name: "Ampaian Kanji (Air Nasi)",
    nutrient: "Kanji (Karbohidrat)",
    icon: "🍚",
    color: "#f8fafc",
    results: {
      iodine: { positive: true, color: "#1e1b4b", name: "Biru Tua", precipitate: false },
      benedict: { positive: false, color: "#38bdf8", name: "Kekal Biru", precipitate: false },
      millon: { positive: false, color: "#fef08a", name: "Tiada Mendakan Merah", precipitate: false },
      emulsion: { positive: false, color: "#e2e8f0", name: "Larutan Jernih (Tiada Emulsi)", precipitate: false }
    }
  },
  {
    id: "glukosa",
    name: "Larutan Glukosa 10%",
    nutrient: "Gula Penurun (Monosakarida)",
    icon: "🍬",
    color: "#fef3c7",
    results: {
      iodine: { positive: false, color: "#d97706", name: "Kekal Perang / Kuning", precipitate: false },
      benedict: { positive: true, color: "#b91c1c", name: "Mendakan Merah Bata", precipitate: true },
      millon: { positive: false, color: "#fef08a", name: "Tiada Mendakan Merah", precipitate: false },
      emulsion: { positive: false, color: "#e2e8f0", name: "Larutan Jernih (Tiada Emulsi)", precipitate: false }
    }
  },
  {
    id: "albumin",
    name: "Larutan Albumin Telur",
    nutrient: "Protein Tulen",
    icon: "🥚",
    color: "#fffbeb",
    results: {
      iodine: { positive: false, color: "#d97706", name: "Kekal Perang / Kuning", precipitate: false },
      benedict: { positive: false, color: "#38bdf8", name: "Kekal Biru", precipitate: false },
      millon: { positive: true, color: "#991b1b", name: "Mendakan Merah Bata", precipitate: true },
      emulsion: { positive: false, color: "#e2e8f0", name: "Larutan Jernih (Tiada Emulsi)", precipitate: false }
    }
  },
  {
    id: "minyak",
    name: "Minyak Kelapa Sawit",
    nutrient: "Lemak / Lipid",
    icon: "🌴",
    color: "#fef08a",
    results: {
      iodine: { positive: false, color: "#d97706", name: "Kekal Perang / Kuning", precipitate: false },
      benedict: { positive: false, color: "#38bdf8", name: "Kekal Biru", precipitate: false },
      millon: { positive: false, color: "#fef08a", name: "Tiada Mendakan Merah", precipitate: false },
      emulsion: { positive: true, color: "#ffffff", name: "Emulsi Putih Berawan", precipitate: true }
    }
  },
  {
    id: "suling",
    name: "Air Suling (Kawalan Negatif)",
    nutrient: "Tiada Makronutrien",
    icon: "💧",
    color: "#e0f2fe",
    results: {
      iodine: { positive: false, color: "#d97706", name: "Kekal Perang / Kuning", precipitate: false },
      benedict: { positive: false, color: "#38bdf8", name: "Kekal Biru", precipitate: false },
      millon: { positive: false, color: "#fef08a", name: "Tiada Mendakan Merah", precipitate: false },
      emulsion: { positive: false, color: "#e2e8f0", name: "Larutan Jernih (Tiada Emulsi)", precipitate: false }
    }
  }
];

export const LAB_TESTS_DATA = [
  {
    id: "iodine",
    name: "Ujian Iodin",
    target: "Kanji (Karbohidrat Kompleks)",
    reagent: "Larutan Iodin (I₂)",
    reagentColor: "#d97706", // Perang kemerahan
    reagentLabel: "Kuning / Perang",
    requiresHeat: false,
    procedure: [
      "Masukkan 2 ml ampaian makanan ke dalam tabung uji bersih.",
      "Titiskan 2 hingga 3 titis larutan iodin menggunakan pipet.",
      "Goncang tabung uji perlahan-lahan dan perhatikan perubahan warna serta-merta."
    ],
    positiveResult: "Warna larutan berubah dari kuning/perang kepada BIRU TUA.",
    negativeResult: "Warna larutan kekal kuning/perang (tiada perubahan).",
    inference: "Kehadiran kanji dikesan kerana iodin membentuk kompleks iodin-heliks kanji berwarna biru gelap.",
    precaution: "Pastikan tabung uji tidak dicemari bahan lain yang boleh menyahwarnakan iodin."
  },
  {
    id: "benedict",
    name: "Ujian Benedict",
    target: "Gula Penurun (Glukosa, Maltosa, Fruktosa, Galaktosa)",
    reagent: "Larutan Benedict",
    reagentColor: "#0284c7", // Biru terang
    reagentLabel: "Biru Jernih",
    requiresHeat: true,
    procedure: [
      "Masukkan 2 ml sampel makanan ke dalam tabung uji.",
      "Tambahkan 2 ml larutan Benedict ke dalam tabung uji dan goncangkan campuran.",
      "Panaskan tabung uji di dalam kukus air mendidih (water bath) selama 3 hingga 5 minit.",
      "Perhatikan jujukan warna: Biru → Hijau → Kuning → Mendakan Merah Bata."
    ],
    positiveResult: "Mendakan MERAH BATA terbentuk (kuantiti gula banyak) atau kuning/hijau (sedikit).",
    negativeResult: "Warna larutan kekal BIRU (tiada kehadiran gula penurun).",
    inference: "Gula penurun menurunkan ion kuprum(II) biru Cu²⁺ kepada mendakan kuprum(I) oksida Cu₂O berwarna merah bata.",
    precaution: "Mesti gunakan kukus air (water bath), jangan panaskan terus di atas api Bunsen untuk mengelakkan cecair meletop keluar."
  },
  {
    id: "millon",
    name: "Ujian Millon",
    target: "Protein (Polipeptida & Asid Amino)",
    reagent: "Reagen Millon (Mengandungi merkuri)",
    reagentColor: "#fef08a", // Kekuningan pucat
    reagentLabel: "Kuning Pucat / Tanpa Warna",
    requiresHeat: true,
    procedure: [
      "Masukkan 2 ml sampel larutan makanan ke dalam tabung uji.",
      "Titiskan 2 hingga 3 titis reagen Millon. Mendakan putih akan terbentuk serta-merta.",
      "Panaskan tabung uji perlahan-lahan di dalam kukus air mendidih selama 2 minit.",
      "Perhatikan perubahan mendakan putih bertukar menjadi merah bata."
    ],
    positiveResult: "Mendakan putih bertukar menjadi MENDAKAN MERAH BATA.",
    negativeResult: "Tiada mendakan merah bata terbentuk (warna larutan kekal tanpa perubahan warna merah).",
    inference: "Kehadiran kumpulan fenolik dalam asid amino protein (seperti tirosina) membentuk kompleks berwarna merah bata dengan ion merkuri.",
    precaution: "Reagen Millon mengandungi sebatian merkuri dan asid nitrik pekat yang menghakis. Kendalikan dengan cermat."
  },
  {
    id: "emulsion",
    name: "Ujian Alkohol-Emulsi (Etanol)",
    target: "Lemak / Lipid",
    reagent: "Etanol Tulen 95% + Air Suling",
    reagentColor: "#f1f5f9", // Jernih
    reagentLabel: "Jernih / Tanpa Warna",
    requiresHeat: false,
    procedure: [
      "Masukkan 2 ml sampel makanan (atau minyak) ke dalam tabung uji kering.",
      "Tambahkan 4 ml etanol tulen dan goncang kuat-kuat supaya lemak melarut sepenuhnya.",
      "Tuangkan campuran etanol-makanan tersebut ke dalam tabung uji lain yang berisi 4 ml air suling.",
      "Perhatikan pembentukan emulsi berawan putih di dalam air."
    ],
    positiveResult: "Pembentukan EMULSI PUTIH BERAWAN (cloudy white emulsion).",
    negativeResult: "Campuran kekal jernih tanpa pembentukan emulsi putih.",
    inference: "Lemak larut dalam etanol tetapi tidak larut dalam air. Apabila air suling ditambah, titisan halus lemak terampai dan membiaskan cahaya menghasilkan rupa berawan.",
    precaution: "Etanol sangat mudah terbakar. Jauhkan daripada sebarang punca api atau pembakar Bunsen yang bernyala."
  }
];
