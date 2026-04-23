"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea, Select } from "@/components/ui/Field";
import {
  Mail,
  Phone,
  MapPin,
  FileText,
  Clock,
  Flag,
  Plus,
  Sparkle,
} from "@/components/icons";
import type { ParticipantListItem } from "@/lib/services/participants";
import {
  assignAdvisor,
  setParticipantPathway,
  setParticipantStatus,
  setRiskFlag,
} from "@/lib/services/participants";
import {
  subscribeNotesForParticipant,
  addNote,
  type NoteRow,
} from "@/lib/services/notes";
import {
  subscribeDocumentsForParticipant,
  updateDocumentStatus,
  type DocumentRow,
} from "@/lib/services/documents";
import {
  subscribeTasksForParticipant,
  submitTask,
  updateTaskStatus,
  type TaskRow,
} from "@/lib/services/tasks";
import { subscribeAdvisors, type AdvisorRow } from "@/lib/services/advisors";
import { useAuth } from "@/lib/firebase/auth";
import type {
  ParticipantStatus,
  Pathway,
  DocumentStatus,
} from "@/lib/firebase/types";

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

const allStatus: ParticipantStatus[] = [
  "New",
  "Screened",
  "Intake complete",
  "Advising",
  "Enrolled",
  "Inactive",
];
const allPathways: Pathway[] = [
  "College + FAFSA",
  "Short-term training",
  "Apprenticeship",
  "GED / HSE",
];

export function ParticipantProfile({
  participant,
  role,
}: {
  participant: ParticipantListItem;
  role: "advisor" | "admin";
}) {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<Tab>("Overview");
  const [status, setStatus] = useState<ParticipantStatus>(participant.status);
  const [pathway, setPathway] = useState<Pathway>(participant.pathway);
  const [advisorId, setAdvisorId] = useState<string>(
    participant.assignedAdvisorId ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [advisors, setAdvisors] = useState<AdvisorRow[]>([]);

  useEffect(() => {
    return subscribeAdvisors(setAdvisors);
  }, []);

  useEffect(() => {
    setStatus(participant.status);
    setPathway(participant.pathway);
    setAdvisorId(participant.assignedAdvisorId ?? "");
  }, [participant]);

  async function save() {
    setSaving(true);
    setSaved(null);
    try {
      if (status !== participant.status) {
        await setParticipantStatus(participant.id, status);
      }
      if (pathway !== participant.pathway) {
        await setParticipantPathway(participant.id, pathway);
      }
      if ((advisorId || null) !== (participant.assignedAdvisorId ?? null)) {
        const match = advisors.find((a) => a.id === advisorId);
        await assignAdvisor(
          participant.id,
          advisorId || null,
          match?.fullName ?? null
        );
      }
      setSaved("Saved");
    } catch (e) {
      setSaved((e as Error)?.message ?? "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function flagRisk() {
    const next = participant.risk === "stalled" ? "ok" : "stalled";
    try {
      await setRiskFlag(participant.id, next);
    } catch {}
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr] items-start">
      <div className="grid gap-5 min-w-0">
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
                {participant.risk !== "ok" && (
                  <Badge tone="warn" dot>
                    {participant.risk === "inactive" ? "Inactive" : "Stalled"}
                  </Badge>
                )}
              </div>
              <div className="mt-1 text-[13px] text-ink-subtle">
                Applied {participant.appliedAt || "—"} · ID {participant.id} ·
                Source {participant.source}
              </div>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-3 text-[13px]">
                <ContactRow
                  icon={<Mail size={14} />}
                  value={participant.email || "—"}
                />
                <ContactRow
                  icon={<Phone size={14} />}
                  value={participant.phone || "—"}
                />
                <ContactRow
                  icon={<MapPin size={14} />}
                  value={
                    [participant.city, participant.state, participant.zip]
                      .filter(Boolean)
                      .join(", ") || "—"
                  }
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

        {tab === "Overview" && (
          <OverviewTab participant={participant} pathway={pathway} />
        )}
        {tab === "Notes & history" && (
          <NotesTab
            participantId={participant.id}
            advisorName={profile?.fullName ?? "Staff"}
            advisorId={user?.uid ?? null}
          />
        )}
        {tab === "Documents" && (
          <DocumentsTab participantId={participant.id} />
        )}
        {tab === "Milestones" && (
          <MilestonesTab
            participantId={participant.id}
            advisorId={user?.uid ?? null}
          />
        )}
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader
            title="Case actions"
            description="Update routing and assignment"
          />
          <CardBody className="grid gap-4">
            <div className="grid gap-1.5">
              <label className="text-[12px] uppercase tracking-wider text-ink-subtle">
                Status
              </label>
              <Select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as ParticipantStatus)
                }
              >
                {allStatus.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </div>
            {role === "admin" && (
              <div className="grid gap-1.5">
                <label className="text-[12px] uppercase tracking-wider text-ink-subtle">
                  Assigned advisor
                </label>
                <Select
                  value={advisorId}
                  onChange={(e) => setAdvisorId(e.target.value)}
                >
                  <option value="">— Unassigned —</option>
                  {advisors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.fullName}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            <div className="grid gap-1.5">
              <label className="text-[12px] uppercase tracking-wider text-ink-subtle">
                Pathway
              </label>
              <Select
                value={pathway}
                onChange={(e) => setPathway(e.target.value as Pathway)}
              >
                {allPathways.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
            {saved && (
              <div className="text-[12px] text-ink-subtle">{saved}</div>
            )}
          </CardBody>
          <CardFooter className="flex items-center justify-between">
            <span className="text-[12px] text-ink-subtle">
              Last activity: {participant.lastActivity}
            </span>
            <button
              onClick={flagRisk}
              className="text-[12px] font-medium text-danger inline-flex items-center gap-1"
            >
              <Flag size={12} />{" "}
              {participant.risk === "stalled"
                ? "Clear flag"
                : "Flag at risk"}
            </button>
          </CardFooter>
        </Card>

        <QuickLogCard
          participantId={participant.id}
          advisorId={user?.uid ?? null}
          advisorName={profile?.fullName ?? "Staff"}
        />

        <Card>
          <CardHeader title="At-a-glance" />
          <CardBody className="grid gap-3 text-[13px]">
            <Glance label="Pathway" value={participant.pathway} />
            <Glance
              label="Education"
              value={participant.educationLevel ?? "—"}
            />
            <Glance
              label="Support needed"
              value={
                participant.supportNeeded.length
                  ? participant.supportNeeded.join(" · ")
                  : "—"
              }
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

function QuickLogCard({
  participantId,
  advisorId,
  advisorName,
}: {
  participantId: string;
  advisorId: string | null;
  advisorName: string;
}) {
  const [type, setType] = useState("Phone call");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await addNote({
        participantId,
        advisorId,
        advisorName,
        type,
        text: text.trim(),
      });
      setText("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader title="Quick log" description="Capture a follow-up" />
      <CardBody className="grid gap-3">
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Phone call</option>
          <option>Email sent</option>
          <option>In-person session</option>
          <option>SMS</option>
          <option>No-show</option>
        </Select>
        <Textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Brief note about the interaction…"
        />
        <Button
          variant="secondary"
          className="w-full"
          onClick={submit}
          disabled={saving || !text.trim()}
        >
          <Plus size={14} /> {saving ? "Saving…" : "Add to log"}
        </Button>
      </CardBody>
    </Card>
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

function OverviewTab({
  participant,
  pathway,
}: {
  participant: ParticipantListItem;
  pathway: Pathway;
}) {
  return (
    <>
      <Card>
        <CardHeader
          title="Goal"
          description="Captured during intake — keep current"
        />
        <CardBody>
          <p className="text-[15px] leading-7 text-ink">
            {participant.goals || "No goal recorded yet."}
          </p>
        </CardBody>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardHeader title="Education + interest" />
          <CardBody className="grid gap-3 text-[14px]">
            <Glance
              label="Highest level"
              value={participant.educationLevel ?? "—"}
            />
            <Glance label="Interest" value={pathway} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Support needs" />
          <CardBody className="flex flex-wrap gap-2">
            {participant.supportNeeded.length === 0 && (
              <span className="text-[13px] text-ink-muted">
                No support items indicated.
              </span>
            )}
            {participant.supportNeeded.map((s) => (
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
          action={
            <Badge tone="primary" dot>
              Auto-suggested
            </Badge>
          }
        />
        <CardBody className="grid gap-2.5">
          {suggestedNextSteps(pathway).map((step) => (
            <label
              key={step}
              className="flex items-center gap-3 rounded-md border border-line p-3 hover:bg-canvas cursor-pointer"
            >
              <input type="checkbox" className="h-4 w-4 accent-primary" />
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

function suggestedNextSteps(p: Pathway): string[] {
  switch (p) {
    case "College + FAFSA":
      return [
        "Confirm FAFSA documents are uploaded",
        "Schedule a 30-minute check-in this week",
        "Send program shortlist for review",
      ];
    case "Apprenticeship":
      return [
        "Collect résumé and references",
        "Review next IBEW / union test date",
        "Practice interview prompts",
      ];
    case "Short-term training":
      return [
        "Match to training provider",
        "Verify funding eligibility",
        "Schedule intake at partner",
      ];
    case "GED / HSE":
      return [
        "Enroll in nearest HSE program",
        "Arrange transportation and childcare",
        "Plan post-HSE next step",
      ];
  }
}

function NotesTab({
  participantId,
  advisorId,
  advisorName,
}: {
  participantId: string;
  advisorId: string | null;
  advisorName: string;
}) {
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return subscribeNotesForParticipant(participantId, setNotes);
  }, [participantId]);

  async function submit() {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await addNote({ participantId, advisorId, advisorName, text });
      setText("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader
        title="Notes & history"
        description="Every interaction is logged here"
      />
      <CardBody>
        <div className="grid gap-2 mb-5">
          <Textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a note…"
          />
          <div className="flex justify-end">
            <Button onClick={submit} disabled={saving || !text.trim()}>
              <Plus size={12} /> {saving ? "Saving…" : "New note"}
            </Button>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="text-[13px] text-ink-muted">
            No notes yet.
          </div>
        ) : (
          <ol className="relative pl-6">
            <span className="absolute left-2 top-1 bottom-1 w-px bg-line" />
            {notes.map((l) => (
              <li key={l.id} className="relative pb-6 last:pb-0">
                <span className="absolute -left-0.5 top-1 inline-flex h-3.5 w-3.5 rounded-full bg-white border border-primary ring-2 ring-primary/15" />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-medium text-ink">
                    {l.advisorName ?? "Staff"}
                  </span>
                  <span className="text-[12px] text-ink-subtle">
                    · {l.type}
                  </span>
                  <span className="ml-auto text-[12px] text-ink-subtle inline-flex items-center gap-1">
                    <Clock size={11} />{" "}
                    {l.createdAtISO
                      ? new Date(l.createdAtISO).toLocaleString()
                      : "Just now"}
                  </span>
                </div>
                <p className="mt-1.5 text-[14px] text-ink-muted leading-6 whitespace-pre-wrap">
                  {l.text}
                </p>
              </li>
            ))}
          </ol>
        )}
      </CardBody>
    </Card>
  );
}

function DocumentsTab({ participantId }: { participantId: string }) {
  const [docs, setDocs] = useState<DocumentRow[]>([]);

  useEffect(() => {
    return subscribeDocumentsForParticipant(participantId, setDocs);
  }, [participantId]);

  async function setStatus(id: string, status: DocumentStatus) {
    try {
      await updateDocumentStatus(id, status);
    } catch {}
  }

  return (
    <Card>
      <CardHeader
        title="Documents"
        description="Visible to assigned advisor and admin"
      />
      <CardBody className="grid gap-2">
        {docs.length === 0 && (
          <div className="text-[13px] text-ink-muted">
            No documents uploaded yet.
          </div>
        )}
        {docs.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between gap-3 rounded-md border border-line p-3"
          >
            <a
              href={d.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 min-w-0 group"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-canvas text-ink-muted">
                <FileText size={16} />
              </span>
              <div className="min-w-0">
                <div className="text-[14px] font-medium truncate group-hover:text-primary">
                  {d.fileName}
                </div>
                <div className="text-[12px] text-ink-subtle">
                  Uploaded{" "}
                  {d.createdAtISO
                    ? new Date(d.createdAtISO).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            </a>
            <div className="flex items-center gap-2">
              <Select
                value={d.status}
                onChange={(e) =>
                  setStatus(d.id, e.target.value as DocumentStatus)
                }
                className="h-8"
              >
                <option value="in-review">In review</option>
                <option value="verified">Verified</option>
                <option value="needed">Needed</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

function MilestonesTab({
  participantId,
  advisorId,
}: {
  participantId: string;
  advisorId: string | null;
}) {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return subscribeTasksForParticipant(participantId, setTasks);
  }, [participantId]);

  async function add() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await submitTask({ participantId, title: title.trim() });
      setTitle("");
    } finally {
      setSaving(false);
    }
  }

  const sorted = useMemo(
    () =>
      [...tasks].sort((a, b) =>
        (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999")
      ),
    [tasks]
  );
  void advisorId;

  return (
    <Card>
      <CardHeader
        title="Milestones & tasks"
        description="Assign the next concrete step"
      />
      <CardBody className="grid gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task (e.g. Upload FAFSA forms)"
            className="flex-1 h-10 rounded-md border border-line bg-white px-3 text-[14px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <Button onClick={add} disabled={saving || !title.trim()}>
            Add
          </Button>
        </div>

        <ul className="grid gap-2">
          {sorted.length === 0 && (
            <li className="text-[13px] text-ink-muted">No tasks yet.</li>
          )}
          {sorted.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-md border border-line p-3"
            >
              <input
                type="checkbox"
                checked={t.status === "done"}
                onChange={(e) =>
                  updateTaskStatus(
                    t.id,
                    e.target.checked ? "done" : "open"
                  ).catch(() => {})
                }
                className="h-4 w-4 accent-primary"
              />
              <span
                className={`text-[14px] ${
                  t.status === "done" ? "line-through text-ink-subtle" : "text-ink"
                }`}
              >
                {t.title}
              </span>
              {t.dueDate && (
                <span className="ml-auto text-[12px] text-ink-subtle">
                  Due {t.dueDate}
                </span>
              )}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
