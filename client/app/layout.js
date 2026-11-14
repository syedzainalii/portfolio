import { Outfit as OutfitFont, Ovo as OvoFont } from "next/font/google";
import lightFavicon from "./favicon_io/favicon-32x32.png";
import darkFavicon from "./favicon_io_dark/favicon-32x32.png";
import "./globals.css";
import SiteShell from "./Components/SiteShell";
import ThemeProvider from "./Components/ThemeProvider";

const outfit = OutfitFont({
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: '--font-outfit',
});

const ovo = OvoFont({
  subsets: ["latin"], 
  weight: ["400"],
  variable: '--font-ovo',
});

export const metadata = {
  title: {
    default: "Syed Zain Ali | Portfolio",
    template: "%s | Syed Zain Ali",
  },
  description: "Mechanical engineering, CAD, simulation, and web development portfolio.",
  icons: {
    icon: [
      {
        url: lightFavicon.src,
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: darkFavicon.src,
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
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
              const isDarkMode = localStorage.theme === "dark" ||
                (!("theme" in localStorage) &&
                  window.matchMedia("(prefers-color-scheme: dark)").matches);
              document.documentElement.classList.toggle("dark", isDarkMode);
            })();`,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${ovo.variable} font-outfit antialiased 
        leading-8 overflow-x-clip bg-white text-black dark:bg-darkTheme dark:text-white flex min-h-screen flex-col`}
      >
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}