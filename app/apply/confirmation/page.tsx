import Link from "next/link";
import {
  FlowShell,
  FlowSidebar,
} from "@/components/site/FlowShell";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Check,
  ArrowRight,
  Calendar,
  Mail,
  FileText,
} from "@/components/icons";

const steps = [
  { label: "Eligibility" },
  { label: "Intake" },
  { label: "Confirmation" },
];

export const metadata = { title: "Application received" };

export default function ApplyConfirmationPage() {
  const refId = "CA-2026-04-1042";
  return (
    <FlowShell
      steps={steps}
      current={2}
      exitLabel="Back to home"
      side={
        <div className="grid gap-4">
          <FlowSidebar
            title="Reference"
            blurb="Save this for your records. We've also emailed it to you."
          >
            <div className="rounded-md border border-line bg-canvas/60 p-3 font-mono text-[13px] tracking-tight">
              {refId}
            </div>
          </FlowSidebar>
          <FlowSidebar title="Want to skip the wait?">
            <p className="text-[13px] text-ink-muted leading-6">
              You can book a 30-minute advising call now and start working on
              your plan right away.
            </p>
            <LinkButton href="/book" variant="primary" size="sm">
              Book a call
            </LinkButton>
          </FlowSidebar>
        </div>
      }
    >
      <div className="bg-white border border-line rounded-lg p-8 sm:p-10 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-action-50 text-action">
            <Check size={20} />
          </span>
          <Badge tone="success" dot>
            Application received
          </Badge>
        </div>
        <h1 className="mt-5 text-[32px] sm:text-[40px] font-semibold tracking-tight leading-[1.05]">
          Thank you. We've got it from here.
        </h1>
        <p className="mt-3 text-[16px] text-ink-muted leading-7 max-w-xl">
          Your application has been submitted and routed to advising. A real
          person will be in touch within two business days.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: <FileText size={16} />,
              title: "We review",
              copy: "Our team confirms eligibility and assigns your pathway.",
            },
            {
              icon: <Mail size={16} />,
              title: "We reach out",
              copy: "Expect a call or email in 2 business days.",
            },
            {
              icon: <Calendar size={16} />,
              title: "We meet",
              copy: "You'll book a 30-minute working session with your advisor.",
            },
          ].map((s, i) => (
            <Card key={s.title} className="p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary">
                  {s.icon}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="mt-3 text-[15px] font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-1 text-[13px] text-ink-muted leading-6">
                {s.copy}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/book" variant="primary" size="lg">
            Book a call now <ArrowRight size={16} />
          </LinkButton>
          <LinkButton
            href="/portal/participant"
            variant="secondary"
            size="lg"
          >
            Go to your portal
          </LinkButton>
          <Link
            href="/"
            className="inline-flex items-center px-3 h-12 text-[14px] font-medium text-ink-muted hover:text-ink"
          >
            Back to home
          </Link>
        </div>
      </div>
    </FlowShell>
  );
}
