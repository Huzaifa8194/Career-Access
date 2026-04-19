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
      <div aria-hidden className="absolute inset-0 grid-bg opacity-60" />
      <div className="relative mx-auto max-w-6xl px-5 lg:px-8 pt-16 sm:pt-24 pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-2.5 py-1 text-[12px] text-ink-muted shadow-[var(--shadow-card)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-action" />
              Free, confidential support · Statewide
            </div>
            <h1 className="mt-5 text-[40px] sm:text-[52px] leading-[1.02] font-semibold tracking-[-0.02em]">
              Your next step
              <br />
              <span className="text-primary">starts here.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-7 text-ink-muted">
              Get free support to enroll in college, job training, or
              apprenticeship programs. We help adult learners turn intent into
              an enrollment plan — paired with a real advisor.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton href="/apply" size="lg" variant="primary">
                Apply now
                <ArrowRight size={16} />
              </LinkButton>
              <LinkButton href="/refer" size="lg" variant="secondary">
                Refer someone
              </LinkButton>
              <LinkButton href="/book" size="lg" variant="ghost">
                Book an advising call
              </LinkButton>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat value="7 min" label="To apply" />
              <Stat value="2 days" label="Avg. response" />
              <Stat value="1:1" label="Advisor support" />
            </dl>
          </div>
          <HeroAside />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-[12px] uppercase tracking-wider text-ink-subtle">
        {label}
      </dt>
      <dd className="mt-1 text-[22px] font-semibold tracking-tight tabular">
        {value}
      </dd>
    </div>
  );
}

function HeroAside() {
  return (
    <Card className="p-5 sm:p-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-ink-subtle">
            Your pathway, in one place
          </p>
          <h3 className="mt-1 text-[18px] font-semibold tracking-tight">
            Career Access portal
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
  const partners = [
    "MA Workforce Board",
    "Bunker Hill CC",
    "YearUp",
    "IBEW Local 103",
    "Year Up",
    "JFYNetWorks",
  ];
  return (
    <section className="border-y border-line bg-white/60">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-6 flex flex-wrap items-center gap-x-10 gap-y-3">
        <span className="text-[12px] uppercase tracking-wider text-ink-subtle">
          Trusted partners
        </span>
        {partners.map((p) => (
          <span
            key={p}
            className="text-[13px] font-medium text-ink-muted tracking-tight"
          >
            {p}
          </span>
        ))}
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
      title: "Refer someone",
      tag: "For partners",
      copy: "Submit a name from your caseload. We take it from there.",
      href: "/refer",
      cta: "Open referral form",
    },
    {
      icon: <Sparkle size={18} />,
      title: "Book an advising call",
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
      copy: "A short eligibility screener and a structured intake. About 7 minutes.",
    },
    {
      n: "02",
      title: "Get support",
      copy: "We assign your pathway and pair you with a real advisor — not a chatbot.",
    },
    {
      n: "03",
      title: "Move forward",
      copy: "You leave with a plan: enrolled, in training, or in an apprenticeship.",
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
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="text-[12px] font-semibold uppercase tracking-wider text-primary">
                Step {s.n}
              </div>
              <h3 className="mt-2 text-[20px] font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-[14px] text-ink-muted leading-6 max-w-sm">
                {s.copy}
              </p>
              <div className="mt-5 h-px w-12 bg-primary/30" />
            </div>
          ))}
        </div>
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
      title: "Job training",
      copy: "Find short-term certifications matched to in-demand fields.",
    },
    {
      icon: <Briefcase size={18} />,
      title: "Apprenticeships",
      copy: "Earn while you learn through union and employer partners.",
    },
    {
      icon: <FileText size={18} />,
      title: "FAFSA support",
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
        title="One front door. Five real services."
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
            Book a call <ArrowRight size={14} />
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
      title: "Career switchers",
      copy: "Move into a new industry with a credential that employers recognize.",
    },
    {
      title: "First-generation students",
      copy: "Skip the trial-and-error. We've helped families navigate this for years.",
    },
    {
      title: "Guidance seekers",
      copy: "Just need someone to think it through with you? That's a real service here.",
    },
  ];
  return (
    <section className="bg-white border-y border-line">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
        <SectionHeader
          eyebrow="Who we serve"
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
  return (
    <section className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <SectionHeader
            eyebrow="Outcomes"
            title="What it looks like to actually move forward"
            copy="Every participant leaves Career Access with one of four outcomes — and a real next step on their calendar."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { v: "1,284", l: "Total applicants" },
            { v: "312", l: "Enrolled or placed" },
            { v: "94%", l: "Reach an advisor in 48h" },
            { v: "4", l: "Pathway routes" },
          ].map((s) => (
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
    </section>
  );
}

function Stories() {
  const stories = [
    {
      quote:
        "I'd been meaning to finish my degree for six years. The advisor walked me through FAFSA in 40 minutes. I start in the fall.",
      name: "Renée B.",
      role: "Enrolled, Bunker Hill CC",
      pathway: "College + FAFSA",
    },
    {
      quote:
        "I needed a credential, not a four-year plan. They mapped out a 16-week IT cert and helped me cover childcare.",
      name: "Aaliyah C.",
      role: "Short-term training",
      pathway: "IT support",
    },
    {
      quote:
        "I didn't know where to start. We found an electrician apprenticeship that pays while I learn.",
      name: "Marcus R.",
      role: "Apprenticeship",
      pathway: "IBEW Local 103",
    },
  ];
  return (
    <section className="bg-white border-t border-line">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-20">
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

