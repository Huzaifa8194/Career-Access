import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit as qLimit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import { fetchMyParticipant } from "./participants";

export type TaskRow = {
  id: string;
  title: string;
  description?: string | null;
  status: string; // "open" | "in-progress" | "done"
  priority?: string | null; // "High" | "Med" | "Low"
  dueDate?: string | null;
  createdAt?: string | null;
  participant?: { id: string; firstName: string; lastName: string } | null;
};

export type TaskSubmit = {
  participantId: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
};

export async function fetchTasksForParticipant(
  participantId: string
): Promise<{ rows: TaskRow[]; live: boolean }> {
  const snap = await getDocs(
    query(
      collection(getFirebaseDb(), "tasks"),
      where("participantId", "==", participantId),
      orderBy("dueDate", "asc")
    )
  );
  return {
    rows: snap.docs.map((d) => {
      const row = d.data() as {
        title: string;
        description?: string | null;
        status?: string;
        priority?: string;
        dueDate?: string | Timestamp | Date | null;
        createdAt?: string | Timestamp | Date | null;
      };
      const dueDate =
        row.dueDate instanceof Date
          ? row.dueDate.toISOString()
          : typeof row.dueDate === "string"
            ? row.dueDate
            : row.dueDate?.toDate().toISOString() ?? null;
      const createdAt =
        row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : typeof row.createdAt === "string"
            ? row.createdAt
            : row.createdAt?.toDate().toISOString() ?? null;
      return {
        id: d.id,
        title: row.title,
        description: row.description ?? null,
        status: row.status ?? "open",
        priority: row.priority ?? "Med",
        dueDate,
        createdAt,
      };
    }),
    live: true,
  };
}

export async function fetchOpenTasks(
  limit = 25
): Promise<{ rows: TaskRow[]; live: boolean }> {
  const snap = await getDocs(
    query(
      collection(getFirebaseDb(), "tasks"),
      where("status", "!=", "done"),
      orderBy("status", "asc"),
      orderBy("dueDate", "asc"),
      qLimit(limit)
    )
  );
  return {
    rows: snap.docs.map((d) => {
      const row = d.data() as {
        title: string;
        description?: string | null;
        status?: string;
        priority?: string;
        dueDate?: string | Timestamp | Date | null;
        createdAt?: string | Timestamp | Date | null;
      };
      const dueDate =
        row.dueDate instanceof Date
          ? row.dueDate.toISOString()
          : typeof row.dueDate === "string"
            ? row.dueDate
            : row.dueDate?.toDate().toISOString() ?? null;
      const createdAt =
        row.createdAt instanceof Date
          ? row.createdAt.toISOString()
          : typeof row.createdAt === "string"
            ? row.createdAt
            : row.createdAt?.toDate().toISOString() ?? null;
      return {
        id: d.id,
        title: row.title,
        description: row.description ?? null,
        status: row.status ?? "open",
        priority: row.priority ?? "Med",
        dueDate,
        createdAt,
      };
    }),
    live: true,
  };
}

export async function fetchMyTasks(): Promise<{
  rows: TaskRow[];
  live: boolean;
}> {
  const participant = await fetchMyParticipant();
  if (!participant?._live) return { rows: [], live: false };
  return fetchTasksForParticipant(participant.id);
}

export async function submitTask(input: TaskSubmit) {
  const ref = await addDoc(collection(getFirebaseDb(), "tasks"), {
    participantId: input.participantId,
    title: input.title,
    description: input.description ?? null,
    status: input.status ?? "open",
    priority: input.priority ?? "Med",
    dueDate: input.dueDate ?? null,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, live: true };
}

export async function mutateTaskStatus(id: string, status: string) {
  await updateDoc(doc(getFirebaseDb(), "tasks", id), {
    status,
    updatedAt: serverTimestamp(),
  });
  return { error: null, live: true };
}
