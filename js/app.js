/* ================================================
   APP.JS — SPA Router, Toast, Confirm, SEO
   ================================================ */

/* ---------- TOAST ---------- */
const Toast = (() => {
    function show(message, type = 'info', duration = 2500) {
        const container = document.getElementById('toast-container');
        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span class="toast__icon">${icons[type] || ''}</span><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 350);
        }, duration);
    }
    return { show };
})();

/* ---------- CONFIRM DIALOG ---------- */
const ConfirmDialog = (() => {
    let _onConfirm = null;
    function show(message, onConfirm) {
        _onConfirm = onConfirm;
        const overlay = document.getElementById('confirm-dialog');
        document.getElementById('confirm-dialog-msg').textContent = message;
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
    }
    function _hide() {
        const overlay = document.getElementById('confirm-dialog');
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        _onConfirm = null;
    }
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('confirm-cancel')?.addEventListener('click', _hide);
        document.getElementById('confirm-ok')?.addEventListener('click', () => { if (_onConfirm) _onConfirm(); _hide(); });
        document.getElementById('confirm-dialog')?.addEventListener('click', (e) => { if (e.target === e.currentTarget) _hide(); });
    });
    return { show };
})();

/* ---------- SEO ---------- */
const SEO = (() => {
    function update(title, description) {
        const siteName = I18n.t('site.name');
        document.title = title + ' — ' + siteName;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', description);
    }
    return { update };
})();

/* ---------- SPA ROUTER ---------- */
const Router = (() => {
    const app = document.getElementById('app');

    function init() {
        window.addEventListener('hashchange', _onRoute);
        window.addEventListener('DOMContentLoaded', () => {
            Header.render();
            BottomNav.render();
            _onRoute();
        });
        if (document.readyState !== 'loading') {
            Header.render();
            BottomNav.render();
            _onRoute();
        }
    }

    function _onRoute() {
        const hash = location.hash || '#/';
        const parts = hash.replace('#/', '').split('/');
        const page = parts[0] || '';
        const param = parts.slice(1).join('/');

        // Loader
        app.innerHTML = '<div class="page-loader"><div class="loader-spinner"></div></div>';
        window.scrollTo({ top: 0, behavior: 'instant' });

        setTimeout(() => {
            switch (page) {
                case '':
                    SEO.update(I18n.t('nav.home'), I18n.t('hero.desc'));
                    HomePage.render(app);
                    break;
                case 'category':
                    SEO.update(I18n.t('nav.categories'), I18n.t('sections.allcats'));
                    CategoryPage.render(app, param || null);
                    break;
                case 'categories':
                    SEO.update(I18n.t('sections.allcats'), I18n.t('sections.allcats'));
                    CategoryPage.render(app, null);
                    break;
                case 'product':
                    SEO.update(I18n.t('nav.categories'), '');
                    ProductPage.render(app, param);
                    break;
                case 'cart':
                    SEO.update(I18n.t('cart.title'), I18n.t('cart.title'));
                    CartPage.render(app);
                    break;
                case 'orders':
                    SEO.update(I18n.t('orders.title'), I18n.t('orders.title'));
                    OrdersPage.render(app);
                    break;
                case 'checkout':
                    SEO.update(I18n.t('checkout.title'), I18n.t('checkout.title'));
                    CheckoutPage.render(app);
                    break;
                case 'admin':
                    SEO.update(I18n.t('admin.title'), I18n.t('admin.title'));
                    AdminPage.render(app);
                    break;
                default:
                    SEO.update('404', '');
                    app.innerHTML = `
                    <div style="margin-top:var(--header-h);display:flex;align-items:center;justify-content:center;min-height:60vh;text-align:center;padding:40px">
                      <div><div style="font-size:3rem;margin-bottom:12px">🔍</div>
                      <h2 style="font-size:1.1rem;margin-bottom:12px">404</h2>
                      <a href="#/" class="btn btn--primary btn--sm">${I18n.t('nav.home')}</a></div>
                    </div>`;
            }
            BottomNav.render();
        }, 120);
    }

    return { init, _onRoute };
})();

// ===== BOOT =====
Router.init();
