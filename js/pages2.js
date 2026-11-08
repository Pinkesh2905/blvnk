/* BLVNK pages (2/2): cart, checkout, confirmation, account, info */
(function () {
  'use strict';
  const { $, $$, esc, icon, inr, href, toast } = UI;
  const P = window.Pages;
  const vs0 = p => Art.views(p)[0].key;
  const STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
  const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

  const field = (o) => `<div class="field" data-f="${o.name}"><label for="${o.id || o.name}">${o.label}</label>${o.select
    ? `<select class="input" id="${o.id || o.name}" name="${o.name}" autocomplete="${o.ac || 'off'}" ${o.req === false ? '' : 'required'}><option value="">Select</option>${o.select.map(s => `<option ${o.value === s ? 'selected' : ''}>${s}</option>`).join('')}</select>`
    : `<input class="input" id="${o.id || o.name}" name="${o.name}" type="${o.type || 'text'}" ${o.mode ? `inputmode="${o.mode}"` : ''} autocomplete="${o.ac || 'off'}" ${o.max ? `maxlength="${o.max}"` : ''} ${o.ph ? `placeholder="${o.ph}"` : ''} value="${esc(o.value || '')}" ${o.sp === false ? '' : 'spellcheck="false"'} ${o.req === false ? '' : 'required'}>`}<span class="msg">${o.msg || 'Required'}</span>${o.hint ? `<span class="hint">${o.hint}</span>` : ''}</div>`;

  function setErr(form, name, bad) { const f = $(`[data-f="${name}"]`, form); if (f) f.classList.toggle('err', !!bad); return bad; }
  function firstErr(form) { const f = $('.field.err .input', form); if (f) { f.focus(); f.scrollIntoView({ block: 'center', behavior: 'smooth' }); } return !!f; }

  /* =============== CART =============== */
  P.cart = function () {
    return {
      title: 'Your cart — BLVNK', nav: '',
      html: `<div class="wrap"><div class="page-title"><p class="label">Review</p><h1 class="display" style="margin-top:12px">Your cart</h1></div><div id="cart-view"></div></div>`,
      mount(root) {
        const view = $('#cart-view', root);
        const draw = () => {
          if (!S.cart.length) { view.innerHTML = `<div class="empty" style="margin-bottom:96px"><h2 class="display">Cart is empty</h2><p>Nothing here yet. Start with what’s new.</p><a class="btn btn-primary" href="#/new">Shop New Arrivals</a></div>`; return; }
          const t = S.totals(), applied = S.promo;
          view.innerHTML = `<div class="cart-page">
<div>${UI.shipBar(t)}<ul>${S.cart.map(UI.lineHTML).join('')}</ul><p style="margin-top:24px"><a class="link label" href="#/shop">← Continue shopping</a></p></div>
<aside class="panel sticky" aria-label="Order summary"><h2 class="display" style="font-size:22px">Summary</h2>
  <form class="field" id="promo-form" novalidate><label for="promo">Promo code</label><div class="promo"><input class="input" id="promo" name="promo" value="${esc(applied)}" autocomplete="off" spellcheck="false" autocapitalize="characters" placeholder="BLVNK10"><button class="btn btn-ghost" type="submit">${applied ? 'Update' : 'Apply'}</button></div><span class="promo-msg ${applied ? 'ok' : ''}" id="promo-msg" aria-live="polite">${applied ? applied + ' applied — 10% off' : ''}</span></form>
  <div class="sum"><div><span>Subtotal</span><span class="v">${inr(t.sub)}</span></div>${t.disc ? `<div class="disc"><span>Discount (${esc(applied)})</span><span class="v">−${inr(t.disc)}</span></div>` : ''}<div><span>Shipping</span><span class="v">${t.ship ? inr(t.ship) : 'Free'}</span></div><div class="tot"><span>Total</span><span>${inr(t.total)}</span></div></div>
  <p class="label" style="font-size:11px">Incl. GST · COD adds ${inr(S.COD_FEE)} · Express ${inr(S.EXPRESS_SHIP)}</p>
  <a class="btn btn-primary btn-block" href="#/checkout">Checkout</a></aside></div>`;
        };
        draw();
        const un = S.subscribe(draw); root._cleanup = un;
        view.addEventListener('submit', e => {
          if (e.target.id !== 'promo-form') return; e.preventDefault();
          const r = S.applyPromo($('#promo', view).value);
          if (!r.ok) { const m = $('#promo-msg', view); m.textContent = 'That code isn’t valid. Try BLVNK10.'; m.className = 'promo-msg bad'; $('#promo', view).focus(); }
          else toast(r.cleared ? 'Promo removed' : `Promo applied — ${r.label}`);
        });
      }
    };
  };

  /* =============== CHECKOUT =============== */
  P.checkout = function () {
    if (!S.cart.length) return { title: 'Checkout — BLVNK', nav: '', html: `<div class="wrap"><div class="empty" style="margin:64px 0 96px"><h2 class="display">Nothing to check out</h2><p>Your cart is empty.</p><a class="btn btn-primary" href="#/shop">Shop now</a></div></div>` };
    const u = S.user || {};
    const st = { ship: 'standard', pay: 'upi' };
    return {
      title: 'Checkout — BLVNK', nav: '',
      html: `<div class="wrap"><div class="page-title"><p class="label"><a class="link" href="#/cart">← Back to cart</a></p><h1 class="display" style="margin-top:12px">Checkout</h1></div>
<div class="co">
<form class="co-form" id="co" novalidate>
  <section class="co-step"><h2 class="display"><span class="n">01</span>Contact</h2>
    <div class="row">${field({ name: 'email', label: 'Email', type: 'email', mode: 'email', ac: 'email', value: u.email, msg: 'Enter a valid email address' })}${field({ name: 'phone', label: 'Mobile number', type: 'tel', mode: 'numeric', ac: 'tel-national', max: 10, ph: '10-digit number', value: u.phone, msg: 'Enter a valid 10-digit mobile number' })}</div></section>
  <section class="co-step"><h2 class="display"><span class="n">02</span>Shipping address</h2>
    <div class="row">${field({ name: 'fname', label: 'First name', ac: 'given-name', value: (u.name || '').split(' ')[0], sp: false })}${field({ name: 'lname', label: 'Last name', ac: 'family-name', value: (u.name || '').split(' ').slice(1).join(' '), sp: false })}</div>
    ${field({ name: 'addr1', label: 'Address', ac: 'address-line1', ph: 'House no., building, street', sp: false })}
    ${field({ name: 'addr2', label: 'Apartment, landmark (optional)', ac: 'address-line2', req: false, sp: false })}
    <div class="row">${field({ name: 'city', label: 'City', ac: 'address-level2', sp: false })}${field({ name: 'state', label: 'State', ac: 'address-level1', select: STATES })}</div>
    <div class="row">${field({ name: 'pin', label: 'Pincode', mode: 'numeric', ac: 'postal-code', max: 6, msg: 'Enter a valid 6-digit pincode' })}</div></section>
  <section class="co-step"><h2 class="display"><span class="n">03</span>Delivery</h2>
    <div class="opts" role="radiogroup" aria-label="Delivery method">
      <label class="opt"><input type="radio" name="ship" value="standard" checked><span><b>Standard</b><small>4–6 working days</small></span><span class="p" id="p-std"></span></label>
      <label class="opt"><input type="radio" name="ship" value="express"><span><b>Express</b><small>1–2 working days</small></span><span class="p">${inr(S.EXPRESS_SHIP)}</span></label>
    </div></section>
  <section class="co-step"><h2 class="display"><span class="n">04</span>Payment</h2>
    <div class="opts" role="radiogroup" aria-label="Payment method">
      <label class="opt"><input type="radio" name="pay" value="upi" checked><span><b>UPI</b><small>Pay with any UPI app</small></span><span class="p"></span></label>
      <div class="pay-panel" id="pp-upi">${field({ name: 'upi', label: 'UPI ID', ph: 'name@bank', ac: 'off', msg: 'Enter a valid UPI ID, e.g. name@okaxis', hint: 'You’ll get a collect request in your UPI app.' })}<div class="suffixes" role="group" aria-label="Quick UPI handles">${['@okaxis', '@okhdfcbank', '@oksbi', '@ybl', '@paytm'].map(s => `<button type="button" class="chip" data-suffix="${s}">${s}</button>`).join('')}</div></div>
      <label class="opt"><input type="radio" name="pay" value="card"><span><b>Credit / Debit card</b><small>Visa, Mastercard, RuPay</small></span><span class="p"></span></label>
      <div class="pay-panel" id="pp-card" hidden>${field({ name: 'cardnum', label: 'Card number', mode: 'numeric', ac: 'cc-number', ph: '1234 5678 9012 3456', max: 19, msg: 'Enter a valid card number' })}
        <div class="row">${field({ name: 'exp', label: 'Expiry (MM/YY)', mode: 'numeric', ac: 'cc-exp', ph: 'MM/YY', max: 5, msg: 'Enter a valid expiry date' })}${field({ name: 'cvv', label: 'CVV', mode: 'numeric', ac: 'cc-csc', ph: '123', max: 4, msg: 'Enter the 3 or 4 digit CVV' })}</div>
        ${field({ name: 'cname', label: 'Name on card', ac: 'cc-name', sp: false })}</div>
      <label class="opt"><input type="radio" name="pay" value="cod"><span><b>Cash on delivery</b><small>Pay when it arrives. ${inr(S.COD_FEE)} handling fee.</small></span><span class="p">+${inr(S.COD_FEE)}</span></label>
      <div class="pay-panel" id="pp-cod" hidden><p class="notice">Keep the exact amount ready. You can also pay the courier by UPI on delivery.</p></div>
    </div>
    <p class="notice">This is a demo store — no payment is taken and card details are never stored.</p>
    <p class="form-error" id="co-err" role="alert"></p>
    <button class="btn btn-primary btn-block" id="place" type="submit" style="min-height:56px">Place order</button>
  </section>
</form>
<aside class="panel sticky co-sum" aria-label="Order summary"><h2 class="display" style="font-size:22px">In your cart</h2><ul id="co-lines"></ul>
  <form class="field" id="promo-form" novalidate><label for="promo">Promo code</label><div class="promo"><input class="input" id="promo" name="promo" value="${esc(S.promo)}" autocomplete="off" spellcheck="false" autocapitalize="characters" placeholder="BLVNK10"><button class="btn btn-ghost" type="submit">Apply</button></div><span class="promo-msg" id="promo-msg" aria-live="polite"></span></form>
  <div class="sum" id="co-sum"></div></aside>
</div></div>`,
      mount(root) {
        const form = $('#co', root);
        const drawSum = () => {
          const t = S.totals(st);
          $('#p-std', root).textContent = S.totals({ ship: 'standard' }).ship ? inr(S.STD_SHIP) : 'Free';
          $('#co-lines', root).innerHTML = S.cart.map(l => { const p = S.byId(l.pid); return `<li class="line"><img src="${Art.src(p, l.ci, vs0(p))}" alt="" width="64" height="64"><span class="q" aria-label="Quantity ${l.qty}">${l.qty}</span><div class="info"><h3>${esc(p.name)}</h3><div class="var">${esc(p.colors[l.ci].name)} · ${p.cat === 'sneakers' ? 'UK ' : ''}${esc(l.size)}</div></div><div class="price" style="position:absolute;right:0;top:12px;font-size:14px">${inr(p.price * l.qty)}</div></li>`; }).join('');
          $('#co-sum', root).innerHTML = `<div><span>Subtotal</span><span class="v">${inr(t.sub)}</span></div>${t.disc ? `<div class="disc"><span>Discount (${esc(S.promo)})</span><span class="v">−${inr(t.disc)}</span></div>` : ''}<div><span>Shipping</span><span class="v">${t.ship ? inr(t.ship) : 'Free'}</span></div>${t.cod ? `<div><span>COD fee</span><span class="v">${inr(t.cod)}</span></div>` : ''}<div class="tot"><span>Total</span><span>${inr(t.total)}</span></div><p class="label" style="font-size:11px">Incl. GST</p>`;
          const btn = $('#place', root); if (!btn.classList.contains('is-busy')) btn.textContent = `Place order · ${inr(t.total)}`;
        };
        drawSum();
        root._cleanup = S.subscribe(() => { if (!S.cart.length) return; drawSum(); });
        form.addEventListener('change', e => {
          if (e.target.name === 'ship') st.ship = e.target.value;
          if (e.target.name === 'pay') { st.pay = e.target.value; ['upi', 'card', 'cod'].forEach(k => { $('#pp-' + k, root).hidden = k !== st.pay; }); }
          drawSum();
        });
        form.addEventListener('click', e => { const s = e.target.closest('[data-suffix]'); if (s) { const i = $('#upi', root); i.value = i.value.split('@')[0] + s.dataset.suffix; i.focus(); setErr(form, 'upi', false); } });
        form.addEventListener('input', e => {
          const el = e.target, f = el.closest('.field'); if (f) f.classList.remove('err');
          if (el.name === 'cardnum') el.value = el.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
          if (el.name === 'exp') { let v = el.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); el.value = v; }
          if (el.name === 'phone' || el.name === 'pin' || el.name === 'cvv') el.value = el.value.replace(/\D/g, '');
        });
        $('#promo-form', root).addEventListener('submit', e => {
          e.preventDefault(); const r = S.applyPromo($('#promo', root).value), m = $('#promo-msg', root);
          if (!r.ok) { m.textContent = 'That code isn’t valid. Try BLVNK10.'; m.className = 'promo-msg bad'; } else { m.textContent = r.cleared ? '' : `Applied — ${r.label}`; m.className = 'promo-msg ok'; }
        });
        const luhn = n => { let s = 0, alt = false; for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } s += d; alt = !alt; } return s % 10 === 0; };
        form.addEventListener('submit', e => {
          e.preventDefault();
          const v = Object.fromEntries(new FormData(form).entries());
          $$('.field.err', form).forEach(f => f.classList.remove('err'));
          let bad = false; const chk = (n, cond) => { if (setErr(form, n, cond)) bad = true; };
          chk('email', !EMAIL.test((v.email || '').trim())); chk('phone', !/^[6-9]\d{9}$/.test(v.phone || ''));
          ['fname', 'lname', 'addr1', 'city'].forEach(n => chk(n, !(v[n] || '').trim()));
          chk('state', !v.state); chk('pin', !/^[1-9]\d{5}$/.test(v.pin || ''));
          if (st.pay === 'upi') chk('upi', !/^[\w.\-]{2,}@[A-Za-z]{2,}$/.test((v.upi || '').trim()));
          if (st.pay === 'card') {
            const num = (v.cardnum || '').replace(/\s/g, ''); chk('cardnum', !(num.length >= 13 && luhn(num)));
            const m = (v.exp || '').match(/^(\d{2})\/(\d{2})$/); const now = new Date(), ok = m && +m[1] >= 1 && +m[1] <= 12 && (2000 + +m[2] > now.getFullYear() || (2000 + +m[2] === now.getFullYear() && +m[1] >= now.getMonth() + 1));
            chk('exp', !ok); chk('cvv', !/^\d{3,4}$/.test(v.cvv || '')); chk('cname', !(v.cname || '').trim());
          }
          const err = $('#co-err', root);
          if (bad) { err.textContent = 'Fix the highlighted fields to continue.'; err.classList.add('show'); firstErr(form); return; }
          err.classList.remove('show');
          const btn = $('#place', root); btn.classList.add('is-busy'); btn.disabled = true;
          setTimeout(() => {
            const note = st.pay === 'upi' ? v.upi.trim() : st.pay === 'card' ? 'Card ending ' + v.cardnum.replace(/\s/g, '').slice(-4) : 'Cash on delivery';
            const order = S.placeOrder({
              ship: st.ship, pay: st.pay, payNote: note,
              customer: { email: v.email.trim(), phone: v.phone, name: `${v.fname.trim()} ${v.lname.trim()}` },
              address: { line1: v.addr1.trim(), line2: (v.addr2 || '').trim(), city: v.city.trim(), state: v.state, pin: v.pin }
            });
            if (!S.user) S.signIn({ name: order.customer.name, email: order.customer.email, phone: order.customer.phone, implicit: true });
            location.hash = '#/order/' + order.id;
          }, 1100);
        });
      }
    };
  };

  /* =============== ORDER CONFIRMATION =============== */
  P.order = function (ctx) {
    const o = S.order(ctx.parts[1]);
    if (!o) return { title: 'Order not found — BLVNK', nav: '', html: `<div class="wrap"><div class="empty" style="margin:64px 0 96px"><h2 class="display">Order not found</h2><p>We couldn’t find that order on this device.</p><a class="btn btn-primary" href="#/account">Your orders</a></div></div>` };
    const payLabel = { upi: 'UPI', card: 'Card', cod: 'Cash on delivery' }[o.pay];
    return {
      title: `Order ${o.id} confirmed — BLVNK`, nav: '',
      html: `<div class="wrap"><div class="confirm">
<div>
  <p class="label"><span style="color:var(--accent)">●</span>&nbsp; ${o.pay === 'cod' ? 'Order placed — pay on delivery' : 'Payment received (demo)'}</p>
  <h1 class="display" tabindex="-1" id="conf-h">Order <em>confirmed.</em></h1>
  <p class="muted" style="font-size:18px;max-width:46ch">Thanks, ${esc(o.customer.name.split(' ')[0])}. A confirmation is on its way to <b style="color:var(--ink)">${esc(o.customer.email)}</b>. We’ll message ${esc(o.customer.phone)} when it ships.</p>
  <div class="timeline" aria-label="Order progress"><div class="on">Placed<br>${UI.fmtDay(o.placedAt)}</div><div>Packed</div><div>Shipped</div><div>Delivered<br>by ${UI.fmtDay(o.eta)}</div></div>
  <div class="items"><ul>${o.items.map(i => { const p = S.byId(i.pid); return `<li class="line"><a href="${href(p, i.ci)}"><img src="${Art.src(p, i.ci, vs0(p))}" alt="" width="84" height="84"></a><div class="info"><h3>${esc(i.name)}</h3><div class="var">${esc(i.colour)} · ${p.cat === 'sneakers' ? 'UK ' : ''}${esc(i.size)} · Qty ${i.qty}</div><div class="price">${inr(i.price * i.qty)}</div></div></li>`; }).join('')}</ul></div>
  <div class="sum" style="margin-top:20px;max-width:420px"><div><span>Subtotal</span><span class="v">${inr(o.totals.sub)}</span></div>${o.totals.disc ? `<div class="disc"><span>Discount (${esc(o.promo)})</span><span class="v">−${inr(o.totals.disc)}</span></div>` : ''}<div><span>Shipping (${o.ship})</span><span class="v">${o.totals.ship ? inr(o.totals.ship) : 'Free'}</span></div>${o.totals.cod ? `<div><span>COD fee</span><span class="v">${inr(o.totals.cod)}</span></div>` : ''}<div class="tot"><span>Total</span><span>${inr(o.totals.total)}</span></div></div>
  <div class="cta" style="display:flex;gap:12px;flex-wrap:wrap;margin-top:32px"><a class="btn btn-primary" href="#/shop">Continue shopping</a><a class="btn btn-ghost" href="#/account">View all orders</a><button class="btn btn-ghost" onclick="window.print()">Print</button></div>
</div>
<div class="carton" aria-label="Shipping label">
  <div class="carton-top"><span class="logo">BL<i>V</i>NK</span><span>Ship label</span></div>
  <div class="carton-grid">
    <div class="full"><small>Order</small><b style="font-size:22px">${o.id}</b></div>
    <div class="full"><small>Ship to</small><address class="addr mono" style="font-size:14px">${esc(o.customer.name)}<br>${esc(o.address.line1)}${o.address.line2 ? ', ' + esc(o.address.line2) : ''}<br>${esc(o.address.city)}, ${esc(o.address.state)} — <b style="font-size:inherit">${esc(o.address.pin)}</b></address></div>
    <div><small>Payment</small><b>${payLabel}</b></div><div><small>Method</small><b>${o.ship}</b></div>
    <div><small>Items</small><b>${o.items.reduce((a, i) => a + i.qty, 0)}</b></div><div><small>ETA</small><b>${UI.fmtDay(o.eta)}</b></div>
  </div>
  <div class="carton-bar">${UI.barcode(o.id)}<small>${o.id}</small></div>
</div></div></div>`,
      mount() { const h = $('#conf-h'); if (h) h.focus({ preventScroll: true }); }
    };
  };

  /* =============== ACCOUNT =============== */
  P.account = function (ctx) {
    const tab = ctx.query.get('tab') === 'details' ? 'details' : 'orders';
    if (!S.user || S.user.implicit && !S.orders.length && false) { /* fallthrough */ }
    const u = S.user;
    if (!u) {
      return {
        title: 'Account — BLVNK', nav: '',
        html: `<div class="wrap"><div class="page-title"><p class="label">Account</p><h1 class="display" style="margin-top:12px">Sign in</h1></div>
<form class="narrow co-form" id="sign" novalidate style="margin-bottom:96px;display:grid;gap:18px">
  <p class="notice">Demo store: no password needed. Your name and email stay in this browser so you can see orders and check out faster.</p>
  ${field({ name: 'name', label: 'Name', ac: 'name', sp: false })}${field({ name: 'email', label: 'Email', type: 'email', mode: 'email', ac: 'email', msg: 'Enter a valid email address' })}${field({ name: 'phone', label: 'Mobile (optional)', type: 'tel', mode: 'numeric', ac: 'tel-national', max: 10, req: false, msg: 'Enter a 10-digit mobile number' })}
  <button class="btn btn-primary" type="submit">Continue</button></form></div>`,
        mount(root) {
          const f = $('#sign', root);
          f.addEventListener('input', e => { const x = e.target.closest('.field'); if (x) x.classList.remove('err'); if (e.target.name === 'phone') e.target.value = e.target.value.replace(/\D/g, ''); });
          f.addEventListener('submit', e => {
            e.preventDefault(); const v = Object.fromEntries(new FormData(f).entries()); let bad = false;
            if (setErr(f, 'name', !v.name.trim())) bad = true; if (setErr(f, 'email', !EMAIL.test(v.email.trim()))) bad = true; if (setErr(f, 'phone', v.phone && !/^[6-9]\d{9}$/.test(v.phone))) bad = true;
            if (bad) return firstErr(f);
            S.signIn({ name: v.name.trim(), email: v.email.trim(), phone: v.phone }); toast(`Welcome, ${v.name.trim().split(' ')[0]}`); P.rerender();
          });
        }
      };
    }
    const orders = S.orders;
    return {
      title: 'Account — BLVNK', nav: '',
      html: `<div class="wrap"><div class="page-title"><p class="label">Signed in as ${esc(u.email)}</p><h1 class="display" style="margin-top:12px">Hi, ${esc(u.name.split(' ')[0])}</h1></div>
<div class="tabs" role="tablist"><button role="tab" aria-selected="${tab === 'orders'}" data-tab="orders">Orders (${orders.length})</button><button role="tab" aria-selected="${tab === 'details'}" data-tab="details">Details</button><button data-out style="margin-left:auto">Sign out</button></div>
<div style="margin-bottom:96px">${tab === 'orders' ? (orders.length ? orders.map(o => `<a class="order-row" href="#/order/${o.id}"><div><b class="mono">${o.id}</b><div class="muted" style="font-size:14px">${UI.fmtDay(o.placedAt)} · ${{ upi: 'UPI', card: 'Card', cod: 'COD' }[o.pay]}</div></div><div class="thumbs-mini">${o.items.slice(0, 4).map(i => { const p = S.byId(i.pid); return `<img src="${Art.src(p, i.ci, vs0(p))}" alt="" width="44" height="44">`; }).join('')}</div><div class="price">${inr(o.totals.total)}</div><span class="label">Arrives ${UI.fmtDay(o.eta)}</span></a>`).join('') : `<div class="empty"><h2 class="display">No orders yet</h2><p>When you place an order it’ll show up here.</p><a class="btn btn-primary" href="#/shop">Start shopping</a></div>`)
          : `<form class="narrow" id="prof" novalidate style="display:grid;gap:18px">${field({ name: 'name', label: 'Name', ac: 'name', value: u.name, sp: false })}${field({ name: 'email', label: 'Email', type: 'email', mode: 'email', ac: 'email', value: u.email, msg: 'Enter a valid email address' })}${field({ name: 'phone', label: 'Mobile', type: 'tel', mode: 'numeric', ac: 'tel-national', max: 10, value: u.phone, req: false, msg: 'Enter a 10-digit mobile number' })}<button class="btn btn-primary" type="submit" style="justify-self:start">Save details</button></form>`}</div></div>`,
      mount(root) {
        root.addEventListener('click', e => {
          const t = e.target.closest('[data-tab]'); if (t) location.hash = '#/account' + (t.dataset.tab === 'details' ? '?tab=details' : '');
          if (e.target.closest('[data-out]')) { S.signOut(); toast('Signed out'); P.rerender(); }
        });
        const f = $('#prof', root);
        if (f) f.addEventListener('submit', e => {
          e.preventDefault(); const v = Object.fromEntries(new FormData(f).entries()); let bad = false;
          if (setErr(f, 'name', !v.name.trim())) bad = true; if (setErr(f, 'email', !EMAIL.test(v.email.trim()))) bad = true; if (setErr(f, 'phone', v.phone && !/^[6-9]\d{9}$/.test(v.phone))) bad = true;
          if (bad) return firstErr(f);
          S.signIn({ name: v.name.trim(), email: v.email.trim(), phone: v.phone }); toast('Details saved');
        });
      }
    };
  };

  /* =============== INFO PAGES =============== */
  const INFO = {
    about: ['About', `<p><b>BLVNK</b> is a two-product label. We make sneakers and caps — and nothing else — in small, numbered runs.</p>
<h2>Why only two things</h2><p>A narrow catalogue lets us obsess. Every last, every panel, every strap buckle gets tested before it ships. When there’s nowhere to hide, the product has to carry itself.</p>
<h2>What we make</h2><ul><li><b>Sneakers</b> — low, high and chunky silhouettes from ₹4,999.</li><li><b>Caps</b> — dad caps, snapbacks and five-panels from ₹799.</li></ul>
<h2>The name</h2><p>Blank, with a V where the A should be. A blank that refuses to stay blank. <b>Not made to blend in.</b></p>`],
    shipping: ['Shipping', `<p>We ship across India. Orders placed before 2 pm on working days leave the warehouse the same day.</p>
<h2>Delivery options</h2><ul><li><b>Standard</b> — 4–6 working days. Free over ${inr(S.FREE_SHIP_AT)}, otherwise ${inr(S.STD_SHIP)}.</li><li><b>Express</b> — 1–2 working days for ${inr(S.EXPRESS_SHIP)}.</li><li><b>Cash on delivery</b> — available on all orders for a ${inr(S.COD_FEE)} handling fee.</li></ul>
<h2>Tracking</h2><p>You’ll get a tracking link by SMS and email as soon as your order is picked up by the courier. You can also see status under <a href="#/account">Account → Orders</a>.</p>`],
    returns: ['Returns', `<p>Changed your mind? Return it within <b>7 days of delivery</b>.</p>
<h2>What we accept</h2><ul><li>Sneakers and caps that are unworn, unwashed and in the original box with tags.</li><li>Exchanges for a different size, subject to stock.</li></ul>
<h2>What we can’t take back</h2><ul><li>Items worn outdoors or showing signs of use.</li><li>Sold-out “final drop” items marked as final sale.</li></ul>
<h2>How to start a return</h2><p>Email us from the address on your order with your order number. We’ll arrange a pickup and refund to the original payment method (or a UPI refund for COD orders) within 5–7 working days of receiving the item.</p>`],
    privacy: ['Privacy Policy', `<p>We collect only what we need to deliver your order and run the store.</p>
<h2>What we collect</h2><ul><li>Contact and delivery details you enter at checkout.</li><li>Order history, stored so you can track and return items.</li></ul>
<h2>Payments</h2><p>Card numbers are never stored by BLVNK. Payments are handled by licensed payment partners.</p>
<h2>Your choices</h2><p>You can ask us to export or delete your data any time using the contact page. We don’t sell your data.</p>
<h2>On this demo</h2><p>Your cart, wishlist, account details and orders are kept in this browser only (local storage) and can be cleared by clearing site data.</p>`],
    contact: ['Contact', `<p>Questions about sizing, an order or a drop? We reply within one working day.</p><ul><li><b>Email</b> — <a href="mailto:support@blvnk.in">support@blvnk.in</a></li><li><b>Hours</b> — Mon–Sat, 10 am – 7 pm IST</li><li><b>Fastest</b> — DM us on Instagram</li></ul><form id="contact" novalidate style="display:grid;gap:16px;margin-top:12px">
${field({ name: 'name', label: 'Name', ac: 'name', sp: false })}${field({ name: 'email', label: 'Email', type: 'email', mode: 'email', ac: 'email', msg: 'Enter a valid email address' })}
<div class="field" data-f="msg"><label for="msg">Message</label><textarea class="input" id="msg" name="msg" required></textarea><span class="msg">Tell us how we can help</span></div><button class="btn btn-primary" type="submit" style="justify-self:start">Send message</button></form>`]
  };
  P.page = function (ctx) {
    const key = ctx.parts[1], pg = INFO[key];
    if (!pg) return P.notFound();
    return {
      title: `${pg[0]} — BLVNK`, nav: '',
      html: `<div class="wrap"><div class="page-title"><p class="label">BLVNK</p><h1 class="display" style="margin-top:12px">${pg[0]}</h1></div>
<div class="info-page"><nav aria-label="Help pages">${Object.keys(INFO).map(k => `<a href="#/page/${k}" ${k === key ? 'aria-current="page"' : ''}>${INFO[k][0]}</a>`).join('')}</nav><div class="prose">${pg[1]}</div></div></div>`,
      mount(root) {
        const f = $('#contact', root); if (!f) return;
        f.addEventListener('input', e => e.target.closest('.field') && e.target.closest('.field').classList.remove('err'));
        f.addEventListener('submit', e => {
          e.preventDefault(); const v = Object.fromEntries(new FormData(f).entries()); let bad = false;
          if (setErr(f, 'name', !v.name.trim())) bad = true; if (setErr(f, 'email', !EMAIL.test(v.email.trim()))) bad = true; if (setErr(f, 'msg', !v.msg.trim())) bad = true;
          if (bad) return firstErr(f);
          toast('Message sent. We’ll reply within one working day.'); f.reset();
        });
      }
    };
  };
})();
