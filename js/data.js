/* ================================================
   DATA LAYER — Firebase Realtime Database Backend
   Prices in Algerian Dinar (DZD)
   All 58 wilayas with delivery prices
   
   PUBLIC API remains synchronous via local cache.
   Firebase syncs in background + real-time listeners.
   ================================================ */

const Store = (() => {
  /* ============ LOCAL CACHE ============ */
  // We keep a local in-memory cache so the UI can read synchronously
  // Firebase syncs in background and updates the cache via listeners
  let _products = null;
  let _cart = [];
  let _orders = [];
  let _deliveryPrices = null;
  let _images = {};
  let _initialized = false;

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

  /* ============================================================
     FIREBASE INITIALIZATION — Load data, setup listeners
     ============================================================ */
  function _initFirebase() {
    return new Promise((resolve) => {
      FirebaseApp.onReady((user) => {
        if (!user) {
          // Firebase offline or failed — use defaults
          console.warn('⚠️ Firebase unavailable, using defaults');
          _products = [...DEFAULT_PRODUCTS];
          _deliveryPrices = [...DEFAULT_DELIVERY_PRICES];
          _cart = [];
          _orders = [];
          _images = {};
          _initialized = true;
          resolve();
          return;
        }

        const uid = user.uid;

        // Load all data in parallel
        Promise.all([
          // Products (shared — stored at /products)
          FirebaseApp.readOnce('products'),
          // Cart (per-user — stored at /carts/{uid})
          FirebaseApp.readOnce(`carts/${uid}`),
          // Orders (all orders at /orders, filtered client-side for user)
          FirebaseApp.readOnce('orders'),
          // Delivery prices (shared — stored at /deliveryPrices)
          FirebaseApp.readOnce('deliveryPrices'),
          // Images (shared — stored at /images)
          FirebaseApp.readOnce('images'),
        ]).then(([products, cart, orders, deliveryPrices, images]) => {
          // Products: use Firebase data or seed defaults
          if (products && Array.isArray(products) && products.length > 0) {
            _products = products;
          } else if (products && typeof products === 'object') {
            // Convert object to array if stored as object
            _products = Object.values(products);
          } else {
            _products = [...DEFAULT_PRODUCTS];
            // Seed Firebase with default products
            FirebaseApp.write('products', DEFAULT_PRODUCTS).catch(() => { });
          }

          // Cart: per-user
          _cart = cart ? (Array.isArray(cart) ? cart : Object.values(cart)) : [];

          // Orders: stored as object with keys
          if (orders && typeof orders === 'object') {
            _orders = Object.values(orders);
            // Sort by date descending
            _orders.sort((a, b) => new Date(b.date) - new Date(a.date));
          } else {
            _orders = [];
          }

          // Delivery prices
          if (deliveryPrices && Array.isArray(deliveryPrices) && deliveryPrices.length > 0) {
            _deliveryPrices = deliveryPrices;
          } else if (deliveryPrices && typeof deliveryPrices === 'object') {
            _deliveryPrices = Object.values(deliveryPrices);
          } else {
            _deliveryPrices = [...DEFAULT_DELIVERY_PRICES];
            // Seed Firebase
            FirebaseApp.write('deliveryPrices', DEFAULT_DELIVERY_PRICES).catch(() => { });
          }

          // Images
          _images = images || {};

          _initialized = true;
          console.log('✅ Data loaded from Firebase');

          // Setup real-time listeners
          _setupListeners(uid);

          resolve();
        }).catch(err => {
          console.error('Firebase data load error:', err);
          // Fallback to defaults
          _products = [...DEFAULT_PRODUCTS];
          _deliveryPrices = [...DEFAULT_DELIVERY_PRICES];
          _cart = [];
          _orders = [];
          _images = {};
          _initialized = true;
          resolve();
        });
      });
    });
  }

  /* ============ REAL-TIME LISTENERS ============ */
  function _setupListeners(uid) {
    // Listen for cart changes (multi-device sync!)
    FirebaseApp.listen(`carts/${uid}`, (data) => {
      const newCart = data ? (Array.isArray(data) ? data : Object.values(data)) : [];
      // Only update if different from current
      if (JSON.stringify(newCart) !== JSON.stringify(_cart)) {
        _cart = newCart;
        window.dispatchEvent(new CustomEvent('cart-updated'));
      }
    });

    // Listen for product changes (admin updates reflect everywhere)
    FirebaseApp.listen('products', (data) => {
      if (data) {
        _products = Array.isArray(data) ? data : Object.values(data);
      }
    });

    // Listen for order changes
    FirebaseApp.listen('orders', (data) => {
      if (data && typeof data === 'object') {
        _orders = Object.values(data);
        _orders.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    });

    // Listen for delivery price changes
    FirebaseApp.listen('deliveryPrices', (data) => {
      if (data) {
        _deliveryPrices = Array.isArray(data) ? data : Object.values(data);
      }
    });

    // Listen for image changes
    FirebaseApp.listen('images', (data) => {
      _images = data || {};
    });
  }

  /* ============ DELIVERY PRICES ============ */
  function getDeliveryPrices() {
    return _deliveryPrices ? [..._deliveryPrices] : [...DEFAULT_DELIVERY_PRICES];
  }

  function saveDeliveryPrices(prices) {
    _deliveryPrices = prices;
    FirebaseApp.write('deliveryPrices', prices).catch(err => {
      console.error('Error saving delivery prices:', err);
    });
  }

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

  /* ============ PRODUCTS ============ */
  function getProducts() {
    return _products ? [..._products] : [...DEFAULT_PRODUCTS];
  }

  function saveProducts(products) {
    _products = products;
    FirebaseApp.write('products', products).catch(err => {
      console.error('Error saving products:', err);
    });
  }

  function resetProducts() {
    _products = [...DEFAULT_PRODUCTS];
    FirebaseApp.write('products', DEFAULT_PRODUCTS).catch(err => {
      console.error('Error resetting products:', err);
    });
  }

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

  /* ============ CART (per-user, synced across devices) ============ */
  function getCart() { return [..._cart]; }

  function _saveCartToFirebase() {
    const uid = FirebaseApp.uid();
    if (uid) {
      FirebaseApp.write(`carts/${uid}`, _cart).catch(err => {
        console.error('Error saving cart:', err);
      });
    }
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }

  function saveCart(cart) {
    _cart = cart;
    _saveCartToFirebase();
  }

  function addToCart(productId, qty = 1) {
    const existing = _cart.find(i => i.productId === productId);
    if (existing) { existing.quantity += qty; }
    else { _cart.push({ productId, quantity: qty }); }
    _saveCartToFirebase();
  }

  function removeFromCart(productId) {
    _cart = _cart.filter(i => i.productId !== productId);
    _saveCartToFirebase();
  }

  function updateCartQty(productId, qty) {
    const item = _cart.find(i => i.productId === productId);
    if (item) { item.quantity = Math.max(1, qty); _saveCartToFirebase(); }
  }

  function clearCart() {
    _cart = [];
    _saveCartToFirebase();
  }

  function getCartCount() { return _cart.reduce((s, i) => s + i.quantity, 0); }

  function getCartTotal() {
    return _cart.reduce((total, item) => {
      const product = getProduct(item.productId);
      return product ? total + product.price * item.quantity : total;
    }, 0);
  }

  /* ============ ORDERS ============ */
  function getOrders() {
    // For anonymous users, show orders tied to their UID
    // For admin, show all orders
    if (FirebaseApp.isAdmin()) {
      return [..._orders];
    }
    const uid = FirebaseApp.uid();
    return _orders.filter(o => o.userUid === uid);
  }

  function saveOrder(order) {
    order.id = 'ORD-' + Date.now().toString(36).toUpperCase();
    order.date = new Date().toISOString();
    order.status = 'pending';
    order.userUid = FirebaseApp.uid() || 'anonymous';

    // Push to Firebase orders collection
    FirebaseApp.write(`orders/${order.id}`, order).catch(err => {
      console.error('Error saving order:', err);
    });

    // Also add to local cache
    _orders.unshift(order);

    return order;
  }

  function updateOrderStatus(orderId, status) {
    const order = _orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      FirebaseApp.update(`orders/${orderId}`, { status }).catch(err => {
        console.error('Error updating order status:', err);
      });
    }
  }

  /* ============ ADMIN AUTH (Firebase Authentication) ============ */
  function isAdminAuth() {
    return FirebaseApp.isAdmin();
  }

  function adminLogin(password) {
    // This now returns a Promise!
    // But we need to stay compatible with the sync API in admin.js
    // So we use a wrapper pattern
    return FirebaseApp.adminLogin(password);
  }

  function adminLogout() {
    return FirebaseApp.adminLogout();
  }

  /* ============ IMAGE MANAGEMENT (Firebase) ============ */
  /** Get all images for a product (returns array of base64 data URLs) */
  function getProductImages(productId) {
    return _images[productId] || [];
  }

  /** Get the first/cover image for a product */
  function getProductCover(product) {
    const imgs = getProductImages(product.id);
    if (imgs.length > 0) return imgs[0];
    if (product.image) return product.image;
    return '';
  }

  /** Add an image to a product (max 4). Returns promise. */
  function addProductImage(productId, file) {
    return compressImage(file, 800, 0.7).then(dataUrl => {
      if (!_images[productId]) _images[productId] = [];
      if (_images[productId].length >= 4) return false;
      _images[productId].push(dataUrl);
      // Save to Firebase
      FirebaseApp.write(`images/${productId}`, _images[productId]).catch(err => {
        console.error('Error saving image:', err);
      });
      return true;
    });
  }

  /** Remove a specific image by index */
  function removeProductImage(productId, index) {
    if (!_images[productId]) return;
    _images[productId].splice(index, 1);
    if (_images[productId].length === 0) {
      delete _images[productId];
      FirebaseApp.write(`images/${productId}`, null).catch(() => { });
    } else {
      FirebaseApp.write(`images/${productId}`, _images[productId]).catch(() => { });
    }
  }

  /** Remove ALL images for a product */
  function clearProductImages(productId) {
    delete _images[productId];
    FirebaseApp.write(`images/${productId}`, null).catch(() => { });
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

  /* ============ INIT FUNCTION ============ */
  // Called by app.js before rendering. Returns a promise.
  function init() {
    return _initFirebase();
  }

  return {
    CATEGORIES, getCategoryName, getCategoryDesc,
    getProducts, saveProducts, resetProducts,
    getProductsByCategory, getProduct, getProductName, getProductDesc, getFeatured, searchProducts,
    getProductImages, getProductCover, addProductImage, removeProductImage, clearProductImages, compressImage,
    getCart, saveCart, addToCart, removeFromCart, updateCartQty, clearCart, getCartCount, getCartTotal,
    getOrders, saveOrder, updateOrderStatus,
    getDeliveryPrices, saveDeliveryPrices, getDeliveryPrice, updateDeliveryPrice, getWilayaName,
    isAdminAuth, adminLogin, adminLogout,
    init
  };
})();
