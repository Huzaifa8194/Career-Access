"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Mail, Phone, MapPin, Check, ArrowRight } from "@/components/icons";
import { submitContactInquiry } from "@/lib/services/contactInquiries";
import { submitAppointment } from "@/lib/services/appointments";
import { bookFlow } from "@/lib/flowState";

export default function ContactPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [bookingType, setBookingType] = useState("");
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [bookingTime, setBookingTime] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
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
                    Apply Now <ArrowRight size={14} />
                  </LinkButton>
                  <LinkButton href="/book" variant="secondary">
                    Book an Advising Call
                  </LinkButton>
                </div>
              </div>
            ) : (
              <form
                className="grid gap-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (submitting) return;
                  setSubmitting(true);
                  setError(null);
                  try {
                    await submitContactInquiry({
                      name,
                      email,
                      phone,
                      role,
                      message,
                    });
                    setSubmitted(true);
                  } catch (err) {
                    console.error(err);
                    setError(
                      (err as Error)?.message ||
                        "We couldn't send your message right now. Please try again."
                    );
                    setSubmitting(false);
                  }
                }}
              >
                <h2 className="text-[20px] font-semibold tracking-tight">
                  Send us a message
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" required htmlFor="c-name">
                    <Input
                      id="c-name"
                      required
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Field>
                  <Field label="Email" required htmlFor="c-email">
                    <Input
                      id="c-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone (optional)" htmlFor="c-phone">
                    <Input
                      id="c-phone"
                      type="tel"
                      placeholder="(201) 555-0123"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Field>
                  <Field label="I'm reaching out as" htmlFor="c-role" required>
                    <Select
                      id="c-role"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
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
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Field>
                {error && (
                  <div className="rounded-md border border-danger/30 bg-danger-50 p-3 text-[13px] text-danger">
                    {error}
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-line">
                  <p className="text-[12px] text-ink-subtle">
                    By sending, you agree to be contacted about your inquiry.
                  </p>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? "Sending..." : "Send message"}
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
                    <div>hello@employreadypartners.org</div>
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
                    <div>(201) 555-0190 · Mon–Fri, 9–5 ET</div>
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
                    <div>100 Hamilton Plaza, Paterson NJ 07505</div>
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
                  Book an Advising Call
                </LinkButton>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-[15px] font-semibold tracking-tight">
                Quick book from this page
              </h3>
              <p className="mt-1.5 text-[13px] text-ink-muted leading-6">
                Anyone can request a call here. It will appear in advisor and
                admin inboxes.
              </p>
              <form
                className="mt-4 grid gap-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (bookingSubmitting) return;
                  setBookingSubmitting(true);
                  setBookingError(null);
                  try {
                    const emailKey = email
                      .trim()
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-");
                    const id = await submitAppointment({
                      participantId: emailKey
                        ? `lead-${emailKey}`
                        : `lead-${Date.now()}`,
                      participantName: name || "New lead",
                      appointmentType: bookingType,
                      scheduledDate: bookingDate,
                      scheduledTime: bookingTime,
                      timezone: "ET",
                      mode: "Video",
                      contactEmail: email || "",
                      contactPhone: phone || "",
                      contactName: name || "",
                    });
                    bookFlow.set({
                      appointmentId: id,
                      appointmentType: bookingType,
                      scheduledDate: bookingDate,
                      scheduledTime: bookingTime,
                      timezone: "ET",
                      contactName: name,
                      contactEmail: email,
                      mode: "Video",
                      reference: `CA-APT-${bookingDate.replace(/-/g, "")}-${id.slice(-6).toUpperCase()}`,
                    });
                    router.push("/book/confirmation");
                  } catch (err) {
                    console.error(err);
                    setBookingError(
                      (err as Error)?.message ||
                        "We couldn't book the call right now. Please try again."
                    );
                    setBookingSubmitting(false);
                  }
                }}
              >
                <Field label="Full name" required htmlFor="quick-book-name">
                  <Input
                    id="quick-book-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                <Field label="Email" required htmlFor="quick-book-email">
                  <Input
                    id="quick-book-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field label="Appointment Type" required htmlFor="quick-book-type">
                  <Select
                    id="quick-book-type"
                    required
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    <option>General advising (30 min)</option>
                    <option>FAFSA support (45 min)</option>
                    <option>Apprenticeship review (30 min)</option>
                    <option>Career discovery (30 min)</option>
                  </Select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Date" required htmlFor="quick-book-date">
                    <Input
                      id="quick-book-date"
                      type="date"
                      required
                      value={bookingDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
                  </Field>
                  <Field label="Time" required htmlFor="quick-book-time">
                    <Select
                      id="quick-book-time"
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option>9:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>1:00 PM</option>
                      <option>2:00 PM</option>
                      <option>3:00 PM</option>
                    </Select>
                  </Field>
                </div>
                {bookingError && (
                  <div className="rounded-md border border-danger/30 bg-danger-50 p-3 text-[12px] text-danger">
                    {bookingError}
                  </div>
                )}
                <Button type="submit" variant="primary" disabled={bookingSubmitting}>
                  {bookingSubmitting ? "Booking..." : "Book call now"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
