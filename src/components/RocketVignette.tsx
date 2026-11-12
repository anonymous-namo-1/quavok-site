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
    a: "Just one. A supplier invoice is above the limit you set, so it’s waiting for your OK. Everything else went as planned.",
    focus: "invoices",
  },
  {
    q: "Summarise yesterday’s enquiries.",
    a: "Every enquiry got a reply, and the follow-ups went out on time. One was unusual, so a person on your team picked it up.",
    focus: "leads",
  },
  {
    q: "Can we also automate our quote reminders?",
    a: "I can’t build automations myself, but I’ve passed your request to the Quavok team with what you told me. They’ll get in touch to understand it and scope it with you.",
    focus: "leads",
    forwarded: true,
  },
];

function RocketAvatar() {
  return (
    <span className="rk-avatar" aria-hidden="true">
      <Icon name="rocket" strokeWidth={2} />
    </span>
  );
}

export function RocketVignette({ layered = false }: { layered?: boolean }) {
  const [q, setQ] = useState(0);
  const [asked, setAsked] = useState(false);
  const ex = ASK[q];
  const focus: AutoId = ex.focus;

  return (
    <div className={`panel-dark on-dark rocket ${layered ? "rocket-layered" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="font-display text-[20px] font-semibold tracking-tight text-white">Rocket</span>
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
        </aside>

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
      </div>
      {layered && asked && ex.forwarded && <div className="rk-team" aria-hidden="true"><Icon name="forward" /><span><b>Quavok team</b><br />New request: quote reminders</span></div>}

    </div>
  );
}
