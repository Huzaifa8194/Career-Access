"use client";

const ELIGIBILITY_KEY = "cah:apply:eligibility";
const INTAKE_KEY = "cah:apply:intake";
const CONFIRMATION_KEY = "cah:apply:confirmation";
const BOOK_KEY = "cah:book:last";
const REFERRAL_KEY = "cah:refer:last";

export type EligibilityAnswers = {
  age: string;
  zipCode: string;
  highestEducation: string;
  interest: string;
  householdIncomeRange: string;
  firstGenerationStatus: string;
};

export type IntakeAnswers = {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  preferredContactMethod: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  highestEducation: string;
  currentlyEnrolled: string;
  interest: string;
  currentlyEmployed: string;
  jobTitle: string;
  supportNeeded: string[];
  notes: string;
  consentAccurate: boolean;
  consentContact: boolean;
  consentPartnerSharing: boolean;
};

export type ApplyConfirmation = {
  participantId: string;
  applicationId: string;
  pathway: string;
  referenceId: string;
  email: string;
  firstName: string;
  lastName: string;
  submittedAt: string;
};

export type BookConfirmation = {
  appointmentId: string;
  appointmentType: string;
  scheduledDate: string;
  scheduledTime: string;
  timezone: string;
  contactName: string;
  contactEmail: string;
  mode: "Video" | "Phone" | "In-person";
  reference: string;
};

export type ReferralConfirmation = {
  referralId: string;
  applicantFirstName: string;
  applicantLastName: string;
  organizationName: string;
};

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function clear(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {}
}

export const applyFlow = {
  getEligibility(): EligibilityAnswers | null {
    return read<EligibilityAnswers>(ELIGIBILITY_KEY);
  },
  setEligibility(v: EligibilityAnswers) {
    write(ELIGIBILITY_KEY, v);
  },
  getIntake(): IntakeAnswers | null {
    return read<IntakeAnswers>(INTAKE_KEY);
  },
  setIntake(v: IntakeAnswers) {
    write(INTAKE_KEY, v);
  },
  getConfirmation(): ApplyConfirmation | null {
    return read<ApplyConfirmation>(CONFIRMATION_KEY);
  },
  setConfirmation(v: ApplyConfirmation) {
    write(CONFIRMATION_KEY, v);
  },
  reset() {
    clear(ELIGIBILITY_KEY);
    clear(INTAKE_KEY);
    clear(CONFIRMATION_KEY);
  },
};

export const bookFlow = {
  get(): BookConfirmation | null {
    return read<BookConfirmation>(BOOK_KEY);
  },
  set(v: BookConfirmation) {
    write(BOOK_KEY, v);
  },
  clear() {
    clear(BOOK_KEY);
  },
};

export const referralFlow = {
  get(): ReferralConfirmation | null {
    return read<ReferralConfirmation>(REFERRAL_KEY);
  },
  set(v: ReferralConfirmation) {
    write(REFERRAL_KEY, v);
  },
  clear() {
    clear(REFERRAL_KEY);
  },
};
