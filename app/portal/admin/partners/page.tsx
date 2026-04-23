"use client";

import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { RequireAuth } from "@/components/portal/RequireAuth";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  fetchReferrals,
  mutateReferralStatus,
  type ReferralRow,
} from "@/lib/services/referrals";

type PartnerRow = {
  name: string;
  type: string;
  referrals: number;
  enrolled: number;
  status: "Active" | "Paused";
};

const demoPartners: PartnerRow[] = [
  {
    name: "Bergen Community College",
    type: "College",
    referrals: 84,
    enrolled: 27,
    status: "Active",
  },
  {
    name: "Passaic County Workforce Development",
    type: "Workforce board",
    referrals: 62,
    enrolled: 19,
    status: "Active",
  },
  {
    name: "IBEW — North Jersey",
    type: "Union",
    referrals: 28,
    enrolled: 12,
    status: "Active",
  },
  {
    name: "Hudson County Workforce Development",
    type: "Workforce board",
    referrals: 41,
    enrolled: 11,
    status: "Active",
  },
  {
    name: "Lincoln Tech",
    type: "Training provider",
    referrals: 18,
    enrolled: 6,
    status: "Active",
  },
  {
    name: "North Jersey Workforce Fair",
    type: "Event",
    referrals: 24,
    enrolled: 4,
    status: "Paused",
  },
];

function referralsToPartnerRows(rows: ReferralRow[]): PartnerRow[] {
  const map = new Map<string, PartnerRow>();
  for (const r of rows) {
    const name = r.organizationName || r.referrerName || "Unknown";
    const existing = map.get(name) ?? {
      name,
      type: inferType(name),
      referrals: 0,
      enrolled: 0,
      status: "Active" as const,
    };
    existing.referrals += 1;
    if (r.status?.toLowerCase() === "enrolled") existing.enrolled += 1;
    map.set(name, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.referrals - a.referrals);
}

function inferType(name: string): string {
  const n = name.toLowerCase();
  if (/college|university|academy/.test(n)) return "College";
  if (/workforce|county/.test(n)) return "Workforce board";
  if (/union|local|ibew/.test(n)) return "Union";
  if (/tech|institute|training/.test(n)) return "Training provider";
  if (/fair|event|expo/.test(n)) return "Event";
  return "Partner";
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

export default function AdminPartnersPage() {
  return (
    <RequireAuth requiredRole="admin">
      <Inner />
    </RequireAuth>
  );
}

function Inner() {
  const [referrals, setReferrals] = useState<ReferralRow[] | null>(null);
  const [live, setLive] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { rows, live } = await fetchReferrals();
      if (cancelled) return;
      setReferrals(rows);
      setLive(live);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleStatus(id: string, next: string) {
    setBusyId(id);
    try {
      await mutateReferralStatus(id, next);
      setReferrals((prev) =>
        prev
          ? prev.map((r) => (r.id === id ? { ...r, status: next } : r))
          : prev
      );
    } finally {
      setBusyId(null);
    }
  }

  const partnerRows = useMemo<PartnerRow[]>(() => {
    if (live && referrals && referrals.length > 0) {
      return referralsToPartnerRows(referrals);
    }
    return demoPartners;
  }, [live, referrals]);

  const visibleReferrals = useMemo(() => {
    if (!referrals) return [];
    if (statusFilter === "all") return referrals;
    return referrals.filter(
      (r) => (r.status ?? "").toLowerCase() === statusFilter
    );
  }, [referrals, statusFilter]);

  const totals = useMemo(() => {
    const total = partnerRows.reduce((n, p) => n + p.referrals, 0);
    const enrolled = partnerRows.reduce((n, p) => n + p.enrolled, 0);
    return { total, enrolled };
  }, [partnerRows]);

  return (
    <PortalShell
      role="admin"
      title="Partners"
      subtitle="Referral pipeline and outcomes by partner."
    >
      <div className="grid gap-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Total referrals" value={totals.total} />
          <Stat label="Converted to enrolled" value={totals.enrolled} />
          <Stat
            label="Conversion rate"
            value={
              totals.total > 0
                ? `${Math.round((totals.enrolled / totals.total) * 100)}%`
                : "—"
            }
          />
        </div>

        <Card className="overflow-hidden">
          <CardHeader
            title="Partner roll-up"
            description={live ? "Live from Data Connect" : "Demo snapshot"}
            action={<Badge tone={live ? "success" : "muted"}>{live ? "Live" : "Demo"}</Badge>}
          />
          <CardBody className="p-0">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-canvas/60 border-y border-line text-[12px] uppercase tracking-wider text-ink-subtle">
                <tr>
                  <th className="px-5 py-3 font-semibold">Partner</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Referrals</th>
                  <th className="px-5 py-3 font-semibold">Enrolled</th>
                  <th className="px-5 py-3 font-semibold">Conversion</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {partnerRows.map((p) => {
                  const pct =
                    p.referrals > 0
                      ? Math.round((p.enrolled / p.referrals) * 100)
                      : 0;
                  return (
                    <tr key={p.name} className="hover:bg-canvas/50">
                      <td className="px-5 py-3 font-medium text-ink">{p.name}</td>
                      <td className="px-5 py-3 text-ink-muted">{p.type}</td>
                      <td className="px-5 py-3 tabular">{p.referrals}</td>
                      <td className="px-5 py-3 tabular">{p.enrolled}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-28 rounded-full bg-line overflow-hidden">
                            <div
                              className="h-full bg-action"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[12px] tabular text-ink-muted">
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={p.status === "Active" ? "success" : "muted"} dot>
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader
            title="Referral inbox"
            description="Individual submissions from the /refer form"
            action={
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-line bg-white px-2 text-[13px] text-ink"
              >
                <option value="all">All statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="linked">Linked</option>
                <option value="enrolled">Enrolled</option>
                <option value="closed">Closed</option>
              </select>
            }
          />
          <CardBody className="p-0">
            {referrals === null ? (
              <div className="px-5 py-6 text-[13px] text-ink-muted">
                Loading referrals…
              </div>
            ) : visibleReferrals.length === 0 ? (
              <div className="px-5 py-6 text-[13px] text-ink-muted">
                No referrals match this filter yet.
              </div>
            ) : (
              <table className="w-full text-left text-[14px]">
                <thead className="bg-canvas/60 border-y border-line text-[12px] uppercase tracking-wider text-ink-subtle">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Applicant</th>
                    <th className="px-5 py-3 font-semibold">Referrer</th>
                    <th className="px-5 py-3 font-semibold">Interest</th>
                    <th className="px-5 py-3 font-semibold">Urgency</th>
                    <th className="px-5 py-3 font-semibold">Submitted</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {visibleReferrals.map((r) => (
                    <tr key={r.id} className="hover:bg-canvas/50">
                      <td className="px-5 py-3">
                        <div className="font-medium text-ink">
                          {r.applicantFirstName} {r.applicantLastName}
                        </div>
                        <div className="text-[12px] text-ink-subtle">
                          {r.applicantEmail}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-muted">
                        <div className="font-medium text-ink">
                          {r.referrerName}
                        </div>
                        <div className="text-[12px] text-ink-subtle">
                          {r.organizationName}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-muted">
                        {r.programInterest}
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          tone={
                            r.urgency?.toLowerCase() === "high"
                              ? "danger"
                              : r.urgency?.toLowerCase() === "low"
                                ? "muted"
                                : "warn"
                          }
                        >
                          {r.urgency || "—"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-ink-muted tabular">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          tone={
                            r.status === "enrolled"
                              ? "success"
                              : r.status === "closed"
                                ? "muted"
                                : r.status === "linked"
                                  ? "primary"
                                  : "info"
                          }
                        >
                          {r.status || "new"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={busyId === r.id}
                            onClick={() => handleStatus(r.id, "contacted")}
                          >
                            Mark contacted
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={busyId === r.id}
                            onClick={() => handleStatus(r.id, "closed")}
                          >
                            Close
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-line bg-white p-4">
      <div className="text-[12px] uppercase tracking-wider text-ink-subtle">
        {label}
      </div>
      <div className="mt-1 text-[22px] font-semibold tracking-tight text-ink tabular">
        {value}
      </div>
    </div>
  );
}
