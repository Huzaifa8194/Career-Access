import Link from "next/link";
import { Brand } from "@/components/site/Brand";
import { LinkButton } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-line bg-white sm:mt-12">
      <section className="mx-auto max-w-6xl px-5 lg:px-8 py-10 sm:py-12">
        <div className="rounded-xl border border-line bg-gradient-to-br from-primary to-[#152a66] text-white p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-[var(--shadow-elevated)]">
          <div className="max-w-xl">
            <h2 className="text-[26px] sm:text-[28px] font-semibold tracking-tight leading-tight text-white">
              Start your journey today.
            </h2>
            <p className="mt-2 text-white/80 text-[15px] leading-6">
              It takes about 7 minutes to apply. A real person will follow up
              within two business days.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <LinkButton href="/apply" variant="action" size="lg">
              Apply Now
            </LinkButton>
            <LinkButton
              href="/book"
              variant="secondary"
              size="lg"
              className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20"
            >
              Book an Advising Call
            </LinkButton>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 lg:px-8 pb-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Brand />
            <p className="mt-4 text-[13px] text-ink-subtle leading-6 max-w-xs">
              A workforce navigation service for adult learners across Bergen,
              Passaic, and Hudson Counties in New Jersey. Free and
              confidential.
            </p>
          </div>
          <FooterColumn
            title="Program"
            links={[
              { href: "/services", label: "Services" },
              { href: "/how-it-works", label: "How it works" },
              { href: "/partners", label: "For partners" },
              { href: "/get-started", label: "Get started" },
            ]}
          />
          <FooterColumn
            title="For you"
            links={[
              { href: "/apply", label: "Apply Now" },
              { href: "/refer", label: "Refer a Participant" },
              { href: "/book", label: "Book an Advising Call" },
              { href: "/portal", label: "Sign in" },
            ]}
          />
          <FooterColumn
            title="Help"
            links={[
              { href: "/contact", label: "Contact" },
              { href: "#", label: "Accessibility" },
              { href: "#", label: "Privacy" },
              { href: "#", label: "Terms" },
            ]}
          />
        </div>
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-line pt-6 text-[12px] text-ink-subtle">
          <span>
            © {new Date().getFullYear()} Career Access Hub by EmployReady
            Partners. All rights reserved.
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-action" />
            Service is free and confidential
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted">
        {title}
      </h3>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[14px] text-ink hover:text-primary"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
