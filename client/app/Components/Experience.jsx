"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Cog,
  Download,
  ListChecks,
  MapPin,
  Wrench,
} from "lucide-react";
import { experienceData } from "@/assets/assets";

const pad = (n) => String(n).padStart(2, "0");
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Splits "Studied the pipeline project lifecycle, from..." into
// a tag ("Studied"), a headline ("The pipeline project lifecycle") and the full sentence
function parseHighlight(text) {
  const words = String(text).split(" ");
  if (words.length <= 5) return { verb: null, head: cap(text), body: "" };

  const verb = words[0];
  const take = [];
  for (let k = 1; k <= 4 && k < words.length; k++) {
    const w = words[k];
    if (/[,;:]$/.test(w)) {
      take.push(w.replace(/[,;:]$/, ""));
      break;
    }
    take.push(w);
  }
  return { verb: verb.replace(/[,;:]$/, ""), head: cap(take.join(" ")), body: text };
}

// Card widths on large screens (12-column grid on desktop uses 6 columns here)
function spanFor(i, n) {
  if (n === 5) return i < 2 ? "lg:col-span-3" : "lg:col-span-2";
  if (n % 2 === 1 && i === n - 1) return "sm:col-span-2 lg:col-span-6";
  return "lg:col-span-3";
}

/* ---------- "Full journey" button (landing page only) ---------- */
function FullJourneyLink() {
  return (
    <Link
      href="/experience"
      aria-label="See the full experience page"
      className="group inline-flex w-fit shrink-0 items-center gap-2.5 rounded-full border border-amber-400/60 bg-amber-400/10 py-1.5 pl-4 pr-1.5 text-sm font-medium leading-6 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400 hover:text-black hover:shadow-[0_10px_26px_-10px_rgba(202,138,4,0.8)]"
    >
      <Cog className="h-4 w-4 text-amber-600 transition-transform duration-700 group-hover:rotate-180 group-hover:text-black dark:text-amber-400 dark:group-hover:text-black" />
      Full journey
      <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-400 text-black transition-colors duration-300 group-hover:bg-black group-hover:text-amber-400">
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
      className="flex min-w-0 max-w-full snap-x gap-1 overflow-x-auto rounded-full border border-black/10 bg-black/[0.03] p-1 [scrollbar-width:none] dark:border-white/15 dark:bg-white/5 [&::-webkit-scrollbar]:hidden"
    >
      {roles.map((r, i) => {
        const isActive = i === value;
        return (
          <button
            key={r.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(i)}
            className={`min-h-11 shrink-0 snap-start rounded-full px-4 py-2 text-sm font-medium leading-6 transition-colors duration-300 lg:min-h-0 ${
              isActive
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "text-gray-600 hover:text-black dark:text-white/70 dark:hover:text-white"
            }`}
          >
            <span className="mr-2 font-mono text-[10px] opacity-60">{pad(i + 1)}</span>
            {/* Add `shortName: "..."` to an entry in assets.js to customize this label */}
            <span className="inline-block max-w-[60vw] truncate align-bottom sm:max-w-none">
              {r.shortName ?? r.role}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- One tile in the "at a glance" row ---------- */
function Glance({ icon: Icon, label, value, className = "" }) {
  return (
    <div
      className={`flex min-w-0 items-center gap-3.5 rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/15 dark:bg-darkHover ${className}`}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-600 dark:text-amber-400">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
          {label}
        </p>
        <p className="break-words text-base font-semibold leading-6">{value}</p>
      </div>
    </div>
  );
}

/* ---------- One highlight card ---------- */
function HighlightCard({ text, index, total, reduce }) {
  const { verb, head, body } = parseHighlight(text);
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 5) * 0.06, ease: "easeOut" }}
      className={`group relative min-w-0 overflow-hidden rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/70 hover:shadow-xl dark:border-white/15 dark:bg-darkHover sm:p-6 ${spanFor(
        index,
        total
      )}`}
    >
      {/* Accent line that grows on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-[0.18] bg-amber-400 transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
      />

      {/* Big faint number */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-1 -top-3 select-none font-mono text-7xl font-bold leading-none text-amber-400/15 sm:text-8xl"
      >
        {pad(index + 1)}
      </span>

      <div className="relative">
        {verb && (
          <span className="inline-block rounded-full bg-amber-400 px-3 py-0.5 font-mono text-[11px] font-bold uppercase leading-5 tracking-[0.15em] text-black">
            {verb}
          </span>
        )}

        <h4 className={`break-words font-Ovo text-xl leading-snug sm:text-2xl ${verb ? "mt-3" : ""}`}>
          {head}
        </h4>

        {body && (
          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-white/60">{body}</p>
        )}
      </div>
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

  // At-a-glance tiles (Tooling only shows when the role has tools)
  const glance = [
    { icon: Building2, label: "Company", value: exp.company },
    { icon: MapPin, label: "Site", value: exp.location },
    { icon: CalendarDays, label: "Duration", value: exp.period },
    { icon: ListChecks, label: "Highlights", value: `${pad(achievements.length)} completed` },
    ...(technologies.length > 0
      ? [{ icon: Wrench, label: "Tooling", value: `${pad(technologies.length)} items` }]
      : []),
  ];
  // On phones the company tile is full width, and an odd last tile fills the row
  const restCount = glance.length - 1;

  return (
    <section id="experience" className="w-full py-14 sm:py-20 lg:py-24">
      <div className="site-container">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
          My Journey
        </h4>
        <h2 className="font-Ovo text-4xl sm:text-5xl">Work Experience</h2>

        {/* Tabs + button */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mt-10">
          <RoleTabs roles={roles} value={roleIndex} onChange={setRoleIndex} />
          {preview && <FullJourneyLink />}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={exp.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-5 space-y-4"
          >
            {/* ===== Top tile: the role ===== */}
            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-amber-400/15 via-white to-white p-6 shadow-lg dark:border-white/15 dark:from-amber-400/10 dark:via-darkHover dark:to-darkHover sm:p-8 lg:p-10">
              <Cog
                aria-hidden
                strokeWidth={1}
                className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 text-amber-400/15 sm:h-96 sm:w-96"
              />

              <div className="relative flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-600 dark:text-white/60">
                  Route sheet · EXP-{pad(roleIndex + 1)}
                </p>
                <span className="rounded border-2 border-emerald-500 px-2 py-0.5 font-mono text-[11px] font-bold uppercase leading-4 tracking-widest text-emerald-600 dark:text-emerald-400">
                  Completed
                </span>
              </div>

              <h3 className="relative mt-5 break-words font-Ovo text-3xl leading-[1.1] sm:text-5xl lg:text-6xl">
                {exp.role}
              </h3>

              <div className="relative mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                <p className="max-w-2xl text-base leading-7 text-gray-600 dark:text-white/70 sm:text-lg sm:leading-8">
                  {exp.description}
                </p>

                <a
                  href={report}
                  download
                  className="group inline-flex w-fit shrink-0 items-center gap-2.5 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400 hover:text-black hover:shadow-[0_12px_30px_-10px_rgba(202,138,4,0.8)] dark:bg-white dark:text-black dark:hover:bg-amber-400"
                >
                  Download report
                  <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </div>

              {technologies.length > 0 && (
                <ul className="relative mt-6 flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-black/15 bg-white/60 px-3 py-1 text-xs font-medium leading-5 text-gray-700 dark:border-white/20 dark:bg-white/5 dark:text-white/80"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ===== At a glance ===== */}
            <div className="grid grid-cols-2 gap-3 lg:flex lg:gap-4">
              {glance.map((g, i) => (
                <Glance
                  key={g.label}
                  icon={g.icon}
                  label={g.label}
                  value={g.value}
                  className={`${
                    i === 0
                      ? "col-span-2 lg:flex-[1.8]"
                      : i === glance.length - 1 && restCount % 2 === 1
                      ? "col-span-2 lg:col-span-1 lg:flex-1"
                      : "lg:flex-1"
                  }`}
                />
              ))}
            </div>

            {/* ===== Highlights ===== */}
            <div>
              <p className="mb-3 mt-6 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
                Key highlights · {pad(achievements.length)}
              </p>
              <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                {achievements.map((item, i) => (
                  <HighlightCard
                    key={item}
                    text={item}
                    index={i}
                    total={achievements.length}
                    reduce={reduce}
                  />
                ))}
              </ol>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}