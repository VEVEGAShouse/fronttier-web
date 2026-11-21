/* Arcticonomics v3 — the horizon.
   Eighty years of the real oil price drawn as an Arctic horizon at sea.
   The waterline is $30, what a Norwegian barrel costs. Above it, Norway earns.
   Every summit is named after the war, revolution or sanction that raised it;
   every sounding below the water, after the moment the world pumped freely again. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ICE = '232,238,241', GOLD = '226,173,79', GLA = '140,200,228', MIST = '#7b8790';
  var D = window.OIL, N = D.real.length;
  var NOM = D.nominal10.map(function (v) { return v / 10; });
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); };
  var eio = function (x) { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var lerp = function (a, b, k) { return a + (b - a) * k; };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function idx(y, m) { return (y - D.start[0]) * 12 + (m - D.start[1]); }
  function label(i) { i = clamp(Math.round(i), 0, N - 1); return MONTHS[i % 12] + ' ' + (D.start[0] + Math.floor(i / 12)); }
  function yearOf(i) { return D.start[0] + Math.floor(clamp(Math.round(i), 0, N - 1) / 12); }
  function setup(cv) {
    var DPR = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight, c = cv.getContext('2d');
    cv.width = Math.round(w * DPR); cv.height = Math.round(h * DPR); c.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { c: c, w: w, h: h, narrow: w < 860 };
  }
  function smooth(a, k) { return a.map(function (_, i) { var s = 0, n = 0; for (var j = -k; j <= k; j++) { var v = a[i + j]; if (v != null) { s += v; n++; } } return s / n; }); }
  var RS = smooth(D.real, 1);

  /* ---------- the named summits ---------- */
  var EV = [
    { y: 1971, m: 6, k: 'n', n: 'Norway pumps', t: 'Norway starts pumping.', s: 'Ekofisk, North Sea. The Arctic enters the market.' },
    { y: 1973, m: 10, k: 'b', n: 'Embargo', t: 'Arab–Israeli war and the oil embargo.' },
    { y: 1979, m: 1, k: 'b', n: 'Revolution', t: 'The Iranian revolution.' },
    { y: 1980, m: 9, k: 'b', n: 'Iran–Iraq', t: 'The Iran–Iraq war.' },
    { y: 1986, m: 1, k: 'f', n: 'Price war', t: 'OPEC price war. Everyone pumps.' },
    { y: 1990, m: 8, k: 'b', n: 'Kuwait', t: 'Iraq invades Kuwait.' },
    { y: 2003, m: 3, k: 'b', n: 'Iraq', t: 'Venezuela strikes, the US invades Iraq.' },
    { y: 2006, m: 7, k: 'b', n: 'Lebanon', t: 'Israel–Hezbollah war and sanctions on Iran.' },
    { y: 2008, m: 6, k: 'b', n: 'Niger Delta', t: 'Insurgency in Nigeria’s oil delta.' },
    { y: 2011, m: 2, k: 'b', n: 'Libya', t: 'The Libyan civil war.' },
    { y: 2012, m: 7, k: 'b', n: 'Iran embargo', t: 'The EU embargo on Iranian oil.' },
    { y: 2014, m: 11, k: 'f', n: 'Glut', t: 'OPEC refuses to cut. Everyone pumps.' },
    { y: 2019, m: 1, k: 'b', n: 'Venezuela', t: 'Sanctions on Venezuela.' },
    { y: 2020, m: 4, k: 'f', n: 'Standstill', t: 'A Saudi–Russian price war, and the world stops.' },
    { y: 2022, m: 2, k: 'b', n: 'Ukraine', t: 'Russia invades Ukraine.' },
    { y: 2026, m: 2, k: 'b', n: 'Hormuz', t: 'War on Iran. The Strait of Hormuz closes.', s: '28 February 2026' }
  ];
  EV.forEach(function (e) {
    e.i = idx(e.y, e.m); e.pk = e.i;
    var j;
    if (e.k === 'b') for (j = e.i; j <= Math.min(N - 1, e.i + 13); j++) if (D.real[j] > D.real[e.pk]) e.pk = j;
    if (e.k === 'f') for (j = e.i; j <= Math.min(N - 1, e.i + 7); j++) if (D.real[j] < D.real[e.pk]) e.pk = j;
    var a = D.real.slice(Math.max(0, e.i - 4), e.i + 1);
    if (e.k === 'b') { e.from = Math.min.apply(null, a); e.to = D.real[e.pk]; }
    if (e.k === 'f') { e.from = Math.max.apply(null, a); e.to = D.real[e.pk]; }
  });

  /* spread label positions so nothing collides; keeps order, pulls back from the right edge */
  function relax(it, g, lo, hi) {
    if (!it.length) return;
    it.sort(function (a, b) { return a.dx - b.dx; });
    var k; it[0].lx = Math.max(lo, it[0].dx);
    for (k = 1; k < it.length; k++) it[k].lx = Math.max(it[k].dx, it[k - 1].lx + it[k - 1].gw);
    var last = it[it.length - 1], lim = hi - (last.tw || 0);
    if (last.lx > lim) { last.lx = lim; for (k = it.length - 2; k >= 0; k--) it[k].lx = Math.min(it[k].lx, it[k + 1].lx - it[k].gw); }
    void g;
  }

  /* ---------- the horizon renderer ---------- */
  function draw(o, P) {
    var c = o.c, w = o.w, h = o.h, t = P.t;
    var L = P.L, Rm = P.R, i0 = P.i0, i1 = P.i1, head = P.head;
    var top = P.top, wl = P.wl, vmax = P.vmax || 212, k = P.rise == null ? 1 : P.rise, refl = P.refl || .45;
    var s = (wl - top) / (vmax - 30);
    var X = function (i) { return L + (i - i0) / (i1 - i0) * (w - L - Rm); };
    var val = function (i) { var v = P.series(i); return 30 + (v - 30) * k; };
    var Y = function (v) { return wl - (v - 30) * s; };
    c.clearRect(0, 0, w, h);

    // aurora: hundreds of hairline rays, breathing
    if (P.aurora) {
      var ag = c.createLinearGradient(0, 0, 0, P.aurora);
      ag.addColorStop(0, 'rgba(' + GLA + ',0)'); ag.addColorStop(.55, 'rgba(' + GLA + ',1)'); ag.addColorStop(1, 'rgba(' + GLA + ',0)');
      c.strokeStyle = ag; c.lineWidth = 1;
      for (var ax = 0; ax < w; ax += 3) {
        var n = Math.sin(ax * .006 + t * .23) * .5 + Math.sin(ax * .017 - t * .41) * .3 + Math.sin(ax * .0021 + t * .11) * .6;
        var a = clamp(n, 0, 1) * .085 * P.auroraA;
        if (a < .004) continue;
        c.globalAlpha = a; c.beginPath(); c.moveTo(ax, P.aurora * (.15 + .25 * (1 - clamp(n, 0, 1)))); c.lineTo(ax, P.aurora); c.stroke();
      }
      c.globalAlpha = 1;
    }

    var a0 = Math.max(0, Math.floor(i0) - 1), a1 = Math.min(Math.floor(head), Math.ceil(i1) + 1, N - 1);
    var step = Math.max(1, Math.floor((a1 - a0) / (w * 1.2)));
    var px = [], py = [];
    if (a1 > a0) for (var i = a0; i <= a1; i += step) { px.push(X(i)); py.push(Y(val(i))); }
    if (a1 > a0 && (a1 - a0) % step) { px.push(X(a1)); py.push(Y(val(a1))); }
    var hx = px.length ? px[px.length - 1] : X(0);
    var depth = (wl - top) * refl;

    if (px.length > 1) {
      // above the waterline: Norway's margin, engraved with vertical hairlines
      c.save(); c.beginPath(); c.moveTo(px[0], wl);
      for (var q = 0; q < px.length; q++) c.lineTo(px[q], Math.min(py[q], wl));
      c.lineTo(hx, wl); c.closePath(); c.clip();
      var mg = c.createLinearGradient(0, top, 0, wl);
      mg.addColorStop(0, 'rgba(' + GOLD + ',.16)'); mg.addColorStop(1, 'rgba(' + GOLD + ',0)');
      c.fillStyle = mg; c.fillRect(px[0], top - 40, hx - px[0], wl - top + 40);
      var hg = c.createLinearGradient(0, top, 0, wl);
      hg.addColorStop(0, 'rgba(' + ICE + ',.34)'); hg.addColorStop(1, 'rgba(' + ICE + ',.05)');
      c.strokeStyle = hg; c.lineWidth = 1; c.beginPath();
      var hs = P.hatch || 3, hx0 = Math.ceil(px[0] / hs) * hs;
      for (var vx = hx0; vx <= hx; vx += hs) { c.moveTo(vx + .5, top - 40); c.lineTo(vx + .5, wl); }
      c.stroke(); c.restore();

      // the reflection: the same margin, mirrored and broken by water
      c.save(); c.beginPath(); c.moveTo(px[0], wl);
      for (q = 0; q < px.length; q++) c.lineTo(px[q], wl + (wl - Math.min(py[q], wl)) * refl);
      c.lineTo(hx, wl); c.closePath(); c.clip();
      for (var ry = wl + 2, r = 0; ry < wl + depth + 2; ry += 3, r++) {
        var dd = (ry - wl) / depth;
        c.globalAlpha = (.2 + .1 * Math.sin(t * 1.6 + r * .9)) * (1 - dd);
        c.fillStyle = 'rgb(' + ICE + ')';
        var off = Math.sin(t * .9 + r * .5) * 3;
        c.fillRect(px[0] + off, ry, hx - px[0], 1);
      }
      c.restore(); c.globalAlpha = 1;
    }

    // the waterline: $30, what a Norwegian barrel costs
    c.fillStyle = 'rgba(' + ICE + ',.5)'; c.fillRect(L, Math.round(wl), w - L - Rm, 1);
    if (P.wlLabel) {
      c.font = '400 ' + (o.narrow ? 8.5 : 9.5) + 'px "IBM Plex Mono", monospace'; if ('letterSpacing' in c) c.letterSpacing = '1.4px';
      c.fillStyle = 'rgba(' + ICE + ',.75)'; c.textAlign = 'right'; c.textBaseline = 'alphabetic';
      if (o.narrow) { c.textAlign = 'left'; c.fillText('$30 · THE WATERLINE', L, wl + 30); }
      else { c.fillText('$30 · THE WATERLINE', w - Rm, wl - 8); c.textAlign = 'left'; }
    }
    // grid of prices, barely there
    if (P.grid) {
      c.font = '400 9px "IBM Plex Mono", monospace'; c.textAlign = 'left'; c.fillStyle = 'rgba(' + ICE + ',.3)';
      [100, 200].forEach(function (v) { var yy = Y(30 + (v - 30) * k); c.fillRect(L, Math.round(yy), 28, 1); c.fillText('$' + v, L, yy - 6); });
    }
    // years along the water
    if (P.years) {
      var ppy = (w - L - Rm) / ((i1 - i0) / 12), ys = ppy > 90 ? 1 : ppy > 36 ? 5 : 10;
      c.font = '400 9px "IBM Plex Mono", monospace'; c.textAlign = 'left';
      for (var yy2 = Math.ceil(yearOf(Math.max(0, i0)) / ys) * ys; yy2 <= 2026; yy2 += ys) {
        var xi = X(idx(yy2, 1)); if (xi < L - 1 || xi > w - Rm) continue;
        c.fillStyle = 'rgba(' + ICE + ',' + (idx(yy2, 1) <= head ? .5 : .18) + ')';
        c.fillRect(Math.round(xi), Math.round(wl) + 1, 1, 5); c.fillText(String(yy2), xi + 4, wl + 14);
      }
    }

    // the crest: solid above the water, a faint dotted ghost below it
    if (px.length > 1) {
      var crest = function () { c.beginPath(); c.moveTo(px[0], py[0]); for (var q2 = 1; q2 < px.length; q2++) c.lineTo(px[q2], py[q2]); c.stroke(); };
      c.save(); c.beginPath(); c.rect(0, 0, w, wl); c.clip();
      c.strokeStyle = 'rgba(' + ICE + ',.95)'; c.lineWidth = P.lw || 1.3; c.lineJoin = 'round'; crest(); c.restore();
      c.save(); c.beginPath(); c.rect(0, wl, w, h); c.clip();
      c.setLineDash([1.5, 3]); c.strokeStyle = 'rgba(' + ICE + ',.4)'; c.lineWidth = 1; crest(); c.restore();
    }

    // the names: summits above, soundings below
    if (P.labels) {
      var fs = P.fs || 10, up = [], dn = [];
      c.font = '400 ' + fs + 'px "IBM Plex Mono", monospace'; if ('letterSpacing' in c) c.letterSpacing = (fs * .14).toFixed(1) + 'px';
      EV.forEach(function (e) {
        if (P.only && P.only.indexOf(e.y) < 0) return;
        var appear = clamp((head - e.i) / 5, 0, 1); if (appear <= 0) return;
        var xx = X(e.pk); if (xx < L - 40 || xx > w - Rm + 40) return;
        var it = { e: e, dx: xx, x: xx, y: Y(val(e.pk)), a: appear * (P.labelA == null ? 1 : P.labelA), gw: fs * 1.55 };
        it.txt = (e.n + '  ' + e.y).toUpperCase();
        if (e.k === 'f') { it.tw = c.measureText('↓ ' + it.txt).width; it.gw = it.tw + 22; if (P.flows !== false) dn.push(it); else it.dotOnly = true; }
        else up.push(it);
        if (it.dotOnly) dn.push(it);
      });
      relax(up, 0, L + fs, w - Rm - fs * 2.2);
      relax(dn.filter(function (d) { return !d.dotOnly; }).map(function (d) { d.dx -= d.tw / 2; return d; }), 0, L, w - Rm);
      var cur = P.cur;
      up.forEach(function (it) {
        var e = it.e, col = e.k === 'n' ? ICE : GOLD, on = cur === e, al = it.a * (cur == null || on ? 1 : .62);
        var bend = P.labBase + 16, ytop = P.labBase;
        c.strokeStyle = 'rgba(' + col + ',' + (al * .7) + ')'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(it.x, (e.k === 'n' ? wl : it.y) - 7); c.lineTo(it.x, bend); c.lineTo(it.lx, ytop); c.stroke();
        c.fillStyle = 'rgba(' + col + ',' + al + ')';
        if (e.k === 'n') { c.save(); c.translate(it.x, wl); c.rotate(Math.PI / 4); c.fillRect(-3, -3, 6, 6); c.restore(); }
        else { c.beginPath(); c.arc(it.x, it.y, on ? 2.6 : 1.9, 0, 6.283); c.fill(); }
        if (on) { c.globalAlpha = .18 + .1 * Math.sin(t * 3); c.beginPath(); c.arc(it.x, e.k === 'n' ? wl : it.y, 10, 0, 6.283); c.fill(); c.globalAlpha = 1; }
        c.save(); c.translate(it.lx, ytop - 7); c.rotate(-Math.PI / 2); c.textAlign = 'left'; c.textBaseline = 'middle';
        c.fillText(it.txt, 0, 0); c.restore();
      });
      dn.forEach(function (it) {
        var e = it.e, on = cur === e, al = it.a * (cur == null || on ? 1 : .62);
        var yb = wl + depth + 10;
        c.fillStyle = 'rgba(' + GLA + ',' + al + ')';
        c.beginPath(); c.arc(it.x, it.y, on ? 2.6 : 1.9, 0, 6.283); c.fill();
        if (on) { c.globalAlpha = .2 + .1 * Math.sin(t * 3); c.beginPath(); c.arc(it.x, it.y, 10, 0, 6.283); c.fill(); c.globalAlpha = 1; }
        if (it.dotOnly) return;
        c.strokeStyle = 'rgba(' + GLA + ',' + (al * .65) + ')'; c.lineWidth = 1; c.setLineDash([1, 3]);
        var lx = it.lx + 4;
        c.beginPath(); c.moveTo(it.x, it.y + 6); c.lineTo(it.x, yb - 6); c.lineTo(lx, yb + 2); c.stroke(); c.setLineDash([]);
        c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText('↓ ' + it.txt, it.lx, yb + 6);
      });
      if ('letterSpacing' in c) c.letterSpacing = '0px';
    }

    // the head of the line, travelling
    if (P.headDot && px.length) {
      var hy = py[py.length - 1];
      c.fillStyle = 'rgba(' + ICE + ',.10)'; c.fillRect(Math.round(hx), P.labBase + 20, 1, wl + depth - P.labBase - 20);
      c.fillStyle = 'rgb(' + ICE + ')'; c.beginPath(); c.arc(hx, hy, 3.2, 0, 6.283); c.fill();
      c.globalAlpha = .22; c.beginPath(); c.arc(hx, hy, 9 + Math.sin(t * 3) * 2.5, 0, 6.283); c.fill(); c.globalAlpha = 1;
    }
    // hover readout on the hero
    if (P.hover != null) {
      var hi = clamp(Math.round(i0 + (P.hover - L) / (w - L - Rm) * (i1 - i0)), 0, N - 1), hxx = X(hi), hyy = Y(val(hi));
      c.fillStyle = 'rgba(' + ICE + ',.35)'; c.fillRect(Math.round(hxx), hyy - 60, 1, wl - hyy + 60);
      c.fillStyle = 'rgb(' + ICE + ')'; c.beginPath(); c.arc(hxx, hyy, 3, 0, 6.283); c.fill();
      c.font = '400 9.5px "IBM Plex Mono", monospace'; if ('letterSpacing' in c) c.letterSpacing = '1.3px';
      var m = Math.round(P.series(hi)) - 30, tx = label(hi).toUpperCase() + '   $' + Math.round(P.series(hi)) + '   NORWAY ' + (m >= 0 ? '+$' : '−$') + Math.abs(m);
      var tw = c.measureText(tx).width, tx0 = clamp(hxx + 10, L, w - Rm - tw);
      c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillStyle = 'rgba(' + (m >= 0 ? GOLD : GLA) + ',1)'; c.fillText(tx, tx0, hyy - 66);
      if ('letterSpacing' in c) c.letterSpacing = '0px';
    }
  }
  var realS = function (i) { return RS[clamp(Math.round(i), 0, N - 1)]; };

  /* ---------- 0. hero ---------- */
  var heroCv = document.getElementById('hero'), H = setup(heroCv), heroOn = true, t = 0, born = performance.now(), hover = null;
  function heroLayout(o) {
    var lb = o.h * (o.narrow ? .6 : .6), top = lb + 26, rb = o.h - (o.narrow ? 84 : 76);
    var A = (rb - top) / 1.45;
    return { labBase: lb, top: top, wl: top + A };
  }
  heroCv.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') hover = e.clientX; });
  heroCv.addEventListener('pointerleave', function () { hover = null; });

  /* ---------- 1. the law ---------- */
  var law = document.getElementById('law'), sea = document.getElementById('sea'), gain = document.getElementById('gain'), mk = document.getElementById('mk');
  var mkV = document.getElementById('mkV'), outV = document.getElementById('outV'), outL = document.getElementById('outL');
  var SC = 130, auto = true, world = 'peace', lawTimer = null;
  function setWorld(wd) {
    world = wd; var p = wd === 'peace' ? 20 : 110;
    law.classList.toggle('is-break', wd === 'break');
    law.querySelectorAll('.switch button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.w === wd)); });
    sea.style.height = (p / SC * 100) + '%';
    mk.style.setProperty('--p', p);
    gain.style.bottom = (30 / SC * 100) + '%'; gain.style.height = (Math.max(0, p - 30) / SC * 100) + '%';
    mkV.textContent = '$' + p;
    var from = parseInt(outV.textContent.replace('−', '-').replace(/[^\d-]/g, ''), 10) || 0, to = p - 30, t0 = performance.now();
    (function anim(n) { var kk = reduce ? 1 : ease((n - t0) / 1500), v = Math.round(from + (to - from) * kk); outV.textContent = (v >= 0 ? '+$' : '−$') + Math.abs(v); if (kk < 1) requestAnimationFrame(anim); })(t0);
    outL.innerHTML = wd === 'peace' ? 'on every Norwegian barrel.<br>Nobody needs the Arctic.' : 'on every Norwegian barrel.<br>Everyone needs the Arctic.';
  }
  law.querySelectorAll('.switch button').forEach(function (b) { b.addEventListener('click', function () { auto = false; clearInterval(lawTimer); setWorld(b.dataset.w); }); });
  setWorld('peace');

  /* ---------- 2. the proof ---------- */
  var proof = document.getElementById('proof'), cv = document.getElementById('chart'), C = setup(cv), proofOn = false;
  var nowY = document.getElementById('nowY'), nowP = document.getElementById('nowP'), nowM = document.getElementById('nowM');
  var ev = document.getElementById('ev'), evK = document.getElementById('evK'), evT = document.getElementById('evT'), evN = document.getElementById('evN');
  var coda = document.getElementById('coda'), barM = document.getElementById('barM'), BAR0 = barM.textContent;
  var view = 'real', mix = 1, lastEv = -2;
  document.querySelectorAll('.tog button').forEach(function (b) {
    b.addEventListener('click', function () { view = b.dataset.v; document.querySelectorAll('.tog button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); });
  });
  function series(i) { i = clamp(Math.round(i), 0, N - 1); return NOM[i] + (D.real[i] - NOM[i]) * mix; }
  function proofLayout(o) {
    var lb = o.narrow ? 264 : 250, cardTop = o.h - (o.narrow ? 296 : 214);
    var top = lb + 30, rb = cardTop - 34, A = Math.max(120, (rb - top) / 1.45);
    return { labBase: lb, top: top, wl: top + A };
  }
  function frameProof() {
    var r = proof.getBoundingClientRect(), p = clamp(-r.top / (proof.offsetHeight - innerHeight), 0, 1);
    mix += ((view === 'real' ? 1 : 0) - mix) * (reduce ? 1 : .08);
    var o = C, Wn = (o.narrow ? 7 : 13) * 12;
    var head = clamp((p - .02) / .8, 0, 1) * (N - 1);
    var i1 = Math.max(head + .22 * Wn, Wn - 6), i0 = i1 - Wn;
    if (i1 > N - 1 + 10) { i1 = N - 1 + 10; i0 = i1 - Wn; }
    var z = eio((p - .85) / .12);
    i0 = lerp(i0, -8, z); i1 = lerp(i1, N + 8, z);
    var lay = proofLayout(o), pad = o.narrow ? 18 : 60;
    var cur = null; EV.forEach(function (e) { if (e.i <= head) cur = e; });
    draw(o, {
      t: t, L: pad, R: pad, i0: i0, i1: i1, head: head, top: lay.top, wl: lay.wl, labBase: lay.labBase,
      series: series, labels: true, flows: true, years: true, grid: true, wlLabel: true, headDot: z < .98,
      cur: z > .5 ? null : cur, fs: o.narrow ? 8.5 : 10,
      only: o.narrow && z > .35 ? [1971, 1973, 1979, 1986, 1990, 2003, 2008, 2014, 2020, 2022, 2026] : null, lw: lerp(1.5, 1.1, z), hatch: 3
    });
    coda.classList.toggle('on', p > .95); proof.classList.toggle('is-coda', p > .95);
    var v = Math.round(series(head)), m = v - 30;
    nowY.textContent = yearOf(head);
    nowP.textContent = '$' + v;
    nowM.textContent = (m >= 0 ? '+$' : '−$') + Math.abs(m) + ' a barrel';
    nowM.classList.toggle('is-up', m >= 0);
    var ci = cur ? EV.indexOf(cur) : -1;
    if (ci !== lastEv) {
      lastEv = ci;
      ev.classList.remove('pop'); void ev.offsetWidth; ev.classList.add('pop');
      ev.classList.toggle('is-flow', !!cur && cur.k === 'f'); ev.classList.toggle('is-neutral', !!cur && cur.k === 'n');
      if (!cur) { evK.textContent = 'Calm water'; evT.textContent = 'Cheap oil everywhere. The horizon barely breaks the surface.'; evN.textContent = 'Scroll to sail through eighty years'; }
      else {
        evK.textContent = label(cur.i) + (cur.k === 'b' ? ' · The world breaks' : cur.k === 'f' ? ' · The world flows' : ' · The Arctic opens');
        evT.textContent = cur.t;
        evN.textContent = cur.from != null ? ('$' + cur.from + ' → $' + cur.to + (cur.k === 'b' ? ' · the summit rises' : ' · the sea swallows it') + (cur.s ? ' · ' + cur.s : '')) : (cur.s || '');
      }
      barM.textContent = cur ? label(cur.i) + ' · ' + cur.n : BAR0;
    }
  }

  /* ---------- reveal, counters, crust ---------- */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) {
    if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
    var v = e.target.querySelector && e.target.querySelector('[data-count]');
    if (v && !reduce) { var to = +v.dataset.count, dec = to % 1 ? 1 : 0, t0 = performance.now();
      (function go(n) { var kk = ease((n - t0) / 1800); v.textContent = v.dataset.pre + (to * kk).toFixed(dec) + v.dataset.suf; if (kk < 1) requestAnimationFrame(go); })(t0); }
  }); }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.rv, #crust').forEach(function (n) { io.observe(n); });

  /* ---------- end ---------- */
  var endCv = document.getElementById('endC'), E = setup(endCv), endOn = false;

  /* ---------- loop ---------- */
  new IntersectionObserver(function (es) { heroOn = es[0].isIntersecting; }).observe(heroCv);
  new IntersectionObserver(function (es) { proofOn = es[0].isIntersecting; if (!proofOn) barM.textContent = BAR0; }).observe(proof);
  new IntersectionObserver(function (es) { endOn = es[0].isIntersecting; }).observe(endCv);
  new IntersectionObserver(function (es) {
    if (es[0].isIntersecting && auto && !lawTimer && !reduce) lawTimer = setInterval(function () { if (auto) setWorld(world === 'peace' ? 'break' : 'peace'); }, 4000);
  }, { threshold: .4 }).observe(law);
  var hint = document.getElementById('hint');
  addEventListener('scroll', function () { if (scrollY > 40) hint.style.opacity = 0; }, { passive: true });
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { H = setup(heroCv); C = setup(cv); E = setup(endCv); }, 150); });
  (function loop(now) {
    if (!reduce) t += 1 / 60;
    if (heroOn) {
      var lay = heroLayout(H), rise = reduce ? 1 : eio(((now || 0) - born - 500) / 3200);
      draw(H, {
        t: t, L: 0, R: 0, i0: 0, i1: N - 1, head: N - 1, top: lay.top, wl: lay.wl, labBase: lay.labBase, rise: rise,
        series: realS, labels: true, flows: !H.narrow, labelA: clamp((rise - .7) / .3, 0, 1), fs: H.narrow ? 8 : 9.5,
        aurora: lay.top, auroraA: 1, lw: 1.2, hatch: H.narrow ? 2 : 3, hover: rise > .99 ? hover : null,
        only: H.narrow ? [1971, 1973, 1979, 1990, 2003, 2008, 2014, 2020, 2022, 2026] : null
      });
    }
    if (proofOn) frameProof();
    if (endOn) {
      var lb = E.h * .06 + (E.narrow ? 96 : 118), top = lb + 22, wl = top + (E.h * .9 - top) / 1.4;
      draw(E, {
        t: t, L: 0, R: 0, i0: 0, i1: N - 1, head: N - 1, top: top, wl: wl, labBase: lb, series: realS,
        labels: true, flows: false, labelA: .55, fs: E.narrow ? 7.5 : 8.5, lw: 1, hatch: 2, refl: .4,
        only: E.narrow ? [1973, 1979, 1990, 2008, 2022, 2026] : null
      });
    }
    requestAnimationFrame(loop);
  })();
})();
