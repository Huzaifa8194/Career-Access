import Link from "next/link";
import { PortalShell, StatCard } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { participants, pipelineStages } from "@/lib/data";
import { AlertTriangle, ArrowRight, Plus } from "@/components/icons";

export const metadata = { title: "Advisor pipeline" };

const stageTone: Record<string, "info" | "warn" | "primary" | "success" | "muted"> = {
  New: "info",
  Screened: "muted",
  "Intake complete": "primary",
  Advising: "warn",
  Enrolled: "success",
};

export default function AdvisorPipeline() {
  const myCases = participants.filter(
    (p) => p.assignedAdvisor === "Maya Robinson" || !p.assignedAdvisor
  );
  const stalled = participants.filter((p) => p.risk && p.risk !== "ok");

  return (
    <PortalShell
      role="advisor"
      title="Your pipeline"
      subtitle="Cases assigned to Maya Robinson · 18 active"
      actions={
        <>
          <LinkButton
            href="/portal/advisor/participants"
            variant="secondary"
            size="sm"
          >
            View all participants
          </LinkButton>
          <LinkButton href="#" variant="primary" size="sm">
            <Plus size={14} /> Log activity
          </LinkButton>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <StatCard
          label="Active cases"
          value={myCases.length}
          tone="primary"
          hint="Across 4 pathways"
        />
        <StatCard
          label="New this week"
          value={3}
          delta="+2"
          tone="success"
        />
        <StatCard
          label="Calls scheduled"
          value={6}
          hint="Next 5 business days"
        />
        <StatCard
          label="At risk"
          value={stalled.length}
          tone="warn"
          hint="Stalled or inactive"
        />
      </div>

      {/* Risk strip */}
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
            {stalled.map((p) => (
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

      {/* Pipeline */}
      <div className="grid gap-4 lg:grid-cols-5">
        {pipelineStages.map((stage) => {
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
                        {p.risk && p.risk !== "ok" && (
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
