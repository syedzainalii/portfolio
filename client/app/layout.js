import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./Components/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "Syed Zain Ali | Portfolio",
  description: "Mechanical engineering, CAD, simulation, data visualization, and web development portfolio.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const savedTheme = localStorage.getItem("theme");
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              const isDark = savedTheme === "dark" || (savedTheme !== "light" && prefersDark);
              document.documentElement.classList.toggle("dark", isDark);
              document.documentElement.dataset.theme = isDark ? "dark" : "light";
            })();`,
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased leading-7`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}