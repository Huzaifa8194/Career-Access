import { PortalShell } from "@/components/portal/PortalShell";
import { RequireAuth } from "@/components/portal/RequireAuth";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Partners" };

const partners = [
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

export default function AdminPartnersPage() {
  return (
    <RequireAuth requiredRole="admin">
      <Inner />
    </RequireAuth>
  );
}

function Inner() {
  return (
    <PortalShell
      role="admin"
      title="Partners"
      subtitle="Referral pipeline and outcomes by partner."
    >
      <Card className="overflow-hidden">
        <CardHeader title="Partner referrals" description="Last 90 days" />
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
              {partners.map((p) => {
                const pct = Math.round((p.enrolled / p.referrals) * 100);
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
    </PortalShell>
  );
}
