// Deterministic pathway routing logic.
// Given the combination of eligibility + intake answers, return one of:
//   "College + FAFSA", "Short-term training", "Apprenticeship", "GED / HSE"
//
// Pure function — safe to call from both client and server.

import type { Pathway } from "./data";

export type EligibilityAnswers = {
  ageRange?: string;
  zip?: string;
  highestEducation?: string;
  interest?: string;
  incomeRange?: string;
  firstGen?: string;
};

export type IntakeAnswers = {
  highestEducation?: string;
  currentlyEnrolled?: string;
  interest?: string;
  employed?: string;
  jobTitle?: string;
  supportNeeded?: string[];
};

const GED_EDUCATION_LEVELS = new Set<string>([
  "Some high school",
]);

const TRAINING_INTEREST = new Set<string>([
  "Certificate / Training",
  "Job Training / Certificate",
  "Short-term training",
]);

const APPRENTICESHIP_INTEREST = new Set<string>([
  "Apprenticeship",
]);

const COLLEGE_INTEREST = new Set<string>([
  "College",
  "Associate Degree",
  "Bachelor's Degree",
]);

/**
 * Recommend a pathway. The branching order is intentional:
 *   1. Missing foundational credential → GED/HSE first
 *   2. Explicit apprenticeship interest → Apprenticeship
 *   3. Explicit training/cert interest → Short-term training
 *   4. Explicit college interest → College + FAFSA
 *   5. Fallback: if they have a diploma/GED already, default to College + FAFSA;
 *      otherwise Short-term training as the faster ramp.
 */
export function recommendPathway(
  eligibility: EligibilityAnswers,
  intake: IntakeAnswers = {}
): Pathway {
  const education =
    intake.highestEducation ?? eligibility.highestEducation ?? "";
  const interest = intake.interest ?? eligibility.interest ?? "";

  if (GED_EDUCATION_LEVELS.has(education)) return "GED / HSE";
  if (APPRENTICESHIP_INTEREST.has(interest)) return "Apprenticeship";
  if (TRAINING_INTEREST.has(interest)) return "Short-term training";
  if (COLLEGE_INTEREST.has(interest)) return "College + FAFSA";

  // "Not Sure" fallback branches on the education floor.
  if (education.toLowerCase().includes("high school") || education === "GED / HSE") {
    return "College + FAFSA";
  }
  return "Short-term training";
}

/**
 * Serialize the `supportNeeded` multi-select for storage as a single column.
 * The schema stores it as a comma-delimited string.
 */
export function serializeSupport(list: string[] | undefined): string {
  if (!list || list.length === 0) return "";
  return list.join(" | ");
}

export function deserializeSupport(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/\s*\|\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}
