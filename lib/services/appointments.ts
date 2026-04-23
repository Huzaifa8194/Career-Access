import {
  addDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { appointmentsCol } from "@/lib/firebase/firestore";
import {
  type AppointmentDoc,
  type AppointmentStatus,
  toDateISO,
} from "@/lib/firebase/types";
import { doc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/types";

export type AppointmentRow = {
  id: string;
  participantId: string;
  participantName: string | null;
  advisorId: string | null;
  advisorName: string | null;
  appointmentType: string;
  scheduledAtISO: string | null;
  scheduledDate: string;
  scheduledTime: string;
  timezone: string;
  mode: "Video" | "Phone" | "In-person";
  status: AppointmentStatus;
};

export type AppointmentInput = {
  participantId?: string | null;
  participantName?: string | null;
  advisorId?: string | null;
  advisorName?: string | null;
  appointmentType: string;
  scheduledDate: string;
  scheduledTime: string;
  timezone?: string;
  mode?: "Video" | "Phone" | "In-person";
  contactEmail?: string;
  contactPhone?: string;
  contactName?: string;
};

function parseScheduled(dateStr: string, timeStr: string): Date {
  const m = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  let hours = 0;
  let mins = 0;
  if (m) {
    hours = parseInt(m[1], 10);
    mins = parseInt(m[2], 10);
    const ampm = (m[3] || "").toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
  }
  const [y, mo, d] = dateStr.split("-").map((v) => parseInt(v, 10));
  return new Date(y || 1970, (mo || 1) - 1, d || 1, hours, mins, 0, 0);
}

export async function submitAppointment(
  input: AppointmentInput
): Promise<string> {
  const scheduled = parseScheduled(input.scheduledDate, input.scheduledTime);
  const docData: AppointmentDoc & Record<string, unknown> = {
    participantId: input.participantId ?? "",
    participantName: input.participantName ?? input.contactName ?? null,
    advisorId: input.advisorId ?? null,
    advisorName: input.advisorName ?? null,
    appointmentType: input.appointmentType,
    scheduledAt: Timestamp.fromDate(scheduled),
    scheduledDate: input.scheduledDate,
    scheduledTime: input.scheduledTime,
    timezone: input.timezone ?? "ET",
    mode: input.mode ?? "Video",
    status: "scheduled",
    createdAt: serverTimestamp() as unknown as AppointmentDoc["createdAt"],
    contactEmail: input.contactEmail ?? null,
    contactPhone: input.contactPhone ?? null,
  };
  const ref = await addDoc(appointmentsCol(), docData);
  return ref.id;
}

function mapAppointment(id: string, data: AppointmentDoc): AppointmentRow {
  return {
    id,
    participantId: data.participantId,
    participantName: data.participantName ?? null,
    advisorId: data.advisorId ?? null,
    advisorName: data.advisorName ?? null,
    appointmentType: data.appointmentType,
    scheduledAtISO: toDateISO(data.scheduledAt),
    scheduledDate: data.scheduledDate,
    scheduledTime: data.scheduledTime,
    timezone: data.timezone,
    mode: data.mode ?? "Video",
    status: data.status,
  };
}

export async function fetchUpcomingAppointmentsForParticipant(
  participantId: string,
  max = 25
): Promise<AppointmentRow[]> {
  const snap = await getDocs(
    query(
      appointmentsCol(),
      where("participantId", "==", participantId),
      orderBy("scheduledAt", "asc"),
      limit(max)
    )
  );
  return snap.docs.map((d) => mapAppointment(d.id, d.data() as AppointmentDoc));
}

export function subscribeAppointmentsForParticipant(
  participantId: string,
  cb: (rows: AppointmentRow[]) => void
): Unsubscribe {
  return onSnapshot(
    query(
      appointmentsCol(),
      where("participantId", "==", participantId),
      orderBy("scheduledAt", "asc")
    ),
    (snap) => {
      cb(snap.docs.map((d) => mapAppointment(d.id, d.data() as AppointmentDoc)));
    },
    () => cb([])
  );
}

export async function countScheduledAppointments(): Promise<number> {
  const snap = await getDocs(
    query(appointmentsCol(), where("status", "in", ["scheduled", "confirmed"]))
  );
  return snap.size;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), COLLECTIONS.appointments, id), {
    status,
  });
}
