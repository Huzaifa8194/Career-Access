import Link from "next/link";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { SectionHeader } from "@/components/site/SectionHeader";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  Compass,
  Sparkle,
  GraduationCap,
  Wrench,
  Briefcase,
  FileText,
  Check,
} from "@/components/icons";

export const metadata = { title: "How it works" };

const phases = [
  {
    label: "Apply",
    duration: "5–7 minutes",
    icon: <Compass size={18} />,
    blurb:
      "Start with a short eligibility screener, then a structured intake. You'll never lose your place — your answers save as you go.",
    steps: [
      "Eligibility screener (6 questions)",
      "Intake form: contact, education, employment",
      "Tell us what support you need",
      "Optional: upload documents you already have",
    ],
  },
  {
    label: "Get support",
    duration: "Within 2 business days",
    icon: <Sparkle size={18} />,
    blurb:
      "We assign your pathway and connect you to a real advisor. No phone trees, no chatbots, no losing your place in line.",
    steps: [
      "Pathway assigned: college, training, apprenticeship, or HSE",
      "Advisor reaches out by your preferred contact method",
      "Schedule a 30-minute working session",
      "Get a written plan in your portal",
    ],
  },
  {
    label: "Move forward",
    duration: "Until you're enrolled",
    icon: <ArrowRight size={18} />,
    blurb:
      "We stay with you until you've reached an outcome. Your portal tracks every milestone and reminds you of what's next.",
    steps: [
      "Document checklist with deadlines",
      "FAFSA / application support sessions",
      "Confirmation of enrollment or placement",
      "Optional 90-day check-ins after you start",
    ],
  },
];

const pathways = [
  {
    name: "College + FAFSA",
    icon: <GraduationCap size={16} />,
    desc: "For learners pursuing a degree or transfer plan.",
  },
  {
    name: "Short-term training",
    icon: <Wrench size={16} />,
    desc: "Job-ready certificates in 8–24 weeks.",
  },
  {
    name: "Apprenticeship",
    icon: <Briefcase size={16} />,
    desc: "Earn a wage while you train, often through unions.",
  },
  {
    name: "GED / HSE",
    icon: <FileText size={16} />,
    desc: "Foundational credential first, then choose a path.",
  },
];

export default function HowItWorksPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="How it works"
        title="A clear, deliberate path from intent to enrollment."
        description="Three phases. One advisor. A portal that shows you exactly what's next — so you never wonder what to do."
        actions={
          <>
            <LinkButton href="/apply" variant="primary" size="lg">
              Apply now <ArrowRight size={16} />
            </LinkButton>
            <LinkButton href="/book" variant="secondary" size="lg">
              Talk first
            </LinkButton>
          </>
        }
      />

      <section className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {phases.map((phase, i) => (
            <Card key={phase.label} className="p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-primary">
                  Phase {String(i + 1).padStart(2, "0")}
                </span>
                <Badge tone="muted">{phase.duration}</Badge>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary">
                  {phase.icon}
                </span>
                <h3 className="text-[20px] font-semibold tracking-tight">
                  {phase.label}
                </h3>
              </div>
              <p className="mt-3 text-[14px] text-ink-muted leading-6">
                {phase.blurb}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {phase.steps.map((s) => (
                  <li
                    key={s}
                    className="flex gap-2.5 text-[14px] text-ink leading-6"
                  >
                    <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-action-50 text-action">
                      <Check size={11} />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-line">
        <div className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
          <SectionHeader
            eyebrow="Pathway routing"
            title="Where your application goes — and why"
            copy="After intake, every participant is routed to one of four pathways. You'll see your assignment in the portal, and your advisor will explain why."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pathways.map((p) => (
              <Card key={p.name} className="p-5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary">
                    {p.icon}
                  </span>
                  <h3 className="text-[15px] font-semibold tracking-tight">
                    {p.name}
                  </h3>
                </div>
                <p className="mt-3 text-[13px] text-ink-muted leading-6">
                  {p.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 lg:px-8 pt-20 pb-10 sm:pb-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-start">
          <div>
            <SectionHeader
              eyebrow="What to expect"
              title="No dead ends. Ever."
              copy="Every participant has an advisor, a written plan, and a portal. If you stall, we follow up — that's the case-management model that makes this work."
            />
            <ul className="mt-6 flex flex-col gap-3">
              {[
                "Advisor responds within two business days",
                "Plan delivered in writing — not just over the phone",
                "Reminders for documents and appointments",
                "Confidential and free, paid by partner agencies",
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
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/apply" variant="primary">
                Start your application
              </LinkButton>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 px-2 py-2 text-[14px] font-medium text-primary"
              >
                See services <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <Card className="p-6">
            <h3 className="text-[15px] font-semibold tracking-tight">
              Frequently asked
            </h3>
            <div className="mt-4 divide-y divide-line">
              {[
                {
                  q: "Is there a cost?",
                  a: "No. Career Access is free and confidential.",
                },
                {
                  q: "How long does it take?",
                  a: "Apply in about 7 minutes. Most participants reach an advisor within 48 hours.",
                },
                {
                  q: "Do I need documents to apply?",
                  a: "No documents are required to apply. Your advisor will tell you what to upload later.",
                },
                {
                  q: "What if I'm not sure what I want to do?",
                  a: "That's the most common starting point. Begin with an advising call.",
                },
              ].map((f) => (
                <div key={f.q} className="py-4">
                  <p className="text-[14px] font-medium text-ink">{f.q}</p>
                  <p className="text-[14px] text-ink-muted leading-6 mt-1">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
