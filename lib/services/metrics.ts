import { getDocs, query, where, Timestamp } from "firebase/firestore";
import {
  appointmentsCol,
  participantsCol,
} from "@/lib/firebase/firestore";
import type {
  ParticipantDoc,
  ParticipantStatus,
  Pathway,
  Source,
} from "@/lib/firebase/types";

export type AdminMetrics = {
  totalApplicants: number;
  newThisWeek: number;
  callsScheduled: number;
  enrolled: number;
  stageCounts: Record<ParticipantStatus, number>;
  pathwayDistribution: { label: Pathway; value: number; count: number }[];
  sourceDistribution: { label: Source; value: number; count: number }[];
};

const ALL_STAGES: ParticipantStatus[] = [
  "New",
  "Screened",
  "Intake complete",
  "Advising",
  "Enrolled",
  "Inactive",
];

const ALL_PATHWAYS: Pathway[] = [
  "College + FAFSA",
  "Short-term training",
  "Apprenticeship",
  "GED / HSE",
];

const ALL_SOURCES: Source[] = ["Direct", "Referral", "Partner", "Event"];

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  const participantsSnap = await getDocs(participantsCol());
  const stageCounts = Object.fromEntries(
    ALL_STAGES.map((s) => [s, 0])
  ) as Record<ParticipantStatus, number>;
  const pathwayCounts = Object.fromEntries(
    ALL_PATHWAYS.map((p) => [p, 0])
  ) as Record<Pathway, number>;
  const sourceCounts = Object.fromEntries(
    ALL_SOURCES.map((s) => [s, 0])
  ) as Record<Source, number>;

  let enrolled = 0;
  let newThisWeek = 0;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  participantsSnap.forEach((d) => {
    const data = d.data() as ParticipantDoc;
    const status = (data.status ?? "New") as ParticipantStatus;
    const pathway = (data.pathway ?? "College + FAFSA") as Pathway;
    const src = (data.source ?? "Direct") as Source;
    stageCounts[status] = (stageCounts[status] ?? 0) + 1;
    pathwayCounts[pathway] = (pathwayCounts[pathway] ?? 0) + 1;
    sourceCounts[src] = (sourceCounts[src] ?? 0) + 1;
    if (status === "Enrolled") enrolled += 1;
    const submittedAt =
      data.submittedAt instanceof Timestamp
        ? data.submittedAt.toMillis()
        : null;
    if (submittedAt && submittedAt >= weekAgo) newThisWeek += 1;
  });

  const totalApplicants = participantsSnap.size;

  const apptSnap = await getDocs(
    query(appointmentsCol(), where("status", "in", ["scheduled", "confirmed"]))
  );
  const callsScheduled = apptSnap.size;

  const pTotal = Object.values(pathwayCounts).reduce((a, b) => a + b, 0) || 1;
  const sTotal = Object.values(sourceCounts).reduce((a, b) => a + b, 0) || 1;

  return {
    totalApplicants,
    newThisWeek,
    callsScheduled,
    enrolled,
    stageCounts,
    pathwayDistribution: ALL_PATHWAYS.map((p) => ({
      label: p,
      count: pathwayCounts[p],
      value: Math.round((pathwayCounts[p] / pTotal) * 100),
    })),
    sourceDistribution: ALL_SOURCES.map((s) => ({
      label: s,
      count: sourceCounts[s],
      value: Math.round((sourceCounts[s] / sTotal) * 100),
    })),
  };
}
