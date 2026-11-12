"use client";

import { useEffect, useRef, useState } from "react";
import { activateSound, pauseSound, playSound, setSoundEnabled, soundEnabled } from "@/lib/sound";

const KEY = "quavok-sound-effects";
export function SoundControl() {
  const [on, setOn] = useState(false);
  const typing = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stopTyping = () => { typing.current.forEach(clearTimeout); typing.current = []; };
  useEffect(() => {
    try { const saved = localStorage.getItem(KEY) === "on"; setOn(saved); setSoundEnabled(saved); if (saved) void activateSound(); } catch { /* Sound is optional. */ }
    const unlock = () => { if (soundEnabled()) void activateSound(); };
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("button,a,summary") : null;
      if (!target || target.closest(".site-sound") || !soundEnabled()) return;
      const label = target.getAttribute("aria-label") || target.textContent || "";
      playSound(/close|minimise|skip|pause/i.test(label) ? "close" : target.matches("summary") ? "open" : "select");
    };
    const called = () => { stopTyping(); playSound("call"); };
    const reply = (event: Event) => { if (event instanceof CustomEvent && event.detail === true) playSound("reply"); };
    const changed = () => { stopTyping(); };
    const typed = (event: Event) => {
      stopTyping();
      if (!soundEnabled() || !(event instanceof CustomEvent) || typeof event.detail !== "string" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const count = Math.min(32, event.detail.length);
      for (let i = 0; i < count; i++) typing.current.push(setTimeout(() => playSound("key"), i * 28));
    };
    const complete = () => playSound("done");
    const visibility = () => { if (document.hidden) { stopTyping(); pauseSound(); } else if (soundEnabled()) void activateSound(); };
    document.addEventListener("pointerdown", unlock, { passive:true });
    document.addEventListener("keydown", unlock);
    document.addEventListener("click", click, true);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("quavok:rocket-call", called);
    window.addEventListener("quavok:rocket-talk", reply);
    window.addEventListener("quavok:rocket-reaction", changed);
    window.addEventListener("quavok:text-typing", typed);
    window.addEventListener("quavok:assembly-complete", complete);
    return () => {
      stopTyping(); pauseSound();
      document.removeEventListener("pointerdown", unlock); document.removeEventListener("keydown", unlock);
      document.removeEventListener("click", click, true); document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("quavok:rocket-call", called); window.removeEventListener("quavok:rocket-talk", reply);
      window.removeEventListener("quavok:rocket-reaction", changed); window.removeEventListener("quavok:text-typing", typed);
      window.removeEventListener("quavok:assembly-complete", complete);
    };
  }, []);
  const toggle = async () => {
    const next = !on;
    stopTyping(); setSoundEnabled(next); setOn(next);
    try { localStorage.setItem(KEY,next ? "on" : "off"); } catch { /* Storage is optional. */ }
    if (next && await activateSound()) {
      playSound("open");
      if (document.documentElement.classList.contains("qa-prologue")) window.dispatchEvent(new Event("quavok:start-build"));
    }
  };
  return <button className="site-sound" type="button" onClick={toggle} aria-label={on ? "Mute sound effects" : "Enable sound effects"} aria-pressed={on} title={on ? "Mute sound effects" : "Enable sound effects"}>
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z" />{on ? <path d="M17 8q5 4 0 8M20 5q7 7 0 14" /> : <path d="m17 9 5 6m0-6-5 6" />}</svg><span>Build with sound</span>
  </button>;
}
