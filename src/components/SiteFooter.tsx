import { CTA, NAV, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer data-site-section className="site-footer editorial-footer">
      <div className="wrap">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <a href="/" className="logo" aria-label="Quavok home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/brand/logo-lockup.png" alt="Quavok" width={133} height={28} />
            </a>
            <p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed">{SITE.tagline}</p>
            <p className="mt-5">
              <a className="btn btn-primary btn-sm" href={CTA.discuss.href}>
                {CTA.discuss.label}
              </a>
            </p>
          </div>
          <div>
            <h2>What we do</h2>
            <ul>
              {NAV.filter((n) => n.href !== "/about/").map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Company</h2>
            <ul>
              <li>
                <a href="/about/">About</a>
              </li>
              <li>
                <a href="/contact/">Contact</a>
              </li>
              <li>
                <a href="/privacy/">Privacy</a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Talk to us</h2>
            <ul>
              <li>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li>
                <a href={SITE.phoneHref}>{SITE.phoneDisplay}</a>
              </li>
              <li>{SITE.address}</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[13.5px] text-faint md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Quavok. Custom AI automation, built and run for you.</p>
          <p>Rocket desktop and mobile apps, and its paid proactive add-on, are in development.</p>
        </div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        {Array.from("QUAVOK").map((letter, index) => <span key={index}>{letter}</span>)}
      </div>
    </footer>
  );
}
