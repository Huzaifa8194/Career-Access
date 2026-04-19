import Link from "next/link";
import { notFound } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { ParticipantProfile } from "@/components/portal/ParticipantProfile";
import { participants } from "@/lib/data";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight, MessageSquare } from "@/components/icons";

export default async function AdminParticipantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const participant = participants.find((p) => p.id === id);
  if (!participant) notFound();

  return (
    <PortalShell
      role="admin"
      title={`${participant.firstName} ${participant.lastName}`}
      subtitle={`${participant.pathway} · ${participant.city}, ${participant.state}`}
      actions={
        <>
          <Link
            href="/portal/admin/participants"
            className="text-[13px] font-medium text-ink-muted hover:text-ink inline-flex items-center gap-1"
          >
            ← All applicants
          </Link>
          <LinkButton href="#" variant="secondary" size="sm">
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
