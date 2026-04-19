"use client";

import { useState } from "react";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Mail, Phone, MapPin, Check, ArrowRight } from "@/components/icons";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Contact"
        title="Talk to a real person."
        description="Our team responds to every inquiry within two business days. For urgent help, request a call and we'll prioritize."
      />

      <section className="mx-auto max-w-6xl px-5 lg:px-8 pt-16 pb-10 sm:pb-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] items-start">
          <Card className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-action-50 text-action">
                  <Check size={20} />
                </span>
                <h3 className="mt-4 text-[22px] font-semibold tracking-tight">
                  Thanks — we got it.
                </h3>
                <p className="mt-2 text-[14px] text-ink-muted leading-6 max-w-md mx-auto">
                  A team member will reply within two business days. If you'd
                  like to start now, you can apply or book a call.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <LinkButton href="/apply" variant="primary">
                    Apply now <ArrowRight size={14} />
                  </LinkButton>
                  <LinkButton href="/book" variant="secondary">
                    Book a call
                  </LinkButton>
                </div>
              </div>
            ) : (
              <form
                className="grid gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <h2 className="text-[20px] font-semibold tracking-tight">
                  Send us a message
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" required htmlFor="c-name">
                    <Input id="c-name" required placeholder="Full name" />
                  </Field>
                  <Field label="Email" required htmlFor="c-email">
                    <Input
                      id="c-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone (optional)" htmlFor="c-phone">
                    <Input
                      id="c-phone"
                      type="tel"
                      placeholder="(617) 555-0123"
                    />
                  </Field>
                  <Field label="I'm reaching out as" htmlFor="c-role" required>
                    <Select id="c-role" required defaultValue="">
                      <option value="" disabled>
                        Select one
                      </option>
                      <option>Adult learner</option>
                      <option>Family member</option>
                      <option>Partner organization</option>
                      <option>Employer</option>
                      <option>Other</option>
                    </Select>
                  </Field>
                </div>
                <Field label="What can we help with?" htmlFor="c-msg" required>
                  <Textarea
                    id="c-msg"
                    rows={5}
                    required
                    placeholder="Briefly tell us what you're hoping to do."
                  />
                </Field>
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-line">
                  <p className="text-[12px] text-ink-subtle">
                    By sending, you agree to be contacted about your inquiry.
                  </p>
                  <Button type="submit" variant="primary">
                    Send message
                  </Button>
                </div>
              </form>
            )}
          </Card>

          <div className="grid gap-4">
            <Card className="p-6">
              <h3 className="text-[15px] font-semibold tracking-tight">
                Reach us directly
              </h3>
              <ul className="mt-4 grid gap-3 text-[14px]">
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary">
                    <Mail size={16} />
                  </span>
                  <div>
                    <div className="text-ink-subtle text-[12px] uppercase tracking-wider">
                      Email
                    </div>
                    <div>hello@careeraccess.example</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary">
                    <Phone size={16} />
                  </span>
                  <div>
                    <div className="text-ink-subtle text-[12px] uppercase tracking-wider">
                      Phone
                    </div>
                    <div>(617) 555-0190 · Mon–Fri, 9–5 ET</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary">
                    <MapPin size={16} />
                  </span>
                  <div>
                    <div className="text-ink-subtle text-[12px] uppercase tracking-wider">
                      Office
                    </div>
                    <div>200 Tremont St, Boston MA 02116</div>
                  </div>
                </li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-[15px] font-semibold tracking-tight">
                In a hurry?
              </h3>
              <p className="mt-1.5 text-[13px] text-ink-muted leading-6">
                If you'd rather skip the form, book a free 30-minute advising
                call.
              </p>
              <div className="mt-4">
                <LinkButton href="/book" variant="primary" size="sm">
                  Book a call
                </LinkButton>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
