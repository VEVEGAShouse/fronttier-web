/* FRONTTIER — an atlas of new territories.
   Every project is an invented island, drawn with contour lines like a Nordic
   survey map. Each shape tells its story: VC Challenge is an archipelago of three
   cohorts, Europeism keeps redrawing its border, the Ocean report is bathymetry,
   Re:turns is an atoll, and Enclave is an island inside an island. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INK = '#101112', PAPER = '#f6f6f3', COBALT = '#2337ff';

  var T = [
    { id: 'enclave', n: '00', name: 'Enclave', kind: 'Prototype', year: '2025 —', url: null, line: 'A sovereign territory inside another.', x: .64, y: .52, r: .17 },
    { id: 'vcc', n: '01', name: 'VC Challenge', kind: 'Programme', year: '2020 — 24', url: 'https://vcchallenge.com', line: 'An accelerator for around 100 Nordic fund managers.', x: .15, y: .27, r: .085 },
    { id: 'hot', n: '02', name: 'House of Thought', kind: 'Essays', year: 'Ongoing', url: 'https://vevegas.com', line: 'Where Virginia E. Vegas thinks out loud.', x: .92, y: .55, r: .06 },
    { id: 'eur', n: '03', name: 'Europeism', kind: 'Concept', year: '2026', url: 'https://europeism.com', line: 'Re-thinking the idea of Europe, one draft at a time.', x: .82, y: .22, r: .085 },
    { id: 'ocean', n: '04', name: 'The Nordic Ocean Opportunity', kind: 'Report · Norden', year: '2025', url: 'https://www.norden.org/en/publication/nordic-ocean-opportunity', line: 'The investment thesis for the Nordic Ocean Economy, built on the FRONTTIER framework.', x: .58, y: .9, r: .1 },
    { id: 'health', n: '05', name: 'Nordic Health Tech', kind: 'Report · Norden', year: '2023', url: 'https://www.norden.org/en/publication/investor-approaches-and-perspectives-nordic-health-tech', line: 'Investor approaches and perspectives: why capital hesitates, and how to close the gap.', x: .88, y: .86, r: .055 },
    { id: 'green', n: '06', name: 'The Greenland Opportunity', kind: 'Investment thesis', year: '—', url: null, line: 'An investment thesis for Greenland.', x: .36, y: .2, r: .085 },
    { id: 'arctic', n: '07', name: 'Arcticonomics', kind: 'Concept', year: '—', url: null, line: 'The Arctic as an economic system.', x: .55, y: .13, r: .055 },
    { id: 'returns', n: '08', name: 'Nordic Re:turns', kind: 'Concept', year: '—', url: null, line: 'Returns from the efficient use of resources.', x: .33, y: .47, r: .05 }
  ];

  /* ---------- shapes ---------- */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  T.forEach(function (d, i) {
    var r = rng(17 + i * 101);
    d.h = [2, 3, 5, 7].map(function (f, j) { return { f: f, a: [.13, .08, .05, .025][j] * (.6 + r() * .8), p: r() * 6.283 }; });
  });

  function ring(c, cx, cy, R, h, k, N, t, o) {
    var s = 1 - k / N * .9, steps = 96, drift = (o.drift || .12);
    c.beginPath();
    for (var i = 0; i <= steps; i++) {
      var th = i / steps * 6.2832, v = 1;
      for (var j = 0; j < h.length; j++) v += h[j].a * (1 - k / N * .35) * (o.amp || 1) * Math.sin(h[j].f * th + h[j].p + t * drift * (1 + k * .12) * (j % 2 ? -1 : 1));
      if (o.pulse) v += .035 * Math.sin(16 * th - t * 2.2) * (k / N);
      var rr = R * s * v, x = cx + Math.cos(th) * rr * (o.ex || 1.12), y = cy + Math.sin(th) * rr * (o.ey || 1);
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.closePath(); c.stroke();
  }
  function island(c, cx, cy, R, h, t, o) {
    var N = o.rings || 9;
    for (var k = 0; k < N; k++) { c.globalAlpha = o.alpha * (.35 + .65 * (k + 1) / N); ring(c, cx, cy, R, h, k, N, t, o); }
    c.globalAlpha = o.alpha;
  }

  // draw one territory in its own way
  function draw(c, d, cx, cy, R, t, alpha, ink) {
    c.strokeStyle = ink; c.fillStyle = ink; c.lineWidth = .8; c.setLineDash([]);
    var o = { alpha: alpha };
    switch (d.id) {
      case 'enclave':
        island(c, cx, cy, R, d.h, t, { alpha: alpha, rings: 12 });
        var ix = cx + R * .2, iy = cy + R * .06, ir = R * .3;
        c.strokeStyle = COBALT; c.lineWidth = 1;
        island(c, ix, iy, ir, d.h.map(function (q) { return { f: q.f + 1, a: q.a * .8, p: q.p + 1 }; }), t * 1.4, { alpha: Math.min(1, alpha * 1.4), rings: 6 });
        c.setLineDash([2, 4]); c.globalAlpha = alpha;
        c.beginPath(); c.ellipse(ix, iy, ir * 1.5, ir * 1.32, 0, 0, 6.2832); c.stroke(); c.setLineDash([]);
        c.fillStyle = COBALT; c.fillRect(ix - 2.5, iy - 2.5, 5, 5);
        break;
      case 'vcc':
        [[25, -.55, .2], [44, .1, -.25], [30, .62, .32]].forEach(function (q, j) {
          var rr = R * .62 * Math.sqrt(q[0] / 44);
          island(c, cx + q[1] * R, cy + q[2] * R, rr, d.h.map(function (z) { return { f: z.f, a: z.a, p: z.p + j * 2 }; }), t, { alpha: alpha, rings: 6 });
        });
        break;
      case 'ocean':
        c.setLineDash([1.5, 4.5]); island(c, cx, cy, R, d.h, t, { alpha: alpha, rings: 11, ex: 1.5, ey: .8 }); c.setLineDash([]);
        break;
      case 'returns':
        island(c, cx, cy, R, d.h, t, { alpha: alpha, rings: 4 });
        c.setLineDash([2, 3]); c.globalAlpha = alpha * .8;
        c.beginPath(); c.ellipse(cx, cy, R * .45 * 1.12, R * .45, 0, 0, 6.2832); c.stroke(); c.setLineDash([]);
        break;
      case 'eur':
        island(c, cx, cy, R, d.h, t, { alpha: alpha, drift: .55, amp: 1.5 });
        break;
      case 'health':
        island(c, cx, cy, R, d.h, t, { alpha: alpha, pulse: true, rings: 8 });
        break;
      case 'green':
        island(c, cx, cy, R, d.h, t, { alpha: alpha, ex: .82, ey: 1.25, rings: 10 });
        break;
      case 'arctic':
        island(c, cx, cy, R, d.h, t, { alpha: alpha, rings: 7 });
        c.globalAlpha = alpha; c.beginPath(); c.moveTo(cx - 6, cy); c.lineTo(cx + 6, cy); c.moveTo(cx, cy - 6); c.lineTo(cx, cy + 6); c.stroke();
        break;
      default:
        island(c, cx, cy, R, d.h, t, { alpha: alpha, rings: 8 });
        c.globalAlpha = alpha; c.beginPath(); c.arc(cx, cy, 2.5, 0, 6.2832); c.fill();
    }
    c.globalAlpha = 1;
  }

  function setup(cv) {
    var DPR = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight, c = cv.getContext('2d');
    cv.width = w * DPR; cv.height = h * DPR; c.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { c: c, w: w, h: h };
  }

  /* ---------- I. the atlas ---------- */
  var map = document.getElementById('map'), atlas = document.getElementById('atlas'), M = setup(map);
  var co = document.getElementById('callout'), cN = document.getElementById('cN'), cT = document.getElementById('cT'), cM = document.getElementById('cM');
  var coord = document.getElementById('coord');
  var mx = -1, my = -1, px = 0, py = 0, hot = null, t = 0, atlasOn = true;

  function geo(d) {
    var S = Math.min(M.w, M.h * 1.3);
    return { x: d.x * M.w - px * (1 + d.r * 20), y: d.y * M.h - py * (1 + d.r * 20), R: d.r * S };
  }
  function pick() {
    var best = null, bd = 1e9;
    T.forEach(function (d) { var g = geo(d), dist = Math.hypot(mx - g.x, my - g.y) / (g.R * 1.1); if (dist < 1 && dist < bd) { bd = dist; best = d; } });
    return best;
  }
  function fmt(v, p, n) { return Math.abs(v).toFixed(2) + '°' + (v >= 0 ? p : n); }

  atlas.addEventListener('mousemove', function (e) {
    var b = atlas.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top;
    coord.textContent = fmt(71.2 - my / M.h * 16, 'N', 'S') + ' · ' + fmt(-24 + mx / M.w * 58, 'E', 'W');
  });
  atlas.addEventListener('mouseleave', function () { mx = my = -1; });
  atlas.addEventListener('click', function (e) {
    var b = atlas.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top;
    var d = pick(); if (!d) return;
    if (d.url) window.open(d.url, '_blank', 'noopener');
    else document.getElementById(d.id === 'enclave' ? 'enclave' : 'row-' + d.id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  });

  function graticule(c, w, h) {
    c.strokeStyle = INK; c.globalAlpha = .06; c.lineWidth = 1;
    var step = Math.max(80, w / 12);
    for (var x = step / 2; x < w; x += step) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (var y = step / 2; y < h; y += step) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    c.globalAlpha = .25;
    for (x = step / 2; x < w; x += step) for (y = step / 2; y < h; y += step) { c.beginPath(); c.moveTo(x - 3, y); c.lineTo(x + 3, y); c.moveTo(x, y - 3); c.lineTo(x, y + 3); c.stroke(); }
    c.globalAlpha = 1;
  }

  function frameAtlas() {
    var c = M.c;
    var tx = mx < 0 ? 0 : (mx / M.w - .5) * 10, ty = my < 0 ? 0 : (my / M.h - .5) * 10;
    px += (tx - px) * .05; py += (ty - py) * .05;
    c.clearRect(0, 0, M.w, M.h);
    graticule(c, M.w, M.h);
    hot = mx >= 0 ? pick() : null;
    atlas.style.cursor = hot ? 'pointer' : 'crosshair';
    T.forEach(function (d) {
      var g = geo(d), a = hot ? (hot === d ? 1 : .28) : .78;
      draw(c, d, g.x, g.y, g.R, t, a, INK);
    });
    if (hot) {
      var g = geo(hot), right = g.x + g.R * 1.2 + 230 < M.w;
      var ex = g.x + (right ? 1 : -1) * g.R * .95, ey = g.y - g.R * .55, lx = g.x + (right ? 1 : -1) * (g.R * 1.25 + 30), ly = ey - 26;
      c.strokeStyle = INK; c.fillStyle = INK; c.lineWidth = 1; c.globalAlpha = 1;
      c.beginPath(); c.moveTo(ex, ey); c.lineTo(lx, ly); c.stroke();
      c.beginPath(); c.arc(ex, ey, 2.5, 0, 6.2832); c.fill();
      co.hidden = false;
      co.style.left = (right ? lx + 8 : lx - 8) + 'px'; co.style.top = ly + 'px';
      co.style.transform = right ? 'translateY(-50%)' : 'translate(-100%,-50%)';
      co.style.borderLeft = right ? '1px solid ' + INK : '0'; co.style.borderRight = right ? '0' : '1px solid ' + INK;
      co.style.paddingLeft = right ? '12px' : '0'; co.style.paddingRight = right ? '0' : '12px'; co.style.textAlign = right ? 'left' : 'right';
      cN.textContent = 'T—' + hot.n + ' · ' + hot.kind;
      cT.textContent = hot.name;
      cM.textContent = hot.url ? 'Open ↗' : (hot.id === 'enclave' ? 'Sealed · read more ↓' : 'Sealed');
      co.classList.toggle('is-open', !!hot.url);
    } else co.hidden = true;
  }

  /* ---------- II. the enclave ---------- */
  var enc = document.getElementById('encMap'), E = setup(enc), encOn = false, D0 = T[0];
  function frameEnclave() {
    var c = E.c; c.clearRect(0, 0, E.w, E.h);
    draw(c, D0, E.w * .46, E.h * .5, Math.min(E.w, E.h) * .4, t, 1, PAPER);
  }

  /* ---------- III. the register ---------- */
  var reg = document.getElementById('reg'), rowHot = null;
  T.forEach(function (d) {
    var li = document.createElement('li'); li.className = 'row' + (d.url ? ' is-open' : ''); li.id = 'row-' + d.id;
    var a = document.createElement('a');
    a.href = d.url || '#enclave';
    if (d.url) { a.target = '_blank'; a.rel = 'noopener'; }
    a.innerHTML = '<span class="mono row__n">T—' + d.n + '</span>' +
      '<span class="row__name">' + d.name + '<span class="row__line">' + d.line + '</span></span>' +
      '<span class="mono row__kind">' + d.kind + '</span><span class="mono row__year">' + d.year + '</span>' +
      '<span class="mono row__acc">' + (d.url ? 'Open ↗' : 'Sealed') + '</span><canvas></canvas>';
    if (!d.url && d.id !== 'enclave') a.addEventListener('click', function (e) { e.preventDefault(); });
    var cv = a.querySelector('canvas');
    a.addEventListener('mouseenter', function () { rowHot = { d: d, g: setup(cv) }; });
    a.addEventListener('mouseleave', function () { rowHot = null; });
    li.appendChild(a); reg.appendChild(li);
  });
  function frameRow() {
    if (!rowHot) return;
    var g = rowHot.g; g.c.clearRect(0, 0, g.w, g.h);
    draw(g.c, rowHot.d, g.w / 2, g.h / 2, Math.min(g.w, g.h) * .42, t, 1, INK);
  }

  /* ---------- loop ---------- */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.target === atlas) atlasOn = e.isIntersecting; else encOn = e.isIntersecting; }); }).observe(atlas);
    new IntersectionObserver(function (es) { encOn = es[0].isIntersecting; }).observe(enc);
  } else encOn = true;
  window.addEventListener('resize', function () { M = setup(map); E = setup(enc); });
  document.getElementById('year').textContent = new Date().getFullYear();

  frameAtlas(); frameEnclave();
  (function loop() {
    if (!reduce) t += 1 / 60;
    if (atlasOn) frameAtlas();
    if (encOn) frameEnclave();
    frameRow();
    requestAnimationFrame(loop);
  })();
})();
