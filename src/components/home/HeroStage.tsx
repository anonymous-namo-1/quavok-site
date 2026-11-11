"use client";

import { useEffect, useRef, useState } from "react";
import { WorkflowGraph } from "../graph/WorkflowGraph";
import { SCENARIOS } from "@/lib/workflows";
import { INTRO_DONE_EVENT } from "@/lib/intro/engine";
import { Icon } from "../Icon";

// The finished hero workflow. After the intro (or straight away when there is
// none) one signal travels through it once, lighting each step as it passes.
export function HeroStage() {
  const scenario = SCENARIOS[0];
  const ref = useRef<HTMLElement>(null);
  const [hot, setHot] = useState<number | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || !("IntersectionObserver" in window)) return;

    let raf = 0;
    let timer = 0;
    let cancelled = false;
    const probes: SVGPathElement[] = [];

    const run = () => {
      const svg = Array.from(root.querySelectorAll<SVGSVGElement>("svg.svg-wide, svg.svg-narrow")).find(
        (s) => s.getBoundingClientRect().width > 0,
      );
      if (!svg) return;
      const dot = svg.querySelector<SVGCircleElement>(".packet");
      const paths = [0, 1, 2, 3].map((i) => svg.querySelector<SVGPathElement>(`path[data-edge="${i}"]`));
      if (!dot || paths.some((p) => !p)) return;
      const segs = paths.map((p) => {
        const q = document.createElementNS("http://www.w3.org/2000/svg", "path");
        q.setAttribute("d", p!.getAttribute("d") || "");
        q.style.visibility = "hidden";
        svg.appendChild(q);
        probes.push(q);
        return { q, len: q.getTotalLength() };
      });
      const SEG = 0.62;
      const PAUSE = 0.28;
      const per = SEG + PAUSE;
      const total = per * segs.length + 0.5;
      let t0 = 0;
      setHot(0);
      const frame = (ts: number) => {
        if (cancelled) return;
        if (!t0) t0 = ts;
        const t = (ts - t0) / 1000;
        if (t >= total || document.hidden || reduce.matches) {
          dot.style.opacity = "0";
          setHot(null);
          return;
        }
        const k = Math.min(segs.length - 1, Math.floor(t / per));
        const lt = t - k * per;
        if (lt < PAUSE) {
          dot.style.opacity = "0";
          setHot(k);
        } else {
          const u = Math.min(1, (lt - PAUSE) / SEG);
          const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
          const p = segs[k].q.getPointAtLength(segs[k].len * e);
          dot.setAttribute("cx", p.x.toFixed(1));
          dot.setAttribute("cy", p.y.toFixed(1));
          dot.style.opacity = "1";
          if (u >= 1) setHot(k + 1);
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    const whenVisible = () => {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            timer = window.setTimeout(run, 450);
          }
        },
        { threshold: 0.5 },
      );
      io.observe(root);
      return io;
    };

    let io: IntersectionObserver | null = null;
    const onDone = () => {
      if (!io) io = whenVisible();
    };
    if (window.__qaIntroDone || !document.documentElement.classList.contains("qa-pre")) {
      // No intro on this load (or it already finished).
      timer = window.setTimeout(() => {
        if (window.__qaIntroDone || !document.querySelector(".qa-intro")) onDone();
      }, 60);
    }
    window.addEventListener(INTRO_DONE_EVENT, onDone);

    return () => {
      cancelled = true;
      window.removeEventListener(INTRO_DONE_EVENT, onDone);
      window.clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
      probes.forEach((p) => p.remove());
    };
  }, []);

  return (
    <figure ref={ref} className="stage" data-intro-stage aria-labelledby="hero-stage-cap">
      <div className="stage-head">
        <span className="stage-title" data-intro-title data-intro-hold>
          {scenario.title}
        </span>
        <span className="stage-status">
          <i aria-hidden="true" />
          Run by Quavok
        </span>
      </div>
      <div className="stage-body grid-bg">
        <WorkflowGraph scenario={scenario} introHold hot={hot} />
      </div>
      <figcaption id="hero-stage-cap" className="stage-foot">
        <span>Illustrative workflow. Built and run by Quavok, approved by you.</span>
        <a className="inline-flex items-center gap-1.5 font-semibold text-ink" href="/?intro=1">
          <Icon name="replay" width={14} height={14} />
          Replay the build
        </a>
      </figcaption>
    </figure>
  );
}
