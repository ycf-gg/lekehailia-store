/* ================================================
   PRODUCT DETAIL — Swipeable gallery, sticky add-to-cart
   ================================================ */

const ProductPage = (() => {
  let _qty = 1;

  function render(container, productId) {
    const product = Store.getProduct(productId);
    if (!product) {
      container.innerHTML = `<div class="page-bg" style="display:flex;align-items:center;justify-content:center;min-height:60vh"><p style="color:var(--clr-muted)">Product not found</p></div>`;
      return;
    }

    _qty = 1;
    const name = Store.getProductName(product);
    const desc = Store.getProductDesc(product);
    const cat = Store.CATEGORIES.find(c => c.slug === product.category);
    const catName = Store.getCategoryName(product.category);

    // Build gallery: prefer uploaded images, fallback to placeholders
    const uploadedImages = Store.getProductImages(product.id);
    const colors = [cat?.color || '#5C7A3A', '#8B6914', '#2E7D32', '#5D4037'];
    const slides = uploadedImages.length > 0
      ? uploadedImages
      : colors.slice(0, 3).map((c, i) => _galleryPlaceholder(name, c, i));

    container.innerHTML = `
      <div class="product-detail fade-in">
        <!-- Swipeable Gallery -->
        <div class="product-gallery" id="product-gallery">
          <div class="product-gallery__track" id="gallery-track">
            ${slides.map(src => `
              <div class="product-gallery__slide">
                <img src="${src}" alt="${name}" />
              </div>
            `).join('')}
          </div>
          <div class="product-gallery__dots" id="gallery-dots">
            ${slides.map((_, i) => `<div class="product-gallery__dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></div>`).join('')}
          </div>
          <button class="product-gallery__back" onclick="history.back()" aria-label="${I18n.t('back')}">
            <span class="material-symbols-rounded" style="font-size:20px">${I18n.isRTL() ? 'arrow_forward' : 'arrow_back'}</span>
          </button>
        </div>

        <!-- Product Info -->
        <div class="product-detail__info">
          <div class="product-detail__category">${catName}</div>
          <h1 class="product-detail__name">${name}</h1>
          <div class="product-detail__price">${I18n.formatPrice(product.price)}</div>

          <h3 class="product-detail__desc-title">${I18n.t('product.desc')}</h3>
          <p class="product-detail__desc">${desc}</p>

          <!-- Quantity selector -->
          <div style="font-size:.88rem;font-weight:600;margin-bottom:8px;color:var(--clr-dark)">${I18n.t('product.qty')}</div>
          <div class="product-detail__qty">
            <button class="qty-btn" id="qty-minus">−</button>
            <span class="qty-display" id="qty-display">1</span>
            <button class="qty-btn" id="qty-plus">+</button>
          </div>
        </div>

        <!-- Sticky Add to Cart -->
        <div class="sticky-cart-bar" id="sticky-cart">
          <div class="sticky-cart-bar__price" id="total-price">${I18n.formatPrice(product.price)}</div>
          <button class="sticky-cart-bar__btn" id="add-to-cart-btn">
            <span class="material-symbols-rounded">shopping_cart</span>
            ${I18n.t('product.add')}
          </button>
        </div>
      </div>
    `;

    _bindGallery(slides.length);
    _bindQtyAndCart(product);
  }

  function _bindGallery(slideCount) {
    const track = document.getElementById('gallery-track');
    const dots = document.querySelectorAll('[data-dot]');
    if (!track || slideCount <= 1) return;

    let current = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const updateSlide = (index) => {
      current = Math.max(0, Math.min(index, slideCount - 1));
      const dir = I18n.isRTL() ? 1 : -1;
      track.style.transform = `translateX(${dir * current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = 'transform .4s var(--ease)';
      const diff = startX - currentX;
      const threshold = 50;
      if (I18n.isRTL()) {
        if (diff < -threshold) updateSlide(current + 1);
        else if (diff > threshold) updateSlide(current - 1);
        else updateSlide(current);
      } else {
        if (diff > threshold) updateSlide(current + 1);
        else if (diff < -threshold) updateSlide(current - 1);
        else updateSlide(current);
      }
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        track.style.transition = 'transform .4s var(--ease)';
        updateSlide(parseInt(dot.dataset.dot));
      });
    });
  }

  function _bindQtyAndCart(product) {
    const qtyDisplay = document.getElementById('qty-display');
    const totalPrice = document.getElementById('total-price');

    document.getElementById('qty-minus')?.addEventListener('click', () => {
      if (_qty > 1) {
        _qty--;
        qtyDisplay.textContent = _qty;
        totalPrice.textContent = I18n.formatPrice(product.price * _qty);
      }
    });

    document.getElementById('qty-plus')?.addEventListener('click', () => {
      _qty++;
      qtyDisplay.textContent = _qty;
      totalPrice.textContent = I18n.formatPrice(product.price * _qty);
    });

    document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
      Store.addToCart(product.id, _qty);
      Toast.show(`${Store.getProductName(product)} — ${I18n.t('product.added')}`, 'success');
      const btn = document.getElementById('add-to-cart-btn');
      btn.style.background = 'var(--clr-success)';
      btn.innerHTML = `<span class="material-symbols-rounded">check</span> ${I18n.t('product.added')}`;
      setTimeout(() => {
        btn.style.background = '';
        btn.innerHTML = `<span class="material-symbols-rounded">shopping_cart</span> ${I18n.t('product.add')}`;
      }, 1500);
    });
  }

  function _galleryPlaceholder(name, color, variant) {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);
    const patterns = [
      `<circle cx="200" cy="220" r="100" fill="rgba(255,255,255,.08)"/>`,
      `<rect x="50" y="100" width="300" height="200" rx="40" fill="rgba(255,255,255,.06)"/>`,
      `<polygon points="200,80 340,300 60,300" fill="rgba(255,255,255,.06)"/>`,
    ];
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="${color}" width="400" height="400"/>${patterns[variant % 3]}<text x="200" y="210" font-family="serif" font-size="72" fill="rgba(255,255,255,.2)" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`)}`;
  }

  return { render };
})();
