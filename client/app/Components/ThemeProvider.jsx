"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const ThemeContext = createContext(null);
const listeners = new Set();

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return false;
}

function subscribeToTheme(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setTheme(update) {
  const isDarkMode = getThemeSnapshot();
  const next = typeof update === "function" ? update(isDarkMode) : update;

  if (next) {
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "";
  }

  listeners.forEach((listener) => listener());
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }
  return context;
}

export default function ThemeProvider({ children }) {
  const isDarkMode = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const value = useMemo(
    () => ({ isDarkMode, setIsDarkMode: setTheme }),
    [isDarkMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
