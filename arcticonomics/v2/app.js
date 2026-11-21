/* Arcticonomics v2 — the mirror.
   The Arctic Circle is the horizon. Above it, the real oil price: what the Arctic gains.
   Below it, the same line reflected in red: what the world loses. Counter-cyclical, made visible. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INK = '#0b1014', RED = '#d7262e', MIST = '#7b858c', SNOW = '#f3f5f6';
  var D = window.OIL, V = D.real, N = V.length, MAXV = 215;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); };
  var inout = function (x) { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function idx(y, m) { return (y - 1947) * 12 + m - 1; }
  function yearOf(i) { return 1947 + Math.floor(i / 12); }
  function setup(cv) {
    var DPR = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight, c = cv.getContext('2d');
    cv.width = w * DPR; cv.height = h * DPR; c.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { c: c, w: w, h: h };
  }
  function prog(el) { var r = el.getBoundingClientRect(); return clamp(-r.top / (el.offsetHeight - innerHeight), 0, 1); }

  var EV = [
    { y: 1971, m: 6, k: 'n', t: 'Norway starts pumping', s: 'Ekofisk, North Sea' },
    { y: 1973, m: 10, k: 'b', t: 'Arab–Israeli war and the oil embargo' },
    { y: 1979, m: 1, k: 'b', t: 'Iranian revolution' },
    { y: 1980, m: 9, k: 'b', t: 'Iran–Iraq war' },
    { y: 1986, m: 1, k: 'f', t: 'OPEC price war. Everyone pumps.' },
    { y: 1990, m: 8, k: 'b', t: 'Iraq invades Kuwait' },
    { y: 2003, m: 3, k: 'b', t: 'Venezuela strike and the US invasion of Iraq' },
    { y: 2006, m: 7, k: 'b', t: 'Israel–Hezbollah war and sanctions on Iran' },
    { y: 2008, m: 6, k: 'b', t: 'Insurgency in Nigeria’s oil delta' },
    { y: 2011, m: 2, k: 'b', t: 'Libyan civil war' },
    { y: 2012, m: 7, k: 'b', t: 'EU embargo on Iranian oil' },
    { y: 2014, m: 11, k: 'f', t: 'OPEC refuses to cut. Everyone pumps.' },
    { y: 2019, m: 1, k: 'b', t: 'Sanctions on Venezuela' },
    { y: 2020, m: 4, k: 'f', t: 'Saudi–Russia price war. The world stops.' },
    { y: 2022, m: 2, k: 'b', t: 'Russia invades Ukraine' },
    { y: 2026, m: 2, k: 'b', t: 'US–Israel war on Iran. The Strait of Hormuz closes.', s: '28 February 2026' }
  ];
  EV.forEach(function (e) {
    e.i = idx(e.y, e.m);
    var a = V.slice(Math.max(0, e.i - 4), e.i + 1), b = V.slice(e.i, Math.min(N, e.i + 13));
    if (e.k === 'b') { e.from = Math.min.apply(null, a); e.to = Math.max.apply(null, b); e.pk = e.i + b.indexOf(e.to); }
    if (e.k === 'f') { e.from = Math.max.apply(null, a); e.to = Math.min.apply(null, V.slice(e.i, Math.min(N, e.i + 7))); }
  });

  /* ---------- I. the sentence turns ---------- */
  var flip = document.getElementById('flip'), flipPin = flip.querySelector('.flip__pin');
  function frameFlip() { flipPin.style.setProperty('--f', reduce ? 1 : inout((prog(flip) - .15) / .55).toFixed(3)); }

  /* ---------- II. move the world ---------- */
  var dial = document.getElementById('dial'), world = document.getElementById('world');
  var dPrice = document.getElementById('dPrice'), dNo = document.getElementById('dNo'), dSay = document.getElementById('dSay');
  function frameDial() {
    var v = +world.value, price = Math.round(18 + Math.pow(v / 100, 1.5) * 112), m = price - 30;
    dPrice.textContent = '$' + price;
    dNo.textContent = (m >= 0 ? '+$' : '−$') + Math.abs(m);
    dSay.textContent = price < 28 ? 'Trade flows. The cheapest barrel wins. Nobody needs the Arctic.'
      : price < 45 ? 'Trust thins. Norway breaks even.'
      : price < 90 ? 'Sanctions and blockades. Norwegian barrels become precious.'
      : 'The world breaks. Everyone needs the Arctic, whatever the cost.';
    dial.classList.toggle('is-hot', price >= 45);
    dial.style.background = 'rgba(215,38,46,' + (Math.max(0, v - 20) / 80 * .09).toFixed(3) + ')';
  }
  world.addEventListener('input', frameDial);
  frameDial();
  // a gentle nudge the first time the dial is seen, so people know it moves
  var nudged = false;
  new IntersectionObserver(function (es) {
    if (!es[0].isIntersecting || nudged || reduce) return; nudged = true;
    var t0 = performance.now();
    (function go(n) { var k = (n - t0) / 2600; if (k > 1 || world.dataset.touched) return; world.value = Math.round(8 + Math.sin(k * Math.PI) * 70); frameDial(); requestAnimationFrame(go); })(t0);
  }, { threshold: .5 }).observe(dial);
  world.addEventListener('pointerdown', function () { world.dataset.touched = 1; });

  /* ---------- III. the mirror ---------- */
  var mirror = document.getElementById('mirror'), mc = document.getElementById('mir'), M = setup(mc), mirOn = false;
  var mY = document.getElementById('mY'), mP = document.getElementById('mP'), mEv = document.getElementById('mEv');
  var mEvK = document.getElementById('mEvK'), mEvT = document.getElementById('mEvT'), mEvN = document.getElementById('mEvN'), barM = document.getElementById('barM');
  var lastE = -2, t = 0;
  function frameMirror() {
    var c = M.c, w = M.w, h = M.h, narrow = w < 860, p = prog(mirror);
    var PAN = .84, q = clamp(p / PAN, 0, 1), z = inout((p - PAN) / .12);
    var win = (narrow ? 9 : 15) * 12, head = Math.round(q * (N - 1));
    var s0 = head - win * .7, e0 = s0 + win, s1 = -6, e1 = N + 6;
    var s = s0 + (s1 - s0) * z, e = e0 + (e1 - e0) * z;
    var L = narrow ? 14 : 40, R = narrow ? 14 : 40, h0 = Math.round(h * .54);
    var A = Math.min(h0 - (narrow ? 210 : 180), h - h0 - (narrow ? 190 : 120)) * (1 - z * .25);
    var X = function (i) { return L + (i - s) / (e - s) * (w - L - R); };
    var Up = function (v) { return h0 - v / MAXV * A; }, Dn = function (v) { return h0 + v / MAXV * A; };
    mirror.classList.toggle('done', z > .6);
    c.clearRect(0, 0, w, h);
    var i0 = Math.max(0, Math.floor(s)), i1 = Math.min(N - 1, z > 0 ? N - 1 : head);

    // Norway before oil
    var n0 = idx(1971, 6);
    if (X(n0) > L && z < .5) {
      c.fillStyle = 'rgba(11,16,20,.035)'; c.fillRect(L, h0 - A - 20, Math.min(X(n0), w - R) - L, A + 20);
      c.font = '400 10px "IBM Plex Mono", monospace'; c.fillStyle = MIST;
      c.fillText('NORWAY HAS NO OIL YET', Math.max(L + 6, Math.min(X(n0), w - R) - 170), h0 - 12);
    }
    // Norway's cost line
    c.setLineDash([3, 5]); c.strokeStyle = INK; c.globalAlpha = .35; c.lineWidth = 1;
    c.beginPath(); c.moveTo(L, Up(30)); c.lineTo(w - R, Up(30)); c.stroke(); c.setLineDash([]);
    c.globalAlpha = .7; c.font = '400 10px "IBM Plex Mono", monospace'; c.fillStyle = INK;
    c.fillText('$30 · NORWAY’S COST PER BARREL', w - R - 210, Up(30) - 7); c.globalAlpha = 1;

    if (i1 > i0) {
      // above: the Arctic gains
      c.beginPath(); c.moveTo(X(i0), h0);
      for (var i = i0; i <= i1; i++) c.lineTo(X(i), Up(V[i]));
      c.lineTo(X(i1), h0); c.closePath(); c.fillStyle = 'rgba(11,16,20,.07)'; c.fill();
      c.beginPath(); for (i = i0; i <= i1; i++) { i === i0 ? c.moveTo(X(i), Up(V[i])) : c.lineTo(X(i), Up(V[i])); }
      c.strokeStyle = INK; c.lineWidth = 1.6; c.stroke();
      // below: the world breaks
      c.beginPath(); c.moveTo(X(i0), h0);
      for (i = i0; i <= i1; i++) c.lineTo(X(i), Dn(V[i]));
      c.lineTo(X(i1), h0); c.closePath(); c.fillStyle = 'rgba(215,38,46,.10)'; c.fill();
      c.beginPath(); for (i = i0; i <= i1; i++) { i === i0 ? c.moveTo(X(i), Dn(V[i])) : c.lineTo(X(i), Dn(V[i])); }
      c.strokeStyle = RED; c.lineWidth = 1.3; c.stroke();
    }
    // the Arctic Circle
    c.strokeStyle = INK; c.lineWidth = 1; c.beginPath(); c.moveTo(0, h0); c.lineTo(w, h0); c.stroke();
    // years on the circle
    c.fillStyle = MIST; c.font = '400 10px "IBM Plex Mono", monospace';
    var step = z > .4 ? 10 : (narrow ? 2 : 1);
    for (var y = 1947; y <= 2026; y++) {
      var xi = X(idx(y, 1)); if (xi < L - 2 || xi > w - R + 2) continue;
      c.globalAlpha = .5; c.fillRect(xi, h0 - 3, 1, 6);
      if (y % step === 0) { c.globalAlpha = .8; c.fillText(String(y), xi + 4, h0 + 14); }
    }
    c.globalAlpha = 1;
    // events
    var cur = -1;
    EV.forEach(function (ev, k) {
      if (ev.i > i1) return; cur = k;
      var x = X(ev.i); if (x < L - 40 || x > w - R + 40) return;
      var col = ev.k === 'b' ? RED : ev.k === 'f' ? '#2b7fb8' : INK, deep = ev.to != null ? Dn(Math.max(ev.to, ev.from)) : h0 + 40;
      c.strokeStyle = col; c.globalAlpha = z > .4 ? .35 : .8; c.lineWidth = 1;
      c.beginPath(); c.moveTo(x, h0); c.lineTo(x, z > .4 ? h0 + 14 : Math.max(deep + 18, h0 + 60)); c.stroke();
      if (z < .4) {
        c.globalAlpha = 1; c.fillStyle = col; c.font = '400 10px "IBM Plex Mono", monospace';
        var lab = (MONTHS[ev.m - 1] + ' ' + ev.y).toUpperCase(), ly = Math.max(deep + 32, h0 + 74);
        c.fillText(lab, x + 6, ly);
        if (ev.k === 'b' && ev.pk <= i1) {
          var px = X(ev.pk), py = Up(ev.to);
          c.fillStyle = INK; c.font = '300 15px "Inter Tight", sans-serif'; c.fillText('$' + ev.to, px + 6, py - 6);
        }
      }
      c.globalAlpha = 1;
    });
    // the head
    if (z < .05) {
      var hx = X(head);
      [[Up(V[head]), INK], [Dn(V[head]), RED]].forEach(function (d) {
        c.fillStyle = d[1]; c.beginPath(); c.arc(hx, d[0], 3.5, 0, 6.283); c.fill();
        c.globalAlpha = .18; c.beginPath(); c.arc(hx, d[0], 10 + Math.sin(t * 3) * 2, 0, 6.283); c.fill(); c.globalAlpha = 1;
      });
    }
    mY.textContent = z > .5 ? '1947—2026' : String(yearOf(head));
    mP.textContent = '$' + V[head];
    if (cur !== lastE) {
      lastE = cur; var ev = EV[cur];
      mEv.classList.remove('pop'); void mEv.offsetWidth; mEv.classList.add('pop');
      mEv.classList.toggle('flow', !!ev && ev.k === 'f');
      if (!ev) { mEvK.textContent = '1947 · Calm'; mEvT.textContent = 'A world that trades. Nobody needs the Arctic.'; mEvN.textContent = ''; barM.textContent = '66°33′N'; }
      else {
        mEvK.textContent = MONTHS[ev.m - 1] + ' ' + ev.y + (ev.k === 'b' ? ' · The world breaks' : ev.k === 'f' ? ' · The world flows' : ' · The Arctic opens');
        mEvT.textContent = ev.t;
        mEvN.textContent = ev.from != null ? ('Real price $' + ev.from + ' → $' + ev.to + (ev.k === 'b' ? ' within a year' : ' within months')) : (ev.s || '');
        barM.textContent = MONTHS[ev.m - 1] + ' ' + ev.y;
      }
    }
  }

  /* ---------- VI. the crystal ---------- */
  var cr = document.getElementById('crystal'), K = setup(cr), endOn = false;
  function frameCrystal() {
    var c = K.c, w = K.w, h = K.h, h0 = h * .36, A = h * .2, L = w * .06, R = w * .06;
    var X = function (i) { return L + i / (N - 1) * (w - L - R); };
    c.clearRect(0, 0, w, h);
    var br = .5 + .08 * Math.sin(t * .8);
    c.beginPath(); c.moveTo(X(0), h0); for (var i = 0; i < N; i++) c.lineTo(X(i), h0 - V[i] / MAXV * A); c.lineTo(X(N - 1), h0); c.closePath();
    c.fillStyle = 'rgba(243,245,246,' + (br * .12).toFixed(3) + ')'; c.fill();
    c.beginPath(); for (i = 0; i < N; i++) { var y = h0 - V[i] / MAXV * A; i ? c.lineTo(X(i), y) : c.moveTo(X(i), y); } c.strokeStyle = 'rgba(243,245,246,.55)'; c.lineWidth = 1; c.stroke();
    c.beginPath(); c.moveTo(X(0), h0); for (i = 0; i < N; i++) c.lineTo(X(i), h0 + V[i] / MAXV * A); c.lineTo(X(N - 1), h0); c.closePath();
    c.fillStyle = 'rgba(255,74,79,' + (br * .16).toFixed(3) + ')'; c.fill();
    c.beginPath(); for (i = 0; i < N; i++) { y = h0 + V[i] / MAXV * A; i ? c.lineTo(X(i), y) : c.moveTo(X(i), y); } c.strokeStyle = 'rgba(255,74,79,.55)'; c.stroke();
    c.strokeStyle = 'rgba(243,245,246,.5)'; c.beginPath(); c.moveTo(0, h0); c.lineTo(w, h0); c.stroke();
  }

  /* ---------- wiring ---------- */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.rv').forEach(function (n) { io.observe(n); });
  new IntersectionObserver(function (es) { mirOn = es[0].isIntersecting; if (!mirOn) barM.textContent = '66°33′N'; }).observe(mirror);
  new IntersectionObserver(function (es) { endOn = es[0].isIntersecting; }).observe(cr);
  addEventListener('scroll', frameFlip, { passive: true }); frameFlip();
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { M = setup(mc); K = setup(cr); }, 150); });
  (function loop() {
    if (!reduce) t += 1 / 60;
    if (mirOn) frameMirror();
    if (endOn) frameCrystal();
    requestAnimationFrame(loop);
  })();
})();
