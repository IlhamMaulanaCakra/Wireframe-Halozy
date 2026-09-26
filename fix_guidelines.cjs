const fs = require('fs');
let code = fs.readFileSync('src/components/GuidelinesModal.tsx', 'utf8');

code = code.replace('<h2 className="font-bold text-lg">Lorem Ipsum</h2>', '<h2 className="font-bold text-lg">Panduan Pengguna</h2>');
code = code.replace('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Selamat datang! Untuk menjaga ruang ini tetap aman, mohon ikuti panduan berikut:');

const h3 = ['Bukan Pengganti Psikolog', 'Berbagi dengan Aman', 'Jaga Privasi'];
const p = [
  'Aplikasi ini tidak menggantikan bantuan profesional dari tenaga ahli klinis.',
  'Hindari menyebarkan informasi terlalu sensitif atau membagikan identitas lengkap.',
  'Kami tidak menyimpan atau mengumpulkan data pribadi yang dapat mengidentifikasi pengguna.'
];

let currentIndex = 0;
code = code.replace(/Lorem Ipsum Dolor/g, () => h3[currentIndex] || h3[0]);
code = code.replace(/Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris./g, 'Penjelasan ringkas mengenai panduan aplikasi.');
code = code.replace('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'Teks keterangan tambahan untuk bantuan profesional klinis dan kontak darurat.');
code = code.replace(/>\s*Lorem Ipsum\s*<\/button>/, '> Saya Mengerti </button>');

fs.writeFileSync('src/components/GuidelinesModal.tsx', code);
