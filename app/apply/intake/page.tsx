"use client";

import { useEffect, useState } from "react";
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
import { applyFlow, type IntakeAnswers } from "@/lib/flowState";
import { createParticipantFromApplication } from "@/lib/services/participants";
import { uploadParticipantDocument } from "@/lib/services/documents";
import { useAuth } from "@/lib/firebase/auth";

const steps = [
  { label: "Eligibility" },
  { label: "Intake" },
  { label: "Confirmation" },
];

const supportOptions = [
  "FAFSA / Financial Aid Assistance",
  "College Application Help",
  "Apprenticeship Application Help",
  "Career Advising",
  "Resume / Interview Help",
  "Transportation Support",
  "Childcare Support",
  "Internet / Device Access",
];

export default function IntakePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [contact, setContact] = useState("Email");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("NJ");
  const [zipCode, setZipCode] = useState("");
  const [education, setEducation] = useState("");
  const [enrolled, setEnrolled] = useState("");
  const [interest, setInterest] = useState("");
  const [employed, setEmployed] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [supports, setSupports] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [consentAccurate, setConsentAccurate] = useState(false);
  const [consentContact, setConsentContact] = useState(false);
  const [consentPartnerSharing, setConsentPartnerSharing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prev = applyFlow.getIntake();
    if (prev) {
      setFirstName(prev.firstName);
      setLastName(prev.lastName);
      setEmail(prev.email);
      setMobilePhone(prev.mobilePhone);
      setContact(prev.preferredContactMethod || "Email");
      setStreetAddress(prev.streetAddress);
      setCity(prev.city);
      setState(prev.state || "NJ");
      setZipCode(prev.zipCode);
      setEducation(prev.highestEducation);
      setEnrolled(prev.currentlyEnrolled);
      setInterest(prev.interest);
      setEmployed(prev.currentlyEmployed);
      setJobTitle(prev.jobTitle);
      setSupports(prev.supportNeeded || []);
      setNotes(prev.notes);
      setConsentAccurate(prev.consentAccurate);
      setConsentContact(prev.consentContact);
      setConsentPartnerSharing(prev.consentPartnerSharing);
    } else {
      const elig = applyFlow.getEligibility();
      if (elig) {
        setZipCode(elig.zipCode || "");
        setEducation(elig.highestEducation || "");
      }
    }
  }, []);

  function toggleSupport(name: string) {
    setSupports((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const intake: IntakeAnswers = {
      firstName,
      lastName,
      email,
      mobilePhone,
      preferredContactMethod: contact,
      streetAddress,
      city,
      state,
      zipCode,
      highestEducation: education,
      currentlyEnrolled: enrolled,
      interest,
      currentlyEmployed: employed,
      jobTitle,
      supportNeeded: supports,
      notes,
      consentAccurate,
      consentContact,
      consentPartnerSharing,
    };
    applyFlow.setIntake(intake);

    try {
      const eligibility = applyFlow.getEligibility() ?? {
        age: "",
        zipCode,
        highestEducation: education,
        interest,
        householdIncomeRange: "",
        firstGenerationStatus: "",
      };

      const result = await createParticipantFromApplication({
        userId: user?.uid ?? null,
        eligibility: eligibility as unknown as Record<string, unknown>,
        intake: intake as unknown as Record<string, unknown>,
        source: "Direct",
      });

      if (file) {
        try {
          await uploadParticipantDocument(
            result.participantId,
            file,
            user?.uid ?? "applicant"
          );
        } catch {
        }
      }

      const submittedAt = new Date().toISOString();
      applyFlow.setConfirmation({
        participantId: result.participantId,
        applicationId: result.applicationId,
        pathway: result.pathway,
        referenceId: `CA-${submittedAt.slice(0, 10)}-${result.participantId.slice(-6).toUpperCase()}`,
        email,
        firstName,
        lastName,
        submittedAt,
      });

      router.push("/apply/confirmation");
    } catch (err) {
      console.error(err);
      setError(
        (err as Error)?.message ||
          "We couldn't submit your application. Please try again."
      );
      setSubmitting(false);
    }
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
              <li>You can leave fields blank if you&apos;re not sure.</li>
              <li>Documents are optional — your advisor will request what&apos;s needed.</li>
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
              Book an Advising Call <ArrowRight size={13} />
            </Link>
          </FlowSidebar>
        </div>
      }
    >
      <FormHeader
        title="Complete Your Application"
        subtitle="Provide your information so we can support you."
      />

      <form className="grid gap-5" onSubmit={onSubmit}>
        <FormSection title="Personal Information">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First Name" required htmlFor="fn">
              <Input
                id="fn"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Field>
            <Field label="Last Name" required htmlFor="ln">
              <Input
                id="ln"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email Address" required htmlFor="em">
              <Input
                id="em"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Mobile Phone" required htmlFor="ph">
              <Input
                id="ph"
                type="tel"
                required
                placeholder="(201) 555-0123"
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Preferred Contact Method" required>
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
          <Field label="Street Address" htmlFor="addr">
            <Input
              id="addr"
              placeholder="123 Main St"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="City" htmlFor="city">
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Field>
            <Field label="State" htmlFor="state">
              <Select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option>NJ</option>
                <option>NY</option>
                <option>PA</option>
                <option>CT</option>
                <option>DE</option>
              </Select>
            </Field>
            <Field label="ZIP Code" htmlFor="zip" required>
              <Input
                id="zip"
                required
                inputMode="numeric"
                maxLength={5}
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Education">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="What is the highest level of education you've completed?"
              required
              htmlFor="edu"
            >
              <Select
                id="edu"
                required
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              >
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
            <Field label="Are you currently enrolled in school?" required>
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
          <Field label="What are you most interested in?" required>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Associate Degree",
                "Bachelor's Degree",
                "Certificate / Training",
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
          <Field label="Are you currently employed?" required>
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
            <Field label="Job Title (if applicable)" htmlFor="jt">
              <Input
                id="jt"
                placeholder="e.g. Retail associate"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </Field>
          )}
        </FormSection>

        <FormSection
          title="Support Needed"
          description="Select all that apply."
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>
        </FormSection>

        <FormSection
          title="Upload Documents"
          description="Upload any documents (optional)."
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
              Upload Files
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
            checked={consentAccurate}
            onChange={(e) => setConsentAccurate(e.target.checked)}
            label="I confirm the information provided is accurate."
          />
          <Checkbox
            required
            checked={consentContact}
            onChange={(e) => setConsentContact(e.target.checked)}
            label="I consent to be contacted by program staff."
          />
          <Checkbox
            checked={consentPartnerSharing}
            onChange={(e) => setConsentPartnerSharing(e.target.checked)}
            label="I agree to allow my information to be shared with partner organizations for support services."
            description="Optional — you can update this anytime in your portal."
          />
        </FormSection>

        {error && (
          <div className="rounded-md border border-danger/30 bg-danger-50 p-3 text-[13px] text-danger">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <Link
            href="/apply"
            className="inline-flex h-12 items-center px-5 rounded-md text-[15px] font-medium text-ink border border-line bg-white hover:border-line-strong hover:bg-canvas"
          >
            Back
          </Link>
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Application"}{" "}
            <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </FlowShell>
  );
}
