"use client";

import type { EligibilityAnswers } from "@/lib/pathway";

const ELIGIBILITY_KEY = "cah:apply:eligibility";
const RESULT_KEY = "cah:apply:result";

export type ApplyResult = {
  participantId: string | null;
  applicationId: string | null;
  pathway: string;
  firstName: string;
  email: string;
  bookLink: string;
  live: boolean;
  submittedAt: string;
};

function safeSession(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function saveEligibility(answers: EligibilityAnswers) {
  const s = safeSession();
  if (!s) return;
  try {
    s.setItem(ELIGIBILITY_KEY, JSON.stringify(answers));
  } catch {
    /* ignore */
  }
}

export function readEligibility(): EligibilityAnswers | null {
  const s = safeSession();
  if (!s) return null;
  try {
    const raw = s.getItem(ELIGIBILITY_KEY);
    return raw ? (JSON.parse(raw) as EligibilityAnswers) : null;
  } catch {
    return null;
  }
}

export function saveApplyResult(result: ApplyResult) {
  const s = safeSession();
  if (!s) return;
  try {
    s.setItem(RESULT_KEY, JSON.stringify(result));
  } catch {
    /* ignore */
  }
}

export function readApplyResult(): ApplyResult | null {
  const s = safeSession();
  if (!s) return null;
  try {
    const raw = s.getItem(RESULT_KEY);
    return raw ? (JSON.parse(raw) as ApplyResult) : null;
  } catch {
    return null;
  }
}

export function clearApplySession() {
  const s = safeSession();
  if (!s) return;
  try {
    s.removeItem(ELIGIBILITY_KEY);
    s.removeItem(RESULT_KEY);
  } catch {
    /* ignore */
  }
}
