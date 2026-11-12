"use client";

export function RocketEncounter() {
  return <div className="rocket-encounter">
    <div className="rocket-perch-stage"><span className="rocket-orbit" aria-hidden="true" /><span id="rocket-perch" aria-hidden="true" /></div>
    <div className="rocket-encounter-actions">
      <button className="btn btn-primary" type="button" onClick={() => window.dispatchEvent(new Event("quavok:open-rocket"))}>Say hello to Rocket</button>
    </div>
  </div>;
}
