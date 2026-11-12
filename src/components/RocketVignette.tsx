"use client";

import { useState, type CSSProperties } from "react";
import { Icon } from "./Icon";

// Illustrative example of Rocket: a conversation over automations Quavok already
// runs. Authored exchanges only: no free-text input, nothing is sent, no AI
// call. Rocket never builds automations; it forwards requests to the team.

type AutoId = "leads" | "invoices" | "support";
const AUTOS: { id: AutoId; name: string; status: string; wait?: boolean }[] = [
  { id: "leads", name: "Lead follow-up", status: "Running" },
  { id: "invoices", name: "Invoice intake", status: "1 waiting on you", wait: true },
  { id: "support", name: "Support replies", status: "Running" },
];

type Exchange = {
  q: string;
  a: string;
  focus: AutoId;
  forwarded?: boolean;
};

const ASK: Exchange[] = [
  {
    q: "What needs my approval today?",
    a: "One item. An invoice in Invoice intake is above the limit you set, so it is waiting for your OK before it is recorded. Everything else ran as agreed.",
    focus: "invoices",
  },
  {
    q: "Summarise yesterday’s enquiries.",
    a: "Yesterday’s enquiries were logged to your CRM and followed up in the wording you approved. One didn’t match your criteria, so it went to your team instead.",
    focus: "leads",
  },
  {
    q: "Can we also automate our quote reminders?",
    a: "I can’t build automations myself, but I’ve passed your request to the Quavok team with what you told me. They’ll get in touch to understand it and scope it with you.",
    focus: "leads",
    forwarded: true,
  },
];

const PROACTIVE: { kind: string; text: string; action?: string; done?: string }[] = [
  {
    kind: "Alert",
    text: "Heads up: a supplier invoice arrived without a due date. I’ve routed it to your team rather than guessing.",
  },
  {
    kind: "Report",
    text: "Your weekly report is ready: what each automation handled, and what’s still waiting on you.",
  },
  {
    kind: "Suggestion",
    text: "Your team seems to send the same quote reminder by hand each week. Want me to ask the Quavok team whether it’s worth automating?",
    action: "Ask the team to look at this",
    done: "Forwarded to the Quavok team",
  },
];

function RocketAvatar() {
  return (
    <span className="rk-avatar" aria-hidden="true">
      <Icon name="rocket" strokeWidth={2} />
    </span>
  );
}

export function RocketVignette() {
  const [mode, setMode] = useState<"ask" | "proactive">("ask");
  const [q, setQ] = useState(0);
  const [asked, setAsked] = useState(false);
  const [sent, setSent] = useState(false);
  const ex = ASK[q];
  const focus: AutoId | null = mode === "ask" ? ex.focus : null;

  return (
    <div className="panel-dark on-dark rocket">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="font-display text-[20px] font-semibold tracking-tight text-white">Rocket</span>
          <span className="tag">Illustrative example</span>
        </div>
        <div className="tabs" role="group" aria-label="Rocket mode">
          <button type="button" aria-pressed={mode === "ask"} onClick={() => setMode("ask")}>
            You ask
          </button>
          <button type="button" aria-pressed={mode === "proactive"} onClick={() => setMode("proactive")}>
            Rocket reaches out
          </button>
        </div>
      </div>

      <div className="rk-shell">
        <aside className="rk-side" aria-label="Automations running for you (illustrative)">
          <h3>Running for you</h3>
          <ul className="space-y-1">
            {AUTOS.map((a) => (
              <li key={a.id} className="rk-auto" data-hot={focus === a.id}>
                <span className="font-medium text-white">{a.name}</span>
                <span className={a.wait ? "wait" : "run"}>{a.status}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[12px] leading-relaxed text-stage-mute">Built and run by Quavok. Rocket only reports on them and passes requests to the team.</p>
        </aside>

        {mode === "ask" ? (
          <div className="flex min-w-0 flex-col">
            <div className="rk-thread" aria-live="polite">
              {asked ? (
                <div key={q} className="flex flex-col gap-3.5">
                  <p className="msg msg-you msg-anim" style={{ "--i": 0 } as CSSProperties}>
                    {ex.q}
                  </p>
                  <div className="msg msg-rk msg-anim" style={{ "--i": 1 } as CSSProperties}>
                    <RocketAvatar />
                    <div>
                      <p className="who-line">Rocket</p>
                      <p>{ex.a}</p>
                      {ex.forwarded ? (
                        <p className="forwarded">
                          <Icon name="forward" strokeWidth={2} />
                          Request forwarded to the Quavok team
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="msg msg-rk">
                  <RocketAvatar />
                  <div>
                    <p className="who-line">Rocket</p>
                    <p>Ask me about the automations Quavok runs for you: what ran, what’s waiting on you, or what you’d like changed.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="rk-suggest" role="group" aria-label="Example questions">
              {ASK.map((e, i) => (
                <button
                  key={i}
                  type="button"
                  aria-pressed={asked && q === i}
                  onClick={() => {
                    setQ(i);
                    setAsked(true);
                  }}
                >
                  {e.q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-2 border-b border-stage-line px-5 py-3 text-[13px] text-stage-mute">
              <span className="dev-badge">In development</span>
              <span>Proactive mode is a planned paid add-on. Rocket would message you first.</span>
            </div>
            <div className="rk-thread" aria-live="polite">
              {PROACTIVE.map((m, i) => (
                <div key={m.kind} className="msg msg-rk msg-anim" style={{ "--i": i } as CSSProperties}>
                  <RocketAvatar />
                  <div>
                    <p className="who-line">Rocket · {m.kind}</p>
                    <p>{m.text}</p>
                    {m.action ? (
                      sent ? (
                        <p className="forwarded">
                          <Icon name="forward" strokeWidth={2} />
                          {m.done}
                        </p>
                      ) : (
                        <button type="button" className="btn btn-ghost btn-sm mt-3" onClick={() => setSent(true)}>
                          {m.action}
                        </button>
                      )
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="border-t border-stage-line px-5 py-3 text-[12.5px] text-stage-mute">
        Illustration with fictional data. Nothing here is sent anywhere. Rocket desktop and mobile apps and the proactive add-on are in development.
      </p>
    </div>
  );
}
