"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "./config";
import { COLLECTIONS, type PortalRole, type UserDoc } from "./types";

type AuthContextValue = {
  user: User | null;
  profile: UserDoc | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: PortalRole,
    extras?: { phone?: string; participantId?: string }
  ) => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchUserProfile(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(getFirebaseDb(), COLLECTIONS.users, uid));
  if (!snap.exists()) return null;
  return snap.data() as UserDoc;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const p = await fetchUserProfile(u.uid);
          setProfile(p);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function refreshProfile() {
    if (!user) {
      setProfile(null);
      return;
    }
    try {
      const p = await fetchUserProfile(user.uid);
      setProfile(p);
    } catch {
      setProfile(null);
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      signIn: async (email, password) => {
        const cred = await signInWithEmailAndPassword(
          getFirebaseAuth(),
          email,
          password
        );
        try {
          const p = await fetchUserProfile(cred.user.uid);
          setProfile(p);
        } catch {}
        return cred.user;
      },
      signUp: async (email, password, fullName, role = "participant", extras) => {
        const cred = await createUserWithEmailAndPassword(
          getFirebaseAuth(),
          email,
          password
        );
        try {
          await updateProfile(cred.user, { displayName: fullName });
        } catch {}
        const userData: UserDoc = {
          uid: cred.user.uid,
          role,
          fullName,
          email,
          phone: extras?.phone ?? null,
          participantId: extras?.participantId ?? null,
          createdAt: serverTimestamp() as unknown as UserDoc["createdAt"],
          updatedAt: serverTimestamp() as unknown as UserDoc["updatedAt"],
        };
        await setDoc(
          doc(getFirebaseDb(), COLLECTIONS.users, cred.user.uid),
          userData
        );
        setProfile(userData);
        return cred.user;
      },
      signOut: async () => {
        await firebaseSignOut(getFirebaseAuth());
        setProfile(null);
      },
      resetPassword: async (email) => {
        await sendPasswordResetEmail(getFirebaseAuth(), email);
      },
      refreshProfile,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider />");
  }
  return ctx;
}

export function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/email-already-in-use":
      return "An account already exists with that email.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 8 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again in a few minutes.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return (err as Error)?.message || "Something went wrong. Please try again.";
  }
}
