import {
  addDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { advisorsCol, usersCol } from "@/lib/firebase/firestore";
import { doc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import { COLLECTIONS, type AdvisorDoc, type UserDoc } from "@/lib/firebase/types";

export type AdvisorRow = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string | null;
};

export async function fetchAdvisors(): Promise<AdvisorRow[]> {
  const [advisorSnap, userSnap] = await Promise.all([
    getDocs(query(advisorsCol())),
    getDocs(query(usersCol(), where("role", "==", "advisor"))),
  ]);
  const rows: AdvisorRow[] = advisorSnap.docs.map((d) => {
    const data = d.data() as AdvisorDoc;
    return {
      id: d.id,
      userId: data.userId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone ?? null,
    };
  });
  const knownUserIds = new Set(rows.map((r) => r.userId));
  for (const d of userSnap.docs) {
    const data = d.data() as UserDoc;
    if (knownUserIds.has(d.id)) continue;
    rows.push({
      id: d.id,
      userId: d.id,
      fullName: data.fullName ?? data.email ?? "Advisor",
      email: data.email ?? "",
      phone: data.phone ?? null,
    });
  }
  return rows;
}

export function subscribeAdvisors(
  cb: (rows: AdvisorRow[]) => void
): Unsubscribe {
  let advisorRows: AdvisorRow[] = [];
  let userRows: AdvisorRow[] = [];
  const emit = () => {
    const knownUserIds = new Set(advisorRows.map((r) => r.userId));
    cb([...advisorRows, ...userRows.filter((r) => !knownUserIds.has(r.userId))]);
  };

  const a = onSnapshot(
    query(advisorsCol()),
    (snap) => {
      advisorRows = snap.docs.map((d) => {
        const data = d.data() as AdvisorDoc;
        return {
          id: d.id,
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone ?? null,
        };
      });
      emit();
    },
    () => cb([])
  );

  const b = onSnapshot(
    query(usersCol(), where("role", "==", "advisor")),
    (snap) => {
      userRows = snap.docs.map((d) => {
        const data = d.data() as UserDoc;
        return {
          id: d.id,
          userId: d.id,
          fullName: data.fullName ?? data.email ?? "Advisor",
          email: data.email ?? "",
          phone: data.phone ?? null,
        };
      });
      emit();
    },
    () => cb([])
  );

  return () => {
    a();
    b();
  };
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
