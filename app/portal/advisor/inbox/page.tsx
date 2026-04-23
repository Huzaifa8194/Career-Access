"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  subscribeAllThreads,
  type MessageRow,
} from "@/lib/services/messages";
import {
  subscribeParticipants,
  type ParticipantListItem,
} from "@/lib/services/participants";
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
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [participants, setParticipants] = useState<ParticipantListItem[]>([]);

  useEffect(() => {
    const a = subscribeAllThreads(setMessages);
    const b = subscribeParticipants(setParticipants);
    return () => {
      a();
      b();
    };
  }, []);

  const threads = useMemo<Thread[]>(() => {
    const map = new Map<string, Thread>();
    const byId = new Map(participants.map((p) => [p.id, p]));
    for (const m of messages) {
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
  }, [messages, participants, user]);

  const unreadCount = threads.filter((t) => t.unread).length;

  return (
    <PortalShell
      role="advisor"
      title="Inbox"
      subtitle="Direct messages from your active participants."
    >
      <Card className="overflow-hidden">
        <CardHeader
          title="Threads"
          description="Sorted by most recent"
          action={<Badge tone="warn">{unreadCount} unread</Badge>}
        />
        <CardBody className="p-0">
          {threads.length === 0 ? (
            <div className="p-6 text-[13px] text-ink-muted">
              No messages yet.
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {threads.map((t) => (
                <li key={t.participantId}>
                  <Link
                    href={`/portal/advisor/participants/${t.participantId}`}
                    className="flex items-start gap-4 p-5 hover:bg-canvas/40"
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
                        <span className="text-[14px] font-medium text-ink">
                          {t.participantName}
                        </span>
                        <span className="text-[12px] text-ink-subtle">
                          {t.time}
                        </span>
                      </div>
                      <div className="text-[12px] text-ink-subtle">
                        {t.pathway}
                      </div>
                      <p className="mt-1 text-[14px] text-ink-muted line-clamp-1">
                        {t.preview}
                      </p>
                    </div>
                    {t.unread && (
                      <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </PortalShell>
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
