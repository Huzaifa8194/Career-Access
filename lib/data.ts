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

export type Participant = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  zip: string;
  age: number;
  pathway: Pathway;
  status: ParticipantStatus;
  source: Source;
  appliedAt: string;
  assignedAdvisor?: string;
  lastActivity: string;
  risk?: "stalled" | "inactive" | "ok";
  goals?: string;
  educationLevel?: string;
  supportNeeded?: string[];
  referralSource?: string;
};

export const advisors = [
  "Maya Robinson",
  "Daniel Ortiz",
  "Aisha Bennett",
  "Marcus Lee",
];

export const participants: Participant[] = [
  {
    id: "p_1042",
    firstName: "Jordan",
    lastName: "Hayes",
    email: "jordan.h@example.com",
    phone: "(617) 555-0142",
    city: "Boston",
    state: "MA",
    zip: "02118",
    age: 27,
    pathway: "College + FAFSA",
    status: "Advising",
    source: "Direct",
    appliedAt: "2026-04-08",
    assignedAdvisor: "Maya Robinson",
    lastActivity: "2 days ago",
    risk: "ok",
    goals: "Finish bachelor's in social work and qualify for FAFSA aid.",
    educationLevel: "Some college, no degree",
    supportNeeded: ["FAFSA", "College apps", "Career advising"],
    referralSource: "Boston Public Library",
  },
  {
    id: "p_1043",
    firstName: "Aaliyah",
    lastName: "Carter",
    email: "aaliyah.c@example.com",
    phone: "(857) 555-0119",
    city: "Cambridge",
    state: "MA",
    zip: "02139",
    age: 31,
    pathway: "Short-term training",
    status: "Intake complete",
    source: "Referral",
    appliedAt: "2026-04-11",
    assignedAdvisor: "Daniel Ortiz",
    lastActivity: "5 hours ago",
    risk: "ok",
    goals: "Pivot from retail into IT support — needs CompTIA A+ training.",
    educationLevel: "High school diploma",
    supportNeeded: ["Job training", "Career advising", "Childcare"],
    referralSource: "Cambridge Workforce Partner",
  },
  {
    id: "p_1044",
    firstName: "Marcus",
    lastName: "Reyes",
    email: "marcus.r@example.com",
    phone: "(781) 555-0188",
    city: "Lynn",
    state: "MA",
    zip: "01902",
    age: 24,
    pathway: "Apprenticeship",
    status: "Screened",
    source: "Partner",
    appliedAt: "2026-04-12",
    assignedAdvisor: "Aisha Bennett",
    lastActivity: "Yesterday",
    risk: "ok",
    goals: "Electrician apprenticeship — already has letters of recommendation.",
    educationLevel: "GED",
    supportNeeded: ["Apprenticeship help", "Resume / interview"],
    referralSource: "IBEW Local 103",
  },
  {
    id: "p_1045",
    firstName: "Sasha",
    lastName: "Nguyen",
    email: "sasha.n@example.com",
    phone: "(617) 555-0173",
    city: "Dorchester",
    state: "MA",
    zip: "02124",
    age: 38,
    pathway: "GED / HSE",
    status: "New",
    source: "Direct",
    appliedAt: "2026-04-15",
    lastActivity: "Today",
    risk: "ok",
    goals: "Earn HSE so she can apply to nursing certificate.",
    educationLevel: "Some high school",
    supportNeeded: ["Transportation", "Internet / device"],
  },
  {
    id: "p_1046",
    firstName: "Devon",
    lastName: "Powell",
    email: "devon.p@example.com",
    phone: "(508) 555-0166",
    city: "Worcester",
    state: "MA",
    zip: "01605",
    age: 42,
    pathway: "Short-term training",
    status: "Inactive",
    source: "Event",
    appliedAt: "2026-03-22",
    assignedAdvisor: "Marcus Lee",
    lastActivity: "21 days ago",
    risk: "inactive",
    goals: "CDL Class A training; lapsed after intake.",
    educationLevel: "High school diploma",
    supportNeeded: ["Job training", "Transportation"],
    referralSource: "Job & Career Fair",
  },
  {
    id: "p_1047",
    firstName: "Renée",
    lastName: "Brooks",
    email: "renee.b@example.com",
    phone: "(617) 555-0125",
    city: "Roxbury",
    state: "MA",
    zip: "02119",
    age: 29,
    pathway: "College + FAFSA",
    status: "Enrolled",
    source: "Referral",
    appliedAt: "2026-03-04",
    assignedAdvisor: "Maya Robinson",
    lastActivity: "1 week ago",
    risk: "ok",
    goals: "Started Spring B at Bunker Hill — accounting associate.",
    educationLevel: "High school diploma",
    supportNeeded: ["FAFSA", "College apps"],
    referralSource: "Madison Park Tech",
  },
  {
    id: "p_1048",
    firstName: "Tomás",
    lastName: "Alvarez",
    email: "tomas.a@example.com",
    phone: "(617) 555-0102",
    city: "East Boston",
    state: "MA",
    zip: "02128",
    age: 33,
    pathway: "Apprenticeship",
    status: "Intake complete",
    source: "Direct",
    appliedAt: "2026-04-13",
    assignedAdvisor: "Daniel Ortiz",
    lastActivity: "3 days ago",
    risk: "stalled",
    goals: "Plumbing apprenticeship; needs help with union application.",
    educationLevel: "GED",
    supportNeeded: ["Apprenticeship help", "Resume / interview"],
  },
  {
    id: "p_1049",
    firstName: "Priya",
    lastName: "Shah",
    email: "priya.s@example.com",
    phone: "(617) 555-0157",
    city: "Quincy",
    state: "MA",
    zip: "02169",
    age: 26,
    pathway: "Short-term training",
    status: "Advising",
    source: "Referral",
    appliedAt: "2026-04-09",
    assignedAdvisor: "Aisha Bennett",
    lastActivity: "Today",
    risk: "ok",
    goals: "Medical assistant certification through YearUp partner program.",
    educationLevel: "Associate degree",
    supportNeeded: ["Career advising", "Childcare"],
    referralSource: "South Shore Workforce Board",
  },
];

export type Stage = {
  key: ParticipantStatus;
  label: string;
  description: string;
};

export const pipelineStages: Stage[] = [
  { key: "New", label: "New", description: "Fresh applications" },
  { key: "Screened", label: "Screened", description: "Eligibility passed" },
  {
    key: "Intake complete",
    label: "Intake complete",
    description: "Ready for advisor",
  },
  { key: "Advising", label: "Advising", description: "Active case" },
  { key: "Enrolled", label: "Enrolled", description: "Outcome reached" },
];

export const adminMetrics = {
  totalApplicants: 1284,
  newThisWeek: 47,
  callsScheduled: 23,
  enrolled: 312,
  pathwayDistribution: [
    { label: "College + FAFSA", value: 38 },
    { label: "Short-term training", value: 31 },
    { label: "Apprenticeship", value: 18 },
    { label: "GED / HSE", value: 13 },
  ],
  sourceDistribution: [
    { label: "Direct", value: 46 },
    { label: "Referral", value: 32 },
    { label: "Partner", value: 16 },
    { label: "Event", value: 6 },
  ],
};

export const participantSummary = {
  pathway: "College + FAFSA" as Pathway,
  advisor: "Maya Robinson",
  nextStep: "Submit your FAFSA documents",
  nextStepDue: "Friday, Apr 24",
  checklist: [
    { label: "Complete intake form", done: true },
    { label: "Schedule advising call", done: true },
    { label: "Upload high-school transcript", done: false },
    { label: "Submit FAFSA documents", done: false },
    { label: "Confirm college choices", done: false },
    { label: "Apply to programs", done: false },
  ],
  reminders: [
    {
      title: "FAFSA documents due",
      detail: "Upload last year's tax forms before Apr 24",
      tone: "warn" as const,
    },
    {
      title: "Advising call on Tuesday",
      detail: "10:30 AM ET with Maya Robinson",
      tone: "info" as const,
    },
  ],
  appointments: [
    {
      title: "Advising call",
      who: "Maya Robinson",
      when: "Tue, Apr 22 · 10:30 AM ET",
      mode: "Video",
      status: "Confirmed",
    },
    {
      title: "FAFSA workshop",
      who: "Workforce Center",
      when: "Thu, May 1 · 6:00 PM ET",
      mode: "In-person",
      status: "Optional",
    },
  ],
  documents: [
    {
      name: "High school transcript.pdf",
      uploaded: "Apr 12",
      size: "412 KB",
      status: "Verified",
    },
    {
      name: "Photo ID.jpg",
      uploaded: "Apr 12",
      size: "1.1 MB",
      status: "Verified",
    },
    {
      name: "FAFSA tax forms",
      uploaded: "—",
      size: "—",
      status: "Needed",
    },
  ],
  messages: [
    {
      from: "Maya Robinson",
      role: "Your advisor",
      preview:
        "Welcome aboard, Jordan. I pulled your transcript — let's review FAFSA on Tuesday.",
      time: "Apr 14",
      unread: true,
    },
    {
      from: "Career Access",
      role: "System",
      preview: "Your application has been received and routed to advising.",
      time: "Apr 8",
      unread: false,
    },
  ],
  intake: {
    contact: {
      email: "jordan.h@example.com",
      phone: "(617) 555-0142",
      address: "47 Tremont St, Boston MA 02118",
    },
    education: "Some college, no degree",
    interest: "Bachelor's degree",
    employment: "Part-time, retail",
    supportNeeded: ["FAFSA", "College apps", "Career advising"],
  },
  milestones: [
    { label: "Application submitted", date: "Apr 8", done: true },
    { label: "Eligibility confirmed", date: "Apr 9", done: true },
    { label: "Intake complete", date: "Apr 10", done: true },
    { label: "Assigned advisor", date: "Apr 10", done: true },
    { label: "FAFSA submitted", date: "—", done: false },
    { label: "Enrolled", date: "—", done: false },
  ],
};
