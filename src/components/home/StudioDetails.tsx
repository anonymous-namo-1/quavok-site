"use client";

import { Icon } from "../Icon";

export function StudioDetails() {
  return (
    <div className="studio-controls wrap">
      <p className="studio-service">Custom built. Human approved. <strong>Quavok managed.</strong></p>
      <div className="studio-rocket-entry">
        <button className="rocket-command" type="button" onClick={() => window.dispatchEvent(new Event("quavok:open-rocket"))}>
          <Icon name="spark" width={18} height={18} />
          <span>Ask Rocket <span className="rocket-command-trial">(trial)</span></span>
          <kbd>⌘K</kbd>
        </button>
        <span className="studio-trial-note">A scripted preview. Come say hello.</span>
      </div>
    </div>
  );
}
