// js/cart.js - Manipulasi Keranjang & Perhitungan Murni Sesuai SOP
export function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateSubtotal(cartItems, products) {
  let subtotal = 0;
  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  }
  return subtotal;
}

export function calculateGrandTotal(subtotal, shippingMethod) {
  if (subtotal === 0) return 0;
  const shippingCost = shippingMethod ? shippingMethod.price : 0;
  return subtotal + shippingCost;
}

export function addToCart(cartItems, productId, quantity = 1) {
  const existingIndex = cartItems.findIndex((i) => i.productId === productId);
  if (existingIndex > -1) {
    const newQty = Math.min(99, cartItems[existingIndex].quantity + quantity);
    const updated = [...cartItems];
    updated[existingIndex] = { productId, quantity: newQty };
    return updated;
  }
  return [...cartItems, { productId, quantity: Math.min(99, Math.max(1, quantity)) }];
}

export function updateQuantity(cartItems, productId, delta) {
  return cartItems
    .map((item) => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return null;
        if (newQty > 99) return { ...item, quantity: 99 };
        return { ...item, quantity: newQty };
      }
      return item;
    })
    .filter(Boolean);
}

export function removeFromCart(cartItems, productId) {
  return cartItems.filter((i) => i.productId !== productId);
}

export function getTotalCount(cartItems) {
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
}
