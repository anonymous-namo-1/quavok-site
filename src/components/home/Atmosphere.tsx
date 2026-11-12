"use client";

import { useEffect, useRef, useState } from "react";
import { INTRO_DONE_EVENT } from "@/lib/intro/engine";

// A locally hosted motion study of the original artwork. The still is the
// default; no video bytes are requested for reduced-motion or data saving.
export function Atmosphere() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const frame = root.current;
    const film = video.current;
    if (!frame || !film) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = "connection" in navigator ? navigator.connection : null;
    const savesData = !!connection && typeof connection === "object" && "saveData" in connection && connection.saveData === true;
    let inView = false;
    let introDone = window.__qaIntroDone || !document.documentElement.classList.contains("qa-pre");
    let active = true;
    const sync = () => {
      setReduced(motion.matches || savesData);
      if (!enabled || motion.matches || savesData || !inView || !introDone || document.hidden) {
        film.pause(); setPlaying(false); return;
      }
      if (!film.getAttribute("src")) film.src = "/media/paper-orchestration.mp4";
      film.play().then(() => { if (active) setPlaying(true); }).catch(() => { if (active) setPlaying(false); });
    };
    const onIntro = () => { introDone = true; sync(); };
    const observer = new IntersectionObserver(entries => { inView = entries.some(entry => entry.isIntersecting); sync(); }, { threshold: .2 });
    observer.observe(frame);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener(INTRO_DONE_EVENT, onIntro);
    sync();
    return () => {
      active = false; film.pause(); observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener(INTRO_DONE_EVENT, onIntro);
    };
  }, [enabled]);

  return <figure ref={root} className="atmosphere" data-rv>
    <video ref={video} poster="/media/paper-orchestration.webp" muted loop playsInline preload="none" aria-hidden="true" />
    <figcaption>
      {!reduced && <button type="button" onClick={() => setEnabled(value => !value)} aria-label={enabled ? "Pause background film" : "Play background film"} aria-pressed={enabled}>
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">{enabled ? <path d="M6 4v12M14 4v12" /> : <path d="m6 4 10 6-10 6Z" />}</svg>{enabled && playing ? "Pause film" : enabled ? "Motion on" : "Play film"}
      </button>}
    </figcaption>
  </figure>;
}
