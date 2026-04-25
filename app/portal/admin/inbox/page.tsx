"use client";

import { useEffect, useState } from "react";
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
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryRow | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<AppointmentRow | null>(null);

  useEffect(() => {
    const a = subscribeRecentContactInquiries(setContactInquiries, 30);
    const b = subscribeRecentAppointments(setBookings, 30);
    return () => {
      a();
      b();
    };
  }, []);

  return (
    <PortalShell
      role="admin"
      title="Inbox & bookings"
      subtitle="Live queue from /contact and /book submissions."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Contact inquiries"
            description="Incoming messages from /contact"
            action={<Badge tone="info">{contactInquiries.length}</Badge>}
          />
          <CardBody className="grid gap-3">
            {contactInquiries.length === 0 ? (
              <p className="text-[13px] text-ink-muted">No inquiries yet.</p>
            ) : (
              contactInquiries.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedInquiry(q)}
                  className="w-full rounded-md border border-line p-3 text-left hover:border-primary/30 hover:bg-canvas/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[14px] font-medium text-ink">{q.name}</p>
                    <Badge tone="muted" size="sm">
                      {q.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-subtle">{q.email}</p>
                  <p className="mt-1 text-[12px] text-ink-subtle">{q.role}</p>
                  <p className="mt-2 text-[13px] text-ink-muted whitespace-pre-wrap">
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
            action={<Badge tone="primary">{bookings.length}</Badge>}
          />
          <CardBody className="grid gap-3">
            {bookings.length === 0 ? (
              <p className="text-[13px] text-ink-muted">No bookings yet.</p>
            ) : (
              bookings.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBooking(b)}
                  className="w-full rounded-md border border-line p-3 text-left hover:border-primary/30 hover:bg-canvas/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[14px] font-medium text-ink">
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
                  <p className="mt-2 text-[13px] text-ink-muted">{b.appointmentType}</p>
                </button>
              ))
            )}
          </CardBody>
        </Card>
      </div>

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
    </PortalShell>
  );
}
