# Product Requirement Document — Puncak Rental

Status: MVP lokal telah diimplementasikan dengan 10 produk utama. Verifikasi dan batas kesiapan rilis dicatat pada `verification.md`. Nama “Puncak Rental”, harga contoh, lokasi toko, dan nomor WhatsApp adalah asumsi yang harus diganti dengan data usaha sebelum peluncuran.

## 1. Visi produk
Memudahkan pendaki menemukan dan mengajukan penyewaan perlengkapan yang sesuai dengan kebutuhan dan anggaran melalui website berbahasa Indonesia yang ringan serta mudah digunakan di ponsel.

## 2. Masalah yang dipecahkan
- Calon penyewa kesulitan membandingkan perlengkapan dan tarif tanpa bertanya satu per satu.
- Daftar pesanan melalui percakapan sering tidak mencantumkan jumlah barang atau tanggal sewa secara lengkap.
- Penyewa tidak mengetahui perkiraan biaya sebelum menghubungi pengelola.
- Pengelola perlu menerima pengajuan yang terstruktur agar konfirmasi lebih cepat.

## 3. Target pengguna
| Pengguna | Kebutuhan utama |
| --- | --- |
| Pendaki pemula dan mahasiswa | Melihat fungsi, kapasitas, dan tarif perlengkapan dengan jelas |
| Pendaki berpengalaman | Menemukan barang dan menyusun pesanan dengan cepat |
| Koordinator kelompok | Memesan beberapa jenis barang dengan jumlah berbeda |
| Pengelola rental | Menerima ringkasan permintaan untuk pengecekan stok dan tindak lanjut |

## 4. Ruang lingkup MVP
1. Beranda berisi penjelasan layanan, ajakan melihat katalog, alur penyewaan, dan kontak.
2. Katalog dengan nama, kategori, deskripsi, kapasitas/ukuran, foto atau ilustrasi lokal, serta harga per unit per hari.
3. Pencarian berdasarkan nama dan filter kategori: tenda, tas carrier, perlengkapan tidur, memasak, serta aksesori.
4. Keranjang: tambah barang, ubah jumlah, hapus barang, dan tampilkan subtotal.
5. Pemilihan tanggal pengambilan dan pengembalian beserta estimasi durasi dan total biaya.
6. Formulir nama penyewa dan nomor WhatsApp, lalu ringkasan yang dapat diperiksa sebelum membuka WhatsApp toko.
7. Penyimpanan keranjang pada browser yang sama dengan localStorage, termasuk pemulihan aman jika data rusak.
8. Informasi syarat sewa, pengambilan/pengembalian di toko, FAQ, dan pemberitahuan bahwa stok perlu dikonfirmasi.
9. Tata letak responsif dan interaksi yang dapat dioperasikan menggunakan keyboard.

### Di luar MVP
Akun pengguna, panel admin, stok real-time, pemesanan terjamin, pembayaran online, pengiriman, unggah identitas, ulasan pelanggan, dan database transaksi. Pengelola memperbarui katalog melalui berkas sumber.

## 5. Aturan bisnis
- Mata uang IDR; harga disimpan sebagai bilangan bulat rupiah dan ditampilkan menggunakan format Indonesia.
- Tanggal pengembalian harus setelah tanggal pengambilan. Sewa pada tanggal yang sama belum didukung.
- Durasi = selisih hari kalender pengembalian dan pengambilan, minimum 1 hari. Contoh: 10–12 November = 2 hari.
- Gunakan selisih tanggal kalender, bukan pembagian jam lokal yang rentan perubahan zona waktu. Tanggal pengambilan tidak boleh sebelum tanggal hari ini pada perangkat pengguna.
- Subtotal barang = harga harian × jumlah × durasi. Total = jumlah seluruh subtotal.
- Batas jumlah teknis 1–99 unit per barang; batas ini bukan informasi stok.
- Total website adalah estimasi biaya sewa. Deposit, denda, dan biaya lain belum dihitung; pengelola menyampaikan ketentuannya sebelum pengguna menyetujui transaksi.
- Pengajuan WhatsApp tidak otomatis menjadi reservasi. Reservasi baru disepakati setelah pengelola memeriksa stok, ketentuan, dan pembayaran secara manual.
- Pengguna harus menekan kirim sendiri di WhatsApp. Website tidak dapat memastikan apakah pesan terkirim atau diterima.

## 6. Alur utama
Buka beranda → telusuri katalog → cari/filter → tambah perlengkapan → atur jumlah dan tanggal → isi kontak → periksa estimasi serta ketentuan → buka WhatsApp → kirim pesan → pengelola mengonfirmasi secara manual.

## 7. Kriteria penerimaan
- Pencarian dan filter bekerja bersamaan; hasil kosong memiliki pesan dan tombol reset.
- Barang dengan ID yang sama digabung dalam satu baris keranjang.
- Keranjang kosong tidak dapat diajukan; jumlah tidak valid dan tanggal terbalik ditolak dengan pesan jelas.
- Contoh verifikasi: 2 tenda seharga Rp50.000/hari dan 1 matras Rp10.000/hari selama 2 hari menghasilkan Rp220.000.
- Pesan WhatsApp berisi nama, kontak, nama dan jumlah barang, tanggal, durasi, rincian biaya, total estimasi, serta permintaan konfirmasi stok.
- Jika nomor toko belum diatur, pengajuan dinonaktifkan dan petunjuk konfigurasi hanya ada dalam dokumentasi pengembang.
- Muat ulang memulihkan keranjang yang valid; kegagalan localStorage tidak menghentikan penggunaan katalog.
- Pada lebar 360 px tidak muncul gulir horizontal halaman; seluruh kontrol utama bisa digunakan dengan keyboard.

## 8. Metrik keberhasilan
Target berikut merupakan sasaran awal, bukan hasil yang telah diukur.

| Metrik | Target awal | Cara ukur |
| --- | --- | --- |
| Keberhasilan tugas | ≥ 4 dari 5 peserta dapat menyusun pengajuan tanpa bantuan | Uji tugas dengan calon pengguna |
| Waktu menyusun pengajuan | Median ≤ 3 menit | Uji tugas dari katalog sampai ringkasan |
| Kelengkapan permintaan | ≥ 90% permintaan mencantumkan barang, jumlah, tanggal, dan kontak | Rekap manual pengelola selama 30 hari |
| Akurasi estimasi | 100% skenario perhitungan yang disepakati lolos | Pemeriksaan kasus hitung sebelum rilis |
| Kemudahan seluler | Semua alur utama berhasil pada lebar 360, 768, dan 1280 px | Pemeriksaan responsif |

MVP tidak memasang analitik atau pelacak. Klik WhatsApp tidak dihitung sebagai transaksi berhasil. Perbandingan konversi baru dilakukan bila pencatatan kunjungan dan persetujuan privasi sudah dirancang.

## 9. Risiko dan dependensi
Katalog dapat tertinggal dari kondisi stok; tampilkan penjelasan konfirmasi manual. WhatsApp bergantung pada layanan eksternal dan perangkat pengguna. Foto, nomor toko, lokasi, tarif, jam operasional, syarat deposit, serta kebijakan keterlambatan harus disediakan pengelola sebelum rilis.
