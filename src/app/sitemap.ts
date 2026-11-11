import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const PATHS = ["/", "/services/", "/solutions/", "/how-it-works/", "/rocket/", "/about/", "/contact/", "/privacy/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-12");
  return PATHS.map((p) => ({
    url: `https://quavok.com${p}`,
    lastModified,
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : 0.7,
  }));
}
