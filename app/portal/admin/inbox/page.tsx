"use client";

import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DetailGrid, DetailModal } from "@/components/ui/DetailModal";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  subscribeRecentContactInquiries,
  type ContactInquiryRow,
  updateContactInquiryStatus,
} from "@/lib/services/contactInquiries";
import {
  subscribeRecentAppointments,
  type AppointmentRow,
  updateAppointmentStatus,
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
  const [threadActionError, setThreadActionError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeLane, setActiveLane] = useState<
    "all" | "contact" | "bookings" | "threads" | "unassigned"
  >("all");
  const [contactStatusFilter, setContactStatusFilter] = useState<
    "all" | ContactInquiryRow["status"]
  >("all");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<
    "all" | AppointmentRow["status"]
  >("all");

  useEffect(() => {
    const a = subscribeRecentContactInquiries(setContactInquiries, 40);
    const b = subscribeRecentAppointments(setBookings, 40);
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
  const participantByUserId = useMemo(
    () =>
      new Map(
        participants
          .filter((p) => !!p.userId)
          .map((p) => [p.userId as string, p])
      ),
    [participants]
  );
  const getParticipantForThreadKey = (key: string) =>
    participantById.get(key) ||
    participantByUserId.get(key) ||
    (key.startsWith("user-") ? participantByUserId.get(key.slice(5)) : undefined) ||
    null;
  const getParticipantForThread = (m: MessageRow) =>
    getParticipantForThreadKey(m.participantId) ||
    (m.senderRole === "participant"
      ? participantByUserId.get(m.senderId) ||
        (m.senderId.startsWith("user-") ? participantByUserId.get(m.senderId.slice(5)) : null) ||
        null
      : null);

  const allThreads = useMemo(() => {
    const byParticipant = new Map<string, MessageRow>();
    for (const m of messages) {
      if (!byParticipant.has(m.participantId)) byParticipant.set(m.participantId, m);
    }
    return Array.from(byParticipant.values());
  }, [messages]);

  const unassignedThreads = useMemo(
    () =>
      allThreads.filter((m) => {
        const p = getParticipantForThread(m);
        return !p || !p.assignedAdvisorId;
      }),
    [allThreads, participantById, participantByUserId]
  );

  const selectedThreadRoot = useMemo(
    () => allThreads.find((m) => m.participantId === selectedThreadParticipantId) ?? null,
    [allThreads, selectedThreadParticipantId]
  );
  const selectedThreadParticipant = selectedThreadParticipantId
    ? selectedThreadRoot
      ? getParticipantForThread(selectedThreadRoot)
      : getParticipantForThreadKey(selectedThreadParticipantId)
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
      contactInquiries
        .filter((q) =>
          [q.name, q.email, q.role, q.message].join(" ").toLowerCase().includes(term)
        )
        .filter((q) => contactStatusFilter === "all" || q.status === contactStatusFilter),
    [contactInquiries, term, contactStatusFilter]
  );
  const filteredBookings = useMemo(
    () =>
      bookings
        .filter((b) =>
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
        )
        .filter((b) => bookingStatusFilter === "all" || b.status === bookingStatusFilter),
    [bookings, term, bookingStatusFilter]
  );
  const filteredAllThreads = useMemo(
    () =>
      allThreads.filter((m) => {
        const p = getParticipantForThread(m);
        const name = p ? `${p.firstName} ${p.lastName}` : m.senderName;
        return [name, p?.email, m.body].filter(Boolean).join(" ").toLowerCase().includes(term);
      }),
    [allThreads, term, participantById, participantByUserId]
  );
  const filteredUnassignedThreads = useMemo(
    () =>
      unassignedThreads.filter((m) => {
        const p = getParticipantForThread(m);
        const name = p ? `${p.firstName} ${p.lastName}` : m.senderName;
        return [name, p?.email, m.body].filter(Boolean).join(" ").toLowerCase().includes(term);
      }),
    [unassignedThreads, term, participantById, participantByUserId]
  );

  return (
    <PortalShell
      role="admin"
      title="Inbox Command Center"
      subtitle="Triage contact inquiries, bookings, and threads with in-place actions."
    >
      <div className="mb-3 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search names, emails, threads, appointment types..."
          className="h-10 w-full rounded-md border border-line bg-white px-3 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <select
          value={contactStatusFilter}
          onChange={(e) =>
            setContactStatusFilter(e.target.value as "all" | ContactInquiryRow["status"])
          }
          className="h-10 min-w-[170px] rounded-md border border-line bg-white px-2 text-[13px]"
        >
          <option value="all">All inquiry statuses</option>
          <option value="new">New</option>
          <option value="in-progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={bookingStatusFilter}
          onChange={(e) =>
            setBookingStatusFilter(e.target.value as "all" | AppointmentRow["status"])
          }
          className="h-10 min-w-[170px] rounded-md border border-line bg-white px-2 text-[13px]"
        >
          <option value="all">All booking statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-show</option>
        </select>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <LaneButton
            label="All"
            count={filteredInquiries.length + filteredBookings.length + filteredAllThreads.length}
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
            label="Threads"
            count={filteredAllThreads.length}
            active={activeLane === "threads"}
            onClick={() => setActiveLane("threads")}
          />
          <LaneButton
            label="Unassigned"
            count={filteredUnassignedThreads.length}
            active={activeLane === "unassigned"}
            onClick={() => setActiveLane("unassigned")}
          />
        </div>
        <div className="text-[12px] text-ink-subtle">
          {filteredInquiries.length + filteredBookings.length + filteredAllThreads.length} records
        </div>
      </div>

      {(activeLane === "all" || activeLane === "contact" || activeLane === "bookings") && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader
              title="Contact inquiries"
              description="Status-color coded queue with modal actions"
              action={<Badge tone="info">{filteredInquiries.length}</Badge>}
            />
            <CardBody className="grid gap-2 max-h-[390px] overflow-y-auto">
              {filteredInquiries.length === 0 && (
                <p className="text-[13px] text-ink-muted">No inquiries found.</p>
              )}
              {filteredInquiries.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedInquiry(q)}
                  className={[
                    "w-full rounded-md border px-3 py-2.5 text-left hover:border-primary/30 hover:bg-canvas/40",
                    q.status === "resolved"
                      ? "border-action/40 bg-action-50/20"
                      : q.status === "in-progress"
                        ? "border-warn/40 bg-warn-50/25"
                        : "border-primary/35 bg-primary-50/25",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-ink">{q.name}</p>
                    <Badge
                      tone={
                        q.status === "resolved"
                          ? "success"
                          : q.status === "in-progress"
                            ? "warn"
                            : "info"
                      }
                      size="sm"
                    >
                      {q.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-subtle">{q.email}</p>
                  <p className="mt-1.5 text-[12px] text-ink-muted line-clamp-2">{q.message}</p>
                </button>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Booked appointments"
              description="Operational booking queue with status colors"
              action={<Badge tone="primary">{filteredBookings.length}</Badge>}
            />
            <CardBody className="grid gap-2 max-h-[390px] overflow-y-auto">
              {filteredBookings.length === 0 && (
                <p className="text-[13px] text-ink-muted">No bookings found.</p>
              )}
              {filteredBookings.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBooking(b)}
                  className={[
                    "w-full rounded-md border px-3 py-2.5 text-left hover:border-primary/30 hover:bg-canvas/40",
                    b.status === "completed"
                      ? "border-action/40 bg-action-50/20"
                      : b.status === "cancelled" || b.status === "no-show"
                        ? "border-danger/35 bg-danger-50/25"
                        : "border-primary/35 bg-primary-50/20",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-ink">
                      {b.contactName || b.participantName || "Unknown"}
                    </p>
                    <Badge
                      tone={
                        b.status === "completed"
                          ? "success"
                          : b.status === "cancelled" || b.status === "no-show"
                            ? "muted"
                            : "warn"
                      }
                      size="sm"
                    >
                      {b.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-subtle">
                    {b.scheduledDate} · {b.scheduledTime} {b.timezone}
                  </p>
                  <p className="mt-1.5 text-[12px] text-ink-muted">{b.appointmentType}</p>
                </button>
              ))}
            </CardBody>
          </Card>
        </div>
      )}

      {(activeLane === "all" || activeLane === "threads") && (
        <div className="mt-4">
          <Card>
            <CardHeader
              title="Participant threads"
              description="Inline assignment controls and quick drill-in"
              action={<Badge tone="primary">{filteredAllThreads.length}</Badge>}
            />
            <CardBody className="grid gap-2 max-h-[370px] overflow-y-auto">
              {filteredAllThreads.length === 0 && (
                <p className="text-[13px] text-ink-muted">No threads found.</p>
              )}
              {filteredAllThreads.map((m) => {
                const p = getParticipantForThread(m);
                const participantName = p
                  ? `${p.firstName} ${p.lastName}`
                  : m.senderName || m.participantId;
                return (
                  <div
                    key={m.id}
                    className="rounded-md border border-line px-3 py-2.5 hover:border-primary/30 hover:bg-canvas/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedThreadParticipantId(m.participantId)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <p className="text-[13px] font-medium text-ink">{participantName}</p>
                        <p className="mt-1 text-[12px] text-ink-subtle">
                          {p?.email || "Participant record not found"}
                        </p>
                        <p className="mt-1.5 text-[12px] text-ink-muted line-clamp-2">{m.body}</p>
                      </button>
                      {p ? (
                        <select
                          value={p.assignedAdvisorId ?? ""}
                          disabled={assigningParticipantId === p.id}
                          onChange={async (e) => {
                            const nextId = e.target.value || null;
                            const match = advisors.find((a) => a.id === nextId);
                            setAssigningParticipantId(p.id);
                            try {
                              await assignAdvisor(p.id, nextId, match?.fullName ?? null);
                            } catch {
                            } finally {
                              setAssigningParticipantId(null);
                            }
                          }}
                          className="h-8 min-w-[190px] rounded-md border border-line bg-white px-2 text-[12px]"
                        >
                          <option value="">Unassigned</option>
                          {advisors.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.fullName}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Badge tone="warn" size="sm">
                          Needs participant link
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </div>
      )}

      {(activeLane === "all" || activeLane === "unassigned") && (
        <div className="mt-4">
          <Card>
            <CardHeader
              title="Unassigned participant messages"
              description="Threads with no advisor currently assigned"
              action={<Badge tone="warn">{filteredUnassignedThreads.length}</Badge>}
            />
            <CardBody className="grid gap-2 max-h-[350px] overflow-y-auto">
              {filteredUnassignedThreads.length === 0 && (
                <p className="text-[13px] text-ink-muted">No unassigned threads found.</p>
              )}
              {filteredUnassignedThreads.map((m) => {
                const p = getParticipantForThread(m);
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
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-medium text-ink">{participantName}</p>
                      <Badge tone="warn" size="sm">
                        Unassigned
                      </Badge>
                    </div>
                    <p className="mt-1 text-[12px] text-ink-subtle">
                      {p?.email || "Participant record not found"}
                    </p>
                    <p className="mt-1.5 text-[12px] text-ink-muted line-clamp-2">{m.body}</p>
                  </button>
                );
              })}
            </CardBody>
          </Card>
        </div>
      )}

      <DetailModal
        open={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Contact inquiry details"
        subtitle="Review full intake details and update operational status"
      >
        {selectedInquiry && (
          <>
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
            <div className="mt-4 rounded-md border border-line p-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                Update status
              </p>
              <div className="mt-2">
                <select
                  value={selectedInquiry.status}
                  onChange={async (e) => {
                    const next = e.target.value as ContactInquiryRow["status"];
                    try {
                      await updateContactInquiryStatus(selectedInquiry.id, next);
                      setSelectedInquiry({ ...selectedInquiry, status: next });
                    } catch {}
                  }}
                  className="h-9 min-w-[220px] rounded-md border border-line bg-white px-2 text-[13px]"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </>
        )}
      </DetailModal>

      <DetailModal
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booked appointment details"
        subtitle="Review booking details and update appointment status"
      >
        {selectedBooking && (
          <>
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
            <div className="mt-4 rounded-md border border-line p-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                Update status
              </p>
              <div className="mt-2">
                <select
                  value={selectedBooking.status}
                  onChange={async (e) => {
                    const next = e.target.value as AppointmentRow["status"];
                    try {
                      await updateAppointmentStatus(selectedBooking.id, next);
                      setSelectedBooking({ ...selectedBooking, status: next });
                    } catch {}
                  }}
                  className="h-9 min-w-[220px] rounded-md border border-line bg-white px-2 text-[13px]"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No-show</option>
                </select>
              </div>
            </div>
          </>
        )}
      </DetailModal>

      <DetailModal
        open={!!selectedThreadParticipantId}
        onClose={() => {
          setSelectedThreadParticipantId(null);
          setThreadActionError(null);
        }}
        title="Thread details"
        subtitle="Assign advisor and review full conversation transcript"
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
                    value={selectedThreadParticipant.assignedAdvisorId ?? ""}
                    disabled={assigningParticipantId === selectedThreadParticipant.id}
                    onChange={async (e) => {
                      const nextId = e.target.value || null;
                      const match = advisors.find((a) => a.id === nextId);
                      setThreadActionError(null);
                      setAssigningParticipantId(selectedThreadParticipant.id);
                      try {
                        await assignAdvisor(
                          selectedThreadParticipant.id,
                          nextId,
                          match?.fullName ?? null
                        );
                      } catch {
                        setThreadActionError("Could not assign advisor. Please try again.");
                      } finally {
                        setAssigningParticipantId(null);
                      }
                    }}
                    className="h-9 min-w-[240px] rounded-md border border-line bg-white px-2 text-[13px]"
                  >
                    <option value="">Unassigned</option>
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
            <div className="rounded-md border border-warn/40 bg-warn-50/40 p-3 text-[13px] text-ink-muted grid gap-3">
              <p>
                No linked participant record found for this thread key. This should be rare now and
                usually indicates older data that must be backfilled.
              </p>
            </div>
          )}

          {threadActionError && (
            <div className="rounded-md border border-danger/30 bg-danger-50 p-2.5 text-[12px] text-danger">
              {threadActionError}
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
