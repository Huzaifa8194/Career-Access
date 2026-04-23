import {
  Timestamp,
  collection,
  doc,
  serverTimestamp,
  type CollectionReference,
  type DocumentReference,
} from "firebase/firestore";
import { getFirebaseDb } from "./config";

export type PortalRole = "participant" | "advisor" | "admin";

export type UserDoc = {
  uid: string;
  role: PortalRole;
  fullName: string;
  email: string;
  createdAt?: Timestamp;
};

export function usersCollection(): CollectionReference<UserDoc> {
  return collection(getFirebaseDb(), "users") as CollectionReference<UserDoc>;
}

export function userDoc(uid: string): DocumentReference<UserDoc> {
  return doc(getFirebaseDb(), "users", uid) as DocumentReference<UserDoc>;
}

export function nowTimestamp() {
  return serverTimestamp();
}
