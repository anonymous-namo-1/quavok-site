"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { INTRO_DONE_EVENT } from "@/lib/intro/engine";
import { playVoice, stopVoice, voiceText } from "@/lib/voice";
import { soundAllowed, soundEnabled } from "@/lib/sound";

const EXAMPLES=[0,1,2].map(index=>({question:voiceText(`question-${index}`),answer:voiceText(`answer-${index}`)}));
type Phase="building"|"arriving"|"question"|"listening"|"answering"|"settled";
const delay=(ms:number,signal:AbortSignal)=>new Promise<void>(resolve=>{const timer=setTimeout(resolve,ms);signal.addEventListener("abort",()=>{clearTimeout(timer);resolve();},{once:true});});
export function HeroConversation(){
 const [selected,setSelected]=useState(0);
 const [phase,setPhase]=useState<Phase>("settled");
 const [words,setWords]=useState(1000);
 const figure=useRef<HTMLElement>(null);
 const run=useRef<AbortController|null>(null);
 const current=useRef(0);
 const visible=useRef(false);
 const waiting=useRef(false);
 const choose=useRef<(index:number)=>void>(()=>{});
 const cancel=()=>{run.current?.abort();stopVoice("demo");window.dispatchEvent(new CustomEvent("quavok:rocket-talk",{detail:false}));};
 // After the build the example is spoken only if the visitor chose sound.
 // Picking a question or asking Rocket directly always replies aloud, unless
 // the visitor has explicitly chosen silence.
 const conversation=async(index:number,handoff=false)=>{
  const speak=handoff?soundEnabled():soundAllowed();
  cancel();const controller=new AbortController();run.current=controller;const signal=controller.signal;
  current.current=index;setSelected(index);setWords(0);
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){setWords(1000);setPhase("settled");return;}
  if(handoff){setPhase("arriving");await delay(650,signal);if(signal.aborted)return;}
  setPhase("question");window.dispatchEvent(new Event("quavok:rocket-call"));
  const question=speak?await playVoice(`question-${index}`,{owner:"demo",force:true,signal}):"muted";
  if(signal.aborted)return;
  if(question==="cancelled"){setWords(1000);setPhase("settled");return;}
  if(question!=="ended")await delay(1150,signal);
  if(signal.aborted)return;
  setPhase("listening");await delay(450,signal);if(signal.aborted)return;
  setPhase("answering");const count=EXAMPLES[index].answer.split(" ").length;
  const answer=speak?await playVoice(`answer-${index}`,{owner:"demo",force:true,signal,onProgress:progress=>setWords(Math.max(1,Math.ceil(progress*count)))}):"muted";
  if(signal.aborted)return;
  if(answer==="cancelled"){setWords(1000);setPhase("settled");return;}
  if(answer!=="ended"){
   window.dispatchEvent(new CustomEvent("quavok:rocket-talk",{detail:true}));
   for(let i=1;i<=count;i++){if(signal.aborted)return;setWords(i);await delay(48,signal);}
  }
  if(signal.aborted)return;
  setWords(1000);setPhase("settled");window.dispatchEvent(new CustomEvent("quavok:rocket-talk",{detail:false}));
 };
 choose.current=index=>void conversation(index);
 useEffect(()=>{
  if(document.documentElement.classList.contains("qa-pre")){setPhase("building");setWords(0);}
  const ready=(event:Event)=>{
   const completed=event instanceof CustomEvent&&event.detail?.reason==="complete";
   if(!completed){setWords(1000);setPhase("settled");return;}
   if(visible.current)void conversation(0,true);else{waiting.current=true;setPhase("arriving");}
  };
  const call=()=>choose.current(current.current);
  const motion=matchMedia("(prefers-reduced-motion: reduce)");
  const changed=()=>{if(motion.matches){cancel();setWords(1000);setPhase("settled");}};
  const observer=new IntersectionObserver(entries=>{
   visible.current=entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.6);
   if(visible.current&&waiting.current){waiting.current=false;void conversation(0,true);}
   else if(!visible.current&&run.current){cancel();setWords(1000);setPhase("settled");}
  },{threshold:[0,.6]});
  if(figure.current)observer.observe(figure.current);
  motion.addEventListener("change",changed);window.addEventListener(INTRO_DONE_EVENT,ready);window.addEventListener("quavok:hero-call",call);
  return()=>{cancel();observer.disconnect();motion.removeEventListener("change",changed);window.removeEventListener(INTRO_DONE_EVENT,ready);window.removeEventListener("quavok:hero-call",call);};
 },[]);
 const example=EXAMPLES[selected];
 return <figure ref={figure} id="day-preview" className="day-preview" data-phase={phase} data-intro-stage data-intro-conversation aria-label="Conversation with Rocket">
  <div className="day-chrome window-chrome" data-site-piece data-site-art aria-hidden="true"><i/><i/><i/></div>
  <div className="day-question" data-site-piece><span className="day-person">You</span><p key={selected}>{example.question}</p></div>
  <div className="day-rocket"><span id="hero-rocket-perch" aria-hidden="true"/></div>
  <div className="day-answer" data-site-piece><span className="day-speaker">Rocket</span><span className="day-thinking" aria-hidden="true"><i/><i/><i/></span>
   <p aria-busy={phase!=="settled"} aria-live="polite" aria-atomic="true">{example.answer.split(" ").map((word,i)=><span className="reply-word" data-shown={i<words} key={`${selected}-${i}`}>{word}{" "}</span>)}</p>
   <button className="day-listen" type="button" onClick={()=>void playVoice(`answer-${selected}`,{owner:"chat",force:true})} aria-label="Read the example reply aloud"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4ZM17 8q5 4 0 8"/></svg>Hear reply</button>
  </div>
  <figcaption className="day-controls"><div role="group" aria-label="Choose an example question">{EXAMPLES.map((item,i)=><button key={item.question} type="button" aria-pressed={i===selected} aria-label={item.question} onClick={()=>{window.dispatchEvent(new CustomEvent("quavok:rocket-reaction",{detail:""}));choose.current(i);}}>{i+1}</button>)}</div><a href="/?intro=1">Replay intro</a></figcaption>
  <span className="stage-confetti" aria-hidden="true">{Array.from({length:8},(_,i)=><i key={i} style={{"--burst-angle":`${i*45}deg`} as CSSProperties}/>)}</span>
 </figure>;
}
