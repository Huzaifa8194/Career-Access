import {
  addDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { advisorsCol } from "@/lib/firebase/firestore";
import { doc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import { COLLECTIONS, type AdvisorDoc } from "@/lib/firebase/types";

export type AdvisorRow = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string | null;
};

export async function fetchAdvisors(): Promise<AdvisorRow[]> {
  const snap = await getDocs(query(advisorsCol()));
  return snap.docs.map((d) => {
    const data = d.data() as AdvisorDoc;
    return {
      id: d.id,
      userId: data.userId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone ?? null,
    };
  });
}

export function subscribeAdvisors(
  cb: (rows: AdvisorRow[]) => void
): Unsubscribe {
  return onSnapshot(
    query(advisorsCol()),
    (snap) => {
      cb(
        snap.docs.map((d) => {
          const data = d.data() as AdvisorDoc;
          return {
            id: d.id,
            userId: data.userId,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone ?? null,
          };
        })
      );
    },
    () => cb([])
  );
}

export async function upsertAdvisor(
  input: Omit<AdvisorDoc, "createdAt"> & { id?: string }
): Promise<string> {
  if (input.id) {
    await setDoc(
      doc(getFirebaseDb(), COLLECTIONS.advisors, input.id),
      {
        userId: input.userId,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone ?? null,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
    return input.id;
  }
  const ref = await addDoc(advisorsCol(), {
    userId: input.userId,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone ?? null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
