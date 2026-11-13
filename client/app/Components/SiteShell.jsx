"use client";

import Footer from "./Footer";
import Navbar from "./Navbar";
import { useTheme } from "./ThemeProvider";

export default function SiteShell({ children }) {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <div className="min-h-screen font-outfit overflow-x-hidden flex flex-col">
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <main className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-screen-2xl flex-1">
        {children}
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
