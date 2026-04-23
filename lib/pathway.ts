import type { Pathway } from "@/lib/firebase/types";

export type PathwayInputs = {
  eligibilityInterest?: string;
  eligibilityEducation?: string;
  intakeEducation?: string;
  intakeInterest?: string;
  supportNeeded?: string[];
};

export function recommendPathway(inputs: PathwayInputs): Pathway {
  const edu = (inputs.intakeEducation || inputs.eligibilityEducation || "").toLowerCase();
  const intent = (inputs.intakeInterest || inputs.eligibilityInterest || "").toLowerCase();
  const support = (inputs.supportNeeded || []).map((s) => s.toLowerCase());

  if (edu.includes("some high school") || edu.includes("ged") || edu.includes("hse")) {
    if (
      edu.includes("some high school") &&
      !intent.includes("apprentice") &&
      !intent.includes("training") &&
      !intent.includes("certificate")
    ) {
      return "GED / HSE";
    }
  }

  if (intent.includes("apprentice")) {
    return "Apprenticeship";
  }

  if (
    intent.includes("training") ||
    intent.includes("certificate") ||
    intent.includes("certification")
  ) {
    return "Short-term training";
  }

  if (
    intent.includes("college") ||
    intent.includes("associate") ||
    intent.includes("bachelor")
  ) {
    return "College + FAFSA";
  }

  if (support.some((s) => s.includes("fafsa") || s.includes("college"))) {
    return "College + FAFSA";
  }
  if (support.some((s) => s.includes("apprentice"))) {
    return "Apprenticeship";
  }
  if (support.some((s) => s.includes("resume") || s.includes("interview"))) {
    return "Short-term training";
  }

  return "College + FAFSA";
}

export function pathwayBadgeTone(pathway: Pathway):
  | "primary"
  | "success"
  | "warn"
  | "info"
  | "muted" {
  switch (pathway) {
    case "College + FAFSA":
      return "primary";
    case "Short-term training":
      return "info";
    case "Apprenticeship":
      return "warn";
    case "GED / HSE":
      return "muted";
    default:
      return "muted";
  }
}
