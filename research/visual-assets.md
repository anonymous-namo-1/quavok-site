# Original visual assets

Created for Quavok with the built-in image-generation tool. No reference-site illustrations or video files were copied. Visual inspiration: the authored illustrative world of [Hermes Agent](https://hermes-agent.nousresearch.com/), translated into Quavok's paper/workflow metaphor and charcoal/sand/purple palette.

## Retired experiment (removed from public/)

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

## Current workday photographs

Both were created with the built-in image-generation tool and are generic editorial images, not depictions or testimonials of Quavok founders or clients. No Hermes assets were copied. Compressed final project files:

- `public/media/focus-on-craft.webp` — 1280px-wide photo of hands finishing a ceramic bowl, paired with enquiry/follow-up status windows.
- `public/media/human-decisions.webp` — 1280px-wide photo of hands reviewing a sample and plan, paired with approval/human-escalation windows.

Generation prompts:

1. Use case: photorealistic-natural. Asset type: original editorial photograph for a managed-automation website, not a customer testimonial. Create a landscape 1536x1024 monochrome photograph. Close documentary view of an anonymous craftsperson's hands shaping and finishing a small ceramic bowl at a clean contemporary workbench. Visible real clay texture, tools and a natural linen apron; crop above shoulders so no face is visible. Quiet focus on the work, beautiful tactile detail, directional window light, a serious premium small-business studio. Composition: hands and bowl occupy the right two-thirds, darker uncluttered workbench on left leaves room for a website UI overlay. True black and white, neutral grayscale, no sepia or colored objects. No screens, no text, no lettering, no logos, no watermarks, no robots, no fantasy machinery, no futuristic gradients. It represents people focusing on their craft while routine administration is taken care of.

2. Use case: photorealistic-natural. Asset type: original editorial photograph for a managed-automation website. Landscape 1536x1024. A natural candid close-up of two anonymous people in a small professional studio reviewing a material sample and a simple unlabelled plan across a wooden table. Only hands, forearms and cropped torsos are visible, no faces. The interaction should convey attentive personal customer service and human judgment, with one hand pointing to the physical sample and another holding a pencil. Soft daylight from a nearby window, refined documentary photography, tactile natural materials, calm composition with empty darker space toward the lower right for a small website UI overlay. True neutral black and white photograph, no sepia, no colored tones. No readable text, no logos, no branded devices, no watermarks, no illustrated robots, no abstract machines. Do not depict a specific founder, client, company or historical event.

The earlier paper/ring artwork and its camera-drift video were removed after owner feedback because they did not explain the product. Current photography is static; there is no Play Film control or video request.
