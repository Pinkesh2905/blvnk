/* BLVNK pages (1/2): home, catalogue, product, wishlist */
(function () {
  'use strict';
  const { $, $$, esc, icon, inr, cardHTML, priceHTML, tagsHTML, href, off, toast } = UI;
  const P = (window.Pages = window.Pages || {});
  const fmtDay = d => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  UI.fmtDay = fmtDay;

  /* =============== HOME =============== */
  P.home = function () {
    const hero = S.bySlug('slab-high');
    const news = S.products.filter(p => p.isNew).sort((a, b) => b.added.localeCompare(a.added)).slice(0, 4);
    const best = S.products.filter(p => p.best).sort((a, b) => b.sold - a.sold).slice(0, 4);
    const nS = S.products.filter(p => p.cat === 'sneakers').length, nC = S.products.filter(p => p.cat === 'caps').length;
    const tileImg = (id, ci, view) => UI.imgAttrs(S.byId(id), ci, view, '(max-width: 720px) 100vw, 50vw', 720);
    return {
      title: 'BLVNK — Sneakers & Caps. Not made to blend in.',
      nav: 'home',
      html: `
<section class="hero" aria-labelledby="hero-h">
  <div class="wrap">
    <div class="hero-copy">
      <p class="label">FW26 &nbsp;/&nbsp; Drop 05 &nbsp;/&nbsp; Sneakers &amp; caps only</p>
      <h1 class="display" id="hero-h">Not made<br>to blend <em>in.</em></h1>
      <p class="lead">Two products, made in small runs. Sneakers and caps for people who’d rather be noticed than matched.</p>
      <div class="cta"><a class="btn btn-primary" href="#/sneakers">Shop Sneakers ${icon('arrow')}</a><a class="btn btn-ghost" href="#/caps">Shop Caps</a></div>
    </div>
    <div class="hero-media">
      <img ${UI.imgAttrs(hero, 0, 'p0', '(max-width: 900px) 100vw, 46vw')} alt="${esc(hero.name)} sneaker in black" width="800" height="800" fetchpriority="high">
      <a class="hang" href="${href(hero)}"><span class="mono">${hero.article}${hero.isNew ? ' · New' : ''}</span><b>${esc(hero.name)}</b><span class="mono">${inr(hero.price)} →</span></a>
    </div>
  </div>
  <div class="facts"><div class="wrap">
    <div><b>Sneakers + caps</b>Nothing else. Ever.</div>
    <div><b>Ships pan-India</b>2–6 working days</div>
    <div><b>UPI · Card · COD</b>Pay how you like</div>
    <div><b>7-day returns</b>Unworn, in the box</div>
  </div></div>
</section>

<div class="strip" aria-hidden="true"><div class="strip-track">${Array(8).fill('<span>Not made to blend in</span>').join('')}</div></div>

<section class="section wrap" aria-labelledby="cat-h">
  <div class="section-head"><h2 class="display h-sec" id="cat-h">Shop by category</h2><a class="link label" href="#/shop">All ${nS + nC} products</a></div>
  <div class="cat-tiles">
    <a class="tile" href="#/sneakers"><img ${tileImg('sn03', 0, 'p0')} alt="" loading="lazy" width="800" height="800"><div><h3 class="display">Sneakers</h3><p class="label">${nS} styles from ${inr(Math.min(...S.products.filter(p => p.cat === 'sneakers').map(p => p.price)))}</p></div><span class="arrow">${icon('arrow')}</span></a>
    <a class="tile" href="#/caps"><img ${tileImg('cp01', 0, 'p0')} alt="" loading="lazy" width="800" height="800"><div><h3 class="display">Caps</h3><p class="label">${nC} styles from ${inr(Math.min(...S.products.filter(p => p.cat === 'caps').map(p => p.price)))}</p></div><span class="arrow">${icon('arrow')}</span></a>
  </div>
</section>

<section class="section wrap" aria-labelledby="new-h">
  <div class="section-head"><h2 class="display h-sec" id="new-h">New arrivals</h2><a class="link label" href="#/new">See all new</a></div>
  <div class="grid g4">${news.map(cardHTML).join('')}</div>
</section>

<section class="section wrap" aria-labelledby="best-h">
  <div class="section-head"><h2 class="display h-sec" id="best-h">Best sellers</h2><a class="link label" href="#/shop?sort=featured">Shop everything</a></div>
  <div class="grid g4">${best.map(cardHTML).join('')}</div>
</section>

<section class="section wrap" style="padding-bottom:96px" aria-labelledby="brand-h">
  <div class="brand">
    <div>
      <p class="label" style="margin-bottom:18px">About the label</p>
      <h2 class="display" id="brand-h">Two products.<br>No filler.</h2>
      <p>BLVNK makes sneakers and caps — and only sneakers and caps. No tees, no hoodies, no accessories to pad out a catalogue. Every drop is small, numbered and finished like the only thing we made.</p>
      <p><b>The V is the point.</b> BLVNK is a blank that refuses to stay blank: black and charcoal bases, white strips, and a double slash you’ll recognise from across the street.</p>
      <p style="margin-top:28px"><a class="btn btn-ghost" href="#/page/about">Read our story</a></p>
    </div>
    <div class="carton" aria-label="BLVNK carton label">
      <div class="carton-top"><span class="logo">BL<i>V</i>NK</span><span>FW26 / Drop 05</span></div>
      <div class="carton-grid">
        <div><small>Category</small><b>Sneakers</b></div><div><small>Styles</small><b>${String(nS).padStart(2, '0')}</b></div>
        <div><small>Category</small><b>Caps</b></div><div><small>Styles</small><b>${String(nC).padStart(2, '0')}</b></div>
        <div class="full"><small>Ship to</small><b>Anywhere in India <span class="hl">/</span> COD available</b></div>
      </div>
      <div class="carton-bar">${UI.barcode('BLVNK-FW26-D05')}<small>BLVNK-FW26-D05</small></div>
    </div>
  </div>
</section>`
    };
  };

  /* =============== CATALOGUE =============== */
  const PMAX = 12000, PSTEP = 100;
  const SIZE_GROUPS = [
    { cat: 'sneakers', label: 'Sneakers · UK', sizes: ['6', '7', '8', '9', '10', '11'] },
    { cat: 'caps', label: 'Caps', sizes: ['S/M', 'L/XL', 'One Size'] }
  ];
  const ROUTE_FOR = { all: '#/shop', sneakers: '#/sneakers', caps: '#/caps', new: '#/new' };
  const SORTS = [['featured', 'Featured'], ['newest', 'Newest'], ['price-asc', 'Price: Low to High'], ['price-desc', 'Price: High to Low']];

  function parseShop(ctx) {
    const q = ctx.query, set = k => new Set((q.get(k) || '').split(',').filter(Boolean));
    return {
      cat: ctx.cat || 'all', q: q.get('q') || '', sort: SORTS.some(s => s[0] === q.get('sort')) ? q.get('sort') : (ctx.cat === 'new' ? 'newest' : 'featured'),
      min: Math.max(0, +q.get('min') || 0), max: Math.min(PMAX, +q.get('max') || PMAX),
      size: set('size'), color: set('color'), inS: q.get('in') === '1', out: q.get('out') === '1'
    };
  }
  function shopHash(st) {
    const p = new URLSearchParams();
    if (st.cat === 'all' && st.q) { /* search route */ }
    if (st.q) p.set('q', st.q);
    const defSort = st.cat === 'new' ? 'newest' : 'featured';
    if (st.sort !== defSort) p.set('sort', st.sort);
    if (st.min > 0) p.set('min', st.min);
    if (st.max < PMAX) p.set('max', st.max);
    if (st.size.size) p.set('size', [...st.size].join(','));
    if (st.color.size) p.set('color', [...st.color].join(','));
    if (st.inS) p.set('in', '1');
    if (st.out) p.set('out', '1');
    const base = st.q && st.cat === 'all' ? '#/search' : ROUTE_FOR[st.cat];
    const s = p.toString();
    return base + (s ? '?' + s : '');
  }
  function applyFilters(st, skip) {
    let list = S.products.filter(p => {
      if (st.cat === 'new') { if (!p.isNew) return false; }
      else if (st.cat !== 'all' && p.cat !== st.cat) return false;
      if (st.q) { const r = UI.searchIds ? UI.searchIds(st.q) : null; if (r && !r.has(p.id)) return false; }
      if (skip !== 'price' && (p.price < st.min || p.price > st.max)) return false;
      if (st.size.size && ![...st.size].some(s => p.stock[s] > 0)) return false;
      if (st.color.size && !p.colors.some(c => st.color.has(c.family))) return false;
      if (st.inS !== st.out) { const sold = S.status(p) === 'sold'; if (st.inS && sold) return false; if (st.out && !sold) return false; }
      return true;
    });
    const by = { featured: (a, b) => a.rank - b.rank, newest: (a, b) => b.added.localeCompare(a.added), 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price }[st.sort];
    return list.sort(by);
  }
  const TITLES = { all: 'All Products', sneakers: 'Sneakers', caps: 'Caps', new: 'New Arrivals' };

  P.shop = function (ctx) {
    const st = parseShop(ctx);
    const title = st.q ? `Results for “${esc(st.q)}”` : TITLES[st.cat];
    const catCount = c => S.products.filter(p => c === 'all' ? true : p.cat === c).length;
    const groups = SIZE_GROUPS.filter(g => st.cat === 'all' || st.cat === 'new' || g.cat === st.cat);
    return {
      title: `${st.q ? 'Search' : TITLES[st.cat]} — BLVNK`,
      nav: st.cat === 'all' ? '' : st.cat,
      html: `
<div class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><i>/</i>${st.cat === 'all' && !st.q ? '<span aria-current="page">Shop</span>' : `<a href="#/shop">Shop</a><i>/</i><span aria-current="page">${st.q ? 'Search' : TITLES[st.cat]}</span>`}</nav>
  <div class="shop-head">
    <div><h1 class="display">${title}</h1><p class="count" id="count" aria-live="polite"></p></div>
    <div class="shop-tools">
      <button class="btn btn-ghost filter-btn" id="filter-open" aria-controls="sidebar">${icon('filter')} Filters<span id="filter-n"></span></button>
      <div class="sort"><label for="sort">Sort by</label><select class="input" id="sort">${SORTS.map(s => `<option value="${s[0]}" ${s[0] === st.sort ? 'selected' : ''}>${s[1]}</option>`).join('')}</select></div>
    </div>
  </div>
  <div class="shop">
    <aside class="sidebar" id="sidebar" aria-label="Categories and filters">
      <div class="sidebar-head"><h2 class="display" style="font-size:20px">Filters</h2><button class="x-btn" data-close aria-label="Close filters">${icon('x')}</button></div>
      <div class="sidebar-inner">
        <div class="side-sec"><h2>Categories</h2>
          <nav class="cats" aria-label="Categories">
            <a href="#/shop" ${st.cat === 'all' && !st.q ? 'aria-current="true"' : ''}>All Products<span>${catCount('all')}</span></a>
            <a href="#/sneakers" ${st.cat === 'sneakers' ? 'aria-current="true"' : ''}>Sneakers<span>${catCount('sneakers')}</span></a>
            <a href="#/caps" ${st.cat === 'caps' ? 'aria-current="true"' : ''}>Caps<span>${catCount('caps')}</span></a>
          </nav>
        </div>
        <div class="side-sec"><h2><span>Filters</span><button class="clear-all" id="clear-all" hidden>Clear all</button></h2></div>
        <div class="side-sec" style="border-top:0;padding-top:0"><h2>Price</h2>
          <div class="range" id="range"><div class="track"></div><div class="fill" id="r-fill"></div>
            <input type="range" id="p-min" min="0" max="${PMAX}" step="${PSTEP}" value="${st.min}" aria-label="Minimum price">
            <input type="range" id="p-max" min="0" max="${PMAX}" step="${PSTEP}" value="${st.max}" aria-label="Maximum price"></div>
          <div class="range-out mono"><span id="r-min"></span><span id="r-max"></span></div>
        </div>
        <div class="side-sec"><h2>Size</h2>
          ${groups.map(g => `<div class="size-group"><span class="label">${g.label}</span><div class="sizes" role="group" aria-label="${g.label}">${g.sizes.map(s => `<button class="size sm" data-size="${s}" aria-pressed="${st.size.has(s)}">${s}</button>`).join('')}</div></div>`).join('')}
        </div>
        <div class="side-sec"><h2>Colour</h2>
          <div class="swatches" role="group" aria-label="Colour">${UI.FAMILIES.map(f => `<div class="sw-wrap"><button class="sw" style="--c:${UI.FAMILY_HEX[f]}" data-color="${f}" aria-pressed="${st.color.has(f)}" aria-label="${f}"></button><small>${f}</small></div>`).join('')}</div>
        </div>
        <div class="side-sec"><h2>Availability</h2>
          <label class="check"><input type="checkbox" id="a-in" ${st.inS ? 'checked' : ''}><span>In stock</span></label>
          <label class="check"><input type="checkbox" id="a-out" ${st.out ? 'checked' : ''}><span>Sold out</span></label>
        </div>
        <button class="btn btn-primary btn-block" data-close style="margin-top:8px" id="show-n">Show results</button>
      </div>
    </aside>
    <div id="results"></div>
  </div>
</div>`,
      mount(root) {
        const results = $('#results', root), side = $('#sidebar', root);
        const fmtP = v => inr(v);
        function drawRange() {
          const a = +$('#p-min', root).value, b = +$('#p-max', root).value;
          $('#r-fill', root).style.left = (a / PMAX * 100) + '%';
          $('#r-fill', root).style.right = (100 - b / PMAX * 100) + '%';
          $('#r-min', root).textContent = fmtP(a); $('#r-max', root).textContent = b >= PMAX ? fmtP(b) + '+' : fmtP(b);
        }
        function activeChips() {
          const c = [];
          if (st.min > 0 || st.max < PMAX) c.push(['price', `${inr(st.min)} – ${st.max >= PMAX ? inr(PMAX) + '+' : inr(st.max)}`]);
          st.size.forEach(s => c.push(['size:' + s, 'Size ' + s]));
          st.color.forEach(s => c.push(['color:' + s, s]));
          if (st.inS) c.push(['in', 'In stock']);
          if (st.out) c.push(['out', 'Sold out']);
          if (st.q) c.push(['q', `“${st.q}”`]);
          return c;
        }
        function syncSide() {
          $('#p-min', root).value = st.min; $('#p-max', root).value = st.max; drawRange();
          $$('[data-size]', side).forEach(b => b.setAttribute('aria-pressed', st.size.has(b.dataset.size)));
          $$('[data-color]', side).forEach(b => b.setAttribute('aria-pressed', st.color.has(b.dataset.color)));
          $('#a-in', root).checked = st.inS; $('#a-out', root).checked = st.out;
          $('#sort', root).value = st.sort;
        }
        function draw(push) {
          const list = applyFilters(st), chips = activeChips();
          $('#count', root).textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
          $('#filter-n', root).textContent = chips.length ? ` (${chips.length})` : '';
          $('#clear-all', root).hidden = !chips.length;
          $('#show-n', root).textContent = `Show ${list.length} result${list.length === 1 ? '' : 's'}`;
          results.innerHTML = (chips.length ? `<div class="active-chips" aria-label="Active filters">${chips.map(c => `<button class="chip on" data-rm="${esc(c[0])}" aria-label="Remove filter ${esc(c[1])}">${esc(c[1])} <span class="x" aria-hidden="true">×</span></button>`).join('')}</div>` : '') +
            (list.length ? `<div class="grid">${list.map(cardHTML).join('')}</div>` :
              `<div class="empty"><h2 class="display">No matches</h2><p>${st.q ? `Nothing for “${esc(st.q)}” with these filters.` : 'Nothing fits those filters right now.'} Loosen a filter or clear them all.</p><button class="btn btn-primary" data-clear>Clear filters</button></div>`);
          if (push !== false) history.replaceState(null, '', shopHash(st));
        }
        function clearAll() { st.min = 0; st.max = PMAX; st.size.clear(); st.color.clear(); st.inS = st.out = false; syncSide(); draw(); }
        let raf = 0;
        const onRange = e => {
          let a = +$('#p-min', root).value, b = +$('#p-max', root).value;
          if (a > b) { if (e.target.id === 'p-min') a = b; else b = a; }
          $('#p-min', root).value = a; $('#p-max', root).value = b; st.min = a; st.max = b; drawRange();
          cancelAnimationFrame(raf); raf = requestAnimationFrame(() => draw());
        };
        $('#p-min', root).addEventListener('input', onRange); $('#p-max', root).addEventListener('input', onRange);
        $('#sort', root).addEventListener('change', e => { st.sort = e.target.value; draw(); });
        $('#a-in', root).addEventListener('change', e => { st.inS = e.target.checked; draw(); });
        $('#a-out', root).addEventListener('change', e => { st.out = e.target.checked; draw(); });
        side.addEventListener('click', e => {
          const sz = e.target.closest('[data-size]'), co = e.target.closest('[data-color]');
          if (sz) { const k = sz.dataset.size; st.size.has(k) ? st.size.delete(k) : st.size.add(k); syncSide(); draw(); }
          else if (co) { const k = co.dataset.color; st.color.has(k) ? st.color.delete(k) : st.color.add(k); syncSide(); draw(); }
          else if (e.target.closest('#clear-all')) clearAll();
        });
        results.addEventListener('click', e => {
          const rm = e.target.closest('[data-rm]');
          if (e.target.closest('[data-clear]')) return clearAll();
          if (!rm) return;
          const [k, v] = rm.dataset.rm.split(':');
          if (k === 'price') { st.min = 0; st.max = PMAX; } else if (k === 'size') st.size.delete(v); else if (k === 'color') st.color.delete(v);
          else if (k === 'in') st.inS = false; else if (k === 'out') st.out = false; else if (k === 'q') { st.q = ''; }
          syncSide(); draw();
        });
        $('#filter-open', root).addEventListener('click', () => UI.openEl(side, { focus: '.x-btn', onClose: () => side.removeAttribute('aria-hidden') }));
        syncSide(); draw(false);
      }
    };
  };

  /* =============== PRODUCT =============== */
  P.product = function (ctx) {
    const p = S.bySlug(ctx.parts[1]);
    if (!p) return P.notFound();
    let views = Art.views(p, 0); const sizeKeys = Object.keys(p.stock);
    const state = { ci: Math.min(+ctx.query.get('c') || 0, p.colors.length - 1), size: sizeKeys.length === 1 && p.stock[sizeKeys[0]] ? sizeKeys[0] : '', qty: 1, vi: 0, zip: '', eta: '' };
    const sold = S.status(p) === 'sold';
    const related = S.products.filter(x => x.cat === p.cat && x.id !== p.id).sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price)).slice(0, 4);

    const view = () => {
      const c = p.colors[state.ci], max = state.size ? p.stock[state.size] : 0;
      views = Art.views(p, state.ci); state.vi = Math.min(state.vi, views.length - 1);
      const stageAttrs = UI.imgAttrs(p, state.ci, views[state.vi].key, '(max-width: 900px) 100vw, 56vw', 1200), multi = views.length > 1;
      const note = !state.size ? '' : (max <= 3 ? `Only ${max} left in this size` : 'In stock — ships in 24 hours');
      return `
<nav class="crumbs" aria-label="Breadcrumb" style="padding-top:22px"><a href="#/">Home</a><i>/</i><a href="#/${p.cat}">${p.cat === 'sneakers' ? 'Sneakers' : 'Caps'}</a><i>/</i><span aria-current="page">${esc(p.name)}</span></nav>
<div class="pdp">
  <div class="gallery${multi ? '' : ' single'}" aria-label="Product images">
    ${multi ? '<div class="thumbs">' : '<div class="thumbs" hidden>'}${views.map((v, i) => `<button class="thumb" data-vi="${i}" aria-current="${i === state.vi}" aria-label="${v.label} view"><img src="${Art.src(p, state.ci, v.key, 360)}" alt="" width="84" height="84" loading="lazy" decoding="async"></button>`).join('')}</div>
    <div class="stage" id="stage" tabindex="0" aria-roledescription="carousel" aria-label="${esc(p.name)} — ${views[state.vi].label} view, image ${state.vi + 1} of ${views.length}">
      <img ${stageAttrs} alt="${esc(p.name)} in ${esc(c.name)}, ${views[state.vi].label.toLowerCase()} view" width="800" height="800" fetchpriority="high">
      ${tagsHTML(p)}
      ${multi ? `<button class="nav-arrow prev" data-step="-1" aria-label="Previous image">${icon('left')}</button><button class="nav-arrow next" data-step="1" aria-label="Next image">${icon('right')}</button>
      <span class="count">${String(state.vi + 1).padStart(2, '0')} / ${String(views.length).padStart(2, '0')}</span>` : ''}
    </div>
  </div>
  <div class="pinfo">
    <div><p class="label mono">${p.article} &nbsp;/&nbsp; ${p.cat === 'sneakers' ? 'Sneaker' : 'Cap'}</p>
      <h1 class="display" style="margin-top:12px">${esc(p.name)}</h1></div>
    <p class="lead">${esc(p.tagline)}</p>
    <div><div class="price">${inr(p.price)}${p.was ? `<s>${inr(p.was)}</s><span class="off">−${off(p)}%</span>` : ''}</div><p class="label" style="margin-top:6px;font-size:11px">Incl. GST · Free shipping over ${inr(S.FREE_SHIP_AT)}</p></div>
    <div>
      <div class="opt-head"><span class="label">Colour — <b>${esc(c.name)}</b></span></div>
      <div class="dots" role="group" aria-label="Colour" style="gap:20px;padding:4px">${p.colors.map((x, i) => `<button class="sw" style="--c:${x.swatch}" data-ci="${i}" aria-pressed="${i === state.ci}" aria-label="${esc(x.name)}"></button>`).join('')}</div>
    </div>
    <div>
      <div class="opt-head"><span class="label">${p.cat === 'sneakers' ? 'Size (UK)' : 'Size'}${state.size ? ` — <b>${esc(state.size)}</b>` : ''}</span><button type="button" data-guide>Size guide</button></div>
      <div class="sizes" role="group" aria-label="Size" id="sizes">${sizeKeys.map(k => `<button class="size" data-size="${esc(k)}" aria-pressed="${state.size === k}" ${p.stock[k] ? '' : `disabled aria-label="${esc(k)}, sold out"`}>${esc(k)}</button>`).join('')}</div>
      <p class="stock-note ${max && max <= 3 ? 'low' : ''}" id="note" style="margin-top:10px" aria-live="polite">${sold ? 'Sold out' : note}</p>
    </div>
    ${sold ? `<form class="buy" id="notify" novalidate><div class="field"><label for="n-email">Notify me when it’s back</label><input class="input" id="n-email" name="email" type="email" inputmode="email" autocomplete="email" spellcheck="false" placeholder="you@email.com"><span class="msg">Enter a valid email.</span></div><button class="btn btn-primary btn-block" type="submit">Notify me</button></form>` : `
    <div class="buy">
      <div class="buy-row">
        <div class="qty" role="group" aria-label="Quantity"><button data-q="-1" aria-label="Decrease quantity" ${state.qty <= 1 ? 'disabled' : ''}>−</button><output>${state.qty}</output><button data-q="1" aria-label="Increase quantity" ${state.size && state.qty >= max ? 'disabled' : ''}>+</button></div>
        <button class="btn btn-primary" id="add">Add to Cart</button>
        <button class="wish-btn" data-act="none" data-id="${p.id}" id="wish2" aria-pressed="${S.isWished(p.id)}" aria-label="Toggle wishlist for ${esc(p.name)}">${icon('heart')}</button>
      </div>
      <button class="btn btn-ghost btn-block" id="buy-now">Buy it now</button>
    </div>`}
    <div class="field">
      <label for="zip">Delivery estimate</label>
      <div class="promo"><input class="input" id="zip" name="pincode" inputmode="numeric" autocomplete="postal-code" maxlength="6" placeholder="Enter 6-digit pincode" value="${state.zip}"><button class="btn btn-ghost" id="zip-go" type="button">Check</button></div>
      <span class="hint" id="zip-out" aria-live="polite">${state.eta || 'Enter your pincode for delivery dates.'}</span>
    </div>
    <div class="acc">
      <details open><summary>Details</summary><div class="acc-body"><p style="margin-bottom:12px">${esc(p.desc)}</p><ul>${p.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div></details>
      <details><summary>Shipping</summary><div class="acc-body"><p>Standard delivery in 4–6 working days, free over ${inr(S.FREE_SHIP_AT)} (otherwise ${inr(S.STD_SHIP)}). Express in 1–2 days for ${inr(S.EXPRESS_SHIP)}. Cash on delivery adds ${inr(S.COD_FEE)}.</p></div></details>
      <details><summary>Returns</summary><div class="acc-body"><p>Not right? Return unworn items in the original box within 7 days of delivery for a refund or exchange. <a class="link" href="#/page/returns">Full policy</a>.</p></div></details>
    </div>
    <div class="carton" aria-label="Product label">
      <div class="carton-top"><span class="logo">BL<i>V</i>NK</span><span>FW26 / ${p.cat === 'sneakers' ? 'SN' : 'CP'}</span></div>
      <div class="carton-grid">
        <div><small>Article</small><b>${p.article}</b></div><div><small>${p.cat === 'sneakers' ? 'UK size' : 'Size'}</small><b>${state.size ? esc(state.size) : '—'}</b></div>
        <div class="full"><small>Colour</small><b>${esc(c.name)}</b></div>
      </div>
      <div class="carton-bar">${UI.barcode(p.article + '-' + String(state.ci) + (state.size || 'X'))}<small>${p.article}</small></div>
    </div>
  </div>
</div>
<section class="section" style="padding:72px 0 96px"><div class="section-head"><h2 class="display h-sec">You may also like</h2><a class="link label" href="#/${p.cat}">More ${p.cat}</a></div><div class="grid g4">${related.map(cardHTML).join('')}</div></section>`;
    };

    return {
      title: `${p.name} — BLVNK ${p.cat === 'sneakers' ? 'Sneakers' : 'Caps'}`, nav: p.cat,
      html: `<div class="wrap" id="pdp-root">${view()}</div>`,
      mount(root) {
        const box = $('#pdp-root', root);
        const redraw = (focusSel) => {
          const y = window.scrollY; box.innerHTML = view(); window.scrollTo(0, y);
          if (focusSel) { const f = $(focusSel, box); if (f) f.focus({ preventScroll: true }); }
          history.replaceState(null, '', UI.href(p, state.ci));
        };
        const add = (go) => {
          if (!state.size) { const n = $('#note', box); n.textContent = `Select a ${p.cat === 'sneakers' ? 'size' : 'size'} first`; n.className = 'stock-note err'; $('.size:not(:disabled)', box).focus(); return; }
          const r = S.addToCart(p.id, state.ci, state.size, state.qty);
          if (!r.ok) { toast(r.msg); return; }
          if (r.capped) toast(`Only ${r.max} available in this size — cart updated.`);
          if (go) location.hash = '#/checkout'; else UI.openCart();
        };
        box.addEventListener('click', e => {
          const t = e.target;
          let b;
          if ((b = t.closest('[data-vi]'))) { state.vi = +b.dataset.vi; redraw(`[data-vi="${state.vi}"]`); }
          else if ((b = t.closest('[data-step]'))) { state.vi = (state.vi + +b.dataset.step + views.length) % views.length; redraw('#stage'); }
          else if ((b = t.closest('[data-ci]'))) { state.ci = +b.dataset.ci; redraw(`[data-ci="${state.ci}"]`); }
          else if ((b = t.closest('[data-size]')) && b.closest('#sizes')) { state.size = b.dataset.size; state.qty = Math.min(state.qty, p.stock[state.size]); redraw(`[data-size="${CSS.escape(state.size)}"]`); }
          else if ((b = t.closest('[data-q]'))) { const max = state.size ? p.stock[state.size] : 10; state.qty = Math.max(1, Math.min(max, state.qty + +b.dataset.q)); redraw(`[data-q="${b.dataset.q}"]`); }
          else if (t.closest('#add')) add(false);
          else if (t.closest('#buy-now')) add(true);
          else if (t.closest('[data-guide]')) UI.sizeGuide(p.cat);
          else if ((b = t.closest('#wish2'))) { const on = S.toggleWish(p.id); toast(on ? `${p.name} saved to wishlist` : `${p.name} removed from wishlist`); }
          else if (t.closest('#zip-go')) checkZip();
        });
        const checkZip = () => {
          const z = $('#zip', box).value.trim(), out = $('#zip-out', box);
          state.zip = z;
          if (!/^[1-9]\d{5}$/.test(z)) { out.textContent = 'Enter a valid 6-digit pincode.'; out.style.color = 'var(--err)'; return; }
          const d = new Date(); d.setDate(d.getDate() + 5);
          state.eta = `Delivers by ${fmtDay(d)} to ${z} · Express by ${fmtDay(new Date(Date.now() + 2 * 864e5))}`;
          out.textContent = state.eta; out.style.color = 'var(--ok)';
        };
        box.addEventListener('keydown', e => {
          if (e.target.id === 'zip' && e.key === 'Enter') { e.preventDefault(); checkZip(); }
          if (e.target.id === 'stage' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { state.vi = (state.vi + (e.key === 'ArrowRight' ? 1 : -1) + views.length) % views.length; redraw('#stage'); }
        });
        box.addEventListener('submit', e => {
          if (e.target.id !== 'notify') return; e.preventDefault();
          const i = $('#n-email', box), f = i.closest('.field');
          const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value.trim()); f.classList.toggle('err', !ok);
          if (!ok) return i.focus(); toast(`We’ll email you when ${p.name} is back.`); i.value = '';
        });
        box.addEventListener('mousemove', e => {
          const s = e.target.closest('#stage'); if (!s || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
          const r = s.getBoundingClientRect(); s.classList.add('zoom');
          s.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100) + '%'); s.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100) + '%');
        });
        box.addEventListener('mouseout', e => { const s = e.target.closest('#stage'); if (s && !s.contains(e.relatedTarget)) s.classList.remove('zoom'); });
      }
    };
  };

  /* =============== WISHLIST =============== */
  P.wishlist = function () {
    const list = S.wish.map(S.byId).filter(Boolean);
    return {
      title: 'Wishlist — BLVNK', nav: 'wishlist',
      html: `<div class="wrap"><div class="page-title"><p class="label">Saved items</p><h1 class="display" style="margin-top:12px">Wishlist</h1></div>
${list.length ? `<div class="grid" style="margin-bottom:96px">${list.map(cardHTML).join('')}</div>` : `<div class="empty" style="margin-bottom:96px"><h2 class="display">Nothing saved yet</h2><p>Tap the heart on anything you like and it’ll wait here. Saved on this device.</p><a class="btn btn-primary" href="#/shop">Browse all products</a></div>`}</div>`,
      mount(root) {
        const unsub = S.subscribe(() => { /* keep list stable so un-hearting doesn't yank cards away mid-click */ });
        root._cleanup = unsub;
      }
    };
  };

  /* =============== 404 =============== */
  P.notFound = function () {
    return { title: 'Not found — BLVNK', nav: '', html: `<div class="wrap"><div class="empty" style="margin:64px 0 96px"><p class="label">404</p><h2 class="display">That page blended in</h2><p>We couldn’t find what you were after. It may have sold out or moved.</p><a class="btn btn-primary" href="#/shop">Back to the shop</a></div></div>` };
  };

  /* search-id helper used by the catalogue (same matcher as the overlay) */
  UI.searchIds = q => {
    const toks = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const hay = p => [p.name, p.article, p.cat, p.cat === 'sneakers' ? 'sneaker shoe trainer' : 'cap hat', p.shape === 'high' ? 'high top hightop' : p.shape === 'low' ? 'low top' : p.shape === 'chunky' ? 'chunky platform' : p.shape === 'dad' ? 'dad curved' : p.shape === 'snap' ? 'snapback flat brim' : 'camper 5 panel five panel', p.tagline, p.colors.map(c => c.name + ' ' + c.family).join(' ')].join(' ').toLowerCase();
    const under = q.toLowerCase().match(/under\s*₹?\s*(\d[\d,]*)/);
    if (under) { const lim = +under[1].replace(/,/g, ''); return new Set(S.products.filter(p => p.price <= lim).map(p => p.id)); }
    return new Set(S.products.filter(p => { const h = hay(p); return toks.every(t => h.includes(t.replace(/s$/, ''))); }).map(p => p.id));
  };
})();
