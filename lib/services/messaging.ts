import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/config";
import { fetchMyParticipant } from "./participants";

export type MessageRow = {
  id: string;
  message: string;
  senderRole: string;
  read: boolean;
  createdAt: string;
  sender: { id: string; fullName: string } | null;
};

export async function fetchMyMessages(): Promise<{
  rows: MessageRow[];
  live: boolean;
}> {
  const participant = await fetchMyParticipant();
  if (!participant?._live) return { rows: [], live: false };
  const snap = await getDocs(
    query(
      collection(getFirebaseDb(), "messages"),
      where("participantId", "==", participant.id),
      orderBy("createdAt", "desc")
    )
  );
  return {
    rows: snap.docs.map((d) => {
      const row = d.data() as {
        body?: string;
        message?: string;
        senderRole: string;
        read?: boolean;
        createdAt?: Timestamp | Date | string;
        senderId?: string;
        senderName?: string;
      };
      const createdAt =
        row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : typeof row.createdAt === "string"
            ? row.createdAt
            : row.createdAt?.toDate().toISOString() ?? new Date().toISOString();
      return {
        id: d.id,
        message: row.body ?? row.message ?? "",
        senderRole: row.senderRole,
        read: row.read ?? false,
        createdAt,
        sender: row.senderId
          ? { id: row.senderId, fullName: row.senderName ?? "Staff" }
          : null,
      };
    }),
    live: true,
  };
}

export async function fetchParticipantThread(participantId: string): Promise<{
  rows: MessageRow[];
  live: boolean;
}> {
  const snap = await getDocs(
    query(
      collection(getFirebaseDb(), "messages"),
      where("participantId", "==", participantId),
      orderBy("createdAt", "desc")
    )
  );
  return {
    rows: snap.docs.map((d) => {
      const row = d.data() as {
        body?: string;
        message?: string;
        senderRole: string;
        read?: boolean;
        createdAt?: Timestamp | Date | string;
        senderId?: string;
        senderName?: string;
      };
      const createdAt =
        row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : typeof row.createdAt === "string"
            ? row.createdAt
            : row.createdAt?.toDate().toISOString() ?? new Date().toISOString();
      return {
        id: d.id,
        message: row.body ?? row.message ?? "",
        senderRole: row.senderRole,
        read: row.read ?? false,
        createdAt,
        sender: row.senderId
          ? { id: row.senderId, fullName: row.senderName ?? "Staff" }
          : null,
      };
    }),
    live: true,
  };
}

export async function sendParticipantMessage({
  participantId,
  message,
  senderRole,
}: {
  participantId: string;
  message: string;
  senderRole: "participant" | "advisor" | "admin";
}) {
  const current = getFirebaseAuth().currentUser;
  const ref = await addDoc(collection(getFirebaseDb(), "messages"), {
    participantId,
    senderId: current?.uid ?? "anonymous",
    senderName: current?.displayName ?? current?.email ?? "Unknown",
    senderRole,
    body: message,
    createdAt: serverTimestamp(),
    read: false,
  });
  return { data: { id: ref.id }, error: null, live: true };
}

export async function markRead(id: string) {
  await updateDoc(doc(getFirebaseDb(), "messages", id), {
    read: true,
    updatedAt: serverTimestamp(),
  });
  return { error: null, live: true };
}

export async function createCaseNote({
  participantId,
  content,
  kind,
}: {
  participantId: string;
  content: string;
  kind?: string;
}) {
  const current = getFirebaseAuth().currentUser;
  const ref = await addDoc(collection(getFirebaseDb(), "notes"), {
    participantId,
    advisorId: current?.uid ?? null,
    advisorName: current?.displayName ?? current?.email ?? "Advisor",
    text: content,
    kind: kind ?? "note",
    createdAt: serverTimestamp(),
  });
  return { data: { id: ref.id }, error: null, live: true };
}
