"use client";

import { useRouter } from "next/navigation";
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
  Checkbox,
} from "@/components/ui/Field";
import { ArrowRight } from "@/components/icons";

const steps = [{ label: "Referral" }, { label: "Confirmation" }];

export default function ReferPage() {
  const router = useRouter();
  return (
    <FlowShell
      steps={steps}
      current={0}
      side={
        <div className="grid gap-4">
          <FlowSidebar
            title="What happens next"
            blurb="We follow up directly with the applicant. You'll get a status email once we've reached them."
          >
            <ol className="grid gap-2 text-[13px] text-ink-muted">
              <li>1. We email and call the applicant within 2 business days.</li>
              <li>2. They complete intake at their own pace.</li>
              <li>3. You receive a status update from your liaison.</li>
            </ol>
          </FlowSidebar>
          <FlowSidebar
            title="Partner of ours?"
            blurb="Active partners get a branded referral link. Ask your liaison or contact us."
          />
        </div>
      }
    >
      <FormHeader
        title="Refer Someone to the Program"
        subtitle="Help someone take the next step."
      />

      <form
        className="grid gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/refer/confirmation");
        }}
      >
        <FormSection title="Your Information">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your Name" required htmlFor="r-name">
              <Input id="r-name" required />
            </Field>
            <Field label="Organization Name" required htmlFor="r-org">
              <Input id="r-org" required placeholder="Workforce board, library, etc." />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email Address" required htmlFor="r-email">
              <Input id="r-email" type="email" required />
            </Field>
            <Field label="Phone Number" htmlFor="r-phone">
              <Input id="r-phone" type="tel" />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Applicant Information">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Applicant First Name" required htmlFor="a-first">
              <Input id="a-first" required />
            </Field>
            <Field label="Applicant Last Name" required htmlFor="a-last">
              <Input id="a-last" required />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Applicant Email" required htmlFor="a-email">
              <Input id="a-email" type="email" required />
            </Field>
            <Field label="Applicant Phone" required htmlFor="a-phone">
              <Input id="a-phone" type="tel" required />
            </Field>
          </div>
          <Field label="ZIP Code" required htmlFor="a-zip">
            <Input id="a-zip" required inputMode="numeric" maxLength={5} />
          </Field>
        </FormSection>

        <FormSection title="Referral Details">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Program Interest" required htmlFor="prog">
              <Select id="prog" required defaultValue="">
                <option value="" disabled>
                  Select one
                </option>
                <option>College + FAFSA</option>
                <option>Short-term training</option>
                <option>Apprenticeship</option>
                <option>GED / HSE</option>
                <option>Not sure / advisor's call</option>
              </Select>
            </Field>
            <Field label="Urgency" required htmlFor="urg">
              <Select id="urg" required defaultValue="">
                <option value="" disabled>
                  Select urgency
                </option>
                <option>Standard (2 business days)</option>
                <option>Priority (within 1 business day)</option>
                <option>Urgent (today if possible)</option>
              </Select>
            </Field>
          </div>
          <Field
            label="Reason for Referral"
            required
            htmlFor="reason"
            hint="A few sentences is enough. Include any context the advisor should know."
          >
            <Textarea id="reason" rows={4} required />
          </Field>
        </FormSection>

        <FormSection title="Consent">
          <Checkbox
            required
            label="I confirm I have permission to refer this individual."
            description="We will only contact them about Career Access services."
          />
        </FormSection>

        <div className="flex items-center justify-end pt-2">
          <Button type="submit" size="lg">
            Submit Referral <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </FlowShell>
  );
}
