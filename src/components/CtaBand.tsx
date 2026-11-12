import { CTA, SITE } from "@/lib/site";
import { ArrowIcon } from "./Icon";

export function CtaBand({
  title = "Your team has better things to do.",
  body = "Bring one task your team keeps repeating. We’ll talk through how it works, what we could automate, and where you want a human in charge.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="section closing-room editorial-closing" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="closing-inner relative px-6 py-16 sm:px-12 sm:py-24" data-rv data-site-section>
          <div className="relative">
            <h2 id="cta-title" className="t-h2">
              {title}
            </h2>
            <p className="mt-6 max-w-[54ch] text-[1.12rem] leading-relaxed">{body}</p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a className="btn btn-primary" href={CTA.book.href}>
                {CTA.book.label}
                <ArrowIcon />
              </a>
              <a className="btn btn-ghost" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
