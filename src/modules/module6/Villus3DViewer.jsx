import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Layers, 
  Sparkles, 
  Compass, 
  ZoomIn, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  CheckCircle2,
  Droplet,
  Heart,
  Info,
  Play,
  Pause
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

const VILLUS_PARTS = {
  epithelium: {
    id: 'epithelium',
    name: 'Sel Epitelium (Setebal Satu Sel)',
    kssmCode: 'Penyesuaian Vilus 1',
    role: 'Lapisan Luar Penyerapan',
    color: '#ec4899',
    description: 'Dinding vilus yang sangat nipis setebal satu sel sahaja. Ini memendekkan jarak resapan nutrien agar penyerapan dapat berlaku dengan kadar paling optimum.',
    absorbed: 'Membenarkan resapan glukosa, asid amino, air, dan asid lemak melalui membran sel secara resapan berbantu atau pengangkutan aktif.',
    funFact: 'Setiap sel epitelium mempunyai ribuan mikrovilus halus pada permukaannya yang membesarkan lagi luas permukaan penyerapan sehingga 20 kali ganda!'
  },
  capillaries: {
    id: 'capillaries',
    name: 'Jaringan Kapilari Darah',
    kssmCode: 'Penyerapan Larut Air',
    role: 'Pengangkutan Glukosa & Asid Amino',
    color: '#ef4444',
    description: 'Jaringan salur darah halus yang padat melingkari dinding dalam vilus. Darah mengalir secara berterusan bagi mengekalkan kecerunan kepekatan yang tinggi antara lumen usus dan aliran darah.',
    absorbed: '• Glukosa (gula ringkas)\n• Asid Amino (daripada pencernaan protein)\n• Garam Mineral & Air\n• Vitamin Larut Air: Vitamin B & Vitamin C',
    funFact: 'Nutrien yang diserap ke dalam kapilari darah dihantar terus ke hati melalui Vena Porta Hepar untuk diasimilasikan.'
  },
  lacteal: {
    id: 'lacteal',
    name: 'Lakteal (Salur Limfa Pusat)',
    kssmCode: 'Penyerapan Larut Lemak',
    role: 'Pengangkutan Asid Lemak & Gliserol',
    color: '#f59e0b',
    description: 'Salur sistem limfa yang terletak tepat di bahagian tengah setiap unjuran vilus. Lakteal menyerap titisan lemak dan asid lemak yang terlalu besar atau tidak larut dalam air.',
    absorbed: '• Asid Lemak\n• Gliserol\n• Vitamin Larut Lemak: Vitamin A, D, E dan K (ADEK)',
    funFact: 'Cecair limfa berlemak di dalam lakteal berpenampilan seperti susu dan dialirkan melalui Duktus Toraks ke dalam sistem peredaran darah.'
  },
  microvilli: {
    id: 'microvilli',
    name: 'Mikrovilus (Unjuran Seni Membran)',
    kssmCode: 'Penyesuaian Vilus 2',
    role: 'Peluasan Luas Permukaan',
    color: '#8b5cf6',
    description: 'Unjuran mikroskopik berjuta-juta pada permukaan apikal sel epitelium membentuk sempadan berus (brush border).',
    absorbed: 'Mempercepatkan kadar penyerapan dengan menyediakan berjuta-juta pintu masuk protein pengangkut bagi nutrien makanan.',
    funFact: 'Gabungan vilus dan mikrovilus di usus kecil menghasilkan jumlah luas permukaan yang setara dengan keluasan sebuah gelanggang tenis!'
  }
};

export default function Villus3DViewer() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // States
  const [selectedPartId, setSelectedPartId] = useState('capillaries');
  const [hoveredPartId, setHoveredPartId] = useState(null);
  const [particleMode, setParticleMode] = useState('water'); // 'water' | 'lipid' | 'both'
  const [isSimulatingAbsorption, setIsSimulatingAbsorption] = useState(true);
  const [showCutaway, setShowCutaway] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedPart = useMemo(() => VILLUS_PARTS[selectedPartId] || VILLUS_PARTS.capillaries, [selectedPartId]);

  // Dynamic particle arrays refs
  const waterParticlesRef = useRef(null);
  const lipidParticlesRef = useRef(null);
  const meshesRef = useRef({});

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

  const handleSelectPart = (partId) => {
    soundFx.playClick();
    setSelectedPartId(partId);

    if (partId === 'lacteal') {
      animateCameraTo(0, 2.2, 3.4, 0, 1.8, 0);
    } else if (partId === 'capillaries') {
      animateCameraTo(1.2, 2.2, 3.5, 0.4, 1.8, 0);
    } else if (partId === 'epithelium') {
      animateCameraTo(0, 3.2, 4.6, 0, 2.0, 0);
    } else {
      animateCameraTo(0, 3.8, 3.2, 0, 2.6, 0);
    }
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
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(1.5, 3.2, 6.4);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 14.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.target.set(0, 1.8, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const cyanRim = new THREE.DirectionalLight(0x38bdf8, 0.9);
    cyanRim.position.set(-6, 3, -4);
    scene.add(cyanRim);

    const amberFill = new THREE.DirectionalLight(0xf59e0b, 0.6);
    amberFill.position.set(0, -4, 4);
    scene.add(amberFill);

    // Dinding Usus / Lantai Mukosa (Mucosal Base Wall)
    const baseWallGeom = new THREE.BoxGeometry(10, 0.4, 8);
    const baseWallMat = new THREE.MeshStandardMaterial({
      color: 0x831843,
      roughness: 0.5,
      metalness: 0.1
    });
    const baseWall = new THREE.Mesh(baseWallGeom, baseWallMat);
    baseWall.position.y = -0.2;
    scene.add(baseWall);

    // Kumpulan Objek 3D Vilus
    const villusGroup = new THREE.Group();
    scene.add(villusGroup);

    // Rujukan Meshes
    const partMeshes = {};

    // --- (A) VILUS PEMBANTU DI LATAR BELAKANG (Surrounding Villi for anatomical forest effect) ---
    const bgVillusGeom = new THREE.CylinderGeometry(0.35, 0.5, 3.2, 16);
    const bgVillusMat = new THREE.MeshStandardMaterial({
      color: 0x9d174d,
      transparent: true,
      opacity: 0.35,
      roughness: 0.5
    });
    const neighborPositions = [
      [-2.2, 0, -1.2],
      [-1.8, 0, 1.4],
      [2.2, 0, -1.0],
      [2.0, 0, 1.2],
      [-0.2, 0, -2.4],
      [0.0, 0, 2.5]
    ];
    neighborPositions.forEach(([x, y, z]) => {
      const v = new THREE.Mesh(bgVillusGeom, bgVillusMat);
      v.position.set(x, 1.5, z);
      villusGroup.add(v);
    });

    // --- (B) VILUS UTAMA BERKERATAN RENTAS (Main Hero Cutaway Villus) ---
    const mainVillusHeight = 3.6;
    const villusRadius = 0.9;

    // 1. Sel Epitelium Luar (Outer Epithelial Shell with 180° cutaway)
    // When showCutaway is true, angle is Math.PI (half cutaway) so inside is revealed!
    const epiGeom = new THREE.CylinderGeometry(
      villusRadius * 0.9, 
      villusRadius, 
      mainVillusHeight, 
      32, 
      1, 
      false, 
      0, 
      Math.PI * 1.35 // Partial cutaway showing interior!
    );
    const epiMat = new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.7,
      transmission: 0.4,
      ior: 1.3,
      side: THREE.DoubleSide
    });
    const epiMesh = new THREE.Mesh(epiGeom, epiMat);
    epiMesh.position.set(0, mainVillusHeight / 2, 0);
    epiMesh.userData = { partId: 'epithelium' };
    villusGroup.add(epiMesh);
    partMeshes.epithelium = epiMesh;

    // Kubah Atas Vilus (Hemispherical tip)
    const domeGeom = new THREE.SphereGeometry(
      villusRadius * 0.9, 
      32, 
      16, 
      0, 
      Math.PI * 1.35, 
      0, 
      Math.PI / 2
    );
    const domeMesh = new THREE.Mesh(domeGeom, epiMat);
    domeMesh.position.set(0, mainVillusHeight, 0);
    domeMesh.userData = { partId: 'epithelium' };
    villusGroup.add(domeMesh);

    // Mikrovilus (Brush border halo on outer edge)
    const mvGeom = new THREE.CylinderGeometry(
      villusRadius * 0.96, 
      villusRadius * 1.05, 
      mainVillusHeight * 0.98, 
      24, 
      1, 
      true, 
      0, 
      Math.PI * 1.35
    );
    const mvMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const mvMesh = new THREE.Mesh(mvGeom, mvMat);
    mvMesh.position.set(0, mainVillusHeight / 2, 0);
    mvMesh.userData = { partId: 'microvilli' };
    villusGroup.add(mvMesh);
    partMeshes.microvilli = mvMesh;

    // 2. Lakteal Pusat (Central Lymphatic Lacteal Tube)
    const lactealCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.02, 1.2, -0.02),
      new THREE.Vector3(-0.02, 2.2, 0.02),
      new THREE.Vector3(0, 3.1, 0)
    ]);
    const lactealGeom = new THREE.TubeGeometry(lactealCurve, 32, 0.18, 16, false);
    const lactealMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      roughness: 0.25,
      metalness: 0.1
    });
    const lactealMesh = new THREE.Mesh(lactealGeom, lactealMat);
    lactealMesh.userData = { partId: 'lacteal' };
    villusGroup.add(lactealMesh);
    partMeshes.lacteal = lactealMesh;

    // 3. Jaringan Kapilari Darah (Arterial Red & Venular Blue Capillary Spirals)
    const capillaryGroup = new THREE.Group();
    capillaryGroup.userData = { partId: 'capillaries' };

    // Heliks kapilari merah (Arteriol)
    const arterialCurvePoints = [];
    for (let i = 0; i <= 24; i++) {
      const u = i / 24;
      const angle = u * Math.PI * 5.0;
      const r = 0.52 - u * 0.08;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = u * 3.15;
      arterialCurvePoints.push(new THREE.Vector3(x, y, z));
    }
    const arterialCurve = new THREE.CatmullRomCurve3(arterialCurvePoints);
    const arterialGeom = new THREE.TubeGeometry(arterialCurve, 64, 0.065, 12, false);
    const arterialMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x3f0505,
      roughness: 0.3
    });
    const arterialMesh = new THREE.Mesh(arterialGeom, arterialMat);
    arterialMesh.userData = { partId: 'capillaries' };
    capillaryGroup.add(arterialMesh);

    // Heliks kapilari biru (Venul)
    const venousCurvePoints = [];
    for (let i = 0; i <= 24; i++) {
      const u = i / 24;
      const angle = (u * Math.PI * 5.0) + Math.PI;
      const r = 0.52 - u * 0.08;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = u * 3.15;
      venousCurvePoints.push(new THREE.Vector3(x, y, z));
    }
    const venousCurve = new THREE.CatmullRomCurve3(venousCurvePoints);
    const venousGeom = new THREE.TubeGeometry(venousCurve, 64, 0.065, 12, false);
    const venousMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x051535,
      roughness: 0.3
    });
    const venousMesh = new THREE.Mesh(venousGeom, venousMat);
    venousMesh.userData = { partId: 'capillaries' };
    capillaryGroup.add(venousMesh);

    villusGroup.add(capillaryGroup);
    partMeshes.capillaries = arterialMesh;

    meshesRef.current = partMeshes;

    // --- (C) SIMULASI ZARAH NUTRIEN BERESAP (Nutrient Absorption Particles) ---
    // Zarah Larut Air (Glukosa / Asid Amino) ➔ Meresap ke Kapilari
    const waterPartCount = 45;
    const waterGeom = new THREE.BufferGeometry();
    const waterPositions = new Float32Array(waterPartCount * 3);
    for (let i = 0; i < waterPartCount; i++) {
      waterPositions[i * 3] = (Math.random() - 0.5) * 2.8;
      waterPositions[i * 3 + 1] = 0.5 + Math.random() * 3.0;
      waterPositions[i * 3 + 2] = 0.8 + Math.random() * 1.5;
    }
    waterGeom.setAttribute('position', new THREE.BufferAttribute(waterPositions, 3));
    const waterMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.09,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const waterPoints = new THREE.Points(waterGeom, waterMat);
    scene.add(waterPoints);
    waterParticlesRef.current = waterPoints;

    // Zarah Larut Lemak (Asid Lemak & Gliserol) ➔ Meresap ke Lakteal Pusat
    const lipidPartCount = 35;
    const lipidGeom = new THREE.BufferGeometry();
    const lipidPositions = new Float32Array(lipidPartCount * 3);
    for (let i = 0; i < lipidPartCount; i++) {
      lipidPositions[i * 3] = (Math.random() - 0.5) * 2.8;
      lipidPositions[i * 3 + 1] = 0.5 + Math.random() * 3.0;
      lipidPositions[i * 3 + 2] = 0.8 + Math.random() * 1.5;
    }
    lipidGeom.setAttribute('position', new THREE.BufferAttribute(lipidPositions, 3));
    const lipidMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.11,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const lipidPoints = new THREE.Points(lipidGeom, lipidMat);
    scene.add(lipidPoints);
    lipidParticlesRef.current = lipidPoints;

    // Raycasting Interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(villusGroup.children, true);

      if (intersects.length > 0) {
        for (let hit of intersects) {
          let curr = hit.object;
          while (curr && curr !== villusGroup) {
            if (curr.userData && curr.userData.partId) {
              handleSelectPart(curr.userData.partId);
              return;
            }
            curr = curr.parent;
          }
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);

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

    // Loop
    const renderLoop = (now) => {
      controls.update();

      if (autoRotate) {
        villusGroup.rotation.y += 0.005;
      }

      // Animasi Zarah Nutrien Meresap
      if (isSimulatingAbsorption) {
        // 1. Zarah Larut Air bergerak ke arah kapilari darah
        if (waterPoints && (particleMode === 'water' || particleMode === 'both')) {
          waterPoints.visible = true;
          const pos = waterPoints.geometry.attributes.position.array;
          for (let i = 0; i < waterPartCount; i++) {
            // Bergerak ke arah jejari kapilari (r ~ 0.5, z ~ 0)
            pos[i * 3] += (0.0 - pos[i * 3]) * 0.02;
            pos[i * 3 + 2] += (0.2 - pos[i * 3 + 2]) * 0.02;
            pos[i * 3 + 1] -= 0.012; // Turun ke kapilari

            if (pos[i * 3 + 2] <= 0.3 || pos[i * 3 + 1] <= 0.2) {
              // Reset zarah ke lumen usus luar
              pos[i * 3] = (Math.random() - 0.5) * 2.8;
              pos[i * 3 + 1] = 2.0 + Math.random() * 1.6;
              pos[i * 3 + 2] = 1.2 + Math.random() * 1.0;
            }
          }
          waterPoints.geometry.attributes.position.needsUpdate = true;
        } else if (waterPoints) {
          waterPoints.visible = false;
        }

        // 2. Zarah Larut Lemak bergerak terus ke lakteal tengah (0, 0)
        if (lipidPoints && (particleMode === 'lipid' || particleMode === 'both')) {
          lipidPoints.visible = true;
          const pos = lipidPoints.geometry.attributes.position.array;
          for (let i = 0; i < lipidPartCount; i++) {
            pos[i * 3] += (0.0 - pos[i * 3]) * 0.018;
            pos[i * 3 + 2] += (0.0 - pos[i * 3 + 2]) * 0.018;
            pos[i * 3 + 1] -= 0.015; // Mengalir dalam lakteal

            if (Math.abs(pos[i * 3]) <= 0.08 && Math.abs(pos[i * 3 + 2]) <= 0.08) {
              pos[i * 3] = (Math.random() - 0.5) * 2.6;
              pos[i * 3 + 1] = 2.4 + Math.random() * 1.4;
              pos[i * 3 + 2] = 1.2 + Math.random() * 1.0;
            }
          }
          lipidPoints.geometry.attributes.position.needsUpdate = true;
        } else if (lipidPoints) {
          lipidPoints.visible = false;
        }
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };
    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', onPointerDown);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [particleMode, isSimulatingAbsorption]);

  return (
    <div className="space-y-6">
      
      {/* Header Vilus 3D */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/60 via-slate-900 to-slate-950 border border-violet-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 shadow-lg shadow-violet-500/10">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Model 3D Mikroskopik Vilus & Penyerapan (WebGL)</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                SP 3.4.1 TINGKATAN 2
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Terokai keratan rentas unjuran vilus usus kecil: amati perbezaan laluan penyerapan nutrien ke dalam kapilari darah vs lakteal pusat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => animateCameraTo(1.5, 3.2, 6.4, 0, 1.8, 0)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Compass className="w-4 h-4 text-violet-400" />
            <span>Pandangan Penuh</span>
          </button>
        </div>
      </div>

      {/* Grid Utama: 3D Canvas di Kiri, Panel Maklumat di Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolum Kiri: Viewport 3D Three.js */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          
          <div 
            ref={containerRef}
            className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[500px] sm:h-[540px] w-full'
            }`}
          >
            {/* Status Aktif Komponen */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                <span className="font-semibold text-white">{selectedPart.name}</span>
              </div>
            </div>

            {/* Butang Kawalan Pandangan */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
              <button
                onClick={() => { soundFx.playClick(); setAutoRotate(!autoRotate); }}
                title="Putaran 360°"
                className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs font-semibold flex items-center gap-1 ${
                  autoRotate 
                    ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' 
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
                🖱️ <strong>Klik mana-mana bahagian 3D</strong> untuk menganalisis fungsi penyerapan & struktur sel
              </p>
            </div>
          </div>

          {/* Bar Kawalan Aliran Zarah Nutrien */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { soundFx.playClick(); setIsSimulatingAbsorption(!isSimulatingAbsorption); }}
                className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-md shadow-violet-600/30 flex items-center gap-1.5 text-xs font-bold"
              >
                {isSimulatingAbsorption ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isSimulatingAbsorption ? 'Jeda Resapan' : 'Mula Resapan'}</span>
              </button>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => { soundFx.playClick(); setParticleMode('water'); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    particleMode === 'water' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💧 Glukosa / Asid Amino
                </button>
                <button
                  onClick={() => { soundFx.playClick(); setParticleMode('lipid'); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    particleMode === 'lipid' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🧈 Asid Lemak (Lakteal)
                </button>
                <button
                  onClick={() => { soundFx.playClick(); setParticleMode('both'); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    particleMode === 'both' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Keduanya
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {Object.values(VILLUS_PARTS).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPart(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                    selectedPartId === p.id 
                      ? 'bg-violet-600 text-white border-violet-400' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Kolum Kanan: Kad Maklumat Anatomi Vilus DSKP KSSM */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                  {selectedPart.kssmCode}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {selectedPart.role}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: selectedPart.color }} />
                <span>{selectedPart.name}</span>
              </h3>
            </div>

            {/* Penerangan Anatomi */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-300">Struktur & Penyesuaian Biologi:</span>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                {selectedPart.description}
              </p>
            </div>

            {/* Nutrien Yang Diserap */}
            <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/20 space-y-1.5">
              <div className="text-xs font-bold text-violet-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Nutrien yang Diserap di Sini:</span>
              </div>
              <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-mono">
                {selectedPart.absorbed}
              </div>
            </div>

            {/* Fakta Menarik KSSM */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide block">Fakta Menarik Sains:</span>
                <p className="text-xs text-amber-200/90 leading-relaxed mt-0.5">
                  {selectedPart.funFact}
                </p>
              </div>
            </div>

          </div>

          {/* Kad Ringkasan Perbezaan Kapilari vs Lakteal */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-400" />
              <span>Prinsip Utama Peperiksaan SPM/PT3:</span>
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Semua nutrien <strong>larut air</strong> (glukosa, asid amino, vit B, vit C) masuk ke dalam <strong>kapilari darah</strong> ke hati. Manakala nutrien <strong>larut lemak</strong> (asid lemak, gliserol, vit ADEK) mesti masuk ke dalam <strong>lakteal</strong> dahulu.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
