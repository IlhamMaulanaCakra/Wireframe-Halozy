const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

code = code.replace('<h2 className="font-bold text-lg">Lorem Ipsum</h2>', '<h2 className="font-bold text-lg">Pengaturan</h2>');

const headers = [
  "Tema Tampilan",
  "Filter Kata Kasar",
  "Efek Suara",
  "Teks Besar",
  "Animasi Latar",
  "Kutipan Penyemangat",
  "Saran Aktivitas",
  "Analisis Sentimen (Debug)",
  "Data Lokal"
];
const descs = [
  "Pilih tema warna untuk antarmuka",
  "Sensor kata kasar dalam balasan",
  "Putar suara saat pesan baru diterima",
  "Perbesar ukuran teks agar lebih mudah dibaca",
  "Tampilkan animasi visual yang menenangkan",
  "Tampilkan kutipan positif di chat",
  "Tampilkan saran tindakan atau aktivitas",
  "Tampilkan data analisis sentimen dan klasifikasi internal",
  "Data obrolan dan pengaturan hanya disimpan di perangkatmu."
];

for(let i = 0; i < headers.length; i++) {
  code = code.replace('Lorem Ipsum Dolor', headers[i]);
  if(i === 8) {
     code = code.replace('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', descs[i]);
  } else {
     code = code.replace('Lorem ipsum dolor sit amet.', descs[i]);
  }
}

code = code.replace('<span>Lorem Ipsum</span>', '<span>Unduh Data</span>');
code = code.replace('<span>Lorem Ipsum</span>', '<span>Pulihkan Data</span>');

fs.writeFileSync('src/components/SettingsModal.tsx', code);
