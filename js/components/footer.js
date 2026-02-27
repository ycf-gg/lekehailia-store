/* ================================================
   FOOTER — Simplified mobile footer
   ================================================ */

const Footer = (() => {
  function render() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    el.innerHTML = `
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
  return { render };
})();
