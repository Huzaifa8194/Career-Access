import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { SectionHeader } from "@/components/site/SectionHeader";
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
  Check,
  Users,
  Clock,
} from "@/components/icons";

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <TrustStrip />
      <ThreeWaysIn />
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
              Get free support to enroll in college, job training, or
              apprenticeship programs.
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
    <Card className="relative p-5 sm:p-6 max-md:rounded-2xl max-md:border-primary/10 max-md:shadow-[var(--shadow-elevated)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-ink-subtle">
            Your pathway, in one place
          </p>
          <h3 className="mt-1 text-[18px] font-semibold tracking-tight">
            Career Access Hub portal
          </h3>
        </div>
        <Badge tone="primary" dot>
          Live
        </Badge>
      </div>

      <div className="mt-5 rounded-md border border-line p-4 bg-canvas/60">
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-ink-subtle uppercase tracking-wider">
            Pathway
          </p>
          <Badge tone="primary">College + FAFSA</Badge>
        </div>
        <p className="mt-1.5 font-semibold text-[15px]">
          Hi Jordan — you have one task due
        </p>
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {[
          { label: "Application submitted", done: true },
          { label: "Eligibility confirmed", done: true },
          { label: "Advising call scheduled", done: true },
          { label: "Submit FAFSA documents", done: false, due: "Apr 24" },
          { label: "Confirm college choices", done: false },
        ].map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 text-[14px]"
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
              className={item.done ? "text-ink-subtle line-through" : "text-ink"}
            >
              {item.label}
            </span>
            {item.due && (
              <span className="ml-auto text-[12px] text-warn font-medium">
                Due {item.due}
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-[12px] font-semibold">
            MR
          </span>
          <div className="text-[12px] leading-tight">
            <div className="font-medium text-ink">Maya Robinson</div>
            <div className="text-ink-subtle">Your advisor</div>
          </div>
        </div>
        <Link
          href="/portal/participant"
          className="text-[13px] font-medium text-primary inline-flex items-center gap-1"
        >
          Open portal <ArrowRight size={14} />
        </Link>
      </div>
    </Card>
  );
}

function TrustStrip() {
  const partners: { name: string; src: string; short: string }[] = [
    {
      name: "Bergen Community College",
      src: "/uni1.png",
      short: "Bergen CC",
    },
    { name: "Lincoln Tech", src: "/uni2.jpeg", short: "Lincoln Tech" },
    {
      name: "New Jersey City University",
      src: "/uni3.png",
      short: "NJCU",
    },
    {
      name: "Middlesex College",
      src: "/uni4.png",
      short: "Middlesex College",
    },
    {
      name: "Passaic County Community College",
      src: "/uni5.jpeg",
      short: "Passaic County CC",
    },
  ];
  return (
    <section
      className="border-y border-line bg-white"
      aria-labelledby="trusted-partners-heading"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-12 sm:py-14">
        <div className="max-w-3xl">
          <p
            id="trusted-partners-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary"
          >
            Trusted partners
          </p>
          <h2 className="mt-2 text-[22px] sm:text-[26px] font-semibold tracking-tight leading-snug text-ink">
            We work with colleges, training providers, and workforce
            organizations.
          </h2>
          <p className="mt-3 text-[15px] text-ink-muted leading-relaxed">
            Career Access Hub is delivered by EmployReady Partners in
            coordination with community colleges, accredited training
            providers, and county workforce boards across Bergen, Passaic,
            and Hudson.
          </p>
        </div>

        <ul
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
          role="list"
        >
          {partners.map((p) => (
            <li key={p.name}>
              <div
                className="group flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-line bg-white px-4 py-5 shadow-[var(--shadow-card)] transition-colors hover:border-primary/25"
                title={p.name}
              >
                <div className="relative h-12 w-full">
                  <Image
                    src={p.src}
                    alt={`${p.name} logo`}
                    fill
                    sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
                    className="object-contain"
                  />
                </div>
                <span className="text-center text-[12px] font-medium leading-snug text-ink-muted">
                  {p.short}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[13px] text-ink-subtle">
          And a growing network of county workforce boards, community
          organizations, and employer partners.
        </p>
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

