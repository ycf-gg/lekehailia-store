/* ================================================
   CATEGORY PAGE — Filter chips + product grid
   ================================================ */

const CategoryPage = (() => {

  function render(container, slug) {
    if (!slug) {
      _renderOverview(container);
      return;
    }

    const cat = Store.CATEGORIES.find(c => c.slug === slug);
    if (!cat) {
      container.innerHTML = `
        <div class="page-bg" style="display:flex;align-items:center;justify-content:center;text-align:center;padding:40px">
          <div>
            <div style="font-size:3rem;margin-bottom:12px">🔍</div>
            <p style="color:var(--clr-muted);margin-bottom:16px">${I18n.t('search.no.results')}</p>
            <a href="#/" class="btn btn--primary btn--sm">${I18n.t('back')}</a>
          </div>
        </div>`;
      return;
    }

    container.innerHTML = `
      <section class="category-hero">
        <div style="font-size:2.2rem;margin-bottom:8px">${cat.icon}</div>
        <h1>${Store.getCategoryName(slug)}</h1>
        <p>${Store.getCategoryDesc(slug)}</p>
      </section>

      <!-- Sort filter chips -->
      <div class="filter-bar" id="sort-bar">
        <button class="filter-chip active" data-sort="default">${I18n.t('sort.default')}</button>
        <button class="filter-chip" data-sort="price-asc">${I18n.t('sort.price.asc')}</button>
        <button class="filter-chip" data-sort="price-desc">${I18n.t('sort.price.desc')}</button>
      </div>

      <div style="padding:4px 16px 8px">
        <span id="product-count" style="font-size:.82rem;color:var(--clr-muted)"></span>
      </div>

      <div class="products-grid" id="category-products">
        ${ProductCard.skeletons(4)}
      </div>
    `;

    setTimeout(() => _loadProducts(slug), 250);

    // Sort handlers
    document.querySelectorAll('[data-sort]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-sort]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        _loadProducts(slug);
      });
    });
  }

  function _loadProducts(slug) {
    let products = Store.getProductsByCategory(slug);
    const activeSort = document.querySelector('[data-sort].active')?.dataset.sort || 'default';

    switch (activeSort) {
      case 'price-asc': products.sort((a, b) => a.price - b.price); break;
      case 'price-desc': products.sort((a, b) => b.price - a.price); break;
    }

    const grid = document.getElementById('category-products');
    const countEl = document.getElementById('product-count');
    if (!grid) return;

    countEl.textContent = `${products.length} ${I18n.t('products')}`;

    if (products.length === 0) {
      grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--clr-muted);padding:40px">${I18n.t('search.no.results')}</p>`;
      return;
    }

    grid.innerHTML = products.map(p => ProductCard.html(p)).join('');
    ProductCard.bindAddButtons(grid);

    grid.querySelectorAll('.product-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = `opacity .35s var(--ease) ${i * 0.06}s, transform .35s var(--ease) ${i * 0.06}s`;
      requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    });
  }

  function _renderOverview(container) {
    container.innerHTML = `
      <section class="category-hero">
        <div style="font-size:2.2rem;margin-bottom:8px">📂</div>
        <h1>${I18n.t('sections.allcats')}</h1>
      </section>

      <!-- All categories as filter chips leading to individual pages -->
      <div class="filter-bar" style="padding-top:16px">
        ${Store.CATEGORIES.map(c => `
          <a href="#/category/${c.slug}" class="filter-chip" style="text-decoration:none">
            ${c.icon} ${Store.getCategoryName(c.slug)}
          </a>
        `).join('')}
      </div>

      <!-- Show all products -->
      <div style="padding:12px 16px 4px">
        <span id="product-count" style="font-size:.82rem;color:var(--clr-muted)"></span>
      </div>
      <div class="products-grid" id="category-products">
        ${ProductCard.skeletons(6)}
      </div>
    `;

    setTimeout(() => {
      const products = Store.getProducts();
      const grid = document.getElementById('category-products');
      const countEl = document.getElementById('product-count');
      if (!grid) return;
      countEl.textContent = `${products.length} ${I18n.t('products')}`;
      grid.innerHTML = products.map(p => ProductCard.html(p, { showCategory: true })).join('');
      ProductCard.bindAddButtons(grid);

      grid.querySelectorAll('.product-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        card.style.transition = `opacity .35s var(--ease) ${i * 0.05}s, transform .35s var(--ease) ${i * 0.05}s`;
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      });
    }, 300);
  }

  return { render };
})();
