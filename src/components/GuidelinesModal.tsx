import React from "react";
import { WireframeIcon } from "./WireframeIcon";
import { motion, AnimatePresence } from "motion/react";

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuidelinesModal({ isOpen, onClose }: GuidelinesModalProps) {
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
                <h2 className="font-bold text-lg">Panduan Pengguna</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-none hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
              >
                <WireframeIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Selamat datang! Untuk menjaga ruang ini tetap aman, mohon ikuti panduan berikut:
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    <WireframeIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Bukan Pengganti Psikolog</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Aplikasi ini adalah teman curhat AI, bukan pengganti konseling klinis atau psikolog profesional.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    <WireframeIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Kerahasiaan Percakapan</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Semua obrolan disimpan secara lokal di perangkat Anda dan tidak dikirim ke server luar.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    <WireframeIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Bantuan Profesional</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Gunakan daftar kontak bantuan jika Anda memerlukan pertolongan darurat dari ahlinya.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-sm font-bold rounded-none transition-colors border border-gray-400 dark:border-gray-500 active:scale-95"
              > Saya Mengerti </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
