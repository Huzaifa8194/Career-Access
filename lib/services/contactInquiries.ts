import {
  addDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { contactInquiriesCol } from "@/lib/firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import { COLLECTIONS, type ContactInquiryDoc, toDateISO } from "@/lib/firebase/types";
import { doc } from "firebase/firestore";

export type ContactInquiryInput = {
  name: string;
  email: string;
  phone?: string;
  role: string;
  message: string;
};

export type ContactInquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  message: string;
  status: "new" | "in-progress" | "resolved";
  sourcePage: string;
  createdAtISO: string | null;
};

function mapInquiry(id: string, data: ContactInquiryDoc): ContactInquiryRow {
  return {
    id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    role: data.role,
    message: data.message,
    status: data.status,
    sourcePage: data.sourcePage,
    createdAtISO: toDateISO(data.createdAt),
  };
}

export async function submitContactInquiry(
  input: ContactInquiryInput
): Promise<string> {
  const docData: ContactInquiryDoc & Record<string, unknown> = {
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    role: input.role,
    message: input.message,
    sourcePage: "/contact",
    status: "new",
    createdAt: serverTimestamp() as unknown as ContactInquiryDoc["createdAt"],
  };
  const ref = await addDoc(contactInquiriesCol(), docData);
  return ref.id;
}

export function subscribeRecentContactInquiries(
  cb: (rows: ContactInquiryRow[]) => void,
  max = 20
): Unsubscribe {
  return onSnapshot(
    query(contactInquiriesCol(), orderBy("createdAt", "desc"), limit(max)),
    (snap) => {
      cb(snap.docs.map((d) => mapInquiry(d.id, d.data() as ContactInquiryDoc)));
    },
    () => cb([])
  );
}

export async function updateContactInquiryStatus(
  id: string,
  status: ContactInquiryRow["status"]
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), COLLECTIONS.contactInquiries, id), {
    status,
    updatedAt: serverTimestamp(),
  });
}
