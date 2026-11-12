"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CTA, NAV } from "@/lib/site";
import { ArrowIcon } from "./Icon";

// Plain <a> links on purpose: each page is its own static document, which
// keeps the homepage intro boot honest and lets cross-document view
// transitions handle the page change.
export function SiteHeader() {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isCurrent = (href: string) => (href === "/" ? path === "/" : path.startsWith(href.replace(/\/$/, "")));

  return (
    <header className="site-header" data-scrolled={scrolled || open}>
      <div className="wrap bar">
        <a href="/" className="logo" data-site-piece aria-label="Quavok home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/brand/logo-lockup.png" alt="Quavok" width={133} height={28} />
        </a>
        <nav className="nav-links" data-site-piece aria-label="Main">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} aria-current={isCurrent(n.href) ? "page" : undefined}>
              {n.label}
            </a>
          ))}
        </nav>
        <a className="btn btn-primary btn-sm nav-cta" data-site-piece data-site-essential href={CTA.discuss.href}>
          {CTA.discuss.label}
          <ArrowIcon />
        </a>
        <button
          ref={btnRef}
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
      </div>
      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile">
          <a className="m-link" href="/" aria-current={path === "/" ? "page" : undefined}>
            Home
          </a>
          {NAV.map((n) => (
            <a key={n.href} className="m-link" href={n.href} aria-current={isCurrent(n.href) ? "page" : undefined}>
              {n.label}
            </a>
          ))}
          <a className="m-link" href="/contact/" aria-current={isCurrent("/contact/") ? "page" : undefined}>
            Contact
          </a>
        </nav>
        <a className="btn btn-primary" style={{ width: "100%", marginTop: 20 }} href={CTA.discuss.href}>
          {CTA.discuss.label}
          <ArrowIcon />
        </a>
      </div>
    </header>
  );
}
