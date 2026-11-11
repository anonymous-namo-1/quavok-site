import type { Metadata } from "next";
import { SITE } from "./site";

export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Quavok: custom AI agents and workflows, built and run for you.",
};

export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = path === "/" ? title : `${title} · Quavok`;
  return {
    title: { absolute: full },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      url: path,
      title: full,
      description,
      locale: "en_IN",
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: full, description, images: [OG_IMAGE.url] },
  };
}
