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
import { subscribeAdvisors, type AdvisorRow } from "@/lib/services/advisors";
import { useAuth } from "@/lib/firebase/auth";

export default function AdvisorParticipantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <RoleGuard allow={["advisor", "admin"]}>
      <AdvisorParticipantView id={id} />
    </RoleGuard>
  );
}

function AdvisorParticipantView({ id }: { id: string }) {
  const { user, profile } = useAuth();
  const [participant, setParticipant] = useState<ParticipantListItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [advisors, setAdvisors] = useState<AdvisorRow[]>([]);

  useEffect(() => subscribeAdvisors(setAdvisors), []);

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

  const myAdvisorIds =
    profile?.role === "advisor" && user?.uid
      ? new Set([
          ...advisors.filter((a) => a.userId === user.uid).map((a) => a.id),
          user.uid,
        ])
      : new Set<string>();

  if (loading) {
    return (
      <PortalShell role="advisor" title="Participant">
        <div className="text-[13px] text-ink-muted">Loading participant…</div>
      </PortalShell>
    );
  }

  if (!participant) {
    return (
      <PortalShell role="advisor" title="Not found">
        <div className="text-[14px] text-ink-muted">
          We couldn&apos;t find this participant.{" "}
          <Link href="/portal/advisor/participants" className="text-primary">
            Back to list
          </Link>
        </div>
      </PortalShell>
    );
  }

  if (
    profile?.role === "advisor" &&
    (!participant.assignedAdvisorId ||
      !myAdvisorIds.has(participant.assignedAdvisorId))
  ) {
    return (
      <PortalShell role="advisor" title="Access restricted">
        <div className="text-[14px] text-ink-muted">
          This participant is not assigned to you.{" "}
          <Link href="/portal/advisor/participants" className="text-primary">
            Back to your list
          </Link>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell
      role="advisor"
      title={`${participant.firstName} ${participant.lastName}`}
      subtitle={`${participant.pathway} · ${
        participant.city
          ? `${participant.city}, ${participant.state}`
          : "Location unknown"
      }`}
      actions={
        <>
          <Link
            href="/portal/advisor/participants"
            className="text-[13px] font-medium text-ink-muted hover:text-ink inline-flex items-center gap-1"
          >
            ← All participants
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
      <ParticipantProfile participant={participant} role="advisor" />
    </PortalShell>
  );
}
