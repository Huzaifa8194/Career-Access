"use client";

import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { RequireAuth } from "@/components/portal/RequireAuth";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { participantSummary } from "@/lib/data";
import { fetchMyParticipant, type PortalParticipant } from "@/lib/services/participants";
import { fetchMyAppointments } from "@/lib/services/appointments";
import { fetchMyDocuments } from "@/lib/services/documents";
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

type AppointmentView = {
  id: string;
  title: string;
  when: string;
  mode: string;
  status: string;
  who: string;
};

type DocView = {
  id: string;
  name: string;
  uploaded: string;
  size: string;
  status: string;
};

function formatWhen(iso: string, tz: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })} ${tz}`;
}

function formatSize(bytes?: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ParticipantDashboard() {
  return (
    <RequireAuth requiredRole="participant">
      <Inner />
    </RequireAuth>
  );
}

function Inner() {
  const demo = participantSummary;
  const [participant, setParticipant] = useState<PortalParticipant | null>(null);
  const [appointments, setAppointments] = useState<AppointmentView[] | null>(null);
  const [docs, setDocs] = useState<DocView[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, apps, d] = await Promise.all([
        fetchMyParticipant(),
        fetchMyAppointments(),
        fetchMyDocuments(),
      ]);
      if (cancelled) return;
      setParticipant(p);
      if (apps.live && apps.rows.length > 0) {
        const now = Date.now();
        setAppointments(
          apps.rows
            .filter((r) => !r.scheduledAt || new Date(r.scheduledAt).getTime() >= now)
            .slice(0, 3)
            .map((r) => ({
              id: r.id,
              title: r.appointmentType || "Advising session",
              when: formatWhen(r.scheduledAt, r.timezone),
              mode: "Video",
              status: (r.status ?? "Confirmed").replace(/(^.)/, (c) => c.toUpperCase()),
              who: r.advisor?.fullName ?? "Advisor",
            }))
        );
      } else {
        setAppointments(
          demo.appointments.map((a, i) => ({
            id: `demo_${i}`,
            title: a.title,
            when: a.when,
            mode: a.mode,
            status: a.status,
            who: a.who,
          }))
        );
      }
      if (d.live && d.rows.length > 0) {
        setDocs(
          d.rows.slice(0, 4).map((r) => ({
            id: r.id,
            name: r.fileName,
            uploaded: r.createdAt
              ? new Date(r.createdAt).toLocaleDateString()
              : "—",
            size: formatSize(r.sizeBytes ?? undefined),
            status: r.status ?? "In review",
          }))
        );
      } else {
        setDocs(
          demo.documents.map((x, i) => ({
            id: `demo_${i}`,
            name: x.name,
            uploaded: x.uploaded,
            size: x.size,
            status: x.status,
          }))
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [demo.appointments, demo.documents]);

  const firstName = participant?.firstName ?? "there";
  const pathway = participant?.pathway ?? demo.pathway;
  const advisor = participant?.assignedAdvisor ?? demo.advisor;

  const total = demo.checklist.length;
  const done = demo.checklist.filter((c) => c.done).length;
  const pct = Math.round((done / total) * 100);

  const contactEmail = participant?.email ?? demo.intake.contact.email;
  const contactPhone = participant?.phone ?? demo.intake.contact.phone;
  const address = useMemo(() => {
    if (!participant) return demo.intake.contact.address;
    const parts = [participant.city, participant.state, participant.zip]
      .filter(Boolean)
      .join(", ");
    return parts || demo.intake.contact.address;
  }, [participant, demo.intake.contact.address]);

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
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-6 sm:p-7 bg-gradient-to-br from-primary to-[#15296a] text-white border-0">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider text-white/80">
              <Sparkle size={14} /> Your pathway
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-2.5 py-1 text-[12px] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-action" /> On track
            </span>
          </div>
          <h2 className="mt-3 text-[26px] sm:text-[30px] font-semibold tracking-tight leading-tight text-white">
            {pathway}
          </h2>
          <p className="mt-1.5 text-white/80 text-[14px] leading-6 max-w-md">
            Working with {advisor} to move you forward on your pathway.
          </p>

          <div className="mt-6 rounded-md border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-[12px] uppercase tracking-wider text-white/70">
                Your next step
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-amber-200">
                <Clock size={12} /> Due {demo.nextStepDue}
              </span>
            </div>
            <p className="mt-1.5 text-[18px] font-semibold tracking-tight text-white">
              {demo.nextStep}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <LinkButton
                href="/portal/participant/documents"
                variant="action"
                size="sm"
              >
                Upload documents <ArrowRight size={14} />
              </LinkButton>
              <span className="text-[12px] text-white/70">
                Or message {advisor.split(" ")[0]} if you have questions
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <MiniStat label="Pathway" value={pathway.split(" ")[0]} />
            <MiniStat label="Progress" value={`${pct}%`} />
            <MiniStat label="Advisor" value={advisor.split(" ")[0]} />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Reminders"
            description="Time-sensitive items only"
            action={<Badge tone="warn">{demo.reminders.length} active</Badge>}
          />
          <CardBody className="grid gap-3">
            {demo.reminders.map((r) => (
              <div
                key={r.title}
                className={`rounded-md border p-4 flex gap-3 ${
                  r.tone === "warn"
                    ? "border-warn/20 bg-warn-50"
                    : "border-info/15 bg-info-50"
                }`}
              >
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                    r.tone === "warn"
                      ? "bg-warn text-white"
                      : "bg-info text-white"
                  }`}
                >
                  {r.tone === "warn" ? (
                    <AlertTriangle size={14} />
                  ) : (
                    <Calendar size={14} />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="text-[14px] font-medium text-ink">
                    {r.title}
                  </div>
                  <div className="text-[13px] text-ink-muted leading-5">
                    {r.detail}
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
            description={`${done} of ${total} steps complete`}
            action={
              <div className="flex items-center gap-2">
                <div
                  className="h-1.5 w-32 rounded-full bg-line overflow-hidden"
                  aria-label={`${pct}% complete`}
                >
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
            {demo.checklist.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-canvas/60"
              >
                <span
                  className={[
                    "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                    item.done
                      ? "bg-action border-action text-white"
                      : "bg-white border-line text-ink-subtle",
                  ].join(" ")}
                >
                  {item.done ? (
                    <Check size={12} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span
                  className={`text-[14px] ${
                    item.done ? "text-ink-subtle line-through" : "text-ink"
                  }`}
                >
                  {item.label}
                </span>
                {!item.done && (
                  <span className="ml-auto text-[12px] text-primary font-medium">
                    Open
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
            {appointments && appointments.length > 0 ? (
              appointments.map((a) => (
                <div
                  key={a.id}
                  className="rounded-md border border-line p-4 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-medium">{a.title}</span>
                    <Badge
                      tone={
                        a.status.toLowerCase() === "confirmed"
                          ? "primary"
                          : "muted"
                      }
                    >
                      {a.status}
                    </Badge>
                  </div>
                  <div className="text-[13px] text-ink-muted">
                    {a.when} · {a.mode}
                  </div>
                  <div className="text-[12px] text-ink-subtle">with {a.who}</div>
                </div>
              ))
            ) : (
              <p className="text-[13px] text-ink-subtle">
                No upcoming sessions. Ready to{" "}
                <a
                  href="/book"
                  className="text-primary font-medium"
                >
                  book a call
                </a>
                ?
              </p>
            )}
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
            {(docs ?? []).map((d) => (
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
                      {d.name}
                    </div>
                    <div className="text-[12px] text-ink-subtle">
                      {d.uploaded} · {d.size}
                    </div>
                  </div>
                </div>
                <Badge
                  tone={
                    d.status.toLowerCase().includes("verified")
                      ? "success"
                      : d.status.toLowerCase().includes("need")
                      ? "warn"
                      : "info"
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
              <Badge tone="muted">
                {participant?.appliedAt
                  ? `Submitted ${new Date(participant.appliedAt).toLocaleDateString()}`
                  : "Submitted Apr 8"}
              </Badge>
            }
          />
          <CardBody className="grid gap-3 text-[14px]">
            <Row label="Email" value={contactEmail} />
            <Row label="Phone" value={contactPhone} />
            <Row label="Address" value={address} />
            <Row
              label="Education"
              value={participant?.educationLevel ?? demo.intake.education}
            />
            <Row label="Interest" value={demo.intake.interest} />
            <Row label="Employment" value={demo.intake.employment} />
            <Row
              label="Support"
              value={
                (participant?.supportNeeded && participant.supportNeeded.length > 0
                  ? participant.supportNeeded
                  : demo.intake.supportNeeded
                ).join(" · ")
              }
            />
          </CardBody>
          <CardFooter>
            <button className="text-[13px] font-medium text-primary">
              Request a change
            </button>
          </CardFooter>
        </Card>
      </div>
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
