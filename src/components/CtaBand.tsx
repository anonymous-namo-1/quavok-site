import { CTA, SITE } from "@/lib/site";
import { ArrowIcon } from "./Icon";

export function CtaBand({
  title = "Your next hire might be an automation.",
  body = "Show us the repetitive work slowing your business down. We'll help you explore how custom AI agents and workflows could handle it.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="section pt-0" aria-labelledby="cta-title">
      <div className="wrap">
        <div className="panel-dark on-dark grain relative overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-24" data-rv>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(50% 60% at 50% 0%, rgb(198 239 98 / 0.16), transparent 70%)" }}
          />
          <div className="relative">
            <h2 id="cta-title" className="t-h2 mx-auto max-w-[18ch] text-white">
              {title}
            </h2>
            <p className="mx-auto mt-6 max-w-[54ch] text-[1.12rem] leading-relaxed text-stage-text">{body}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a className="btn btn-lime" href={CTA.book.href}>
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
