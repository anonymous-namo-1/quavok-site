"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";
import { Icon } from "./Icon";

// TODO: wire form destination.
// There is no form backend yet. Until one exists (for example a form service
// endpoint), this form must not claim to have sent anything. Set
// FORM_ENDPOINT to a real URL that accepts a JSON POST, then update the copy
// in the success state. While it is null, submitting opens the visitor's email
// app with the message filled in (mailto fallback to hello@quavok.com).
const FORM_ENDPOINT: string | null = null;

const TOPICS = [
  { id: "workflow", label: "Discuss a workflow" },
  { id: "discovery", label: "Book a discovery call" },
  { id: "rocket", label: "Ask about Rocket" },
  { id: "other", label: "Something else" },
] as const;

type TopicId = (typeof TOPICS)[number]["id"];
type Errors = Partial<Record<"name" | "email" | "work", string>>;

export function ContactForm() {
  const [topic, setTopic] = useState<TopicId>("workflow");
  const [errors, setErrors] = useState<Errors>({});
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("topic");
    if (t && TOPICS.some((x) => x.id === t)) setTopic(t as TopicId);
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) || "").trim();
    const errs: Errors = {};
    if (!v("name")) errs.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) errs.email = "Please enter an email address we can reply to.";
    if (v("work").length < 10) errs.work = "A sentence or two about the work helps us prepare.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }

    const topicLabel = TOPICS.find((t) => t.id === topic)?.label || "Enquiry";
    const subject = `${topicLabel}: ${v("company") || v("name")}`;
    const body = [
      `Name: ${v("name")}`,
      `Email: ${v("email")}`,
      v("company") ? `Company: ${v("company")}` : "",
      `Topic: ${topicLabel}`,
      "",
      "What we'd like automated:",
      v("work"),
      "",
      v("today") ? `How it's handled today:\n${v("today")}\n` : "",
      v("tools") ? `Tools we use: ${v("tools")}` : "",
    ]
      .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
      .join("\n")
      .trim();

    if (FORM_ENDPOINT) {
      // Intentionally unused until a destination exists. See TODO above.
      return;
    }

    setDraft({ subject, body });
    setCopied(false);
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => statusRef.current?.focus(), 50);
  };

  const errProps = (k: keyof Errors) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-err` } : {};

  return (
    <form id="form" noValidate onSubmit={onSubmit} className="grid gap-6" aria-describedby="form-note">
      <fieldset>
        <legend className="mb-3 text-[14px] font-semibold text-ink-2">What would you like to do?</legend>
        <div className="radio-cards">
          {TOPICS.map((t) => (
            <label key={t.id}>
              <input type="radio" name="topic" value={t.id} checked={topic === t.id} onChange={() => setTopic(t.id)} />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" autoComplete="name" required {...errProps("name")} />
          {errors.name ? (
            <p id="name-err" className="err">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="email">Work email</label>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required {...errProps("email")} />
          {errors.email ? (
            <p id="email-err" className="err">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="field">
        <label htmlFor="company">
          Company <span className="hint">(optional)</span>
        </label>
        <input id="company" name="company" autoComplete="organization" />
      </div>

      <div className="field">
        <label htmlFor="work">What would you like automated?</label>
        <textarea
          id="work"
          name="work"
          required
          placeholder="For example: we copy every website enquiry into a spreadsheet, check if it fits, then someone follows up by email a few days later."
          {...errProps("work")}
        />
        {errors.work ? (
          <p id="work-err" className="err">
            {errors.work}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="today">
            How is it handled today? <span className="hint">(optional)</span>
          </label>
          <input id="today" name="today" placeholder="Who does it, how often" />
        </div>
        <div className="field">
          <label htmlFor="tools">
            Tools involved <span className="hint">(optional)</span>
          </label>
          <input id="tools" name="tools" placeholder="Email, a CRM, spreadsheets…" />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary">
          <Icon name="mail" width={16} height={16} />
          Open in your email app
        </button>
        <p id="form-note" className="text-[13.5px] leading-snug text-mute">
          This form doesn’t send anything from the website yet. It opens your email app with your message ready to send to {SITE.email}.
        </p>
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {draft ? (
          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="font-semibold">Your email app should have opened with this message.</p>
            <p className="mt-1 text-[14.5px] text-mute">
              If it didn’t, copy the text below and email it to{" "}
              <a className="text-link text-ink" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              . Nothing has been sent yet.
            </p>
            <textarea aria-label="Your email draft" readOnly className="mt-4 h-44 w-full rounded-xl border border-line-2 bg-card p-3 font-mono text-[13px]" value={`Subject: ${draft.subject}\n\n${draft.body}`} />
            <button
              type="button"
              className="btn btn-ghost btn-sm mt-3"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? "Copied" : "Copy message"}
            </button>
          </div>
        ) : null}
      </div>
    </form>
  );
}
