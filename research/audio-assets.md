# Quavok audio assets

Audio is optional and begins after a visitor chooses Start with sound or explicitly requests a reply. The website uses no microphone, speech API, voice backend or browser-installed speech voices. All lines are authored examples. Only the requested clip is fetched. The header sound control mutes both voice and effects.

## Voice

`src/lib/voice-catalog.json` is the catalogue for copy, clip paths, duration and section association. The hero and companion use these same lines rather than maintaining different spoken copy. Twenty short, mono MP3s in `public/media/voice/` total about 756 KB. They are 22.05 kHz, 64 kbps; normalized to −18 LUFS with a −1.5 dB true-peak ceiling. A silent 100ms WAV primes the shared media element on an explicit sound gesture when needed.

Generated offline with [Piper](https://github.com/OHF-Voice/piper1-gpl) 1.8.0 using `en_US-ljspeech-medium`. The [model card](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ljspeech/medium/MODEL_CARD) identifies the LJ Speech training dataset as public domain. Only generated audio is shipped; no model, runtime or service dependency is part of the website. Attribution accompanies the clips in `CREDITS.txt`. This is a synthetic voice, not a founder or customer recording.

For regeneration, load that model once with `piper.voice.PiperVoice.load`, synthesize each catalogue text to a mono WAV, then encode with FFmpeg (`loudnorm=I=-18:TP=-1.5:LRA=8`, MP3 64k, 22050 Hz). A subtle pitch difference distinguishes the person (0.96×) and Rocket (1.035×). Measure the final clip duration with ffprobe and update the catalogue. Keep the exact authored text and do not add claims, counts or timing promises.

One shared media player owns the sequence. The opening command finishes before the build begins. Once Rocket has travelled into the hero window, the person asks, then Rocket answers. Question selection cancels the old sequence. Scrolling away cancels the hero voice. Section guides wait 850ms for a stable section, speak once per section, and cancel on a new section. Chat has higher priority. Hiding the tab or muting stops playback. Mouth animation follows the playing/ended events, with a visual-only fallback for silent playback.

## Mechanical keys and UI cues

Four original 120ms mono WAVs in `public/media/keyboard/` were synthesized for this project. They combine a low resonant impact, a filtered keycap click, and a quiet release. Each has a different resonance and decay; their peak amplitude is 0.65, with RMS around 0.12–0.15. Per-keystroke playback varies rate by ±3% and gain by 15% to avoid a machine-gun loop.

These samples play only while `html.qa-building` is present. Rocket’s answers and section narration never trigger typing sounds. One AudioContext decodes the four small files on sound activation, with a master gain of 0.32. Quiet placement, selection and completion cues use short local oscillators. There is no background music.

## Verification

The browser QA drives the real AudioContext and HTMLAudioElement. It verifies decoded waveform energy, advancing voice playback, completed clips, command/build/question/answer ordering, one context, cancellation, mute, and zero keystrokes outside the build. It also checks the eight routes at phone, tablet and desktop sizes, keyboard use, reduced motion, console errors and axe. QA reports and captures are ignored under `.qa/voiced/`.
