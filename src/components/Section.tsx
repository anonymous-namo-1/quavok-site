import type { ReactNode } from "react";

export function SectionHead({
  eyebrow,
  title,
  lead,
  center,
  id,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`} data-rv>
      {eyebrow ? <p className={`eyebrow ${center ? "eyebrow--plain" : ""}`}>{eyebrow}</p> : null}
      <h2 id={id} className={`t-h2 ${eyebrow ? "mt-5" : ""}`}>
        {title}
      </h2>
      {lead ? <p className={`t-lead mt-5 ${center ? "mx-auto" : ""} max-w-[60ch]`}>{lead}</p> : null}
    </div>
  );
}
