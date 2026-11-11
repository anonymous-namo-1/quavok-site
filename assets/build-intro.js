/* Homepage intro: four labelled agent cursors build the hero, then leave.

   How it stays safe:
   - A small inline script in <head> decides whether to play (once per tab via
     sessionStorage, always with ?intro=1, never with reduced motion) and adds
     html.qa-pre so the hero starts empty. That hold expires by itself.
   - This file only fades, transforms or clips the real elements, so nothing
     can shift layout. Every position is measured each frame with
     getBoundingClientRect, so resize, rotation and toolbar changes are followed.
   - Skip, Escape, a tap, tabbing into the page, a hidden tab, an error or a
     timeout all end on the normal page. */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var boot = window.__qaIntro;
  var KEY = 'quavok-agent-intro';

  if (!boot || !docEl.classList.contains('qa-pre')) return;

  function release() {
    try { clearTimeout(boot.t); } catch (e) {}
    docEl.classList.remove('qa-pre');
    docEl.classList.remove('qa-chat');
  }

  var INK = '#0b1220';
  var GREEN = '#15803d';
  var BLUE = '#2563eb';
  var AMBER = '#c2410c';
  var SVG = 'http://www.w3.org/2000/svg';
  var PROPS = ['opacity', 'transform', 'transform-origin', 'will-change', 'clip-path', '-webkit-clip-path'];

  var vv = window.visualViewport || null;
  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- small helpers ---------- */

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, u) { return a + (b - a) * u; }
  function easeInOut(u) { return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }
  function easeBack(u) {
    var c1 = 1.15;
    var c3 = c1 + 1;
    return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
  }
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }

  // The part of the page the visitor can actually see, in the same
  // coordinates getBoundingClientRect uses.
  function view() {
    var w = docEl.clientWidth || window.innerWidth;
    var h = window.innerHeight || docEl.clientHeight;
    var l = 0;
    var t = 0;
    if (vv && vv.width > 0 && vv.height > 0) {
      l = vv.offsetLeft || 0;
      t = vv.offsetTop || 0;
      w = Math.min(w, vv.width);
      h = vv.height;
    }
    return { l: l, t: t, r: l + w, b: t + h, w: w, h: h };
  }

  /* ---------- real page elements ---------- */

  function Item(el) {
    this.el = el;
    this.tx = 0;
    this.ty = 0;
    this.s = 1;
    this.op = 0;
    this.clip = '';
    this.home = null;
    this.w = null; // last written values
    this.orig = el.getAttribute('style'); // put back exactly as it was
  }

  // Where the element sits in the finished page, with our own transform
  // (origin 0 0) taken back out.
  function measure(it) {
    var r = it.el.getBoundingClientRect();
    it.home = { x: r.left - it.tx, y: r.top - it.ty, w: r.width / it.s, h: r.height / it.s };
    return it.home;
  }

  function write(it) {
    var st = it.el.style;
    var op = it.op >= 0.999 ? '' : String(Math.max(0, Math.round(it.op * 1000) / 1000));
    var moved = Math.abs(it.tx) > 0.01 || Math.abs(it.ty) > 0.01 || Math.abs(it.s - 1) > 0.0005;
    var tf = moved
      ? 'translate3d(' + it.tx.toFixed(2) + 'px,' + it.ty.toFixed(2) + 'px,0) scale(' + it.s.toFixed(4) + ')'
      : '';
    var w = it.w || (it.w = { op: null, tf: null, clip: null });
    if (w.op !== op) {
      w.op = op;
      if (op === '') st.removeProperty('opacity'); else st.opacity = op;
    }
    if (w.tf !== tf) {
      w.tf = tf;
      if (tf === '') {
        st.removeProperty('transform');
        st.removeProperty('transform-origin');
        st.removeProperty('will-change');
      } else {
        st.transformOrigin = '0 0';
        st.willChange = 'transform, opacity';
        st.transform = tf;
      }
    }
    if (w.clip !== it.clip) {
      w.clip = it.clip;
      if (it.clip === '') {
        st.removeProperty('clip-path');
        st.removeProperty('-webkit-clip-path');
      } else {
        st.webkitClipPath = it.clip;
        st.clipPath = it.clip;
      }
    }
  }

  function restore(it) {
    try {
      for (var i = 0; i < PROPS.length; i++) it.el.style.removeProperty(PROPS[i]);
      if (it.orig === null) it.el.removeAttribute('style');
      else it.el.setAttribute('style', it.orig);
    } catch (e) {}
  }

  /* ---------- state ---------- */

  var overlay = null;
  var skipBtn = null;
  var caretEl = null;
  var items = [];
  var agents = [];
  var tracks = [];
  var started = false;
  var done = false;
  var raf = 0;
  var watchdog = 0;
  var stall = 0;
  var lastFrame = 0;
  var T = 0;   // seconds on the intro clock
  var DT = 0;  // seconds since the previous frame
  var V = null; // visible viewport for this frame
  var O = { x: 0, y: 0, w: 0, h: 0 }; // overlay box for this frame
  var caret = { x: 0, y: 0, h: 0, on: false };
  var hero, heroGrid, navBar, h1It;
  var chars = null;
  var charsKey = '';
  var charsDirty = true;
  var skipPos = '';

  /* ---------- overlay pieces ---------- */

  function makeAgent(name, color) {
    var el = document.createElement('div');
    el.className = 'qa-cur';
    el.style.setProperty('--qa', color);
    var svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', '0 0 17 20');
    svg.setAttribute('width', '19');
    svg.setAttribute('height', '22');
    var path = document.createElementNS(SVG, 'path');
    path.setAttribute('d', 'M.75.55.75 15.5 5.15 11.85 8.45 18.7 10.95 17.45 7.6 10.65 14.05 10.65Z');
    path.setAttribute('fill', color);
    path.setAttribute('stroke', '#fff');
    path.setAttribute('stroke-width', '1.15');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    var tag = document.createElement('span');
    tag.className = 'qa-tag';
    tag.textContent = name;
    el.appendChild(svg);
    el.appendChild(tag);

    var boxEl = document.createElement('div');
    boxEl.className = 'qa-box';
    boxEl.style.setProperty('--qa', color);
    for (var i = 0; i < 4; i++) boxEl.appendChild(document.createElement('i'));
    boxEl.appendChild(document.createElement('b'));

    return {
      el: el, tag: tag, tagW: 90, x: 0, y: 0, op: 0, show: false, down: false, free: false, cls: '', tf: '',
      box: { el: boxEl, x: 0, y: 0, w: 0, h: 0, op: 0, on: false, dash: false, handles: false, grab: false, ok: false, follow: null, hold: 0, cls: '', geo: '' }
    };
  }

  function writeAgent(a) {
    a.op += ((a.show ? 1 : 0) - a.op) * Math.min(1, DT * 12);
    if (a.op < 0.01 && !a.show) a.op = 0;
    var x = a.x;
    var y = a.y;
    if (!a.free) {
      x = clamp(x, V.l + 4, V.r - 16);
      y = clamp(y, V.t + 4, V.b - 20);
    }
    var cls = 'qa-cur' + (a.down ? ' qa-down' : '') +
      (x > V.r - a.tagW - 22 ? ' qa-flip' : '') +
      (y > V.b - 56 ? ' qa-raise' : '');
    if (cls !== a.cls) { a.cls = cls; a.el.className = cls; }
    var tf = 'translate3d(' + (x - O.x).toFixed(1) + 'px,' + (y - O.y).toFixed(1) + 'px,0)';
    if (tf !== a.tf) { a.tf = tf; a.el.style.transform = tf; }
    a.el.style.opacity = a.op.toFixed(3);

    var b = a.box;
    if (b.hold > 0) {
      b.hold -= DT;
      if (b.hold <= 0) { b.on = false; b.follow = null; }
    }
    if (b.follow && b.on) {
      var r = b.follow();
      b.x = r.x; b.y = r.y; b.w = r.w; b.h = r.h;
    }
    b.op += ((b.on ? 1 : 0) - b.op) * Math.min(1, DT * 14);
    if (b.op < 0.01 && !b.on) b.op = 0;
    var bc = 'qa-box' + (b.dash ? ' qa-dash' : '') + (b.handles ? ' qa-handles' : '') +
      (b.grab ? ' qa-grab' : '') + (b.ok ? ' qa-ok' : '');
    if (bc !== b.cls) { b.cls = bc; b.el.className = bc; }
    var geo = Math.max(0, b.w).toFixed(1) + '|' + Math.max(0, b.h).toFixed(1) + '|' + (b.x - O.x).toFixed(1) + '|' + (b.y - O.y).toFixed(1);
    if (geo !== b.geo) {
      b.geo = geo;
      b.el.style.width = Math.max(0, b.w).toFixed(1) + 'px';
      b.el.style.height = Math.max(0, b.h).toFixed(1) + 'px';
      b.el.style.transform = 'translate3d(' + (b.x - O.x).toFixed(1) + 'px,' + (b.y - O.y).toFixed(1) + 'px,0)';
      // Corners: children are [nw, ne, sw, se, badge].
      var kids = b.el.children;
      var bw = Math.max(0, b.w).toFixed(1);
      var bh = Math.max(0, b.h).toFixed(1);
      kids[1].style.transform = 'translate3d(' + bw + 'px,0,0)';
      kids[2].style.transform = 'translate3d(0,' + bh + 'px,0)';
      kids[3].style.transform = 'translate3d(' + bw + 'px,' + bh + 'px,0)';
      kids[4].style.transform = 'translate3d(' + bw + 'px,0,0)';
    }
    b.el.style.opacity = b.op.toFixed(3);
  }

  function boxAround(it, pad) {
    return function () {
      var h = it.home;
      return { x: h.x + it.tx - pad, y: h.y + it.ty - pad, w: h.w * it.s + pad * 2, h: h.h * it.s + pad * 2 };
    };
  }

  /* ---------- headline measurement ---------- */

  // Position of every character of the headline, relative to the h1 box.
  function measureChars() {
    var el = h1It.el;
    var base = el.getBoundingClientRect();
    var out = { chars: [], lines: [], w: base.width, h: base.height, fs: parseFloat(window.getComputedStyle(el).fontSize) || 40 };
    try {
      var range = document.createRange();
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
      var node;
      var line = null;
      while ((node = walker.nextNode())) {
        var text = node.nodeValue || '';
        for (var i = 0; i < text.length; i++) {
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          var rects = range.getClientRects();
          var r = null;
          for (var j = 0; j < rects.length; j++) {
            if (rects[j].width > 0.3 && rects[j].height > 1) { r = rects[j]; break; }
          }
          if (!r) { out.chars.push(null); continue; }
          var top = r.top - base.top;
          var bottom = r.bottom - base.top;
          var left = r.left - base.left;
          var right = r.right - base.left;
          if (!line || Math.abs(top - line.top) > r.height * 0.5) {
            line = { top: top, bottom: bottom, left: left, right: right };
            out.lines.push(line);
          } else {
            if (left < line.left) line.left = left;
            if (right > line.right) line.right = right;
          }
          out.chars.push({ line: out.lines.length - 1, right: right });
        }
      }
      // Collapsed spaces have no box of their own. Give them the previous one.
      var prev = null;
      for (var k = 0; k < out.chars.length; k++) {
        if (out.chars[k]) prev = out.chars[k];
        else out.chars[k] = prev || { line: 0, right: out.lines.length ? out.lines[0].left : 0 };
      }
    } catch (e) {
      out.chars = [];
      out.lines = [];
    }
    return out;
  }

  function syncChars() {
    var h = h1It.home;
    var key = Math.round(h.w * 2) + 'x' + Math.round(h.h * 2);
    if (!chars || charsDirty || key !== charsKey) {
      chars = measureChars();
      charsKey = key;
      charsDirty = false;
    }
  }

  // Show the first n characters of the headline and place the caret after them.
  function typeTo(n) {
    syncChars();
    var h = h1It.home;
    var cm = chars;
    if (!cm.chars.length || !cm.lines.length) {
      var u = clamp(n / 35, 0, 1);
      h1It.clip = u >= 1 ? '' : 'inset(-40px ' + ((1 - u) * 100).toFixed(2) + '% -40px -40px)';
      caret.x = h.x + h.w * u;
      caret.y = h.y;
      caret.h = h.h;
      return;
    }
    var idx = Math.min(cm.chars.length, Math.floor(n));
    var li = idx > 0 ? cm.chars[idx - 1].line : 0;
    var ln = cm.lines[li];
    var x = idx > 0 ? cm.chars[idx - 1].right + 1 : ln.left;
    var lift = cm.fs * 0.07;
    var top = li === 0 ? -40 : (cm.lines[li - 1].bottom + ln.top) / 2 + lift;
    var bot = li === cm.lines.length - 1 ? cm.h + 40 : (ln.bottom + cm.lines[li + 1].top) / 2 + lift;
    if (idx <= 0) {
      h1It.clip = 'inset(0 100% 100% 0)';
    } else {
      h1It.clip = 'polygon(-40px -40px,' + (cm.w + 40).toFixed(1) + 'px -40px,' + (cm.w + 40).toFixed(1) + 'px ' + top.toFixed(1) + 'px,' +
        x.toFixed(1) + 'px ' + top.toFixed(1) + 'px,' + x.toFixed(1) + 'px ' + bot.toFixed(1) + 'px,-40px ' + bot.toFixed(1) + 'px)';
    }
    var ch = Math.min(ln.bottom - ln.top, cm.fs * 1.02);
    caret.x = h.x + x + 2;
    caret.y = h.y + ln.top + (ln.bottom - ln.top - ch) / 2;
    caret.h = ch;
  }

  /* ---------- steps ---------- */

  function wait(d) { return { d: d, run: function () {} }; }

  function move(a, target, d) {
    var sx, sy;
    return {
      d: d,
      begin: function () { sx = a.x; sy = a.y; a.show = true; },
      run: function (u) {
        var p = target();
        var e = easeInOut(u);
        var dx = p.x - sx;
        var dy = p.y - sy;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var arc = Math.sin(Math.PI * e) * Math.min(34, len * 0.12);
        a.x = lerp(sx, p.x, e) - (dy / len) * arc;
        a.y = lerp(sy, p.y, e) + (dx / len) * arc;
      }
    };
  }

  // The element appears under the cursor a short way from its place and is
  // dragged home. opt.off gives that starting offset from the measured home.
  function grabPoint(it, opt, k) {
    var h = it.home;
    var o = opt.off(h);
    var s = opt.s || 1;
    return { x: h.x + o.dx * k + opt.gx * h.w * s, y: h.y + o.dy * k + opt.gy * h.h * s };
  }

  function dragIn(a, it, opt, d) {
    return {
      d: d,
      begin: function () {
        a.show = true;
        a.down = true;
        a.box.on = true;
        a.box.dash = true;
        a.box.handles = false;
        a.box.ok = false;
        a.box.hold = 0;
        a.box.follow = boxAround(it, opt.pad == null ? 5 : opt.pad);
      },
      run: function (u) {
        var k = 1 - easeBack(u);
        var o = opt.off(it.home);
        it.s = opt.s || 1;
        it.tx = o.dx * k;
        it.ty = o.dy * k;
        it.op = clamp(u / 0.3, 0, 1);
        var p = grabPoint(it, opt, k);
        a.x = p.x;
        a.y = p.y;
      },
      end: function () {
        it.tx = 0;
        it.ty = 0;
        it.op = 1;
        a.down = false;
        a.box.dash = false;
        if (opt.keep) a.box.handles = true;
        else a.box.hold = 0.24;
        if (opt.done) opt.done();
      }
    };
  }

  function bring(a, it, opt, dMove, dDrag) {
    return [
      move(a, function () { return grabPoint(it, opt, 1); }, dMove),
      dragIn(a, it, opt, dDrag)
    ];
  }

  // Grab the bottom-right handle and pull the block out to full size.
  function resize(a, it, pad, dMove, dDrag) {
    var s0;
    function corner() {
      var h = it.home;
      return { x: h.x + it.tx + h.w * it.s + pad, y: h.y + it.ty + h.h * it.s + pad };
    }
    return [
      move(a, corner, dMove),
      {
        d: dDrag,
        begin: function () {
          s0 = it.s;
          a.down = true;
          a.box.on = true;
          a.box.dash = false;
          a.box.handles = true;
          a.box.grab = true;
          a.box.hold = 0;
          a.box.follow = boxAround(it, pad);
        },
        run: function (u) {
          it.s = lerp(s0, 1, easeBack(u));
          var p = corner();
          a.x = p.x;
          a.y = p.y;
        },
        end: function () {
          it.s = 1;
          a.down = false;
          a.box.grab = false;
          a.box.hold = 0.28;
        }
      }
    ];
  }

  // Drag a selection box from the top-left to the bottom-right of a rect.
  function marquee(a, rect, d) {
    return {
      d: d,
      begin: function () {
        a.show = true;
        a.down = true;
        a.box.on = true;
        a.box.dash = false;
        a.box.handles = false;
        a.box.ok = false;
        a.box.hold = 0;
        a.box.follow = null;
      },
      run: function (u) {
        var r = rect();
        var e = easeInOut(u);
        a.box.x = r.x;
        a.box.y = r.y;
        a.box.w = r.w * e;
        a.box.h = r.h * e;
        a.x = r.x + r.w * e;
        a.y = r.y + r.h * e;
      },
      end: function () {
        a.down = false;
        a.box.handles = true;
        a.box.follow = rect;
      }
    };
  }

  function typeHeadline(a, d) {
    return {
      d: d,
      begin: function () {
        h1It.op = 1;
        caret.on = true;
        typeTo(0);
      },
      run: function (u) {
        var total = chars && chars.chars.length ? chars.chars.length : 35;
        typeTo(u * total);
        var k = Math.min(1, DT * 10);
        a.x += (caret.x + 16 - a.x) * k;
        a.y += (caret.y + caret.h + 12 - a.y) * k;
      },
      end: function () {
        h1It.clip = '';
        h1It.op = 1;
        caret.on = false;
        a.box.hold = 0.3;
      }
    };
  }

  function popIn(list, d) {
    return {
      d: d,
      run: function (u) {
        for (var i = 0; i < list.length; i++) {
          var s = i * 0.35;
          list[i].op = clamp((u - s) / (1 - s) * 1.6, 0, 1);
        }
      },
      end: function () { for (var i = 0; i < list.length; i++) list[i].op = 1; }
    };
  }

  function approve(a, d) {
    return {
      d: d,
      begin: function () { a.box.ok = true; },
      run: function () {},
      end: function () { a.box.on = false; a.box.follow = null; }
    };
  }

  function leave(a, d) {
    var sx, sy, ex, ey;
    return {
      d: d,
      begin: function () {
        sx = a.x; sy = a.y;
        var v = V;
        var toL = sx - v.l, toR = v.r - sx, toT = sy - v.t, toB = v.b - sy;
        var m = Math.min(toL, toR, toT, toB);
        ex = sx; ey = sy;
        if (m === toL) ex = v.l - 60;
        else if (m === toR) ex = v.r + 60;
        else if (m === toT) ey = v.t - 60;
        else ey = v.b + 60;
        a.free = true;
        a.down = false;
      },
      run: function (u) {
        var e = easeInOut(u);
        a.x = lerp(sx, ex, e);
        a.y = lerp(sy, ey, e);
        if (u > 0.35) a.show = false;
      },
      end: function () { a.show = false; }
    };
  }

  function sum(steps) {
    var t = 0;
    for (var i = 0; i < steps.length; i++) t += steps[i].d;
    return t;
  }

  function runTrack(tr) {
    var lt = T - tr.at;
    if (lt < 0) return;
    while (tr.i < tr.steps.length) {
      var s = tr.steps[tr.i];
      if (!s.on) {
        s.on = true;
        s.t0 = tr.acc;
        if (s.begin) s.begin();
      }
      var u = s.d > 0 ? (lt - s.t0) / s.d : 1;
      if (u >= 1) {
        s.run(1);
        if (s.end) s.end();
        tr.acc += s.d;
        tr.i++;
        continue;
      }
      s.run(u < 0 ? 0 : u);
      break;
    }
  }

  /* ---------- finishing ---------- */

  function markSeen() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  }

  function finish() {
    if (done) return;
    done = true;
    try { cancelAnimationFrame(raf); } catch (e) {}
    clearTimeout(watchdog);
    clearInterval(stall);
    for (var i = 0; i < items.length; i++) restore(items[i]);
    release();
    unlisten();
    var ov = overlay;
    overlay = null;
    if (ov) {
      try {
        if (skipBtn) {
          if (document.activeElement === skipBtn) skipBtn.blur();
          skipBtn.style.display = 'none';
        }
        ov.className += ' qa-out';
        setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 240);
      } catch (e) {
        if (ov.parentNode) ov.parentNode.removeChild(ov);
      }
    }
  }

  var tabAt = 0;

  function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) finish();
    else if (e.key === 'Tab' || e.keyCode === 9) tabAt = now();
  }

  // A tap on the page ends the intro. If it landed on something that is not
  // on screen yet, it does not also follow that link.
  function onClick(e) {
    if (done || !overlay) return;
    var t = e.target;
    if (overlay.contains(t)) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].op < 0.5 && items[i].el.contains(t)) {
        e.preventDefault();
        break;
      }
    }
    finish();
  }

  // Tabbing past Skip into the page ends the intro, so focus never sits on
  // something invisible. Focus caused by a tap is left to onClick.
  function onFocus(e) {
    if (overlay && !overlay.contains(e.target) && tabAt && now() - tabAt < 500) finish();
  }

  function onHidden() {
    if (document.hidden && started) finish();
  }

  function onReduce(e) {
    if (e.matches) finish();
  }

  function onViewport() {
    charsDirty = true;
  }

  function listen() {
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick, true);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', finish);
    window.addEventListener('resize', onViewport);
    window.addEventListener('orientationchange', onViewport);
    if (vv && vv.addEventListener) {
      vv.addEventListener('resize', onViewport);
      vv.addEventListener('scroll', onViewport);
    }
    if (reduceMq.addEventListener) reduceMq.addEventListener('change', onReduce);
    else if (reduceMq.addListener) reduceMq.addListener(onReduce);
  }

  function unlisten() {
    try {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', finish);
      window.removeEventListener('resize', onViewport);
      window.removeEventListener('orientationchange', onViewport);
      if (vv && vv.removeEventListener) {
        vv.removeEventListener('resize', onViewport);
        vv.removeEventListener('scroll', onViewport);
      }
      if (reduceMq.removeEventListener) reduceMq.removeEventListener('change', onReduce);
      else if (reduceMq.removeListener) reduceMq.removeListener(onReduce);
    } catch (e) {}
  }

  /* ---------- frame ---------- */

  function placeSkip() {
    var cx = V.l - O.x + V.w / 2;
    var lift = Math.max(0, O.h - (V.b - O.y));
    var key = cx.toFixed(0) + '|' + lift.toFixed(0);
    if (key === skipPos) return;
    skipPos = key;
    skipBtn.style.left = cx.toFixed(1) + 'px';
    skipBtn.style.marginBottom = lift.toFixed(1) + 'px';
  }

  function frame(ts) {
    if (done) return;
    try {
      var t = now();
      DT = lastFrame ? Math.min(0.1, Math.max(0, (t - lastFrame) / 1000)) : 0;
      lastFrame = t;
      T += DT;

      // Read everything first.
      V = view();
      var or = overlay.getBoundingClientRect();
      O.x = or.left; O.y = or.top; O.w = or.width; O.h = or.height;
      var i;
      if (boot.forced && T < 0.8) toTop();
      for (i = 0; i < items.length; i++) measure(items[i]);
      if (hero.getBoundingClientRect().bottom < V.t + 60) { finish(); return; }

      // Then advance and write.
      var busy = false;
      for (i = 0; i < tracks.length; i++) {
        runTrack(tracks[i]);
        if (tracks[i].i < tracks[i].steps.length) busy = true;
      }
      for (i = 0; i < items.length; i++) write(items[i]);
      for (i = 0; i < agents.length; i++) {
        writeAgent(agents[i]);
        if (agents[i].op > 0.01 || agents[i].box.op > 0.01) busy = true;
      }
      if (caret.on) {
        caretEl.style.height = caret.h.toFixed(1) + 'px';
        caretEl.style.transform = 'translate3d(' + (caret.x - O.x).toFixed(1) + 'px,' + (caret.y - O.y).toFixed(1) + 'px,0)';
        caretEl.style.opacity = '1';
      } else {
        caretEl.style.opacity = '0';
      }
      placeSkip();

      if (!busy) { finish(); return; }
      raf = requestAnimationFrame(frame);
    } catch (err) {
      finish();
    }
  }

  /* ---------- setup ---------- */

  // ?intro=1 always replays from the top, even on a reload that restored a
  // scroll position or a link that carries a #hash.
  function toTop() {
    if (!(window.pageYOffset > 0)) return;
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
    if (window.pageYOffset > 0) {
      var st = docEl.style;
      var had = st.scrollBehavior;
      st.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      st.scrollBehavior = had;
      if (!docEl.getAttribute('style')) docEl.removeAttribute('style');
    }
  }

  function visibleEnough(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return false;
    var v = view();
    var h = Math.min(r.bottom, v.b) - Math.max(r.top, v.t);
    var w = Math.min(r.right, v.r) - Math.max(r.left, v.l);
    return w > 8 && h >= r.height * 0.4;
  }

  function setup() {
    if (reduceMq.matches) { release(); return; }

    hero = document.querySelector('.hero');
    var h1 = hero && hero.querySelector('h1');
    heroGrid = hero && hero.querySelector('.c');
    navBar = document.querySelector('.nav');
    if (!hero || !h1 || !heroGrid) { release(); return; }

    if (boot.forced) {
      toTop();
    } else if (window.pageYOffset > 40) {
      release();
      return;
    }
    if (!visibleEnough(h1)) { release(); return; }

    function take(sel, scope) {
      var el = (scope || hero).querySelector(sel);
      if (!visibleEnough(el)) return null;
      var it = new Item(el);
      items.push(it);
      return it;
    }

    var nav = take('.nav > .c', document);
    var eyebrow = take('.eyebrow');
    h1It = take('h1');
    var lead = take('.lead');
    var ctas = take('.ctas');
    var ticks = take('.ticks');
    var phone = take('.phone');
    var floats = [];
    var late = [];
    var phoneEl = hero.querySelector('.phone');
    var peeking = false;
    if (!phone && phoneEl) {
      // The mockup only peeks into view (most phones). It is not dragged,
      // but it should not sit there before the rest of the hero exists.
      var pr = phoneEl.getBoundingClientRect();
      var pv = view();
      peeking = pr.top < pv.b && pr.bottom > pv.t;
      if (peeking) {
        var pi = new Item(phoneEl);
        items.push(pi);
        late.push(pi);
      }
    }
    if (phone || peeking) {
      var fl = hero.querySelectorAll('.float');
      for (var f = 0; f < fl.length; f++) {
        var fi = new Item(fl[f]);
        items.push(fi);
        (phone ? floats : late).push(fi);
      }
    }

    // Hand over from the stylesheet hold to inline styles in one go.
    var i;
    for (i = 0; i < items.length; i++) write(items[i]);
    if (phone || peeking) docEl.classList.add('qa-chat');
    try { clearTimeout(boot.t); } catch (e) {}
    docEl.classList.remove('qa-pre');

    // Overlay
    overlay = document.createElement('div');
    overlay.className = 'qa-intro';
    skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.className = 'qa-skip';
    skipBtn.textContent = 'Skip intro';
    skipBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      finish();
    });
    overlay.appendChild(skipBtn);

    var fx = document.createElement('div');
    fx.setAttribute('aria-hidden', 'true');
    overlay.appendChild(fx);

    var layout = makeAgent('Layout agent', INK);
    var copy = makeAgent('Copy agent', GREEN);
    var design = makeAgent('Design agent', BLUE);
    var qa = makeAgent('QA agent', AMBER);
    agents = [layout, copy, design, qa];
    for (i = 0; i < agents.length; i++) fx.appendChild(agents[i].box.el);
    caretEl = document.createElement('div');
    caretEl.className = 'qa-caret';
    caretEl.style.setProperty('--qa', GREEN);
    fx.appendChild(caretEl);
    for (i = 0; i < agents.length; i++) fx.appendChild(agents[i].el);
    document.body.insertBefore(overlay, document.body.firstChild);
    for (i = 0; i < agents.length; i++) agents[i].tagW = agents[i].tag.offsetWidth || 90;

    // Where each cursor comes in from.
    var v = view();
    layout.x = v.l + v.w * 0.3; layout.y = v.t - 40;
    copy.x = v.r + 40; copy.y = v.t + v.h * 0.42;
    design.x = v.r + 40; design.y = v.b - 90;
    qa.x = v.l - 40; qa.y = v.b - 110;

    // Layout agent: nav bar, eyebrow, buttons.
    var s1 = [];
    if (nav) {
      s1.push(dragIn(layout, nav, { gx: 0.5, gy: 0.6, pad: 0, off: function (h) { return { dx: 0, dy: -(h.h + 30) }; } }, 0.75));
    }
    if (eyebrow) {
      s1 = s1.concat(bring(layout, eyebrow, { gx: 0.5, gy: 0.5, off: function (h) { return { dx: -Math.min(220, view().w * 0.45), dy: 26 }; } }, 0.32, 0.65));
    }
    if (ctas) {
      s1.push(wait(0.2));
      s1 = s1.concat(bring(layout, ctas, { gx: 0.5, gy: 0.3, off: function () { return { dx: -26, dy: 120 }; } }, 0.45, 0.7));
    }
    s1.push(wait(0.25), leave(layout, 0.5));

    // Copy agent: text box, then types the headline. Then the tick list.
    var s2 = [];
    var h1Box = boxAround(h1It, 7);
    s2.push(move(copy, function () { var r = h1Box(); return { x: r.x, y: r.y }; }, 0.55));
    s2.push(marquee(copy, h1Box, 0.55));
    s2.push(wait(0.15));
    s2.push(typeHeadline(copy, 1.85));
    if (ticks) {
      s2.push(wait(0.15));
      s2 = s2.concat(bring(copy, ticks, { gx: 0.4, gy: 0.5, off: function () { return { dx: 36, dy: 96 }; } }, 0.4, 0.65));
    }
    s2.push(wait(0.25), leave(copy, 0.5));

    // Design agent: places the paragraph and the phone small, then resizes them.
    var s3 = [];
    if (lead) {
      s3 = s3.concat(bring(design, lead, { s: 0.8, keep: true, gx: 0.5, gy: 0.4, off: function () { return { dx: 34, dy: 110 }; } }, 0.45, 0.65));
      s3 = s3.concat(resize(design, lead, 5, 0.28, 0.6));
    }
    if (phone) {
      s3.push(wait(0.1));
      s3 = s3.concat(bring(design, phone, {
        s: 0.86, keep: true, gx: 0.5, gy: 0.3,
        off: function () { return { dx: Math.min(220, view().w * 0.3), dy: 60 }; },
        done: function () { docEl.classList.remove('qa-chat'); }
      }, 0.45, 0.75));
      s3 = s3.concat(resize(design, phone, 5, 0.28, 0.6));
      if (floats.length) s3.push(popIn(floats, 0.45));
    }
    if (late.length) {
      var shown = popIn(late, 0.5);
      var shownEnd = shown.end;
      shown.end = function () { shownEnd(); docEl.classList.remove('qa-chat'); };
      s3.push(wait(0.3), shown);
    }
    s3.push(wait(0.25), leave(design, 0.5));

    // QA agent: selects the finished hero, approves it, leaves.
    function stageRect() {
      var r = heroGrid.getBoundingClientRect();
      var vw = V || view();
      var top = vw.t + 8;
      if (navBar) top = Math.max(top, navBar.getBoundingClientRect().bottom + 8);
      var x1 = Math.max(r.left - 8, vw.l + 8);
      var y1 = Math.max(r.top - 12, top);
      var x2 = Math.min(r.right + 8, vw.r - 8);
      var y2 = Math.min(r.bottom + 12, vw.b - 74);
      if (y2 < y1 + 40) y2 = y1 + 40;
      return { x: x1, y: y1, w: Math.max(40, x2 - x1), h: y2 - y1 };
    }
    var s4 = [
      move(qa, function () { var r = stageRect(); return { x: r.x, y: r.y }; }, 0.5),
      marquee(qa, stageRect, 0.65),
      wait(0.25),
      approve(qa, 0.6),
      leave(qa, 0.45)
    ];

    var a1 = 0.1, a2 = 0.6, a3 = 0.35;
    var others = Math.max(a1 + sum(s1), a2 + sum(s2), a3 + sum(s3));
    var a4 = Math.max(0.5, others - 1.15);
    tracks = [
      { at: a1, steps: s1, i: 0, acc: 0 },
      { at: a2, steps: s2, i: 0, acc: 0 },
      { at: a3, steps: s3, i: 0, acc: 0 },
      { at: a4, steps: s4, i: 0, acc: 0 }
    ];
    var total = Math.max(others, a4 + sum(s4));

    listen();
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(function () { charsDirty = true; });
    }

    function go() {
      if (done || started) return;
      started = true;
      markSeen();
      watchdog = setTimeout(finish, (total + 3) * 1000);
      stall = setInterval(function () {
        if (lastFrame && now() - lastFrame > 1500) finish();
      }, 500);
      lastFrame = 0;
      raf = requestAnimationFrame(frame);
      // If no frame arrives at all, do not leave the hero empty.
      setTimeout(function () { if (!lastFrame) finish(); }, 1500);
    }

    if (document.hidden) {
      var onShow = function () {
        if (document.hidden) return;
        document.removeEventListener('visibilitychange', onShow);
        go();
      };
      document.addEventListener('visibilitychange', onShow);
    } else {
      go();
    }
  }

  try {
    setup();
  } catch (err) {
    done = false;
    try { finish(); } catch (e) {}
    for (var n = 0; n < items.length; n++) restore(items[n]);
    release();
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }
})();
