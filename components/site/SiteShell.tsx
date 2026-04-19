import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-14 sm:py-16">
        <div className="grid items-end gap-8 md:grid-cols-[1.6fr_1fr]">
          <div>
            {eyebrow && (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-primary">
                {eyebrow}
              </div>
            )}
            <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight leading-[1.05]">
              {title}
            </h1>
            {description && (
              <p className="mt-4 max-w-2xl text-[16px] text-ink-muted leading-7">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex md:justify-end gap-3 flex-wrap">{actions}</div>
          )}
        </div>
      </div>
    </section>
  );
}
