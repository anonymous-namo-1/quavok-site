// Original procedural UI sounds. One audio context and one noise buffer;
// no recordings, remote requests, microphone access or background music.
export type Sound = "key" | "place" | "select" | "open" | "close" | "call" | "reply" | "done";
let context: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let enabled = false;
let lastKey = -1;
let lastCue = -1;

export function soundEnabled() { return enabled; }
export function setSoundEnabled(value: boolean) {
  enabled = value;
  if (!value) void context?.suspend();
}
export async function activateSound() {
  if (!enabled || !("AudioContext" in window)) return false;
  try {
    if (!context) {
      context = new AudioContext({ latencyHint: "interactive" });
      master = context.createGain();
      master.gain.value = .16;
      master.connect(context.destination);
      noise = context.createBuffer(1, Math.ceil(context.sampleRate * .045), context.sampleRate);
      const samples = noise.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    }
    if (context.state === "suspended") await context.resume();
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

export function playSound(sound: Sound) {
  if (!enabled || !context || !master || context.state !== "running" || document.hidden) return;
  const t = context.currentTime;
  if (sound === "key") {
    if (t - lastKey < .025) return;
    lastKey = t;
    // A sharp switch click over a short, low keycap thock.
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = noise;
    filter.type = "bandpass"; filter.frequency.value = 1800 + Math.random() * 1400; filter.Q.value = .7;
    gain.gain.setValueAtTime(.5, t);
    gain.gain.exponentialRampToValueAtTime(.0001, t + .035);
    source.connect(filter); filter.connect(gain); gain.connect(master);
    source.start(t); source.stop(t + .045);
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
    const pitch = 110 + Math.random() * 45;
    tone(pitch, 65, t, .055, .32, "triangle");
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
    case "done": tone(440, 440, t, .12, .2); tone(660, 660, t + .09, .16, .18); break;
  }
}
