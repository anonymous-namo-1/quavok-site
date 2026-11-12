# quavok.com

Marketing site for Quavok: fully managed, custom AI automation. We build the automation. We run the automation.

Next.js (App Router) + React + TypeScript + Tailwind CSS v4, exported as plain static files (`output: 'export'`, trailing-slash directory pages) so it can be hosted on GitHub Pages like the previous site.

## Run it

```bash
npm install        # Node 20.9+
npm run dev        # http://localhost:3000 with hot reload
npm run build      # static export to out/
npm run conversation    # serve out/ at http://localhost:4173 (no extra dependencies)
npm run typecheck
```

`npm run build` writes `out/` with one directory per page (`out/services/index.html`, …), `404.html`, `sitemap.xml`, `robots.txt`, `og.png`, `CNAME` (`quavok.com`) and `.nojekyll`. The `.nojekyll` file is required on GitHub Pages; without it, Jekyll drops the `_next/` asset folder.

Deploying is deliberately not wired up. To publish later, put the contents of `out/` on the Pages branch (or use a Pages workflow that runs `npm ci && npm run build` and uploads `out/`). Keep `CNAME` as is.

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
- Rocket base availability — `src/app/rocket/page.tsx` (desktop, mobile and the proactive add-on are labelled *in development*).
- Full privacy policy — `src/app/privacy/page.tsx`.

## Effects and where they live

All effects fail open: the finished state is in the HTML, reduced motion shows it immediately, and nothing depends on a backend.

| Effect | Files |
| --- | --- |
| Workflow-assembly intro (four labelled agent cursors build the hero workflow; Review stamps "Scope approved") | `src/lib/intro/boot.ts` (inline boot), `src/lib/intro/engine.ts`, `src/components/home/HeroIntro.tsx`, intro CSS in `globals.css` (`qa-*`) |
| Electric Purple run through the finished hero graph | `src/components/home/HeroStage.tsx` |
| Read-only scenario graph, scroll-drawn edges, inspectable steps | `src/components/graph/WorkflowGraph.tsx`, `ScenarioGraph.tsx` |
| Before/after settle (FLIP) | `src/components/home/BeforeAfter.tsx` |
| Four-step story + run trace with an approval hold | `src/components/HowWeWork.tsx`, `src/components/RunTrace.tsx` |
| Rocket vignette (ask mode, proactive mode labelled in development, forward-only) | `src/components/RocketVignette.tsx` |
| Section entrances (blur + rise + stagger, once) | `src/components/MotionRuntime.tsx`, `[data-rv]` |
| One magnetic CTA (fine pointer only) | `src/components/Magnetic.tsx` |

Intro rules: plays once per tab (sessionStorage), always with `?intro=1`, never with reduced motion or when arriving on a `#hash`. Skip button, Escape, a tap, tabbing into the page, hiding the tab, scrolling the hero away, a stalled frame, an error or the watchdog all end it on the normal page. The headline is typed with a measured per-character clip; the promise and CTAs are never hidden. `legacy-reference/` keeps the previous site's intro engine for comparison.

## Content rules

Quavok is an early-stage, two-founder company working toward its first deployments. The site must not claim testimonials, client counts, metrics, pricing tiers, certifications, history or launched features that don't exist. Customers never build, configure or deploy automations; Rocket only forwards new-automation requests to the team. Planning notes are in `research/`.

## Dark studio design pass

The default theme is dark throughout: Forest `#1f3d2b`, Sand `#e8dcc4`, and Electric Purple `#8b5cf6`, over a deep base `#13251a`. `src/app/studio.css` contains the editorial layouts, sticker wall, typography, dark surfaces and shared dark styling. The existing graph geometry and intro safeguards remain in place.

Rocket, in `src/components/Companion.tsx` and `src/app/rocket-companion.css`, is an explicitly scripted conversation with no AI or automation backend. Its face begins inline in the hero headline and travels with the section in view. On narrow screens it perches in the header after leaving the headline. Quick replies cover Quavok, the managed service, Rocket, getting started and the workflow demo. A click, Cmd/Ctrl+K or the “Ask Rocket” pill opens a compact attached bubble. Escape, the close button and outside clicks return focus to Rocket. Only minimisation persists; old open-state values are ignored. It remembers minimisation locally, tracks fine pointers, reacts to touch, and offers quiet contextual hints. Reduced motion disables eye movement, blinking, nodding and confetti. Konami keys reveal a short, expiring greeting without opening the conversation.

The intro characters are Milo, Kit, Dot and Rue. A natural completion triggers a brief celebration; skipping does not. `hero-detail.css` owns the spotlight, cast and opening composition; `editorial-detail.css` owns inner-page layouts and the giant footer wordmark. `studio.css` owns shared dark surfaces and the saturated Purple field (`#392660`). `DESIGN.md` and `.impeccable/design.json` document the resulting design system.

`npm run build` first generates `public/og.png` (1200×630) from `scripts/og-image.tsx`, then exports the site. No network request is needed for that artwork. Brand icons and CNAME remain unchanged.

QA screenshots are local in `.qa/` (gitignored). Headless Chrome checks cover all eight routes at 1440×900 and 390×844, console errors, overflow, axe WCAG A/AA checks, and the intro, graph, form and companion interactions. No browser-test dependency was added to the production bundle.

The homepage now uses an open workflow stage with illustrative clear/unclear enquiry controls and an approval decision. The compact process overview keeps the detailed walkthrough in a native disclosure. Rocket’s homepage vignette uses layered panels; its dedicated page retains its existing layout.
