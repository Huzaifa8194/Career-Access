"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/icons";
import { LinkButton } from "@/components/ui/Button";

const nav = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/services", label: "Services" },
  { href: "/partners", label: "For partners" },
  { href: "/get-started", label: "Get started" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={28} />
          <span className="font-semibold text-[15px] tracking-tight">
            Career Access
          </span>
          <span
            aria-hidden
            className="hidden sm:inline-flex h-5 items-center rounded border border-line px-1.5 text-[10px] font-medium uppercase tracking-wider text-ink-subtle"
          >
            MA Pilot
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-[14px]">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "px-3 py-2 rounded-md transition-colors",
                  active
                    ? "text-primary bg-primary-50"
                    : "text-ink-muted hover:text-ink hover:bg-canvas",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LinkButton href="/portal" variant="ghost" size="sm">
            Sign in
          </LinkButton>
          <LinkButton href="/apply" variant="primary" size="sm">
            Apply now
          </LinkButton>
        </div>

        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink"
          onClick={() => setOpen((o) => !o)}
          aria-label="Open navigation"
          aria-expanded={open}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <path d="M6 6 18 18" />
                <path d="m18 6-12 12" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-white">
          <div className="mx-auto max-w-6xl px-5 py-3 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-[14px] text-ink hover:bg-canvas"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 pt-2 border-t border-line">
              <LinkButton href="/portal" variant="secondary" size="sm">
                Sign in
              </LinkButton>
              <LinkButton href="/apply" variant="primary" size="sm">
                Apply now
              </LinkButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
