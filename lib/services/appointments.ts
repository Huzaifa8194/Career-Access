import {
  createAppointment,
  listAllAppointments,
  listMyAppointments,
  updateAppointmentStatus,
} from "@dataconnect/generated";
import { callDC } from "@/lib/firebase/dataconnect";

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
  const { data, live } = await callDC(
    () =>
      createAppointment({
        ...input,
        contactPhone: input.contactPhone ?? null,
      }),
    { label: "createAppointment" }
  );
  const id =
    (data as { appointment_insert?: { id: string } } | null)?.appointment_insert?.id ?? null;
  return { id, live };
}

export async function fetchMyAppointments(): Promise<{
  rows: AppointmentRow[];
  live: boolean;
}> {
  const { data, live } = await callDC(() => listMyAppointments(), {
    label: "listMyAppointments",
  });
  return {
    rows:
      ((data as { appointments?: AppointmentRow[] } | null)?.appointments ?? [])
        .map((r) => ({ ...r })),
    live,
  };
}

export async function fetchAllAppointments(): Promise<{
  rows: AppointmentRow[];
  live: boolean;
}> {
  const { data, live } = await callDC(() => listAllAppointments(), {
    label: "listAllAppointments",
  });
  return {
    rows:
      ((data as { appointments?: AppointmentRow[] } | null)?.appointments ?? [])
        .map((r) => ({ ...r })),
    live,
  };
}

export async function mutateAppointmentStatus(id: string, status: string) {
  return callDC(() => updateAppointmentStatus({ id, status }), {
    label: "updateAppointmentStatus",
  });
}
