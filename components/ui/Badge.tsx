import * as React from "react";

type Tone =
  | "neutral"
  | "info"
  | "success"
  | "warn"
  | "danger"
  | "primary"
  | "muted";

const tones: Record<Tone, string> = {
  neutral: "bg-canvas text-ink border-line",
  info: "bg-info-50 text-info border-info/15",
  success: "bg-success-50 text-action-700 border-success/15",
  warn: "bg-warn-50 text-[#92400E] border-warn/20",
  danger: "bg-danger-50 text-danger border-danger/15",
  primary: "bg-primary-50 text-primary border-primary/15",
  muted: "bg-canvas text-ink-subtle border-line",
};

export function Badge({
  tone = "neutral",
  children,
  dot,
  className = "",
  size = "md",
}: {
  tone?: Tone;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
  size?: "sm" | "md";
}) {
  const sz =
    size === "sm" ? "h-5 px-1.5 text-[11px]" : "h-6 px-2 text-[12px]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${sz} ${tones[tone]} ${className}`}
    >
      {dot && (
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
        />
      )}
      {children}
    </span>
  );
}
