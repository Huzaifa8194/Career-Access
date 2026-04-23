"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FlowShell,
  FormHeader,
  FormSection,
  FlowSidebar,
} from "@/components/site/FlowShell";
import { Button } from "@/components/ui/Button";
import { Field, Select, Input } from "@/components/ui/Field";
import { ArrowRight, Clock } from "@/components/icons";
import { submitAppointment } from "@/lib/services/appointments";

const steps = [{ label: "Schedule" }, { label: "Confirmation" }];

const slots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "3:00 PM",
  "3:30 PM",
];

const tzOffsetHours: Record<string, number> = {
  ET: -4,
  CT: -5,
  MT: -6,
  PT: -7,
};

function toScheduledISO(date: string, time: string, tz: string): string {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return new Date().toISOString();
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  const offsetHours = tzOffsetHours[tz] ?? -4;
  const [y, m, d] = date.split("-").map((n) => parseInt(n, 10));
  const utc = Date.UTC(y, m - 1, d, hour - offsetHours, minute, 0);
  return new Date(utc).toISOString();
}

export default function BookPage() {
  const router = useRouter();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [tz, setTz] = useState("ET");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!time) {
      setError("Pick a time slot to continue.");
      return;
    }
    setSubmitting(true);
    try {
      const scheduledAt = toScheduledISO(date, time, tz);
      await submitAppointment({
        contactName: name,
        contactEmail: email,
        contactPhone: phone || undefined,
        appointmentType,
        scheduledAt,
        timezone: tz,
      });
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem(
            "cah:book:result",
            JSON.stringify({
              name,
              email,
              appointmentType,
              date,
              time,
              tz,
            })
          );
        } catch {
          /* ignore */
        }
      }
      router.push("/book/confirmation");
    } catch (err) {
      console.error(err);
      setError("We couldn't book your appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FlowShell
      steps={steps}
      current={0}
      side={
        <div className="grid gap-4">
          <FlowSidebar
            title="What to expect"
            blurb="A 30-minute working session with an advisor. Bring questions; we'll bring options."
          >
            <ul className="grid gap-2 text-[13px] text-ink-muted">
              <li>Phone or video — your choice.</li>
              <li>Written notes sent after the call.</li>
              <li>Free and confidential.</li>
            </ul>
          </FlowSidebar>
          <FlowSidebar title="Need a different time?">
            <p className="text-[13px] text-ink-muted leading-6">
              Don&apos;t see a time that works? Email{" "}
              <a
                className="text-primary"
                href="mailto:hello@employreadypartners.org"
              >
                hello@employreadypartners.org
              </a>{" "}
              and we&apos;ll match you with an advisor.
            </p>
          </FlowSidebar>
        </div>
      }
    >
      <FormHeader
        title="Schedule an Advising Call"
        subtitle="Choose a time to speak with an advisor."
      />

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <FormSection title="Your details">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" required htmlFor="b-name">
              <Input
                id="b-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Email Address" required htmlFor="b-email">
              <Input
                id="b-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone" htmlFor="b-phone">
              <Input
                id="b-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
            <Field label="Appointment Type" required htmlFor="b-type">
              <Select
                id="b-type"
                required
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
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
          </div>
        </FormSection>

        <FormSection title="Select a Date and Time">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date" required htmlFor="b-date">
              <Input
                id="b-date"
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Field>
            <Field label="Time Zone" required htmlFor="b-tz">
              <Select
                id="b-tz"
                value={tz}
                onChange={(e) => setTz(e.target.value)}
                required
              >
                <option value="ET">Eastern Time (ET)</option>
                <option value="CT">Central Time (CT)</option>
                <option value="MT">Mountain Time (MT)</option>
                <option value="PT">Pacific Time (PT)</option>
              </Select>
            </Field>
          </div>

          <Field label="Available times" required>
            <div className="grid gap-2 grid-cols-3 sm:grid-cols-5">
              {slots.map((s) => {
                const active = time === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTime(s)}
                    className={[
                      "h-10 rounded-md border text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5",
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-line bg-white text-ink hover:border-line-strong",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    <Clock size={12} />
                    {s}
                  </button>
                );
              })}
            </div>
          </Field>
        </FormSection>

        {error ? (
          <p
            role="alert"
            className="rounded-md border border-danger/30 bg-danger-50 px-3 py-2 text-[13px] text-[#991B1B]"
          >
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-[13px] text-ink-subtle">
            {time ? `Selected: ${date} at ${time} ${tz}` : "Pick a time slot to continue"}
          </span>
          <Button type="submit" size="lg" disabled={!time || submitting}>
            {submitting ? "Booking…" : "Confirm Appointment"}{" "}
            <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </FlowShell>
  );
}
