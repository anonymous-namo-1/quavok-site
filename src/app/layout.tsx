import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./studio.css";
import "./editorial-detail.css";
import "./hero-detail.css";
import "./rocket-companion.css";
import "./home-pass.css";
import "./palette.css";
import "./assembly.css";
import "./experience.css";
import "./ui-polish.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Companion } from "@/components/Companion";
import { MotionRuntime } from "@/components/MotionRuntime";
import { INTRO_BOOT } from "@/lib/intro/boot";
import { SITE } from "@/lib/site";
import { OG_IMAGE } from "@/lib/meta";

const manrope = localFont({
  src: [{ path: "../fonts/manrope-latin.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
});

const sora = localFont({
  src: [{ path: "../fonts/sora-latin.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Quavok · Custom AI automation, built and run for you", template: "%s · Quavok" },
  description: SITE.description,
  applicationName: "Quavok",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
  openGraph: { type: "website", siteName: "Quavok", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

export const viewport: Viewport = {
  themeColor: "#101010",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Quavok",
  url: SITE.url,
  email: SITE.email,
  telephone: "+91-90413-15226",
  description: SITE.description,
  slogan: SITE.tagline,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dasuya",
    addressRegion: "Punjab",
    postalCode: "144205",
    addressCountry: "IN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The homepage boot script may add html.qa-pre before hydration.
    <html lang="en" className={`${manrope.variable} ${sora.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MotionRuntime />
        <Companion />
      </body>
    </html>
  );
}
