import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  Compass,
  Users,
  Sparkle,
  Check,
} from "@/components/icons";
import Link from "next/link";

export const metadata = { title: "Get started" };

const paths = [
  {
    icon: <Compass size={20} />,
    tag: "5–7 minutes",
    title: "Apply for yourself",
    copy: "Best if you know you want help with college, training, an apprenticeship, or HSE.",
    bullets: [
      "Eligibility screener + structured intake",
      "Pathway assigned automatically",
      "Advisor reaches out in 2 business days",
    ],
    cta: { href: "/apply", label: "Start application" },
    accent: "primary" as const,
  },
  {
    icon: <Users size={20} />,
    tag: "For partners",
    title: "Refer someone",
    copy: "Best if you're an organization, advisor, or family member submitting on behalf of someone.",
    bullets: [
      "Capture both referrer + applicant info",
      "We follow up directly with the applicant",
      "Status updates sent to the referrer",
    ],
    cta: { href: "/refer", label: "Open referral form" },
    accent: "muted" as const,
  },
  {
    icon: <Sparkle size={20} />,
    tag: "30-min, free",
    title: "Book an advising call",
    copy: "Best if you'd like to talk through options before committing to a pathway.",
    bullets: [
      "Choose a time that works",
      "Phone or video, your choice",
      "Get written notes after the call",
    ],
    cta: { href: "/book", label: "Pick a time" },
    accent: "muted" as const,
  },
];

export default function GetStartedPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Get started"
        title="Pick the door that fits."
        description="Three ways in. All free. All lead to the same outcome — a real plan and a real advisor."
      />

      <section className="mx-auto max-w-6xl px-5 lg:px-8 pt-16 pb-10 sm:pt-20 sm:pb-12">
        <div className="grid gap-5 lg:grid-cols-3">
          {paths.map((p) => (
            <Card
              key={p.title}
              className={`p-6 flex flex-col ${
                p.accent === "primary" ? "border-primary/30" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary">
                  {p.icon}
                </span>
                <Badge tone={p.accent === "primary" ? "primary" : "muted"}>
                  {p.tag}
                </Badge>
              </div>
              <h3 className="mt-5 text-[20px] font-semibold tracking-tight">
                {p.title}
              </h3>
              <p className="mt-1.5 text-[14px] text-ink-muted leading-6">
                {p.copy}
              </p>
              <ul className="mt-5 grid gap-2.5">
                {p.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex gap-2.5 text-[14px] text-ink leading-6"
                  >
                    <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-action-50 text-action">
                      <Check size={11} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-line">
                <LinkButton
                  href={p.cta.href}
                  variant={p.accent === "primary" ? "primary" : "secondary"}
                  className="w-full"
                >
                  {p.cta.label}
                  <ArrowRight size={14} />
                </LinkButton>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-14 rounded-lg border border-line bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-semibold tracking-tight">
              Already started? Pick up where you left off.
            </h3>
            <p className="mt-1 text-[14px] text-ink-muted">
              Sign in to your portal to see your pathway and next step.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/portal/participant"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
            >
              Open participant portal <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
