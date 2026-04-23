import {
  assignAdvisor,
  createApplication,
  createParticipant,
  flagParticipantRisk,
  getMyParticipant,
  getParticipant,
  getParticipantDetail,
  linkCurrentUserToParticipant,
  listAllParticipants,
  listParticipantsByAdvisor,
  updateParticipantPathway,
  updateParticipantStatus,
} from "@dataconnect/generated";
import {
  participants as demoParticipants,
  participantSummary as demoSummary,
  type Participant as DemoParticipant,
  type ParticipantStatus,
  type Pathway,
  type Source,
} from "@/lib/data";
import { callDC, isDataConnectReady } from "@/lib/firebase/dataconnect";
import { deserializeSupport, serializeSupport } from "@/lib/pathway";

export type PortalParticipant = DemoParticipant & {
  _live: boolean;
};

type DCUser = { id: string; fullName: string; email: string } | null | undefined;

type DCParticipantRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  address?: string | null;
  pathway: string;
  status: string;
  source: string;
  submittedAt?: string | null;
  lastActivityAt?: string | null;
  riskFlag?: boolean | null;
  educationLevel?: string | null;
  supportNeeded?: string | null;
  currentlyEnrolled?: boolean | null;
  programInterest?: string | null;
  employed?: boolean | null;
  jobTitle?: string | null;
  preferredContactMethod?: string | null;
  consentAccuracy?: boolean | null;
  consentContact?: boolean | null;
  consentDataShare?: boolean | null;
  assignedAdvisor?: DCUser;
};

function humanizeActivity(iso?: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
}

function mapParticipant(row: DCParticipantRow): PortalParticipant {
  const risk: PortalParticipant["risk"] = row.riskFlag ? "stalled" : "ok";
  return {
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    zip: row.zipCode ?? "",
    age: 0,
    pathway: (row.pathway as Pathway) ?? "College + FAFSA",
    status: (row.status as ParticipantStatus) ?? "New",
    source: (row.source as Source) ?? "Direct",
    appliedAt: row.submittedAt ? new Date(row.submittedAt).toISOString().slice(0, 10) : "",
    assignedAdvisor: row.assignedAdvisor?.fullName,
    lastActivity: humanizeActivity(row.lastActivityAt),
    risk,
    educationLevel: row.educationLevel ?? undefined,
    supportNeeded: deserializeSupport(row.supportNeeded),
    _live: true,
  };
}

function markDemo(p: DemoParticipant): PortalParticipant {
  return { ...p, _live: false };
}

// ────────────────────────────────────────────────────────────────────────────
// Reads
// ────────────────────────────────────────────────────────────────────────────

export async function fetchAllParticipants(): Promise<PortalParticipant[]> {
  const { data, live } = await callDC(() => listAllParticipants(), {
    label: "listAllParticipants",
  });
  const rows = (data as { participants?: DCParticipantRow[] } | null)?.participants ?? [];
  if (live && rows.length) return rows.map(mapParticipant);
  return demoParticipants.map(markDemo);
}

export async function fetchParticipantsForAdvisor(
  advisorId: string | null
): Promise<PortalParticipant[]> {
  if (!advisorId) return fetchAllParticipants();
  const { data, live } = await callDC(
    () => listParticipantsByAdvisor({ advisorId }),
    { label: "listParticipantsByAdvisor" }
  );
  const rows = (data as { participants?: DCParticipantRow[] } | null)?.participants ?? [];
  if (live && rows.length) return rows.map(mapParticipant);
  return demoParticipants.map(markDemo);
}

export async function fetchParticipant(id: string): Promise<PortalParticipant | null> {
  const { data, live } = await callDC(() => getParticipant({ id }), {
    label: "getParticipant",
  });
  const row = (data as { participant?: DCParticipantRow } | null)?.participant;
  if (live && row) return mapParticipant(row);
  return demoParticipants.find((p) => p.id === id)
    ? markDemo(demoParticipants.find((p) => p.id === id) as DemoParticipant)
    : null;
}

export async function fetchParticipantDetail(id: string) {
  const { data, live } = await callDC(() => getParticipantDetail({ id }), {
    label: "getParticipantDetail",
  });
  if (live && data) {
    return {
      live: true,
      participant: (data as { participant?: DCParticipantRow }).participant
        ? mapParticipant((data as { participant: DCParticipantRow }).participant)
        : null,
      raw: data,
    };
  }
  const demo = demoParticipants.find((p) => p.id === id);
  return {
    live: false,
    participant: demo ? markDemo(demo) : null,
    raw: null,
  };
}

export async function fetchMyParticipant(): Promise<PortalParticipant | null> {
  const { data, live } = await callDC(() => getMyParticipant(), {
    label: "getMyParticipant",
  });
  const row = (data as { participants?: DCParticipantRow[] } | null)?.participants?.[0];
  if (live && row) return mapParticipant(row);
  return markDemo({
    id: demoSummary ? "p_1042" : "",
    firstName: "Jordan",
    lastName: "Hayes",
    email: "jordan.h@example.com",
    phone: "(201) 555-0142",
    city: "Paterson",
    state: "NJ",
    zip: "07505",
    age: 27,
    pathway: demoSummary.pathway,
    status: "Advising",
    source: "Direct",
    appliedAt: "2026-04-08",
    assignedAdvisor: demoSummary.advisor,
    lastActivity: "2 days ago",
    risk: "ok",
    educationLevel: demoSummary.intake.education,
    supportNeeded: demoSummary.intake.supportNeeded,
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Writes — intake
// ────────────────────────────────────────────────────────────────────────────

export type IntakeSubmit = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContactMethod: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  educationLevel: string;
  currentlyEnrolled: boolean;
  programInterest: string;
  employed: boolean;
  jobTitle?: string;
  supportNeeded: string[];
  pathway: Pathway;
  source: Source;
  consentAccuracy: boolean;
  consentContact: boolean;
  consentDataShare: boolean;
  eligibilityAnswers: Record<string, unknown>;
  intakeAnswers: Record<string, unknown>;
};

export async function submitIntake(
  input: IntakeSubmit
): Promise<{ participantId: string | null; applicationId: string | null; live: boolean }> {
  if (!isDataConnectReady) {
    return { participantId: null, applicationId: null, live: false };
  }
  const participantResp = await callDC(
    () =>
      createParticipant({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        preferredContactMethod: input.preferredContactMethod,
        address: input.address,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
        educationLevel: input.educationLevel,
        currentlyEnrolled: input.currentlyEnrolled,
        programInterest: input.programInterest,
        employed: input.employed,
        jobTitle: input.jobTitle ?? null,
        supportNeeded: serializeSupport(input.supportNeeded) || null,
        pathway: input.pathway,
        status: "New",
        source: input.source,
        consentAccuracy: input.consentAccuracy,
        consentContact: input.consentContact,
        consentDataShare: input.consentDataShare,
      }),
    { label: "createParticipant" }
  );
  const participantId =
    (participantResp.data as { participant_insert?: { id: string } } | null)
      ?.participant_insert?.id ?? null;
  if (!participantId) {
    return { participantId: null, applicationId: null, live: false };
  }
  const applicationResp = await callDC(
    () =>
      createApplication({
        participantId,
        eligibilityData: JSON.stringify(input.eligibilityAnswers),
        intakeData: JSON.stringify(input.intakeAnswers),
        status: "submitted",
        pathwayRecommendation: input.pathway,
      }),
    { label: "createApplication" }
  );
  const applicationId =
    (applicationResp.data as { application_insert?: { id: string } } | null)
      ?.application_insert?.id ?? null;
  return { participantId, applicationId, live: true };
}

// ────────────────────────────────────────────────────────────────────────────
// Writes — staff actions
// ────────────────────────────────────────────────────────────────────────────

export async function mutateStatus(id: string, status: ParticipantStatus) {
  return callDC(() => updateParticipantStatus({ id, status }), {
    label: "updateParticipantStatus",
  });
}

export async function mutateAssignAdvisor(id: string, advisorId: string) {
  return callDC(() => assignAdvisor({ id, advisorId }), {
    label: "assignAdvisor",
  });
}

export async function mutatePathway(id: string, pathway: Pathway) {
  return callDC(() => updateParticipantPathway({ id, pathway }), {
    label: "updateParticipantPathway",
  });
}

export async function mutateRiskFlag(id: string, riskFlag: boolean) {
  return callDC(() => flagParticipantRisk({ id, riskFlag }), {
    label: "flagParticipantRisk",
  });
}

export async function linkMyAccountTo(id: string) {
  return callDC(() => linkCurrentUserToParticipant({ id }), {
    label: "linkCurrentUserToParticipant",
  });
}
