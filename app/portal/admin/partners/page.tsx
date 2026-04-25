"use client";

import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DetailGrid, DetailModal } from "@/components/ui/DetailModal";
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
  const [selectedReferral, setSelectedReferral] = useState<ReferralRow | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<PartnerRow | null>(null);

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
                      <tr
                        key={p.name}
                        className="hover:bg-canvas/50 cursor-pointer"
                        onClick={() => setSelectedPartner(p)}
                      >
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
                className="w-full rounded-md border border-line p-3 hover:border-primary/30 hover:bg-canvas/40"
              >
                <div className="flex items-start justify-between gap-3">
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
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReferral(r)}
                    className="text-[12px] font-medium text-primary hover:underline"
                  >
                    View full intake details
                  </button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <DetailModal
        open={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        title="Partner performance details"
        subtitle="Aggregated referral outcomes"
      >
        {selectedPartner && (
          <div className="grid gap-4">
            <DetailGrid
              rows={[
                { label: "Partner", value: selectedPartner.name },
                { label: "Total referrals", value: selectedPartner.referrals },
                { label: "Contacted", value: selectedPartner.contacted },
                { label: "Enrolled", value: selectedPartner.enrolled },
                {
                  label: "Conversion",
                  value: selectedPartner.referrals
                    ? `${Math.round((selectedPartner.enrolled / selectedPartner.referrals) * 100)}%`
                    : "0%",
                },
                {
                  label: "Latest referral",
                  value: selectedPartner.latest
                    ? new Date(selectedPartner.latest).toLocaleString()
                    : "—",
                },
              ]}
            />
            <div className="rounded-md border border-line p-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                Recent submissions for this partner
              </p>
              <ul className="mt-3 grid gap-2">
                {referrals
                  .filter((r) => (r.organizationName || "Individual referrers") === selectedPartner.name)
                  .slice(0, 8)
                  .map((r) => (
                    <li key={r.id} className="rounded-md border border-line bg-canvas/40 p-2.5 text-[13px]">
                      {r.applicantFirstName} {r.applicantLastName} · {r.programInterest} · {r.status}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </DetailModal>

      <DetailModal
        open={!!selectedReferral}
        onClose={() => setSelectedReferral(null)}
        title="Referral intake details"
        subtitle="Complete data captured in referral form"
      >
        {selectedReferral && (
          <DetailGrid
            rows={[
              { label: "Record ID", value: selectedReferral.id },
              { label: "Referrer name", value: selectedReferral.referrerName },
              { label: "Organization", value: selectedReferral.organizationName },
              { label: "Referrer email", value: selectedReferral.email },
              { label: "Referrer phone", value: selectedReferral.phone || "Not provided" },
              {
                label: "Applicant name",
                value: `${selectedReferral.applicantFirstName} ${selectedReferral.applicantLastName}`,
              },
              { label: "Applicant email", value: selectedReferral.applicantEmail },
              { label: "Applicant phone", value: selectedReferral.applicantPhone },
              { label: "ZIP code", value: selectedReferral.zipCode },
              { label: "Program interest", value: selectedReferral.programInterest },
              { label: "Urgency", value: selectedReferral.urgency },
              { label: "Status", value: selectedReferral.status },
              {
                label: "Submitted at",
                value: selectedReferral.createdAtISO
                  ? new Date(selectedReferral.createdAtISO).toLocaleString()
                  : "Unknown",
              },
              { label: "Reason for referral", value: selectedReferral.reasonForReferral },
            ]}
          />
        )}
      </DetailModal>
    </PortalShell>
  );
}
