import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-hero" aria-labelledby="page-title">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="page-title" className="t-page mt-6 max-w-[16ch]">
          {title}
        </h1>
        {lead ? <p className="t-lead mt-7 max-w-[60ch]">{lead}</p> : null}
        {children ? <div className="mt-9">{children}</div> : null}
      </div>
    </section>
  );
}
