import { pageMeta } from "@/lib/meta";
import { CTA } from "@/lib/site";
import { HOME_FAQS } from "@/lib/faqs";
import { PageHero } from "@/components/PageHero";
import { SectionHead } from "@/components/Section";
import { CtaBand } from "@/components/CtaBand";
import { RunTrace } from "@/components/RunTrace";
import { FaqList, faqJsonLd } from "@/components/Faq";
import { ArrowIcon, Icon } from "@/components/Icon";

export const metadata = pageMeta({
  title: "How it works",
  description:
    "Discovery, design, build, then deployment and ongoing management. Quavok does all the technical work; you explain the process and approve what it does.",
  path: "/how-it-works/",
});

const STAGES = [
  {
    n: "01",
    title: "Discovery",
    body: "A conversation about one process that's taking your team's time. We learn how it works today, which tools it touches, where it stalls and what a good outcome looks like. We'll tell you honestly if it isn't a good candidate for automation.",
    you: "A call, and a few real examples of the work.",
    us: "Questions, a map of the process, a view on what to automate first.",
    out: "A shared understanding of the process and a proposal.",
  },
  {
    n: "02",
    title: "Design",
    body: "We write down exactly what the automation will do: what starts it, which steps run on their own, where it waits for your approval, what goes to a person, and which tools it connects to. Nothing is built until you agree.",
    you: "Read the scope, ask questions, approve it.",
    us: "Write the scope in plain language and check every integration.",
    out: "An approved scope.",
  },
  {
    n: "03",
    title: "Build",
    body: "We build the agents, workflows and integrations, then test them against real examples from your business. You see the results and the messages it will send before anything runs for real.",
    you: "Review test results and approve go-live.",
    us: "Build, connect, test and fix.",
    out: "A tested automation, ready to switch on.",
  },
  {
    n: "04",
    title: "Deploy & ongoing management",
    body: "We deploy it and run it. We monitor it, fix problems, keep it current when your tools or process change, and add new automations when you ask. Each customer's automations are intended to run in their own dedicated, managed cloud environment.",
    you: "Approve what needs you. Tell us what's changed.",
    us: "Operate, monitor, maintain and extend.",
    out: "An automation we run, with you in charge.",
  },
];

const FAQ_PICK = HOME_FAQS.filter((f) =>
  ["Do I need technical knowledge?", "Who creates and maintains the agents?", "Can I request additional automations?", "What happens when an automation fails?", "How does pricing work?"].includes(f.q),
);

export default function HowItWorksPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ_PICK)) }} />
      <PageHero
        eyebrow="How it works"
        title="You know the work. We make it flow."
        lead="Start with one process that gets in the way of your real work. We’ll listen, design it with you, build it and keep it running. You decide what good looks like. We handle the technology."
      >
        <a className="btn btn-primary" href={CTA.book.href}>
          {CTA.book.label}
          <ArrowIcon />
        </a>
      </PageHero>

      <section className="section pt-4" aria-label="The four stages">
        <div className="wrap">
          <ol className="grid gap-5">
            {STAGES.map((s) => (
              <li key={s.n} className="process-entry grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14" data-rv>
                <div>
                  <p className="step-num">
                    <b>{s.n}</b>
                    Stage {Number(s.n)} of 4
                  </p>
                  <h2 className="t-h3 mt-5" style={{ fontSize: "clamp(1.6rem, 1.25rem + 1.2vw, 2.4rem)" }}>
                    {s.title}
                  </h2>
                  <p className="t-body mt-4 max-w-[54ch]">{s.body}</p>
                </div>
                <dl className="kv self-end">
                  <div>
                    <dt>What we need from you</dt>
                    <dd>{s.you}</dd>
                  </div>
                  <div>
                    <dt>What we do</dt>
                    <dd>{s.us}</dd>
                  </div>
                  <div>
                    <dt>You come away with</dt>
                    <dd className="font-semibold">{s.out}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-line bg-paper-2" aria-labelledby="run-title">
        <div className="wrap grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <SectionHead
              id="run-title"
              eyebrow="Once it's running"
              title="It waits for you where you want a say."
              lead="Automations work through the agreed steps on their own. Where you asked to approve something, they stop and wait. Where something falls outside the rules, they hand it to a person."
            />
            <ul className="mt-8 space-y-4 text-[15.5px]" data-rv>
              <li className="flex gap-3">
                <Icon name="check" className="mt-0.5 flex-none text-accent-soft" strokeWidth={2.2} /> Clear summaries of what ran and what is waiting on you.
              </li>
              <li className="flex gap-3">
                <Icon name="person" className="mt-0.5 flex-none text-accent-text" strokeWidth={2} /> Exceptions go to your team instead of being guessed at.
              </li>
              <li className="flex gap-3">
                <Icon name="wrench" className="mt-0.5 flex-none text-ink" strokeWidth={2} /> We monitor, investigate failures and fix the cause.
              </li>
            </ul>
          </div>
          <div data-rv>
            <RunTrace />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="change-title">
        <div className="wrap grid gap-5 md:grid-cols-2" data-rv-group>
          <div className="card p-7 sm:p-9" data-rv>
            <h2 id="change-title" className="t-h3">
              When something goes wrong
            </h2>
            <p className="t-body mt-4">
              Automations are designed to stop and hand over rather than push on. If a step fails, a tool is unavailable, or an item doesn&apos;t fit the
              rules, it is held or routed to a person, and we look into it. You&apos;re told when something needs your attention.
            </p>
            <p className="mt-4 text-[14px] text-mute">
              Monitoring hours and response times are agreed with you before anything goes live.
            </p>
          </div>
          <div className="card p-7 sm:p-9" data-rv>
            <h2 className="t-h3">Changing or adding automations</h2>
            <p className="t-body mt-4">
              Your process changes; the automation should too. Tell us what&apos;s different, or what else you&apos;d like automated, by email, on a call
              or through Rocket, which forwards the request to us. We scope it, you approve it, we build and run it.
            </p>
            <p className="mt-4">
              <a className="text-link font-semibold" href="/rocket/">
                About Rocket
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="hfaq-title">
        <div className="wrap grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <SectionHead id="hfaq-title" eyebrow="FAQ" title="About the process." />
          <div data-rv>
            <FaqList items={FAQ_PICK} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
