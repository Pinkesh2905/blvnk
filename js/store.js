/* BLVNK store — cart, wishlist, account and orders (kept in localStorage). */
(function () {
  'use strict';

  const products = window.BLVNK_PRODUCTS;
  const KEYS = { cart: 'blvnk.cart', wish: 'blvnk.wish', user: 'blvnk.user', orders: 'blvnk.orders', promo: 'blvnk.promo' };

  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } };

  const PROMOS = { BLVNK10: { pct: 10, label: '10% off' } };
  const FREE_SHIP_AT = 2999, STD_SHIP = 99, EXPRESS_SHIP = 249, COD_FEE = 49;

  const listeners = new Set();
  const S = {
    products,
    FREE_SHIP_AT, STD_SHIP, EXPRESS_SHIP, COD_FEE,
    cart: load(KEYS.cart, []).filter(i => products.some(p => p.id === i.pid)),
    wish: load(KEYS.wish, []),
    user: load(KEYS.user, null),
    orders: load(KEYS.orders, []),
    promo: load(KEYS.promo, ''),

    byId: id => products.find(p => p.id === id),
    bySlug: s => products.find(p => p.slug === s),
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    emit() { listeners.forEach(fn => fn()); },

    inr: n => '₹' + Math.round(n).toLocaleString('en-IN'),

    /* ----- stock ----- */
    sizeStock: (p, size) => p.stock[size] || 0,
    status(p) { return p.total === 0 ? 'sold' : (p.total <= 8 ? 'low' : 'in'); },
    inCart(pid, ci, size) { return this.cart.find(i => i.pid === pid && i.ci === ci && i.size === size); },

    /* ----- cart ----- */
    addToCart(pid, ci, size, qty) {
      const p = this.byId(pid), max = this.sizeStock(p, size);
      if (!max) return { ok: false, msg: 'That size is sold out.' };
      let line = this.inCart(pid, ci, size);
      const have = line ? line.qty : 0, add = Math.min(qty || 1, max - have);
      if (add <= 0) return { ok: false, msg: `Only ${max} left in this size — all are in your cart.` };
      if (line) line.qty += add; else this.cart.push({ pid, ci, size, qty: add });
      this.persistCart();
      return { ok: true, capped: add < (qty || 1), max };
    },
    setQty(idx, q) {
      const l = this.cart[idx]; if (!l) return;
      const max = this.sizeStock(this.byId(l.pid), l.size);
      l.qty = Math.max(1, Math.min(q, max));
      this.persistCart();
    },
    removeAt(idx) { const [gone] = this.cart.splice(idx, 1); this.persistCart(); return gone; },
    restore(line, idx) { this.cart.splice(idx, 0, line); this.persistCart(); },
    clearCart() { this.cart = []; this.persistCart(); },
    persistCart() { save(KEYS.cart, this.cart); this.emit(); },
    count() { return this.cart.reduce((a, i) => a + i.qty, 0); },
    subtotal() { return this.cart.reduce((a, i) => a + this.byId(i.pid).price * i.qty, 0); },

    applyPromo(code) {
      code = (code || '').trim().toUpperCase();
      if (!code) { this.promo = ''; save(KEYS.promo, ''); this.emit(); return { ok: true, cleared: true }; }
      if (!PROMOS[code]) return { ok: false };
      this.promo = code; save(KEYS.promo, code); this.emit(); return { ok: true, label: PROMOS[code].label };
    },
    totals(opt) {
      opt = opt || {};
      const sub = this.subtotal();
      const disc = this.promo && PROMOS[this.promo] ? Math.round(sub * PROMOS[this.promo].pct / 100) : 0;
      const after = sub - disc;
      let ship = 0;
      if (this.cart.length) ship = opt.ship === 'express' ? EXPRESS_SHIP : (after >= FREE_SHIP_AT ? 0 : STD_SHIP);
      const cod = opt.pay === 'cod' && this.cart.length ? COD_FEE : 0;
      return { sub, disc, ship, cod, total: after + ship + cod, toFree: Math.max(0, FREE_SHIP_AT - after) };
    },

    /* ----- wishlist ----- */
    isWished(id) { return this.wish.includes(id); },
    toggleWish(id) {
      const i = this.wish.indexOf(id);
      if (i >= 0) this.wish.splice(i, 1); else this.wish.push(id);
      save(KEYS.wish, this.wish); this.emit();
      return i < 0;
    },

    /* ----- account & orders ----- */
    signIn(u) { this.user = u; save(KEYS.user, u); this.emit(); },
    signOut() { this.user = null; save(KEYS.user, null); this.emit(); },
    placeOrder(data) {
      const t = this.totals({ ship: data.ship, pay: data.pay });
      const id = 'BLV-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);
      const eta = new Date(); eta.setDate(eta.getDate() + (data.ship === 'express' ? 2 : 6));
      const order = {
        id, placedAt: new Date().toISOString(), eta: eta.toISOString(),
        items: this.cart.map(l => { const p = this.byId(l.pid); return { pid: l.pid, ci: l.ci, size: l.size, qty: l.qty, price: p.price, name: p.name, article: p.article, colour: p.colors[l.ci].name }; }),
        totals: t, promo: this.promo || '', ship: data.ship, pay: data.pay, payNote: data.payNote || '',
        customer: data.customer, address: data.address
      };
      this.orders.unshift(order); save(KEYS.orders, this.orders);
      this.cart = []; save(KEYS.cart, this.cart);
      this.emit();
      return order;
    },
    order: id => S.orders.find(o => o.id === id)
  };

  window.S = S;
})();
