import Link from "next/link";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { SectionHeader } from "@/components/site/SectionHeader";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  Building,
  Users,
  Shield,
  ChartBar,
  FileText,
  Check,
} from "@/components/icons";

export const metadata = { title: "For partners" };

export default function PartnersPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="For partners"
        title="A shared front door for your participants — without adding work."
        description="Workforce boards, libraries, community-based organizations, and employers refer adults to Career Access. We close the loop with case management and reporting."
        actions={
          <>
            <LinkButton href="/refer" variant="primary" size="lg">
              Refer someone <ArrowRight size={16} />
            </LinkButton>
            <LinkButton href="/contact" variant="secondary" size="lg">
              Become a partner
            </LinkButton>
          </>
        }
      />

      <section className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: <Building size={18} />,
              title: "Workforce boards",
              copy: "Route adults who walk in or call but aren't a fit for your funded programs today.",
            },
            {
              icon: <Users size={18} />,
              title: "Community-based orgs",
              copy: "Hand off intake to a partner who can manage the next 90 days.",
            },
            {
              icon: <Shield size={18} />,
              title: "Employers + unions",
              copy: "Get a steady, vetted referral pipeline for entry-level and apprenticeship roles.",
            },
          ].map((c) => (
            <Card key={c.title} className="p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary">
                {c.icon}
              </span>
              <h3 className="mt-4 text-[18px] font-semibold tracking-tight">
                {c.title}
              </h3>
              <p className="mt-1.5 text-[14px] text-ink-muted leading-6">
                {c.copy}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-line">
        <div className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-start">
            <div>
              <SectionHeader
                eyebrow="What you get"
                title="A real partnership, not a portal you forget about"
                copy="Partners get a referral form, a status dashboard, and quarterly outcome reporting tied to your participants."
              />
              <ul className="mt-6 grid gap-3">
                {[
                  "Branded referral link for your team",
                  "Real-time status updates on every referral",
                  "Quarterly outcome data filterable by partner",
                  "Co-branded materials for your front desk",
                  "Dedicated partner liaison",
                ].map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-3 text-[15px] text-ink"
                  >
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-action-50 text-action">
                      <Check size={12} />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <LinkButton href="/contact" variant="primary">
                  Start a partnership conversation
                </LinkButton>
                <Link
                  href="/refer"
                  className="inline-flex items-center gap-1.5 px-2 py-2 text-[14px] font-medium text-primary"
                >
                  Or refer someone now <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold tracking-tight">
                  Partner snapshot
                </h3>
                <Badge tone="primary" dot>
                  Q2 view
                </Badge>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {[
                  { v: "248", l: "Referrals received" },
                  { v: "92%", l: "Reached within 48h" },
                  { v: "67", l: "Enrolled or placed" },
                  { v: "12", l: "Active partners" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="rounded-md border border-line p-4 bg-canvas/50"
                  >
                    <div className="text-[22px] font-semibold tabular tracking-tight">
                      {s.v}
                    </div>
                    <div className="text-[12px] uppercase tracking-wider text-ink-subtle mt-1">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-md border border-line bg-primary-50/40 p-4 flex items-start gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
                  <ChartBar size={16} />
                </span>
                <div className="text-[13px] text-ink leading-5">
                  <p className="font-medium">Quarterly partner report</p>
                  <p className="text-ink-muted">
                    Aggregated outcomes are sent to every partner the first
                    week of each quarter.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
        <SectionHeader
          eyebrow="Reporting"
          title="The metrics partners ask for, in one place"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: "Referral volume", d: "By month, source, and ZIP" },
            { t: "Time to advisor", d: "Median and 90th percentile" },
            { t: "Pathway distribution", d: "Where participants are routed" },
            { t: "Outcome rate", d: "Enrolled, placed, or completed" },
          ].map((m) => (
            <Card key={m.t} className="p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary">
                <FileText size={16} />
              </span>
              <h3 className="mt-3 text-[15px] font-semibold tracking-tight">
                {m.t}
              </h3>
              <p className="mt-1.5 text-[13px] text-ink-muted leading-6">
                {m.d}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
