"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { RequireAuth } from "@/components/portal/RequireAuth";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { fetchAllParticipants, type PortalParticipant } from "@/lib/services/participants";
import { fetchMyMessages, type MessageRow } from "@/lib/services/messaging";

type Thread = {
  key: string;
  from: string;
  pathway: string;
  preview: string;
  time: string;
  unread: boolean;
  participantId?: string;
};

const demoThreads: Thread[] = [
  {
    key: "jh",
    from: "Jordan Hayes",
    pathway: "College + FAFSA",
    preview: "Sounds great. I'll bring my tax forms — anything else I should prep?",
    time: "1h ago",
    unread: true,
  },
  {
    key: "ac",
    from: "Aaliyah Carter",
    pathway: "Short-term training",
    preview: "Confirming Tuesday at 2pm. I've already filed for childcare aid.",
    time: "3h ago",
    unread: true,
  },
  {
    key: "ta",
    from: "Tomás Alvarez",
    pathway: "Apprenticeship",
    preview: "Hi Maya — quick question on the union math test, do you have…",
    time: "Yesterday",
    unread: false,
  },
  {
    key: "rb",
    from: "Renée Brooks",
    pathway: "Enrolled",
    preview: "First class went well! Thanks for the prep last week.",
    time: "2d ago",
    unread: false,
  },
];

function humanize(iso: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AdvisorInboxPage() {
  return (
    <RequireAuth requiredRole="advisor">
      <Inner />
    </RequireAuth>
  );
}

function Inner() {
  const [threads, setThreads] = useState<Thread[]>(demoThreads);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ rows: msgs, live }, participants] = await Promise.all([
        fetchMyMessages(),
        fetchAllParticipants(),
      ]);
      if (cancelled) return;
      if (!live || msgs.length === 0) return;

      const byParticipant = new Map<string, { latest: MessageRow; unread: number }>();
      for (const m of msgs) {
        const key = (m as MessageRow & { participantId?: string }).participantId ?? m.sender?.id ?? m.id;
        const entry = byParticipant.get(key);
        if (!entry || new Date(m.createdAt).getTime() > new Date(entry.latest.createdAt).getTime()) {
          byParticipant.set(key, {
            latest: m,
            unread: (entry?.unread ?? 0) + (m.read ? 0 : 1),
          });
        } else {
          entry.unread += m.read ? 0 : 1;
        }
      }

      const built: Thread[] = [];
      for (const [pid, { latest, unread }] of byParticipant) {
        const p: PortalParticipant | undefined = participants.find((x) => x.id === pid);
        built.push({
          key: pid,
          from: p ? `${p.firstName} ${p.lastName}` : latest.sender?.fullName ?? "Participant",
          pathway: p?.pathway ?? "Pathway pending",
          preview: latest.message,
          time: humanize(latest.createdAt),
          unread: unread > 0,
          participantId: pid,
        });
      }
      built.sort((a, b) => (a.unread === b.unread ? 0 : a.unread ? -1 : 1));
      setThreads(built);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
          action={
            <Badge tone="warn">
              {threads.filter((t) => t.unread).length} unread
            </Badge>
          }
        />
        <CardBody className="p-0">
          <ul className="divide-y divide-line">
            {threads.map((t) => {
              const content = (
                <>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white text-[12px] font-semibold">
                    {t.from
                      .split(" ")
                      .map((s) => s[0])
                      .join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[14px] font-medium text-ink">
                        {t.from}
                      </span>
                      <span className="text-[12px] text-ink-subtle">{t.time}</span>
                    </div>
                    <div className="text-[12px] text-ink-subtle">{t.pathway}</div>
                    <p className="mt-1 text-[14px] text-ink-muted line-clamp-1">
                      {t.preview}
                    </p>
                  </div>
                  {t.unread && (
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                </>
              );
              return (
                <li key={t.key} className="hover:bg-canvas/40">
                  {t.participantId ? (
                    <Link
                      href={`/portal/advisor/participants/${t.participantId}`}
                      className="flex items-start gap-4 p-5"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-4 p-5 cursor-pointer">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </CardBody>
      </Card>
    </PortalShell>
  );
}
