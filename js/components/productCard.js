/* ================================================
   PRODUCT CARD — Mobile-optimized reusable card
   ================================================ */

const ProductCard = (() => {

  function html(product, opts = {}) {
    const catSlug = product.category;
    const cat = Store.CATEGORIES.find(c => c.slug === catSlug);
    const name = Store.getProductName(product);
    const imgSrc = Store.getProductCover(product) || _placeholder(name, cat?.color || '#5C7A3A');

    return `
      <article class="product-card" data-id="${product.id}"
        onclick="location.hash='#/product/${product.id}'">
        <div class="product-card__img-wrap">
          <img class="product-card__img" src="${imgSrc}" alt="${name}" loading="lazy" />
          ${opts.showCategory ? `<span class="product-card__tag">${Store.getCategoryName(catSlug)}</span>` : ''}
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${name}</h3>
          <div class="product-card__price-row">
            <span class="product-card__price">${I18n.formatPrice(product.price)}</span>
            <button class="product-card__add" data-add-cart="${product.id}"
              onclick="event.stopPropagation()" aria-label="${I18n.t('product.add')}">
              <span class="material-symbols-rounded">add</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function skeletons(count = 4) {
    let out = '';
    for (let i = 0; i < count; i++) {
      out += `
        <div class="product-card">
          <div class="skeleton" style="padding-top:110%"></div>
          <div style="padding:10px 12px">
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text short"></div>
          </div>
        </div>`;
    }
    return out;
  }

  function bindAddButtons(container) {
    container.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-add-cart');
        Store.addToCart(id);
        const product = Store.getProduct(id);
        Toast.show(`${Store.getProductName(product)} — ${I18n.t('product.added')}`, 'success');
        btn.style.animation = 'pulse .4s var(--ease)';
        setTimeout(() => btn.style.animation = '', 400);
      });
    });
  }

  function _placeholder(name, color) {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="440" viewBox="0 0 400 440"><rect fill="${color}" width="400" height="440"/><text x="200" y="230" font-family="serif" font-size="80" fill="rgba(255,255,255,.3)" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`)}`;
  }

  return { html, skeletons, bindAddButtons };
})();
