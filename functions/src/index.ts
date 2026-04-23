/**
 * Cloud Functions stubs for Career Access Hub.
 *
 * These are ready-to-deploy HTTPS/Firestore triggers. Logic is intentionally
 * light — the client already handles most business logic. Use these to add
 * server-side validation, aggregations, notifications, and privileged writes.
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions/v2";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

if (!getApps().length) initializeApp();

const db = getFirestore();
const auth = getAuth();

type AssignableRole = "participant" | "advisor" | "admin";

/**
 * Admin-only: set a user's role (persists custom claim + Firestore user doc).
 */
export const setUserRole = onCall(async (req) => {
  const callerUid = req.auth?.uid;
  if (!callerUid) {
    throw new HttpsError("unauthenticated", "Sign in required.");
  }

  const callerDoc = await db.doc(`users/${callerUid}`).get();
  if (callerDoc.data()?.role !== "admin") {
    throw new HttpsError("permission-denied", "Admins only.");
  }

  const { uid, role } = (req.data ?? {}) as { uid?: string; role?: AssignableRole };
  if (!uid || !role || !["participant", "advisor", "admin"].includes(role)) {
    throw new HttpsError("invalid-argument", "uid and role are required.");
  }

  await auth.setCustomUserClaims(uid, { role });
  await db.doc(`users/${uid}`).set(
    { role, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  return { ok: true };
});

/**
 * When a new participant is created: keep a denormalized counter for dashboards
 * and set a welcome task.
 */
export const onParticipantCreate = onDocumentCreated(
  "participants/{pid}",
  async (event) => {
    const pid = event.params.pid;
    const data = event.data?.data();
    if (!data) return;

    await db.collection("tasks").add({
      participantId: pid,
      title: "Welcome call with advisor",
      description: "Intro call to review goals and pathway.",
      status: "open",
      priority: "High",
      dueDate: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await db.doc("dashboard_metrics/global").set(
      {
        totalApplicants: FieldValue.increment(1),
        [`pathway_${slug(data.pathway ?? "unknown")}`]: FieldValue.increment(1),
        [`source_${slug(data.source ?? "Direct")}`]: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }
);

/**
 * When participant status transitions to Enrolled, bump the enrolled counter.
 */
export const onParticipantStatusChange = onDocumentUpdated(
  "participants/{pid}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;

    if (before.status !== "Enrolled" && after.status === "Enrolled") {
      await db.doc("dashboard_metrics/global").set(
        {
          enrolled: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }
  }
);

/**
 * When a referral comes in, auto-log an operational task for staff follow-up.
 */
export const onReferralCreate = onDocumentCreated(
  "referrals/{rid}",
  async (event) => {
    const data = event.data?.data();
    if (!data) return;
    logger.info("New referral received", { rid: event.params.rid });
    await db.doc("dashboard_metrics/global").set(
      {
        referralsTotal: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }
);

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
