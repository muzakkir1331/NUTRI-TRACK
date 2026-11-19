import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LandingHub from './modules/hub/LandingHub';
import Module1 from './modules/module1/Module1';
import Module2 from './modules/module2/Module2';
import Module3 from './modules/module3/Module3';
import Module4 from './modules/module4/Module4';
import Module5 from './modules/module5/Module5';
import Module6 from './modules/module6/Module6';
import OnboardingProfileModal from './components/profile/OnboardingProfileModal';
import FoodScannerModal from './components/scanner/FoodScannerModal';
import HealthAdvisorChatModal from './components/chat/HealthAdvisorChatModal';
import FloatingChatButton from './components/chat/FloatingChatButton';
import ErrorBoundary from './components/common/ErrorBoundary';
import { fireConfetti } from './utils/confetti';

export default function App() {
  // 'hub' atau nombor modul (1..6)
  const [currentView, setCurrentView] = useState('hub');
  
  // Skor bintang murid yang disimpan dalam LocalStorage
  const [totalStars, setTotalStars] = useState(() => {
    const saved = localStorage.getItem('nutri_track_total_stars');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Senarai ID modul yang telah disiapkan
  const [completedModules, setCompletedModules] = useState(() => {
    try {
      const saved = localStorage.getItem('nutri_track_completed_modules');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Profil Kesihatan Asas Murid (Berat, Tinggi, Rutin, Usia)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('nutri_track_health_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  // Jika murid kali pertama masuk dan tiada profil, buka modal soal selidik kesihatan
  useEffect(() => {
    if (!userProfile) {
      setIsProfileModalOpen(true);
    }
  }, [userProfile]);

  // Simpan data profil murid
  const handleSaveProfile = (profileData) => {
    setUserProfile(profileData);
    localStorage.setItem('nutri_track_health_profile', JSON.stringify(profileData));
  };

  // Fungsi anugerah bintang dan tandakan modul selesai
  const handleAwardStars = (starsToAdd, moduleId = 1) => {
    const newTotal = totalStars + starsToAdd;
    setTotalStars(newTotal);
    localStorage.setItem('nutri_track_total_stars', newTotal.toString());

    if (!completedModules.includes(moduleId)) {
      const updated = [...completedModules, moduleId];
      setCompletedModules(updated);
      localStorage.setItem('nutri_track_completed_modules', JSON.stringify(updated));
    }
    fireConfetti();
  };

  const handleNavigateHome = () => {
    setCurrentView('hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectModule = (modId) => {
    setCurrentView(modId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
        <div>
          {/* Header Sekolah & Pengurusan Profil */}
          <Header 
            currentView={currentView}
            onNavigateHome={handleNavigateHome}
            totalStars={totalStars}
            userProfile={userProfile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenScanner={() => setIsScannerModalOpen(true)}
            onOpenChatBot={() => setIsChatBotOpen(true)}
          />

        {/* Kandungan Halaman Utama */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {currentView === 'hub' && (
            <LandingHub 
              onSelectModule={handleSelectModule}
              completedModules={completedModules}
              userProfile={userProfile}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onOpenScanner={() => setIsScannerModalOpen(true)}
              onOpenChatBot={() => setIsChatBotOpen(true)}
            />
          )}

          {currentView === 1 && (
            <Module1 
              onNavigateHome={handleNavigateHome}
              onAwardStars={(stars) => handleAwardStars(stars, 1)}
            />
          )}

          {currentView === 2 && (
            <Module2 
              onNavigateHome={handleNavigateHome}
              onAwardStars={(stars) => handleAwardStars(stars, 2)}
              userProfile={userProfile}
            />
          )}

          {currentView === 3 && (
            <Module3 
              onNavigateHome={handleNavigateHome}
              onAwardStars={(stars) => handleAwardStars(stars, 3)}
            />
          )}

          {currentView === 4 && (
            <Module4 
              onNavigateHome={handleNavigateHome}
              onAwardStars={(stars) => handleAwardStars(stars, 4)}
              userProfile={userProfile}
            />
          )}

          {currentView === 5 && (
            <Module5 
              onNavigateHome={handleNavigateHome}
              onAwardStars={(stars) => handleAwardStars(stars, 5)}
            />
          )}

          {currentView === 6 && (
            <Module6 
              onNavigateHome={handleNavigateHome}
              onAwardStars={(stars) => handleAwardStars(stars, 6)}
            />
          )}
        </main>
      </div>

      {/* Footer DSKP KSSM Sains */}
      <Footer />

      {/* Modal Soalan Asas Profil Kesihatan (Berat, Tinggi, Rutin, Usia) */}
      <OnboardingProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={handleSaveProfile}
        initialProfile={userProfile}
      />

      {/* Modal Pengimbas Gambar Makanan & Analisis Kalori */}
      <FoodScannerModal 
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        userProfile={userProfile}
      />

      {/* Modal AI Chatbot Penasihat Kesihatan & Diet */}
      <HealthAdvisorChatModal 
        isOpen={isChatBotOpen}
        onClose={() => setIsChatBotOpen(false)}
        userProfile={userProfile}
        onOpenProfile={() => {
          setIsChatBotOpen(false);
          setIsProfileModalOpen(true);
        }}
      />

      {/* Butang Mengambang Penasihat AI (Boleh diakses bila-bila masa) */}
      <FloatingChatButton 
        onClick={() => setIsChatBotOpen(true)}
        userProfile={userProfile}
      />
    </div>
  </ErrorBoundary>
);
}
