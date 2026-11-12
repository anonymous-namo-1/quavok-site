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
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [storySpeaking, setStorySpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const callTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const stopSpeech = () => {
    if (!utterance.current) return;
    utterance.current.onend = null;
    utterance.current.onerror = null;
    window.speechSynthesis.cancel();
    utterance.current = null;
    setSpeaking(false);
  };
  const speakText = (text: string) => {
    if (utterance.current) { stopSpeech(); return; }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en";
    speech.rate = .98;
    speech.onend = speech.onerror = () => { utterance.current = null; setSpeaking(false); };
    utterance.current = speech;
    setSpeaking(true);
    window.speechSynthesis.speak(speech);
  };
  const readReply = () => speakText(reply);
  useEffect(() => {
    setSpeechAvailable("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
    return () => { if (utterance.current) { utterance.current.onend = null; utterance.current.onerror = null; window.speechSynthesis.cancel(); } };
  }, []);
  const shell = useRef<HTMLElement>(null);
  const face = useRef<HTMLButtonElement>(null);
  const firstQuestion = useRef<HTMLButtonElement>(null);
  const answer = useRef<HTMLParagraphElement>(null);
  const current = useRef<ChatState>("closed");

  const changeChat = (next: ChatState) => {
    current.current = next;
    setChat(next);
    setHint("");
    if (next !== "open") stopSpeech();
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
    if (shell.current?.dataset.hero === "true" && current.current !== "open") { window.dispatchEvent(new Event("quavok:hero-call")); return; }
    if (current.current === "open") { close(); return; }
    setMood("happy");
    changeChat("open");
  };
  const showDemo = () => {
    const workflow = document.getElementById("day-preview") || document.getElementById("workflow-build");
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
      stopSpeech();
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
      if (current.current !== "closed" || shell.current?.dataset.hero === "true") return;
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
      const perchRect = [document.getElementById("hero-rocket-perch"), document.getElementById("rocket-perch")].map(node => node?.getBoundingClientRect()).find(rect => rect && rect.top > 100 && rect.bottom < height - 70);
      const perched = !mobileOpen && current.current !== "minimised" && !!perchRect && perchRect.top > 100 && perchRect.bottom < height - 70;
      const size = perched ? 96 : 48;
      const docked = !mobileOpen && current.current !== "minimised" && !!originRect && originRect.top >= 84 && originRect.bottom < height;
      const headerPerch = width < 960 && !docked && !perched;
      const sectionRect = section?.getBoundingClientRect();
      const x = perched && perchRect ? perchRect.left : docked && originRect ? originRect.left : headerPerch ? width - 120 : width - 72;
      const y = perched && perchRect ? perchRect.top : docked && originRect ? originRect.top : headerPerch ? 9 : Math.min(height - 88, Math.max(120, (sectionRect?.top ?? height * .4) + 44));
      const bubbleWidth = Math.min(300, width - 24);
      const bubbleLeft = Math.max(12 - x, Math.min(0, width - 12 - x - bubbleWidth));
      const above = !headerPerch && y > height - (perched ? 420 : 366);
      // Keep the reserved mobile bubble area clear even when opened mid-section.
      const pageRegions = mobileOpen ? Array.from(document.querySelectorAll<HTMLElement>("main, .site-footer")).map(region => ({ region, clip: Math.max(0, 321 - region.getBoundingClientRect().top) })) : [];
      const dx = px - x - size / 2;
      const dy = py - y - size / 2;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const eyesMove = fine.matches && !reduce.matches && current.current !== "minimised";
      el.style.setProperty("--rocket-x", `${Math.round(x)}px`);
      el.style.setProperty("--rocket-y", `${Math.round(y)}px`);
      el.style.setProperty("--bubble-left", `${Math.round(bubbleLeft)}px`);
      el.style.setProperty("--bubble-tail", `${Math.round(size / 2 - bubbleLeft)}px`);
      el.dataset.docked = String(docked);
      el.dataset.perched = String(perched);
      el.dataset.hero = String(perched && document.getElementById("hero-rocket-perch")?.getBoundingClientRect().top === perchRect?.top);
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
    const reaction = (event: Event) => {
      if (!(event instanceof CustomEvent) || typeof event.detail !== "string") return;
      stopSpeech(); wake("happy"); whisper(event.detail);
    };
    const quiet = () => { if (document.hidden) { stopSpeech(); setStorySpeaking(false); } };
    const called = () => {
      setListening(true); wake("curious");
      if (callTimer.current) clearTimeout(callTimer.current);
      callTimer.current = setTimeout(() => setListening(false),5000);
    };
    const talking = (event: Event) => { if (event instanceof CustomEvent && typeof event.detail === "boolean") { setStorySpeaking(event.detail); if (event.detail) wake("happy"); } };
    const say = (event: Event) => {
      if (!(event instanceof CustomEvent) || typeof event.detail !== "string" || !("speechSynthesis" in window)) return;
      speakText(event.detail); wake("happy");
    };
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
    window.addEventListener("quavok:rocket-reaction", reaction);
    window.addEventListener("quavok:rocket-say", say);
    window.addEventListener("quavok:rocket-call", called);
    window.addEventListener("quavok:rocket-talk", talking);
    document.addEventListener("visibilitychange", quiet);
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
      window.removeEventListener("quavok:rocket-reaction", reaction);
      window.removeEventListener("quavok:rocket-say", say);
      window.removeEventListener("quavok:rocket-call", called);
      window.removeEventListener("quavok:rocket-talk", talking);
      if (callTimer.current) clearTimeout(callTimer.current);
      document.removeEventListener("visibilitychange", quiet);
      document.removeEventListener("keydown", key); reduce.removeEventListener("change", schedule);
      document.removeEventListener("pointerover", ctaEnter); document.removeEventListener("focusin", ctaEnter);
    };
  }, []);

  return <aside ref={shell} className="rocket-companion" data-chat={chat} data-mood={mood} data-speaking={speaking || storySpeaking} data-listening={listening || speaking || chat === "open"} aria-label="Rocket companion">
    <button ref={face} className="rocket-face" type="button" onClick={greet} aria-label={chat === "minimised" ? "Restore Rocket" : chat === "open" ? "Close Rocket" : "Ask Rocket"} aria-expanded={chat === "open"} aria-controls={chat === "open" ? "rocket-chat" : undefined} aria-keyshortcuts="Control+k Meta+k">
      <span className="rocket-headphones" aria-hidden="true"><i /><i /></span>
      <span className="rocket-face-visor" aria-hidden="true"><i /><i /></span>
      <span className="rocket-face-smile" aria-hidden="true" />
    </button>
    {chat === "closed" && hint && <span className="rocket-whisper" aria-hidden="true">{hint}</span>}
    {chat === "open" && <section id="rocket-chat" className="rocket-chat" aria-label="Rocket quick questions">
      <div className="rocket-chat-heading"><strong>Rocket</strong><div className="rocket-chat-actions">{speechAvailable && <button type="button" onClick={readReply} aria-label={speaking ? "Stop reading Rocket’s answer" : "Read Rocket’s answer aloud"} aria-pressed={speaking}><svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z" />{speaking ? <path d="m17 9 5 6m0-6-5 6" /> : <path d="M17 8q5 4 0 8M20 5q7 7 0 14" />}</svg></button>}<button type="button" onClick={close} aria-label="Close Rocket chat"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div></div>
      <div className="rocket-chat-scroll">
        <p ref={answer} className="rocket-chat-reply" aria-live="polite" aria-atomic="true">{reply}</p>
        <div className="rocket-chat-questions">{QUESTIONS.map((question, index) => <button key={question.label} ref={index === 0 ? firstQuestion : undefined} type="button" onClick={() => { stopSpeech(); setReply(question.answer); setMood("happy"); answer.current?.parentElement?.scrollTo({ top: 0 }); }}>{question.label}</button>)}<button type="button" onClick={showDemo}>Show the demo</button></div>
        <div className="rocket-chat-links"><a href="/contact/">Discuss your workflow</a></div>
        <p className="rocket-chat-disclosure">Demo conversation; the real Rocket runs inside your automations.</p>
        <button className="rocket-chat-minimise" type="button" onClick={() => { changeChat("minimised"); face.current?.focus({ preventScroll: true }); }}>Minimise Rocket</button>
      </div>
    </section>}
  </aside>;
}
