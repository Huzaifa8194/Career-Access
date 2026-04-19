import Link from "next/link";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { participants, type ParticipantStatus } from "@/lib/data";
import { Search, ArrowRight } from "@/components/icons";

export const metadata = { title: "Participants" };

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

export default function AdvisorParticipantsPage() {
  return (
    <PortalShell
      role="advisor"
      title="Participants"
      subtitle="All participants assigned to you, plus unassigned cases."
      actions={
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
          />
          <input
            type="search"
            placeholder="Search by name, ZIP, or program"
            className="h-9 w-72 rounded-md border border-line bg-white pl-9 pr-3 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["All", "Advising", "Intake complete", "Screened", "Inactive"].map(
          (f, i) => (
            <button
              key={f}
              className={[
                "h-8 rounded-md px-3 text-[13px] font-medium border transition-colors",
                i === 0
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-ink-muted border-line hover:text-ink",
              ].join(" ")}
            >
              {f}
            </button>
          )
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-canvas/60 border-b border-line text-[12px] uppercase tracking-wider text-ink-subtle">
              <tr>
                <Th>Name</Th>
                <Th>Pathway</Th>
                <Th>Status</Th>
                <Th>Source</Th>
                <Th>Last activity</Th>
                <Th>Risk</Th>
                <Th className="text-right pr-5">—</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {participants.map((p) => (
                <tr key={p.id} className="hover:bg-canvas/50">
                  <Td>
                    <Link
                      href={`/portal/advisor/participants/${p.id}`}
                      className="font-medium text-ink"
                    >
                      {p.firstName} {p.lastName}
                    </Link>
                    <div className="text-[12px] text-ink-subtle">
                      {p.email}
                    </div>
                  </Td>
                  <Td>{p.pathway}</Td>
                  <Td>
                    <Badge tone={statusTone[p.status]}>{p.status}</Badge>
                  </Td>
                  <Td>{p.source}</Td>
                  <Td className="text-ink-muted">{p.lastActivity}</Td>
                  <Td>
                    {p.risk && p.risk !== "ok" ? (
                      <Badge tone="warn" dot>
                        {p.risk === "inactive" ? "Inactive" : "Stalled"}
                      </Badge>
                    ) : (
                      <span className="text-ink-subtle text-[12px]">—</span>
                    )}
                  </Td>
                  <Td className="text-right pr-5">
                    <Link
                      href={`/portal/advisor/participants/${p.id}`}
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-primary"
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
    </PortalShell>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-5 py-3 font-semibold text-[12px] ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3 align-top ${className}`}>{children}</td>;
}
