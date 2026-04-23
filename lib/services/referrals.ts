import {
  createReferral,
  listReferrals,
  updateReferralStatus,
} from "@dataconnect/generated";
import { callDC } from "@/lib/firebase/dataconnect";

export type ReferralRow = {
  id: string;
  referrerName: string;
  organizationName: string;
  email: string;
  applicantFirstName: string;
  applicantLastName: string;
  applicantEmail: string;
  zipCode: string;
  programInterest: string;
  urgency: string;
  reason: string;
  status: string;
  createdAt: string;
};

export type ReferralSubmit = {
  referrerName: string;
  organizationName: string;
  email: string;
  phone: string;
  applicantFirstName: string;
  applicantLastName: string;
  applicantEmail: string;
  applicantPhone: string;
  zipCode: string;
  programInterest: string;
  urgency: string;
  reason: string;
  permissionConfirmed: boolean;
};

export async function submitReferral(
  input: ReferralSubmit
): Promise<{ id: string | null; live: boolean }> {
  const { data, live } = await callDC(() => createReferral(input), {
    label: "createReferral",
  });
  const id =
    (data as { referral_insert?: { id: string } } | null)?.referral_insert?.id ?? null;
  return { id, live };
}

export async function fetchReferrals(): Promise<{ rows: ReferralRow[]; live: boolean }> {
  const { data, live } = await callDC(() => listReferrals(), {
    label: "listReferrals",
  });
  return {
    rows: ((data as { referrals?: ReferralRow[] } | null)?.referrals ?? []).map((r) => ({
      ...r,
    })),
    live,
  };
}

export async function mutateReferralStatus(id: string, status: string) {
  return callDC(() => updateReferralStatus({ id, status }), {
    label: "updateReferralStatus",
  });
}
