/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider, hasFirebaseConfig } from "../firebase/config";
import type { AdminRole } from "../types/catalog";

type AdminProfile = {
  role: AdminRole;
  active: boolean;
  email: string;
  name: string;
};

type AuthContextValue = {
  user: User | null;
  profile: AdminProfile | null;
  loading: boolean;
  isAdmin: boolean;
  authReady: boolean;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return undefined;
    }

    const firebaseAuth = auth;
    const firestore = db;

    return onAuthStateChanged(firebaseAuth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const profileSnapshot = await getDoc(doc(firestore, "users", nextUser.uid));
      setProfile(profileSnapshot.exists() ? (profileSnapshot.data() as AdminProfile) : null);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      authReady: hasFirebaseConfig,
      isAdmin: Boolean(profile?.active && profile.role === "administrator"),
      signInWithGoogle: async () => {
        if (!auth) {
          throw new Error("Firebase Authentication is not configured yet.");
        }
        await signInWithPopup(auth, googleProvider);
      },
      logOut: async () => {
        if (auth) {
          await signOut(auth);
        }
      }
    }),
    [loading, profile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
