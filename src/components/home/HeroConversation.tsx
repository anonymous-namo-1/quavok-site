"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { INTRO_DONE_EVENT } from "@/lib/intro/engine";

const EXAMPLES = [
  { question: "Any new leads today?", answer: "Your new enquiries are organised in the CRM. Follow-ups are drafted. Anything unusual is waiting for your decision." },
  { question: "What needs my approval?", answer: "The follow-up wording is ready to review. Nothing goes out until you approve it." },
  { question: "Could we add quote reminders?", answer: "I’ll pass that to the Quavok team. They’ll work through the scope with you and build it around your process." },
];

export function HeroConversation() {
  const [selected, setSelected] = useState(0);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [phase, setPhase] = useState<"building" | "question" | "listening" | "answering" | "settled">("settled");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const runConversation = (index: number) => {
    clear(); setSelected(index);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase("settled"); window.dispatchEvent(new Event("quavok:rocket-call")); return; }
    setPhase("question");
    timers.current.push(setTimeout(() => { setPhase("listening"); window.dispatchEvent(new Event("quavok:rocket-call")); }, 650));
    timers.current.push(setTimeout(() => { setPhase("answering"); window.dispatchEvent(new CustomEvent("quavok:rocket-talk",{detail:true})); }, 1450));
    timers.current.push(setTimeout(() => { setPhase("settled"); window.dispatchEvent(new CustomEvent("quavok:rocket-talk",{detail:false})); }, 3200));
  };
  useEffect(() => {
    const ready = () => runConversation(0);
    const call = () => runConversation(0);
    if (document.documentElement.classList.contains("qa-pre")) setPhase("building");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => { if (motion.matches) { clear(); setPhase("settled"); window.dispatchEvent(new CustomEvent("quavok:rocket-talk",{detail:false})); } };
    motion.addEventListener("change",finish);
    window.addEventListener(INTRO_DONE_EVENT, ready);
    window.addEventListener("quavok:hero-call", call);
    return () => { clear(); motion.removeEventListener("change",finish); window.removeEventListener(INTRO_DONE_EVENT, ready); window.removeEventListener("quavok:hero-call", call); window.dispatchEvent(new CustomEvent("quavok:rocket-talk",{detail:false})); };
  }, []);
  const example = EXAMPLES[selected];
  useEffect(() => { setSpeechAvailable("speechSynthesis" in window && "SpeechSynthesisUtterance" in window); }, []);
  return <figure id="day-preview" className="day-preview" data-phase={phase} data-intro-stage data-intro-conversation aria-label="Illustrative conversation with Rocket">
    <div className="day-question" data-site-piece><span className="day-person">You</span><p>{example.question}</p></div>
    <div className="day-rocket"><span id="hero-rocket-perch" aria-hidden="true" /></div>
    <div className="day-answer" data-site-piece>
      <span className="day-speaker">Rocket</span><span className="day-thinking" aria-hidden="true"><i /><i /><i /></span>
      <p key={selected} aria-busy={phase !== "settled" && phase !== "answering"} aria-live="polite" aria-atomic="true">{example.answer.split(" ").map((word, i) => <span className="reply-word" key={i} style={{animationDelay:`${i * 24}ms`}}>{word}{" "}</span>)}</p>
      {speechAvailable && <button className="day-listen" type="button" onClick={() => window.dispatchEvent(new CustomEvent("quavok:rocket-say", {detail:example.answer}))} aria-label="Read the example reply aloud"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4ZM17 8q5 4 0 8" /></svg>Hear reply</button>}
    </div>

    <figcaption className="day-controls"><span>Illustrative conversation</span><div role="group" aria-label="Choose an example question">{EXAMPLES.map((item, i) => <button key={item.question} type="button" aria-pressed={i===selected} aria-label={item.question} onClick={() => { window.dispatchEvent(new CustomEvent("quavok:rocket-reaction", {detail:""})); runConversation(i); }}>{i+1}</button>)}</div><a href="/?intro=1">Replay intro</a></figcaption>
    <span className="stage-confetti" aria-hidden="true">{Array.from({length:8},(_,i)=><i key={i} style={{"--burst-angle":`${i*45}deg`} as CSSProperties} />)}</span>
  </figure>;
}
