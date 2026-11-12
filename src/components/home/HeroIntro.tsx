"use client";

import { useEffect, useRef, useState } from "react";
import { startIntro } from "@/lib/intro/engine";
import { INTRO_KEY } from "@/lib/intro/boot";
import { activateSound, setSoundEnabled } from "@/lib/sound";
import { playVoice, stopVoice } from "@/lib/voice";

export function HeroIntro() {
  const [starting,setStarting]=useState(false);
  const [ready,setReady]=useState(false);
  const start=useRef<(withSound:boolean)=>void>(()=>{});
  useEffect(()=>{
    let stop:(()=>void)|null=null;
    let launched=false;
    let disposed=false;
    let choosing=true;
    let idle:ReturnType<typeof setTimeout>;
    let openingTimeout:ReturnType<typeof setTimeout>;
    const beginBuild=()=>{
      if(disposed||launched)return;
      launched=true; choosing=false; clearTimeout(idle);clearTimeout(openingTimeout);
      stop=startIntro();
    };
    const skip=()=>{
      if(launched){stop?.();return;}
      if(!document.documentElement.classList.contains("qa-prologue"))return;
      choosing=false;clearTimeout(idle);stopVoice("opening");
      try{sessionStorage.setItem(INTRO_KEY,"1");}catch{/* Optional storage. */}
      document.documentElement.classList.remove("qa-pre","qa-prologue");
      beginBuild();
    };
    start.current=async(withSound:boolean)=>{
      if(!choosing||launched)return;
      choosing=false;clearTimeout(idle);setStarting(true);setSoundEnabled(withSound);
      if(withSound){
        openingTimeout=setTimeout(()=>{stopVoice("opening");beginBuild();},6000);
        // Both start synchronously within the user's click. The shared audio
        // element is unlocked before later promise-driven story clips.
        const effects=activateSound();
        const command=playVoice("command",{owner:"opening",force:true});
        await Promise.all([effects,command]);
      }else await new Promise(resolve=>setTimeout(resolve,650));
      beginBuild();
    };
    const key=(event:KeyboardEvent)=>{if(event.key==="Escape")skip();};
    const skipLink=(event:MouseEvent)=>{if(event.target instanceof Element&&event.target.closest(".skip-link"))skip();};
    const startRequested=()=>start.current(true);
    window.addEventListener("quavok:skip-prologue",skip);
    window.addEventListener("quavok:start-build",startRequested);
    document.addEventListener("keydown",key);
    document.addEventListener("click",skipLink,true);
    if(document.documentElement.classList.contains("qa-prologue")){
      window.clearTimeout(window.__qaIntro?.t);
      setReady(true);
      // The entry stays deliberate, but unattended or broken experiences
      // still fail open instead of leaving the website behind a gate.
      idle=setTimeout(skip,15000);
    }else beginBuild();
    return()=>{disposed=true;clearTimeout(idle);clearTimeout(openingTimeout);stopVoice("opening");stop?.();window.removeEventListener("quavok:skip-prologue",skip);window.removeEventListener("quavok:start-build",startRequested);document.removeEventListener("keydown",key);document.removeEventListener("click",skipLink,true);};
  },[]);
  return <>
    {ready&&<div className="qa-entry-actions"><button type="button" className="btn btn-primary" disabled={starting} onClick={()=>start.current(true)}>{starting?"Starting…":"Start with sound"}</button><button type="button" className="qa-entry-quiet" disabled={starting} onClick={()=>start.current(false)}>Continue silently</button></div>}
    <button className="qa-launch-skip" type="button" onClick={()=>window.dispatchEvent(new Event("quavok:skip-prologue"))}>Skip intro</button>
  </>;
}
