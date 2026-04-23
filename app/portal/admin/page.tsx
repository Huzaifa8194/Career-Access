"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PortalShell, StatCard } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight, ChartBar } from "@/components/icons";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { fetchAdminMetrics, type AdminMetrics } from "@/lib/services/metrics";
import {
  subscribeParticipants,
  type ParticipantListItem,
} from "@/lib/services/participants";
import type { ParticipantStatus } from "@/lib/firebase/types";

const statusTone: Record<
  ParticipantStatus,
  "info" | "primary" | "success" | "warn" | "muted"
> = {
  New: "info",
  Screened: "muted",
  "Intake complete": "primary",
  Advising: "warn",
  Enrolled: "success",
  Inactive: "muted",
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

export default function AdminOverviewPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <AdminOverview />
    </RoleGuard>
  );
}

function AdminOverview() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [participants, setParticipants] = useState<ParticipantListItem[]>([]);

  useEffect(() => {
    fetchAdminMetrics().then(setMetrics).catch(() => setMetrics(null));
    const unsub = subscribeParticipants(setParticipants);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (participants.length) {
      fetchAdminMetrics().then(setMetrics).catch(() => {});
    }
  }, [participants.length]);

  const recent = useMemo(() => participants.slice(0, 8), [participants]);

  return (
    <PortalShell
      role="admin"
      title="Dashboard Overview"
      subtitle="Operational view across all applicants and partners."
      actions={
        <>
          <LinkButton
            href="/portal/admin/participants"
            variant="secondary"
            size="sm"
          >
            All applicants
          </LinkButton>
          <LinkButton
            href="/portal/admin/partners"
            variant="primary"
            size="sm"
          >
            Partner report
          </LinkButton>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          label="Total Applicants"
          value={(metrics?.totalApplicants ?? 0).toLocaleString()}
          tone="primary"
        />
        <StatCard
          label="New This Week"
          value={metrics?.newThisWeek ?? 0}
          delta={metrics?.newThisWeek ? `+${metrics.newThisWeek}` : undefined}
          tone="success"
        />
        <StatCard
          label="Calls Scheduled"
          value={metrics?.callsScheduled ?? 0}
          hint="Scheduled or confirmed"
        />
        <StatCard
          label="Enrolled"
          value={metrics?.enrolled ?? 0}
          tone="success"
        />
      </div>

      <Card className="mb-6">
        <CardHeader
          title="Participants by stage"
          description="Live pipeline counts across all advisors"
          action={
            <Link
              href="/portal/advisor"
              className="text-[13px] font-medium text-primary inline-flex items-center gap-1"
            >
              Open pipeline <ArrowRight size={12} />
            </Link>
          }
        />
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {stages.map((stage) => {
              const count = metrics?.stageCounts[stage.key] ?? 0;
              return (
                <div
                  key={stage.key}
                  className="rounded-md border border-line bg-canvas/40 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium uppercase tracking-wider text-ink-subtle">
                      {stage.label}
                    </span>
                    <Badge tone={statusTone[stage.key]} size="sm">
                      {count}
                    </Badge>
                  </div>
                  <div className="mt-2 text-[24px] font-semibold tabular tracking-tight">
                    {count}
                  </div>
                  <p className="mt-1 text-[12px] text-ink-subtle leading-5">
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] mb-6">
        <Card>
          <CardHeader
            title="Pathway distribution"
            description="Where intake routes participants"
            action={
              <Badge tone="muted" size="sm">
                All-time
              </Badge>
            }
          />
          <CardBody className="grid gap-4">
            {(metrics?.pathwayDistribution ?? []).map((p) => (
              <DistRow
                key={p.label}
                label={p.label}
                value={p.value}
                count={p.count}
              />
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Source mix"
            description="How applicants find us"
          />
          <CardBody className="grid gap-4">
            {(metrics?.sourceDistribution ?? []).map((p) => (
              <DistRow
                key={p.label}
                label={p.label}
                value={p.value}
                count={p.count}
                accent="muted"
              />
            ))}
            <Link
              href="/portal/admin/partners"
              className="text-[13px] font-medium text-primary inline-flex items-center gap-1"
            >
              See partner referrals <ArrowRight size={12} />
            </Link>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Applicants by Status"
          description="Most recent intakes across all advisors"
          action={
            <Link
              href="/portal/admin/participants"
              className="text-[13px] font-medium text-primary inline-flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-canvas/60 border-y border-line text-[12px] uppercase tracking-wider text-ink-subtle">
              <tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Source</Th>
                <Th>Date Submitted</Th>
                <Th>Assigned To</Th>
                <Th className="text-right pr-5">&nbsp;</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recent.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-6 text-center text-[13px] text-ink-muted"
                  >
                    No applicants yet.
                  </td>
                </tr>
              )}
              {recent.map((p) => (
                <tr key={p.id} className="hover:bg-canvas/50">
                  <Td>
                    <Link
                      href={`/portal/admin/participants/${p.id}`}
                      className="font-medium text-ink"
                    >
                      {p.firstName} {p.lastName}
                    </Link>
                    <div className="text-[12px] text-ink-subtle">
                      {p.pathway}
                    </div>
                  </Td>
                  <Td>
                    <Badge tone={statusTone[p.status]}>{p.status}</Badge>
                  </Td>
                  <Td>{p.source}</Td>
                  <Td className="text-ink-muted">{p.appliedAt || "—"}</Td>
                  <Td>
                    {p.assignedAdvisorName ?? (
                      <span className="text-ink-subtle italic">Unassigned</span>
                    )}
                  </Td>
                  <Td className="text-right pr-5">
                    <Link
                      href={`/portal/admin/participants/${p.id}`}
                      className="text-[13px] font-medium text-primary inline-flex items-center gap-1"
                    >
                      Open <ArrowRight size={12} />
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Weekly submissions"
            description="Applicants submitted in the last 8 weeks"
          />
          <CardBody>
            <BarChart rows={weeklyBuckets(participants)} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Reporting"
            description="Partner outcomes"
            action={
              <Badge tone="primary" dot>
                Live
              </Badge>
            }
          />
          <CardBody className="grid gap-3">
            <div className="rounded-md border border-line p-4 flex items-start gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
                <ChartBar size={16} />
              </span>
              <div className="text-[13px] leading-5">
                <p className="font-medium text-ink">
                  Aggregated outcomes report
                </p>
                <p className="text-ink-muted">
                  Pulls directly from Firestore — always current.
                </p>
              </div>
            </div>
            <Link
              href="/portal/admin/partners"
              className="text-[13px] font-medium text-primary"
            >
              Partner segment view →
            </Link>
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}

function DistRow({
  label,
  value,
  count,
  accent = "primary",
}: {
  label: string;
  value: number;
  count: number;
  accent?: "primary" | "muted";
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] text-ink">{label}</span>
        <span className="text-[12px] tabular text-ink-muted">
          {count} · {value}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
        <div
          className={`h-full ${
            accent === "primary" ? "bg-primary" : "bg-ink-muted"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-5 py-3 font-semibold text-[12px] ${className}`}>
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-5 py-3 align-top ${className}`}>{children}</td>;
}

function weeklyBuckets(rows: ParticipantListItem[]) {
  const buckets: { w: string; apps: number; enr: number }[] = [];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const start = new Date(now);
    start.setDate(now.getDate() - i * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    const bucket = { w: `W${8 - i}`, apps: 0, enr: 0 };
    for (const r of rows) {
      if (!r.submittedAtISO) continue;
      const t = new Date(r.submittedAtISO).getTime();
      if (t >= start.getTime() && t < end.getTime()) {
        bucket.apps += 1;
        if (r.status === "Enrolled") bucket.enr += 1;
      }
    }
    buckets.push(bucket);
  }
  return buckets;
}

function BarChart({
  rows,
}: {
  rows: { w: string; apps: number; enr: number }[];
}) {
  const max = Math.max(1, ...rows.map((d) => d.apps));
  return (
    <div>
      <div className="flex items-end gap-3 h-44">
        {rows.map((d) => (
          <div
            key={d.w}
            className="flex-1 flex flex-col items-center gap-1 min-w-0"
          >
            <div className="w-full flex items-end justify-center gap-1 h-full">
              <div
                className="w-3 rounded-t bg-primary/80"
                style={{ height: `${(d.apps / max) * 100}%` }}
                aria-label={`${d.apps} applicants`}
              />
              <div
                className="w-3 rounded-t bg-action"
                style={{ height: `${(d.enr / max) * 100}%` }}
                aria-label={`${d.enr} enrolled`}
              />
            </div>
            <span className="text-[11px] text-ink-subtle tabular">{d.w}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-5 text-[12px] text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-primary/80" /> Applicants
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-action" /> Enrolled
        </span>
      </div>
    </div>
  );
}
