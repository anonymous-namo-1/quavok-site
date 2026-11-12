import { pageMeta } from "@/lib/meta";
import { CTA } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { SectionHead } from "@/components/Section";
import { CtaBand } from "@/components/CtaBand";
import { ArrowIcon, Icon, type IconName } from "@/components/Icon";

export const metadata = pageMeta({
  title: "Services",
  description:
    "Automation development, AI agent development, integrations, and fully managed hosting and maintenance. Quavok builds custom automation and runs it for you.",
  path: "/services/",
});

const SERVICES: { id: string; icon: IconName; title: string; summary: string; includes: string[]; example: string }[] = [
  {
    id: "automation",
    icon: "layers",
    title: "Automation development",
    summary:
      "Workflows that move work through your business without someone pushing it along: triggers, rules, schedules, hand-offs and approvals, designed around the steps you already follow.",
    includes: [
      "Mapping the process with you and agreeing what to automate",
      "Rules, schedules and conditions written from how you work",
      "Approval points wherever you want a say",
      "Clear routes to a person for exceptions",
    ],
    example: "A new order triggers a confirmation, a record update, a task for the warehouse and a reminder if it isn't picked up.",
  },
  {
    id: "agents",
    icon: "agent",
    title: "AI agent development",
    summary:
      "Custom AI agents for the steps that need reading and writing: understanding an enquiry, pulling fields from a document, drafting a reply or summarising the week. They work inside the boundaries you approve.",
    includes: [
      "Agents that read, classify, extract, draft and summarise",
      "Answers drawn only from information you approve",
      "Escalation to a person when something is unclear",
      "Testing against real examples from your business",
    ],
    example: "An agent reads each incoming invoice, extracts supplier, amount and due date, and flags any that are missing details.",
  },
  {
    id: "integrations",
    icon: "plug",
    title: "Integrations",
    summary:
      "Connections between the tools you already use, so information stops being retyped. Email, forms, spreadsheets, CRMs, calendars, accounting and messaging tools can be connected when they offer a way in.",
    includes: [
      "Connecting the systems your process already touches",
      "Keeping records in sync between them",
      "Checking each integration during discovery before we commit to it",
      "Telling you plainly when a tool can't be connected reliably",
    ],
    example: "Website enquiries land in your CRM with notes attached, and the same contact is updated in your mailing list.",
  },
  {
    id: "managed",
    icon: "shield",
    title: "Fully managed hosting & maintenance",
    summary:
      "We don't hand over a system and leave. We deploy, host, monitor and maintain everything we build, and make changes when your process does. Each customer's automations are intended to run in their own dedicated, managed cloud environment.",
    includes: [
      "Deployment and hosting, handled by us",
      "Monitoring, fixes and updates",
      "Changes and new automations on request",
      "A dedicated managed environment per customer (intended)",
    ],
    example: "Your supplier changes their invoice format. We check the affected steps, update the agent and test it again.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Leave the busywork with us."
        lead="Your team knows the work. We build the automation around it, then keep it running. From the first process map to the everyday fixes, the technical work is ours. You approve what it does and get back to what matters."
      >
        <div className="flex flex-wrap gap-3">
          <a className="btn btn-primary" href={CTA.discuss.href}>
            {CTA.discuss.label}
            <ArrowIcon />
          </a>
          <a className="btn btn-ghost" href="/solutions/">
            See example workflows
          </a>
        </div>
      </PageHero>

      <section className="section pt-8" aria-label="Services">
        <div className="wrap">
          <nav aria-label="On this page" className="mb-12 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="tag hover:border-ink hover:text-ink">
                {s.title}
              </a>
            ))}
          </nav>
          <div className="grid gap-5">
            {SERVICES.map((s) => (
              <article key={s.id} id={s.id} className="service-entry grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14" data-rv>
                <div>
                  <div className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-purple" aria-hidden="true">
                      <Icon name={s.icon} />
                    </span>
                  </div>
                  <h2 className="t-h3 mt-6" style={{ fontSize: "clamp(1.6rem, 1.25rem + 1.2vw, 2.3rem)" }}>
                    {s.title}
                  </h2>
                  <p className="t-body mt-4 max-w-[52ch]">{s.summary}</p>
                </div>
                <div>
                  <h3 className="font-mono text-[11.5px] tracking-[0.08em] text-faint uppercase">Includes</h3>
                  <ul className="mt-4 space-y-3">
                    {s.includes.map((x) => (
                      <li key={x} className="flex gap-3 text-[15.5px]">
                        <Icon name="check" className="mt-0.5 flex-none text-accent-soft" strokeWidth={2.2} />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <div className="service-example mt-7">
                    <p className="mt-2 text-[15px] text-ink-2">{s.example}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-paper-2" aria-labelledby="split-title">
        <div className="wrap">
          <SectionHead
            id="split-title"
            eyebrow="Who does what"
            title="Your part is small on purpose."
            lead="The technical work is ours. Your role is to tell us how things work and decide what the automation is allowed to do."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2" data-rv-group>
            <div className="card p-7" data-rv>
              <h3 className="t-h3">You</h3>
              <ul className="mt-5 space-y-3 text-[15.5px] text-ink-2">
                <li>Explain how the work happens today</li>
                <li>Share examples and give access to the tools involved</li>
                <li>Approve the scope, the wording and any changes</li>
                <li>Handle the exceptions routed to your team</li>
                <li>Tell us when something changes or what you&apos;d like next</li>
              </ul>
            </div>
            <div className="panel-dark on-dark p-7" data-rv>
              <h3 className="t-h3 text-white">Quavok</h3>
              <ul className="mt-5 space-y-3 text-[15.5px]">
                <li>Map the process and propose what to automate</li>
                <li>Design and build the agents, workflows and integrations</li>
                <li>Test with real examples before anything goes live</li>
                <li>Deploy, host, monitor and fix</li>
                <li>Maintain, update and extend as you grow</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 rounded-2xl border border-dashed border-line-2 p-6 text-[15px] text-mute" data-rv>
            <strong className="text-ink">What we don&apos;t offer:</strong> a do-it-yourself builder, a template marketplace, or software for your team to
            configure. If you want to build automations yourself, we&apos;re not the right fit, and we&apos;ll say so.
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
