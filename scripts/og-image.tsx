import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Source for scripts/generate-og.mjs. Writes public/og.png at build time.
const size = { width: 1200, height: 630 };

export function GET() {
  const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/assets/brand/logo-lockup-white.png")).toString("base64")}`;
  const steps = ["New enquiry", "Qualify", "CRM record", "Follow-up", "Evening summary"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#2b2930",
          color: "#e8dcc4",
          padding: "72px 80px",
          fontFamily: "Manrope",
        }}
      >
        <div style={{ display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={228} height={48} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontFamily: "Sora", fontSize: 68, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02, maxWidth: 980 }}>
            Focus on what actually matters.
          </div>
          <div style={{ fontSize: 30, color: "#e8dcc4" }}>Hand us the busywork. We design, deploy and run the automation.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: 14,
                  background: i === 3 ? "#1d1b22" : "#1f1d24",
                  color: i === 3 ? "#8b5cf6" : "#e8dcc4",
                  border: "2px solid #e8dcc4",
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                {s}
              </div>
              {i < steps.length - 1 ? <div style={{ width: 28, height: 2, background: "#2b2930", display: "flex" }} /> : null}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [
      {name: "Sora", data: readFileSync(join(process.cwd(), "src/fonts/sora-og.ttf")), weight: 700, style: "normal"},
      {name: "Manrope", data: readFileSync(join(process.cwd(), "src/fonts/manrope-og.ttf")), weight: 400, style: "normal"},
    ] },
  );
}
