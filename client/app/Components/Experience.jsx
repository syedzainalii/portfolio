"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  Cog,
  ListChecks,
  MapPin,
  Wrench,
} from "lucide-react";
import { experienceData } from "@/assets/assets";

const pad = (n) => String(n).padStart(2, "0");

// Bold the first few words of a highlight, so skimmers can read just those
function splitLead(text, n = 3) {
  const words = String(text).split(" ");
  if (words.length <= n + 1) return { lead: text, rest: "" };
  return { lead: words.slice(0, n).join(" "), rest: ` ${words.slice(n).join(" ")}` };
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

/* ---------- One box in the "at a glance" strip ---------- */
function Glance({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0 p-4 sm:p-5">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
        <Icon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
        {label}
      </p>
      <p className="mt-1.5 break-words text-lg font-semibold leading-6 sm:text-xl sm:leading-7">
        {value}
      </p>
    </div>
  );
}

/* ---------- One achievement row ---------- */
function Highlight({ text, index, isLast, reduce }) {
  const { lead, rest } = splitLead(text);
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 5) * 0.05, ease: "easeOut" }}
      className={`group relative pl-14 sm:pl-16 ${isLast ? "" : "pb-7"}`}
    >
      {/* Connecting line */}
      {!isLast && (
        <span
          aria-hidden
          className="absolute bottom-0 left-[19px] top-10 w-0.5 bg-gradient-to-b from-amber-400/70 to-amber-400/20 sm:left-[21px]"
        />
      )}

      {/* Node */}
      <span
        aria-hidden
        className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border-2 border-amber-400 bg-white font-mono text-sm font-bold text-amber-600 transition-colors duration-300 group-hover:bg-amber-400 group-hover:text-black dark:bg-darkHover dark:text-amber-400 dark:group-hover:text-black sm:h-11 sm:w-11"
      >
        {pad(index + 1)}
      </span>

      <p className="text-lg leading-7 text-gray-600 dark:text-white/65 sm:text-xl sm:leading-8">
        <strong className="font-semibold text-black dark:text-white">{lead}</strong>
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
            className="mt-5 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl dark:border-white/15 dark:bg-darkHover"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-black/[0.03] px-5 py-3 dark:border-white/15 dark:bg-white/5 sm:px-8">
              <p className="min-w-0 truncate font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-600 dark:text-white/60">
                Route sheet · EXP-{pad(roleIndex + 1)}
              </p>
              <span className="shrink-0 rounded border-2 border-emerald-500 px-2 py-0.5 font-mono text-[11px] font-bold uppercase leading-4 tracking-widest text-emerald-600 dark:text-emerald-400">
                Completed
              </span>
            </div>

            {/* At a glance */}
            <div className="grid grid-cols-2 border-b border-black/10 dark:border-white/15 lg:grid-cols-4 [&>*:nth-child(2n)]:border-l [&>*:nth-child(n+3)]:border-t lg:[&>*:nth-child(n+3)]:border-t-0 lg:[&>*:nth-child(n+2)]:border-l [&>*]:border-black/10 dark:[&>*]:border-white/15">
              <Glance icon={MapPin} label="Site" value={exp.location} />
              <Glance icon={CalendarDays} label="Duration" value={exp.period} />
              <Glance icon={ListChecks} label="Highlights" value={`${pad(achievements.length)} completed`} />
              <Glance icon={Wrench} label="Tooling" value={`${pad(technologies.length)} items`} />
            </div>

            {/* Body */}
            <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-12 lg:gap-14">
              {/* Left: who / what */}
              <div className="min-w-0 lg:col-span-5">
                <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
                  {exp.company}
                </p>
                <h3 className="mt-2 break-words font-Ovo text-3xl leading-tight sm:text-4xl lg:text-5xl">
                  {exp.role}
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-white/65">
                  {exp.description}
                </p>

                {technologies.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-black/15 px-3 py-1 text-xs font-medium leading-5 text-gray-700 transition-colors duration-300 hover:border-amber-400 hover:bg-amber-400/15 dark:border-white/20 dark:text-white/80"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}

                <a
                  href={report}
                  download
                  className="group mt-6 inline-flex items-center gap-2 text-sm font-medium"
                >
                  <span className="relative">
                    Download full report
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-current opacity-30 transition-opacity duration-300 group-hover:opacity-100" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>

              {/* Right: the highlights, all visible at once */}
              <div className="min-w-0 lg:col-span-7">
                <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
                  Key highlights
                </p>
                <ol className="mt-5">
                  {achievements.map((item, i) => (
                    <Highlight
                      key={item}
                      text={item}
                      index={i}
                      isLast={i === achievements.length - 1}
                      reduce={reduce}
                    />
                  ))}
                </ol>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}