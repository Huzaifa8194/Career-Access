"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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
                <div key={q.id} className="rounded-md border border-line p-3">
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
                </div>
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
                <div key={b.id} className="rounded-md border border-line p-3">
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
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}
