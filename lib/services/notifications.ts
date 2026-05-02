export type NotificationKind =
  | "application-submitted"
  | "contact-inquiry"
  | "referral-submitted"
  | "appointment-booked";

export async function sendNotificationEmail(
  kind: NotificationKind,
  payload: Record<string, unknown>
): Promise<void> {
  const res = await fetch("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, payload }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(body?.error || "Unable to send notification email.");
  }
}
