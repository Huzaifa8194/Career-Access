import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  limit as qLimit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import { tasksCol } from "@/lib/firebase/firestore";
import {
  COLLECTIONS,
  toDateISO,
  type TaskDoc,
  type TaskStatus,
} from "@/lib/firebase/types";

export type TaskRow = {
  id: string;
  participantId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: "High" | "Med" | "Low";
  dueDate: string | null;
  createdAtISO: string | null;
};

export type TaskSubmit = {
  participantId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: "High" | "Med" | "Low";
  dueDate?: string;
};

function mapTask(id: string, data: TaskDoc): TaskRow {
  return {
    id,
    participantId: data.participantId,
    title: data.title,
    description: data.description ?? null,
    status: (data.status ?? "open") as TaskStatus,
    priority: (data.priority ?? "Med") as "High" | "Med" | "Low",
    dueDate: data.dueDate ?? null,
    createdAtISO: toDateISO(data.createdAt),
  };
}

export async function fetchTasksForParticipant(
  participantId: string,
  max = 100
): Promise<TaskRow[]> {
  const snap = await getDocs(
    query(
      tasksCol(),
      where("participantId", "==", participantId),
      qLimit(max)
    )
  );
  return snap.docs
    .map((d) => mapTask(d.id, d.data() as TaskDoc))
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));
}

export function subscribeTasksForParticipant(
  participantId: string,
  cb: (rows: TaskRow[]) => void
): Unsubscribe {
  return onSnapshot(
    query(tasksCol(), where("participantId", "==", participantId)),
    (snap) => {
      const rows = snap.docs.map((d) => mapTask(d.id, d.data() as TaskDoc));
      rows.sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));
      cb(rows);
    },
    () => cb([])
  );
}

export async function fetchOpenTasks(max = 50): Promise<TaskRow[]> {
  const snap = await getDocs(
    query(
      tasksCol(),
      where("status", "in", ["open", "in-progress"]),
      qLimit(max)
    )
  );
  return snap.docs
    .map((d) => mapTask(d.id, d.data() as TaskDoc))
    .sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));
}

export function subscribeOpenTasks(cb: (rows: TaskRow[]) => void): Unsubscribe {
  return onSnapshot(
    query(tasksCol(), orderBy("createdAt", "desc"), qLimit(200)),
    (snap) => {
      cb(snap.docs.map((d) => mapTask(d.id, d.data() as TaskDoc)));
    },
    () => cb([])
  );
}

export async function submitTask(input: TaskSubmit): Promise<string> {
  const ref = await addDoc(tasksCol(), {
    participantId: input.participantId,
    title: input.title,
    description: input.description ?? null,
    status: input.status ?? "open",
    priority: input.priority ?? "Med",
    dueDate: input.dueDate ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), COLLECTIONS.tasks, id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(getFirebaseDb(), COLLECTIONS.tasks, id));
}
