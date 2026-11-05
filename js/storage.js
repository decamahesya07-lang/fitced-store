// js/storage.js - Baca & Tulis Aman localStorage Sesuai SOP
const STORAGE_KEY = "fitced_store:cart:v1";
const SCHEMA_VERSION = 1;

export function loadCartFromStorage(validProducts) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== SCHEMA_VERSION || !Array.isArray(parsed.items)) {
      return [];
    }

    // Validasi setiap item: pastikan ID ada di katalog dan quantity integer 1-99
    const validItems = [];
    for (const item of parsed.items) {
      if (
        item &&
        typeof item.productId === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= 99
      ) {
        const productExists = validProducts.some((p) => p.id === item.productId);
        if (productExists) {
          validItems.push({
            productId: item.productId,
            quantity: item.quantity
          });
        }
      }
    }
    return validItems;
  } catch (err) {
    console.warn("Gagal membaca localStorage, memulihkan state kosong.", err);
    return [];
  }
}

export function saveCartToStorage(items) {
  try {
    const payload = {
      schemaVersion: SCHEMA_VERSION,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity
      }))
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn("Penyimpanan localStorage gagal.", err);
    return false;
  }
}
