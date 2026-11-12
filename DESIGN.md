---
name: Quavok operations studio
description: Dark, people-first managed automation with visible handoffs.
colors:
  midnight: "#13251a"
  forest: "#1f3d2b"
  sand: "#e8dcc4"
  purple-field: "#392660"
  purple: "#8b5cf6"
  purple-dark: "#593b9d"
  purple-soft: "#c5a9fa"
  paper-2: "#122419"
  card: "#162b1e"
  ink: "#e8dcc4"
  ink-2: "#d6ceb6"
  mute: "#c0bda6"
  faint: "#b5b49d"
  line: "#354e3c"
  line-2: "#445b47"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(58px, 5.25vw, 80px)"
    fontWeight: 650
    lineHeight: 1.01
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "8px"
  workflow: "14px"
  preview: "16px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(84px, 11vw, 152px)"
  section-mobile: "64px"
components:
  button-primary:
    backgroundColor: "{colors.purple-dark}"
    textColor: "{colors.sand}"
    rounded: "{rounded.control}"
    height: "50px"
  button-purple:
    backgroundColor: "{colors.purple-dark}"
    textColor: "{colors.sand}"
    rounded: "{rounded.control}"
    height: "50px"
---

## Overview

The operations studio makes managed automation tangible: requests pass between named roles, stop for human approval, and finish with a clear summary. The typography speaks confidently while the Rocket trial and workflow characters add warmth. The owner chose a dark visual world, complementary forest/sand and a contrasting Electric Purple accent.

## Colors

Midnight is the page base. Forest holds navigation and inner-page openings. Sand carries display emphasis. Purple accents the companion; its deep purple-field variant floods the busywork section. Electric Purple marks primary actions and approval decisions. Sand-tinted text stays readable on all dark fields. Use Sand text on Deep Purple #593b9d for normal-size button labels. Electric Purple #8b5cf6 is reserved for highlights, focus and decorative moments.

## Typography

Self-hosted Bricolage Grotesque is the display voice, with variable weight from 200–800. Inter handles body text. System mono identifies workflow roles, statuses and editorial section labels. Display tracking stops at −0.04em. The mobile hero uses `clamp(43px, 12.3vw, 64px)`; footer lettering is deliberately oversized at 23vw.

## Layout

Content uses a 1200px maximum width with responsive gutters. The homepage pairs its promise with the assembly workbench; below it, a tilted task wall, ruled automation index, approval diagrams and open process rows change the rhythm. Inner pages use asymmetric headline/copy columns. Below 1040px the hero becomes one continuous composition; mobile sections use 64px vertical padding. Keep a direct discovery action near the workflow examples as well as the opening and closing.

## Elevation & Depth

Dark tonal surfaces and hairline rules define structure. Offset shadows belong to the physical task stickers. A single purple spotlight illuminates the hero build. Rocket's opt-in preview uses a soft shadow to separate its temporary panel from the page.

## Shapes

Buttons use 8px corners, workflow containers 14px, the trial panel 16px. Dotted paths communicate handoffs. Rocket has a geometric visor, two eyes and an asymmetric rounded face. Keep iconography in authored SVG; do not introduce stock illustration or unrelated decoration.

## Components

Primary actions use Sand, with Electric Purple reserved for high-emphasis discovery actions and approval states. Focus rings use Electric Purple with visible offset. Form errors retain entered values and explain recovery; the contact form prepares an email until its destination is wired.

Rocket starts in the homepage headline and follows the section in view. On narrow screens it perches in the unused header gap after leaving the headline so body text remains unobscured. Quick replies are explicitly scripted and open only by request. Minimise preference is stored locally. Pointer eyes, blinking, mood changes, named agent handoffs and completion confetti respect reduced motion. Cmd/Ctrl+K opens the preview; Escape closes it and returns focus.

The workflow intro is optional, replayable, skippable, and fails open. Its finished HTML remains useful without JavaScript. Proactive Rocket features stay locally labelled in development.

## Do's and Don'ts

- Keep the promise people-first: less repetitive work, more focus on what actually matters.
- Keep approval and exception routing visible in demonstrations.
- Label examples and scripted interactions honestly.
- Preserve all placeholders, brand assets, CNAME and deployment artifacts.
- Do not imply customers configure agents or Rocket builds them.
- Do not introduce fabricated proof, staff-replacement framing or a site-wide WhatsApp bubble.
