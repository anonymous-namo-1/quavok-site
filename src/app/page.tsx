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



      {/* 2. Problem */}
      <section className="section busywork-wall" aria-labelledby="problem-title">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHead
              id="problem-title"
              eyebrow=""
              title="Great people. Too many little tasks."
              lead="The copy-paste. The chasing. The report rebuilt every Friday. Small jobs that take up too much of the day."
            />
            <p className="t-body mt-6 max-w-[56ch]" data-rv>
              You keep the judgment. We handle the repetition.
            </p>
          </div>
          <div>
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
            eyebrow=""
            title="Your repeat list. Our kind of work."
            lead="Custom agents, workflows and integrations for the repetitive work across your business, each one designed around how you already operate."
          />
          <div className="automation-index automation-index--compact mt-14" data-rv-group>
            {CATEGORIES.map((c) => (
              <article key={c.title} className="cat" data-rv>
                <h3 className="font-sans text-[16.5px] font-semibold leading-snug tracking-[-0.01em]">{c.title}</h3>
                <ul>
                  {c.examples.slice(0, 1).map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-24 grid gap-10">
            <h3 className="t-h3">Pick an example. See who does what.</h3>
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
            eyebrow=""
            title="Everything in its place."
            lead="Routine work gets handled. Decisions wait for you. Exceptions go to a person."
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
            eyebrow=""
            title="Your process. Our responsibility."
            lead="From the first conversation to ongoing care, we handle the technology."
          />
          <ol className="process-strip">
            {[
              ["Understand", "You explain the process. We map the repetitive parts."],
              ["Build", "You approve the scope. We build and test it."],
              ["Run", "You make the key calls. We run the technology."],
              ["Improve", "You tell us what’s changed. We keep it useful."],
            ].map(([title, body], i) => <li key={title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></li>)}
          </ol>
          <p className="t-body">A small team of two founders. The people you explain your process to build and run it.</p>
          <details className="process-details"><summary>Explore the build, approval and run walkthrough</summary><HowWeWork /></details>
          <p className="mt-4" data-rv>
            <a className="btn btn-ghost" href="/how-it-works/">
              How it works in detail
              <ArrowIcon />
            </a>
          </p>
        </div>
      </section>

      {/* 7. Rocket */}
      <section id="rocket" className="section rocket-room" aria-labelledby="rocket-title">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <SectionHead
              id="rocket-title"
              eyebrow=""
              title="Just ask Rocket."
              lead="What ran? What needs your approval? Ask Rocket about the automations we build and run for you."
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
            <RocketVignette layered />
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section id="faq" className="section border-t border-line" aria-labelledby="faq-title">
        <div className="wrap grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <SectionHead id="faq-title" eyebrow="" title="Questions, answered plainly." />
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
