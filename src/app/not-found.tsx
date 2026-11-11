import type { Metadata } from "next";
import { CTA } from "@/lib/site";
import { ArrowIcon } from "@/components/Icon";

export const metadata: Metadata = { title: { absolute: "Page not found · Quavok" }, robots: { index: false } };

export default function NotFound() {
  return (
    <section className="page-hero" aria-labelledby="nf-title">
      <div className="wrap">
        <p className="eyebrow">404</p>
        <h1 id="nf-title" className="t-page mt-6 max-w-[14ch]">
          This page isn&apos;t part of the workflow.
        </h1>
        <p className="t-lead mt-6 max-w-[52ch]">
          It may have moved when we rebuilt the site. Older pages for the previous WhatsApp assistant offer are no longer published.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a className="btn btn-primary" href="/">
            Back to home
            <ArrowIcon />
          </a>
          <a className="btn btn-ghost" href={CTA.discuss.href}>
            {CTA.discuss.label}
          </a>
        </div>
      </div>
    </section>
  );
}
