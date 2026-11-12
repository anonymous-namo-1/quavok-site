import { Icon } from "../Icon";

export function WorkWindows() {
  return <div className="work-windows">
    <figure className="work-scene" data-rv>
      <div className="work-photo"><img src="/media/focus-on-craft.webp" alt="Hands shaping a ceramic bowl at a workbench" width={1280} height={853} loading="lazy" />
        <div className="work-window"><div className="window-chrome" aria-hidden="true"><i /><i /><i /></div><div className="work-window-row"><Icon name="check" /><span>New enquiry</span><strong>In your CRM</strong></div><div className="work-window-row"><Icon name="check" /><span>Follow-up</span><strong>Prepared</strong></div></div>
      </div><figcaption>Follow-ups, handled.</figcaption>
    </figure>
    <figure className="work-scene" data-rv>
      <div className="work-photo"><img src="/media/human-decisions.webp" alt="Two people reviewing a material sample and plan together" width={1280} height={853} loading="lazy" />
        <div className="work-window"><div className="window-chrome" aria-hidden="true"><i /><i /><i /></div><div className="work-window-row"><Icon name="check" /><span>Follow-up wording</span><strong>You approve</strong></div><div className="work-window-row"><Icon name="forward" /><span>Anything unusual</span><strong>To your team</strong></div></div>
      </div><figcaption className="work-caption"><span>Decisions, yours.</span><span className="rocket-stop" data-rocket-perch aria-hidden="true" /></figcaption>
    </figure>
  </div>;
}
