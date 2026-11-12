"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

type Line = { t: string; text: string; ok?: boolean; hold?: boolean; pause?: number };

// A run, explained: one evening of one illustrative workflow, in business
// language. It includes a hold for your approval. Not live activity.
const LINES: Line[] = [
  { t: "18:02", text: "New enquiry received from the website form" },
  { t: "18:02", text: "Checked against your criteria: a good fit", ok: true },
  { t: "18:03", text: "Customer details saved for your team", ok: true },
  { t: "18:03", text: "Follow-up drafted in your approved wording", hold: true, pause: 1.3 },
  { t: "18:41", text: "You approved. Follow-up sent", ok: true },
  { t: "21:00", text: "Evening summary sent to you", ok: true },
];

export function RunTrace({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(LINES.length);
  const [play, setPlay] = useState(false);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const start = useCallback(() => {
    clear();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlay(false);
      setShown(LINES.length);
      return;
    }
    setPlay(true);
    setShown(0);
    let at = 250;
    LINES.forEach((l, i) => {
      timers.current.push(window.setTimeout(() => setShown(i + 1), at));
      at += 420 + (l.pause || 0) * 1000;
    });
    timers.current.push(window.setTimeout(() => setPlay(false), at + 200));
  }, []);

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!el || reduce.matches || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;
    setPlay(true);
    setShown(0);
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { threshold: 0.5 },
    );
    const finish = () => {
      if (!reduce.matches) return;
      io.disconnect();
      clear();
      setPlay(false);
      setShown(LINES.length);
    };
    reduce.addEventListener("change", finish);
    io.observe(el);
    return () => {
      reduce.removeEventListener("change", finish);
      io.disconnect();
      clear();
    };
  }, [start]);

  const holding = play && shown === 4;

  return (
    <div ref={ref} className={`panel-dark on-dark trace p-5 sm:p-6 ${className}`} data-play={play}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[11.5px] tracking-[0.08em] text-stage-mute uppercase">Run · Lead follow-up</p>
        <button
          type="button"
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-stage-line px-3 text-[12.5px] font-semibold text-stage-text hover:border-stage-mute"
          onClick={start}
        >
          <Icon name="replay" width={13} height={13} />
          Replay
        </button>
      </div>
      <ol>
        {LINES.map((l, i) => {
          const isShown = i < shown;
          return (
            <li key={i} data-shown={isShown} data-active={play && i === shown - 1 && i !== LINES.length - 1}>
              <time>{l.t}</time>
              <span className="line">
                {l.ok ? <Icon name="check" width={14} height={14} className="ok" strokeWidth={2.2} /> : null}
                <span>{l.text}</span>
                {l.hold ? (
                  <span className="hold">
                    <i aria-hidden="true" />
                    {holding ? "Waiting on you" : "Held for your approval"}
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
