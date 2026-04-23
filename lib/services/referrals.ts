import {
  addDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { referralsCol } from "@/lib/firebase/firestore";
import {
  type ReferralDoc,
  toDateISO,
} from "@/lib/firebase/types";
import { doc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/types";

export type ReferralInput = Omit<
  ReferralDoc,
  "status" | "createdAt" | "updatedAt" | "linkedParticipantId" | "id"
>;

export type ReferralRow = {
  id: string;
  referrerName: string;
  organizationName: string;
  email: string;
  phone: string | null;
  applicantFirstName: string;
  applicantLastName: string;
  applicantEmail: string;
  applicantPhone: string;
  zipCode: string;
  programInterest: string;
  urgency: string;
  reasonForReferral: string;
  status: ReferralDoc["status"];
  createdAtISO: string | null;
};

export async function submitReferral(input: ReferralInput): Promise<string> {
  const docData: ReferralDoc = {
    ...input,
    status: "new",
    linkedParticipantId: null,
    createdAt: serverTimestamp() as unknown as ReferralDoc["createdAt"],
    updatedAt: serverTimestamp() as unknown as ReferralDoc["updatedAt"],
  };
  const r = await addDoc(referralsCol(), docData);
  return r.id;
}

export async function fetchReferrals(max = 200): Promise<ReferralRow[]> {
  const snap = await getDocs(
    query(referralsCol(), orderBy("createdAt", "desc"), limit(max))
  );
  return snap.docs.map((d) => {
    const data = d.data() as ReferralDoc;
    return {
      id: d.id,
      referrerName: data.referrerName,
      organizationName: data.organizationName,
      email: data.email,
      phone: data.phone ?? null,
      applicantFirstName: data.applicantFirstName,
      applicantLastName: data.applicantLastName,
      applicantEmail: data.applicantEmail,
      applicantPhone: data.applicantPhone,
      zipCode: data.zipCode,
      programInterest: data.programInterest,
      urgency: data.urgency,
      reasonForReferral: data.reasonForReferral,
      status: data.status,
      createdAtISO: toDateISO(data.createdAt),
    };
  });
}

export function subscribeReferrals(
  cb: (rows: ReferralRow[]) => void,
  max = 200
): Unsubscribe {
  return onSnapshot(
    query(referralsCol(), orderBy("createdAt", "desc"), limit(max)),
    (snap) => {
      cb(
        snap.docs.map((d) => {
          const data = d.data() as ReferralDoc;
          return {
            id: d.id,
            referrerName: data.referrerName,
            organizationName: data.organizationName,
            email: data.email,
            phone: data.phone ?? null,
            applicantFirstName: data.applicantFirstName,
            applicantLastName: data.applicantLastName,
            applicantEmail: data.applicantEmail,
            applicantPhone: data.applicantPhone,
            zipCode: data.zipCode,
            programInterest: data.programInterest,
            urgency: data.urgency,
            reasonForReferral: data.reasonForReferral,
            status: data.status,
            createdAtISO: toDateISO(data.createdAt),
          };
        })
      );
    },
    () => cb([])
  );
}

export async function updateReferralStatus(
  id: string,
  status: ReferralDoc["status"]
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), COLLECTIONS.referrals, id), {
    status,
    updatedAt: serverTimestamp(),
  });
}
