"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FlowShell,
  FormHeader,
  FormSection,
  FlowSidebar,
} from "@/components/site/FlowShell";
import { Button } from "@/components/ui/Button";
import {
  Field,
  Input,
  Select,
  Textarea,
  Radio,
  Checkbox,
} from "@/components/ui/Field";
import { Upload, ArrowRight } from "@/components/icons";

const steps = [
  { label: "Eligibility" },
  { label: "Intake" },
  { label: "Confirmation" },
];

const supportOptions = [
  "FAFSA",
  "College apps",
  "Apprenticeship help",
  "Career advising",
  "Resume / interview",
  "Transportation",
  "Childcare",
  "Internet / device",
];

export default function IntakePage() {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState("");
  const [employed, setEmployed] = useState("");
  const [interest, setInterest] = useState("");
  const [supports, setSupports] = useState<string[]>([]);
  const [contact, setContact] = useState("Email");
  const [file, setFile] = useState<File | null>(null);

  function toggleSupport(name: string) {
    setSupports((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  }

  return (
    <FlowShell
      steps={steps}
      current={1}
      side={
        <div className="grid gap-4">
          <FlowSidebar
            title="Tips for a fast intake"
            blurb="Most participants finish in 5–7 minutes."
          >
            <ul className="grid gap-2 text-[13px] text-ink-muted">
              <li>You can leave fields blank if you're not sure.</li>
              <li>Documents are optional — your advisor will request what's needed.</li>
              <li>Your answers save as you type.</li>
            </ul>
          </FlowSidebar>
          <FlowSidebar
            title="Need a hand?"
            blurb="Start with a free 30-minute advising call instead."
          >
            <Link
              href="/book"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary"
            >
              Book a call <ArrowRight size={13} />
            </Link>
          </FlowSidebar>
        </div>
      }
    >
      <FormHeader
        title="Complete your application."
        subtitle="A few more details so your advisor can build a real plan before your first conversation."
      />

      <form
        className="grid gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/apply/confirmation");
        }}
      >
        <FormSection title="Personal information">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First name" required htmlFor="fn">
              <Input id="fn" required />
            </Field>
            <Field label="Last name" required htmlFor="ln">
              <Input id="ln" required />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" required htmlFor="em">
              <Input id="em" type="email" required placeholder="you@example.com" />
            </Field>
            <Field label="Phone" required htmlFor="ph">
              <Input id="ph" type="tel" required placeholder="(617) 555-0123" />
            </Field>
          </div>
          <Field label="Preferred contact method" required>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Email", "Phone", "Text"].map((v) => (
                <Radio
                  key={v}
                  name="contact"
                  value={v}
                  label={v}
                  checked={contact === v}
                  onChange={() => setContact(v)}
                  required
                />
              ))}
            </div>
          </Field>
          <Field label="Address" htmlFor="addr">
            <Input id="addr" placeholder="Street address" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="City" htmlFor="city">
              <Input id="city" />
            </Field>
            <Field label="State" htmlFor="state">
              <Select id="state" defaultValue="MA">
                <option>MA</option>
                <option>NH</option>
                <option>RI</option>
                <option>CT</option>
                <option>VT</option>
                <option>ME</option>
              </Select>
            </Field>
            <Field label="ZIP" htmlFor="zip" required>
              <Input id="zip" required inputMode="numeric" maxLength={5} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Education">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Highest level completed" required htmlFor="edu">
              <Select id="edu" required defaultValue="">
                <option value="" disabled>
                  Select one
                </option>
                <option>Some high school</option>
                <option>High school diploma</option>
                <option>GED / HSE</option>
                <option>Some college, no degree</option>
                <option>Associate degree</option>
                <option>Bachelor&apos;s degree</option>
                <option>Graduate degree</option>
              </Select>
            </Field>
            <Field label="Currently enrolled in school?" required>
              <div className="grid gap-3 grid-cols-2">
                {["Yes", "No"].map((v) => (
                  <Radio
                    key={v}
                    name="enrolled"
                    value={v}
                    label={v}
                    checked={enrolled === v}
                    onChange={() => setEnrolled(v)}
                    required
                  />
                ))}
              </div>
            </Field>
          </div>
          <Field label="What kind of program interests you?" required>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Associate",
                "Bachelor's",
                "Certificate",
                "Apprenticeship",
                "Not Sure",
              ].map((v) => (
                <Radio
                  key={v}
                  name="interest"
                  value={v}
                  label={v}
                  checked={interest === v}
                  onChange={() => setInterest(v)}
                  required
                />
              ))}
            </div>
          </Field>
        </FormSection>

        <FormSection title="Employment">
          <Field label="Currently employed?" required>
            <div className="grid gap-3 grid-cols-2">
              {["Yes", "No"].map((v) => (
                <Radio
                  key={v}
                  name="employed"
                  value={v}
                  label={v}
                  checked={employed === v}
                  onChange={() => setEmployed(v)}
                  required
                />
              ))}
            </div>
          </Field>
          {employed === "Yes" && (
            <Field label="Job title" htmlFor="jt">
              <Input id="jt" placeholder="e.g. Retail associate" />
            </Field>
          )}
        </FormSection>

        <FormSection
          title="What support do you need?"
          description="Select everything that applies. Your advisor will tailor your plan."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {supportOptions.map((s) => (
              <Checkbox
                key={s}
                label={s}
                checked={supports.includes(s)}
                onChange={() => toggleSupport(s)}
              />
            ))}
          </div>
          <Field
            label="Anything else we should know? (optional)"
            htmlFor="notes"
          >
            <Textarea
              id="notes"
              rows={3}
              placeholder="Constraints, deadlines, preferences…"
            />
          </Field>
        </FormSection>

        <FormSection
          title="Documents"
          description="Optional — upload only if you already have them."
        >
          <label className="flex items-center justify-between gap-4 rounded-md border border-dashed border-line bg-canvas/60 p-4 cursor-pointer hover:border-line-strong">
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary">
                <Upload size={16} />
              </span>
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-ink truncate">
                  {file ? file.name : "Add a transcript, ID, or résumé"}
                </div>
                <div className="text-[12px] text-ink-subtle">
                  PDF, JPG, PNG · up to 10 MB
                </div>
              </div>
            </div>
            <span className="text-[13px] font-medium text-primary">
              Choose file
            </span>
            <input
              type="file"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </FormSection>

        <FormSection title="Consent">
          <Checkbox
            required
            label="I confirm the information above is accurate to the best of my knowledge."
          />
          <Checkbox
            required
            label="I consent to be contacted by Career Access about my application."
          />
          <Checkbox
            label="I consent to share my information with vetted partner organizations to find a placement faster."
            description="Optional — you can update this anytime in your portal."
          />
        </FormSection>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Link
            href="/apply"
            className="text-[14px] font-medium text-ink-muted hover:text-ink"
          >
            ← Back
          </Link>
          <Button type="submit" size="lg">
            Submit application <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </FlowShell>
  );
}
