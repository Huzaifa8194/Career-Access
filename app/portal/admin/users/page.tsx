"use client";

import { useEffect, useMemo, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PortalShell } from "@/components/portal/PortalShell";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { PortalRole } from "@/lib/firebase/types";
import { subscribeUsers, updateUserRole, type UserRow } from "@/lib/services/users";

const allRoles: PortalRole[] = ["participant", "advisor", "admin"];

export default function AdminUsersPage() {
  return (
    <RoleGuard allow={["admin"]}>
      <AdminUsers />
    </RoleGuard>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [draftRoles, setDraftRoles] = useState<Record<string, PortalRole>>({});
  const [savingUid, setSavingUid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeUsers(setUsers);
    return () => unsub();
  }, []);

  const stats = useMemo(() => {
    const participant = users.filter((u) => u.role === "participant").length;
    const advisor = users.filter((u) => u.role === "advisor").length;
    const admin = users.filter((u) => u.role === "admin").length;
    return { participant, advisor, admin };
  }, [users]);

  async function saveRole(user: UserRow) {
    const nextRole = draftRoles[user.uid] ?? user.role;
    if (nextRole === user.role) return;
    setSavingUid(user.uid);
    setError(null);
    try {
      await updateUserRole(user.uid, nextRole);
    } catch (err) {
      setError((err as Error)?.message || "Failed to update user role.");
    } finally {
      setSavingUid(null);
    }
  }

  return (
    <PortalShell
      role="admin"
      title="User management"
      subtitle="Set account roles for portal access."
    >
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <RoleStat label="Participants" count={stats.participant} tone="muted" />
        <RoleStat label="Advisors" count={stats.advisor} tone="primary" />
        <RoleStat label="Admins" count={stats.admin} tone="warn" />
      </div>

      <Card>
        <CardHeader
          title="All users"
          description="Assign each account to participant, advisor, or admin."
          action={
            <Badge tone="muted" size="sm">
              {users.length} total
            </Badge>
          }
        />

        {error && (
          <div className="mx-5 mb-4 rounded-md border border-danger/30 bg-danger-50 p-3 text-[13px] text-danger">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-canvas/60 border-y border-line text-[12px] uppercase tracking-wider text-ink-subtle">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Current role</th>
                <th className="px-5 py-3 font-semibold">Set role</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-[13px] text-ink-muted">
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((user) => {
                const selected = draftRoles[user.uid] ?? user.role;
                const dirty = selected !== user.role;
                const saving = savingUid === user.uid;
                return (
                  <tr key={user.uid} className="hover:bg-canvas/50">
                    <td className="px-5 py-3 align-top">
                      <div className="font-medium text-ink">{user.fullName || "Unnamed user"}</div>
                      {user.participantId && (
                        <div className="text-[12px] text-ink-subtle">Participant ID: {user.participantId}</div>
                      )}
                    </td>
                    <td className="px-5 py-3 align-top text-ink-muted">{user.email || "—"}</td>
                    <td className="px-5 py-3 align-top">
                      <Badge tone={toneForRole(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <select
                        value={selected}
                        onChange={(e) =>
                          setDraftRoles((prev) => ({
                            ...prev,
                            [user.uid]: e.target.value as PortalRole,
                          }))
                        }
                        className="h-9 min-w-[150px] rounded-md border border-line bg-white px-2.5 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                      >
                        {allRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 align-top text-right">
                      <Button
                        size="sm"
                        variant={dirty ? "primary" : "outline"}
                        disabled={!dirty || saving}
                        onClick={() => saveRole(user)}
                      >
                        {saving ? "Saving..." : "Save role"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </PortalShell>
  );
}

function toneForRole(role: PortalRole): "primary" | "muted" | "warn" {
  if (role === "admin") return "warn";
  if (role === "advisor") return "primary";
  return "muted";
}

function RoleStat({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "muted" | "primary" | "warn";
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-[var(--shadow-card)]">
      <div className="text-[12px] uppercase tracking-wider text-ink-subtle">{label}</div>
      <div className="mt-1 text-[26px] font-semibold tabular tracking-tight">{count}</div>
      <Badge tone={tone} size="sm">
        Active accounts
      </Badge>
    </div>
  );
}
