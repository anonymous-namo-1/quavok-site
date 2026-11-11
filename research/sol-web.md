# Quavok: web design and interaction research

Research date: 12 November 2026. Scope: this worktree; recommendations only. No implementation, deployment, CNAME, branch, or business-policy changes.

## 1. Executive summary

**Make the signature visual “work becoming managed automation.”** Preserve the delight of the current labelled cursors, but have them assemble and activate a business process rather than suggest that Quavok sells a website builder. Follow with a legible running workflow, a manual-to-managed transformation, and a substantial Rocket section. Use one coherent visual language across these scenes: task slips, fine connectors, explicit approval gates, and quiet completion signals.

Lead with the faithful promise: **“We build the automation. We run the automation.”** Explain custom agents, workflows, and integrations around how each business already operates. Customers request, approve, and monitor; they never configure, deploy, or maintain anything. Lead generation/qualification/follow-ups, routine support, CRM/data entry, documents, scheduling/admin, coordination, and reporting should feel like different applications of the same service, not a catalogue of prebuilt packs.

Rocket deserves a major section after the managed-service explanation: it is the conversational way to interact with Quavok-built automations. Its desktop/mobile experience and the paid proactive add-on are **in development**. The latter initiates alerts, suggestions, and reports. A new-automation request goes to the Quavok team; Rocket never builds it. Any interface illustration must be labelled as a concept where appropriate, with development status beside the feature, not buried in a footer.

The recommended implementation is **semantic static HTML + CSS/SVG + a small GSAP timeline layer**. Existing vanilla code can also be evolved. Next.js static export is viable if component reuse warrants React; it is not necessary for premium animation. WebGL is an optional finishing layer, not the core. No live AI, orchestration backend, or multiplayer service is needed for marketing illustrations.

### Evidence and limits

This report combines local source inspection, web searches, fetched live-page content, gallery entries, official documentation, demos, and repositories. It is **not a browser/frame-by-frame animation audit or measured performance test**. Proposed timings, colors, choreography, budgets, and Quavok scenes below are design recommendations, not measurements or claims about reference sites. Library choices are implementation options; a visual resemblance does not establish a site's actual stack. Older demos are included for durable techniques, not presented as recent launches.

### Reference map: what to study and what to translate

| Reference, fetched unless noted | Useful study direction | Quavok translation / boundary |
| --- | --- | --- |
| [Linear](https://linear.app/) and [Lapa's Linear archive](https://www.lapa.ninja/post/linear/) | Focused feature narratives and selectively exposed product detail. | Give one process a clear stage; avoid importing an issue-tracker dashboard. Live and archived versions may differ. |
| [Vercel](https://vercel.com/) | Infrastructure and workflow framing, modular information hierarchy. | Make invisible work understandable with a small diagram; omit platform menus and developer setup instructions. |
| [Raycast](https://www.raycast.com/) and [Lapa's Raycast archive](https://www.lapa.ninja/post/raycast/) | A recognizable interaction object and action-oriented presentation. | Give Rocket a distinctive invocation/status motif; do not imitate a keyboard launcher or offer downloads. |
| [Resend](https://resend.com/) | A narrowly focused proposition followed by concrete demonstrations. | Use short operational demonstrations, substituting business-language receipts for SDK/code samples. |
| [Anthropic](https://www.anthropic.com/) | Editorial hierarchy and text-led explanation. | Give service and founder-scale company information room to read; do not borrow institutional stature or research claims. |
| [OpenAI](https://openai.com/) | Concise entry points into a complex offering. | Keep the primary action clear. Its current conversational entry is **not** a reason to make Quavok's homepage a chatbot. |
| [Arc](https://arc.net/) | Historical reference for expressive product marketing, with an important freshness caveat. | Current fetch is a farewell/sunset page, not the familiar launch showcase; do not describe old animation as current evidence. |
| [Liveblocks](https://liveblocks.io/) | Presence, agent activity, and contextual feedback vocabulary. | Labelled cursors can represent Quavok's behind-the-scenes work; they must not invite customers to co-edit workflows. |
| [Trigger.dev](https://trigger.dev/) and [Inngest](https://www.inngest.com/) | Runs, sequencing, monitoring, and trace vocabulary. | Translate these into plain-language operational receipts; avoid a developer console. |
| [Framer AI gallery](https://www.framer.com/community/gallery/categories/ai/), [Sequen](https://www.sequen.ai/), [Ankar](https://ankar.ai/) | Gallery-listed examples of explaining technical products through distinct use cases and staged detail. Both live sites fetched. | Use as information-design references, not proof of any particular animation implementation or Quavok capability. |
| [Lusion](https://lusion.co/) | Explicit focus on 3D storytelling and interactive experiences. | A quality ceiling for an optional scene, not a recommendation to reproduce an entire immersive portfolio. |
| [Awwwards animations](https://www.awwwards.com/websites/animations/) and [GSAP category](https://www.awwwards.com/websites/gsap/) | Discovery of movement, reveal, and scroll treatments. | Filter for an effect that explains a process, not awards or spectacle alone. |
| [Godly](https://godly.website/) → [Recent](https://recent.design/) | The requested inspiration source currently redirects; Recent fetched separately. | Useful motion/web discovery route, but no individual Godly interaction is claimed as verified here. |
| [Siteinspire](https://www.siteinspire.com/) and [typographic selection](https://www.siteinspire.com/websites/category/typographic) | Type, spacing, editorial composition, restraint. | Use for the static composition underneath every effect. |

**Fetch caveats:** Awwwards' singular `/websites/animation/` timed out; the plural `/websites/animations/` and GSAP listing fetched. [Lusion v3's award entry](https://www.awwwards.com/sites/lusion-v3) timed out. Lapa's homepage timed out, but the Linear and Raycast detail pages fetched. Godly's redirect initially failed in the fetch tool; opening Recent directly succeeded. `www.liveblocks.io` and bare `inngest.com` failed; the canonical links above succeeded. [Framer's old Copilot entry](https://www.framer.com/gallery/copilot) redirected to the general gallery, and [its old live destination](https://intelligence.copilot.money/) redirected to a help article; neither is treated as a current interactive reference. [A guessed Codrops particle article URL](https://tympanus.net/codrops/2024/01/19/particle-morphing/) could not be fetched and is not evidence. The verified Codrops demo/repo below replace it. [GSAP matchMedia's documentation URL](https://gsap.com/docs/v3/gsap.matchMedia()/) could not be fetched by this tool. An initial incorrect OGL repo URL under `pmndrs` returned 404; the correct [oframe/ogl](https://github.com/oframe/ogl) fetched.

## 2. What the current site does well

File references are relative to the repository root; line numbers identify starting points in the inspected version.

| Existing strength | Source | Keep / evolve |
| --- | --- | --- |
| Four named cursors perform different actions: placing elements, typing, resizing, and checking the result. This gives the page authored choreography rather than another generic fade-in. | [`assets/build-intro.js:158`](../assets/build-intro.js#L158), [`:859`](../assets/build-intro.js#L859), [`:931`](../assets/build-intro.js#L931) | Preserve the character and visible division of work. Replace “Layout / Copy / Design” as the central story with task-oriented actions representing Quavok's work. Keep a visible distinction between team testing and customer approval. |
| Animation manipulates the real, already-laid-out content and restores original inline styles when done. Cursor labels adjust near viewport edges. | [`assets/build-intro.js:68`](../assets/build-intro.js#L68), [`:202`](../assets/build-intro.js#L202), [`:591`](../assets/build-intro.js#L591) | Preserve progressive enhancement and reserved geometry. Evolve repeated per-frame geometry reads into cached scene measurements where feasible; this is a potential optimization, not a measured bottleneck. |
| Intro has session gating, reduced-motion detection, skip/Escape, focus/visibility handling, a watchdog, and recovery from a failed script load. Decorative cursor effects are hidden from accessibility APIs. | [`index.html:8`](../index.html#L8), [`assets/build-intro.js:619`](../assets/build-intro.js#L619), [`:850`](../assets/build-intro.js#L850), [`:972`](../assets/build-intro.js#L972), [`assets/build-intro.css:9`](../assets/build-intro.css#L9) | Carry the safeguards forward. Improve further: leave the core promise and CTA visible from first paint rather than putting the whole hero behind the intro. |
| Responsive type, a constrained content width, fine grid/radial background, restrained borders, and paired display/body faces already provide a usable foundation. | [`assets/style.css:1`](../assets/style.css#L1), [`:21`](../assets/style.css#L21), [`assets/fonts.css:1`](../assets/fonts.css#L1), [`index.html:5`](../index.html#L5) | Keep self-hosted Bricolage Grotesque + Inter initially; test their proportion and spacing before replacing them. Fonts use swap and the Latin resources are preloaded. |
| Clear service ownership: build, run, tune; scope approval; human handling outside the agreed scope. | [`index.html:39`](../index.html#L39), [`:70`](../index.html#L70), [`:97`](../index.html#L97) | Keep the ownership distinction. Broaden the WhatsApp-centric explanation to the full custom managed automation brief. Existing timelines, availability statements, and policies are not fresh evidence for the rebuild. |
| The fictional salon demo is labelled; examples are distinguished from customer results. Native FAQ details and visible focus styling support ordinary use. | [`index.html:91`](../index.html#L91), [`:100`](../index.html#L100), [`:115`](../index.html#L115), [`assets/style.css:122`](../assets/style.css#L122) | Retain honest illustration labels and native controls. Replace the dominant phone/chat framing with process examples across the business. |
| Small static architecture and one-shot IntersectionObserver reveals. | [`index.html:141`](../index.html#L141), [`CNAME`](../CNAME) | Keep static deployment compatibility. CNAME reads `quavok.com`; hosting from main is supplied context, not independently verified through GitHub settings. No deployment changes are proposed here. |

The current hero's “Never miss…” framing, large WhatsApp phone, salon emphasis, and generic repeated cards would narrow the corrected business story. Evolve them rather than preserve them as the new positioning. Existing contact details, setup promises, prices/policies, and demo data must not be automatically promoted into newly verified business claims.

## 3. Ranked concrete, buildable ideas

Rank balances distinctiveness, explanatory value, implementation cost, and fit for a small managed-service company. Complexity: **S** = localized CSS/DOM work; **M** = several responsive states and coordinated animation; **L** = custom choreography/rendering and substantial device QA. These are relative scope estimates, not delivery promises. Every idea below is compatible with static hosting; none requires an actual agent backend.

### 1. “Quavok puts the work in motion” — live construction into execution

**Scene:** A small cluster of task slips—“New enquiry,” “Check details,” “Update CRM,” “Follow up”—sits beside the immediately visible promise. Two or three labelled cursors align the slips, connect them, and place an approval gate. After approval is illustrated, a single signal travels through the process. The cursors leave; the completed workflow remains. Suggested sequence: arrange → connect → test → ready, roughly 3–4 seconds, with Replay and Skip. Persistent caption: “Illustrative workflow.”

**Why it fits:** Evolves the user's favorite effect into a demonstration of custom work being built and run by Quavok. The visitor watches the team do the work. There are no editable handles, “Add node,” or deploy controls. Keep any typed headline flourish confined to a secondary line so the service is understandable before the sequence completes.

**Implementation:** **L.** Existing vanilla timeline can be adapted, or use GSAP timelines with SVG connectors and DOM cards. Declare fixed scene slots; animate transforms/opacity and short SVG stroke reveals. Cache bounds on resize/font readiness; keep labels as HTML. Do not rebuild the entire page live or delay the CTA. On mobile show a vertical three-step scene with fewer cursors. Reduced motion/no JS: complete, readable end state. Decorative cursors `aria-hidden`; an adjacent ordered list explains the sequence. Static-compatible JS only.

**Sources:** current local intro above; [Liveblocks presence/activity vocabulary](https://liveblocks.io/); [GSAP](https://gsap.com/docs/v3/); [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/); [Awwwards animation discovery](https://www.awwwards.com/websites/animations/). The proposed choreography is original, not attributed to any of those sites.

### 2. “One request, coordinated work” — read-only living workflow graph

**Scene:** Select an example: Lead follow-up / Document intake / Routine support. The same bounded diagram changes its labels and path. For document intake: received → extract fields → check completeness → route for approval → update the agreed system. An exception branches visibly to a person. Clicking a node explains the work in one sentence; it never edits the workflow.

**Why it fits:** Shows agents, workflows, and integrations without making the visitor learn the technology. The exception branch makes managed ownership tangible. Examples illustrate possible scoped work, not installed customer workflows or guaranteed integrations.

**Implementation:** **M.** Prefer hand-authored SVG paths under semantic HTML cards for 4–7 nodes. Use a single moving dot, not constant traffic. CSS `offset-path`, SVG motion, or GSAP can drive the signal. React Flow is an alternative only for more complex layouts: disable node dragging, connecting, deletion, uncontrolled pan/zoom, and editor affordances. Provide buttons and a text detail panel; focus must work like click. Mobile becomes a vertical list. Reduced motion retains highlighted states without travelling signals; explicit Play/Pause for a repeated demonstration. All diagram data ships as static fixtures.

**Sources:** [React Flow animated-edge example](https://reactflow.dev/examples/edges/animating-edges), [CSS offset-path](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path), [Vercel](https://vercel.com/), [Inngest](https://www.inngest.com/).

### 3. “Same business, less manual handling” — before/after transformation

**Scene:** “Today” shows the same request being copied between inbox, sheet, calendar, and CRM. “With Quavok” repositions the same task objects onto a coordinated route, leaving the customer's approval point explicit. A button switches states; a short connecting transition makes the difference memorable. Keep “Your team” and “Quavok manages” lanes visible.

**Why it fits:** Makes the benefit comprehensible without invented hours saved, revenue, speed comparisons, or customer case studies. Shows that Quavok builds around existing operations instead of requiring a software migration.

**Implementation:** **M.** Shared IDs and measured transforms/FLIP, or Motion layout animation if React is already chosen. Use authored start/end positions, not a physics simulation. Prefer two buttons or a native radio group over a drag-only image slider. At small widths show stacked text with a toggle. Reduced motion changes immediately. Avoid fabricated waiting clocks; call it “Illustrative process comparison.” Static HTML contains both explanations.

**Sources:** [Motion animation documentation](https://motion.dev/docs/animate), [Linear](https://linear.app/), [Lapa Linear reference](https://www.lapa.ninja/post/linear/). These support animation and presentation approaches, not claimed Quavok outcomes.

### 4. “Understand → build → run” — a single scroll-driven service story

**Scene:** Three normal text sections accompany one sticky process illustration. First Quavok maps how work already happens; next the agreed process is built/tested and the customer approves; finally the scene shows monitoring, exceptions, and improvements owned by Quavok. The final frame must emphasize ongoing operation, not end at deployment.

**Why it fits:** Makes the managed-service difference the page's narrative spine. Each stage answers who does the work.

**Implementation:** **M.** CSS sticky with IntersectionObserver-selected scene states is the lightweight baseline. GSAP ScrollTrigger adds precise scrubbing/pinning if needed; prefer ordinary scroll with a sticky illustration over a long pinned section. Keep a consistent scene box and distinct text chapters; allow anchor navigation. Mobile/reduced motion: three static illustrations in document order. No compulsory horizontal scrolling. Progressive CSS scroll timelines can enhance supporting reveals, guarded with `@supports`; don't rely on them to expose essential content. Works in static export.

**Sources:** [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Motion scroll](https://motion.dev/docs/scroll), [MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline), [Awwwards GSAP gallery](https://www.awwwards.com/websites/gsap/).

### 5. “Rocket: your point of contact with the work” — substantial interaction vignette

**Scene:** Beside the running process, three suggested questions reveal short, authored exchanges: “What needs my approval?”, “Show the latest summary,” and “I'd like to automate another task.” The last response explicitly forwards a request to the Quavok team. A separate, visually adjacent card says **“Proactive paid add-on — in development”**, illustrating Rocket reaching out first with an alert, suggestion, or report. Desktop/mobile mockups say **“In development — concept preview.”**

**Why it fits:** Gives Rocket meaningful presence while keeping the automation as the underlying service. The graph remains the main object; the conversational interaction is a narrow companion, not a full-screen chatbot or a builder.

**Implementation:** **M.** Semantic buttons select predefined concept states; animate a compact prompt/response and highlight the relevant process node. No free-text input, real message sending, fake connection, or LLM call. Do not make “approve” look like a real transaction. This research does not establish which current Rocket functions are launched: use concept labels unless launch status is confirmed. On mobile use one compact preview, not multiple giant devices. Reduced motion displays responses immediately; reserve response height to avoid jumps. Use status announcements only for user-triggered changes, not animated word-by-word output. Entirely static-compatible.

**Sources:** [Raycast](https://www.raycast.com/), [Lapa Raycast archive](https://www.lapa.ninja/post/raycast/), [Liveblocks AI activity framing](https://liveblocks.io/). Borrow compact action/context feedback, not a launched-product claim or their interfaces.

### 6. “A run, explained” — plain-language agent trace / operational receipt

**Scene:** A restrained inset shows “Request received → details checked → customer approval needed → next step held.” Selecting a second example shows a completed routine path. Use business labels and an exception, not code, tokens, reasoning transcripts, or a wall of logs. Add “Illustration — not live activity.”

**Why it fits:** Shows ongoing operation and accountability, which a glowing graph alone cannot. A pause at approval is more credible than everything becoming instantly green.

**Implementation:** **S–M.** Ordered HTML list, one progress rule, deterministic state changes via CSS/JS. A terminal-like monospace eyebrow can add precision, but body text stays ordinary. User-initiated playback or one short finite sequence; reserve rows before reveal. Provide final transcript and Play/Pause/Replay. Reduced motion shows all rows. No fake uptime, success rate, timestamps suggesting live customer activity, or chain-of-thought. Static fixtures only.

**Sources:** [Trigger.dev monitoring/tracing](https://trigger.dev/), [Inngest observability framing](https://www.inngest.com/), [Resend's concrete demonstrations](https://resend.com/).

### 7. “Work in your business” — scenario tabs with a shared transformation stage

**Scene:** Four or five business-function tabs change a single visual: Leads, Customer support, Documents, Admin/coordination, Reporting. Each shows an input, the repetitive work Quavok can take on, and where the customer requests/approves/monitors. Mention scheduling, CRM/data entry, and industry-specific work in the supporting content rather than creating twelve tiny cards.

**Why it fits:** Covers the breadth of the brief without pretending to sell fixed automation packs. Every scenario ends with “Built around your process; scope agreed with you.”

**Implementation:** **M.** Reuse the graph/trace components from #2/#6; fade labels and reposition only the necessary nodes. Semantic tabs with keyboard behavior, or a simpler labelled button group with a shared region. No autoplay carousel. Mobile wraps controls and limits node count. Reduced motion uses immediate selection. Pre-render scenario text or expose a readable list when JS is absent. No third-party integration logos unless verified. Static compatible.

**Sources:** [Framer AI gallery](https://www.framer.com/community/gallery/categories/ai/), [Ankar's R&D lifecycle framing](https://ankar.ai/), [Sequen's use-case structure](https://www.sequen.ai/), [Linear](https://linear.app/). The specific Quavok examples come from the supplied brief.

### 8. “Editorial precision” — typography reveals, color, and motion as one system

**Scene:** A confident two-line heading with one short masked phrase reveal, broad whitespace, compact factual labels, and a dark process stage against a light editorial page. The visual rhythm alternates explanation and demonstration instead of repeating identical bento rows.

**Why it fits:** A small company can communicate care and technical competence through craft, without invented enterprise proof. Distinctiveness comes from repeated task/connector geometry and type, not a copied black-and-purple SaaS theme.

**Implementation:** **S–M.** Keep the self-hosted type pairing. Proposed tokens: page `#F7F7F2`, ink `#171A18`, process stage `#151A17`, accent `#BCE85B`; use dark ink on accent surfaces. Treat those as starting values; verify contrast in actual compositions. Distinguish approval/exception states with words/icons as well as color. Use `clamp()` for a roughly 44–88px hero and 32–56px section titles, 17–20px body text, and comfortable 55–70-character prose measures. Do not copy another brand's font identity.

Suggested motion grammar: 140–180ms control feedback, 350–500ms component change, 650–900ms scene change; a shared decelerating cubic-bezier, restrained 8–16px translations, no default spring overshoot. Use line/word masks instead of a character-by-character scramble. Preserve one intelligible accessible heading; decorative split text must not be announced as fragmented letters. Reduced motion and no JS show final text. Static compatible; GSAP SplitText is optional, not necessary for a two-line authored mask.

**Sources:** [Siteinspire typography](https://www.siteinspire.com/websites/category/typographic), [Anthropic](https://www.anthropic.com/), [Resend](https://resend.com/), [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/). The token/timing system above is a proposal, not an extraction of their exact styles.

### 9. “A managed space for your business” — quiet environment boundary

**Scene:** A fine enclosure groups one illustrative business's workflows, documents, and connected systems. The surrounding caption explains the **intended dedicated managed cloud environment per customer**. A request enters and a report returns; the customer never sees server controls.

**Why it fits:** Gives an important operational intention a simple shape without infrastructure jargon. It must remain an intention until provision and availability are confirmed; a boundary drawing does not establish isolation or compliance guarantees.

**Implementation:** **S–M.** Rounded SVG enclosure and two finite path signals; can reuse #2's scene. No rotating cloud icon or multiple fake customer tenants. Use an adjacent text description and explicit planned-status wording. Reduced motion: static enclosure with arrows. Fully static. Prefer embedding this in #4's “run” stage over adding another large section.

**Sources:** [Vercel](https://vercel.com/), [SVG/path technique via React Flow example](https://reactflow.dev/examples/edges/animating-edges). Business intention comes solely from the brief.

### 10. “Quiet focus” — restrained hover/focus illumination and connector feedback

**Scene:** Focusing a scenario highlights its relevant route and adds a soft local surface light; CTA arrow shifts a few pixels. Borders and labels remain clear at rest. The pointer does not become a custom cursor.

**Why it fits:** Small consistent feedback can make every component feel finished while preserving emphasis on the signature scene.

**Implementation:** **S.** CSS pseudo-element radial gradient, `:focus-visible`, short opacity/transform transitions. If pointer-following light is used, update CSS variables through a single RAF and limit to fine-pointer devices. Avoid giant animated blur filters, magnetic hit targets, 3D card tilt, and making hover necessary for discovery. Reduced motion keeps static emphasis. No-JS retains ordinary hover/focus; works on static hosting.

**Sources:** [Linear](https://linear.app/), [Lapa Linear archive](https://www.lapa.ninja/post/linear/), [Motion animate](https://motion.dev/docs/animate). This is a proposed microinteraction, not a claim about the live Linear implementation.

### 11. “From scattered to coordinated” — task-particle field, optional experiment

**Scene:** A bounded patch of small marks settles into parallel process lanes, then resolves into the task-card system. It conveys disorder becoming coordinated work; it does not form a brain, robot, globe, or generic connected constellation.

**Why it fits:** Offers a distinctive atmospheric flourish with an explanatory endpoint. Its lower rank reflects limited incremental value once the cursor hero and transformation already exist.

**Implementation:** **L.** Start with Canvas 2D and a few hundred seeded points, deterministic interpolation between authored positions, and DOM labels on top. Use Three.js Points / R3F only if depth materially improves the composition. Cap DPR around 1–1.5 for the decorative layer, lazy-load, stop once settled, pause offscreen/hidden, dispose buffers. Never a full-page continuous simulation. Render an SVG/static lane diagram for reduced motion, no WebGL, and failure. Canvas is decorative; real explanation stays in HTML. Static-export compatible if canvas initializes only in the browser.

**Sources:** [Canvas API and accessibility limits](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), [Three.js documentation](https://threejs.org/docs/), [R3F performance guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [Lusion](https://lusion.co/). These establish implementation and reference direction, not a verified identical particle scene.

### 12. “A material process surface” — subtle shader field, optional alternative

**Scene:** A low-contrast dither/grain field gently resolves into horizontal order behind the process illustration. Use it in one contained area; text remains on a flat opaque layer. A static noise texture plus CSS gradient may achieve enough of the result.

**Why it fits:** Can add depth and bespoke character without adding another UI. It is polish, not an explanation of the service, so it should be cut before any higher-ranked item.

**Implementation:** **M** with a preset, **L** with a custom shader. Paper Shaders offers ready-made dithering/grain options; OGL is a smaller-abstraction route for a bespoke single-pass shader; Three.js/R3F makes more sense when already rendering a real scene. Avoid loading all three. Lazy-load below the core content, limit resolution, stop when idle/offscreen, and handle context loss with the static texture. Reduced motion gets the static texture immediately. No shader text, flickering contrast, liquid-metal logo, or continuous pointer distortion. Client-only enhancement remains compatible with static export.

**Sources:** [Paper Shaders gallery](https://shaders.paper.design/), [Paper Shaders repo](https://github.com/paper-design/shaders), [OGL repo](https://github.com/oframe/ogl), [Codrops shader-on-scroll demo](https://tympanus.net/Tutorials/ShadersOnScroll/), [demo source](https://github.com/Faboolea/shaders-on-scroll). The Codrops demo and repo fetched; its [linked article](https://tympanus.net/codrops/?p=55223) returned 403. Do not import its visual intensity wholesale.

### Library decision matrix

| Tool | Best Quavok use | Complexity / performance tradeoff | Accessibility and static-hosting notes |
| --- | --- | --- | --- |
| CSS + SVG + Web Animations / IntersectionObserver | Node highlights, line reveals, finite transitions, most microinteractions | Lowest dependency cost; hand-maintaining a long coordinated timeline becomes harder. SVG path animation is not universally compositor-only. | Semantic HTML remains source of truth. All static-compatible. Default state visible; JS adds effects. [Offset paths](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path). |
| [GSAP + ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Hero choreography and one coordinated scroll story | Strong timeline sequencing, reversibility, SVG/DOM coordination; more setup/cleanup and responsive testing. Import only used plugins. | Keep content visible before initialization; destroy/reset scene when modes change. Browser-side initialization works on static pages. |
| [Motion](https://motion.dev/docs/animate) / [Motion scroll](https://motion.dev/docs/scroll) | React layout transitions, state changes, modest scroll mapping; JS API also usable without React | Convenient component/state model if React exists. Avoid choosing React solely for three hover effects, or using Motion and GSAP on the same properties. | [useReducedMotion](https://motion.dev/docs/react-use-reduced-motion) for React; use media-query handling for vanilla. Export HTML normally; animate client-side. |
| [Lenis](https://github.com/darkroomengineering/lenis) | Optional smoothing if a tested scroll scene truly benefits | Changes scroll feel and needs coordinated RAF integration. README documents iframe wheel, nested scrolling, Safari/low-power, and touch caveats. Native scroll is the recommendation initially. | Disable smoothing for reduced motion; verify keyboard, anchors, sticky elements, and touch. Static-compatible; not a substitute for a timeline engine. |
| [React Flow](https://reactflow.dev/examples/edges/animating-edges) | Larger read-only graph with substantial node inspection | Convenient nodes/edges, but brings graph-app weight and editor defaults. Overkill for five nodes. | Disable editing affordances individually; provide a textual route and keyboard controls. Client hydration/initial dimensions need care. No backend required. |
| [Canvas 2D](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) | Finite task particles | No framework required; custom resizing, RAF lifecycle, and pixel-density management. Harder per-object accessibility/hit testing than DOM. | Never render essential text only in canvas. Static HTML fallback; browser-only initialization. |
| [Three.js](https://threejs.org/docs/) + [R3F](https://github.com/pmndrs/react-three-fiber) | A justified 3D process scene | Greatest scene flexibility, highest GPU/runtime and production complexity. R3F is a React renderer, not an automatic performance optimization. Use demand rendering when settled, instancing if needed, and dispose resources. | HTML explanation and context-failure poster. Keep browser globals out of build-time rendering. [Performance guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance). |
| [OGL](https://github.com/oframe/ogl) / [Paper Shaders](https://github.com/paper-design/shaders) | Single shader plane / configurable material treatment | OGL offers less abstraction and more shader responsibility; presets reduce authoring effort but still use GPU resources. “Zero dependency” is not zero rendering cost. | Still require pause/fallback/reduced-motion handling. Both can be static-hosted browser enhancements. |
| [CSS scroll timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) | Simple progressive scroll reveals | No JS timeline runtime for supported cases; browser support and precise choreography need validation. | Guard with `@supports`, supply visible fallback, and avoid gating content on support. Fully static. |

**Recommended stack boundary:** keep vanilla/static architecture unless component reuse makes React worthwhile. Choose GSAP as the single coordinated timeline owner; CSS handles small UI feedback. Start without Lenis, React Flow, Three.js, or shaders. If React is selected, Motion can replace GSAP for state-driven effects; do not install every library because the reference list mentions it.

**Next.js option:** [official static-export docs](https://nextjs.org/docs/app/guides/static-exports) confirm `output: 'export'`, per-route HTML, and the `out/` artifact. `trailingSlash: true` can preserve directory-style URLs. Use plain optimized image assets, an unoptimized image configuration, or a compatible custom loader rather than requiring an image-optimization server. Avoid server actions, request-time routes, authentication, and any marketing interaction that requires secrets. If an exported site is later adopted, its built static files can use the existing hosting arrangement; deployment workflow and CNAME handling require separate implementation review and are not changed by this research.

### Shared production requirements

- Core promise, navigation, explanations, and CTA exist in initial HTML and remain usable with JavaScript disabled or broken. Reserve all scene dimensions; never animate layout-critical font size or height frame by frame.
- Give every demonstration a readable final state, clear illustration/concept label, and visible control if it continues. [W3C pause/stop/hide guidance](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) covers automatic moving content lasting over five seconds alongside other content and automatic updates. Reduced-motion support alone does not replace user controls.
- Read reduced-motion preference before starting; respond to preference changes. Stop translations, scrubbing, parallax, particles, and shader time. Show the useful state rather than an empty scene.
- No essential hover-only or drag-only content. Preserve native scrolling, visible focus, keyboard operation, touch targets, and readable diagrams at 200% zoom. State is conveyed through text/icons as well as color.
- Animate transforms/opacity where practical; batch measurements and writes. Don't announce every animation frame. Pause RAF offscreen/hidden; stop finite animations when complete; release observers/listeners on cleanup.
- Proposed acceptance targets, not measured results: LCP ≤2.5s, CLS ≤0.1, INP ≤200ms at the 75th percentile after launch. Before launch test low-end mobile, touch Safari, slow network/CPU, keyboard, screen reader reading order, no-JS, reduced motion, resize, and graphics failure. Use lab traces to find actual costs; do not claim a scene is “60fps” without measurement.
- Prioritize text/fonts and a static diagram. Defer optional rendering chunks. A graphics layer must never be necessary to book/contact or understand the offering. Ship local, pinned dependencies/assets rather than unversioned CDN demos; retain applicable licenses and create original artwork instead of copying gallery assets.

## 4. Do not do

- No builder UI, node creation, drag-to-connect, “deploy agent,” prompt-to-build, integration setup wizard, or “build with Rocket.” Customers request/approve/monitor; Quavok builds and operates.
- No generic chatbot hero, enormous chat transcript, robot mascot, AI brain, neon neural network, meaningless orbiting app icons, or dashboard crowded with fake analytics.
- No invented customers, testimonials, savings counters, live transactions, uptime, integrations, certifications, company history, founder bios, pricing tiers, contact details, or guaranteed outcomes. Existing site content is not permission to invent or extrapolate.
- No Rocket download/App Store buttons, “available now,” real-looking desktop/mobile installation flow, or proactive add-on without adjacent **in development** labelling. No arbitrary price for the paid add-on.
- No visual suggestion that a new-automation request causes Rocket to independently build/configure/deploy it. Show “Request forwarded to the Quavok team.”
- No dedicated-cloud diagram presented as already-proven isolation, compliance, region availability, or security certification. The brief establishes an intended environment per customer.
- No nine-second full-page preload theatre, hidden navigation/CTA, forced intro replay, scroll hijacking, endless pinned scroll, compulsory horizontal galleries, magnetic buttons, or replacement system cursor.
- No automatic numerical before/after savings comparison or stopwatch implying guaranteed speed. Compare responsibilities and process shape instead.
- No shader beneath body text, full-page bloom/blur, flashing status dots, constant particles on every card, or several competing motion systems.
- No gallery screenshot used as Quavok work or endorsement. No assumptions that a gallery tag verifies a site's complete stack or that an old archive represents today's homepage.
- No framework migration solely to obtain polish. No deployment, CNAME, main-branch, commit, push, or PR work as part of this research deliverable.

## 5. Recommended implementation shortlist

Implement **eight coordinated treatments**, sharing scene assets and visual rules rather than becoming eight independent spectacles:

1. **Cursor-led build-to-run hero (#1):** signature moment; promise/CTA visible throughout; finite and replayable.
2. **Read-only workflow with one clear exception route (#2):** explanatory core; reuse the hero's completed graph.
3. **Manual-to-managed process toggle (#3):** same objects, different responsibility/handoff pattern; no outcome metrics.
4. **Three-chapter understand/build/run story (#4):** ordinary scroll, sticky scene on desktop, stacked scenes on mobile. Include the intended environment boundary (#9) as a small part of the last frame.
5. **Rocket interaction preview (#5):** meaningful section with contextual questions and separate proactive paid-add-on concept. Mark desktop/mobile and proactive development status locally.
6. **Operational receipt (#6):** one short business-readable trace inside the “run” chapter, including an approval hold.
7. **Typography/line-mask system (#8):** one restrained treatment repeated sparingly, supported by a strong static composition.
8. **Hover/focus route feedback (#10):** consistent small finishing detail across controls and scenario choices.

Use the scenario content from #7 within #2's selector instead of adding another large interactive section. Prototype #1, #2, and #3 first in mobile and reduced-motion states; those determine whether the visual language explains the service. Then add the service story and Rocket preview. Particles (#11) and shader material (#12) are alternative later experiments: choose at most one only if the static composition, clarity, and device performance already succeed. The site should remain impressive with both omitted.
