"use client";

import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DetailGrid, DetailModal } from "@/components/ui/DetailModal";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  subscribeRecentContactInquiries,
  type ContactInquiryRow,
} from "@/lib/services/contactInquiries";
import {
  subscribeRecentAppointments,
  type AppointmentRow,
} from "@/lib/services/appointments";
import {
  subscribeAllThreads,
  type MessageRow,
} from "@/lib/services/messages";
import {
  assignAdvisor,
  subscribeParticipants,
  type ParticipantListItem,
} from "@/lib/services/participants";
import { subscribeAdvisors, type AdvisorRow } from "@/lib/services/advisors";

export default function AdminInboxPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <AdminInbox />
    </RoleGuard>
  );
}

function AdminInbox() {
  const [contactInquiries, setContactInquiries] = useState<ContactInquiryRow[]>([]);
  const [bookings, setBookings] = useState<AppointmentRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [participants, setParticipants] = useState<ParticipantListItem[]>([]);
  const [advisors, setAdvisors] = useState<AdvisorRow[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryRow | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<AppointmentRow | null>(null);
  const [selectedThreadParticipantId, setSelectedThreadParticipantId] = useState<string | null>(null);
  const [assigningParticipantId, setAssigningParticipantId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeLane, setActiveLane] = useState<"all" | "contact" | "bookings" | "unassigned">(
    "all"
  );

  useEffect(() => {
    const a = subscribeRecentContactInquiries(setContactInquiries, 30);
    const b = subscribeRecentAppointments(setBookings, 30);
    const c = subscribeAllThreads(setMessages);
    const d = subscribeParticipants(setParticipants);
    const e = subscribeAdvisors(setAdvisors);
    return () => {
      a();
      b();
      c();
      d();
      e();
    };
  }, []);

  const participantById = useMemo(
    () => new Map(participants.map((p) => [p.id, p])),
    [participants]
  );

  const unassignedThreads = useMemo(() => {
    const byParticipant = new Map<string, MessageRow>();
    for (const m of messages) {
      const existing = byParticipant.get(m.participantId);
      if (!existing) {
        byParticipant.set(m.participantId, m);
      }
    }
    return Array.from(byParticipant.values()).filter((m) => {
      const p = participantById.get(m.participantId);
      return !p || !p.assignedAdvisorId;
    });
  }, [messages, participantById]);

  const selectedThreadParticipant = selectedThreadParticipantId
    ? participantById.get(selectedThreadParticipantId) ?? null
    : null;
  const selectedThreadMessages = useMemo(() => {
    if (!selectedThreadParticipantId) return [];
    return messages
      .filter((m) => m.participantId === selectedThreadParticipantId)
      .sort((a, b) => (a.createdAtISO ?? "").localeCompare(b.createdAtISO ?? ""));
  }, [messages, selectedThreadParticipantId]);

  const term = search.trim().toLowerCase();
  const filteredInquiries = useMemo(
    () =>
      contactInquiries.filter((q) =>
        [q.name, q.email, q.role, q.message].join(" ").toLowerCase().includes(term)
      ),
    [contactInquiries, term]
  );
  const filteredBookings = useMemo(
    () =>
      bookings.filter((b) =>
        [
          b.contactName,
          b.participantName,
          b.contactEmail,
          b.appointmentType,
          b.scheduledDate,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term)
      ),
    [bookings, term]
  );
  const filteredUnassignedThreads = useMemo(
    () =>
      unassignedThreads.filter((m) => {
        const p = participantById.get(m.participantId);
        const name = p ? `${p.firstName} ${p.lastName}` : m.senderName;
        return [name, p?.email, m.body].filter(Boolean).join(" ").toLowerCase().includes(term);
      }),
    [unassignedThreads, participantById, term]
  );

  return (
    <PortalShell
      role="admin"
      title="Inbox & bookings"
      subtitle="Live queue from /contact and /book submissions."
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <LaneButton
            label="All"
            count={filteredInquiries.length + filteredBookings.length + filteredUnassignedThreads.length}
            active={activeLane === "all"}
            onClick={() => setActiveLane("all")}
          />
          <LaneButton
            label="Contact"
            count={filteredInquiries.length}
            active={activeLane === "contact"}
            onClick={() => setActiveLane("contact")}
          />
          <LaneButton
            label="Bookings"
            count={filteredBookings.length}
            active={activeLane === "bookings"}
            onClick={() => setActiveLane("bookings")}
          />
          <LaneButton
            label="Unassigned Msgs"
            count={filteredUnassignedThreads.length}
            active={activeLane === "unassigned"}
            onClick={() => setActiveLane("unassigned")}
          />
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search all queues..."
          className="h-9 w-full max-w-sm rounded-md border border-line bg-white px-3 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </div>

      {(activeLane === "all" || activeLane === "contact" || activeLane === "bookings") && (
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Contact inquiries"
            description="Incoming messages from /contact"
            action={<Badge tone="info">{filteredInquiries.length}</Badge>}
          />
          <CardBody className="grid gap-2 max-h-[420px] overflow-y-auto">
            {filteredInquiries.length === 0 ? (
              <p className="text-[13px] text-ink-muted">No inquiries yet.</p>
            ) : (
              filteredInquiries.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedInquiry(q)}
                  className="w-full rounded-md border border-line px-3 py-2.5 text-left hover:border-primary/30 hover:bg-canvas/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-ink">{q.name}</p>
                    <Badge tone="muted" size="sm">
                      {q.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-subtle">{q.email}</p>
                  <p className="mt-1 text-[11px] text-ink-subtle">{q.role}</p>
                  <p className="mt-1.5 text-[12px] text-ink-muted line-clamp-2">
                    {q.message}
                  </p>
                </button>
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Booked appointments"
            description="Incoming bookings from /book"
            action={<Badge tone="primary">{filteredBookings.length}</Badge>}
          />
          <CardBody className="grid gap-2 max-h-[420px] overflow-y-auto">
            {filteredBookings.length === 0 ? (
              <p className="text-[13px] text-ink-muted">No bookings yet.</p>
            ) : (
              filteredBookings.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBooking(b)}
                  className="w-full rounded-md border border-line px-3 py-2.5 text-left hover:border-primary/30 hover:bg-canvas/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-ink">
                      {b.contactName || b.participantName || "Unknown"}
                    </p>
                    <Badge tone="warn" size="sm">
                      {b.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-subtle">
                    {b.scheduledDate} at {b.scheduledTime} {b.timezone}
                  </p>
                  <p className="mt-1 text-[12px] text-ink-subtle">
                    {b.contactEmail || "No email"}
                  </p>
                  <p className="mt-1.5 text-[12px] text-ink-muted">{b.appointmentType}</p>
                </button>
              ))
            )}
          </CardBody>
        </Card>
      </div>
      )}

      {(activeLane === "all" || activeLane === "unassigned") && (
      <div className="mt-4">
        <Card>
          <CardHeader
            title="Unassigned participant messages"
            description="Participant threads waiting for advisor assignment"
            action={<Badge tone="warn">{filteredUnassignedThreads.length}</Badge>}
          />
          <CardBody className="grid gap-2 max-h-[360px] overflow-y-auto">
            {filteredUnassignedThreads.length === 0 ? (
              <p className="text-[13px] text-ink-muted">
                No unassigned participant threads right now.
              </p>
            ) : (
              filteredUnassignedThreads.map((m) => {
                const p = participantById.get(m.participantId);
                const participantName = p
                  ? `${p.firstName} ${p.lastName}`
                  : m.senderName || m.participantId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedThreadParticipantId(m.participantId)}
                    className="w-full rounded-md border border-line px-3 py-2.5 text-left hover:border-primary/30 hover:bg-canvas/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[13px] font-medium text-ink">{participantName}</p>
                      <Badge tone="warn" size="sm">
                        Unassigned
                      </Badge>
                    </div>
                    <p className="mt-1 text-[12px] text-ink-subtle">
                      {p?.email || "No linked participant record yet"}
                    </p>
                    <p className="mt-1.5 text-[12px] text-ink-muted line-clamp-2">{m.body}</p>
                  </button>
                );
              })
            )}
          </CardBody>
        </Card>
      </div>
      )}

      <DetailModal
        open={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Contact inquiry details"
        subtitle="Full intake snapshot from /contact"
      >
        {selectedInquiry && (
          <DetailGrid
            rows={[
              { label: "Record ID", value: selectedInquiry.id },
              { label: "Name", value: selectedInquiry.name },
              { label: "Email", value: selectedInquiry.email },
              { label: "Phone", value: selectedInquiry.phone || "Not provided" },
              { label: "Role", value: selectedInquiry.role },
              { label: "Status", value: selectedInquiry.status },
              { label: "Source page", value: selectedInquiry.sourcePage },
              {
                label: "Submitted at",
                value: selectedInquiry.createdAtISO
                  ? new Date(selectedInquiry.createdAtISO).toLocaleString()
                  : "Unknown",
              },
              { label: "Message", value: selectedInquiry.message },
            ]}
          />
        )}
      </DetailModal>

      <DetailModal
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booked appointment details"
        subtitle="Full intake snapshot from /book or quick booking"
      >
        {selectedBooking && (
          <DetailGrid
            rows={[
              { label: "Record ID", value: selectedBooking.id },
              { label: "Participant key", value: selectedBooking.participantId },
              {
                label: "Contact name",
                value:
                  selectedBooking.contactName ||
                  selectedBooking.participantName ||
                  "Not provided",
              },
              { label: "Contact email", value: selectedBooking.contactEmail || "Not provided" },
              { label: "Contact phone", value: selectedBooking.contactPhone || "Not provided" },
              { label: "Appointment type", value: selectedBooking.appointmentType },
              { label: "Date", value: selectedBooking.scheduledDate },
              { label: "Time", value: selectedBooking.scheduledTime },
              { label: "Timezone", value: selectedBooking.timezone },
              { label: "Mode", value: selectedBooking.mode },
              { label: "Status", value: selectedBooking.status },
              { label: "Advisor", value: selectedBooking.advisorName || "Unassigned" },
            ]}
          />
        )}
      </DetailModal>

      <DetailModal
        open={!!selectedThreadParticipantId}
        onClose={() => setSelectedThreadParticipantId(null)}
        title="Unassigned message thread"
        subtitle="Assign an advisor so this thread moves to advisor inbox"
      >
        <div className="grid gap-4">
          {selectedThreadParticipant ? (
            <>
              <DetailGrid
                rows={[
                  { label: "Participant ID", value: selectedThreadParticipant.id },
                  {
                    label: "Participant name",
                    value: `${selectedThreadParticipant.firstName} ${selectedThreadParticipant.lastName}`,
                  },
                  { label: "Email", value: selectedThreadParticipant.email },
                  { label: "Pathway", value: selectedThreadParticipant.pathway },
                  { label: "Status", value: selectedThreadParticipant.status },
                ]}
              />
              <div className="rounded-md border border-line p-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                  Assign advisor
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <select
                    defaultValue=""
                    disabled={assigningParticipantId === selectedThreadParticipant.id}
                    onChange={async (e) => {
                      const nextId = e.target.value || null;
                      if (!nextId) return;
                      const match = advisors.find((a) => a.id === nextId);
                      if (!match) return;
                      setAssigningParticipantId(selectedThreadParticipant.id);
                      try {
                        await assignAdvisor(
                          selectedThreadParticipant.id,
                          match.id,
                          match.fullName
                        );
                        setSelectedThreadParticipantId(null);
                      } catch {
                      } finally {
                        setAssigningParticipantId(null);
                      }
                    }}
                    className="h-9 min-w-[240px] rounded-md border border-line bg-white px-2 text-[13px]"
                  >
                    <option value="">Select advisor</option>
                    {advisors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-md border border-warn/40 bg-warn-50/50 p-3 text-[13px] text-ink-muted">
              No linked participant record found for this thread yet. Messages are visible here,
              but advisor assignment needs a participant profile.
            </div>
          )}

          <div className="rounded-md border border-line p-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
              Conversation
            </p>
            <div className="mt-2 grid gap-2 max-h-[320px] overflow-y-auto">
              {selectedThreadMessages.length === 0 ? (
                <p className="text-[13px] text-ink-muted">No messages in this thread.</p>
              ) : (
                selectedThreadMessages.map((m) => (
                  <div key={m.id} className="rounded-md border border-line bg-canvas/40 p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12px] font-medium text-ink">
                        {m.senderName} · {m.senderRole}
                      </p>
                      <p className="text-[11px] text-ink-subtle">
                        {m.createdAtISO ? new Date(m.createdAtISO).toLocaleString() : "Just now"}
                      </p>
                    </div>
                    <p className="mt-1 text-[13px] text-ink-muted whitespace-pre-wrap">{m.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DetailModal>
    </PortalShell>
  );
}

function LaneButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "h-8 rounded-md border px-2.5 text-[12px] font-medium inline-flex items-center gap-2",
        active
          ? "border-primary bg-primary text-white"
          : "border-line bg-white text-ink-muted hover:text-ink",
      ].join(" ")}
    >
      {label}
      <span className={active ? "text-white/90" : "text-ink-subtle"}>{count}</span>
    </button>
  );
}
