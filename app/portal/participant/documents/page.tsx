"use client";

import { useEffect, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { RequireAuth } from "@/components/portal/RequireAuth";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Upload, FileText, Check } from "@/components/icons";
import { participantSummary } from "@/lib/data";
import {
  fetchMyDocuments,
  uploadParticipantDocument,
  type DocumentRow,
} from "@/lib/services/documents";
import { fetchMyParticipant } from "@/lib/services/participants";

type LocalDoc = {
  id: string;
  name: string;
  uploaded: string;
  size: string;
  status: "Verified" | "Needed" | "In review";
};

function formatSize(bytes?: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeStatus(status: string): LocalDoc["status"] {
  const s = status.toLowerCase();
  if (s.includes("verified")) return "Verified";
  if (s.includes("need")) return "Needed";
  return "In review";
}

export default function DocumentsPage() {
  return (
    <RequireAuth requiredRole="participant">
      <Inner />
    </RequireAuth>
  );
}

function Inner() {
  const [docs, setDocs] = useState<LocalDoc[]>([]);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [participant, { rows, live: docsLive }] = await Promise.all([
        fetchMyParticipant(),
        fetchMyDocuments(),
      ]);
      if (cancelled) return;
      setParticipantId(participant?.id ?? null);
      setLive(docsLive);
      if (docsLive && rows.length > 0) {
        setDocs(
          rows.map((r: DocumentRow) => ({
            id: r.id,
            name: r.fileName,
            uploaded: r.createdAt
              ? new Date(r.createdAt).toLocaleDateString()
              : "—",
            size: formatSize(r.sizeBytes ?? undefined),
            status: normalizeStatus(r.status ?? ""),
          }))
        );
      } else {
        setDocs(
          participantSummary.documents.map((d, i) => ({
            id: `demo_${i}`,
            name: d.name,
            uploaded: d.uploaded,
            size: d.size,
            status: normalizeStatus(d.status ?? ""),
          }))
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAdd(file: File | null, replaceId?: string) {
    if (!file) return;
    setError(null);
    if (!participantId) {
      setError(
        "We couldn't find your application. Please complete intake first."
      );
      return;
    }
    setUploading(true);
    try {
      const { id, stored } = await uploadParticipantDocument({
        file,
        participantId,
        status: "in-review",
      });
      const entry: LocalDoc = {
        id: id ?? `local_${Date.now()}`,
        name: stored.fileName,
        uploaded: "Just now",
        size: formatSize(stored.sizeBytes),
        status: "In review",
      };
      setDocs((prev) => {
        if (replaceId) {
          return prev.map((d) => (d.id === replaceId ? entry : d));
        }
        return [entry, ...prev];
      });
    } catch (err) {
      console.error(err);
      setError("Upload failed. Check the file size and type, then try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <PortalShell
      role="participant"
      title="Documents"
      subtitle={
        live
          ? "Upload only what your advisor requests. We'll verify and follow up."
          : "Upload only what your advisor requests. Showing sample documents until your account is live."
      }
      actions={
        <label
          className={[
            "inline-flex items-center justify-center gap-2 h-9 px-3 text-sm rounded-md font-medium cursor-pointer",
            "bg-primary text-white hover:bg-primary-700",
            uploading ? "opacity-60 pointer-events-none" : "",
          ].join(" ")}
        >
          <Upload size={14} />
          {uploading ? "Uploading…" : "Add a document"}
          <input
            type="file"
            className="sr-only"
            accept="application/pdf,image/*"
            onChange={(e) => handleAdd(e.target.files?.[0] ?? null)}
          />
        </label>
      }
    >
      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-md border border-danger/30 bg-danger-50 px-3 py-2 text-[13px] text-[#991B1B]"
        >
          {error}
        </p>
      ) : null}

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
                key={d.id}
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
                        : "info"
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
                        accept="application/pdf,image/*"
                        onChange={(e) =>
                          handleAdd(e.target.files?.[0] ?? null, d.id)
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
              We never request more than what&apos;s needed for your specific
              pathway. Common asks:
            </p>
            <ul className="grid gap-2.5">
              {[
                "Photo ID for FAFSA verification",
                "Most recent transcript",
                "Tax forms (FAFSA only)",
                "Résumé (apprenticeship and employer programs)",
              ].map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-ink">
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
