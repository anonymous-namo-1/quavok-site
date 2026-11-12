"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { SCENARIOS, WHO_LABEL, type Who } from "@/lib/workflows";
import { WorkflowGraph, type GraphSelection } from "./WorkflowGraph";

// Read-only workflow graph. Visitors can inspect a step; they cannot edit,
// connect or deploy anything. Edges draw once as the graph scrolls in
// (CSS scroll timelines; an IntersectionObserver fallback elsewhere).
export function ScenarioGraph() {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<GraphSelection>(null);
  const [swapped, setSwapped] = useState(false);
  const [draw, setDraw] = useState<"idle" | "wait" | "play">("idle");
  const wrapRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = SCENARIOS[idx];

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const supports = typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: view()");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (supports || reduce || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return;
    setDraw("wait");
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          io.disconnect();
          setDraw("play");
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pick = (i: number) => {
    if (i === idx) return;
    setIdx(i);
    setSel(null);
    setSwapped(true);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = SCENARIOS.length;
    let next = -1;
    if (e.key === "ArrowRight") next = (idx + 1) % n;
    else if (e.key === "ArrowLeft") next = (idx - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    pick(next);
    tabRefs.current[next]?.focus();
  };

  let title = "Select any step";
  let body = "Each box is one step of the process. Select one to see what happens there and who is responsible.";
  let who: Who | null = null;
  if (sel?.kind === "step") {
    const st = s.steps[sel.i];
    title = `${String(sel.i + 1).padStart(2, "0")} · ${st.title}`;
    body = st.explain;
    who = st.who;
  } else if (sel?.kind === "gate") {
    title = "Approval gate";
    body = s.gate.explain;
    who = "you";
  } else if (sel?.kind === "exc") {
    title = "Route to a person";
    body = s.exception.explain;
    who = "person";
  }

  return (
    <div className="stage" ref={wrapRef}>
      <div className="stage-head flex-wrap">
        <div role="tablist" aria-label="Example workflows" className="tabs">
          {SCENARIOS.map((sc, i) => (
            <button
              key={sc.id}
              ref={(b) => {
                tabRefs.current[i] = b;
              }}
              id={`sc-tab-${sc.id}`}
              role="tab"
              type="button"
              aria-selected={i === idx}
              aria-controls="sc-panel"
              tabIndex={i === idx ? 0 : -1}
              onClick={() => pick(i)}
              onKeyDown={onKey}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>
      <div id="sc-panel" role="tabpanel" aria-labelledby={`sc-tab-${s.id}`} className="grid lg:grid-cols-[1fr_17rem]">
        <div className="stage-body grid-bg">
          <WorkflowGraph
            key={s.id}
            scenario={s}
            className={`graph--scroll ${swapped ? "graph--swap" : ""}`}
            selected={sel}
            onSelect={setSel}
          />
          {draw !== "idle" ? <DrawFlag state={draw} /> : null}
        </div>
        <div className="flex flex-col gap-4 border-t border-line bg-card p-5 lg:border-t-0 lg:border-l">
          <div aria-live="polite" className="min-h-[9.5rem]">
            <p className="font-display text-[19px] font-semibold tracking-tight">{title}</p>
            {who ? <p className={`who who--${who} mt-2`}>{WHO_LABEL[who]}</p> : null}
            <p className="t-body mt-2 text-[15px] leading-relaxed">{body}</p>
          </div>
          <ul className="mt-auto space-y-2 border-t border-line pt-4 text-[13px]">
            <li className="who who--auto">Runs automatically, managed by Quavok</li>
            <li className="who who--you">You approve</li>
            <li className="who who--person">A person on your team handles it</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Applies the fallback draw state to the graph without re-rendering it.
function DrawFlag({ state }: { state: "wait" | "play" }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const g = ref.current?.parentElement?.querySelector<HTMLElement>(".graph");
    if (g) g.dataset.draw = state;
  }, [state]);
  return <span ref={ref} hidden />;
}
