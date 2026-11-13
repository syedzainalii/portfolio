"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const ThemeContext = createContext(null);
const themeListeners = new Set();

function applyTheme(isDarkMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", isDarkMode);
  root.dataset.theme = isDarkMode ? "dark" : "light";
}

function notifyThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function subscribeToTheme(listener) {
  themeListeners.add(listener);
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const followSystemTheme = (event) => {
    if (window.localStorage.getItem("theme") === null) {
      applyTheme(event.matches);
      notifyThemeChange();
    }
  };

  mediaQuery.addEventListener("change", followSystemTheme);
  return () => {
    themeListeners.delete(listener);
    mediaQuery.removeEventListener("change", followSystemTheme);
  };
}

function getThemeSnapshot() {
  return document.documentElement.dataset.theme === "dark";
}

function getServerThemeSnapshot() {
  return false;
}

function setTheme(update) {
  const previous = getThemeSnapshot();
  const next = typeof update === "function" ? update(previous) : update;
  window.localStorage.setItem("theme", next ? "dark" : "light");
  applyTheme(next);
  notifyThemeChange();
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

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
