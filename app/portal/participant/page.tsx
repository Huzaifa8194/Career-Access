"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import {
  Check,
  Clock,
  ArrowRight,
  Calendar,
  FileText,
  AlertTriangle,
  Sparkle,
  MessageSquare,
} from "@/components/icons";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useParticipantContext } from "@/lib/hooks/useParticipantContext";
import {
  subscribeTasksForParticipant,
  type TaskRow,
} from "@/lib/services/tasks";
import {
  subscribeAppointmentsForParticipant,
  type AppointmentRow,
} from "@/lib/services/appointments";
import {
  subscribeDocumentsForParticipant,
  type DocumentRow,
} from "@/lib/services/documents";
import { pathwayBadgeTone } from "@/lib/pathway";
import { useAuth } from "@/lib/firebase/auth";

export default function ParticipantDashboardPage() {
  return (
    <RoleGuard allow={["participant"]}>
      <ParticipantDashboard />
    </RoleGuard>
  );
}

function ParticipantDashboard() {
  const { profile } = useAuth();
  const { participant, participantId, loading } = useParticipantContext();
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);

  useEffect(() => {
    if (!participantId) return;
    const a = subscribeTasksForParticipant(participantId, setTasks);
    const b = subscribeAppointmentsForParticipant(participantId, setAppointments);
    const c = subscribeDocumentsForParticipant(participantId, setDocuments);
    return () => {
      a();
      b();
      c();
    };
  }, [participantId]);

  const firstName =
    participant?.firstName ||
    profile?.fullName?.split(" ")[0] ||
    "there";

  const openTasks = tasks.filter((t) => t.status !== "done");
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const nextTask = openTasks.sort((a, b) =>
    (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999")
  )[0];

  const upcoming = appointments.filter((a) => {
    if (!a.scheduledAtISO) return false;
    return new Date(a.scheduledAtISO).getTime() > Date.now() - 3600_000;
  });

  const overdueTasks = openTasks.filter(
    (t) => t.dueDate && t.dueDate < new Date().toISOString().slice(0, 10)
  );

  return (
    <PortalShell
      role="participant"
      title={`Welcome back, ${firstName}.`}
      subtitle="Here's what's next on your pathway."
      actions={
        <>
          <LinkButton
            href="/portal/participant/messages"
            variant="secondary"
            size="sm"
          >
            <MessageSquare size={14} />
            Message advisor
          </LinkButton>
          <LinkButton href="/book" variant="primary" size="sm">
            Book a session
          </LinkButton>
        </>
      }
    >
      {loading && (
        <div className="rounded-md border border-line bg-white p-4 text-[13px] text-ink-muted">
          Loading your pathway…
        </div>
      )}

      {!loading && !participant && (
        <Card className="p-6">
          <h2 className="text-[18px] font-semibold tracking-tight">
            Finish your application to unlock your dashboard
          </h2>
          <p className="mt-2 text-[14px] text-ink-muted">
            We couldn&apos;t find an application linked to {profile?.email}.
            Start or complete your application and we&apos;ll build your
            pathway from there.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <LinkButton href="/apply" variant="primary" size="sm">
              Start application <ArrowRight size={14} />
            </LinkButton>
            <LinkButton href="/book" variant="secondary" size="sm">
              Book advising
            </LinkButton>
          </div>
        </Card>
      )}

      {!loading && participant && (
        <>
          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <Card className="p-6 sm:p-7 bg-gradient-to-br from-primary to-[#15296a] text-white border-0">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider text-white/80">
                  <Sparkle size={14} /> Your pathway
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-2.5 py-1 text-[12px] text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-action" />{" "}
                  {participant.status}
                </span>
              </div>
              <h2 className="mt-3 text-[26px] sm:text-[30px] font-semibold tracking-tight leading-tight text-white">
                {participant.pathway}
              </h2>
              <p className="mt-1.5 text-white/80 text-[14px] leading-6 max-w-md">
                {participant.assignedAdvisorName
                  ? `Working with ${participant.assignedAdvisorName} to move you forward.`
                  : "An advisor will be assigned to you shortly."}
              </p>

              <div className="mt-6 rounded-md border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] uppercase tracking-wider text-white/70">
                    Your next step
                  </span>
                  {nextTask?.dueDate && (
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-amber-200">
                      <Clock size={12} /> Due {nextTask.dueDate}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[18px] font-semibold tracking-tight text-white">
                  {nextTask?.title ?? "You're all caught up."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <LinkButton
                    href="/portal/participant/documents"
                    variant="action"
                    size="sm"
                  >
                    Upload documents <ArrowRight size={14} />
                  </LinkButton>
                  {participant.assignedAdvisorName && (
                    <span className="text-[12px] text-white/70">
                      Or message{" "}
                      {participant.assignedAdvisorName.split(" ")[0]} with
                      questions
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <MiniStat label="Pathway" value={participant.pathway.split(" ")[0]} />
                <MiniStat label="Progress" value={`${pct}%`} />
                <MiniStat
                  label="Advisor"
                  value={
                    participant.assignedAdvisorName?.split(" ")[0] ??
                    "Pending"
                  }
                />
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Reminders"
                description="Time-sensitive items only"
                action={
                  <Badge tone={overdueTasks.length ? "warn" : "muted"}>
                    {overdueTasks.length + upcoming.length} active
                  </Badge>
                }
              />
              <CardBody className="grid gap-3">
                {overdueTasks.length === 0 && upcoming.length === 0 && (
                  <div className="text-[13px] text-ink-muted">
                    Nothing urgent right now — great work.
                  </div>
                )}
                {overdueTasks.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-md border p-4 flex gap-3 border-warn/20 bg-warn-50"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-warn text-white">
                      <AlertTriangle size={14} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium text-ink">
                        {r.title}
                      </div>
                      <div className="text-[13px] text-ink-muted leading-5">
                        Due {r.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
                {upcoming.slice(0, 2).map((a) => (
                  <div
                    key={a.id}
                    className="rounded-md border p-4 flex gap-3 border-info/15 bg-info-50"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-info text-white">
                      <Calendar size={14} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[14px] font-medium text-ink">
                        {a.appointmentType}
                      </div>
                      <div className="text-[13px] text-ink-muted leading-5">
                        {a.scheduledDate} · {a.scheduledTime} {a.timezone}
                      </div>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <Card>
              <CardHeader
                title="Your checklist"
                description={`${doneTasks} of ${totalTasks} steps complete`}
                action={
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-32 rounded-full bg-line overflow-hidden">
                      <div
                        className="h-full bg-action transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[12px] tabular text-ink-muted">
                      {pct}%
                    </span>
                  </div>
                }
              />
              <CardBody className="grid gap-1.5">
                {tasks.length === 0 && (
                  <div className="text-[13px] text-ink-muted py-3">
                    Your advisor will post tasks here after your first call.
                  </div>
                )}
                {tasks.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-canvas/60"
                  >
                    <span
                      className={[
                        "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                        item.status === "done"
                          ? "bg-action border-action text-white"
                          : "bg-white border-line text-ink-subtle",
                      ].join(" ")}
                    >
                      {item.status === "done" ? (
                        <Check size={12} />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <span
                      className={`text-[14px] ${
                        item.status === "done"
                          ? "text-ink-subtle line-through"
                          : "text-ink"
                      }`}
                    >
                      {item.title}
                    </span>
                    {item.dueDate && item.status !== "done" && (
                      <span className="ml-auto text-[12px] text-ink-subtle">
                        Due {item.dueDate}
                      </span>
                    )}
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="Upcoming appointments"
                action={
                  <LinkButton
                    href="/portal/participant/appointments"
                    variant="ghost"
                    size="sm"
                  >
                    See all
                  </LinkButton>
                }
              />
              <CardBody className="grid gap-3">
                {upcoming.length === 0 && (
                  <div className="text-[13px] text-ink-muted">
                    No appointments scheduled.{" "}
                    <a className="text-primary" href="/book">
                      Book one →
                    </a>
                  </div>
                )}
                {upcoming.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    className="rounded-md border border-line p-4 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-medium">
                        {a.appointmentType}
                      </span>
                      <Badge
                        tone={
                          a.status === "confirmed" ? "primary" : "muted"
                        }
                      >
                        {a.status}
                      </Badge>
                    </div>
                    <div className="text-[13px] text-ink-muted">
                      {a.scheduledDate} · {a.scheduledTime} {a.timezone} ·{" "}
                      {a.mode}
                    </div>
                    {a.advisorName && (
                      <div className="text-[12px] text-ink-subtle">
                        with {a.advisorName}
                      </div>
                    )}
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <Card>
              <CardHeader
                title="Documents"
                description="Upload what your advisor requests"
                action={
                  <LinkButton
                    href="/portal/participant/documents"
                    variant="ghost"
                    size="sm"
                  >
                    Manage
                  </LinkButton>
                }
              />
              <CardBody className="grid gap-2">
                {documents.length === 0 && (
                  <div className="text-[13px] text-ink-muted">
                    No documents yet. Upload from the documents page.
                  </div>
                )}
                {documents.slice(0, 5).map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between gap-3 border border-line rounded-md p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-canvas text-ink-muted">
                        <FileText size={14} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium truncate">
                          {d.fileName}
                        </div>
                        <div className="text-[12px] text-ink-subtle">
                          {formatSize(d.size)} ·{" "}
                          {d.createdAtISO
                            ? new Date(d.createdAtISO).toLocaleDateString()
                            : "—"}
                        </div>
                      </div>
                    </div>
                    <Badge
                      tone={
                        d.status === "verified"
                          ? "success"
                          : d.status === "needed" || d.status === "rejected"
                          ? "warn"
                          : "muted"
                      }
                      dot
                    >
                      {d.status}
                    </Badge>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="Your intake snapshot"
                action={
                  <Badge tone={pathwayBadgeTone(participant.pathway)}>
                    {participant.pathway}
                  </Badge>
                }
              />
              <CardBody className="grid gap-3 text-[14px]">
                <Row label="Email" value={participant.email || "—"} />
                <Row label="Phone" value={participant.phone || "—"} />
                <Row
                  label="Address"
                  value={[participant.city, participant.state, participant.zip]
                    .filter(Boolean)
                    .join(", ") || "—"}
                />
                <Row
                  label="Education"
                  value={participant.educationLevel || "—"}
                />
                <Row
                  label="Support"
                  value={
                    participant.supportNeeded.length
                      ? participant.supportNeeded.join(" · ")
                      : "—"
                  }
                />
              </CardBody>
              <CardFooter>
                <a
                  href="/portal/participant/messages"
                  className="text-[13px] font-medium text-primary"
                >
                  Request a change
                </a>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </PortalShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/15 bg-white/5 p-3">
      <div className="text-[11px] uppercase tracking-wider text-white/70">
        {label}
      </div>
      <div className="mt-0.5 text-[15px] font-semibold tracking-tight text-white">
        {value}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 items-baseline">
      <span className="text-[12px] uppercase tracking-wider text-ink-subtle">
        {label}
      </span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let s = bytes;
  let i = 0;
  while (s >= 1024 && i < units.length - 1) {
    s /= 1024;
    i++;
  }
  return `${s.toFixed(s < 10 ? 1 : 0)} ${units[i]}`;
}
