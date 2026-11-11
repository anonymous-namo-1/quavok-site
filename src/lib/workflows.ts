// Illustrative workflows used by the hero stage and the scenario graph.
// They are examples of the kind of process Quavok builds, not installed
// customer workflows. Geometry is shared so every scene speaks the same
// visual language: five steps, one approval gate, one route to a person.

export type Who = "auto" | "you" | "person";

export type GraphStep = {
  title: string;
  sub: string;
  who: Who;
  explain: string;
};

export type Scenario = {
  id: string;
  label: string;
  title: string;
  steps: [GraphStep, GraphStep, GraphStep, GraphStep, GraphStep];
  gate: { label: string; explain: string };
  exception: { label: string; explain: string };
};

export const WHO_LABEL: Record<Who, string> = {
  auto: "Runs automatically",
  you: "You approve",
  person: "A person handles",
};

export const SCENARIOS: Scenario[] = [
  {
    id: "leads",
    label: "Lead follow-up",
    title: "Lead follow-up",
    steps: [
      {
        title: "New enquiry",
        sub: "Website form or email",
        who: "auto",
        explain: "An enquiry arrives through a channel you already use. The workflow picks it up the moment it lands.",
      },
      {
        title: "Qualify",
        sub: "Against your criteria",
        who: "auto",
        explain: "An agent reads the enquiry and checks it against the criteria you gave us during discovery.",
      },
      {
        title: "CRM record",
        sub: "Contact and notes",
        who: "auto",
        explain: "The contact, the request and the qualification notes are written into the CRM you already use.",
      },
      {
        title: "Follow-up",
        sub: "In approved wording",
        who: "auto",
        explain: "A follow-up goes out on the schedule you agreed, using message wording you signed off.",
      },
      {
        title: "Evening summary",
        sub: "What ran, what waits",
        who: "auto",
        explain: "Each evening you get a short summary: what was handled, and anything waiting on you.",
      },
    ],
    gate: { label: "You approve", explain: "Follow-up wording is approved by you before anything is sent." },
    exception: { label: "Unclear → a person", explain: "Enquiries that don't fit the rules go to someone on your team instead of being guessed at." },
  },
  {
    id: "documents",
    label: "Document intake",
    title: "Document intake",
    steps: [
      {
        title: "Document received",
        sub: "Invoice, form or PDF",
        who: "auto",
        explain: "Documents arrive by email or upload, the way your suppliers or customers already send them.",
      },
      {
        title: "Read fields",
        sub: "Names, amounts, dates",
        who: "auto",
        explain: "An agent reads the document and pulls out the fields your process needs.",
      },
      {
        title: "Check complete",
        sub: "Required fields",
        who: "auto",
        explain: "The extracted details are checked against the rules you agreed, such as required fields or totals.",
      },
      {
        title: "Update records",
        sub: "In your system",
        who: "auto",
        explain: "Complete documents are entered into your spreadsheet, accounting tool or database.",
      },
      {
        title: "Weekly report",
        sub: "Processed and pending",
        who: "auto",
        explain: "A weekly report lists what was processed and anything still waiting.",
      },
    ],
    gate: { label: "You approve", explain: "Anything above the limits you set waits for your approval before it is recorded." },
    exception: { label: "Missing info → a person", explain: "Documents with missing or conflicting details are routed to a person to resolve." },
  },
  {
    id: "support",
    label: "Routine support",
    title: "Routine support",
    steps: [
      {
        title: "Customer question",
        sub: "Email, chat or form",
        who: "auto",
        explain: "A customer asks a routine question in a channel you already support.",
      },
      {
        title: "Match answer",
        sub: "From approved answers",
        who: "auto",
        explain: "An agent finds the right answer from the information you have approved. It does not invent prices or promises.",
      },
      {
        title: "Draft reply",
        sub: "In your tone",
        who: "auto",
        explain: "A reply is prepared in the tone and format you agreed with us.",
      },
      {
        title: "Send & log",
        sub: "Ticket or CRM",
        who: "auto",
        explain: "The reply is sent and the conversation is logged where your team can see it.",
      },
      {
        title: "Daily digest",
        sub: "Themes and open items",
        who: "auto",
        explain: "A daily digest shows what was answered and which questions came up most.",
      },
    ],
    gate: { label: "You approve", explain: "New kinds of answers are approved by you before the agent can use them." },
    exception: { label: "Complaint → a person", explain: "Complaints and anything unusual go straight to a person on your team." },
  },
];

/* ---------- geometry ---------- */

export type Box = { x: number; y: number; w: number; h: number };
export type Layout = {
  vw: number;
  vh: number;
  nodes: [Box, Box, Box, Box, Box];
  gate: Box;
  exception: Box;
  edges: [string, string, string, string];
  exceptionEdge: string;
};

// Wide stage: two columns, a zig-zag down to the summary.
const W = { w: 212, h: 64 };
export const WIDE: Layout = {
  vw: 560,
  vh: 400,
  nodes: [
    { x: 12, y: 16, ...W },
    { x: 336, y: 16, ...W },
    { x: 12, y: 156, ...W },
    { x: 336, y: 156, ...W },
    { x: 174, y: 304, ...W },
  ],
  gate: { x: 232, y: 175, w: 96, h: 26 },
  exception: { x: 388, y: 252, w: 160, h: 32 },
  edges: [
    "M224 48 C 270 48 290 48 336 48",
    "M442 80 C 442 122 118 114 118 156",
    "M224 188 C 270 188 290 188 336 188",
    "M442 220 C 442 262 280 262 280 304",
  ],
  exceptionEdge: "M548 40 C 556 40 556 46 556 60 L 556 238 C 556 248 550 252 540 252",
};

// Narrow stage: one staggered column for phones.
const N = { w: 214, h: 60 };
export const NARROW: Layout = {
  vw: 340,
  vh: 492,
  nodes: [
    { x: 6, y: 8, ...N },
    { x: 120, y: 112, ...N },
    { x: 6, y: 216, ...N },
    { x: 120, y: 320, ...N },
    { x: 6, y: 424, ...N },
  ],
  gate: { x: 120, y: 286, w: 100, h: 24 },
  exception: { x: 2, y: 126, w: 104, h: 30 },
  edges: [
    "M113 68 C 113 92 227 88 227 112",
    "M227 172 C 227 196 113 192 113 216",
    "M113 276 C 113 300 227 296 227 320",
    "M227 380 C 227 404 113 400 113 424",
  ],
  exceptionEdge: "M120 141 L 106 141",
};
