"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Check, Clock } from "@/components/icons";
import { useAuth } from "@/lib/firebase/auth";
import { useParticipantContext } from "@/lib/hooks/useParticipantContext";

const publicSteps = [
  {
    label: "Apply online",
    detail: "Tell us your goals in about 7 minutes.",
    done: true,
  },
  {
    label: "Advisor review",
    detail: "An advisor reaches out in 2-3 business days.",
    done: false,
  },
  {
    label: "Track progress in portal",
    detail: "See tasks, documents, and messages in one place.",
    done: false,
  },
];

export function PortalPreviewCard() {
  const { user, loading: authLoading } = useAuth();
  const { participant, loading: participantLoading } = useParticipantContext();
  const loading = authLoading || participantLoading;

  const firstName =
    participant?.firstName ||
    (user?.displayName ? user.displayName.split(" ")[0] : "there");
  const pathway = participant?.pathway ?? "College + FAFSA";
  const advisorName = participant?.assignedAdvisorName ?? "Your advisor";

  return (
    <Card className="relative p-5 sm:p-6 max-md:rounded-2xl max-md:border-primary/10 max-md:shadow-[var(--shadow-elevated)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-ink-subtle">
            Your pathway, in one place
          </p>
          <h3 className="mt-1 text-[18px] font-semibold tracking-tight">
            Career Access Hub portal
          </h3>
        </div>
        <Badge tone="primary" dot>
          Live
        </Badge>
      </div>

      {loading ? (
        <div className="mt-5 rounded-md border border-line p-4 bg-canvas/60 text-[13px] text-ink-muted">
          Loading your portal preview...
        </div>
      ) : user ? (
        <>
          <div className="mt-5 rounded-md border border-line p-4 bg-canvas/60">
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-ink-subtle uppercase tracking-wider">
                {participant ? "Your pathway" : "Account status"}
              </p>
              <Badge tone={participant ? "primary" : "warn"}>
                {participant ? pathway : "Application needed"}
              </Badge>
            </div>
            <p className="mt-1.5 font-semibold text-[15px]">
              {participant
                ? `Hi ${firstName} — your portal is active`
                : "You're signed in. Start your application to unlock tracking."}
            </p>
          </div>

          <ul className="mt-4 flex flex-col gap-2.5">
            {(participant
              ? [
                  { label: "Portal account connected", done: true },
                  { label: "Application on file", done: true },
                  { label: "Advisor thread available", done: true },
                  { label: "Track tasks and documents", done: false },
                ]
              : publicSteps
            ).map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-[14px]">
                <span
                  className={[
                    "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                    item.done
                      ? "bg-action border-action text-white"
                      : "bg-white border-line text-ink-subtle",
                  ].join(" ")}
                >
                  {item.done ? (
                    <Check size={12} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span className={item.done ? "text-ink-subtle line-through" : "text-ink"}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <div className="text-[12px] leading-tight">
              <div className="font-medium text-ink">{advisorName}</div>
              <div className="text-ink-subtle">
                {participant ? "Advisor support available" : "Assigned after intake"}
              </div>
            </div>
            <Link
              href={participant ? "/portal/participant" : "/apply"}
              className="text-[13px] font-medium text-primary inline-flex items-center gap-1"
            >
              {participant ? "Open portal" : "Start application"} <ArrowRight size={14} />
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="mt-5 rounded-md border border-line p-4 bg-canvas/60">
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-ink-subtle uppercase tracking-wider">
                Process preview
              </p>
              <Badge tone="primary">No sign-in required</Badge>
            </div>
            <p className="mt-1.5 font-semibold text-[15px]">
              Understand exactly what happens before you create an account.
            </p>
            <p className="mt-1 text-[13px] text-ink-muted inline-flex items-center gap-1.5">
              <Clock size={13} />
              Apply in 7 minutes, advisor outreach in 2-3 business days.
            </p>
          </div>

          <ul className="mt-4 flex flex-col gap-2.5">
            {publicSteps.map((item) => (
              <li key={item.label} className="flex items-start gap-3 text-[14px]">
                <span
                  className={[
                    "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border",
                    item.done
                      ? "bg-action border-action text-white"
                      : "bg-white border-line text-ink-subtle",
                  ].join(" ")}
                >
                  {item.done ? (
                    <Check size={12} />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span>
                  <span className="block text-ink">{item.label}</span>
                  <span className="block text-[12px] text-ink-subtle">{item.detail}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <div className="text-[12px] text-ink-subtle">Already applied? Sign in anytime.</div>
            <Link
              href="/portal"
              className="text-[13px] font-medium text-primary inline-flex items-center gap-1"
            >
              Open portal <ArrowRight size={14} />
            </Link>
          </div>
        </>
      )}
    </Card>
  );
}
