"use client";

import { useEffect } from "react";
import { startIntro } from "@/lib/intro/engine";

// Starts the agent-cursor intro after hydration. The timer means a
// development double-mount cancels the first attempt instead of the intro.
export function HeroIntro() {
  useEffect(() => {
    let stop: (() => void) | null = null;
    const t = window.setTimeout(() => {
      stop = startIntro();
    }, 0);
    return () => {
      window.clearTimeout(t);
      if (stop) stop();
    };
  }, []);
  return null;
}
