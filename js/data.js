/* ================================================
   DATA LAYER — Prices in Algerian Dinar (DZD)
   Delivery prices for all 58 wilayas
   ================================================ */

const Store = (() => {
  const KEYS = {
    products: 'natural_store_products',
    images: 'natural_store_images',
    cart: 'natural_store_cart',
    orders: 'natural_store_orders',
    adminAuth: 'natural_store_admin_auth',
    deliveryPrices: 'natural_store_delivery_prices'
  };

  const DEFAULT_PRODUCTS = [
    // HERBS & SPICES
    { id: 'hs-001', price: 850, category: 'herbs-spices', images: [] },
    { id: 'hs-002', price: 3500, category: 'herbs-spices', images: [] },
    { id: 'hs-003', price: 550, category: 'herbs-spices', images: [] },
    { id: 'hs-004', price: 650, category: 'herbs-spices', images: [] },
    { id: 'hs-005', price: 750, category: 'herbs-spices', images: [] },
    // HONEY
    { id: 'hp-001', price: 2800, category: 'honey', images: [] },
    { id: 'hp-002', price: 6500, category: 'honey', images: [] },
    { id: 'hp-003', price: 3200, category: 'honey', images: [] },
    { id: 'hp-004', price: 2400, category: 'honey', images: [] },
    { id: 'hp-005', price: 3000, category: 'honey', images: [] },
    // WEIGHT GAIN
    { id: 'wg-001', price: 2200, category: 'weight-gain', images: [] },
    { id: 'wg-002', price: 1500, category: 'weight-gain', images: [] },
    { id: 'wg-003', price: 1800, category: 'weight-gain', images: [] },
    { id: 'wg-004', price: 2800, category: 'weight-gain', images: [] },
    // DETOX
    { id: 'dx-001', price: 1600, category: 'detox', images: [] },
    { id: 'dx-002', price: 1800, category: 'detox', images: [] },
    { id: 'dx-003', price: 2200, category: 'detox', images: [] },
    { id: 'dx-004', price: 1200, category: 'detox', images: [] },
    // HAIR & SKIN
    { id: 'hc-001', price: 2500, category: 'hair-skin', images: [] },
    { id: 'hc-002', price: 2000, category: 'hair-skin', images: [] },
    { id: 'hc-003', price: 1500, category: 'hair-skin', images: [] },
    { id: 'hc-004', price: 1200, category: 'hair-skin', images: [] },
    { id: 'hc-005', price: 1800, category: 'hair-skin', images: [] },
    // WELLNESS
    { id: 'wl-001', price: 2100, category: 'wellness', images: [] },
    { id: 'wl-002', price: 1700, category: 'wellness', images: [] },
    { id: 'wl-003', price: 1300, category: 'wellness', images: [] },
    { id: 'wl-004', price: 1900, category: 'wellness', images: [] },
    { id: 'wl-005', price: 2400, category: 'wellness', images: [] },
  ];

  const CATEGORIES = [
    { slug: 'herbs-spices', icon: '🌿', color: '#2D5016' },
    { slug: 'honey', icon: '🍯', color: '#8B6914' },
    { slug: 'weight-gain', icon: '💪', color: '#6B4226' },
    { slug: 'detox', icon: '🍵', color: '#2E7D32' },
    { slug: 'hair-skin', icon: '✨', color: '#5D4037' },
    { slug: 'wellness', icon: '🌱', color: '#33691E' },
  ];

  /* ============ DELIVERY PRICES — ALL 58 WILAYAS (DZD) ============ */
  const DEFAULT_DELIVERY_PRICES = [
    { code: '01', ar: 'أدرار', en: 'Adrar', price: 1200 },
    { code: '02', ar: 'الشلف', en: 'Chlef', price: 600 },
    { code: '03', ar: 'الأغواط', en: 'Laghouat', price: 800 },
    { code: '04', ar: 'أم البواقي', en: 'Oum El Bouaghi', price: 700 },
    { code: '05', ar: 'باتنة', en: 'Batna', price: 700 },
    { code: '06', ar: 'بجاية', en: 'Béjaïa', price: 600 },
    { code: '07', ar: 'بسكرة', en: 'Biskra', price: 800 },
    { code: '08', ar: 'بشار', en: 'Béchar', price: 1200 },
    { code: '09', ar: 'البليدة', en: 'Blida', price: 400 },
    { code: '10', ar: 'البويرة', en: 'Bouira', price: 500 },
    { code: '11', ar: 'تمنراست', en: 'Tamanrasset', price: 1500 },
    { code: '12', ar: 'تبسة', en: 'Tébessa', price: 800 },
    { code: '13', ar: 'تلمسان', en: 'Tlemcen', price: 800 },
    { code: '14', ar: 'تيارت', en: 'Tiaret', price: 700 },
    { code: '15', ar: 'تيزي وزو', en: 'Tizi Ouzou', price: 500 },
    { code: '16', ar: 'الجزائر', en: 'Algiers', price: 400 },
    { code: '17', ar: 'الجلفة', en: 'Djelfa', price: 700 },
    { code: '18', ar: 'جيجل', en: 'Jijel', price: 600 },
    { code: '19', ar: 'سطيف', en: 'Sétif', price: 600 },
    { code: '20', ar: 'سعيدة', en: 'Saïda', price: 800 },
    { code: '21', ar: 'سكيكدة', en: 'Skikda', price: 600 },
    { code: '22', ar: 'سيدي بلعباس', en: 'Sidi Bel Abbès', price: 800 },
    { code: '23', ar: 'عنابة', en: 'Annaba', price: 600 },
    { code: '24', ar: 'قالمة', en: 'Guelma', price: 700 },
    { code: '25', ar: 'قسنطينة', en: 'Constantine', price: 600 },
    { code: '26', ar: 'المدية', en: 'Médéa', price: 500 },
    { code: '27', ar: 'مستغانم', en: 'Mostaganem', price: 700 },
    { code: '28', ar: 'المسيلة', en: 'M\'sila', price: 700 },
    { code: '29', ar: 'معسكر', en: 'Mascara', price: 700 },
    { code: '30', ar: 'ورقلة', en: 'Ouargla', price: 1000 },
    { code: '31', ar: 'وهران', en: 'Oran', price: 700 },
    { code: '32', ar: 'البيض', en: 'El Bayadh', price: 1000 },
    { code: '33', ar: 'إليزي', en: 'Illizi', price: 1500 },
    { code: '34', ar: 'برج بوعريريج', en: 'Bordj Bou Arréridj', price: 600 },
    { code: '35', ar: 'بومرداس', en: 'Boumerdès', price: 400 },
    { code: '36', ar: 'الطارف', en: 'El Tarf', price: 700 },
    { code: '37', ar: 'تندوف', en: 'Tindouf', price: 1500 },
    { code: '38', ar: 'تيسمسيلت', en: 'Tissemsilt', price: 700 },
    { code: '39', ar: 'الوادي', en: 'El Oued', price: 900 },
    { code: '40', ar: 'خنشلة', en: 'Khenchela', price: 800 },
    { code: '41', ar: 'سوق أهراس', en: 'Souk Ahras', price: 700 },
    { code: '42', ar: 'تيبازة', en: 'Tipaza', price: 400 },
    { code: '43', ar: 'ميلة', en: 'Mila', price: 600 },
    { code: '44', ar: 'عين الدفلى', en: 'Aïn Defla', price: 600 },
    { code: '45', ar: 'النعامة', en: 'Naâma', price: 1000 },
    { code: '46', ar: 'عين تموشنت', en: 'Aïn Témouchent', price: 800 },
    { code: '47', ar: 'غرداية', en: 'Ghardaïa', price: 900 },
    { code: '48', ar: 'غليزان', en: 'Relizane', price: 700 },
    { code: '49', ar: 'تيميمون', en: 'Timimoun', price: 1400 },
    { code: '50', ar: 'برج باجي مختار', en: 'Bordj Badji Mokhtar', price: 1600 },
    { code: '51', ar: 'أولاد جلال', en: 'Ouled Djellal', price: 900 },
    { code: '52', ar: 'بني عباس', en: 'Béni Abbès', price: 1300 },
    { code: '53', ar: 'عين صالح', en: 'In Salah', price: 1400 },
    { code: '54', ar: 'عين قزام', en: 'In Guezzam', price: 1600 },
    { code: '55', ar: 'توقرت', en: 'Touggourt', price: 900 },
    { code: '56', ar: 'جانت', en: 'Djanet', price: 1500 },
    { code: '57', ar: 'المغير', en: 'El M\'Ghair', price: 900 },
    { code: '58', ar: 'المنيعة', en: 'El Meniaa', price: 1000 },
  ];

  // Get localized category name
  function getCategoryName(slug) {
    return I18n.t('cat.' + slug);
  }

  function getCategoryDesc(slug) {
    return I18n.t('cat.' + slug + '.desc');
  }

  /* ============ DELIVERY PRICES ============ */
  function getDeliveryPrices() {
    const overrides = _load(KEYS.deliveryPrices);
    if (overrides) return overrides;
    return [...DEFAULT_DELIVERY_PRICES];
  }

  function saveDeliveryPrices(prices) { _save(KEYS.deliveryPrices, prices); }

  function getDeliveryPrice(wilayaCode) {
    const prices = getDeliveryPrices();
    const w = prices.find(p => p.code === wilayaCode);
    return w ? w.price : 0;
  }

  function updateDeliveryPrice(wilayaCode, newPrice) {
    const prices = getDeliveryPrices();
    const w = prices.find(p => p.code === wilayaCode);
    if (w) {
      w.price = newPrice;
      saveDeliveryPrices(prices);
    }
  }

  function getWilayaName(wilayaCode) {
    const prices = getDeliveryPrices();
    const w = prices.find(p => p.code === wilayaCode);
    if (!w) return '';
    return I18n.lang() === 'ar' ? w.ar : w.en;
  }

  /* PRODUCTS */
  function getProducts() {
    const overrides = _load(KEYS.products);
    if (overrides) return overrides;
    return [...DEFAULT_PRODUCTS];
  }

  function saveProducts(products) { _save(KEYS.products, products); }
  function resetProducts() { localStorage.removeItem(KEYS.products); }

  function getProductsByCategory(slug) {
    return getProducts().filter(p => p.category === slug);
  }

  function getProduct(id) {
    return getProducts().find(p => p.id === id);
  }

  function getProductName(product) {
    return I18n.productName(product.id);
  }

  function getProductDesc(product) {
    return I18n.productDesc(product.id);
  }

  function getFeatured() {
    const products = getProducts();
    const featured = [];
    const seen = new Set();
    for (const p of products) {
      if (!seen.has(p.category) || featured.length >= 4) {
        featured.push(p);
        seen.add(p.category);
      }
      if (featured.length >= 8) break;
    }
    return featured;
  }

  function searchProducts(query) {
    if (!query || query.length < 1) return [];
    const q = query.toLowerCase();
    return getProducts().filter(p => {
      const name = I18n.productName(p.id).toLowerCase();
      const desc = I18n.productDesc(p.id).toLowerCase();
      const catName = getCategoryName(p.category).toLowerCase();
      return name.includes(q) || desc.includes(q) || catName.includes(q) || p.category.includes(q);
    });
  }

  /* CART */
  function getCart() { return _load(KEYS.cart) || []; }
  function saveCart(cart) {
    _save(KEYS.cart, cart);
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }
  function addToCart(productId, qty = 1) {
    const cart = getCart();
    const existing = cart.find(i => i.productId === productId);
    if (existing) { existing.quantity += qty; }
    else { cart.push({ productId, quantity: qty }); }
    saveCart(cart);
  }
  function removeFromCart(productId) {
    saveCart(getCart().filter(i => i.productId !== productId));
  }
  function updateCartQty(productId, qty) {
    const cart = getCart();
    const item = cart.find(i => i.productId === productId);
    if (item) { item.quantity = Math.max(1, qty); saveCart(cart); }
  }
  function clearCart() { saveCart([]); }
  function getCartCount() { return getCart().reduce((s, i) => s + i.quantity, 0); }
  function getCartTotal() {
    return getCart().reduce((total, item) => {
      const product = getProduct(item.productId);
      return product ? total + product.price * item.quantity : total;
    }, 0);
  }

  /* ORDERS */
  function getOrders() { return _load(KEYS.orders) || []; }
  function saveOrder(order) {
    const orders = getOrders();
    order.id = 'ORD-' + Date.now().toString(36).toUpperCase();
    order.date = new Date().toISOString();
    order.status = 'pending';
    orders.unshift(order);
    _save(KEYS.orders, orders);
    return order;
  }
  function updateOrderStatus(orderId, status) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) { order.status = status; _save(KEYS.orders, orders); }
  }

  /* ADMIN */
  const ADMIN_PASSWORD = 'admin123';
  function isAdminAuth() { return sessionStorage.getItem(KEYS.adminAuth) === 'true'; }
  function adminLogin(password) {
    if (password === ADMIN_PASSWORD) { sessionStorage.setItem(KEYS.adminAuth, 'true'); return true; }
    return false;
  }
  function adminLogout() { sessionStorage.removeItem(KEYS.adminAuth); }

  /* ============ IMAGE MANAGEMENT ============ */
  // Images stored separately to avoid bloating product JSON
  function _getImageStore() { return _load(KEYS.images) || {}; }
  function _saveImageStore(store) { _save(KEYS.images, store); }

  /** Get all images for a product (returns array of base64 data URLs) */
  function getProductImages(productId) {
    const store = _getImageStore();
    return store[productId] || [];
  }

  /** Get the first/cover image for a product (used by cards, cart, etc.) */
  function getProductCover(product) {
    const imgs = getProductImages(product.id);
    if (imgs.length > 0) return imgs[0];
    // Fallback: legacy single image field
    if (product.image) return product.image;
    return '';
  }

  /** Add an image to a product (max 4). Returns promise. */
  function addProductImage(productId, file) {
    return compressImage(file, 800, 0.7).then(dataUrl => {
      const store = _getImageStore();
      if (!store[productId]) store[productId] = [];
      if (store[productId].length >= 4) return false; // max 4 images
      store[productId].push(dataUrl);
      _saveImageStore(store);
      return true;
    });
  }

  /** Remove a specific image by index */
  function removeProductImage(productId, index) {
    const store = _getImageStore();
    if (!store[productId]) return;
    store[productId].splice(index, 1);
    if (store[productId].length === 0) delete store[productId];
    _saveImageStore(store);
  }

  /** Remove ALL images for a product */
  function clearProductImages(productId) {
    const store = _getImageStore();
    delete store[productId];
    _saveImageStore(store);
  }

  /** Compress an image file → base64 data URL via canvas resizing */
  function compressImage(file, maxDim = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
            else { w = Math.round(w * maxDim / h); h = maxDim; }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* HELPERS */
  function _load(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
  function _save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

  return {
    CATEGORIES, getCategoryName, getCategoryDesc,
    getProducts, saveProducts, resetProducts,
    getProductsByCategory, getProduct, getProductName, getProductDesc, getFeatured, searchProducts,
    getProductImages, getProductCover, addProductImage, removeProductImage, clearProductImages, compressImage,
    getCart, addToCart, removeFromCart, updateCartQty, clearCart, getCartCount, getCartTotal,
    getOrders, saveOrder, updateOrderStatus,
    getDeliveryPrices, saveDeliveryPrices, getDeliveryPrice, updateDeliveryPrice, getWilayaName,
    isAdminAuth, adminLogin, adminLogout
  };
})();
