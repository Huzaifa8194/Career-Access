import {
  FlowShell,
  FlowSidebar,
} from "@/components/site/FlowShell";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check, ArrowRight, Mail } from "@/components/icons";
import Link from "next/link";

const steps = [{ label: "Referral" }, { label: "Confirmation" }];

export const metadata = { title: "Referral submitted" };

export default function ReferConfirmationPage() {
  return (
    <FlowShell
      steps={steps}
      current={1}
      side={
        <FlowSidebar
          title="Want to refer another?"
          blurb="You can submit as many as you like. Each one is tracked separately."
        >
          <LinkButton href="/refer" variant="secondary" size="sm">
            Submit another
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
            Referral submitted
          </Badge>
        </div>
        <h1 className="mt-5 text-[32px] sm:text-[40px] font-semibold tracking-tight leading-[1.05]">
          Thanks — we'll take it from here.
        </h1>
        <p className="mt-3 text-[16px] text-ink-muted leading-7 max-w-xl">
          We'll reach out to the applicant within two business days using the
          contact details you provided. You'll get a status email once they've
          been reached.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary">
              <Mail size={16} />
            </span>
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight">
              You'll hear from us
            </h3>
            <p className="mt-1 text-[13px] text-ink-muted leading-6">
              A status update lands in your inbox once the applicant has been
              contacted and intake begins.
            </p>
          </Card>
          <Card className="p-5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary">
              <Check size={16} />
            </span>
            <h3 className="mt-3 text-[15px] font-semibold tracking-tight">
              Reporting is automatic
            </h3>
            <p className="mt-1 text-[13px] text-ink-muted leading-6">
              Active partners see all referrals and outcomes in their quarterly
              report.
            </p>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/refer" variant="primary" size="lg">
            Submit another referral <ArrowRight size={16} />
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
