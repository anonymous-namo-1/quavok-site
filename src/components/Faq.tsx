import type { Faq } from "@/lib/faqs";

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="faq border-t border-line">
      {items.map((f) => (
        <details key={f.q}>
          <summary>
            {f.q}
            <span className="pm" aria-hidden="true" />
          </summary>
          <div className="answer">
            {f.a.map((p, i) => (
              <p key={i}>{renderPlaceholders(p)}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.join(" ").replace(/\s*\[PLACEHOLDER:[^\]]*\]\.?/g, "") },
    })),
  };
}

// Turns "[PLACEHOLDER: …]" inside copy into a visible, findable marker.
export function renderPlaceholders(text: string) {
  const parts = text.split(/(\[PLACEHOLDER:[^\]]*\])/g);
  return parts.map((p, i) =>
    p.startsWith("[PLACEHOLDER:") ? (
      <span key={i} className="placeholder">
        {p}
      </span>
    ) : (
      p
    ),
  );
}
