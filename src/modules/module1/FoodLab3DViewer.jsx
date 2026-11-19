import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  FlaskConical, 
  Flame, 
  Pipette, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  Thermometer, 
  Compass, 
  ZoomIn, 
  Maximize2, 
  Minimize2,
  Info,
  ShieldAlert,
  Play,
  Layers
} from 'lucide-react';
import { FOOD_SAMPLES, LAB_TESTS_DATA } from '../../data/labTestsData';
import { soundFx } from '../../utils/soundEffects';
import { fireConfetti } from '../../utils/confetti';

export default function FoodLab3DViewer() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // States Eksperimen Makmal
  const [selectedTestId, setSelectedTestId] = useState('iodine');
  const [selectedSampleId, setSelectedSampleId] = useState('kanji');
  // Fasa: 'sample_ready' -> 'dropping_reagent' -> 'reagent_added' -> 'heating' -> 'completed'
  const [labPhase, setLabPhase] = useState('sample_ready');
  const [heatingProgress, setHeatingProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  // 3D dynamic objects refs
  const testTubeLiquidRef = useRef(null);
  const precipitateMeshRef = useRef(null);
  const pipetteGroupRef = useRef(null);
  const dropletMeshRef = useRef(null);
  const flameGroupRef = useRef(null);
  const bubbleParticlesRef = useRef(null);
  const waterBathGroupRef = useRef(null);

  const currentTest = useMemo(() => LAB_TESTS_DATA.find(t => t.id === selectedTestId) || LAB_TESTS_DATA[0], [selectedTestId]);
  const currentSample = useMemo(() => FOOD_SAMPLES.find(s => s.id === selectedSampleId) || FOOD_SAMPLES[0], [selectedSampleId]);
  const testResult = useMemo(() => currentSample.results[selectedTestId], [currentSample, selectedTestId]);

  // Tukar Ujian
  const handleSelectTest = (testId) => {
    soundFx.playClick();
    setSelectedTestId(testId);
    resetLabState();
  };

  // Tukar Sampel
  const handleSelectSample = (sampleId) => {
    soundFx.playClick();
    setSelectedSampleId(sampleId);
    resetLabState();
  };

  const resetLabState = () => {
    setLabPhase('sample_ready');
    setHeatingProgress(0);
    if (flameGroupRef.current) flameGroupRef.current.visible = false;
    if (precipitateMeshRef.current) precipitateMeshRef.current.visible = false;
    if (pipetteGroupRef.current) {
      pipetteGroupRef.current.position.set(0, 5.0, 0);
      pipetteGroupRef.current.visible = false;
    }
    if (dropletMeshRef.current) dropletMeshRef.current.visible = false;
  };

  // Kamera anim lerp
  const animateCameraTo = (px, py, pz, tx, ty, tz, dur = 800) => {
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

  // Tindakan: Titiskan Reagen 3D
  const handleDropReagent = () => {
    if (labPhase !== 'sample_ready') return;
    soundFx.playClick();
    setLabPhase('dropping_reagent');

    // Fokus kamera ke mulut tabung uji
    animateCameraTo(0, 3.8, 4.5, 0, 2.5, 0, 600);

    // Animasi Pipet bergerak ke atas tabung uji dan menitis
    if (pipetteGroupRef.current && dropletMeshRef.current) {
      pipetteGroupRef.current.visible = true;
      pipetteGroupRef.current.position.set(1.5, 4.8, 1.0);
      dropletMeshRef.current.visible = false;

      // Fasa 1: Pipet meluncur ke atas tabung uji
      const startT = performance.now();
      const movePipette = (now) => {
        const p = Math.min((now - startT) / 500, 1);
        pipetteGroupRef.current.position.lerpVectors(
          new THREE.Vector3(1.5, 4.8, 1.0),
          new THREE.Vector3(0, 3.8, 0.2),
          p
        );
        if (p < 1) {
          requestAnimationFrame(movePipette);
        } else {
          // Fasa 2: Titisan jatuh ke dalam tabung uji
          soundFx.playDrop();
          dropletMeshRef.current.visible = true;
          dropletMeshRef.current.position.set(0, 3.1, 0.2);

          const dropStart = performance.now();
          const dropLiquid = (dNow) => {
            const dp = Math.min((dNow - dropStart) / 450, 1);
            dropletMeshRef.current.position.y = 3.1 - dp * 1.5;
            if (dp < 1) {
              requestAnimationFrame(dropLiquid);
            } else {
              dropletMeshRef.current.visible = false;
              soundFx.playBubble();
              pipetteGroupRef.current.visible = false;

              // Selepas titisan masuk
              if (!currentTest.requiresHeat) {
                setLabPhase('completed');
                if (testResult.positive) fireConfetti();
              } else {
                setLabPhase('reagent_added');
              }
            }
          };
          requestAnimationFrame(dropLiquid);
        }
      };
      requestAnimationFrame(movePipette);
    }
  };

  // Tindakan: Nyalakan Penunu Bunsen & Panaskan Kukus Air 3D
  const handleStartHeating = () => {
    if (labPhase !== 'reagent_added') return;
    soundFx.playBurner();
    setLabPhase('heating');
    setHeatingProgress(10);

    // Fokus kamera ke penunu bunsen & tabung uji
    animateCameraTo(0, 2.8, 5.2, 0, 2.0, 0, 700);

    if (flameGroupRef.current) flameGroupRef.current.visible = true;

    const interval = setInterval(() => {
      setHeatingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLabPhase('completed');
          if (flameGroupRef.current) flameGroupRef.current.visible = false;
          soundFx.playSuccess();
          if (testResult.positive) fireConfetti();
          return 100;
        }
        return prev + 18;
      });
    }, 450);
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

  // Tentukan warna cecair dan mendakan 3D
  useEffect(() => {
    if (!testTubeLiquidRef.current) return;

    let targetHex = 0xf8fafc;
    let opacity = 0.85;

    if (labPhase === 'sample_ready') {
      targetHex = new THREE.Color(currentSample.color).getHex();
      opacity = 0.75;
      if (precipitateMeshRef.current) precipitateMeshRef.current.visible = false;
    } else if (labPhase === 'dropping_reagent' || labPhase === 'reagent_added') {
      targetHex = new THREE.Color(currentTest.reagentColor).getHex();
      opacity = 0.88;
      // Untuk Ujian Millon, mendakan putih terbentuk serta-merta sebelum pemanasan
      if (currentTest.id === 'millon' && currentSample.id === 'albumin') {
        if (precipitateMeshRef.current) {
          precipitateMeshRef.current.visible = true;
          precipitateMeshRef.current.material.color.setHex(0xffffff);
        }
      }
    } else if (labPhase === 'heating') {
      // Warna beransur-ansur bertukar
      if (currentTest.id === 'benedict' && currentSample.id === 'glukosa') {
        targetHex = 0xeab308; // Warna kuning transisi
      } else {
        targetHex = new THREE.Color(currentTest.reagentColor).getHex();
      }
    } else if (labPhase === 'completed') {
      targetHex = new THREE.Color(testResult.color).getHex();
      opacity = 0.95;

      if (precipitateMeshRef.current) {
        if (testResult.precipitate) {
          precipitateMeshRef.current.visible = true;
          precipitateMeshRef.current.material.color.setHex(new THREE.Color(testResult.color).getHex());
        } else {
          precipitateMeshRef.current.visible = false;
        }
      }
    }

    testTubeLiquidRef.current.material.color.setHex(targetHex);
    testTubeLiquidRef.current.material.opacity = opacity;
  }, [labPhase, currentSample, currentTest, testResult]);

  // Tunjuk/Sembunyi Kukus Air mengikut jenis ujian
  useEffect(() => {
    if (waterBathGroupRef.current) {
      waterBathGroupRef.current.visible = currentTest.requiresHeat;
    }
  }, [currentTest]);

  // Tiga Dimensi WebGL Initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913); // Gelap makmal moden
    scene.fog = new THREE.FogExp2(0x060913, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 6.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 12.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.target.set(0, 1.8, 0);
    controlsRef.current = controls;

    // 5. Pencahayaan Makmal (Laboratory Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const overheadLight = new THREE.DirectionalLight(0xffffff, 1.6);
    overheadLight.position.set(3, 8, 5);
    overheadLight.castShadow = true;
    scene.add(overheadLight);

    const blueBackLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    blueBackLight.position.set(-5, 4, -4);
    scene.add(blueBackLight);

    // Lantai Makmal Bergrid
    const tableGeom = new THREE.BoxGeometry(14, 0.4, 8);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.2
    });
    const tableMesh = new THREE.Mesh(tableGeom, tableMat);
    tableMesh.position.y = -0.2;
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    const gridHelper = new THREE.GridHelper(12, 24, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = 0.01;
    gridHelper.material.opacity = 0.4;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Kumpulan Radas Makmal
    const labGroup = new THREE.Group();
    scene.add(labGroup);

    // --- (A) RAK TABUNG UJI KAYU / AKRILIK (Test Tube Rack) ---
    const rackGroup = new THREE.Group();
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.1 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });

    // Tapak rak
    const rackBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 1.2), woodMat);
    rackBase.position.set(0, 0.08, 0);
    rackGroup.add(rackBase);

    // Plat atas rak berlubang
    const rackTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 1.2), woodMat);
    rackTop.position.set(0, 1.8, 0);
    rackGroup.add(rackTop);

    // Tiang sisi rak
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 12), rackMat);
    postL.position.set(-1.7, 0.9, 0);
    rackGroup.add(postL);

    const postR = postL.clone();
    postR.position.x = 1.7;
    rackGroup.add(postR);

    // Tabung uji pembantu di tepi (Standby tubes for realism)
    const auxTubeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      transmission: 0.9,
      ior: 1.45
    });
    const auxTube1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.2, 24), auxTubeMat);
    auxTube1.position.set(-1.0, 1.2, 0);
    rackGroup.add(auxTube1);

    const auxTube2 = auxTube1.clone();
    auxTube2.position.x = 1.0;
    rackGroup.add(auxTube2);

    labGroup.add(rackGroup);

    // --- (B) TABUNG UJI UTAMA (Active Borosilicate Glass Test Tube) ---
    const activeTubeGroup = new THREE.Group();
    activeTubeGroup.position.set(0, 0.1, 0);

    // Kaca tabung uji silinder
    const tubeHeight = 2.4;
    const tubeRadius = 0.22;
    const glassTubeGeom = new THREE.CylinderGeometry(tubeRadius, tubeRadius, tubeHeight, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.08,
      metalness: 0.05,
      transmission: 0.92,
      ior: 1.5,
      depthWrite: false
    });
    const glassTube = new THREE.Mesh(glassTubeGeom, glassMat);
    glassTube.position.y = 1.35;
    activeTubeGroup.add(glassTube);

    // Dasar sfera tabung uji (Hemispherical bottom)
    const tubeBottomGeom = new THREE.SphereGeometry(tubeRadius, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const tubeBottom = new THREE.Mesh(tubeBottomGeom, glassMat);
    tubeBottom.position.y = 0.15;
    activeTubeGroup.add(tubeBottom);

    // Bibir atas tabung uji (Glass rim)
    const rimGeom = new THREE.TorusGeometry(tubeRadius, 0.025, 12, 32);
    rimGeom.rotateX(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeom, glassMat);
    rim.position.y = 2.55;
    activeTubeGroup.add(rim);

    // Cecair di dalam tabung uji (Dynamic volumetric liquid)
    const liquidHeight = 1.05;
    const liquidRadius = tubeRadius * 0.94;
    const liquidGeom = new THREE.CylinderGeometry(liquidRadius, liquidRadius, liquidHeight, 32);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    const liquidMesh = new THREE.Mesh(liquidGeom, liquidMat);
    liquidMesh.position.y = 0.72;
    activeTubeGroup.add(liquidMesh);
    testTubeLiquidRef.current = liquidMesh;

    // Permukaan meniskus cecair atas
    const meniscusGeom = new THREE.CircleGeometry(liquidRadius, 32);
    meniscusGeom.rotateX(-Math.PI / 2);
    const meniscusMesh = new THREE.Mesh(meniscusGeom, liquidMat);
    meniscusMesh.position.y = 1.25;
    activeTubeGroup.add(meniscusMesh);

    // Lapisan mendakan (Precipitate settling layer at base)
    const precGeom = new THREE.CylinderGeometry(liquidRadius * 0.98, liquidRadius * 0.9, 0.22, 24);
    const precMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      roughness: 0.8,
      metalness: 0.05
    });
    const precMesh = new THREE.Mesh(precGeom, precMat);
    precMesh.position.y = 0.25;
    precMesh.visible = false;
    activeTubeGroup.add(precMesh);
    precipitateMeshRef.current = precMesh;

    labGroup.add(activeTubeGroup);

    // --- (C) KUKUS AIR MANDI & PENUNU BUNSEN 3D (Water Bath & Bunsen Burner) ---
    const waterBathGroup = new THREE.Group();
    waterBathGroup.position.set(0, 0, 0);

    // Tungku Kaki Tiga (Tripod Stand)
    const tripodMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const ringTripod = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.04, 12, 32), tripodMat);
    ringTripod.rotateX(Math.PI / 2);
    ringTripod.position.set(0, 1.45, 0);
    waterBathGroup.add(ringTripod);

    // 3 Kaki tripod
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.45, 12), tripodMat);
      leg.position.set(Math.cos(angle) * 0.85, 0.725, Math.sin(angle) * 0.85);
      leg.rotation.z = Math.cos(angle) * 0.08;
      waterBathGroup.add(leg);
    }

    // Kasa Dawai (Wire Gauze)
    const gauzeGeom = new THREE.CylinderGeometry(0.82, 0.82, 0.02, 24);
    const gauzeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, wireframe: true });
    const gauze = new THREE.Mesh(gauzeGeom, gauzeMat);
    gauze.position.set(0, 1.46, 0);
    waterBathGroup.add(gauze);

    // Bikar Kaca Mandian Air Panas (Beaker Water Bath)
    const beakerGeom = new THREE.CylinderGeometry(0.72, 0.7, 1.2, 32, 1, true);
    const beakerMesh = new THREE.Mesh(beakerGeom, glassMat);
    beakerMesh.position.set(0, 2.06, 0);
    waterBathGroup.add(beakerMesh);

    // Air mandian mendidih dalam bikar
    const bathWaterGeom = new THREE.CylinderGeometry(0.7, 0.68, 0.9, 32);
    const bathWaterMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      transmission: 0.85
    });
    const bathWater = new THREE.Mesh(bathWaterGeom, bathWaterMat);
    bathWater.position.set(0, 1.95, 0);
    waterBathGroup.add(bathWater);

    // Penunu Bunsen (Bunsen Burner)
    const burnerMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const burnerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.12, 24), burnerMat);
    burnerBase.position.set(0, 0.06, 0);
    waterBathGroup.add(burnerBase);

    const burnerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.9, 20), burnerMat);
    burnerPipe.position.set(0, 0.55, 0);
    waterBathGroup.add(burnerPipe);

    // Nyalaan Api Penunu Bunsen 3D (Animated 3D Flame)
    const flameGroup = new THREE.Group();
    flameGroup.position.set(0, 1.05, 0);

    // Nyalaan Biru Dalam (Inner non-luminous blue flame)
    const innerFlameGeom = new THREE.ConeGeometry(0.12, 0.45, 16);
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.85
    });
    const innerFlame = new THREE.Mesh(innerFlameGeom, innerFlameMat);
    innerFlame.position.y = 0.22;
    flameGroup.add(innerFlame);

    // Nyalaan Kuning/Oren Luar (Outer hot luminous mantle)
    const outerFlameGeom = new THREE.ConeGeometry(0.18, 0.65, 16);
    const outerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.65
    });
    const outerFlame = new THREE.Mesh(outerFlameGeom, outerFlameMat);
    outerFlame.position.y = 0.32;
    flameGroup.add(outerFlame);

    // Cahaya Titik Api (PointLight from flame)
    const flameLight = new THREE.PointLight(0xf59e0b, 2.0, 4);
    flameLight.position.y = 0.3;
    flameGroup.add(flameLight);

    flameGroup.visible = false;
    waterBathGroup.add(flameGroup);
    flameGroupRef.current = flameGroup;

    // Awal: Sembunyi kukus air jika ujian iodin/emulsi (tidak perlu haba)
    waterBathGroup.visible = false;
    labGroup.add(waterBathGroup);
    waterBathGroupRef.current = waterBathGroup;

    // --- (D) PIPET KACA PENITIS REAGEN (Glass Pipette Dropper) ---
    const pipetteGroup = new THREE.Group();
    pipetteGroup.position.set(0, 5.0, 0);

    // Batang pipet kaca
    const pipGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.02, 1.4, 16), glassMat);
    pipGlass.position.y = 0.7;
    pipetteGroup.add(pipGlass);

    // Puting getah pipet (Rubber bulb)
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.6 });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), bulbMat);
    bulb.scale.set(1.0, 1.4, 1.0);
    bulb.position.y = 1.45;
    pipetteGroup.add(bulb);

    // Cecair di dalam pipet
    const pipLiquidMat = new THREE.MeshBasicMaterial({ color: 0xd97706 });
    const pipLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.015, 0.8, 16), pipLiquidMat);
    pipLiquid.position.y = 0.5;
    pipetteGroup.add(pipLiquid);

    pipetteGroup.visible = false;
    labGroup.add(pipetteGroup);
    pipetteGroupRef.current = pipetteGroup;

    // Titisan cecair yang jatuh (Falling droplet)
    const dropGeom = new THREE.SphereGeometry(0.06, 16, 16);
    dropGeom.scale(0.8, 1.3, 0.8);
    const dropMesh = new THREE.Mesh(dropGeom, new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
    dropMesh.position.set(0, 3.0, 0);
    dropMesh.visible = false;
    labGroup.add(dropMesh);
    dropletMeshRef.current = dropMesh;

    // --- (E) BIKAR & BOTOL REAGEN SAMPEL DI MEJA ---
    const bottleGroup = new THREE.Group();
    bottleGroup.position.set(2.4, 0.5, 0);

    // Botol Kaca Amber (Iodine/Reagent bottle)
    const botGeom = new THREE.CylinderGeometry(0.4, 0.45, 0.9, 20);
    const botMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.3, metalness: 0.1 });
    const bottle = new THREE.Mesh(botGeom, botMat);
    bottleGroup.add(bottle);

    // Penutup botol
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16), rackMat);
    cap.position.y = 0.55;
    bottleGroup.add(cap);

    labGroup.add(bottleGroup);

    // Zarah buih semasa pemanasan
    const bubbleCount = 20;
    const bubbleGeom = new THREE.BufferGeometry();
    const bPositions = new Float32Array(bubbleCount * 3);
    for (let i = 0; i < bubbleCount; i++) {
      bPositions[i * 3] = (Math.random() - 0.5) * 0.25;
      bPositions[i * 3 + 1] = 0.3 + Math.random() * 0.8;
      bPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
    }
    bubbleGeom.setAttribute('position', new THREE.BufferAttribute(bPositions, 3));
    const bubbleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.7
    });
    const bubblePoints = new THREE.Points(bubbleGeom, bubbleMat);
    bubblePoints.position.set(0, 0, 0);
    bubblePoints.visible = false;
    labGroup.add(bubblePoints);
    bubbleParticlesRef.current = bubblePoints;

    // Resize Listener
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
        labGroup.rotation.y += 0.005;
      }

      // Animasi nyalaan api bergelombang jika sedang memanaskan
      if (flameGroupRef.current && flameGroupRef.current.visible) {
        const flicker = 1.0 + Math.sin(now * 0.02) * 0.12;
        flameGroupRef.current.scale.set(flicker, 1.0 + Math.cos(now * 0.03) * 0.15, flicker);

        // Buih mendidih naik ke atas
        if (bubbleParticlesRef.current) {
          bubbleParticlesRef.current.visible = true;
          const pos = bubbleParticlesRef.current.geometry.attributes.position.array;
          for (let i = 0; i < bubbleCount; i++) {
            pos[i * 3 + 1] += 0.015;
            if (pos[i * 3 + 1] > 1.25) pos[i * 3 + 1] = 0.3;
          }
          bubbleParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
      } else {
        if (bubbleParticlesRef.current) bubbleParticlesRef.current.visible = false;
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
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Banner Tajuk Makmal Maya 3D */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
            <FlaskConical className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Makmal Maya 3D Ujian Makanan (WebGL)</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                SP 3.1.2 TINGKATAN 2
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Kendalikan radas makmal maya 3D: titiskan reagen kimia menggunakan pipet, panaskan dengan kukus air & penunu Bunsen, serta kaji pembentukan mendakan secara realistik.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => animateCameraTo(0, 3.2, 6.2, 0, 1.8, 0)}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Pandangan Penuh</span>
          </button>
        </div>
      </div>

      {/* Grid Utama: Viewport 3D di Kiri, Panel Kawalan Eksperimen di Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolum Kiri: 3D Canvas Viewport */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          
          <div 
            ref={containerRef}
            className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[500px] sm:h-[540px] w-full'
            }`}
          >
            {/* Overlay Status Sampel & Ujian */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-white">{currentTest.name}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">{currentSample.icon} {currentSample.name}</span>
              </div>
            </div>

            {/* Butang Kawalan Pandangan di Atas Kanan */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
              <button
                onClick={() => animateCameraTo(0, 2.2, 3.8, 0, 1.5, 0)}
                title="Zum ke Tabung Uji"
                className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
              >
                <ZoomIn className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Zum Tabung</span>
              </button>

              <button
                onClick={() => { soundFx.playClick(); setAutoRotate(!autoRotate); }}
                title="Putaran 360°"
                className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs font-semibold flex items-center gap-1 ${
                  autoRotate 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
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

            {/* Petunjuk Interaksi Tetikus */}
            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
              <p className="text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-800">
                🖱️ <strong>Heret:</strong> Putar Radas 3D &nbsp;|&nbsp; <strong>Skrol:</strong> Zum Dekat &nbsp;|&nbsp; <strong>Klik Kanan:</strong> Gerak Kamera
              </p>
            </div>
          </div>

          {/* Bar Tindakan Interaktif Makmal (Pipet & Pemanasan) */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {labPhase === 'sample_ready' && (
                <button
                  onClick={handleDropReagent}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
                >
                  <Pipette className="w-4 h-4 animate-bounce" />
                  <span>Titiskan {currentTest.reagent} (Pipet 3D)</span>
                </button>
              )}

              {labPhase === 'reagent_added' && currentTest.requiresHeat && (
                <button
                  onClick={handleStartHeating}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/25 transition-all animate-pulse"
                >
                  <Flame className="w-4 h-4" />
                  <span>Nyalakan Penunu Bunsen & Panaskan</span>
                </button>
              )}

              {labPhase === 'heating' && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Flame className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Sedang memanaskan di kukus air... ({heatingProgress}%)</span>
                </div>
              )}

              {labPhase === 'completed' && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tindak Balas Lengkap! Sila semak pemerhatian.</span>
                </div>
              )}
            </div>

            <button
              onClick={() => { soundFx.playClick(); resetLabState(); }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Cuci & Reset Tabung</span>
            </button>
          </div>

        </div>

        {/* Kolum Kanan: Panel Kawalan Pilihan & Keputusan KSSM */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 1. Pilih Jenis Ujian Makanan */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Langkah 1: Pilih Ujian Makanan
            </span>
            <div className="grid grid-cols-2 gap-2">
              {LAB_TESTS_DATA.map((test) => (
                <button
                  key={test.id}
                  onClick={() => handleSelectTest(test.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                    selectedTestId === test.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold">{test.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{test.target}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Pilih Sampel Makanan */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Langkah 2: Pilih Sampel Makanan
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FOOD_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample.id)}
                  className={`p-2 rounded-xl text-center border text-xs font-semibold transition-all ${
                    selectedSampleId === sample.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="text-lg">{sample.icon}</div>
                  <div className="text-[11px] truncate font-bold">{sample.name.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Keputusan & Inferens DSKP KSSM Sains */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Pemerhatian & Keputusan Makmal</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                labPhase === 'completed'
                  ? testResult.positive 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                {labPhase === 'completed' ? (testResult.positive ? 'POSITIF' : 'NEGATIF') : 'MENUNGGU TINDAKAN'}
              </span>
            </div>

            {/* Warna & Keadaan Mendakan */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-semibold block">Warna Larutan Akhir:</span>
              <div className="flex items-center gap-2">
                <span 
                  className="w-4 h-4 rounded-full border border-white/20 inline-block shadow"
                  style={{ backgroundColor: labPhase === 'completed' ? testResult.color : currentSample.color }}
                />
                <span className="text-xs font-bold text-white font-mono">
                  {labPhase === 'completed' ? testResult.name : 'Sebelum Tindak Balas'}
                </span>
              </div>
            </div>

            {/* Inferens Saintifik */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-300">Inferens DSKP KSSM:</span>
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                {labPhase === 'completed' 
                  ? (testResult.positive ? currentTest.positiveResult : currentTest.negativeResult)
                  : 'Sila lengkapkan titisan reagen dan pemanasan untuk melihat kesimpulan tindak balas biokimia.'}
              </p>
            </div>

            {/* Langkah Berjaga-jaga (Science Safety) */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-300 leading-relaxed">
                <strong>Langkah Keselamatan Makmal:</strong> {currentTest.precaution}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
