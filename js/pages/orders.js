/* ================================================
   ORDERS / MY PURCHASES — Alibaba/Temu style
   ================================================ */

const OrdersPage = (() => {

    function render(container) {
        const orders = Store.getOrders();

        if (orders.length === 0) {
            container.innerHTML = `
        <div class="orders-page fade-in">
          <h1 class="orders-page__title">${I18n.t('orders.title')}</h1>
          <div class="cart-empty">
            <div class="cart-empty__icon">📦</div>
            <h2 style="font-size:1.1rem;margin-bottom:8px">${I18n.t('orders.empty')}</h2>
            <p class="cart-empty__text">${I18n.t('orders.empty.text')}</p>
            <a href="#/" class="btn btn--primary btn--sm">${I18n.t('cart.start')}</a>
          </div>
        </div>`;
            return;
        }

        container.innerHTML = `
      <div class="orders-page fade-in">
        <h1 class="orders-page__title">${I18n.t('orders.title')}</h1>
        ${orders.map(order => _renderOrder(order)).join('')}
      </div>
    `;
    }

    function _renderOrder(order) {
        const date = new Date(order.date);
        const dateStr = I18n.lang() === 'ar'
            ? date.toLocaleDateString('ar-DZ', { day: 'numeric', month: 'short', year: 'numeric' })
            : date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

        const statusClass = order.status === 'confirmed' ? 'order-status--confirmed' : 'order-status--pending';
        const statusText = order.status === 'confirmed' ? I18n.t('orders.confirmed') : I18n.t('orders.pending');
        const statusIcon = order.status === 'confirmed' ? '✅' : '⏳';

        return `
      <div class="order-card slide-up">
        <div class="order-card__header">
          <div>
            <div class="order-card__id">${order.id}</div>
            <div class="order-card__date">${dateStr}</div>
          </div>
          <span class="order-status ${statusClass}">${statusIcon} ${statusText}</span>
        </div>

        <div class="order-card__items">
          ${(order.items || []).slice(0, 3).map(item => {
            const color = '#5C7A3A';
            const initials = (item.name || '??').slice(0, 2);
            const imgSrc = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="${color}" width="80" height="80" rx="8"/><text x="40" y="46" font-family="serif" font-size="22" fill="rgba(255,255,255,.3)" text-anchor="middle">${initials}</text></svg>`)}`;
            return `
              <div class="order-card__item">
                <img src="${imgSrc}" alt="${item.name}" />
                <div class="order-card__item-info">
                  <div class="order-card__item-name">${item.name}</div>
                  <div class="order-card__item-qty">×${item.quantity} · ${I18n.formatPrice(item.price * item.quantity)}</div>
                </div>
              </div>
            `;
        }).join('')}
          ${(order.items || []).length > 3 ? `<div style="font-size:.78rem;color:var(--clr-muted);padding-right:50px">+${order.items.length - 3} ${I18n.t('orders.items')}</div>` : ''}
        </div>

        <div class="order-card__footer">
          <span class="order-card__total-label">${I18n.t('cart.total')}</span>
          <span class="order-card__total">${I18n.formatPrice(order.total || 0)}</span>
        </div>
      </div>
    `;
    }

    return { render };
})();
