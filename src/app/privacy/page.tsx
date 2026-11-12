import { pageMeta } from "@/lib/meta";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/PageHero";

export const metadata = pageMeta({
  title: "Privacy",
  description: "How the Quavok website handles your information.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy" lead="How this website handles your information." />
      <section className="section pt-0">
        <div className="wrap">
          <div className="prose-measure t-body space-y-5 text-[16.5px]">
            <p>
              <span className="placeholder">
                [PLACEHOLDER: full privacy policy for the managed automation service, including client and end-customer data, pending review]
              </span>
            </p>
            <h2 className="t-h3 pt-4 text-ink">This website</h2>
            <p>
              This is a static website. It has no accounts, no cookies of our own and no analytics trackers. The hosting provider may keep standard server
              logs. Rocket’s minimised preference is saved in your browser’s localStorage on this device. You can restore Rocket with the corner button or clear the preference by clearing this site’s browser storage.
            </p>
            <p>
              Rocket does not access your business systems from this website. The optional read-aloud control uses your browser’s speech service.
            </p>
            <p>
              The contact form does not send anything to a server. Submitting it opens your own email app with your message filled in, addressed to{" "}
              {SITE.email}. We only receive what you choose to send.
            </p>
            <h2 className="t-h3 pt-4 text-ink">What you send us</h2>
            <p>
              If you email, call or message us, we use what you send (such as your name, email address, business details and a description of your work)
              to reply to you and discuss a possible project. We do not sell personal data.
            </p>
            <h2 className="t-h3 pt-4 text-ink">Questions or requests</h2>
            <p>
              To ask what we hold about you, or to have it corrected or deleted, email{" "}
              <a className="text-link text-ink" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
