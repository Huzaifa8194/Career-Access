import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { SectionHeader } from "@/components/site/SectionHeader";
import { PortalPreviewCard } from "@/components/site/PortalPreviewCard";
import { TrustedPartnersSection } from "@/components/site/TrustedPartnersSection";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  GraduationCap,
  Wrench,
  Briefcase,
  FileText,
  Compass,
  Sparkle,
  Users,
  Clock,
} from "@/components/icons";

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <TrustedPartnersSection />
      <ThreeWaysIn />
      <PathwayHubSection />
      <HowItWorksPreview />
      <ServicesGrid />
      <Audience />
      <OutcomesStrip />
      <Stories />
    </SiteShell>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden surface-hero">
      <div aria-hidden className="absolute inset-0 grid-bg opacity-50 max-md:opacity-40" />
      {/* Mobile: soft bottom fade into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas to-transparent md:hidden"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-5 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 lg:pt-24 lg:pb-24">
        <div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-line/90 bg-white/95 px-3 py-2 text-[11px] sm:text-[12px] text-ink-muted shadow-sm ring-1 ring-black/[0.04]">
              <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-action shadow-[0_0_0_3px_rgba(74,222,128,0.25)]" />
              <span className="leading-snug font-medium">
                Free, confidential support · Bergen · Passaic · Hudson
              </span>
            </div>
            <h1 className="mt-5 sm:mt-6 text-[clamp(1.875rem,6vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.025em] text-balance">
              Your Next Step
              <br />
              <span className="text-primary">Starts Here</span>
            </h1>
            <p className="mt-4 sm:mt-5 max-w-xl text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed text-ink-muted">
              Career Access Hub helps adults in Bergen, Passaic, and Hudson
              Counties explore college, training, and apprenticeship pathways
              with guided support from first step to enrollment.
            </p>

            {/* Mobile: actions grouped in one elevated panel */}
            <div className="mt-7 max-md:rounded-2xl max-md:border max-md:border-line/80 max-md:bg-white max-md:p-3 max-md:shadow-[var(--shadow-elevated)] md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3 md:gap-3">
                <LinkButton
                  href="/apply"
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto justify-center min-h-[3rem] shadow-sm"
                >
                  Apply Now
                  <ArrowRight size={16} />
                </LinkButton>
                <LinkButton
                  href="/book"
                  size="lg"
                  variant="action"
                  className="w-full sm:w-auto justify-center min-h-[3rem] shadow-sm"
                >
                  Book an Advising Call
                </LinkButton>
                <LinkButton
                  href="/refer"
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto justify-center min-h-[3rem] bg-white"
                >
                  Refer a Participant
                </LinkButton>
              </div>
            </div>

            <div className="mt-6 sm:mt-9 max-w-xl lg:max-w-none">
              <p className="sr-only">Key service metrics</p>
              <p className="mb-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle sm:mb-3">
                At a glance
              </p>
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)] ring-1 ring-black/[0.03]">
                <dl className="grid grid-cols-3 divide-x divide-line">
                  <HeroStat
                    value="7 min"
                    label="To apply"
                    icon={<Compass size={15} strokeWidth={1.7} />}
                  />
                  <HeroStat
                    value="2 days"
                    label="Avg. response"
                    icon={<Clock size={15} strokeWidth={1.7} />}
                  />
                  <HeroStat
                    value="1:1"
                    label="Advisor support"
                    labelCompact="Advisor"
                    icon={<Users size={15} strokeWidth={1.7} />}
                  />
                </dl>
              </div>
            </div>
          </div>
          <div className="min-w-0 lg:pt-1 max-md:pt-1">
            <HeroAside />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  value,
  label,
  labelCompact,
  icon,
}: {
  value: string;
  label: string;
  labelCompact?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex min-h-[5.75rem] flex-col items-center justify-center px-1.5 py-3.5 text-center sm:min-h-0 sm:items-stretch sm:px-5 sm:py-5 sm:text-left">
      {icon && (
        <div
          className="mb-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-primary/[0.09] to-primary/[0.04] text-primary ring-1 ring-primary/10 sm:mb-0 sm:hidden"
          aria-hidden
        >
          {icon}
        </div>
      )}
      <dt className="text-[9px] font-semibold uppercase leading-tight tracking-[0.08em] text-ink-subtle sm:text-[12px] sm:leading-normal sm:tracking-[0.12em]">
        {labelCompact ? (
          <>
            <span className="sm:hidden">{labelCompact}</span>
            <span className="hidden sm:inline">{label}</span>
          </>
        ) : (
          label
        )}
      </dt>
      <dd className="mt-1 text-[1.125rem] font-semibold leading-none tracking-tight text-ink tabular-nums sm:mt-1.5 sm:text-[24px]">
        {value}
      </dd>
    </div>
  );
}

function HeroAside() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-elevated)]">
      <div className="relative aspect-[5/4] w-full">
        <Image
          src="/5.jpeg"
          alt="Adult learner receiving career and education guidance"
          fill
          priority
          sizes="(min-width: 1024px) 430px, (min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="border-t border-line bg-canvas px-4 py-3 sm:px-5">
        <p className="text-[14px] leading-snug text-ink">
          Local advising support for college, training, and apprenticeship
          pathways.
        </p>
      </div>
    </div>
  );
}

function PathwayHubSection() {
  return (
    <section className="bg-white border-y border-line">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <PortalPreviewCard />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeader
              eyebrow="Your pathway, in one place"
              title="Track every step with one clear participant experience"
              copy="From first conversation to enrollment, participants and advisors stay aligned in one place with milestones, reminders, and next actions."
            />
            <div className="mt-6">
              <LinkButton href="/how-it-works" variant="outline" size="md">
                See how the journey works <ArrowRight size={14} />
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ThreeWaysIn() {
  const cards = [
    {
      icon: <Compass size={18} />,
      title: "Apply",
      tag: "5–7 minutes",
      copy: "Tell us your goal. We'll match you with a pathway and an advisor.",
      href: "/apply",
      cta: "Start application",
    },
    {
      icon: <Users size={18} />,
      title: "Refer a Participant",
      tag: "For partners",
      copy: "Submit a name from your caseload. We take it from there.",
      href: "/refer",
      cta: "Open referral form",
    },
    {
      icon: <Sparkle size={18} />,
      title: "Book an Advising Call",
      tag: "Free 30 min",
      copy: "Talk through options before you commit to a path.",
      href: "/book",
      cta: "Pick a time",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
      <SectionHeader
        eyebrow="Three ways in"
        title="Choose what fits where you are today"
        copy="No wrong door. Whether you're applying for yourself, referring a participant, or just curious — start with one click."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.title} className="p-6 group flex flex-col">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary">
                {c.icon}
              </span>
              <Badge tone="muted">{c.tag}</Badge>
            </div>
            <h3 className="mt-5 text-[18px] font-semibold tracking-tight">
              {c.title}
            </h3>
            <p className="mt-1.5 text-[14px] text-ink-muted leading-6">
              {c.copy}
            </p>
            <Link
              href={c.href}
              className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
            >
              {c.cta} <ArrowRight size={14} />
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}

function HowItWorksPreview() {
  const steps = [
    {
      n: "01",
      title: "Apply",
      copy: "Tell us about your background and goals.",
    },
    {
      n: "02",
      title: "Get Support",
      copy: "We help with applications, financial aid, and next steps.",
    },
    {
      n: "03",
      title: "Move Forward",
      copy: "Enroll in a program that leads to real career opportunities.",
    },
  ];
  return (
    <section className="bg-white border-y border-line">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
        <SectionHeader
          eyebrow="How it works"
          title="A clear, structured path — without the runaround"
          copy="Built for adults who can't afford a confusing process. Three deliberate steps; one human in your corner."
        />
        <ol className="mt-10 grid grid-cols-1 md:grid-cols-3 md:gap-0 border border-line rounded-lg bg-canvas/50 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-line">
          {steps.map((s) => (
            <li key={s.n} className="flex h-full min-h-0">
              <div className="flex flex-1 flex-col px-5 py-8 sm:px-6 lg:px-8">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary tabular-nums">
                  Step {s.n}
                </span>
                <h3 className="mt-3 text-[20px] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 flex-1 text-[14px] text-ink-muted leading-6">
                  {s.copy}
                </p>
                <div
                  className="mt-8 h-0.5 w-12 shrink-0 rounded-full bg-primary/35"
                  aria-hidden
                />
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex justify-end">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
          >
            See the full process <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServicesGrid() {
  const items = [
    {
      icon: <GraduationCap size={18} />,
      title: "College applications",
      copy: "Pick programs, finish applications, and avoid common mistakes.",
    },
    {
      icon: <Wrench size={18} />,
      title: "Job training programs",
      copy: "Find short-term certifications matched to in-demand fields.",
    },
    {
      icon: <Briefcase size={18} />,
      title: "Apprenticeships",
      copy: "Earn while you learn through union and employer partners.",
    },
    {
      icon: <FileText size={18} />,
      title: "FAFSA & financial aid support",
      copy: "Step-by-step help with federal and state aid applications.",
    },
    {
      icon: <Compass size={18} />,
      title: "Career guidance",
      copy: "Talk to an advisor who knows the local labor market.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
      <SectionHeader
        eyebrow="Services"
        title="What We Help With"
        copy="Not a portal of links — actual support, end-to-end, until you're enrolled."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title} className="p-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary">
                {item.icon}
              </span>
              <h3 className="text-[15px] font-semibold tracking-tight">
                {item.title}
              </h3>
            </div>
            <p className="mt-3 text-[14px] text-ink-muted leading-6">
              {item.copy}
            </p>
          </Card>
        ))}
        <div className="rounded-lg border border-dashed border-line p-5 flex flex-col justify-between bg-canvas">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight">
              Not sure what you need?
            </h3>
            <p className="mt-2 text-[14px] text-ink-muted leading-6">
              Most participants start by talking with an advisor for 30 minutes,
              free.
            </p>
          </div>
          <LinkButton href="/book" variant="primary" size="sm" className="mt-4 self-start">
            Book an Advising Call <ArrowRight size={14} />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

function Audience() {
  const groups = [
    {
      title: "Adults returning to education",
      copy: "Pick up where you left off — without losing time or aid eligibility.",
    },
    {
      title: "Individuals exploring new career paths",
      copy: "Move into a new industry with a credential that employers recognize.",
    },
    {
      title: "First-generation college applicants",
      copy: "Skip the trial-and-error. We've helped families navigate this for years.",
    },
    {
      title: "Anyone needing guidance",
      copy: "Navigating education or workforce options shouldn't be a solo project.",
    },
  ];
  return (
    <section className="bg-white border-y border-line">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
        <SectionHeader
          eyebrow="Who this is for"
          title="Built for adults navigating real life"
          copy="Working full-time, raising kids, supporting parents — your time is the constraint, not your potential."
        />
        <div className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-line border border-line rounded-lg overflow-hidden">
          {groups.map((g) => (
            <div key={g.title} className="bg-white p-6">
              <h3 className="text-[15px] font-semibold tracking-tight">
                {g.title}
              </h3>
              <p className="mt-2 text-[14px] text-ink-muted leading-6">
                {g.copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OutcomesStrip() {
  const stats = [
    { v: "1,284", l: "Total applicants" },
    { v: "312", l: "Enrolled or placed" },
    { v: "94%", l: "Reach an advisor in 48h" },
    { v: "4", l: "Pathway routes" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-primary/5 shadow-[var(--shadow-card)]">
          <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3]">
            <Image
              src="/1.png"
              alt="Three Career Access Hub graduates holding their diplomas"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent"
            />
            <span className="absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-action" />
              Real participants · Real outcomes
            </span>
          </div>
        </div>
        <div>
          <SectionHeader
            eyebrow="Outcomes"
            title="What it looks like to actually move forward"
            copy="Every participant leaves Career Access Hub with one of four outcomes — and a real next step on their calendar."
          />
          <div className="mt-8 grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <Card key={s.l} className="p-5">
                <div className="text-[28px] font-semibold tabular tracking-tight">
                  {s.v}
                </div>
                <div className="text-[12px] uppercase tracking-wider text-ink-subtle mt-1">
                  {s.l}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stories() {
  const stories = [
    {
      quote:
        "I'd been meaning to finish my degree for six years. The advisor walked me through FAFSA in 40 minutes. I start in the fall.",
      name: "Renée B.",
      role: "Enrolled, Bergen Community College",
      pathway: "College + FAFSA",
    },
    {
      quote:
        "I needed a credential, not a four-year plan. They mapped out a 16-week IT cert at Lincoln Tech and helped me cover childcare.",
      name: "Aaliyah C.",
      role: "Short-term training",
      pathway: "IT support",
    },
    {
      quote:
        "I didn't know where to start. We found an electrician apprenticeship in North Jersey that pays while I learn.",
      name: "Marcus R.",
      role: "Apprenticeship",
      pathway: "IBEW — North Jersey",
    },
  ];
  return (
    <section className="bg-white border-t border-line">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 pt-20 pb-10 sm:pb-12">
        <SectionHeader
          eyebrow="In their words"
          title="Built around real participants"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {stories.map((s) => (
            <Card key={s.name} className="p-6 flex flex-col">
              <Badge tone="primary" className="self-start">
                {s.pathway}
              </Badge>
              <p className="mt-4 text-[15px] text-ink leading-7">
                "{s.quote}"
              </p>
              <div className="mt-6 pt-4 border-t border-line text-[13px]">
                <div className="font-medium text-ink">{s.name}</div>
                <div className="text-ink-subtle">{s.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

