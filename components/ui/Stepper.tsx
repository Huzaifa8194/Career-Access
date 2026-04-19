import * as React from "react";
import { Check } from "@/components/icons";

export type Step = { label: string; description?: string };

export function Stepper({
  steps,
  current,
  className = "",
}: {
  steps: Step[];
  current: number;
  className?: string;
}) {
  return (
    <ol
      className={`flex flex-wrap items-center gap-y-2 text-sm ${className}`}
      aria-label="Progress"
    >
      {steps.map((step, i) => {
        const state =
          i < current ? "complete" : i === current ? "current" : "upcoming";
        return (
          <li key={step.label} className="flex items-center min-w-0">
            <span
              aria-current={state === "current" ? "step" : undefined}
              className={[
                "inline-flex items-center gap-2.5 px-2.5 py-1 rounded-md min-w-0",
                state === "current"
                  ? "bg-primary-50 text-primary"
                  : state === "complete"
                    ? "text-ink"
                    : "text-ink-subtle",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-semibold tabular",
                  state === "current"
                    ? "bg-primary text-white border-primary"
                    : state === "complete"
                      ? "bg-action text-white border-action"
                      : "bg-white border-line text-ink-subtle",
                ].join(" ")}
              >
                {state === "complete" ? <Check size={12} /> : i + 1}
              </span>
              <span className="font-medium truncate">{step.label}</span>
            </span>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="mx-2 h-px w-6 sm:w-10 bg-line"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
