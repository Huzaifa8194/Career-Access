import Link from "next/link";
import { Brand } from "@/components/site/Brand";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 lg:px-8 h-14 flex items-center justify-between">
          <Brand markOnly size="sm" className="shrink-0" />
          <Link
            href="/"
            className="text-[13px] font-medium text-ink-muted hover:text-ink"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-xl">
          <div className="rounded-lg border border-line bg-white p-7 text-center shadow-[var(--shadow-card)] sm:p-9">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary">
              404
            </p>
            <h1 className="mt-3 text-[30px] font-semibold tracking-tight leading-[1.1] text-ink sm:text-[34px]">
              Page not found
            </h1>
            <p className="mt-3 text-[15px] leading-7 text-ink-muted">
              The page you are looking for does not exist or may have moved.
            </p>
            <div className="mt-7 flex items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-[14px] font-medium text-white hover:bg-primary-700"
              >
                Go to homepage
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-md border border-line px-5 text-[14px] font-medium text-ink hover:bg-canvas"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
