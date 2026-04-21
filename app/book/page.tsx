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

export default function BookPage() {
  const router = useRouter();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");

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
              Don't see a time that works? Email{" "}
              <a
                className="text-primary"
                href="mailto:hello@employreadypartners.org"
              >
                hello@employreadypartners.org
              </a>{" "}
              and we'll match you with an advisor.
            </p>
          </FlowSidebar>
        </div>
      }
    >
      <FormHeader
        title="Schedule an Advising Call"
        subtitle="Choose a time to speak with an advisor."
      />

      <form
        className="grid gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/book/confirmation");
        }}
      >
        <FormSection title="Your details">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" required htmlFor="b-name">
              <Input id="b-name" required />
            </Field>
            <Field label="Email Address" required htmlFor="b-email">
              <Input id="b-email" type="email" required />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone" htmlFor="b-phone">
              <Input id="b-phone" type="tel" />
            </Field>
            <Field label="Appointment Type" required htmlFor="b-type">
              <Select id="b-type" required defaultValue="">
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
              <Select id="b-tz" defaultValue="ET" required>
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
            <input
              type="hidden"
              name="time"
              value={time}
              required
              onChange={() => {}}
            />
          </Field>
        </FormSection>

        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-[13px] text-ink-subtle">
            {time ? `Selected: ${date} at ${time} ET` : "Pick a time slot to continue"}
          </span>
          <Button type="submit" size="lg" disabled={!time}>
            Confirm Appointment <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </FlowShell>
  );
}
