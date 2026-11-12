/* Homepage intro: anonymous agent cursors assemble the page and its workflow, then leave.

   Evolved from the previous site's build-intro.js. The rules are unchanged:
   - One requestAnimationFrame loop. Every frame reads first, then writes.
   - Real DOM nodes only. They are faded, transformed or clipped; nothing
     changes layout. Original inline styles are restored at the end.
   - Skip, Escape, a tap, tabbing into the page, a hidden tab, an error, a
     stalled frame, the hero scrolling away, or the watchdog all end on the
     normal page. Reduced motion never starts it.
   - The promise (lead paragraph) and the CTAs are never hidden.

   The story: Mapping places five steps of a business process, Wiring connects
   them (with an approval gate and a route to a person), Copy types the real
   headline and the workflow name, and Review selects the finished stage and
   stamps "Scope approved". */

import { INTRO_KEY } from "./boot";

type BootState = { forced: boolean; t: number };
declare global {
  interface Window {
    __qaIntro?: BootState;
    __qaIntroDone?: boolean;
  }
}

export const INTRO_DONE_EVENT = "quavok:intro-done";

function purpleDone() {
  window.__qaIntroDone = true;
  try {
    window.dispatchEvent(new Event(INTRO_DONE_EVENT));
  } catch {
    /* ignore */
  }
}

const SAND = "#e8dcc4";
const PURPLE_SOFT = "#c5a9fa";
const PURPLE = "#8b5cf6";
const SAND_LIGHT = "#e8dcc4";
const SVGNS = "http://www.w3.org/2000/svg";
const PROPS = ["opacity", "transform", "transform-origin", "will-change", "clip-path", "-webkit-clip-path"];

type Rect = { x: number; y: number; w: number; h: number };
type View = { l: number; t: number; r: number; b: number; w: number; h: number };
type Pt = { x: number; y: number };

type Step = {
  d: number;
  begin?: () => void;
  run: (u: number) => void;
  end?: () => void;
  on?: boolean;
  t0?: number;
};
type Track = { at: number; steps: Step[]; i: number; acc: number };

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const easeInOut = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
function easeBack(u: number) {
  const c1 = 1.15;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
}
const now = () => (window.performance && performance.now ? performance.now() : Date.now());

/* ---------- real page elements ---------- */

class Item {
  el: HTMLElement | SVGElement;
  tx = 0;
  ty = 0;
  s = 1;
  op = 0;
  clip = "";
  home: Rect = { x: 0, y: 0, w: 0, h: 0 };
  w: { op: string | null; tf: string | null; clip: string | null } = { op: null, tf: null, clip: null };
  orig: string | null;
  constructor(el: HTMLElement | SVGElement) {
    this.el = el;
    this.orig = el.getAttribute("style");
  }
  measure() {
    const r = this.el.getBoundingClientRect();
    this.home = { x: r.left - this.tx, y: r.top - this.ty, w: r.width / this.s, h: r.height / this.s };
    return this.home;
  }
  write() {
    const st = this.el.style;
    const op = this.op >= 0.999 ? "" : String(Math.max(0, Math.round(this.op * 1000) / 1000));
    const moved = Math.abs(this.tx) > 0.01 || Math.abs(this.ty) > 0.01 || Math.abs(this.s - 1) > 0.0005;
    const tf = moved
      ? `translate3d(${this.tx.toFixed(2)}px,${this.ty.toFixed(2)}px,0) scale(${this.s.toFixed(4)})`
      : "";
    const w = this.w;
    if (w.op !== op) {
      w.op = op;
      // While the intro runs, "fully visible" must still beat the CSS hold.
      st.opacity = op === "" ? "1" : op;
    }
    if (w.tf !== tf) {
      w.tf = tf;
      if (tf === "") {
        st.removeProperty("transform");
        st.removeProperty("transform-origin");
        st.removeProperty("will-change");
      } else {
        st.transformOrigin = "0 0";
        st.willChange = "transform, opacity";
        st.transform = tf;
      }
    }
    if (w.clip !== this.clip) {
      w.clip = this.clip;
      if (this.clip === "") {
        st.removeProperty("clip-path");
        st.removeProperty("-webkit-clip-path");
      } else {
        st.setProperty("-webkit-clip-path", this.clip);
        st.clipPath = this.clip;
      }
    }
  }
  restore() {
    try {
      for (const p of PROPS) this.el.style.removeProperty(p);
      if (this.orig === null) this.el.removeAttribute("style");
      else this.el.setAttribute("style", this.orig);
    } catch {
      /* ignore */
    }
  }
}

// An SVG connector that is "pulled" from one step to the next.
class Edge {
  el: SVGPathElement;
  probe: SVGPathElement | null = null;
  len = 0;
  u = 0;
  op = 1;
  dashed: boolean;
  last = "";
  orig: string | null;
  constructor(el: SVGPathElement, dashed: boolean) {
    this.el = el;
    this.dashed = dashed;
    this.orig = el.getAttribute("style");
    // getPointAtLength on a twin without pathLength, so distances are real.
    try {
      const p = document.createElementNS(SVGNS, "path");
      p.setAttribute("d", el.getAttribute("d") || "");
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", "none");
      p.style.visibility = "hidden";
      el.parentNode?.appendChild(p);
      this.probe = p;
      this.len = p.getTotalLength();
    } catch {
      this.probe = null;
    }
  }
  point(u: number): Pt {
    const svg = this.el.ownerSVGElement;
    if (!svg || !this.probe) {
      const r = this.el.getBoundingClientRect();
      return { x: r.left + r.width * u, y: r.top + r.height * u };
    }
    const r = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const sx = vb && vb.width ? r.width / vb.width : 1;
    const sy = vb && vb.height ? r.height / vb.height : 1;
    const p = this.probe.getPointAtLength(this.len * clamp(u, 0, 1));
    return { x: r.left + (p.x - (vb ? vb.x : 0)) * sx, y: r.top + (p.y - (vb ? vb.y : 0)) * sy };
  }
  write() {
    const st = this.el.style;
    const key = this.dashed ? `o${this.op.toFixed(3)}` : `${this.u.toFixed(4)}|${this.op.toFixed(3)}`;
    if (key === this.last) return;
    this.last = key;
    st.opacity = this.dashed ? String(Math.round(this.op * 0.8 * 1000) / 1000) : this.u <= 0 ? "0" : "";
    if (!this.dashed) {
      if (this.u >= 1) {
        st.removeProperty("stroke-dasharray");
        st.removeProperty("stroke-dashoffset");
      } else {
        st.strokeDasharray = "1";
        st.strokeDashoffset = String(1 - this.u);
      }
    }
  }
  restore() {
    try {
      st(this.el);
      if (this.orig === null) this.el.removeAttribute("style");
      else this.el.setAttribute("style", this.orig);
      if (this.probe && this.probe.parentNode) this.probe.parentNode.removeChild(this.probe);
    } catch {
      /* ignore */
    }
    function st(el: SVGPathElement) {
      el.style.removeProperty("stroke-dasharray");
      el.style.removeProperty("stroke-dashoffset");
      el.style.removeProperty("opacity");
    }
  }
}

/* ---------- typing: measured per-character clip with a caret ---------- */

type CharMap = {
  chars: { line: number; right: number }[];
  lines: { top: number; bottom: number; left: number; right: number }[];
  w: number;
  h: number;
  fs: number;
};

class Typer {
  it: Item;
  map: CharMap | null = null;
  key = "";
  dirty = true;
  constructor(it: Item) {
    this.it = it;
  }
  measureChars(): CharMap {
    const el = this.it.el;
    const base = el.getBoundingClientRect();
    const out: CharMap = {
      chars: [],
      lines: [],
      w: base.width,
      h: base.height,
      fs: parseFloat(window.getComputedStyle(el).fontSize) || 40,
    };
    try {
      const range = document.createRange();
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      let line: CharMap["lines"][number] | null = null;
      const raw: ({ line: number; right: number } | null)[] = [];
      while ((node = walker.nextNode())) {
        // Screen-reader-only text is not typed.
        if ((node.parentElement as HTMLElement | null)?.closest(".sr-only")) continue;
        const text = node.nodeValue || "";
        for (let i = 0; i < text.length; i++) {
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const rects = range.getClientRects();
          let r: DOMRect | null = null;
          for (let j = 0; j < rects.length; j++) {
            if (rects[j].width > 0.3 && rects[j].height > 1) {
              r = rects[j];
              break;
            }
          }
          if (!r) {
            raw.push(null);
            continue;
          }
          const top = r.top - base.top;
          const bottom = r.bottom - base.top;
          const left = r.left - base.left;
          const right = r.right - base.left;
          if (!line || Math.abs(top - line.top) > r.height * 0.5) {
            line = { top, bottom, left, right };
            out.lines.push(line);
          } else {
            if (left < line.left) line.left = left;
            if (right > line.right) line.right = right;
          }
          raw.push({ line: out.lines.length - 1, right });
        }
      }
      // Collapsed spaces have no box of their own. Give them the previous one.
      let prev: { line: number; right: number } | null = null;
      for (const c of raw) {
        if (c) prev = c;
        out.chars.push(c || prev || { line: 0, right: out.lines.length ? out.lines[0].left : 0 });
      }
    } catch {
      out.chars = [];
      out.lines = [];
    }
    return out;
  }
  sync() {
    const h = this.it.home;
    const key = Math.round(h.w * 2) + "x" + Math.round(h.h * 2);
    if (!this.map || this.dirty || key !== this.key) {
      this.map = this.measureChars();
      this.key = key;
      this.dirty = false;
    }
    return this.map;
  }
  total() {
    const m = this.sync();
    return m.chars.length || 30;
  }
  // Show the first n characters and return where the caret goes.
  typeTo(n: number): Rect {
    const cm = this.sync();
    const it = this.it;
    const h = it.home;
    if (!cm.chars.length || !cm.lines.length) {
      const u = clamp(n / 30, 0, 1);
      it.clip = u >= 1 ? "" : `inset(-40px ${((1 - u) * 100).toFixed(2)}% -40px -40px)`;
      return { x: h.x + h.w * u, y: h.y, w: 2, h: h.h };
    }
    const idx = Math.min(cm.chars.length, Math.floor(n));
    const li = idx > 0 ? cm.chars[idx - 1].line : 0;
    const ln = cm.lines[li];
    const x = idx > 0 ? cm.chars[idx - 1].right + 1 : ln.left;
    const lift = cm.fs * 0.07;
    const top = li === 0 ? -40 : (cm.lines[li - 1].bottom + ln.top) / 2 + lift;
    const bot = li === cm.lines.length - 1 ? cm.h + 40 : (ln.bottom + cm.lines[li + 1].top) / 2 + lift;
    if (idx <= 0) {
      it.clip = "inset(0 100% 100% 0)";
    } else {
      const W = (cm.w + 40).toFixed(1);
      it.clip =
        `polygon(-40px -40px,${W}px -40px,${W}px ${top.toFixed(1)}px,` +
        `${x.toFixed(1)}px ${top.toFixed(1)}px,${x.toFixed(1)}px ${bot.toFixed(1)}px,-40px ${bot.toFixed(1)}px)`;
    }
    const ch = Math.min(ln.bottom - ln.top, cm.fs * 1.02);
    return { x: h.x + x + 2, y: h.y + ln.top + (ln.bottom - ln.top - ch) / 2, w: 2, h: ch };
  }
}

/* ---------- agents ---------- */

type Box = {
  el: HTMLDivElement;
  x: number;
  y: number;
  w: number;
  h: number;
  op: number;
  on: boolean;
  dash: boolean;
  handles: boolean;
  ok: boolean;
  follow: (() => Rect) | null;
  hold: number;
  cls: string;
  geo: string;
};

type Agent = {
  el: HTMLDivElement;
  bubble: HTMLSpanElement;
  x: number;
  y: number;
  op: number;
  show: boolean;
  down: boolean;
  free: boolean;
  cls: string;
  tf: string;
  box: Box;
};

function makeAgent(color: string, stamp?: string, chatter?: string): Agent {
  const el = document.createElement("div");
  el.className = "qa-cur";
  el.style.setProperty("--qa", color);
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", "0 0 17 20");
  svg.setAttribute("width", "19");
  svg.setAttribute("height", "22");
  const path = document.createElementNS(SVGNS, "path");
  path.setAttribute("d", "M.75.55.75 15.5 5.15 11.85 8.45 18.7 10.95 17.45 7.6 10.65 14.05 10.65Z");
  path.setAttribute("fill", color);
  path.setAttribute("stroke", "#e8dcc4");
  path.setAttribute("stroke-width", "1.15");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  el.appendChild(svg);
  const bubble = document.createElement("span");
  bubble.className = "qa-chatter";
  bubble.textContent = chatter || "On it.";
  el.appendChild(bubble);

  const boxEl = document.createElement("div");
  boxEl.className = "qa-box";
  boxEl.style.setProperty("--qa", color);
  for (let i = 0; i < 4; i++) boxEl.appendChild(document.createElement("i"));
  const badge = document.createElement("b");
  if (stamp) {
    const s = document.createElement("span");
    s.textContent = stamp;
    badge.appendChild(s);
  }
  boxEl.appendChild(badge);

  return {
    el,
    bubble,
    x: 0,
    y: 0,
    op: 0,
    show: false,
    down: false,
    free: false,
    cls: "",
    tf: "",
    box: { el: boxEl, x: 0, y: 0, w: 0, h: 0, op: 0, on: false, dash: false, handles: false, ok: false, follow: null, hold: 0, cls: "", geo: "" },
  };
}

/* ---------- engine ---------- */

export function startIntro(): () => void {
  const docEl = document.documentElement;
  const boot = window.__qaIntro;
  if (!boot || !docEl.classList.contains("qa-pre")) {
    docEl.classList.remove("qa-pre");
    purpleDone();
    return () => {};
  }

  const vv = window.visualViewport || null;
  const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

  let overlay: HTMLDivElement | null = null;
  let skipBtn: HTMLButtonElement | null = null;
  let caretEl: HTMLDivElement | null = null;
  const items: Item[] = [];
  const edges: Edge[] = [];
  const typers: Typer[] = [];
  let agents: Agent[] = [];
  let tracks: Track[] = [];
  let started = false;
  let done = false;
  let raf = 0;
  let watchdog = 0;
  let stall = 0;
  let lastFrame = 0;
  let T = 0;
  let DT = 0;
  let V: View = view();
  const O = { x: 0, y: 0, w: 0, h: 0 };
  const caret = { x: 0, y: 0, h: 0, on: false };
  let skipPos = "";
  let tabAt = 0;
  let hero: HTMLElement | null = null;

  function release() {
    try {
      clearTimeout(boot!.t);
    } catch {
      /* ignore */
    }
    docEl.classList.remove("qa-pre");
  }

  function view(): View {
    let w = docEl.clientWidth || window.innerWidth;
    let h = window.innerHeight || docEl.clientHeight;
    let l = 0;
    let t = 0;
    if (vv && vv.width > 0 && vv.height > 0) {
      l = vv.offsetLeft || 0;
      t = vv.offsetTop || 0;
      w = Math.min(w, vv.width);
      h = vv.height;
    }
    return { l, t, r: l + w, b: t + h, w, h };
  }

  function writeAgent(a: Agent) {
    a.op += ((a.show ? 1 : 0) - a.op) * Math.min(1, DT * 12);
    if (a.op < 0.01 && !a.show) a.op = 0;
    let x = a.x;
    let y = a.y;
    if (!a.free) {
      x = clamp(x, V.l + 4, V.r - 16);
      y = clamp(y, V.t + 4, V.b - 20);
    }
    const cls =
      "qa-cur" + (a.down ? " qa-down" : "") + (x > V.r - 160 - 22 ? " qa-flip" : "") + (y > V.b - 56 ? " qa-raise" : "");
    if (cls !== a.cls) {
      a.cls = cls;
      a.el.className = cls;
    }
    const tf = `translate3d(${(x - O.x).toFixed(1)}px,${(y - O.y).toFixed(1)}px,0)`;
    if (tf !== a.tf) {
      a.tf = tf;
      a.el.style.transform = tf;
    }
    a.el.style.opacity = a.op.toFixed(3);

    const b = a.box;
    if (b.hold > 0) {
      b.hold -= DT;
      if (b.hold <= 0) {
        b.on = false;
        b.follow = null;
      }
    }
    b.op += ((b.on ? 1 : 0) - b.op) * Math.min(1, DT * 14);
    if (b.op < 0.01 && !b.on) b.op = 0;
    const bc = "qa-box" + (b.dash ? " qa-dash" : "") + (b.handles ? " qa-handles" : "") + (b.ok ? " qa-ok" : "");
    if (bc !== b.cls) {
      b.cls = bc;
      b.el.className = bc;
    }
    const bw = Math.max(0, b.w).toFixed(1);
    const bh = Math.max(0, b.h).toFixed(1);
    const geo = `${bw}|${bh}|${(b.x - O.x).toFixed(1)}|${(b.y - O.y).toFixed(1)}`;
    if (geo !== b.geo) {
      b.geo = geo;
      b.el.style.width = bw + "px";
      b.el.style.height = bh + "px";
      b.el.style.transform = `translate3d(${(b.x - O.x).toFixed(1)}px,${(b.y - O.y).toFixed(1)}px,0)`;
      const kids = b.el.children as HTMLCollectionOf<HTMLElement>;
      kids[1].style.transform = `translate3d(${bw}px,0,0)`;
      kids[2].style.transform = `translate3d(0,${bh}px,0)`;
      kids[3].style.transform = `translate3d(${bw}px,${bh}px,0)`;
      kids[4].style.transform = `translate3d(${bw}px,0,0)`;
    }
    b.el.style.opacity = b.op.toFixed(3);
  }

  function boxAround(it: Item, pad: number) {
    return () => {
      const h = it.home;
      return { x: h.x + it.tx - pad, y: h.y + it.ty - pad, w: h.w * it.s + pad * 2, h: h.h * it.s + pad * 2 };
    };
  }

  /* ---------- steps ---------- */

  const wait = (d: number): Step => ({ d, run: () => {} });

  function move(a: Agent, target: () => Pt, d: number): Step {
    let sx = 0;
    let sy = 0;
    return {
      d,
      begin: () => {
        sx = a.x;
        sy = a.y;
        a.show = true;
      },
      run: (u) => {
        const p = target();
        const e = easeInOut(u);
        const dx = p.x - sx;
        const dy = p.y - sy;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const arc = Math.sin(Math.PI * e) * Math.min(34, len * 0.12);
        a.x = lerp(sx, p.x, e) - (dy / len) * arc;
        a.y = lerp(sy, p.y, e) + (dx / len) * arc;
      },
    };
  }

  type DragOpt = { off: (h: Rect) => { dx: number; dy: number }; gx: number; gy: number; pad?: number };

  function grabPoint(it: Item, opt: DragOpt, k: number): Pt {
    const h = it.home;
    const o = opt.off(h);
    return { x: h.x + o.dx * k + opt.gx * h.w, y: h.y + o.dy * k + opt.gy * h.h };
  }

  function dragIn(a: Agent, it: Item, opt: DragOpt, d: number): Step {
    return {
      d,
      begin: () => {
        a.show = true;
        a.down = true;
        a.box.on = true;
        a.box.dash = true;
        a.box.handles = false;
        a.box.ok = false;
        a.box.hold = 0;
        a.box.follow = boxAround(it, opt.pad == null ? 4 : opt.pad);
        const label = it.el.querySelector(".n-title")?.textContent;
        a.bubble.textContent = label ? `${label}. In its place.` : "A place for everything.";
      },
      run: (u) => {
        const k = 1 - easeBack(u);
        const o = opt.off(it.home);
        it.tx = o.dx * k;
        it.ty = o.dy * k;
        it.op = clamp(u / 0.3, 0, 1);
        const p = grabPoint(it, opt, k);
        a.x = p.x;
        a.y = p.y;
      },
      end: () => {
        it.tx = 0;
        it.ty = 0;
        it.op = 1;
        a.down = false;
        a.box.dash = false;
        a.box.hold = 0.2;
      },
    };
  }

  function marquee(a: Agent, rect: () => Rect, d: number): Step {
    return {
      d,
      begin: () => {
        a.show = true;
        a.down = true;
        a.box.on = true;
        a.box.dash = false;
        a.box.handles = false;
        a.box.ok = false;
        a.box.hold = 0;
        a.box.follow = null;
      },
      run: (u) => {
        const r = rect();
        const e = easeInOut(u);
        a.box.x = r.x;
        a.box.y = r.y;
        a.box.w = r.w * e;
        a.box.h = r.h * e;
        a.x = r.x + r.w * e;
        a.y = r.y + r.h * e;
      },
      end: () => {
        a.down = false;
        a.box.handles = true;
        a.box.follow = rect;
      },
    };
  }

  function typeText(a: Agent, ty: Typer, d: number, keepBox: boolean): Step {
    return {
      d,
      begin: () => {
        ty.it.op = 1;
        a.bubble.textContent = "Room for the work you love.";
        caret.on = true;
        const c = ty.typeTo(0);
        Object.assign(caret, { x: c.x, y: c.y, h: c.h });
      },
      run: (u) => {
        const c = ty.typeTo(u * ty.total());
        caret.x = c.x;
        caret.y = c.y;
        caret.h = c.h;
        const k = Math.min(1, DT * 10);
        a.x += (caret.x + 16 - a.x) * k;
        a.y += (caret.y + caret.h + 10 - a.y) * k;
      },
      end: () => {
        ty.it.clip = "";
        ty.it.op = 1;
        caret.on = false;
        if (keepBox) a.box.hold = 0.3;
      },
    };
  }

  function drawEdge(a: Agent, e: Edge, d: number, after?: () => void): Step {
    return {
      d,
      begin: () => {
        a.show = true;
        a.down = true;
        a.bubble.textContent = e.dashed ? "Unsure? Ask a person." : "Passing it along…";
        if (e.dashed) e.op = 0;
        else e.u = 0.001;
      },
      run: (u) => {
        const k = easeInOut(u);
        if (e.dashed) e.op = k;
        else e.u = Math.max(0.001, k);
        const p = e.point(k);
        a.x = p.x;
        a.y = p.y;
      },
      end: () => {
        e.u = 1;
        e.op = 1;
        a.down = false;
        if (after) after();
      },
    };
  }

  function popIn(list: Item[], d: number): Step {
    return {
      d,
      run: (u) => {
        list.forEach((it, i) => {
          const s = list.length > 1 ? (i / list.length) * 0.5 : 0;
          it.op = clamp(((u - s) / (1 - s)) * 1.6, 0, 1);
          it.s = 0.94 + 0.06 * easeBack(clamp((u - s) / (1 - s), 0, 1));
        });
      },
      end: () => {
        list.forEach((it) => {
          it.op = 1;
          it.s = 1;
        });
      },
    };
  }

  function approve(a: Agent, d: number): Step {
    return {
      d,
      begin: () => {
        a.box.ok = true;
        a.bubble.textContent = "All connected. Over to you.";
        document.querySelector("[data-intro-stage]")?.classList.add("assembly-approved");
      },
      run: () => {},
      end: () => {
        a.box.on = false;
        a.box.follow = null;
      },
    };
  }

  function leave(a: Agent, d: number): Step {
    let sx = 0;
    let sy = 0;
    let ex = 0;
    let ey = 0;
    return {
      d,
      begin: () => {
        sx = a.x;
        sy = a.y;
        const v = V;
        const toL = sx - v.l;
        const toR = v.r - sx;
        const toT = sy - v.t;
        const toB = v.b - sy;
        const m = Math.min(toL, toR, toT, toB);
        ex = sx;
        ey = sy;
        if (m === toL) ex = v.l - 60;
        else if (m === toR) ex = v.r + 60;
        else if (m === toT) ey = v.t - 60;
        else ey = v.b + 60;
        a.free = true;
        a.down = false;
      },
      run: (u) => {
        const e = easeInOut(u);
        a.x = lerp(sx, ex, e);
        a.y = lerp(sy, ey, e);
        if (u > 0.35) a.show = false;
      },
      end: () => {
        a.show = false;
      },
    };
  }

  const sum = (steps: Step[]) => steps.reduce((t, s) => t + s.d, 0);

  function runTrack(tr: Track) {
    const lt = T - tr.at;
    if (lt < 0) return;
    while (tr.i < tr.steps.length) {
      const s = tr.steps[tr.i];
      if (!s.on) {
        s.on = true;
        s.t0 = tr.acc;
        if (s.begin) s.begin();
      }
      const u = s.d > 0 ? (lt - (s.t0 || 0)) / s.d : 1;
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

  function finish() {
    if (done) return;
    done = true;
    try {
      cancelAnimationFrame(raf);
    } catch {
      /* ignore */
    }
    clearTimeout(watchdog);
    clearInterval(stall);
    for (const it of items) it.restore();
    for (const e of edges) e.restore();
    release();
    unlisten();
    const ov = overlay;
    overlay = null;
    if (ov) {
      try {
        if (skipBtn) {
          if (document.activeElement === skipBtn) skipBtn.blur();
          skipBtn.style.display = "none";
        }
        ov.className += " qa-out";
        window.setTimeout(() => ov.parentNode && ov.parentNode.removeChild(ov), 240);
      } catch {
        if (ov.parentNode) ov.parentNode.removeChild(ov);
      }
    }
    purpleDone();
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape" || e.key === "Esc") finish();
    else if (e.key === "Tab") tabAt = now();
  }

  // A tap on the page ends the intro. If it landed on something not on screen
  // yet, it does not also follow that link.
  function onClick(e: MouseEvent) {
    if (done || !overlay) return;
    const t = e.target as Node;
    if (overlay.contains(t)) return;
    for (const it of items) {
      if (it.op < 0.5 && it.el.contains(t)) {
        e.preventDefault();
        break;
      }
    }
    finish();
  }

  function onFocus(e: FocusEvent) {
    if (overlay && !overlay.contains(e.target as Node) && tabAt && now() - tabAt < 500) finish();
  }

  function onHidden() {
    if (document.hidden && started) finish();
  }

  function onReduce(e: MediaQueryListEvent) {
    if (e.matches) finish();
  }

  function onViewport() {
    for (const t of typers) t.dirty = true;
  }

  function listen() {
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", finish);
    window.addEventListener("resize", onViewport);
    window.addEventListener("orientationchange", onViewport);
    if (vv) {
      vv.addEventListener("resize", onViewport);
      vv.addEventListener("scroll", onViewport);
    }
    reduceMq.addEventListener?.("change", onReduce);
  }

  function unlisten() {
    try {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", finish);
      window.removeEventListener("resize", onViewport);
      window.removeEventListener("orientationchange", onViewport);
      if (vv) {
        vv.removeEventListener("resize", onViewport);
        vv.removeEventListener("scroll", onViewport);
      }
      reduceMq.removeEventListener?.("change", onReduce);
    } catch {
      /* ignore */
    }
  }

  /* ---------- frame ---------- */

  function placeSkip() {
    if (!skipBtn) return;
    const cx = V.l - O.x + V.w / 2;
    const lift = Math.max(0, O.h - (V.b - O.y));
    const key = cx.toFixed(0) + "|" + lift.toFixed(0);
    if (key === skipPos) return;
    skipPos = key;
    skipBtn.style.left = cx.toFixed(1) + "px";
    skipBtn.style.marginBottom = lift.toFixed(1) + "px";
  }

  function frame() {
    if (done || !overlay) return;
    try {
      const t = now();
      DT = lastFrame ? Math.min(0.1, Math.max(0, (t - lastFrame) / 1000)) : 0;
      lastFrame = t;
      T += DT;

      if (boot!.forced && T < 0.8) toTop();
      // Read everything first.
      V = view();
      const or = overlay.getBoundingClientRect();
      O.x = or.left;
      O.y = or.top;
      O.w = or.width;
      O.h = or.height;
      for (const it of items) it.measure();
      if (hero && hero.getBoundingClientRect().bottom < V.t + 60) {
        finish();
        return;
      }

      // Then advance and write.
      let busy = false;
      for (const tr of tracks) {
        runTrack(tr);
        if (tr.i < tr.steps.length) busy = true;
      }
      // Resolve selection-box geometry before any DOM writes.
      for (const a of agents) {
        const b = a.box;
        if (b.follow && b.on) {
          const r = b.follow();
          b.x = r.x;
          b.y = r.y;
          b.w = r.w;
          b.h = r.h;
        }
      }
      for (const it of items) it.write();
      for (const e of edges) e.write();
      for (const a of agents) {
        writeAgent(a);
        if (a.op > 0.01 || a.box.op > 0.01) busy = true;
      }
      if (caretEl) {
        if (caret.on) {
          caretEl.style.height = caret.h.toFixed(1) + "px";
          caretEl.style.transform = `translate3d(${(caret.x - O.x).toFixed(1)}px,${(caret.y - O.y).toFixed(1)}px,0)`;
          caretEl.style.opacity = "1";
        } else {
          caretEl.style.opacity = "0";
        }
      }
      placeSkip();

      if (!busy) {
        window.dispatchEvent(new Event("quavok:assembly-complete"));
        finish();
        return;
      }
      raf = requestAnimationFrame(frame);
    } catch {
      finish();
    }
  }

  /* ---------- setup ---------- */

  function toTop() {
    if (!(window.pageYOffset > 0)) return;
    const st = docEl.style;
    const had = st.scrollBehavior;
    st.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    st.scrollBehavior = had;
    if (!docEl.getAttribute("style")) docEl.removeAttribute("style");
  }

  function visibleEnough(el: Element | null, frac = 0.4) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return false;
    const v = view();
    const h = Math.min(r.bottom, v.b) - Math.max(r.top, v.t);
    const w = Math.min(r.right, v.r) - Math.max(r.left, v.l);
    return w > 8 && h >= r.height * frac;
  }

  function peeking(el: Element | null) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const v = view();
    return r.top < v.b && r.bottom > v.t;
  }

  function isShown(el: Element) {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function setup() {
    if (reduceMq.matches) {
      release();
      purpleDone();
      return;
    }
    hero = document.querySelector<HTMLElement>("[data-intro-hero]");
    const h1 = hero && hero.querySelector<HTMLElement>("[data-intro-type]");
    const stage = hero && hero.querySelector<HTMLElement>("[data-intro-stage]");
    if (!hero || !h1) {
      release();
      purpleDone();
      return;
    }
    if (boot!.forced) toTop();
    if (!visibleEnough(h1)) {
      release();
      purpleDone();
      return;
    }

    const track = (el: Element | null) => {
      if (!el) return null;
      const it = new Item(el as HTMLElement);
      items.push(it);
      return it;
    };

    const h1It = track(h1)!;
    const h1Typer = new Typer(h1It);
    typers.push(h1Typer);

    const stageFull = !!stage && visibleEnough(stage, 0.72);
    const stagePeek = !!stage && !stageFull && peeking(stage);

    const nodeEls = stage ? Array.from(stage.querySelectorAll<HTMLElement>("[data-node]")) : [];
    const gateEl = stage?.querySelector<HTMLElement>("[data-gate]") || null;
    const excEl = stage?.querySelector<HTMLElement>("[data-exc]") || null;
    const titleEl = stage?.querySelector<HTMLElement>("[data-intro-title]") || null;
    const svg = stage
      ? Array.from(stage.querySelectorAll<SVGSVGElement>("svg.svg-wide, svg.svg-narrow")).find(isShown) || null
      : null;

    let nodes: Item[] = [];
    let gate: Item | null = null;
    let exc: Item | null = null;
    let title: Item | null = null;
    let titleTyper: Typer | null = null;
    const lines: Edge[] = [];
    let excLine: Edge | null = null;
    const late: Item[] = [];

    if (stageFull && nodeEls.length === 5 && svg) {
      nodes = nodeEls.map((el) => track(el)!);
      gate = track(gateEl);
      exc = track(excEl);
      title = track(titleEl);
      if (title) {
        titleTyper = new Typer(title);
        typers.push(titleTyper);
      }
      for (let i = 0; i < 4; i++) {
        const p = svg.querySelector<SVGPathElement>(`path[data-edge="${i}"]`);
        if (p) {
          const e = new Edge(p, false);
          lines.push(e);
          edges.push(e);
        }
      }
      const ep = svg.querySelector<SVGPathElement>('path[data-edge="exc"]');
      if (ep) {
        excLine = new Edge(ep, true);
        excLine.op = 0;
        edges.push(excLine);
      }
    } else if (stagePeek && stage) {
      // A phone sees only the top of the stage: no dragging, it fades in late.
      const it = new Item(stage);
      items.push(it);
      late.push(it);
    }

    // Hand over from the stylesheet hold to inline styles in one go.
    for (const it of items) it.write();
    for (const e of edges) e.write();
    release();

    // Overlay
    overlay = document.createElement("div");
    overlay.className = "qa-intro";
    skipBtn = document.createElement("button");
    skipBtn.type = "button";
    skipBtn.className = "qa-skip";
    skipBtn.textContent = "Skip intro";
    if (window.matchMedia("(pointer: fine)").matches) {
      const k = document.createElement("kbd");
      k.textContent = "Esc";
      skipBtn.appendChild(k);
    }
    skipBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      finish();
    });
    overlay.appendChild(skipBtn);
    const fx = document.createElement("div");
    fx.setAttribute("aria-hidden", "true");
    overlay.appendChild(fx);

    const mapping = makeAgent(SAND, undefined, "A place for everything.");
    const copy = makeAgent(PURPLE_SOFT, undefined, "Less jargon. More human.");
    const wiring = makeAgent(PURPLE, undefined, "Connecting the dots.");
    const review = makeAgent(SAND_LIGHT, "All in place", "A human gets the final say.");
    const layout = makeAgent(PURPLE_SOFT, undefined, "Putting things in place.");
    const art = makeAgent(SAND, undefined, "A little atmosphere.");
    agents = [mapping, copy, wiring, review, layout, art];
    for (const a of agents) fx.appendChild(a.box.el);
    caretEl = document.createElement("div");
    caretEl.className = "qa-caret";
    caretEl.style.setProperty("--qa", PURPLE_SOFT);
    fx.appendChild(caretEl);
    for (const a of agents) fx.appendChild(a.el);
    document.body.appendChild(overlay);

    // Where each cursor comes in from.
    const v = view();
    mapping.x = v.r + 40;
    mapping.y = v.t + v.h * 0.25;
    copy.x = v.l + v.w * 0.2;
    copy.y = v.t - 40;
    wiring.x = v.r + 40;
    wiring.y = v.b - 80;
    review.x = v.l - 40;
    review.y = v.b - 120;

    tracks = [];
    let total = 0;

    // Build the page's actual DOM: navigation, opening, copy, artwork and
    // the sections below the fold. No scroll hijack or replica screenshot.
    layout.x = v.l - 40; layout.y = v.t + 40;
    art.x = v.r + 40; art.y = v.t + v.h * .4;
    const pagePieces = Array.from(document.querySelectorAll<HTMLElement>("[data-site-piece], [data-site-section]"))
      .filter(el => isShown(el)).map(el => ({ item: track(el)!, section: el.hasAttribute("data-site-section"), essential: el.hasAttribute("data-site-essential") }));
    const visiblePieces = pagePieces.filter(piece => !piece.section);
    const sections = pagePieces.filter(piece => piece.section).map(piece => piece.item);
    const pageSteps: Step[] = [];
    for (const { item, essential } of visiblePieces.filter(piece => !["hero-art", "day-question", "day-answer"].some(className => piece.item.el.classList.contains(className)))) {
      if (essential) item.op = .4;
      pageSteps.push(move(layout, () => ({ x: clamp(item.home.x + 12, V.l + 12, V.r - 32), y: clamp(item.home.y + 12, V.t + 12, V.b - 80) }), .12));
      pageSteps.push({ d: .26, begin: () => { layout.down = true; layout.bubble.textContent = "Putting it in place."; }, run: u => {
        item.op = (essential ? .4 : 0) + (essential ? .6 : 1) * easeInOut(u);
        item.tx = -24 * (1 - easeInOut(u)); item.ty = 8 * (1 - easeInOut(u));
      }, end: () => { item.op = 1; item.tx = item.ty = 0; layout.down = false; } });
    }
    pageSteps.push(leave(layout, .3));
    tracks.push({at: .08, steps: pageSteps, i: 0, acc: 0});
    total = Math.max(total, .08 + sum(pageSteps));
    // Two cursors place the person's question and Rocket's answer as real
    // page elements. The hero changed; the agents-building-the-site stays.
    for (const [className, agent, at] of [["day-question", mapping, 1], ["day-answer", wiring, 1.8]] as const) {
      const message = visiblePieces.find(piece => piece.item.el.classList.contains(className))?.item;
      if (!message) continue;
      const option: DragOpt = {gx:.2, gy:.3, off:() => ({dx:48,dy:24})};
      const steps = [move(agent, () => grabPoint(message,option,1),.3), dragIn(agent,message,option,.6),leave(agent,.3)];
      tracks.push({at,steps,i:0,acc:0}); total=Math.max(total,at+sum(steps));
    }
    const artwork = visiblePieces.find(piece => piece.item.el.classList.contains("hero-art"))?.item;
    const artSteps: Step[] = [];
    if (artwork) {
      artSteps.push(move(art, () => ({x: V.r - 100, y: V.t + 140}), .35));
      if (v.w >= 900) artSteps.push(marquee(art, () => ({x: V.r * .55, y: V.t + 90, w: V.w * .4, h: Math.min(340, V.h * .5)}), .35));
      artSteps.push(popIn([artwork], .55));
    }
    artSteps.push(popIn(sections, 1.2), leave(art, .35));
    tracks.push({at: .55, steps: artSteps, i: 0, acc: 0});
    total = Math.max(total, .55 + sum(artSteps));
    for (const {item} of pagePieces) item.write();

    // Copy: selects the headline, types it, then names the workflow.
    const sCopy: Step[] = [];
    const h1Box = boxAround(h1It, 8);
    sCopy.push(move(copy, () => {
      const r = h1Box();
      return { x: r.x, y: r.y };
    }, 0.4));
    sCopy.push(marquee(copy, h1Box, 0.4));
    sCopy.push(typeText(copy, h1Typer, nodes.length ? 1.35 : 1.5, true));
    if (title && titleTyper) {
      const tt = titleTyper;
      sCopy.push(move(copy, () => ({ x: title!.home.x, y: title!.home.y + title!.home.h }), 0.3));
      sCopy.push(typeText(copy, tt, 0.5, false));
    }
    if (late.length) sCopy.push(popIn(late, 0.45));
    sCopy.push(wait(0.15), leave(copy, 0.35));
    const aCopy = 0.3;
    tracks.push({ at: aCopy, steps: sCopy, i: 0, acc: 0 });
    total = Math.max(total, aCopy + sum(sCopy));

    if (nodes.length === 5) {
      // Mapping: places the five steps, each from its own side.
      const stageRectNow = () => stage!.getBoundingClientRect();
      const sMap: Step[] = [];
      const lands: number[] = [];
      const aMap = 0.15;
      let t = aMap;
      nodes.forEach((it, i) => {
        const opt: DragOpt = {
          gx: 0.32,
          gy: 0.5,
          off: (h) => {
            const sr = stageRectNow();
            const cx = h.x + h.w / 2;
            const side = i === 4 ? 0 : cx < sr.left + sr.width / 2 ? -1 : 1;
            return side === 0 ? { dx: 0, dy: 56 } : { dx: side * 64, dy: 24 };
          },
        };
        const dm = i === 0 ? 0.28 : 0.18;
        const dd = 0.36;
        sMap.push(move(mapping, () => grabPoint(it, opt, 1), dm));
        sMap.push(dragIn(mapping, it, opt, dd));
        t += dm + dd;
        lands.push(t);
      });
      sMap.push(wait(0.1), leave(mapping, 0.35));
      tracks.push({ at: aMap, steps: sMap, i: 0, acc: 0 });
      total = Math.max(total, aMap + sum(sMap));

      // Wiring: pulls each connector once both ends exist; adds the route to
      // a person after Qualify and the approval gate before Follow-up.
      const sWire: Step[] = [];
      const aWire = 0.9;
      let tw = aWire;
      const queue: { e: Edge; ready: number; after?: () => void; d: number }[] = [];
      const show = (it: Item | null) => () => {
        if (it) {
          it.op = 1;
          it.s = 1;
        }
      };
      if (lines[0]) queue.push({ e: lines[0], ready: lands[1], d: 0.26 });
      if (lines[1]) queue.push({ e: lines[1], ready: lands[2], d: 0.3 });
      if (excLine) queue.push({ e: excLine, ready: lands[2], d: 0.24, after: show(exc) });
      if (lines[2]) queue.push({ e: lines[2], ready: lands[3], d: 0.26, after: show(gate) });
      if (lines[3]) queue.push({ e: lines[3], ready: lands[4], d: 0.28 });
      for (const q of queue) {
        const dm = 0.16;
        const start = Math.max(tw + dm, q.ready);
        if (start - dm - tw > 0.001) sWire.push(wait(start - dm - tw));
        const e = q.e;
        sWire.push(move(wiring, () => e.point(0), dm));
        sWire.push(drawEdge(wiring, e, q.d, q.after));
        tw = start + q.d;
      }
      sWire.push(wait(0.05), leave(wiring, 0.32));
      tracks.push({ at: aWire, steps: sWire, i: 0, acc: 0 });
      total = Math.max(total, aWire + sum(sWire));

      // Review: selects the finished stage and approves the scope.
      const nav = document.querySelector(".site-header");
      const stageRect = (): Rect => {
        const r = stage!.getBoundingClientRect();
        const vw = V || view();
        let top = vw.t + 8;
        if (nav) top = Math.max(top, nav.getBoundingClientRect().bottom + 8);
        const x1 = Math.max(r.left - 8, vw.l + 8);
        const y1 = Math.max(r.top - 8, top);
        const x2 = Math.min(r.right + 8, vw.r - 8);
        const y2 = Math.min(r.bottom + 8, vw.b - 74);
        return { x: x1, y: y1, w: Math.max(40, x2 - x1), h: Math.max(40, y2 - y1) };
      };
      const sRev: Step[] = [
        move(review, () => {
          const r = stageRect();
          return { x: r.x, y: r.y };
        }, 0.35),
        marquee(review, stageRect, 0.45),
        wait(0.08),
        approve(review, 0.62),
        leave(review, 0.32),
      ];
      const aRev = Math.max(1.5, tw - 0.45);
      tracks.push({ at: aRev, steps: sRev, i: 0, acc: 0 });
      total = Math.max(total, aRev + sum(sRev));
    }

    // The benefit-led hero is assembled as a conversation, then checked.
    if (stage?.hasAttribute("data-intro-conversation")) {
      const bounds = (): Rect => {
        const target = visibleEnough(stage,.5) ? stage : hero?.querySelector(".hero-copy") || stage;
        const r = target.getBoundingClientRect();
        const y = Math.max(80,r.top);
        return {x:Math.max(8,r.left), y, w:Math.min(r.width,V.w-16), h:Math.max(40,Math.min(r.bottom,V.b-72)-y)};
      };
      const steps: Step[] = [move(review, () => ({x:bounds().x,y:bounds().y}), .25), marquee(review,bounds,.4), approve(review,.5),leave(review,.3)];
      tracks.push({at:2.9,steps,i:0,acc:0});
      total=Math.max(total,2.9+sum(steps));
    }

    listen();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => onViewport()).catch(() => {});
    }

    function go() {
      if (done || started) return;
      started = true;
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {
        /* ignore */
      }
      watchdog = window.setTimeout(finish, (total + 2.5) * 1000);
      stall = window.setInterval(() => {
        if (lastFrame && now() - lastFrame > 1500) finish();
      }, 500);
      lastFrame = 0;
      raf = requestAnimationFrame(frame);
      // If no frame arrives at all, do not leave the hero empty.
      window.setTimeout(() => {
        if (!lastFrame) finish();
      }, 1500);
    }

    if (document.hidden) {
      const onShow = () => {
        if (document.hidden) return;
        document.removeEventListener("visibilitychange", onShow);
        go();
      };
      document.addEventListener("visibilitychange", onShow);
    } else {
      go();
    }
  }

  try {
    setup();
  } catch {
    try {
      finish();
    } catch {
      /* ignore */
    }
    for (const it of items) it.restore();
    for (const e of edges) e.restore();
    release();
    if (overlay && (overlay as HTMLDivElement).parentNode) (overlay as HTMLDivElement).remove();
  }

  return finish;
}
