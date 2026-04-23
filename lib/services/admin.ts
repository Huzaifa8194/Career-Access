import { adminOverview, listAdvisors } from "@dataconnect/generated";
import {
  adminMetrics as demoMetrics,
  advisors as demoAdvisors,
  participants as demoParticipants,
  pipelineStages,
  type ParticipantStatus,
  type Pathway,
  type Source,
} from "@/lib/data";
import { callDC } from "@/lib/firebase/dataconnect";

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
  const { data, live } = await callDC(() => listAdvisors(), {
    label: "listAdvisors",
  });
  const rows = (data as { users?: AdvisorOption[] } | null)?.users ?? [];
  if (live && rows.length) return rows;
  return demoAdvisors.map((name, i) => ({
    id: `demo_${i}`,
    fullName: name,
    email: `${name.split(" ").join(".").toLowerCase()}@example.com`,
  }));
}

export async function fetchAdminSnapshot(): Promise<AdminSnapshot> {
  const { data, live } = await callDC(() => adminOverview(), {
    label: "adminOverview",
  });
  type DCOverview = {
    totalParticipants?: { _count?: number };
    enrolled?: { id: string }[];
    stageNew?: { id: string }[];
    stageScreened?: { id: string }[];
    stageIntake?: { id: string }[];
    stageAdvising?: { id: string }[];
    stageEnrolled?: { id: string }[];
    stageInactive?: { id: string }[];
    pathCollege?: { id: string }[];
    pathTraining?: { id: string }[];
    pathApprenticeship?: { id: string }[];
    pathGED?: { id: string }[];
    sourceDirect?: { id: string }[];
    sourceReferral?: { id: string }[];
    sourcePartner?: { id: string }[];
    sourceEvent?: { id: string }[];
    callsScheduled?: { id: string }[];
    recent?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      pathway: string;
      status: string;
      source: string;
      submittedAt: string;
      assignedAdvisor?: { fullName: string } | null;
    }[];
  };
  const d = (data ?? {}) as DCOverview;

  const stageCounts: Record<ParticipantStatus, number> = {
    New: d.stageNew?.length ?? 0,
    Screened: d.stageScreened?.length ?? 0,
    "Intake complete": d.stageIntake?.length ?? 0,
    Advising: d.stageAdvising?.length ?? 0,
    Enrolled: d.stageEnrolled?.length ?? 0,
    Inactive: d.stageInactive?.length ?? 0,
  };

  const total = d.totalParticipants?._count ?? 0;
  const enrolled = d.enrolled?.length ?? 0;
  const newThisWeek = 0; // Data Connect aggregate on submittedAt would be ideal; falls back to demo.
  const calls = d.callsScheduled?.length ?? 0;

  const pathCounts: { label: Pathway; count: number }[] = [
    { label: "College + FAFSA", count: d.pathCollege?.length ?? 0 },
    { label: "Short-term training", count: d.pathTraining?.length ?? 0 },
    { label: "Apprenticeship", count: d.pathApprenticeship?.length ?? 0 },
    { label: "GED / HSE", count: d.pathGED?.length ?? 0 },
  ];
  const pathTotal = pathCounts.reduce((n, c) => n + c.count, 0) || 1;
  const pathwayDistribution = pathCounts.map((c) => ({
    ...c,
    pct: Math.round((c.count / pathTotal) * 100),
  }));

  const sourceCounts: { label: Source; count: number }[] = [
    { label: "Direct", count: d.sourceDirect?.length ?? 0 },
    { label: "Referral", count: d.sourceReferral?.length ?? 0 },
    { label: "Partner", count: d.sourcePartner?.length ?? 0 },
    { label: "Event", count: d.sourceEvent?.length ?? 0 },
  ];
  const sourceTotal = sourceCounts.reduce((n, c) => n + c.count, 0) || 1;
  const sourceDistribution = sourceCounts.map((c) => ({
    ...c,
    pct: Math.round((c.count / sourceTotal) * 100),
  }));

  const recent = (d.recent ?? []).map((r) => ({
    id: r.id,
    firstName: r.firstName,
    lastName: r.lastName,
    email: r.email,
    pathway: r.pathway,
    status: r.status,
    source: r.source,
    submittedAt: r.submittedAt
      ? new Date(r.submittedAt).toISOString().slice(0, 10)
      : "",
    assignedAdvisor: r.assignedAdvisor?.fullName ?? null,
  }));

  if (live && total > 0) {
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
