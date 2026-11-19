import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw, 
  ArrowRight,
  Info,
  X,
  Eye,
  Key
} from 'lucide-react';
import { SCANNABLE_FOODS } from '../../data/scannableFoods';
import { 
  analyzeFoodWithGoogleVision, 
  getStoredGoogleVisionApiKey, 
  saveStoredGoogleVisionApiKey,
  hasGoogleVisionApiKey 
} from '../../services/googleVisionScannerService';
import { compressImage } from '../../utils/imageCompressor';
import { soundFx } from '../../utils/soundEffects';
import { fireConfetti } from '../../utils/confetti';

export default function FoodScannerModal({ isOpen, onClose, userProfile }) {
  const [selectedFood, setSelectedFood] = useState(SCANNABLE_FOODS[0]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisSource, setAnalysisSource] = useState('preset'); // 'google_vision' | 'preset' | 'fallback'
  const [errorMessage, setErrorMessage] = useState('');
  
  // Tetapan Kunci API Google Cloud Vision
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeySavedStatus, setApiKeySavedStatus] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const storedKey = getStoredGoogleVisionApiKey();
      setApiKeyInput(storedKey);
      setHasApiKey(Boolean(storedKey));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tdeeKcal = userProfile?.tdeeKcal || 2000;

  // Imbas menggunakan Google Cloud Vision AI atau Galeri Pratetap KSSM
  const runScan = async (foodPreset, customImgData) => {
    soundFx.playBurner();
    setIsScanning(true);
    setScanProgress(25);
    setAnalysisResult(null);
    setErrorMessage('');

    // Jika ada gambar dimuat naik -> Gunakan Google Cloud Vision AI secara langsung!
    if (customImgData) {
      try {
        setScanProgress(45);
        const visionResult = await analyzeFoodWithGoogleVision(customImgData, userProfile, apiKeyInput);
        setScanProgress(90);

        setTimeout(() => {
          setIsScanning(false);
          soundFx.playSuccess();
          fireConfetti();

          const caloriesKcal = visionResult.caloriesKcal || 400;
          const pctOfDaily = Math.round((caloriesKcal / tdeeKcal) * 100);
          setAnalysisResult({
            ...visionResult,
            customImg: customImgData,
            pctOfDaily,
            caloriesRemaining: Math.max(tdeeKcal - caloriesKcal, 0)
          });
          setAnalysisSource('google_vision');
        }, 500);

      } catch (err) {
        console.warn('Google Cloud Vision AI Error, falling back to KSSM preset:', err);
        setErrorMessage(`Google Cloud Vision: ${err.message || 'Gagal memproses'}. Menggunakan data makmal KSSM.`);
        if (!hasApiKey) {
          setShowApiKeyModal(true);
        }
        // Sandaran (Fallback) kepada data tempatan
        fallbackToPreset(foodPreset || SCANNABLE_FOODS[0], customImgData);
      }
    } else {
      // Mod Pratetap Galeri KSSM
      fallbackToPreset(foodPreset || SCANNABLE_FOODS[0], customImgData);
    }
  };

  const fallbackToPreset = (foodPreset, customImgData) => {
    const food = foodPreset || SCANNABLE_FOODS[0];
    let progress = 30;
    const interval = setInterval(() => {
      progress += 25;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        soundFx.playSuccess();
        fireConfetti();

        const caloriesKcal = food.caloriesKcal || 400;
        const pctOfDaily = Math.round((caloriesKcal / tdeeKcal) * 100);
        setAnalysisResult({
          ...food,
          customImg: customImgData,
          pctOfDaily,
          caloriesRemaining: Math.max(tdeeKcal - caloriesKcal, 0)
        });
        setAnalysisSource(customImgData ? 'fallback' : 'preset');
      }
    }, 200);
  };

  // Muat naik fail gambar sendiri (dimampatkan untuk kelajuan & kestabilan)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      soundFx.playDrop();
      setIsScanning(true);
      setScanProgress(15);
      
      const compressedImg = await compressImage(file, 800);
      if (compressedImg) {
        setUploadedImage(compressedImg);
        const randomFood = SCANNABLE_FOODS[Math.floor(Math.random() * SCANNABLE_FOODS.length)];
        setSelectedFood(randomFood);
        runScan(randomFood, compressedImg);
      } else {
        setIsScanning(false);
      }
    }
  };

  // Pilih makanan daripada galeri pratetap
  const handleSelectPreset = (food) => {
    soundFx.playClick();
    setSelectedFood(food);
    setUploadedImage(null);
    runScan(food, null);
  };

  // Simpan API Key Google Cloud Vision
  const handleSaveApiKey = () => {
    soundFx.playSuccess();
    saveStoredGoogleVisionApiKey(apiKeyInput);
    setHasApiKey(Boolean(apiKeyInput.trim()));
    setApiKeySavedStatus(true);
    setTimeout(() => {
      setApiKeySavedStatus(false);
      setShowApiKeyModal(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/30 max-w-4xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-fadeIn relative">
        
        {/* Butang Tutup */}
        <button
          onClick={() => { soundFx.playClick(); onClose(); }}
          className="absolute right-5 top-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal & Status Enjin AI Google Cloud Vision */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Camera className="w-3.5 h-3.5" />
              <span>Pengimbas Nutrisi Makanan Maya (Google Cloud Vision AI)</span>
            </div>

            {/* Petunjuk Status & Konfigurasi Google Cloud Vision AI */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${
                hasApiKey 
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                <Eye className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>Google Cloud Vision {hasApiKey ? 'Aktif' : 'Perlu Kunci'}</span>
              </span>

              <button
                onClick={() => setShowApiKeyModal(!showApiKeyModal)}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Konfigurasi Kunci Google Cloud Vision API"
              >
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>{hasApiKey ? '🔑 Kunci Disimpan' : '🔑 Tetapkan API Key'}</span>
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Imbas Gambar Makanan & Analisis Kalori
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Ambil gambar atau pilih hidangan kantin sekolah. Integrasi Google Cloud Vision AI mengecam hidangan secara pintar melalui teknologi penglihatan komputer Google Cloud dan menghitung nilai kalori (kcal & kJ) berpandukan formula Sains KSSM Tingkatan 2.
          </p>
        </div>

        {/* Panel Konfigurasi Kunci API Google Cloud Vision */}
        {showApiKeyModal && (
          <div className="p-4 rounded-2xl bg-slate-950/95 border border-blue-500/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                <Key className="w-4 h-4" />
                <span>Konfigurasi Google Cloud Vision API Key</span>
              </div>
              <span className="text-[10px] text-slate-400">Google Cloud Console • Cloud Vision API v1</span>
            </div>
            
            <p className="text-xs text-slate-300">
              Masukkan kunci API projek Google Cloud anda yang telah mengaktifkan <strong>Cloud Vision API</strong>. Kunci ini disimpan secara selamat dalam peranti anda (LocalStorage) untuk pengecaman imej masa nyata.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Masukkan API Key (contoh: AIzaSyB...)"
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30"
              >
                {apiKeySavedStatus ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Disimpan!</span>
                  </>
                ) : (
                  <span>Simpan Kunci</span>
                )}
              </button>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Dapatkan kunci percuma di <strong>console.cloud.google.com</strong> &gt; <em>Enabled APIs & Services</em> &gt; <em>Cloud Vision API</em>.</span>
            </div>
          </div>
        )}

        {/* Mesej Ralat jika ada */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Bahagian Atas: Zon Kamera / Muat Naik & Pilihan Galeri */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Zon Gambar & Animasi Pengimbas Laser (5 Kolum) */}
          <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
            
            {/* Gambar Makanan atau Placeholder */}
            {uploadedImage ? (
              <img 
                src={uploadedImage} 
                alt="Gambar Makanan Diimbas" 
                className="w-full h-56 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-56 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-center p-4">
                <span className="text-6xl mb-2">{selectedFood?.emoji || '🍽️'}</span>
                <span className="text-sm font-bold text-white">{selectedFood?.name || 'Pilih Makanan'}</span>
                <span className="text-xs text-slate-400">{selectedFood?.servingSize}</span>
              </div>
            )}

            {/* Garisan Laser Animasi Semasa Mengimbas */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-500 shadow-lg shadow-cyan-400/80 animate-bounce" />
            )}

            {/* Tindakan Muat Naik */}
            <div className="w-full mt-3 flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Muat Naik Foto</span>
              </button>
              <button
                onClick={() => runScan(selectedFood, uploadedImage)}
                disabled={isScanning}
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isScanning ? 'Mengimbas...' : 'Imbas Semula'}</span>
              </button>
            </div>

          </div>

          {/* Galeri Pantas Makanan Kantin Sekolah (7 Kolum) */}
          <div className="md:col-span-7 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Pilihan Pantas Makanan Kantin Sekolah:</span>
              <span className="text-[11px] text-emerald-400 font-mono">Pilih untuk uji segera</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
              {SCANNABLE_FOODS.map((food) => (
                <button
                  key={food.id}
                  onClick={() => handleSelectPreset(food)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedFood?.id === food.id && !uploadedImage
                      ? 'bg-blue-500/20 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xl mb-1">{food.emoji}</div>
                  <div className="font-bold text-xs truncate text-slate-200">{food.name}</div>
                  <div className="text-[11px] text-amber-400 font-mono">{food.caloriesKcal} kcal</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Status Sedang Mengimbas dengan Google Cloud Vision AI */}
        {isScanning && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/40 text-center space-y-2 animate-pulse">
            <p className="text-xs font-bold text-blue-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>
                {uploadedImage 
                  ? 'Google Cloud Vision AI sedang memproses imej dan mengecam komposisi makanan...' 
                  : 'Menganalisis spektrum nutrisi makanan KSSM...'} ({scanProgress}%)
              </span>
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden max-w-md mx-auto">
              <div 
                className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Keputusan Analisis Kalori & Nutrisi (Apabila Selesai) */}
        {analysisResult && !isScanning && (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/20 border border-blue-500/40 space-y-5 shadow-xl animate-fadeIn">
            
            {/* Baris Utama: Nama, Kalori & Lampu Isyarat */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{analysisResult.emoji || '🍽️'}</span>
                  <h3 className="text-xl font-extrabold text-white">{analysisResult.name || 'Hidangan Makanan'}</h3>
                  {analysisSource === 'google_vision' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1 shadow-sm">
                      <Eye className="w-3 h-3 text-cyan-400" />
                      Google Cloud Vision AI
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">Saiz hidangan: {analysisResult.servingSize || '1 hidangan sederhana'}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Jumlah Kalori</span>
                  <div className="text-xl font-black text-amber-400 flex items-center gap-1">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>{analysisResult.caloriesKcal ?? 0}</span>
                    <span className="text-xs font-normal text-slate-400">kcal</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">{analysisResult.caloriesKj ?? 0} kJ</span>
                </div>

                <div className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                  analysisResult.trafficLight === 'hijau' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                  analysisResult.trafficLight === 'kuning' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                  'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {analysisResult.trafficLightLabel || 'Pilihan Seimbang'}
                </div>
              </div>
            </div>

            {/* Label-label dikesan oleh Google Cloud Vision */}
            {analysisResult.visionLabels && analysisResult.visionLabels.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/20 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Label Pengecaman Imej Google Cloud Vision:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.visionLabels.map((lbl, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-0.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200 font-mono"
                    >
                      🏷️ {lbl}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Perbandingan dengan Keperluan Kalori Murid */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Kadar Terhadap Keperluan Kalori Harian Anda ({tdeeKcal} kcal/hari):
                </span>
                <span className="font-bold text-emerald-400">{analysisResult.pctOfDaily ?? 0}% daripada TDEE</span>
              </div>

              {/* Progress Bar Kalori */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${
                    (analysisResult.pctOfDaily || 0) > 35 ? 'bg-rose-500' :
                    (analysisResult.pctOfDaily || 0) > 20 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(analysisResult.pctOfDaily || 0, 100)}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Selepas hidangan ini, baki kalori harian yang tinggal untuk hari ini adalah kira-kira{' '}
                <strong className="text-white">{Math.max(analysisResult.caloriesRemaining ?? 0, 0)} kcal</strong>.
              </p>
            </div>

            {/* Pecahan Makronutrien KSSM Tingkatan 2 (Karbohidrat, Protein, Lemak) */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Pecahan 3 Makronutrien Utama (DSKP Sains Bab 3.1):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/20">
                  <span className="text-[11px] text-amber-400 font-bold block">Karbohidrat</span>
                  <div className="text-lg font-extrabold text-white">{analysisResult.macros?.carbs ?? 0}g</div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ≈ {Math.round((analysisResult.macros?.carbs ?? 0) * 16.7)} kJ (16.7 kJ/g)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20">
                  <span className="text-[11px] text-emerald-400 font-bold block">Protein</span>
                  <div className="text-lg font-extrabold text-white">{analysisResult.macros?.protein ?? 0}g</div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ≈ {Math.round((analysisResult.macros?.protein ?? 0) * 16.7)} kJ (16.7 kJ/g)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/20">
                  <span className="text-[11px] text-rose-400 font-bold block">Lemak (Paling Padat)</span>
                  <div className="text-lg font-extrabold text-white">{analysisResult.macros?.fat ?? 0}g</div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ≈ {Math.round((analysisResult.macros?.fat ?? 0) * 37.6)} kJ (37.6 kJ/g)
                  </span>
                </div>
              </div>
            </div>

            {/* Cadangan Aktiviti Fizikal untuk Bakar Kalori */}
            {Array.isArray(analysisResult.burnActivities) && analysisResult.burnActivities.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Masa Aktiviti Fizikal PJ / Sukan Yang Diperlukan Untuk Membakar Hidangan Ini:
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {analysisResult.burnActivities.map((act, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                      <span>{act?.icon || '🏃'}</span>
                      <span>{act?.name || 'Aktiviti'}: <strong>{act?.durationMin || 30} Minit</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tip Kesihatan KKM */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Panduan Kesihatan Murid:</strong> {analysisResult.healthTip || 'Amalkan pemakanan seimbang mengikut Pinggan Sihat Malaysia.'}</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
