# Original visual assets

Created for Quavok with the built-in image-generation tool. No reference-site illustrations or video files were copied. Visual inspiration: the authored illustrative world of [Hermes Agent](https://hermes-agent.nousresearch.com/), translated into Quavok's paper/workflow metaphor and charcoal/sand/purple palette.

## Final files

- `public/media/paper-orchestration.webp`: 1536×1024 compressed still, used for the hero background and video poster.
- `public/media/paper-orchestration.mp4`: 960×640, 24fps, 10 seconds, H.264, no audio. A slow, seamless camera-drift study of the original still, not a recording of a real automation.

Original generated PNG retained outside the repo at `/home/box/.codex/generated_images/01a1cc95-c0ca-7af2-bf45-ba8884453b35/exec-aefc6c14-5a5c-481c-aa79-0fa4e170b3d3.png`. The website references only the two project files above.

## Final generation prompt

Use case: stylized-concept. Asset type: original editorial background artwork for Quavok, a managed business-automation studio. Create a wide landscape image, 1536x1024. Subject: an elegant impossible paper-handling mechanism, long warm ivory paper ribbons sweeping through three sculptural metal rings, a few folded sheets moving from a loose pile at the left into one beautifully ordered flowing path at the right. This is a metaphor for repetitive work finding its rhythm. Style: contemporary art-directed copperplate engraving meets tactile cinematic still life, fine etched hatching, sculptural dimensionality, striking restrained composition. Deep warm charcoal #141219 background seamlessly fading into darkness at all edges, sand beige #e8dcc4 highlights, electric purple #8b5cf6 rim light. The mechanism occupies the central 65% of the image with generous dark negative space around it. No green, no teal, no blue, no orange. No text, numbers, letters, UI, logos, watermarks, people, hands, robots, ancient gods, wings, copied imagery, stock-photo look or generic glowing tech orb. Premium, quiet and intriguing, not a busy technical diagram. This should complement a website's real interactive workflow, not depict an interface.

## Video encoding

The still was encoded with FFmpeg using a 1200×800 moving crop of a 1280×854 source, rescaled to 960×640. Crop offsets follow sine/cosine over exactly ten seconds for a seamless loop. H.264 CRF26, slow preset, yuv420p, faststart; no audio stream.

Playback is controlled by viewport intersection, document visibility, intro completion, reduced-motion preference, data-saving preference and the visible pause/play control. The poster is the default. No remote media requests or video libraries are required.

## Hex interaction reference

[Hex](https://anoma.ly/hex/) was inspected in the browser, including its “Play the demo with sound” control. The character/demo uses canvas and authored audio cues. Quavok borrows the opt-in audio pattern: Rocket can read its visible scripted answer through browser speech synthesis. No Hex images, code, voices or sound files were copied. No microphone access or AI backend is introduced.
