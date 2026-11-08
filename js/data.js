/* BLVNK catalogue. Prices are in INR and include GST.
   p = colourway palette used by the procedural renders in art.js.
   Add real photography with:  photos: { 0: ["a.jpg","b.jpg","c.jpg","d.jpg"] }  (index = colour) */
(function () {
  'use strict';

  const O = '#ff5a1f';
  // sneaker colourway: name, filter family, swatch, upper, panel, accent, midsole, outsole, lace
  const sn = (name, family, sw, upper, panel, accent, sole, outsole, lace) =>
    ({ name, family, swatch: sw, p: { upper, panel, accent, sole, outsole, lace } });
  // cap colourway: name, family, swatch, crown, brim, logo, v-letter, accent
  const cp = (name, family, sw, crown, brim, logo, v, accent) =>
    ({ name, family, swatch: sw, p: { crown, brim, under: '#111113', logo, v, accent: accent || O } });

  const SZ_SN = [6, 7, 8, 9, 10, 11];
  const sizes = (labels, stock) => { const o = {}; labels.forEach((l, i) => { o['' + l] = stock[i]; }); return o; };
  const UK = (stock) => sizes(SZ_SN, stock);
  const CAPFIT = (stock) => sizes(['S/M', 'L/XL'], stock);
  const ONE = (n) => sizes(['One Size'], [n]);

  const products = [
    /* ---------------- SNEAKERS ---------------- */
    {
      id: 'sn01', slug: 'void-runner', cat: 'sneakers', name: 'VOID RUNNER', article: 'BLV-SN-001', price: 6999,
      shape: 'low', best: true, added: '2026-03-14', rank: 1, sold: 412,
      tagline: 'Low-profile runner. Built for the 2 a.m. walk home.',
      desc: 'A stripped-back low-top with an engineered-mesh upper, bonded overlays and a cushioned EVA midsole. The double slash on the quarter is the only thing that talks.',
      details: ['Engineered mesh upper with bonded TPU overlays', 'Dual-density EVA midsole', 'Rubber outsole with multi-direction tread', 'Reflective heel tab', 'Lace-up closure, padded collar'],
      colors: [
        sn('Blackout', 'Black', '#1b1b1e', '#1b1b1e', '#2b2b30', O, '#121214', '#0a0a0b', '#cfcfd2'),
        sn('Bone / Orange', 'White', '#e8e3d8', '#e9e4d9', '#cfc8b8', O, '#f4f1ea', '#2a2a2d', '#1b1b1e')
      ],
      stock: UK([4, 9, 14, 12, 8, 3])
    },
    {
      id: 'sn02', slug: 'ash-01', cat: 'sneakers', name: 'ASH 01', article: 'BLV-SN-002', price: 4999,
      shape: 'low', best: true, added: '2026-02-02', rank: 3, sold: 380,
      tagline: 'The entry point. Minimal, everyday, ours.',
      desc: 'Our first silhouette and still the one we get asked about. Clean leather-look panels, a flat profile and a cupsole that stays out of the way.',
      details: ['Synthetic leather upper, tonal stitching', 'Vulcanised cupsole', 'Cushioned insole', 'Woven BLVNK heel label', 'Lace-up closure'],
      colors: [
        sn('Ash Grey', 'Grey', '#8c8c92', '#8d8d93', '#a7a7ad', O, '#e8e6e0', '#3a3a3e', '#e8e6e0'),
        sn('Black Ash', 'Black', '#232326', '#202023', '#2f2f34', '#8d8d93', '#e8e6e0', '#1a1a1c', '#8d8d93')
      ],
      stock: UK([10, 16, 20, 18, 14, 9])
    },
    {
      id: 'sn03', slug: 'slab-high', cat: 'sneakers', name: 'SLAB HIGH', article: 'BLV-SN-003', price: 8499,
      shape: 'high', added: '2026-05-21', rank: 4, sold: 190,
      tagline: 'High-top with a hard edge.',
      desc: 'A structured high-top cut from heavy canvas and pig-suede. Padded ankle, tall tongue, and a heel tab that clips onto a belt loop.',
      details: ['Heavy canvas with suede overlays', 'Padded ankle collar', 'Vulcanised sole, 4 mm foxing tape', 'Metal eyelets, waxed laces', 'Removable insole'],
      colors: [
        sn('Black / White', 'Black', '#1b1b1e', '#1c1c1f', '#2e2e33', '#f1efe9', '#f1efe9', '#17171a', '#f1efe9'),
        sn('Bone', 'White', '#e8e3d8', '#e6e1d5', '#cdc5b4', O, '#f4f1ea', '#2a2a2d', '#2a2a2d')
      ],
      stock: UK([2, 6, 8, 7, 5, 4])
    },
    {
      id: 'sn04', slug: 'nocturn', cat: 'sneakers', name: 'NOCTURN', article: 'BLV-SN-004', price: 9999,
      shape: 'chunky', isNew: true, added: '2026-10-30', rank: 2, sold: 96,
      tagline: 'Chunky. Heavy. Impossible to miss.',
      desc: 'Our biggest midsole yet — a stacked, vented platform with a flared heel. Black on black on orange so it holds its own under streetlights.',
      details: ['Mixed mesh and nubuck upper', 'Stacked EVA platform midsole with vents', 'Dual-compound rubber outsole', 'Orange glow-line midsole stripe', 'Pull tabs front and rear'],
      colors: [
        sn('Black / Orange', 'Black', '#1b1b1e', '#1b1b1e', '#2a2a2f', O, '#26262a', '#0b0b0c', '#d8d8dc'),
        sn('Graphite', 'Grey', '#55555b', '#4b4b51', '#66666d', O, '#8a8a90', '#151517', '#e8e6e0')
      ],
      stock: UK([3, 5, 9, 8, 6, 2])
    },
    {
      id: 'sn05', slug: 'kiln-low', cat: 'sneakers', name: 'KILN LOW', article: 'BLV-SN-005', price: 5499,
      shape: 'low', added: '2026-04-09', rank: 7, sold: 142,
      tagline: 'Fired in earth tones.',
      desc: 'Soft suede panels over a washed canvas base in colours borrowed from kiln floors. Lightweight, flexible and easy to wear daily.',
      details: ['Washed canvas with suede overlays', 'Gum rubber cupsole', 'Cotton laces', 'Cushioned footbed', 'Embossed heel logo'],
      colors: [
        sn('Sand', 'Sand', '#cdbd9f', '#cdbd9f', '#b6a483', '#3a3a3e', '#f1ece0', '#a77b4d', '#f1ece0'),
        sn('Burnt Orange', 'Orange', '#c9501c', '#c9501c', '#a53f14', '#1b1b1e', '#f1ece0', '#2a2a2d', '#1b1b1e')
      ],
      stock: UK([5, 8, 11, 10, 7, 4])
    },
    {
      id: 'sn06', slug: 'riot-95', cat: 'sneakers', name: 'RIOT 95', article: 'BLV-SN-006', price: 10499,
      shape: 'chunky', added: '2026-06-30', rank: 6, sold: 120,
      tagline: 'Nineties volume, modern build.',
      desc: 'An archive-inspired trainer with layered panels and an oversize sole unit. Cushioned enough for all-day wear, loud enough for no one to ask what you\'re wearing.',
      details: ['Layered synthetic and mesh upper', 'Oversize EVA sole unit', 'Moulded heel counter', 'Contrast reflective details', 'Lace-up with elastic keeper'],
      colors: [
        sn('White / Orange', 'White', '#e8e3d8', '#eeeae0', '#d1cabb', O, '#f4f1ea', '#2b2b2f', '#1b1b1e'),
        sn('Triple Black', 'Black', '#1b1b1e', '#18181b', '#25252a', '#4a4a50', '#1e1e21', '#0a0a0b', '#2b2b30')
      ],
      stock: UK([2, 4, 7, 6, 5, 3])
    },
    {
      id: 'sn07', slug: 'field-mid', cat: 'sneakers', name: 'FIELD MID', article: 'BLV-SN-007', price: 7999,
      shape: 'high', isNew: true, added: '2026-10-24', rank: 5, sold: 74,
      tagline: 'A mid-cut built like workwear.',
      desc: 'Ripstop panels, a tough toe cap and a lugged sole. Takes the city, takes the rain. Olive colourway only drops once.',
      details: ['Ripstop nylon with waxed suede toe cap', 'Padded, water-resistant collar', 'Lugged rubber outsole', 'Speed-lace hardware', 'Reflective pull loop'],
      colors: [
        sn('Olive', 'Olive', '#6b6b3d', '#66683c', '#7c7e4b', O, '#d8d3c0', '#26261f', '#e8e6d6'),
        sn('Black', 'Black', '#1b1b1e', '#1a1a1d', '#2b2b30', O, '#202023', '#0a0a0b', '#d8d8dc')
      ],
      stock: UK([3, 6, 6, 8, 4, 1])
    },
    {
      id: 'sn08', slug: 'static', cat: 'sneakers', name: 'STATIC', article: 'BLV-SN-008', price: 5999, was: 6999,
      shape: 'low', best: true, added: '2026-01-18', rank: 8, sold: 355,
      tagline: 'White, clean, quietly loud.',
      desc: 'The all-white that stays all-white longer: coated upper that wipes clean, hidden orange insole print, and a tapered toe.',
      details: ['Coated synthetic leather upper — wipe clean', 'Perforated toe box for airflow', 'Cupsole with stitched sidewall', 'Orange-printed insole', 'Lace-up closure'],
      colors: [
        sn('Cloud White', 'White', '#f1efe9', '#f1efe9', '#dedacd', O, '#f7f5f0', '#cfcabc', '#f1efe9'),
        sn('Concrete', 'Grey', '#9a9a9a', '#a3a3a3', '#8a8a8a', '#1b1b1e', '#e8e6e0', '#3a3a3e', '#e8e6e0')
      ],
      stock: UK([6, 12, 15, 14, 11, 7])
    },
    {
      id: 'sn09', slug: 'cinder-high', cat: 'sneakers', name: 'CINDER HIGH', article: 'BLV-SN-009', price: 11999,
      shape: 'high', isNew: true, added: '2026-11-04', rank: 9, sold: 38,
      tagline: 'The flagship. Numbered run of 300.',
      desc: 'Premium full-grain leather, hand-finished edges and a hot-stamped serial on the tongue. Charcoal with an ember-orange slash. Once it\'s gone, it\'s gone.',
      details: ['Full-grain leather upper, hand-burnished edges', 'Hot-stamped serial number on tongue', 'Cushioned Strobel footbed', 'Stitched cupsole with leather welt', 'Comes with a spare set of laces'],
      colors: [
        sn('Charcoal / Orange', 'Grey', '#3d3d42', '#3c3c41', '#505057', O, '#e8e6e0', '#151517', '#f1efe9'),
        sn('Black', 'Black', '#1b1b1e', '#19191c', '#2a2a2f', O, '#e8e6e0', '#0a0a0b', '#f1efe9')
      ],
      stock: UK([0, 1, 2, 2, 1, 0])
    },

    /* ---------------- CAPS ---------------- */
    {
      id: 'cp01', slug: 'core-dad', cat: 'caps', name: 'CORE DAD CAP', article: 'BLV-CP-001', price: 799,
      shape: 'dad', best: true, added: '2026-01-10', rank: 1, sold: 640,
      tagline: 'The one you actually wear every day.',
      desc: 'Washed cotton twill, unstructured six-panel crown, pre-curved brim and a woven strap with a brushed metal buckle. Tone-on-tone stitching.',
      details: ['100% washed cotton twill', 'Unstructured 6-panel crown', 'Pre-curved brim', 'Adjustable strap, brushed metal buckle', 'Embroidered BLVNK wordmark'],
      colors: [
        cp('Black', 'Black', '#1b1b1e', '#1c1c1f', '#17171a', '#f1efe9', O),
        cp('Bone', 'White', '#e8e3d8', '#e4dfd3', '#d6d0c2', '#1b1b1e', O),
        cp('Olive', 'Olive', '#6b6b3d', '#5f6137', '#52532f', '#f1efe9', O)
      ],
      stock: ONE(60)
    },
    {
      id: 'cp02', slug: 'slash-snapback', cat: 'caps', name: 'SLASH SNAPBACK', article: 'BLV-CP-002', price: 1299,
      shape: 'snap', best: true, added: '2026-03-02', rank: 2, sold: 301,
      tagline: 'Flat brim. Double slash. Done.',
      desc: 'A structured snapback with a high crown and flat brim. The oversize double slash is embroidered in a raised 3D stitch.',
      details: ['Cotton-poly twill, structured crown', 'Flat brim with dark under-visor', 'Plastic snap closure', '3D raised embroidery', 'Moisture-wicking sweatband'],
      colors: [
        cp('Black / Orange', 'Black', '#1b1b1e', '#1c1c1f', '#1c1c1f', '#f1efe9', O),
        cp('Black / Bone', 'Black', '#2a2a2e', '#1c1c1f', '#e4dfd3', '#f1efe9', '#f1efe9')
      ],
      stock: ONE(34)
    },
    {
      id: 'cp03', slug: 'mono-5-panel', cat: 'caps', name: 'MONO 5-PANEL', article: 'BLV-CP-003', price: 999,
      shape: 'camp', added: '2026-04-20', rank: 5, sold: 188,
      tagline: 'Low, light, almost invisible.',
      desc: 'A low-profile five-panel in nylon-cotton blend with a short brim and a woven patch. Packs flat in a jacket pocket.',
      details: ['Nylon-cotton blend', 'Low-profile 5-panel crown', 'Short curved brim', 'Woven BLVNK patch', 'Adjustable strap'],
      colors: [
        cp('Charcoal', 'Grey', '#3d3d42', '#3b3b40', '#2f2f33', '#f1efe9', O),
        cp('Sand', 'Sand', '#cdbd9f', '#cbbb9d', '#b8a789', '#1b1b1e', O)
      ],
      stock: sizes(['S/M', 'L/XL'], [14, 17])
    },
    {
      id: 'cp04', slug: 'ember-dad', cat: 'caps', name: 'EMBER DAD CAP', article: 'BLV-CP-004', price: 1099,
      shape: 'dad', isNew: true, added: '2026-10-28', rank: 3, sold: 82,
      tagline: 'Hi-vis orange. No notes.',
      desc: 'Core Dad construction in heavy brushed cotton, dyed in our signature orange. Reflective BLVNK stitching on the back.',
      details: ['Brushed heavyweight cotton', 'Unstructured 6-panel crown', 'Pre-curved brim', 'Reflective back embroidery', 'Adjustable strap'],
      colors: [
        cp('Ember', 'Orange', '#ff5a1f', '#ff5a1f', '#e24a12', '#17171a', '#17171a'),
        cp('Black / Orange', 'Black', '#1b1b1e', '#1c1c1f', '#17171a', O, '#f1efe9')
      ],
      stock: ONE(26)
    },
    {
      id: 'cp05', slug: 'noir-snapback', cat: 'caps', name: 'NOIR SNAPBACK', article: 'BLV-CP-005', price: 1499,
      shape: 'snap', added: '2026-05-05', rank: 7, sold: 150,
      tagline: 'Black on black on black.',
      desc: 'Wool-blend crown with a matte flat brim and tonal 3D slash. Structured, with a firm front panel that holds its shape.',
      details: ['Wool-blend structured crown', 'Matte flat brim', 'Tonal 3D embroidery', 'Snap closure', 'Satin-taped seams'],
      colors: [cp('Black', 'Black', '#111113', '#18181b', '#141416', '#3a3a40', '#4a4a50', '#8d8d93')],
      stock: ONE(21)
    },
    {
      id: 'cp06', slug: 'sand-camper', cat: 'caps', name: 'SAND CAMPER', article: 'BLV-CP-006', price: 899,
      shape: 'camp', added: '2026-02-26', rank: 9, sold: 210,
      tagline: 'Washed, faded, worn in.',
      desc: 'A five-panel camper in garment-washed cotton ripstop. Sold out — join the waitlist from the product page.',
      details: ['Garment-washed cotton ripstop', 'Low-profile 5-panel crown', 'Short curved brim', 'Woven patch', 'Adjustable strap'],
      colors: [
        cp('Sand', 'Sand', '#cdbd9f', '#cbbb9d', '#b8a789', '#1b1b1e', O),
        cp('Olive', 'Olive', '#6b6b3d', '#60623a', '#52532f', '#f1efe9', O)
      ],
      stock: sizes(['S/M', 'L/XL'], [0, 0])
    },
    {
      id: 'cp07', slug: 'orbit-dad', cat: 'caps', name: 'ORBIT DAD CAP', article: 'BLV-CP-007', price: 1199,
      shape: 'dad', best: true, added: '2026-03-30', rank: 4, sold: 275,
      tagline: 'Soft corduroy, hard attitude.',
      desc: 'Wide-wale corduroy crown, matching strap, and a contrast stitched brim. Gets better with every wear.',
      details: ['8-wale cotton corduroy', 'Unstructured 6-panel crown', 'Pre-curved brim', 'Adjustable strap', 'Embroidered wordmark'],
      colors: [
        cp('Grey', 'Grey', '#8c8c92', '#8c8c92', '#76767c', '#17171a', O),
        cp('White', 'White', '#f1efe9', '#eeeae0', '#dad5c8', '#17171a', O)
      ],
      stock: ONE(18)
    },
    {
      id: 'cp08', slug: 'stack-snapback', cat: 'caps', name: 'STACK SNAPBACK', article: 'BLV-CP-008', price: 1899,
      shape: 'snap', isNew: true, added: '2026-11-02', rank: 6, sold: 44,
      tagline: 'Big slash, bigger crown.',
      desc: 'Our tallest crown yet in a heavy wool-acrylic blend with leather strap. Limited colourways every drop.',
      details: ['Wool-acrylic heavyweight blend', 'Extra-high structured crown', 'Leather snap strap', 'Flat brim', 'Raised 3D slash'],
      colors: [
        cp('Black / White', 'Black', '#1b1b1e', '#1c1c1f', '#1c1c1f', '#f1efe9', '#f1efe9', '#f1efe9'),
        cp('Olive', 'Olive', '#6b6b3d', '#5f6137', '#5f6137', '#f1efe9', O)
      ],
      stock: ONE(12)
    },
    {
      id: 'cp09', slug: 'tour-5-panel', cat: 'caps', name: 'TOUR 5-PANEL', article: 'BLV-CP-009', price: 2499,
      shape: 'camp', isNew: true, added: '2026-11-06', rank: 8, sold: 29,
      tagline: 'Tour merch. Tour-quality.',
      desc: 'Heavyweight wool with full-grain leather patch and tonal orange binding. Made in a run of 500.',
      details: ['Heavyweight wool blend', 'Leather BLVNK patch', 'Orange-bound seams', 'Brass buckle strap', 'Numbered inside the band'],
      colors: [
        cp('Black / Orange', 'Black', '#1b1b1e', '#19191c', '#141416', O, '#f1efe9'),
        cp('Charcoal', 'Grey', '#3d3d42', '#3b3b40', '#2f2f33', '#f1efe9', O)
      ],
      stock: sizes(['S/M', 'L/XL'], [2, 3])
    }
  ];

  products.forEach(p => { p.total = Object.values(p.stock).reduce((a, b) => a + b, 0); });

  window.BLVNK_PRODUCTS = products;
})();
