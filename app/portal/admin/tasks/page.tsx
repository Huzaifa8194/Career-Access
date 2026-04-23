"use client";

import { useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { RequireAuth } from "@/components/portal/RequireAuth";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Check,
  FileText,
  Mail,
  Calendar,
  Settings,
} from "@/components/icons";

type Task = {
  id: string;
  title: string;
  owner: string;
  due: string;
  priority: "High" | "Med" | "Low";
  status: "Open" | "In progress" | "Done";
  area: "Outreach" | "Reporting" | "Operations" | "Content";
};

const seedTasks: Task[] = [
  {
    id: "t1",
    title: "Q2 outcomes report — final review",
    owner: "Aisha B.",
    due: "Apr 28",
    priority: "High",
    status: "In progress",
    area: "Reporting",
  },
  {
    id: "t2",
    title: "Update Spring 2026 college program list",
    owner: "Maya R.",
    due: "Apr 30",
    priority: "Med",
    status: "Open",
    area: "Content",
  },
  {
    id: "t3",
    title: "Review IBEW — North Jersey partner agreement",
    owner: "Aisha B.",
    due: "May 2",
    priority: "High",
    status: "Open",
    area: "Operations",
  },
  {
    id: "t4",
    title: "Send re-engagement email to stalled applicants",
    owner: "Daniel C.",
    due: "Apr 22",
    priority: "Med",
    status: "Open",
    area: "Outreach",
  },
  {
    id: "t5",
    title: "Publish FAFSA deadline reminder banner",
    owner: "Maya R.",
    due: "Apr 21",
    priority: "Low",
    status: "Done",
    area: "Content",
  },
  {
    id: "t6",
    title: "Schedule advisor calibration session",
    owner: "Aisha B.",
    due: "May 6",
    priority: "Low",
    status: "Open",
    area: "Operations",
  },
];

const contentBlocks = [
  {
    id: "hero",
    label: "Landing hero",
    title: "Your Next Step Starts Here",
    body: "Get free support to enroll in college, job training, or apprenticeship programs.",
    updated: "Apr 12",
    status: "Published",
  },
  {
    id: "fafsa-banner",
    label: "Site-wide banner",
    title: "FAFSA priority deadline · May 1",
    body: "Reminder shown across the public site for two weeks.",
    updated: "Apr 18",
    status: "Scheduled",
  },
  {
    id: "advising-blurb",
    label: "Booking page intro",
    title: "Choose a time to speak with an advisor",
    body: "Free, 30-minute working session. Phone or video — your choice.",
    updated: "Mar 28",
    status: "Published",
  },
  {
    id: "confirm",
    label: "Application confirmation",
    title: "Thank You! · Your application has been submitted.",
    body: "Reviewed within 2–3 business days. Option to schedule advising call.",
    updated: "Apr 02",
    status: "Published",
  },
];

const priorityTone: Record<Task["priority"], "danger" | "warn" | "muted"> = {
  High: "danger",
  Med: "warn",
  Low: "muted",
};

const statusTone: Record<Task["status"], "info" | "warn" | "success"> = {
  Open: "info",
  "In progress": "warn",
  Done: "success",
};

export default function AdminTasksPage() {
  return (
    <RequireAuth requiredRole="admin">
      <Inner />
    </RequireAuth>
  );
}

function Inner() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [filter, setFilter] = useState<"All" | Task["status"]>("All");

  const filtered =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  function toggleDone(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Done" ? "Open" : "Done" }
          : t
      )
    );
  }

  const counts = {
    Open: tasks.filter((t) => t.status === "Open").length,
    "In progress": tasks.filter((t) => t.status === "In progress").length,
    Done: tasks.filter((t) => t.status === "Done").length,
  };

  return (
    <PortalShell
      role="admin"
      title="Tasks & content"
      subtitle="Operational task list and the content blocks shown on the public site."
      actions={
        <>
          <Button variant="secondary" size="sm">
            Activity log
          </Button>
          <Button variant="primary" size="sm">
            <Plus size={14} /> New task
          </Button>
        </>
      }
    >
      {/* Summary tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Tile
          icon={<FileText size={16} />}
          label="Open tasks"
          value={counts.Open}
          tone="primary"
        />
        <Tile
          icon={<Calendar size={16} />}
          label="In progress"
          value={counts["In progress"]}
          tone="warn"
        />
        <Tile
          icon={<Check size={16} />}
          label="Completed this month"
          value={counts.Done}
          tone="success"
        />
        <Tile
          icon={<Mail size={16} />}
          label="Scheduled comms"
          value={2}
          hint="Next: FAFSA banner Apr 21"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Tasks */}
        <Card>
          <CardHeader
            title="Operational tasks"
            description="Cross-team work tracked in the portal."
            action={
              <div className="flex items-center gap-1">
                {(["All", "Open", "In progress", "Done"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={[
                      "h-8 px-3 rounded-md text-[12px] font-medium border transition-colors",
                      filter === f
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-ink-muted border-line hover:text-ink",
                    ].join(" ")}
                  >
                    {f}
                  </button>
                ))}
              </div>
            }
          />
          <ul className="divide-y divide-line">
            {filtered.map((t) => (
              <li
                key={t.id}
                className="px-5 py-4 flex items-start gap-4 hover:bg-canvas/40"
              >
                <button
                  onClick={() => toggleDone(t.id)}
                  aria-pressed={t.status === "Done"}
                  className={[
                    "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                    t.status === "Done"
                      ? "bg-action border-action text-white"
                      : "bg-white border-line-strong text-transparent hover:border-primary",
                  ].join(" ")}
                >
                  <Check size={12} />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={[
                        "text-[14px] font-medium",
                        t.status === "Done"
                          ? "text-ink-subtle line-through"
                          : "text-ink",
                      ].join(" ")}
                    >
                      {t.title}
                    </span>
                    <Badge tone="muted" size="sm">
                      {t.area}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-ink-subtle">
                    <span>Owner: {t.owner}</span>
                    <span>·</span>
                    <span>Due {t.due}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge tone={priorityTone[t.priority]} size="sm">
                    {t.priority}
                  </Badge>
                  <Badge tone={statusTone[t.status]} size="sm">
                    {t.status}
                  </Badge>
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-5 py-8 text-center text-[13px] text-ink-subtle">
                No tasks in this view.
              </li>
            )}
          </ul>
        </Card>

        {/* Content management */}
        <Card>
          <CardHeader
            title="Site content"
            description="Blocks shown on the public microsite."
            action={
              <button className="text-[13px] font-medium text-primary inline-flex items-center gap-1">
                <Settings size={12} /> Manage
              </button>
            }
          />
          <CardBody className="grid gap-3">
            {contentBlocks.map((c) => (
              <div
                key={c.id}
                className="rounded-md border border-line bg-canvas/40 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-ink-subtle">
                      {c.label}
                    </div>
                    <div className="mt-0.5 text-[13px] font-medium text-ink truncate">
                      {c.title}
                    </div>
                  </div>
                  <Badge
                    tone={c.status === "Scheduled" ? "warn" : "success"}
                    size="sm"
                  >
                    {c.status}
                  </Badge>
                </div>
                <p className="mt-1.5 text-[12px] text-ink-muted leading-5 line-clamp-2">
                  {c.body}
                </p>
                <div className="mt-2 flex items-center justify-between text-[12px] text-ink-subtle">
                  <span>Updated {c.updated}</span>
                  <button className="text-primary font-medium hover:underline">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}

function Tile({
  icon,
  label,
  value,
  hint,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  tone?: "neutral" | "primary" | "success" | "warn";
}) {
  const accent =
    tone === "primary"
      ? "bg-primary-50 text-primary"
      : tone === "success"
        ? "bg-action-50 text-action-700"
        : tone === "warn"
          ? "bg-warn-50 text-[#92400E]"
          : "bg-canvas text-ink-muted";
  return (
    <div className="bg-card border border-line rounded-lg p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <span className="text-[12px] uppercase tracking-wider text-ink-subtle">
          {label}
        </span>
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${accent}`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-2 text-[28px] font-semibold tabular tracking-tight">
        {value}
      </div>
      {hint && <div className="mt-1 text-[12px] text-ink-subtle">{hint}</div>}
    </div>
  );
}
