"use client";

import { useEffect } from "react";
import { startIntro } from "@/lib/intro/engine";
import { INTRO_KEY } from "@/lib/intro/boot";

export function HeroIntro() {
  useEffect(() => {
    let stop: (() => void) | null = null;
    let started = false;
    const launch = () => { if (started) return; started = true; window.clearTimeout(timer); stop = startIntro(); };
    const skip = () => {
      if (!document.documentElement.classList.contains("qa-prologue")) return;
      window.clearTimeout(window.__qaIntro?.t);
      document.documentElement.classList.remove("qa-prologue", "qa-pre");
      try { sessionStorage.setItem(INTRO_KEY,"1"); } catch { /* Optional storage. */ }
      launch();
      window.dispatchEvent(new Event("quavok:build-start"));
    };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape" || event.key === "Tab") skip(); };
    const timer = window.setTimeout(launch, document.documentElement.classList.contains("qa-prologue") ? 1600 : 0);
    window.addEventListener("quavok:skip-prologue",skip);
    window.addEventListener("quavok:start-build",launch);
    document.addEventListener("keydown",key);
    return () => { window.clearTimeout(timer); stop?.(); window.removeEventListener("quavok:skip-prologue",skip); window.removeEventListener("quavok:start-build",launch); document.removeEventListener("keydown",key); };
  }, []);
  return <button className="qa-launch-skip" type="button" onClick={() => window.dispatchEvent(new Event("quavok:skip-prologue"))}>Skip intro</button>;
}
