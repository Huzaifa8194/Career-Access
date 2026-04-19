"use client";

import { useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Upload, FileText, Check } from "@/components/icons";
import { participantSummary } from "@/lib/data";

export default function DocumentsPage() {
  const [docs, setDocs] = useState(participantSummary.documents);

  function onFile(name: string, file: File | null) {
    if (!file) return;
    setDocs((d) =>
      d.map((doc) =>
        doc.name === name
          ? {
              ...doc,
              uploaded: "Just now",
              size: `${Math.round(file.size / 1024)} KB`,
              status: "In review",
            }
          : doc
      )
    );
  }

  return (
    <PortalShell
      role="participant"
      title="Documents"
      subtitle="Upload only what your advisor requests. We'll verify and follow up."
      actions={
        <Button variant="primary" size="sm">
          <Upload size={14} />
          Add a document
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader
            title="Your documents"
            description="Verified files are visible to your advisor only"
            action={
              <Badge tone="muted">
                {docs.filter((d) => d.status === "Verified").length} verified
              </Badge>
            }
          />
          <CardBody className="grid gap-2">
            {docs.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between gap-3 border border-line rounded-md p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-canvas text-ink-muted">
                    <FileText size={16} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium truncate">
                      {d.name}
                    </div>
                    <div className="text-[12px] text-ink-subtle">
                      {d.uploaded} · {d.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    tone={
                      d.status === "Verified"
                        ? "success"
                        : d.status === "Needed"
                          ? "warn"
                          : d.status === "In review"
                            ? "info"
                            : "muted"
                    }
                    dot
                  >
                    {d.status}
                  </Badge>
                  {d.status !== "Verified" && (
                    <label className="text-[13px] font-medium text-primary cursor-pointer">
                      Upload
                      <input
                        type="file"
                        className="sr-only"
                        onChange={(e) =>
                          onFile(d.name, e.target.files?.[0] ?? null)
                        }
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Why we ask"
            description="Documents move you forward — but only when an advisor needs them."
          />
          <CardBody className="grid gap-3 text-[14px] text-ink-muted leading-6">
            <p>
              We never request more than what's needed for your specific
              pathway. Common asks:
            </p>
            <ul className="grid gap-2.5">
              {[
                "Photo ID for FAFSA verification",
                "Most recent transcript",
                "Tax forms (FAFSA only)",
                "Résumé (apprenticeship and employer programs)",
              ].map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2.5 text-ink"
                >
                  <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-action-50 text-action">
                    <Check size={11} />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
            <p className="text-[13px] text-ink-subtle border-t border-line pt-3 mt-2">
              Files are stored securely. Only your assigned advisor can view
              them.
            </p>
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}
