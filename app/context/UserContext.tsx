"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { updateStreak } from "../helpers/localWordStore";

interface UserContextType {
  streak: number;
  theme: "light" | "dark" | "system";
  setTheme: (mode: "light" | "dark" | "system") => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [streak, setStreak] = useState(1);
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    if (typeof window === "undefined") return "system";
    return (
      (localStorage.getItem("theme") as "light" | "dark" | "system" | null) ??
      "system"
    );
  });

  useEffect(() => {
    setStreak(Math.max(updateStreak(), 1));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    if (theme === "system") {
      localStorage.setItem("theme", "system");
      const apply = (dark: boolean) => root.classList.toggle("dark", dark);
      apply(mql.matches);
      const onChange = (e: MediaQueryListEvent) => apply(e.matches);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }

    // Explicit user choice overrides system
    localStorage.setItem("theme", theme);
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <UserContext.Provider value={{ streak, theme, setTheme }}>
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
