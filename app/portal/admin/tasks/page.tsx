"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check, FileText, Calendar, Mail } from "@/components/icons";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  subscribeOpenTasks,
  updateTaskStatus,
  type TaskRow,
} from "@/lib/services/tasks";
import {
  subscribeParticipants,
  type ParticipantListItem,
} from "@/lib/services/participants";
import type { TaskStatus } from "@/lib/firebase/types";

const priorityTone: Record<TaskRow["priority"], "danger" | "warn" | "muted"> = {
  High: "danger",
  Med: "warn",
  Low: "muted",
};

const statusTone: Record<TaskStatus, "info" | "warn" | "success"> = {
  open: "info",
  "in-progress": "warn",
  done: "success",
};

const statusLabel: Record<TaskStatus, string> = {
  open: "Open",
  "in-progress": "In progress",
  done: "Done",
};

export default function AdminTasksPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <AdminTasks />
    </RoleGuard>
  );
}

function AdminTasks() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [participants, setParticipants] = useState<ParticipantListItem[]>([]);
  const [filter, setFilter] = useState<"All" | TaskStatus>("All");

  useEffect(() => {
    const a = subscribeOpenTasks(setTasks);
    const b = subscribeParticipants(setParticipants);
    return () => {
      a();
      b();
    };
  }, []);

  const byId = useMemo(
    () => new Map(participants.map((p) => [p.id, p])),
    [participants]
  );

  const filtered = useMemo(
    () => (filter === "All" ? tasks : tasks.filter((t) => t.status === filter)),
    [tasks, filter]
  );

  const counts = {
    open: tasks.filter((t) => t.status === "open").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  function cycleStatus(t: TaskRow) {
    const next: TaskStatus =
      t.status === "open"
        ? "in-progress"
        : t.status === "in-progress"
        ? "done"
        : "open";
    updateTaskStatus(t.id, next).catch(() => {});
  }

  return (
    <PortalShell
      role="admin"
      title="Operational tasks"
      subtitle="Cross-team work assigned to participants across the portal."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Tile
          icon={<FileText size={16} />}
          label="Open tasks"
          value={counts.open}
          tone="primary"
        />
        <Tile
          icon={<Calendar size={16} />}
          label="In progress"
          value={counts["in-progress"]}
          tone="warn"
        />
        <Tile
          icon={<Check size={16} />}
          label="Completed"
          value={counts.done}
          tone="success"
        />
        <Tile
          icon={<Mail size={16} />}
          label="Total tracked"
          value={tasks.length}
        />
      </div>

      <Card>
        <CardHeader
          title="All tasks"
          description="Scoped to participants in your portal"
          action={
            <div className="flex items-center gap-1">
              {(["All", "open", "in-progress", "done"] as const).map((f) => (
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
                  {f === "All" ? "All" : statusLabel[f as TaskStatus]}
                </button>
              ))}
            </div>
          }
        />
        <ul className="divide-y divide-line">
          {filtered.map((t) => {
            const p = byId.get(t.participantId);
            return (
              <li
                key={t.id}
                className="px-5 py-4 flex items-start gap-4 hover:bg-canvas/40"
              >
                <button
                  onClick={() => cycleStatus(t)}
                  aria-pressed={t.status === "done"}
                  className={[
                    "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                    t.status === "done"
                      ? "bg-action border-action text-white"
                      : "bg-white border-line-strong text-transparent hover:border-primary",
                  ].join(" ")}
                  title="Change status"
                >
                  <Check size={12} />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={[
                        "text-[14px] font-medium",
                        t.status === "done"
                          ? "text-ink-subtle line-through"
                          : "text-ink",
                      ].join(" ")}
                    >
                      {t.title}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-ink-subtle">
                    <span>
                      Participant:{" "}
                      {p ? (
                        <Link
                          href={`/portal/admin/participants/${p.id}`}
                          className="text-primary"
                        >
                          {p.firstName} {p.lastName}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </span>
                    {t.dueDate && (
                      <>
                        <span>·</span>
                        <span>Due {t.dueDate}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge tone={priorityTone[t.priority]} size="sm">
                    {t.priority}
                  </Badge>
                  <Badge tone={statusTone[t.status]} size="sm">
                    {statusLabel[t.status]}
                  </Badge>
                </div>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-5 py-8 text-center text-[13px] text-ink-subtle">
              No tasks in this view.
            </li>
          )}
        </ul>
      </Card>
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
