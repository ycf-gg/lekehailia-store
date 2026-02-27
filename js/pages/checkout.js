/* ================================================
   CHECKOUT PAGE — Wilaya selection + delivery pricing
   ================================================ */

const CheckoutPage = (() => {
  let _selectedWilaya = null;
  let _deliveryPrice = 0;

  function render(container) {
    const cart = Store.getCart();
    _selectedWilaya = null;
    _deliveryPrice = 0;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="checkout-page fade-in">
          <div class="cart-empty">
            <div class="cart-empty__icon">📋</div>
            <h2 style="font-size:1.1rem;margin-bottom:8px">${I18n.t('cart.empty')}</h2>
            <p class="cart-empty__text">${I18n.t('cart.empty.text')}</p>
            <a href="#/" class="btn btn--primary btn--sm">${I18n.t('cart.start')}</a>
          </div>
        </div>`;
      return;
    }

    const subtotal = Store.getCartTotal();
    const wilayas = Store.getDeliveryPrices();

    container.innerHTML = `
      <div class="checkout-page fade-in">
        <h1>${I18n.t('checkout.title')}</h1>

        <!-- Order Summary -->
        <div class="checkout-summary">
          <h3>${I18n.t('checkout.summary')}</h3>
          ${cart.map(item => {
      const p = Store.getProduct(item.productId);
      if (!p) return '';
      return `
              <div class="checkout-summary__row">
                <span>${Store.getProductName(p)} × ${item.quantity}</span>
                <span>${I18n.formatPrice(p.price * item.quantity)}</span>
              </div>`;
    }).join('')}
          <div class="checkout-summary__row">
            <span>${I18n.t('checkout.subtotal')}</span>
            <span style="font-weight:700">${I18n.formatPrice(subtotal)}</span>
          </div>
          <div class="checkout-summary__row" id="delivery-price-row">
            <span>${I18n.t('checkout.delivery')}</span>
            <span id="delivery-price-display" style="color:var(--clr-muted);font-size:.82rem">${I18n.t('checkout.select.wilaya')}</span>
          </div>
          <div class="checkout-summary__row total">
            <span>${I18n.t('checkout.grand.total')}</span>
            <span id="grand-total">${I18n.formatPrice(subtotal)}</span>
          </div>
        </div>

        <!-- Customer Form -->
        <form id="checkout-form" novalidate>
          <h3 style="font-size:1rem;margin-bottom:16px">${I18n.t('checkout.details')}</h3>

          <div class="form-group" id="fg-name">
            <label for="cust-name">${I18n.t('checkout.name')}</label>
            <input type="text" id="cust-name" placeholder="${I18n.t('checkout.name.ph')}" required />
            <span class="error-msg">${I18n.t('checkout.name.err')}</span>
          </div>

          <div class="form-group" id="fg-phone">
            <label for="cust-phone">${I18n.t('checkout.phone')}</label>
            <input type="tel" id="cust-phone" placeholder="${I18n.t('checkout.phone.ph')}" required />
            <span class="error-msg">${I18n.t('checkout.phone.err')}</span>
          </div>

          <div class="form-group" id="fg-wilaya">
            <label for="cust-wilaya">${I18n.t('checkout.wilaya')}</label>
            <select id="cust-wilaya" class="checkout-select" required>
              <option value="">${I18n.t('checkout.wilaya.ph')}</option>
              ${wilayas.map(w => `<option value="${w.code}">${w.code} - ${I18n.lang() === 'ar' ? w.ar : w.en}</option>`).join('')}
            </select>
            <span class="error-msg">${I18n.t('checkout.wilaya.err')}</span>
          </div>

          <!-- Delivery price badge (shown after selecting wilaya) -->
          <div id="delivery-badge" class="delivery-badge" style="display:none">
            <span class="material-symbols-rounded" style="font-size:20px;color:var(--clr-forest)">local_shipping</span>
            <div>
              <div class="delivery-badge__label">${I18n.t('checkout.delivery.price')}</div>
              <div class="delivery-badge__price" id="delivery-badge-price"></div>
            </div>
          </div>

          <div class="form-group" id="fg-address">
            <label for="cust-address">${I18n.t('checkout.address')}</label>
            <textarea id="cust-address" placeholder="${I18n.t('checkout.address.ph')}" required></textarea>
            <span class="error-msg">${I18n.t('checkout.address.err')}</span>
          </div>

          <div class="form-group">
            <label for="cust-notes">${I18n.t('checkout.notes')}</label>
            <textarea id="cust-notes" placeholder="${I18n.t('checkout.notes.ph')}"></textarea>
          </div>

          <button type="submit" class="btn btn--primary btn--block checkout-submit-btn" id="checkout-submit">
            ${I18n.t('checkout.place')} — ${I18n.formatPrice(subtotal)}
          </button>
        </form>
      </div>
    `;

    _bindForm(subtotal);
  }

  function _bindForm(subtotal) {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    // Wilaya change → update delivery price
    document.getElementById('cust-wilaya')?.addEventListener('change', (e) => {
      const code = e.target.value;
      if (code) {
        _selectedWilaya = code;
        _deliveryPrice = Store.getDeliveryPrice(code);
        const wilayaName = Store.getWilayaName(code);

        // Update delivery price display
        const dpDisplay = document.getElementById('delivery-price-display');
        if (dpDisplay) {
          dpDisplay.textContent = I18n.formatPrice(_deliveryPrice);
          dpDisplay.style.color = 'var(--clr-forest)';
          dpDisplay.style.fontWeight = '700';
          dpDisplay.style.fontSize = '';
        }

        // Update grand total
        const grandTotal = subtotal + _deliveryPrice;
        const gtEl = document.getElementById('grand-total');
        if (gtEl) gtEl.textContent = I18n.formatPrice(grandTotal);

        // Show delivery badge
        const badge = document.getElementById('delivery-badge');
        if (badge) {
          badge.style.display = 'flex';
          badge.style.animation = 'fadeInUp .3s var(--ease)';
        }
        const badgePrice = document.getElementById('delivery-badge-price');
        if (badgePrice) badgePrice.textContent = `${wilayaName} — ${I18n.formatPrice(_deliveryPrice)}`;

        // Update submit button text
        const submitBtn = document.getElementById('checkout-submit');
        if (submitBtn) submitBtn.textContent = `${I18n.t('checkout.place')} — ${I18n.formatPrice(grandTotal)}`;

        // Clear wilaya error
        _clearErr('fg-wilaya');
      } else {
        _selectedWilaya = null;
        _deliveryPrice = 0;
        const dpDisplay = document.getElementById('delivery-price-display');
        if (dpDisplay) {
          dpDisplay.textContent = I18n.t('checkout.select.wilaya');
          dpDisplay.style.color = 'var(--clr-muted)';
          dpDisplay.style.fontWeight = '';
          dpDisplay.style.fontSize = '.82rem';
        }
        const gtEl = document.getElementById('grand-total');
        if (gtEl) gtEl.textContent = I18n.formatPrice(subtotal);

        const badge = document.getElementById('delivery-badge');
        if (badge) badge.style.display = 'none';

        const submitBtn = document.getElementById('checkout-submit');
        if (submitBtn) submitBtn.textContent = `${I18n.t('checkout.place')} — ${I18n.formatPrice(subtotal)}`;
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('cust-name').value.trim();
      const phone = document.getElementById('cust-phone').value.trim();
      const wilaya = document.getElementById('cust-wilaya').value;
      const address = document.getElementById('cust-address').value.trim();
      const notes = document.getElementById('cust-notes').value.trim();

      let valid = true;
      if (!name) { _showErr('fg-name'); valid = false; } else { _clearErr('fg-name'); }
      if (!phone || phone.length < 6) { _showErr('fg-phone'); valid = false; } else { _clearErr('fg-phone'); }
      if (!wilaya) { _showErr('fg-wilaya'); valid = false; } else { _clearErr('fg-wilaya'); }
      if (!address) { _showErr('fg-address'); valid = false; } else { _clearErr('fg-address'); }

      if (!valid) return;

      const deliveryPrice = Store.getDeliveryPrice(wilaya);
      const wilayaName = Store.getWilayaName(wilaya);
      const grandTotal = subtotal + deliveryPrice;

      const cart = Store.getCart();
      const items = cart.map(ci => {
        const p = Store.getProduct(ci.productId);
        return { name: Store.getProductName(p), price: p.price, quantity: ci.quantity };
      });

      const order = Store.saveOrder({
        customer: { name, phone, wilaya, wilayaName, address, notes },
        items,
        deliveryPrice,
        total: grandTotal
      });

      Store.clearCart();

      const container = document.getElementById('app');
      container.innerHTML = `
        <div class="checkout-page fade-in">
          <div class="order-success">
            <div class="order-success__icon">✅</div>
            <h2>${I18n.t('checkout.success')}</h2>
            <p>${I18n.t('checkout.thanks')}, <strong>${name}</strong>!</p>
            <p>${I18n.t('checkout.received')}</p>
            <p class="order-success__id">${I18n.t('checkout.orderid')} ${order.id}</p>
            <div style="margin-top:16px;padding:12px;background:var(--clr-light-gray);border-radius:var(--radius-md);font-size:.85rem">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span>${I18n.t('checkout.subtotal')}</span>
                <span>${I18n.formatPrice(subtotal)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span>${I18n.t('checkout.delivery')} (${wilayaName})</span>
                <span>${I18n.formatPrice(deliveryPrice)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-weight:800;color:var(--clr-forest);padding-top:8px;border-top:1px solid var(--clr-sand)">
                <span>${I18n.t('checkout.grand.total')}</span>
                <span>${I18n.formatPrice(grandTotal)}</span>
              </div>
            </div>
            <a href="#/orders" class="btn btn--primary" style="margin-top:24px">${I18n.t('orders.title')}</a>
          </div>
        </div>
      `;

      Toast.show(I18n.t('checkout.success'), 'success');
    });
  }

  function _showErr(id) { document.getElementById(id)?.classList.add('has-error'); }
  function _clearErr(id) { document.getElementById(id)?.classList.remove('has-error'); }

  return { render };
})();
