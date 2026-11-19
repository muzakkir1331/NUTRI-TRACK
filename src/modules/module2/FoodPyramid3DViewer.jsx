import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Sparkles, 
  RotateCcw, 
  Compass, 
  Layers, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ArrowRight
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const PYRAMID_TIERS_DATA = {
  tier1: {
    id: 'tier1',
    level: 1,
    name: 'Aras 1: Sayur-sayuran & Buah-buahan',
    slogan: 'MAKAN PALING BANYAK (DASAR PIRAMID)',
    color: '#10b981',
    hex: 0x10b981,
    servings: 'Sekurang-kurangnya 3 sajian sayur-sayuran & 2 sajian buah-buahan setiap hari.',
    examples: 'Bayam, sawi, bendi, timun, ulam-ulaman, betik, pisang, tembikai, epal.',
    function: 'Membekalkan vitamin, garam mineral, air dan pelawas (serat) yang tinggi untuk menguatkan sistem imun, melancarkan peristalsis dan mencegah sembelit.',
    risk: 'Kekurangan serat dan vitamin boleh menyebabkan sembelit kronik, skurvi (kurang vit C), dan rabun malam (kurang vit A).'
  },
  tier2: {
    id: 'tier2',
    level: 2,
    name: 'Aras 2: Nasi, Mi, Roti, Bijirin & Ubi',
    slogan: 'MAKAN BANYAK (MENGIKUT KEPERLUAN TENAGA)',
    color: '#eab308',
    hex: 0xeab308,
    servings: '3 hingga 5 sajian sehari (utamakan bijirin penuh seperti beras perang & roti gandum).',
    examples: 'Beras perang, nasi putih, roti gandum penuh, oat, ubi keledek, jagung.',
    function: 'Sumber karbohidrat kompleks membekalkan glukosa sebagai bahan bakar utama respirasi sel untuk menjana tenaga (ATP) bagi aktiviti fizikal dan fungsi otak.',
    risk: 'Pengambilan berlebihan tanpa senaman menyebabkan lebihan kalori ditukarkan menjadi lemak badan dan disimpan di tisu adipos (kegendutan).'
  },
  tier3: {
    id: 'tier3',
    level: 3,
    name: 'Aras 3: Ikan, Ayam, Daging, Telur, Kekacang & Susu',
    slogan: 'MAKAN SEDERHANA',
    color: '#f97316',
    hex: 0xf97316,
    servings: '1 sajian ikan, 1-2 sajian ayam/daging/telur, 1-2 sajian susu atau produk tenusu sehari.',
    examples: 'Ikan kembung, dada ayam, telur rebus, tempe, tauhu, susu segar, yogurt, keju.',
    function: 'Membekalkan asid amino penting untuk pertumbuhan tisu baru, pembaikan sel yang rosak, penghasilan enzim, hormon, dan antibodi badan.',
    risk: 'Pengambilan daging merah atau daging proses berlebihan meningkatkan kolesterol tepu; manakala kekurangan protein membawa kepada penyakit kwashiorkor.'
  },
  tier4: {
    id: 'tier4',
    level: 4,
    name: 'Aras 4: Lemak, Minyak, Gula & Garam',
    slogan: 'MAKAN PALING SEDIKIT (PUNCAK PIRAMID / HADKAN)',
    color: '#ef4444',
    hex: 0xef4444,
    servings: 'Minyak < 5 sudu teh, Gula < 10 sudu teh, Garam < 1 sudu teh (5g) sehari.',
    examples: 'Minyak masak, mentega, marjerin, santan pekat, krimer manis, kerepek masin, minuman berkarbonat.',
    function: 'Menyediakan asid lemak perlu dan pembawa vitamin larut lemak (A, D, E, K), namun hanya diperlukan dalam kuantiti sangat minima.',
    risk: 'Pengambilan berlebihan merupakan punca utama obesiti, diabetes melitus (kencing manis), hipertensi (darah tinggi), dan serangan jantung.'
  }
};

export default function FoodPyramid3DViewer() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // States
  const [selectedTierId, setSelectedTierId] = useState('tier1');
  const [hoveredTierId, setHoveredTierId] = useState(null);
  const [isExploded, setIsExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 3D Meshes Refs
  const tierMeshesRef = useRef({});
  const pyramidGroupRef = useRef(null);

  const selectedTier = useMemo(() => PYRAMID_TIERS_DATA[selectedTierId] || PYRAMID_TIERS_DATA.tier1, [selectedTierId]);

  // Handle select tier
  const handleSelectTier = (tierId) => {
    soundFx.playClick();
    setSelectedTierId(tierId);

    // Animasi kamera fokus ke aras tersebut
    const targetY = {
      tier1: 0.3,
      tier2: 1.2,
      tier3: 2.1,
      tier4: 3.0
    }[tierId] || 1.5;

    animateCameraTo(0, targetY + 1.2, 5.5, 0, targetY, 0);
  };

  // Smooth camera transition
  const animateCameraTo = (px, py, pz, tx, ty, tz, dur = 750) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const startPos = cameraRef.current.position.clone();
    const startTarget = controlsRef.current.target.clone();
    const endPos = new THREE.Vector3(px, py, pz);
    const endTarget = new THREE.Vector3(tx, ty, tz);
    const startTime = performance.now();

    const loop = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      cameraRef.current.position.lerpVectors(startPos, endPos, ease);
      controlsRef.current.target.lerpVectors(startTarget, endTarget, ease);
      controlsRef.current.update();
      if (progress < 1) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
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

  // Toggle Exploded View
  const handleToggleExplode = () => {
    soundFx.playBubble();
    setIsExploded(!isExploded);
  };

  // Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.038);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3.5, 3.8, 6.8);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.5;
    controls.maxDistance = 14.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.target.set(0, 1.6, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    fillLight.position.set(-6, 3, -4);
    scene.add(fillLight);

    // Lantai Grid Pedestal
    const grid = new THREE.GridHelper(12, 24, 0xf59e0b, 0x1e293b);
    grid.position.y = -0.01;
    grid.material.opacity = 0.35;
    grid.material.transparent = true;
    scene.add(grid);

    // Kumpulan Piramid Utama
    const pyrGroup = new THREE.Group();
    scene.add(pyrGroup);
    pyramidGroupRef.current = pyrGroup;

    // --- BINA 4 ARAS PIRAMID SEGI EMPAT BERSTRUKTUR (4-Tier Square Frustums) ---
    const tierMeshes = {};

    // Aras 1: Dasar (Sayur & Buah - Hijau Zamrud)
    const t1Geom = new THREE.CylinderGeometry(1.6, 2.2, 0.75, 4);
    t1Geom.rotateY(Math.PI / 4);
    const t1Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.1
    });
    const t1Mesh = new THREE.Mesh(t1Geom, t1Mat);
    t1Mesh.position.y = 0.375;
    t1Mesh.userData = { tierId: 'tier1', defaultY: 0.375, explodedY: 0.2 };
    pyrGroup.add(t1Mesh);
    tierMeshes.tier1 = t1Mesh;

    // Aras 2: Karbohidrat / Bijirin (Kuning Emas)
    const t2Geom = new THREE.CylinderGeometry(1.1, 1.55, 0.75, 4);
    t2Geom.rotateY(Math.PI / 4);
    const t2Mat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.3,
      metalness: 0.1
    });
    const t2Mesh = new THREE.Mesh(t2Geom, t2Mat);
    t2Mesh.position.y = 1.15;
    t2Mesh.userData = { tierId: 'tier2', defaultY: 1.15, explodedY: 1.4 };
    pyrGroup.add(t2Mesh);
    tierMeshes.tier2 = t2Mesh;

    // Aras 3: Protein / Susu (Oren Amber)
    const t3Geom = new THREE.CylinderGeometry(0.6, 1.05, 0.75, 4);
    t3Geom.rotateY(Math.PI / 4);
    const t3Mat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.3,
      metalness: 0.1
    });
    const t3Mesh = new THREE.Mesh(t3Geom, t3Mat);
    t3Mesh.position.y = 1.925;
    t3Mesh.userData = { tierId: 'tier3', defaultY: 1.925, explodedY: 2.6 };
    pyrGroup.add(t3Mesh);
    tierMeshes.tier3 = t3Mesh;

    // Aras 4: Lemak, Gula, Garam (Puncak Merah Tirus)
    const t4Geom = new THREE.ConeGeometry(0.55, 0.75, 4);
    t4Geom.rotateY(Math.PI / 4);
    const t4Mat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.3,
      metalness: 0.1
    });
    const t4Mesh = new THREE.Mesh(t4Geom, t4Mat);
    t4Mesh.position.y = 2.7;
    t4Mesh.userData = { tierId: 'tier4', defaultY: 2.7, explodedY: 3.8 };
    pyrGroup.add(t4Mesh);
    tierMeshes.tier4 = t4Mesh;

    tierMeshesRef.current = tierMeshes;

    // Raycasting untuk klik pada aras piramid
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pyrGroup.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.tierId) {
          handleSelectTier(hit.userData.tierId);
        }
      }
    };

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pyrGroup.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.tierId) {
          setHoveredTierId(hit.userData.tierId);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredTierId(null);
      container.style.cursor = 'default';
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);

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
        pyrGroup.rotation.y += 0.005;
      }

      // Animasi kedudukan aras jika dalam mod pisah aras (Exploded View)
      Object.keys(tierMeshes).forEach((key) => {
        const mesh = tierMeshes[key];
        const targetY = isExploded ? mesh.userData.explodedY : mesh.userData.defaultY;
        mesh.position.y += (targetY - mesh.position.y) * 0.08;

        // Emissive pulse on selected
        if (key === selectedTierId) {
          const glow = 0.3 + Math.sin(now * 0.005) * 0.15;
          mesh.material.emissiveIntensity = 0.5 + glow;
        } else if (key === hoveredTierId) {
          mesh.material.emissiveIntensity = 0.4;
        } else {
          mesh.material.emissiveIntensity = 0.1;
        }
      });

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };
    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isExploded, selectedTierId, hoveredTierId]);

  return (
    <div className="space-y-6">
      
      {/* Header Piramid 3D */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Model 3D Piramid Makanan Malaysia (WebGL)</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                SP 3.2.1 KKM
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Putar 360°, pisahkan aras piramid secara bertingkat (*exploded view*), dan terokai bilangan sajian harian yang disyorkan Kementerian Kesihatan Malaysia.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => animateCameraTo(3.5, 3.8, 6.8, 0, 1.6, 0)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Pandangan Penuh</span>
          </button>
        </div>
      </div>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolum Kiri: 3D Canvas */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          
          <div 
            ref={containerRef}
            className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[500px] sm:h-[540px] w-full'
            }`}
          >
            {/* Status Aras Dipilih */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: selectedTier.color }} />
                <span className="font-semibold text-white">{selectedTier.name}</span>
              </div>
            </div>

            {/* Butang Kawalan Viewport */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
              <button
                onClick={handleToggleExplode}
                title="Pisah / Cantum Aras Piramid"
                className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs font-semibold flex items-center gap-1 ${
                  isExploded 
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                    : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">{isExploded ? 'Cantumkan' : 'Pisah Aras'}</span>
              </button>

              <button
                onClick={() => { soundFx.playClick(); setAutoRotate(!autoRotate); }}
                title="Putaran 360°"
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
                title="Skrin Penuh"
                className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Petunjuk Pengguna */}
            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
              <p className="text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-800">
                🖱️ <strong>Klik mana-mana aras piramid</strong> untuk memeriksa sukatan sajian & contoh makanan harian
              </p>
            </div>
          </div>

          {/* Jalur Butang Pemilih Aras Pantas */}
          <div className="grid grid-cols-4 gap-2">
            {Object.values(PYRAMID_TIERS_DATA).map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelectTier(t.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${
                  selectedTierId === t.id
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
                }`}
                style={{ borderColor: selectedTierId === t.id ? t.color : undefined }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                <span>Aras {t.level}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Kolum Kanan: Maklumat Aras KKM */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  ARAS {selectedTier.level} PIRAMID
                </span>
                <span className="text-xs font-bold text-amber-400">
                  {selectedTier.slogan}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: selectedTier.color }} />
                <span>{selectedTier.name}</span>
              </h3>
            </div>

            {/* Sukatan Sajian Disyorkan */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Sukatan Sajian Disyorkan KKM:</span>
              <p className="text-xs font-bold text-emerald-400 leading-relaxed font-mono">
                {selectedTier.servings}
              </p>
            </div>

            {/* Contoh Makanan Tempatan */}
            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1">
              <span className="text-[11px] text-amber-400 font-bold block">Contoh Makanan Malaysia:</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedTier.examples}
              </p>
            </div>

            {/* Fungsi Biologi Utama */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-300">Kepentingan Terhadap Tubuh:</span>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                {selectedTier.function}
              </p>
            </div>

            {/* Risiko Kesihatan */}
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-rose-300 leading-relaxed">
                <strong>Risiko Kesihatan:</strong> {selectedTier.risk}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
