import React, { useRef } from "react";
import { WireframeIcon } from "./WireframeIcon";
import { motion, AnimatePresence } from "motion/react";
import { useSettings } from "../utils/SettingsContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSetting } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const chatHistory = sessionStorage.getItem("ozy_chat_history") || "[]";
    const appSettings = localStorage.getItem("halozy_settings") || "{}";
    
    const exportData = {
      chat_history: JSON.parse(chatHistory),
      settings: JSON.parse(appSettings),
      export_date: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `halozy_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const importedData = JSON.parse(content);

        if (importedData.chat_history) {
          sessionStorage.setItem("ozy_chat_history", JSON.stringify(importedData.chat_history));
        }
        
        if (importedData.settings) {
          localStorage.setItem("halozy_settings", JSON.stringify(importedData.settings));
          // Need to reload to apply settings context correctly, or fire custom event
        }

        alert("Data berhasil dipulihkan! Halaman akan dimuat ulang.");
        window.location.reload();
      } catch (err) {
        alert("Gagal memulihkan data. Pastikan file JSON yang diunggah valid.");
        console.error(err);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-none shadow-none border border-gray-300 dark:border-gray-600 z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <WireframeIcon className="w-5 h-5" />
                <h2 className="font-bold text-lg">Pengaturan</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-none hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors border border-transparent"
              >
                <WireframeIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6">
              
              {/* Theme Settings Content */}
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <WireframeIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Tema Tampilan</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Data obrolan dan pengaturan hanya disimpan di perangkatmu.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-200 dark:bg-gray-800 rounded-none p-1 gap-1 border border-gray-300 dark:border-gray-700">
                    <button
                      onClick={() => updateSetting('theme', 'light')}
                      className={`flex-1 text-xs font-semibold py-1.5 px-3 rounded-none transition-colors border ${
                        settings.theme === 'light' ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-500' : 'text-gray-500 hover:bg-gray-300 border-transparent dark:hover:bg-gray-700'
                      }`}
                    >
                      Terang
                    </button>
                    <button
                      onClick={() => updateSetting('theme', 'dark')}
                      className={`flex-1 text-xs font-semibold py-1.5 px-3 rounded-none transition-colors border ${
                        settings.theme === 'dark' ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-500' : 'text-gray-500 hover:bg-gray-300 border-transparent dark:hover:bg-gray-700'
                      }`}
                    >
                      Gelap
                    </button>
                    <button
                      onClick={() => updateSetting('theme', 'system')}
                      className={`flex-1 text-xs font-semibold py-1.5 px-3 rounded-none transition-colors border ${
                        settings.theme === 'system' ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-500' : 'text-gray-500 hover:bg-gray-300 border-transparent dark:hover:bg-gray-700'
                      }`}
                    >
                      Sistem
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {settings.profanityFilter ? <WireframeIcon className="w-5 h-5 text-gray-500" /> : <WireframeIcon className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Filter Kata Kasar</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Pilih tema warna untuk antarmuka
                      </p>
                    </div>
                  </div>
                  <Toggle active={settings.profanityFilter} onClick={() => updateSetting('profanityFilter', !settings.profanityFilter)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {settings.soundEffects ? <WireframeIcon className="w-5 h-5 text-gray-500" /> : <WireframeIcon className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Efek Suara</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Sensor kata kasar dalam balasan
                      </p>
                    </div>
                  </div>
                  <Toggle active={settings.soundEffects} onClick={() => updateSetting('soundEffects', !settings.soundEffects)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {settings.largeText ? <WireframeIcon className="w-5 h-5 text-gray-500" /> : <WireframeIcon className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Teks Besar</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Putar suara saat pesan baru diterima
                      </p>
                    </div>
                  </div>
                  <Toggle active={settings.largeText} onClick={() => updateSetting('largeText', !settings.largeText)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <WireframeIcon className={`w-5 h-5 ${settings.backgroundAnimation ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Animasi Latar</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Perbesar ukuran teks agar lebih mudah dibaca
                      </p>
                    </div>
                  </div>
                  <Toggle active={settings.backgroundAnimation} onClick={() => updateSetting('backgroundAnimation', !settings.backgroundAnimation)} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <WireframeIcon className={`w-5 h-5 ${settings.showQuotes ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Kutipan Penyemangat</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Tampilkan animasi visual yang menenangkan
                      </p>
                    </div>
                  </div>
                  <Toggle active={settings.showQuotes} onClick={() => updateSetting('showQuotes', !settings.showQuotes)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {settings.showSuggestions ? <WireframeIcon className="w-5 h-5 text-gray-500" /> : <WireframeIcon className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Saran Aktivitas</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Tampilkan kutipan positif di chat
                      </p>
                    </div>
                  </div>
                  <Toggle active={settings.showSuggestions} onClick={() => updateSetting('showSuggestions', !settings.showSuggestions)} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <WireframeIcon className={`w-5 h-5 ${settings.showInternalAnalysis ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Analisis Sentimen (Debug)</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Tampilkan saran tindakan atau aktivitas
                      </p>
                    </div>
                  </div>
                  <Toggle active={settings.showInternalAnalysis} onClick={() => updateSetting('showInternalAnalysis', !settings.showInternalAnalysis)} />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Data Lokal</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Data obrolan dan pengaturan hanya disimpan di perangkatmu. Kamu dapat mengunduh atau memulihkan data tersebut secara manual.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExport}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900/40 rounded-none transition-colors text-sm font-bold border border-gray-200 dark:border-gray-800/50"
                  >
                    <WireframeIcon className="w-4 h-4" />
                    <span>Unduh Data</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-none transition-colors text-sm font-bold border border-gray-200 dark:border-gray-700"
                  >
                    <WireframeIcon className="w-4 h-4" />
                    <span>Pulihkan Data</span>
                  </button>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImport}
                  />
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Toggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-none border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 ${
        active ? 'bg-gray-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-none bg-white shadow ring-0 transition duration-200 ease-in-out ${
          active ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
