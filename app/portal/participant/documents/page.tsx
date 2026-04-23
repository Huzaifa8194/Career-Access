"use client";

import { useEffect, useRef, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Upload, FileText, Check } from "@/components/icons";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useParticipantContext } from "@/lib/hooks/useParticipantContext";
import {
  subscribeDocumentsForParticipant,
  uploadParticipantDocument,
  deleteDocument,
  type DocumentRow,
} from "@/lib/services/documents";
import { useAuth } from "@/lib/firebase/auth";

export default function DocumentsPage() {
  return (
    <RoleGuard allow={["participant"]}>
      <Documents />
    </RoleGuard>
  );
}

function Documents() {
  const { user } = useAuth();
  const { participantId, loading } = useParticipantContext();
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!participantId) return;
    const unsub = subscribeDocumentsForParticipant(participantId, setDocs);
    return () => unsub();
  }, [participantId]);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !participantId || !user) return;
    setUploading(true);
    setError(null);
    try {
      await uploadParticipantDocument(participantId, file, user.uid);
    } catch (err) {
      setError(
        (err as Error)?.message ??
          "Upload failed. Try again or contact your advisor."
      );
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(row: DocumentRow) {
    if (!confirm(`Remove ${row.fileName}?`)) return;
    try {
      await deleteDocument(row.id, row.storagePath);
    } catch (err) {
      setError((err as Error)?.message ?? "Could not remove file.");
    }
  }

  return (
    <PortalShell
      role="participant"
      title="Documents"
      subtitle="Upload only what your advisor requests. We'll verify and follow up."
      actions={
        <>
          <input
            ref={fileInput}
            type="file"
            className="sr-only"
            onChange={onFileChange}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInput.current?.click()}
            disabled={uploading || !participantId}
          >
            <Upload size={14} />
            {uploading ? "Uploading…" : "Add a document"}
          </Button>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader
            title="Your documents"
            description="Files stored securely in Firebase Storage"
            action={
              <Badge tone="muted">
                {docs.filter((d) => d.status === "verified").length} verified
              </Badge>
            }
          />
          <CardBody className="grid gap-2">
            {loading && (
              <div className="text-[13px] text-ink-muted">Loading…</div>
            )}
            {!loading && !participantId && (
              <div className="text-[13px] text-ink-muted">
                Complete your application to start uploading documents.
              </div>
            )}
            {!loading && participantId && docs.length === 0 && (
              <div className="text-[13px] text-ink-muted py-3">
                No documents yet. Add one with the button above.
              </div>
            )}
            {error && (
              <div className="rounded-md border border-danger/30 bg-danger-50 p-3 text-[13px] text-danger">
                {error}
              </div>
            )}
            {docs.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between gap-3 border border-line rounded-md p-3"
              >
                <a
                  href={d.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 min-w-0 group"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-canvas text-ink-muted">
                    <FileText size={16} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium truncate group-hover:text-primary">
                      {d.fileName}
                    </div>
                    <div className="text-[12px] text-ink-subtle">
                      {formatSize(d.size)} ·{" "}
                      {d.createdAtISO
                        ? new Date(d.createdAtISO).toLocaleDateString()
                        : "—"}
                    </div>
                  </div>
                </a>
                <div className="flex items-center gap-3">
                  <Badge
                    tone={
                      d.status === "verified"
                        ? "success"
                        : d.status === "needed" || d.status === "rejected"
                        ? "warn"
                        : "info"
                    }
                    dot
                  >
                    {d.status}
                  </Badge>
                  <button
                    onClick={() => onDelete(d)}
                    className="text-[13px] font-medium text-ink-muted hover:text-danger"
                  >
                    Remove
                  </button>
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
              Files are stored securely. Only your assigned advisor and admin
              can view them.
            </p>
          </CardBody>
        </Card>
      </div>
    </PortalShell>
  );
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let s = bytes;
  let i = 0;
  while (s >= 1024 && i < units.length - 1) {
    s /= 1024;
    i++;
  }
  return `${s.toFixed(s < 10 ? 1 : 0)} ${units[i]}`;
}
