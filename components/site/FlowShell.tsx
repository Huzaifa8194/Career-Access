import Link from "next/link";
import { Brand } from "@/components/site/Brand";
import { Stepper, type Step } from "@/components/ui/Stepper";

export function FlowShell({
  steps,
  current,
  exitHref = "/",
  exitLabel = "Save & exit",
  children,
  side,
}: {
  steps?: Step[];
  current?: number;
  exitHref?: string;
  exitLabel?: string;
  children: React.ReactNode;
  side?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 lg:px-8 py-3 flex items-center justify-between gap-4">
          <Brand size="sm" />
          {steps && typeof current === "number" && (
            <div className="hidden md:block">
              <Stepper steps={steps} current={current} />
            </div>
          )}
          <Link
            href={exitHref}
            className="text-[13px] font-medium text-ink-muted hover:text-ink"
          >
            {exitLabel}
          </Link>
        </div>
        {steps && typeof current === "number" && (
          <div className="md:hidden border-t border-line px-5 py-3 overflow-x-auto">
            <Stepper steps={steps} current={current} />
          </div>
        )}
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-5 lg:px-8 py-10 sm:py-14 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0">{children}</div>
          {side && <aside className="lg:sticky lg:top-8 self-start">{side}</aside>}
        </div>
      </main>
    </div>
  );
}

export function FormHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-tight leading-[1.1]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-[15px] text-ink-muted leading-7 max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-line rounded-lg p-6 sm:p-7 shadow-[var(--shadow-card)]">
      <div className="mb-5">
        <h2 className="text-[18px] font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-[13px] text-ink-subtle leading-6">
            {description}
          </p>
        )}
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

export function FlowSidebar({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-line rounded-lg p-5 shadow-[var(--shadow-card)]">
      <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
      {blurb && (
        <p className="mt-1.5 text-[13px] text-ink-muted leading-6">{blurb}</p>
      )}
      {children && <div className="mt-4 grid gap-3">{children}</div>}
    </div>
  );
}
