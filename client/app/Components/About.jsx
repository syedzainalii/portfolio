"use client";

import { aboutParagraphs, assets, infoList, toolsData } from "@/assets/assets";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ChevronDown, MapPin } from "lucide-react";
import { useTheme } from "./ThemeProvider";

// Names for the logos in `toolsData`. Keep this in the SAME ORDER as toolsData in assets.js
const TOOL_NAMES = [
  "SolidWorks",
  "Dassault Systèmes",
  "Ansys",
  "MATLAB",
  "VS Code",
  "Power BI",
  "Tableau",
  "Jira",
  "Wrike",
  "Microsoft Office",
];

const tile =
  "relative overflow-hidden rounded-3xl border border-black/10 bg-white dark:border-white/15 dark:bg-darkHover";

const fadeY =
  "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)";
const fadeX =
  "linear-gradient(to right, transparent, black 8%, black 92%, transparent)";

function Label({ children }) {
  return (
    <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
      {children}
    </p>
  );
}

function ToolPill({ src, name }) {
  return (
    <li
      className="group flex shrink-0 items-center gap-2.5 rounded-full border border-black/10 bg-white/60 py-1 pl-1 pr-4
        xl:w-full
        transition-all duration-300
        hover:-translate-y-0.5 hover:border-amber-500/70 hover:shadow-[0_8px_22px_-6px_rgba(180,115,0,0.55)]
        dark:border-white/15 dark:bg-white/5
        dark:hover:border-amber-500/60 dark:hover:shadow-[0_8px_26px_-6px_rgba(202,138,4,0.6)]
        motion-reduce:transition-none"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white p-1.5 ring-1 ring-black/5 transition-shadow duration-300 group-hover:ring-amber-500/40">
        <Image src={src} alt="" className="h-full w-full object-contain" sizes="36px" loading="lazy" />
      </span>
      <span className="min-w-0 whitespace-nowrap text-sm font-medium leading-5 xl:whitespace-normal">
        {name}
      </span>
    </li>
  );
}

const About = ({ preview = false }) => {
  const { isDarkMode } = useTheme();
  const reduce = useReducedMotion();
  const toolsRef = useRef(null);
  const inView = useInView(toolsRef);
  const [open, setOpen] = useState(false);

  const [lead, ...rest] = aboutParagraphs;

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  });

  const tools = toolsData.map((src, i) => ({ src, name: TOOL_NAMES[i] ?? "Tool" }));

  return (
    <section id="about" className="w-full py-14 sm:py-20 lg:py-24">
      <div className="site-container">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes about-tools-horizontal { to { transform: translateX(-50%); } }
              @keyframes about-tools-vertical { to { transform: translateY(-50%); } }
              .about-tools-marquee-x { animation: about-tools-horizontal 38s linear infinite; }
              .about-tools-marquee-y { animation: about-tools-vertical 32s linear infinite; }
              .about-tools-marquee-host:hover .about-tools-marquee-x,
              .about-tools-marquee-host:hover .about-tools-marquee-y,
              .about-tools-marquee-host:focus-within .about-tools-marquee-x,
              .about-tools-marquee-host:focus-within .about-tools-marquee-y { animation-play-state: paused; }
              .about-tools-marquee-paused .about-tools-marquee-x,
              .about-tools-marquee-paused .about-tools-marquee-y { animation-play-state: paused; }
              @media (prefers-reduced-motion: reduce) {
                .about-tools-marquee-x, .about-tools-marquee-y { animation: none; }
              }
            `,
          }}
        />

        {/* Heading */}
        <h4 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
          Introduction
        </h4>
        <h2 className="text-center font-Ovo text-4xl sm:text-5xl">About Me</h2>

        {/*
          One shared grid, so every column has the same top and bottom edge.
          phones: 1 column | tablets: 2 columns (portrait + text) | desktop: 3 columns
        */}
        <div className="mt-10 grid w-full grid-cols-1 gap-5 md:grid-cols-5 xl:mt-12 xl:grid-cols-12">
          {/* ===== Portrait (spans bio + specs rows) ===== */}
          <motion.div
            {...reveal()}
            className={`${tile} h-[26rem] shadow-md sm:h-[30rem] md:col-span-2 md:row-span-2 md:h-auto md:min-h-[22rem] xl:col-span-3 xl:col-start-1 xl:row-start-1 lg:shadow-xl`}
          >
            <Image
              src={assets.user_image}
              alt="Syed Zain Ali"
              fill
              loading="lazy"
              quality={70}
              sizes="(min-width: 1280px) 24rem, (min-width: 768px) 40vw, 100vw"
              className="object-cover object-top"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            />

            {/* Corner brackets */}
            <span aria-hidden className="absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-amber-400" />
            <span aria-hidden className="absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-amber-400" />

            {/* Name label */}
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-black/60 p-4 lg:bg-black/35 lg:backdrop-blur-md">
              <p className="text-lg font-semibold leading-6 text-white">Syed Zain Ali</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs leading-5 text-white/75">
                <MapPin className="h-3.5 w-3.5" />
                Karachi, Pakistan
              </p>
            </div>
          </motion.div>

          {/* ===== Bio ===== */}
          <motion.div
            {...reveal(0.05)}
            className={`${tile} p-6 shadow-sm sm:p-7 md:col-span-3 xl:col-span-6 xl:col-start-4 xl:row-start-1 lg:shadow-lg`}
          >
            <Label>Profile</Label>
            {lead && (
              <p className="mt-4 font-Ovo text-lg leading-8 text-gray-800 dark:text-white/90 sm:text-xl sm:leading-9">
                {lead}
              </p>
            )}

            {rest.length > 0 && (
              <>
                <div
                  className={`grid transition-all duration-500 ease-out motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      id="about-more"
                      className="space-y-4 pt-5 font-Ovo text-base leading-8 text-gray-600 dark:text-white/70"
                    >
                      {rest.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  aria-controls="about-more"
                  className="group mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium lg:min-h-0"
                >
                  <span className="relative">
                    {open ? "Show less" : "Read full story"}
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-current opacity-30 transition-opacity duration-300 group-hover:opacity-100" />
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                  />
                </button>
              </>
            )}
          </motion.div>

          {/* ===== Specifications ===== */}
          <motion.div
            {...reveal(0.1)}
            className={`${tile} shadow-sm md:col-span-3 xl:col-span-6 xl:col-start-4 xl:row-start-2 lg:shadow-lg`}
          >
            <dl className="grid h-full sm:grid-cols-2">
              {infoList.map(({ icon, iconDark, title, description }, index) => {
                const lines = String(description)
                  .split("\n")
                  .map((l) => l.trim())
                  .filter(Boolean);
                // Long lists (like Electives) read better on a single wrapped line
                const compact = lines.length > 3;

                return (
                  <div
                    key={title}
                    className={`group relative p-5 ${
                      index % 2 === 0 ? "sm:border-r" : ""
                    } ${index < 2 ? "border-b" : index === 2 ? "border-b sm:border-b-0" : ""} border-black/10 dark:border-white/15`}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-y-4 left-0 w-0.5 origin-top scale-y-0 rounded-full bg-amber-400 transition-transform duration-300 group-hover:scale-y-100 motion-reduce:transition-none"
                    />
                    <dt className="flex items-center gap-3">
                      <Image src={isDarkMode ? iconDark : icon} alt="" className="w-6 shrink-0" sizes="24px" loading="lazy" />
                      <span className="font-semibold leading-6">{title}</span>
                    </dt>
                    <dd className="mt-2 text-sm leading-6 text-gray-600 dark:text-white/70">
                      {compact ? (
                        lines.join("  ·  ")
                      ) : (
                        <ul className="space-y-0.5">
                          {lines.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </motion.div>

          {/* ===== Tools list (dark yellow glow) ===== */}
          <motion.div
            {...reveal(0.1)}
            ref={toolsRef}
            className={`${tile} about-tools-marquee-host p-5 sm:p-6 md:col-span-5 xl:col-span-3 xl:col-start-10 xl:row-span-2 xl:row-start-1 xl:flex xl:flex-col
              lg:shadow-[0_18px_50px_-18px_rgba(180,115,0,0.5)]
              dark:border-amber-500/20
              lg:dark:shadow-[0_18px_60px_-16px_rgba(202,138,4,0.45)]`}
          >
            {/* Dark yellow glow along the top edge */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(202,138,4,0.22),transparent)]"
            />

            <p className="relative pb-4">
              <Label>Tools I use</Label>
            </p>

            {reduce ? (
              <>
                <ul className="relative flex gap-3 overflow-x-auto pb-2 pt-1 xl:hidden">
                  {tools.map((t) => (
                    <ToolPill key={t.name} src={t.src} name={t.name} />
                  ))}
                </ul>
                <div className="relative hidden min-h-0 flex-1 xl:block">
                  <ul className="absolute inset-0 flex flex-col gap-2 overflow-y-auto">
                    {tools.map((t) => (
                      <ToolPill key={t.name} src={t.src} name={t.name} />
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
                {/* Phones: static, manually scrollable tool list */}
                <div className="relative overflow-hidden py-2 lg:hidden">
                  <ul className="flex gap-3 overflow-x-auto pb-2 pt-1">
                    {tools.map((t) => (
                      <ToolPill key={t.name} src={t.src} name={t.name} />
                    ))}
                  </ul>
                </div>

                {/* Tablets: horizontal marquee */}
                <div
                  className={`relative hidden overflow-hidden py-2 lg:block xl:hidden ${
                    inView ? "" : "about-tools-marquee-paused"
                  }`}
                  style={{ maskImage: fadeX, WebkitMaskImage: fadeX }}
                >
                  <div className="about-tools-marquee-x flex w-max">
                    {[0, 1].map((copy) => (
                      <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 gap-3 pr-3">
                        {tools.map((t) => (
                          <ToolPill key={`${t.name}-${copy}`} src={t.src} name={t.name} />
                        ))}
                      </ul>
                    ))}
                  </div>
                </div>

                {/* Desktop: vertical marquee that fills whatever height the row has.
                    It is absolutely positioned, so it never pushes the row taller. */}
                <div className="relative hidden min-h-0 flex-1 xl:block">
                  <div
                    className={`absolute inset-0 overflow-hidden py-2 ${
                      inView ? "" : "about-tools-marquee-paused"
                    }`}
                    style={{ maskImage: fadeY, WebkitMaskImage: fadeY }}
                  >
                    <div className="about-tools-marquee-y flex flex-col">
                      {[0, 1].map((copy) => (
                        <ul
                          key={copy}
                          aria-hidden={copy === 1}
                          className="flex w-full shrink-0 flex-col gap-2 pb-2"
                        >
                          {tools.map((t) => (
                            <ToolPill key={`${t.name}-${copy}`} src={t.src} name={t.name} />
                          ))}
                        </ul>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;