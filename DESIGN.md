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

Dark tonal surfaces and hairline rules define structure. Offset shadows belong to the physical task stickers. A single purple spotlight illuminates the hero build. Rocket's opt-in conversation uses a soft shadow to separate its temporary panel from the page.

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

The homepage workflow has an open stage with no outer card. Two illustrative request choices demonstrate approval and human escalation; these controls do not configure or run customer automations. The category index is compact, the process overview has four steps, and the detailed walkthrough is available through a disclosure. Rocket's page example gains layered depth only on the homepage; its persistent companion uses a compact attached speech bubble opened by explicit action.

The owner superseded the green palette: backgrounds now use neutral charcoal and neutral gray. The single off-white task note, workflow input and compact Rocket bubble share a warm surface language. Hero/closing display type carries the strongest emphasis; middle headings are smaller and lighter, with descriptions alongside them on desktop. The workflow input, approval and output each have a distinct visual role.

Original etched paper-orchestration imagery gives the page a physical metaphor: scattered paper passing through a series of rings into one flowing ribbon. It appears subtly behind the hero workflow and in a bounded film/still panel above the comparison. Six unnamed pointers build actual page DOM during the intro; navigation, typography, actions, imagery and lower sections join the workflow assembly. Never hijack scroll to show off the intro. Motion media remains static during the intro, under reduced motion and data saving, and pauses offscreen.

Rocket speech is opt-in through a small speaker control in its compact bubble. Speech reads only the visible authored answer and stops on close or answer change. Mouth feedback animates only when reduced motion is off. Keep the one demo disclosure inside the bubble; avoid adding extra helper lines around this interaction.

Rocket is a recurring host across the page: an inline origin, brief reactions to example decisions, and a larger perch inside its own section. It remains the same character, rather than adding a duplicate illustration. The example conversation lives in a disclosure so the character can lead the section without adding a second permanent interface.

The hero now leads with a person’s workday, represented by a clearly illustrative Rocket conversation. Keep the headline focused on the managed-service benefit. Example replies describe completed routine work and human approvals without invented business results. Technical diagrams belong in the examples below. Rocket’s silhouette is a round purple bot with an expressive eyes. The page-assembly cursors build this conversation as part of the real DOM; they are not removed by the change in hero subject.

The first-visit sequence is page assembly → a question about new leads → Rocket becomes attentive → an illustrated reply appears. Clicking Rocket in the hero or choosing another example replays the conversational response. Audio remains opt-in. Reduced motion shows the completed reply immediately. The separate “Ask Rocket” command pill has been removed; the character remains keyboard accessible and Cmd/Ctrl+K still opens the compact conversation.

The six unnamed building cursors each have a distinct accent: gold, lavender, cyan, mint, pink and peach. These colors are confined to the cursor performance. Rocket has a simple round face and expressive eyes; it has no headphones or other accessories.

Rocket opens a first-visit prologue on an empty screen and gives the command “Let’s build this page” before the anonymous cursors start assembly. The round character has two eyes directly on its face, with no visor, headphones or surrounding orbit. Skip, Escape, reduced motion and fail-open release the whole page.

The final resting palette is monochrome: Midnight #101010, Charcoal #282828, Surface #181818, Card #202020, Off-white #f0f0f0, muted text #b8b8b8 and neutral rules. Purple (#8b5cf6, deep #593b9d and soft #c5a9fa) is limited to primary actions, focus, Rocket and important states. The original background artwork and film render in grayscale. Six distinct colors remain confined to the requested cursor-build performance.

Sound effects use one browser AudioContext, a shared noise buffer and short procedural tones. Mechanical key clicks follow the cursor text build and animated replies; placement, selection, Rocket calls, replies and completion have quiet, distinct cues. The header control enables/mutes effects and remembers the preference. In the opening scene it becomes “Build with sound” and starts assembly after a user gesture unlocks audio. Effects pause when the tab is hidden. Spoken replies remain a separate explicit read-aloud action.
