import { pageMeta } from "@/lib/meta";
import { CTA, SITE } from "@/lib/site";
import { INTRO_BOOT } from "@/lib/intro/boot";
import { CATEGORIES } from "@/lib/categories";
import { HOME_FAQS } from "@/lib/faqs";
import { StudioDetails } from "@/components/home/StudioDetails";
import { HeroIntro } from "@/components/home/HeroIntro";
import { HeroStage } from "@/components/home/HeroStage";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { ScenarioGraph } from "@/components/graph/ScenarioGraph";
import { HowWeWork } from "@/components/HowWeWork";
import { RocketVignette } from "@/components/RocketVignette";
import { FaqList, faqJsonLd } from "@/components/Faq";
import { SectionHead } from "@/components/Section";
import { CtaBand } from "@/components/CtaBand";
import { Magnetic } from "@/components/Magnetic";
import { ArrowIcon, Icon } from "@/components/Icon";

export const metadata = pageMeta({
  title: "Quavok · Custom AI agents and workflows, built and run for you",
  description:
    "Less busywork. More breathing room. Quavok builds and manages custom AI agents and workflows that take repetitive operations off your team, so you never have to manage the technology.",
  path: "/",
});

const CHORES = [
  "Can someone copy this lead into the CRM?",
  "Did anyone reply to yesterday’s enquiry?",
  "I’ll chase that quote tomorrow.",
  "Who’s putting the weekly report together?",
];

const WHY = [
  {
    icon: "shield" as const,
    title: "Fully managed, start to finish",
    body: "We design, build, deploy, host, monitor and maintain. There is no software for your team to learn and nothing to configure.",
  },
  {
    icon: "layers" as const,
    title: "Built around how you work",
    body: "Every automation is custom, shaped around your existing process and tools. Not a pack of templates you have to bend your business to.",
  },
  {
    icon: "check" as const,
    title: "You stay in control",
    body: "You approve the scope, the wording and every change. Anything sensitive or out of the ordinary goes to a person, not a guess.",
  },
  {
    icon: "person" as const,
    title: "You talk to the people who build it",
    body: "We’re a small, early-stage team of two founders. The people you explain your process to are the people who build and run it.",
  },
];

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQS)) }} />

      {/* 1. Hero */}
      <section className="hero" data-intro-hero aria-labelledby="hero-title">
        {/* Runs during parsing, before the hero paints. See lib/intro/boot.ts. */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
        <div className="hero-spotlight" aria-hidden="true" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title" className="t-hero">
              <span className="hero-opening">Hand us the <span id="rocket-origin" aria-hidden="true" />busywork.</span>
              <span className="hero-promise" data-intro-type data-intro-hold>Focus on what actually matters.</span>
            </h1>
            <p className="t-lead mt-7 max-w-[54ch]">
              Your customers. Your craft. Your next big idea. We design, deploy and run custom AI automation, so your people have room for all three.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Magnetic href={CTA.discuss.href} className="btn btn-primary">
                {CTA.discuss.label}
                <ArrowIcon />
              </Magnetic>
              <a className="btn btn-ghost" href={CTA.automate.href}>
                {CTA.automate.label}
              </a>
            </div>
            <ul className="hero-points mt-9" aria-label="How it works in short">
              <li>We build it</li>
              <li>We run it</li>
              <li>You approve what it does</li>
            </ul>
          </div>
          <div className="workshop">
            <p className="workshop-note"><span className="workshop-purple" aria-hidden="true" />Behind the scenes of less busywork</p>
            <HeroStage />
            <p className="workshop-afterword">You bring the process. We bring it together.</p>
          </div>
        </div>
        <StudioDetails />
        <HeroIntro />
      </section>

      <div className="process-ribbon" aria-label="We connect the dots: inbox, CRM, follow-up, reporting"><span>Inbox</span><b>↗</b><span>CRM</span><b>↗</b><span>Follow-up</span><b>↗</b><span>Reporting</span><b>✳</b><em>We connect the dots.</em></div>

      {/* 2. Problem */}
      <section className="section busywork-wall" aria-labelledby="problem-title">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHead
              id="problem-title"
              eyebrow="A familiar kind of busy"
              title="Great people. Too many little tasks."
              lead="The copy-paste. The chasing. The report that somehow needs rebuilding every Friday. Necessary? Yes. The best use of your people? Probably not."
            />
            <p className="t-body mt-6 max-w-[56ch]" data-rv>
              Show us the routine that keeps getting in the way. We’ll map it with you, automate the agreed parts, and look after the technology. You keep the judgment. We handle the repetition.
            </p>
          </div>
          <div>
            <p className="eyebrow eyebrow--plain mb-4" data-rv>
              Sound familiar?
            </p>
            <ul className="sticker-wall" data-rv-group>
              {CHORES.map((c) => (
                <li key={c} className="chore" data-rv>
                  <Icon name="support" className="mt-1 flex-none text-faint" />
                  <q>{c}</q>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. What we automate */}
      <section id="automate" className="section" aria-labelledby="automate-title">
        <div className="wrap">
          <SectionHead
            id="automate-title"
            eyebrow="What we automate"
            title="Your repeat list. Our kind of work."
            lead="Custom agents, workflows and integrations for the repetitive work across your business, each one designed around how you already operate."
          />
          <div className="automation-index mt-14" data-rv-group>
            {CATEGORIES.map((c, i) => (
              <article key={c.title} className="cat" data-rv>
                <span className="index-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="ico" aria-hidden="true">
                  <Icon name={c.icon} />
                </span>
                <h3 className="font-sans text-[16.5px] font-semibold leading-snug tracking-[-0.01em]">{c.title}</h3>
                <ul>
                  {c.examples.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-24 grid gap-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-end" data-rv>
              <div>
              <p className="eyebrow">See one up close</p>
              <h3 className="t-h3 mt-5 max-w-[22ch]" style={{ fontSize: "clamp(1.6rem, 1.2rem + 1.2vw, 2.25rem)" }}>
                One process, five steps, one approval, one route to a person.
              </h3>
              </div>
              <div>
              <p className="t-body max-w-[52ch]">
                Every automation we build has the same shape: it does the repetitive work, waits for you where you want a say, and hands anything unusual
                to your team. Pick an example and select a step to see who does what.
              </p>
              <p className="mt-6">
                <a className="text-link font-semibold" href="/solutions/">
                  More examples by department
                </a>
              </p>
              </div>
            </div>
            <div data-rv>
              <ScenarioGraph />
            </div>
            <div className="workflow-invitation">
              <p>Have a process like this?</p>
              <a className="btn btn-primary" href="/contact/">Discuss Your Workflow<ArrowIcon /></a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Before / after */}
      <section className="section sorting-room" aria-labelledby="ba-title">
        <div className="wrap">
          <SectionHead
            id="ba-title"
            eyebrow="Before and after"
            title="From all over the place to in its place."
            lead="Today, routine tasks pile up on whoever is nearest. With Quavok, the same tasks are handled automatically, wait for you only when you want a say, or go to a person when they need one."
          />
          <div className="mt-12" data-rv>
            <BeforeAfter />
          </div>
        </div>
      </section>

      {/* 5. How we work */}
      <section id="how" className="section" aria-labelledby="how-title">
        <div className="wrap">
          <SectionHead
            id="how-title"
            eyebrow="How we work"
            title="You explain the work. We do the rest."
            lead="Four steps, and you never build, configure or deploy anything. You tell us how the work happens, approve what we propose, and we take it from there."
          />
          <div className="mt-14">
            <HowWeWork />
          </div>
          <p className="mt-4" data-rv>
            <a className="btn btn-ghost" href="/how-it-works/">
              How it works in detail
              <ArrowIcon />
            </a>
          </p>
        </div>
      </section>

      {/* 6. Why us */}
      <section className="section why-studio" aria-labelledby="why-title">
        <div className="wrap">
          <SectionHead
            id="why-title"
            eyebrow="Why Quavok"
            title="We build the automation. We run the automation."
            lead="A useful automation should make your day simpler. That includes the part where someone has to keep it working. That someone is us."
          />
          <div className="studio-promises mt-14" data-rv-group>
            {WHY.map((w) => (
              <article key={w.title} className="card p-7" data-rv>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-purple" aria-hidden="true">
                  <Icon name={w.icon} />
                </span>
                <h3 className="t-h3 mt-6">{w.title}</h3>
                <p className="t-body mt-3">{w.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Rocket */}
      <section id="rocket" className="section rocket-room" aria-labelledby="rocket-title">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <SectionHead
              id="rocket-title"
              eyebrow="Rocket"
              title="Your operations. Now in conversation."
              lead="Rocket is the conversational way to interact with the automations we build and run for you: what ran, what’s waiting on you, and what you’d like next."
            />
            <ul className="mt-8 space-y-4 text-[15.5px]" data-rv>
              <li className="flex gap-3">
                <Icon name="check" className="mt-0.5 flex-none text-accent-soft" strokeWidth={2.2} />
                <span>Ask what happened, what needs your approval, or for a summary.</span>
              </li>
              <li className="flex gap-3">
                <Icon name="forward" className="mt-0.5 flex-none text-accent-soft" strokeWidth={2} />
                <span>Request a new automation. Rocket forwards it to our team; it never builds anything itself.</span>
              </li>
              <li className="flex gap-3">
                <Icon name="bell" className="mt-0.5 flex-none text-accent-text" strokeWidth={2} />
                <span>
                  A paid proactive add-on that reaches out first with alerts, suggestions and reports.{" "}
                  <span className="dev-badge align-[1px]">In development</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Icon name="eye" className="mt-0.5 flex-none text-accent-text" strokeWidth={2} />
                <span>
                  Desktop and mobile apps. <span className="dev-badge align-[1px]">In development</span>
                </span>
              </li>
            </ul>
            <p className="mt-8" data-rv>
              <a className="btn btn-ghost" href="/rocket/">
                More about Rocket
                <ArrowIcon />
              </a>
            </p>
          </div>
          <div data-rv>
            <RocketVignette />
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section id="faq" className="section border-t border-line" aria-labelledby="faq-title">
        <div className="wrap grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <SectionHead id="faq-title" eyebrow="FAQ" title="Questions, answered plainly." />
            <p className="t-body mt-6 max-w-[36ch]" data-rv>
              Something else on your mind?{" "}
              <a className="text-link text-ink" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </p>
          </div>
          <div data-rv>
            <FaqList items={HOME_FAQS} />
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <CtaBand />
    </>
  );
}
