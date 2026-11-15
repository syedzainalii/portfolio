"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Download } from "lucide-react";
import { experienceData } from "@/assets/assets";

const pad = (n) => String(n).padStart(2, "0");

// Splits a highlight into an opening phrase (highlighted) and the rest of the sentence
function splitHighlight(text) {
  const words = String(text).split(" ");
  if (words.length <= 5) return { lead: text, rest: "" };

  let n = 4;
  for (let k = 1; k < Math.min(words.length, 7); k++) {
    if (/[,;:]$/.test(words[k])) {
      n = k + 1;
      break;
    }
  }
  return {
    lead: words.slice(0, n).join(" "),
    rest: ` ${words.slice(n).join(" ")}`,
  };
}

/* ---------- "Full journey" link (landing page only) ---------- */
function FullJourneyLink() {
  return (
    <Link
      href="/experience"
      aria-label="See the full experience page"
      className="group inline-flex w-fit shrink-0 items-center gap-3 text-sm font-medium"
    >
      <span className="relative">
        Full journey
        <span className="absolute -bottom-1 left-0 h-px w-full bg-current opacity-30 transition-opacity duration-300 group-hover:opacity-100" />
      </span>
      <span className="grid h-9 w-9 place-items-center rounded-full border border-black/15 transition-all duration-300 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-black dark:border-white/20">
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* ---------- Role switcher (only when there are 2+ roles) ---------- */
function RoleTabs({ roles, value, onChange }) {
  if (roles.length < 2) return <div />;
  return (
    <div
      role="tablist"
      aria-label="Work experience roles"
      className="flex min-w-0 max-w-full snap-x gap-6 overflow-x-auto [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden"
    >
      {roles.map((r, i) => {
        const isActive = i === value;
        return (
          <button
            key={r.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(i)}
            className={`relative min-h-11 shrink-0 snap-start whitespace-nowrap border-b-2 pb-2 text-sm font-medium leading-6 transition-colors duration-300 ${
              isActive
                ? "border-amber-400 text-black dark:text-white"
                : "border-transparent text-gray-500 hover:text-black dark:text-white/50 dark:hover:text-white"
            }`}
          >
            <span className="mr-2 font-mono text-[10px] opacity-60">{pad(i + 1)}</span>
            {/* Add `shortName: "..."` to an entry in assets.js to customize this label */}
            <span className="inline-block max-w-[70vw] truncate align-bottom sm:max-w-none">
              {r.shortName ?? r.role}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- One fact in the left panel ---------- */
function Fact({ label, value, wide = false }) {
  return (
    <div className={`min-w-0 ${wide ? "col-span-2" : ""}`}>
      <dt className="font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
        {label}
      </dt>
      <dd className="mt-1 break-words text-base font-semibold leading-6">{value}</dd>
    </div>
  );
}

/* ---------- One objective on the timeline ---------- */
function Objective({ text, index, reduce }) {
  const { lead, rest } = splitHighlight(text);

  return (
    <li className="group/item relative py-6 transition-opacity duration-300 hover:opacity-100! group-hover/list:opacity-40 sm:py-8">
      {/* Dot on the rail: turns amber when it scrolls into view */}
      <motion.span
        aria-hidden
        initial={reduce ? false : { scale: 0.6, backgroundColor: "rgba(150,150,150,0.45)" }}
        whileInView={{ scale: 1, backgroundColor: "#fbbf24" }}
        viewport={{ once: true, margin: "-30% 0px -30% 0px" }}
        transition={{ duration: 0.35 }}
        className="absolute -left-6 top-9 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-white dark:ring-darkTheme sm:-left-10 sm:top-12"
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="grid grid-cols-[2.75rem_1fr] gap-x-3 sm:grid-cols-[5rem_1fr] sm:gap-x-6"
      >
        {/* Outlined numeral that fills on hover */}
        <span
          aria-hidden
          className="select-none font-mono text-4xl font-bold leading-none tabular-nums text-transparent transition-colors duration-300 group-hover/item:text-amber-400 sm:text-6xl"
          style={{ WebkitTextStroke: "1.5px #f59e0b" }}
        >
          {pad(index + 1)}
        </span>

        <p className="min-w-0 break-words text-lg leading-8 text-gray-500 dark:text-white/55 sm:text-xl sm:leading-9">
          <span className="bg-[linear-gradient(transparent_62%,rgba(251,191,36,0.4)_62%)] font-Ovo text-2xl leading-9 text-black [box-decoration-break:clone] dark:text-white sm:text-3xl sm:leading-10">
            {lead}
          </span>
          {rest}
        </p>
      </motion.div>
    </li>
  );
}

export default function Experience({ preview = false }) {
  const reduce = useReducedMotion();
  const roles = experienceData;
  const [roleIndex, setRoleIndex] = useState(0);

  const exp = roles[roleIndex];
  const achievements = exp.achievements ?? [];
  const technologies = exp.technologies ?? [];
  // Add `report: "/your-file.pdf"` to an entry in assets.js to give it its own document
  const report = exp.report ?? "/report.pdf";

  return (
    <section id="experience" className="w-full py-14 sm:py-20 lg:py-24">
      <div className="site-container">
        {/* Header row */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
              My Journey
            </h4>
            <h2 className="font-Ovo text-4xl sm:text-5xl">Work Experience</h2>
          </div>
          {preview && <FullJourneyLink />}
        </div>

        <div className="mt-10 lg:mt-12">
          <RoleTabs roles={roles} value={roleIndex} onChange={setRoleIndex} />
          <div className="border-t border-black/10 dark:border-white/15" />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={exp.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14"
          >
            {/* ===== Left: the role (pinned on desktop) ===== */}
            <div className="min-w-0 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
              <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-amber-400/15 via-white to-white p-6 shadow-lg dark:border-white/15 dark:from-amber-400/10 dark:via-darkHover dark:to-darkHover sm:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.28),transparent_70%)]"
                />

                <h3 className="relative break-words font-Ovo text-4xl leading-[1.08] sm:text-5xl">
                  {exp.role}
                </h3>

                <dl className="relative mt-7 grid grid-cols-2 gap-x-6 gap-y-5">
                  <Fact label="Company" value={exp.company} wide />
                  <Fact label="Site" value={exp.location} />
                  <Fact label="Duration" value={exp.period} />
                  <Fact label="Highlights" value={`${pad(achievements.length)} completed`} />
                  {technologies.length > 0 && (
                    <Fact label="Tooling" value={`${pad(technologies.length)} items`} />
                  )}
                </dl>

                <p className="relative mt-7 text-base leading-7 text-gray-600 dark:text-white/65">
                  {exp.description}
                </p>

                {technologies.length > 0 && (
                  <p className="relative mt-4 text-sm leading-7 text-gray-500 dark:text-white/55">
                    {technologies.join("  ·  ")}
                  </p>
                )}

                <a
                  href={report}
                  download
                  className="group relative mt-7 inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400 hover:text-black hover:shadow-[0_12px_30px_-10px_rgba(202,138,4,0.8)] dark:bg-white dark:text-black dark:hover:bg-amber-400"
                >
                  Download report
                  <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </div>
            </div>

            {/* ===== Right: the objectives on a timeline ===== */}
            <div className="min-w-0 lg:col-span-7">
              <p className="mb-2 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
                What I worked on · {pad(achievements.length)}
              </p>
              <ol className="group/list relative ml-1.5 border-l border-black/15 pl-6 dark:border-white/20 sm:pl-10">
                {achievements.map((item, i) => (
                  <Objective key={item} text={item} index={i} reduce={reduce} />
                ))}
              </ol>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}