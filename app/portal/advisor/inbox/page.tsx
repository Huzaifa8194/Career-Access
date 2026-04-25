"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DetailGrid, DetailModal } from "@/components/ui/DetailModal";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  subscribeAllThreads,
  type MessageRow,
} from "@/lib/services/messages";
import {
  subscribeRecentContactInquiries,
  type ContactInquiryRow,
} from "@/lib/services/contactInquiries";
import {
  subscribeRecentAppointments,
  type AppointmentRow,
} from "@/lib/services/appointments";
import {
  subscribeParticipants,
  type ParticipantListItem,
} from "@/lib/services/participants";
import { subscribeAdvisors, type AdvisorRow } from "@/lib/services/advisors";
import { useAuth } from "@/lib/firebase/auth";

export default function AdvisorInboxPage() {
  return (
    <RoleGuard allow={["advisor", "admin"]}>
      <AdvisorInbox />
    </RoleGuard>
  );
}

type Thread = {
  participantId: string;
  participantName: string;
  pathway: string;
  preview: string;
  time: string;
  unread: boolean;
};

function AdvisorInbox() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [participants, setParticipants] = useState<ParticipantListItem[]>([]);
  const [advisors, setAdvisors] = useState<AdvisorRow[]>([]);
  const [contactInquiries, setContactInquiries] = useState<ContactInquiryRow[]>([]);
  const [bookings, setBookings] = useState<AppointmentRow[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryRow | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<AppointmentRow | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [search, setSearch] = useState("");
  const [activeLane, setActiveLane] = useState<"all" | "threads" | "contact" | "bookings">(
    "all"
  );

  useEffect(() => {
    const a = subscribeAllThreads(setMessages);
    const b = subscribeParticipants(setParticipants);
    const e = subscribeAdvisors(setAdvisors);
    const c = subscribeRecentContactInquiries(setContactInquiries, 8);
    const d = subscribeRecentAppointments(setBookings, 8);
    return () => {
      a();
      b();
      e();
      c();
      d();
    };
  }, []);

  const myAdvisorId = useMemo(() => {
    if (profile?.role !== "advisor") return null;
    if (!user?.uid) return null;
    return advisors.find((a) => a.userId === user.uid)?.id ?? null;
  }, [advisors, user?.uid, profile?.role]);

  const visibleParticipants = useMemo(() => {
    if (profile?.role !== "advisor") return participants;
    if (!myAdvisorId) return [];
    return participants.filter((p) => p.assignedAdvisorId === myAdvisorId);
  }, [participants, profile?.role, myAdvisorId]);

  const visibleParticipantIds = useMemo(
    () => new Set(visibleParticipants.map((p) => p.id)),
    [visibleParticipants]
  );

  const visibleMessages = useMemo(() => {
    if (profile?.role !== "advisor") return messages;
    return messages.filter((m) => visibleParticipantIds.has(m.participantId));
  }, [messages, profile?.role, visibleParticipantIds]);

  const visibleBookings = useMemo(() => {
    if (profile?.role !== "advisor") return bookings;
    return bookings.filter((b) => visibleParticipantIds.has(b.participantId));
  }, [bookings, profile?.role, visibleParticipantIds]);

  const threads = useMemo<Thread[]>(() => {
    const map = new Map<string, Thread>();
    const byId = new Map(visibleParticipants.map((p) => [p.id, p]));
    for (const m of visibleMessages) {
      const existing = map.get(m.participantId);
      const p = byId.get(m.participantId);
      const name = p
        ? `${p.firstName} ${p.lastName}`
        : m.senderRole === "participant"
        ? m.senderName
        : "Participant";
      const time = m.createdAtISO
        ? timeAgo(m.createdAtISO)
        : "Just now";
      const unread = !m.read && m.senderId !== user?.uid;
      if (!existing) {
        map.set(m.participantId, {
          participantId: m.participantId,
          participantName: name,
          pathway: p?.pathway ?? "—",
          preview: m.body,
          time,
          unread,
        });
      } else {
        existing.unread = existing.unread || unread;
      }
    }
    return Array.from(map.values());
  }, [visibleMessages, visibleParticipants, user]);

  const unreadCount = threads.filter((t) => t.unread).length;
  const term = search.trim().toLowerCase();
  const filteredThreads = useMemo(
    () =>
      threads.filter((t) =>
        [t.participantName, t.pathway, t.preview].join(" ").toLowerCase().includes(term)
      ),
    [threads, term]
  );
  const filteredContactInquiries = useMemo(
    () =>
      contactInquiries.filter((q) =>
        [q.name, q.email, q.role, q.message].join(" ").toLowerCase().includes(term)
      ),
    [contactInquiries, term]
  );
  const filteredBookings = useMemo(
    () =>
      visibleBookings.filter((b) =>
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
    [visibleBookings, term]
  );

  return (
    <PortalShell
      role="advisor"
      title="Inbox"
      subtitle="Direct participant threads plus fresh contact and booking submissions."
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <LaneButton
            label="All"
            count={filteredThreads.length + filteredContactInquiries.length + filteredBookings.length}
            active={activeLane === "all"}
            onClick={() => setActiveLane("all")}
          />
          <LaneButton
            label="Threads"
            count={filteredThreads.length}
            active={activeLane === "threads"}
            onClick={() => setActiveLane("threads")}
          />
          <LaneButton
            label="Contact"
            count={filteredContactInquiries.length}
            active={activeLane === "contact"}
            onClick={() => setActiveLane("contact")}
          />
          <LaneButton
            label="Bookings"
            count={filteredBookings.length}
            active={activeLane === "bookings"}
            onClick={() => setActiveLane("bookings")}
          />
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search threads, names, messages..."
          className="h-9 w-full max-w-sm rounded-md border border-line bg-white px-3 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </div>

      {(activeLane === "all" || activeLane === "contact" || activeLane === "bookings") && (
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Recent contact form submissions"
            description="Saved from /contact"
            action={<Badge tone="info">{filteredContactInquiries.length}</Badge>}
          />
          <CardBody className="grid gap-2 max-h-[360px] overflow-y-auto">
            {filteredContactInquiries.length === 0 ? (
              <p className="text-[13px] text-ink-muted">No inquiries yet.</p>
            ) : (
              filteredContactInquiries.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedInquiry(q)}
                  className="w-full rounded-md border border-line px-3 py-2.5 text-left hover:border-primary/30 hover:bg-canvas/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-ink">{q.name}</p>
                    <Badge tone="muted" size="sm">
                      {q.createdAtISO ? timeAgo(q.createdAtISO) : "Just now"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-subtle">{q.email}</p>
                  <p className="mt-1 text-[12px] text-ink-subtle">{q.role}</p>
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
            title="Recent advising call bookings"
            description="Submitted from /book"
            action={<Badge tone="primary">{filteredBookings.length}</Badge>}
          />
          <CardBody className="grid gap-2 max-h-[360px] overflow-y-auto">
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
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] font-medium text-ink">
                      {b.contactName || b.participantName || "Unknown participant"}
                    </p>
                    <Badge tone="warn" size="sm">
                      {b.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-subtle">
                    {b.scheduledDate} at {b.scheduledTime} {b.timezone}
                  </p>
                  <p className="mt-1 text-[12px] text-ink-subtle">
                    {b.contactEmail || "No email provided"}
                  </p>
                  <p className="mt-1.5 text-[12px] text-ink-muted">{b.appointmentType}</p>
                </button>
              ))
            )}
          </CardBody>
        </Card>
      </div>
      )}

      {(activeLane === "all" || activeLane === "threads") && (
      <Card className="overflow-hidden">
        <CardHeader
          title="Threads"
          description="Sorted by most recent"
          action={<Badge tone="warn">{unreadCount} unread</Badge>}
        />
        <CardBody className="p-0">
          {filteredThreads.length === 0 ? (
            <div className="p-6 text-[13px] text-ink-muted">
              No messages yet.
            </div>
          ) : (
            <ul className="divide-y divide-line max-h-[460px] overflow-y-auto">
              {filteredThreads.map((t) => (
                <li key={t.participantId}>
                  <button
                    type="button"
                    onClick={() => setSelectedThread(t)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-canvas/40 text-left"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white text-[12px] font-semibold">
                      {t.participantName
                        .split(/\s+/)
                        .map((s) => s[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[13px] font-medium text-ink">
                          {t.participantName}
                        </span>
                        <span className="text-[12px] text-ink-subtle">
                          {t.time}
                        </span>
                      </div>
                      <div className="text-[12px] text-ink-subtle">
                        {t.pathway}
                      </div>
                      <p className="mt-1 text-[12px] text-ink-muted line-clamp-1">
                        {t.preview}
                      </p>
                    </div>
                    {t.unread && (
                      <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
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
        open={!!selectedThread}
        onClose={() => setSelectedThread(null)}
        title="Participant thread details"
        subtitle="Conversation summary and participant context"
      >
        {selectedThread && (
          <div className="grid gap-4">
            <DetailGrid
              rows={[
                { label: "Participant name", value: selectedThread.participantName },
                { label: "Participant key", value: selectedThread.participantId },
                { label: "Pathway", value: selectedThread.pathway },
                { label: "Unread", value: selectedThread.unread ? "Yes" : "No" },
                { label: "Last activity", value: selectedThread.time },
                { label: "Latest message preview", value: selectedThread.preview },
              ]}
            />
            <div>
              <Link
                href={`/portal/advisor/participants/${selectedThread.participantId}`}
                className="inline-flex items-center rounded-md border border-line px-3 py-2 text-[13px] font-medium text-primary hover:bg-canvas"
              >
                Open full participant profile
              </Link>
            </div>
          </div>
        )}
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

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
