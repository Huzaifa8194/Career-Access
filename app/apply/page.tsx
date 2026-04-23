"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FlowShell,
  FormHeader,
  FormSection,
  FlowSidebar,
} from "@/components/site/FlowShell";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Radio } from "@/components/ui/Field";
import { Check, ArrowRight, Shield } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { saveEligibility } from "@/lib/apply-session";

const steps = [
  { label: "Eligibility" },
  { label: "Intake" },
  { label: "Confirmation" },
];

export default function ApplyEligibilityPage() {
  const router = useRouter();
  const [ageRange, setAgeRange] = useState("");
  const [zip, setZip] = useState("");
  const [education, setEducation] = useState("");
  const [interest, setInterest] = useState("");
  const [income, setIncome] = useState("");
  const [firstGen, setFirstGen] = useState("");

  return (
    <FlowShell
      steps={steps}
      current={0}
      side={
        <div className="grid gap-4">
          <FlowSidebar
            title="What this is"
            blurb="A six-question screener that helps us route you to the right pathway. Takes about 90 seconds."
          />
          <FlowSidebar title="What's next">
            <ol className="grid gap-2.5 text-[13px]">
              <SidebarStep n={1} label="Eligibility" current />
              <SidebarStep n={2} label="Full intake" />
              <SidebarStep n={3} label="Confirmation + advisor match" />
            </ol>
          </FlowSidebar>
          <div className="rounded-lg border border-line bg-primary-50/40 p-4 text-[13px] text-ink leading-6">
            <div className="flex items-center gap-2 mb-1.5 text-primary font-medium">
              <Shield size={14} /> Confidential
            </div>
            We never share your answers without your consent.
          </div>
        </div>
      }
    >
      <FormHeader
        title="Let's See If We Can Help"
        subtitle="Answer a few quick questions to get started."
      />

      <form
        className="grid gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          saveEligibility({
            ageRange,
            zip,
            highestEducation: education,
            interest,
            incomeRange: income,
            firstGen,
          });
          router.push("/apply/intake");
        }}
      >
        <FormSection title="About you">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="How old are you?" required htmlFor="el-age">
              <Select
                id="el-age"
                required
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
              >
                <option value="" disabled>
                  Select age range
                </option>
                <option>18–24</option>
                <option>25–34</option>
                <option>35–44</option>
                <option>45–54</option>
                <option>55+</option>
              </Select>
            </Field>
            <Field label="What is your ZIP code?" required htmlFor="el-zip">
              <Input
                id="el-zip"
                required
                inputMode="numeric"
                maxLength={5}
                placeholder="07505"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </Field>
          </div>
          <Field
            label="What is the highest level of education you've completed?"
            required
            htmlFor="el-edu"
          >
            <Select
              id="el-edu"
              required
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            >
              <option value="" disabled>
                Select an option
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
        </FormSection>

        <FormSection
          title="What are you most interested in?"
          description="Pick the closest fit. You can change your mind during intake."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { v: "College", d: "Associate or bachelor's degree" },
              { v: "Job Training / Certificate", d: "Short-term certification" },
              { v: "Apprenticeship", d: "Earn while you learn" },
              { v: "Not Sure", d: "I'd like an advisor to help me choose" },
            ].map((o) => (
              <Radio
                key={o.v}
                name="interest"
                value={o.v}
                label={o.v}
                description={o.d}
                checked={interest === o.v}
                onChange={() => setInterest(o.v)}
                required
              />
            ))}
          </div>
        </FormSection>

        <FormSection title="A bit more context">
          <Field
            label="What is your household income range?"
            hint="Used only to check program eligibility."
            htmlFor="el-income"
            required
          >
            <Select
              id="el-income"
              required
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            >
              <option value="" disabled>
                Select range
              </option>
              <option>Under $20,000</option>
              <option>$20,000 – $35,000</option>
              <option>$35,000 – $50,000</option>
              <option>$50,000 – $75,000</option>
              <option>$75,000+</option>
              <option>Prefer not to say</option>
            </Select>
          </Field>

          <Field
            label="Are you the first in your family to attend college?"
            required
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {["Yes", "No", "Not Sure"].map((v) => (
                <Radio
                  key={v}
                  name="firstgen"
                  value={v}
                  label={v}
                  checked={firstGen === v}
                  onChange={() => setFirstGen(v)}
                  required
                />
              ))}
            </div>
          </Field>
        </FormSection>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Badge tone="muted">~ 90 seconds remaining</Badge>
          <Button type="submit" size="lg">
            Continue <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </FlowShell>
  );
}

function SidebarStep({
  n,
  label,
  current,
  done,
}: {
  n: number;
  label: string;
  current?: boolean;
  done?: boolean;
}) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        className={[
          "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold tabular border",
          done
            ? "bg-action border-action text-white"
            : current
              ? "bg-primary border-primary text-white"
              : "bg-white border-line text-ink-subtle",
        ].join(" ")}
      >
        {done ? <Check size={12} /> : n}
      </span>
      <span
        className={current ? "text-ink font-medium" : "text-ink-muted"}
      >
        {label}
      </span>
    </li>
  );
}
