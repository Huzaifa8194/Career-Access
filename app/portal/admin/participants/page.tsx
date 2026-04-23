"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, ArrowRight } from "@/components/icons";
import { LinkButton } from "@/components/ui/Button";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  subscribeParticipants,
  type ParticipantListItem,
} from "@/lib/services/participants";
import type { ParticipantStatus } from "@/lib/firebase/types";

const statusTone: Record<
  ParticipantStatus,
  "info" | "primary" | "success" | "warn" | "muted"
> = {
  New: "info",
  Screened: "muted",
  "Intake complete": "primary",
  Advising: "warn",
  Enrolled: "success",
  Inactive: "muted",
};

type TabKey = "All" | "Unassigned" | "At risk" | "Enrolled";

const PAGE_SIZE = 25;

export default function AdminParticipantsPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <AdminParticipants />
    </RoleGuard>
  );
}

function AdminParticipants() {
  const [rows, setRows] = useState<ParticipantListItem[]>([]);
  const [tab, setTab] = useState<TabKey>("All");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParticipantStatus | "">("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    return subscribeParticipants(setRows);
  }, []);

  const tabCounts = useMemo(
    () => ({
      All: rows.length,
      Unassigned: rows.filter((p) => !p.assignedAdvisorId).length,
      "At risk": rows.filter((p) => p.risk !== "ok").length,
      Enrolled: rows.filter((p) => p.status === "Enrolled").length,
    }),
    [rows]
  );

  const filtered = useMemo(() => {
    let arr = rows;
    if (tab === "Unassigned") {
      arr = arr.filter((p) => !p.assignedAdvisorId);
    } else if (tab === "At risk") {
      arr = arr.filter((p) => p.risk !== "ok");
    } else if (tab === "Enrolled") {
      arr = arr.filter((p) => p.status === "Enrolled");
    }
    if (statusFilter) arr = arr.filter((p) => p.status === statusFilter);
    if (sourceFilter) arr = arr.filter((p) => p.source === sourceFilter);
    const term = q.trim().toLowerCase();
    if (term) {
      arr = arr.filter((p) =>
        [
          p.firstName,
          p.lastName,
          p.email,
          p.zip,
          p.pathway,
          p.assignedAdvisorName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    }
    return arr;
  }, [rows, tab, statusFilter, sourceFilter, q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(
    clampedPage * PAGE_SIZE,
    clampedPage * PAGE_SIZE + PAGE_SIZE
  );

  function exportCsv() {
    const header = [
      "id",
      "first",
      "last",
      "email",
      "phone",
      "city",
      "state",
      "zip",
      "pathway",
      "status",
      "source",
      "advisor",
      "submittedAt",
    ];
    const lines = [header.join(",")];
    for (const r of filtered) {
      lines.push(
        [
          r.id,
          r.firstName,
          r.lastName,
          r.email,
          r.phone,
          r.city,
          r.state,
          r.zip,
          r.pathway,
          r.status,
          r.source,
          r.assignedAdvisorName ?? "",
          r.submittedAtISO ?? "",
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applicants.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PortalShell
      role="admin"
      title="Applicants"
      subtitle="All applicants in the system. Assign, update, and route from here."
      actions={
        <>
          <button
            onClick={exportCsv}
            className="h-9 rounded-md border border-line bg-white px-3 text-[13px] font-medium text-ink-muted hover:text-ink"
          >
            Export CSV
          </button>
          <LinkButton href="/refer" variant="primary" size="sm">
            New referral
          </LinkButton>
        </>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(tabCounts) as TabKey[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setTab(f);
                setPage(0);
              }}
              className={[
                "h-8 rounded-md px-3 text-[13px] font-medium border inline-flex items-center gap-2 transition-colors",
                f === tab
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-ink-muted border-line hover:text-ink",
              ].join(" ")}
            >
              {f}
              <span
                className={[
                  "rounded-md px-1.5 text-[11px]",
                  f === tab
                    ? "bg-white/20 text-white"
                    : "bg-canvas text-ink-subtle",
                ].join(" ")}
              >
                {tabCounts[f]}
              </span>
            </button>
          ))}

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ParticipantStatus | "");
              setPage(0);
            }}
            className="h-8 rounded-md border border-line bg-white px-2 text-[13px]"
          >
            <option value="">All statuses</option>
            <option>New</option>
            <option>Screened</option>
            <option>Intake complete</option>
            <option>Advising</option>
            <option>Enrolled</option>
            <option>Inactive</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setPage(0);
            }}
            className="h-8 rounded-md border border-line bg-white px-2 text-[13px]"
          >
            <option value="">All sources</option>
            <option>Direct</option>
            <option>Referral</option>
            <option>Partner</option>
            <option>Event</option>
          </select>
        </div>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Search name, email, ZIP…"
            className="h-9 w-72 rounded-md border border-line bg-white pl-9 pr-3 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-canvas/60 border-b border-line text-[12px] uppercase tracking-wider text-ink-subtle">
              <tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Pathway</Th>
                <Th>Source</Th>
                <Th>Date Submitted</Th>
                <Th>Assigned To</Th>
                <Th className="text-right pr-5">&nbsp;</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pageRows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-6 text-center text-[13px] text-ink-muted"
                  >
                    No applicants match these filters.
                  </td>
                </tr>
              )}
              {pageRows.map((p) => (
                <tr key={p.id} className="hover:bg-canvas/50">
                  <Td>
                    <Link
                      href={`/portal/admin/participants/${p.id}`}
                      className="font-medium text-ink"
                    >
                      {p.firstName} {p.lastName}
                    </Link>
                    <div className="text-[12px] text-ink-subtle">
                      {p.email}
                    </div>
                  </Td>
                  <Td>
                    <Badge tone={statusTone[p.status]}>{p.status}</Badge>
                  </Td>
                  <Td className="whitespace-nowrap">{p.pathway}</Td>
                  <Td>{p.source}</Td>
                  <Td className="text-ink-muted whitespace-nowrap">
                    {p.appliedAt || "—"}
                  </Td>
                  <Td>
                    {p.assignedAdvisorName ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-semibold">
                          {p.assignedAdvisorName
                            .split(/\s+/)
                            .map((s) => s[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join("")}
                        </span>
                        {p.assignedAdvisorName.split(" ")[0]}
                      </span>
                    ) : (
                      <span className="text-ink-subtle italic text-[13px]">
                        Unassigned
                      </span>
                    )}
                  </Td>
                  <Td className="text-right pr-5">
                    <Link
                      href={`/portal/admin/participants/${p.id}`}
                      className="text-[13px] font-medium text-primary inline-flex items-center gap-1"
                    >
                      Open <ArrowRight size={12} />
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-line bg-canvas/60 px-5 py-3 flex items-center justify-between text-[12px] text-ink-subtle">
          <span>
            Showing {pageRows.length} of {filtered.length.toLocaleString()}{" "}
            applicants
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={clampedPage === 0}
              className="h-7 px-2 rounded border border-line bg-white text-ink-muted hover:text-ink disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2">
              Page {clampedPage + 1} of {pageCount}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={clampedPage >= pageCount - 1}
              className="h-7 px-2 rounded border border-line bg-white text-ink-muted hover:text-ink disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </PortalShell>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-5 py-3 font-semibold text-[12px] ${className}`}>
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-5 py-3 align-top ${className}`}>{children}</td>;
}
