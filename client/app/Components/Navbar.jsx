import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { assets } from "@/assets/assets";

const navLinks = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About me" },
  { href: "#skills", label: "Skills" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "My Work" },
  { href: "#experience", label: "Experience" },
  { href: "#certification", label: "Certification" },
  { href: "#contact", label: "Contact me" },
];

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    let frame = 0;
    const updateScrollState = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        setScrollProgress(progress);
        setIsScrolled(window.scrollY > 16);

        let currentSection = "top";
        for (const link of navLinks.slice(1)) {
          const section = document.querySelector(link.href);
          if (section && section.getBoundingClientRect().top <= 150) {
            currentSection = link.href.slice(1);
          }
        }
        setActiveSection(currentSection);
      });
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeMenu, isMenuOpen]);

  const renderLinks = (isMobile = false) =>
    navLinks.map((link) => {
      const active = activeSection === link.href.slice(1);
      return (
        <li key={link.href}>
          <a
            className={`site-nav-link${active ? " is-active" : ""}`}
            href={link.href}
            aria-current={active ? "location" : undefined}
            tabIndex={isMobile && !isMenuOpen ? -1 : 0}
            onClick={isMobile ? closeMenu : undefined}
          >
            {link.label}
          </a>
        </li>
      );
    });

  return (
    <>
      <header className={`site-nav${isScrolled ? " is-scrolled" : ""}`}>
        <nav className="site-nav-inner" aria-label="Main navigation">
          <a className="site-nav-logo" href="#top" aria-label="Syed Zain Ali, home">
            <Image
              src={isDarkMode ? assets.logo_dark : assets.logo}
              alt="Syed Zain Ali"
              className="w-24 md:w-28"
              priority
            />
          </a>

          <ul className="site-nav-links">{renderLinks()}</ul>

          <div className="site-nav-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setIsDarkMode((previous) => !previous)}
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} theme`}
              title={`Switch to ${isDarkMode ? "light" : "dark"} theme`}
            >
              <Image
                src={isDarkMode ? assets.sun_icon : assets.moon_icon}
                alt=""
                className="w-5"
              />
            </button>
            <a className="site-nav-contact" href="#contact">
              Contact <span aria-hidden="true">↗</span>
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              className="menu-toggle md:hidden"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-controls="mobile-navigation"
              aria-expanded={isMenuOpen}
            >
              <Image
                src={isDarkMode ? assets.menu_white : assets.menu_black}
                alt=""
                className="w-5"
              />
            </button>
          </div>
        </nav>
        <div
          className="nav-progress"
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(scrollProgress)}
        >
          <span style={{ transform: `scaleX(${scrollProgress / 100})` }} />
        </div>
      </header>

      {isMenuOpen && (
        <button
          type="button"
          className="mobile-menu-backdrop"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      )}
      <nav
        id="mobile-navigation"
        className={`mobile-menu${isMenuOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
      >
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">Navigation / Index</span>
          <button
            type="button"
            className="menu-close"
            onClick={closeMenu}
            aria-label="Close navigation menu"
            tabIndex={isMenuOpen ? 0 : -1}
          >
            <Image
              src={isDarkMode ? assets.close_white : assets.close_black}
              alt=""
              className="w-4"
            />
          </button>
        </div>
        <ul className="list-none m-0 p-0">{renderLinks(true)}</ul>
      </nav>
    </>
  );
};

export default Navbar;