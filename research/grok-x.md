# Quavok redesign research — motion, heroes, and product surfaces

Compiled 12 November 2026 from this worktree, public X posts, and pages that opened in this session. Where a page did not return readable content, that is stated. Nothing here is a business claim for the site. Planned Rocket surfaces stay labeled in development.

## 1. Executive summary

The effect worth keeping is the one already on the homepage: a few named cursors assemble a real layout, type real type, then approve it and leave. It is skippable, once per tab, transform-only, and it fails open if script, motion preference, or time gets in the way. The rebuild should point that same craft at the product story — a customer’s repetitive work being wired up and then run — instead of at a WhatsApp phone.

Custom managed automation stays the page. Rocket is a second surface, not a footnote and not the hero: a conversation over automations Quavok already built, plus a clearly unfinished proactive mode that can speak first and can only forward a new-automation request to the team.

The sites in this category that still feel expensive (Linear, Resend, the Vercel/Linear motion writing of Emil Kowalski and Rauno Freiberg) win by showing work moving through a calm system. They do not win by rendering the whole page in WebGL, hiding the cursor, or faking a swarm of agents. A November 2026 viral “hundreds of agents” clip was a cursor effect on top of an existing page. Copying that look would make Quavok look like the hoax.

Everything recommended below is static HTML, CSS, and a small amount of script. It can ship as files on GitHub Pages. No realtime backend, no builder UI, no invented metrics.

## 2. What the current site already does well

The live tree is a multi-page static site: `index.html`, `assets/style.css`, `assets/build-intro.js`, `assets/build-intro.css`, self-hosted fonts, and section pages. The homepage story is still “AI assistant on your WhatsApp.” The motion system is ahead of that story.

### The intro is a real build, not a video of one

`assets/build-intro.js` runs four labelled cursors — Layout (ink), Copy (green), Design (blue), QA (amber) — on one `requestAnimationFrame` loop. They do not decorate a finished hero. They move the real nodes:

- Layout drags the nav, eyebrow, and buttons in from an offset (`dragIn`, `bring`).
- Copy draws a marquee around the `h1`, then types it (`marquee`, `typeHeadline`).
- Design places the lead and the phone small, then pulls the resize handle to full size (`resize`). Floating cards pop in after.
- QA marquees the finished hero grid and stamps a check (`approve`), then all four leave.

Typing is measured, not faked with a monospace string. `measureChars()` walks the headline’s text nodes with `document.createRange()` and `getClientRects()`, then `typeTo()` reveals characters with a `clip-path` polygon and parks a caret on the measured edge. Spaces with no box inherit the previous character. If measurement fails, it falls back to a simple inset clip. `document.fonts.ready` dirties the measurement so a late font does not leave the caret in the wrong place.

Positions are read with `getBoundingClientRect()` every frame and written back as `translate3d` / `scale` / `opacity` / `clip-path` only. The file’s own header says layout must not change. Inline styles are removed when the intro ends, and the original `style` attribute is restored on failure.

### It fails open

The inline script in `index.html` adds `html.qa-pre` only when all of these are true: motion is allowed, this tab has not already seen the intro (`sessionStorage` key `quavok-agent-intro`), the URL has no hash, and the visitor is not already scrolled. `?intro=1` forces a replay. A 3.5s timeout strips `qa-pre` even if the script never runs.

`assets/build-intro.css` holds the hero pieces invisible with a 4s `animation-delay` (`qa-hold`). The site-wide reduced-motion rule in `assets/style.css` (`animation: none !important`) turns that hold off, so a reduced-motion visitor never sees an empty hero. The script’s own `onerror` also strips `qa-pre`.

Inside the script, any of these ends on the normal page: Skip, Escape, a tap, tabbing in, a hidden tab, a thrown error, the hero scrolling away, a stalled frame (1.5s), or a watchdog set to the timeline plus 3 seconds. The skip control is a real `<button>`, at least 44px tall, positioned against the visual viewport and the safe-area inset. The overlay is `pointer-events: none` except for that button. `prefers-reduced-motion: reduce` sets `.qa-intro { display: none }`.

On small screens, if the phone only peeks into view, it is not dragged around. It fades in late (`late` / `popIn`) so a half-visible mock does not sit there before the headline exists. While the phone is waiting, `html.qa-chat` pauses the sample chat (`.bb` animation-play-state).

This is the class of effect to evolve. The discipline around it (once, skippable, measured, transform-only, fail-open) should be copied into every new sequence.

### The rest of the page is restrained, and honest in the places that matter

`assets/style.css` and `assets/fonts.css`:

- Self-hosted Inter and Bricolage Grotesque, `font-display: swap`, preloaded in the head. Display sizes use `clamp()`. Bricolage is served as static 600 and 700 cuts, not a variable axis, so a weight animation would need new font files.
- Paper background `#fbfbfd`, ink `#0b1220`, hairline `#e6e8ef`. The hero wash is two radial gradients plus a 48px grid masked with a radial fade (`.hero:before` / `.hero:after`). That is already the right atmosphere. It does not need a purple mesh.
- Sticky nav with a light blur, a border that appears after 8px of scroll.
- Buttons lift 2px on hover. Cards lift 4px. Focus uses `:focus-visible` with a 3px outline.
- Sections reveal through `.rv` plus an `IntersectionObserver` (opacity and 18px Y, unobserved after first hit). Reduced motion forces `.rv` and `.bb` visible.
- The “what we automate” bento, the three-step “how it works,” and the monospace `.sum` block are the right content shapes. `.sum` is already a run log (ink panel, green emphasis, ui-monospace). It is the seed for a trace, and it is currently almost unused in the homepage markup.
- Sample chats are captioned as fiction (`Illustration: a sample conversation with a fictional salon.` and “Sample messages above are illustrations…”). The pricing block says the audit is free and that paid prices are not listed. That honesty should survive the redesign. Do not replace it with counters.

### What should change, not what should be thrown away

Keep the intro engine, the type, the paper/ink palette, the fail-open rules, and the “illustration, not a result” captions.

Retire WhatsApp chrome as the picture of the product. The phone, the green `.btn-wa`, and the salon thread in `index.html` make a managed-automation company look like a WhatsApp bot shop. The phone can remain one example inside a workflow, not the hero object.

The four cursor names (Layout, Copy, Design, QA) describe a marketing-page production. For the new story, the same four slots should be the work Quavok actually does — for example Intake, Follow-up, Records, Review — assembling a scope the visitor can read. Review’s check already maps to “you approve the scope.” Do not add a fifth cursor that configures an agent. Do not let any cursor open a builder.

`.rv` is fine as a fallback and too generic as the only scroll motion. The homepage below the hero is a stack of cards. The next scroll should show a process becoming a running system.

## 3. Ranked ideas

Ordered by how much they would change the feel of the site for this company. Each one can be a static file. “Static / GitHub Pages” means no server, no socket, and no build step required. A small vendored script is fine. A framework is not required.

### 1. Workflow assembly intro

**Why it fits.** This is the effect the current site already proves, aimed at the right noun. Visitors should watch a small team wire a business process — enquiry, qualification, a CRM note, a follow-up, a nightly summary — and then watch Review approve the scope. That is “we build it, we run it, you approve it,” in one scene. It is not a chatbot, not a robot, and not a dashboard.

**How it would work.** Keep `assets/build-intro.js` and `assets/build-intro.css` as the engine: one rAF, measure then write, clip-path typing, marquee, resize handle, approve stamp, skip, session key, CSS hold, reduced motion, watchdog. Change the targets. The right-hand stage becomes an inline SVG or HTML graph of five nodes and four edges, plus a short scope card, instead of (or in front of) the phone. Intake drags nodes on. Follow-up draws edges with a `stroke-dashoffset` the cursor appears to pull. Records types one line of the scope card with the existing caret. Review marquees the whole stage and stamps “Scope approved.” The phone, if it stays, is one node’s detail, faded in at the end the way `.float` cards are today.

Timing stays in the current idiom: moves around 0.45–0.75s, `easeInOut` on travel, a small back ease on the drop (`easeBack` in the file). Do not add a second load animation on top. Rauno Freiberg’s critique of a portfolio (19 Oct 2026) is the right warning: drop a “Hello” animation that nobody watches and that only jitters the page — [post](https://x.com/raunofreiberg/status/2112246065340535193).

Do not import the Swarm engine. Joel Califa’s [swarm-site](https://github.com/califa/swarm-site) is a whole site that builds itself on scroll, published as static `index.html` plus `.nojekyll`. The November 2026 Chrome extension [swarm-cursors](https://github.com/DhvanilPatel/swarm-cursors) snapshots any DOM and rebuilds it with a flock, guides, and duplicates. That is a recording trick. A 4 Nov 2026 clip with millions of views (“this how we run one-person company with 100s ai agents”) is that trick, later identified as such — [original](https://x.com/EHuanglu/status/2117944888599994477), [identification](https://x.com/KeepGoingJoe/status/2119626593991856139), [demo post](https://x.com/Saboor_Sarem/status/2118639764375040109). A Framer template already sells “build-on-load, Esc to skip” as an AI-product theme — [post](https://x.com/WillMaruiti/status/2120605520683762139). Quavok’s four careful cursors are more specific than that template. Keep the count at four. No agent counter. No sound.

**Performance and a11y.** Same rules as today: `prefers-reduced-motion` shows the finished stage immediately; Skip and Escape always work; the stage is in the DOM for real, not drawn on a canvas, so it is selectable and readable; cursors are `aria-hidden`. Pause any chat or trace inside the stage until the intro releases it (`qa-chat` already does this for `.bb`). Cap the intro under about five seconds. If the stage is below the fold on a short phone, fade it in rather than dragging it, which the current phone path already does.

**Static / GitHub Pages.** Yes. It is the current architecture. No new dependency.

**Sources.** This worktree: `assets/build-intro.js` (agents at the `makeAgent` calls, `typeTo`, `setup()` timeline), `assets/build-intro.css`, the boot script in `index.html`. Swarm as the cultural source, not the codebase to vendor: [github.com/califa/swarm-site](https://github.com/califa/swarm-site), [github.com/DhvanilPatel/swarm-cursors](https://github.com/DhvanilPatel/swarm-cursors). The live Swarm page at `https://califa.github.io/swarm-site/` returned no extractable text here (it is almost certainly a canvas). X posts linked above. Rauno on load animations: [status/2112246065340535193](https://x.com/raunofreiberg/status/2112246065340535193).

### 2. An operating graph that draws itself as you scroll

**Why it fits.** After the intro, the page has to explain “processes becoming automated” without a node editor. A single diagram — Inbox, Qualify, Record, Follow up, Summary — drawing on as the section enters is the picture of a system talking to itself. The customer does not edit the graph. Hover or keyboard focus explains who acts: Quavok runs this step, you approve the wording, a person takes the exception.

**How it would work.** One inline SVG in the section. Edges are `path` elements with `pathLength="1"`, `stroke-dasharray: 1`, and `stroke-dashoffset` animated from 1 to 0. Nodes are HTML buttons sitting on the SVG so hit targets and focus rings are real. A small packet (a 6px circle) travels an edge by animating `offset-distance` along the same path, once, when the edge finishes. No physics library.

Drive it with CSS scroll-driven animations where the browser has them:

```css
@supports (animation-timeline: view()) {
  .edge {
    animation: draw 1s linear both;
    animation-timeline: view();
    animation-range: entry 20% cover 45%;
  }
}
```

Chromium has shipped `animation-timeline` since Chrome 115. Safari 26 is reported to have shipped it (secondary write-ups citing WebKit notes; not re-checked on a device here). Firefox support in 2026 write-ups disagrees with itself, so the finished graph must be the default outside `@supports`, not an empty SVG. Spec: [Scroll-driven Animations Level 1](https://drafts.csswg.org/scroll-animations/). A practical pattern with a reduced-motion escape and a Firefox-safe base is written up at [zumkai.com, 21 Aug 2026](https://zumkai.com/en/post/css-scroll-driven-animations-no-js). Bramus’s 2 Dec 2025 recreation of a product site in modern CSS is the reference for “scroll-driven, starting-style, no canvas” — [post](https://x.com/bramus/status/1995969632466042961), [write-up](https://www.bram.us/2025/12/02/google-antigravity-modern-css/), [demo](https://codepen.io/bramus/full/bNpoKmy). Adam Argyle’s geometric orbits are the same family, and too decorative for this section — [post](https://x.com/argyleink/status/2027420100593328148), [demo](https://nerdy.dev/css-scroll-driven-gyro-trig-experiments).

If a beat must pin (the packet waits while copy changes), use GSAP ScrollTrigger for that one section only, and only from a `(min-width: 960px)` match. Webflow’s 30 Apr 2025 announcement made GSAP and the former Club plugins, including ScrollTrigger and SplitText, free for commercial use — [Webflow blog](https://webflow.com/blog/gsap-becomes-free). It is a proprietary no-charge license, not MIT; a later explainer says so — [zumkai, 21 Aug 2026](https://zumkai.com/en/post/gsap-free-license). Vendor a pinned file. Read the license text on gsap.com before shipping. Do not take a third-party claim that it is MIT.

On touch and below 960px, do not pin. Play the draw once when the section intersects, or show it already drawn. Pinning is where this kind of page breaks the back button, the URL bar, and find-on-page.

**Performance and a11y.** The SVG is decoration of a list that already exists in HTML (the three steps in `#how` are the accessible version). Edges are `aria-hidden`. Nodes are buttons with visible names. `prefers-reduced-motion`: draw nothing; show the full graph and let focus move between nodes. Pause the packet when the section leaves the viewport. No filter effects on the paths. No continuous rAF.

**Static / GitHub Pages.** Yes. CSS only, plus an optional vendored GSAP file if pinning is actually used.

**Sources.** CSS spec and the Bramus / Argyle posts above. GSAP license posts above. Linear’s public task-management page uses small labelled figures (“Fig 0.1”) next to product UI rather than a decorative graph — [linear.app/homepage/taskmanagement](https://linear.app/homepage/taskmanagement), fetched 12 Nov 2026. Steal the restraint, not their product or their numbers.

### 3. Before / after: a pile of repeated work settles

**Why it fits.** The current “problem” section is three cards and a row of quote chips (`index.html`, `#problem`). The feeling to add is physical: the same five tasks (a lead, a status question, a booking request, a data-entry row, a reminder) sit in a loose stack, then settle into three lanes — handled, waiting on you, with a person. No hours-saved number. No “14 leads today.” The current site already refuses those claims in the FAQ. The animation must not smuggle them back in as UI chrome.

**How it would work.** Two states of the same DOM list. A toggle (“Show it running”) or a single scroll range flips a class. Use the FLIP technique by hand: record each card’s `getBoundingClientRect()`, apply the class, record again, set `transform` to the inverse delta, then animate transform to none on the next frame. Opacity can crossfade a status label. Do not animate `top` / `height`.

For the crossfade of a card’s status, Emil Kowalski’s practical rules apply directly. His 7 tips, fetched from [emilkowal.ski/ui/7-practical-animation-tips](https://emilkowal.ski/ui/7-practical-animation-tips): scale pressed controls to about 0.97; never enter from `scale(0)` (start near 0.93); use a strong ease-out on entrances so they feel fast; keep UI motion under about 300ms; if a crossfade feels like two objects, add about 2px of blur during the blend only. His Linear marketing intro is the same recipe at section scale: 4px blur, a Y transform, a short stagger — [post, 10 Nov 2025](https://x.com/emilkowalski/status/1987892934587412676).

The essay [You Don’t Need Animations](https://emilkowal.ski/ui/you-dont-need-animations) did not return a body in this session. The tips article summarizes the part that matters: motion people see many times a day becomes lag. This before/after runs once per visit, so it earns the motion. A hover on every card does not.

Same-document View Transitions can replace the hand-rolled FLIP if `document.startViewTransition` exists: give each card a unique `view-transition-name` and let the browser interpolate. Unsupported browsers just flip the class. MDN: [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) (page dated 28 Sep 2026).

**Performance and a11y.** The toggle is a button, and both states are readable without it (the lanes can be the resting state). Reduced motion: no FLIP, show the settled lanes. One animation at a time. No layout animation of the surrounding page.

**Static / GitHub Pages.** Yes. A few dozen lines next to the existing observer script at the bottom of `index.html`.

**Sources.** Emil’s tips page and the Linear-intro post above. MDN view transitions. The current problem section in `index.html`.

### 4. Rocket, as a conversation over the system — with the unfinished half labeled

**Why it fits.** Rocket is how a customer talks to automations Quavok already runs. It deserves a section of its own, after the graph, before FAQ. It must not look like a second product that is already on the App Store, and it must not look like WhatsApp. Two frames side by side, or one frame with a segmented control:

- **Ask.** The customer asks what is waiting. Rocket answers from the approved scope and offers to hand the chat to a person. This is the conversational layer. Still describe it as the intended product surface, not as a shipped desktop or mobile app.
- **Reaches out. In development.** Rocket speaks first: an exception, a short report, a suggestion. The only action on a suggestion is “Ask the team to add this,” which is copy for a request the team receives. There is no control that creates, configures, or deploys anything. The frame caption says desktop, mobile, and the proactive add-on are in development.

**How it would work.** HTML that looks like a calm thread: ink panel, hairline, Bricolage for the title “Rocket,” Inter for the messages. Not green bubbles, not an avatar with a face. Messages that play use the existing `.bb` idea but slower and plainer: opacity and 8px Y, ease-out, 180–220ms, stagger about 40ms, then stop. A caret at the end of Rocket’s last line ties it to the intro’s caret.

The proactive frame autoplays once, then sits. Do not loop. Do not type every character; the intro already spent that move. Emil’s Raycast note is the constraint on anything that would become a daily tool: keyboard-summoned UI should not animate open, because the animation becomes the wait — [post, 12 May 2026](https://x.com/emilkowalski/status/2054264701790421135). Rocket on this marketing page can introduce itself once. A shipped Rocket app, later, should open like Raycast: immediately.

Linear’s own agent pages are a useful contrast, not a template. They show agents as teammates you assign, with a human still accountable — [linear.app/agents](https://linear.app/agents), [linear.app/ai](https://linear.app/ai), fetched 12 Nov 2026. Quavok’s customer does not assign or deploy. The visual lesson to take is the accountability line (“a person remains responsible”), drawn as a caption under Rocket, not as Linear’s feature list. Do not copy Linear’s customer counts or percentages onto this site.

**Performance and a11y.** The thread is real text. The “in development” state is text, not only a color. Reduced motion shows every message. The segmented control is a pair of buttons with `aria-pressed`. No autoplay audio. No fake typing that delays the words past a couple of seconds.

**Static / GitHub Pages.** Yes.

**Sources.** Product rules in the brief for this task. Emil on Raycast, linked above. Linear agent pages, linked above, as a caution about what not to claim. Current chat styling in `assets/style.css` (`.bb`, `.sum`) and `assets/wa-chat.css` — reuse the motion, retire the WhatsApp skin for this section.

### 5. A run trace, not a terminal

**Why it fits.** “We run it” is invisible if the page only shows setup. A short log of one illustrated evening — enquiry received, answered from the approved list, exception sent to the owner, summary written — makes the ongoing service visible. The current `.sum` style is already this object. Resend’s homepage, fetched 12 Nov 2026, does the same job for email: a column of delivered / opened / clicked lines under the code sample, not a chart wall — [resend.com](https://resend.com/).

**How it would work.** A `<ol>` of five lines in the existing `.sum` panel. Lines reveal top to bottom with a 2px caret on the active line, then the caret disappears. Timestamps are illustrative and labeled (“Sample of one agreed workflow. Not a customer log.”). No “HTTP 200” cosplay, no matrix green on black, no scanlines. Ink panel, `#cbd5e1` text, one green for the completed lines, which `.sum em` already is.

Implementation: CSS `@starting-style` or a class toggled by the existing `IntersectionObserver`. Each line `animation-delay` by index. If the intro is still running, do not start the trace (the current code already gates the phone chat this way).

**Performance and a11y.** The list is in the accessibility tree the whole time; the animation only reveals it. Reduced motion: all lines visible, no caret. Do not trap focus. Do not use a `<canvas>` terminal. A real terminal emulator (xterm.js and similar) is the wrong weight and the wrong metaphor.

**Static / GitHub Pages.** Yes. CSS plus the observer already on the page.

**Sources.** `assets/style.css` `.sum`. [resend.com](https://resend.com/). Emil’s “keep it under 300ms, ease-out” from the tips article, applied per line rather than to a long type-on.

### 6. Section entrances with blur, rise, and a short stagger

**Why it fits.** The page under the hero is currently one motion: `.rv` fades up 18px over 0.7s. That reads as a template. The Linear-style entrance Emil described — a few pixels of blur, a small Y move, stagger between siblings — makes the bento and the three steps feel assembled without another cursor scene. One cursor scene per page is enough.

**How it would work.** Replace `.rv`’s transition with a keyframe on the way in: from `opacity: 0`, `translateY(8px)`, `filter: blur(4px)` to none, 500–600ms, a custom ease-out (the built-in `ease` is too weak; Emil points at [easings.co](https://easings.co/)). Stagger children by 40–60ms. Run it once via the existing observer adding `.vis`. Do not replay on scroll up.

This is also the place for his button advice, independent of the magnetic idea below: `.btn:active { transform: scale(0.97); }` so the press answers before the navigation. The current hover lift can stay. Entrance blur is removed at rest so text stays sharp for screenshots and for selection.

Do not use GSAP SplitText here. The headline typing in the intro already reveals type without splitting the DOM into spans, which is better for screen readers and for the clip-path caret. SplitText did gain screen-reader masking in the free 2025 rewrite ([Webflow’s GSAP post](https://webflow.com/blog/gsap-becomes-free)), and it is available if a later page needs a masked line reveal. It is not needed to ship this.

**Performance and a11y.** `filter: blur` is the expensive property. Use it only on the way in, on a handful of blocks, and never on a fixed layer. Reduced motion already kills animation globally in `assets/style.css`; keep that rule, and make sure `.rv` stays at opacity 1, which it does today. No blur on the reduced-motion path.

**Static / GitHub Pages.** Yes. CSS only.

**Sources.** [Emil, Linear intro](https://x.com/emilkowalski/status/1987892934587412676). [7 Practical Animation Tips](https://emilkowal.ski/ui/7-practical-animation-tips). Current `.rv` rule in `assets/style.css`.

### 7. Paper atmosphere: keep the grid, add grain only if the wash feels flat

**Why it fits.** The visual concept is paper and ink, not an AI nebula. `.hero:before` and `.hero:after` already do the expensive-looking part: a soft black wash, a hint of green, a fading grid. That should stay. A shader is justified only as a texture inside that wash, and only if a static CSS version looks banded on large monitors.

**How it would work.** First try, zero WebGL: an SVG `feTurbulence` tile, 5–7% opacity, `mix-blend-mode: multiply`, `pointer-events: none`, fixed behind the hero and masked the same way as the grid. It costs one filtered element and no animation.

If that looks cheap, use Paper’s static mesh, not an animated one. [@paper-design/shaders](https://github.com/paper-design/shaders) is Apache-2.0, zero-dependency, and ships a vanilla build as well as React. `StaticMeshGradient` takes up to ten colors, a position seed, wave, mixing, and grain, and is meant to sit still — [docs](https://shaders.paper.design/static-mesh-gradient). Colors for this brand: `#0b1220`, `#d4d4d4`, `#fbfbfd`, and a low-alpha `#15803d`. Speed 0. Grain overlay low. Cap `maxPixelCount`. Pause or freeze when the hero is offscreen. On `prefers-reduced-motion` and on `saveData`, paint one frame and stop.

Shu Ding (Vercel) has been publishing small React shaders through 2026; the water demo is the kind of study piece, not a homepage — [first demo, 4 Apr 2026](https://x.com/shuding/status/2040416459252547588), [deployed water example, 15 May 2026](https://x.com/shuding/status/2055390643015586225), [glsx.dev example](https://glsx.dev/example?shader=water). Paper’s own “new shader day” posts are texture studies (lens distortion, fisheye, smoke) — [Paper, 10 Aug 2026](https://x.com/paper/status/2086854781998637320). Maxime Heckel, who writes shaders and works at Linear, points at his own experiments rather than at full-page scenes — [post, 11 Nov 2025](https://x.com/MaximeHeckel/status/1988354095002849443), [blog.maximeheckel.com](https://blog.maximeheckel.com), [maximeheckel.com](https://maximeheckel.com).

Jhey Tompkins (Shopify brand, ex-Vercel) is the constraint. In July 2025 he argued that a full website rendered on a WebGL canvas is a tiny, risky fraction of real sites and needs a warning label — [post](https://x.com/jh3yy/status/1945951468655100388) and the replies in that thread, including [this one](https://x.com/jh3yy/status/1945950679631077820). In November 2026 he described the acceptable version: little WebGL trinkets, with a loading strategy so the page itself arrives first — [post](https://x.com/jh3yy/status/2118831092065305014). Quavok’s shader, if any, is a trinket behind type. The type is HTML.

Stripe’s animated mesh is the historical source of this whole genre. Bramus documented Kevin Hufnagl’s reverse engineering in 2021, and pointed at Whatamesh as a generator — [bram.us, 13 Oct 2021](https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/). That look is now a cliché in saturated rainbow. Do not reproduce it. The technique (a small fragment shader, grain to hide banding, pause offscreen) is what is useful.

**Performance and a11y.** The hero text stays HTML, selectable, and unaffected by the canvas. The canvas is `aria-hidden`, `position: absolute`, and does not sit in front of hit targets. No shader on reduced motion beyond a frozen frame, and no shader at all if WebGL context creation fails. The CSS wash is the fallback and must look finished alone, which it already does.

**Static / GitHub Pages.** Yes. SVG filter is zero dependency. Paper’s vanilla package can be vendored. Do not load it from an unpinned CDN in production without a copy in the repo.

**Sources.** Current hero CSS. Paper repo and static-mesh docs. Jhey, Shu, Maxime, and Bramus links above.

### 8. One magnetic control, and a press on every button

**Why it fits.** The primary action is “book a call.” A slight pull toward the pointer, on that one control, feels considered. A custom cursor, or a magnet on every card, feels like an agency template and breaks touch, which is most of a phone-first business site.

**How it would work.** On `(hover: hover) and (pointer: fine)` only, listen to pointer move on the header CTA and the hero CTA. If the pointer is within about 72px, set `transform: translate(x, y)` with strength around 0.25, and move an inner label a little further. Lerp toward the target in rAF and cancel the listener when the intro overlay is up, when the tab is hidden, and on pointer leave. Combine with `:active { scale: 0.97 }` from Emil’s tips so touch users still get a response. The current `.btn:hover { transform: translateY(-2px) }` must be reconciled with the magnetic transform (one transform string, not two fighting declarations).

Do not add a library for this. A package such as magneticui exists ([magneticui.vercel.app](https://magneticui.vercel.app/), seen via search) and is unnecessary for one button. Do not draw a fake cursor. Do not magnetize the nav links.

**Performance and a11y.** The listener is on two elements, not `window` for the life of the page. Nothing moves without a fine pointer. Reduced motion disables the magnet and keeps the color and outline states. Focus styles stay as they are (`:focus-visible` in `assets/style.css`). The hit target does not move so far that it flees the pointer; 8px of travel is enough.

**Static / GitHub Pages.** Yes.

**Sources.** Emil’s button-scale tip, [7 Practical Animation Tips](https://emilkowal.ski/ui/7-practical-animation-tips). Current `.btn` rules in `assets/style.css`.

### 9. Same-origin page transitions for the mark and the title

**Why it fits.** The site is already many documents (`book/`, `clinics/`, `demo/`, `pricing/`, legal pages) sharing `assets/style.css`. A short crossfade, with the wordmark held in place, makes that set feel like one product. It also avoids a client-side router, which this deploy does not need.

**How it would work.** In the shared CSS, inside the reduced-motion guard:

```css
@media (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; }
}
```

Give the logo the same `view-transition-name` on every page so it moves instead of crossfading. Keep the root transition near 250ms, ease-out. Chrome’s cross-document guide (Bramus) is the implementation note: both documents opt in, same origin only, no JS required — [Chrome docs](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document). MDN covers the same model — [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API).

Support, stated carefully: Chrome has had cross-document transitions since Chrome 126, per that Chrome doc. A August 2026 article reported Safari 18.2 in and Firefox still missing the cross-document half, while same-document transitions were in Firefox stable — [brainstormsandraves, 6 Aug 2026](https://brainstormsandraves.com/css/view-transitions-2026/). That Firefox claim was not re-tested here. Unsupported browsers navigate normally, which is the correct failure.

Do not morph entire page layouts. Do not delay the navigation to finish a flourish. Emil’s “under 300ms” rule is the cap.

**Performance and a11y.** Progressive enhancement only. Reduced motion opts out by not including the at-rule. Unique `view-transition-name` values, one element each, or the browser skips the transition. Skip the effect on `demo/` if the embedded frame makes the snapshot heavy; test that page specifically.

**Static / GitHub Pages.** Yes. This is the rare API that prefers a multi-page static site.

**Sources.** Chrome and MDN docs above. The August 2026 support write-up, with the caveat that Firefox was not re-checked.

### 10. A pinned three-beat, only if the graph and the before/after are not enough

**Why it fits.** “We build. We run. You approve.” is the whole promise, and it can be one sticky stage: the graph assembles, the trace starts, a caption changes to approval. It is also the effect most likely to feel like a festival site and to break mobile scroll. Build ideas 2, 3, and 5 first. Add the pin only if those three still read as separate cards.

**How it would work.** Desktop only. A `position: sticky` stage and a tall scroll track, or ScrollTrigger’s pin. Three states, scrubbed or stepped. Mobile: the same three states stacked in normal flow, no pin. Lenis is not required. Darkroom’s Lenis is the smooth-scroll library creative studios actually ship ([github.com/darkroomengineering/lenis](https://github.com/darkroomengineering/lenis), [motion.dev/docs/lenis](https://motion.dev/docs/lenis)). Since 1.3.26 it honors `prefers-reduced-motion` by default — [Lenis post, 5 Aug 2026](https://x.com/LenisSmooth/status/2084979618109386856). It keeps native scroll rather than faking it with transforms, which is why it is less harmful than older smooth-scroll scripts. This site has hash links, a sticky nav, and a long FAQ. Native scroll is already the right feel. Add Lenis only if a pinned scene stutters without it, with `syncTouch` left off.

**Performance and a11y.** If the pin exists, the three statements are also in the document in order, so a screen reader is not trapped in a sticky box. Reduced motion: no pin, three stacked blocks. Kill the pin when the intro is running so two scroll models never overlap. Respect `visualViewport` changes the way the intro already does, or the sticky stage will jump under mobile browser chrome.

**Static / GitHub Pages.** Yes, if GSAP is vendored. Prefer not to, until the unpinned versions feel thin.

**Sources.** Lenis repo and the reduced-motion post. Emil on not animating frequent actions. The current sticky nav in `assets/style.css`.

## 4. Do not do

These showed up repeatedly in the 2025–2026 posts and in the current page. They would make the company look cheaper, slower, or less honest.

- **A swarm, a counter of agents, or a soundtrack.** The November 2026 “100 agents” clips are a cursor overlay. Shipping that metaphor implies a crowd of builders the customer is watching, and it is already a Framer template. Four cursors, silent, then gone.
- **A full-page WebGL or WebGPU site, a Spline character, or a cursor-following mascot.** Jhey’s warning stands. Cursor-reactive characters (a 28 Sep 2026 landing-page experiment, and an 11 Aug 2026 Framer recreation of theycallmegiulio.com) are a different product’s joke. They are not a services company.
- **A custom cursor that hides the system pointer.** It fails on touch, fights the intro’s own cursors, and breaks text selection. The intro cursors are actors. They leave.
- **Rainbow meshes, glass stacks, grain so heavy the type softens, particle trails.** The palette is already ink, paper, and one green. Stripe’s 2021 gradient is the ancestor of a look that now signals “generated landing page.”
- **Chat bubbles as the identity, robot illustrations, or the current phone as the hero.** `#i-bot` and the WhatsApp skin answer a narrower product than the one being rebuilt. One example thread can live inside the graph. It should not be the first picture.
- **A builder: nodes the visitor drags, a “create agent” button, a prompt box that deploys anything.** Including on Rocket. Rocket forwards a request. The team designs and runs the automation.
- **Rocket desktop, Rocket mobile, or the proactive add-on shown as available.** No store badges, no “download,” no “live now.” The section caption says in development.
- **Fake dashboards, sparklines, “hours saved,” client logos, testimonial cards, or prices.** The current FAQ and pricing block deliberately do not claim these. A chart with invented numbers would undo that.
- **Hacker terminals, scramble-text, decrypt effects.** The run trace is a business log. Scramble text reads as a security costume.
- **Lenis or any scroll hijack by default. Locomotive-style transform scrolling. Scroll-jacking the whole page.** Hash links, the sticky nav, and the FAQ depend on native scroll. CSS `scroll-behavior: smooth` is already on `html` in `assets/style.css`; that is enough for anchor jumps, and it is already disabled under reduced motion by the global `animation`/`transition` kill… note that `scroll-behavior` is not covered by `animation: none`, so reduced-motion visitors still get smooth anchor jumps. If that is tightened later, set `scroll-behavior: auto` inside the reduced-motion query.
- **Magnetic everything, hover lift on every card plus a magnet plus a cursor.** One CTA magnet. Cards can keep the existing 4px lift or lose it. Not both plus a cursor.
- **A second entrance on every route.** The intro is homepage-only and once per tab. Inner pages should be instant, with at most the shared view transition.
- **Video heroes and generated “cinematic” scroll films.** The agency-replacement posts on X (scroll-driven sites “for $12 in credits”) are sales threads. They are not a craft reference, and a looping background video fights the intro and the LCP.
- **Copying Linear’s or Resend’s claims, logos, or metrics.** Their pages were read for structure: product UI as the picture, a human still accountable, an event list instead of a chart. Their numbers are theirs.

## 5. Shortlist to implement

Eight effects, in build order. The first five carry the story. The last three are the finish.

1. **Workflow assembly intro.** Retarget `build-intro.js` at a five-node operating graph and a scope card. Same four cursors, renamed for the work. Same skip, session, measure, clip-path, approve, fail-open. Phone demoted to a detail, not the stage.
2. **Scroll-drawn graph.** The same diagram, already assembled, redraws once as `#how` enters. CSS `animation-timeline: view()` inside `@supports`. Finished graph otherwise. Nodes are buttons. No pin yet.
3. **Before / after settle.** The problem chips become five tasks that move into handled / waiting on you / with a person. FLIP or same-document view transitions. No metrics. Toggle plus a settled resting state.
4. **Run trace.** Five-line `.sum` log for one labeled sample evening, revealed when the “we run it” beat enters. Not a terminal.
5. **Rocket section.** Ask, then “Reaches out — in development.” Forward-only action. Not WhatsApp, not a builder, not a download.
6. **Entrances and press.** Replace the generic `.rv` fade with blur + 8px + stagger, once. `scale(0.97)` on `:active` for `.btn`. One magnetic pull on the primary CTA, fine pointer only.
7. **Atmosphere.** Keep the hero grid and washes. Add a still SVG grain if banding shows. Add Paper’s static mesh only if the grain still looks flat, frozen on reduced motion and offscreen.
8. **Cross-document view transitions.** `@view-transition { navigation: auto }` under `prefers-reduced-motion: no-preference`, shared `view-transition-name` on the logo, under 300ms. Instant navigation where the API is missing.

Leave the pinned three-beat and Lenis off the list until these eight are in and the scroll still feels like separate cards. If a pin is added later, desktop only, and it must not run during the intro.

Ship order also protects performance. The intro owns the first seconds. The shader, if it exists, paints one still frame until the intro finishes. The trace and the graph do not start while `html.qa-pre` or the overlay is up. Reduced motion gets the finished graph, the settled lanes, the full trace, both Rocket states as text, and no overlay — the same fail-open idea as `qa-hold`.
