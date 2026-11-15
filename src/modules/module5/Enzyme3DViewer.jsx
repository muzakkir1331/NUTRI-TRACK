import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Scissors, 
  Sparkles, 
  Compass, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  Info, 
  Maximize2, 
  Minimize2,
  Zap,
  HelpCircle
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import { fireConfetti } from '../../utils/confetti';

const ENZYMES_3D_DATA = [
  {
    id: 'amylase',
    name: 'Enzim Amilase',
    target: 'Kanji (Polimer Karbohidrat)',
    productName: 'Maltosa (Disakarida 2 Unit Glukosa)',
    substrateVisualName: 'Rantai Heliks Kanji',
    enzymeColor: 0x3b82f6, // Biru protein
    substrateColor: 0xf59e0b, // Amber kanji
    productColor: 0x10b981, // Hijau maltosa
    activeSiteShape: 'Cleft (Alur Memanjang)',
    equation: 'Kanji + Air ──(Amilase Air Liur / Pankreas)──> Maltosa',
    explanation: 'Tapak aktif amilase mempunyai bentuk yang sepadan dengan ikatan glikosidik antara molekul glukosa dalam kanji.',
    kssmFact: 'Amilase bertindak secara optimum pada suhu badan (37°C) dan ternyahasli pada suhu melebihi 60°C.'
  },
  {
    id: 'protease',
    name: 'Enzim Protease (Pepsin & Tripsin)',
    target: 'Protein (Rantai Polipeptida)',
    productName: 'Peptida & Asid Amino',
    substrateVisualName: 'Rantai Polipeptida Asid Amino',
    enzymeColor: 0x8b5cf6, // Ungu protease
    substrateColor: 0xec4899, // Pink protein
    productColor: 0x06b6d4, // Cyan asid amino
    activeSiteShape: 'Poket Dalam Berasid / Beralkali',
    equation: 'Protein + Air ──(Pepsin / Tripsin)──> Peptida ──> Asid Amino',
    explanation: 'Tapak aktif protease memegang rantai polipeptida dan menghidrolisiskan ikatan peptida antara asid amino.',
    kssmFact: 'Pepsin di dalam perut memerlukan medium berasid kuat (HCl pH 2) untuk mengaktifkan bentuk tapak aktifnya.'
  },
  {
    id: 'lipase',
    name: 'Enzim Lipase',
    target: 'Lemak / Lipid (Trigliserida)',
    productName: 'Asid Lemak + Gliserol',
    substrateVisualName: 'Trigliserida (1 Gliserol + 3 Asid Lemak)',
    enzymeColor: 0xf43f5e, // Rose lipase
    substrateColor: 0xfbbf24, // Emas trigliserida
    productColor: 0xa855f7, // Violet asid lemak & gliserol
    activeSiteShape: 'Kantung Hidrofobik Tiga Serangkai',
    equation: 'Titisan Lemak Teremulsi + Air ──(Lipase)──> Asid Lemak + Gliserol',
    explanation: 'Tapak aktif lipase memecahkan ikatan ester antara molekul gliserol dan 3 rantai asid lemak.',
    kssmFact: 'Lipase bertindak lebih pantas ke atas titisan lemak yang telah diemulsikan oleh jus hempedu dari hati.'
  }
];

export default function Enzyme3DViewer() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // States
  const [selectedEnzymeId, setSelectedEnzymeId] = useState('amylase');
  // Fasa: 'free' (substrat terapung) -> 'docking' (bercantum) -> 'complex' (kompleks enzim-substrat) -> 'catalyzing' (tindak balas) -> 'products_released' (hasil terurai)
  const [reactionPhase, setReactionPhase] = useState('free');
  const [selectedElement, setSelectedElement] = useState('enzyme');
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 3D Object Refs
  const enzymeMeshRef = useRef(null);
  const substrateGroupRef = useRef(null);
  const productA_Ref = useRef(null);
  const productB_Ref = useRef(null);
  const catalyticSparkRef = useRef(null);

  const currentEnzyme = useMemo(() => 
    ENZYMES_3D_DATA.find(e => e.id === selectedEnzymeId) || ENZYMES_3D_DATA[0],
    [selectedEnzymeId]
  );

  // Tukar enzim
  const handleSelectEnzyme = (id) => {
    soundFx.playClick();
    setSelectedEnzymeId(id);
    resetReaction();
  };

  const resetReaction = () => {
    setReactionPhase('free');
    if (substrateGroupRef.current) {
      substrateGroupRef.current.position.set(0, 2.5, 0);
      substrateGroupRef.current.visible = true;
    }
    if (productA_Ref.current) productA_Ref.current.visible = false;
    if (productB_Ref.current) productB_Ref.current.visible = false;
    if (catalyticSparkRef.current) catalyticSparkRef.current.visible = false;
  };

  // Mulakan Tindak Balas Katalitik 3D
  const handleTriggerReaction = () => {
    if (reactionPhase !== 'free') return;
    soundFx.playClick();
    setReactionPhase('docking');

    // Fasa 1: Substrat meluncur masuk ke tapak aktif enzim (Docking)
    const startTime = performance.now();
    const dockDuration = 900; // ms

    const animateDock = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / dockDuration, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      if (substrateGroupRef.current) {
        substrateGroupRef.current.position.y = 2.5 - ease * 1.5; // Masuk ke tapak aktif y = 1.0
        substrateGroupRef.current.rotation.y = ease * Math.PI;
      }

      if (progress < 1) {
        requestAnimationFrame(animateDock);
      } else {
        // Fasa 2: Kompleks Enzim-Substrat Terbentuk
        setReactionPhase('complex');
        soundFx.playSuccess();

        setTimeout(() => {
          // Fasa 3: Percikan Pemangkinan & Pemecahan Ikatan
          setReactionPhase('catalyzing');
          soundFx.playBubble();
          if (catalyticSparkRef.current) catalyticSparkRef.current.visible = true;

          setTimeout(() => {
            if (catalyticSparkRef.current) catalyticSparkRef.current.visible = false;
            // Fasa 4: Pembebasan Produk (Hasil Terurai Berpisah)
            setReactionPhase('products_released');
            soundFx.playSuccess();
            fireConfetti();

            if (substrateGroupRef.current) substrateGroupRef.current.visible = false;
            if (productA_Ref.current && productB_Ref.current) {
              productA_Ref.current.visible = true;
              productB_Ref.current.visible = true;
              productA_Ref.current.position.set(0, 1.0, 0);
              productB_Ref.current.position.set(0, 1.0, 0);

              // Animasi produk berpecah dan melayang keluar
              const splitStart = performance.now();
              const animateSplit = (sNow) => {
                const sElapsed = sNow - splitStart;
                const sP = Math.min(sElapsed / 1000, 1);
                productA_Ref.current.position.set(-sP * 1.6, 1.0 + sP * 1.2, sP * 0.5);
                productB_Ref.current.position.set(sP * 1.6, 1.0 + sP * 1.2, -sP * 0.5);
                productA_Ref.current.rotation.z = sP * 2;
                productB_Ref.current.rotation.z = -sP * 2;

                if (sP < 1) requestAnimationFrame(animateSplit);
              };
              requestAnimationFrame(animateSplit);
            }
          }, 800);
        }, 800);
      }
    };
    requestAnimationFrame(animateDock);
  };

  // Fullscreen
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

  // Three.js Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6.0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.0;
    controls.maxDistance = 12.0;
    controls.target.set(0, 1.0, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    rimLight.position.set(-6, 3, -4);
    scene.add(rimLight);

    // Grid tapak biokimia
    const grid = new THREE.GridHelper(12, 24, 0x6366f1, 0x1e293b);
    grid.position.y = -1.2;
    grid.material.opacity = 0.35;
    grid.material.transparent = true;
    scene.add(grid);

    // Group Utama Molekul
    const molGroup = new THREE.Group();
    scene.add(molGroup);

    // --- (A) 3D ENZIM (Macromolecule dengan Tapak Aktif Lekukan) ---
    const enzymeGroup = new THREE.Group();
    enzymeGroup.position.set(0, 0, 0);

    // Badan utama protein globul
    const enzymeBodyGeom = new THREE.SphereGeometry(1.2, 32, 24);
    // Deformasikan sfera untuk membentuk lekukan "Tapak Aktif" di bahagian atas
    const pos = enzymeBodyGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Cipta lekukan tapak aktif (Active Site Cleft) di kutub atas y > 0.4
      if (y > 0.3 && Math.abs(x) < 0.7 && Math.abs(z) < 0.7) {
        y -= 0.65; // Lekuk ke dalam
      }
      pos.setXYZ(i, x, y, z);
    }
    enzymeBodyGeom.computeVertexNormals();

    const enzymeMat = new THREE.MeshStandardMaterial({
      color: currentEnzyme.enzymeColor,
      roughness: 0.35,
      metalness: 0.1,
      wireframe: false
    });
    const enzymeMesh = new THREE.Mesh(enzymeBodyGeom, enzymeMat);
    enzymeMesh.userData = { role: 'enzyme' };
    enzymeGroup.add(enzymeMesh);
    enzymeMeshRef.current = enzymeMesh;

    // Lingkaran penanda Tapak Aktif (Active Site Outline Ring)
    const activeSiteMarkerGeom = new THREE.TorusGeometry(0.55, 0.04, 12, 24);
    activeSiteMarkerGeom.rotateX(Math.PI / 2);
    const activeSiteMarkerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true
    });
    const activeSiteMarker = new THREE.Mesh(activeSiteMarkerGeom, activeSiteMarkerMat);
    activeSiteMarker.position.set(0, 0.45, 0);
    enzymeGroup.add(activeSiteMarker);

    molGroup.add(enzymeGroup);

    // --- (B) 3D SUBSTRAT (Molekul Kompleks Makanan) ---
    const subGroup = new THREE.Group();
    subGroup.position.set(0, 2.5, 0);

    const subMat = new THREE.MeshStandardMaterial({
      color: currentEnzyme.substrateColor,
      roughness: 0.25,
      metalness: 0.15
    });

    // 2 Sub-unit molekul yang bercantum membentuk substrat
    const subSphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), subMat);
    subSphere1.position.set(-0.3, 0, 0);
    subGroup.add(subSphere1);

    const subSphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), subMat);
    subSphere2.position.set(0.3, 0, 0);
    subGroup.add(subSphere2);

    // Ikatan kimia penghubung (Bond cylinder between monomers)
    const bondGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16);
    bondGeom.rotateZ(Math.PI / 2);
    const bondMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const bondMesh = new THREE.Mesh(bondGeom, bondMat);
    subGroup.add(bondMesh);

    molGroup.add(subGroup);
    substrateGroupRef.current = subGroup;

    // --- (C) PRODUK A & B (Molekul Terurai Selepas Pemangkinan) ---
    const prodMat = new THREE.MeshStandardMaterial({
      color: currentEnzyme.productColor,
      roughness: 0.25,
      metalness: 0.1
    });

    const prodA = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), prodMat);
    prodA.visible = false;
    molGroup.add(prodA);
    productA_Ref.current = prodA;

    const prodB = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), prodMat);
    prodB.visible = false;
    molGroup.add(prodB);
    productB_Ref.current = prodB;

    // Percikan tenaga pemangkin (Catalytic Spark particles)
    const sparkGeom = new THREE.SphereGeometry(0.65, 16, 16);
    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const sparkMesh = new THREE.Mesh(sparkGeom, sparkMat);
    sparkMesh.position.set(0, 0.9, 0);
    sparkMesh.visible = false;
    molGroup.add(sparkMesh);
    catalyticSparkRef.current = sparkMesh;

    // Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const renderLoop = (now) => {
      controls.update();

      if (autoRotate) {
        molGroup.rotation.y += 0.005;
      }

      // Animasi terapung substrat apabila dalam fasa bebas
      if (reactionPhase === 'free' && subGroup) {
        subGroup.position.y = 2.4 + Math.sin(now * 0.003) * 0.15;
        subGroup.rotation.y += 0.01;
      }

      // Percikan berdenyut
      if (sparkMesh && sparkMesh.visible) {
        sparkMesh.rotation.y += 0.08;
        sparkMesh.rotation.x += 0.05;
        const s = 1.0 + Math.sin(now * 0.02) * 0.2;
        sparkMesh.scale.set(s, s, s);
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };
    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [currentEnzyme, reactionPhase]);

  return (
    <div className="space-y-6">
      
      {/* Header Enzim 3D */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-500/10">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Simulasi 3D Molekul Enzim: Hipotesis Kunci & Mangga</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                SP 3.3.1 TINGKATAN 2
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Lihat bagaimana tapak aktif (*active site*) molekul protein enzim memegang substrat secara spesifik seperti kunci dan mangga untuk memecahkan ikatan kimia.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (cameraRef.current && controlsRef.current) {
                cameraRef.current.position.set(0, 2.5, 6.0);
                controlsRef.current.target.set(0, 1.0, 0);
                controlsRef.current.update();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Pandangan Penuh</span>
          </button>
        </div>
      </div>

      {/* Grid Utama: 3D Viewport di Kiri, Panel Biokimia di Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolum Kiri: 3D Canvas */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          
          <div 
            ref={containerRef}
            className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[500px] sm:h-[540px] w-full'
            }`}
          >
            {/* Status Fasa Tindak Balas */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span className="font-semibold text-white">{currentEnzyme.name}</span>
                <span className="text-slate-500">|</span>
                <span className="text-indigo-300">
                  {reactionPhase === 'free' && '1. Substrat Bebas'}
                  {reactionPhase === 'docking' && '2. Bergerak ke Tapak Aktif'}
                  {reactionPhase === 'complex' && '3. Kompleks Enzim-Substrat'}
                  {reactionPhase === 'catalyzing' && '4. Pemecahan Ikatan Kimia!'}
                  {reactionPhase === 'products_released' && '5. Hasil Produk Terurai'}
                </span>
              </div>
            </div>

            {/* Kawalan Kamera */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
              <button
                onClick={() => { soundFx.playClick(); setAutoRotate(!autoRotate); }}
                title="Putaran 360°"
                className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs font-semibold flex items-center gap-1 ${
                  autoRotate 
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' 
                    : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Putar</span>
              </button>

              <button
                onClick={toggleFullscreen}
                title="Skrin Penuh"
                className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Petunjuk Interaksi */}
            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
              <p className="text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-800">
                🖱️ <strong>Heret:</strong> Putar Sudut Molekul 3D &nbsp;|&nbsp; <strong>Skrol:</strong> Zum Dekat Tapak Aktif
              </p>
            </div>
          </div>

          {/* Bar Kawalan Tindak Balas Enzim */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerReaction}
                disabled={reactionPhase !== 'free'}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  reactionPhase === 'free'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30 hover:scale-105'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Scissors className="w-4 h-4" />
                <span>
                  {reactionPhase === 'free' && 'Jalankan Tindak Balas Enzim'}
                  {reactionPhase === 'docking' && 'Sedang Mengikat Substrat...'}
                  {reactionPhase === 'complex' && 'Kompleks Enzim-Substrat!'}
                  {reactionPhase === 'catalyzing' && 'Memutuskan Ikatan...'}
                  {reactionPhase === 'products_released' && 'Tindak Balas Lengkap!'}
                </span>
              </button>
            </div>

            <button
              onClick={() => { soundFx.playClick(); resetReaction(); }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulang Semula Simulasi</span>
            </button>
          </div>

        </div>

        {/* Kolum Kanan: Panel Sains KSSM */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Pilih Jenis Enzim */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Pilih Molekul Enzim:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {ENZYMES_3D_DATA.map((enz) => (
                <button
                  key={enz.id}
                  onClick={() => handleSelectEnzyme(enz.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                    selectedEnzymeId === enz.id
                      ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold">{enz.name.split(' ')[1] || enz.name}</div>
                  <div className="text-[10px] text-amber-400 truncate">{enz.target.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Kad Maklumat Hipotesis Kunci dan Mangga */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                Hipotesis Kunci & Mangga (Lock-and-Key):
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {currentEnzyme.name} ➔ {currentEnzyme.target}
              </h3>
            </div>

            {/* Bentuk Tapak Aktif */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Bentuk Tapak Aktif:</span>
                <span className="text-xs font-bold text-sky-400">{currentEnzyme.activeSiteShape}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">Hasil Terurai (Produk):</span>
                <span className="text-xs font-bold text-emerald-400">{currentEnzyme.productName.split('(')[0]}</span>
              </div>
            </div>

            {/* Persamaan Reaksi Biokimia */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Persamaan Enzim KSSM Sains:
              </div>
              <div className="text-xs font-mono font-bold text-emerald-300 bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20 overflow-x-auto">
                {currentEnzyme.equation}
              </div>
            </div>

            {/* Penerangan Tindakan */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-300">Penerangan Sains Biokimia:</span>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                {currentEnzyme.explanation}
              </p>
            </div>

            {/* Fakta Menarik KSSM */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-300 leading-relaxed">
                <strong>Fakta Penting:</strong> {currentEnzyme.kssmFact}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
