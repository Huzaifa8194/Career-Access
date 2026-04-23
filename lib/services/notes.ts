import {
  addDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { notesCol } from "@/lib/firebase/firestore";
import { type NoteDoc, toDateISO } from "@/lib/firebase/types";

export type NoteRow = {
  id: string;
  participantId: string;
  advisorId: string | null;
  advisorName: string | null;
  type: string;
  text: string;
  createdAtISO: string | null;
};

export type NoteInput = {
  participantId: string;
  advisorId?: string | null;
  advisorName?: string | null;
  type?: string;
  text: string;
};

function mapNote(id: string, data: NoteDoc): NoteRow {
  return {
    id,
    participantId: data.participantId,
    advisorId: data.advisorId ?? null,
    advisorName: data.advisorName ?? null,
    type: data.type ?? "Note",
    text: data.text,
    createdAtISO: toDateISO(data.createdAt),
  };
}

export async function addNote(input: NoteInput): Promise<string> {
  const ref = await addDoc(notesCol(), {
    participantId: input.participantId,
    advisorId: input.advisorId ?? null,
    advisorName: input.advisorName ?? null,
    type: input.type ?? "Note",
    text: input.text,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function fetchNotesForParticipant(
  participantId: string
): Promise<NoteRow[]> {
  const snap = await getDocs(
    query(notesCol(), where("participantId", "==", participantId))
  );
  const rows = snap.docs.map((d) => mapNote(d.id, d.data() as NoteDoc));
  rows.sort((a, b) => (b.createdAtISO ?? "").localeCompare(a.createdAtISO ?? ""));
  return rows;
}

export function subscribeNotesForParticipant(
  participantId: string,
  cb: (rows: NoteRow[]) => void
): Unsubscribe {
  return onSnapshot(
    query(notesCol(), where("participantId", "==", participantId)),
    (snap) => {
      const rows = snap.docs.map((d) => mapNote(d.id, d.data() as NoteDoc));
      rows.sort((a, b) =>
        (b.createdAtISO ?? "").localeCompare(a.createdAtISO ?? "")
      );
      cb(rows);
    },
    () => cb([])
  );
}
