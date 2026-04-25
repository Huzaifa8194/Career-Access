import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type QueryConstraint,
  type Unsubscribe,
} from "firebase/firestore";
import {
  participantsCol,
  participantRef,
  applicationsCol,
} from "@/lib/firebase/firestore";
import {
  type ApplicationDoc,
  type ApplicationStatus,
  type ParticipantDoc,
  type ParticipantStatus,
  type Pathway,
  type Source,
  toDateISO,
} from "@/lib/firebase/types";
import { recommendPathway, type PathwayInputs } from "@/lib/pathway";
import { getFirebaseDb } from "@/lib/firebase/config";
import { COLLECTIONS } from "@/lib/firebase/types";

export type ParticipantListItem = {
  id: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  pathway: Pathway;
  status: ParticipantStatus;
  source: Source;
  assignedAdvisorId: string | null;
  assignedAdvisorName: string | null;
  risk: "ok" | "stalled" | "inactive";
  goals: string | null;
  educationLevel: string | null;
  supportNeeded: string[];
  referralSource: string | null;
  submittedAtISO: string | null;
  lastActivityISO: string | null;
  appliedAt: string;
  lastActivity: string;
};

function mapParticipant(
  id: string,
  data: ParticipantDoc
): ParticipantListItem {
  const submittedAt = toDateISO(data.submittedAt);
  const lastActivity = toDateISO(data.lastActivityAt);
  return {
    id,
    userId: data.userId ?? null,
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    city: data.city ?? "",
    state: data.state ?? "",
    zip: data.zipCode ?? "",
    pathway: (data.pathway ?? "College + FAFSA") as Pathway,
    status: (data.status ?? "New") as ParticipantStatus,
    source: (data.source ?? "Direct") as Source,
    assignedAdvisorId: data.assignedAdvisorId ?? null,
    assignedAdvisorName: data.assignedAdvisorName ?? null,
    risk: (data.riskFlag ?? "ok") as "ok" | "stalled" | "inactive",
    goals: data.goals ?? null,
    educationLevel: data.educationLevel ?? null,
    supportNeeded: data.supportNeeded ?? [],
    referralSource: data.referralSource ?? null,
    submittedAtISO: submittedAt,
    lastActivityISO: lastActivity,
    appliedAt: submittedAt ? submittedAt.slice(0, 10) : "",
    lastActivity: formatRelative(lastActivity),
  };
}

function formatRelative(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 14) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
}

export type CreateParticipantInput = {
  userId?: string | null;
  eligibility: Record<string, unknown>;
  intake: Record<string, unknown>;
  source?: Source;
  referralId?: string | null;
};

export async function createParticipantFromApplication(
  input: CreateParticipantInput
): Promise<{ participantId: string; applicationId: string; pathway: Pathway }> {
  const { eligibility, intake } = input;
  const pathwayInputs: PathwayInputs = {
    eligibilityInterest: eligibility.interest as string | undefined,
    eligibilityEducation: eligibility.highestEducation as string | undefined,
    intakeEducation: intake.highestEducation as string | undefined,
    intakeInterest: intake.interest as string | undefined,
    supportNeeded: (intake.supportNeeded as string[] | undefined) ?? [],
  };
  const pathway = recommendPathway(pathwayInputs);

  const participantData: ParticipantDoc = {
    userId: input.userId ?? null,
    firstName: (intake.firstName as string) ?? "",
    lastName: (intake.lastName as string) ?? "",
    email: (intake.email as string) ?? "",
    phone: (intake.mobilePhone as string) ?? null,
    preferredContactMethod:
      (intake.preferredContactMethod as ParticipantDoc["preferredContactMethod"]) ??
      "Email",
    address: (intake.streetAddress as string) ?? null,
    city: (intake.city as string) ?? null,
    state: (intake.state as string) ?? null,
    zipCode: ((intake.zipCode as string) || (eligibility.zipCode as string)) ?? "",
    age: (eligibility.age as string) ?? null,
    educationLevel:
      (intake.highestEducation as string) ??
      (eligibility.highestEducation as string) ??
      null,
    currentlyEnrolled: intake.currentlyEnrolled === "Yes",
    programInterest: (intake.interest as string) ?? null,
    employed: intake.currentlyEmployed === "Yes",
    jobTitle: (intake.jobTitle as string) ?? null,
    supportNeeded: (intake.supportNeeded as string[] | undefined) ?? [],
    pathway,
    status: "New",
    source: input.source ?? "Direct",
    assignedAdvisorId: null,
    assignedAdvisorName: null,
    householdIncomeRange: (eligibility.householdIncomeRange as string) ?? null,
    firstGenerationStatus: (eligibility.firstGenerationStatus as string) ?? null,
    goals: (intake.notes as string) ?? null,
    referralSource: input.referralId ?? null,
    riskFlag: "ok",
    consentAccurate: !!intake.consentAccurate,
    consentContact: !!intake.consentContact,
    consentPartnerSharing: !!intake.consentPartnerSharing,
    submittedAt: serverTimestamp() as unknown as ParticipantDoc["submittedAt"],
    lastActivityAt: serverTimestamp() as unknown as ParticipantDoc["lastActivityAt"],
    createdAt: serverTimestamp() as unknown as ParticipantDoc["createdAt"],
    updatedAt: serverTimestamp() as unknown as ParticipantDoc["updatedAt"],
  };

  const participantRefDoc = await addDoc(participantsCol(), participantData);
  const applicationData: ApplicationDoc = {
    participantId: participantRefDoc.id,
    eligibilityAnswers: eligibility,
    intakeAnswers: intake,
    pathwayRecommendation: pathway,
    status: "new",
    submittedAt: serverTimestamp() as unknown as ApplicationDoc["submittedAt"],
    updatedAt: serverTimestamp() as unknown as ApplicationDoc["updatedAt"],
  };
  const appRefDoc = await addDoc(applicationsCol(), applicationData);

  if (input.userId) {
    try {
      await updateDoc(doc(getFirebaseDb(), COLLECTIONS.users, input.userId), {
        participantId: participantRefDoc.id,
        updatedAt: serverTimestamp(),
      });
    } catch {
    }
  }

  return {
    participantId: participantRefDoc.id,
    applicationId: appRefDoc.id,
    pathway,
  };
}

export async function fetchAllParticipants(
  max = 500
): Promise<ParticipantListItem[]> {
  const snap = await getDocs(
    query(participantsCol(), orderBy("submittedAt", "desc"), limit(max))
  );
  return snap.docs.map((d) => mapParticipant(d.id, d.data() as ParticipantDoc));
}

export function subscribeParticipants(
  cb: (rows: ParticipantListItem[]) => void,
  constraints: QueryConstraint[] = [orderBy("submittedAt", "desc"), limit(500)]
): Unsubscribe {
  return onSnapshot(
    query(participantsCol(), ...constraints),
    (snap) => {
      cb(
        snap.docs.map((d) => mapParticipant(d.id, d.data() as ParticipantDoc))
      );
    },
    () => cb([])
  );
}

export async function fetchParticipantById(
  id: string
): Promise<ParticipantListItem | null> {
  const snap = await getDoc(participantRef(id));
  if (!snap.exists()) return null;
  return mapParticipant(snap.id, snap.data() as ParticipantDoc);
}

export async function fetchParticipantByUserId(
  userId: string
): Promise<ParticipantListItem | null> {
  const snap = await getDocs(
    query(participantsCol(), where("userId", "==", userId), limit(1))
  );
  const d = snap.docs[0];
  if (!d) return null;
  return mapParticipant(d.id, d.data() as ParticipantDoc);
}

export async function fetchParticipantByEmail(
  email: string
): Promise<ParticipantListItem | null> {
  if (!email) return null;
  const snap = await getDocs(
    query(
      participantsCol(),
      where("email", "==", email.toLowerCase().trim()),
      limit(1)
    )
  );
  const d = snap.docs[0];
  if (!d) {
    // fallback, case-sensitive
    const snap2 = await getDocs(
      query(participantsCol(), where("email", "==", email), limit(1))
    );
    const d2 = snap2.docs[0];
    if (!d2) return null;
    return mapParticipant(d2.id, d2.data() as ParticipantDoc);
  }
  return mapParticipant(d.id, d.data() as ParticipantDoc);
}

export async function updateParticipant(
  id: string,
  patch: Partial<ParticipantDoc>
): Promise<void> {
  await updateDoc(participantRef(id), {
    ...patch,
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  });
}

export async function setParticipantStatus(
  id: string,
  status: ParticipantStatus
): Promise<void> {
  await updateParticipant(id, { status });
}

export async function setParticipantPathway(
  id: string,
  pathway: Pathway
): Promise<void> {
  await updateParticipant(id, { pathway });
}

export async function assignAdvisor(
  participantId: string,
  advisorId: string | null,
  advisorName: string | null
): Promise<void> {
  await updateParticipant(participantId, {
    assignedAdvisorId: advisorId,
    assignedAdvisorName: advisorName,
  });
}

export async function setRiskFlag(
  participantId: string,
  flag: "ok" | "stalled" | "inactive"
): Promise<void> {
  await updateParticipant(participantId, { riskFlag: flag });
}

export async function linkUserToParticipant(
  userId: string,
  participantId: string
): Promise<void> {
  await setDoc(
    participantRef(participantId),
    { userId, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), COLLECTIONS.applications, applicationId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteParticipant(id: string): Promise<void> {
  await deleteDoc(participantRef(id));
}
