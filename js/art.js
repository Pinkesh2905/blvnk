/* BLVNK — procedural studio renders.
   Every product image is generated from the product's colourway, so the colour
   swatches on a product page really change the picture. To use real photography
   instead, add `photos: { "<colour index>": ["url1","url2",...] }` to a product
   in data.js — Art.src() will prefer those over the generated render. */
(function () {
  'use strict';

  /* ---------- colour helpers ---------- */
  const hx = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const toHex = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const shade = (h, f) => { const t = f > 0 ? 255 : 0, a = Math.abs(f); return toHex(hx(h).map(v => v + (t - v) * a)); };

  const FONT = "'Arial Black','Helvetica Neue',Arial,sans-serif";

  /* ---------- studio backdrop ---------- */
  function backdrop(accent) {
    return `<defs>
<radialGradient id="bgA" cx="50%" cy="40%" r="78%"><stop offset="0" stop-color="#3a3a40"/><stop offset=".5" stop-color="#1c1c1f"/><stop offset="1" stop-color="#0a0a0b"/></radialGradient>
<radialGradient id="flo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${accent}" stop-opacity=".20"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
<filter id="bl" x="-30%" y="-200%" width="160%" height="500%"><feGaussianBlur stdDeviation="13"/></filter>
<filter id="bl2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
<pattern id="mesh" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#000" fill-opacity=".22"/><circle cx="5.5" cy="5.5" r="1.1" fill="#000" fill-opacity=".22"/></pattern>
<pattern id="twill" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><rect width="6" height="3" fill="#fff" fill-opacity=".055"/><rect y="3" width="6" height="3" fill="#000" fill-opacity=".10"/></pattern>
</defs>
<rect width="800" height="800" fill="url(#bgA)"/>
<ellipse cx="400" cy="640" rx="400" ry="110" fill="url(#flo)"/>`;
  }

  /* ---------- SNEAKERS ---------- */
  const SH = { low: { c: 158, sH: 58 }, high: { c: 76, sH: 54 }, chunky: { c: 176, sH: 96 } };

  function sneakerSide(k, p) {
    const { c, sH } = SH[k], fy = 440, sT = fy - sH, toeX = 732;
    const L0 = [350, c + 38], L1 = [512, sT - (k === 'chunky' ? 98 : 112)];
    const upper = `M112,${sT + 12} C100,${(sT + c) / 2 + 34} 104,${c + 92} 122,${c + 48} C128,${c + 16} 144,${c} 172,${c}
C212,${c + 2} 246,${c + 14} 268,${c + 40} L284,${c - 20} C296,${c - 40} 322,${c - 42} 332,${c - 22} L${L0[0]},${L0[1]}
L${L1[0]},${L1[1]} C${L1[0] + 70},${L1[1] + 14} ${toeX - 46},${L1[1] + 30} ${toeX - 12},${L1[1] + 72} Q${toeX + 7},${sT - 2} ${toeX + 7},${sT + 12} Z`;
    const mid = `M102,${sT + 6} L${toeX + 12},${sT + 2} C${toeX + 26},${sT + 8} ${toeX + 32},${fy - 22} ${toeX + 14},${fy - 6} Q${toeX},${fy + 5} ${toeX - 22},${fy + 5}
L152,${fy + 5} Q112,${fy + 4} 106,${fy - 22} Q98,${sT + 30} 102,${sT + 6} Z`;
    // lace strip geometry
    const dx = L1[0] - L0[0], dy = L1[1] - L0[1], len = Math.hypot(dx, dy);
    const n = [-dy / len * -1, dx / len]; // unit normal pointing down-left of the lace line
    const nn = [-(dy / len), dx / len];
    const nd = nn[1] < 0 ? [-nn[0], -nn[1]] : nn; // make sure it points down
    const strip = [L0, L1, [L1[0] + nd[0] * 46, L1[1] + nd[1] * 46], [L0[0] + nd[0] * 46, L0[1] + nd[1] * 46]].map(q => q.join(',')).join(' ');
    let laces = '', eyes = '';
    const N = k === 'high' ? 8 : 6;
    for (let i = 0; i < N; i++) {
      const t = (i + 0.55) / N, px = L0[0] + dx * t, py = L0[1] + dy * t;
      const a = [px - nd[0] * 2 + 7, py - nd[1] * 2 - 3], b = [px + nd[0] * 38 - 7, py + nd[1] * 38 + 3];
      laces += `<line x1="${a[0].toFixed(1)}" y1="${(a[1] + 3).toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${(b[1] + 3).toFixed(1)}" stroke="#000" stroke-opacity=".38" stroke-width="10" stroke-linecap="round"/>
<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${p.lace}" stroke-width="9" stroke-linecap="round"/>`;
      eyes += `<circle cx="${(px + nd[0] * 41).toFixed(1)}" cy="${(py + nd[1] * 41).toFixed(1)}" r="3.4" fill="${shade(p.upper, -.6)}"/>`;
    }
    const quarter = `M104,${sT + 12} L106,${c + 74} C150,${c + 64} 206,${c + 96} 262,${sT - 66} C300,${sT - 40} 336,${sT - 28} 392,${sT + 12} Z`;
    const toe = `M${toeX - 150},${sT + 12} C${toeX - 160},${L1[1] + 70} ${toeX - 140},${L1[1] + 36} ${toeX - 108},${L1[1] + 32} L${toeX + 20},${L1[1] + 24} L${toeX + 20},${sT + 12} Z`;
    const mY = sT + sH * 0.46;
    const slash = `<polygon points="196,${sT - 14} 226,${sT - 14} 270,${sT - 98} 240,${sT - 98}" fill="${p.accent}"/><polygon points="238,${sT - 14} 252,${sT - 14} 296,${sT - 98} 282,${sT - 98}" fill="${p.accent}"/>`;
    const win = k === 'chunky' ? `<rect x="188" y="${sT + 24}" width="118" height="${sH - 50}" rx="16" fill="${shade(p.sole, -.5)}" fill-opacity=".85"/><rect x="520" y="${sT + 24}" width="140" height="${sH - 50}" rx="16" fill="${shade(p.sole, -.5)}" fill-opacity=".85"/>` : '';
    return `
<ellipse cx="420" cy="${fy + 8}" rx="330" ry="17" fill="#000" fill-opacity=".62" filter="url(#bl)"/>
<path d="${mid}" fill="${p.sole}"/>
<clipPath id="cm"><path d="${mid}"/></clipPath>
<g clip-path="url(#cm)"><rect x="90" y="${fy - 13}" width="700" height="30" fill="${p.outsole}"/><rect x="90" y="${sT}" width="700" height="${sH}" fill="url(#msh)"/>
<path d="M104,${mY} Q420,${mY + 5} ${toeX + 20},${mY - 4}" stroke="${p.accent}" stroke-width="4" fill="none"/>${win}</g>
<path d="${mid}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/>
<path d="${upper}" fill="${p.upper}"/>
<clipPath id="cu"><path d="${upper}"/></clipPath>
<g clip-path="url(#cu)">
<rect x="90" y="${c - 50}" width="700" height="420" fill="url(#mesh)" opacity=".8"/>
<path d="${quarter}" fill="${p.panel}"/><path d="${toe}" fill="${p.panel}"/>
<polygon points="${strip}" fill="${shade(p.panel, -.12)}"/>
<path d="M126,${c + 52} C132,${c + 16} 148,${c + 3} 172,${c + 3} C212,${c + 5} 246,${c + 16} 268,${c + 42}" fill="none" stroke="${shade(p.upper, .22)}" stroke-width="16" stroke-opacity=".7"/>
${slash}
<path d="M110,${sT - 2} L392,${sT - 2}" stroke="#000" stroke-opacity=".18" stroke-width="2"/>
<path d="M${toeX - 144},${sT - 4} C${toeX - 154},${L1[1] + 70} ${toeX - 138},${L1[1] + 42} ${toeX - 106},${L1[1] + 38}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-dasharray="5 4"/>
<rect x="90" y="${c - 50}" width="700" height="420" fill="url(#shu)"/>
<ellipse cx="${toeX - 90}" cy="${L1[1] + 46}" rx="70" ry="13" fill="#fff" fill-opacity=".10" filter="url(#bl2)" transform="rotate(14 ${toeX - 90} ${L1[1] + 46})"/>
</g>
<path d="M120,${c + 38} C112,${c + 12} 120,${c - 10} 136,${c - 8} L150,${c + 10} Z" fill="${p.accent}"/>
${laces}${eyes}
<path d="${upper}" fill="none" stroke="#fff" stroke-opacity=".10" stroke-width="2"/>
<text x="${toeX - 205}" y="${sT - 2}" font-family="${FONT}" font-size="15" font-weight="900" letter-spacing="3" fill="${p.accent}" opacity="0">.</text>`;
  }

  function sneakerDefs(p) {
    return `<defs>
<linearGradient id="shu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>
<linearGradient id="msh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
</defs>`;
  }

  const FOOT = 'M120,250 C118,205 150,178 210,176 C270,174 320,196 380,198 C450,200 500,170 590,168 C670,166 730,196 735,250 C730,304 670,334 590,332 C500,330 450,300 380,302 C320,304 270,326 210,324 C150,322 122,295 120,250 Z';

  function sneakerTop(k, p) {
    const sc = k === 'chunky' ? 1.06 : 1;
    let laces = '';
    for (let i = 0; i < 6; i++) {
      const x = 318 + i * 27;
      laces += `<line x1="${x}" y1="${208 + i * .6}" x2="${x + 8}" y2="${292 - i * .6}" stroke="#000" stroke-opacity=".35" stroke-width="10" stroke-linecap="round" transform="translate(0,3)"/>
<line x1="${x}" y1="${208 + i * .6}" x2="${x + 8}" y2="${292 - i * .6}" stroke="${p.lace}" stroke-width="9" stroke-linecap="round"/>
<circle cx="${x - 7}" cy="${203 + i * .5}" r="3.4" fill="${shade(p.upper, -.6)}"/><circle cx="${x + 15}" cy="${297 - i * .5}" r="3.4" fill="${shade(p.upper, -.6)}"/>`;
    }
    return `<g transform="translate(400 380) scale(${sc * 1.16}) rotate(-8) translate(-430 -250)">
<ellipse cx="430" cy="372" rx="320" ry="26" fill="#000" fill-opacity=".6" filter="url(#bl)"/>
<path d="${FOOT}" fill="${p.sole}" stroke="${p.sole}" stroke-width="16" stroke-linejoin="round"/>
<path d="${FOOT}" fill="none" stroke="${p.accent}" stroke-width="3" transform="translate(0 0) scale(1)" opacity="0"/>
<path d="${FOOT}" fill="${p.upper}"/>
<clipPath id="ct"><path d="${FOOT}"/></clipPath>
<g clip-path="url(#ct)">
<rect x="100" y="150" width="660" height="200" fill="url(#mesh)" opacity=".8"/>
<path d="M600,160 C556,210 556,290 600,342 L760,342 L760,160 Z" fill="${p.panel}"/>
<path d="M100,150 L196,150 L196,350 L100,350 Z" fill="${p.panel}"/>
<path d="M290,214 L500,222 Q540,250 500,278 L290,286 Z" fill="${shade(p.panel, -.12)}"/>
<polygon points="140,262 156,262 172,238 156,238" fill="${p.accent}"/><polygon points="164,262 172,262 188,238 180,238" fill="${p.accent}"/>
<path d="M600,160 C556,210 556,290 600,342" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-dasharray="5 4"/>
<rect x="100" y="150" width="660" height="200" fill="url(#shv)"/>
</g>
<ellipse cx="236" cy="250" rx="78" ry="50" fill="#070708"/><ellipse cx="236" cy="250" rx="78" ry="50" fill="none" stroke="${shade(p.upper, .2)}" stroke-width="9" stroke-opacity=".8"/>
<path d="M262,226 C300,214 330,218 360,230 L360,270 C330,282 300,286 262,274 Z" fill="${p.panel}" opacity=".95"/>
${laces}
<path d="${FOOT}" fill="none" stroke="#fff" stroke-opacity=".10" stroke-width="2"/>
</g>`;
  }

  function sneakerSole(k, p) {
    let tread = '';
    for (let i = 0; i < 9; i++) {
      const x = 530 + i * 24;
      tread += `<path d="M${x},176 L${x + 14},250 L${x},324" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="7" stroke-linecap="round"/>`;
    }
    for (let i = 0; i < 4; i++) {
      const x = 140 + i * 22;
      tread += `<path d="M${x},190 L${x + 10},250 L${x},312" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="7" stroke-linecap="round"/>`;
    }
    return `<g transform="translate(400 380) scale(1.16) rotate(-8) translate(-430 -250)">
<ellipse cx="430" cy="372" rx="320" ry="26" fill="#000" fill-opacity=".6" filter="url(#bl)"/>
<path d="${FOOT}" fill="${p.outsole}" stroke="${p.sole}" stroke-width="16" stroke-linejoin="round"/>
<clipPath id="cs"><path d="${FOOT}"/></clipPath>
<g clip-path="url(#cs)">
${tread}
<path d="M270,206 C330,214 400,232 440,250 C400,268 330,286 270,294 C250,270 250,230 270,206 Z" fill="${shade(p.outsole, -.5)}"/>
<circle cx="640" cy="250" r="34" fill="none" stroke="${p.accent}" stroke-width="6"/>
<circle cx="180" cy="250" r="30" fill="none" stroke="${p.accent}" stroke-width="5"/>
<text x="470" y="258" font-family="${FONT}" font-size="26" font-weight="900" letter-spacing="5" fill="${p.accent}" transform="rotate(0)" text-anchor="middle">BLVNK</text>
<rect x="100" y="150" width="660" height="200" fill="url(#shv)"/>
</g></g>`;
  }

  /* ---------- CAPS ---------- */
  const CAP = {
    dad:  { yt: 212, w: 214, brim: 'curve', logo: 'word' },
    snap: { yt: 176, w: 220, brim: 'flat', logo: 'slash' },
    camp: { yt: 244, w: 214, brim: 'curve', logo: 'patch' }
  };

  function logoFront(kind, p, cx, cy) {
    if (kind === 'word') {
      return `<text x="${cx}" y="${cy + 14}" text-anchor="middle" font-family="${FONT}" font-size="52" font-weight="900" letter-spacing="5" fill="${p.logo}">BL<tspan fill="${p.v}">V</tspan>NK</text>`;
    }
    if (kind === 'slash') {
      return `<polygon points="${cx - 44},${cy + 40} ${cx - 20},${cy + 40} ${cx + 10},${cy - 44} ${cx - 14},${cy - 44}" fill="${p.logo}"/><polygon points="${cx + 2},${cy + 40} ${cx + 14},${cy + 40} ${cx + 44},${cy - 44} ${cx + 32},${cy - 44}" fill="${p.v}"/>`;
    }
    return `<rect x="${cx - 62}" y="${cy - 26}" width="124" height="52" rx="3" fill="${p.logo}"/><rect x="${cx - 58}" y="${cy - 22}" width="116" height="44" rx="2" fill="none" stroke="${p.crown}" stroke-opacity=".5" stroke-width="1.5"/>
<text x="${cx}" y="${cy + 9}" text-anchor="middle" font-family="${FONT}" font-size="24" font-weight="900" letter-spacing="3" fill="${p.crown}">BL<tspan fill="${p.v}">V</tspan>NK</text>`;
  }

  function capFront(k, p) {
    const { yt, w, brim, logo } = CAP[k], cx = 400, yb = 470;
    const crown = `M${cx - w},${yb} C${cx - w - 6},${yt + 130} ${cx - 120},${yt} ${cx},${yt} C${cx + 120},${yt} ${cx + w + 6},${yt + 130} ${cx + w},${yb} Q${cx},${yb + 30} ${cx - w},${yb} Z`;
    const br = brim === 'flat'
      ? `M${cx - w - 8},${yb - 8} Q${cx},${yb + 36} ${cx + w + 8},${yb - 8} L${cx + w + 56},${yb + 74} Q${cx},${yb + 128} ${cx - w - 56},${yb + 74} Z`
      : `M${cx - w - 6},${yb - 6} Q${cx},${yb + 38} ${cx + w + 6},${yb - 6} C${cx + w + 22},${yb + 14} ${cx + w + 12},${yb + 62} ${cx + w - 40},${yb + 80} Q${cx},${yb + 104} ${cx - w + 40},${yb + 80} C${cx - w - 12},${yb + 62} ${cx - w - 22},${yb + 14} ${cx - w - 6},${yb - 6} Z`;
    const mid = brim === 'flat' ? yb + 100 : yb + 84;
    const side1 = `M${cx - 6},${yt + 6} C${cx - 70},${yt + 90} ${cx - w * .62},${yb - 110} ${cx - w * .56},${yb + 14}`;
    const side2 = `M${cx + 6},${yt + 6} C${cx + 70},${yt + 90} ${cx + w * .62},${yb - 110} ${cx + w * .56},${yb + 14}`;
    return `
<ellipse cx="400" cy="${yb + 130}" rx="${w + 90}" ry="24" fill="#000" fill-opacity=".6" filter="url(#bl)"/>
<path d="${crown}" fill="${p.crown}"/>
<clipPath id="cc"><path d="${crown}"/></clipPath>
<g clip-path="url(#cc)">
<rect x="150" y="${yt - 10}" width="500" height="320" fill="url(#twill)"/>
<path d="${side1}" fill="none" stroke="#000" stroke-opacity=".38" stroke-width="2.5"/><path d="${side2}" fill="none" stroke="#000" stroke-opacity=".38" stroke-width="2.5"/>
<path d="M${cx},${yt} L${cx},${yb + 20}" stroke="#000" stroke-opacity=".42" stroke-width="2.5"/>
<path d="${side1}" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2.5" transform="translate(3 0)"/><path d="${side2}" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2.5" transform="translate(3 0)"/>
<rect x="150" y="${yt - 10}" width="500" height="320" fill="url(#shc)"/>
</g>
<circle cx="${cx - 74}" cy="${yt + 40}" r="5" fill="${shade(p.crown, -.55)}"/><circle cx="${cx + 74}" cy="${yt + 40}" r="5" fill="${shade(p.crown, -.55)}"/>
<circle cx="${cx}" cy="${yt + 4}" r="13" fill="${shade(p.crown, .1)}"/><circle cx="${cx}" cy="${yt + 4}" r="13" fill="url(#shb)"/>
${logoFront(logo, p, cx, yt + (yb - yt) * .55)}
<path d="${br}" fill="${p.brim}"/>
<clipPath id="cb"><path d="${br}"/></clipPath>
<g clip-path="url(#cb)">
<path d="M${cx - w - 60},${yb + 32} Q${cx},${mid - 54} ${cx + w + 60},${yb + 32}" fill="none" stroke="#fff" stroke-opacity=".10" stroke-width="2" stroke-dasharray="6 5"/>
<path d="M${cx - w - 60},${yb + 62} Q${cx},${mid - 24} ${cx + w + 60},${yb + 62}" fill="none" stroke="#fff" stroke-opacity=".10" stroke-width="2" stroke-dasharray="6 5"/>
<rect x="120" y="${yb - 10}" width="560" height="170" fill="url(#shr)"/>
</g>
<path d="M${cx - w - 6},${yb - 6} Q${cx},${yb + 38} ${cx + w + 6},${yb - 6}" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="3"/>
<path d="${crown}" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>`;
  }

  function capSide(k, p) {
    const flat = k === 'snap', low = k === 'camp';
    const top = flat ? 192 : low ? 246 : 218;
    const crown = flat
      ? `M214,478 C206,340 224,${top} 360,${top - 8} C470,${top - 14} 574,${top + 18} 590,340 L594,478 Z`
      : `M214,478 C204,${top + 150} 248,${top + 10} 372,${top - 4} C470,${top - 12} 574,${top + 40} 588,380 L594,478 Z`;
    const br = flat
      ? `M584,448 L762,462 L770,490 L592,486 Z`
      : `M572,436 C650,424 728,452 760,520 C710,542 626,520 590,490 Z`;
    return `<g transform="translate(-160 -78) scale(1.15)">
<ellipse cx="480" cy="530" rx="320" ry="22" fill="#000" fill-opacity=".6" filter="url(#bl)"/>
<path d="${br}" fill="${p.brim}" stroke="#fff" stroke-opacity=".14" stroke-width="2"/>
<path d="${flat ? 'M592,486 L770,490 L768,500 L594,496 Z' : 'M590,490 C626,520 710,542 760,520 L756,530 C706,552 622,532 592,500 Z'}" fill="${shade(p.under, 0)}"/>
<path d="${crown}" fill="${p.crown}"/>
<clipPath id="cs2"><path d="${crown}"/></clipPath>
<g clip-path="url(#cs2)">
<rect x="190" y="${top - 30}" width="430" height="320" fill="url(#twill)"/>
<path d="M392,${top - 4} C360,${top + 100} 330,${top + 210} 340,490" fill="none" stroke="#000" stroke-opacity=".38" stroke-width="2.5"/>
<path d="M392,${top - 4} C440,${top + 90} 480,${top + 200} 470,490" fill="none" stroke="#000" stroke-opacity=".38" stroke-width="2.5"/>
<path d="M392,${top - 4} C320,${top + 50} 270,${top + 160} 256,490" fill="none" stroke="#000" stroke-opacity=".30" stroke-width="2.5"/>
<path d="M392,${top - 4} C500,${top + 40} 560,${top + 150} 576,490" fill="none" stroke="#000" stroke-opacity=".30" stroke-width="2.5"/>
<rect x="190" y="${top - 30}" width="430" height="320" fill="url(#shs)"/>
</g>
<rect x="200" y="${flat ? 408 : 414}" width="30" height="46" rx="3" fill="${flat ? shade(p.under, .25) : '#bdbdc2'}" opacity=".95"/>
<rect x="204" y="${flat ? 420 : 426}" width="22" height="5" fill="#000" fill-opacity=".35"/><rect x="204" y="${flat ? 432 : 438}" width="22" height="5" fill="#000" fill-opacity=".35"/>
<circle cx="392" cy="${top - 5}" r="12" fill="${shade(p.crown, .1)}"/>
<g transform="translate(494 ${flat ? 404 : 420})"><polygon points="0,36 14,36 30,0 16,0" fill="${p.logo}"/><polygon points="20,36 26,36 42,0 36,0" fill="${p.v}"/></g>
<path d="M214,478 L594,478 L594,486 L214,486 Z" fill="${shade(p.crown, -.45)}"/>
<path d="${crown}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2"/></g>`;
  }

  function capTop(k, p) {
    const rx = 214, ry = k === 'snap' ? 196 : 206, cx = 400, cy = 350;
    let seams = '';
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 - 90) * Math.PI / 180, b = a + 0.11;
      const ex = cx + Math.cos(a) * rx, ey = cy + Math.sin(a) * ry;
      const mx = cx + Math.cos(b) * rx * .55, my = cy + Math.sin(b) * ry * .55;
      seams += `<path d="M${cx},${cy} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}" fill="none" stroke="#000" stroke-opacity=".42" stroke-width="2.5"/>`;
    }
    return `
<ellipse cx="400" cy="660" rx="300" ry="26" fill="#000" fill-opacity=".55" filter="url(#bl)"/>
<path d="M${cx - rx + 8},${cy + 40} C${cx - rx - 20},${cy + 190} ${cx - 120},${cy + 320} ${cx},${cy + 322} C${cx + 120},${cy + 320} ${cx + rx + 20},${cy + 190} ${cx + rx - 8},${cy + 40} Z" fill="${p.brim}"/>
<path d="M${cx - 170},${cy + 200} Q${cx},${cy + 330} ${cx + 170},${cy + 200}" fill="none" stroke="#fff" stroke-opacity=".10" stroke-width="2" stroke-dasharray="6 5"/>
<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${p.crown}"/>
<clipPath id="ctp"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath>
<g clip-path="url(#ctp)"><rect x="150" y="130" width="500" height="440" fill="url(#twill)"/>${seams}<rect x="150" y="130" width="500" height="440" fill="url(#shtop)"/></g>
<circle cx="${cx}" cy="${cy}" r="22" fill="${shade(p.crown, .08)}"/><circle cx="${cx}" cy="${cy}" r="22" fill="url(#shb)"/>
<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#fff" stroke-opacity=".09" stroke-width="2"/>`;
  }

  function capDefs() {
    return `<defs>
<linearGradient id="shc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
<linearGradient id="shs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>
<linearGradient id="shr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".18" stop-color="#fff" stop-opacity=".16"/><stop offset=".7" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>
<radialGradient id="shtop" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></radialGradient>
<radialGradient id="shb" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
</defs>`;
  }

  function sneakerDefs2() {
    return `<defs><linearGradient id="shv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient></defs>`;
  }

  /* ---------- public API ---------- */
  const cache = new Map();
  const SNEAKER_VIEWS = [{ key: 'side', label: 'Side' }, { key: 'top', label: 'Top' }, { key: 'sole', label: 'Outsole' }, { key: 'detail', label: 'Detail' }];
  const CAP_VIEWS = [{ key: 'side', label: 'Side' }, { key: 'front', label: 'Front' }, { key: 'top', label: 'Top' }, { key: 'detail', label: 'Detail' }];

  function build(prod, ci, view) {
    const col = prod.colors[ci] || prod.colors[0], p = col.p;
    let body, vb = '0 0 800 800';
    if (prod.cat === 'sneakers') {
      const k = prod.shape;
      if (view === 'top') body = sneakerTop(k, p);
      else if (view === 'sole') body = sneakerSole(k, p);
      else {
        const cy = (SH[k].c + 440) / 2;
        body = `<g transform="translate(400 410) scale(1.06) translate(-422 ${-cy})">${sneakerSide(k, p)}</g>`;
        if (view === 'detail') vb = '400 260 360 360';
      }
      body = sneakerDefs(p) + sneakerDefs2() + body;
    } else {
      const k = prod.shape;
      if (view === 'side') body = capSide(k, p);
      else if (view === 'top') body = capTop(k, p);
      else { body = capFront(k, p); if (view === 'detail') vb = '230 190 340 340'; }
      body = capDefs() + body;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="800" height="800">${backdrop(p.accent)}${body}</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* Photos: prod.photos = { <colour index>: [url, url, ...] } (filled in by js/photos.js).
     A colour with photos uses them; a colour without falls back to the generated renders.
     Views are addressed by position, so a view key from one colour always resolves on another. */
  const PHOTO_LABELS = {
    sneakers: ['Side', '3/4 front', 'Heel', 'Outsole'],
    caps: ['3/4 view', 'Front', 'Side', 'Top']
  };
  const photosFor = (prod, ci) => { const l = prod.photos && prod.photos[ci || 0]; return l && l.length ? l : null; };
  function viewIndex(prod, key) {
    const m = /^p(\d+)$/.exec(key);
    if (m) return +m[1];
    return Math.max(0, (prod.cat === 'sneakers' ? SNEAKER_VIEWS : CAP_VIEWS).findIndex(v => v.key === key));
  }
  function views(prod, ci) {
    const l = photosFor(prod, ci);
    if (l) return l.map((_, i) => ({ key: 'p' + i, label: PHOTO_LABELS[prod.cat][i] || 'Detail ' + (i + 1) }));
    return prod.cat === 'sneakers' ? SNEAKER_VIEWS : CAP_VIEWS;
  }
  /* Photo entries are path stems; js/photos.js is generated by tools/build-photos.py and every
     stem has -360 / -720 / -1200 .webp variants. src() picks the smallest variant that is >= w. */
  const WIDTHS = [360, 720, 1200];
  const pickW = w => WIDTHS.find(x => x >= (w || 720)) || WIDTHS[WIDTHS.length - 1];
  const stemAt = (l, idx) => l[Math.min(idx, l.length - 1)];
  function srcset(prod, ci, view) {
    const l = photosFor(prod, ci);
    return l ? WIDTHS.map(w => `${stemAt(l, viewIndex(prod, view))}-${w}.webp ${w}w`).join(', ') : '';
  }
  function src(prod, ci, view, w) {
    ci = ci || 0;
    const idx = viewIndex(prod, view), l = photosFor(prod, ci);
    if (l) return `${stemAt(l, idx)}-${pickW(w)}.webp`;
    const vs = prod.cat === 'sneakers' ? SNEAKER_VIEWS : CAP_VIEWS, key3 = vs[Math.min(idx, vs.length - 1)].key;
    const key = prod.id + '|' + ci + '|' + key3;
    if (!cache.has(key)) cache.set(key, build(prod, ci, key3));
    return cache.get(key);
  }

  window.Art = { src, srcset, views, photosFor };
})();
