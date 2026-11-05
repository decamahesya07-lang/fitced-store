// js/app.js - Inisialisasi Utama, Render DOM Semantik, Event Listeners Sesuai SOP
import { CONFIG, SHIPPING_METHODS } from "./config.js";
import { PRODUCTS, CATEGORIES } from "./data.js";
import {
  formatRupiah,
  calculateSubtotal,
  calculateGrandTotal,
  addToCart,
  updateQuantity,
  removeFromCart,
  getTotalCount
} from "./cart.js";
import { loadCartFromStorage, saveCartToStorage } from "./storage.js";
import {
  validateCheckoutForm,
  generateWhatsAppMessage,
  buildWhatsAppUrl
} from "./checkout.js";

// State Aplikasi
let state = {
  cart: [],
  selectedCategory: "all",
  searchQuery: "",
  selectedShippingId: "regular",
  isDrawerOpen: false,
  isReviewModalOpen: false,
  draftMessage: ""
};

// Selektor Elemen DOM
const dom = {
  productGrid: document.getElementById("product-grid"),
  categoryContainer: document.getElementById("category-filter-container"),
  searchInput: document.getElementById("catalog-search-input"),
  catalogCountText: document.getElementById("catalog-count-text"),
  resetCatalogBtn: document.getElementById("reset-catalog-btn"),

  // Drawer Keranjang
  openCartBtn: document.getElementById("open-cart-btn"),
  closeDrawerBtn: document.getElementById("close-drawer-btn"),
  cartDrawer: document.getElementById("cart-drawer"),
  drawerBackdrop: document.getElementById("drawer-backdrop"),
  cartDrawerItems: document.getElementById("cart-drawer-items"),
  headerCartBadge: document.getElementById("header-cart-badge"),
  drawerSubtotalVal: document.getElementById("drawer-subtotal-val"),
  drawerTotalVal: document.getElementById("drawer-total-val"),
  drawerToCheckoutBtn: document.getElementById("drawer-to-checkout-btn"),

  // Checkout Section
  checkoutForm: document.getElementById("checkout-form"),
  customerNameInput: document.getElementById("customer-name"),
  customerPhoneInput: document.getElementById("customer-phone"),
  customerAddressInput: document.getElementById("customer-address"),
  customerNoteInput: document.getElementById("customer-note"),
  addressFormGroup: document.getElementById("address-form-group"),
  shippingContainer: document.getElementById("shipping-methods-container"),
  nameError: document.getElementById("name-error"),
  phoneError: document.getElementById("phone-error"),
  addressError: document.getElementById("address-error"),

  // Ringkasan Samping
  summaryItemsList: document.getElementById("summary-items-list"),
  summarySubtotalVal: document.getElementById("summary-subtotal-val"),
  summaryShippingVal: document.getElementById("summary-shipping-val"),
  summaryTotalVal: document.getElementById("summary-total-val"),

  // Modal Review
  orderReviewModal: document.getElementById("order-review-modal"),
  closeReviewModalBtn: document.getElementById("close-review-modal-btn"),
  btnEditOrder: document.getElementById("btn-edit-order"),
  btnSendWhatsapp: document.getElementById("btn-send-whatsapp"),
  modalMessagePreview: document.getElementById("modal-message-preview"),

  // Toast & Live Region
  toastContainer: document.getElementById("toast-container"),
  liveRegion: document.getElementById("live-region")
};

// Inisialisasi
function init() {
  // Muat keranjang tersimpan dari storage aman
  state.cart = loadCartFromStorage(PRODUCTS);
  if (state.cart.length === 0) {
    // Berikan 2 produk contoh awal agar pengguna langsung melihat alur
    state.cart = [
      { productId: "prod-1", quantity: 1 },
      { productId: "prod-5", quantity: 1 }
    ];
    saveCartToStorage(state.cart);
  }

  renderCategoryButtons();
  renderProducts();
  renderShippingOptions();
  updateCartUI();
  setupEventListeners();
}

// Tampilkan Toast
function showToast(message) {
  if (!dom.toastContainer) return;
  dom.toastContainer.textContent = message;
  dom.toastContainer.removeAttribute("aria-hidden");
  dom.toastContainer.classList.add("show");

  if (dom.liveRegion) {
    dom.liveRegion.textContent = message;
  }

  setTimeout(() => {
    dom.toastContainer.classList.remove("show");
    dom.toastContainer.setAttribute("aria-hidden", "true");
  }, 2800);
}

// Render Tombol Kategori
function renderCategoryButtons() {
  if (!dom.categoryContainer) return;
  dom.categoryContainer.innerHTML = "";

  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn-category ${state.selectedCategory === cat.id ? "active" : ""}`;
    btn.setAttribute("data-category", cat.id);

    const count =
      cat.id === "all"
        ? PRODUCTS.length
        : PRODUCTS.filter((p) => p.category === cat.id).length;

    btn.textContent = `${cat.label} (${count})`;
    btn.addEventListener("click", () => {
      state.selectedCategory = cat.id;
      renderCategoryButtons();
      renderProducts();
    });
    dom.categoryContainer.appendChild(btn);
  });
}

// Render Katalog Produk
function renderProducts() {
  if (!dom.productGrid) return;

  const query = state.searchQuery.toLowerCase().trim();
  const filtered = PRODUCTS.filter((prod) => {
    const matchCategory =
      state.selectedCategory === "all" || prod.category === state.selectedCategory;
    const matchSearch =
      query === "" ||
      prod.name.toLowerCase().includes(query) ||
      prod.description.toLowerCase().includes(query) ||
      prod.specification.toLowerCase().includes(query) ||
      (prod.bpom && prod.bpom.toLowerCase().includes(query));
    return matchCategory && matchSearch;
  });

  // Perbarui status bar
  if (dom.catalogCountText) {
    dom.catalogCountText.textContent = `Menampilkan ${filtered.length} dari ${PRODUCTS.length} produk`;
  }
  if (dom.resetCatalogBtn) {
    dom.resetCatalogBtn.style.display =
      state.selectedCategory !== "all" || query !== "" ? "inline-block" : "none";
  }

  dom.productGrid.innerHTML = "";

  if (filtered.length === 0) {
    dom.productGrid.innerHTML = `
      <div class="empty-catalog-box" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
        <p style="font-size: 1.125rem; font-weight: 700; color: var(--color-brand-dark);">Produk tidak ditemukan</p>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-top: 0.5rem;">Coba cari dengan kata kunci lain atau klik reset filter.</p>
      </div>
    `;
    return;
  }

  filtered.forEach((prod) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("aria-labelledby", `prod-title-${prod.id}`);

    const cartItem = state.cart.find((i) => i.productId === prod.id);
    const inCartQty = cartItem ? cartItem.quantity : 0;

    let badgeHtml = "";
    if (prod.badge) {
      badgeHtml = `<span class="product-badge badge-${prod.badgeType || "bpom"}">${prod.badge}</span>`;
    }

    card.innerHTML = `
      <div class="product-image-container">
        <img 
          src="${prod.image}" 
          alt="${prod.imageAlt}" 
          class="product-thumb" 
          loading="lazy" 
          referrerpolicy="no-referrer"
        />
        ${badgeHtml}
        <span class="product-weight-tag">${prod.weight}</span>
      </div>
      <div class="product-body">
        <div class="product-meta">
          <span class="product-cat-name">${prod.categoryLabel}</span>
          ${prod.bpom ? `<span class="product-bpom-text">${prod.bpom}</span>` : ""}
        </div>
        <h3 id="prod-title-${prod.id}" class="product-title">${prod.name}</h3>
        <p class="product-spec">${prod.specification}</p>
        <div class="product-price-row">
          <div>
            <span class="product-price tabular-nums">${formatRupiah(prod.price)}</span>
            ${prod.originalPrice ? `<span class="product-original-price tabular-nums">${formatRupiah(prod.originalPrice)}</span>` : ""}
          </div>
        </div>
        <div class="product-action-row">
          ${
            inCartQty > 0
              ? `
            <div class="cart-stepper-control">
              <button type="button" class="btn-step-minus" data-id="${prod.id}" aria-label="Kurangi kuantitas ${prod.name}">-</button>
              <span class="stepper-count tabular-nums">${inCartQty} di keranjang</span>
              <button type="button" class="btn-step-plus" data-id="${prod.id}" aria-label="Tambah kuantitas ${prod.name}">+</button>
            </div>
            `
              : `
            <button type="button" class="btn-add-cart" data-id="${prod.id}">
              <span>+ Tambah ke Keranjang</span>
            </button>
            `
          }
        </div>
      </div>
    `;

    // Event listener tambah keranjang
    const addBtn = card.querySelector(".btn-add-cart");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        state.cart = addToCart(state.cart, prod.id, 1);
        saveCartToStorage(state.cart);
        updateCartUI();
        renderProducts();
        showToast(`"${prod.name.slice(0, 28)}..." ditambahkan ke keranjang`);
      });
    }

    // Event listener stepper
    const minusBtn = card.querySelector(".btn-step-minus");
    const plusBtn = card.querySelector(".btn-step-plus");
    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        state.cart = updateQuantity(state.cart, prod.id, -1);
        saveCartToStorage(state.cart);
        updateCartUI();
        renderProducts();
      });
    }
    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        state.cart = updateQuantity(state.cart, prod.id, 1);
        saveCartToStorage(state.cart);
        updateCartUI();
        renderProducts();
      });
    }

    dom.productGrid.appendChild(card);
  });
}

// Render Opsi Pengiriman
function renderShippingOptions() {
  if (!dom.shippingContainer) return;
  dom.shippingContainer.innerHTML = "";

  SHIPPING_METHODS.forEach((method) => {
    const isSelected = state.selectedShippingId === method.id;
    const label = document.createElement("label");
    label.className = `shipping-option-item ${isSelected ? "selected" : ""}`;

    label.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
        <input 
          type="radio" 
          name="shipping-method" 
          value="${method.id}" 
          ${isSelected ? "checked" : ""}
          style="margin-top: 0.25rem; accent-color: var(--color-accent);"
        />
        <div>
          <div style="font-weight: 700; font-size: 0.875rem; color: var(--color-brand-dark);">
            ${method.name} <span class="shipping-badge">${method.badge}</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.2rem;">
            ${method.description} • Estimasi: ${method.estimatedDays}
          </div>
        </div>
      </div>
      <div class="shipping-price-val tabular-nums">
        ${method.price === 0 ? "GRATIS" : formatRupiah(method.price)}
      </div>
    `;

    const radio = label.querySelector('input[type="radio"]');
    radio.addEventListener("change", () => {
      state.selectedShippingId = method.id;
      renderShippingOptions();
      updateCartUI();

      // Atur visibilitas input alamat
      if (dom.addressFormGroup) {
        dom.addressFormGroup.style.display =
          method.id === "pickup" ? "none" : "block";
      }
    });

    dom.shippingContainer.appendChild(label);
  });
}

// Update Seluruh Tampilan Keranjang & Kalkulasi
function updateCartUI() {
  const totalCount = getTotalCount(state.cart);
  const subtotal = calculateSubtotal(state.cart, PRODUCTS);
  const currentShipping =
    SHIPPING_METHODS.find((s) => s.id === state.selectedShippingId) ||
    SHIPPING_METHODS[0];
  const grandTotal = calculateGrandTotal(subtotal, currentShipping);

  // Badge header
  if (dom.headerCartBadge) {
    dom.headerCartBadge.textContent = totalCount;
  }
  if (dom.openCartBtn) {
    dom.openCartBtn.setAttribute(
      "aria-label",
      `Buka Keranjang Belanja, memuat ${totalCount} barang`
    );
  }

  // Nilai di Drawer
  if (dom.drawerSubtotalVal) dom.drawerSubtotalVal.textContent = formatRupiah(subtotal);
  if (dom.drawerTotalVal) dom.drawerTotalVal.textContent = formatRupiah(grandTotal);

  // Nilai di Ringkasan Form Checkout Samping
  if (dom.summarySubtotalVal) dom.summarySubtotalVal.textContent = formatRupiah(subtotal);
  if (dom.summaryShippingVal) {
    dom.summaryShippingVal.textContent =
      currentShipping.price === 0 ? "Gratis" : formatRupiah(currentShipping.price);
  }
  if (dom.summaryTotalVal) dom.summaryTotalVal.textContent = formatRupiah(grandTotal);

  // Render Item di Drawer
  if (dom.cartDrawerItems) {
    dom.cartDrawerItems.innerHTML = "";
    if (state.cart.length === 0) {
      dom.cartDrawerItems.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
          <p style="font-weight: 600; font-size: 0.9375rem;">Keranjang belanja Anda kosong</p>
          <p style="font-size: 0.8125rem; margin-top: 0.35rem;">Silakan pilih suplemen atau alat gym dari katalog.</p>
        </div>
      `;
    } else {
      state.cart.forEach((item) => {
        const prod = PRODUCTS.find((p) => p.id === item.productId);
        if (!prod) return;

        const row = document.createElement("div");
        row.className = "cart-item-row";
        row.innerHTML = `
          <div class="cart-item-img-wrap">
            <img src="${prod.image}" alt="${prod.imageAlt}" class="cart-item-thumb" referrerpolicy="no-referrer" />
          </div>
          <div class="cart-item-info">
            <h4 class="cart-item-title">${prod.name}</h4>
            <div class="cart-item-price tabular-nums">${formatRupiah(prod.price)}</div>
            <div class="cart-item-ctrl">
              <div class="drawer-stepper">
                <button type="button" class="btn-drawer-minus" data-id="${prod.id}" aria-label="Kurangi kuantitas">-</button>
                <span class="tabular-nums" style="font-size: 0.8125rem; font-weight: 700; width: 1.5rem; text-align: center;">${item.quantity}</span>
                <button type="button" class="btn-drawer-plus" data-id="${prod.id}" aria-label="Tambah kuantitas">+</button>
              </div>
              <button type="button" class="btn-remove-drawer" data-id="${prod.id}" aria-label="Hapus ${prod.name}">
                Hapus
              </button>
            </div>
          </div>
        `;

        row.querySelector(".btn-drawer-minus").addEventListener("click", () => {
          state.cart = updateQuantity(state.cart, prod.id, -1);
          saveCartToStorage(state.cart);
          updateCartUI();
          renderProducts();
        });

        row.querySelector(".btn-drawer-plus").addEventListener("click", () => {
          state.cart = updateQuantity(state.cart, prod.id, 1);
          saveCartToStorage(state.cart);
          updateCartUI();
          renderProducts();
        });

        row.querySelector(".btn-remove-drawer").addEventListener("click", () => {
          state.cart = removeFromCart(state.cart, prod.id);
          saveCartToStorage(state.cart);
          updateCartUI();
          renderProducts();
          showToast(`"${prod.name.slice(0, 24)}..." dihapus dari keranjang`);
        });

        dom.cartDrawerItems.appendChild(row);
      });
    }
  }

  // Render Mini List di Ringkasan Form Checkout Samping
  if (dom.summaryItemsList) {
    dom.summaryItemsList.innerHTML = "";
    if (state.cart.length === 0) {
      dom.summaryItemsList.innerHTML = `
        <div style="text-align: center; padding: 1.5rem; color: var(--color-text-muted); font-size: 0.8125rem;">
          Belum ada produk yang dipilih.
        </div>
      `;
    } else {
      state.cart.forEach((item) => {
        const prod = PRODUCTS.find((p) => p.id === item.productId);
        if (!prod) return;

        const summaryRow = document.createElement("div");
        summaryRow.className = "summary-item-mini";
        summaryRow.innerHTML = `
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 700; font-size: 0.8125rem; color: var(--color-brand-dark); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${prod.name}
            </div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">
              ${item.quantity} × ${formatRupiah(prod.price)}
            </div>
          </div>
          <div style="font-weight: 700; font-size: 0.8125rem; color: var(--color-brand-dark); margin-left: 0.5rem;" class="tabular-nums">
            ${formatRupiah(prod.price * item.quantity)}
          </div>
        `;
        dom.summaryItemsList.appendChild(summaryRow);
      });
    }
  }
}

// Buka / Tutup Drawer Keranjang
function toggleDrawer(open) {
  state.isDrawerOpen = open;
  if (!dom.cartDrawer || !dom.drawerBackdrop) return;

  if (open) {
    dom.cartDrawer.classList.add("open");
    dom.cartDrawer.removeAttribute("aria-hidden");
    dom.drawerBackdrop.classList.add("visible");
    dom.drawerBackdrop.removeAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
  } else {
    dom.cartDrawer.classList.remove("open");
    dom.cartDrawer.setAttribute("aria-hidden", "true");
    dom.drawerBackdrop.classList.remove("visible");
    dom.drawerBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

// Buka / Tutup Modal Review WhatsApp
function toggleReviewModal(open) {
  state.isReviewModalOpen = open;
  if (!dom.orderReviewModal) return;

  if (open) {
    dom.orderReviewModal.classList.add("visible");
    dom.orderReviewModal.removeAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
  } else {
    dom.orderReviewModal.classList.remove("visible");
    dom.orderReviewModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

// Setup Seluruh Event Listener Native
function setupEventListeners() {
  // Drawer
  if (dom.openCartBtn) {
    dom.openCartBtn.addEventListener("click", () => toggleDrawer(true));
  }
  if (dom.closeDrawerBtn) {
    dom.closeDrawerBtn.addEventListener("click", () => toggleDrawer(false));
  }
  if (dom.drawerBackdrop) {
    dom.drawerBackdrop.addEventListener("click", () => toggleDrawer(false));
  }
  if (dom.drawerToCheckoutBtn) {
    dom.drawerToCheckoutBtn.addEventListener("click", () => {
      toggleDrawer(false);
      const checkoutEl = document.getElementById("checkout-section");
      if (checkoutEl) {
        checkoutEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Pencarian
  if (dom.searchInput) {
    dom.searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Reset Filter
  if (dom.resetCatalogBtn) {
    dom.resetCatalogBtn.addEventListener("click", () => {
      state.selectedCategory = "all";
      state.searchQuery = "";
      if (dom.searchInput) dom.searchInput.value = "";
      renderCategoryButtons();
      renderProducts();
    });
  }

  // Formulir Checkout
  if (dom.checkoutForm) {
    dom.checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Bersihkan error lama
      if (dom.nameError) dom.nameError.textContent = "";
      if (dom.phoneError) dom.phoneError.textContent = "";
      if (dom.addressError) dom.addressError.textContent = "";

      const currentShipping =
        SHIPPING_METHODS.find((s) => s.id === state.selectedShippingId) ||
        SHIPPING_METHODS[0];

      const formData = {
        name: dom.customerNameInput ? dom.customerNameInput.value : "",
        phone: dom.customerPhoneInput ? dom.customerPhoneInput.value : "",
        address: dom.customerAddressInput ? dom.customerAddressInput.value : "",
        note: dom.customerNoteInput ? dom.customerNoteInput.value : ""
      };

      const validation = validateCheckoutForm(
        formData,
        state.cart,
        currentShipping
      );

      if (!validation.isValid) {
        if (validation.errors.cart) {
          showToast(validation.errors.cart);
        }
        if (validation.errors.name && dom.nameError) {
          dom.nameError.textContent = validation.errors.name;
        }
        if (validation.errors.phone && dom.phoneError) {
          dom.phoneError.textContent = validation.errors.phone;
        }
        if (validation.errors.address && dom.addressError) {
          dom.addressError.textContent = validation.errors.address;
        }
        return;
      }

      // Susun pesan WhatsApp
      const subtotal = calculateSubtotal(state.cart, PRODUCTS);
      const grandTotal = calculateGrandTotal(subtotal, currentShipping);
      state.draftMessage = generateWhatsAppMessage(
        CONFIG,
        state.cart,
        PRODUCTS,
        currentShipping,
        validation.cleanedData,
        subtotal,
        grandTotal
      );

      // Tampilkan di modal review
      if (dom.modalMessagePreview) {
        dom.modalMessagePreview.textContent = state.draftMessage;
      }

      const waUrl = buildWhatsAppUrl(CONFIG, state.draftMessage);
      if (dom.btnSendWhatsapp) {
        dom.btnSendWhatsapp.href = waUrl;
      }

      toggleReviewModal(true);
    });
  }

  // Modal Review Events
  if (dom.closeReviewModalBtn) {
    dom.closeReviewModalBtn.addEventListener("click", () =>
      toggleReviewModal(false)
    );
  }
  if (dom.btnEditOrder) {
    dom.btnEditOrder.addEventListener("click", () => toggleReviewModal(false));
  }
  if (dom.btnSendWhatsapp) {
    dom.btnSendWhatsapp.addEventListener("click", () => {
      toggleReviewModal(false);
      showToast("Membuka WhatsApp toko...");
    });
  }

  // Keyboard Escape untuk menutup modal/drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (state.isReviewModalOpen) toggleReviewModal(false);
      if (state.isDrawerOpen) toggleDrawer(false);
    }
  });
}

// Jalankan aplikasi saat DOM siap
document.addEventListener("DOMContentLoaded", init);
