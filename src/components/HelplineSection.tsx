import React, { useState } from "react";
import { WireframeIcon } from "./WireframeIcon";

export default function HelplineSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const hotlines = [
    {
      id: "item1",
      name: "Nama Kontak 1",
      contact: "+62 800-0000-0000",
      type: "phone",
      description: "Deskripsi pendek layanan kontak sementara untuk keperluan wireframe.",
      tags: ["tag1", "tag2", "tag3", "tag4"]
    },
    {
      id: "item2",
      name: "Nama Kontak 2",
      contact: "+62 800-0000-0000",
      web: "https://example.com",
      type: "both",
      description: "Deskripsi pendek layanan kontak sementara untuk keperluan wireframe.",
      tags: ["tag5", "tag6", "tag7"]
    },
    {
      id: "item3",
      name: "Nama Kontak 3",
      web: "https://example.com",
      type: "web",
      description: "Deskripsi pendek layanan kontak sementara untuk keperluan wireframe.",
      tags: ["tag8", "tag9", "tag10"]
    },
    {
      id: "item4",
      name: "Nama Kontak 4",
      web: "https://example.com",
      type: "web",
      description: "Deskripsi pendek layanan kontak sementara untuk keperluan wireframe.",
      tags: ["tag11", "tag12", "tag13"]
    },
    {
      id: "item5",
      name: "Nama Kontak 5",
      web: "https://example.com",
      type: "web",
      description: "Deskripsi pendek layanan kontak sementara untuk keperluan wireframe.",
      tags: ["tag14", "tag15", "tag16"]
    }
  ];

  const filteredHotlines = hotlines.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5 animate-fade-in" id="helpline-resources">
      {/* Visual Header Guide info */}
      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-none p-5 flex items-start gap-4 shadow-none">
        <div className="w-10 h-10 border border-gray-400 dark:border-gray-500 flex items-center justify-center text-gray-500 dark:text-gray-400 flex-shrink-0">
          <WireframeIcon className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Pusat Bantuan</h4>
          <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">
            Daftar nomor dan tautan kontak yang dapat dihubungi saat darurat.
            <br />
            <strong className="text-gray-700 dark:text-gray-300">Teks tebal penekanan.</strong>
          </p>
        </div>
      </div>

      {/* Instant Search resource */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
          <WireframeIcon className="w-3.5 h-3.5" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari kontak..."
          className="w-full bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700 rounded-none pl-9 pr-4 py-2.5 outline-none focus:ring-1 focus:ring-gray-500 transition-all font-medium"
        />
      </div>

      {/* Resource Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHotlines.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-none p-4 flex flex-col justify-between shadow-none"
          >
            <div className="space-y-2">
              {/* Header Title with quick category */}
              <div className="flex items-start justify-between gap-2">
                <h5 className="text-[13px] font-bold text-gray-800 dark:text-gray-200 tracking-tight leading-tight">
                  {item.name}
                </h5>
                <span className="text-[9px] bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold px-1.5 py-0.5 rounded-none uppercase border border-gray-300 dark:border-gray-700">
                  {item.tags[0]}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11.5px] text-gray-500 dark:text-gray-400 leading-relaxed">
                Deskripsi singkat layanan yang tersedia pada lembaga atau instansi ini.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 items-center justify-between">
              {/* Info text or contact details handle */}
              {item.contact ? (
                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-2.5 py-1 rounded-none">
                  <WireframeIcon className="w-3.5 h-3.5" />
                  <span>{item.contact}</span>
                </div>
              ) : (
                <div className="text-[10px] text-gray-400 dark:text-gray-500 font-mono italic">
                  Akses Web Online
                </div>
              )}

              {/* External web links */}
              {item.web && (
                <a
                  href={item.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors px-3 py-1 rounded-none cursor-pointer"
                >
                  <span>Kunjungi Situs</span>
                  <WireframeIcon className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}

        {filteredHotlines.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-none">
            <WireframeIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Tidak ada hasil pencarian.</p>
          </div>
        )}
      </div>

      {/* Helpful quote footer regarding clinical attention */}
      <div className="text-center py-4 text-[10.5px] text-gray-500 dark:text-gray-400 leading-normal">
        <WireframeIcon className="w-3 h-3 text-gray-400 inline-block mr-1 align-middle" />
        Gunakan kontak bantuan di atas jika Anda merasa butuh pertolongan profesional.
      </div>
    </div>
  );
}
