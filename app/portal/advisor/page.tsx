"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PortalShell, StatCard } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { AlertTriangle, ArrowRight, Plus } from "@/components/icons";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  subscribeParticipants,
  type ParticipantListItem,
} from "@/lib/services/participants";
import { countScheduledAppointments } from "@/lib/services/appointments";
import type { ParticipantStatus } from "@/lib/firebase/types";

const stageTone: Record<
  string,
  "info" | "warn" | "primary" | "success" | "muted"
> = {
  New: "info",
  Screened: "muted",
  "Intake complete": "primary",
  Advising: "warn",
  Enrolled: "success",
};

const stages: { key: ParticipantStatus; label: string; description: string }[] = [
  { key: "New", label: "New", description: "Fresh applications" },
  { key: "Screened", label: "Screened", description: "Eligibility passed" },
  {
    key: "Intake complete",
    label: "Intake complete",
    description: "Ready for advisor",
  },
  { key: "Advising", label: "Advising", description: "Active case" },
  { key: "Enrolled", label: "Enrolled", description: "Outcome reached" },
];

export default function AdvisorPipelinePage() {
  return (
    <RoleGuard allow={["advisor", "admin"]}>
      <AdvisorPipeline />
    </RoleGuard>
  );
}

function AdvisorPipeline() {
  const [participants, setParticipants] = useState<ParticipantListItem[]>([]);
  const [callsScheduled, setCallsScheduled] = useState(0);

  useEffect(() => {
    const unsub = subscribeParticipants(setParticipants);
    countScheduledAppointments().then(setCallsScheduled).catch(() => {});
    return () => unsub();
  }, []);

  const stalled = useMemo(
    () => participants.filter((p) => p.risk && p.risk !== "ok"),
    [participants]
  );

  const newThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400_000;
    return participants.filter(
      (p) =>
        p.submittedAtISO && new Date(p.submittedAtISO).getTime() > weekAgo
    ).length;
  }, [participants]);

  return (
    <PortalShell
      role="advisor"
      title="Your pipeline"
      subtitle={`${participants.length} active cases across all stages`}
      actions={
        <>
          <LinkButton
            href="/portal/advisor/participants"
            variant="secondary"
            size="sm"
          >
            View all participants
          </LinkButton>
          <LinkButton
            href="/portal/advisor/participants"
            variant="primary"
            size="sm"
          >
            <Plus size={14} /> Log activity
          </LinkButton>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <StatCard
          label="Active cases"
          value={participants.length}
          tone="primary"
          hint="Across 4 pathways"
        />
        <StatCard
          label="New this week"
          value={newThisWeek}
          delta={newThisWeek ? `+${newThisWeek}` : undefined}
          tone="success"
        />
        <StatCard
          label="Calls scheduled"
          value={callsScheduled}
          hint="Across the team"
        />
        <StatCard
          label="At risk"
          value={stalled.length}
          tone="warn"
          hint="Stalled or inactive"
        />
      </div>

      {stalled.length > 0 && (
        <Card className="mb-6 border-warn/30 bg-warn-50/40">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#92400E]" />
                Needs your attention
              </span>
            }
            description={`${stalled.length} cases haven't moved recently`}
            action={
              <Link
                href="/portal/advisor/participants?filter=risk"
                className="text-[13px] font-medium text-primary inline-flex items-center gap-1"
              >
                See all <ArrowRight size={12} />
              </Link>
            }
          />
          <CardBody className="grid gap-2 sm:grid-cols-2">
            {stalled.slice(0, 6).map((p) => (
              <Link
                key={p.id}
                href={`/portal/advisor/participants/${p.id}`}
                className="flex items-center justify-between gap-3 rounded-md border border-line bg-white p-3 hover:border-line-strong"
              >
                <div className="min-w-0">
                  <div className="text-[14px] font-medium truncate">
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="text-[12px] text-ink-subtle">
                    {p.pathway} · last activity {p.lastActivity}
                  </div>
                </div>
                <Badge tone="warn" dot>
                  {p.risk === "inactive" ? "Inactive" : "Stalled"}
                </Badge>
              </Link>
            ))}
          </CardBody>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        {stages.map((stage) => {
          const items = participants.filter((p) => p.status === stage.key);
          return (
            <div
              key={stage.key}
              className="bg-white border border-line rounded-lg p-3 flex flex-col min-h-[420px] shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center justify-between px-1.5 pb-3 mb-2 border-b border-line">
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold tracking-tight">
                    {stage.label}
                  </div>
                  <div className="text-[11px] text-ink-subtle">
                    {stage.description}
                  </div>
                </div>
                <Badge tone={stageTone[stage.key] ?? "muted"}>
                  {items.length}
                </Badge>
              </div>
              <div className="grid gap-2 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-[12px] text-ink-subtle px-1.5 py-3">
                    No cases in this stage.
                  </p>
                ) : (
                  items.map((p) => (
                    <Link
                      key={p.id}
                      href={`/portal/advisor/participants/${p.id}`}
                      className="block rounded-md border border-line bg-white p-3 hover:border-line-strong transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13.5px] font-medium text-ink">
                          {p.firstName} {p.lastName}
                        </span>
                        {p.risk !== "ok" && (
                          <span
                            aria-label={p.risk}
                            className="h-1.5 w-1.5 rounded-full bg-warn"
                          />
                        )}
                      </div>
                      <div className="mt-1 text-[11.5px] text-ink-subtle">
                        {p.pathway}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge tone="muted" size="sm">
                          {p.source}
                        </Badge>
                        <span className="text-[11px] text-ink-subtle">
                          {p.lastActivity}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PortalShell>
  );
}
