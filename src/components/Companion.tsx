"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "quavok-rocket-minimised";
const INTRO = "Hi, I’m Rocket. Pick a question and I’ll show you around. Less busywork. More room for what actually matters.";
const QUESTIONS = [
  { label: "What does Quavok do?", answer: "Quavok builds and runs custom AI automations around your business: enquiries, follow-ups, documents, reporting and other repetitive work. Your team gets more room for its craft, customers and growth." },
  { label: "Do I build anything?", answer: "No. Tell the team what’s slowing you down, agree the scope and approve the important decisions. Quavok designs, deploys and runs the automation for you." },
  { label: "What is Rocket?", answer: "The real Rocket is the conversational layer for automations Quavok builds for you. Ask about their work or forward a new request to the team. The proactive paid add-on and desktop/mobile apps are in development." },
  { label: "How do I start?", answer: "Bring one repetitive process to a discovery conversation. No technical homework required. The team will explore what makes sense to automate with you." },
];
const PAGE_HINTS: Record<string, string> = {
  "/services/": "You explain the work. Quavok designs, deploys and runs the automation.",
  "/solutions/": "These workflows are illustrative examples, not client results.",
  "/how-it-works/": "Your part: explain and approve. The technical work stays with Quavok.",
  "/about/": "Meet the team’s approach. Unconfirmed details are marked as placeholders.",
  "/rocket/": "The real Rocket talks to Quavok-built systems.",
  "/contact/": "The contact form prepares an email in your mail app. It does not send from the website.",
  "/privacy/": "Your minimise preference stays in this browser’s local storage.",
};
const SECTION_HINTS: Record<string, string> = {
  automate: "Pick a type of work to explore an illustrative workflow.",
  how: "Some decisions stay with you. Look for the approval hold.",
  rocket: "A conversation with your automations, built and managed by Quavok.",
  "problem-title": "Start with the repetitive work that gets in the way of your real work.",
  "ba-title": "Try the comparison: the same work, with clearer hand-offs.",
  "why-title": "You approve the scope. Quavok builds and runs the technology.",
  faq: "Good questions welcome. Here are the practical details.",
};
type Mood = "curious" | "happy" | "sleepy" | "excited";
type ChatState = "closed" | "open" | "minimised";

export function Companion() {
  const [chat, setChat] = useState<ChatState>("closed");
  const [mood, setMood] = useState<Mood>("curious");
  const [reply, setReply] = useState(INTRO);
  const [hint, setHint] = useState("This is an illustrative workflow, ready to explore.");
  const [party, setParty] = useState(false);
  const [ctaHint, setCtaHint] = useState(false);
  const shell = useRef<HTMLElement>(null);
  const face = useRef<HTMLButtonElement>(null);
  const firstQuestion = useRef<HTMLButtonElement>(null);
  const current = useRef<ChatState>("closed");
  const trigger = useRef<HTMLElement | null>(null);
  const clicks = useRef(0);
  const partyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const changeChat = (next: ChatState) => {
    current.current = next;
    setChat(next);
    try {
      if (next === "minimised") localStorage.setItem(STORAGE_KEY, "1");
      else localStorage.removeItem(STORAGE_KEY);
    } catch { /* The chat also works when storage is unavailable. */ }
    window.dispatchEvent(new Event("quavok:rocket-position"));
  };
  const close = () => {
    changeChat("closed");
    (trigger.current?.isConnected ? trigger.current : face.current)?.focus({ preventScroll: true });
  };
  const greet = () => {
    trigger.current = face.current;
    clicks.current += 1;
    if (clicks.current % 5 === 0) {
      setReply("Secret handshake accepted. Your side quest: stretch your shoulders. Even good workflows need a breather.");
      setMood("excited");
      changeChat("open");
    } else {
      setMood("happy");
      changeChat(current.current === "open" ? "closed" : "open");
    }
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
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        current.current = "minimised";
        setChat("minimised");
      }
    } catch { /* Storage is optional. */ }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const origin = document.getElementById("rocket-origin");
    const sections = Array.from(document.querySelectorAll("main > section, .site-footer"));
    let section: Element | undefined;
    let raf = 0;
    let px = 0;
    let py = 0;
    let lastWake = 0;
    let lastHint = 0;
    let idle: ReturnType<typeof setTimeout>;
    let pendingHint: ReturnType<typeof setTimeout>;
    const wake = (next: Mood) => {
      setMood(next);
      clearTimeout(idle);
      idle = setTimeout(() => setMood("sleepy"), 14000);
    };
    const layout = () => {
      raf = 0;
      const el = shell.current;
      const button = face.current;
      if (!el || !button) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const originRect = origin?.getBoundingClientRect();
      const docked = current.current !== "minimised" && !!originRect && originRect.top >= 84 && originRect.bottom < height;
      const compact = width < 640 || current.current === "minimised" || (!docked && width < 1280);
      const size = compact ? 48 : 72;
      const sectionRect = section?.getBoundingClientRect();
      // On narrow screens the header has a reserved gap; never sit over body copy.
      const headerPerch = width < 960 && !docked;
      const x = docked && originRect ? originRect.left : headerPerch ? width - 120 : width - size - (width < 1280 ? 4 : 24);
      const y = docked && originRect ? originRect.top : headerPerch ? 9 : Math.min(height - size - 40, Math.max(120, (sectionRect?.top ?? height * .4) + 44));
      const faceRect = button.getBoundingClientRect();
      const dx = px - faceRect.left - faceRect.width / 2;
      const dy = py - faceRect.top - faceRect.height / 2;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const eyesMove = fine.matches && !reduce.matches && current.current !== "minimised";
      el.style.setProperty("--rocket-x", `${Math.round(x)}px`);
      el.style.setProperty("--rocket-y", `${Math.round(y)}px`);
      el.dataset.docked = String(docked);
      el.dataset.compact = String(compact);
      el.dataset.positioned = "true";
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
    const ctaEnter = (event: Event) => {
      const target = event.target instanceof Element ? event.target.closest('a.btn[href^="/contact"]') : null;
      if (!target || current.current === "minimised") return;
      wake("happy"); setCtaHint(true);
    };
    const ctaLeave = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('a.btn[href^="/contact"]')) setCtaHint(false);
    };
    const touch = (event: PointerEvent) => { if (event.pointerType === "touch") react("happy"); };
    const scroll = () => { if (!fine.matches) react("curious"); schedule(); };
    const contextualHint = (target: Element) => {
      const label = target.id || target.getAttribute("aria-labelledby") || "";
      const next = target.tagName === "FOOTER" ? "Bring one repetitive process to the team. No technical homework required." : SECTION_HINTS[label] || PAGE_HINTS[location.pathname] || "Quavok handles the technology. You focus on what actually matters.";
      clearTimeout(pendingHint);
      pendingHint = setTimeout(() => {
        lastHint = Date.now();
        setHint(next);
      }, Math.max(600, 12000 - (Date.now() - lastHint)));
    };
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); });
      const next = sections.find(candidate => visible.has(candidate));
      if (next && next !== section) { section = next; contextualHint(next); }
      schedule();
    }, { rootMargin: "-20% 0px -45% 0px", threshold: 0 });
    sections.forEach(target => observer.observe(target));
    const open = () => {
      trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      changeChat("open"); wake("happy"); schedule();
    };
    const celebrate = () => {
      wake("excited");
      setHint("All connected. That was an illustrative build; your workflow would be scoped with you.");
      if (reduce.matches || current.current === "minimised") return;
      setParty(true);
      if (partyTimer.current) clearTimeout(partyTimer.current);
      partyTimer.current = setTimeout(() => setParty(false), 1200);
    };
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let codeIndex = 0;
    const key = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable=true]")) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); open(); return; }
      if (event.key === "Escape" && current.current === "open") {
        changeChat("closed");
        (trigger.current?.isConnected ? trigger.current : face.current)?.focus({ preventScroll: true });
        return;
      }
      codeIndex = event.key === sequence[codeIndex] ? codeIndex + 1 : event.key === sequence[0] ? 1 : 0;
      if (codeIndex === sequence.length) {
        codeIndex = 0; open(); wake("excited");
        setReply("Secret level unlocked: less busywork, more breathing room. Your next quest is a proper break.");
      }
    };
    const motionChange = () => { if (reduce.matches) setParty(false); schedule(); };
    const resizeObserver = new ResizeObserver(schedule);
    if (origin) resizeObserver.observe(origin);
    resizeObserver.observe(document.body);
    setHint(PAGE_HINTS[location.pathname] || "This is an illustrative workflow, ready to explore.");
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("pointerdown", touch, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("quavok:open-rocket", open);
    window.addEventListener("quavok:rocket-position", schedule);
    window.addEventListener("quavok:assembly-complete", celebrate);
    document.addEventListener("keydown", key);
    document.addEventListener("pointerover", ctaEnter, { passive: true });
    document.addEventListener("pointerout", ctaLeave, { passive: true });
    document.addEventListener("focusin", ctaEnter);
    document.addEventListener("focusout", ctaLeave);
    reduce.addEventListener("change", motionChange);
    idle = setTimeout(() => setMood("sleepy"), 14000);
    schedule();
    return () => {
      cancelAnimationFrame(raf); clearTimeout(idle); clearTimeout(pendingHint);
      if (partyTimer.current) clearTimeout(partyTimer.current);
      observer.disconnect(); resizeObserver.disconnect();
      window.removeEventListener("pointermove", pointer); window.removeEventListener("pointerdown", touch);
      window.removeEventListener("scroll", scroll); window.removeEventListener("resize", schedule);
      window.removeEventListener("quavok:open-rocket", open); window.removeEventListener("quavok:rocket-position", schedule);
      window.removeEventListener("quavok:assembly-complete", celebrate);
      document.removeEventListener("keydown", key); reduce.removeEventListener("change", motionChange);
      document.removeEventListener("pointerover", ctaEnter); document.removeEventListener("pointerout", ctaLeave);
      document.removeEventListener("focusin", ctaEnter); document.removeEventListener("focusout", ctaLeave);
    };
  }, []);

  return <aside ref={shell} className="rocket-companion" data-chat={chat} data-mood={mood} data-cta-hint={ctaHint} aria-label="Rocket companion">
    <button ref={face} className="rocket-face" type="button" onClick={greet} aria-label={chat === "minimised" ? "Restore Rocket" : chat === "open" ? "Close Rocket" : "Ask Rocket"} aria-expanded={chat === "open"} aria-controls={chat === "open" ? "rocket-chat" : undefined}>
      <span className="rocket-face-antenna" aria-hidden="true" />
      <span className="rocket-face-visor" aria-hidden="true"><i /><i /></span>
      <span className="rocket-face-smile" aria-hidden="true" />
    </button>
    {chat === "closed" && <span className="rocket-whisper" aria-hidden="true">{ctaHint ? "Bring one repetitive task. We’ll start there." : hint}</span>}
    {chat === "open" && createPortal(<section id="rocket-chat" className="rocket-chat" aria-label="Rocket quick questions">
      <div className="rocket-chat-heading"><strong>Rocket </strong><button type="button" onClick={close} aria-label="Close Rocket chat"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div>
      <p className="rocket-chat-disclosure">Demo conversation; the real Rocket runs inside your automations.</p>
      <p className="rocket-chat-reply" aria-live="polite" aria-atomic="true">{reply}</p>
      <div className="rocket-chat-questions">{QUESTIONS.map((question, index) => <button key={question.label} ref={index === 0 ? firstQuestion : undefined} type="button" onClick={() => { setReply(question.answer); setMood("happy"); }}>{question.label}<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10" /></svg></button>)}<button type="button" onClick={showDemo}>Show me the demo<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10" /></svg></button></div>
      <div className="rocket-chat-links"><a href="/contact/">Discuss your workflow</a><a href="/contact/?topic=discovery#form">Book a Discovery Call</a></div>
      <p className="rocket-chat-context" aria-live="polite" aria-atomic="true">{hint}</p>
      <button className="rocket-chat-minimise" type="button" onClick={() => { changeChat("minimised"); face.current?.focus({ preventScroll: true }); }}>Minimise Rocket on this browser</button>
    </section>, document.body)}
    {party && <div className="rocket-confetti" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i key={index} />)}</div>}
  </aside>;
}
