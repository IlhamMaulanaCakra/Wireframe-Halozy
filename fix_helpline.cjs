const fs = require('fs');
let code = fs.readFileSync('src/components/HelplineSection.tsx', 'utf8');

let counter = 1;
code = code.replace(/Lorem Ipsum Dolor/g, () => `Nama Kontak ${counter++}`);
code = code.replace(/Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua./g, 'Deskripsi pendek layanan kontak sementara untuk keperluan wireframe.');
code = code.replace('<h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Lorem Ipsum</h4>', '<h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Pusat Bantuan</h4>');
code = code.replace('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.', 'Daftar nomor dan tautan kontak yang dapat dihubungi saat darurat.');
code = code.replace(/Lorem ipsum dolor sit amet, consectetur adipiscing elit\. Aliquam erat volutpat\./g, 'Deskripsi singkat layanan yang tersedia pada lembaga atau instansi ini.');
code = code.replace('placeholder="Lorem ipsum..."', 'placeholder="Cari kontak..."');
code = code.replace('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Gunakan kontak bantuan di atas jika Anda merasa butuh pertolongan profesional.');

fs.writeFileSync('src/components/HelplineSection.tsx', code);
