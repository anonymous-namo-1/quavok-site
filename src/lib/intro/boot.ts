// Inline boot script for the homepage intro. It runs while the HTML is being
// parsed, before the hero is painted, and decides whether to play:
//   - always with ?intro=1
//   - never with prefers-reduced-motion
//   - otherwise once per tab (sessionStorage), and not when arriving on a #hash
// If it plays, html.qa-pre holds the built pieces invisible. The hold is
// removed by a timeout even if the engine never loads (fail open), and the
// CSS hold itself expires after a few seconds.
export const INTRO_KEY = "quavok-workflow-intro";

export const INTRO_BOOT = `(function(){try{if(location.pathname!=="/")return;var d=document.documentElement,f=/[?&]intro=1(&|$)/.test(location.search),s=false;try{s=sessionStorage.getItem("${INTRO_KEY}")==="1"}catch(e){}if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||location.hash||(!f&&s))return;if(!f&&window.pageYOffset>40)return;d.classList.add("qa-pre","qa-prologue");window.__qaIntro={forced:f,t:setTimeout(function(){d.classList.remove("qa-pre","qa-prologue")},3000)}}catch(e){}})();`;
