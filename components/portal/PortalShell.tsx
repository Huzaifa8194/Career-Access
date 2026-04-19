"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Logo,
  Bell,
  Search,
  Inbox,
  Calendar,
  FileText,
  Layers,
  Users,
  ChartBar,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  Compass,
} from "@/components/icons";

type NavItem = { href: string; label: string; icon: React.ReactNode };

const roleNav: Record<string, { label: string; items: NavItem[] }> = {
  participant: {
    label: "Participant",
    items: [
      {
        href: "/portal/participant",
        label: "Dashboard",
        icon: <Compass size={16} />,
      },
      {
        href: "/portal/participant/appointments",
        label: "Appointments",
        icon: <Calendar size={16} />,
      },
      {
        href: "/portal/participant/documents",
        label: "Documents",
        icon: <FileText size={16} />,
      },
      {
        href: "/portal/participant/messages",
        label: "Messages",
        icon: <MessageSquare size={16} />,
      },
    ],
  },
  advisor: {
    label: "Advisor",
    items: [
      { href: "/portal/advisor", label: "Pipeline", icon: <Layers size={16} /> },
      {
        href: "/portal/advisor/participants",
        label: "Participants",
        icon: <Users size={16} />,
      },
      {
        href: "/portal/advisor/inbox",
        label: "Inbox",
        icon: <Inbox size={16} />,
      },
    ],
  },
  admin: {
    label: "Admin",
    items: [
      { href: "/portal/admin", label: "Overview", icon: <ChartBar size={16} /> },
      {
        href: "/portal/admin/participants",
        label: "Applicants",
        icon: <Users size={16} />,
      },
      {
        href: "/portal/admin/partners",
        label: "Partners",
        icon: <Briefcase size={16} />,
      },
      {
        href: "/portal/admin/tasks",
        label: "Tasks & content",
        icon: <Inbox size={16} />,
      },
    ],
  },
};

const userByRole: Record<string, { name: string; meta: string; initials: string }> = {
  participant: {
    name: "Jordan Hayes",
    meta: "Participant · Boston, MA",
    initials: "JH",
  },
  advisor: {
    name: "Maya Robinson",
    meta: "Advisor · 18 active cases",
    initials: "MR",
  },
  admin: {
    name: "Aisha Bennett",
    meta: "Program Admin",
    initials: "AB",
  },
};

export function PortalShell({
  role,
  title,
  subtitle,
  actions,
  children,
}: {
  role: "participant" | "advisor" | "admin";
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const nav = roleNav[role];
  const user = userByRole[role];
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 w-[260px] border-r border-line bg-white flex-col",
            "lg:sticky lg:top-0 lg:h-screen lg:flex",
            mobileNavOpen ? "flex" : "hidden",
          ].join(" ")}
        >
          <div className="px-5 py-4 border-b border-line">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo size={26} />
              <div className="leading-tight">
                <div className="text-[14px] font-semibold tracking-tight">
                  Career Access
                </div>
                <div className="text-[11px] uppercase tracking-wider text-ink-subtle">
                  {nav.label} portal
                </div>
              </div>
            </Link>
          </div>

          <RoleSwitcher current={role} />

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="grid gap-0.5">
              {nav.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== `/portal/${role}` &&
                    pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={[
                        "flex items-center gap-3 rounded-md px-3 py-2 text-[14px] transition-colors",
                        active
                          ? "bg-primary-50 text-primary font-medium"
                          : "text-ink-muted hover:bg-canvas hover:text-ink",
                      ].join(" ")}
                    >
                      <span className={active ? "text-primary" : "text-ink-subtle"}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
              Account
            </div>
            <ul className="mt-2 grid gap-0.5">
              <li>
                <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-[14px] text-ink-muted hover:bg-canvas hover:text-ink">
                  <span className="text-ink-subtle">
                    <Settings size={16} />
                  </span>
                  Settings
                </button>
              </li>
              <li>
                <Link
                  href="/"
                  className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-[14px] text-ink-muted hover:bg-canvas hover:text-ink"
                >
                  <span className="text-ink-subtle">
                    <LogOut size={16} />
                  </span>
                  Sign out
                </Link>
              </li>
            </ul>
          </nav>

          <div className="border-t border-line p-4 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white text-[12px] font-semibold">
              {user.initials}
            </span>
            <div className="min-w-0 leading-tight">
              <div className="text-[13px] font-medium text-ink truncate">
                {user.name}
              </div>
              <div className="text-[11px] text-ink-subtle truncate">
                {user.meta}
              </div>
            </div>
          </div>
        </aside>

        {mobileNavOpen && (
          <button
            aria-label="Close navigation"
            className="lg:hidden fixed inset-0 z-30 bg-black/30"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          <header className="sticky top-0 z-20 border-b border-line bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="flex items-center justify-between gap-3 px-5 lg:px-8 h-14">
              <button
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-line"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>

              <div className="hidden md:flex items-center gap-2 max-w-md flex-1">
                <div className="relative w-full">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
                  />
                  <input
                    type="search"
                    placeholder={`Search ${nav.label.toLowerCase()}…`}
                    className="h-9 w-full rounded-md border border-line bg-canvas pl-9 pr-3 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink-muted hover:text-ink hover:bg-canvas"
                  aria-label="Notifications"
                >
                  <Bell size={16} />
                  <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-warn" />
                </button>
                <span className="hidden sm:inline-flex h-9 items-center gap-2 rounded-md border border-line px-2.5 text-[13px] text-ink-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-action" />
                  Live
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 px-5 lg:px-8 py-8 lg:py-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-[24px] sm:text-[28px] font-semibold tracking-tight leading-tight">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="mt-1 text-[14px] text-ink-muted leading-6">
                      {subtitle}
                    </p>
                  )}
                </div>
                {actions && (
                  <div className="flex flex-wrap gap-2">{actions}</div>
                )}
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function RoleSwitcher({ current }: { current: "participant" | "advisor" | "admin" }) {
  const [open, setOpen] = useState(false);
  const items: { id: typeof current; label: string; href: string }[] = [
    { id: "participant", label: "Participant view", href: "/portal/participant" },
    { id: "advisor", label: "Advisor view", href: "/portal/advisor" },
    { id: "admin", label: "Admin view", href: "/portal/admin" },
  ];
  return (
    <div className="relative px-3 pt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-md border border-line bg-white px-3 h-10 text-[13px] hover:border-line-strong"
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-primary-50 text-primary text-[10px] font-bold uppercase">
            {current[0]}
          </span>
          <span className="truncate font-medium">
            {items.find((i) => i.id === current)?.label}
          </span>
        </span>
        <ChevronDown size={14} className="text-ink-subtle" />
      </button>
      {open && (
        <div className="absolute left-3 right-3 top-[3.25rem] z-30 rounded-md border border-line bg-white shadow-[var(--shadow-elevated)] overflow-hidden">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setOpen(false)}
              className={[
                "block px-3 py-2 text-[13px] hover:bg-canvas",
                item.id === current ? "text-primary font-medium" : "text-ink",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  delta?: string;
  hint?: string;
  tone?: "neutral" | "primary" | "success" | "warn";
}) {
  const accent =
    tone === "primary"
      ? "text-primary"
      : tone === "success"
        ? "text-action-700"
        : tone === "warn"
          ? "text-[#92400E]"
          : "text-ink";
  return (
    <div className="bg-card border border-line rounded-lg p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <span className="text-[12px] uppercase tracking-wider text-ink-subtle">
          {label}
        </span>
        {delta && (
          <span className="text-[11px] font-medium text-action">{delta}</span>
        )}
      </div>
      <div className={`mt-2 text-[28px] font-semibold tabular tracking-tight ${accent}`}>
        {value}
      </div>
      {hint && (
        <div className="mt-1 text-[12px] text-ink-subtle">{hint}</div>
      )}
    </div>
  );
}
