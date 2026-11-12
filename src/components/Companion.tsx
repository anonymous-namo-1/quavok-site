"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "quavok-rocket-minimised";
const INTRO = "Hi, I’m Rocket. What would you like to know?";
const QUESTIONS = [
  { label: "What does Quavok do?", answer: "Quavok designs, builds and runs automations for your repetitive work. You explain the process and approve the important decisions." },
  { label: "Do I build anything?", answer: "No technical homework. Quavok handles the build, deployment and ongoing care." },
  { label: "What is Rocket?", answer: "Rocket talks to your Quavok-built automations and forwards new requests to the team. The proactive add-on and desktop/mobile apps are in development." },
  { label: "How do I start?", answer: "Bring one repetitive process to a discovery conversation. The team will explore it with you." },
];
const SECTION_HINTS: Record<string, string> = {
  automate: "A little less busywork.",
  how: "You approve. Quavok handles the build.",
  rocket: "Your automations, in conversation.",
  "problem-title": "More room for the work you love.",
  "ba-title": "Same work. Clearer handoffs.",
  "why-title": "The technical work stays with Quavok.",
  faq: "Good questions welcome.",
};
type Mood = "curious" | "happy" | "sleepy" | "excited";
type ChatState = "closed" | "open" | "minimised";

export function Companion() {
  const [chat, setChat] = useState<ChatState>("closed");
  const [mood, setMood] = useState<Mood>("curious");
  const [reply, setReply] = useState(INTRO);
  const [hint, setHint] = useState("");
  const shell = useRef<HTMLElement>(null);
  const face = useRef<HTMLButtonElement>(null);
  const firstQuestion = useRef<HTMLButtonElement>(null);
  const answer = useRef<HTMLParagraphElement>(null);
  const current = useRef<ChatState>("closed");

  const changeChat = (next: ChatState) => {
    current.current = next;
    setChat(next);
    setHint("");
    try {
      if (next === "minimised") localStorage.setItem(STORAGE_KEY, "1");
      else localStorage.removeItem(STORAGE_KEY);
    } catch { /* The conversation also works without storage. */ }
    window.dispatchEvent(new Event("quavok:rocket-position"));
  };
  const close = () => {
    changeChat("closed");
    face.current?.focus({ preventScroll: true });
  };
  const greet = () => {
    if (current.current === "open") { close(); return; }
    setMood("happy");
    changeChat("open");
  };
  const showDemo = () => {
    const workflow = document.getElementById("workflow-build");
    if (!workflow) { window.location.href = "/?intro=1"; return; }
    close();
    workflow.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" });
    workflow.setAttribute("tabindex", "-1");
    workflow.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (chat === "open") firstQuestion.current?.focus({ preventScroll: true });
  }, [chat]);

  useEffect(() => {
    const restorePreference = () => {
      let next: ChatState = "closed";
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "1") next = "minimised";
        else if (stored !== null) localStorage.removeItem(STORAGE_KEY);
      } catch { /* Storage is optional. */ }
      current.current = next;
      setChat(next);
      setHint("");
    };
    restorePreference();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const sections = Array.from(document.querySelectorAll("main > section, .site-footer"));
    let section: Element | undefined;
    let raf = 0;
    let px = 0;
    let py = 0;
    let lastWake = 0;
    let lastHint = 0;
    let idle: ReturnType<typeof setTimeout>;
    let hintTimer: ReturnType<typeof setTimeout>;
    const wake = (next: Mood) => {
      setMood(next);
      clearTimeout(idle);
      idle = setTimeout(() => setMood("sleepy"), 14000);
    };
    const whisper = (text: string) => {
      if (current.current !== "closed") return;
      clearTimeout(hintTimer);
      setHint(text);
      hintTimer = setTimeout(() => setHint(""), 3200);
    };
    const layout = () => {
      raf = 0;
      const el = shell.current;
      const button = face.current;
      if (!el || !button) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const originRect = document.getElementById("rocket-origin")?.getBoundingClientRect();
      const mobileOpen = width < 960 && current.current === "open";
      const docked = !mobileOpen && current.current !== "minimised" && !!originRect && originRect.top >= 84 && originRect.bottom < height;
      const headerPerch = width < 960 && !docked;
      const sectionRect = section?.getBoundingClientRect();
      const x = docked && originRect ? originRect.left : headerPerch ? width - 120 : width - 72;
      const y = docked && originRect ? originRect.top : headerPerch ? 9 : Math.min(height - 88, Math.max(120, (sectionRect?.top ?? height * .4) + 44));
      const bubbleWidth = Math.min(300, width - 24);
      const bubbleLeft = Math.max(12 - x, Math.min(0, width - 12 - x - bubbleWidth));
      const above = !headerPerch && y > height - 366;
      // Keep the reserved mobile bubble area clear even when opened mid-section.
      const pageRegions = mobileOpen ? Array.from(document.querySelectorAll<HTMLElement>("main, .site-footer")).map(region => ({ region, clip: Math.max(0, 321 - region.getBoundingClientRect().top) })) : [];
      const dx = px - x - 24;
      const dy = py - y - 24;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const eyesMove = fine.matches && !reduce.matches && current.current !== "minimised";
      el.style.setProperty("--rocket-x", `${Math.round(x)}px`);
      el.style.setProperty("--rocket-y", `${Math.round(y)}px`);
      el.style.setProperty("--bubble-left", `${Math.round(bubbleLeft)}px`);
      el.style.setProperty("--bubble-tail", `${Math.round(24 - bubbleLeft)}px`);
      el.dataset.docked = String(docked);
      el.dataset.bubbleAbove = String(above);
      el.dataset.positioned = "true";
      pageRegions.forEach(({ region, clip }) => region.style.setProperty("--rocket-clearance", `${clip}px`));
      button.style.setProperty("--eye-x", eyesMove ? `${dx / distance * 3}px` : "0px");
      button.style.setProperty("--eye-y", eyesMove ? `${dy / distance * 3}px` : "0px");
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(layout); };
    const react = (next: Mood) => {
      if (current.current === "minimised" || Date.now() - lastWake < 2500) return;
      lastWake = Date.now();
      wake(next);
    };
    const pointer = (event: PointerEvent) => {
      if (!fine.matches || reduce.matches) return;
      px = event.clientX; py = event.clientY;
      react("curious"); schedule();
    };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !shell.current?.contains(event.target) && current.current === "open") close();
      if (event.pointerType === "touch") react("happy");
    };
    const ctaEnter = (event: Event) => {
      if (!(event.target instanceof Element) || !event.target.closest('a.btn[href^="/contact"]')) return;
      react("happy");
      if (Date.now() - lastHint > 12000) { lastHint = Date.now(); whisper("Bring one repetitive task. Start there."); }
    };
    const scroll = () => {
      if (!fine.matches) react("curious");
      schedule();
    };
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); });
      const next = sections.find(candidate => visible.has(candidate));
      if (next && next !== section) {
        section = next;
        const label = next.id || next.getAttribute("aria-labelledby") || "";
        const text = SECTION_HINTS[label];
        if (text && Date.now() - lastHint > 16000) { lastHint = Date.now(); whisper(text); }
      }
      schedule();
    }, { rootMargin: "-20% 0px -45% 0px", threshold: 0 });
    sections.forEach(target => observer.observe(target));
    const open = () => { changeChat("open"); wake("happy"); schedule(); };
    const celebrate = () => { wake("excited"); whisper("One less thing on your plate."); };
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let codeIndex = 0;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape" && current.current === "open") { close(); return; }
      if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable=true]")) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); open(); return; }
      codeIndex = event.key === sequence[codeIndex] ? codeIndex + 1 : event.key === sequence[0] ? 1 : 0;
      if (codeIndex === sequence.length) { codeIndex = 0; wake("excited"); whisper("Secret handshake accepted."); }
    };
    const pageShow = () => { restorePreference(); schedule(); };
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    window.addEventListener("pageshow", pageShow);
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("pointerdown", outside, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("quavok:open-rocket", open);
    window.addEventListener("quavok:rocket-position", schedule);
    window.addEventListener("quavok:assembly-complete", celebrate);
    document.addEventListener("keydown", key);
    document.addEventListener("pointerover", ctaEnter, { passive: true });
    document.addEventListener("focusin", ctaEnter);
    reduce.addEventListener("change", schedule);
    idle = setTimeout(() => setMood("sleepy"), 14000);
    schedule();
    return () => {
      cancelAnimationFrame(raf); clearTimeout(idle); clearTimeout(hintTimer);
      observer.disconnect(); resizeObserver.disconnect();
      window.removeEventListener("pageshow", pageShow);
      window.removeEventListener("pointermove", pointer); window.removeEventListener("pointerdown", outside);
      window.removeEventListener("scroll", scroll); window.removeEventListener("resize", schedule);
      window.removeEventListener("quavok:open-rocket", open); window.removeEventListener("quavok:rocket-position", schedule);
      window.removeEventListener("quavok:assembly-complete", celebrate);
      document.removeEventListener("keydown", key); reduce.removeEventListener("change", schedule);
      document.removeEventListener("pointerover", ctaEnter); document.removeEventListener("focusin", ctaEnter);
    };
  }, []);

  return <aside ref={shell} className="rocket-companion" data-chat={chat} data-mood={mood} aria-label="Rocket companion">
    <button ref={face} className="rocket-face" type="button" onClick={greet} aria-label={chat === "minimised" ? "Restore Rocket" : chat === "open" ? "Close Rocket" : "Ask Rocket"} aria-expanded={chat === "open"} aria-controls={chat === "open" ? "rocket-chat" : undefined} aria-keyshortcuts="Control+k Meta+k">
      <span className="rocket-face-antenna" aria-hidden="true" />
      <span className="rocket-face-visor" aria-hidden="true"><i /><i /></span>
      <span className="rocket-face-smile" aria-hidden="true" />
    </button>
    {chat === "closed" && hint && <span className="rocket-whisper" aria-hidden="true">{hint}</span>}
    {chat === "open" && <section id="rocket-chat" className="rocket-chat" aria-label="Rocket quick questions">
      <div className="rocket-chat-heading"><strong>Rocket</strong><button type="button" onClick={close} aria-label="Close Rocket chat"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div>
      <div className="rocket-chat-scroll">
        <p ref={answer} className="rocket-chat-reply" aria-live="polite" aria-atomic="true">{reply}</p>
        <div className="rocket-chat-questions">{QUESTIONS.map((question, index) => <button key={question.label} ref={index === 0 ? firstQuestion : undefined} type="button" onClick={() => { setReply(question.answer); setMood("happy"); answer.current?.parentElement?.scrollTo({ top: 0 }); }}>{question.label}</button>)}<button type="button" onClick={showDemo}>Show the demo</button></div>
        <div className="rocket-chat-links"><a href="/contact/">Discuss your workflow</a></div>
        <p className="rocket-chat-disclosure">Demo conversation; the real Rocket runs inside your automations.</p>
        <button className="rocket-chat-minimise" type="button" onClick={() => { changeChat("minimised"); face.current?.focus({ preventScroll: true }); }}>Minimise Rocket</button>
      </div>
    </section>}
  </aside>;
}
