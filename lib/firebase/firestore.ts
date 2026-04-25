import {
  collection,
  doc,
  serverTimestamp,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
} from "firebase/firestore";
import { getFirebaseDb } from "./config";
import { COLLECTIONS } from "./types";

export function col<T = DocumentData>(
  name: string
): CollectionReference<T> {
  return collection(getFirebaseDb(), name) as CollectionReference<T>;
}

export function ref<T = DocumentData>(
  name: string,
  id: string
): DocumentReference<T> {
  return doc(getFirebaseDb(), name, id) as DocumentReference<T>;
}

export function usersCol() {
  return col(COLLECTIONS.users);
}
export function userRef(uid: string) {
  return ref(COLLECTIONS.users, uid);
}

export function participantsCol() {
  return col(COLLECTIONS.participants);
}
export function participantRef(id: string) {
  return ref(COLLECTIONS.participants, id);
}

export function applicationsCol() {
  return col(COLLECTIONS.applications);
}
export function referralsCol() {
  return col(COLLECTIONS.referrals);
}
export function advisorsCol() {
  return col(COLLECTIONS.advisors);
}
export function appointmentsCol() {
  return col(COLLECTIONS.appointments);
}
export function contactInquiriesCol() {
  return col(COLLECTIONS.contactInquiries);
}
export function tasksCol() {
  return col(COLLECTIONS.tasks);
}
export function notesCol() {
  return col(COLLECTIONS.notes);
}
export function documentsCol() {
  return col(COLLECTIONS.documents);
}
export function messagesCol() {
  return col(COLLECTIONS.messages);
}
export function metricsCol() {
  return col(COLLECTIONS.metrics);
}

export function nowTimestamp() {
  return serverTimestamp();
}
