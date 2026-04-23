"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/lib/firebase/auth";
import { useParticipantContext } from "@/lib/hooks/useParticipantContext";
import {
  sendMessage,
  subscribeThread,
  type MessageRow,
} from "@/lib/services/messages";

export default function MessagesPage() {
  return (
    <RoleGuard allow={["participant"]}>
      <Messages />
    </RoleGuard>
  );
}

function Messages() {
  const { user, profile } = useAuth();
  const { participant, participantId } = useParticipantContext();
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!participantId) return;
    const unsub = subscribeThread(participantId, setMessages);
    return () => unsub();
  }, [participantId]);

  async function send() {
    if (!draft.trim() || !user || !participantId) return;
    setSending(true);
    try {
      await sendMessage({
        participantId,
        senderId: user.uid,
        senderName: profile?.fullName || user.email || "Participant",
        senderRole: profile?.role ?? "participant",
        body: draft.trim(),
      });
      setDraft("");
    } finally {
      setSending(false);
    }
  }

  const advisorName = participant?.assignedAdvisorName ?? "Your advisor";

  return (
    <PortalShell
      role="participant"
      title="Messages"
      subtitle="Direct line to your advisor — replies within one business day."
    >
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader title="Threads" />
          <CardBody className="grid gap-1.5">
            <div className="text-left rounded-md border border-primary bg-primary-50/40 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-ink">
                  {advisorName}
                </span>
                {messages.some(
                  (m) => !m.read && m.senderId !== user?.uid
                ) && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </div>
              <div className="text-[12px] text-ink-subtle">Advisor</div>
              <p className="mt-2 text-[13px] text-ink-muted line-clamp-2">
                {messages[messages.length - 1]?.body ??
                  "Start the conversation."}
              </p>
              <div className="mt-2 text-[11px] text-ink-subtle">
                {messages.length} messages
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="flex flex-col min-h-[520px]">
          <CardHeader
            title={advisorName}
            description={
              participant?.pathway
                ? `${participant.pathway}`
                : "Your advising thread"
            }
            action={
              <Badge tone="success" dot>
                Active
              </Badge>
            }
          />
          <CardBody className="flex-1 grid content-end gap-3">
            {messages.length === 0 && (
              <div className="text-center text-[13px] text-ink-muted py-8">
                No messages yet. Send the first one below.
              </div>
            )}
            {messages.map((m) => {
              const mine = m.senderId === user?.uid;
              const time = m.createdAtISO
                ? new Date(m.createdAtISO).toLocaleString()
                : "Just now";
              return (
                <div
                  key={m.id}
                  className={[
                    "max-w-[80%] rounded-lg p-3 text-[14px] leading-6",
                    mine
                      ? "ml-auto bg-primary text-white border border-primary"
                      : "bg-white border border-line text-ink",
                  ].join(" ")}
                >
                  {!mine && (
                    <div className="text-[11px] uppercase tracking-wider text-ink-subtle mb-1">
                      {m.senderName}
                    </div>
                  )}
                  <div>{m.body}</div>
                  <div
                    className={`mt-1.5 text-[11px] ${
                      mine ? "text-white/70" : "text-ink-subtle"
                    }`}
                  >
                    {time}
                  </div>
                </div>
              );
            })}
          </CardBody>
          <div className="border-t border-line p-4 grid gap-3">
            <Textarea
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message…"
            />
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-ink-subtle">
                Replies typically within 1 business day
              </span>
              <Button
                onClick={send}
                disabled={!draft.trim() || sending || !participantId}
              >
                {sending ? "Sending…" : "Send message"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}
