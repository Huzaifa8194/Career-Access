import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  type Timestamp,
} from "firebase/firestore";
import {
  adminMetrics as demoMetrics,
  advisors as demoAdvisors,
  participants as demoParticipants,
  pipelineStages,
  type ParticipantStatus,
  type Pathway,
  type Source,
} from "@/lib/data";
import { getFirebaseDb } from "@/lib/firebase/config";

export type AdvisorOption = { id: string; fullName: string; email: string };

export type AdminSnapshot = {
  live: boolean;
  totalApplicants: number;
  newThisWeek: number;
  callsScheduled: number;
  enrolled: number;
  stageCounts: Record<ParticipantStatus, number>;
  pathwayDistribution: { label: Pathway; count: number; pct: number }[];
  sourceDistribution: { label: Source; count: number; pct: number }[];
  recent: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    pathway: string;
    status: string;
    source: string;
    submittedAt: string;
    assignedAdvisor?: string | null;
  }[];
};

function daysAgo(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() - n);
  return x;
}

export async function fetchAdvisors(): Promise<AdvisorOption[]> {
  const snap = await getDocs(
    query(collection(getFirebaseDb(), "users"), where("role", "==", "advisor"))
  );
  const rows = snap.docs.map((d) => {
    const data = d.data() as { fullName?: string; email?: string };
    return {
      id: d.id,
      fullName: data.fullName ?? "Advisor",
      email: data.email ?? "",
    };
  });
  if (rows.length) return rows;
  return demoAdvisors.map((name, i) => ({
    id: `demo_${i}`,
    fullName: name,
    email: `${name.split(" ").join(".").toLowerCase()}@example.com`,
  }));
}

export async function fetchAdminSnapshot(): Promise<AdminSnapshot> {
  const participantSnap = await getDocs(
    query(collection(getFirebaseDb(), "participants"), orderBy("submittedAt", "desc"))
  );
  const participantsLive = participantSnap.docs.map((d) => {
    const row = d.data() as {
      firstName?: string;
      lastName?: string;
      email?: string;
      pathway?: string;
      status?: string;
      source?: string;
      submittedAt?: Timestamp | Date | string;
      assignedAdvisorName?: string | null;
    };
    const submittedRaw = row.submittedAt;
    const submittedAt =
      submittedRaw instanceof Date
        ? submittedRaw
        : typeof submittedRaw === "string"
          ? new Date(submittedRaw)
          : submittedRaw && "toDate" in submittedRaw
            ? submittedRaw.toDate()
            : null;
    return {
      id: d.id,
      firstName: row.firstName ?? "",
      lastName: row.lastName ?? "",
      email: row.email ?? "",
      pathway: row.pathway ?? "College + FAFSA",
      status: row.status ?? "New",
      source: row.source ?? "Direct",
      submittedAt,
      assignedAdvisor: row.assignedAdvisorName ?? null,
    };
  });
  const appointmentSnap = await getDocs(collection(getFirebaseDb(), "appointments"));
  const total = participantsLive.length;
  const enrolled = participantsLive.filter((p) => p.status === "Enrolled").length;
  const weekAgo = daysAgo(new Date(), 7);
  const newThisWeek = participantsLive.filter((p) => p.submittedAt && p.submittedAt >= weekAgo).length;
  const calls = appointmentSnap.docs.length;

  const stageCounts: Record<ParticipantStatus, number> = {
    New: participantsLive.filter((p) => p.status === "New").length,
    Screened: participantsLive.filter((p) => p.status === "Screened").length,
    "Intake complete": participantsLive.filter((p) => p.status === "Intake complete").length,
    Advising: participantsLive.filter((p) => p.status === "Advising").length,
    Enrolled: participantsLive.filter((p) => p.status === "Enrolled").length,
    Inactive: participantsLive.filter((p) => p.status === "Inactive").length,
  };

  const pathCounts: { label: Pathway; count: number }[] = [
    { label: "College + FAFSA", count: participantsLive.filter((p) => p.pathway === "College + FAFSA").length },
    { label: "Short-term training", count: participantsLive.filter((p) => p.pathway === "Short-term training").length },
    { label: "Apprenticeship", count: participantsLive.filter((p) => p.pathway === "Apprenticeship").length },
    { label: "GED / HSE", count: participantsLive.filter((p) => p.pathway === "GED / HSE").length },
  ];
  const pathTotal = pathCounts.reduce((n, c) => n + c.count, 0) || 1;
  const pathwayDistribution = pathCounts.map((c) => ({
    ...c,
    pct: Math.round((c.count / pathTotal) * 100),
  }));

  const sourceCounts: { label: Source; count: number }[] = [
    { label: "Direct", count: participantsLive.filter((p) => p.source === "Direct").length },
    { label: "Referral", count: participantsLive.filter((p) => p.source === "Referral").length },
    { label: "Partner", count: participantsLive.filter((p) => p.source === "Partner").length },
    { label: "Event", count: participantsLive.filter((p) => p.source === "Event").length },
  ];
  const sourceTotal = sourceCounts.reduce((n, c) => n + c.count, 0) || 1;
  const sourceDistribution = sourceCounts.map((c) => ({
    ...c,
    pct: Math.round((c.count / sourceTotal) * 100),
  }));

  const recent = participantsLive.slice(0, 8).map((r) => ({
    id: r.id,
    firstName: r.firstName,
    lastName: r.lastName,
    email: r.email,
    pathway: r.pathway,
    status: r.status,
    source: r.source,
    submittedAt: r.submittedAt ? r.submittedAt.toISOString().slice(0, 10) : "",
    assignedAdvisor: r.assignedAdvisor,
  }));

  if (total > 0) {
    return {
      live: true,
      totalApplicants: total,
      newThisWeek,
      callsScheduled: calls,
      enrolled,
      stageCounts,
      pathwayDistribution,
      sourceDistribution,
      recent,
    };
  }

  // Demo fallback — derived from lib/data mock set.
  const demoStageCounts = pipelineStages.reduce<Record<string, number>>(
    (acc, s) => {
      acc[s.key] = demoParticipants.filter((p) => p.status === s.key).length;
      return acc;
    },
    {}
  );
  const demoStages: Record<ParticipantStatus, number> = {
    New: demoStageCounts.New ?? 0,
    Screened: demoStageCounts.Screened ?? 0,
    "Intake complete": demoStageCounts["Intake complete"] ?? 0,
    Advising: demoStageCounts.Advising ?? 0,
    Enrolled: demoStageCounts.Enrolled ?? 0,
    Inactive: demoParticipants.filter((p) => p.status === "Inactive").length,
  };
  const weekAgo = daysAgo(new Date(), 7);
  const demoNewThisWeek = demoParticipants.filter(
    (p) => new Date(p.appliedAt) >= weekAgo
  ).length;

  return {
    live: false,
    totalApplicants: demoMetrics.totalApplicants,
    newThisWeek: demoNewThisWeek || demoMetrics.newThisWeek,
    callsScheduled: demoMetrics.callsScheduled,
    enrolled: demoMetrics.enrolled,
    stageCounts: demoStages,
    pathwayDistribution: demoMetrics.pathwayDistribution.map((p) => ({
      label: p.label as Pathway,
      count: Math.round((p.value / 100) * demoMetrics.totalApplicants),
      pct: p.value,
    })),
    sourceDistribution: demoMetrics.sourceDistribution.map((p) => ({
      label: p.label as Source,
      count: Math.round((p.value / 100) * demoMetrics.totalApplicants),
      pct: p.value,
    })),
    recent: demoParticipants.slice(0, 8).map((p) => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      pathway: p.pathway,
      status: p.status,
      source: p.source,
      submittedAt: p.appliedAt,
      assignedAdvisor: p.assignedAdvisor ?? null,
    })),
  };
}
