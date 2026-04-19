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
  Calendar,
  Mail,
  ArrowRight,
} from "@/components/icons";

const steps = [{ label: "Schedule" }, { label: "Confirmation" }];

export const metadata = { title: "Appointment confirmed" };

export default function BookConfirmationPage() {
  return (
    <FlowShell
      steps={steps}
      current={1}
      side={
        <FlowSidebar
          title="Need to reschedule?"
          blurb="Use the link in your confirmation email or contact us — no penalty."
        >
          <LinkButton href="/contact" variant="secondary" size="sm">
            Contact us
          </LinkButton>
        </FlowSidebar>
      }
    >
      <div className="bg-white border border-line rounded-lg p-8 sm:p-10 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-action-50 text-action">
            <Check size={20} />
          </span>
          <Badge tone="success" dot>
            Appointment confirmed
          </Badge>
        </div>
        <h1 className="mt-5 text-[32px] sm:text-[40px] font-semibold tracking-tight leading-[1.05]">
          You're on the calendar.
        </h1>
        <p className="mt-3 text-[16px] text-ink-muted leading-7 max-w-xl">
          We've sent a confirmation to your email with a calendar invite and a
          link to join.
        </p>

        <Card className="mt-8 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider text-ink-subtle">
                <Calendar size={14} /> Your appointment
              </span>
              <p className="mt-2 text-[18px] font-semibold tracking-tight">
                Tuesday, Apr 22 · 10:30 AM ET
              </p>
              <p className="text-[13px] text-ink-muted mt-1">
                30 minutes · Video call · with Maya Robinson
              </p>
            </div>
            <Badge tone="primary">Confirmed</Badge>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3 border-t border-line pt-5">
            <div>
              <div className="text-[12px] uppercase tracking-wider text-ink-subtle">
                Type
              </div>
              <div className="text-[14px] mt-1">General advising</div>
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-wider text-ink-subtle">
                Mode
              </div>
              <div className="text-[14px] mt-1">Video (link in email)</div>
            </div>
            <div>
              <div className="text-[12px] uppercase tracking-wider text-ink-subtle">
                Reference
              </div>
              <div className="text-[14px] mt-1 font-mono">CA-APT-2026-0931</div>
            </div>
          </div>
        </Card>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary">
              <Mail size={16} />
            </span>
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight">
              Check your email
            </h3>
            <p className="mt-1 text-[13px] text-ink-muted leading-6">
              The calendar invite includes the join link, agenda, and your
              advisor's contact info.
            </p>
          </Card>
          <Card className="p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary">
              <Check size={16} />
            </span>
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight">
              Want a head start?
            </h3>
            <p className="mt-1 text-[13px] text-ink-muted leading-6">
              Apply now and your advisor will arrive prepared.
            </p>
            <div className="mt-3">
              <LinkButton href="/apply" variant="primary" size="sm">
                Start application <ArrowRight size={14} />
              </LinkButton>
            </div>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center px-3 h-12 text-[14px] font-medium text-ink-muted hover:text-ink"
          >
            Back to home
          </Link>
          <LinkButton href="/portal/participant" variant="secondary" size="lg">
            Go to your portal
          </LinkButton>
        </div>
      </div>
    </FlowShell>
  );
}
