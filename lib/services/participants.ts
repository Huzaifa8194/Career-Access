import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import {
  participants as demoParticipants,
  participantSummary as demoSummary,
  type Participant as DemoParticipant,
  type ParticipantStatus,
  type Pathway,
  type Source,
} from "@/lib/data";
import { getFirebaseAuth } from "@/lib/firebase/config";
import { getFirebaseDb } from "@/lib/firebase/config";

export type PortalParticipant = DemoParticipant & {
  _live: boolean;
};

type DCParticipantRow = {
  id: string;
  userId?: string | null;
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
  supportNeeded?: string[] | null;
  currentlyEnrolled?: boolean | null;
  programInterest?: string | null;
  employed?: boolean | null;
  jobTitle?: string | null;
  preferredContactMethod?: string | null;
  consentAccuracy?: boolean | null;
  consentContact?: boolean | null;
  consentDataShare?: boolean | null;
  assignedAdvisorId?: string | null;
  assignedAdvisorName?: string | null;
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
    assignedAdvisor: row.assignedAdvisorName ?? undefined,
    lastActivity: humanizeActivity(row.lastActivityAt),
    risk,
    educationLevel: row.educationLevel ?? undefined,
    supportNeeded: row.supportNeeded ?? [],
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
  const snap = await getDocs(
    query(collection(getFirebaseDb(), "participants"), orderBy("submittedAt", "desc"))
  );
  const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DCParticipantRow, "id">) }));
  if (rows.length) return rows.map(mapParticipant);
  return demoParticipants.map(markDemo);
}

export async function fetchParticipantsForAdvisor(
  advisorId: string | null
): Promise<PortalParticipant[]> {
  if (!advisorId) return fetchAllParticipants();
  const snap = await getDocs(
    query(
      collection(getFirebaseDb(), "participants"),
      where("assignedAdvisorId", "==", advisorId),
      orderBy("submittedAt", "desc")
    )
  );
  const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DCParticipantRow, "id">) }));
  if (rows.length) return rows.map(mapParticipant);
  return demoParticipants.map(markDemo);
}

export async function fetchParticipant(id: string): Promise<PortalParticipant | null> {
  const snap = await getDoc(doc(getFirebaseDb(), "participants", id));
  if (snap.exists()) return mapParticipant({ id: snap.id, ...(snap.data() as Omit<DCParticipantRow, "id">) });
  return demoParticipants.find((p) => p.id === id)
    ? markDemo(demoParticipants.find((p) => p.id === id) as DemoParticipant)
    : null;
}

export async function fetchParticipantDetail(id: string) {
  const participant = await fetchParticipant(id);
  if (participant?._live) {
    const apps = await getDocs(
      query(
        collection(getFirebaseDb(), "applications"),
        where("participantId", "==", id),
        orderBy("createdAt", "desc")
      )
    );
    return {
      live: true,
      participant,
      raw: { applications: apps.docs.map((d) => ({ id: d.id, ...d.data() })) },
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
  const uid = getFirebaseAuth().currentUser?.uid;
  if (uid) {
    const snap = await getDocs(
      query(
        collection(getFirebaseDb(), "participants"),
        where("userId", "==", uid),
        limit(1)
      )
    );
    const row = snap.docs[0];
    if (row) {
      return mapParticipant({ id: row.id, ...(row.data() as Omit<DCParticipantRow, "id">) });
    }
  }
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
  const uid = getFirebaseAuth().currentUser?.uid ?? null;
  const participantRef = await addDoc(collection(getFirebaseDb(), "participants"), {
    userId: uid,
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
    supportNeeded: input.supportNeeded,
    pathway: input.pathway,
    status: "New",
    source: input.source,
    consentAccuracy: input.consentAccuracy,
    consentContact: input.consentContact,
    consentDataShare: input.consentDataShare,
    submittedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
    riskFlag: false,
  });
  const applicationRef = await addDoc(collection(getFirebaseDb(), "applications"), {
    participantId: participantRef.id,
    eligibilityAnswers: input.eligibilityAnswers,
    intakeAnswers: input.intakeAnswers,
    status: "submitted",
    pathwayRecommendation: input.pathway,
    submittedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
  return { participantId: participantRef.id, applicationId: applicationRef.id, live: true };
}

// ────────────────────────────────────────────────────────────────────────────
// Writes — staff actions
// ────────────────────────────────────────────────────────────────────────────

export async function mutateStatus(id: string, status: ParticipantStatus) {
  await updateDoc(doc(getFirebaseDb(), "participants", id), {
    status,
    lastActivityAt: serverTimestamp(),
  });
  return { error: null, live: true };
}

export async function mutateAssignAdvisor(id: string, advisorId: string) {
  let advisorName: string | null = null;
  const advisorSnap = await getDoc(doc(getFirebaseDb(), "users", advisorId));
  if (advisorSnap.exists()) {
    advisorName = (advisorSnap.data() as { fullName?: string }).fullName ?? null;
  }
  await updateDoc(doc(getFirebaseDb(), "participants", id), {
    assignedAdvisorId: advisorId,
    assignedAdvisorName: advisorName,
    lastActivityAt: serverTimestamp(),
  });
  return { error: null, live: true };
}

export async function mutatePathway(id: string, pathway: Pathway) {
  await updateDoc(doc(getFirebaseDb(), "participants", id), {
    pathway,
    lastActivityAt: serverTimestamp(),
  });
  return { error: null, live: true };
}

export async function mutateRiskFlag(id: string, riskFlag: boolean) {
  await updateDoc(doc(getFirebaseDb(), "participants", id), {
    riskFlag,
    lastActivityAt: serverTimestamp(),
  });
  return { error: null, live: true };
}

export async function linkMyAccountTo(id: string) {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) return { error: new Error("Not authenticated"), live: false };
  await updateDoc(doc(getFirebaseDb(), "participants", id), {
    userId: uid,
    lastActivityAt: serverTimestamp(),
  });
  return { error: null, live: true };
}
