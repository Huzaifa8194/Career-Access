"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { getDoc, setDoc } from "firebase/firestore";
import { getFirebaseAuth, loadAnalytics } from "./config";
import { nowTimestamp, type PortalRole, userDoc } from "./firestore";
export type { PortalRole } from "./firestore";

export type AppUser = {
  uid: string;
  email: string;
  fullName: string;
  role: PortalRole;
};

type AuthContextValue = {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  /** True when no credentialed user is present — the site still renders. */
  signingIn: boolean;
  signIn: (email: string, password: string) => Promise<AppUser>;
  signUp: (args: {
    email: string;
    password: string;
    fullName: string;
    role?: PortalRole;
  }) => Promise<AppUser>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  const hydrate = useCallback(async (fbu: FirebaseUser | null): Promise<AppUser | null> => {
    if (!fbu) {
      setUser(null);
      return null;
    }
    const defaultName =
      fbu.displayName ?? (fbu.email ? fbu.email.split("@")[0] : "Guest");
    const fallback: AppUser = {
      uid: fbu.uid,
      email: fbu.email ?? "",
      fullName: defaultName,
      role: "participant",
    };
    try {
      const snap = await getDoc(userDoc(fbu.uid));
      const row = snap.exists() ? snap.data() : null;
      if (row?.uid) {
        const hydratedUser: AppUser = {
          uid: row.uid,
          email: row.email,
          fullName: row.fullName,
          role: row.role ?? "participant",
        };
        setUser(hydratedUser);
        return hydratedUser;
      }
      await setDoc(
        userDoc(fbu.uid),
        {
          uid: fbu.uid,
          email: fbu.email ?? fallback.email,
          fullName: fbu.displayName ?? fallback.fullName,
          role: "participant",
          createdAt: nowTimestamp(),
        },
        { merge: true }
      );
      setUser({ ...fallback, role: "participant" });
      return { ...fallback, role: "participant" };
    } catch (error) {
      // Keep auth UX alive even if profile sync fails temporarily.
      // eslint-disable-next-line no-console
      console.warn("[Auth] profile hydrate failed:", error);
      setUser(fallback);
      return fallback;
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), async (fbu) => {
      setFirebaseUser(fbu);
      try {
        await hydrate(fbu);
      } finally {
        setLoading(false);
      }
    });
    void loadAnalytics();
    return unsub;
  }, [hydrate]);

  const signIn = useCallback(async (email: string, password: string) => {
    setSigningIn(true);
    try {
      const cred = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password
      );
      const hydrated = await hydrate(cred.user);
      return (
        hydrated ?? {
          uid: cred.user.uid,
          email: cred.user.email ?? email,
          fullName: cred.user.displayName ?? email.split("@")[0],
          role: "participant",
        }
      );
    } finally {
      setSigningIn(false);
    }
  }, [hydrate]);

  const signUp = useCallback(
    async ({
      email,
      password,
      fullName,
      role = "participant",
    }: {
      email: string;
      password: string;
      fullName: string;
      role?: PortalRole;
    }) => {
      setSigningIn(true);
      try {
        const cred = await createUserWithEmailAndPassword(
          getFirebaseAuth(),
          email,
          password
        );
        await updateProfile(cred.user, { displayName: fullName });
        await setDoc(
          userDoc(cred.user.uid),
          {
            uid: cred.user.uid,
            email,
            fullName,
            role,
            createdAt: nowTimestamp(),
          },
          { merge: true }
        );
        const appUser: AppUser = {
          uid: cred.user.uid,
          email,
          fullName,
          role,
        };
        setUser(appUser);
        return appUser;
      } catch (error) {
        const fbError = error as { code?: string; message?: string };
        if (
          fbError?.code === "permission-denied" ||
          fbError?.code === "firestore/permission-denied"
        ) {
          throw Object.assign(new Error("Profile write denied by Firestore rules"), {
            code: "firestore/permission-denied",
          });
        }
        throw error;
      } finally {
        setSigningIn(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    await fbSignOut(getFirebaseAuth());
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(getFirebaseAuth(), email);
  }, []);

  const refresh = useCallback(async () => {
    await hydrate(getFirebaseAuth().currentUser);
  }, [hydrate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      firebaseUser,
      loading,
      signingIn,
      signIn,
      signUp,
      signOut,
      resetPassword,
      refresh,
    }),
    [user, firebaseUser, loading, signingIn, signIn, signUp, signOut, resetPassword, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be used inside <AuthProvider />");
  }
  return ctx;
}

export function useOptionalAuth(): AuthContextValue | null {
  return useContext(AuthContext);
}
