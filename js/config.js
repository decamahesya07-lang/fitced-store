// js/config.js - Identitas Usaha & Konfigurasi WhatsApp FitCed Store
export const CONFIG = {
  STORE_NAME: "FitCed Store",
  TAGLINE: "Suplemen Resmi & Peralatan Gym Berkualitas",
  // Nomor WhatsApp internasional digit saja tanpa +, spasi, atau tanda hubung
  WHATSAPP_NUMBER: "6289601091390",
  PHONE_DISPLAY: "+62 896-0109-1390",
  EMAIL: "halo@fitcedstore.id",
  ADDRESS: "Jl. Boulevard Kebugaran No. 88, Grand Sports Center, Jakarta Selatan 12430",
  HOURS: "Senin – Sabtu: 08.00 – 21.00 WIB | Minggu & Libur: 09.00 – 17.00 WIB"
};

export const SHIPPING_METHODS = [
  {
    id: "pickup",
    name: "Ambil di Toko Fisik (Self-Pickup)",
    badge: "Gratis",
    description: "Ambil langsung di Outlet Grand Sports Center Jaksel (08.00–21.00 WIB)",
    price: 0,
    estimatedDays: "Hari ini / Kapan saja"
  },
  {
    id: "regular",
    name: "Kurir Reguler Jabodetabek",
    badge: "Populer",
    description: "Pengiriman aman JNE / SiCepat ke seluruh area Jabodetabek",
    price: 20000,
    estimatedDays: "1 - 2 Hari Kerja"
  },
  {
    id: "instant",
    name: "Kurir Instan Kilat (Jabodetabek)",
    badge: "Cepat Sampai",
    description: "GrabExpress / GoSend langsung dikirim setelah verifikasi order",
    price: 35000,
    estimatedDays: "3 - 5 Jam"
  },
  {
    id: "cargo",
    name: "Ekspedisi Kargo Antarpulau",
    badge: "Hemat Beban Berat",
    description: "J&T Cargo / Indah Logistik untuk pengiriman ke seluruh kota di Indonesia",
    price: 65000,
    estimatedDays: "3 - 5 Hari Kerja"
  }
];
