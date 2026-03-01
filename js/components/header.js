/* ================================================
   HEADER — Mobile sticky header with search & language
   FIXED VERSION - Event binding guaranteed to work
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

    const currentLang = I18n.lang();
    const langLabel = currentLang === 'ar' ? 'EN' : 'ع';

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
          <button type="button" class="lang-toggle" id="lang-toggle" aria-label="Switch Language">${langLabel}</button>
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

    // IMPORTANT: Bind events AFTER HTML is created
    _bindEvents(el);
  }

  /* ---------- EVENT BINDING ---------- */

  function _bindEvents(el) {
    // ========== SEARCH TOGGLE ==========
    const searchToggle = document.getElementById('search-toggle');
    if (searchToggle) {
      searchToggle.addEventListener('click', (e) => {
        e.preventDefault();
        _searchOpen = !_searchOpen;
        const bar = document.getElementById('search-bar');
        if (bar) {
          bar.classList.toggle('open', _searchOpen);
          if (_searchOpen) {
            setTimeout(() => {
              const input = document.getElementById('search-input');
              if (input) input.focus();
            }, 300);
          } else {
            _clearSearchState();
          }
        }
      });
    }

    // ========== CLEAR BUTTON ==========
    const clearBtn = document.getElementById('search-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const input = document.getElementById('search-input');
        if (input) {
          input.value = '';
          input.focus();
        }
        const container = document.getElementById('search-results');
        if (container) container.innerHTML = '';
        if (clearBtn) clearBtn.style.display = 'none';
      });
    }

    // ========== SEARCH INPUT ==========
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.trim();
        const clrBtn = document.getElementById('search-clear');

        // Show/hide clear button
        if (clrBtn) {
          clrBtn.style.display = q.length > 0 ? 'flex' : 'none';
        }

        // Debounce search
        clearTimeout(_searchDebounce);
        _searchDebounce = setTimeout(() => _performSearch(q), 150);
      });

      // Handle Enter key
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          searchInput.blur();
        }
      });
    }

    // ========== LANGUAGE TOGGLE ==========
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const currentLang = I18n.lang();
        const newLang = currentLang === 'ar' ? 'en' : 'ar';

        // Visual feedback
        langToggle.classList.add('lang-toggle--switching');
        langToggle.disabled = true;

        // Small delay for visual effect
        setTimeout(() => {
          try {
            // Change language
            I18n.setLang(newLang);

            // Close search
            _searchOpen = false;
            const bar = document.getElementById('search-bar');
            if (bar) bar.classList.remove('open');

            // Re-render everything
            Header.render();
            BottomNav.render();
            Router._onRoute();
          } catch (err) {
            console.error('Error changing language:', err);
            langToggle.classList.remove('lang-toggle--switching');
            langToggle.disabled = false;
          }
        }, 200);
      });
    }

    // ========== SCROLL SHADOW ==========
    _scrollHandler = () => {
      el.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', _scrollHandler, { passive: true });

    // ========== CLOSE SEARCH ON OUTSIDE CLICK ==========
    _outsideClickHandler = (e) => {
      if (!_searchOpen) return;
      const bar = document.getElementById('search-bar');
      const toggle = document.getElementById('search-toggle');
      if (bar && toggle && !bar.contains(e.target) && !toggle.contains(e.target)) {
        _closeSearch();
      }
    };
    document.addEventListener('click', _outsideClickHandler);

    // ========== CLOSE SEARCH ON ESC ==========
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
    const container = document.getElementById('search-results');
    if (!container) return;

    if (!q || q.length < 1) {
      container.innerHTML = '';
      return;
    }

    // Check if Store exists
    if (!window.Store) {
      container.innerHTML = '<p style="padding:20px;color:var(--clr-muted);text-align:center">Store not loaded</p>';
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
      const catName = Store.getCategoryName(p.category);
      const cover = Store.getProductCover(p);
      const cat = Store.CATEGORIES.find(c => c.slug === p.category);
      const imgSrc = cover || _searchPlaceholder(name, cat?.color || '#5C7A3A');

      return `
        <a href="#/product/${p.id}" class="search-result-item" onclick="Header.closeSearch()">
          <img class="search-result-item__img" src="${imgSrc}" alt="${name}" loading="lazy" />
          <div class="search-result-item__info">
            <div class="search-result-item__name">${_highlightMatch(name, q)}</div>
            <div class="search-result-item__meta">
              <span class="search-result-item__cat">${catName}</span>
              <span class="search-result-item__price">${I18n.formatPrice(p.price)}</span>
            </div>
          </div>
        </a>`;
    }).join('');
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

  function _clearSearchState() {
    const input = document.getElementById('search-input');
    if (input) input.value = '';
    const container = document.getElementById('search-results');
    if (container) container.innerHTML = '';
    const clrBtn = document.getElementById('search-clear');
    if (clrBtn) clrBtn.style.display = 'none';
  }

  function _closeSearch() {
    _searchOpen = false;
    const bar = document.getElementById('search-bar');
    if (bar) bar.classList.remove('open');
    _clearSearchState();
  }

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

  // Global cart update listener
  window.addEventListener('cart-updated', () => {
    if (BottomNav && BottomNav.render) {
      BottomNav.render();
    }
  });

  // PUBLIC EXPORTS
  return {
    render,
    closeSearch: _closeSearch
  };
})();