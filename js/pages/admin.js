/* ================================================
   ADMIN PAGE — Mobile dashboard with IMAGE UPLOAD + DELIVERY PRICES
   ================================================ */

const AdminPage = (() => {
  let activeTab = 'products';
  let editingProductId = null; // currently editing product's images

  function render(container) {
    editingProductId = null;
    if (!Store.isAdminAuth()) { _renderLogin(container); return; }
    _renderDashboard(container);
  }

  function _renderLogin(container) {
    container.innerHTML = `
      <div class="admin-page fade-in">
        <div class="admin-login">
          <div style="font-size:2rem;margin-bottom:12px">🔒</div>
          <h2>${I18n.t('admin.login')}</h2>
          <form id="admin-login-form" style="margin-top:16px">
            <input type="password" id="admin-pass" placeholder="${I18n.t('admin.login.ph')}" autocomplete="off" />
            <button type="submit" class="btn btn--primary btn--block">${I18n.t('admin.login.btn')}</button>
          </form>
          <p id="admin-err" style="color:var(--clr-danger);margin-top:10px;font-size:.82rem;display:none">${I18n.t('admin.login.err')}</p>
        </div>
      </div>`;

    document.getElementById('admin-login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (Store.adminLogin(document.getElementById('admin-pass').value)) {
        _renderDashboard(container);
      } else {
        document.getElementById('admin-err').style.display = 'block';
        document.getElementById('admin-pass').value = '';
      }
    });
  }

  function _renderDashboard(container) {
    const products = Store.getProducts();
    const orders = Store.getOrders();
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

    container.innerHTML = `
      <div class="admin-page fade-in">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
          <h1 style="font-size:1.2rem">🛠️ ${I18n.t('admin.title')}</h1>
          <button class="btn btn--outline btn--sm" id="admin-logout">${I18n.t('admin.logout')}</button>
        </div>

        <div class="admin-stats">
          <div class="admin-stat">
            <div class="admin-stat__num">${products.length}</div>
            <div class="admin-stat__label">${I18n.t('admin.total.products')}</div>
          </div>
          <div class="admin-stat">
            <div class="admin-stat__num">${Store.CATEGORIES.length}</div>
            <div class="admin-stat__label">${I18n.t('admin.total.cats')}</div>
          </div>
          <div class="admin-stat">
            <div class="admin-stat__num">${orders.length}</div>
            <div class="admin-stat__label">${I18n.t('admin.total.orders')}</div>
          </div>
          <div class="admin-stat">
            <div class="admin-stat__num" style="font-size:1rem">${I18n.formatPrice(revenue)}</div>
            <div class="admin-stat__label">${I18n.t('admin.revenue')}</div>
          </div>
        </div>

        <div class="admin-tabs">
          <button class="admin-tab ${activeTab === 'products' ? 'active' : ''}" data-tab="products">${I18n.t('admin.products')}</button>
          <button class="admin-tab ${activeTab === 'orders' ? 'active' : ''}" data-tab="orders">${I18n.t('admin.orders')}</button>
          <button class="admin-tab ${activeTab === 'delivery' ? 'active' : ''}" data-tab="delivery">🚚 ${I18n.t('admin.delivery')}</button>
          <button class="admin-tab ${activeTab === 'add' ? 'active' : ''}" data-tab="add">${I18n.t('admin.add')}</button>
        </div>

        <div id="admin-tab-content">
          ${activeTab === 'products' ? _productsTab(products) : ''}
          ${activeTab === 'orders' ? _ordersTab(orders) : ''}
          ${activeTab === 'delivery' ? _deliveryTab() : ''}
          ${activeTab === 'add' ? _addTab() : ''}
        </div>
      </div>`;

    _bindEvents(container);
  }

  /* ===================== PRODUCTS TAB ===================== */
  function _productsTab(products) {
    return `
      <div id="products-list">
        ${products.map(p => _productRow(p)).join('')}
      </div>
      <!-- Image upload panel (shows when editing) -->
      <div id="image-upload-panel"></div>
    `;
  }

  function _productRow(p) {
    const name = Store.getProductName(p);
    const cover = Store.getProductCover(p);
    const imgCount = Store.getProductImages(p.id).length;
    const imgSrc = cover || `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="#5C7A3A" width="80" height="80" rx="8"/><text x="40" y="46" font-family="serif" font-size="22" fill="rgba(255,255,255,.3)" text-anchor="middle">${name.slice(0, 2)}</text></svg>`)}`;

    return `
      <div style="display:flex;gap:12px;padding:12px;background:var(--clr-white);border-radius:var(--radius-md);margin-bottom:8px;box-shadow:var(--shadow-sm);align-items:center" data-pid="${p.id}">
        <!-- Product thumbnail -->
        <div style="position:relative;flex-shrink:0">
          <img src="${imgSrc}" alt="" style="width:56px;height:56px;border-radius:10px;object-fit:cover" />
          ${imgCount > 0 ? `<span style="position:absolute;bottom:-2px;right:-2px;background:var(--clr-forest);color:#fff;font-size:.55rem;font-weight:700;padding:1px 5px;border-radius:6px">${imgCount}📷</span>` : ''}
        </div>
        <!-- Info -->
        <div style="flex:1;min-width:0">
          <div style="font-size:.82rem;font-weight:600;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}</div>
          <div style="font-size:.82rem;font-weight:700;color:var(--clr-forest)">${I18n.formatPrice(p.price)}</div>
        </div>
        <!-- Actions -->
        <div style="display:flex;gap:6px;flex-shrink:0">
          <button class="btn btn--sm" style="background:var(--clr-beige);padding:6px 10px" data-edit-images="${p.id}" title="${I18n.t('admin.images')}">
            <span class="material-symbols-rounded" style="font-size:18px">photo_camera</span>
          </button>
          <button class="btn btn--sm btn--danger" style="padding:6px 10px" data-delete="${p.id}">
            <span class="material-symbols-rounded" style="font-size:18px">delete</span>
          </button>
        </div>
      </div>
    `;
  }

  /* ===================== IMAGE UPLOAD PANEL ===================== */
  function _renderImagePanel(productId) {
    const panel = document.getElementById('image-upload-panel');
    if (!panel) return;

    editingProductId = productId;
    const product = Store.getProduct(productId);
    if (!product) return;

    const images = Store.getProductImages(productId);
    const canAdd = images.length < 4;

    panel.innerHTML = `
      <div class="img-upload-section slide-up" id="img-section">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <h3>📷 ${I18n.t('admin.images')} — ${Store.getProductName(product)}</h3>
          <button style="color:var(--clr-muted);padding:4px" id="close-img-panel">
            <span class="material-symbols-rounded" style="font-size:20px">close</span>
          </button>
        </div>
        <p class="img-upload-section__sub">${I18n.t('admin.images.max')} (${images.length}/4)</p>

        <!-- Image grid: existing uploads + add button -->
        <div class="img-upload-grid" id="img-grid">
          ${images.map((src, i) => `
            <div class="img-upload-thumb">
              <img src="${src}" alt="Image ${i + 1}" />
              <button class="img-upload-thumb__remove" data-remove-img="${i}" title="${I18n.t('admin.delete')}">✕</button>
              <span class="img-upload-thumb__order">${i + 1}</span>
            </div>
          `).join('')}
          ${canAdd ? `
            <button class="img-upload-add" id="img-add-btn">
              <span class="material-symbols-rounded">add_a_photo</span>
              <span>${I18n.t('admin.images.add')}</span>
            </button>
          ` : ''}
        </div>

        <!-- Upload actions: Gallery + Camera buttons -->
        ${canAdd ? `
          <div class="img-upload-actions">
            <button class="btn-gallery" id="btn-gallery">
              <span class="material-symbols-rounded" style="font-size:18px">photo_library</span>
              ${I18n.t('admin.images.gallery')}
            </button>
            <button class="btn-camera" id="btn-camera">
              <span class="material-symbols-rounded" style="font-size:18px">photo_camera</span>
              ${I18n.t('admin.images.camera')}
            </button>
          </div>
        ` : `
          <p style="text-align:center;font-size:.82rem;color:var(--clr-pending);font-weight:600">
            ${I18n.t('admin.images.full')}
          </p>
        `}

        <!-- Loading indicator (hidden by default) -->
        <div class="img-upload-loading" id="img-loading" style="display:none">
          <div class="loader-spinner"></div>
          <span>${I18n.t('admin.images.uploading')}</span>
        </div>

        <!-- Hidden file inputs -->
        <input type="file" id="file-gallery" accept="image/*" multiple style="display:none" />
        <input type="file" id="file-camera" accept="image/*" capture="environment" style="display:none" />
      </div>
    `;

    // Scroll to panel
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });

    _bindImagePanelEvents(productId);
  }

  function _bindImagePanelEvents(productId) {
    // Close panel
    document.getElementById('close-img-panel')?.addEventListener('click', () => {
      editingProductId = null;
      const panel = document.getElementById('image-upload-panel');
      if (panel) panel.innerHTML = '';
      // Refresh product list to show updated thumbnails
      _refreshProductList();
    });

    // Gallery button → opens file picker (multiple files, gallery mode)
    document.getElementById('btn-gallery')?.addEventListener('click', () => {
      document.getElementById('file-gallery')?.click();
    });

    // Add button (the dashed square) → also opens gallery
    document.getElementById('img-add-btn')?.addEventListener('click', () => {
      document.getElementById('file-gallery')?.click();
    });

    // Camera button → opens camera
    document.getElementById('btn-camera')?.addEventListener('click', () => {
      document.getElementById('file-camera')?.click();
    });

    // Handle gallery file selection
    document.getElementById('file-gallery')?.addEventListener('change', (e) => {
      _handleFiles(e.target.files, productId);
    });

    // Handle camera capture
    document.getElementById('file-camera')?.addEventListener('change', (e) => {
      _handleFiles(e.target.files, productId);
    });

    // Remove image buttons
    document.querySelectorAll('[data-remove-img]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.removeImg);
        Store.removeProductImage(productId, index);
        Toast.show(I18n.t('admin.images.removed'), 'info');
        _renderImagePanel(productId);
      });
    });
  }

  /** Handle selected files — compress & store each one */
  async function _handleFiles(fileList, productId) {
    if (!fileList || fileList.length === 0) return;

    const currentCount = Store.getProductImages(productId).length;
    const maxNew = 4 - currentCount;
    if (maxNew <= 0) {
      Toast.show(I18n.t('admin.images.full'), 'error');
      return;
    }

    // Show loading
    const loadingEl = document.getElementById('img-loading');
    if (loadingEl) loadingEl.style.display = 'flex';

    const files = Array.from(fileList).slice(0, maxNew);

    for (const file of files) {
      try {
        const success = await Store.addProductImage(productId, file);
        if (success) {
          Toast.show(I18n.t('admin.images.uploaded'), 'success');
        } else {
          Toast.show(I18n.t('admin.images.full'), 'error');
          break;
        }
      } catch (err) {
        console.error('Image upload error:', err);
        Toast.show(I18n.t('admin.images.error'), 'error');
      }
    }

    // Re-render panel with new images
    _renderImagePanel(productId);
  }

  /** Refresh the product list rows without full re-render */
  function _refreshProductList() {
    const listEl = document.getElementById('products-list');
    if (!listEl) return;
    const products = Store.getProducts();
    listEl.innerHTML = products.map(p => _productRow(p)).join('');
    _bindProductListEvents();
  }

  function _bindProductListEvents() {
    // Edit images buttons
    document.querySelectorAll('[data-edit-images]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.editImages;
        _renderImagePanel(id);
      });
    });

    // Delete buttons
    document.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.delete;
        ConfirmDialog.show(I18n.t('admin.delete.confirm'), () => {
          Store.clearProductImages(id); // also remove images
          Store.saveProducts(Store.getProducts().filter(x => x.id !== id));
          Toast.show(I18n.t('admin.deleted'), 'info');
          _refreshProductList();
          const panel = document.getElementById('image-upload-panel');
          if (panel && editingProductId === id) panel.innerHTML = '';
        });
      });
    });
  }

  /* ===================== ORDERS TAB ===================== */
  function _ordersTab(orders) {
    if (!orders.length) return `<p style="text-align:center;padding:32px;color:var(--clr-muted)">${I18n.t('admin.no.orders')}</p>`;
    return orders.map(o => {
      const date = new Date(o.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const wilayaInfo = o.customer?.wilayaName ? ` · ${o.customer.wilayaName}` : '';
      const deliveryInfo = o.deliveryPrice ? ` (${I18n.t('checkout.delivery')}: ${I18n.formatPrice(o.deliveryPrice)})` : '';
      return `<div class="order-card" style="margin:0 0 10px">
        <div class="order-card__header">
          <div><div class="order-card__id">${o.id}</div><div class="order-card__date">${date} · ${o.customer?.name || '?'}${wilayaInfo}</div></div>
          <select data-order-status="${o.id}" style="padding:4px 8px;border:1px solid var(--clr-sand);border-radius:6px;font-size:.78rem">
            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>${I18n.t('orders.pending')}</option>
            <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>${I18n.t('orders.confirmed')}</option>
          </select>
        </div>
        <div class="order-card__footer">
          <span>${o.items?.length || 0} ${I18n.t('orders.items')}${deliveryInfo}</span>
          <span class="order-card__total">${I18n.formatPrice(o.total || 0)}</span>
        </div>
      </div>`;
    }).join('');
  }

  /* ===================== DELIVERY PRICES TAB ===================== */
  function _deliveryTab() {
    const prices = Store.getDeliveryPrices();
    return `
      <div style="background:var(--clr-white);border-radius:var(--radius-md);padding:16px;box-shadow:var(--shadow-sm)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <h3 style="font-size:1rem">🚚 ${I18n.t('admin.delivery.title')}</h3>
        </div>
        <p style="font-size:.78rem;color:var(--clr-muted);margin-bottom:16px">${I18n.t('admin.delivery.subtitle')}</p>

        <div id="delivery-prices-list" class="delivery-prices-list">
          ${prices.map(w => `
            <div class="delivery-price-row" data-wilaya="${w.code}">
              <div class="delivery-price-row__info">
                <span class="delivery-price-row__code">${w.code}</span>
                <span class="delivery-price-row__name">${I18n.lang() === 'ar' ? w.ar : w.en}</span>
              </div>
              <div class="delivery-price-row__input-wrap">
                <input type="number" class="delivery-price-input" data-wilaya-price="${w.code}" value="${w.price}" min="0" step="50" />
                <span class="delivery-price-row__currency">${I18n.t('currency')}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display:flex;gap:8px;margin-top:16px">
          <button class="btn btn--primary btn--block" id="save-delivery-prices" style="padding:14px">
            ${I18n.t('admin.delivery.save.all')}
          </button>
          <button class="btn btn--outline btn--sm" id="reset-delivery-prices" style="white-space:nowrap;padding:14px 16px">
            ${I18n.t('admin.delivery.reset')}
          </button>
        </div>
      </div>
    `;
  }

  /* ===================== ADD PRODUCT TAB ===================== */
  function _addTab() {
    return `<div style="background:var(--clr-white);border-radius:var(--radius-md);padding:20px;box-shadow:var(--shadow-sm)">
      <h3 style="font-size:1rem;margin-bottom:16px">${I18n.t('admin.add')}</h3>
      <form id="add-product-form">
        <div class="form-group"><label>Name</label><input type="text" id="new-name" required placeholder="Product name" /></div>
        <div class="form-group"><label>Price (DZD)</label><input type="number" id="new-price" step="10" min="0" required placeholder="1500" /></div>
        <div class="form-group"><label>Category</label>
          <select id="new-category" style="width:100%;padding:12px;border:2px solid var(--clr-sand);border-radius:var(--radius-md)">
            ${Store.CATEGORIES.map(c => `<option value="${c.slug}">${Store.getCategoryName(c.slug)}</option>`).join('')}
          </select>
        </div>

        <!-- Image upload for new product -->
        <div class="form-group">
          <label>${I18n.t('admin.images')} (${I18n.t('admin.images.max')})</label>
          <div class="img-upload-grid" id="new-product-img-grid">
            <button type="button" class="img-upload-add" id="new-product-add-img">
              <span class="material-symbols-rounded">add_a_photo</span>
              <span>${I18n.t('admin.images.add')}</span>
            </button>
          </div>
          <input type="file" id="new-product-file" accept="image/*" multiple style="display:none" />
          <div class="img-upload-loading" id="new-product-loading" style="display:none">
            <div class="loader-spinner"></div>
            <span>${I18n.t('admin.images.uploading')}</span>
          </div>
        </div>

        <button type="submit" class="btn btn--primary btn--block">${I18n.t('admin.add')}</button>
      </form>
    </div>`;
  }

  /* ===================== EVENT BINDING ===================== */
  function _bindEvents(container) {
    // Logout
    document.getElementById('admin-logout')?.addEventListener('click', () => {
      Store.adminLogout();
      render(container);
    });

    // Tab switching
    container.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        editingProductId = null;
        _renderDashboard(container);
      });
    });

    // Product list events (edit images, delete)
    _bindProductListEvents();

    // Order status changes
    container.querySelectorAll('[data-order-status]').forEach(sel => {
      sel.addEventListener('change', () => {
        Store.updateOrderStatus(sel.dataset.orderStatus, sel.value);
        Toast.show(I18n.t('admin.updated'), 'success');
      });
    });

    // Add product form
    _bindAddProductForm(container);

    // Delivery prices
    _bindDeliveryPricesEvents(container);
  }

  /* ---------- DELIVERY PRICES EVENTS ---------- */
  function _bindDeliveryPricesEvents(container) {
    // Save all delivery prices
    document.getElementById('save-delivery-prices')?.addEventListener('click', () => {
      const prices = Store.getDeliveryPrices();
      document.querySelectorAll('[data-wilaya-price]').forEach(input => {
        const code = input.dataset.wilayaPrice;
        const newPrice = parseInt(input.value) || 0;
        const w = prices.find(p => p.code === code);
        if (w) w.price = newPrice;
      });
      Store.saveDeliveryPrices(prices);
      Toast.show(I18n.t('admin.delivery.saved'), 'success');
    });

    // Reset to defaults
    document.getElementById('reset-delivery-prices')?.addEventListener('click', () => {
      ConfirmDialog.show(I18n.t('admin.delivery.reset') + '?', () => {
        localStorage.removeItem('natural_store_delivery_prices');
        activeTab = 'delivery';
        _renderDashboard(container);
        Toast.show(I18n.t('admin.updated'), 'success');
      });
    });
  }

  /* ---------- ADD PRODUCT with image upload ---------- */
  let _newProductImages = []; // temporary store for new product images

  function _bindAddProductForm(container) {
    const form = document.getElementById('add-product-form');
    if (!form) return;

    _newProductImages = [];

    // Add image button
    document.getElementById('new-product-add-img')?.addEventListener('click', () => {
      document.getElementById('new-product-file')?.click();
    });

    // File input
    document.getElementById('new-product-file')?.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const loadingEl = document.getElementById('new-product-loading');
      if (loadingEl) loadingEl.style.display = 'flex';

      const maxNew = 4 - _newProductImages.length;
      for (const file of files.slice(0, maxNew)) {
        try {
          const dataUrl = await Store.compressImage(file, 800, 0.7);
          _newProductImages.push(dataUrl);
          Toast.show(I18n.t('admin.images.uploaded'), 'success');
        } catch (err) {
          Toast.show(I18n.t('admin.images.error'), 'error');
        }
      }

      if (loadingEl) loadingEl.style.display = 'none';
      _refreshNewProductImageGrid();
      // Reset input so same file can be selected again
      e.target.value = '';
    });

    // Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('new-name').value.trim();
      const price = parseFloat(document.getElementById('new-price').value);
      const category = document.getElementById('new-category').value;
      if (!name || !price) return;

      const newId = 'custom-' + Date.now().toString(36);
      const products = Store.getProducts();
      products.push({ id: newId, price, category, images: [] });
      Store.saveProducts(products);

      // Save images for the new product
      if (_newProductImages.length > 0) {
        const imgStore = JSON.parse(localStorage.getItem('natural_store_images') || '{}');
        imgStore[newId] = _newProductImages;
        localStorage.setItem('natural_store_images', JSON.stringify(imgStore));
      }

      Toast.show(`"${name}" — ${I18n.t('admin.added')}`, 'success');
      _newProductImages = [];
      activeTab = 'products';
      _renderDashboard(container);
    });
  }

  function _refreshNewProductImageGrid() {
    const grid = document.getElementById('new-product-img-grid');
    if (!grid) return;

    const canAdd = _newProductImages.length < 4;
    grid.innerHTML = _newProductImages.map((src, i) => `
      <div class="img-upload-thumb">
        <img src="${src}" alt="New ${i + 1}" />
        <button type="button" class="img-upload-thumb__remove" data-remove-new="${i}">✕</button>
        <span class="img-upload-thumb__order">${i + 1}</span>
      </div>
    `).join('') + (canAdd ? `
      <button type="button" class="img-upload-add" id="new-product-add-img">
        <span class="material-symbols-rounded">add_a_photo</span>
        <span>${I18n.t('admin.images.add')}</span>
      </button>
    ` : '');

    // Re-bind add button
    document.getElementById('new-product-add-img')?.addEventListener('click', () => {
      document.getElementById('new-product-file')?.click();
    });

    // Bind remove buttons
    grid.querySelectorAll('[data-remove-new]').forEach(btn => {
      btn.addEventListener('click', () => {
        _newProductImages.splice(parseInt(btn.dataset.removeNew), 1);
        _refreshNewProductImageGrid();
        Toast.show(I18n.t('admin.images.removed'), 'info');
      });
    });
  }

  return { render };
})();
