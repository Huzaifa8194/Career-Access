import type { Timestamp } from "firebase/firestore";

export type PortalRole = "participant" | "advisor" | "admin";

export type Pathway =
  | "College + FAFSA"
  | "Short-term training"
  | "Apprenticeship"
  | "GED / HSE";

export type ParticipantStatus =
  | "New"
  | "Screened"
  | "Intake complete"
  | "Advising"
  | "Enrolled"
  | "Inactive";

export type Source = "Direct" | "Referral" | "Partner" | "Event";

export type RiskFlag = "ok" | "stalled" | "inactive";

export type ApplicationStatus =
  | "new"
  | "screened"
  | "intake"
  | "advising"
  | "enrolled"
  | "inactive";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no-show";

export type TaskStatus = "open" | "in-progress" | "done";

export type DocumentStatus = "needed" | "in-review" | "verified" | "rejected";

export type ContactMethod = "Email" | "Phone" | "Text";

export type AnyTimestamp = Timestamp | Date | null | undefined;

export type UserDoc = {
  uid: string;
  role: PortalRole;
  fullName: string;
  email: string;
  phone?: string | null;
  participantId?: string | null;
  createdAt?: AnyTimestamp;
  updatedAt?: AnyTimestamp;
};

export type ParticipantDoc = {
  id?: string;
  userId?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  preferredContactMethod?: ContactMethod;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode: string;
  age?: string | number | null;
  educationLevel?: string | null;
  currentlyEnrolled?: boolean | null;
  programInterest?: string | null;
  employed?: boolean | null;
  jobTitle?: string | null;
  supportNeeded?: string[];
  pathway: Pathway;
  status: ParticipantStatus;
  source: Source;
  assignedAdvisorId?: string | null;
  assignedAdvisorName?: string | null;
  householdIncomeRange?: string | null;
  firstGenerationStatus?: string | null;
  goals?: string | null;
  notes?: string | null;
  referralSource?: string | null;
  riskFlag?: RiskFlag;
  consentAccurate?: boolean;
  consentContact?: boolean;
  consentPartnerSharing?: boolean;
  submittedAt?: AnyTimestamp;
  lastActivityAt?: AnyTimestamp;
  createdAt?: AnyTimestamp;
  updatedAt?: AnyTimestamp;
};

export type ApplicationDoc = {
  id?: string;
  participantId: string;
  eligibilityAnswers: Record<string, unknown>;
  intakeAnswers: Record<string, unknown>;
  pathwayRecommendation: Pathway;
  status: ApplicationStatus;
  submittedAt?: AnyTimestamp;
  updatedAt?: AnyTimestamp;
};

export type ReferralDoc = {
  id?: string;
  referrerName: string;
  organizationName: string;
  email: string;
  phone?: string | null;
  applicantFirstName: string;
  applicantLastName: string;
  applicantEmail: string;
  applicantPhone: string;
  zipCode: string;
  programInterest: string;
  urgency: string;
  reasonForReferral: string;
  permissionConfirmed: boolean;
  linkedParticipantId?: string | null;
  status: "new" | "contacted" | "intake" | "enrolled" | "closed";
  createdAt?: AnyTimestamp;
  updatedAt?: AnyTimestamp;
};

export type AdvisorDoc = {
  id?: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  activeCaseCount?: number;
  pathwaysSupported?: Pathway[];
  createdAt?: AnyTimestamp;
};

export type AppointmentDoc = {
  id?: string;
  participantId: string;
  participantName?: string | null;
  advisorId?: string | null;
  advisorName?: string | null;
  appointmentType: string;
  scheduledAt: AnyTimestamp;
  scheduledDate: string;
  scheduledTime: string;
  timezone: string;
  mode?: "Video" | "Phone" | "In-person";
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  status: AppointmentStatus;
  createdAt?: AnyTimestamp;
};

export type ContactInquiryDoc = {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  message: string;
  sourcePage: string;
  status: "new" | "in-progress" | "resolved";
  createdAt?: AnyTimestamp;
};

export type TaskDoc = {
  id?: string;
  participantId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority?: "High" | "Med" | "Low";
  dueDate?: string | null;
  assignedTo?: string | null;
  createdBy?: string | null;
  createdAt?: AnyTimestamp;
  updatedAt?: AnyTimestamp;
};

export type NoteDoc = {
  id?: string;
  participantId: string;
  advisorId?: string | null;
  advisorName?: string | null;
  type?: string;
  text: string;
  createdAt?: AnyTimestamp;
};

export type DocumentDoc = {
  id?: string;
  participantId: string;
  fileName: string;
  fileUrl: string;
  storagePath: string;
  mimeType?: string | null;
  size?: number | null;
  uploadedBy: string;
  status: DocumentStatus;
  createdAt?: AnyTimestamp;
};

export type MessageDoc = {
  id?: string;
  threadId: string;
  participantId: string;
  senderId: string;
  senderName: string;
  senderRole: PortalRole;
  body: string;
  read: boolean;
  createdAt?: AnyTimestamp;
};

export type DashboardMetricDoc = {
  id?: string;
  totalApplicants: number;
  newThisWeek: number;
  callsScheduled: number;
  enrolled: number;
  updatedAt?: AnyTimestamp;
};

export const COLLECTIONS = {
  users: "users",
  participants: "participants",
  applications: "applications",
  referrals: "referrals",
  advisors: "advisors",
  appointments: "appointments",
  contactInquiries: "contact_inquiries",
  tasks: "tasks",
  notes: "notes",
  documents: "documents",
  messages: "messages",
  metrics: "dashboard_metrics",
} as const;

export function toDateSafe(value: AnyTimestamp | string | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof (value as { toDate?: () => Date }).toDate === "function") {
    try {
      return (value as { toDate: () => Date }).toDate();
    } catch {
      return null;
    }
  }
  return null;
}

export function toDateISO(value: AnyTimestamp | string | undefined): string | null {
  const d = toDateSafe(value);
  return d ? d.toISOString() : null;
}
