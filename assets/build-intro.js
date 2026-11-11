/* Homepage intro: a few agent cursors assemble the hero, then leave.
   Once per tab (sessionStorage). Skipped for reduced motion, deep links,
   and a restored scroll position. Replay with ?intro=1. */
(function () {
  'use strict';

  var KEY = 'quavok-agent-intro';
  var INK = '#0b1220';
  var GREEN = '#15803d';
  var BLUE = '#2563eb';
  var SVG = 'http://www.w3.org/2000/svg';

  function reduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function replayRequested() {
    try {
      return new URLSearchParams(window.location.search).get('intro') === '1';
    } catch (e) {
      return false;
    }
  }

  function alreadySeen() {
    if (replayRequested()) return false;
    try {
      return sessionStorage.getItem(KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function markSeen() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  }

  if (reduced() || alreadySeen()) return;

  function whenReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  whenReady(function () {
    var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var cap = new Promise(function (resolve) { setTimeout(resolve, 600); });
    Promise.race([fonts.catch(function () {}), cap]).then(function () {
      requestAnimationFrame(function () { requestAnimationFrame(start); });
    });
  });

  function clamp01(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }

  function seg(t, a, b) {
    if (t <= a) return 0;
    if (t >= b) return 1;
    return (t - a) / (b - a);
  }

  function lerp(a, b, u) { return a + (b - a) * u; }

  function lerpPt(a, b, u) {
    return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) };
  }

  function easeInOut(u) {
    return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  }

  function easeOut(u) { return 1 - Math.pow(1 - u, 3); }

  function easeSnap(u) {
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    if (u < 0.72) return easeOut(u / 0.72) * 1.06;
    return lerp(1.06, 1, easeOut((u - 0.72) / 0.28));
  }

  function windowOp(t, in0, in1, out0, out1) {
    if (t <= in0 || t >= out1) return 0;
    if (t < in1) return (t - in0) / (in1 - in0);
    if (t > out0) return 1 - (t - out0) / (out1 - out0);
    return 1;
  }

  function fade(t, inEnd, outStart, outEnd) {
    if (t <= 0) return 0;
    if (t < inEnd) return easeOut(t / inEnd);
    if (t < outStart) return 1;
    if (t >= outEnd) return 0;
    return 1 - easeInOut((t - outStart) / (outEnd - outStart));
  }

  function pulse(t, a, b) {
    var u = seg(t, a, b);
    if (u <= 0 || u >= 1) return 0;
    if (u < 0.22) return u / 0.22;
    if (u > 0.68) return (1 - u) / 0.32;
    return 1;
  }

  function hold(pt, t, amp) {
    return {
      x: pt.x + Math.sin(t * 2.3) * amp,
      y: pt.y + Math.cos(t * 1.7) * amp * 0.65
    };
  }

  function boxOf(r, pad) {
    return {
      x: r.left - pad,
      y: r.top - pad,
      w: r.width + pad * 2,
      h: r.height + pad * 2
    };
  }

  function baseRect(el) {
    var r = el.getBoundingClientRect();
    var tr = window.getComputedStyle(el).transform;
    var tx = 0;
    var ty = 0;
    if (tr && tr !== 'none') {
      var raw = tr.slice(tr.indexOf('(') + 1, -1).split(',');
      if (tr.indexOf('matrix3d') === 0) {
        tx = parseFloat(raw[12]) || 0;
        ty = parseFloat(raw[13]) || 0;
      } else {
        tx = parseFloat(raw[4]) || 0;
        ty = parseFloat(raw[5]) || 0;
      }
    }
    return { left: r.left - tx, top: r.top - ty, width: r.width, height: r.height };
  }

  function shown(el, min) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return false;
    var top = Math.max(r.top, 0);
    var bot = Math.min(r.bottom, window.innerHeight);
    var left = Math.max(r.left, 0);
    var right = Math.min(r.right, window.innerWidth);
    var area = Math.max(0, bot - top) * Math.max(0, right - left);
    return area / (r.width * r.height) >= min;
  }

  function seTL(box, u) {
    return { x: box.x + box.w * u, y: box.y + box.h * u };
  }

  function seC(box, s) {
    return {
      x: box.x + box.w / 2 + (box.w / 2) * s,
      y: box.y + box.h / 2 + (box.h / 2) * s
    };
  }

  function cornersTL(box, u) {
    var w = box.w * u;
    var h = box.h * u;
    return [
      { k: 'nw', x: box.x, y: box.y },
      { k: 'ne', x: box.x + w, y: box.y },
      { k: 'sw', x: box.x, y: box.y + h },
      { k: 'se', x: box.x + w, y: box.y + h }
    ];
  }

  function cornersC(box, s) {
    var cx = box.x + box.w / 2;
    var cy = box.y + box.h / 2;
    var hw = (box.w / 2) * s;
    var hh = (box.h / 2) * s;
    return [
      { k: 'nw', x: cx - hw, y: cy - hh },
      { k: 'ne', x: cx + hw, y: cy - hh },
      { k: 'sw', x: cx - hw, y: cy + hh },
      { k: 'se', x: cx + hw, y: cy + hh }
    ];
  }

  function makeCursor(name, color) {
    var el = document.createElement('div');
    el.className = 'qa-cursor';
    el.style.setProperty('--qa', color);
    var svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', '0 0 17 20');
    svg.setAttribute('width', '17');
    svg.setAttribute('height', '20');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS(SVG, 'path');
    path.setAttribute('d', 'M.75.55.75 15.5 5.15 11.85 8.45 18.7 10.95 17.45 7.6 10.65 14.05 10.65Z');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('stroke', '#fff');
    path.setAttribute('stroke-width', '1.15');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    var tag = document.createElement('span');
    tag.className = 'qa-tag';
    tag.textContent = name;
    el.appendChild(svg);
    el.appendChild(tag);
    return el;
  }

  function makeBox(color, frame) {
    var el = document.createElement('div');
    el.className = frame ? 'qa-box qa-frame' : 'qa-box';
    el.style.setProperty('--qa', color);
    el.style.opacity = '0';
    return el;
  }

  function makeHandles(color) {
    var keys = ['nw', 'ne', 'sw', 'se'];
    var group = [];
    for (var i = 0; i < 4; i++) {
      var h = document.createElement('div');
      h.className = 'qa-handle';
      h.dataset.k = keys[i];
      h.style.setProperty('--qa', color);
      h.style.opacity = '0';
      group.push(h);
    }
    return group;
  }

  function placeBox(el, box, u, op) {
    var s = Math.max(u, 0.001);
    el.style.width = box.w + 'px';
    el.style.height = box.h + 'px';
    el.style.opacity = String(op > 0.01 ? op : 0);
    el.style.borderWidth = (1.5 / Math.max(u, 0.45)) + 'px';
    el.style.transformOrigin = '0 0';
    el.style.transform = 'translate3d(' + box.x.toFixed(2) + 'px,' + box.y.toFixed(2) + 'px,0) scale(' + s.toFixed(4) + ')';
  }

  function placeFrame(el, box, s, op) {
    var sc = Math.max(s, 0.001);
    el.style.width = box.w + 'px';
    el.style.height = box.h + 'px';
    el.style.opacity = String(op > 0.01 ? op : 0);
    el.style.borderWidth = (1.5 / Math.max(sc, 0.45)) + 'px';
    el.style.transformOrigin = '50% 50%';
    el.style.transform = 'translate3d(' + box.x.toFixed(2) + 'px,' + box.y.toFixed(2) + 'px,0) scale(' + sc.toFixed(4) + ')';
  }

  function placeHandles(group, corners, op, hot) {
    for (var i = 0; i < group.length; i++) {
      var h = group[i];
      var c = corners[i];
      h.style.opacity = String(op > 0.04 ? op : 0);
      h.classList.toggle('qa-hot', !!hot && c.k === hot && op > 0.4);
      h.style.transform = 'translate3d(' + (c.x - 4).toFixed(2) + 'px,' + (c.y - 4).toFixed(2) + 'px,0)';
    }
  }

  function placeCursor(el, x, y, op, opts) {
    opts = opts || {};
    var flip = opts.flip != null ? opts.flip : x > window.innerWidth - 156;
    var raise = opts.up ? false : y > window.innerHeight - 52;
    el.classList.toggle('qa-flip', flip);
    el.classList.toggle('qa-raise', raise);
    el.classList.toggle('qa-up', !!opts.up);
    var o = Math.max(0, Math.min(1, op));
    el.style.opacity = String(o);
    var sc = 0.94 + 0.06 * o;
    el.style.transform = 'translate3d(' + Math.round(x) + 'px,' + Math.round(y) + 'px,0) scale(' + sc.toFixed(3) + ')';
  }

  function measureLines(el) {
    var range = document.createRange();
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var lines = [];
    var node;
    while ((node = walker.nextNode())) {
      var text = node.textContent;
      for (var i = 0; i < text.length; i++) {
        if (/\s/.test(text.charAt(i))) continue;
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        var rects = range.getClientRects();
        if (!rects.length || rects[0].width < 0.4) continue;
        var r = rects[0];
        var last = lines.length ? lines[lines.length - 1] : null;
        if (!last || Math.abs(r.top - last.top) > 3) {
          lines.push({ top: r.top, left: r.left, right: r.right, bottom: r.bottom });
        } else {
          if (r.left < last.left) last.left = r.left;
          if (r.right > last.right) last.right = r.right;
          if (r.top < last.top) last.top = r.top;
          if (r.bottom > last.bottom) last.bottom = r.bottom;
        }
      }
    }
    var base = el.getBoundingClientRect();
    if (!lines.length) {
      var lh = parseFloat(window.getComputedStyle(el).lineHeight) || base.height || 40;
      var n = Math.max(1, Math.round(base.height / lh));
      var out = [];
      for (var j = 0; j < n; j++) {
        out.push({ x: 0, y: (base.height / n) * j, w: base.width, h: base.height / n });
      }
      return out;
    }
    return lines.map(function (ln) {
      return {
        x: ln.left - base.left,
        y: ln.top - base.top,
        w: Math.max(8, ln.right - ln.left),
        h: Math.max(8, ln.bottom - ln.top)
      };
    });
  }

  function start() {
    if (reduced()) return;
    if (window.location.hash || window.scrollY > 48) return;

    var h1 = document.querySelector('.hero h1');
    var column = document.querySelector('.hero .c > div:first-child');
    var ctas = document.querySelector('.hero .ctas');
    var hero = document.querySelector('.hero');
    var lead = document.querySelector('.hero .lead');
    var eyebrow = document.querySelector('.hero .eyebrow');
    var phone = document.querySelector('.hero .phone');
    var floatEl = document.querySelector('.hero .float.f1');
    var primary = document.querySelector('.hero .ctas a') || ctas;
    if (!h1 || !column || !ctas || !hero) return;

    var compact = window.matchMedia('(max-width: 960px)').matches
      || !shown(phone, 0.38)
      || !shown(floatEl, 0.45);
    var full = !compact;
    var dur = full ? 6.4 : 4.8;

    markSeen();

    var root = document.createElement('div');
    root.className = 'qa-intro';
    root.dataset.mode = full ? 'full' : 'compact';
    var fx = document.createElement('div');
    fx.className = 'qa-fx';
    fx.setAttribute('aria-hidden', 'true');
    root.appendChild(fx);

    var skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'qa-skip';
    skip.textContent = 'Skip';
    skip.setAttribute('aria-label', 'Skip intro');
    skip.setAttribute('aria-keyshortcuts', 'Escape');
    root.appendChild(skip);

    var selL = makeBox(INK, false);
    var selC = makeBox(GREEN, false);
    var selD = makeBox(BLUE, false);
    var frameEl = makeBox(BLUE, true);
    var ghost = document.createElement('div');
    ghost.className = 'qa-ghost';
    ghost.style.setProperty('--qa', INK);
    ghost.style.opacity = '0';
    var barA = document.createElement('i');
    var barB = document.createElement('i');
    barB.className = 's';
    ghost.appendChild(barA);
    ghost.appendChild(barB);
    var caret = document.createElement('div');
    caret.className = 'qa-caret';
    caret.style.opacity = '0';
    var guideH = document.createElement('div');
    guideH.className = 'qa-guide h';
    var guideV = document.createElement('div');
    guideV.className = 'qa-guide v';
    var handL = makeHandles(INK);
    var handD = makeHandles(BLUE);

    var lineCache = measureLines(h1);
    var lineW = h1.getBoundingClientRect().width;
    var hlEls = [];
    for (var i = 0; i < lineCache.length; i++) {
      var hl = document.createElement('div');
      hl.className = 'qa-hl';
      hl.style.opacity = '0';
      hlEls.push(hl);
      fx.appendChild(hl);
    }

    fx.appendChild(guideH);
    fx.appendChild(guideV);
    fx.appendChild(selL);
    fx.appendChild(selC);
    fx.appendChild(selD);
    fx.appendChild(frameEl);
    fx.appendChild(ghost);
    fx.appendChild(caret);
    handL.forEach(function (h) { fx.appendChild(h); });
    handD.forEach(function (h) { fx.appendChild(h); });

    var cursors = [makeCursor('Layout', INK), makeCursor('Copy', GREEN)];
    if (full) cursors.push(makeCursor('Design', BLUE));
    cursors.forEach(function (c) { fx.appendChild(c); });
    var cLayout = cursors[0];
    var cCopy = cursors[1];
    var cDesign = cursors[2] || null;

    document.body.appendChild(root);

    var done = false;
    var raf = 0;
    var safety = 0;
    var elapsed = 0;
    var last = 0;
    var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    function finish(fromUser) {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      clearTimeout(safety);
      document.removeEventListener('keydown', onKey);
      if (reduceMq.removeEventListener) reduceMq.removeEventListener('change', onReduce);
      if (root.parentNode) root.parentNode.removeChild(root);
      if (fromUser) {
        var main = document.getElementById('main');
        if (main) {
          if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
          try { main.focus({ preventScroll: true }); } catch (e) { main.focus(); }
        }
      }
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        finish(true);
      }
    }

    function onReduce(e) {
      if (e.matches) finish(false);
    }

    skip.addEventListener('click', function (e) {
      e.preventDefault();
      finish(true);
    });
    document.addEventListener('keydown', onKey);
    if (reduceMq.addEventListener) reduceMq.addEventListener('change', onReduce);
    safety = setTimeout(function () { finish(false); }, (dur + 1.2) * 1000);

    function syncLines() {
      var w = h1.getBoundingClientRect().width;
      if (Math.abs(w - lineW) < 2) return;
      lineW = w;
      lineCache = measureLines(h1);
      while (hlEls.length < lineCache.length) {
        var hl = document.createElement('div');
        hl.className = 'qa-hl';
        fx.insertBefore(hl, caret);
        hlEls.push(hl);
      }
      for (var n = 0; n < hlEls.length; n++) {
        hlEls[n].style.opacity = n < lineCache.length ? hlEls[n].style.opacity : '0';
      }
    }

    function updateTyping(t0, t1, fadeEnd) {
      syncLines();
      var p = easeInOut(clamp01(seg(elapsed, t0, t1)));
      var op = windowOp(elapsed, t0, t0 + 0.1, t1, fadeEnd);
      var base = h1.getBoundingClientRect();
      var n = lineCache.length;
      var tip = null;
      for (var i = 0; i < hlEls.length; i++) {
        var el = hlEls[i];
        if (i >= n) {
          el.style.opacity = '0';
          continue;
        }
        var local = p * n - i;
        var frac = Math.max(0, Math.min(1, local));
        var ln = lineCache[i];
        var x = base.left + ln.x;
        var y = base.top + ln.y;
        var w = ln.w;
        var h = ln.h;
        var bar = 2;
        el.style.width = Math.max(8, w) + 'px';
        el.style.height = bar + 'px';
        el.style.opacity = frac > 0.01 && op > 0.01 ? String(op) : '0';
        el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + (y + h - bar).toFixed(2) + 'px,0) scaleX(' + Math.max(frac, 0.001).toFixed(4) + ')';
        if (op > 0.01 && local >= -0.02 && local <= 1.02) {
          tip = { x: x + frac * w, y: y + h - 1, h: h, top: y };
        }
      }
      if (tip && op > 0.02) {
        caret.style.opacity = String(Math.min(1, op + 0.15));
        caret.style.height = Math.max(14, tip.h - 3) + 'px';
        caret.style.transform = 'translate3d(' + (tip.x - 1).toFixed(2) + 'px,' + tip.top.toFixed(2) + 'px,0)';
      } else {
        caret.style.opacity = '0';
      }
      return tip;
    }

    function placeGuides(cx, cy, op) {
      var heroR = hero.getBoundingClientRect();
      guideH.style.opacity = String(op);
      guideV.style.opacity = String(op);
      guideH.style.width = heroR.width + 'px';
      guideV.style.height = heroR.height + 'px';
      guideH.style.transform = 'translate3d(' + heroR.left.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
      guideV.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + heroR.top.toFixed(2) + 'px,0)';
    }

    function updateFull() {
      var t = elapsed;
      var col = boxOf(column.getBoundingClientRect(), 12);
      var leadB = lead ? boxOf(lead.getBoundingClientRect(), 6) : col;
      var cta = boxOf(ctas.getBoundingClientRect(), 8);
      var eye = eyebrow ? boxOf(eyebrow.getBoundingClientRect(), 7) : null;
      var phoneB = boxOf(phone.getBoundingClientRect(), 8);
      var floatB = boxOf(baseRect(floatEl), 0);

      var colDraw = easeOut(clamp01(seg(t, 0.28, 1.08)));
      var colOp = windowOp(t, 0.28, 0.4, 2.02, 2.32);
      var ctaDraw = easeOut(clamp01(seg(t, 4.52, 5.16)));
      var ctaOp = windowOp(t, 4.52, 4.64, 5.4, 5.7);
      if (t < 3.3) {
        placeBox(selL, col, colDraw, colOp);
        placeHandles(handL, cornersTL(col, Math.max(colDraw, 0.001)), colDraw > 0.84 ? colOp : 0, 'se');
      } else {
        placeBox(selL, cta, ctaDraw, ctaOp);
        placeHandles(handL, cornersTL(cta, Math.max(ctaDraw, 0.001)), ctaDraw > 0.84 ? ctaOp : 0, 'se');
      }

      var tip = updateTyping(0.42, 2.2, 2.52);

      var leadDraw = easeOut(clamp01(seg(t, 2.85, 3.5)));
      var leadOp = windowOp(t, 2.85, 2.98, 3.95, 4.25);
      placeBox(selC, leadB, leadDraw, leadOp);

      var rs = clamp01(seg(t, 0.78, 2.08));
      var scale = t < 0.78 ? 0.52 : lerp(0.52, 1, easeInOut(rs));
      var frameOp = windowOp(t, 0.4, 0.55, 2.18, 2.52);
      placeFrame(frameEl, phoneB, scale, frameOp);

      var eyeDraw = eye ? easeOut(clamp01(seg(t, 3.05, 3.68))) : 0;
      var eyeOp = eye ? windowOp(t, 3.05, 3.18, 4.12, 4.4) : 0;
      if (eye) placeBox(selD, eye, eyeDraw, eyeOp);
      if (t < 2.75) {
        placeHandles(handD, cornersC(phoneB, scale), frameOp > 0.2 ? frameOp : 0, 'se');
      } else if (eye) {
        placeHandles(handD, cornersTL(eye, Math.max(eyeDraw, 0.001)), eyeDraw > 0.84 ? eyeOp : 0, 'se');
      } else {
        placeHandles(handD, cornersC(phoneB, 1), 0, null);
      }

      var dragU = clamp01(seg(t, 2.32, 3.12));
      var dragE = easeSnap(dragU);
      var ghostDx = lerp(8, 0, dragE);
      var ghostDy = lerp(-74, 0, dragE);
      if (floatB.y + ghostDy < 78) ghostDy = 78 - floatB.y;
      var ghostOp = windowOp(t, 2.26, 2.42, 3.2, 3.5);
      ghost.style.width = floatB.w + 'px';
      ghost.style.height = floatB.h + 'px';
      ghost.style.opacity = String(ghostOp > 0.01 ? ghostOp : 0);
      ghost.classList.toggle('qa-solid', dragU > 0.8);
      ghost.classList.toggle('qa-slim', floatB.h < 40);
      ghost.style.transform = 'translate3d(' + (floatB.x + ghostDx).toFixed(2) + 'px,' + (floatB.y + ghostDy).toFixed(2) + 'px,0)';

      var phoneGuide = pulse(t, 1.9, 2.38);
      var floatGuide = pulse(t, 3.15, 3.58);
      if (phoneGuide >= floatGuide) {
        placeGuides(phoneB.x + phoneB.w / 2, phoneB.y + phoneB.h / 2, phoneGuide * 0.42);
      } else {
        placeGuides(floatB.x + floatB.w / 2, floatB.y + floatB.h / 2, floatGuide * 0.42);
      }

      var colSE = { x: col.x + col.w, y: col.y + col.h };
      var ghostPt = { x: floatB.x + ghostDx + 3, y: floatB.y + ghostDy - 1 };
      var landedPt = { x: floatB.x + 3, y: floatB.y - 1 };
      var gapX = phoneB.x - 4;
      var around = { x: gapX, y: floatB.y + floatB.h + 28 };
      var aroundLow = { x: gapX, y: cta.y + 8 };
      var ctaSE = { x: cta.x + cta.w, y: cta.y + cta.h };
      var layoutPt;
      var layoutOpts = {};
      if (t < 0.28) layoutPt = lerpPt({ x: window.innerWidth * 0.07, y: window.innerHeight * 0.74 }, { x: col.x, y: col.y }, easeInOut(seg(t, 0, 0.28)));
      else if (t < 1.08) layoutPt = seTL(col, colDraw);
      else if (t < 2.02) layoutPt = hold(colSE, t, 1.15);
      else if (t < 2.32) layoutPt = lerpPt(colSE, { x: floatB.x + 11, y: floatB.y - 74 }, easeInOut(seg(t, 2.02, 2.32)));
      else if (t < 3.12) { layoutPt = ghostPt; layoutOpts = { up: true }; }
      else if (t < 3.38) { layoutPt = hold(landedPt, t, 0.6); layoutOpts = { up: true }; }
      else if (t < 3.78) layoutPt = lerpPt(landedPt, around, easeInOut(seg(t, 3.38, 3.78)));
      else if (t < 4.15) layoutPt = lerpPt(around, aroundLow, easeInOut(seg(t, 3.78, 4.15)));
      else if (t < 4.52) layoutPt = lerpPt(aroundLow, { x: cta.x, y: cta.y }, easeInOut(seg(t, 4.15, 4.52)));
      else if (t < 5.16) layoutPt = seTL(cta, ctaDraw);
      else if (t < 5.5) layoutPt = hold(ctaSE, t, 1);
      else layoutPt = lerpPt(ctaSE, { x: -40, y: ctaSE.y + 16 }, easeInOut(seg(t, 5.5, 6.4)));

      var h1r = h1.getBoundingClientRect();
      var leadSE = { x: leadB.x + leadB.w, y: leadB.y + leadB.h };
      var copyPark = leadB.x > 130 ? { x: leadB.x - 74, y: leadB.y + 14 } : leadSE;
      var copyPt;
      var copyOpts = {};
      var copyStart = { x: Math.min(window.innerWidth * 0.22, h1r.left - 20), y: h1r.top - 10 };
      if (t < 0.42) copyPt = lerpPt(copyStart, { x: h1r.left - 6, y: h1r.top + 18 }, easeInOut(seg(t, 0.05, 0.42)));
      else if (t < 2.25) {
        var lineY = tip ? tip.top + Math.min(16, tip.h * 0.45) : h1r.top + 16;
        if (h1r.left > 120) {
          copyPt = { x: h1r.left - 8, y: lineY };
          copyOpts = { flip: true };
        } else {
          copyPt = { x: Math.min(h1r.right - 8, window.innerWidth - 36), y: h1r.top - 1 };
          copyOpts = { up: true, flip: true };
        }
      }
      else if (t < 2.55) { copyPt = { x: h1r.right - 6, y: h1r.top + 1 }; copyOpts = { up: true, flip: true }; }
      else if (t < 2.85) copyPt = lerpPt({ x: h1r.right - 6, y: h1r.top + 1 }, { x: leadB.x, y: leadB.y }, easeInOut(seg(t, 2.55, 2.85)));
      else if (t < 3.5) { copyPt = seTL(leadB, leadDraw); copyOpts = { up: true }; }
      else if (t < 5.05) copyPt = hold(copyPark, t, 1);
      else copyPt = lerpPt(copyPark, { x: -36, y: copyPark.y }, easeInOut(seg(t, 5.05, 6.0)));

      var grab = seC(phoneB, 0.52);
      var designPt;
      var eyeSE = eye ? { x: eye.x + eye.w, y: eye.y + eye.h } : grab;
      if (t < 0.48) designPt = lerpPt({ x: window.innerWidth * 0.92, y: window.innerHeight * 0.62 }, grab, easeInOut(seg(t, 0.08, 0.48)));
      else if (t < 0.78) designPt = hold(grab, t, 0.35);
      else if (t < 2.08) designPt = seC(phoneB, scale);
      else if (t < 2.28) designPt = hold(seC(phoneB, 1), t, 0.8);
      else if (eye && t < 3.05) designPt = lerpPt(seC(phoneB, 1), { x: eye.x, y: eye.y }, easeInOut(seg(t, 2.28, 3.05)));
      else if (eye && t < 3.68) designPt = seTL(eye, eyeDraw);
      else if (eye && t < 4.3) designPt = hold(eyeSE, t, 1);
      else designPt = lerpPt(eye ? eyeSE : seC(phoneB, 1), { x: (eye ? eyeSE.x : phoneB.x), y: -30 }, easeInOut(seg(t, 4.3, 5.45)));

      placeCursor(cLayout, layoutPt.x, layoutPt.y, fade(t, 0.28, 5.7, 6.4), layoutOpts);
      placeCursor(cCopy, copyPt.x, copyPt.y, fade(t, 0.26, 5.15, 6.0), copyOpts);
      if (cDesign) placeCursor(cDesign, designPt.x, designPt.y, fade(t, 0.3, 4.85, 5.5));
    }

    function updateCompact() {
      var t = elapsed;
      var head = boxOf(h1.getBoundingClientRect(), 8);
      var btn = boxOf(primary.getBoundingClientRect(), 5);

      var headDraw = easeOut(clamp01(seg(t, 0.22, 1.05)));
      var headOp = windowOp(t, 0.22, 0.34, 1.5, 1.8);
      placeBox(selL, head, headDraw, headOp);
      placeHandles(handL, cornersTL(head, Math.max(headDraw, 0.001)), headDraw > 0.84 ? headOp : 0, 'se');
      placeBox(selC, head, 0, 0);
      placeBox(selD, head, 0, 0);
      placeFrame(frameEl, head, 1, 0);
      placeHandles(handD, cornersTL(head, 1), 0, null);

      updateTyping(0.3, 1.8, 2.08);

      var dragU = clamp01(seg(t, 1.95, 2.75));
      var dragE = easeSnap(dragU);
      var dx = 0;
      var dy = lerp(-64, 0, dragE);
      if (btn.y + dy < 78) dy = 78 - btn.y;
      var ghostOp = windowOp(t, 1.88, 2.04, 2.82, 3.08);
      ghost.style.width = btn.w + 'px';
      ghost.style.height = btn.h + 'px';
      ghost.style.opacity = String(ghostOp > 0.01 ? ghostOp : 0);
      ghost.classList.toggle('qa-solid', dragU > 0.8);
      ghost.classList.toggle('qa-slim', btn.h < 40);
      ghost.style.transform = 'translate3d(' + (btn.x + dx).toFixed(2) + 'px,' + (btn.y + dy).toFixed(2) + 'px,0)';

      var gPulse = pulse(t, 2.68, 3.08);
      placeGuides(btn.x + btn.w / 2, btn.y + btn.h / 2, gPulse * 0.4);

      var headSE = { x: head.x + head.w, y: head.y + head.h };
      var layoutPt;
      var layoutOpts = {};
      if (t < 0.22) layoutPt = lerpPt({ x: 28, y: window.innerHeight * 0.7 }, { x: head.x, y: head.y }, easeInOut(seg(t, 0, 0.22)));
      else if (t < 1.05) layoutPt = seTL(head, headDraw);
      else if (t < 1.5) layoutPt = hold(headSE, t, 1);
      else if (t < 1.95) layoutPt = lerpPt(headSE, { x: btn.x + 2, y: btn.y + dy - 2 }, easeInOut(seg(t, 1.5, 1.95)));
      else if (t < 2.75) { layoutPt = { x: btn.x + 2, y: btn.y + dy - 1 }; layoutOpts = { up: true }; }
      else if (t < 3.05) { layoutPt = hold({ x: btn.x + 2, y: btn.y - 1 }, t, 0.5); layoutOpts = { up: true }; }
      else layoutPt = lerpPt({ x: btn.x + 2, y: btn.y - 1 }, { x: -30, y: btn.y + 10 }, easeInOut(seg(t, 3.05, 4.6)));

      var copyRest = { x: head.x + head.w - 8, y: head.y - 1 };
      var copyPt;
      var copyOpts = {};
      if (t < 0.3) copyPt = lerpPt({ x: head.x + head.w - 8, y: head.y + 36 }, copyRest, easeInOut(seg(t, 0.04, 0.3)));
      else if (t < 3.15) { copyPt = hold(copyRest, t, 0.7); copyOpts = { up: true, flip: true }; }
      else { copyPt = lerpPt(copyRest, { x: window.innerWidth + 30, y: copyRest.y }, easeInOut(seg(t, 3.15, 4.45))); copyOpts = { up: true, flip: true }; }

      placeCursor(cLayout, layoutPt.x, layoutPt.y, fade(t, 0.22, 3.7, 4.65), layoutOpts);
      placeCursor(cCopy, copyPt.x, copyPt.y, fade(t, 0.2, 3.4, 4.4), copyOpts);
    }

    function tick(now) {
      if (done) return;
      if (!last) last = now;
      var dt = now - last;
      last = now;
      // A long gap means the tab was in the background. End on the finished page.
      // A short hitch should not skip the sequence.
      if (dt > 2000) {
        finish(false);
        return;
      }
      elapsed += Math.min(dt, 64) / 1000;
      try {
        if (full) updateFull();
        else updateCompact();
      } catch (err) {
        finish(false);
        return;
      }
      if (elapsed >= dur) {
        finish(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
  }
})();
