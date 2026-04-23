"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { RequireAuth } from "@/components/portal/RequireAuth";
import { ParticipantProfile } from "@/components/portal/ParticipantProfile";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight, MessageSquare } from "@/components/icons";
import {
  fetchParticipant,
  type PortalParticipant,
} from "@/lib/services/participants";

export default function AdminParticipantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <RequireAuth requiredRole="admin">
      <ParticipantDetail id={id} />
    </RequireAuth>
  );
}

function ParticipantDetail({ id }: { id: string }) {
  const [participant, setParticipant] = useState<PortalParticipant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await fetchParticipant(id);
        if (!cancelled) setParticipant(p);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <PortalShell role="admin" title="Loading…" subtitle="Fetching participant">
        <div className="h-40 grid place-items-center text-[13px] text-ink-muted">
          Loading participant…
        </div>
      </PortalShell>
    );
  }

  if (!participant) {
    return (
      <PortalShell role="admin" title="Not found" subtitle="No participant matched that ID">
        <div className="h-40 grid place-items-center text-[13px] text-ink-muted">
          We couldn&apos;t find that participant.
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell
      role="admin"
      title={`${participant.firstName} ${participant.lastName}`}
      subtitle={`${participant.pathway} · ${participant.city || "—"}, ${participant.state || ""}`}
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
            <MessageSquare size={14} /> Message
          </LinkButton>
          <LinkButton href="#" variant="primary" size="sm">
            Assign advisor <ArrowRight size={14} />
          </LinkButton>
        </>
      }
    >
      <ParticipantProfile participant={participant} role="admin" />
    </PortalShell>
  );
}
