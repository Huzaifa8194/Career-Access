"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth, type PortalRole } from "@/lib/firebase/auth";

type Props = {
  children: ReactNode;
  /** When provided and the authenticated user has a different role, they are bounced to their own portal. */
  requiredRole?: PortalRole;
  /** Where to send unauthenticated users. */
  redirectTo?: string;
  /** When true (default), demo fallback is allowed while no backend is deployed. */
  allowDemo?: boolean;
};

export function RequireAuth({
  children,
  requiredRole,
  redirectTo = "/portal",
  allowDemo: _allowDemo = true,
}: Props) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const demoMode = false;

  useEffect(() => {
    if (loading || demoMode) return;
    if (!user) {
      router.replace(redirectTo);
      return;
    }
    if (requiredRole && user.role !== requiredRole) {
      const bounce =
        user.role === "admin"
          ? "/portal/admin"
          : user.role === "advisor"
          ? "/portal/advisor"
          : "/portal/participant";
      router.replace(bounce);
    }
  }, [user, loading, demoMode, requiredRole, redirectTo, router]);

  if (loading && !demoMode) {
    return (
      <div className="min-h-screen grid place-items-center bg-canvas">
        <div className="flex items-center gap-3 text-[13px] text-ink-muted">
          <span className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          Loading your portal…
        </div>
      </div>
    );
  }
  if (!demoMode && !user) return null;
  if (!demoMode && requiredRole && user && user.role !== requiredRole) return null;

  return <>{children}</>;
}
