// One audio context for recorded mechanical-keyboard samples and quiet UI cues.
// Samples load only when sound is enabled. No microphone or remote service.
export type Sound = "key" | "place" | "select" | "open" | "close" | "call" | "reply" | "done" | "celebrate";
let context: AudioContext | null = null;
let master: GainNode | null = null;
let keys: AudioBuffer[] = [];
let loadingKeys: Promise<void> | null = null;
let enabled = false;
let lastKey = -1;
let lastCue = -1;
let lastSample = -1;
let lastCelebrate = -10;
let shimmer: AudioBuffer | null = null;

export function soundEnabled() { return enabled; }
// Rocket answers aloud when someone asks him something, unless the visitor
// has explicitly chosen silence (header mute or "Continue silently").
export function soundAllowed() {
  if (enabled) return true;
  try { return localStorage.getItem("quavok-sound-effects") !== "off"; } catch { return true; }
}
export function setSoundEnabled(value: boolean) {
  enabled = value;
  if (!value) void context?.suspend();
  if (typeof window!=="undefined") {
    try { localStorage.setItem("quavok-sound-effects",value ? "on" : "off"); } catch { /* Optional storage. */ }
    window.dispatchEvent(new CustomEvent("quavok:sound-change",{detail:value}));
  }
}
export async function activateSound() {
  if (!enabled || !("AudioContext" in window)) return false;
  try {
    if (!context) {
      context = new AudioContext({ latencyHint: "interactive" });
      master = context.createGain();
      master.gain.value = .32;
      master.connect(context.destination);

    }
    if (context.state === "suspended") await context.resume();
    if (!loadingKeys) loadingKeys=Promise.all(["/media/keyboard/key-1.wav","/media/keyboard/key-2.wav","/media/keyboard/key-3.wav","/media/keyboard/key-4.wav","/media/keyboard/key-5.wav","/media/keyboard/key-6.wav"].map(async url=>{
      const response=await fetch(url); if(!response.ok)throw Error("Keyboard sample unavailable");
      return context!.decodeAudioData(await response.arrayBuffer());
    })).then(buffers=>{keys=buffers;}).catch(()=>{keys=[];loadingKeys=null;});
    await loadingKeys;
    return context.state === "running";
  } catch { return false; }
}
export function pauseSound() { void context?.suspend(); }

function tone(frequency: number, endFrequency: number, start: number, duration: number, volume: number, type: OscillatorType = "sine") {
  if (!context || !master) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + .003);
  gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
  oscillator.connect(gain); gain.connect(master);
  oscillator.start(start); oscillator.stop(start + duration + .01);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}

// A soft bell: quick attack, long natural decay, a faint octave partial.
function bell(frequency: number, start: number, volume: number) {
  tone(frequency, frequency, start, .9, volume);
  tone(frequency * 2, frequency * 2, start, .35, volume * .18);
}
// The faint rustle of confetti: band-passed noise that fades out.
function sparkle(start: number) {
  if (!context || !master) return;
  if (!shimmer) {
    shimmer = context.createBuffer(1, Math.floor(context.sampleRate * .6), context.sampleRate);
    const data = shimmer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = shimmer;
  filter.type = "bandpass"; filter.frequency.value = 6500; filter.Q.value = .7;
  gain.gain.setValueAtTime(.0001, start);
  gain.gain.exponentialRampToValueAtTime(.05, start + .04);
  gain.gain.exponentialRampToValueAtTime(.0001, start + .55);
  source.connect(filter); filter.connect(gain); gain.connect(master);
  source.start(start); source.stop(start + .6);
  source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
}

export function playSound(sound: Sound, heavy = false) {
  if (!enabled || !context || !master || context.state !== "running" || document.hidden) return;
  const t = context.currentTime;
  if (sound === "key") {
    if (t - lastKey < .025) return;
    lastKey = t;
    if (!document.documentElement.classList.contains("qa-building") || !keys.length) return;
    // The last sample is the heavier, spacebar-like press. Regular keys never
    // repeat the same sample twice in a row, and each press lands a few ms
    // off the grid, the way a person actually types.
    const regular = keys.length > 5 ? keys.length - 1 : keys.length;
    let pick = heavy && keys.length > 5 ? keys.length - 1 : Math.floor(Math.random() * regular);
    if (!heavy && regular > 1 && pick === lastSample) pick = (pick + 1 + Math.floor(Math.random() * (regular - 1))) % regular;
    lastSample = pick;
    const source=context.createBufferSource();
    const gain=context.createGain();
    source.buffer=keys[pick];
    source.playbackRate.value=.96+Math.random()*.08;
    gain.gain.value=(heavy ? .95 : .72)+Math.random()*.22;
    source.connect(gain);gain.connect(master);source.start(t + Math.random()*.014);
    source.onended=()=>{source.disconnect();gain.disconnect();};
    return;
  }
  if (t - lastCue < .045) return;
  lastCue = t;
  switch (sound) {
    case "place": tone(240, 110, t, .055, .4, "triangle"); break;
    case "select": tone(430, 340, t, .045, .2); break;
    case "open": tone(220, 410, t, .10, .23); break;
    case "close": tone(320, 170, t, .075, .2); break;
    case "call": tone(320, 520, t, .12, .24); break;
    case "reply": tone(440, 580, t, .08, .18); tone(660, 660, t + .07, .10, .15); break;
    case "done": if (t - lastCelebrate < 4) break; tone(440, 440, t, .12, .2); tone(660, 660, t + .09, .16, .18); break;
    case "celebrate":
      // G major, rising and quiet: G5, B5, D6, G6.
      lastCelebrate = t;
      [784, 987.8, 1174.7, 1568].forEach((f, i) => bell(f, t + i * .075, .12 - i * .017));
      sparkle(t + .02);
      break;
  }
}
