# Quavok website redesign — design and build plan

Synthesized 12 November 2026 from `research/grok-x.md` (Grok 4.7, X + web) and `research/sol-web.md` (GPT-6.1-Sol, web galleries and libraries), plus the business brief and the user’s Rocket correction. This is the build contract. Do not invent business claims.

## 1. Product story (non-negotiable)

- **Core business:** fully managed custom AI automation. Quavok builds and runs custom agents, workflows, and integrations that take repetitive employee work off a business (leads, support, CRM/data entry, admin/scheduling, documents, coordination, reporting, and other agreed repetitive work). Built around how each customer already operates — not a pack of prebuilt automations.
- **Promise:** We build the automation. We run the automation. The customer never manages the technology.
- **Absolute rule:** customers never create, configure, deploy, or maintain agents or workflows. No builder UI. They request, approve, and monitor. The team does all technical work.
- **Rocket (user correction):** the customer-facing conversational way to interact with automations Quavok already built. A paid add-on (in development) makes Rocket proactive — it can reach out first with alerts, suggestions, and reports. Rocket gets a real page and a substantial home section, but it is not the hero product. Rocket never builds agents; it may only forward a new-automation request to the team. Desktop/mobile apps and the proactive add-on are in development — label that locally, never as launched.
- **CTA:** discuss automation with the team (“Discuss Your Workflow”, “Book a Discovery Call”). Not “sign up to build agents.”
- **Honesty:** early-stage, two-founder company, working toward client deployments. No testimonials, metrics, pricing tiers, certifications, invented contact details, founder bios, or history. Use clearly marked editable placeholders where a fact is unconfirmed. Do not advertise planned features as available.
- **Tagline:** “Your business runs on processes. We make those processes run themselves.”
- **Hero headline:** “Automate the work you'd otherwise hire for.”
- **Hero sub:** “We build and manage custom AI agents and workflows that take repetitive business operations off your team's plate...” (complete faithfully from the brief).
- **Hero CTAs:** “Discuss Your Workflow” / “See What We Automate.”
- **Final CTA:** “Your next hire might be an automation.” Supporting: “Show us the repetitive work slowing your business down. We'll help you explore how custom AI agents and workflows could handle it.” Button: “Book a Discovery Call.”

Existing public details already on the current site (email `hello@quavok.com`, the published phone, Dasuya address) may be reused; do not invent new ones. Do not keep WhatsApp-assistant-as-the-product positioning. A WhatsApp chat button, if kept at all, is not the primary CTA and must not re-centre the story on WhatsApp.

## 2. Tech and deploy

- Today: multi-page static HTML at repo root, `CNAME` = `quavok.com`, GitHub Pages from `main`. Do not push, merge, open a PR, edit `main`, or change CNAME / Pages settings.
- **Build the new site as Next.js + React + TypeScript + Tailwind CSS with `output: 'export'`** so it can later be deployed the same way (static files, trailing-slash directory pages, keep `CNAME` in the export). Local preview: `npm run dev` and also verify `npm run build` produces a working `out/` (or equivalent) that can be served statically.
- Evolve the current labelled-cursor intro (`assets/build-intro.js` / `build-intro.css`) rather than replacing it with a stock template or a “swarm of agents” clone. The engine’s rules stay: one rAF, measure-then-write, skip / Escape / reduced-motion / watchdog, fail open, transform/opacity/clip-path only, real DOM nodes not a canvas video.
- Keep the existing logo lockups and favicons unless they clearly break the new system. Self-host fonts.
- Performance and a11y are requirements: mobile-first, keyboardable, good contrast, `prefers-reduced-motion` shows finished states (graph drawn, lanes settled, trace complete, Rocket as static text, no intro overlay). Cap the intro around five seconds. No autoplaying sound.

## 3. Site map

Complete, navigable, with SEO metadata on every page:

| Page | Purpose |
| --- | --- |
| Home `/` | Sections below. |
| Services `/services` | Automation development, AI agent development, integrations, fully managed hosting/maintenance. |
| Solutions `/solutions` | Illustrative workflows by department or problem. Clearly illustrative, not case studies. |
| How It Works `/how-it-works` | Discovery → design → build → deploy & ongoing management. Customers never build. |
| About `/about` | Credible two-founder early-stage intro. No invented bios or milestones. Placeholders if needed. |
| Rocket `/rocket` | Conversational companion + proactive add-on (in development). Forward-only for new automations. |
| Contact `/contact` | Lead form: describe what they want automated. **Do not claim the form works** until a real destination exists. Leave a clearly marked hook (e.g. `TODO: wire form destination`) and a mailto using the existing public email as a working fallback. |

Homepage sections, in order:

1. **Hero** — headline, sub, CTAs, live workflow-assembly intro (see effects).
2. **Problem** — repetitive employee-performed work slowing the business down.
3. **What we automate** — the eight brief categories.
4. **Before / after** — manual coordination vs managed automation (no metrics).
5. **How we work** — four steps; customers never build.
6. **Why us** — managed, custom, you approve, we run it. No fake proof.
7. **Rocket** — interact with running automations; proactive add-on in development.
8. **FAQs** — the nine brief questions, answered honestly.
9. **Final CTA** — “Your next hire might be an automation.”

Shared chrome: refined nav, footer, primary/secondary CTAs. Design system: strong typography, spacious layouts, refined palette, consistent type scale and spacing. Premium contemporary tech company — Linear / Resend / Vercel *energy*, not a generic agency template, not a chatbot product site.

## 4. Visual concept

Business processes being automated: task slips, fine connectors, explicit approval gates, quiet completion. Not robot clichés, not chatbot-bubble heroes, not crowded fake dashboards, not generic neural-net graphics, not “100s of AI agents” swarm hoaxes (see Grok research). Rocket is a conversation *over* a running system, secondary in the hero, substantial later.

## 5. Effects to implement (agreed shortlist)

Both research reports independently ranked the same core set. Implement these, sharing one visual language and the same scene assets where possible. All must work in a static export.

1. **Workflow-assembly hero intro (signature).** Keep the four labelled cursors and fail-open engine. Retarget them: they wire a five-node business process (e.g. enquiry → qualify → CRM note → follow-up → nightly summary) and Review stamps “Scope approved.” Type the real headline with the existing measured clip-path caret. Promise and CTAs remain visible. Finite, skippable, replayable with `?intro=1`. Do not import swarm-cursors or add an agent counter.
2. **Scroll-drawn, read-only workflow graph.** Reuse the hero’s finished graph. As How-we-work (or a dedicated automate section) enters, edges draw once (`animation-timeline: view()` where supported; finished graph otherwise). Nodes can be focusable for short explanations. One visible exception/approval route. No builder, no live backend, no pin on the first pass.
3. **Before/after settle.** The same tasks move from a messy manual pile into lanes such as *handled / waiting on you / with a person*. Toggle plus a settled rest state. FLIP or view transitions. No hours-saved or other metrics.
4. **How-we-work story (four steps).** Understand → build → run → keep improving, told as ordinary scroll. A sticky desktop scene is optional only if it stays calm and never runs during the intro; on mobile, stack the beats. Include a light “dedicated managed environment” cue in the last beat without making the page about servers.
5. **Operational receipt / run trace.** A short *business-language* log (not a terminal skin, not a matrix aesthetic) for one clearly labeled sample — include a human approval hold. Reveal when the “we run it” beat enters.
6. **Rocket vignette.** Ask-mode conversation over the running graph, then a separate “Reaches out — in development” proactive state. Forward-only control for requesting a new automation. Not WhatsApp, not a builder, not an app download.
7. **Motion system.** Replace generic fade-ins with a restrained blur + short rise + stagger, once per section. `scale(0.97)` on `:active` for buttons. At most one magnetic pull, on the primary CTA, fine-pointer only.
8. **Typography and atmosphere.** A tight type system (one display family, one text family — the current Bricolage + Inter pairing may be evolved, not cluttered). Optional still SVG grain if washes band; no full-page WebGL hero. Cross-document view transitions on the logo (`@view-transition`) under `prefers-reduced-motion: no-preference`, <300ms, instant fallback.

**Defer:** Lenis (unless scroll feels broken), pinned multi-beat scrollytelling, particle fields, Paper-style shaders — only if the eight above already feel premium and fast. Choose at most one atmospheric experiment, still-frame during the intro, frozen on reduced motion, off when offscreen.

**Do not do:** swarm-of-agents load tricks; hidden cursors; autoplaying audio; fake metrics/counters; robot mascots; “try the builder”; presenting Rocket as launched; claiming the contact form is live without a destination; copying Linear/Vercel chrome wholesale.

## 6. Build sequence (agents)

1. **Opus 4.5 / 5.5 (this pass): build the full site** on branch `redesign/managed-automation` in this worktree. Information architecture, design system, all pages, all homepage sections, the effects above (or faithful first implementations), SEO, a11y hooks, static export, local dev script. Leave clearly marked placeholders and the form hook. Do not invent claims. Do not commit if the parent will commit, but leave the tree buildable. Do not push.
2. **Astra (second pass):** design polish, motion and interaction refinement, accessibility, performance, responsive/mobile, bug fixes, leftover visual cheapness. Do not clobber architecture or rewrite working effects from scratch unless they are broken. Do not push.

## 7. Acceptance

- `npm run build` (or documented equivalent) succeeds; static export can be served locally.
- Every listed page is reachable from the nav on desktop and mobile.
- Reduced motion and skip work; intro does not trap focus or block the page if JS fails.
- Grep finds no invented testimonials, client counts, revenue, or “hours saved.”
- Rocket development status is visible wherever Rocket’s unreleased parts appear.
- Contact form does not claim successful submission without a real backend; hook is marked.
