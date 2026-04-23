"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { ParticipantProfile } from "@/components/portal/ParticipantProfile";
import { LinkButton } from "@/components/ui/Button";
import { MessageSquare } from "@/components/icons";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  fetchParticipantById,
  type ParticipantListItem,
} from "@/lib/services/participants";

export default function AdminParticipantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <RoleGuard allow={["admin"]}>
      <AdminParticipantView id={id} />
    </RoleGuard>
  );
}

function AdminParticipantView({ id }: { id: string }) {
  const [participant, setParticipant] = useState<ParticipantListItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchParticipantById(id)
      .then((p) => {
        if (!cancelled) {
          setParticipant(p);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <PortalShell role="admin" title="Applicant">
        <div className="text-[13px] text-ink-muted">Loading applicant…</div>
      </PortalShell>
    );
  }

  if (!participant) {
    return (
      <PortalShell role="admin" title="Not found">
        <div className="text-[14px] text-ink-muted">
          We couldn&apos;t find this applicant.{" "}
          <Link href="/portal/admin/participants" className="text-primary">
            Back to list
          </Link>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell
      role="admin"
      title={`${participant.firstName} ${participant.lastName}`}
      subtitle={`${participant.pathway} · ${
        participant.city
          ? `${participant.city}, ${participant.state}`
          : "Location unknown"
      }`}
      actions={
        <>
          <Link
            href="/portal/admin/participants"
            className="text-[13px] font-medium text-ink-muted hover:text-ink inline-flex items-center gap-1"
          >
            ← All applicants
          </Link>
          <LinkButton
            href={`mailto:${participant.email}`}
            variant="secondary"
            size="sm"
          >
            <MessageSquare size={14} /> Email
          </LinkButton>
        </>
      }
    >
      <ParticipantProfile participant={participant} role="admin" />
    </PortalShell>
  );
}
