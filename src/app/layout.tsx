import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./studio.css";
import "./editorial-detail.css";
import "./hero-detail.css";
import "./rocket-trial.css";
import "./palette.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Companion } from "@/components/Companion";
import { MotionRuntime } from "@/components/MotionRuntime";
import { SITE } from "@/lib/site";
import { OG_IMAGE } from "@/lib/meta";

const inter = localFont({
  src: [{ path: "../fonts/inter-latin.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
});

const bricolage = localFont({
  src: [{ path: "../fonts/bricolage-latin.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-bricolage",
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
  themeColor: "#1f3d2b",
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
    <html lang="en" className={`${inter.variable} ${bricolage.variable}`} suppressHydrationWarning>
      <head>
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
