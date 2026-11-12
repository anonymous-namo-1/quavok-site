# Inspiration scan (Nov 12, 2026)

Inspiration only. Do not copy assets, illustrations, or text. Screenshots are in /workspace/quavok-shots/inspo-*.png (on the box, not committed).

## Sites

| Site | URL | What makes it striking |
|---|---|---|
| Hermes Agent (Nous Research) | https://hermes-agent.nousresearch.com/ | It commits to ONE saturated colour: a full-bleed electric ultramarine (#0000FF-ish) for the whole top half, then flips to an off-white section that keeps the same blue for all ink. The hero headline is very tall and condensed at a light weight ("The Agent That Grows With You"). Next to it sits a huge engraved, classical-myth illustration (a multi-armed figure holding light rays) that has been duotoned into the brand blue. Spaced uppercase nav, small mono labels, and a terminal snippet with an OS tab switcher as the CTA. Feature cards each carry a duotone engraving. Section titles use superscript counters. |
| Nous Research | https://nousresearch.com/ | A gigantic condensed wordmark fills the width. A blue-on-light-grey monochrome. A ⌘K command-bar pill sits under the nav like a search box. An "Announcements" feed is pulled from X. Little stamped-logo badges. Very editorial, and confident because it is restrained. |
| OpenBot (openbot.run, the "team of AI agents on your computer" app) | https://openbot.run/ | Dark charcoal base with ONE magenta/violet light beam crashing down from the top right, glowing like a spotlight. The mascot is a rounded-square bot face (two dot eyes) set INLINE in the headline ("Meet [bot] OpenBot"). A real app preview sits in a window frame. The "Your agents work together" section shows small coloured agent avatars (each its own colour and name) connected by dotted lines, passing speech bubbles to one another. Character-driven, minimal, dark. |
| OpenBot by CopilotKit (a different product with the same name) | https://open.bot/ | Light lavender UI with an iridescent cyan-to-magenta blob sphere and floating glass cards ("SSO, approvals, and audit"). Cleaner but more generic; it helped mainly as a contrast to what NOT to do (template SaaS). |
| Cyera AI Guardian (Awwwards SOTD, Nov 11 2026, by Active Theory) | https://secure-the-unknown.cyera.com/ | A gamified microsite: you pilot a vessel through 3 "AI planets" with mini-games (constellation, navigation, defense). Deep violet palette (#441363 / #6D2D93). Takeaway: turn the explanation into play. It is WebGL-heavy, so it did not render in the headless capture. |
| Heron AI (Awwwards SOTD, Oct 12 2026) | https://heronaiapp.com/ | A cream paper background with hairline grid rules framing the whole viewport. One large hand-drawn architectural etching as the hero, and a tiny orange-red mono "CONTACT US" in the corner. Blueprint/editorial restraint that feels crafted, not templated. |
| AI in Design Report 2026 (Awwwards SOTD, Aug 26 2026) | https://stateofaidesign.com/ | A collage hero of tiled, blurred, abstract photos in coral, lilac and sage, with small mono role tags ("FOUNDER", "CREATIVE DIRECTOR") pinned on the tiles like stickers. A big grotesque headline. A solid coral block for the CTA sits in the nav. Mono microcopy ("Scroll to read ↓"). |
| Imogen: Agentic AI (Awwwards HM, Oct 19 2026) | https://vsproject-imogen.vendredi-society.com/ | Immersive WebGL agent storytelling. It did not render headless; noted for the idea of an agent "character" narrating the story. |
| MECHA (Awwwards SOTD) | https://mecha-xyz.webflow.io/ | "Deploys physical automation into legacy industries." Industrial/robotic brand language. Close to Quavok's positioning (automation for unglamorous operations). |

## Distilled, actionable ideas for Quavok (dark theme)

1. **Commit to one saturated colour field** (Hermes). Let one of the two complementary colours flood a whole section, e.g. a full-bleed coral or petrol band, with type in the base colour. Don't sprinkle it.
2. **Put the mascot inside the headline** (OpenBot). The Rocket-trial bot face can sit inline in the hero headline as a glyph, then "detach" and start following the visitor as they scroll. That is the bot's origin moment.
3. **A spotlight/light-beam hero** (OpenBot). One dramatic accent-coloured beam or glow on the dark base, lighting the live agent-build canvas from above. Use a single CSS radial/conic gradient, not WebGL.
4. **Agents as coloured characters with names, connected by dotted lines, passing bubbles** (OpenBot). Use this for the hero build and the "how we work" section: each agent cursor has its own colour, name and personality, and they hand tasks off along dotted connectors.
5. **Condensed, oversized display type** (Hermes and Nous). One giant word or wordmark spanning the full width somewhere (e.g. "QUAVOK" or "OFF YOUR PLATE" in the footer), using Bricolage's condensed/wide axes at extreme sizes.
6. **An engraving/duotone illustration style** (Hermes, Heron). If we use any imagery, make it duotone in the palette with an etched or hatched texture (CSS filter or SVG pattern), not stock photos or 3D blobs.
7. **Sticker/tag annotations** (AI in Design Report). Small mono tags pinned at angles onto cards ("ops", "invoices", "follow-ups") and hand-drawn arrows or circles calling things out.
8. **A ⌘K command-bar pill** (Nous). A quirky "Ask Rocket (trial) ⌘K" pill in the nav that opens the scripted bot. It doubles as an easter-egg entry point.
9. **Hairline-grid editorial framing** (Heron). Thin rules framing sections, with mono coordinates or labels in the corners ("§02 / HOW WE WORK"), so it reads as crafted and not like a template.
10. **Playful explanation** (Cyera). A tiny optional mini-game or toy in the workflow section, e.g. drag a messy task onto the conveyor and watch the agents process it. Keep it lightweight in DOM/SVG.
11. **Avoid**: generic glass cards with blob spheres (open.bot), uniform 3-card grids, stock gradients.

## Follow-up: open workflow and compact Rocket (November 2026)

Reviewed related Dribbble compositions: [NexUX connected workflow](https://dribbble.com/shots/27186040-Ai-Agent-Website-Design) and [Sudarshan's layered conversation](https://dribbble.com/shots/26916324-AI-Agents-Landing-page). The owner's [Alamgir reference](https://dribbble.com/shots/26757421-AI-agent-website-landing-page) exposed page metadata but its artwork could not be fetched reliably. No visual conclusions were drawn from that unavailable image.

Opus 5.5 supplied source-based guidance: preserve intro selectors/geometry, remove the outer workflow card, add illustrative approval/exception choices, layer the existing Rocket example, and shorten duplicated homepage explanations. Implementation retains the detailed how-we-work and run trace behind an accessible disclosure. The companion itself stays small; only an explicit action opens its compact speech bubble. Reference assets, claims and client logos are not reused.
