export type Faq = { q: string; a: string[] };

// Honest answers. No guarantees, timelines, prices or SLAs that have not been
// confirmed; unconfirmed operational details are marked as placeholders.
export const HOME_FAQS: Faq[] = [
  {
    q: "What kinds of business processes can you automate?",
    a: [
      "Repetitive work that follows a pattern: lead generation, qualification and follow-ups; customer enquiries and routine support; data entry and CRM updates; admin and scheduling; document processing; internal communication and task coordination; reporting, monitoring and recurring operations; and other repetitive workflows specific to your industry.",
      "If a process depends mostly on judgment, relationships or one-off decisions, we’ll say so in discovery rather than force an automation onto it.",
    ],
  },
  {
    q: "How does automation help my team?",
    a: [
      "Copying details between tools, answering the same questions, rebuilding Friday’s report: these tasks take attention away from customers, craft and growth. We design an automation to handle the agreed routine, then run it for you.",
      "We automate tasks, not judgment. Exceptions, sensitive cases and anything outside the agreed rules are routed to a person. Your people keep the decisions and relationships. We take care of the repetitive steps around them.",
    ],
  },
  {
    q: "Do I need technical knowledge?",
    a: [
      "No. You explain how the work happens today and what a good result looks like. We handle the design, build, integrations, hosting and maintenance. You review and approve in plain language.",
    ],
  },
  {
    q: "Who creates and maintains the agents?",
    a: [
      "We do. The Quavok team designs, builds, tests, deploys, monitors and maintains every agent and workflow. You never build, configure or deploy anything yourself, and there is no builder to learn.",
    ],
  },
  {
    q: "Can I request additional automations?",
    a: [
      "Yes. Tell us what else is eating your team’s time, by email, on a call, or through Rocket, which forwards the request to us. We scope it with you, you approve it, and we build and run it alongside what’s already running.",
    ],
  },
  {
    q: "Will this work with my existing software?",
    a: [
      "Usually that’s the plan: we build around the tools you already use rather than asking you to switch. Email, forms, spreadsheets, CRMs, calendars and many business tools can be connected when they offer a way in, such as an API, integration or export.",
      "We check each integration during discovery before we commit to it, and we’ll tell you plainly if a tool can’t be connected reliably.",
    ],
  },
  {
    q: "Do I need Rocket?",
    a: [
      "No. Your automations run without it. Rocket is an optional, conversational way to ask about the automations we run for you and to pass new requests to our team.",
    ],
  },
  {
    q: "How does pricing work?",
    a: [
      "Every build is different, so we don’t publish plans or prices. After a discovery call we’ll propose a price for building your automation and for running it, before any work starts. There is no charge for the discovery call.",
    ],
  },
  {
    q: "What happens when an automation fails?",
    a: [
      "Running it is our job. We monitor the automations we run, and they are designed to stop and hand over rather than guess: when something fails or falls outside the agreed rules, the item is held or routed to a person, and we investigate and fix the cause.",
      "You’ll be told when something needs your attention. Monitoring hours and response times are agreed with you before anything goes live.",
    ],
  },
];
