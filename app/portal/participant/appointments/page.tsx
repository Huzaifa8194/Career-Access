import Link from "next/link";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Calendar, ArrowRight, Clock } from "@/components/icons";
import { participantSummary } from "@/lib/data";

export const metadata = { title: "Appointments" };

export default function AppointmentsPage() {
  return (
    <PortalShell
      role="participant"
      title="Appointments"
      subtitle="Sessions with your advisor and partner programs."
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
            {participantSummary.appointments.map((a) => (
              <div
                key={a.title}
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
                  <Badge tone={a.status === "Confirmed" ? "primary" : "muted"}>
                    {a.status}
                  </Badge>
                </div>
                <div className="text-[13px] text-ink-muted flex items-center gap-3 pt-2 border-t border-line">
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
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Past sessions" />
          <CardBody className="grid gap-3 text-[14px]">
            {[
              { title: "Intro call", when: "Apr 10", who: "Maya Robinson" },
              { title: "FAFSA pre-check", when: "Apr 14", who: "Maya Robinson" },
            ].map((p) => (
              <div
                key={p.title + p.when}
                className="flex items-center justify-between border border-line rounded-md p-3"
              >
                <div>
                  <div className="font-medium text-ink">{p.title}</div>
                  <div className="text-[12px] text-ink-subtle">
                    {p.when} · {p.who}
                  </div>
                </div>
                <Badge tone="muted">Completed</Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}
