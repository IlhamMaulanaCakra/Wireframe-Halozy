import React, { useState, useRef, useEffect } from "react";
import { Message } from "../types";
import { WireframeIcon } from "./WireframeIcon";
import { motion, AnimatePresence } from "motion/react";
import { classifyTextIntent } from "../utils/svmClassifier";
import Markdown from "react-markdown";
import { useSettings } from "../utils/SettingsContext";
import { filterProfanity } from "../utils/profanityFilter";

interface ChatroomProps {
  onBackToDashboard?: () => void;
  onNavigateToHotlines?: () => void;
}

// Comprehensive database of dynamic, empathetic starters based on the user's emotional situation
const DYNAMIC_SUGGESTIONS: Record<string, { text: string; icon: string }[]> = {
  general: [
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" }
  ],
  anxiety: [
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" }
  ],
  burnout: [
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" }
  ],
  sadness: [
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" }
  ],
  crisis: [
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" }
  ],
  relationship: [
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" }
  ],
  academic: [
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" }
  ],
  family: [
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" }
  ],
  anger: [
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" }
  ],
  grief: [
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" }
  ],
  selfesteem: [
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" }
  ],
  positive: [
    { text: "Teks placeholder opsi 1", icon: "📄" },
    { text: "Teks placeholder opsi 1", icon: "📄" }
  ]
};

// Comprehensive offline response database to provide fast, dynamic, and diverse replies
// based on the local SVM classification category without overloading or waiting for Gemini
const OFFLINE_RESPONSES: Record<string, string[]> = {
  anxiety: [
    "Teks balasan placeholder offline 1.",
    "Teks balasan placeholder offline 1."
  ],
  burnout: [
    "Teks balasan placeholder offline 1.",
    "Teks balasan placeholder offline 1."
  ],
  sadness: [
    "Teks balasan placeholder offline 1.",
    "Teks balasan placeholder offline 1."
  ],
  crisis: [
    "Teks balasan placeholder offline 1.",
    "Teks balasan placeholder offline 1."
  ],
  relationship: [
    "Teks balasan placeholder offline 1.",
    "Teks balasan placeholder offline 1."
  ],
  academic: [
    "Teks balasan placeholder offline 1.",
    "Teks balasan placeholder offline 1."
  ],
  family: [
    "Teks balasan placeholder offline 1.",
    "Teks balasan placeholder offline 1."
  ],
  anger: [
    "Teks balasan placeholder offline 1.",
    "Teks balasan placeholder offline 1."
  ],
  grief: [
    "Teks balasan placeholder offline 1.",
    "Teks balasan placeholder offline 1."
  ],
  selfesteem: [
    "Teks balasan placeholder offline 1.",
    "Teks balasan placeholder offline 1."
  ],
  positive: [
    "Teks balasan placeholder offline 1.",
    "Teks balasan placeholder offline 1."
  ],
  general: [
    "Teks balasan placeholder offline 1.",
    "Teks balasan placeholder offline 1."
  ]
};

export default function Chatroom({ onBackToDashboard, onNavigateToHotlines }: ChatroomProps) {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = sessionStorage.getItem("ozy_chat_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("sessionStorage read error", e);
    }
    return [
      {
        id: "welcome",
        role: "model",
        text: "Halo! Aku Ozy, teman curhat setiamu. Di sini adalah tempat aman untuk meluapkan penat, cemas, khawatir, atau hal bahagia apa pun yang kamu alami hari ini.\n\nYakinlah bahwa ceritamu didengar, dihargai, dan tidak akan dihakimi. Bagaimana kondisimu hari ini?",
        timestamp: Date.now(),
      },
    ];
  });
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [crisisActive, setCrisisActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Play sound effect when model replies
  useEffect(() => {
    if (settings.soundEffects && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "model") {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
          oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
          
          gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
          
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          oscillator.start(audioCtx.currentTime);
          oscillator.stop(audioCtx.currentTime + 0.15);
        } catch (e) {
          console.warn("Audio play error", e);
        }
      }
    }
  }, [messages, settings.soundEffects]);

  useEffect(() => {
    sessionStorage.setItem("ozy_chat_history", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Derive the active SVM category emotional state dynamic from chat history
  const lastClassificationResult = [...messages]
    .reverse()
    .find((msg) => msg.svmResult !== undefined)?.svmResult;

  const currentCategory = lastClassificationResult?.category || "general";

  // Build current dynamic history-aware suggested prompts
  const getDynamicStarters = () => {
    // 1. Find all history category trends in this active session
    const detectedCategories = messages
      .map((msg) => msg.svmResult?.category)
      .filter((cat) => !!cat) as string[];

    const uniqueVisitedCategories = Array.from(new Set(detectedCategories)) as string[];

    // 2. Identify the most recent category
    const lastResult = [...messages]
      .reverse()
      .find((msg) => msg.svmResult !== undefined)?.svmResult;
    const currentCategory = lastResult?.category || "general";

    // 3. Collect used messages in the chatroom so we don't suggest them again
    const sentMessageTexts = messages.map((m) => m.text.trim().toLowerCase());

    // 4. Gather candidate suggestions
    let candidates: { text: string; icon: string; category?: string }[] = [];

    // Focus on current category suggestions (all options)
    const primarySuggs = DYNAMIC_SUGGESTIONS[currentCategory] || DYNAMIC_SUGGESTIONS.general;
    primarySuggs.forEach((s) => {
      candidates.push({ ...s, category: currentCategory });
    });

    // Bring some key suggestions from other visited categories in history to weave them together
    uniqueVisitedCategories.forEach((prevCat) => {
      if (prevCat !== currentCategory) {
        const prevSuggs = DYNAMIC_SUGGESTIONS[prevCat] || [];
        // Add up to 2 items from this past category to the suggestions list
        prevSuggs.slice(0, 2).forEach((s) => {
          if (!candidates.some((c) => c.text === s.text)) {
            candidates.push({ ...s, category: prevCat });
          }
        });
      }
    });

    // If candidate deck is small or doesn't have positive vibes, add general/positive options for flexibility
    if (candidates.length < 8) {
      const fallbackDeck = [
        ...DYNAMIC_SUGGESTIONS.general,
        ...DYNAMIC_SUGGESTIONS.positive
      ];
      fallbackDeck.forEach((s) => {
        if (!candidates.some((c) => c.text === s.text)) {
          candidates.push(s);
        }
      });
    }

    // 5. Filter out suggestions that match text already sent by the user in this session
    let filteredCandidates = candidates.filter(
      (item) => !sentMessageTexts.includes(item.text.trim().toLowerCase())
    );

    // 6. Ensure some interesting miscellaneous wellness queries are always at the end if space permits
    const standardPivots = [
      { text: "Latih aku grounding 5-4-3-2-1", icon: "🧘" },
      { text: "Bantu tenangkan pikiran berisikku", icon: "✨" },
      { text: "Aku ingin nulis memo syukur", icon: "📔" }
    ];
    standardPivots.forEach((pv) => {
      if (
        filteredCandidates.length < 12 &&
        !filteredCandidates.some((c) => c.text.toLowerCase() === pv.text.toLowerCase()) &&
        !sentMessageTexts.includes(pv.text.toLowerCase())
      ) {
        filteredCandidates.push(pv);
      }
    });

    // Limit to make a beautiful, dense but tidy horizontal scrolling bar (up to 12 maximum choices)
    return filteredCandidates.slice(0, 12);
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userText = textToSend;
    setInputText("");
    
    // Calculate SVM Classification locally before calling any API
    const svmResult = classifyTextIntent(userText);
    
    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      text: userText,
      timestamp: Date.now(),
      svmResult: svmResult // include the calculated SVM result directly in the active history
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Keep recent context for Gemini
      const recentHistory = messages.slice(-6).map(msg => ({
        role: msg.role,
        text: msg.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, chatHistory: recentHistory }),
      });

      if (!res.ok) {
        throw new Error("Quota exceeded or Server Unavailable");
      }

      const data = await res.json();

      const modelMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "model",
        text: data.text || "Terima kasih sudah bercerita padaku.",
        timestamp: Date.now(),
        crisisTriggered: data.crisisTriggered || svmResult.requiresCounselor,
        svmResult: svmResult // include the calculated SVM results
      };

      setMessages((prev) => [...prev, modelMessage]);
      if (data.crisisTriggered || svmResult.requiresCounselor) {
        setCrisisActive(true);
      }
    } catch (err) {
      console.warn("API Chat got error or was throttled, using local SVM classifier fallback:", err);
      
      // Soothing local offline backup response matching the specific detected stress category
      const categoryResponses = OFFLINE_RESPONSES[svmResult.category] || OFFLINE_RESPONSES.general;
      const randomIdx = Math.floor(Math.random() * categoryResponses.length);
      let fallbackText = categoryResponses[randomIdx];
      
      if (svmResult.requiresCounselor) {
        fallbackText = `Aku mendengar betapa mendalam dan beratnya rasa sakit yang sedang kamu pikul saat ini. Tolong ketahuilah bahwa keselamatan dan jiwamu sangatlah berharga.\n\nKarena aku hanyalah sebuah AI pendengar dan bukan pengganti pertolongan krisis medis darurat, silakan hubungi Kemenkes RI di hotline darurat nasional resmi **SEJIWA 119 Ext 8** (bebas biaya, aktif 24 jam) atau periksakan diri ke fasilitas kesehatan terdekat.\n\nKamu tidak berjalan sendirian. Ada orang-orang terawat yang siap melindungimu.`;
        setCrisisActive(true);
      }

      const errorMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "model",
        text: fallbackText,
        timestamp: Date.now(),
        crisisTriggered: svmResult.requiresCounselor,
        svmResult: svmResult // attach SVM data so suggestions list renders beautifully!
      };
      
      setTimeout(() => {
        setMessages((prev) => [...prev, errorMessage]);
        setLoading(false);
      }, 700);
      return;
    }
    setLoading(false);
  };

  const [confirmReset, setConfirmReset] = useState(false);

  const handleResetChat = () => {
    if (confirmReset) {
      setMessages([
        {
          id: "welcome",
          role: "model",
          text: "Halo! Aku Ozy, teman curhat setiamu. Di sini adalah tempat aman untuk meluapkan penat, cemas, khawatir, atau hal bahagia apa pun yang kamu alami hari ini.\n\nYakinlah bahwa ceritamu didengar, dihargai, dan tidak akan dihakimi. Bagaimana kondisimu hari ini?",
          timestamp: Date.now(),
        },
      ]);
      setCrisisActive(false);
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleSendMessage(inputText);
  };

  const activeStarters = getDynamicStarters();

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-none overflow-hidden shadow-none h-[580px] w-full transition-colors" id="ozy-chatroom">
      {/* Mini Companion Title Header */}
      <div className="px-5 py-3.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 border border-gray-400 dark:border-gray-500 text-gray-400 flex items-center justify-center relative">
              {/* Wireframe Image Placeholder (Square with X) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="0" x2="24" y2="24" strokeWidth="1"></line>
                  <line x1="24" y1="0" x2="0" y2="24" strokeWidth="1"></line>
                </svg>
              </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 leading-none font-sans">
              Ozy
              <span className="inline-block w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500" />
            </h3>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Teman curhat virtual Anda</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mulai Ulang / Reset Conversation Button */}
          <button
            onClick={handleResetChat}
            className={`flex items-center gap-1 text-[10px] font-bold transition-colors px-2.5 py-1.5 border cursor-pointer rounded-none ${
              confirmReset 
                ? "bg-gray-500 text-white border-gray-600" 
                : "text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            }`}
            title="Mulai Ulang Percakapan"
          >
            <WireframeIcon className={`w-3 h-3 ${confirmReset ? "animate-spin" : ""}`} />
            {confirmReset ? "Yakin Reset?" : "Mulai Ulang"}
          </button>

          {onNavigateToHotlines && (
            <button
              onClick={onNavigateToHotlines}
              className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-300 font-bold bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-2.5 py-1.5 rounded-none cursor-pointer"
            >
              <WireframeIcon className="w-3 h-3" />
              Butuh Bantuan?
            </button>
          )}
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start animate-fade-in"}`}
          >
            <div
              className={`max-w-[90%] rounded-none border px-4 py-3 text-xs inline-block leading-relaxed ${
                msg.role === "user"
                  ? "bg-gray-200 text-gray-800 dark:bg-gray-700 border-gray-400 dark:border-gray-600 dark:text-gray-200"
                  : msg.crisisTriggered
                  ? "bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                  : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className={`text-[12.5px] leading-relaxed font-sans ${msg.role === "user" ? "text-gray-800 dark:text-gray-200" : "text-gray-800 dark:text-gray-200"}`}>
                {msg.role === "model" ? (
                  <div className="markdown-body [&>p]:mb-2 last:[&>p]:mb-0 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4">
                    <Markdown>{settings.profanityFilter ? filterProfanity(msg.text) : msg.text}</Markdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-line">{settings.profanityFilter ? filterProfanity(msg.text) : msg.text}</div>
                )}
              </div>

              {/* Robust Local SVM Intent Analysis & Sugesti Box inside chatbot */}
              {msg.role === "model" && msg.svmResult && (
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-700 space-y-2.5 text-gray-700 dark:text-gray-300">
                  {settings.showInternalAnalysis && (
                    <details className="group">
                      <summary className="text-[10.5px] font-bold text-gray-500 dark:text-gray-400 cursor-pointer list-none flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors [&::-webkit-details-marker]:hidden">
                        <span className="group-open:rotate-90 transition-transform text-[8px] inline-block">▶</span>
                        Lihat Analisis Internal
                      </summary>
                      <div className="flex flex-wrap items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-none border border-gray-300 dark:border-gray-700 mt-2">
                        <span className="text-[10.5px] font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1 animate-pulse">
                          <WireframeIcon className="w-3 h-3 text-gray-600 dark:text-gray-500 fill-gray-600/10" />
                          Label: {msg.svmResult.primaryEmotion}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-none border border-gray-400 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}>
                          Nilai: {msg.svmResult.sentimentScore}/10
                        </span>
                      </div>
                    </details>
                  )}

                  {settings.showQuotes && msg.svmResult.sentimentScore < 5 && msg.svmResult.summaryQuote && (
                    <div className="text-[11px] text-gray-600 dark:text-gray-400 italic bg-gray-100 dark:bg-gray-800 p-2.5 rounded-none border-l-2 border-gray-400 dark:border-gray-500">
                      💡 &ldquo;{msg.svmResult.summaryQuote}&rdquo;
                    </div>
                  )}

                  {settings.showSuggestions && msg.svmResult.sentimentScore < 5 && (
                    <div className="space-y-1">
                      <span className="text-[10.5px] font-bold text-gray-700 dark:text-gray-300 block">💡 Sugesti & Rekomendasi:</span>
                      <ul className="list-disc list-inside text-[11px] text-gray-600 dark:text-gray-400 space-y-1.5 pl-0.5 font-sans">
                        {msg.svmResult.suggestions.map((sug, i) => (
                          <li key={i} className="leading-relaxed list-none flex items-start gap-1">
                            <span className="text-gray-600 dark:text-gray-500 mt-0.5">✔</span>
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Immediate Counselor Advisory reminder if needed */}
                  {msg.svmResult.requiresCounselor && (
                    <div className="bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-500 p-2.5 rounded-none space-y-1 mt-1.5">
                      <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 text-[10.5px] font-bold">
                        <WireframeIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                        Peringatan Himbauan Konselor:
                      </div>
                      <p className="text-[10.5px] text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                        Sistem mendeteksi indikasi stres berat. Silakan hubungi kontak darurat di menu Kontak Konseling untuk bantuan profesional.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className={`mt-1.5 text-[9px] opacity-70 text-right font-mono text-gray-500 dark:text-gray-400`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-none px-4 py-2.5  flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 animate-bounce delay-75" />
              <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 animate-bounce delay-150" />
              <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 animate-bounce" />
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono italic ml-1">Loading...</span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Safety Alert Warning block */}
      <AnimatePresence>
        {crisisActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2.5 bg-gray-700 dark:bg-gray-800 text-white text-[11px] leading-snug flex flex-col items-stretch space-y-1"
          >
            <div className="flex items-start gap-1.5">
              <WireframeIcon className="w-4 h-4 flex-shrink-0 text-gray-300 mt-0.5" />
              <div className="flex-1 font-sans">
                <span className="font-bold block">🚨 Butuh Bantuan Lebih Lanjut?</span>
                Anda tidak sendirian. Silakan akses menu Kontak Konseling untuk menghubungi layanan bantuan klinis terpercaya.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curhat Starter Button Recommendations */}
      <div className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
        {activeStarters.map((starter, idx) => (
          <button
            key={idx}
            type="button"
            disabled={loading || crisisActive}
            onClick={() => handleSendMessage(starter.text)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-gray-400 dark:border-gray-600 py-1.5 px-3.5 rounded-none text-[11px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span className="grayscale opacity-60">{starter.icon}</span>
            <span>{starter.text}</span>
          </button>
        ))}
      </div>

      {/* Chat Input Field Container */}
      <div className="p-3 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-none">
        {crisisActive ? (
          <div className="bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded-none px-4 py-3 text-center">
            <p className="text-xs text-gray-700 dark:text-gray-300 font-bold mb-2">
              Teks placeholder opsi 1
            </p>
            <button
              onClick={handleResetChat}
              className="bg-white dark:bg-gray-900 border border-gray-400 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold py-1.5 px-4 rounded-none transition-colors"
            >
              Mulai Ulang
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmitForm} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              placeholder="Tulis Pertanyaan"
              className="flex-1 bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-none px-4 py-2.5 focus:outline-none transition-all font-sans"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 disabled:opacity-50 border border-gray-400 dark:border-gray-600 rounded-none px-6 py-2 text-xs font-bold transition-all flex items-center justify-center cursor-pointer font-sans"
            >
              Kirim
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
