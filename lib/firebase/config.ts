import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  type Auth,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from "firebase/firestore";
import {
  getStorage,
  connectStorageEmulator,
  type FirebaseStorage,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDI5oB9Fdae7qBIRfuAKZwIZbQ3sUKg88U",
  authDomain: "careeraccesshub-d3d27.firebaseapp.com",
  projectId: "careeraccesshub-d3d27",
  storageBucket: "careeraccesshub-d3d27.firebasestorage.app",
  messagingSenderId: "969717593106",
  appId: "1:969717593106:web:f37927b0cfafbf22bc94cb",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let emulatorsHooked = false;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth;
  auth = getAuth(getFirebaseApp());
  hookEmulators();
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (db) return db;
  db = getFirestore(getFirebaseApp());
  hookEmulators();
  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (storage) return storage;
  storage = getStorage(getFirebaseApp());
  hookEmulators();
  return storage;
}

function hookEmulators() {
  if (emulatorsHooked || typeof window === "undefined") return;
  const all =
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" ||
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "1";
  if (!all && !singleFlags()) return;
  emulatorsHooked = true;
  const host = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || "127.0.0.1";
  try {
    if ((all || process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === "1") && auth) {
      connectAuthEmulator(auth, `http://${host}:9099`, {
        disableWarnings: true,
      });
    }
    if ((all || process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === "1") && db) {
      connectFirestoreEmulator(db, host, 8080);
    }
    if ((all || process.env.NEXT_PUBLIC_USE_STORAGE_EMULATOR === "1") && storage) {
      connectStorageEmulator(storage, host, 9199);
    }
  } catch {
  }
}

function singleFlags(): boolean {
  return (
    process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === "1" ||
    process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === "1" ||
    process.env.NEXT_PUBLIC_USE_STORAGE_EMULATOR === "1"
  );
}
