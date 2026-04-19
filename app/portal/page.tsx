import Link from "next/link";
import { Logo, Compass, Users, ChartBar, ArrowRight } from "@/components/icons";

export const metadata = { title: "Sign in" };

const roles = [
  {
    href: "/portal/participant",
    icon: <Compass size={18} />,
    title: "Participant",
    copy: "Track your pathway, upload documents, and message your advisor.",
    user: "Jordan Hayes",
  },
  {
    href: "/portal/advisor",
    icon: <Users size={18} />,
    title: "Advisor",
    copy: "Manage your pipeline, review intakes, and log follow-ups.",
    user: "Maya Robinson",
  },
  {
    href: "/portal/admin",
    icon: <ChartBar size={18} />,
    title: "Admin",
    copy: "Operational view, partner reporting, and pathway distribution.",
    user: "Aisha Bennett",
  },
];

export default function PortalLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-5xl px-5 lg:px-8 h-14 flex items-center justify-between">
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
      <main className="flex-1 flex items-center justify-center py-16 px-5">
        <div className="w-full max-w-3xl">
          <div className="text-center max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-2.5 py-1 text-[12px] text-ink-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-action" /> Demo
              environment
            </div>
            <h1 className="mt-4 text-[32px] font-semibold tracking-tight leading-tight">
              Sign in to Career Access
            </h1>
            <p className="mt-3 text-[15px] text-ink-muted leading-7">
              Pick a role to enter the portal. In production, this is a single
              sign-in screen — roles are determined by your account.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {roles.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group bg-white border border-line rounded-lg p-5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)] transition-all"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary">
                  {r.icon}
                </span>
                <h3 className="mt-4 text-[16px] font-semibold tracking-tight">
                  {r.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-ink-muted leading-6">
                  {r.copy}
                </p>
                <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-[12px]">
                  <span className="text-ink-subtle">Demo: {r.user}</span>
                  <span className="inline-flex items-center gap-1 text-primary font-medium">
                    Enter <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
