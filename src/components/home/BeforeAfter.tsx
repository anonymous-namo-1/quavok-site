"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

type Lane = "handled" | "you" | "person";
type Task = { id: string; title: string; before: string; after: string; lane: Lane; r: number; dx: number };

// The same six tasks. Today they sit in one pile on your team's plate.
// With Quavok they settle into lanes. Illustrative: no metrics, no clocks.
const TASKS: Task[] = [
  { id: "lead", title: "New website enquiry", before: "Copied from inbox to a sheet", after: "Qualified and logged to CRM", lane: "handled", r: -2.2, dx: 6 },
  { id: "status", title: "“Is my order ready?”", before: "Someone checks and replies", after: "Answered from order status", lane: "handled", r: 1.8, dx: -8 },
  { id: "invoice", title: "Supplier invoice", before: "Typed into accounts by hand", after: "Fields read and entered", lane: "handled", r: -1.2, dx: 10 },
  { id: "report", title: "Weekly numbers", before: "Pulled together every Friday", after: "Report assembled and sent", lane: "handled", r: 2.4, dx: -4 },
  { id: "quote", title: "Quote to chase", before: "On someone’s mental to-do list", after: "Follow-up drafted for your OK", lane: "you", r: -2.8, dx: 4 },
  { id: "complaint", title: "Unhappy customer", before: "Buried in the same inbox", after: "Flagged straight to a person", lane: "person", r: 1.4, dx: -10 },
];

const LANES: { id: Lane; title: string; dot: string }[] = [
  { id: "handled", title: "Handled automatically", dot: "#514f56" },
  { id: "you", title: "Waiting on you", dot: "#0b0910" },
  { id: "person", title: "With a person", dot: "#514f56" },
];

type State = "before" | "after";

export function BeforeAfter() {
  const [state, setState] = useState<State>("after");
  const boardRef = useRef<HTMLDivElement>(null);
  const rects = useRef<Map<string, DOMRect>>(new Map());
  const autoPlayed = useRef(false);
  const userTouched = useRef(false);

  const snapshot = () => {
    const m = new Map<string, DOMRect>();
    boardRef.current?.querySelectorAll<HTMLElement>("[data-task]").forEach((el) => m.set(el.dataset.task!, el.getBoundingClientRect()));
    rects.current = m;
  };

  const go = (next: State) => {
    if (next === state) return;
    snapshot();
    setState(next);
  };

  // FLIP: tasks start where they were and glide to where they are now.
  useLayoutEffect(() => {
    const prev = rects.current;
    if (!prev.size) return;
    rects.current = new Map();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    boardRef.current?.querySelectorAll<HTMLElement>("[data-task]").forEach((el, i) => {
      const a = prev.get(el.dataset.task!);
      if (!a || !el.animate) return;
      const b = el.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
        duration: 680,
        delay: i * 45,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      });
    });
  }, [state]);

  // Show the pile first, then let it settle once as the board comes into view.
  useEffect(() => {
    const el = boardRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!el || reduce.matches || !("IntersectionObserver" in window)) return;
    let timer = 0;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setState("before");
    const io = new IntersectionObserver(
      (es) => {
        if (!es.some((e) => e.isIntersecting) || autoPlayed.current) return;
        autoPlayed.current = true;
        io.disconnect();
        timer = window.setTimeout(() => {
          if (userTouched.current) return;
          snapshot();
          setState("after");
        }, 900);
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    const finish = () => {
      if (!reduce.matches) return;
      io.disconnect();
      window.clearTimeout(timer);
      el.querySelectorAll("[data-task]").forEach((task) => task.getAnimations().forEach((a) => a.cancel()));
      setState("after");
    };
    reduce.addEventListener("change", finish);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      reduce.removeEventListener("change", finish);
    };
  }, []);

  const pile = TASKS.filter(() => state === "before");

  return (
    <div className="ba">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="tabs" role="group" aria-label="Compare">
          <button
            type="button"
            aria-pressed={state === "before"}
            onClick={() => {
              userTouched.current = true;
              go("before");
            }}
          >
            Today
          </button>
          <button
            type="button"
            aria-pressed={state === "after"}
            onClick={() => {
              userTouched.current = true;
              go("after");
            }}
          >
            With Quavok
          </button>
        </div>
        <span className="tag">Illustrative process comparison</span>
      </div>

      <div ref={boardRef} className="ba-board" aria-live="polite">
        <section className="ba-col ba-col--pile" aria-label="On your team's plate">
          <h3>
            <span className="dot" style={{ background: "#c4bfa8" }} aria-hidden="true" />
            On your team’s plate
          </h3>
          <div className="ba-list">
            {pile.length ? (
              pile.map((t, k) => (
                <TaskCard key={t.id} t={t} state={state} style={{ ["--k" as string]: k, ["--r" as string]: `${t.r}deg`, ["--dx" as string]: `${t.dx}px` } as CSSProperties} />
              ))
            ) : (
              <p className="ba-empty">Nothing repetitive left here. Your team keeps the work that needs them.</p>
            )}
          </div>
        </section>
        {LANES.map((l) => {
          const list = state === "after" ? TASKS.filter((t) => t.lane === l.id) : [];
          const n = TASKS.filter((t) => t.lane === l.id).length;
          return (
            <section key={l.id} className="ba-col ba-col--lane" style={{ ["--n" as string]: n } as CSSProperties} aria-label={l.title}>
              <h3>
                <span className="dot" style={{ background: l.dot }} aria-hidden="true" />
                {l.title}
              </h3>
              <div className="ba-list">
                {list.map((t) => (
                  <TaskCard key={t.id} t={t} state={state} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function TaskCard({ t, state, style }: { t: Task; state: State; style?: CSSProperties }) {
  return (
    <div className="task" data-task={t.id} style={style}>
      <strong>{t.title}</strong>
      <span>{state === "before" ? t.before : t.after}</span>
    </div>
  );
}
