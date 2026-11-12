"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

// The one magnetic control on the site: a slight pull toward a fine pointer.
// Touch, reduced motion and the running intro get a plain button.
export function Magnetic({ href, className = "", children, ...props }: ComponentPropsWithoutRef<"a"> & { href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    const R = 72;
    const MAX = 8;

    const write = () => {
      raf = 0;
      el.style.setProperty("--mx", `${tx.toFixed(2)}px`);
      el.style.setProperty("--my", `${ty.toFixed(2)}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (reduce.matches || !fine.matches || document.querySelector(".qa-intro")) { reset(); return; }
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const near = Math.abs(dx) < r.width / 2 + R && Math.abs(dy) < r.height / 2 + R;
      tx = near ? Math.max(-MAX, Math.min(MAX, dx * 0.22)) : 0;
      ty = near ? Math.max(-MAX, Math.min(MAX, dy * 0.3)) : 0;
      if (!raf) raf = requestAnimationFrame(write);
    };
    const reset = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(write);
    };
    const zone = el.parentElement || el;
    zone.addEventListener("pointermove", onMove);
    zone.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", reset);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <a {...props} ref={ref} href={href} className={`magnetic ${className}`}>
      <span className="magnetic-inner">{children}</span>
    </a>
  );
}
