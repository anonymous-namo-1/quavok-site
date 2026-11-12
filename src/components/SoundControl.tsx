"use client";

import { useEffect, useState } from "react";
import { primeVoice } from "@/lib/voice";
import { activateSound, pauseSound, playSound, setSoundEnabled, soundEnabled } from "@/lib/sound";

const KEY = "quavok-sound-effects";
export function SoundControl() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    try { const saved = localStorage.getItem(KEY) === "on"; setOn(saved); setSoundEnabled(saved); if (saved) void activateSound(); } catch { /* Sound is optional. */ }
    const unlock = () => { if (soundEnabled()) { void activateSound(); void primeVoice(); } };
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("button,a,summary") : null;
      if (!target || target.closest(".site-sound") || !soundEnabled()) return;
      const label = target.getAttribute("aria-label") || target.textContent || "";
      playSound(/close|minimise|skip|pause/i.test(label) ? "close" : target.matches("summary") ? "open" : "select");
    };
    const called = () => { playSound("call"); };
    const reply = (event: Event) => { if (event instanceof CustomEvent && event.detail === true) playSound("reply"); };
    const complete = () => playSound("done");
    const confetti = () => playSound("celebrate");
    const preference = (event:Event) => { if(event instanceof CustomEvent) setOn(event.detail===true); };
    const visibility = () => { if (document.hidden) { pauseSound(); } else if (soundEnabled()) void activateSound(); };
    document.addEventListener("pointerdown", unlock, { passive:true });
    document.addEventListener("keydown", unlock);
    document.addEventListener("click", click, true);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("quavok:sound-change",preference);
    window.addEventListener("quavok:rocket-call", called);
    window.addEventListener("quavok:rocket-talk", reply);
    window.addEventListener("quavok:assembly-complete", complete);
    window.addEventListener("quavok:confetti", confetti);
    return () => {
      pauseSound();
      document.removeEventListener("pointerdown", unlock); document.removeEventListener("keydown", unlock);
      document.removeEventListener("click", click, true); document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("quavok:sound-change",preference);
      window.removeEventListener("quavok:rocket-call", called); window.removeEventListener("quavok:rocket-talk", reply);
      window.removeEventListener("quavok:assembly-complete", complete);
      window.removeEventListener("quavok:confetti", confetti);
    };
  }, []);
  const toggle = async () => {
    const next = !on;
    setSoundEnabled(next); setOn(next);
    try { localStorage.setItem(KEY,next ? "on" : "off"); } catch { /* Storage is optional. */ }
    if (next && await activateSound()) {
      await primeVoice(); playSound("open");
    }
  };
  return <button className="site-sound" type="button" onClick={toggle} aria-label={on ? "Mute website sound" : "Enable website sound"} aria-pressed={on} title={on ? "Mute website sound" : "Enable website sound"}>
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z" />{on ? <path d="M17 8q5 4 0 8M20 5q7 7 0 14" /> : <path d="m17 9 5 6m0-6-5 6" />}</svg><span>Build with sound</span>
  </button>;
}
