import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyDI5oB9Fdae7qBIRfuAKZwIZbQ3sUKg88U",
  authDomain: "careeraccesshub-d3d27.firebaseapp.com",
  projectId: "careeraccesshub-d3d27",
  storageBucket: "careeraccesshub-d3d27.firebasestorage.app",
  messagingSenderId: "969717593106",
  appId: "1:969717593106:web:f37927b0cfafbf22bc94cb",
};

// Singleton accessor — avoids "FirebaseApp already exists" across HMR reloads.
export function getFirebaseApp(): FirebaseApp {
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}

// Analytics is browser-only and optional. Call from a useEffect.
export async function loadAnalytics(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    if (await isSupported()) {
      getAnalytics(getFirebaseApp());
    }
  } catch {
    // Non-fatal — analytics is a nice-to-have.
  }
}
