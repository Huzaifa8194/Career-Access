"use client";

import { useEffect } from "react";

export function DetailModal({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-[121] w-full max-w-3xl overflow-hidden rounded-xl border border-line bg-white shadow-[var(--shadow-elevated)]">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-[18px] font-semibold tracking-tight text-ink">{title}</h3>
            {subtitle && <p className="mt-1 text-[13px] text-ink-muted">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-[18px] text-ink-muted hover:text-ink"
            aria-label="Close details"
          >
            ×
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

export function DetailGrid({
  rows,
}: {
  rows: Array<{ label: string; value: React.ReactNode }>;
}) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.label} className="rounded-md border border-line bg-canvas/40 p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            {r.label}
          </dt>
          <dd className="mt-1 text-[14px] text-ink break-words">{r.value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
