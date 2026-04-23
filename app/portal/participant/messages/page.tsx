"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { RequireAuth } from "@/components/portal/RequireAuth";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { participantSummary } from "@/lib/data";
import {
  fetchMyMessages,
  sendParticipantMessage,
  type MessageRow,
} from "@/lib/services/messaging";
import { fetchMyParticipant } from "@/lib/services/participants";

type LocalMsg = {
  id: string;
  from: string;
  role: string;
  body: string;
  time: string;
  mine: boolean;
};

function formatTime(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const demoSeed: LocalMsg[] = [
  {
    id: "demo1",
    from: "Maya Robinson",
    role: "Your advisor",
    body:
      "Welcome aboard, Jordan. I pulled your transcript — let's review FAFSA on Tuesday at 10:30. I'll send a video link.",
    time: "Apr 14 · 9:42 AM",
    mine: false,
  },
  {
    id: "demo2",
    from: "You",
    role: "Me",
    body: "Sounds great. I'll bring my tax forms.",
    time: "Apr 14 · 10:11 AM",
    mine: true,
  },
  {
    id: "demo3",
    from: "Maya Robinson",
    role: "Your advisor",
    body: "Perfect — also please upload your photo ID before we meet.",
    time: "Apr 14 · 10:14 AM",
    mine: false,
  },
];

export default function MessagesPage() {
  return (
    <RequireAuth requiredRole="participant">
      <Inner />
    </RequireAuth>
  );
}

function Inner() {
  const [messages, setMessages] = useState<LocalMsg[]>(demoSeed);
  const [draft, setDraft] = useState("");
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ rows, live: msgsLive }, participant] = await Promise.all([
        fetchMyMessages(),
        fetchMyParticipant(),
      ]);
      if (cancelled) return;
      setLive(msgsLive);
      setParticipantId(participant?.id ?? null);
      if (msgsLive && rows.length > 0) {
        setMessages(
          rows.map((r: MessageRow) => ({
            id: r.id,
            from: r.sender?.fullName ?? r.senderRole,
            role: r.senderRole,
            body: r.message,
            time: formatTime(r.createdAt),
            mine: r.senderRole === "participant",
          }))
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function send() {
    if (!draft.trim()) return;
    if (!participantId) {
      setError("Complete your intake first — messages are tied to your case.");
      return;
    }
    const body = draft.trim();
    const local: LocalMsg = {
      id: `local_${Date.now()}`,
      from: "You",
      role: "participant",
      body,
      time: "Just now",
      mine: true,
    };
    setMessages((m) => [...m, local]);
    setDraft("");
    setSending(true);
    setError(null);
    try {
      await sendParticipantMessage({
        participantId,
        message: body,
        senderRole: "participant",
      });
    } catch (err) {
      console.error(err);
      setError("Message not delivered. We'll retry automatically.");
    } finally {
      setSending(false);
    }
  }

  return (
    <PortalShell
      role="participant"
      title="Messages"
      subtitle={
        live
          ? "Direct line to your advisor — replies within one business day."
          : "Direct line to your advisor — showing a sample thread until messaging is live."
      }
    >
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader title="Threads" />
          <CardBody className="grid gap-1.5">
            {participantSummary.messages.map((m, i) => (
              <button
                key={m.from}
                className={[
                  "text-left rounded-md border p-3 transition-colors",
                  i === 0
                    ? "border-primary bg-primary-50/40"
                    : "border-line hover:bg-canvas",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-ink">
                    {m.from}
                  </span>
                  {m.unread && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </div>
                <div className="text-[12px] text-ink-subtle">{m.role}</div>
                <p className="mt-2 text-[13px] text-ink-muted line-clamp-2">
                  {m.preview}
                </p>
                <div className="mt-2 text-[11px] text-ink-subtle">{m.time}</div>
              </button>
            ))}
          </CardBody>
        </Card>

        <Card className="flex flex-col min-h-[520px]">
          <CardHeader
            title="Maya Robinson"
            description="Your advisor · College + FAFSA"
            action={<Badge tone="success" dot>Active</Badge>}
          />
          <CardBody className="flex-1 grid content-end gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={[
                  "max-w-[80%] rounded-lg p-3 text-[14px] leading-6",
                  m.mine
                    ? "ml-auto bg-primary text-white border border-primary"
                    : "bg-white border border-line text-ink",
                ].join(" ")}
              >
                {!m.mine && (
                  <div className="text-[11px] uppercase tracking-wider text-ink-subtle mb-1">
                    {m.from}
                  </div>
                )}
                <div>{m.body}</div>
                <div
                  className={`mt-1.5 text-[11px] ${m.mine ? "text-white/70" : "text-ink-subtle"}`}
                >
                  {m.time}
                </div>
              </div>
            ))}
          </CardBody>
          <div className="border-t border-line p-4 grid gap-3">
            <Textarea
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message…"
            />
            {error ? (
              <p className="text-[12px] text-danger">{error}</p>
            ) : null}
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-ink-subtle">
                Replies typically within 1 business day
              </span>
              <Button onClick={send} disabled={!draft.trim() || sending}>
                {sending ? "Sending…" : "Send message"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}
