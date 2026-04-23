import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAbqVFPyLBwr1lciemmTbE2dsno3hJjGhU",
  authDomain: "career-access-hub.firebaseapp.com",
  projectId: "career-access-hub",
  storageBucket: "career-access-hub.firebasestorage.app",
  messagingSenderId: "675319541271",
  appId: "1:675319541271:web:f1f7bf0b55797d9b9df652",
  measurementId: "G-W8XFR5648B",
};

// Singleton accessor — avoids "FirebaseApp already exists" across HMR reloads.
export function getFirebaseApp(): FirebaseApp {
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
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
