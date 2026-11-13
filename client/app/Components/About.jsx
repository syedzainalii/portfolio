"use client";

import { aboutParagraphs, assets, infoList, toolsData } from "@/assets/assets";
import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "./ThemeProvider";
import SectionPageLink from "./SectionPageLink";

const pad = (n) => String(n).padStart(2, "0");

// Names for the logos in `toolsData`. Keep this list in the SAME ORDER as toolsData in assets.js
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

function Label({ children }) {
  return (
    <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
      {children}
    </p>
  );
}

const About = ({ preview = false }) => {
  const { isDarkMode } = useTheme();
  const reduce = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  });

  const [lead, ...rest] = aboutParagraphs;

  return (
    <section
      id="about"
      className="w-full overflow-x-hidden px-6 py-20 sm:px-10 lg:px-[12%]"
    >
      {/* Heading */}
      <h4 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
        Introduction
      </h4>
      <h2 className="text-center font-Ovo text-4xl sm:text-5xl">About Me</h2>

      <div className="mt-14 grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
        {/* ===== Portrait (sticks while you read) ===== */}
        <motion.div {...reveal()} className="lg:sticky lg:top-28 lg:col-span-4">
          <div className="mx-auto w-64 sm:w-80 lg:w-full">
            {/* Dimension line */}
            <div
              aria-hidden
              className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase leading-4 tracking-[0.25em] text-gray-500 dark:text-white/45"
            >
              <span className="h-2.5 w-px bg-current" />
              <span className="h-px flex-1 bg-current opacity-60" />
              <span>Scale 1:1</span>
              <span className="h-px flex-1 bg-current opacity-60" />
              <span className="h-2.5 w-px bg-current" />
            </div>

            <div className="relative aspect-[4/5]">
              <div
                aria-hidden
                className="absolute -inset-5 rounded-[2.5rem] bg-amber-400/20 blur-3xl dark:bg-amber-400/10"
              />

              <div className="relative h-full overflow-hidden rounded-3xl border border-black/10 bg-gray-200 shadow-2xl dark:border-white/15 dark:bg-darkHover">
                <Image
                  src={assets.user_image}
                  alt="Syed Zain Ali"
                  fill
                  sizes="(min-width: 1024px) 24rem, 20rem"
                  className="object-cover object-top"
                />

                {/* Scan line */}
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-0 h-px bg-amber-400 shadow-[0_0_14px_2px_rgba(251,191,36,0.7)]"
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{
                      duration: 3.6,
                      ease: "linear",
                      repeat: Infinity,
                      repeatDelay: 2.4,
                    }}
                  />
                )}
              </div>

              {/* Corner brackets */}
              <span aria-hidden className="absolute -left-2 -top-2 h-7 w-7 border-l-2 border-t-2 border-amber-400" />
              <span aria-hidden className="absolute -right-2 -top-2 h-7 w-7 border-r-2 border-t-2 border-amber-400" />
              <span aria-hidden className="absolute -bottom-2 -left-2 h-7 w-7 border-b-2 border-l-2 border-amber-400" />
              <span aria-hidden className="absolute -bottom-2 -right-2 h-7 w-7 border-b-2 border-r-2 border-amber-400" />
            </div>

            <p className="mt-4 text-center font-mono text-[10px] uppercase leading-4 tracking-[0.25em] text-gray-500 dark:text-white/45">
              Fig. 02 — Syed Zain Ali
            </p>
          </div>
        </motion.div>

        {/* ===== Content ===== */}
        <div className="lg:col-span-8">
          {/* Bio */}
          <motion.div {...reveal(0.05)}>
            <Label>Profile</Label>
            {lead && (
              <p className="mt-4 font-Ovo text-xl leading-9 text-gray-800 dark:text-white/90 sm:text-2xl">
                {lead}
              </p>
            )}
            <div className="mt-6 space-y-4 font-Ovo text-base leading-8 text-gray-600 dark:text-white/70 sm:text-lg">
              {rest.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          {/* Specifications */}
          <motion.div {...reveal(0.05)} className="mt-14">
            <Label>Specifications</Label>
            <dl className="mt-4 overflow-hidden rounded-2xl border border-black/10 dark:border-white/15">
              {infoList.map(({ icon, iconDark, title, description }, index) => {
                const lines = String(description)
                  .split("\n")
                  .map((l) => l.trim())
                  .filter(Boolean);

                return (
                  <div
                    key={title}
                    className="group relative grid gap-3 border-b border-black/10 p-5 last:border-b-0 dark:border-white/15 sm:grid-cols-[11rem_1fr] sm:gap-6 sm:p-6"
                  >
                    {/* Hover accent */}
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-amber-400 transition-transform duration-300 group-hover:scale-y-100 motion-reduce:transition-none"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 -z-0 bg-black/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-white/[0.04]"
                    />

                    <dt className="relative flex items-center gap-3">
                      <span className="font-mono text-xs tabular-nums text-gray-400 dark:text-white/35">
                        {pad(index + 1)}
                      </span>
                      <Image
                        src={isDarkMode ? iconDark : icon}
                        alt=""
                        className="w-6 shrink-0"
                      />
                      <span className="font-semibold leading-6">{title}</span>
                    </dt>

                    <dd className="relative">
                      <ul className="space-y-1 text-sm leading-6 text-gray-600 dark:text-white/70">
                        {lines.map((line) => (
                          <li key={line} className="flex gap-2">
                            <span aria-hidden className="text-amber-500">
                              ›
                            </span>
                            {line}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </motion.div>

          {/* Toolbox */}
          <motion.div {...reveal(0.05)} className="mt-14">
            <Label>Toolbox</Label>
            <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {toolsData.map((tool, index) => {
                const name = TOOL_NAMES[index] ?? "Tool";
                return (
                  <li
                    key={name + index}
                    className="group flex flex-col items-center gap-2 rounded-2xl border border-black/10 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg dark:border-white/15 motion-reduce:transition-none"
                  >
                    <span className="grid aspect-square w-12 place-items-center rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-black/5 sm:w-14">
                      <Image src={tool} alt={name} className="h-full w-full object-contain" />
                    </span>
                    <span className="text-center text-[11px] font-medium leading-4 text-gray-600 transition-colors duration-300 group-hover:text-black dark:text-white/65 dark:group-hover:text-white">
                      {name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>

      {preview && <SectionPageLink href="/about" label="View all" />}
    </section>
  );
};

export default About;