"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/site/Brand";
import { useAuth } from "@/lib/firebase/auth";
import { Button, LinkButton } from "@/components/ui/Button";

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
  const { user, profile, loading, signOut } = useAuth();
  const role = profile?.role ?? "participant";
  const portalHref =
    role === "admin"
      ? "/portal/admin"
      : role === "advisor"
      ? "/portal/advisor"
      : "/portal/participant";
  const name =
    profile?.fullName ??
    user?.displayName ??
    user?.email?.split("@")[0] ??
    "there";

  async function handleSignOut() {
    try {
      await signOut();
      setOpen(false);
    } catch {
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5 lg:px-8">
        <Brand markOnly size="sm" className="shrink-0" />

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
          {loading ? (
            <Button variant="secondary" size="sm" disabled>
              Loading...
            </Button>
          ) : user ? (
            <>
              <LinkButton href={portalHref} variant="ghost" size="sm">
                Hi, {name.split(" ")[0]}
              </LinkButton>
              <Button variant="secondary" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <LinkButton href="/portal" variant="ghost" size="sm">
                Sign in
              </LinkButton>
              <LinkButton href="/apply" variant="primary" size="sm">
                Apply Now
              </LinkButton>
            </>
          )}
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
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-5 flex flex-col gap-1">
            <div className="px-3 pb-2 text-[11px] font-medium text-ink-subtle">
              Serving Bergen, Passaic, and Hudson Counties
            </div>
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
              {loading ? (
                <Button variant="secondary" size="sm" disabled>
                  Loading...
                </Button>
              ) : user ? (
                <>
                  <LinkButton
                    href={portalHref}
                    variant="secondary"
                    size="sm"
                  >
                    Open portal
                  </LinkButton>
                  <Button variant="primary" size="sm" onClick={handleSignOut}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <LinkButton href="/portal" variant="secondary" size="sm">
                    Sign in
                  </LinkButton>
                  <LinkButton href="/apply" variant="primary" size="sm">
                    Apply Now
                  </LinkButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
