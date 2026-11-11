"use client";

import { useEffect } from "react";

// Section entrances: a short blur + rise + stagger, once.
// Fail-open: content is visible in the HTML. Only elements that are below the
// fold when this runs are hidden (.rv-wait) and then revealed (.rv-in).
export function MotionRuntime() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || !("IntersectionObserver" in window)) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-rv]"));
    const vh = window.innerHeight;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          el.classList.remove("rv-wait");
          el.classList.add("rv-in");
          el.addEventListener(
            "animationend",
            () => {
              el.classList.remove("rv-in");
            },
            { once: true },
          );
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92) continue; // already on screen: leave it alone
      el.classList.add("rv-wait");
      io.observe(el);
    }

    // Stagger siblings that share a [data-rv-group] parent.
    document.querySelectorAll<HTMLElement>("[data-rv-group]").forEach((g) => {
      Array.from(g.querySelectorAll<HTMLElement>(":scope > [data-rv]")).forEach((c, i) => {
        c.style.setProperty("--i", String(Math.min(i, 8)));
      });
    });

    const onReduce = () => {
      if (!reduce.matches) return;
      io.disconnect();
      document.querySelectorAll(".rv-wait").forEach((el) => el.classList.remove("rv-wait"));
    };
    reduce.addEventListener?.("change", onReduce);

    return () => {
      io.disconnect();
      reduce.removeEventListener?.("change", onReduce);
      document.querySelectorAll(".rv-wait").forEach((el) => el.classList.remove("rv-wait"));
    };
  }, []);

  return null;
}
