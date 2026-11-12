import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-hero editorial-hero" aria-labelledby="page-title" data-page={eyebrow}>
      <div className="wrap editorial-hero-layout">
        <h1 id="page-title" className="t-page">{title}</h1>
        <div className="editorial-hero-copy">
          {lead ? <p className="t-lead">{lead}</p> : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
