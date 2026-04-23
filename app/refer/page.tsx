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
import {
  Field,
  Input,
  Select,
  Textarea,
  Checkbox,
} from "@/components/ui/Field";
import { ArrowRight } from "@/components/icons";
import { submitReferral } from "@/lib/services/referrals";

const steps = [{ label: "Referral" }, { label: "Confirmation" }];

export default function ReferPage() {
  const router = useRouter();
  const [referrerName, setReferrerName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [applicantFirstName, setApplicantFirstName] = useState("");
  const [applicantLastName, setApplicantLastName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [programInterest, setProgramInterest] = useState("");
  const [urgency, setUrgency] = useState("");
  const [reason, setReason] = useState("");
  const [permission, setPermission] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!permission) {
      setError("Please confirm you have permission to refer this person.");
      return;
    }
    setSubmitting(true);
    try {
      await submitReferral({
        referrerName,
        organizationName,
        email,
        phone,
        applicantFirstName,
        applicantLastName,
        applicantEmail,
        applicantPhone,
        zipCode,
        programInterest,
        urgency,
        reason,
        permissionConfirmed: permission,
      });
      router.push("/refer/confirmation");
    } catch (err) {
      console.error(err);
      setError("We couldn't submit your referral. Please try again.");
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
        title="Refer a Participant"
        subtitle="Help someone take the next step."
      />

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <FormSection title="Your Information">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your Name" required htmlFor="r-name">
              <Input
                id="r-name"
                required
                value={referrerName}
                onChange={(e) => setReferrerName(e.target.value)}
              />
            </Field>
            <Field label="Organization Name" required htmlFor="r-org">
              <Input
                id="r-org"
                required
                placeholder="Workforce board, library, etc."
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email Address" required htmlFor="r-email">
              <Input
                id="r-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Phone Number" htmlFor="r-phone">
              <Input
                id="r-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Applicant Information">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Applicant First Name" required htmlFor="a-first">
              <Input
                id="a-first"
                required
                value={applicantFirstName}
                onChange={(e) => setApplicantFirstName(e.target.value)}
              />
            </Field>
            <Field label="Applicant Last Name" required htmlFor="a-last">
              <Input
                id="a-last"
                required
                value={applicantLastName}
                onChange={(e) => setApplicantLastName(e.target.value)}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Applicant Email" required htmlFor="a-email">
              <Input
                id="a-email"
                type="email"
                required
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
              />
            </Field>
            <Field label="Applicant Phone" required htmlFor="a-phone">
              <Input
                id="a-phone"
                type="tel"
                required
                value={applicantPhone}
                onChange={(e) => setApplicantPhone(e.target.value)}
              />
            </Field>
          </div>
          <Field label="ZIP Code" required htmlFor="a-zip">
            <Input
              id="a-zip"
              required
              inputMode="numeric"
              maxLength={5}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </Field>
        </FormSection>

        <FormSection title="Referral Details">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Program Interest" required htmlFor="prog">
              <Select
                id="prog"
                required
                value={programInterest}
                onChange={(e) => setProgramInterest(e.target.value)}
              >
                <option value="" disabled>
                  Select one
                </option>
                <option>College + FAFSA</option>
                <option>Short-term training</option>
                <option>Apprenticeship</option>
                <option>GED / HSE</option>
                <option>Not sure / advisor&apos;s call</option>
              </Select>
            </Field>
            <Field label="Urgency" required htmlFor="urg">
              <Select
                id="urg"
                required
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
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
            <Textarea
              id="reason"
              rows={4}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Field>
        </FormSection>

        <FormSection title="Consent">
          <Checkbox
            required
            checked={permission}
            onChange={(e) => setPermission(e.target.checked)}
            label="I confirm I have permission to refer this individual."
            description="We will only contact them about Career Access Hub services."
          />
        </FormSection>

        {error ? (
          <p
            role="alert"
            className="rounded-md border border-danger/30 bg-danger-50 px-3 py-2 text-[13px] text-[#991B1B]"
          >
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-end pt-2">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Referral"}{" "}
            <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </FlowShell>
  );
}
