import { RunTrace } from "./RunTrace";
import { Icon } from "./Icon";

// Four beats of the managed service, as ordinary scroll. On desktop each
// beat's text stays beside its scene; on mobile they stack.
export function HowWeWork() {
  return (
    <div className="steps">
      <Beat
        n={1}
        title="We understand how the work happens today"
        body="We start with a discovery call and map one process with you: where requests come in, who touches them, which tools they pass through and where they stall. We mark what is repetitive and what genuinely needs your people."
        you="Explain the process and share examples."
        us="Map it, and propose what to automate first."
        scene={<UnderstandScene />}
      />
      <Beat
        n={2}
        title="We build it around your process"
        body="We design and build the agents, workflows and integrations, then test them against real examples from your business. You see exactly what it will do, where it asks for approval and where it hands over to a person, before it goes live."
        you="Review and approve the scope."
        us="Design, build, connect and test."
        scene={<ScopeScene />}
      />
      <Beat
        n={3}
        title="We run it for you"
        body="Once you approve, we deploy it and operate it. It runs the agreed work, holds anything that needs your OK, and routes exceptions to your team. We monitor it and fix problems; you get a clear summary of what happened."
        you="Approve the items that need you."
        us="Deploy, operate and monitor."
        scene={<RunTrace />}
      />
      <Beat
        n={4}
        title="We keep improving it"
        body="Processes change. Tell us what's different or what else you'd like automated, and we update, extend or add automations. Each customer's automations are intended to run in their own dedicated, managed cloud environment, which we look after."
        you="Tell us what's changed or what's next."
        us="Maintain, update and extend."
        scene={<EnvScene />}
      />
    </div>
  );
}

function Beat({
  n,
  title,
  body,
  you,
  us,
  scene,
}: {
  n: number;
  title: string;
  body: string;
  you: string;
  us: string;
  scene: React.ReactNode;
}) {
  return (
    <div className="step-row">
      <div className="step-text" data-rv>
        <p className="step-num">
          <b>{String(n).padStart(2, "0")}</b>
          Step {n} of 4
        </p>
        <h3 className="t-h3 mt-5 max-w-[22ch]" style={{ fontSize: "clamp(1.5rem, 1.2rem + 1vw, 2rem)" }}>
          {title}
        </h3>
        <p className="t-body mt-4 max-w-[52ch]">{body}</p>
        <dl className="duty">
          <dt>You</dt>
          <dd>{you}</dd>
          <dt>Quavok</dt>
          <dd>{us}</dd>
        </dl>
      </div>
      <div data-rv>{scene}</div>
    </div>
  );
}

function UnderstandScene() {
  const rows: [string, boolean][] = [
    ["Enquiry arrives by email or the website form", true],
    ["Someone copies the details into a spreadsheet", true],
    ["They check whether it fits what you offer", true],
    ["A good fit gets a call from the owner", false],
    ["Contact added to the CRM, later", true],
    ["Reminder to follow up, if anyone remembers", true],
  ];
  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-mono text-[11.5px] tracking-[0.08em] text-mute uppercase">Process notes · today</p>
        <span className="tag">Discovery</span>
      </div>
      <ul className="note-list">
        {rows.map(([t, rep]) => (
          <li key={t}>
            <span className={`mark ${rep ? "" : "mark--keep"}`}>{rep ? "Repetitive" : "Keep"}</span>
            <span className={rep ? "" : "font-semibold"}>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScopeScene() {
  const rows: [string, string][] = [
    ["Starts when", "A new enquiry arrives by email or website form"],
    ["Runs automatically", "Qualify, record in CRM, follow up, evening summary"],
    ["Needs your approval", "Follow-up wording, before anything is sent"],
    ["Goes to a person", "Anything unclear, sensitive or outside the rules"],
    ["Connected tools", "Your inbox, website form and CRM"],
  ];
  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-mono text-[11.5px] tracking-[0.08em] text-mute uppercase">Scope · Lead follow-up · v1</p>
        <span className="tag">Built &amp; tested by Quavok</span>
      </div>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k} className="scope-row">
            <dt>{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="stamp">
          <Icon name="check" strokeWidth={2.4} />
          Scope approved by you
        </span>
      </div>
    </div>
  );
}

function EnvScene() {
  return (
    <div className="card p-5 sm:p-7">
      <div className="env">
        <span className="env-label">Your managed environment</span>
        <div className="grid gap-2.5">
          <div className="env-chip">
            Lead follow-up <span className="who who--auto">Running</span>
          </div>
          <div className="env-chip">
            Invoice intake <span className="who who--auto">Running</span>
          </div>
          <div className="env-chip env-chip--new">
            <span className="inline-flex items-center gap-2">
              <Icon name="forward" width={16} height={16} /> Quote reminders
            </span>
            <span className="text-[12.5px] font-medium text-mute">Requested · being scoped</span>
          </div>
        </div>
      </div>

    </div>
  );
}
