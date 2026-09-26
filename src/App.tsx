import React, { useState } from "react";
import Chatroom from "./components/Chatroom";
import HelplineSection from "./components/HelplineSection";
import GuidelinesModal from "./components/GuidelinesModal";
import SettingsModal from "./components/SettingsModal";
import PrivacyModal from "./components/PrivacyModal";
import { WireframeIcon } from "./components/WireframeIcon";
import { useSettings } from "./utils/SettingsContext";

export default function App() {
  // Navigation View Tabs: "chat" (Default) | "hotlines"
  const [activeTab, setActiveTab] = useState<"chat" | "hotlines">("chat");
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(true);
  const { settings } = useSettings();

  const handleClosePrivacy = () => {
    setIsPrivacyOpen(false);
    setIsGuidelinesOpen(true);
  };

  const handleCloseGuidelines = () => {
    setIsGuidelinesOpen(false);
  };

  return (
    <div className={`min-h-screen text-gray-800 dark:text-gray-200 antialiased font-sans select-none relative pb-16 transition-colors duration-300 bg-gray-50 dark:bg-gray-900`}>
      
      {/* Visual Header Ribbon bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gray-300 dark:bg-gray-700 z-20" />
      
      <div className="max-w-6xl mx-auto px-4 pt-5 relative z-10">
        
        {/* Main Application Branding Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-6 border-b border-gray-300 dark:border-gray-700 gap-3" id="appHeader">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 border-2 border-gray-400 dark:border-gray-500 text-gray-400 flex items-center justify-center relative">
              {/* Wireframe Image Placeholder (Square with X) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="0" x2="24" y2="24" strokeWidth="1"></line>
                  <line x1="24" y1="0" x2="0" y2="24" strokeWidth="1"></line>
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-gray-900 dark:text-gray-100 font-sans">Halozy</span>
                <span className="text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold px-1.5 py-0.2 rounded-none font-mono">v1.2</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Deskripsi singkat aplikasi akan ditempatkan di sini sebagai penjelasan.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 px-3 py-1 rounded-none cursor-pointer"
            >
              <span>Pengaturan</span>
            </button>
            <button
              onClick={() => setIsGuidelinesOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 px-3 py-1 rounded-none cursor-pointer"
            >
              <span>Panduan</span>
            </button>
            {/* Secure indicator tag */}
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 px-3 py-1 rounded-none cursor-pointer"
            >
              <span>Privasi 100%</span>
            </button>
          </div>
        </header>

        {/* COMPACT VIEW TABS SWITCHER - Simplified User Navigation */}
        <nav className="grid grid-cols-2 gap-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-none mb-6 max-w-sm mx-auto border border-gray-300 dark:border-gray-700" id="mainNavigation">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-none text-xs font-bold transition-all cursor-pointer border ${
              activeTab === "chat"
                ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-400 dark:border-gray-500"
                : "text-gray-500 border-transparent hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span>Teman Curhat</span>
          </button>
          <button
            onClick={() => setActiveTab("hotlines")}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-none text-xs font-bold transition-all cursor-pointer border ${
              activeTab === "hotlines"
                ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-400 dark:border-gray-500"
                : "text-gray-500 border-transparent hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span>Kontak Konseling</span>
          </button>
        </nav>

        {/* Main Tab Render Space */}
        <main className="min-h-[480px]">
          
          <div className={activeTab === "chat" ? "block max-w-2xl mx-auto" : "hidden"}>
            <Chatroom 
              onNavigateToHotlines={() => setActiveTab("hotlines")}
            />
          </div>
          <div className={activeTab === "hotlines" ? "block max-w-3xl mx-auto" : "hidden"}>
            <HelplineSection />
          </div>
        </main>
        
        {/* Humble, supportive app credit line */}
        <footer className="mt-12 text-center text-[11px] text-gray-500 dark:text-gray-400 select-text">
          <p>© 2026 Halozy. Keterangan tambahan aplikasi akan ditampilkan di sini.</p>
          <p className="mt-0.5">Teks placeholder untuk footer aplikasi wireframe.</p>
        </footer>
      </div>

      <GuidelinesModal isOpen={isGuidelinesOpen} onClose={handleCloseGuidelines} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={handleClosePrivacy} />
    </div>
  );
}
