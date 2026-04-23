"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalShell, StatCard } from "@/components/portal/PortalShell";
import { RequireAuth } from "@/components/portal/RequireAuth";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { pipelineStages, type ParticipantStatus } from "@/lib/data";
import { ArrowRight, ChartBar } from "@/components/icons";
import { fetchAdminSnapshot, type AdminSnapshot } from "@/lib/services/admin";

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

export default function AdminOverviewPage() {
  return (
    <RequireAuth requiredRole="admin">
      <AdminOverviewInner />
    </RequireAuth>
  );
}

function AdminOverviewInner() {
  const [snap, setSnap] = useState<AdminSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAdminSnapshot();
        if (!cancelled) setSnap(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stageCount = (k: ParticipantStatus) => snap?.stageCounts?.[k] ?? 0;

  return (
    <PortalShell
      role="admin"
      title="Dashboard Overview"
      subtitle={
        snap?.live
          ? "Operational view across all applicants and partners."
          : "Operational view — showing sample data until the Firebase backend is deployed."
      }
      actions={
        <>
          <LinkButton
            href="/portal/admin/participants"
            variant="secondary"
            size="sm"
          >
            All applicants
          </LinkButton>
          <LinkButton href="#" variant="primary" size="sm">
            Export quarterly report
          </LinkButton>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          label="Total Applicants"
          value={(snap?.totalApplicants ?? 0).toLocaleString()}
          delta={loading ? "Loading…" : snap?.live ? undefined : "Demo data"}
          tone="primary"
        />
        <StatCard
          label="New This Week"
          value={snap?.newThisWeek ?? 0}
          tone="success"
        />
        <StatCard
          label="Calls Scheduled"
          value={snap?.callsScheduled ?? 0}
          hint="Next 5 business days"
        />
        <StatCard
          label="Enrolled"
          value={snap?.enrolled ?? 0}
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
            {pipelineStages.map((stage) => {
              const count = stageCount(stage.key);
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
                {snap?.live ? "Live" : "Sample"}
              </Badge>
            }
          />
          <CardBody className="grid gap-4">
            {(snap?.pathwayDistribution ?? []).map((p) => (
              <DistRow key={p.label} label={p.label} value={p.pct} />
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Source mix"
            description="How applicants find us"
          />
          <CardBody className="grid gap-4">
            {(snap?.sourceDistribution ?? []).map((p) => (
              <DistRow
                key={p.label}
                label={p.label}
                value={p.pct}
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
              {(snap?.recent ?? []).map((p) => (
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
                    <Badge tone={statusTone[p.status as ParticipantStatus] ?? "muted"}>
                      {p.status}
                    </Badge>
                  </Td>
                  <Td>{p.source}</Td>
                  <Td className="text-ink-muted">{p.submittedAt}</Td>
                  <Td>
                    {p.assignedAdvisor ?? (
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
              {!loading && (snap?.recent ?? []).length === 0 ? (
                <tr>
                  <Td className="text-ink-subtle">No applicants yet.</Td>
                  <Td />
                  <Td />
                  <Td />
                  <Td />
                  <Td />
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Quarterly trend"
            description="Applicants & enrollments by week"
          />
          <CardBody>
            <BarChart />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Reporting"
            description="Send to partners"
            action={
              <Badge tone="primary" dot>
                Q2
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
                  Auto-sent to active partners on May 1.
                </p>
              </div>
            </div>
            <button className="text-[13px] font-medium text-primary text-left">
              Customize partner segments →
            </button>
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}

function DistRow({
  label,
  value,
  accent = "primary",
}: {
  label: string;
  value: number;
  accent?: "primary" | "muted";
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] text-ink">{label}</span>
        <span className="text-[12px] tabular text-ink-muted">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
        <div
          className={`h-full ${accent === "primary" ? "bg-primary" : "bg-ink-muted"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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
  children?: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-5 py-3 align-top ${className}`}>{children}</td>;
}

function BarChart() {
  const data = [
    { w: "W1", apps: 64, enr: 14 },
    { w: "W2", apps: 72, enr: 17 },
    { w: "W3", apps: 88, enr: 22 },
    { w: "W4", apps: 81, enr: 19 },
    { w: "W5", apps: 96, enr: 24 },
    { w: "W6", apps: 110, enr: 31 },
    { w: "W7", apps: 102, enr: 28 },
    { w: "W8", apps: 124, enr: 36 },
  ];
  const max = Math.max(...data.map((d) => d.apps));
  return (
    <div>
      <div className="flex items-end gap-3 h-44">
        {data.map((d) => (
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
