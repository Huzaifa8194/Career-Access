"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "@/components/portal/PortalShell";
import { RequireAuth } from "@/components/portal/RequireAuth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { type ParticipantStatus } from "@/lib/data";
import { Search, ArrowRight, Plus } from "@/components/icons";
import { LinkButton } from "@/components/ui/Button";
import {
  fetchAllParticipants,
  type PortalParticipant,
} from "@/lib/services/participants";

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

type FilterKey = "all" | "unassigned" | "atRisk" | "enrolled";

export default function AdminParticipantsPage() {
  return (
    <RequireAuth requiredRole="admin">
      <AdminParticipantsInner />
    </RequireAuth>
  );
}

function AdminParticipantsInner() {
  const [rows, setRows] = useState<PortalParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAllParticipants();
        if (!cancelled) setRows(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(
    () => ({
      all: rows.length,
      unassigned: rows.filter((p) => !p.assignedAdvisor).length,
      atRisk: rows.filter((p) => p.risk && p.risk !== "ok").length,
      enrolled: rows.filter((p) => p.status === "Enrolled").length,
    }),
    [rows]
  );

  const filtered = useMemo(() => {
    const pool = rows.filter((p) => {
      switch (filter) {
        case "unassigned":
          return !p.assignedAdvisor;
        case "atRisk":
          return p.risk && p.risk !== "ok";
        case "enrolled":
          return p.status === "Enrolled";
        default:
          return true;
      }
    });
    if (!query.trim()) return pool;
    const q = query.trim().toLowerCase();
    return pool.filter(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.zip ?? "").toLowerCase().includes(q)
    );
  }, [rows, filter, query]);

  const demo = rows.length > 0 && !rows[0]._live;

  return (
    <PortalShell
      role="admin"
      title="Applicants"
      subtitle={
        demo
          ? "Sample applicants — deploy the Firebase backend to see live data."
          : "All applicants in the system. Assign, update, and route from here."
      }
      actions={
        <>
          <LinkButton href="#" variant="secondary" size="sm">
            Export CSV
          </LinkButton>
          <LinkButton href="/refer" variant="primary" size="sm">
            <Plus size={14} /> New referral
          </LinkButton>
        </>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { key: "all", label: "All", count: counts.all },
              {
                key: "unassigned",
                label: "Unassigned",
                count: counts.unassigned,
              },
              { key: "atRisk", label: "At risk", count: counts.atRisk },
              { key: "enrolled", label: "Enrolled", count: counts.enrolled },
            ] as { key: FilterKey; label: string; count: number }[]
          ).map((f) => {
            const active = f.key === filter;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={[
                  "h-8 rounded-md px-3 text-[13px] font-medium border inline-flex items-center gap-2 transition-colors",
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-ink-muted border-line hover:text-ink",
                ].join(" ")}
              >
                {f.label}
                <span
                  className={[
                    "rounded-md px-1.5 text-[11px]",
                    active ? "bg-white/20 text-white" : "bg-canvas text-ink-subtle",
                  ].join(" ")}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
                <Th>
                  <input type="checkbox" className="accent-primary" />
                </Th>
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
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-canvas/50">
                  <Td>
                    <input type="checkbox" className="accent-primary" />
                  </Td>
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
                    <Badge tone={statusTone[p.status] ?? "muted"}>
                      {p.status}
                    </Badge>
                  </Td>
                  <Td className="whitespace-nowrap">{p.pathway}</Td>
                  <Td>{p.source}</Td>
                  <Td className="text-ink-muted whitespace-nowrap">
                    {p.appliedAt}
                  </Td>
                  <Td>
                    {p.assignedAdvisor ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-semibold">
                          {p.assignedAdvisor
                            .split(" ")
                            .map((s) => s[0])
                            .join("")}
                        </span>
                        {p.assignedAdvisor.split(" ")[0]}
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
              {!loading && filtered.length === 0 ? (
                <tr>
                  <Td />
                  <Td className="text-ink-subtle">No matching applicants.</Td>
                  <Td />
                  <Td />
                  <Td />
                  <Td />
                  <Td />
                  <Td />
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="border-t border-line bg-canvas/60 px-5 py-3 flex items-center justify-between text-[12px] text-ink-subtle">
          <span>
            Showing {filtered.length} of {rows.length} applicants
          </span>
          <div className="flex items-center gap-1">
            <button className="h-7 px-2 rounded border border-line bg-white text-ink-muted hover:text-ink">
              Prev
            </button>
            <button className="h-7 px-2 rounded border border-line bg-white text-ink-muted hover:text-ink">
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
  children?: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-5 py-3 align-top ${className}`}>{children}</td>;
}
