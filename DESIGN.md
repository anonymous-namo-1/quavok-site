---
name: Quavok operations studio
description: Dark, people-first managed automation with visible handoffs.
colors:
  midnight: "#101010"
  charcoal: "#282828"
  off-white: "#f0f0f0"
  surface-deep: "#191919"
  purple: "#8b5cf6"
  purple-dark: "#593b9d"
  purple-soft: "#c5a9fa"
  paper-2: "#181818"
  card: "#202020"
  ink: "#f0f0f0"
  ink-2: "#d4d4d4"
  mute: "#b8b8b8"
  faint: "#a6a6a6"
  line: "#363636"
  line-2: "#555555"
typography:
  display:
    fontFamily: "Sora, sans-serif"
    fontSize: "clamp(48px, 4.3vw, 68px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Manrope, sans-serif"
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
  conversation: "16px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(84px, 11vw, 152px)"
  section-mobile: "64px"
components:
  button-primary:
    backgroundColor: "{colors.purple-dark}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.control}"
    height: "50px"
  button-purple:
    backgroundColor: "{colors.purple-dark}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.control}"
    height: "50px"
---

## Overview

The operations studio makes managed automation tangible: requests pass between anonymous cursors, stop for human approval, and finish with a clear summary. The typography speaks confidently while the Rocket and workflow cursors add warmth. The owner chose a dark visual world, complementary charcoal/off-white and a contrasting Electric Purple accent.

## Colors

Midnight is the page base. Charcoal holds navigation and inner-page openings. Off-white carries display emphasis. Purple accents the companion; its deeper shade marks buttons and workflow outputs. Electric Purple marks primary actions and approval decisions. Off-white-tinted text stays readable on all dark fields. Use Off-white text on Deep Purple #593b9d for normal-size button labels. Electric Purple #8b5cf6 is reserved for highlights, focus and decorative moments.

## Typography

Self-hosted Sora is the display voice, with variable weight from 100–800. Manrope handles body text. System mono identifies workflow roles, statuses and editorial section labels. Display tracking stops at −0.04em. The mobile hero uses `clamp(36px, 10.6vw, 50px)`; footer lettering is deliberately oversized at 23vw.

## Layout

Content uses a 1200px maximum width with responsive gutters. The homepage pairs its promise with the assembly workbench; below it, a tilted task wall, ruled automation index, approval diagrams and open process rows change the rhythm. Inner pages use asymmetric headline/copy columns. Below 1040px the hero becomes one continuous composition; mobile sections use 64px vertical padding. Keep a direct discovery action near the workflow examples as well as the opening and closing.

## Elevation & Depth

Dark tonal surfaces and hairline rules define structure. One physical task note provides a warm, tactile contrast. A restrained purple light sits behind the Rocket conversation. Rocket's opt-in conversation uses a soft shadow to separate its temporary panel from the page.

## Shapes

Buttons use 8px corners, workflow containers 14px, the companion panel 16px. Dotted paths communicate handoffs. Rocket has a round face, two eyes and a small mouth. Keep iconography in authored SVG; do not introduce stock illustration or unrelated decoration.

## Components

Primary actions use Off-white, with Electric Purple reserved for high-emphasis discovery actions and approval states. Focus rings use Electric Purple with visible offset. Form errors retain entered values and explain recovery; the contact form prepares an email until its destination is wired.

Rocket starts in the homepage headline and follows the section in view. On narrow screens it perches in the unused header gap after leaving the headline so body text remains unobscured. Quick replies are explicitly scripted and open only by request. Minimise preference is stored locally. Pointer eyes, blinking, mood changes, anonymous cursor handoffs and completion confetti respect reduced motion. Cmd/Ctrl+K opens the conversation; Escape closes it and returns focus.

The workflow intro is optional, replayable, skippable, and fails open. Its finished HTML remains useful without JavaScript. Proactive Rocket features stay locally labelled in development.

## Do's and Don'ts

- Keep the promise people-first: less repetitive work, more focus on what actually matters.
- Keep approval and exception routing visible in demonstrations.
- Label examples and scripted interactions honestly.
- Preserve all placeholders, brand assets, CNAME and deployment artifacts.
- Do not imply customers configure agents or Rocket builds them.
- Do not introduce fabricated proof, staff-replacement framing or a site-wide WhatsApp bubble.

The hero is a compact conversation window about the customer’s workday. No decorative background image sits behind it. At tablet widths from 768px it uses a balanced two-column composition; phones stack intentionally. Framed monochrome photos belong to the workday story, paired with enquiry/follow-up and human-decision windows. No unrelated film or abstract machinery is displayed.

Rocket travels between reserved anchors with distinct left, right and center positions. The same character appears at every stop. Main content is never used as an overlay target. Future-feature promotion is omitted from public copy; unconfirmed business facts retain their placeholders.
