# Catatan Verifikasi — Puncak Rental

Tanggal pemeriksaan: 19 Oktober 2026. Status: implementasi lokal dengan 10 produk contoh; belum dipublikasikan dan belum menjadi layanan reservasi aktif.

## Hasil pemeriksaan

- **8 kelompok pengujian otomatis lulus**, dijalankan dengan `npm test` menggunakan Node.js 24. Mencakup jumlah/keunikan produk dan kategori, pencarian/filter gabungan, tanggal lintas bulan/tahun dan tahun kabisat, penolakan tanggal tidak valid, total Rp220.000, batas jumlah, pemulihan storage, penolakan data manipulasi, privasi penyimpanan, validasi kontak, dan encoding draf WhatsApp.
- **Pemeriksaan sintaks seluruh 6 modul JavaScript lulus** menggunakan `node --check`.
- **Smoke test browser Chrome headless lulus** melalui Chrome DevTools Protocol pada server HTTP lokal: katalog 10 produk, filter gabungan dan reset, penambahan barang yang sama, perubahan jumlah, estimasi biaya, fokus validasi nama, rendering nama sebagai teks, pembatalan ringkasan setelah perubahan, nomor usaha kosong, pemulihan keranjang setelah reload, dan pemulihan JSON rusak.
- **Responsif:** tidak ditemukan overflow horizontal pada lebar viewport 320, 360, 768, dan 1280 CSS px dengan keranjang terisi. Ilustrasi dan tampilan halaman diperiksa melalui tangkapan layar desktop dan ponsel.
- **Keyboard dasar:** tombol Tab pertama mencapai skip link. Kontrol memakai elemen HTML native dan fokus validasi menuju field yang bermasalah.
- Tidak ditemukan exception JavaScript atau respons HTTP aset berstatus gagal selama smoke test.
- Paket statis dibentuk dengan `python3 scripts/package_site.py`; hanya berkas runtime HTML, CSS, JavaScript, dan SVG yang disertakan.

## Menjalankan ulang smoke test browser

Sediakan server lokal pada `http://127.0.0.1:5500` dan Chrome headless dengan debugging port `9222` pada mesin pengembangan. Kemudian jalankan:

```bash
node tests/browser-smoke.mjs
```

Script ini memakai WebSocket bawaan Node.js 24, mengoperasikan tab Chrome lokal, mengosongkan localStorage pada origin pengembangan, dan menyimpan screenshot di `artifacts/`. Gunakan profil Chrome khusus pengujian. Tidak membuka atau mengirim pesan WhatsApp; pengujian URL memakai nomor uji hanya di memori.

## Batas verifikasi dan kesiapan rilis

- Belum dilakukan audit WCAG formal, pengujian screen reader, pengujian keyboard menyeluruh, zoom browser 200%, maupun pengujian Safari/Firefox dan perangkat fisik.
- Belum dilakukan uji tugas terhadap 5 calon pengguna; target metrik pada PRD belum diukur.
- Nomor WhatsApp usaha, alamat, jam operasional, dan ketentuan transaksi belum disediakan. Nomor usaha dibiarkan kosong dan tombol pengajuan WhatsApp nonaktif sesuai SOP. Penyusunan serta pemeriksaan estimasi tetap berfungsi.
- Harga, spesifikasi, dan ilustrasi merupakan contoh. Verifikasi terhadap inventaris usaha sebelum rilis.
- Tidak ada backend, stok real-time, pembayaran, atau penyimpanan transaksi. Seluruh konfirmasi dilakukan manual setelah pengguna mengirim pesan.
- Belum ada URL hosting atau pengujian produksi. Paket lokal siap ditinjau; peluncuran memerlukan data usaha dan pemeriksaan rilis yang belum dilakukan di atas.

## Pembaruan gambar — 19 Oktober 2026

- Mengganti seluruh 10 ilustrasi produk dengan gambar fotorealistis hasil fitur bawaan `image_gen`, ditambah satu gambar hero pegunungan. Semua hasil telah diperiksa secara visual.
- Aset WebP tersimpan lokal di `assets/images/`, total 444.396 byte (sekitar 434 KiB). Sepuluh gambar produk berukuran 800 × 533 px; gambar hero berukuran 960 × 1200 px. Tidak ada hotlink atau dependensi foto internet.
- Prompt lengkap dan asal generasi dicatat di `assets/images/generation-prompts.json`. Salinan PNG asli dan ilustrasi lama tersimpan di `artifacts/` dan tidak masuk paket publik.
- Semua 11 aset berhasil dimuat melalui HTTP 200 dan di-decode oleh Chrome. Smoke test aplikasi kembali lulus, termasuk empat lebar layar, tanpa error runtime atau aset hilang.
- Paket `artifacts/puncak-rental.zip` diperbarui dengan seluruh gambar WebP. Gambar bersifat representatif AI, bukan foto inventaris toko.
