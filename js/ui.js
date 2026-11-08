/* BLVNK UI kit — helpers, product card, layers (drawers/modals), cart drawer, search. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = n => `<svg class="icon" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const inr = S.inr;
  const FAMILY_HEX = { Black: '#1b1b1e', White: '#ece8dd', Grey: '#8a8a90', Orange: '#ff5a1f', Olive: '#6b6b3d', Sand: '#cdbd9f' };
  const FAMILIES = Object.keys(FAMILY_HEX);

  /* ---------- barcode (Code-39-flavoured stripes from a string) ---------- */
  function barcode(str) {
    let x = 0, bars = '';
    const seq = ('*' + str.toUpperCase() + '*').split('');
    seq.forEach(ch => {
      const c = ch.charCodeAt(0);
      for (let b = 0; b < 9; b++) {
        const wide = ((c * (b + 3) + b * 7) % 5) < 2;
        const w = wide ? 3 : 1.4;
        if (b % 2 === 0) bars += `<rect x="${x.toFixed(1)}" y="0" width="${w}" height="56" fill="#0b0b0c"/>`;
        x += w;
      }
      x += 2;
    });
    return `<svg viewBox="0 0 ${x.toFixed(0)} 56" preserveAspectRatio="none" role="img" aria-label="Barcode for ${esc(str)}">${bars}</svg>`;
  }

  /* ---------- product bits ---------- */
  const href = (p, ci) => `#/product/${p.slug}${ci ? '?c=' + ci : ''}`;
  const off = p => p.was ? Math.round((1 - p.price / p.was) * 100) : 0;

  function tagsHTML(p) {
    const st = S.status(p), t = [];
    if (st === 'sold') t.push('<span class="tag sold">Sold out</span>');
    else {
      if (p.isNew) t.push('<span class="tag new">New</span>');
      if (p.best) t.push('<span class="tag">Best seller</span>');
      if (p.was) t.push(`<span class="tag sale">−${off(p)}%</span>`);
      if (st === 'low') t.push('<span class="tag low">Low stock</span>');
    }
    return t.length ? `<div class="tags">${t.join('')}</div>` : '';
  }
  function priceHTML(p) {
    return `<div class="price"><span>${inr(p.price)}</span>${p.was ? `<s>${inr(p.was)}</s><span class="off">−${off(p)}%</span>` : ''}</div>`;
  }
  const wishBtn = p => `<button class="wish" data-act="wish" data-id="${p.id}" aria-pressed="${S.isWished(p.id)}" aria-label="${S.isWished(p.id) ? 'Remove' : 'Add'} ${esc(p.name)} ${S.isWished(p.id) ? 'from' : 'to'} wishlist">${icon('heart')}</button>`;

  function cardHTML(p) {
    const sold = S.status(p) === 'sold', vs = Art.views(p);
    const dots = p.colors.length > 1 ? `<div class="dots" role="group" aria-label="Colours">${p.colors.map((c, i) => `<button class="sw sm" style="--c:${c.swatch}" data-act="card-color" data-id="${p.id}" data-ci="${i}" aria-pressed="${i === 0}" aria-label="${esc(c.name)}"></button>`).join('')}</div>` : '';
    return `<article class="card${sold ? ' is-sold' : ''}" data-id="${p.id}">
  <a class="card-media" href="${href(p)}" tabindex="-1" aria-hidden="true">
    <img src="${Art.src(p, 0, vs[0].key)}" alt="" width="800" height="800" loading="lazy" decoding="async">
    ${vs.length > 1 ? `<img class="alt" src="${Art.src(p, 0, vs[1].key)}" alt="" width="800" height="800" loading="lazy" decoding="async">` : ''}
  </a>
  ${tagsHTML(p)}
  ${wishBtn(p)}
  <div class="card-body">
    <div class="card-meta"><span class="art">${p.article}</span>${dots}</div>
    <h3><a href="${href(p)}">${esc(p.name)}</a></h3>
    <p class="sub">${p.cat === 'sneakers' ? 'Sneaker' : 'Cap'} · ${p.colors.length} colour${p.colors.length > 1 ? 's' : ''}</p>
    ${priceHTML(p)}
    <button class="btn btn-add" data-act="quick-add" data-id="${p.id}" ${sold ? 'disabled aria-label="' + esc(p.name) + ' is sold out"' : `aria-label="Add ${esc(p.name)} to cart"`}>${sold ? 'Sold out' : 'Add to Cart'}</button>
  </div>
</article>`;
  }

  /* ---------- toast ---------- */
  function toast(msg, action) {
    const box = $('#toasts'), el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ''}`;
    box.appendChild(el);
    let gone = false;
    const kill = () => { if (gone) return; gone = true; el.classList.add('out'); setTimeout(() => el.remove(), 220); };
    if (action) el.querySelector('button').addEventListener('click', () => { action.fn(); kill(); });
    setTimeout(kill, action ? 6000 : 3200);
  }

  /* ---------- layers ---------- */
  const scrim = $('#scrim');
  let openLayer = null, lastFocus = null;
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

  function openEl(el, opts) {
    if (openLayer && openLayer.el !== el) closeLayer(true);
    lastFocus = document.activeElement;
    openLayer = { el, opts: opts || {} };
    el.classList.add('open'); el.setAttribute('aria-hidden', 'false');
    scrim.hidden = false; requestAnimationFrame(() => scrim.classList.add('open'));
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const f = (opts && opts.focus && $(opts.focus, el)) || $(FOCUSABLE, el); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function closeLayer(quick) {
    if (!openLayer) return;
    const { el, opts } = openLayer; openLayer = null;
    el.classList.remove('open'); el.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('open'); document.body.style.overflow = '';
    setTimeout(() => { if (!openLayer) scrim.hidden = true; }, quick ? 0 : 260);
    if (opts.onClose) opts.onClose();
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  scrim.addEventListener('click', () => closeLayer());
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (!searchPanel.hidden) closeSearch(); else closeLayer(); }
    if (e.key === 'Tab' && openLayer) {
      const f = $$(FOCUSABLE, openLayer.el).filter(x => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-close]');
    if (c) closeLayer(c.tagName === 'A');
  });

  const modal = $('#modal');
  function openModal(html, opts) { modal.onclick = null; modal.innerHTML = html; openEl(modal, opts); }
  modal.addEventListener('click', e => { if (e.target.closest('[data-modal-close]')) closeLayer(); });
  const modalHead = t => `<div class="modal-head"><h2 class="display" id="modal-title" style="font-size:22px">${t}</h2><button class="x-btn" data-modal-close aria-label="Close">${icon('x')}</button></div>`;

  /* ---------- size guide ---------- */
  function sizeGuide(cat) {
    const rows = cat === 'sneakers'
      ? [['UK 6', 'EU 39', '24.5'], ['UK 7', 'EU 40.5', '25.4'], ['UK 8', 'EU 42', '26.2'], ['UK 9', 'EU 43', '27.1'], ['UK 10', 'EU 44.5', '27.9'], ['UK 11', 'EU 46', '28.8']]
      : [['S/M', '55 – 57 cm', 'Fitted'], ['L/XL', '58 – 61 cm', 'Fitted'], ['One Size', '54 – 62 cm', 'Adjustable strap']];
    const head = cat === 'sneakers' ? ['UK', 'EU', 'Foot length (cm)'] : ['Size', 'Head circumference', 'Fit'];
    openModal(modalHead('Size guide') + `<div class="modal-body"><p class="muted">${cat === 'sneakers' ? 'Measure your foot heel to toe, then match to the closest size. Between sizes? Go up — our uppers run snug.' : 'Wrap a tape just above your eyebrows and around the widest part of your head.'}</p>
<table class="size-table"><thead><tr>${head.map((h, i) => `<th class="${i === 2 ? 'r' : ''}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td class="${i === 2 ? 'r' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
  }

  /* ---------- quick add ---------- */
  function quickAdd(id, ci) {
    const p = S.byId(id); ci = ci || 0;
    const sizeKeys = Object.keys(p.stock);
    if (p.colors.length === 1 && sizeKeys.length === 1) { addAndOpen(p, 0, sizeKeys[0], 1); return; }
    let sel = { ci, size: null };
    const draw = () => {
      const c = p.colors[sel.ci];
      modal.innerHTML = modalHead('Quick add') + `<div class="modal-body">
<div class="qa-prod"><img src="${Art.src(p, sel.ci, Art.views(p)[0].key)}" alt="" width="96" height="96"><div><div class="label">${p.article}</div><h3 class="display" style="font-size:22px;margin:4px 0 8px">${esc(p.name)}</h3>${priceHTML(p)}</div></div>
${p.colors.length > 1 ? `<div><div class="opt-head"><span class="label">Colour — <b>${esc(c.name)}</b></span></div><div class="dots" style="gap:18px;padding:4px">${p.colors.map((x, i) => `<button class="sw" style="--c:${x.swatch}" data-qa-color="${i}" aria-pressed="${i === sel.ci}" aria-label="${esc(x.name)}"></button>`).join('')}</div></div>` : ''}
<div><div class="opt-head"><span class="label">${p.cat === 'sneakers' ? 'Size (UK)' : 'Size'}</span><button type="button" data-qa-guide>Size guide</button></div>
<div class="sizes" role="group" aria-label="Size">${sizeKeys.map(k => `<button class="size" data-qa-size="${esc(k)}" aria-pressed="${sel.size === k}" ${p.stock[k] ? '' : 'disabled aria-label="' + esc(k) + ' sold out"'}>${esc(k)}</button>`).join('')}</div>
<p class="stock-note ${sel.size && p.stock[sel.size] <= 3 ? 'low' : ''}" id="qa-note" style="margin-top:10px">${sel.size ? (p.stock[sel.size] <= 3 ? 'Only ' + p.stock[sel.size] + ' left in this size' : 'In stock') : ''}</p></div>
<button class="btn btn-primary btn-block" data-qa-add>Add to Cart — ${inr(p.price)}</button></div>`;
    };
    draw();
    openEl(modal, { focus: '.size:not(:disabled)' });
    modal.onclick = e => {
      if (e.target.closest('[data-modal-close]')) return closeLayer();
      const col = e.target.closest('[data-qa-color]'), sz = e.target.closest('[data-qa-size]');
      if (col) { sel.ci = +col.dataset.qaColor; draw(); $(`[data-qa-color="${sel.ci}"]`, modal).focus(); }
      else if (sz) { sel.size = sz.dataset.qaSize; draw(); $(`[data-qa-size="${CSS.escape(sel.size)}"]`, modal).focus(); }
      else if (e.target.closest('[data-qa-guide]')) { closeLayer(true); sizeGuide(p.cat); }
      else if (e.target.closest('[data-qa-add]')) {
        if (!sel.size) { const n = $('#qa-note'); n.textContent = 'Pick a size to continue.'; n.className = 'stock-note err'; $$('.size', modal)[0].focus(); return; }
        modal.onclick = null; closeLayer(true); addAndOpen(p, sel.ci, sel.size, 1);
      }
    };
  }
  function addAndOpen(p, ci, size, qty) {
    const r = S.addToCart(p.id, ci, size, qty);
    if (!r.ok) { toast(r.msg); return r; }
    if (r.capped) toast(`Only ${r.max} available in this size — cart updated.`);
    setTimeout(openCart, 30);
    return r;
  }

  /* ---------- cart drawer ---------- */
  const cartDrawer = $('#cart-drawer');
  function lineHTML(l, i) {
    const p = S.byId(l.pid), c = p.colors[l.ci], max = S.sizeStock(p, l.size);
    return `<li class="line" data-i="${i}">
  <a href="${href(p, l.ci)}" data-close><img src="${Art.src(p, l.ci, Art.views(p)[0].key)}" alt="" width="84" height="84"></a>
  <div class="info"><h3><a href="${href(p, l.ci)}" data-close>${esc(p.name)}</a></h3>
    <div class="var">${esc(c.name)} · ${p.cat === 'sneakers' ? 'UK ' : ''}${esc(l.size)}</div>
    <div class="price tab-nums">${inr(p.price * l.qty)}</div>
    <div class="bottom">
      <div class="qty" role="group" aria-label="Quantity for ${esc(p.name)}"><button data-act="dec" data-i="${i}" aria-label="Decrease quantity" ${l.qty <= 1 ? 'disabled' : ''}>−</button><output>${l.qty}</output><button data-act="inc" data-i="${i}" aria-label="Increase quantity" ${l.qty >= max ? 'disabled' : ''}>+</button></div>
      <button class="rm" data-act="remove" data-i="${i}">Remove</button>
    </div>
    ${l.qty >= max && max <= 3 ? `<div class="stock-note low">Max available</div>` : ''}
  </div></li>`;
  }
  function shipBar(t) {
    const pct = Math.min(100, Math.round((1 - t.toFree / S.FREE_SHIP_AT) * 100));
    return `<div class="ship-bar">${t.toFree > 0 ? `<span>Add <b>${inr(t.toFree)}</b> more for free shipping</span>` : `<span><b>Free standard shipping</b> unlocked</span>`}<div class="bar"><i style="width:${pct}%"></i></div></div>`;
  }
  function renderCart() {
    const body = $('#cart-body'), foot = $('#cart-foot');
    if (!S.cart.length) {
      body.innerHTML = `<div class="empty" style="border:0;background:none;padding:64px 0"><h2 class="display">Cart is empty</h2><p>Nothing in here yet. Start with the drop everyone is asking about.</p><a class="btn btn-primary" href="#/new" data-close>Shop New Arrivals</a></div>`;
      foot.hidden = true; return;
    }
    foot.hidden = false;
    const t = S.totals();
    body.innerHTML = shipBar(t) + `<ul>${S.cart.map(lineHTML).join('')}</ul>`;
    foot.innerHTML = `<div class="sum"><div><span>Subtotal</span><span class="v">${inr(t.sub)}</span></div>${t.disc ? `<div class="disc"><span>${esc(S.promo)}</span><span class="v">−${inr(t.disc)}</span></div>` : ''}<div class="muted" style="font-size:13px"><span>Shipping &amp; COD fee calculated at checkout</span></div></div>
<a class="btn btn-primary btn-block" href="#/checkout" data-close>Checkout</a><a class="btn btn-ghost btn-block" href="#/cart" data-close>View cart</a>`;
  }
  function openCart() { renderCart(); openEl(cartDrawer, { focus: '.x-btn' }); }
  $('#cart-btn').addEventListener('click', openCart);
  $('#tab-cart').addEventListener('click', openCart);

  /* cart actions (drawer + cart page) */
  function cartAction(act, i) {
    i = +i;
    if (act === 'inc') S.setQty(i, S.cart[i].qty + 1);
    else if (act === 'dec') S.setQty(i, S.cart[i].qty - 1);
    else if (act === 'remove') {
      const idx = i, line = S.removeAt(idx), p = S.byId(line.pid);
      toast(`${p.name} removed`, { label: 'Undo', fn: () => S.restore(line, Math.min(idx, S.cart.length)) });
    }
  }

  /* ---------- global click handling for cards ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    if (act === 'wish') {
      e.preventDefault();
      const p = S.byId(b.dataset.id), on = S.toggleWish(p.id);
      toast(on ? `${p.name} saved to wishlist` : `${p.name} removed from wishlist`, on ? { label: 'View', fn: () => { location.hash = '#/wishlist'; } } : null);
    } else if (act === 'quick-add') quickAdd(b.dataset.id);
    else if (act === 'card-color') {
      const p = S.byId(b.dataset.id), ci = +b.dataset.ci, card = b.closest('.card'), vs = Art.views(p, ci);
      let imgs = $$('.card-media img', card);
      imgs[0].src = Art.src(p, ci, 'p0');
      if (vs.length > 1) {
        if (!imgs[1]) { const a = imgs[0].cloneNode(); a.className = 'alt'; imgs[0].after(a); imgs = $$('.card-media img', card); }
        imgs[1].src = Art.src(p, ci, 'p1');
      } else if (imgs[1]) imgs[1].remove();
      $$('[data-act="card-color"]', card).forEach(x => x.setAttribute('aria-pressed', x === b));
      $$('a', card).forEach(a => { if (a.getAttribute('href').startsWith('#/product/')) a.href = href(p, ci); });
    } else if (act === 'inc' || act === 'dec' || act === 'remove') { cartAction(act, b.dataset.i); }
  });

  /* ---------- header: ticker, badges, nav state ---------- */
  const TICK = ['Free shipping over ₹2,999', 'Cash on delivery across India', 'UPI · Cards · COD', '7-day easy returns', 'FW26 drop is live'];
  $('#ticker').innerHTML = [...TICK, ...TICK, ...TICK, ...TICK].map(t => `<span>${t}</span>`).join('');

  function syncChrome() {
    const c = S.count(), w = S.wish.length;
    const cn = $('#cart-n'), wn = $('#wish-n');
    cn.textContent = c; cn.dataset.n = c; wn.textContent = w; wn.dataset.n = w;
    const tc = $('#tab-cart-n'), tw = $('#tab-wish-n');
    tc.textContent = c; tc.dataset.n = c; tw.textContent = w; tw.dataset.n = w;
    $('#cart-btn').setAttribute('aria-label', `Cart, ${c} item${c === 1 ? '' : 's'}`);
    $('#tab-cart').setAttribute('aria-label', `Cart, ${c} item${c === 1 ? '' : 's'}`);
    $$('[data-act="wish"]').forEach(b => {
      const on = S.isWished(b.dataset.id), p = S.byId(b.dataset.id);
      b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', `${on ? 'Remove' : 'Add'} ${p.name} ${on ? 'from' : 'to'} wishlist`);
    });
    $$('.wish-btn').forEach(b => b.setAttribute('aria-pressed', S.isWished(b.dataset.id)));
    if (cartDrawer.classList.contains('open')) renderCart();
  }
  S.subscribe(syncChrome);


  /* ---------- search ---------- */
  const searchPanel = $('#search-panel'), sInput = $('#search-input');
  const HINTS = ['High top', 'Snapback', 'Black', 'Olive', 'Dad cap', 'Under 1500'];
  function haystack(p) {
    return [p.name, p.article, p.cat, p.cat === 'sneakers' ? 'sneaker shoe trainer' : 'cap hat', p.shape === 'high' ? 'high top hightop' : p.shape === 'low' ? 'low top' : p.shape === 'chunky' ? 'chunky platform' : p.shape === 'dad' ? 'dad curved' : p.shape === 'snap' ? 'snapback flat brim' : 'camper 5 panel five panel', p.tagline, p.colors.map(c => c.name + ' ' + c.family).join(' ')].join(' ').toLowerCase();
  }
  function search(q) {
    q = q.toLowerCase().trim(); if (!q) return [];
    const under = q.match(/under\s*₹?\s*(\d[\d,]*)/);
    if (under) { const lim = +under[1].replace(/,/g, ''); return S.products.filter(p => p.price <= lim).sort((a, b) => a.price - b.price); }
    const toks = q.split(/\s+/).filter(Boolean);
    return S.products.filter(p => { const h = haystack(p); return toks.every(t => h.includes(t.replace(/s$/, ''))); });
  }
  function drawSearch() {
    const q = sInput.value, res = search(q), box = $('#search-res');
    if (!q.trim()) { box.innerHTML = ''; return; }
    if (!res.length) { box.innerHTML = `<p class="muted" style="padding:24px 0">No match for “${esc(q)}”. Try “black”, “high top” or “snapback”.</p>`; return; }
    box.innerHTML = res.slice(0, 6).map(p => `<a class="s-row" href="${href(p)}"><img src="${Art.src(p, 0, Art.views(p)[0].key)}" alt="" width="64" height="64"><div><b>${esc(p.name)}</b><small>${p.article} · ${p.cat}</small></div><span class="price">${inr(p.price)}</span></a>`).join('') +
      (res.length > 6 ? `<a class="s-row" href="#/search?q=${encodeURIComponent(q)}" style="grid-template-columns:1fr auto"><b class="label" style="color:var(--ink)">See all ${res.length} results</b>${icon('arrow')}</a>` : '');
  }
  function openSearch() {
    if (openLayer) closeLayer(true);
    searchPanel.hidden = false; $('#search-btn').setAttribute('aria-expanded', 'true'); $('#tab-search').setAttribute('aria-expanded', 'true');
    $('#search-hints').innerHTML = `<span class="label" style="margin-right:6px">Try</span>` + HINTS.map(h => `<button type="button" class="chip" data-hint="${h}">${h}</button>`).join('');
    scrim.hidden = false; requestAnimationFrame(() => scrim.classList.add('open'));
    scrim.style.zIndex = 50; sInput.focus(); drawSearch();
  }
  function closeSearch() {
    searchPanel.hidden = true; $('#search-btn').setAttribute('aria-expanded', 'false'); $('#tab-search').setAttribute('aria-expanded', 'false');
    if (!openLayer) { scrim.classList.remove('open'); setTimeout(() => { if (!openLayer) scrim.hidden = true; scrim.style.zIndex = ''; }, 200); }
    const vis = [$('#search-btn'), $('#tab-search')].find(b => b.offsetParent !== null);
    if (vis) vis.focus({ preventScroll: true });
  }
  $('#search-btn').addEventListener('click', () => searchPanel.hidden ? openSearch() : closeSearch());
  $('#tab-search').addEventListener('click', () => searchPanel.hidden ? openSearch() : closeSearch());
  $('#search-close').addEventListener('click', closeSearch);
  sInput.addEventListener('input', drawSearch);
  $('#search-form').addEventListener('submit', e => {
    e.preventDefault(); const q = sInput.value.trim(); if (!q) return;
    closeSearch(); location.hash = '#/search?q=' + encodeURIComponent(q);
  });
  $('#search-hints').addEventListener('click', e => { const h = e.target.closest('[data-hint]'); if (h) { sInput.value = h.dataset.hint; drawSearch(); sInput.focus(); } });
  searchPanel.addEventListener('click', e => { if (e.target.closest('a.s-row')) closeSearch(); });
  scrim.addEventListener('click', () => { if (!searchPanel.hidden) closeSearch(); });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && searchPanel.hidden) { e.preventDefault(); openSearch(); }
  });

  /* newsletter */
  $('#news-form').addEventListener('submit', e => {
    e.preventDefault(); const i = $('#news-email');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value.trim())) { toast('Enter a valid email to get drop alerts.'); i.focus(); return; }
    toast('You\'re on the list. Next drop, first.'); i.value = '';
  });

  window.UI = { openEl, $, $$, esc, icon, inr, cardHTML, priceHTML, tagsHTML, href, off, toast, openModal, closeLayer, sizeGuide, quickAdd, addAndOpen, openCart, lineHTML, shipBar, cartAction, barcode, FAMILY_HEX, FAMILIES, closeSearch, syncChrome };
})();
