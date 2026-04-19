"use client";

import { useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { participantSummary } from "@/lib/data";

type Msg = {
  from: string;
  role: string;
  body: string;
  time: string;
  mine?: boolean;
};

const seed: Msg[] = [
  {
    from: "Maya Robinson",
    role: "Your advisor",
    body: "Welcome aboard, Jordan. I pulled your transcript — let's review FAFSA on Tuesday at 10:30. I'll send a video link.",
    time: "Apr 14 · 9:42 AM",
  },
  {
    from: "Jordan Hayes",
    role: "Me",
    body: "Sounds great. I'll bring my tax forms.",
    time: "Apr 14 · 10:11 AM",
    mine: true,
  },
  {
    from: "Maya Robinson",
    role: "Your advisor",
    body: "Perfect — also please upload your photo ID before we meet.",
    time: "Apr 14 · 10:14 AM",
  },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [draft, setDraft] = useState("");

  function send() {
    if (!draft.trim()) return;
    setMessages((m) => [
      ...m,
      {
        from: "Jordan Hayes",
        role: "Me",
        body: draft.trim(),
        time: "Just now",
        mine: true,
      },
    ]);
    setDraft("");
  }

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
                <div className="mt-2 text-[11px] text-ink-subtle">
                  {m.time}
                </div>
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
            {messages.map((m, i) => (
              <div
                key={i}
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
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-ink-subtle">
                Replies typically within 1 business day
              </span>
              <Button onClick={send} disabled={!draft.trim()}>
                Send message
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}
