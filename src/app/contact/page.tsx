import { pageMeta } from "@/lib/meta";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";

export const metadata = pageMeta({
  title: "Contact",
  description: "Tell Quavok about the repetitive work slowing your business down. Discuss your workflow or book a discovery call.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="What keeps getting in the way?"
        lead="Tell us about one task your team keeps repeating. No polished brief needed. Use the form to prepare an email, then send it from your email app. We’ll start with the work and see where automation could help."
      />
      <section className="section pt-4" aria-label="Contact form and details">
        <div className="wrap grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
          <div className="card p-6 sm:p-9">
            <ContactForm />
          </div>
          <aside className="grid content-start gap-4">
            <div className="card p-6">
              <h2 className="font-mono text-[11.5px] tracking-[0.08em] text-faint uppercase">Direct</h2>
              <ul className="mt-4 space-y-4 text-[15.5px]">
                <li className="flex gap-3">
                  <Icon name="mail" className="mt-0.5 flex-none" />
                  <a className="text-link" href={`mailto:${SITE.email}`}>
                    {SITE.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Icon name="phone" className="mt-0.5 flex-none" />
                  <span>
                    <a className="text-link" href={SITE.phoneHref}>
                      {SITE.phoneDisplay}
                    </a>
                    <span className="block text-[13.5px] text-mute">
                      Phone, or{" "}
                      <a className="text-link" href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer">
                        message on WhatsApp
                      </a>
                    </span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Icon name="pin" className="mt-0.5 flex-none" />
                  <span>{SITE.address}</span>
                </li>
              </ul>
            </div>
            <div className="card p-6">
              <h2 className="font-mono text-[11.5px] tracking-[0.08em] text-faint uppercase">What happens next</h2>
              <ol className="mt-4 space-y-3 text-[15px] text-ink-2">
                <li>1. We read what you sent and reply with any questions.</li>
                <li>2. We set up a discovery call about one process.</li>
                <li>3. If it&apos;s a good fit, we propose a scope and a price before any work starts.</li>
              </ol>
              <p className="mt-4 text-[13.5px] text-mute">
                Scheduling link: <span className="placeholder">[PLACEHOLDER: booking calendar URL]</span>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
