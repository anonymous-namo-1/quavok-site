import { pageMeta } from "@/lib/meta";
import { CTA } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { SectionHead } from "@/components/Section";
import { CtaBand } from "@/components/CtaBand";
import { RocketVignette } from "@/components/RocketVignette";
import { FaqList, faqJsonLd } from "@/components/Faq";
import type { Faq } from "@/lib/faqs";
import { ArrowIcon, Icon } from "@/components/Icon";

export const metadata = pageMeta({
  title: "Rocket",
  description:
    "Ask about the automations Quavok builds and runs for you. Explore the Rocket concept; its desktop and mobile apps and paid proactive add-on are in development.",
  path: "/rocket/",
});

const STATUS: { what: string; detail: string; status: "dev" | "tbc" }[] = [
  {
    what: "Ask Rocket about your automations",
    detail: "Conversational questions about the automations Quavok runs for you, and forwarding new requests to the team.",
    status: "tbc",
  },
  { what: "Desktop app", detail: "Rocket on your computer.", status: "dev" },
  { what: "Mobile app", detail: "Rocket on your phone.", status: "dev" },
  { what: "Proactive add-on (paid)", detail: "Rocket reaches out first with alerts, suggestions and reports.", status: "dev" },
];

const ROCKET_FAQS: Faq[] = [
  {
    q: "Can Rocket build or change an automation?",
    a: [
      "No. Rocket never builds, configures or deploys anything. When you ask for something new or different, it forwards the request to the Quavok team, who scope it with you and build it.",
    ],
  },
  {
    q: "Do I need Rocket to use Quavok?",
    a: ["No. Your automations run without it. Rocket is an optional way to interact with them."],
  },
  {
    q: "How much does the proactive add-on cost?",
    a: ["It's in development and not available yet, so there's no price. We'll share details when it's ready."],
  },
  {
    q: "What can Rocket see?",
    a: [
      "Rocket is designed to answer about the automations Quavok runs for your business, not to roam your systems. The details of what it can access will be agreed with you as part of your scope.",
    ],
  },
];

export default function RocketPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(ROCKET_FAQS)) }} />
      <PageHero
        eyebrow="Rocket"
        title="Less digging. Just ask Rocket."
        lead="Rocket is a conversational way to ask about the automations we build and run for you. What’s done? What needs you? Ask for a new automation, and Rocket passes the request to our team. We handle the build."
      >
        <div className="flex flex-wrap items-center gap-3">
          <a className="btn btn-primary" href={CTA.discuss.href}>
            {CTA.discuss.label}
            <ArrowIcon />
          </a>
          <span className="dev-badge">Apps &amp; proactive add-on in development</span>
        </div>
      </PageHero>

      <section className="section pt-4" aria-label="Rocket concept preview">
        <div className="wrap" data-rv>
          <RocketVignette />
        </div>
      </section>

      <section className="section border-t border-line bg-paper-2" aria-labelledby="modes-title">
        <div className="wrap">
          <SectionHead id="modes-title" eyebrow="Two ways to use it" title="You ask. Or, soon, Rocket reaches out." />
          <div className="mt-12 grid gap-4 md:grid-cols-2" data-rv-group>
            <article className="card p-7 sm:p-9" data-rv>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-purple text-ink" aria-hidden="true">
                <Icon name="support" />
              </span>
              <h3 className="t-h3 mt-6">You ask</h3>
              <ul className="mt-5 space-y-3 text-[15.5px] text-ink-2">
                <li>“What needs my approval today?”</li>
                <li>“Summarise yesterday’s enquiries.”</li>
                <li>“Why did this one go to my team?”</li>
                <li>“Can we also automate our quote reminders?” Forwarded to the team.</li>
              </ul>
            </article>
            <article className="panel-dark on-dark p-7 sm:p-9" data-rv>
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-stage-2 text-purple" aria-hidden="true">
                  <Icon name="bell" />
                </span>
                <span className="dev-badge">Paid add-on · In development</span>
              </div>
              <h3 className="t-h3 mt-6 text-white">Rocket reaches out</h3>
              <p className="mt-4 text-[15.5px]">
                A planned paid add-on that makes Rocket proactive. Instead of waiting to be asked, it would message you first:
              </p>
              <ul className="mt-4 space-y-3 text-[15.5px]">
                <li>
                  <strong className="text-white">Alerts</strong> when something needs your attention.
                </li>
                <li>
                  <strong className="text-white">Reports</strong> on what your automations handled.
                </li>
                <li>
                  <strong className="text-white">Suggestions</strong> for work worth automating next, which it can pass to our team at your OK.
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="status-title">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead
            id="status-title"
            eyebrow="Status"
            title="Where Rocket stands."
            lead="We label anything unfinished where it appears. Nothing here is available to download."
          />
          <div className="card divide-y divide-line" data-rv>
            {STATUS.map((s) => (
              <div key={s.what} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="font-semibold">{s.what}</p>
                  <p className="mt-1 text-[14.5px] text-mute">{s.detail}</p>
                </div>
                {s.status === "dev" ? (
                  <span className="dev-badge self-start sm:self-auto">In development</span>
                ) : (
                  <span className="placeholder self-start text-[12px] sm:self-auto">[PLACEHOLDER: confirm availability]</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="never-title">
        <div className="wrap">
          <div className="rounded-[22px] border border-dashed border-line-2 p-7 sm:p-10" data-rv>
            <h2 id="never-title" className="t-h3">
              What Rocket will never do
            </h2>
            <ul className="mt-6 grid gap-3 text-[15.5px] sm:grid-cols-3">
              <li className="flex gap-3">
                <Icon name="x" className="mt-0.5 flex-none text-accent-text" strokeWidth={2} /> Build, configure or deploy an automation
              </li>
              <li className="flex gap-3">
                <Icon name="x" className="mt-0.5 flex-none text-accent-text" strokeWidth={2} /> Change what an automation is allowed to do
              </li>
              <li className="flex gap-3">
                <Icon name="x" className="mt-0.5 flex-none text-accent-text" strokeWidth={2} /> Replace the Quavok team behind it
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section pt-0" aria-labelledby="rfaq-title">
        <div className="wrap grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <SectionHead id="rfaq-title" eyebrow="FAQ" title="About Rocket." />
          <div data-rv>
            <FaqList items={ROCKET_FAQS} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
