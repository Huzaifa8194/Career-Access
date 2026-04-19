"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea, Select } from "@/components/ui/Field";
import {
  Mail,
  Phone,
  MapPin,
  FileText,
  Check,
  Clock,
  AlertTriangle,
  Flag,
  Plus,
  Sparkle,
} from "@/components/icons";
import { type Participant, advisors } from "@/lib/data";

const statusTone = {
  New: "info",
  Screened: "muted",
  "Intake complete": "primary",
  Advising: "warn",
  Enrolled: "success",
  Inactive: "muted",
} as const;

const tabs = ["Overview", "Notes & history", "Documents", "Milestones"] as const;
type Tab = (typeof tabs)[number];

export function ParticipantProfile({
  participant,
  role,
}: {
  participant: Participant;
  role: "advisor" | "admin";
}) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [status, setStatus] = useState(participant.status);
  const [advisor, setAdvisor] = useState(
    participant.assignedAdvisor ?? "— Unassigned —"
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr] items-start">
      <div className="grid gap-5 min-w-0">
        {/* Identity card */}
        <Card>
          <div className="p-5 sm:p-6 flex items-start gap-5 flex-wrap">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white text-[18px] font-semibold">
              {participant.firstName[0]}
              {participant.lastName[0]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[22px] font-semibold tracking-tight">
                  {participant.firstName} {participant.lastName}
                </h2>
                <Badge tone={statusTone[status]} dot>
                  {status}
                </Badge>
                {participant.risk && participant.risk !== "ok" && (
                  <Badge tone="warn" dot>
                    {participant.risk === "inactive" ? "Inactive" : "Stalled"}
                  </Badge>
                )}
              </div>
              <div className="mt-1 text-[13px] text-ink-subtle">
                Applied {participant.appliedAt} · ID {participant.id} · Source {participant.source}
              </div>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-3 text-[13px]">
                <ContactRow icon={<Mail size={14} />} value={participant.email} />
                <ContactRow icon={<Phone size={14} />} value={participant.phone} />
                <ContactRow
                  icon={<MapPin size={14} />}
                  value={`${participant.city}, ${participant.state} ${participant.zip}`}
                />
              </div>
            </div>
          </div>
          <div className="border-t border-line bg-canvas/60 px-5 py-2.5 flex gap-1 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  "h-8 px-3 rounded-md text-[13px] font-medium",
                  tab === t
                    ? "bg-white border border-line text-ink shadow-[var(--shadow-card)]"
                    : "text-ink-muted hover:text-ink",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        {tab === "Overview" && <OverviewTab p={participant} />}
        {tab === "Notes & history" && <NotesTab />}
        {tab === "Documents" && <DocumentsTab />}
        {tab === "Milestones" && <MilestonesTab p={participant} />}
      </div>

      {/* Right rail: actions */}
      <div className="grid gap-4">
        <Card>
          <CardHeader title="Case actions" description="Update routing and assignment" />
          <CardBody className="grid gap-4">
            <div className="grid gap-1.5">
              <label className="text-[12px] uppercase tracking-wider text-ink-subtle">
                Status
              </label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
              >
                {(
                  [
                    "New",
                    "Screened",
                    "Intake complete",
                    "Advising",
                    "Enrolled",
                    "Inactive",
                  ] as const
                ).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </div>
            {role === "admin" && (
              <div className="grid gap-1.5">
                <label className="text-[12px] uppercase tracking-wider text-ink-subtle">
                  Assigned advisor
                </label>
                <Select value={advisor} onChange={(e) => setAdvisor(e.target.value)}>
                  <option>— Unassigned —</option>
                  {advisors.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </Select>
              </div>
            )}
            <div className="grid gap-1.5">
              <label className="text-[12px] uppercase tracking-wider text-ink-subtle">
                Pathway
              </label>
              <Select defaultValue={participant.pathway}>
                <option>College + FAFSA</option>
                <option>Short-term training</option>
                <option>Apprenticeship</option>
                <option>GED / HSE</option>
              </Select>
            </div>
            <Button variant="primary" className="w-full">
              Save changes
            </Button>
          </CardBody>
          <CardFooter className="flex items-center justify-between">
            <span className="text-[12px] text-ink-subtle">
              Last update: 2 days ago
            </span>
            <button className="text-[12px] font-medium text-danger inline-flex items-center gap-1">
              <Flag size={12} /> Flag at risk
            </button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader title="Quick log" description="Capture a follow-up" />
          <CardBody className="grid gap-3">
            <Select defaultValue="Phone call">
              <option>Phone call</option>
              <option>Email sent</option>
              <option>In-person session</option>
              <option>SMS</option>
              <option>No-show</option>
            </Select>
            <Textarea rows={3} placeholder="Brief note about the interaction…" />
            <Button variant="secondary" className="w-full">
              <Plus size={14} /> Add to log
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="At-a-glance" />
          <CardBody className="grid gap-3 text-[13px]">
            <Glance label="Pathway" value={participant.pathway} />
            <Glance label="Education" value={participant.educationLevel ?? "—"} />
            <Glance
              label="Support needed"
              value={participant.supportNeeded?.join(" · ") ?? "—"}
            />
            <Glance
              label="Referral source"
              value={participant.referralSource ?? "—"}
            />
            <Glance label="Goal" value={participant.goals ?? "—"} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-ink">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-canvas text-ink-subtle">
        {icon}
      </span>
      <span className="truncate">{value}</span>
    </div>
  );
}

function Glance({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3">
      <span className="text-[12px] uppercase tracking-wider text-ink-subtle">
        {label}
      </span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

function OverviewTab({ p }: { p: Participant }) {
  return (
    <>
      <Card>
        <CardHeader
          title="Goal"
          description="Captured during intake — keep current"
        />
        <CardBody>
          <p className="text-[15px] leading-7 text-ink">{p.goals}</p>
        </CardBody>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardHeader title="Education + interest" />
          <CardBody className="grid gap-3 text-[14px]">
            <Glance label="Highest level" value={p.educationLevel ?? "—"} />
            <Glance label="Interest" value={p.pathway} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Support needs" />
          <CardBody className="flex flex-wrap gap-2">
            {(p.supportNeeded ?? []).map((s) => (
              <Badge key={s} tone="primary">
                {s}
              </Badge>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Suggested next steps"
          description="From your case-management playbook"
          action={<Badge tone="primary" dot>Auto-suggested</Badge>}
        />
        <CardBody className="grid gap-2.5">
          {[
            "Confirm FAFSA documents are uploaded",
            "Schedule a 30-minute check-in this week",
            "Send program shortlist for review",
          ].map((step) => (
            <label
              key={step}
              className="flex items-center gap-3 rounded-md border border-line p-3 hover:bg-canvas cursor-pointer"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
              />
              <span className="text-[14px]">{step}</span>
              <span className="ml-auto text-[12px] text-ink-subtle inline-flex items-center gap-1">
                <Sparkle size={12} /> Add to plan
              </span>
            </label>
          ))}
        </CardBody>
      </Card>
    </>
  );
}

function NotesTab() {
  const log = [
    {
      who: "Maya Robinson",
      type: "Phone call · 12 min",
      when: "Apr 14 · 2:30 PM",
      body: "Walked through FAFSA basics. Sent video link for Tuesday session. Confirmed contact prefers email.",
    },
    {
      who: "System",
      type: "Pathway assigned",
      when: "Apr 10 · 9:15 AM",
      body: "Assigned to College + FAFSA based on intake interest.",
    },
    {
      who: "Maya Robinson",
      type: "Email sent",
      when: "Apr 10 · 9:00 AM",
      body: "Welcome email with portal link and intro material.",
    },
  ];
  return (
    <Card>
      <CardHeader
        title="Notes & history"
        description="Every interaction is logged here"
        action={
          <button className="text-[13px] font-medium text-primary inline-flex items-center gap-1">
            <Plus size={12} /> New note
          </button>
        }
      />
      <CardBody>
        <ol className="relative pl-6">
          <span className="absolute left-2 top-1 bottom-1 w-px bg-line" />
          {log.map((l, i) => (
            <li key={i} className="relative pb-6 last:pb-0">
              <span className="absolute -left-0.5 top-1 inline-flex h-3.5 w-3.5 rounded-full bg-white border border-primary ring-2 ring-primary/15" />
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-ink">
                  {l.who}
                </span>
                <span className="text-[12px] text-ink-subtle">· {l.type}</span>
                <span className="ml-auto text-[12px] text-ink-subtle inline-flex items-center gap-1">
                  <Clock size={11} /> {l.when}
                </span>
              </div>
              <p className="mt-1.5 text-[14px] text-ink-muted leading-6">
                {l.body}
              </p>
            </li>
          ))}
        </ol>
      </CardBody>
    </Card>
  );
}

function DocumentsTab() {
  const docs = [
    { name: "High school transcript.pdf", uploaded: "Apr 12", status: "Verified" },
    { name: "Photo ID.jpg", uploaded: "Apr 12", status: "Verified" },
    { name: "FAFSA tax forms", uploaded: "—", status: "Needed" },
    { name: "Resume.pdf", uploaded: "Apr 13", status: "In review" },
  ];
  const tone = {
    Verified: "success",
    Needed: "warn",
    "In review": "info",
  } as const;

  return (
    <Card>
      <CardHeader title="Documents" description="Visible to assigned advisor only" />
      <CardBody className="grid gap-2">
        {docs.map((d) => (
          <div
            key={d.name}
            className="flex items-center justify-between gap-3 rounded-md border border-line p-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-canvas text-ink-muted">
                <FileText size={16} />
              </span>
              <div className="min-w-0">
                <div className="text-[14px] font-medium truncate">{d.name}</div>
                <div className="text-[12px] text-ink-subtle">
                  Uploaded {d.uploaded}
                </div>
              </div>
            </div>
            <Badge tone={tone[d.status as keyof typeof tone]} dot>
              {d.status}
            </Badge>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

function MilestonesTab({ p }: { p: Participant }) {
  const milestones = [
    { label: "Application submitted", date: p.appliedAt, done: true },
    { label: "Eligibility confirmed", date: "Apr 9", done: true },
    { label: "Intake complete", date: "Apr 10", done: true },
    {
      label: "Assigned advisor",
      date: p.assignedAdvisor ? "Apr 10" : "—",
      done: !!p.assignedAdvisor,
    },
    { label: "FAFSA / application submitted", date: "—", done: false },
    { label: "Enrolled or placed", date: "—", done: false },
  ];
  return (
    <Card>
      <CardHeader
        title="Milestones"
        description="The case journey at a glance"
        action={
          <Badge tone={p.risk === "inactive" ? "warn" : "primary"} dot>
            {p.risk === "inactive" ? "Inactive" : "On track"}
          </Badge>
        }
      />
      <CardBody>
        <ul className="grid gap-3">
          {milestones.map((m) => (
            <li
              key={m.label}
              className="flex items-center gap-3 rounded-md border border-line p-3"
            >
              <span
                className={[
                  "inline-flex h-7 w-7 items-center justify-center rounded-full border",
                  m.done
                    ? "bg-action border-action text-white"
                    : "bg-white border-line text-ink-subtle",
                ].join(" ")}
              >
                {m.done ? <Check size={13} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </span>
              <span
                className={`text-[14px] ${m.done ? "text-ink" : "text-ink-muted"}`}
              >
                {m.label}
              </span>
              <span className="ml-auto text-[12px] text-ink-subtle">
                {m.date}
              </span>
            </li>
          ))}
        </ul>
        {p.risk === "inactive" && (
          <div className="mt-4 rounded-md border border-warn/20 bg-warn-50 p-3 flex items-start gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-warn text-white">
              <AlertTriangle size={14} />
            </span>
            <div className="text-[13px] leading-6">
              <p className="font-medium text-ink">Inactive 21 days</p>
              <p className="text-ink-muted">
                Suggest a re-engagement message and update status if no
                response in 7 days.
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
