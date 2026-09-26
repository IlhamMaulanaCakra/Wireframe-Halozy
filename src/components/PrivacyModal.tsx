import React from "react";
import { WireframeIcon } from "./WireframeIcon";
import { motion, AnimatePresence } from "motion/react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-none shadow-none border border-gray-300 dark:border-gray-700 z-50 overflow-hidden flex flex-col p-6 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-none border border-gray-300 dark:border-gray-600 flex items-center justify-center mb-4">
              <WireframeIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
            
            <h2 className="font-black text-xl text-gray-800 dark:text-gray-100 mb-2">100% Privat</h2>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Semua data percakapan Anda aman dan hanya disimpan secara lokal. <strong>Tidak ada data</strong> yang dikirim atau disimpan di server luar. 
            </p>

            <button
              onClick={onClose}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-500 font-bold py-3 rounded-none transition-colors"
            >
              Saya Mengerti
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
