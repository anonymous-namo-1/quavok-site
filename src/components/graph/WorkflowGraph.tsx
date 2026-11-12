import type { CSSProperties } from "react";
import { NARROW, WIDE, WHO_LABEL, type Box, type Scenario } from "@/lib/workflows";
import { Icon } from "../Icon";

type Sel = { kind: "step"; i: number } | { kind: "gate" } | { kind: "exc" } | null;

type Props = {
  scenario: Scenario;
  className?: string;
  /** Mark pieces the homepage intro builds (held invisible until it runs). */
  introHold?: boolean;
  /** Read-only inspection: nodes become buttons that explain the step. */
  selected?: Sel;
  onSelect?: (s: Sel) => void;
  hot?: number | null;
  gateState?: "waiting" | "approved";
  excHot?: boolean;
};

function vars(w: Box, n: Box): CSSProperties {
  return {
    ["--x" as string]: w.x,
    ["--y" as string]: w.y,
    ["--w" as string]: w.w,
    ["--h" as string]: w.h,
    ["--nx" as string]: n.x,
    ["--ny" as string]: n.y,
    ["--nw" as string]: n.w,
    ["--nh" as string]: n.h,
  } as CSSProperties;
}

function Edges({ layout, cls, hold }: { layout: typeof WIDE; cls: string; hold?: boolean }) {
  const h = hold ? { "data-intro-hold": "" } : {};
  return (
    <svg className={cls} viewBox={`0 0 ${layout.vw} ${layout.vh}`} aria-hidden="true" focusable="false">
      <path className="edge-exc" d={layout.exceptionEdge} data-edge="exc" {...h} />
      {layout.edges.map((d, i) => (
        <path
          key={i}
          className="edge"
          d={d}
          pathLength={1}
          data-edge={i}
          style={{ ["--i" as string]: i } as CSSProperties}
          {...h}
        />
      ))}
      <circle className="packet" r={5} cx={0} cy={0} />
    </svg>
  );
}

export type GraphSelection = Sel;

export function WorkflowGraph({ scenario, className = "", introHold, selected, onSelect, hot, gateState, excHot }: Props) {
  const interactive = typeof onSelect === "function";
  const h = introHold ? { "data-intro-hold": "" } : {};

  return (
    <div className="graph-wrap">
      <div className={`graph ${className}`}>
        <Edges layout={WIDE} cls="svg-wide" hold={introHold} />
        <Edges layout={NARROW} cls="svg-narrow" hold={introHold} />

        <ol aria-label={`${scenario.title}: steps`}>
          {scenario.steps.map((s, i) => {
            const style = vars(WIDE.nodes[i], NARROW.nodes[i]);
            const inner = (
              <>
                <span className="n-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="n-text">
                  <span className="n-title">{s.title}</span>
                  <span className="n-sub">{s.sub}</span>
                </span>
              </>
            );
            if (interactive) {
              const on = selected?.kind === "step" && selected.i === i;
              return (
                <li key={i} style={style}>
                  <button
                    type="button"
                    className="g-node"
                    data-node={i}
                    aria-pressed={on}
                    data-hot={hot === i ? "true" : undefined}
                    onClick={() => onSelect!(on ? null : { kind: "step", i })}
                  >
                    {inner}
                    <span className="sr-only">. {WHO_LABEL[s.who]}.</span>
                  </button>
                </li>
              );
            }
            return (
              <li key={i} className="g-node" style={style} data-node={i} data-hot={hot === i ? "true" : undefined} {...h}>
                {inner}
                {i === 3 ? <span className="sr-only">. Only sent in wording you approve.</span> : null}
                {i === 1 ? <span className="sr-only">. Anything unclear goes to a person.</span> : null}
              </li>
            );
          })}
        </ol>

        {interactive ? (
          <>
            <button
              type="button"
              className="g-gate"
              style={vars(WIDE.gate, NARROW.gate)}
              aria-pressed={selected?.kind === "gate"}
              onClick={() => onSelect!(selected?.kind === "gate" ? null : { kind: "gate" })}
            >
              <Icon name="check" strokeWidth={2.4} />
              {scenario.gate.label}
            </button>
            <button
              type="button"
              className="g-exc"
              style={vars(WIDE.exception, NARROW.exception)}
              aria-pressed={selected?.kind === "exc"}
              onClick={() => onSelect!(selected?.kind === "exc" ? null : { kind: "exc" })}
            >
              <Icon name="person" strokeWidth={2} width={14} height={14} />
              <span className="exc-wide">{scenario.exception.label}</span>
              <span className="exc-narrow">To a person</span>
            </button>
          </>
        ) : (
          <>
            <div className="g-gate" style={vars(WIDE.gate, NARROW.gate)} data-state={gateState} data-gate aria-hidden="true" {...h}>
              <Icon name="check" strokeWidth={2.4} />
              {scenario.gate.label}
            </div>
            <div className="g-exc" style={vars(WIDE.exception, NARROW.exception)} data-hot={excHot || undefined} data-exc aria-hidden="true" {...h}>
              <Icon name="person" strokeWidth={2} width={14} height={14} />
              <span className="exc-wide">{scenario.exception.label}</span>
              <span className="exc-narrow">To a person</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
