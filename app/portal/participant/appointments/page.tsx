"use client";

import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Calendar, Clock } from "@/components/icons";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/lib/firebase/auth";
import { useParticipantContext } from "@/lib/hooks/useParticipantContext";
import {
  subscribeAppointmentsForParticipant,
  updateAppointmentStatus,
  type AppointmentRow,
} from "@/lib/services/appointments";

export default function AppointmentsPage() {
  return (
    <RoleGuard allow={["participant"]}>
      <Appointments />
    </RoleGuard>
  );
}

function Appointments() {
  const { user, profile } = useAuth();
  const { participantId } = useParticipantContext();
  const [rows, setRows] = useState<AppointmentRow[]>([]);

  useEffect(() => {
    const keys = Array.from(
      new Set(
        [
          participantId,
          profile?.participantId,
          user?.uid,
          user?.uid ? `user-${user.uid}` : null,
        ].filter(Boolean) as string[]
      )
    );
    if (keys.length === 0) {
      setRows([]);
      return;
    }
    const byId = new Map<string, AppointmentRow>();
    const unsubs = keys.map((k) =>
      subscribeAppointmentsForParticipant(k, (nextRows) => {
        for (const r of nextRows) byId.set(r.id, r);
        const merged = Array.from(byId.values()).sort((a, b) =>
          (a.scheduledAtISO ?? "").localeCompare(b.scheduledAtISO ?? "")
        );
        setRows(merged);
      })
    );
    return () => {
      unsubs.forEach((u) => u());
    };
  }, [participantId, profile?.participantId, user?.uid]);

  const now = Date.now();
  const upcoming = useMemo(
    () =>
      rows.filter(
        (a) =>
          a.status !== "completed" &&
          a.status !== "cancelled" &&
          (!a.scheduledAtISO ||
            new Date(a.scheduledAtISO).getTime() >= now - 3600_000)
      ),
    [rows, now]
  );
  const past = useMemo(
    () =>
      rows.filter(
        (a) =>
          a.status === "completed" ||
          (a.scheduledAtISO &&
            new Date(a.scheduledAtISO).getTime() < now - 3600_000)
      ),
    [rows, now]
  );

  return (
    <PortalShell
      role="participant"
      title="Appointments"
      subtitle="Sessions with your advisor and partner programs."
      actions={
        <LinkButton href="/book" variant="primary" size="sm">
          Book a new session
        </LinkButton>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader title="Upcoming" description="Next sessions" />
          <CardBody className="grid gap-3">
            {upcoming.length === 0 && (
              <div className="text-[13px] text-ink-muted py-3">
                No upcoming sessions.{" "}
                <a className="text-primary" href="/book">
                  Book one →
                </a>
              </div>
            )}
            {upcoming.map((a) => (
              <div
                key={a.id}
                className="rounded-md border border-line p-4 grid gap-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary">
                      <Calendar size={16} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold tracking-tight">
                        {a.appointmentType}
                      </div>
                      <div className="text-[13px] text-ink-muted">
                        {a.scheduledDate} · {a.scheduledTime} {a.timezone}
                      </div>
                    </div>
                  </div>
                  <Badge
                    tone={a.status === "confirmed" ? "primary" : "muted"}
                  >
                    {a.status}
                  </Badge>
                </div>
                <div className="text-[13px] text-ink-muted flex items-center gap-3 pt-2 border-t border-line flex-wrap">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} /> 30 min
                  </span>
                  <span>·</span>
                  <span>{a.mode}</span>
                  {a.advisorName && (
                    <>
                      <span>·</span>
                      <span>with {a.advisorName}</span>
                    </>
                  )}
                  <button
                    onClick={() =>
                      updateAppointmentStatus(a.id, "cancelled").catch(() => {})
                    }
                    className="ml-auto text-ink-muted hover:text-danger font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Past sessions" />
          <CardBody className="grid gap-3 text-[14px]">
            {past.length === 0 && (
              <div className="text-[13px] text-ink-muted">
                No past sessions yet.
              </div>
            )}
            {past.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border border-line rounded-md p-3"
              >
                <div>
                  <div className="font-medium text-ink">
                    {p.appointmentType}
                  </div>
                  <div className="text-[12px] text-ink-subtle">
                    {p.scheduledDate} ·{" "}
                    {p.advisorName ?? "Career Access advisor"}
                  </div>
                </div>
                <Badge tone={p.status === "completed" ? "success" : "muted"}>
                  {p.status}
                </Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}
