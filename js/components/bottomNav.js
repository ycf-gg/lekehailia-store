/* ================================================
   BOTTOM NAV — Mobile tab bar
   ================================================ */

const BottomNav = (() => {
    function render() {
        const el = document.getElementById('bottom-nav');
        const count = Store.getCartCount();
        const hash = location.hash || '#/';

        const items = [
            { id: 'home', icon: 'home', label: I18n.t('nav.home'), href: '#/' },
            { id: 'categories', icon: 'category', label: I18n.t('nav.categories'), href: '#/categories' },
            { id: 'cart', icon: 'shopping_cart', label: I18n.t('nav.cart'), href: '#/cart', badge: count },
            { id: 'orders', icon: 'receipt_long', label: I18n.t('nav.orders'), href: '#/orders' },
            { id: 'admin', icon: 'settings', label: I18n.t('nav.more'), href: '#/admin' },
        ];

        el.innerHTML = items.map(item => {
            let active = false;
            if (item.id === 'home' && (hash === '#/' || hash === '#')) active = true;
            else if (item.id === 'categories' && hash.startsWith('#/categor')) active = true;
            else if (item.id === 'cart' && hash === '#/cart') active = true;
            else if (item.id === 'orders' && hash === '#/orders') active = true;
            else if (item.id === 'admin' && hash === '#/admin') active = true;

            return `
          <a href="${item.href}" class="bottom-nav__item ${active ? 'active' : ''}" id="nav-${item.id}">
            <span class="material-symbols-rounded">${item.icon}</span>
            ${item.badge > 0 ? `<span class="bottom-nav__badge">${item.badge}</span>` : ''}
            <span>${item.label}</span>
          </a>
        `;
        }).join('');
    }

    return { render };
})();
