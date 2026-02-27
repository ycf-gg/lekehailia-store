/* ================================================
   CART PAGE — Alibaba / Temu mobile style
   ================================================ */

const CartPage = (() => {

  function render(container) {
    const cart = Store.getCart();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-page fade-in">
          <h1 class="cart-page__title">${I18n.t('cart.title')}</h1>
          <div class="cart-empty">
            <div class="cart-empty__icon">🛒</div>
            <h2 style="font-size:1.1rem;margin-bottom:8px">${I18n.t('cart.empty')}</h2>
            <p class="cart-empty__text">${I18n.t('cart.empty.text')}</p>
            <a href="#/" class="btn btn--primary btn--sm">${I18n.t('cart.start')}</a>
          </div>
        </div>`;
      return;
    }

    container.innerHTML = `
      <div class="cart-page fade-in">
        <h1 class="cart-page__title">${I18n.t('cart.title')}</h1>
        <div id="cart-items">
          ${_renderItems(cart)}
        </div>
        <!-- Sticky checkout bar -->
        <div class="cart-summary-bar" id="cart-summary-bar">
          <div class="cart-summary-bar__total">
            <span class="cart-summary-bar__label">${I18n.t('cart.total')}</span>
            <span class="cart-summary-bar__price" id="cart-total">${I18n.formatPrice(Store.getCartTotal())}</span>
          </div>
          <a href="#/checkout" class="cart-summary-bar__btn">
            ${I18n.t('cart.checkout')}
            <span class="material-symbols-rounded" style="font-size:18px">${I18n.isRTL() ? 'arrow_back' : 'arrow_forward'}</span>
          </a>
        </div>
      </div>
    `;

    _bindEvents();
  }

  function _renderItems(cart) {
    return cart.map(item => {
      const p = Store.getProduct(item.productId);
      if (!p) return '';
      const name = Store.getProductName(p);
      const imgSrc = Store.getProductCover(p) || _placeholder(name, Store.CATEGORIES.find(c => c.slug === p.category)?.color || '#5C7A3A');
      return `
        <div class="cart-item" data-cart-id="${p.id}">
          <img class="cart-item__img" src="${imgSrc}" alt="${name}" />
          <div class="cart-item__info">
            <div class="cart-item__name">${name}</div>
            <div class="cart-item__price">${I18n.formatPrice(p.price)}</div>
            <div class="cart-item__bottom">
              <div class="cart-item__controls">
                <button data-qty-minus="${p.id}">−</button>
                <span class="cart-item__qty">${item.quantity}</span>
                <button data-qty-plus="${p.id}">+</button>
              </div>
              <button class="cart-item__remove" data-remove="${p.id}">
                <span class="material-symbols-rounded">delete_outline</span>
              </button>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function _bindEvents() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-qty-plus],[data-qty-minus],[data-remove]');
      if (!btn) return;

      if (btn.dataset.qtyPlus) {
        const id = btn.dataset.qtyPlus;
        const item = Store.getCart().find(i => i.productId === id);
        if (item) Store.updateCartQty(id, item.quantity + 1);
        _refresh();
      }
      if (btn.dataset.qtyMinus) {
        const id = btn.dataset.qtyMinus;
        const item = Store.getCart().find(i => i.productId === id);
        if (item && item.quantity > 1) {
          Store.updateCartQty(id, item.quantity - 1);
          _refresh();
        }
      }
      if (btn.dataset.remove) {
        const id = btn.dataset.remove;
        const product = Store.getProduct(id);
        Store.removeFromCart(id);
        Toast.show(`${Store.getProductName(product)} — ${I18n.t('product.removed')}`, 'info');
        render(document.getElementById('app'));
      }
    });
  }

  function _refresh() {
    const cart = Store.getCart();
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (itemsEl) itemsEl.innerHTML = _renderItems(cart);
    if (totalEl) totalEl.textContent = I18n.formatPrice(Store.getCartTotal());
    _bindEvents();
  }

  function _placeholder(name, color) {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect fill="${color}" width="160" height="160" rx="10"/><text x="80" y="88" font-family="serif" font-size="36" fill="rgba(255,255,255,.3)" text-anchor="middle">${initials}</text></svg>`)}`;
  }

  return { render };
})();
