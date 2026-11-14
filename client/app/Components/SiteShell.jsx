"use client";

import Footer from "./Footer";
import Navbar from "./Navbar";
import { useTheme } from "./ThemeProvider";

export default function SiteShell({ children }) {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <div className="min-h-screen font-outfit overflow-x-clip flex flex-col">
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <main className="w-full flex-1">
        {children}
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
