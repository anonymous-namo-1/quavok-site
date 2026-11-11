import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Served as /og.png in the static export (a real .png file, so static hosts
// send the right content type). Generated at build time; nothing is fetched.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

export function GET() {
  const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/assets/brand/logo-lockup.png")).toString("base64")}`;
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
          background: "#f7f7f3",
          color: "#101311",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={228} height={48} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02, maxWidth: 980 }}>
            Automate the work you’d otherwise hire for.
          </div>
          <div style={{ fontSize: 30, color: "#596059" }}>Custom AI agents and workflows. We build them. We run them.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: 14,
                  background: i === 3 ? "#101311" : "#ffffff",
                  color: i === 3 ? "#c6ef62" : "#101311",
                  border: "2px solid #cfd1c7",
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                {s}
              </div>
              {i < steps.length - 1 ? <div style={{ width: 28, height: 2, background: "#101311", display: "flex" }} /> : null}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
