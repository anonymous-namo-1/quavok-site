"use client";

import { useEffect, useRef, useState } from "react";
import { playVoice, stopVoice, voiceForText, voiceOwner, voiceText } from "@/lib/voice";
import { soundAllowed, soundEnabled } from "@/lib/sound";

const STORAGE_KEY = "quavok-rocket-minimised";
const INTRO = "Hi, I’m Rocket. What would you like to know?";
const QUESTIONS = [
  { label: "What does Quavok do?", answer: voiceText("faq-0") },
  { label: "Do I build anything?", answer: voiceText("faq-1") },
  { label: "What is Rocket?", answer: voiceText("faq-2") },
  { label: "How do I start?", answer: voiceText("faq-3") },
];
// Rocket explains each part of the page in a quiet text bubble. He only
// speaks when someone asks him something.
const SECTION_GUIDES: Record<string, string> = {
  "problem-title": "This is the busywork we take off your plate. Your people keep the judgment calls.",
  automate: "Start with the task you repeat most. Quavok builds around how you already work.",
  "ba-title": "Routine work gets handled. Decisions wait for you, and anything unusual goes to a person.",
  how: "You explain the process and approve the scope. Quavok builds it and keeps it running.",
  rocket: "Ask me about the automations Quavok runs for you. New requests go straight to the team.",
  faq: "Ask whatever’s on your mind. When you’re ready, tell the team about one task you repeat.",
  "cta-title": "Your next step is a discovery call. No technical homework.",
  footer: "You keep the craft, the customers and the decisions. We’ll handle the repetitive work.",
};
type Mood = "curious" | "happy" | "sleepy" | "excited";
type ChatState = "closed" | "open" | "minimised";

export function Companion() {
  const [chat, setChat] = useState<ChatState>("closed");
  const [mood, setMood] = useState<Mood>("curious");
  const [reply, setReply] = useState(INTRO);
  const [hint, setHint] = useState("");
  const [guide, setGuide] = useState("");
  const speechAvailable = true;
  const [speaking,setSpeaking] = useState(false);
  const [storySpeaking,setStorySpeaking] = useState(false);
  const [listening,setListening] = useState(false);
  const [launching,setLaunching] = useState(false);
  const callTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopSpeech = () => stopVoice("chat");
  const speakText = (text:string) => {
    if(voiceOwner()==="chat"){stopVoice("chat");return;}
    const id=voiceForText(text);if(id)void playVoice(id,{owner:"chat",force:true});
  };
  const readReply = () => speakText(reply);
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
    else {stopVoice("demo");setGuide("");}
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
    if (document.documentElement.classList.contains("qa-prologue")) { window.dispatchEvent(new Event("quavok:start-build")); return; }
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
    setLaunching(document.documentElement.classList.contains("qa-prologue"));
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
      if (current.current !== "closed" || shell.current?.dataset.perched === "true") return;
      clearTimeout(hintTimer);
      setHint(text);
      hintTimer = setTimeout(() => setHint(""), 3200);
    };
    let guideHide: ReturnType<typeof setTimeout>;
    let guideWatch: ReturnType<typeof setInterval>;
    const explain = (text: string) => {
      clearTimeout(guideHide); setHint(""); setGuide(text);
      if (shell.current) shell.current.dataset.guide = "hidden";
      // Content keeps settling (reveal animations), so re-check the spot
      // while the explanation is showing.
      clearInterval(guideWatch);
      guideWatch = setInterval(() => schedule(), 250);
      guideHide = setTimeout(() => { clearInterval(guideWatch); setGuide(""); }, Math.max(4500, text.split(" ").length * 380));
    };
    // True when a rectangle (viewport px) would sit on text, controls or media.
    const CONTENT = "a,button,input,textarea,select,summary,label,img,video,canvas,svg,p,h1,h2,h3,h4,h5,li,dt,dd,q,blockquote,figcaption,kbd,span,[role=tab],.btn";
    const covers = (l: number, t: number, w: number, h: number, vw: number, vh: number) => {
      // Sample a fine grid with a small safety margin around the rectangle.
      l -= 6; t -= 6; w += 12; h += 12;
      for (let i = 0; i <= 8; i++) for (let j = 0; j <= 4; j++) {
        const px = l + w * i / 8, py = t + h * j / 4;
        if (px < 0 || py < 0 || px > vw || py > vh) return true;
        for (const hit of document.elementsFromPoint(px, py)) {
          if (shell.current?.contains(hit)) continue;
          if (hit.closest("[data-rocket-perch],.stage-confetti,.hero-spotlight,.footer-wordmark")) break;
          if (hit.closest(CONTENT)) return true;
          break;
        }
      }
      return false;
    };
    const layout = () => {
      raf = 0;
      const el = shell.current;
      const button = face.current;
      if (!el || !button) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const prologue = document.documentElement.classList.contains("qa-prologue");
      const building = document.documentElement.classList.contains("qa-building");
      const originRect = document.getElementById("rocket-origin")?.getBoundingClientRect();
      const mobileOpen = width < 960 && current.current === "open";
      const visiblePerch = Array.from(document.querySelectorAll<HTMLElement>("[data-rocket-perch],#hero-rocket-perch,#rocket-perch"))
        .map(node => ({node,rect:node.getBoundingClientRect()}))
        .filter(({rect}) => rect.top > 100 && rect.bottom < height - 70)
        .sort((a,b) => Math.abs(a.rect.top + a.rect.height / 2 - height * .45) - Math.abs(b.rect.top + b.rect.height / 2 - height * .45))[0];
      const perchRect = visiblePerch?.rect;
      const perched = !building && !mobileOpen && current.current !== "minimised" && !!perchRect && perchRect.top > 100 && perchRect.bottom < height - 70;
      const size = prologue ? 96 : perched && perchRect ? perchRect.width : 48;
      const docked = !building && !mobileOpen && current.current !== "minimised" && !!originRect && originRect.top >= 84 && originRect.bottom < height;
      const headerPerch = width < 960 && !docked && !perched;
      const sectionRect = section?.getBoundingClientRect();
      const logoRect = document.querySelector(".site-header .logo")?.getBoundingClientRect();
      const soundRect = document.querySelector(".site-sound")?.getBoundingClientRect();
      const headerX = logoRect && soundRect ? logoRect.right + (soundRect.left - logoRect.right - 48) / 2 : width - 120;
      const baseX = prologue ? width / 2 - 48 : building ? (width < 960 ? Math.max(8,headerX) : width - 72) : perched && perchRect ? perchRect.left : docked && originRect ? originRect.left : headerPerch ? Math.max(8,headerX) : width - 72;
      const baseY = prologue ? height / 2 - 90 : building ? (width < 960 ? 9 : 110) : perched && perchRect ? perchRect.top : docked && originRect ? originRect.top : headerPerch ? 9 : Math.min(height - 88, Math.max(120, (sectionRect?.top ?? height * .4) + 44));
      // While floating, Rocket never sits on top of content: if his usual spot
      // at the right edge would cover something, he moves to the empty part
      // of the header bar, then to the bottom-right corner.
      let x = baseX, y = baseY;
      const floating = !prologue && !building && !perched && !docked && !headerPerch;
      if (floating && covers(x - 6, y - 6, 60, 60, width, height)) {
        const nav = document.querySelector(".site-header .nav-links")?.getBoundingClientRect();
        const cta = document.querySelector(".site-header .nav-cta")?.getBoundingClientRect();
        const slot = nav && cta && nav.width && cta.width && cta.left - nav.right >= 64 ? nav.right + (cta.left - nav.right - 48) / 2 : -1;
        if (slot >= 0 && !covers(slot - 4, 10, 56, 48, width, height)) { x = slot; y = 10; }
        else { x = width - 72; y = height - 72; }
      }
      // Rocket's explanation bubble only appears where it covers nothing:
      // below, above, left or right of him, whichever is clear first.
      const guideEl = el.querySelector<HTMLElement>(".rocket-guide");
      if (guideEl) {
        const g = guideEl.getBoundingClientRect();
        const gw = g.width || 300, gh = g.height || 64;
        const clampX = (v: number) => Math.max(12, Math.min(width - 12 - gw, v));
        const clampY = (v: number) => Math.max(76, Math.min(height - 12 - gh, v));
        const spots = [
          [clampX(x + size / 2 - gw / 2), y + size + 12],
          [clampX(x + size / 2 - gw / 2), y - gh - 12],
          [x - gw - 14, clampY(y)],
          [x + size + 14, clampY(y)],
        ];
        const spot = spots.find(([l, t]) => l >= 12 && t >= 76 && l + gw <= width - 12 && t + gh <= height - 12 && !covers(l, t, gw, gh, width, height));
        el.dataset.guide = spot ? "shown" : "hidden";
        if (spot) { el.style.setProperty("--guide-x", `${Math.round(spot[0] - x)}px`); el.style.setProperty("--guide-y", `${Math.round(spot[1] - y)}px`); }
      }
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
      el.style.setProperty("--rocket-scale",String(size / 48));
      el.style.setProperty("--rocket-perch-size",`${size}px`);
      el.style.setProperty("--rocket-bubble-gap",`${size + 16}px`);
      el.dataset.perched = String(perched || prologue);
      el.dataset.prologue = String(prologue);
      el.dataset.hero = String(perched && visiblePerch?.node.id === "hero-rocket-perch");
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
    let guideTimer:ReturnType<typeof setTimeout>;
    let narrationKey="";
    const narrated=new Set<string>();
    const queueGuide=()=>{
      clearTimeout(guideTimer);
      guideTimer=setTimeout(()=>{
        if(document.hidden||current.current!=="closed"||document.documentElement.matches(".qa-prologue,.qa-building"))return;
        const text=SECTION_GUIDES[narrationKey];
        if(!text||narrated.has(narrationKey))return;
        narrated.add(narrationKey);explain(text);
      },850);
    };
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); });
      const next = sections.filter(candidate=>visible.has(candidate)).sort((a,b)=>Math.abs(a.getBoundingClientRect().top-innerHeight*.25)-Math.abs(b.getBoundingClientRect().top-innerHeight*.25))[0];
      if (next && next !== section) {
        section=next;
        narrationKey=next.tagName==="FOOTER"?"footer":next.id||next.getAttribute("aria-labelledby")||"";
        if(narrationKey==="page-title"){
          const pathname=location.pathname;
          if(/services|solutions/.test(pathname))narrationKey="automate";
          else if(/how-it-works/.test(pathname))narrationKey="how";
          else if(/contact/.test(pathname))narrationKey="cta-title";
          else if(/rocket/.test(pathname))narrationKey="rocket";
          else if(/about/.test(pathname))narrationKey="problem-title";
        }
        queueGuide();
      }
      schedule();
    }, { rootMargin: "-20% 0px -45% 0px", threshold: 0 });
    sections.forEach(target => observer.observe(target));
    const open = () => { changeChat("open"); wake("happy"); schedule(); };
    const buildStarted = () => { setLaunching(false); schedule(); };
    const celebrate = () => { wake("excited"); whisper("One less thing on your plate."); };
    const reaction = (event: Event) => {
      if (!(event instanceof CustomEvent) || typeof event.detail !== "string") return;
      stopSpeech(); wake("happy"); whisper(event.detail);
    };
    const quiet = () => { if (document.hidden) { stopVoice(); clearTimeout(guideTimer);setStorySpeaking(false); } };
    const voiceChanged=(event:Event)=>{
      if(!(event instanceof CustomEvent)||typeof event.detail?.active!=="boolean")return;
      setSpeaking(event.detail.active&&event.detail.role==="rocket");
      if(event.detail.active)wake(event.detail.role==="person"?"curious":"happy");
    };
    const soundChanged=()=>{if(!soundEnabled())stopVoice();};
    const called = () => {
      setListening(true); wake("curious");
      if (callTimer.current) clearTimeout(callTimer.current);
      callTimer.current = setTimeout(() => setListening(false),5000);
    };
    const talking = (event: Event) => { if (event instanceof CustomEvent && typeof event.detail === "boolean") { setStorySpeaking(event.detail); if (event.detail) wake("happy"); } };
    const say = (event: Event) => {
      if (!(event instanceof CustomEvent) || typeof event.detail !== "string") return;
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
    const pageShow = (event:PageTransitionEvent) => { if(event.persisted)restorePreference(); schedule(); };
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    window.addEventListener("pageshow", pageShow);
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("pointerdown", outside, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("quavok:open-rocket", open);
    window.addEventListener("quavok:build-start", buildStarted);
    window.addEventListener("quavok:build-end",schedule);
    window.addEventListener("quavok:voice-state",voiceChanged);
    window.addEventListener("quavok:sound-change",soundChanged);
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
      cancelAnimationFrame(raf); clearTimeout(idle); clearTimeout(hintTimer); clearTimeout(guideHide); clearInterval(guideWatch);
      observer.disconnect(); resizeObserver.disconnect();
      window.removeEventListener("pageshow", pageShow);
      window.removeEventListener("pointermove", pointer); window.removeEventListener("pointerdown", outside);
      window.removeEventListener("scroll", scroll); window.removeEventListener("resize", schedule);
      window.removeEventListener("quavok:open-rocket", open);
      window.removeEventListener("quavok:build-start", buildStarted);
      window.removeEventListener("quavok:build-end",schedule);
      window.removeEventListener("quavok:voice-state",voiceChanged);
      window.removeEventListener("quavok:sound-change",soundChanged);
      clearTimeout(guideTimer);stopVoice(); window.removeEventListener("quavok:rocket-position", schedule);
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
    <button ref={face} className="rocket-face" type="button" onClick={greet} aria-label={launching ? "Start page build" : chat === "minimised" ? "Restore Rocket" : chat === "open" ? "Close Rocket" : "Ask Rocket"} aria-expanded={chat === "open"} aria-controls={chat === "open" ? "rocket-chat" : undefined} aria-keyshortcuts="Control+k Meta+k">
      <span className="rocket-eyes" aria-hidden="true"><i /><i /></span>
      <span className="rocket-face-smile" aria-hidden="true" />
    </button>
    <span className="rocket-build-command" role="status">Let’s build this page.</span>
    {chat === "closed" && hint && !guide && <span className="rocket-whisper" aria-hidden="true">{hint}</span>}
    {chat === "closed" && guide && <span className="rocket-whisper rocket-guide" aria-hidden="true">{guide}</span>}
    {chat === "open" && <section id="rocket-chat" className="rocket-chat" aria-label="Rocket quick questions">
      <div className="rocket-chat-heading"><strong>Rocket</strong><div className="rocket-chat-actions">{speechAvailable && <button type="button" onClick={readReply} aria-label={speaking ? "Stop reading Rocket’s answer" : "Read Rocket’s answer aloud"} aria-pressed={speaking}><svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z" />{speaking ? <path d="m17 9 5 6m0-6-5 6" /> : <path d="M17 8q5 4 0 8M20 5q7 7 0 14" />}</svg></button>}<button type="button" onClick={close} aria-label="Close Rocket chat"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div></div>
      <div className="rocket-chat-scroll">
        <p ref={answer} className="rocket-chat-reply" aria-live="polite" aria-atomic="true">{reply}</p>
        <div className="rocket-chat-questions">{QUESTIONS.map((question, index) => <button key={question.label} ref={index === 0 ? firstQuestion : undefined} type="button" onClick={() => { stopSpeech(); setReply(question.answer); if(soundAllowed())speakText(question.answer); setMood("happy"); answer.current?.parentElement?.scrollTo({ top: 0 }); }}>{question.label}</button>)}<button type="button" onClick={showDemo}>Show the demo</button></div>
        <div className="rocket-chat-links"><a href="/contact/">Discuss your workflow</a></div>
        <p className="rocket-chat-disclosure">Demo conversation; the real Rocket runs inside your automations.</p>
        <button className="rocket-chat-minimise" type="button" onClick={() => { changeChat("minimised"); face.current?.focus({ preventScroll: true }); }}>Minimise Rocket</button>
      </div>
    </section>}
  </aside>;
}
