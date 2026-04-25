import {
  addDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  type Unsubscribe,
  doc,
  updateDoc,
} from "firebase/firestore";
import { messagesCol } from "@/lib/firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import {
  COLLECTIONS,
  type MessageDoc,
  type PortalRole,
  toDateISO,
} from "@/lib/firebase/types";

export type MessageRow = {
  id: string;
  threadId: string;
  participantId: string;
  senderId: string;
  senderName: string;
  senderRole: PortalRole;
  body: string;
  read: boolean;
  createdAtISO: string | null;
};

export type MessageInput = {
  participantId: string;
  senderId: string;
  senderName: string;
  senderRole: PortalRole;
  body: string;
};

function mapMessage(id: string, data: MessageDoc): MessageRow {
  return {
    id,
    threadId: data.threadId,
    participantId: data.participantId,
    senderId: data.senderId,
    senderName: data.senderName,
    senderRole: data.senderRole,
    body: data.body,
    read: !!data.read,
    createdAtISO: toDateISO(data.createdAt),
  };
}

export async function sendMessage(input: MessageInput): Promise<string> {
  const ref = await addDoc(messagesCol(), {
    threadId: input.participantId,
    participantId: input.participantId,
    senderId: input.senderId,
    senderName: input.senderName,
    senderRole: input.senderRole,
    body: input.body,
    read: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeThread(
  participantId: string,
  cb: (rows: MessageRow[]) => void
): Unsubscribe {
  return onSnapshot(
    query(messagesCol(), where("participantId", "==", participantId)),
    (snap) => {
      const rows = snap.docs.map((d) =>
        mapMessage(d.id, d.data() as MessageDoc)
      );
      rows.sort((a, b) =>
        (a.createdAtISO ?? "").localeCompare(b.createdAtISO ?? "")
      );
      cb(rows);
    },
    () => cb([])
  );
}

export function subscribeAllThreads(
  cb: (rows: MessageRow[]) => void
): Unsubscribe {
  return onSnapshot(
    query(messagesCol(), orderBy("createdAt", "desc")),
    (snap) => {
      cb(snap.docs.map((d) => mapMessage(d.id, d.data() as MessageDoc)));
    },
    () => cb([])
  );
}

export async function markMessageRead(id: string): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), COLLECTIONS.messages, id), {
    read: true,
  });
}

export async function reassignThreadParticipantKey(
  oldParticipantKey: string,
  newParticipantId: string
): Promise<void> {
  if (!oldParticipantKey || !newParticipantId || oldParticipantKey === newParticipantId) return;
  const snap = await getDocs(
    query(messagesCol(), where("participantId", "==", oldParticipantKey))
  );
  await Promise.all(
    snap.docs.map((d) =>
      updateDoc(doc(getFirebaseDb(), COLLECTIONS.messages, d.id), {
        participantId: newParticipantId,
        threadId: newParticipantId,
      })
    )
  );
}
