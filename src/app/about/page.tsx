import { pageMeta } from "@/lib/meta";
import { CTA, SITE } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { SectionHead, PlaceholderNote } from "@/components/Section";
import { CtaBand } from "@/components/CtaBand";
import { ArrowIcon } from "@/components/Icon";

export const metadata = pageMeta({
  title: "About",
  description:
    "Quavok is an early-stage, two-founder company building fully managed custom AI automation: we build the automation, and we run it.",
  path: "/about/",
});

const PRINCIPLES = [
  { t: "Honest about fit", b: "If a process isn't a good candidate for automation, we'll tell you, even if that means there's no project." },
  { t: "Custom, not catalogue", b: "We build around how your business already operates. We don't sell prebuilt packs you have to adapt to." },
  { t: "People stay in charge", b: "You approve what an automation is allowed to do. Exceptions and judgment calls go to people." },
  { t: "We own the running", b: "Building is half the job. Monitoring, fixing and improving what we built is the other half, and it's ours." },
];

// Founder details are intentionally placeholders until confirmed.
const FOUNDERS = [
  { name: "Founder name", role: "Role", bio: "Short bio: background and what they focus on at Quavok" },
  { name: "Founder name", role: "Role", bio: "Short bio: background and what they focus on at Quavok" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="For the work only your people can do."
        lead="Knowing your customers. Caring about the details. Making the next thing better. That’s where your people belong. We build and run the automation that gives them more room for it."
      />

      <section className="section pt-4" aria-labelledby="story-title">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div data-rv>
            <h2 id="story-title" className="t-h3" style={{ fontSize: "clamp(1.6rem, 1.25rem + 1.2vw, 2.3rem)" }}>
              Small team. Close to the work.
            </h2>
            <div className="t-body mt-5 space-y-4">
              <p>
                Quavok is an early-stage company with two founders. We think good people spend too much of their day moving information around. We want to help them get back to the work they care about.
              </p>
              <p>
                So we take that job. We design custom AI agents, workflows and integrations around how a business already operates, and then we run them.
                Our customers explain the work and approve what it does; they never manage the technology.
              </p>
              <p>
                We&apos;re working toward our first client deployments. We won&apos;t pretend otherwise: there are no logos or case studies on this site
                yet, because we don&apos;t publish claims we can&apos;t back up. What you get today is direct access to the people who will build and run
                your automation.
              </p>
            </div>
          </div>
          <div className="card p-7 sm:p-9" data-rv>
            <h2 className="font-mono text-[11.5px] tracking-[0.08em] text-faint uppercase">Company</h2>
            <dl className="kv mt-3">
              <div>
                <dt>What we do</dt>
                <dd>Fully managed custom AI automation</dd>
              </div>
              <div>
                <dt>Team</dt>
                <dd>Two founders</dd>
              </div>
              <div>
                <dt>Stage</dt>
                <dd>Early-stage, working toward first deployments</dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>{SITE.address}</dd>
              </div>
              <div>
                <dt>Contact</dt>
                <dd>
                  <a className="text-link" href={`mailto:${SITE.email}`}>
                    {SITE.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section border-t border-line bg-paper-2" aria-labelledby="founders-title">
        <div className="wrap">
          <SectionHead id="founders-title" eyebrow="Founders" title="The people you'll work with." />
          <div className="mt-12 grid gap-4 md:grid-cols-2" data-rv-group>
            {FOUNDERS.map((f, i) => (
              <article key={i} className="card flex gap-5 p-7" data-rv>
                <div className="grid h-16 w-16 flex-none place-items-center rounded-2xl border border-dashed border-line-2 bg-paper font-mono text-[11px] text-faint">
                  Photo
                </div>
                <div className="min-w-0">
                  <h3 className="t-h3">
                    <PlaceholderNote>{f.name}</PlaceholderNote>
                  </h3>
                  <p className="mt-2 text-[14px] text-mute">
                    <PlaceholderNote>{f.role}</PlaceholderNote>
                  </p>
                  <p className="mt-3 text-[15px] text-mute">
                    <PlaceholderNote>{f.bio}</PlaceholderNote>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="principles-title">
        <div className="wrap">
          <SectionHead id="principles-title" eyebrow="How we operate" title="A few things we hold ourselves to." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-rv-group>
            {PRINCIPLES.map((p) => (
              <article key={p.t} className="principle-entry" data-rv>
                <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{p.t}</h3>
                <p className="t-body mt-3 text-[15px]">{p.b}</p>
              </article>
            ))}
          </div>
          <p className="mt-12" data-rv>
            <a className="btn btn-primary" href={CTA.discuss.href}>
              {CTA.discuss.label}
              <ArrowIcon />
            </a>
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
