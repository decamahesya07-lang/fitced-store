# Teknologi — Puncak Rental

## 1. Prinsip pemilihan
MVP adalah website statis dengan HTML, CSS, dan JavaScript murni. Prioritasnya mudah dipelajari, dapat dijalankan tanpa proses build, dan murah dioperasikan. Dokumen ini menetapkan pilihan arsitektur; layanan hosting belum dibuat atau dipublikasikan.

## 2. Stack yang dipilih
| Lapisan | Pilihan | Alasan |
| --- | --- | --- |
| Struktur halaman | HTML5 semantik | Mendukung struktur konten dan aksesibilitas tanpa framework |
| Tampilan | CSS3, Flexbox, Grid, media query | Cukup untuk tampilan responsif tanpa dependensi UI |
| Logika browser | JavaScript ES modules | Memisahkan katalog, keranjang, dan formulir tanpa bundler |
| Framework | Tidak digunakan | Mengurangi kompleksitas untuk cakupan MVP |
| Katalog | Array objek pada `js/data.js` | Mudah ditinjau dan diperbarui melalui kode |
| Penyimpanan browser | localStorage | Memulihkan keranjang pada perangkat dan origin yang sama |
| Database server | Tidak digunakan pada MVP | Belum ada akun, stok tersinkron, atau transaksi server |
| Integrasi pengajuan | Tautan WhatsApp `wa.me` | Membuka pesan yang diperiksa dan dikirim sendiri oleh pengguna |
| Hosting/cloud rencana | Cloudflare Pages, unggahan aset statis | Sesuai untuk berkas statis melalui HTTPS; tidak memerlukan server aplikasi |
| Kontrol versi | Git | Meninjau perubahan dan mengembalikan versi |
| Server pengembangan | Python 3 `http.server` | Menjalankan ES modules melalui HTTP tanpa paket tambahan |
| Pemeriksaan | Browser DevTools; Node.js opsional untuk sintaks | Memeriksa interaksi, responsivitas, dan kesalahan JavaScript |

Fitur dan prosedur dashboard penyedia hosting perlu diperiksa kembali saat deployment. Tidak ada SDK cloud dalam kode aplikasi.

## 3. Kompatibilitas
Targetkan browser modern Chrome, Edge, Firefox, dan Safari, termasuk Android/iOS yang masih didukung produsennya. Gunakan input tanggal native dengan label serta validasi JavaScript. Tidak mendukung Internet Explorer. Periksa setidaknya satu browser Chromium dan satu browser lain sebelum rilis bila tersedia.

## 4. Pengelolaan data
- localStorage hanya menyimpan versi skema, ID barang, jumlah, dan tanggal sewa.
- Nama dan nomor kontak hanya berada di memori formulir sampai pengguna membuka WhatsApp; jangan simpan dalam localStorage atau log.
- Katalog sumber menjadi acuan harga; jangan percaya harga atau total dari localStorage.
- Penyimpanan browser bukan database bersama dan tidak menyediakan stok atau reservasi.
- Tanpa API key, password, token, atau rahasia di frontend. Nomor usaha bersifat publik.

## 5. Aset dan performa
Gunakan aset lokal yang hak penggunaannya jelas, format WebP/AVIF bila tersedia, dimensi gambar eksplisit, dan lazy loading untuk gambar di bawah area awal. Gunakan font sistem agar tidak bergantung pada CDN font. Target awal total aset halaman sekitar 1 MB atau lebih kecil dan tidak ada kesalahan console pada alur utama.

## 6. Pengembangan berikutnya
Jika dibutuhkan reservasi dan stok bersama, tambahkan backend serta database relasional, pemeriksaan ketersediaan berdasarkan rentang tanggal, autentikasi admin, dan validasi server. Pilihan layanan ditentukan pada fase tersebut; localStorage tidak boleh menjadi dasar konfirmasi transaksi atau pembayaran.
