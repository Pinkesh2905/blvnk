/* BLVNK router — hash based so it works from any static host or straight from disk. */
(function () {
  'use strict';
  const { $, $$ } = UI;
  const app = $('#app');
  let cleanup = null, lastKey = '';

  function parse() {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = raw.split('?');
    return { path, parts: path.split('/').filter(Boolean), query: new URLSearchParams(qs || '') };
  }
  function resolve(ctx) {
    const p0 = ctx.parts[0] || '';
    const P = Pages;
    switch (p0) {
      case '': return P.home(ctx);
      case 'shop': ctx.cat = 'all'; return P.shop(ctx);
      case 'sneakers': ctx.cat = 'sneakers'; return P.shop(ctx);
      case 'caps': ctx.cat = 'caps'; return P.shop(ctx);
      case 'new': ctx.cat = 'new'; return P.shop(ctx);
      case 'search': ctx.cat = 'all'; return P.shop(ctx);
      case 'product': return P.product(ctx);
      case 'wishlist': return P.wishlist(ctx);
      case 'cart': return P.cart(ctx);
      case 'checkout': return P.checkout(ctx);
      case 'order': return P.order(ctx);
      case 'account': return P.account(ctx);
      case 'page': return P.page(ctx);
      default: return P.notFound(ctx);
    }
  }
  function setNav(key) {
    $$('#nav-links a, .nav-new, #tabbar a').forEach(a => a.removeAttribute('aria-current'));
    $$(`#nav-links a[data-nav="${key || 'none'}"], .nav-new[data-nav="${key || 'none'}"], #tabbar a[data-tab="${key || 'none'}"]`).forEach(a => a.setAttribute('aria-current', 'page'));
  }
  function render(opts) {
    const ctx = parse();
    if (cleanup) { cleanup(); cleanup = null; }
    const out = resolve(ctx);
    document.title = out.title;
    app.innerHTML = out.html;
    app._cleanup = null;
    setNav(out.nav);
    if (out.mount) out.mount(app);
    cleanup = app._cleanup || null;
    UI.syncChrome();
    UI.closeSearch && !$('#search-panel').hidden && UI.closeSearch();
    if (!opts || !opts.keepScroll) window.scrollTo(0, 0);
  }
  Pages.rerender = () => render({ keepScroll: true });

  window.addEventListener('hashchange', () => {
    const ctx = parse();
    // the shop rewrites its own URL with replaceState (no event); a real hash change always means a new page
    UI.closeLayer(true);
    render();
    if (!/^(order|checkout)$/.test(ctx.parts[0] || '')) app.focus({ preventScroll: true });
  });
  render();
})();
