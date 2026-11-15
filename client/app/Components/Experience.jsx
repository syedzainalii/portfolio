"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Download } from "lucide-react";
import { experienceData } from "@/assets/assets";

const pad = (n) => String(n).padStart(2, "0");

// Splits a highlight into a bold opening phrase and the rest of the sentence
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
  const lead = words.slice(0, n).join(" ").replace(/[,;:]$/, "");
  const rest = words.slice(n).join(" ");
  const joiner = /[,;:]$/.test(words[n - 1]) ? words[n - 1].slice(-1) : "";
  return { lead: lead + joiner, rest: ` ${rest}` };
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

/* ---------- One plain row in the facts list ---------- */
function Fact({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-black/10 py-3 dark:border-white/15">
      <dt className="shrink-0 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
        {label}
      </dt>
      <dd className="min-w-0 break-words text-right text-base font-medium leading-6">{value}</dd>
    </div>
  );
}

/* ---------- One objective ---------- */
function Objective({ text, index, reduce }) {
  const { lead, rest } = splitHighlight(text);
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 4) * 0.05, ease: "easeOut" }}
      className="group/item relative grid grid-cols-[3rem_1fr] gap-x-3 border-t border-black/10 py-6 transition-opacity duration-300 first:border-t-0 first:pt-0 hover:opacity-100! group-hover/list:opacity-35 dark:border-white/15 sm:grid-cols-[4.5rem_1fr] sm:gap-x-6 sm:py-8"
    >
      {/* Amber marker that draws in on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-amber-400 transition-transform duration-500 group-hover/item:scale-x-100 motion-reduce:transition-none"
      />

      <span className="font-mono text-3xl font-light leading-none tabular-nums text-amber-500 sm:text-5xl">
        {pad(index + 1)}
      </span>

      <p className="min-w-0 break-words text-lg leading-8 text-gray-500 dark:text-white/55 sm:text-xl sm:leading-9">
        <span className="font-Ovo text-2xl leading-9 text-black dark:text-white sm:text-3xl sm:leading-10">
          {lead}
        </span>
        {rest}
      </p>
    </motion.li>
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
            className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-16"
          >
            {/* ===== Left: the role ===== */}
            <div className="min-w-0 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
              <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
                {exp.company}
              </p>
              <h3 className="mt-3 break-words font-Ovo text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
                {exp.role}
              </h3>

              <p className="mt-5 text-base leading-7 text-gray-600 dark:text-white/65">
                {exp.description}
              </p>

              <dl className="mt-8">
                <Fact label="Company" value={exp.company} />
                <Fact label="Site" value={exp.location} />
                <Fact label="Duration" value={exp.period} />
                <Fact label="Highlights" value={`${pad(achievements.length)} completed`} />
                <div className="border-t border-black/10 dark:border-white/15" />
              </dl>

              {technologies.length > 0 && (
                <p className="mt-5 text-sm leading-7 text-gray-500 dark:text-white/55">
                  <span className="font-medium text-black dark:text-white">Tooling </span>
                  {technologies.join("  ·  ")}
                </p>
              )}

              <a
                href={report}
                download
                className="group mt-7 inline-flex items-center gap-2 text-sm font-medium"
              >
                <Download className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="relative">
                  Download full report
                  <span className="absolute -bottom-1 left-0 h-px w-full bg-current opacity-30 transition-opacity duration-300 group-hover:opacity-100" />
                </span>
              </a>
            </div>

            {/* ===== Right: the objectives ===== */}
            <div className="min-w-0 lg:col-span-7">
              <p className="mb-6 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
                What I worked on · {pad(achievements.length)}
              </p>
              <ol className="group/list">
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