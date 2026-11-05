# Panduan UI/UX — Puncak Rental

## 1. Arah desain
Tampilan bersih, hangat, dan terinspirasi suasana alam. Fokus utama adalah menemukan perlengkapan, memahami tarif, dan menyusun pengajuan. Semua teks antarmuka menggunakan bahasa Indonesia, termasuk pesan kesalahan. Nama merek sementara: Puncak Rental.

## 2. Token visual awal
| Elemen | Nilai/pedoman |
| --- | --- |
| Latar utama | `#F8FAF7` |
| Permukaan kartu | `#FFFFFF` |
| Teks utama | `#17251B` |
| Teks sekunder | `#46554A` |
| Warna utama | `#214D36`, dengan teks putih |
| Aksen dekoratif | `#D8A441`, dengan teks gelap bila menjadi latar |
| Kesalahan | `#B42318`, selalu disertai teks |
| Font | system-ui, sans-serif |
| Teks dasar | 16 px, line-height 1.5–1.6 |
| Radius | Kartu 16 px, input/tombol 10 px |
| Spasi | Kelipatan 4/8 px; jarak antarbagian 48–80 px |
| Lebar konten | Maksimum 1200 px, padding sisi minimal 16 px |

Verifikasi kontras pasangan warna pada implementasi, termasuk hover, fokus, dan disabled. Aksen dekoratif tidak dipakai sebagai teks kecil pada latar putih.

## 3. Susunan halaman
Header → hero → katalog → keranjang dan formulir → cara sewa → syarat/FAQ → kontak dan footer. Pada desktop, keranjang dapat menjadi kolom kanan katalog. Pada ponsel, gunakan bagian keranjang di bawah katalog dengan tombol menuju keranjang yang menampilkan jumlah unit. Hindari modal pada MVP agar alur keyboard lebih sederhana.

## 4. User journey
| Tahap | Tujuan pengguna | Respons antarmuka |
| --- | --- | --- |
| Mengenal | Memastikan layanan sesuai | Judul layanan, keterangan ambil di toko, tombol “Lihat perlengkapan” |
| Menemukan | Memilih barang sesuai kebutuhan | Pencarian, filter, foto, spesifikasi, harga per hari |
| Menyusun | Mengatur isi pengajuan | Tambah barang, jumlah, hapus, indikator jumlah keranjang |
| Menghitung | Mengetahui estimasi biaya | Tanggal, durasi, rincian, total |
| Memeriksa | Menghindari kesalahan | Ringkasan barang, kontak, tanggal, dan penjelasan ketentuan |
| Menghubungi | Meminta konfirmasi pengelola | Tombol “Ajukan via WhatsApp” dan keterangan pengguna perlu mengirim pesan |

## 5. Wireframe
### Desktop
```text
┌──────────────────────────────────────────────────────────┐
│ Puncak Rental       Katalog  Cara sewa  FAQ  Kontak        │
├──────────────────────────────────────────────────────────┤
│ Siap mendaki? Sewa perlengkapanmu.     Visual pendakian    │
│ [Lihat perlengkapan]                                      │
├────────────────────────────────────┬─────────────────────┤
│ Katalog                            │ Keranjang (3 unit)  │
│ [Cari alat...]                     │ Barang / jumlah     │
│ [Semua] [Tenda] [Carrier] [...]     │ Tanggal mulai/akhir │
│ [Kartu]  [Kartu]  [Kartu]           │ Durasi dan estimasi │
│ [Kartu]  [Kartu]  [Kartu]           │ Nama / WhatsApp     │
│                                    │ [Periksa pengajuan] │
├────────────────────────────────────┴─────────────────────┤
│ Cara sewa → Syarat dan FAQ → Kontak → Footer              │
└──────────────────────────────────────────────────────────┘
```
### Ponsel
```text
┌────────────────────────────┐
│ Puncak Rental  [Keranjang] │
│ Judul dan deskripsi       │
│ [Lihat perlengkapan]      │
│ [Cari alat...]            │
│ [Kategori ▼]              │
│ [Kartu perlengkapan]      │
│ [Kartu perlengkapan]      │
│ Keranjang dan jumlah     │
│ Tanggal mulai / akhir    │
│ Estimasi total           │
│ Formulir dan ringkasan   │
│ [Ajukan via WhatsApp]    │
│ Cara sewa / FAQ / kontak │
└────────────────────────────┘
```

## 6. Komponen dan keadaan
- **Navigasi:** tautan anchor, fokus terlihat, skip link menuju konten utama.
- **Kartu alat:** gambar dengan rasio tetap, nama, spesifikasi, tarif “Rp50.000 / unit / hari”, tombol “Tambah”. Tidak menampilkan klaim stok tersedia.
- **Pencarian/filter:** label jelas, jumlah hasil, tombol reset jika tidak ada hasil; kategori aktif terlihat dan terpapar secara semantik.
- **Kontrol jumlah:** tombol kurang/tambah serta input bilangan dengan label barang; minimum 1, maksimum 99. Penghapusan melalui tombol “Hapus”.
- **Tanggal:** label “Tanggal pengambilan” dan “Tanggal pengembalian”, petunjuk cara menghitung hari, serta error dekat field.
- **Ringkasan:** nama barang, jumlah, harga harian, durasi, subtotal, dan total estimasi; saat tanggal kosong tampilkan “Pilih tanggal untuk menghitung biaya”.
- **Formulir kontak:** nama 2–80 karakter setelah trim, nomor WhatsApp 8–15 digit setelah spasi, tanda hubung, kurung, dan tanda tambah awal dinormalisasi. Terima awalan 08 maupun 62; jangan mengklaim validasi ini memastikan nomor terdaftar.
- **Pemeriksaan pengajuan:** tampilkan ringkasan dalam halaman, sediakan “Ubah pengajuan” dan “Ajukan via WhatsApp”. Perubahan keranjang/tanggal mengharuskan pemeriksaan ulang.
- **Pemberitahuan:** penambahan barang dan kegagalan penyimpanan memakai area status; hindari notifikasi yang merebut fokus.
- **FAQ:** elemen `details` dan `summary` untuk interaksi native.

## 7. Contoh microcopy
- Keranjang kosong: “Belum ada perlengkapan. Pilih alat untuk memulai.”
- Hasil kosong: “Perlengkapan tidak ditemukan. Coba kata lain atau reset filter.”
- Tanggal salah: “Tanggal pengembalian harus setelah tanggal pengambilan.”
- Penyimpanan gagal: “Keranjang dapat digunakan, tetapi belum bisa disimpan pada browser ini.”
- Sebelum WhatsApp: “Nama, nomor kontak, dan rincian pengajuan akan dibuka di WhatsApp. Kirim pesan untuk meminta konfirmasi stok. Total ini adalah estimasi biaya sewa.”
- Pengajuan belum dikonfigurasi: “Pengajuan online belum tersedia. Silakan gunakan kontak toko yang tercantum.” Hanya tampilkan kontak yang benar-benar sudah disediakan.

## 8. Aksesibilitas
Target implementasi mengacu pada prinsip WCAG 2.2 tingkat AA, dengan verifikasi sebelum mengklaim kepatuhan.
- Gunakan `lang="id"`, landmark semantik, satu `h1`, dan urutan heading logis.
- Semua fungsi bisa digunakan melalui keyboard; jangan membuat kartu `div` sebagai tombol.
- Setiap input memiliki `label`; error dihubungkan melalui `aria-describedby` dan `aria-invalid`.
- Setelah validasi gagal, fokus ke field salah pertama. Pembaruan keranjang memakai `aria-live="polite"` tanpa membacakan ulang seluruh halaman.
- Targetkan kontras teks normal minimal 4.5:1 dan teks besar 3:1; kontrol serta indikator fokus minimal 3:1 terhadap warna sekitar.
- Target sentuh minimal 44 × 44 CSS px, fokus terlihat, dan tidak tertutup elemen sticky.
- Informasi tidak bergantung hanya pada warna atau hover. Gambar informatif memiliki alt; gambar dekoratif memakai alt kosong.
- Dukung pembesaran teks dan zoom 200%; periksa reflow hingga 320 CSS px.
- Hormati `prefers-reduced-motion`; animasi tidak diperlukan untuk menjalankan tugas.

## 9. Validasi pengalaman
Jalankan skenario tambah beberapa alat, ubah jumlah, isi tanggal salah, koreksi tanggal, periksa total, dan buka WhatsApp. Ulangi dengan keyboard serta layar kecil. Catat hambatan 5 calon pengguna dan perbaiki hambatan utama sebelum peluncuran.
