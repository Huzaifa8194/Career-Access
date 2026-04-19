"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo, ArrowRight, Compass, Users, ChartBar } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Field, Input, Checkbox } from "@/components/ui/Field";

const demoRoles = [
  {
    id: "participant",
    href: "/portal/participant",
    icon: <Compass size={14} />,
    label: "Participant",
    user: "Jordan Hayes",
  },
  {
    id: "advisor",
    href: "/portal/advisor",
    icon: <Users size={14} />,
    label: "Advisor",
    user: "Maya Robinson",
  },
  {
    id: "admin",
    href: "/portal/admin",
    icon: <ChartBar size={14} />,
    label: "Admin",
    user: "Aisha Bennett",
  },
];

export default function PortalSignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={26} />
            <span className="font-semibold text-[15px] tracking-tight">
              Career Access
            </span>
          </Link>
          <Link
            href="/"
            className="text-[13px] font-medium text-ink-muted hover:text-ink"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-5xl grid gap-8 lg:grid-cols-[1.1fr_1fr] items-stretch">
          {/* Left: sign-in */}
          <div className="bg-white border border-line rounded-lg p-7 sm:p-9 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-ink-subtle">
              <span className="h-1.5 w-1.5 rounded-full bg-action" />
              Participant & staff sign-in
            </div>
            <h1 className="mt-3 text-[28px] sm:text-[32px] font-semibold tracking-tight leading-[1.1]">
              Sign in to Career Access
            </h1>
            <p className="mt-2 text-[14px] text-ink-muted leading-6">
              Use the email you applied with. Staff use their assigned account.
            </p>

            <form
              className="mt-7 grid gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = "/portal/participant";
              }}
            >
              <Field label="Email address" required htmlFor="si-email">
                <Input
                  id="si-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Field>
              <Field
                label="Password"
                required
                htmlFor="si-pw"
              >
                <Input
                  id="si-pw"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </Field>
              <div className="flex items-center justify-between -mt-1">
                <label className="inline-flex items-center gap-2 text-[13px] text-ink-muted">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-line accent-primary"
                  />
                  Keep me signed in
                </label>
                <Link
                  href="#"
                  className="text-[13px] font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" size="lg" className="w-full">
                Sign in <ArrowRight size={16} />
              </Button>
            </form>

            <div className="mt-7 pt-5 border-t border-line text-[14px] text-ink-muted">
              New here?{" "}
              <Link
                href="/portal/sign-up"
                className="font-medium text-primary hover:underline"
              >
                Create an account
              </Link>{" "}
              or{" "}
              <Link
                href="/apply"
                className="font-medium text-primary hover:underline"
              >
                start an application
              </Link>
              .
            </div>
          </div>

          {/* Right: demo role panel */}
          <aside className="bg-white border border-line rounded-lg p-6 sm:p-7 shadow-[var(--shadow-card)] flex flex-col">
            <div className="inline-flex self-start items-center gap-2 rounded-full border border-warn/20 bg-warn-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-[#92400E]">
              Demo environment
            </div>
            <h2 className="mt-3 text-[18px] font-semibold tracking-tight">
              Skip the sign-in
            </h2>
            <p className="mt-1 text-[13px] text-ink-muted leading-6">
              In production, roles are determined by the signed-in account. For
              this demo, jump directly into any role.
            </p>
            <ul className="mt-5 grid gap-2 flex-1">
              {demoRoles.map((r) => (
                <li key={r.id}>
                  <Link
                    href={r.href}
                    className="group flex items-center justify-between gap-3 rounded-md border border-line bg-white p-3 hover:border-primary/40 transition-colors"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary">
                        {r.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-medium text-ink">
                          {r.label}
                        </span>
                        <span className="block text-[12px] text-ink-subtle truncate">
                          Demo user: {r.user}
                        </span>
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-primary opacity-80 group-hover:opacity-100">
                      Enter <ArrowRight size={12} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[12px] text-ink-subtle leading-5">
              No data is saved — refresh resets the demo.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
