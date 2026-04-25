import {
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { usersCol } from "@/lib/firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import { COLLECTIONS, toDateISO, type PortalRole, type UserDoc } from "@/lib/firebase/types";

export type UserRow = {
  uid: string;
  fullName: string;
  email: string;
  role: PortalRole;
  participantId: string | null;
  createdAtISO: string | null;
};

function mapUser(id: string, data: UserDoc): UserRow {
  return {
    uid: id,
    fullName: data.fullName ?? "",
    email: data.email ?? "",
    role: data.role ?? "participant",
    participantId: data.participantId ?? null,
    createdAtISO: toDateISO(data.createdAt),
  };
}

export function subscribeUsers(cb: (rows: UserRow[]) => void): Unsubscribe {
  return onSnapshot(
    query(usersCol(), orderBy("createdAt", "desc")),
    (snap) => {
      cb(snap.docs.map((d) => mapUser(d.id, d.data() as UserDoc)));
    },
    () => cb([])
  );
}

export async function updateUserRole(uid: string, role: PortalRole): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), COLLECTIONS.users, uid), {
    role,
    updatedAt: serverTimestamp(),
  });
}
