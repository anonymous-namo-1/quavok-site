import type { NextConfig } from "next";

// Static export so the site can be hosted from plain files (GitHub Pages),
// with directory-style URLs: /services/ -> out/services/index.html.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // The homepage intro runs once per tab from an effect; strict-mode double
  // effects would start and immediately cancel it in development.
  reactStrictMode: false,
  poweredByHeader: false,
};

export default nextConfig;
