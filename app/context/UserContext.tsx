"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { updateStreak } from "../helpers/userWordLibrary";

interface SimpleUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface UserContextType {
  user: SimpleUser | null;
  loading: boolean;
  streak: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const { uid, email, displayName, photoURL } = firebaseUser;
        const simpleUser = { uid, email, displayName, photoURL };
        setUser(simpleUser);

        try {
          const currentStreak = await updateStreak(uid);
          setStreak(Math.max(currentStreak, 1));
        } catch (err) {
          console.error("Failed to update streak:", err);
          setStreak(1); // fallback
        }
      } else {
        setUser(null);
        setStreak(1);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, streak }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
