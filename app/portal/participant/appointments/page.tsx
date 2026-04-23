"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { RequireAuth } from "@/components/portal/RequireAuth";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Calendar, ArrowRight, Clock } from "@/components/icons";
import { participantSummary } from "@/lib/data";
import {
  fetchMyAppointments,
  type AppointmentRow,
} from "@/lib/services/appointments";

type AppointmentView = {
  id: string;
  title: string;
  when: string;
  mode: string;
  status: string;
  who: string;
  past: boolean;
};

function formatWhen(iso: string, tz: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const fmt = d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `${fmt} ${tz}`;
}

function buildDemoView(): AppointmentView[] {
  return participantSummary.appointments.map((a, i) => ({
    id: `demo_${i}`,
    title: a.title,
    when: a.when,
    mode: a.mode,
    status: a.status,
    who: a.who,
    past: false,
  }));
}

export default function AppointmentsPage() {
  return (
    <RequireAuth requiredRole="participant">
      <Inner />
    </RequireAuth>
  );
}

function Inner() {
  const [upcoming, setUpcoming] = useState<AppointmentView[]>([]);
  const [past, setPast] = useState<AppointmentView[]>([]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { rows, live: apptsLive } = await fetchMyAppointments();
      if (cancelled) return;
      setLive(apptsLive);
      const now = Date.now();
      if (apptsLive && rows.length > 0) {
        const mapped: AppointmentView[] = rows.map((r: AppointmentRow) => ({
          id: r.id,
          title: r.appointmentType || "Advising session",
          when: formatWhen(r.scheduledAt, r.timezone),
          mode: "Video",
          status: (r.status ?? "Confirmed").replace(/(^.)/, (c) => c.toUpperCase()),
          who: r.advisor?.fullName ?? "Career Access Hub advisor",
          past: r.scheduledAt ? new Date(r.scheduledAt).getTime() < now : false,
        }));
        setUpcoming(mapped.filter((a) => !a.past));
        setPast(mapped.filter((a) => a.past));
      } else {
        setUpcoming(buildDemoView());
        setPast([
          {
            id: "demo_past1",
            title: "Intro call",
            when: "Apr 10",
            mode: "Video",
            status: "Completed",
            who: "Maya Robinson",
            past: true,
          },
          {
            id: "demo_past2",
            title: "FAFSA pre-check",
            when: "Apr 14",
            mode: "Video",
            status: "Completed",
            who: "Maya Robinson",
            past: true,
          },
        ]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PortalShell
      role="participant"
      title="Appointments"
      subtitle={
        live
          ? "Sessions with your advisor and partner programs."
          : "Sessions with your advisor — sample data until your account is live."
      }
      actions={
        <LinkButton href="/book" variant="primary" size="sm">
          Book a new session
        </LinkButton>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader title="Upcoming" description="Next 30 days" />
          <CardBody className="grid gap-3">
            {upcoming.length === 0 ? (
              <p className="text-[13px] text-ink-subtle">
                No upcoming sessions yet.{" "}
                <Link href="/book" className="text-primary font-medium">
                  Book your first call
                </Link>
                .
              </p>
            ) : (
              upcoming.map((a) => (
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
                          {a.title}
                        </div>
                        <div className="text-[13px] text-ink-muted">
                          {a.when}
                        </div>
                      </div>
                    </div>
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
                  <div className="text-[13px] text-ink-muted flex items-center gap-3 pt-2 border-t border-line flex-wrap">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={12} /> 30 min
                    </span>
                    <span>·</span>
                    <span>{a.mode}</span>
                    <span>·</span>
                    <span>with {a.who}</span>
                    <Link
                      href="#"
                      className="ml-auto text-primary font-medium inline-flex items-center gap-1"
                    >
                      Manage <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Past sessions" />
          <CardBody className="grid gap-3 text-[14px]">
            {past.length === 0 ? (
              <p className="text-[13px] text-ink-subtle">
                Your previous sessions will appear here.
              </p>
            ) : (
              past.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border border-line rounded-md p-3"
                >
                  <div>
                    <div className="font-medium text-ink">{p.title}</div>
                    <div className="text-[12px] text-ink-subtle">
                      {p.when} · {p.who}
                    </div>
                  </div>
                  <Badge tone="muted">{p.status}</Badge>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}
