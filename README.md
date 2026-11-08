# BLVNK

Static storefront (no build step). Sneakers and caps only.

```
python -m http.server 5173     # then open http://localhost:5173
```

Opening `index.html` directly also works; hash routing (`#/shop`, `#/product/void-runner` …) needs no server config.

| File | What it does |
|---|---|
| `js/data.js` | The catalogue: 9 sneakers, 9 caps, colourways, per-size stock, labels |
| `js/art.js` | Generates the product images (see below) |
| `js/store.js` | Cart, wishlist, promo (`BLVNK10`), totals, orders — saved in `localStorage` |
| `js/ui.js` | Product card, cart drawer, quick-add, search, toasts |
| `js/pages.js`, `js/pages2.js` | Home, catalogue, product, wishlist, cart, checkout, confirmation, account, info pages |

## Product images

The current images are **generated illustrations**, not photography. They stay as the fallback for any
colour that has no photos yet.

To add real photos:

1. Generate or shoot them. `PHOTO-PROMPTS.md` has a ChatGPT prompt for each of the 36 colourways.
2. Save them as `img/products/<product-slug>/<colour-index>-<shot>.png` (or jpg/webp), e.g. `img/products/void-runner/0-1.png`.
   Shot 1 is the main image; shots 2–4 fill the gallery. Colour indexes are in `PHOTO-PROMPTS.md`.
3. Run `python tools/build-photos.py` (needs `pip install pillow`). It writes `js/photos.js` and three WebP sizes per photo
   (360 / 720 / 1200 px, content-hashed file names) to `img/web/`. The site serves the right size per screen via `srcset`,
   and the hashed names let Vercel cache them forever.
4. Refresh. One photo shows full-size; 2–4 show a gallery; colours without photos keep the renders.

## Deploy

It is a plain static site: no build step, no environment variables.

- **Vercel**: import the GitHub repo, framework preset *Other*, leave build command and output directory empty (root `/`).
- **Netlify / Cloudflare Pages / GitHub Pages** work the same way: publish the repo root.

Only `img/web/` is committed. Full-size originals live in `img/products/` (git-ignored); re-run
`python tools/build-photos.py` locally after adding photos, then commit `js/photos.js` and `img/web/`.

## Before going live

- Checkout is a demo: no payment gateway, no backend. Orders live in the browser only.
- Replace `support@blvnk.in` and the social links in `index.html` / `pages2.js` with real ones.
- Shipping rules and the promo code are constants at the top of `js/store.js`.
