import { pageMeta } from "@/lib/meta";
import { CTA } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { ScenarioGraph } from "@/components/graph/ScenarioGraph";
import { ArrowIcon, Icon, type IconName } from "@/components/Icon";

export const metadata = pageMeta({
  title: "Solutions",
  description:
    "Examples of the repetitive workflows Quavok can automate by department: sales and leads, customer support, operations, finance and documents, coordination and reporting.",
  path: "/solutions/",
});

type Step = string | { t: string; you?: boolean; person?: boolean };
type Flow = { name: string; steps: Step[]; note: string };
type Dept = { id: string; icon: IconName; title: string; intro: string; flows: Flow[] };

const DEPTS: Dept[] = [
  {
    id: "sales",
    icon: "leads",
    title: "Sales & lead management",
    intro: "Enquiries answered and followed up consistently, without someone watching the inbox.",
    flows: [
      {
        name: "Enquiry to qualified lead",
        steps: ["New enquiry", "Qualify against your criteria", "CRM record", { t: "You approve wording", you: true }, "Follow-up sent"],
        note: "Unclear or high-value enquiries go straight to your team.",
      },
      {
        name: "Quote follow-up",
        steps: ["Quote sent", "Wait the agreed time", "Reminder drafted", { t: "You approve", you: true }, "Reminder sent", "Status updated"],
        note: "Replies are logged and handed to whoever owns the deal.",
      },
    ],
  },
  {
    id: "support",
    icon: "support",
    title: "Customer support",
    intro: "Routine questions answered from information you approve, giving your team room for conversations that need care.",
    flows: [
      {
        name: "Routine questions",
        steps: ["Customer asks", "Match approved answer", "Reply sent", "Conversation logged"],
        note: "Anything new or sensitive is routed to a person instead of guessed.",
      },
      {
        name: "Status updates",
        steps: ["“Where’s my order?”", "Look up status", "Reply with update", { t: "Delays → a person", person: true }],
        note: "Uses only the systems we have connected and checked.",
      },
    ],
  },
  {
    id: "operations",
    icon: "calendar",
    title: "Operations & admin",
    intro: "Scheduling, reminders and recurring admin that currently fill someone's day.",
    flows: [
      {
        name: "Appointment scheduling",
        steps: ["Booking request", "Check availability", "Confirm & add to calendar", "Reminder before", "Reschedule if asked"],
        note: "Special requests are passed to your team.",
      },
      {
        name: "Recurring admin",
        steps: ["Scheduled trigger", "Prepare routine paperwork", { t: "You review", you: true }, "Send & file"],
        note: "Runs on the cycle you set: daily, weekly or monthly.",
      },
    ],
  },
  {
    id: "finance",
    icon: "document",
    title: "Finance & documents",
    intro: "Less retyping, more time to check what matters. Read, check and enter routine documents with a person handling exceptions.",
    flows: [
      {
        name: "Invoice intake",
        steps: ["Invoice arrives", "Read fields", "Check complete", { t: "Over limit → you approve", you: true }, "Entered in your system"],
        note: "Missing or conflicting details go to a person.",
      },
      {
        name: "Form processing",
        steps: ["Form or PDF received", "Extract details", "Validate", "Update records", "Confirmation sent"],
        note: "We agree the required fields and checks with you up front.",
      },
    ],
  },
  {
    id: "coordination",
    icon: "coordinate",
    title: "Internal coordination",
    intro: "Requests and hand-offs that move between people without anyone chasing them.",
    flows: [
      {
        name: "Request routing",
        steps: ["Internal request", "Classify", "Assign to the right person", "Chase if stalled", "Close & notify"],
        note: "Routing rules come from how your team already divides work.",
      },
      {
        name: "Hand-off between teams",
        steps: ["Job marked done", "Notify next team", "Share the details they need", { t: "Blocked → a person", person: true }],
        note: "Everyone sees the same status without a status meeting.",
      },
    ],
  },
  {
    id: "reporting",
    icon: "report",
    title: "Reporting & monitoring",
    intro: "The reports someone rebuilds every week, assembled and sent on schedule.",
    flows: [
      {
        name: "Weekly report",
        steps: ["Friday trigger", "Gather figures from your tools", "Assemble report", "Send to the team"],
        note: "Built from the sources you already trust; we don't invent numbers.",
      },
      {
        name: "Watch for exceptions",
        steps: ["Check regularly", "Spot what needs attention", { t: "Alert the owner", person: true }],
        note: "You agree what counts as worth an alert.",
      },
    ],
  },
  {
    id: "industry",
    icon: "industry",
    title: "Industry-specific workflows",
    intro: "Every trade has its own routine. Bring us yours and we’ll work out whether automation would help.",
    flows: [
      {
        name: "Your recurring process",
        steps: ["Whatever starts it", "The steps your team repeats", { t: "Where you want a say", you: true }, "The outcome you need"],
        note: "Designed from discovery, not picked from a catalogue.",
      },
    ],
  },
];

function FlowLine({ steps }: { steps: Step[] }) {
  return (
    <ol className="flow mt-3">
      {steps.map((s, i) => {
        const o = typeof s === "string" ? { t: s } : s;
        return (
          <li key={i}>
            <span className={o.you ? "you" : o.person ? "person" : ""}>{o.t}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Good people. Better things to do."
        lead="The chasing. The copying. The same report, every Friday. These examples show where we could take work off your team’s plate, so they can spend more time with customers and on their craft. Each workflow is designed around your business."
      >
        <div className="flex flex-wrap items-center gap-3">
          <a className="btn btn-primary" href={CTA.discuss.href}>
            {CTA.discuss.label}
            <ArrowIcon />
          </a>
        </div>
      </PageHero>

      <section className="section pt-4" aria-label="Interactive example">
        <div className="wrap">
          <div data-rv>
            <ScenarioGraph />
          </div>
        </div>
      </section>

      <section className="section border-t border-line pt-16" aria-label="Examples by department">
        <div className="wrap">
          <nav aria-label="Departments" className="mb-12 flex flex-wrap gap-2">
            {DEPTS.map((d) => (
              <a key={d.id} href={`#${d.id}`} className="tag hover:border-ink hover:text-ink">
                {d.title}
              </a>
            ))}
          </nav>
          <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13.5px] text-mute">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded bg-paper-2 ring-1 ring-line" /> Runs automatically
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded bg-ink" /> You approve
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded bg-accent-surface ring-1 ring-accent-text/30" /> A person handles
            </span>
          </div>
          <div className="grid gap-5">
            {DEPTS.map((d) => (
              <article key={d.id} id={d.id} className="solution-entry grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12" data-rv>
                <div>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-paper-2" aria-hidden="true">
                    <Icon name={d.icon} />
                  </span>
                  <h2 className="t-h3 mt-5" style={{ fontSize: "clamp(1.45rem, 1.2rem + 0.9vw, 2rem)" }}>
                    {d.title}
                  </h2>
                  <p className="t-body mt-3 max-w-[42ch]">{d.intro}</p>
                </div>
                <div className="grid gap-6">
                  {d.flows.map((f) => (
                    <div key={f.name} className="border-t border-line pt-5 first:border-t-0 first:pt-0">
                      <h3 className="text-[16px] font-semibold">{f.name}</h3>
                      <FlowLine steps={f.steps} />
                      <p className="mt-3 text-[14px] text-mute">{f.note}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      <CtaBand body="Don’t see your process here? Bring one task your team keeps repeating. We’ll work out together whether automation is a good fit." />
    </>
  );
}
