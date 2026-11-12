// Facts used across the site. Only details already published on the previous
// quavok.com site are listed here. Anything unconfirmed is a visible
// [PLACEHOLDER: …] so it is easy to find and replace.

export const SITE = {
  name: "Quavok",
  url: "https://quavok.com",
  tagline: "Focus on what actually matters.",
  description:
    "Quavok designs, builds and runs custom AI automation, so your team can focus on customers, craft and growth. We handle the technology. You stay in charge.",
  email: "hello@quavok.com",
  phoneDisplay: "+91 90413 15226",
  phoneHref: "tel:+919041315226",
  whatsappHref: "https://wa.me/919041315226",
  address: "Dasuya, Hoshiarpur district, Punjab 144205, India",
} as const;

export const NAV = [
  { href: "/services/", label: "Services" },
  { href: "/solutions/", label: "Solutions" },
  { href: "/how-it-works/", label: "How it works" },
  { href: "/rocket/", label: "Rocket" },
  { href: "/about/", label: "About" },
] as const;

export const CTA = {
  discuss: { href: "/contact/", label: "Discuss your workflow" },
  book: { href: "/contact/?topic=discovery#form", label: "Book a discovery call" },
  automate: { href: "/#automate", label: "See what we automate" },
} as const;
