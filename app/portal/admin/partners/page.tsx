"use client";

import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  subscribeReferrals,
  updateReferralStatus,
  type ReferralRow,
} from "@/lib/services/referrals";

export default function AdminPartnersPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <AdminPartners />
    </RoleGuard>
  );
}

type PartnerRow = {
  name: string;
  referrals: number;
  contacted: number;
  enrolled: number;
  latest: string;
};

function AdminPartners() {
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);

  useEffect(() => subscribeReferrals(setReferrals), []);

  const partners = useMemo<PartnerRow[]>(() => {
    const map = new Map<string, PartnerRow>();
    for (const r of referrals) {
      const key = r.organizationName || "Individual referrers";
      const existing =
        map.get(key) ??
        ({ name: key, referrals: 0, contacted: 0, enrolled: 0, latest: "" } as PartnerRow);
      existing.referrals += 1;
      if (r.status === "contacted" || r.status === "intake") existing.contacted += 1;
      if (r.status === "enrolled") existing.enrolled += 1;
      if (r.createdAtISO && r.createdAtISO > existing.latest) {
        existing.latest = r.createdAtISO;
      }
      map.set(key, existing);
    }
    return Array.from(map.values()).sort((a, b) => b.referrals - a.referrals);
  }, [referrals]);

  return (
    <PortalShell
      role="admin"
      title="Partners"
      subtitle="Referral pipeline and outcomes by partner."
    >
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader
            title="Partner referrals"
            description={`${referrals.length} total referrals`}
          />
          <CardBody className="p-0">
            {partners.length === 0 ? (
              <div className="p-6 text-[13px] text-ink-muted">
                No referrals yet.
              </div>
            ) : (
              <table className="w-full text-left text-[14px]">
                <thead className="bg-canvas/60 border-y border-line text-[12px] uppercase tracking-wider text-ink-subtle">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Partner</th>
                    <th className="px-5 py-3 font-semibold">Referrals</th>
                    <th className="px-5 py-3 font-semibold">Contacted</th>
                    <th className="px-5 py-3 font-semibold">Enrolled</th>
                    <th className="px-5 py-3 font-semibold">Conversion</th>
                    <th className="px-5 py-3 font-semibold">Latest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {partners.map((p) => {
                    const pct = p.referrals
                      ? Math.round((p.enrolled / p.referrals) * 100)
                      : 0;
                    return (
                      <tr key={p.name} className="hover:bg-canvas/50">
                        <td className="px-5 py-3 font-medium text-ink">
                          {p.name}
                        </td>
                        <td className="px-5 py-3 tabular">{p.referrals}</td>
                        <td className="px-5 py-3 tabular">{p.contacted}</td>
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
                        <td className="px-5 py-3 text-[12px] text-ink-muted">
                          {p.latest
                            ? new Date(p.latest).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Latest referrals"
            description="From your referral form"
          />
          <CardBody className="grid gap-2">
            {referrals.length === 0 && (
              <div className="text-[13px] text-ink-muted">No referrals yet.</div>
            )}
            {referrals.slice(0, 20).map((r) => (
              <div
                key={r.id}
                className="flex items-start justify-between gap-3 rounded-md border border-line p-3"
              >
                <div className="min-w-0">
                  <div className="text-[14px] font-medium text-ink">
                    {r.applicantFirstName} {r.applicantLastName}
                  </div>
                  <div className="text-[12px] text-ink-subtle truncate">
                    From {r.organizationName} · {r.programInterest}
                  </div>
                  <div className="text-[12px] text-ink-subtle">
                    Urgency: {r.urgency}
                  </div>
                </div>
                <select
                  value={r.status}
                  onChange={(e) =>
                    updateReferralStatus(
                      r.id,
                      e.target.value as ReferralRow["status"]
                    ).catch(() => {})
                  }
                  className="h-8 rounded-md border border-line bg-white px-2 text-[12px]"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="intake">Intake</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="closed">Closed</option>
                </select>
                <Badge
                  tone={
                    r.status === "enrolled"
                      ? "success"
                      : r.status === "closed"
                      ? "muted"
                      : "primary"
                  }
                  dot
                >
                  {r.status}
                </Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}
