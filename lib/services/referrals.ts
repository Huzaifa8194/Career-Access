import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";

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
  const ref = await addDoc(collection(getFirebaseDb(), "referrals"), {
    ...input,
    status: "new",
    source: "partner",
    reasonForReferral: input.reason,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, live: true };
}

export async function fetchReferrals(): Promise<{ rows: ReferralRow[]; live: boolean }> {
  const snap = await getDocs(
    query(collection(getFirebaseDb(), "referrals"), orderBy("createdAt", "desc"))
  );
  const rows = snap.docs.map((d) => {
    const row = d.data() as {
      referrerName: string;
      organizationName: string;
      email: string;
      applicantFirstName: string;
      applicantLastName: string;
      applicantEmail: string;
      zipCode: string;
      programInterest: string;
      urgency: string;
      reason?: string;
      reasonForReferral?: string;
      status?: string;
      createdAt?: Timestamp | Date | string;
    };
    const createdAt =
      row.createdAt instanceof Date
        ? row.createdAt
        : typeof row.createdAt === "string"
          ? new Date(row.createdAt)
          : row.createdAt && "toDate" in row.createdAt
            ? row.createdAt.toDate()
            : null;
    return {
      id: d.id,
      referrerName: row.referrerName,
      organizationName: row.organizationName,
      email: row.email,
      applicantFirstName: row.applicantFirstName,
      applicantLastName: row.applicantLastName,
      applicantEmail: row.applicantEmail,
      zipCode: row.zipCode,
      programInterest: row.programInterest,
      urgency: row.urgency,
      reason: row.reasonForReferral ?? row.reason ?? "",
      status: row.status ?? "new",
      createdAt: createdAt ? createdAt.toISOString() : new Date().toISOString(),
    };
  });
  return {
    rows,
    live: true,
  };
}

export async function mutateReferralStatus(id: string, status: string) {
  await updateDoc(doc(getFirebaseDb(), "referrals", id), {
    status,
    updatedAt: serverTimestamp(),
  });
  return { error: null, live: true };
}
