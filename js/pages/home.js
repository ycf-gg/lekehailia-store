/* ================================================
   HOME PAGE — Mobile-first with hero, categories, featured
   ================================================ */

const HomePage = (() => {

  function render(container) {
    container.innerHTML = `
      <!-- HERO -->
      <section class="hero-mobile" id="hero">
        <div class="hero-mobile__content slide-up">
          <span class="hero-mobile__badge">${I18n.t('hero.badge')}</span>
          <h1>${I18n.t('hero.title').replace('\n', '<br>')}</h1>
          <p class="hero-mobile__desc">${I18n.t('hero.desc')}</p>
          <a href="#/categories" class="hero-mobile__btn">${I18n.t('hero.shop')} →</a>
        </div>
      </section>

      <!-- CATEGORIES HORIZONTAL SCROLL -->
      <div class="section-header">
        <h2>${I18n.t('sections.categories')}</h2>
        <a href="#/categories">${I18n.t('sections.all')} <span class="material-symbols-rounded" style="font-size:16px">chevron_${I18n.isRTL() ? 'left' : 'right'}</span></a>
      </div>
      <div class="categories-scroll" id="categories-scroll">
        ${_renderCategoryChips()}
      </div>

      <!-- FEATURED PRODUCTS -->
      <div class="section-header">
        <h2>${I18n.t('sections.featured')}</h2>
        <a href="#/categories">${I18n.t('sections.all')} <span class="material-symbols-rounded" style="font-size:16px">chevron_${I18n.isRTL() ? 'left' : 'right'}</span></a>
      </div>
      <div class="products-grid" id="featured-grid">
        ${ProductCard.skeletons(6)}
      </div>

      <!-- WHY US -->
      <div class="section-header" style="margin-top:8px">
        <h2>${I18n.t('sections.why')}</h2>
      </div>
      <div class="features-grid" style="margin-bottom:24px">
        ${_renderFeatures()}
      </div>

      <!-- FOOTER -->
      <footer class="site-footer" role="contentinfo"></footer>
    `;

    // Load featured products after skeleton
    setTimeout(() => {
      const grid = document.getElementById('featured-grid');
      if (!grid) return;
      const featured = Store.getFeatured();
      grid.innerHTML = featured.map(p => ProductCard.html(p, { showCategory: true })).join('');
      ProductCard.bindAddButtons(grid);
      _animateCards(grid);
    }, 350);

    // Render footer
    const footerEl = container.querySelector('.site-footer');
    if (footerEl) {
      footerEl.innerHTML = Footer.render.__proto__ ? '' : '';
      // Inline footer render
      footerEl.innerHTML = `
          <div class="footer-brand">🌿 ${I18n.t('site.name')}</div>
          <p class="footer-text">${I18n.t('footer.desc')}</p>
          <div class="footer-links">
            ${Store.CATEGORIES.map(c => `<a href="#/category/${c.slug}">${Store.getCategoryName(c.slug)}</a>`).join('')}
          </div>
          <div class="footer-bottom">
            &copy; ${new Date().getFullYear()} ${I18n.t('site.name')}. ${I18n.t('footer.rights')}
          </div>
        `;
    }
  }

  function _renderCategoryChips() {
    return Store.CATEGORIES.map(cat => `
      <a href="#/category/${cat.slug}" class="cat-chip">
        <span class="cat-chip__icon">${cat.icon}</span>
        <span class="cat-chip__name">${Store.getCategoryName(cat.slug)}</span>
      </a>
    `).join('');
  }

  function _renderFeatures() {
    const features = [
      { icon: '🌱', titleKey: 'feature.natural', textKey: 'feature.natural.text' },
      { icon: '🔬', titleKey: 'feature.tested', textKey: 'feature.tested.text' },
      { icon: '🚚', titleKey: 'feature.delivery', textKey: 'feature.delivery.text' },
      { icon: '💚', titleKey: 'feature.eco', textKey: 'feature.eco.text' },
    ];
    return features.map(f => `
      <div class="feature-card">
        <div class="feature-card__icon">${f.icon}</div>
        <h3 class="feature-card__title">${I18n.t(f.titleKey)}</h3>
        <p class="feature-card__text">${I18n.t(f.textKey)}</p>
      </div>
    `).join('');
  }

  function _animateCards(container) {
    container.querySelectorAll('.product-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = `opacity .4s var(--ease) ${i * 0.06}s, transform .4s var(--ease) ${i * 0.06}s`;
      requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    });
  }

  return { render };
})();
