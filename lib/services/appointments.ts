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

export type AppointmentRow = {
  id: string;
  appointmentType: string;
  scheduledAt: string;
  timezone: string;
  status: string;
  contactName?: string;
  contactEmail?: string;
  participant?: { id: string; firstName: string; lastName: string } | null;
  advisor?: { id: string; fullName: string } | null;
};

export type AppointmentSubmit = {
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  appointmentType: string;
  scheduledAt: string; // ISO
  timezone: string;
};

export async function submitAppointment(input: AppointmentSubmit) {
  const participant = await fetchMyParticipant();
  const id = getFirebaseAuth().currentUser?.uid ?? null;
  const ref = await addDoc(collection(getFirebaseDb(), "appointments"), {
    participantId: participant?._live ? participant.id : null,
    advisorId: null,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone ?? null,
    appointmentType: input.appointmentType,
    scheduledAt: input.scheduledAt,
    timezone: input.timezone,
    status: "scheduled",
    createdAt: serverTimestamp(),
    createdBy: id,
  });
  return { id: ref.id, live: true };
}

export async function fetchMyAppointments(): Promise<{
  rows: AppointmentRow[];
  live: boolean;
}> {
  const uid = getFirebaseAuth().currentUser?.uid ?? "";
  const participant = await fetchMyParticipant();
  const constraints = participant?._live
    ? query(
        collection(getFirebaseDb(), "appointments"),
        where("participantId", "==", participant.id),
        orderBy("scheduledAt", "asc")
      )
    : query(
        collection(getFirebaseDb(), "appointments"),
        where("createdBy", "==", uid),
        orderBy("scheduledAt", "asc")
      );
  const snap = await getDocs(constraints);
  return {
    rows: snap.docs.map((d) => {
      const row = d.data() as {
        appointmentType: string;
        scheduledAt: string | Timestamp | Date;
        timezone: string;
        status: string;
        contactName?: string;
        contactEmail?: string;
      };
      const scheduledAt =
        row.scheduledAt instanceof Date
          ? row.scheduledAt.toISOString()
          : typeof row.scheduledAt === "string"
            ? row.scheduledAt
            : row.scheduledAt?.toDate().toISOString();
      return {
        id: d.id,
        appointmentType: row.appointmentType,
        scheduledAt,
        timezone: row.timezone,
        status: row.status,
        contactName: row.contactName,
        contactEmail: row.contactEmail,
      };
    }),
    live: true,
  };
}

export async function fetchAllAppointments(): Promise<{
  rows: AppointmentRow[];
  live: boolean;
}> {
  const snap = await getDocs(
    query(collection(getFirebaseDb(), "appointments"), orderBy("scheduledAt", "asc"))
  );
  return {
    rows: snap.docs.map((d) => {
      const row = d.data() as {
        appointmentType: string;
        scheduledAt: string | Timestamp | Date;
        timezone: string;
        status: string;
      };
      const scheduledAt =
        row.scheduledAt instanceof Date
          ? row.scheduledAt.toISOString()
          : typeof row.scheduledAt === "string"
            ? row.scheduledAt
            : row.scheduledAt?.toDate().toISOString();
      return {
        id: d.id,
        appointmentType: row.appointmentType,
        scheduledAt,
        timezone: row.timezone,
        status: row.status,
      };
    }),
    live: true,
  };
}

export async function mutateAppointmentStatus(id: string, status: string) {
  await updateDoc(doc(getFirebaseDb(), "appointments", id), {
    status,
    updatedAt: serverTimestamp(),
  });
  return { error: null, live: true };
}
