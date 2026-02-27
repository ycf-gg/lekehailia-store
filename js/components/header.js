/* ================================================
   HEADER — Mobile sticky header with search & language
   ================================================ */

const Header = (() => {
  let _searchOpen = false;
  let _searchDebounce = null;

  // Keep references to document-level listeners so we can clean up
  let _outsideClickHandler = null;
  let _escKeyHandler = null;
  let _scrollHandler = null;

  function render() {
    const el = document.getElementById('site-header');
    if (!el) return;

    // Clean up previous document-level listeners to prevent duplicates
    _cleanupGlobalListeners();

    el.innerHTML = `
      <div class="header-inner">
        <a href="#/" class="header-logo" id="header-logo">
          <span class="material-symbols-rounded">eco</span>
          ${I18n.t('site.name')}
        </a>
        <div class="header-actions">
          <button type="button" id="search-toggle" aria-label="Search">
            <span class="material-symbols-rounded">search</span>
          </button>
          <button type="button" class="lang-toggle" id="lang-toggle" aria-label="Switch Language">${I18n.lang() === 'ar' ? 'EN' : 'ع'}</button>
        </div>
      </div>
      <!-- Search drawer -->
      <div class="search-bar ${_searchOpen ? 'open' : ''}" id="search-bar">
        <div class="search-bar__inner">
          <input type="text" class="search-bar__input" id="search-input"
            placeholder="${I18n.t('search.ph')}" autocomplete="off" inputmode="search" enterkeyhint="search" />
          <span class="search-bar__icon material-symbols-rounded">search</span>
          <button type="button" class="search-bar__clear" id="search-clear" style="display:none" aria-label="Clear">
            <span class="material-symbols-rounded" style="font-size:20px">close</span>
          </button>
        </div>
        <div id="search-results" class="search-results-container"></div>
      </div>
    `;
    _bindEvents(el);
  }

  /* ---------- EVENT BINDING ---------- */

  function _bindEvents(el) {
    // Search toggle
    document.getElementById('search-toggle')?.addEventListener('click', () => {
      _searchOpen = !_searchOpen;
      const bar = document.getElementById('search-bar');
      if (!bar) return;
      bar.classList.toggle('open', _searchOpen);
      if (_searchOpen) {
        setTimeout(() => document.getElementById('search-input')?.focus(), 300);
      } else {
        _clearSearchState();
      }
    });

    // Clear button — type="button" prevents form submission, e.preventDefault() added
    document.getElementById('search-clear')?.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        const input = document.getElementById('search-input');
        if (input) { input.value = ''; input.focus(); }
        const container = document.getElementById('search-results');
        if (container) container.innerHTML = '';
        const clearBtn = document.getElementById('search-clear');
        if (clearBtn) clearBtn.style.display = 'none';
      } catch (err) {
        console.error('[Header] Error clearing search:', err);
      }
    });

    // Search input — live search with debounce
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      try {
        const q = e.target.value.trim();
        const clearBtn = document.getElementById('search-clear');

        // Show/hide clear button
        if (clearBtn) clearBtn.style.display = q.length > 0 ? 'flex' : 'none';

        // Debounce search for performance
        clearTimeout(_searchDebounce);
        _searchDebounce = setTimeout(() => _performSearch(q), 150);
      } catch (err) {
        console.error('[Header] Error in search input handler:', err);
      }
    });

    // Handle Enter key on mobile to dismiss keyboard
    document.getElementById('search-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('search-input')?.blur();
      }
    });

    // Language toggle — full language switch with visual feedback & RTL
    document.getElementById('lang-toggle')?.addEventListener('click', () => {
      try {
        const btn = document.getElementById('lang-toggle');
        const newLang = I18n.lang() === 'ar' ? 'en' : 'ar';

        // Visual feedback: loading state
        if (btn) {
          btn.classList.add('lang-toggle--switching');
          btn.disabled = true;
        }

        // Small delay for visual feedback
        setTimeout(() => {
          // Switch language in I18n system (handles localStorage, dir, lang attr)
          I18n.setLang(newLang);

          // Close search if open
          _searchOpen = false;

          // Re-render all components with new translations
          Header.render();
          BottomNav.render();
          Router._onRoute();
        }, 200);
      } catch (err) {
        console.error('[Header] Error switching language:', err);
        // Recover from error
        const btn = document.getElementById('lang-toggle');
        if (btn) {
          btn.classList.remove('lang-toggle--switching');
          btn.disabled = false;
        }
      }
    });

    // Scroll shadow
    _scrollHandler = () => {
      el.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', _scrollHandler, { passive: true });

    // Close search on outside click
    _outsideClickHandler = (e) => {
      if (!_searchOpen) return;
      const bar = document.getElementById('search-bar');
      const toggle = document.getElementById('search-toggle');
      if (bar && !bar.contains(e.target) && toggle && !toggle.contains(e.target)) {
        _closeSearch();
      }
    };
    document.addEventListener('click', _outsideClickHandler);

    // ESC key closes search bar
    _escKeyHandler = (e) => {
      if (e.key === 'Escape' && _searchOpen) {
        e.preventDefault();
        _closeSearch();
      }
    };
    document.addEventListener('keydown', _escKeyHandler);
  }

  /* ---------- SEARCH ---------- */

  function _performSearch(q) {
    try {
      const container = document.getElementById('search-results');
      if (!container) return;

      if (!q || q.length < 1) {
        container.innerHTML = '';
        return;
      }

      const results = Store.searchProducts(q);

      if (results.length === 0) {
        container.innerHTML = `
          <div class="search-empty">
            <span class="material-symbols-rounded" style="font-size:32px;color:var(--clr-sand);margin-bottom:8px">search_off</span>
            <p>${I18n.t('search.no.results')}</p>
          </div>`;
        return;
      }

      container.innerHTML = results.slice(0, 8).map(p => {
        const name = Store.getProductName(p);
        const cat = Store.CATEGORIES.find(c => c.slug === p.category);
        const catName = Store.getCategoryName(p.category);
        const cover = Store.getProductCover(p);
        const imgSrc = cover || _searchPlaceholder(name, cat?.color || '#5C7A3A');

        return `
          <a href="#/product/${p.id}" class="search-result-item" onclick="Header._closeSearch()">
            <img class="search-result-item__img" src="${imgSrc}" alt="${name}" />
            <div class="search-result-item__info">
              <div class="search-result-item__name">${_highlightMatch(name, q)}</div>
              <div class="search-result-item__meta">
                <span class="search-result-item__cat">${catName}</span>
                <span class="search-result-item__price">${I18n.formatPrice(p.price)}</span>
              </div>
            </div>
          </a>`;
      }).join('');
    } catch (err) {
      console.error('[Header] Search error:', err);
      const container = document.getElementById('search-results');
      if (container) {
        container.innerHTML = `
          <div class="search-empty">
            <span class="material-symbols-rounded" style="font-size:32px;color:var(--clr-danger);margin-bottom:8px">error</span>
            <p>${I18n.lang() === 'ar' ? 'حدث خطأ في البحث' : 'Search error occurred'}</p>
          </div>`;
      }
    }
  }

  function _highlightMatch(text, query) {
    if (!query) return text;
    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    } catch (err) {
      return text;
    }
  }

  function _searchPlaceholder(name, color) {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="${color}" width="80" height="80" rx="10"/><text x="40" y="46" font-family="serif" font-size="22" fill="rgba(255,255,255,.3)" text-anchor="middle">${initials}</text></svg>`)}`;
  }

  /* ---------- HELPERS ---------- */

  /** Clears search input, results, and clear button */
  function _clearSearchState() {
    const input = document.getElementById('search-input');
    if (input) input.value = '';
    const container = document.getElementById('search-results');
    if (container) container.innerHTML = '';
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.style.display = 'none';
  }

  /** Closes search bar completely */
  function _closeSearch() {
    _searchOpen = false;
    const bar = document.getElementById('search-bar');
    if (bar) bar.classList.remove('open');
    _clearSearchState();
  }

  /** Remove document-level event listeners to avoid duplicates on re-render */
  function _cleanupGlobalListeners() {
    if (_outsideClickHandler) {
      document.removeEventListener('click', _outsideClickHandler);
      _outsideClickHandler = null;
    }
    if (_escKeyHandler) {
      document.removeEventListener('keydown', _escKeyHandler);
      _escKeyHandler = null;
    }
    if (_scrollHandler) {
      window.removeEventListener('scroll', _scrollHandler);
      _scrollHandler = null;
    }
  }

  // Global event listeners
  window.addEventListener('cart-updated', () => BottomNav?.render());

  return { render, _closeSearch };
})();
