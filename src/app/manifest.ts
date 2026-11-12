import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quavok",
    short_name: "Quavok",
    description: "Custom AI automation, built and run for you.",
    start_url: "/",
    display: "browser",
    background_color: "#13251a",
    theme_color: "#1f3d2b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
