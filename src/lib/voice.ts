import catalog from "./voice-catalog.json";
import { soundEnabled } from "./sound";

export type VoiceOwner = "opening" | "demo" | "chat";
export type VoiceResult = "ended" | "cancelled" | "muted" | "blocked" | "busy" | "missing";
type Options = { owner: VoiceOwner; force?: boolean; signal?: AbortSignal; onProgress?: (progress:number)=>void };
const priority: Record<VoiceOwner,number> = {demo:1,opening:2,chat:3};
let player: HTMLAudioElement | null = null;
let owner: VoiceOwner | null = null;
let finishCurrent: ((result:VoiceResult)=>void) | null = null;
let primed = false;
let generation=0;
let prime: Promise<boolean> | null = null;

function audio() { if (!player) { player=new Audio(); player.preload="auto"; player.volume=.9; } return player; }
function announce(active:boolean,line?:typeof catalog[number],source?:VoiceOwner) {
  window.dispatchEvent(new CustomEvent("quavok:voice-state",{detail:{active,role:line?.role || "rocket",text:line?.text || "",owner:source || null}}));
}
export function voiceOwner() { return owner; }
export function stopVoice(source?:VoiceOwner) {
  if (source && owner!==source) return;
  finishCurrent?.("cancelled");
}
export function voiceText(id:string) { const line=catalog.find(item=>item.id===id); if(!line)throw Error(`Missing voice line: ${id}`); return line.text; }
export function voiceForText(text:string) { return catalog.find(line=>line.text===text)?.id; }
export function primeVoice(): Promise<boolean> {
  if (primed || owner) return Promise.resolve(true);
  if (prime) return prime;
  const ticket=generation;
  const element=audio(); element.muted=false; element.src="/media/voice/unlock.wav";
  prime=element.play().then(()=>{if(ticket===generation){element.pause();element.currentTime=0;element.muted=false;}primed=true;window.dispatchEvent(new Event("quavok:audio-ready"));return true;}).catch(()=>{element.muted=false;return false;}).finally(()=>{prime=null;});
  return prime;
}
export function playVoice(id:string,options:Options):Promise<VoiceResult> {
  if ((!soundEnabled() && !options.force) || document.hidden) return Promise.resolve("muted");
  if (options.signal?.aborted) return Promise.resolve("cancelled");
  const line=catalog.find(item=>item.id===id);
  if (!line) return Promise.resolve("missing");
  if (owner && priority[owner]>priority[options.owner]) return Promise.resolve("busy");
  generation++; stopVoice();
  const element=audio();
  owner=options.owner;
  element.muted=false; element.volume=.9; element.src=line.src;
  return new Promise(resolve=>{
    let finished=false;
    let progress:ReturnType<typeof setInterval> | undefined;
    const timeout=setTimeout(()=>settle("blocked"),(line.duration+12)*1000);
    const aborted=()=>settle("cancelled");
    const settle=(result:VoiceResult)=>{
      if (finished) return; finished=true;
      clearTimeout(timeout);clearInterval(progress);
      options.signal?.removeEventListener("abort",aborted);
      element.pause();element.onplaying=null;element.onended=null;element.onerror=null;
      finishCurrent=null;owner=null;
      if (result==="ended") options.onProgress?.(1);
      announce(false,line,options.owner); resolve(result);
    };
    finishCurrent=settle;
    options.signal?.addEventListener("abort",aborted,{once:true});
    element.onplaying=()=>{
      primed=true;announce(true,line,options.owner);
      progress=setInterval(()=>options.onProgress?.(Math.min(1,element.currentTime/(element.duration || line.duration))),70);
    };
    element.onended=()=>settle("ended");
    element.onerror=()=>settle("blocked");
    element.play().catch(()=>settle("blocked"));
  });
}
if (typeof window!=="undefined") {
  window.addEventListener("quavok:sound-change",event=>{if(event instanceof CustomEvent && !event.detail)stopVoice();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)stopVoice();});
}
