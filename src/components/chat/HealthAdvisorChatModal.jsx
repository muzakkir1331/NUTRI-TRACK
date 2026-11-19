import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RotateCcw, 
  Key, 
  Scale, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { sendHealthAdvisorMessage, getPuterAuthStatus, signInPuter } from '../../services/geminiChatService';
import { getStoredGeminiApiKey, saveStoredGeminiApiKey } from '../../services/geminiScannerService';
import { soundFx } from '../../utils/soundEffects';

const QUICK_SUGGESTIONS = [
  { label: '🍽️ Pecahan Kalori Harian', text: 'Bolehkah anda cadangkan pecahan kalori harian untuk sarapan, makan tengah hari, dan makan malam saya?' },
  { label: '🏃 Senaman Sesuai BMI', text: 'Apakah jenis senaman dan aktiviti sukan yang paling sesuai untuk skor BMI dan tahap kecergasan saya?' },
  { label: '🍎 Pilihan Snek Kantin', text: 'Bagaimanakah cara memilih snek sihat di kantin atau koperasi sekolah menggunakan Sistem Lampu Isyarat?' },
  { label: '💧 Hidrasi & Cegah Sembelit', text: 'Berapakah jumlah air dan serat yang perlu saya ambil sehari untuk mengelakkan sembelit mengikut SP 3.4.3?' },
  { label: '🥗 Contoh Pinggan Sihat', text: 'Bagaimanakah saya boleh amalkan konsep Pinggan Sihat Malaysia (Suku-Suku Separuh) waktu makan tengah hari?' }
];

export default function HealthAdvisorChatModal({ isOpen, onClose, userProfile, onOpenProfile }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySavedStatus, setApiKeySavedStatus] = useState(false);
  const [isPuterSignedIn, setIsPuterSignedIn] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const studentName = userProfile?.name || 'Murid';
  const bmi = userProfile?.bmi || 20.0;
  const bmiCategory = userProfile?.bmiCategory || 'Berat Unggul (Normal)';
  const tdeeKcal = userProfile?.tdeeKcal || 1850;

  // Pasang mesej alu-aluan awal jika belum ada sejarah
  useEffect(() => {
    if (isOpen) {
      const currentKey = getStoredGeminiApiKey();
      setApiKeyInput(currentKey);
      getPuterAuthStatus().then(setIsPuterSignedIn).catch(() => {});

      if (messages.length === 0) {
        const welcomeText = `Hai **${studentName}**! Saya **NutriBot**, Penasihat Kesihatan & Nutrisi AI anda berpandukan sukatan Sains KSSM Tingkatan 2.

📊 **Ringkasan Kesihatan Anda:**
- **Indeks Jisim Badan (BMI):** **${bmi}** (${bmiCategory})
- **Keperluan Kalori Harian (TDEE):** **${tdeeKcal} kcal / hari** (${Math.round(tdeeKcal * 4.184)} kJ)
- **Rutin Aktiviti:** ${userProfile?.activityLabel || 'Ringan'}

Saya sedia membantu merancang diet seimbang anda, memberi cadangan senaman mengikut BMI, atau membimbing anda memilih makanan sihat di kantin sekolah. Ada sebarang soalan hari ini?`;

        setMessages([
          {
            id: 'welcome',
            sender: 'bot',
            text: welcomeText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }
  }, [isOpen, userProfile]);

  // Skrol automatik ke mesej terbaru
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isLoading) return;

    soundFx.playClick();

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const replyText = await sendHealthAdvisorMessage(updatedMessages, userProfile);
      
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
      soundFx.playSuccess();
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: 'Maaf, berlaku sedikit gangguan teknikal. Sila cuba hantar semula soalan anda.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSaveApiKey = () => {
    soundFx.playSuccess();
    saveStoredGeminiApiKey(apiKeyInput);
    setApiKeySavedStatus(true);
    setTimeout(() => {
      setApiKeySavedStatus(false);
      setShowApiKeyInput(false);
    }, 1500);
  };

  const handleResetChat = () => {
    soundFx.playClick();
    setMessages([]);
  };

  // Format teks Markdown mudah (bold, bullet points, headers)
  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Baris kosong
      if (!line.trim()) return <div key={idx} className="h-2" />;

      // Sub-tajuk atau emoji point
      const isBullet = line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim());

      // Parse **bold text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const content = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="text-emerald-300 font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <div key={idx} className={`${isBullet ? 'pl-2 text-slate-200 py-0.5' : 'text-slate-200 py-0.5'}`}>
          {content}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-500/30 max-w-2xl w-full h-[90vh] max-h-[780px] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header Chatbot */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                  NutriBot AI
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Penasihat Kesihatan
                </span>
              </div>
              
              {/* Badge BMI & Kalori Murid */}
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                  <Scale className="w-3 h-3" /> BMI: {bmi} ({bmiCategory.split(' ')[0]})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-mono font-semibold">
                  <Flame className="w-3 h-3" /> {tdeeKcal} kcal
                </span>
              </div>
            </div>
          </div>

          {/* Butang Tindakan Header */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
              title="Konfigurasi Kunci Gemini API"
            >
              <Key className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
              title="Kosongkan Perbualan"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => { soundFx.playClick(); onClose(); }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-all text-xs"
              title="Tutup Chatbot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Panel Tetapan Kunci API Gemini (Boleh Dibuka/Tutup) */}
        {showApiKeyInput && (
          <div className="bg-slate-950/95 border-b border-emerald-500/30 p-4 space-y-3 flex-shrink-0 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Tetapan Google Gemini API Key
              </span>
              <span className="text-[11px] text-slate-400">Gemini 1.5 Flash</span>
            </div>
            
            <p className="text-[11px] text-slate-400">
              Kunci API disimpan secara selamat di pelayar anda untuk menjana nasihat pemakanan masa nyata.
            </p>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>☁️ Puter.js Cloud AI</span>
                  {isPuterSignedIn ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Disambung
                    </span>
                  ) : (
                    <span className="text-[10px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30">
                      Aktif (Percuma)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Puter.js membolehkan NutriBot AI beroperasi secara percuma tanpa memerlukan kunci API peribadi.
                </p>
              </div>
              
              {!isPuterSignedIn && (
                <button
                  onClick={async () => {
                    try {
                      soundFx.playClick();
                      await signInPuter();
                      setIsPuterSignedIn(true);
                      soundFx.playSuccess();
                    } catch (err) {
                      console.warn(err);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all flex-shrink-0"
                >
                  Log Masuk Puter
                </button>
              )}
            </div>

            <div className="pt-1">
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                Atau gunakan Kunci Gemini API Sendiri:
              </span>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1"
                >
                  {apiKeySavedStatus ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                  <span>{apiKeySavedStatus ? 'Disimpan!' : 'Simpan'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kawasan Suapan Mesej (Chat Feed) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5 text-emerald-400">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {isUser ? (
                    <div>{msg.text}</div>
                  ) : (
                    <div>{renderFormattedText(msg.text)}</div>
                  )}

                  <div className={`text-[10px] mt-2 font-mono ${isUser ? 'text-emerald-200/80 text-right' : 'text-slate-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Penunjuk Sedang Berfikir (Typing Indicator) */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 text-emerald-400">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 rounded-bl-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs text-slate-400 font-medium">
                  NutriBot sedang menganalisis keperluan diet & senaman anda...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Pil Pilihan Soalan Pantas (Quick Suggestions) */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Cadangan:
          </span>
          {QUICK_SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.text)}
              disabled={isLoading}
              className="px-3 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/60 hover:border-emerald-500/40 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-all flex-shrink-0 disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Ruang Input Mesej */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90 flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder={`Tanya NutriBot tentang diet, kalori atau senaman (${studentName})...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all disabled:opacity-50"
            />
            
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:hover:from-emerald-500 disabled:hover:to-teal-500 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 flex-shrink-0"
              title="Hantar Mesej"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
          
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
            <span>Berdasarkan DSKP Sains KSSM Tingkatan 2 & Garis Panduan KKM</span>
            <button 
              onClick={() => { soundFx.playClick(); onOpenProfile(); }}
              className="text-emerald-400 hover:underline"
            >
              Kemaskini Data BMI & Kalori
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
