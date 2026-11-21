/* Arcticonomics — the ridge is the oil price.
   Eighty years of WTI in real dollars, drawn as an Arctic skyline at night.
   Scroll the proof: every amber line is the world breaking, every blue line the world flowing. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ICE = '#eef3f5', AMBER = '#ffb21e', FLOW = '#7fd4ff', MIST = '#7d8891';
  var D = window.OIL, N = D.real.length;
  var NOM = D.nominal10.map(function (v) { return v / 10; });
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (x) { x = clamp(x, 0, 1); return 1 - Math.pow(1 - x, 3); };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function idx(y, m) { return (y - D.start[0]) * 12 + (m - D.start[1]); }
  function label(i) { return MONTHS[i % 12] + ' ' + (D.start[0] + Math.floor(i / 12)); }
  function setup(cv) {
    var DPR = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight, c = cv.getContext('2d');
    cv.width = w * DPR; cv.height = h * DPR; c.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { c: c, w: w, h: h };
  }
  // light smoothing so the ridge reads as terrain, not noise
  function smooth(a, k) { return a.map(function (_, i) { var s = 0, n = 0; for (var j = -k; j <= k; j++) { var v = a[i + j]; if (v != null) { s += v; n++; } } return s / n; }); }
  var RS = smooth(D.real, 2);

  /* ---------- events ---------- */
  var EV = [
    { y: 1971, m: 6, k: 'n', t: 'Norway starts pumping', s: 'Ekofisk, North Sea' },
    { y: 1973, m: 10, k: 'b', t: 'Arab–Israeli war and the oil embargo' },
    { y: 1979, m: 1, k: 'b', t: 'Iranian revolution' },
    { y: 1980, m: 9, k: 'b', t: 'Iran–Iraq war' },
    { y: 1986, m: 1, k: 'f', t: 'OPEC price war: everyone pumps' },
    { y: 1990, m: 8, k: 'b', t: 'Iraq invades Kuwait' },
    { y: 2003, m: 3, k: 'b', t: 'Venezuela strike and the US invasion of Iraq' },
    { y: 2006, m: 7, k: 'b', t: 'Israel–Hezbollah war and sanctions on Iran' },
    { y: 2008, m: 6, k: 'b', t: 'Insurgency in Nigeria’s oil delta' },
    { y: 2011, m: 2, k: 'b', t: 'Libyan civil war' },
    { y: 2012, m: 7, k: 'b', t: 'EU embargo on Iranian oil' },
    { y: 2014, m: 11, k: 'f', t: 'OPEC refuses to cut: everyone pumps' },
    { y: 2019, m: 1, k: 'b', t: 'Sanctions on Venezuela' },
    { y: 2020, m: 4, k: 'f', t: 'Saudi–Russia price war, the world stops' },
    { y: 2022, m: 2, k: 'b', t: 'Russia invades Ukraine' },
    { y: 2026, m: 2, k: 'b', t: 'US–Israel war on Iran. The Strait of Hormuz closes.', s: '28 February 2026' }
  ];
  EV.forEach(function (e) {
    e.i = idx(e.y, e.m);
    var a = D.real.slice(Math.max(0, e.i - 4), e.i + 1), b = D.real.slice(e.i, Math.min(N, e.i + 13));
    if (e.k === 'b') { e.from = Math.min.apply(null, a); e.to = Math.max.apply(null, b); }
    if (e.k === 'f') { e.from = Math.max.apply(null, a); e.to = Math.min.apply(null, D.real.slice(e.i, Math.min(N, e.i + 7))); }
  });

  /* ---------- 0. the ridge ---------- */
  var ridge = document.getElementById('ridge'), R = setup(ridge), stars = [], t = 0, ridgeOn = true;
  function makeStars(o) { var s = []; for (var i = 0; i < 160; i++) s.push([Math.random() * o.w, Math.random() * o.h * .62, Math.random() * 1.2 + .2, Math.random() * 6]); return s; }
  stars = makeStars(R);
  function drawRidge(o, st, opt) {
    var c = o.c, w = o.w, h = o.h, base = h * (opt.base || .98), top = h * (opt.top || .46);
    c.clearRect(0, 0, w, h);
    st.forEach(function (s) { c.globalAlpha = .25 + .35 * Math.sin(t * .7 + s[3]); c.fillStyle = ICE; c.fillRect(s[0], s[1], s[2], s[2]); });
    c.globalAlpha = 1;
    var max = 210, X = function (i) { return i / (N - 1) * w; }, Y = function (v) { return base - (v / max) * (base - top); };
    // layered ridges: far (faint, offset) to near
    [[.35, 18, .06], [.6, 9, .1], [1, 0, .16]].forEach(function (L, li) {
      var sh = L[1], a = L[2];
      c.beginPath(); c.moveTo(0, h);
      for (var i = 0; i < N; i += 2) c.lineTo(X(i), Y(RS[Math.max(0, i - sh * 6)] * (li === 2 ? 1 : .78 + li * .1)) + (2 - li) * 30);
      c.lineTo(w, h); c.closePath();
      var g = c.createLinearGradient(0, top, 0, h);
      g.addColorStop(0, 'rgba(238,243,245,' + (a + .06) + ')'); g.addColorStop(1, 'rgba(238,243,245,0)');
      c.fillStyle = g; c.fill();
    });
    // the crest line, with a slow polar light running along it
    c.lineWidth = 1.2; c.strokeStyle = ICE; c.globalAlpha = .9; c.beginPath();
    for (var i = 0; i < N; i++) { var x = X(i), y = Y(RS[i]); i ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.stroke();
    var sweep = ((t * .06) % 1.3) - .15, sx = sweep * w;
    var g2 = c.createRadialGradient(sx, Y(RS[clamp(Math.round(sweep * (N - 1)), 0, N - 1)]), 0, sx, h * .7, w * .25);
    g2.addColorStop(0, 'rgba(255,178,30,.10)'); g2.addColorStop(1, 'rgba(255,178,30,0)');
    c.globalAlpha = 1; c.fillStyle = g2; c.fillRect(0, 0, w, h);
    if (opt.marks) EV.forEach(function (e) { if (e.k !== 'b') return; var x = X(e.i); c.strokeStyle = AMBER; c.globalAlpha = .35; c.lineWidth = 1; c.beginPath(); c.moveTo(x, Y(RS[e.i]) - 8); c.lineTo(x, Y(RS[e.i]) - 26); c.stroke(); });
    c.globalAlpha = 1;
  }

  /* ---------- 1. the law ---------- */
  var law = document.getElementById('law'), mk = document.getElementById('mk'), gap = document.getElementById('gap');
  var mkV = document.getElementById('mkV'), outV = document.getElementById('outV'), outL = document.getElementById('outL');
  var SC = 150, auto = true, world = 'peace', lawTimer = null;
  function setWorld(wd) {
    world = wd; var p = wd === 'peace' ? 20 : 110;
    law.classList.toggle('is-break', wd === 'break');
    law.querySelectorAll('.switch button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.w === wd)); });
    mk.style.left = (p / SC * 100) + '%';
    var a = Math.min(p, 30), b = Math.max(p, 30);
    gap.style.left = (a / SC * 100) + '%'; gap.style.width = ((b - a) / SC * 100) + '%';
    var from = parseInt(outV.textContent.replace(/[^\d-]/g, ''), 10) || 0, to = p - 30, t0 = performance.now();
    mkV.textContent = '$' + p;
    (function anim(n) { var k = reduce ? 1 : ease((n - t0) / 1100), v = Math.round(from + (to - from) * k); outV.textContent = (v >= 0 ? '+$' : '−$') + Math.abs(v); if (k < 1) requestAnimationFrame(anim); })(t0);
    outL.textContent = wd === 'peace' ? 'per Norwegian barrel. Nobody needs it.' : 'per Norwegian barrel. Everyone needs it.';
  }
  law.querySelectorAll('.switch button').forEach(function (b) { b.addEventListener('click', function () { auto = false; clearInterval(lawTimer); setWorld(b.dataset.w); }); });
  setWorld('peace');

  /* ---------- 2. the proof ---------- */
  var proof = document.getElementById('proof'), cv = document.getElementById('chart'), C = setup(cv), proofOn = false;
  var nowY = document.getElementById('nowY'), nowP = document.getElementById('nowP'), nowU = document.getElementById('nowU');
  var ev = document.getElementById('ev'), evK = document.getElementById('evK'), evT = document.getElementById('evT'), evN = document.getElementById('evN');
  var barM = document.getElementById('barM');
  var view = 'real', mix = 1, lastEv = -2;
  document.querySelectorAll('.tog button').forEach(function (b) {
    b.addEventListener('click', function () { view = b.dataset.v; document.querySelectorAll('.tog button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); });
  });
  function series(i) { return NOM[i] + (D.real[i] - NOM[i]) * mix; }
  function frameProof() {
    var r = proof.getBoundingClientRect(), p = clamp(-r.top / (proof.offsetHeight - innerHeight), 0, 1);
    mix += ((view === 'real' ? 1 : 0) - mix) * (reduce ? 1 : .08);
    var end = Math.max(1, Math.round(ease(p / .97) * (N - 1)));
    var c = C.c, w = C.w, h = C.h, narrow = w < 860;
    var L = narrow ? 18 : 56, Rr = narrow ? 18 : 56, T = h * (narrow ? .36 : .42), B = h - (narrow ? 210 : 70);
    var max = 215, X = function (i) { return L + i / (N - 1) * (w - L - Rr); }, Y = function (v) { return B - v / max * (B - T); };
    c.clearRect(0, 0, w, h);
    // grid
    c.font = '400 10px "IBM Plex Mono", monospace'; c.fillStyle = MIST; c.strokeStyle = 'rgba(238,243,245,.07)'; c.lineWidth = 1;
    [50, 100, 150, 200].forEach(function (v) { c.beginPath(); c.moveTo(L, Y(v)); c.lineTo(w - Rr, Y(v)); c.stroke(); c.globalAlpha = .7; c.fillText('$' + v, w - Rr - 30, Y(v) - 6); c.globalAlpha = 1; });
    for (var y = 1950; y <= 2020; y += 10) { var xi = X(idx(y, 1)); c.globalAlpha = .55; c.fillText(String(y), xi - 14, B + 18); c.globalAlpha = 1; }
    // Norway's cost line
    var y30 = Y(30);
    c.setLineDash([3, 5]); c.strokeStyle = ICE; c.globalAlpha = .5; c.beginPath(); c.moveTo(L, y30); c.lineTo(w - Rr, y30); c.stroke(); c.setLineDash([]);
    c.globalAlpha = .8; c.fillStyle = ICE; c.fillText('$30 · cost of a Norwegian barrel', L, y30 + 16); c.globalAlpha = 1;
    // Norway's margin, from 1971
    var n0 = idx(1971, 6);
    if (end > n0) {
      c.beginPath(); c.moveTo(X(n0), y30);
      for (var i = n0; i <= end; i++) c.lineTo(X(i), Math.min(y30, Y(series(i))));
      c.lineTo(X(end), y30); c.closePath();
      c.fillStyle = 'rgba(238,243,245,.13)'; c.fill();
    }
    // events reached so far
    var cur = -1;
    EV.forEach(function (e, k) {
      if (e.i > end) return; cur = k;
      var x = X(e.i), col = e.k === 'b' ? AMBER : e.k === 'f' ? FLOW : ICE;
      c.strokeStyle = col; c.globalAlpha = e.k === 'n' ? .45 : .7; c.lineWidth = 1;
      c.beginPath(); c.moveTo(x, T - 10); c.lineTo(x, B); c.stroke();
      c.globalAlpha = 1;
    });
    // the line
    c.strokeStyle = ICE; c.lineWidth = 1.6; c.beginPath();
    for (var j = 0; j <= end; j++) { var xx = X(j), yy = Y(series(j)); j ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
    c.stroke();
    // head
    var hx = X(end), hy = Y(series(end));
    c.fillStyle = ICE; c.beginPath(); c.arc(hx, hy, 3.5, 0, 6.283); c.fill();
    c.globalAlpha = .25; c.beginPath(); c.arc(hx, hy, 9 + Math.sin(t * 3) * 2, 0, 6.283); c.fill(); c.globalAlpha = 1;
    // readouts
    nowY.textContent = label(end).split(' ')[1];
    nowP.textContent = '$' + Math.round(series(end));
    nowU.textContent = mix > .5 ? ', in October 2026 dollars' : ', in the dollars of the day';
    if (cur !== lastEv) {
      lastEv = cur;
      var e = EV[cur];
      ev.classList.remove('flip'); void ev.offsetWidth; ev.classList.add('flip');
      ev.classList.toggle('is-flow', !!e && e.k === 'f'); ev.classList.toggle('is-neutral', !!e && e.k === 'n');
      if (!e) { evK.textContent = 'Scroll through eighty years'; evT.textContent = 'Calm. Cheap. Nobody needs the Arctic.'; evN.textContent = ''; }
      else {
        evK.textContent = label(e.i) + (e.k === 'b' ? ' · The world breaks' : e.k === 'f' ? ' · The world flows' : ' · The Arctic opens');
        evT.textContent = e.t;
        evN.textContent = e.from != null ? ('Real price $' + e.from + ' → $' + e.to + (e.k === 'b' ? ' within a year' : ' within months')) : (e.s || '');
      }
      barM.textContent = e ? label(e.i) : 'A FRONTTIER theory';
    }
  }

  /* ---------- reveal, counters, crust ---------- */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) {
    if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
    var v = e.target.querySelector && e.target.querySelector('[data-count]');
    if (v && !reduce) { var to = +v.dataset.count, dec = to % 1 ? 1 : 0, t0 = performance.now();
      (function go(n) { var k = ease((n - t0) / 1600); v.textContent = v.dataset.pre + (to * k).toFixed(dec) + v.dataset.suf; if (k < 1) requestAnimationFrame(go); })(t0); }
  }); }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.rv, #crust').forEach(function (n) { io.observe(n); });

  /* ---------- end ridge ---------- */
  var er = document.getElementById('endRidge'), E = setup(er), estars = makeStars(E), endOn = false;

  /* ---------- loop ---------- */
  new IntersectionObserver(function (es) { ridgeOn = es[0].isIntersecting; }).observe(ridge);
  new IntersectionObserver(function (es) { proofOn = es[0].isIntersecting; if (!proofOn) barM.textContent = 'A FRONTTIER theory'; }).observe(proof);
  new IntersectionObserver(function (es) { endOn = es[0].isIntersecting; }).observe(er);
  new IntersectionObserver(function (es) {
    if (es[0].isIntersecting && auto && !lawTimer && !reduce) lawTimer = setInterval(function () { if (auto) setWorld(world === 'peace' ? 'break' : 'peace'); }, 3600);
  }, { threshold: .4 }).observe(law);
  var hint = document.getElementById('hint');
  addEventListener('scroll', function () { hint.style.opacity = scrollY > 40 ? 0 : .75; }, { passive: true });
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { R = setup(ridge); stars = makeStars(R); C = setup(cv); E = setup(er); estars = makeStars(E); }, 150); });
  (function loop() {
    if (!reduce) t += 1 / 60;
    if (ridgeOn) drawRidge(R, stars, { base: .99, top: .5, marks: true });
    if (proofOn) frameProof();
    if (endOn) drawRidge(E, estars, { base: 1.02, top: .62 });
    requestAnimationFrame(loop);
  })();
})();
