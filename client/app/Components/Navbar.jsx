"use client";

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { assets } from '@/assets/assets'
import { useState, useEffect, useRef } from 'react';

const Navbar = ({isDarkMode, setIsDarkMode}) => {

    const [isScroll, setIsScroll] = useState(false)
    const sideMenuRef = useRef();
    const isScrollRef = useRef(false);
    const pathname = usePathname() || "/";

    function openMenu() {
        sideMenuRef.current.style.transform = "translateX(-16rem)";
    }

    const closeMenu = () => {
        sideMenuRef.current.style.transform = "translateX(16rem)";
    }

    useEffect(() => {
        const handleScroll = () => {
            const next = window.scrollY > 50;
            if (isScrollRef.current === next) return;
            isScrollRef.current = next;
            setIsScroll(next);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    // Shared styles for the navigation links to keep code clean
    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/skills", label: "Skills" },
        { href: "/project", label: "Projects" },
        { href: "/experience", label: "Experience" },
        { href: "/services", label: "Services" },
        { href: "/certification", label: "Certification" },
        { href: "/contact", label: "Contact me" },
    ];

    return (
        <>
            {/* Background color blob - Hidden on dark mode */}
            <div aria-hidden className='absolute top-0 right-0 -z-10 hidden w-11/12 translate-y-[-80%] dark:hidden lg:block'>
                <Image src={assets.header_bg_color} alt="" className='w-full' sizes="(min-width: 1024px) 90vw, 100vw" loading="lazy" />
            </div>
            <div
                aria-hidden
                className="absolute right-0 top-0 -z-10 h-64 w-11/12 -translate-y-1/3 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.2),transparent_70%)] dark:hidden lg:hidden"
            >
            </div>

            <nav className={`w-full fixed top-0 z-50 transition-all duration-300 ${isScroll
                ? "bg-white/95 shadow-sm dark:bg-darkTheme/95 dark:shadow-white/10 lg:bg-white lg:bg-opacity-50 lg:backdrop-blur-lg lg:shadow-sm lg:dark:bg-darkTheme lg:dark:shadow-white/20"
                : ""}`}>
                <div className="w-full px-5 sm:px-8 lg:px-10 flex items-center justify-between py-4">
                
                {/* Logo Section */}
                <Link href="/">
                    <Image 
                        src={isDarkMode ? assets.logo_dark : assets.logo} 
                        alt='Logo'
                        className='w-24 md:w-28 cursor-pointer mr-4 lg:mr-14' 
                        sizes="(min-width: 768px) 7rem, 6rem"
                        loading="lazy"
                    />
                </Link>

                {/* Desktop & Laptop Menu (Changed lg:flex to md:flex) */}
                <ul className={`hidden md:flex items-center gap-3 lg:gap-6 xl:gap-10 rounded-full px-6 lg:px-12 py-3 transition-all duration-500 ${isScroll 
                    ? "" 
                    : "bg-white shadow-sm bg-opacity-50 border border-gray-400 dark:border-gray-600 dark:bg-transparent"}`}>
                    
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                className='group relative inline-flex min-h-11 items-center whitespace-nowrap font-Ovo text-sm lg:min-h-0 lg:text-base'
                                href={link.href}
                                aria-current={pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`)) ? "page" : undefined}
                            >
                                {link.label}
                                <span className={`absolute bottom-0 left-0 h-[1px] bg-gray-700 dark:bg-white transition-all duration-300 group-hover:w-full ${(pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`))) ? "w-full" : "w-0"}`}></span>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Right Side Buttons */}
                <div className='flex items-center gap-2 lg:gap-4'> 

                    {/* Dark Mode Toggle */}
                    <button onClick={() => setIsDarkMode(prev => !prev)} className='grid h-11 w-11 place-items-center rounded-full transition-all duration-300 active:scale-90 group lg:h-10 lg:w-10'>
                        <Image src={isDarkMode ? assets.sun_icon : assets.moon_icon} alt="" className='w-6 group-hover:rotate-[15deg] transition-transform' sizes="24px" loading="lazy" />
                    </button>

                    {/* Desktop Contact Button (Hidden on small/medium, visible on large) */}
                    <Link href="/contact"
                        className='hidden lg:flex items-center gap-1.5 px-8 py-2.5 border border-gray-400 rounded-full font-Ovo transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-95 group dark:border-gray-600'> 
                        Contact 
                        <Image src={isDarkMode ? assets.arrow_icon_dark : assets.arrow_icon} alt="" className='w-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1' sizes="12px" loading="lazy" />
                    </Link>

                    {/* Hamburger Menu (Visible on mobile/tablet) */}
                    <button className='grid h-11 w-11 place-items-center md:hidden ml-2 hover:scale-110 active:scale-95 transition-transform' onClick={openMenu}>
                        <Image src={isDarkMode ? assets.menu_white : assets.menu_black} alt="" className='w-6' sizes="24px" loading="lazy"/>
                    </button>
                </div>

                {/* Mobile Side Menu */}
                <ul ref={sideMenuRef} className='fixed -right-64 top-0 z-50 flex h-[100svh] max-h-[100svh] w-64 flex-col gap-4 overflow-y-auto overscroll-contain bg-rose-50 px-10 py-20 pb-[calc(5rem+env(safe-area-inset-bottom))] transition-transform duration-500 dark:bg-darkHover dark:text-white md:hidden'>
                    <li className="list-none">
                        <button
                            type="button"
                            aria-label="Close menu"
                            className="absolute right-3 top-3 grid h-11 w-11 place-items-center"
                            onClick={closeMenu}
                        >
                            <Image src={isDarkMode ? assets.close_white : assets.close_black} alt="" className='w-5' sizes="20px" loading="lazy"/>
                        </button>
                    </li>

                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                className={`flex min-h-11 items-center font-Ovo ${pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`)) ? "underline underline-offset-4" : ""}`}
                                onClick={closeMenu}
                                href={link.href}
                                aria-current={pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`)) ? "page" : undefined}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                </div>
            </nav>
        </>
    )
}

export default Navbar