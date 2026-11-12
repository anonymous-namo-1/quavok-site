# quavok.com

Marketing site for Quavok: fully managed, custom AI automation. We build the automation. We run the automation.

Next.js (App Router) + React + TypeScript + Tailwind CSS v4, exported as plain static files (`output: 'export'`, trailing-slash directory pages) so it can be hosted on GitHub Pages like the previous site.

## Run it

```bash
npm install        # Node 20.9+
npm run dev        # http://localhost:3000 with hot reload
npm run build      # static export to out/
npm run preview    # serve out/ at http://localhost:4173 (no extra dependencies)
npm run typecheck
```

`npm run build` writes `out/` with one directory per page (`out/services/index.html`, …), `404.html`, `sitemap.xml`, `robots.txt`, `og.png`, `CNAME` (`quavok.com`) and `.nojekyll`. The `.nojekyll` file is required on GitHub Pages; without it, Jekyll drops the `_next/` asset folder.

The public review copy uses the separate `vekhyat/quavok-preview` GitHub Pages repository. The production repository and `quavok.com` configuration are independent. A preview build needs the `/quavok-preview` base path and prefixed public URLs; production builds retain `/` and `CNAME`.

## Pages

| Route | Source |
| --- | --- |
| `/` | `src/app/page.tsx` — hero, problem, what we automate, before/after, how we work, why us, Rocket, FAQ, final CTA |
| `/services/` | `src/app/services/page.tsx` |
| `/solutions/` | `src/app/solutions/page.tsx` (illustrative examples, not case studies) |
| `/how-it-works/` | `src/app/how-it-works/page.tsx` |
| `/about/` | `src/app/about/page.tsx` |
| `/rocket/` | `src/app/rocket/page.tsx` |
| `/contact/` | `src/app/contact/page.tsx` + `src/components/ContactForm.tsx` |
| `/privacy/` | `src/app/privacy/page.tsx` (website-only notice; full policy is a placeholder) |

Shared facts (email, phone, address, nav, CTAs) live in `src/lib/site.ts`. FAQ copy is in `src/lib/faqs.ts`, workflow examples and graph geometry in `src/lib/workflows.ts`.

Navigation uses plain `<a>` links on purpose: every page is its own document, which keeps the intro boot script honest and lets cross-document view transitions (`@view-transition`) animate the logo between pages.

## Before launch: things to fill in

Search the code for `PLACEHOLDER` and `TODO`:

- **Contact form destination** — `src/components/ContactForm.tsx` (`TODO: wire form destination`, `FORM_ENDPOINT`). Until it is set, the form only opens the visitor's email app with the message filled in (mailto to hello@quavok.com) and says so. Do not change the copy to "sent" without a real backend.
- Founder names, roles, bios and photos — `src/app/about/page.tsx`.
- Support hours / response times — `src/lib/faqs.ts`, `src/app/how-it-works/page.tsx`.
- Booking calendar link — `src/app/contact/page.tsx`.
- Rocket base availability — confirm the visible availability placeholder before making launch claims.
- Full privacy policy — `src/app/privacy/page.tsx`.

## Effects and where they live

All effects fail open: the finished state is in the HTML, reduced motion shows it immediately, and nothing depends on a backend.

| Effect | Files |
| --- | --- |
| Page-assembly intro (anonymous cursors assemble navigation, headline, artwork, page sections and the workflow) | `src/lib/intro/boot.ts` (inline boot), `src/lib/intro/engine.ts`, `src/components/home/HeroIntro.tsx`, intro CSS in `globals.css` (`qa-*`) |
| Electric Purple run through the finished hero graph | `src/components/home/HeroStage.tsx` |
| Read-only scenario graph, scroll-drawn edges, inspectable steps | `src/components/graph/WorkflowGraph.tsx`, `ScenarioGraph.tsx` |
| Before/after settle (FLIP) | `src/components/home/BeforeAfter.tsx` |
| Four-step story + run trace with an approval hold | `src/components/HowWeWork.tsx`, `src/components/RunTrace.tsx` |
| Rocket vignette (questions and forward-only requests) | `src/components/RocketVignette.tsx` |
| Section entrances (blur + rise + stagger, once) | `src/components/MotionRuntime.tsx`, `[data-rv]` |
| One magnetic CTA (fine pointer only) | `src/components/Magnetic.tsx` |

Intro rules: plays once per tab (sessionStorage), always with `?intro=1`, never with reduced motion or when arriving on a `#hash`. Skip button, Escape, a tap, tabbing into the page, hiding the tab, scrolling the hero away, a stalled frame, an error or the watchdog all end it on the normal page. The headline is typed with a measured per-character clip; the promise and CTAs are never hidden. `legacy-reference/` keeps the previous site's intro engine for comparison.

## Content rules

Quavok is an early-stage, two-founder company working toward its first deployments. The site must not claim testimonials, client counts, metrics, pricing tiers, certifications, history or launched features that don't exist. Customers never build, configure or deploy automations; Rocket only forwards new-automation requests to the team. Planning notes are in `research/`.

## Current visual and interaction system

The resting palette is monochrome: Midnight `#101010`, Charcoal `#282828`, Surface `#181818`, Card `#202020`, Off-white `#f0f0f0`, muted text `#b8b8b8`. Purple accents primary actions, focus and Rocket. Six distinct colors are reserved for the anonymous cursor-build performance.

The first visit opens with Rocket on an empty screen. Its command starts six cursors assembling actual page elements, followed by the new-leads question and Rocket’s authored reply. Skip, Escape, keyboard entry, reduced motion, error recovery and the watchdog all release the finished page. No scroll hijack or backend is involved.

Rocket is one round character with two expressive eyes. It travels between reserved page anchors beside the hero, workflow examples, photo windows, process, CTA and footer. Mobile conversation bubbles move to a reserved header area. Click or Cmd/Ctrl+K opens the compact bubble; close, outside click and Escape restore focus. Only minimisation is remembered. Spoken replies are optional and browser-provided.

The homepage uses purpose-led black-and-white photos in framed windows: routine follow-ups are handled while people focus on craft and decisions. There is no decorative film or abstract background machine. `WorkWindows.tsx` owns the photo compositions. Asset provenance and full generation prompts are in `research/visual-assets.md`.

Type is self-hosted Sora and Manrope. OFL licences and build-only OG fonts are in `src/fonts/`. `npm run build` creates the matching OG image before exporting.

`SoundControl.tsx` and `lib/sound.ts` provide one shared browser AudioContext for mechanical typing, placement, selection, Rocket and reply cues. Sound is opt-in and remembered. “Build with sound” starts the opening sequence after audio is unlocked. The header control mutes effects; hidden tabs pause them.

Public copy omits repetitive demo badges and unreleased-feature promotion. The companion retains its single demo disclosure. Contact form and unconfirmed business placeholders remain honest and visible.

QA artifacts live in `.qa/` (ignored). Checks cover the eight routes, desktop/mobile/tablet layouts, keyboard, axe, console errors, character travel, intro exits, sound and static-export artifacts.
