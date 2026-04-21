import Image from "next/image";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { SectionHeader } from "@/components/site/SectionHeader";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  GraduationCap,
  Wrench,
  Briefcase,
  FileText,
  Compass,
  ArrowRight,
  Check,
} from "@/components/icons";

export const metadata = { title: "Services" };

const services = [
  {
    icon: <GraduationCap size={18} />,
    title: "College applications",
    summary:
      "Pick programs that match your goal and finish applications without losing time.",
    bullets: [
      "Program shortlist based on your interest and ZIP",
      "Application support for community colleges and four-year transfers",
      "Help with letters, essays, and prior-credit evaluation",
    ],
  },
  {
    icon: <Wrench size={18} />,
    title: "Job training",
    summary:
      "Find short-term certifications matched to in-demand local roles.",
    bullets: [
      "Curated list of credentialed training partners",
      "Funding pathways: WIOA, employer-paid, and partner scholarships",
      "Placement support after completion",
    ],
  },
  {
    icon: <Briefcase size={18} />,
    title: "Apprenticeships",
    summary:
      "Earn while you learn through union and employer apprenticeships.",
    bullets: [
      "Direct intros to apprenticeship coordinators",
      "Application coaching, including math and physical assessments",
      "Wraparound support during the first 90 days on the job",
    ],
  },
  {
    icon: <FileText size={18} />,
    title: "FAFSA support",
    summary:
      "Sit with someone who has done thousands of FAFSAs. Done in one session.",
    bullets: [
      "Document checklist before your appointment",
      "Live screen-share or in-person FAFSA workshops",
      "State and partner aid in addition to federal",
    ],
  },
  {
    icon: <Compass size={18} />,
    title: "Career guidance",
    summary:
      "Talk to an advisor who knows the local labor market — not a script.",
    bullets: [
      "Career assessment grounded in your goals and constraints",
      "Wage and outlook data for your region",
      "Resume, interview prep, and warm intros where possible",
    ],
  },
];

export default function ServicesPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Services"
        title="Five services. One front door."
        description="No referral merry-go-round. Every service is delivered in-house or through a vetted partner — and your advisor coordinates the handoff."
        actions={
          <>
            <LinkButton href="/apply" variant="primary" size="lg">
              Apply Now <ArrowRight size={16} />
            </LinkButton>
            <LinkButton href="/book" variant="secondary" size="lg">
              Book an Advising Call
            </LinkButton>
          </>
        }
      />

      <section className="mx-auto max-w-6xl px-5 lg:px-8 py-16 sm:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <Card key={s.title} className="p-6">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary">
                  {s.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[18px] font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] text-ink-muted leading-6">
                    {s.summary}
                  </p>
                </div>
              </div>
              <ul className="mt-5 grid gap-2.5">
                {s.bullets.map((b) => (
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
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-line">
        <div className="mx-auto max-w-6xl px-5 lg:px-8 pt-16 pb-10 sm:pb-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="relative overflow-hidden rounded-2xl border border-line bg-canvas shadow-[var(--shadow-card)] order-last lg:order-first">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/2.jpeg"
                  alt="A Career Access Hub advisor walking a participant through his options"
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover object-left-top scale-[1.08]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent"
                />
                <div className="absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-action" />
                  1:1 Advising
                </div>
              </div>
            </div>
            <div>
              <SectionHeader
                eyebrow="What's included"
                title="Every participant gets the same baseline of support"
              />
              <div className="mt-8 grid gap-px sm:grid-cols-1 bg-line border border-line rounded-lg overflow-hidden">
                {[
              {
                k: "1:1",
                t: "Dedicated advisor",
                d: "A real person, by name, who responds within two business days.",
              },
              {
                k: "1",
                t: "Written plan",
                d: "Pathway, checklist, and deadlines — delivered in your portal.",
              },
              {
                k: "∞",
                t: "Follow-up",
                d: "Reminders, check-ins, and re-engagement until you reach an outcome.",
              },
                ].map((b) => (
                  <div
                    key={b.t}
                    className="bg-white p-6 flex items-start gap-5"
                  >
                    <div className="text-[24px] font-semibold tabular tracking-tight text-primary shrink-0 w-10">
                      {b.k}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold tracking-tight">
                        {b.t}
                      </h3>
                      <p className="mt-1.5 text-[14px] text-ink-muted leading-6">
                        {b.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
