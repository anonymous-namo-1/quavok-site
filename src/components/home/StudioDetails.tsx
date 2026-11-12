"use client";

import { Icon } from "../Icon";

export function StudioDetails() {
  return (
    <div className="studio-controls wrap">
      <div className="studio-rocket-entry">
        <button className="rocket-command" type="button" onClick={() => window.dispatchEvent(new Event("quavok:open-rocket"))}>
          <Icon name="spark" width={18} height={18} />
          <span>Ask Rocket</span>
          <kbd>⌘K</kbd>
        </button>
      </div>
    </div>
  );
}
