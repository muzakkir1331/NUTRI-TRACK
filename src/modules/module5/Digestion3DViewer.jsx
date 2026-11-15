import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Info, 
  Sparkles, 
  Compass, 
  Maximize2, 
  Minimize2,
  ChevronRight,
  Droplet,
  Flame,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

// Data Organ Anatomi Pencernaan KSSM Sains Tingkatan 2 (SP 3.3.1)
const ORGAN_DATA = {
  mulut: {
    id: 'mulut',
    name: 'Mulut & Kelenjar Air Liur',
    kssmCode: 'SP 3.3.1 - Peringkat 1',
    category: 'Salur Utama & Kelenjar Aksesori',
    color: '#fb7185',
    cameraTarget: { x: 0, y: 7.2, z: 0 },
    cameraPos: { x: 0, y: 7.4, z: 4.8 },
    ph: 'pH 6.5 – 7.5 (Neutral)',
    type: 'Pencernaan Fizikal (Gigi) & Pencernaan Kimia (Air Liur)',
    secretions: 'Air liur mengandungi enzim Amilase Air Liur dan mukus pelincir.',
    action: 'Gigi mengoyak dan mengisar makanan menjadi cebisan kecil (pencernaan fizikal). Amilase air liur memulakan pemecahan kanji kepada maltosa. Lidah mengadun makanan bersama air liur membentuk bebola licin bergelar bolus.',
    equation: 'Kanji + Air ──(Amilase Air Liur)──> Maltosa',
    funFact: 'Manusia merembeskan antara 1 hingga 1.5 liter air liur setiap hari untuk melicinkan bolus dan memulakan pencernaan kanji.'
  },
  esofagus: {
    id: 'esofagus',
    name: 'Esofagus (Tiub Berotot)',
    kssmCode: 'SP 3.3.1 - Peringkat 2',
    category: 'Salur Pengangkutan Makanan',
    color: '#f43f5e',
    cameraTarget: { x: 0, y: 5.2, z: 0 },
    cameraPos: { x: 0, y: 5.5, z: 5.2 },
    ph: 'Neutral',
    type: 'Pengangkutan Mekanikal (Peristalsis)',
    secretions: 'Mukus pelincir dinding tiub',
    action: 'Tiub berotot sepanjang ~25cm yang menolak bolus makanan turun ke perut melalui proses Peristalsis (pengecutan dan pengenduran beritma otot lingkaran dan membujur). Tiada pencernaan kimia berlaku di sini.',
    equation: 'Pengecutan Beritma Otot Lingkaran & Membujur (Peristalsis)',
    funFact: 'Kerana peristalsis adalah tindakan mekanikal otot, angkasawan di stesen angkasa lepas masih boleh menelan makanan walaupun dalam keadaan tanpa graviti!'
  },
  perut: {
    id: 'perut',
    name: 'Perut (Gaster)',
    kssmCode: 'SP 3.3.1 - Peringkat 3',
    category: 'Organ Pencernaan Utama',
    color: '#e11d48',
    cameraTarget: { x: 0.6, y: 2.7, z: 0.2 },
    cameraPos: { x: 0.8, y: 2.8, z: 4.2 },
    ph: 'pH 1.5 – 2.0 (Sangat Berasid)',
    type: 'Pencernaan Fizikal (Pengadunan) & Kimia (Pepsin)',
    secretions: 'Jus Gastrik: Asid Hidroklorik (HCl), Enzim Pepsin (Protease) & Mukus tebal',
    action: 'Dinding perut berotot tebal mengocok dan mengisar makanan menjadi cecair separa pekat bergelar kim. Asid hidroklorik menyediakan medium berasid untuk tindakan optimum pepsin serta mematikan bakteria.',
    equation: 'Protein ──(Enzim Pepsin + Asid HCl)──> Polipeptida',
    funFact: 'Lapisan mukus pelindung pada dinding perut diganti secara berterusan bagi mengelakkan perut mencerna dinding organ itu sendiri oleh asid gastrik yang kuat!'
  },
  hati: {
    id: 'hati',
    name: 'Hati (Liver)',
    kssmCode: 'SP 3.3.1 - Organ Aksesori',
    category: 'Kelenjar Aksesori Pencernaan',
    color: '#b45309',
    cameraTarget: { x: -0.9, y: 2.9, z: 0.3 },
    cameraPos: { x: -1.2, y: 3.1, z: 4.5 },
    ph: 'Sedikit Beralkali',
    type: 'Penghasilan Jus Hempedu & Metabolisme',
    secretions: 'Jus Hempedu (Disimpan di dalam Pundi Hempedu)',
    action: 'Organ dalaman terbesar manusia yang menghasilkan jus hempedu. Jus hempedu mengemulsikan molekul lemak yang besar menjadi titisan halus (tindakan fizikal) bagi menambah luas permukaan untuk tindakan lipase.',
    equation: 'Molekul Lemak Besar ──(Jus Hempedu)──> Titisan Lemak Halus (Emulsi)',
    funFact: 'Hati mempunyai keupayaan unik untuk menjana semula sel-selnya (regenerasi) walaupun sebahagian besar tisunya telah rosak atau dikeluarkan.'
  },
  pundi_hempedu: {
    id: 'pundi_hempedu',
    name: 'Pundi Hempedu (Gallbladder)',
    kssmCode: 'SP 3.3.1 - Organ Aksesori',
    category: 'Penyimpanan & Rembesan Hempedu',
    color: '#10b981',
    cameraTarget: { x: -0.6, y: 2.1, z: 0.6 },
    cameraPos: { x: -0.8, y: 2.2, z: 3.8 },
    ph: 'pH 7.6 – 8.6 (Beralkali)',
    type: 'Penyimpanan & Pengpekatan Hempedu',
    secretions: 'Jus Hempedu Pekat ke dalam Duodenum melalui Duktus Hempedu',
    action: 'Menyimpan dan memekatkan cecair hempedu yang dihasilkan oleh hati. Apabila kim berasid memasuki duodenum, pundi hempedu mengecut untuk menyalurkan hempedu bagi meneutralkan asid kim dan mengemulsi lemak.',
    equation: 'Peneutralan Asid Gastrik + Pengemulsian Lemak',
    funFact: 'Garam hempedu berwarna kehijauan-kuning kerana pigmen bilirubin yang terhasil daripada pemecahan sel darah merah yang telah tamat tempoh kitarannya.'
  },
  pankreas: {
    id: 'pankreas',
    name: 'Pankreas (Pancreas)',
    kssmCode: 'SP 3.3.1 - Kelenjar Aksesori Utama',
    category: 'Kelenjar Aksesori Pencernaan',
    color: '#f59e0b',
    cameraTarget: { x: 0.2, y: 1.9, z: -0.1 },
    cameraPos: { x: 0.3, y: 2.0, z: 3.8 },
    ph: 'pH 8.0 (Beralkali)',
    type: 'Rembesan Enzim Pencernaan Tiga Serangkai',
    secretions: 'Jus Pankreas: Amilase Pankreas, Tripsin (Protease) & Lipase',
    action: 'Merembeskan jus pankreas yang kaya dengan tiga enzim utama ke dalam duodenum untuk melengkapkan penguraian kanji, protein, dan lemak dalam suasana beralkali.',
    equation: 'Kanji ──(Amilase)──> Maltosa | Polipeptida ──(Tripsin)──> Peptida | Lemak ──(Lipase)──> Asid Lemak + Gliserol',
    funFact: 'Selain menghasilkan enzim pencernaan, pulau Langerhans di dalam pankreas turut merembeskan hormon insulin untuk mengawal atur paras glukosa darah.'
  },
  duodenum: {
    id: 'duodenum',
    name: 'Duodenum (Gelung Permulaan Usus)',
    kssmCode: 'SP 3.3.1 - Peringkat 4',
    category: 'Pencernaan Kimia Pelbagai Enzim',
    color: '#fb923c',
    cameraTarget: { x: 0.1, y: 1.6, z: 0.2 },
    cameraPos: { x: 0.2, y: 1.8, z: 3.6 },
    ph: 'pH 7.5 – 8.0 (Alkali Sederhana)',
    type: 'Pencernaan Kimia Campuran & Emulsi',
    secretions: 'Menerima Jus Hempedu (dari Hati/Pundi) & Jus Pankreas (dari Pankreas)',
    action: 'Bahagian pertama usus kecil berbentuk huruf C. Di sini, kim berasid dineutralkan oleh natrium bikarbonat. Tiga enzim pankreas bersama hempedu mencerna kanji, peptida, dan titisan lemak serentak.',
    equation: 'Tiga Tindakan Serentak: Kanji -> Maltosa, Polipeptida -> Peptida, Lemak -> Asid Lemak + Gliserol',
    funFact: 'Walaupun panjangnya hanya kira-kira 25 cm, duodenum merupakan pusat pemprosesan kimia paling aktif dalam seluruh sistem pencernaan manusia.'
  },
  usus_kecil: {
    id: 'usus_kecil',
    name: 'Usus Kecil (Jejunum & Ileum)',
    kssmCode: 'SP 3.3.1 & SP 3.4.1 - Peringkat 5',
    category: 'Pencernaan Lengkap & Penyerapan Nutrien',
    color: '#ec4899',
    cameraTarget: { x: 0, y: -0.2, z: 0.1 },
    cameraPos: { x: 0, y: 0.1, z: 4.8 },
    ph: 'pH 7.5 – 8.0 (Beralkali)',
    type: 'Pencernaan Terakhir & Penyerapan (Vilus)',
    secretions: 'Jus Usus: Enzim Maltase & Enzim Peptidase (Erepsin)',
    action: 'Menyelesaikan pencernaan molekul makanan kepada unit paling ringkas: maltosa dicerna kepada glukosa; peptida kepada asid amino. Dinding ileum dilitupi jutaan unjuran halus (vilus) untuk menyerap nutrien ringkas ke dalam kapilari darah dan lakteal.',
    equation: 'Maltosa ──(Maltase)──> Glukosa | Peptida ──(Peptidase)──> Asid Amino',
    funFact: 'Panjang usus kecil manusia ialah kira-kira 6 meter! Jika semua vilus dan mikrovilus dibentangkan rata, jumlah luas permukaannya adalah sebesar sebuah gelanggang tenis.'
  },
  kolon: {
    id: 'kolon',
    name: 'Usus Besar (Kolon Menaik, Melintang, Menurun & Sigmoid)',
    kssmCode: 'SP 3.3.1 - Peringkat 6',
    category: 'Penyerapan Semula Air & Mineral',
    color: '#a855f7',
    cameraTarget: { x: 0, y: -0.4, z: 0.2 },
    cameraPos: { x: 0, y: -0.2, z: 5.6 },
    ph: 'pH 6.5 – 7.0 (Hampir Neutral)',
    type: 'Penyerapan Semula Air & Penapaian Bakteria Baik',
    secretions: 'Mukus pelincir dinding usus untuk melancarkan pergerakan tinja',
    action: 'Bahan yang tidak tercerna (terutamanya pelawas selulosa) memasuki kolon. Air dan garam mineral diserap semula ke dalam aliran darah, menukarkan saki-baki cecair menjadi tinja pepejal. Bakteria simbiotik menghasilkan Vitamin K dan B7 (Biotin).',
    equation: 'Penyerapan Semula 90% Air & Pembentukan Tinja Pepejal',
    funFact: 'Bakteria baik (mikrobiom) dalam usus besar manusia berjumlah lebih daripada 100 trilion, memainkan peranan penting dalam imuniti tubuh!'
  },
  rektum: {
    id: 'rektum',
    name: 'Rektum & Bukaan Dubur',
    kssmCode: 'SP 3.3.1 - Peringkat Akhir (Penyahtinjaan)',
    category: 'Penyingkiran Sisa Tinja',
    color: '#6366f1',
    cameraTarget: { x: 0, y: -2.8, z: 0.1 },
    cameraPos: { x: 0, y: -2.6, z: 4.2 },
    ph: 'Neutral',
    type: 'Penstoran Sementara & Penyahtinjaan (Defekasi)',
    secretions: 'Tiada enzim pencernaan',
    action: 'Tinja disimpan buat sementara waktu di dalam rektum. Apabila rektum penuh, reseptor regangan mencetuskan refleks penyahtinjaan. Otot rektum mengecut dan sfinkter dubur mengendur untuk menyingkirkan tinja ke luar badan.',
    equation: 'Penyahtinjaan (Defekasi) Mengeluarkan Sisa Tidak Tercerna',
    funFact: 'Pengambilan makanan kaya serat/pelawas seperti sayur-sayuran dan buah-buahan membantu menyerap air, melembutkan tinja, dan menghalang sembelit.'
  }
};

export default function Digestion3DViewer() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const organMeshesRef = useRef({});
  const bolusMeshRef = useRef(null);
  const bolusCurveRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  // States
  const [selectedOrganId, setSelectedOrganId] = useState('perut');
  const [hoveredOrganId, setHoveredOrganId] = useState(null);
  const [isPlayingBolus, setIsPlayingBolus] = useState(true);
  const [bolusProgress, setBolusProgress] = useState(0.25);
  const [bolusSpeed, setBolusSpeed] = useState(1);
  const [showTorso, setShowTorso] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  const selectedOrgan = useMemo(() => ORGAN_DATA[selectedOrganId] || ORGAN_DATA.perut, [selectedOrganId]);

  // Handle organ selection
  const selectOrgan = (organId, playSfx = true) => {
    if (!ORGAN_DATA[organId]) return;
    if (playSfx) soundFx.playClick();
    setSelectedOrganId(organId);

    // Camera animation target
    const targetData = ORGAN_DATA[organId];
    if (controlsRef.current && cameraRef.current && targetData) {
      animateCameraTo(
        targetData.cameraPos.x,
        targetData.cameraPos.y,
        targetData.cameraPos.z,
        targetData.cameraTarget.x,
        targetData.cameraTarget.y,
        targetData.cameraTarget.z
      );
    }
  };

  // Smooth camera transition
  const cameraAnimRef = useRef(null);
  const animateCameraTo = (px, py, pz, tx, ty, tz) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const startTime = performance.now();
    const duration = 900; // ms

    const startPos = cameraRef.current.position.clone();
    const startTarget = controlsRef.current.target.clone();
    const endPos = new THREE.Vector3(px, py, pz);
    const endTarget = new THREE.Vector3(tx, ty, tz);

    const updateCamera = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease-in-out cubic
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      cameraRef.current.position.lerpVectors(startPos, endPos, ease);
      controlsRef.current.target.lerpVectors(startTarget, endTarget, ease);
      controlsRef.current.update();

      if (progress < 1) {
        cameraAnimRef.current = requestAnimationFrame(updateCamera);
      }
    };

    if (cameraAnimRef.current) cancelAnimationFrame(cameraAnimRef.current);
    cameraAnimRef.current = requestAnimationFrame(updateCamera);
  };

  // Reset View to Overview
  const handleResetOverview = () => {
    soundFx.playClick();
    animateCameraTo(0, 1.8, 8.5, 0, 1.5, 0);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 580;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913); // Deep futuristic slate blue-black

    // Fog for depth cueing
    scene.fog = new THREE.FogExp2(0x060913, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 8.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.2;
    controls.maxDistance = 16.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.35; // Allow looking slightly upward
    controls.target.set(0, 1.8, 0);
    controlsRef.current = controls;

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    mainKeyLight.position.set(5, 8, 7);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    cyanRimLight.position.set(-6, 4, -4);
    scene.add(cyanRimLight);

    const purpleBackFill = new THREE.DirectionalLight(0xa855f7, 0.6);
    purpleBackFill.position.set(0, -6, -3);
    scene.add(purpleBackFill);

    // Medical grid floor pedestal
    const gridHelper = new THREE.GridHelper(14, 28, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = -3.8;
    gridHelper.material.opacity = 0.35;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // 6. Build Procedural Anatomical Meshes
    const meshes = {};

    // Group for entire human body
    const digestiveGroup = new THREE.Group();
    scene.add(digestiveGroup);

    // Materials definition
    const matGlossy = (color, emissive = 0x000000, roughness = 0.35, metalness = 0.1) => 
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(emissive),
        roughness,
        metalness
      });

    // --- (A) TORSO SILHOUETTE (Human Body Glass Outline) ---
    const torsoGroup = new THREE.Group();
    torsoGroup.name = 'torso_silhouette';

    // Torso silhouette points for Lathe / smooth body contour
    const bodyCurvePoints = [
      new THREE.Vector2(0.01, 8.8), // Top head
      new THREE.Vector2(0.85, 8.4), // Cranium
      new THREE.Vector2(0.95, 7.8), // Brow/temple
      new THREE.Vector2(0.85, 7.2), // Jawline
      new THREE.Vector2(0.55, 6.7), // Neck
      new THREE.Vector2(0.60, 6.2), // Base neck
      new THREE.Vector2(1.85, 5.8), // Shoulders
      new THREE.Vector2(1.95, 5.0), // Deltoids
      new THREE.Vector2(1.75, 4.0), // Chest / ribcage
      new THREE.Vector2(1.50, 2.5), // Waist taper
      new THREE.Vector2(1.70, 1.0), // Hip flare
      new THREE.Vector2(1.80, -0.5), // Pelvis / upper hip
      new THREE.Vector2(1.65, -2.2), // Lower pelvic arch
      new THREE.Vector2(1.40, -3.6), // Upper thighs
      new THREE.Vector2(0.2, -3.7)   // Base
    ];
    const bodyGeometry = new THREE.LatheGeometry(bodyCurvePoints, 36);
    // Flatten along Z to match human torso oval cross-section
    bodyGeometry.scale(1.0, 1.0, 0.55);

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.25,
      wireframe: false,
      depthWrite: false
    });
    const torsoMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    torsoGroup.add(torsoMesh);

    // Torso wireframe edge accents
    const bodyWireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const torsoWire = new THREE.Mesh(bodyGeometry, bodyWireMat);
    torsoGroup.add(torsoWire);
    digestiveGroup.add(torsoGroup);

    // --- (B) 1. MULUT & KELENJAR AIR LIUR ---
    const mouthGroup = new THREE.Group();
    mouthGroup.userData = { organId: 'mulut' };

    // Oral cavity
    const mouthCavityGeom = new THREE.SphereGeometry(0.42, 24, 24);
    mouthCavityGeom.scale(1.2, 0.7, 1.0);
    const mouthMesh = new THREE.Mesh(mouthCavityGeom, matGlossy(0xfb7185, 0x331015, 0.3));
    mouthMesh.position.set(0, 7.3, 0.15);
    mouthMesh.userData = { organId: 'mulut' };
    mouthGroup.add(mouthMesh);

    // Teeth arches (Upper & Lower)
    const teethMat = matGlossy(0xffffff, 0x111111, 0.2);
    const upperTeethGeom = new THREE.TorusGeometry(0.24, 0.05, 12, 24, Math.PI);
    upperTeethGeom.rotateX(Math.PI / 2);
    const upperTeeth = new THREE.Mesh(upperTeethGeom, teethMat);
    upperTeeth.position.set(0, 7.35, 0.35);
    mouthGroup.add(upperTeeth);

    // Salivary glands (Parotid, Submandibular, Sublingual pairs)
    const glandMat = matGlossy(0xfbbf24, 0x221500, 0.4);
    const parotidL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), glandMat);
    parotidL.position.set(-0.6, 7.15, 0.1);
    parotidL.scale.set(1.2, 0.8, 0.8);
    parotidL.userData = { organId: 'mulut' };
    mouthGroup.add(parotidL);

    const parotidR = parotidL.clone();
    parotidR.position.x = 0.6;
    mouthGroup.add(parotidR);

    const submandL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), glandMat);
    submandL.position.set(-0.35, 6.85, 0.2);
    submandL.userData = { organId: 'mulut' };
    mouthGroup.add(submandL);

    const submandR = submandL.clone();
    submandR.position.x = 0.35;
    mouthGroup.add(submandR);

    digestiveGroup.add(mouthGroup);
    meshes.mulut = mouthMesh;

    // --- (C) 2. ESOFAGUS (Tiub Berotot dengan Gelang Peristalsis) ---
    const esophagusGroup = new THREE.Group();
    esophagusGroup.userData = { organId: 'esofagus' };

    const esophagusCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 7.1, 0.0),
      new THREE.Vector3(0, 6.4, -0.05),
      new THREE.Vector3(0.02, 5.6, -0.08),
      new THREE.Vector3(0.04, 4.8, -0.05),
      new THREE.Vector3(0.08, 4.0, 0.0),
      new THREE.Vector3(0.15, 3.4, 0.1) // Connects to stomach cardiac sphincter
    ]);

    const esophagusGeom = new THREE.TubeGeometry(esophagusCurve, 40, 0.15, 20, false);
    const esophagusMesh = new THREE.Mesh(esophagusGeom, matGlossy(0xf43f5e, 0x220505, 0.35));
    esophagusMesh.userData = { organId: 'esofagus' };
    esophagusGroup.add(esophagusMesh);

    // Decorative muscular rings along esophagus simulating circular muscles
    const ringMat = matGlossy(0xff859a, 0x000000, 0.4);
    for (let i = 0; i < 9; i++) {
      const t = 0.1 + i * 0.09;
      const pt = esophagusCurve.getPoint(t);
      const ringGeom = new THREE.TorusGeometry(0.165, 0.022, 10, 20);
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(pt);
      ring.rotation.x = Math.PI / 2;
      esophagusGroup.add(ring);
    }

    digestiveGroup.add(esophagusGroup);
    meshes.esofagus = esophagusMesh;

    // --- (D) 3. PERUT (Gaster - Curved J-Shape Anatomic Organ) ---
    const stomachGroup = new THREE.Group();
    stomachGroup.userData = { organId: 'perut' };

    // Stomach curved centerline: Fundus -> Body -> Antrum -> Pylorus
    const stomachCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.15, 3.4, 0.1),  // Cardiac orifice
      new THREE.Vector3(0.55, 3.5, 0.2),  // Fundus (dome to left)
      new THREE.Vector3(0.85, 3.0, 0.3),  // Greater curvature upper
      new THREE.Vector3(0.92, 2.4, 0.3),  // Greater curvature lower
      new THREE.Vector3(0.55, 2.05, 0.25),// Antrum
      new THREE.Vector3(0.15, 2.15, 0.2)  // Pyloric canal leading to duodenum
    ]);

    // Use custom variable radius tube for authentic stomach volume
    const stomachSegments = 48;
    const stomachPoints = stomachCurve.getPoints(stomachSegments);
    const stomachGeom = new THREE.BufferGeometry();
    const posArr = [];
    const normArr = [];
    const indexArr = [];

    // Construct variable thickness cylinder around stomach curve
    const radialSegs = 24;
    for (let i = 0; i <= stomachSegments; i++) {
      const u = i / stomachSegments;
      const center = stomachPoints[i];
      // Radius profile: expands in Fundus/Body (up to 0.48), tapers at Pylorus (0.18)
      let radius = 0.18;
      if (u < 0.2) radius = 0.18 + u * 1.5;
      else if (u < 0.6) radius = 0.48 - (u - 0.2) * 0.15;
      else radius = 0.42 - (u - 0.6) * 0.55;

      const tangent = stomachCurve.getTangent(u);
      const normal = new THREE.Vector3(0, 0, 1).cross(tangent).normalize();
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

      for (let j = 0; j <= radialSegs; j++) {
        const theta = (j / radialSegs) * Math.PI * 2;
        const sin = Math.sin(theta);
        const cos = Math.cos(theta);

        const vx = center.x + radius * (cos * normal.x + sin * binormal.x);
        const vy = center.y + radius * (cos * normal.y + sin * binormal.y);
        const vz = center.z + radius * (cos * normal.z + sin * binormal.z);

        posArr.push(vx, vy, vz);
        normArr.push(cos * normal.x + sin * binormal.x, cos * normal.y + sin * binormal.y, cos * normal.z + sin * binormal.z);
      }
    }

    for (let i = 0; i < stomachSegments; i++) {
      for (let j = 0; j < radialSegs; j++) {
        const a = i * (radialSegs + 1) + j;
        const b = (i + 1) * (radialSegs + 1) + j;
        const c = (i + 1) * (radialSegs + 1) + (j + 1);
        const d = i * (radialSegs + 1) + (j + 1);
        indexArr.push(a, b, d);
        indexArr.push(b, c, d);
      }
    }

    stomachGeom.setAttribute('position', new THREE.Float32BufferAttribute(posArr, 3));
    stomachGeom.setAttribute('normal', new THREE.Float32BufferAttribute(normArr, 3));
    stomachGeom.setIndex(indexArr);
    stomachGeom.computeVertexNormals();

    const stomachMesh = new THREE.Mesh(stomachGeom, matGlossy(0xe11d48, 0x330005, 0.28, 0.05));
    stomachMesh.userData = { organId: 'perut' };
    stomachGroup.add(stomachMesh);

    digestiveGroup.add(stomachGroup);
    meshes.perut = stomachMesh;

    // --- (E) 4. HATI (Liver) & PUNDI HEMPEDU (Gallbladder) ---
    const liverGroup = new THREE.Group();
    liverGroup.userData = { organId: 'hati' };

    // Anatomical convex right lobe + smaller left lobe wedge
    const liverGeom = new THREE.SphereGeometry(0.85, 32, 24);
    // Deform to asymmetrical hepatic triangular wedge
    const liverPos = liverGeom.attributes.position;
    for (let i = 0; i < liverPos.count; i++) {
      let x = liverPos.getX(i);
      let y = liverPos.getY(i);
      let z = liverPos.getZ(i);

      // Flatten inferior visceral surface & taper toward left
      if (y < 0) y *= 0.6;
      if (x > 0) {
        x *= 0.65; // Smaller left lobe
        y *= 0.8;
      }
      liverPos.setXYZ(i, x, y, z);
    }
    liverGeom.computeVertexNormals();
    liverGeom.scale(1.35, 0.85, 0.95);

    const liverMesh = new THREE.Mesh(liverGeom, matGlossy(0xb45309, 0x220500, 0.35));
    liverMesh.position.set(-0.85, 2.9, 0.25);
    liverMesh.rotation.set(-0.15, 0.1, -0.2);
    liverMesh.userData = { organId: 'hati' };
    liverGroup.add(liverMesh);

    digestiveGroup.add(liverGroup);
    meshes.hati = liverMesh;

    // Pundi Hempedu (Gallbladder)
    const gallbladderGroup = new THREE.Group();
    gallbladderGroup.userData = { organId: 'pundi_hempedu' };

    const gbGeom = new THREE.SphereGeometry(0.22, 20, 20);
    gbGeom.scale(0.8, 1.4, 0.8);
    const gbMesh = new THREE.Mesh(gbGeom, matGlossy(0x10b981, 0x012b18, 0.3));
    gbMesh.position.set(-0.55, 2.15, 0.55);
    gbMesh.rotation.set(0.3, 0.1, 0.25);
    gbMesh.userData = { organId: 'pundi_hempedu' };
    gallbladderGroup.add(gbMesh);

    // Bile duct (Salur hempedu hijau bersambung ke duodenum)
    const bileDuctCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.55, 2.15, 0.55),
      new THREE.Vector3(-0.35, 1.95, 0.4),
      new THREE.Vector3(-0.05, 1.75, 0.25)
    ]);
    const bileDuctGeom = new THREE.TubeGeometry(bileDuctCurve, 16, 0.045, 12, false);
    const bileDuctMesh = new THREE.Mesh(bileDuctGeom, matGlossy(0x059669, 0x000000, 0.3));
    gallbladderGroup.add(bileDuctMesh);

    digestiveGroup.add(gallbladderGroup);
    meshes.pundi_hempedu = gbMesh;

    // --- (F) 5. PANKREAS (Pancreas) ---
    const pancreasGroup = new THREE.Group();
    pancreasGroup.userData = { organId: 'pankreas' };

    const pancreasCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.05, 1.75, 0.05), // Head in duodenum loop
      new THREE.Vector3(0.4, 1.9, -0.05),   // Body
      new THREE.Vector3(0.9, 2.15, -0.1),   // Tail toward spleen
      new THREE.Vector3(1.2, 2.3, -0.05)
    ]);
    const pancreasGeom = new THREE.TubeGeometry(pancreasCurve, 24, 0.14, 14, false);
    const pancreasMesh = new THREE.Mesh(pancreasGeom, matGlossy(0xf59e0b, 0x241500, 0.45));
    pancreasMesh.userData = { organId: 'pankreas' };
    pancreasGroup.add(pancreasMesh);

    digestiveGroup.add(pancreasGroup);
    meshes.pankreas = pancreasMesh;

    // --- (G) 6. DUODENUM (Gelung C Permulaan Usus) ---
    const duodenumGroup = new THREE.Group();
    duodenumGroup.userData = { organId: 'duodenum' };

    const duodenumCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.15, 2.15, 0.2),  // From pylorus
      new THREE.Vector3(-0.15, 2.1, 0.22), // Superior part
      new THREE.Vector3(-0.35, 1.75, 0.2), // Descending part (receives bile & pancreatic duct)
      new THREE.Vector3(-0.25, 1.4, 0.2),  // Horizontal inferior part
      new THREE.Vector3(0.1, 1.35, 0.18)   // Ascending part connecting to jejunum
    ]);
    const duodenumGeom = new THREE.TubeGeometry(duodenumCurve, 32, 0.15, 16, false);
    const duodenumMesh = new THREE.Mesh(duodenumGeom, matGlossy(0xfb923c, 0x331000, 0.35));
    duodenumMesh.userData = { organId: 'duodenum' };
    duodenumGroup.add(duodenumMesh);

    digestiveGroup.add(duodenumGroup);
    meshes.duodenum = duodenumMesh;

    // --- (H) 7. USUS KECIL (Jejunum & Ileum Serpentine Coils) ---
    const smallIntestineGroup = new THREE.Group();
    smallIntestineGroup.userData = { organId: 'usus_kecil' };

    // Dense anatomical serpentine looping path in central abdomen
    const siPoints = [
      new THREE.Vector3(0.1, 1.35, 0.18),
      new THREE.Vector3(0.45, 1.15, 0.25),
      new THREE.Vector3(0.15, 0.95, 0.3),
      new THREE.Vector3(-0.35, 1.05, 0.28),
      new THREE.Vector3(-0.55, 0.75, 0.32),
      new THREE.Vector3(-0.1, 0.65, 0.35),
      new THREE.Vector3(0.5, 0.6, 0.3),
      new THREE.Vector3(0.65, 0.25, 0.32),
      new THREE.Vector3(0.2, 0.2, 0.36),
      new THREE.Vector3(-0.35, 0.3, 0.34),
      new THREE.Vector3(-0.6, 0.0, 0.32),
      new THREE.Vector3(-0.15, -0.15, 0.36),
      new THREE.Vector3(0.4, -0.1, 0.34),
      new THREE.Vector3(0.6, -0.4, 0.3),
      new THREE.Vector3(0.1, -0.5, 0.35),
      new THREE.Vector3(-0.4, -0.45, 0.32),
      new THREE.Vector3(-0.55, -0.8, 0.28),
      new THREE.Vector3(-0.1, -0.85, 0.32),
      new THREE.Vector3(0.45, -0.8, 0.28),
      new THREE.Vector3(0.35, -1.15, 0.25),
      new THREE.Vector3(-0.2, -1.2, 0.26),
      new THREE.Vector3(-0.7, -1.25, 0.22) // Ileocecal junction connecting to cecum
    ];
    const smallIntestineCurve = new THREE.CatmullRomCurve3(siPoints);
    const smallIntestineGeom = new THREE.TubeGeometry(smallIntestineCurve, 140, 0.115, 14, false);
    const smallIntestineMesh = new THREE.Mesh(smallIntestineGeom, matGlossy(0xec4899, 0x2b0518, 0.35));
    smallIntestineMesh.userData = { organId: 'usus_kecil' };
    smallIntestineGroup.add(smallIntestineMesh);

    digestiveGroup.add(smallIntestineGroup);
    meshes.usus_kecil = smallIntestineMesh;

    // --- (I) 8. USUS BESAR (Kolon: Sekum, Menaik, Melintang, Menurun, Sigmoid) ---
    const colonGroup = new THREE.Group();
    colonGroup.userData = { organId: 'kolon' };

    const colonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.85, -1.45, 0.2), // Sekum & Apendiks
      new THREE.Vector3(-0.9, -0.8, 0.18),  // Ascending colon lower
      new THREE.Vector3(-0.92, 0.3, 0.18),  // Ascending colon mid
      new THREE.Vector3(-0.85, 1.25, 0.18), // Hepatic flexure (corner under liver)
      new THREE.Vector3(-0.35, 1.35, 0.3),  // Transverse colon
      new THREE.Vector3(0.25, 1.3, 0.3),    // Transverse colon mid
      new THREE.Vector3(0.85, 1.25, 0.2),   // Splenic flexure (corner under stomach)
      new THREE.Vector3(0.92, 0.2, 0.18),   // Descending colon upper
      new THREE.Vector3(0.9, -0.8, 0.18),   // Descending colon lower
      new THREE.Vector3(0.75, -1.45, 0.18), // Left iliac crest
      new THREE.Vector3(0.35, -1.75, 0.16), // Sigmoid colon curve
      new THREE.Vector3(0.0, -1.95, 0.12)   // Connects to rectum
    ]);

    // Segmented haustra bumps along colon for realistic anatomy
    const colonSegments = 80;
    const colonPoints = colonCurve.getPoints(colonSegments);
    const colGeom = new THREE.BufferGeometry();
    const cPos = [];
    const cNorm = [];
    const cIndex = [];

    const colRadial = 20;
    for (let i = 0; i <= colonSegments; i++) {
      const u = i / colonSegments;
      const center = colonPoints[i];
      // Haustra sacculations: pulsating radius along length
      const haustraFactor = Math.sin(u * Math.PI * 32) * 0.055;
      const radius = 0.21 + haustraFactor;

      const tangent = colonCurve.getTangent(u);
      const normal = new THREE.Vector3(0, 0, 1).cross(tangent).normalize();
      const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

      for (let j = 0; j <= colRadial; j++) {
        const theta = (j / colRadial) * Math.PI * 2;
        const sin = Math.sin(theta);
        const cos = Math.cos(theta);

        const vx = center.x + radius * (cos * normal.x + sin * binormal.x);
        const vy = center.y + radius * (cos * normal.y + sin * binormal.y);
        const vz = center.z + radius * (cos * normal.z + sin * binormal.z);

        cPos.push(vx, vy, vz);
        cNorm.push(cos * normal.x + sin * binormal.x, cos * normal.y + sin * binormal.y, cos * normal.z + sin * binormal.z);
      }
    }

    for (let i = 0; i < colonSegments; i++) {
      for (let j = 0; j < colRadial; j++) {
        const a = i * (colRadial + 1) + j;
        const b = (i + 1) * (colRadial + 1) + j;
        const c = (i + 1) * (colRadial + 1) + (j + 1);
        const d = i * (colRadial + 1) + (j + 1);
        cIndex.push(a, b, d);
        cIndex.push(b, c, d);
      }
    }

    colGeom.setAttribute('position', new THREE.Float32BufferAttribute(cPos, 3));
    colGeom.setAttribute('normal', new THREE.Float32BufferAttribute(cNorm, 3));
    colGeom.setIndex(cIndex);
    colGeom.computeVertexNormals();

    const colonMesh = new THREE.Mesh(colGeom, matGlossy(0xa855f7, 0x220533, 0.38));
    colonMesh.userData = { organId: 'kolon' };
    colonGroup.add(colonMesh);

    // Appendix (Apendiks) worm-like projection at cecum
    const appCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.85, -1.45, 0.2),
      new THREE.Vector3(-0.95, -1.6, 0.22),
      new THREE.Vector3(-0.85, -1.72, 0.2)
    ]);
    const appGeom = new THREE.TubeGeometry(appCurve, 12, 0.05, 10, false);
    const appMesh = new THREE.Mesh(appGeom, matGlossy(0xc084fc, 0x000000, 0.4));
    colonGroup.add(appMesh);

    digestiveGroup.add(colonGroup);
    meshes.kolon = colonMesh;

    // --- (J) 9. REKTUM & DUBUR ---
    const rectumGroup = new THREE.Group();
    rectumGroup.userData = { organId: 'rektum' };

    const rectumCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, -1.95, 0.12),
      new THREE.Vector3(0.0, -2.4, 0.08),
      new THREE.Vector3(0.0, -2.85, 0.04)
    ]);
    const rectumGeom = new THREE.TubeGeometry(rectumCurve, 20, 0.19, 16, false);
    const rectumMesh = new THREE.Mesh(rectumGeom, matGlossy(0x6366f1, 0x111133, 0.35));
    rectumMesh.userData = { organId: 'rektum' };
    rectumGroup.add(rectumMesh);

    // Anus sphincter ring
    const anusGeom = new THREE.TorusGeometry(0.18, 0.06, 12, 24);
    anusGeom.rotateX(Math.PI / 2);
    const anusMesh = new THREE.Mesh(anusGeom, matGlossy(0x4338ca, 0x000000, 0.3));
    anusMesh.position.set(0.0, -2.9, 0.04);
    anusMesh.userData = { organId: 'rektum' };
    rectumGroup.add(anusMesh);

    digestiveGroup.add(rectumGroup);
    meshes.rektum = rectumMesh;

    organMeshesRef.current = meshes;

    // --- (K) CONTINUOUS DIGESTIVE TRACT MASTER CURVE (Bolus Pathway) ---
    // Single unbroken CatmullRom spline traversing mouth to anus
    const masterPathPoints = [
      new THREE.Vector3(0, 7.3, 0.15),   // Mulut
      new THREE.Vector3(0, 6.4, -0.05),  // Esofagus atas
      new THREE.Vector3(0.04, 4.8, -0.05),// Esofagus tengah
      new THREE.Vector3(0.15, 3.4, 0.1),  // Kardiak perut
      new THREE.Vector3(0.65, 3.1, 0.25), // Perut fundus/badan
      new THREE.Vector3(0.45, 2.15, 0.24),// Perut antrum
      new THREE.Vector3(0.15, 2.15, 0.2), // Pilorus
      new THREE.Vector3(-0.3, 1.75, 0.2), // Duodenum C-loop
      new THREE.Vector3(0.1, 1.35, 0.18), // Duodeno-jejunal flexure
      ...siPoints.slice(1, -1),            // Usus kecil coils
      new THREE.Vector3(-0.85, -1.45, 0.2),// Sekum usus besar
      new THREE.Vector3(-0.9, -0.3, 0.18), // Kolon menaik
      new THREE.Vector3(-0.85, 1.25, 0.18),// Sudut hepatik
      new THREE.Vector3(0.0, 1.32, 0.3),   // Kolon melintang
      new THREE.Vector3(0.85, 1.25, 0.2),  // Sudut splenik
      new THREE.Vector3(0.9, -0.3, 0.18),  // Kolon menurun
      new THREE.Vector3(0.5, -1.6, 0.17),  // Kolon sigmoid
      new THREE.Vector3(0.0, -1.95, 0.12), // Permulaan rektum
      new THREE.Vector3(0.0, -2.85, 0.04)  // Dubur
    ];
    const bolusSpline = new THREE.CatmullRomCurve3(masterPathPoints);
    bolusCurveRef.current = bolusSpline;

    // Glowing Animated Bolus Sphere
    const bolusGroup = new THREE.Group();
    const bolusSphereGeom = new THREE.SphereGeometry(0.13, 20, 20);
    const bolusMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.5,
      roughness: 0.1
    });
    const bolusSphere = new THREE.Mesh(bolusSphereGeom, bolusMat);
    bolusGroup.add(bolusSphere);

    // Glowing halo around bolus
    const haloGeom = new THREE.SphereGeometry(0.24, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const haloMesh = new THREE.Mesh(haloGeom, haloMat);
    bolusGroup.add(haloMesh);

    scene.add(bolusGroup);
    bolusMeshRef.current = bolusGroup;

    // Trailing particles along spline
    const trailCount = 36;
    const trailGeom = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailCount * 3);
    trailGeom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const trailPoints = new THREE.Points(trailGeom, trailMat);
    scene.add(trailPoints);

    // 7. Raycasting & Mouse Interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      // Intersect only interactive organ objects
      const intersects = raycaster.intersectObjects(digestiveGroup.children, true);

      if (intersects.length > 0) {
        // Find closest object with an organId in userData
        for (let hit of intersects) {
          let curr = hit.object;
          while (curr && curr !== digestiveGroup) {
            if (curr.userData && curr.userData.organId) {
              selectOrgan(curr.userData.organId, true);
              return;
            }
            curr = curr.parent;
          }
        }
      }
    };

    const onPointerMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(digestiveGroup.children, true);

      let foundId = null;
      if (intersects.length > 0) {
        for (let hit of intersects) {
          let curr = hit.object;
          while (curr && curr !== digestiveGroup) {
            if (curr.userData && curr.userData.organId) {
              foundId = curr.userData.organId;
              break;
            }
            curr = curr.parent;
          }
          if (foundId) break;
        }
      }

      setHoveredOrganId(foundId);
      container.style.cursor = foundId ? 'pointer' : 'default';
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointermove', onPointerMove);

    // Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Render Loop
    let lastTime = performance.now();
    let currentT = 0.25;

    const renderLoop = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Update Controls
      controls.update();

      // Auto-rotation toggle
      if (autoRotate) {
        digestiveGroup.rotation.y += 0.005;
      }

      // Update Bolus progress if playing
      if (isPlayingBolus && bolusSpline && bolusGroup) {
        currentT = (currentT + delta * 0.08 * bolusSpeed) % 1.0;
        setBolusProgress(currentT);

        const bolusPos = bolusSpline.getPoint(currentT);
        bolusGroup.position.copy(bolusPos);

        // Dynamic bolus color change according to stage of digestion:
        // Mouth: Sky Blue (Amilase), Stomach: Red/Orange (Acid Chyme), Intestine: Pink (Nutrient), Colon: Violet/Brown (Feces)
        if (currentT < 0.15) {
          bolusMat.color.setHex(0x38bdf8); // Mouth & Esophagus
          bolusMat.emissive.setHex(0x38bdf8);
        } else if (currentT < 0.35) {
          bolusMat.color.setHex(0xf43f5e); // Stomach acidic chyme
          bolusMat.emissive.setHex(0xf43f5e);
        } else if (currentT < 0.45) {
          bolusMat.color.setHex(0xf59e0b); // Duodenum (Bile & Pancreatic juice)
          bolusMat.emissive.setHex(0xf59e0b);
        } else if (currentT < 0.72) {
          bolusMat.color.setHex(0xec4899); // Small Intestine Absorption
          bolusMat.emissive.setHex(0xec4899);
        } else {
          bolusMat.color.setHex(0xa855f7); // Large intestine & Rectum
          bolusMat.emissive.setHex(0xa855f7);
        }

        // Pulse halo
        haloMesh.rotation.y += 0.04;
        haloMesh.rotation.x += 0.02;
        const pulse = 1.0 + Math.sin(now * 0.008) * 0.18;
        haloMesh.scale.set(pulse, pulse, pulse);

        // Update trail particles
        const tPositions = trailGeom.attributes.position.array;
        for (let i = 0; i < trailCount; i++) {
          const trailT = (currentT - (i + 1) * 0.003 + 1.0) % 1.0;
          const p = bolusSpline.getPoint(trailT);
          tPositions[i * 3] = p.x;
          tPositions[i * 3 + 1] = p.y;
          tPositions[i * 3 + 2] = p.z;
        }
        trailGeom.attributes.position.needsUpdate = true;
      }

      // Emissive pulse on selected and hovered organ
      Object.keys(meshes).forEach((id) => {
        const mesh = meshes[id];
        if (!mesh || !mesh.material) return;

        const isSelected = id === selectedOrganId;
        const isHovered = id === hoveredOrganId;

        if (isSelected) {
          const glow = 0.35 + Math.sin(now * 0.005) * 0.15;
          mesh.material.emissiveIntensity = 0.8 + glow;
        } else if (isHovered) {
          mesh.material.emissiveIntensity = 0.6;
        } else {
          mesh.material.emissiveIntensity = 0.15;
        }
      });

      // Render
      renderer.render(scene, camera);
      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    // Initial camera focus on stomach
    animateCameraTo(0.8, 2.8, 4.2, 0.6, 2.7, 0.2);

    // Cleanup
    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      if (cameraAnimRef.current) cancelAnimationFrame(cameraAnimRef.current);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointermove', onPointerMove);

      // Dispose renderer & geometries
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update torso visibility
  useEffect(() => {
    if (!sceneRef.current) return;
    const torso = sceneRef.current.getObjectByName('torso_silhouette');
    if (torso) {
      torso.visible = showTorso;
    }
  }, [showTorso]);

  // Sync bolus scrubber change
  const handleBolusScrub = (e) => {
    const val = parseFloat(e.target.value);
    setBolusProgress(val);
    if (bolusCurveRef.current && bolusMeshRef.current) {
      const p = bolusCurveRef.current.getPoint(val);
      bolusMeshRef.current.position.copy(p);
    }
  };

  // Get current active organ stage based on bolus progress
  const currentBolusStageName = useMemo(() => {
    if (bolusProgress < 0.08) return '👄 Bolus Makanan (Kunyah & Amilase)';
    if (bolusProgress < 0.18) return '🥖 Peristalsis Esofagus';
    if (bolusProgress < 0.35) return '🫀 Pengadunan Kim Berasid (Perut)';
    if (bolusProgress < 0.45) return '🥨 Emulsi Hempedu & Tripsin (Duodenum)';
    if (bolusProgress < 0.72) return '🌀 Penyerapan Vilus Usus Kecil';
    if (bolusProgress < 0.92) return '🔄 Penyerapan Semula Air (Kolon)';
    return '🚪 Penyahtinjaan (Rektum & Dubur)';
  }, [bolusProgress]);

  return (
    <div className="space-y-6">
      
      {/* Banner Pengenalan & Status */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Model 3D Anatomi Sistem Pencernaan Manusia</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Three.js Interactive WebGL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Klik mana-mana organ 3D untuk memfokus kamera, putar 360°, dan terokai rembesan enzim DSKP KSSM Sains Tingkatan 2 secara masa nyata.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetOverview}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Compass className="w-4 h-4 text-sky-400" />
            <span>Pandangan Penuh</span>
          </button>
        </div>
      </div>

      {/* Grid Utama: 3D Canvas di Kiri, Panel Maklumat Organ DSKP di Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolum Kiri (Canvas 3D & Kawalan Kamera) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          
          {/* Bekas Three.js Viewport */}
          <div 
            ref={containerRef}
            className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[520px] sm:h-[580px] w-full'
            }`}
          >
            {/* Overlay Petunjuk Interaksi */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-white">{selectedOrgan.name}</span>
              </div>
              {hoveredOrganId && hoveredOrganId !== selectedOrganId && (
                <div className="px-2.5 py-1 rounded-lg bg-indigo-950/80 backdrop-blur-md border border-indigo-500/40 text-[11px] text-indigo-300 animate-fade-in">
                  Sentuh: {ORGAN_DATA[hoveredOrganId]?.name}
                </div>
              )}
            </div>

            {/* Butang Kawalan Terapung di Penjuru Kanan Atas */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
              <button
                onClick={() => { soundFx.playClick(); setShowTorso(!showTorso); }}
                title="Tunjuk / Sembunyi Rangka Badan (X-Ray)"
                className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs font-semibold flex items-center gap-1 ${
                  showTorso 
                    ? 'bg-sky-500/20 border-sky-500/40 text-sky-300' 
                    : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {showTorso ? <Eye className="w-4 h-4 text-sky-400" /> : <EyeOff className="w-4 h-4" />}
                <span className="hidden sm:inline">Rangka</span>
              </button>

              <button
                onClick={() => { soundFx.playClick(); setAutoRotate(!autoRotate); }}
                title="Putaran 360° Automatik"
                className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs font-semibold flex items-center gap-1 ${
                  autoRotate 
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                    : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Putar</span>
              </button>

              <button
                onClick={toggleFullscreen}
                title="Mod Skrin Penuh"
                className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Kotak Petunjuk Gestur Pengguna */}
            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
              <p className="text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-800">
                🖱️ <strong>Klik kiri & heret:</strong> Putar 3D &nbsp;|&nbsp; <strong>Skrol:</strong> Zum &nbsp;|&nbsp; <strong>Klik kanan:</strong> Gerak (Pan)
              </p>
            </div>
          </div>

          {/* Bar Kawalan Simulasi Perjalanan Bolus Makanan */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { soundFx.playClick(); setIsPlayingBolus(!isPlayingBolus); }}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 text-xs font-bold"
                >
                  {isPlayingBolus ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlayingBolus ? 'Jeda Bolus' : 'Gerak Bolus'}</span>
                </button>

                <div className="text-xs font-semibold text-slate-300 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  {currentBolusStageName}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Kelajuan:</span>
                {[0.5, 1, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => { soundFx.playClick(); setBolusSpeed(spd); }}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      bolusSpeed === spd
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Garis Masa / Slider Interaktif Perjalanan Makanan */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.005"
                value={bolusProgress}
                onChange={handleBolusScrub}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1. Mulut</span>
                <span>2. Esofagus</span>
                <span>3. Perut</span>
                <span>4. Duodenum</span>
                <span>5. Usus Kecil</span>
                <span>6. Kolon</span>
                <span>7. Dubur</span>
              </div>
            </div>
          </div>

          {/* Jalur Pintasan Pantas Memilih Organ */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
            {Object.values(ORGAN_DATA).map((organ) => {
              const isSelected = organ.id === selectedOrganId;
              return (
                <button
                  key={organ.id}
                  onClick={() => selectOrgan(organ.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: organ.color }} />
                  <span>{organ.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Kolum Kanan: Kad Maklumat Anatomi & Enzim KSSM DSKP Terperinci */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            
            {/* Tajuk Organ & Kod KSSM */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  {selectedOrgan.kssmCode}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedOrgan.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: selectedOrgan.color }} />
                <span>{selectedOrgan.name}</span>
              </h3>
            </div>

            {/* Suasana pH & Jenis Tindakan */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                  <Droplet className="w-3.5 h-3.5 text-sky-400" />
                  <span>Medium pH</span>
                </div>
                <div className="text-xs font-bold text-white font-mono">
                  {selectedOrgan.ph}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Jenis Tindakan</span>
                </div>
                <div className="text-xs font-bold text-white">
                  {selectedOrgan.type}
                </div>
              </div>
            </div>

            {/* Rembesan & Enzim Terlibat */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-1.5">
              <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Rembesan & Enzim Terlibat</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedOrgan.secretions}
              </p>
            </div>

            {/* Penerangan Tindakan Biologi */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-300">
                Penerangan Tindakan Pencernaan:
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedOrgan.action}
              </p>
            </div>

            {/* Persamaan Reaksi Biokimia KSSM */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Persamaan Enzim KSSM Sains:
              </div>
              <div className="text-xs font-mono font-bold text-emerald-300 bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20 overflow-x-auto">
                {selectedOrgan.equation}
              </div>
            </div>

            {/* Fakta Menarik (Fun Fact) */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide block">Fakta Menarik Sains:</span>
                <p className="text-xs text-amber-200/90 leading-relaxed mt-0.5">
                  {selectedOrgan.funFact}
                </p>
              </div>
            </div>

            {/* Butang Fokus Semula Kamera */}
            <button
              onClick={() => selectOrgan(selectedOrgan.id)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Fokus Semula Kamera ke {selectedOrgan.name.split(' ')[0]}</span>
            </button>

          </div>

          {/* Panduan Eksplorasi Pelajar */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-400" />
              <span>Tips Guru & Pelajar Sains Tingkatan 2:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li>Pencernaan kanji bermula di <strong>mulut</strong> dan selesai di <strong>usus kecil</strong>.</li>
              <li>Pencernaan protein bermula di <strong>perut</strong> oleh pepsin dan selesai di <strong>usus kecil</strong> oleh tripsin & peptidase.</li>
              <li>Pencernaan lemak hanya bermula di <strong>duodenum</strong> selepas diemulsikan oleh jus hempedu dari hati!</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
