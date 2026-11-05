// js/checkout.js - Validasi Formulir & Pembentukan Tautan WhatsApp Sesuai SOP
import { formatRupiah } from "./cart.js";

export function validateCheckoutForm(formData, cartItems, shippingMethod) {
  const errors = {};

  if (!cartItems || cartItems.length === 0) {
    errors.cart = "Keranjang belanja masih kosong. Silakan pilih produk terlebih dahulu.";
    return { isValid: false, errors };
  }

  const name = formData.name ? formData.name.trim() : "";
  if (!name || name.length < 2) {
    errors.name = "Nama lengkap wajib diisi minimal 2 karakter.";
  } else if (name.length > 80) {
    errors.name = "Nama lengkap maksimal 80 karakter.";
  }

  const phone = formData.phone ? formData.phone.trim() : "";
  const cleanedPhone = phone.replace(/[\s-]/g, "");
  if (!cleanedPhone) {
    errors.phone = "Nomor WhatsApp aktif wajib diisi.";
  } else if (!/^(08|62|\+62)[0-9]{8,15}$/.test(cleanedPhone)) {
    errors.phone = "Format nomor WhatsApp tidak valid (contoh: 081234567890 atau 6281234567890).";
  }

  if (shippingMethod && shippingMethod.id !== "pickup") {
    const address = formData.address ? formData.address.trim() : "";
    if (!address || address.length < 8) {
      errors.address = "Alamat pengiriman lengkap wajib diisi minimal 8 karakter.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    cleanedData: {
      name,
      phone: cleanedPhone,
      address: formData.address ? formData.address.trim() : "",
      note: formData.note ? formData.note.trim() : ""
    }
  };
}

export function generateWhatsAppMessage(config, cartItems, products, shippingMethod, customerData, subtotal, grandTotal) {
  const lines = [];
  lines.push(`Halo Admin ${config.STORE_NAME}, saya ingin memesan produk suplemen & fitness dari website:`);
  lines.push(``);
  lines.push(`📋 *DAFTAR PESANAN:*`);

  cartItems.forEach((item, index) => {
    const prod = products.find((p) => p.id === item.productId);
    if (prod) {
      lines.push(`${index + 1}. *${prod.name}*`);
      lines.push(`   - Qty: ${item.quantity} pcs (${prod.weight})`);
      lines.push(`   - Harga: ${formatRupiah(prod.price)}`);
      lines.push(`   - Subtotal: ${formatRupiah(prod.price * item.quantity)}`);
    }
  });

  lines.push(``);
  lines.push(`💵 *Subtotal Barang:* ${formatRupiah(subtotal)}`);
  lines.push(`🚚 *Metode Kirim:* ${shippingMethod.name} (${shippingMethod.price === 0 ? "Gratis" : formatRupiah(shippingMethod.price)})`);
  lines.push(`🔥 *TOTAL ESTIMASI:* ${formatRupiah(grandTotal)}`);
  lines.push(``);
  lines.push(`👤 *DATA PENERIMA:*`);
  lines.push(`- *Nama:* ${customerData.name}`);
  lines.push(`- *WhatsApp:* ${customerData.phone}`);
  if (shippingMethod.id !== "pickup") {
    lines.push(`- *Alamat Pengiriman:* ${customerData.address}`);
  } else {
    lines.push(`- *Opsi:* Ambil Langsung di Outlet FitCed Store`);
  }
  if (customerData.note) {
    lines.push(`- *Catatan:* ${customerData.note}`);
  }
  lines.push(``);
  lines.push(`Mohon info konfirmasi ketersediaan stok fisik dan nomor rekening resmi toko untuk penyelesaian pembayaran. Terima kasih!`);

  return lines.join("\n");
}

export function buildWhatsAppUrl(config, message) {
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${config.WHATSAPP_NUMBER}?text=${encodedText}`;
}
