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
  theme: "light" | "dark" | "system";
  setTheme: (mode: "light" | "dark" | "system") => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(1);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const { uid, email, displayName, photoURL } = firebaseUser;
        const simpleUser = { uid, email, displayName, photoURL };
        setUser(simpleUser);

        try {
          const currentStreak = await updateStreak(uid);
          setStreak(Math.max(currentStreak, 1));
          console.log("updating streak")
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

useEffect(() => {
  const storedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
  if (storedTheme) {
    setTheme(storedTheme);
  } else {
    setTheme("system");
  }
}, []);

useEffect(() => {
  localStorage.setItem("theme", theme);
  const root = document.documentElement;

  if (theme === "dark" || (theme === "system" && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}, [theme]);

  return (
<UserContext.Provider value={{ user, loading, streak, theme, setTheme }}>
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
