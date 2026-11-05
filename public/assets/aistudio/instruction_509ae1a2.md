# Panduan Pengembangan — Puncak Rental

## 1. Cakupan dan urutan kerja
Dokumentasi ini menjadi dasar implementasi website statis HTML, CSS, dan JavaScript. Selesaikan dan tinjau kebutuhan sebelum membuat fitur. Tidak ada website atau deployment yang dinyatakan sudah selesai hanya karena dokumen tersedia.

Baca berurutan: `prd.md` → `tech_stack.md` → `arsitektur.md` → `ui.ux.md`. Gunakan nama merek sementara Puncak Rental sampai pemilik usaha menentukan identitasnya.

## 2. Prasyarat
- Editor kode, browser modern, Python 3, dan Git jika menggunakan kontrol versi.
- Node.js opsional untuk pemeriksaan sintaks; bukan dependensi runtime website.
- Data usaha sebelum peluncuran: nomor WhatsApp internasional, alamat toko, jam buka, katalog dan harga, foto berizin, serta syarat sewa termasuk deposit dan keterlambatan.
- Dilarang menggunakan nomor contoh sebagai penerima pengajuan aktif. Jika nomor asli belum tersedia, nonaktifkan pengajuan.

## 3. Langkah implementasi
1. **Siapkan struktur:** buat berkas dan direktori runtime sesuai `arsitektur.md`; mulai dari `index.html`, `css/styles.css`, dan modul `js/`.
2. **Definisikan konfigurasi:** masukkan nama usaha, kontak publik, alamat, dan jam operasional di `js/config.js`. Nomor WhatsApp usaha memakai kode negara dan digit saja, tanpa `+`, spasi, atau awalan nol lokal.
3. **Buat katalog:** tambahkan minimal 8 barang contoh yang mencakup seluruh kategori. Setiap item memiliki ID unik, nama, kategori, deskripsi, spesifikasi, harga harian integer positif, path gambar lokal, dan alt. Tandai konten sebagai contoh selama data usaha belum diverifikasi.
4. **Bangun HTML semantik:** header, hero, katalog, keranjang, formulir, ringkasan, cara sewa, FAQ, kontak, footer, dan `noscript`. Muat `js/app.js` memakai `type="module"`.
5. **Terapkan CSS mobile-first:** token warna, tipografi, grid kartu, kontrol formulir, status/error, dan focus-visible. Pada layar kecil tampilkan satu kolom; tambah kolom sesuai ruang konten.
6. **Implementasikan katalog:** pencarian tanpa membedakan huruf besar/kecil, filter kategori, jumlah hasil, dan keadaan kosong. Pencarian dan filter harus dapat digabungkan.
7. **Implementasikan keranjang:** satu sumber state, tambah/ubah/hapus berdasarkan ID; tolak jumlah selain integer 1–99. Gunakan harga katalog saat menghitung ulang.
8. **Implementasikan tanggal:** validasi tanggal nyata, mulai minimal hari ini, dan akhir setelah mulai. Gunakan selisih hari kalender seperti `arsitektur.md`; tampilkan petunjuk tarif per hari.
9. **Implementasikan penyimpanan:** hanya ID, jumlah, tanggal, dan versi skema. Tangani JSON rusak, versi tidak dikenal, item hilang, dan akses storage yang ditolak tanpa crash.
10. **Implementasikan pengajuan:** validasi nama/kontak sesuai `ui.ux.md`, tampilkan ringkasan, lalu bentuk tautan WhatsApp dari state terbaru dengan `encodeURIComponent`. Perubahan input setelah pemeriksaan membatalkan status pemeriksaan. Jangan otomatis mengirim atau mengosongkan keranjang.
11. **Lengkapi konten:** aturan konfirmasi stok, estimasi biaya, pengambilan di toko, dan penggunaan data saat beralih ke WhatsApp. Jangan mengarang alamat, stok, testimoni, atau ketentuan transaksi.
12. **Verifikasi:** jalankan pemeriksaan di bawah, perbaiki masalah, dan catat hasil sebelum deployment.

## 4. Menjalankan lokal
Dari direktori proyek setelah berkas aplikasi dibuat:
```bash
python3 -m http.server 5500 --bind 127.0.0.1
```
Buka `http://localhost:5500`. Hentikan dengan Ctrl+C. Jangan mengandalkan membuka `index.html` melalui `file://` karena ES modules perlu dilayani melalui HTTP. Tidak perlu `npm install` atau proses build.

## 5. Aturan penulisan kode
- Gunakan indentasi 2 spasi, UTF-8, nama file huruf kecil, dan kebab-case untuk kelas CSS serta ID HTML.
- Variabel/fungsi JavaScript memakai camelCase; konstanta konfigurasi tetap memakai UPPER_SNAKE_CASE.
- Gunakan `const` secara default dan `let` saat perlu mutasi; hindari `var`, global yang tidak diperlukan, dan inline handler seperti `onclick`.
- Gunakan ES modules dengan tanggung jawab jelas. Perhitungan harga dan validasi tanggal dibuat sebagai fungsi murni agar mudah diperiksa.
- Pisahkan data, state, logika, dan render; jangan menghitung total dengan membaca teks harga dari DOM.
- Gunakan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })` untuk format rupiah.
- Render input/data dinamis melalui `textContent` atau DOM API. Jangan memasukkan input pengguna ke `innerHTML`.
- Tangani kegagalan localStorage dan validasi input secara eksplisit. Jangan mencatat nama atau nomor kontak ke console.
- Tulis komentar untuk alasan keputusan yang tidak jelas, bukan mengulang operasi kode.
- Gunakan aset lokal dengan nama deskriptif. Catat asal/lisensi aset yang memerlukannya.
- Jangan memasukkan token, rahasia, file `.env`, atau data pelanggan ke repository dan paket deployment.

## 6. Pemeriksaan sebelum rilis
| Skenario | Hasil yang diharapkan |
| --- | --- |
| Katalog pertama dibuka | Semua produk tampil, tanpa error console atau aset hilang |
| Cari nama + pilih kategori | Hasil memenuhi kedua kondisi; reset mengembalikan katalog |
| Tambah produk sama dua kali | Satu baris dengan jumlah 2 |
| Jumlah 0, negatif, desimal, atau 100 | Ditolak dengan pesan jelas |
| Dua tenda 50.000 + satu matras 10.000, dua hari | Total Rp220.000 |
| 31 Januari–1 Februari; 31 Desember–1 Januari | Durasi masing-masing 1 hari |
| 28 Februari–1 Maret tahun kabisat | Durasi 2 hari |
| Mulai kemarin, tanggal sama, atau akhir sebelum mulai | Pengajuan ditolak |
| Keranjang kosong atau kontak invalid | Fokus menuju masalah pertama dan ada penjelasan |
| Reload, data JSON rusak, atau storage ditolak | State valid dipulihkan atau aplikasi pulih dengan aman |
| Produk dihapus/harga diubah pada katalog | ID hilang diabaikan; harga terkini dipakai |
| Nama mengandung `<`, `&`, tanda kutip, atau baris baru | Ditampilkan sebagai teks dan URL tetap ter-encode |
| Nomor usaha kosong | Tombol pengajuan tidak aktif |
| WhatsApp dibuka | Draf lengkap; pengguna masih perlu menekan kirim |
| Keranjang diubah sesudah ringkasan | Ringkasan harus diperiksa ulang sebelum membuka WhatsApp |
| Lebar 360, 768, 1280 px dan zoom 200% | Konten terbaca dan kontrol tidak terpotong |
| Keyboard tanpa mouse | Urutan fokus masuk akal dan semua aksi dapat dijalankan |

Periksa juga reflow pada 320 CSS px, kontras, alt gambar, label formulir, dan reduced motion. Jika browser atau perangkat tertentu tidak tersedia, catat keterbatasan pemeriksaan. Automasi pengujian fungsi murni dapat ditambahkan bila logika berkembang; tidak perlu framework pengujian untuk sekadar konten statis.

Jika Node.js tersedia, pemeriksaan sintaks modul dapat dilakukan dari root:
```bash
node --input-type=module --check < js/app.js
```
Ulangi untuk modul lain. Pemeriksaan sintaks tidak menggantikan pemeriksaan alur di browser.

## 7. Proses deployment statis
Rencana penyedia: Cloudflare Pages. Prosedur dashboard dan ketersediaan fitur perlu diverifikasi pada saat eksekusi. Tidak memerlukan backend, database, atau environment variable rahasia.

1. Pastikan data usaha sudah benar, aset berizin, nomor tujuan valid, dan seluruh pemeriksaan penerimaan lulus.
2. Siapkan folder paket publik yang hanya berisi `index.html`, `css/`, `js/`, dan `assets/`. Jangan sertakan dokumentasi internal, `.git/`, atau data pribadi.
3. Jalankan server lokal dengan folder paket sebagai root dan periksa seluruh tautan serta path aset. Gunakan path relatif agar tetap dapat dihosting di subpath bila diperlukan.
4. Buat proyek hosting statis dan unggah paket melalui fasilitas unggah langsung yang tersedia. Paket ini tidak memerlukan perintah build atau fungsi server.
5. Gunakan URL HTTPS hasil hosting untuk smoke test: muat halaman, cari produk, tambah keranjang, hitung tanggal, dan buka draf WhatsApp tanpa mengirim pesan uji ke pihak lain.
6. Bila memakai domain sendiri, atur DNS sesuai instruksi penyedia, lalu periksa sertifikat HTTPS dan ulangi smoke test pada origin final.
7. Catat URL, tanggal rilis, versi/commit sumber, paket yang diunggah, dan hasil pemeriksaan dalam catatan rilis.

## 8. Rollback dan pemeliharaan
Simpan paket rilis sebelumnya. Jika rilis baru bermasalah, gunakan fitur rollback penyedia bila tersedia atau unggah ulang paket sebelumnya; periksa halaman dan alur utama. Perubahan domain/origin membuat localStorage lama tidak ikut berpindah. Untuk pembaruan katalog, jaga ID produk tetap stabil, periksa tarif, dan ulangi pemeriksaan hitung. Jika skema penyimpanan berubah, naikkan versi dan sediakan reset/migrasi yang aman.

## 9. Definition of Done
Implementasi dianggap selesai setelah fitur dan kriteria penerimaan di `prd.md` terpenuhi, data usaha dikonfirmasi, aksesibilitas dasar diperiksa, aset serta console bersih dari error, dan hasil pengujian dicatat. Deployment hanya dianggap selesai setelah URL hosting dapat diakses dan smoke test lulus. Dokumentasi harus diperbarui jika keputusan teknis atau aturan bisnis berubah.
