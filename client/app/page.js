'use client'
import { useTheme } from "./Components/ThemeProvider";
import Navbar from "./Components/Navbar";
import Header from "./Components/Header";
import About from "./Components/About";
import Services from "./Components/Services";
import Work from "./Components/Work";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import Skills from "./Components/Skills";
import Experience from "./Components/Experience";
import Certification from "./Components/Certification";

export default function Home() {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <div id="top" className="min-h-screen overflow-x-hidden">
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
      

      <main className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-screen-2xl">
        <Header isDarkMode={isDarkMode} />
        <About isDarkMode={isDarkMode} />
        <Skills isDarkMode={isDarkMode}/>
        <Services isDarkMode={isDarkMode} />
        <Work isDarkMode={isDarkMode} />
        <Experience isDarkMode={isDarkMode} />
        <Certification isDarkMode={isDarkMode} />
        <Contact isDarkMode={isDarkMode} />
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}