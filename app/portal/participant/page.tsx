import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { participantSummary } from "@/lib/data";
import {
  Check,
  Clock,
  ArrowRight,
  Calendar,
  FileText,
  AlertTriangle,
  Sparkle,
  MessageSquare,
} from "@/components/icons";

export const metadata = { title: "Participant dashboard" };

export default function ParticipantDashboard() {
  const s = participantSummary;
  const total = s.checklist.length;
  const done = s.checklist.filter((c) => c.done).length;
  const pct = Math.round((done / total) * 100);

  return (
    <PortalShell
      role="participant"
      title="Welcome back, Jordan."
      subtitle="Here's what's next on your pathway."
      actions={
        <>
          <LinkButton
            href="/portal/participant/messages"
            variant="secondary"
            size="sm"
          >
            <MessageSquare size={14} />
            Message advisor
          </LinkButton>
          <LinkButton href="/book" variant="primary" size="sm">
            Book a session
          </LinkButton>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Pathway hero */}
        <Card className="p-6 sm:p-7 bg-gradient-to-br from-primary to-[#15296a] text-white border-0">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider text-white/80">
              <Sparkle size={14} /> Your pathway
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-2.5 py-1 text-[12px] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-action" /> On track
            </span>
          </div>
          <h2 className="mt-3 text-[26px] sm:text-[30px] font-semibold tracking-tight leading-tight text-white">
            {s.pathway}
          </h2>
          <p className="mt-1.5 text-white/80 text-[14px] leading-6 max-w-md">
            Working with {s.advisor} to enroll for the fall semester.
          </p>

          <div className="mt-6 rounded-md border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-[12px] uppercase tracking-wider text-white/70">
                Your next step
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-amber-200">
                <Clock size={12} /> Due {s.nextStepDue}
              </span>
            </div>
            <p className="mt-1.5 text-[18px] font-semibold tracking-tight text-white">
              {s.nextStep}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <LinkButton
                href="/portal/participant/documents"
                variant="action"
                size="sm"
              >
                Upload documents <ArrowRight size={14} />
              </LinkButton>
              <span className="text-[12px] text-white/70">
                Or message {s.advisor.split(" ")[0]} if you have questions
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <MiniStat label="Pathway" value={s.pathway.split(" ")[0]} />
            <MiniStat label="Progress" value={`${pct}%`} />
            <MiniStat label="Advisor" value={s.advisor.split(" ")[0]} />
          </div>
        </Card>

        {/* Reminders */}
        <Card>
          <CardHeader
            title="Reminders"
            description="Time-sensitive items only"
            action={<Badge tone="warn">{s.reminders.length} active</Badge>}
          />
          <CardBody className="grid gap-3">
            {s.reminders.map((r) => (
              <div
                key={r.title}
                className={`rounded-md border p-4 flex gap-3 ${
                  r.tone === "warn"
                    ? "border-warn/20 bg-warn-50"
                    : "border-info/15 bg-info-50"
                }`}
              >
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                    r.tone === "warn"
                      ? "bg-warn text-white"
                      : "bg-info text-white"
                  }`}
                >
                  {r.tone === "warn" ? (
                    <AlertTriangle size={14} />
                  ) : (
                    <Calendar size={14} />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="text-[14px] font-medium text-ink">
                    {r.title}
                  </div>
                  <div className="text-[13px] text-ink-muted leading-5">
                    {r.detail}
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Checklist */}
        <Card>
          <CardHeader
            title="Your checklist"
            description={`${done} of ${total} steps complete`}
            action={
              <div className="flex items-center gap-2">
                <div
                  className="h-1.5 w-32 rounded-full bg-line overflow-hidden"
                  aria-label={`${pct}% complete`}
                >
                  <div
                    className="h-full bg-action transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[12px] tabular text-ink-muted">
                  {pct}%
                </span>
              </div>
            }
          />
          <CardBody className="grid gap-1.5">
            {s.checklist.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-canvas/60"
              >
                <span
                  className={[
                    "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                    item.done
                      ? "bg-action border-action text-white"
                      : "bg-white border-line text-ink-subtle",
                  ].join(" ")}
                >
                  {item.done ? (
                    <Check size={12} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span
                  className={`text-[14px] ${
                    item.done ? "text-ink-subtle line-through" : "text-ink"
                  }`}
                >
                  {item.label}
                </span>
                {!item.done && (
                  <span className="ml-auto text-[12px] text-primary font-medium">
                    Open
                  </span>
                )}
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Appointments */}
        <Card>
          <CardHeader
            title="Upcoming appointments"
            action={
              <LinkButton
                href="/portal/participant/appointments"
                variant="ghost"
                size="sm"
              >
                See all
              </LinkButton>
            }
          />
          <CardBody className="grid gap-3">
            {s.appointments.map((a) => (
              <div
                key={a.title}
                className="rounded-md border border-line p-4 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium">{a.title}</span>
                  <Badge tone={a.status === "Confirmed" ? "primary" : "muted"}>
                    {a.status}
                  </Badge>
                </div>
                <div className="text-[13px] text-ink-muted">
                  {a.when} · {a.mode}
                </div>
                <div className="text-[12px] text-ink-subtle">with {a.who}</div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Lower row: documents + intake summary */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader
            title="Documents"
            description="Upload what your advisor requests"
            action={
              <LinkButton
                href="/portal/participant/documents"
                variant="ghost"
                size="sm"
              >
                Manage
              </LinkButton>
            }
          />
          <CardBody className="grid gap-2">
            {s.documents.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between gap-3 border border-line rounded-md p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-canvas text-ink-muted">
                    <FileText size={14} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium truncate">
                      {d.name}
                    </div>
                    <div className="text-[12px] text-ink-subtle">
                      {d.uploaded} · {d.size}
                    </div>
                  </div>
                </div>
                <Badge
                  tone={
                    d.status === "Verified"
                      ? "success"
                      : d.status === "Needed"
                        ? "warn"
                        : "muted"
                  }
                  dot
                >
                  {d.status}
                </Badge>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Your intake snapshot"
            action={<Badge tone="muted">Submitted Apr 8</Badge>}
          />
          <CardBody className="grid gap-3 text-[14px]">
            <Row label="Email" value={s.intake.contact.email} />
            <Row label="Phone" value={s.intake.contact.phone} />
            <Row label="Address" value={s.intake.contact.address} />
            <Row label="Education" value={s.intake.education} />
            <Row label="Interest" value={s.intake.interest} />
            <Row label="Employment" value={s.intake.employment} />
            <Row
              label="Support"
              value={s.intake.supportNeeded.join(" · ")}
            />
          </CardBody>
          <CardFooter>
            <button className="text-[13px] font-medium text-primary">
              Request a change
            </button>
          </CardFooter>
        </Card>
      </div>
    </PortalShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/15 bg-white/5 p-3">
      <div className="text-[11px] uppercase tracking-wider text-white/70">
        {label}
      </div>
      <div className="mt-0.5 text-[15px] font-semibold tracking-tight text-white">
        {value}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 items-baseline">
      <span className="text-[12px] uppercase tracking-wider text-ink-subtle">
        {label}
      </span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
