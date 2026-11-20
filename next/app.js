/* FRONTTIER — Backstage of the frontier.
   One living border splits the screen: above it, the quiet backstage (paper);
   below it, the world out there (night). Text inverts itself on each side.
   The border moves to whichever territory you are looking at, and each
   territory draws its own small sign. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cv = document.getElementById('world'), c = cv.getContext('2d');
  var W = 0, H = 0, DPR = 1;
  var NIGHT = '#0d0e10';
  var hero = document.getElementById('hero'), out = document.getElementById('out');
  var rows = [].slice.call(document.querySelectorAll('.t'));
  var tagUp = document.getElementById('tagUp'), tagDown = document.getElementById('tagDown'), ratio = document.getElementById('ratio');
  var hover = null, base = null, amp = 40, t = 0;
  var fade = {}; rows.forEach(function (r) { fade[r.dataset.motif] = 0; });

  document.getElementById('year').textContent = new Date().getFullYear();

  function size() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * DPR; cv.height = H * DPR; c.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  size(); window.addEventListener('resize', size);

  rows.forEach(function (r) {
    var a = r.querySelector('a');
    a.addEventListener('mouseenter', function () { hover = r; });
    a.addEventListener('mouseleave', function () { if (hover === r) hover = null; });
    a.addEventListener('focus', function () { hover = r; });
    a.addEventListener('blur', function () { if (hover === r) hover = null; });
  });

  function nameMid(r) { var b = r.querySelector('.t__name').getBoundingClientRect(); return b.top + Math.min(b.height, 120) * 0.55; }

  // where the border wants to be, and which territory is active
  function aim() {
    if (hover) return { y: nameMid(hover), a: 12, row: hover };
    var o = out.getBoundingClientRect();
    if (o.top < H * 0.55) return { y: -80, a: 30, row: null };
    var best = null, bd = 1e9;
    rows.forEach(function (r) {
      var y = nameMid(r), d = Math.abs(y - H * 0.5);
      if (d < bd) { bd = d; best = r; }
    });
    if (best && bd < H * 0.32) return { y: nameMid(best), a: 12, row: best };
    var hb = hero.getBoundingClientRect();
    return { y: hb.top + hb.height * 0.76, a: 46, row: null };
  }

  function borderY(x) {
    return base + amp * (Math.sin(x * 0.0041 + t * 0.35) * 0.62 + Math.sin(x * 0.0113 - t * 0.6) * 0.28 + Math.sin(x * 0.027 + t * 1.2) * 0.1);
  }

  /* ---------- the signs of each territory ---------- */
  var M = {
    vcc: function (bx, f) { // three cohorts: 25 · 44 · 30
      var co = [25, 44, 30], gx = bx.x, s = Math.max(5, Math.min(9, bx.w / 70)), gap = s * 1.9, cols = 5;
      for (var k = 0; k < 3; k++) {
        var n = co[k], rowsN = Math.ceil(n / cols), w = cols * gap, h = rowsN * gap;
        var ox = gx + k * (w + gap * 1.6), oy = bx.y + (bx.h - h) / 2;
        for (var i = 0; i < n; i++) {
          var a = (0.55 + 0.45 * Math.sin(t * 2 + i * 0.7 + k)) * f;
          c.globalAlpha = a; c.fillRect(ox + (i % cols) * gap, oy + Math.floor(i / cols) * gap, s, s);
        }
      }
    },
    hot: function (bx, f) { // thoughts widening
      var cx = bx.x + bx.w * 0.45, cy = bx.y + bx.h / 2, R = Math.min(bx.w, bx.h) * 0.55;
      for (var i = 0; i < 7; i++) {
        var p = ((t * 0.12 + i / 7) % 1), r = p * R;
        c.globalAlpha = (1 - p) * f; c.lineWidth = 1.2;
        c.beginPath(); c.arc(cx, cy, r, 0, 6.283); c.stroke();
      }
      c.globalAlpha = f; c.beginPath(); c.arc(cx, cy, 3, 0, 6.283); c.fill();
    },
    eur: function (bx, f) { // a border that keeps redrawing itself
      var cx = bx.x + bx.w * 0.45, cy = bx.y + bx.h / 2, R = Math.min(bx.w, bx.h) * 0.36;
      for (var k = 0; k < 3; k++) {
        c.globalAlpha = f * (k === 0 ? 1 : 0.35); c.lineWidth = k === 0 ? 1.4 : 1;
        c.beginPath();
        for (var i = 0; i <= 120; i++) {
          var th = i / 120 * 6.283, tt = t - k * 0.9;
          var r = R * (1 + 0.22 * Math.sin(3 * th + tt * 0.8) + 0.12 * Math.sin(5 * th - tt * 1.3) + 0.06 * Math.sin(11 * th + tt));
          var x = cx + Math.cos(th) * r * 1.25, y = cy + Math.sin(th) * r;
          i ? c.lineTo(x, y) : c.moveTo(x, y);
        }
        c.closePath(); c.stroke();
      }
    },
    ocean: function (bx, f) { // swell
      c.lineWidth = 1.2;
      for (var k = 0; k < 9; k++) {
        var y0 = bx.y + bx.h * (0.18 + k * 0.08);
        c.globalAlpha = f * (0.35 + 0.65 * (1 - k / 9));
        c.beginPath();
        for (var x = 0; x <= bx.w; x += 6) {
          var y = y0 + Math.sin(x * 0.02 + t * 1.4 - k * 0.6) * (6 + k * 1.2) + Math.sin(x * 0.007 - t * 0.5) * 8;
          x ? c.lineTo(bx.x + x, y) : c.moveTo(bx.x + x, y);
        }
        c.stroke();
      }
    },
    pulse: function (bx, f) { // a heartbeat, moving
      var y0 = bx.y + bx.h / 2, per = 170, off = (t * 90) % per;
      c.lineWidth = 1.6; c.globalAlpha = f; c.beginPath();
      for (var x = 0; x <= bx.w; x += 2) {
        var u = (x + off) % per, y = y0;
        if (u > 60 && u < 70) y = y0 - (u - 60) * 2;
        else if (u >= 70 && u < 78) y = y0 - 20 + (u - 70) * 9;
        else if (u >= 78 && u < 86) y = y0 + 52 - (u - 78) * 9;
        else if (u >= 86 && u < 92) y = y0 - 20 + (u - 86) * 3.3;
        else if (u > 110 && u < 130) y = y0 - Math.sin((u - 110) / 20 * Math.PI) * 10;
        x ? c.lineTo(bx.x + x, y) : c.moveTo(bx.x + x, y);
      }
      c.stroke();
      c.globalAlpha = f * 0.25; c.lineWidth = 1;
      c.beginPath(); c.moveTo(bx.x, y0 + 70); c.lineTo(bx.x + bx.w, y0 + 70); c.stroke();
    }
  };

  function box(r) {
    var b = r.querySelector('a').getBoundingClientRect();
    return { x: b.left + b.width * 0.72, y: b.top + b.height * 0.18, w: b.width * 0.28, h: b.height * 0.64 };
  }

  function frame() {
    if (!reduce) t += 1 / 60;
    var A = aim();
    if (base === null) base = A.y;
    base += (A.y - base) * 0.085;
    amp += (A.a - amp) * 0.06;
    c.clearRect(0, 0, W, H);

    // the world below the border
    c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; c.fillStyle = NIGHT;
    c.beginPath(); c.moveTo(0, H + 2); c.lineTo(0, borderY(0));
    for (var x = 0; x <= W + 8; x += 8) c.lineTo(x, borderY(x));
    c.lineTo(W, H + 2); c.closePath(); c.fill();

    // the territory's sign, inverting whatever it sits on
    if (W > 760) {
      c.globalCompositeOperation = 'difference'; c.fillStyle = '#fff'; c.strokeStyle = '#fff';
      rows.forEach(function (r) {
        var k = r.dataset.motif, on = A.row === r;
        r.classList.toggle('is-on', on);
        fade[k] += ((on ? 1 : 0) - fade[k]) * 0.08;
        if (fade[k] > 0.02) M[k](box(r), fade[k]);
      });
      c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    }

    // labels riding the border
    var yl = borderY(56), yr = borderY(W - 56);
    tagUp.style.transform = 'translateY(' + (yl - 26) + 'px)';
    tagDown.style.transform = 'translateY(' + (yr + 12) + 'px)';
    var vis = base > 40 && base < H - 30 ? '.7' : '0';
    tagUp.style.opacity = vis; tagDown.style.opacity = vis;

    var up = Math.max(0, Math.min(1, base / H)), pu = Math.round(up * 100);
    ratio.textContent = 'Backstage ' + pu + '% · Out there ' + (100 - pu) + '%';

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
