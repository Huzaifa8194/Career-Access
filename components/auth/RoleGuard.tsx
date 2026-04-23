"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/firebase/auth";
import type { PortalRole } from "@/lib/firebase/types";

type Props = {
  allow: PortalRole | PortalRole[];
  children: ReactNode;
  fallbackHref?: string;
};

export function RoleGuard({ allow, children, fallbackHref = "/portal" }: Props) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const allowed = Array.isArray(allow) ? allow : [allow];

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/portal");
      return;
    }
  }, [loading, user, router]);

  if (loading) {
    return <FullscreenStatus message="Loading your workspace…" />;
  }

  if (!user) {
    return <FullscreenStatus message="Redirecting to sign in…" />;
  }

  if (!profile) {
    return (
      <FullscreenStatus
        message="We're finishing your account setup. Please wait a moment or sign in again."
        actionHref="/portal"
        actionLabel="Back to sign in"
      />
    );
  }

  if (!allowed.includes(profile.role)) {
    return (
      <FullscreenStatus
        message={`This area is for ${allowed.join(" / ")} accounts. Your account is signed in as a ${profile.role}.`}
        actionHref={fallbackHref}
        actionLabel="Return"
      />
    );
  }

  return <>{children}</>;
}

function FullscreenStatus({
  message,
  actionHref,
  actionLabel,
}: {
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-line rounded-lg p-8 shadow-[var(--shadow-card)] text-center">
        <div className="mx-auto h-10 w-10 rounded-full border-2 border-primary/25 border-t-primary animate-spin mb-4" />
        <p className="text-[14px] text-ink leading-6">{message}</p>
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="mt-5 inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-white text-[13px] font-medium"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
