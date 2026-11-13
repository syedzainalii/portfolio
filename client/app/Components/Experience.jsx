"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, Download } from "lucide-react";
import { experienceData } from "@/assets/assets";
import SectionPageLink from "./SectionPageLink";

const pad = (n) => String(n).padStart(2, "0");

function Field({ label, value }) {
  return (
    <div className="px-5 py-4">
      <p className="font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium leading-6">{value}</p>
    </div>
  );
}

function Operation({ text, index, isLast, reduce }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -30% 0px" });
  const on = seen || reduce;

  return (
    <li ref={ref} className={`relative pl-14 ${isLast ? "" : "pb-8"}`}>
      {/* Node */}
      <span
        className={`absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full border-2 transition-all duration-500 motion-reduce:transition-none ${
          on
            ? "scale-100 border-amber-400 bg-amber-400 text-black"
            : "scale-90 border-black/20 bg-white text-transparent dark:border-white/25 dark:bg-darkHover"
        }`}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>

      {/* Connector to the next station */}
      {!isLast && (
        <span
          aria-hidden
          className="absolute bottom-0 left-[17px] top-9 w-[2px] bg-black/10 dark:bg-white/15"
        >
          <span
            className={`block h-full w-full origin-top bg-amber-400 transition-transform duration-700 motion-reduce:transition-none ${
              on ? "scale-y-100" : "scale-y-0"
            }`}
          />
        </span>
      )}

      <div className="flex items-center gap-3">
        <span className="font-mono text-xs tracking-widest text-amber-600 dark:text-amber-400">
          OP {pad((index + 1) * 10)}
        </span>
        <span
          className={`rounded border border-emerald-500/50 px-1.5 font-mono text-[10px] leading-4 tracking-wider text-emerald-600 transition-opacity duration-500 dark:text-emerald-400 ${
            on ? "opacity-100 delay-300" : "opacity-0"
          }`}
        >
          QC PASS
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-6 text-gray-700 dark:text-white/75">{text}</p>
    </li>
  );
}

export default function Experience({ preview = false }) {
  const experiences = experienceData;
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  const exp = experiences[active];
  const achievements = exp.achievements ?? [];
  const technologies = exp.technologies ?? [];
  // Add `report: "/your-file.pdf"` to an entry to give it its own document.
  const report = exp.report ?? "/report.pdf";

  const onTabKeys = (e) => {
    if (e.key === "ArrowRight") setActive((i) => (i + 1) % experiences.length);
    if (e.key === "ArrowLeft") setActive((i) => (i - 1 + experiences.length) % experiences.length);
  };

  return (
    <section id="experience" className="w-full px-6 py-20 sm:px-10 lg:px-[12%]">
      {/* Heading */}
      <h4 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
        My Journey
      </h4>
      <h2 className="text-center font-Ovo text-4xl sm:text-5xl">Work Experience</h2>
      <p className="mx-auto mb-12 mt-5 max-w-2xl text-center font-Ovo text-gray-600 dark:text-white/70">
        A showcase of my professional growth and the amazing teams I&apos;ve collaborated with
      </p>

      <div className="mx-auto max-w-6xl">
        {/* Role switcher (only when there is more than one role) */}
        {experiences.length > 1 && (
          <div
            role="tablist"
            aria-label="Work experience"
            onKeyDown={onTabKeys}
            className="mb-6 flex flex-wrap justify-center gap-1 rounded-full border border-black/10 bg-black/[0.03] p-1 dark:border-white/15 dark:bg-white/5 sm:mx-auto sm:w-fit"
          >
            {experiences.map((e, i) => {
              const isActive = i === active;
              return (
                <button
                  key={e.id}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="relative max-w-[16rem] rounded-full px-4 py-2 text-sm font-medium leading-6"
                >
                  {isActive && (
                    <motion.span
                      layoutId="exp-tab"
                      className="absolute inset-0 rounded-full bg-black dark:bg-white"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative z-10 block truncate transition-colors duration-300 ${
                      isActive
                        ? "text-white dark:text-black"
                        : "text-gray-600 hover:text-black dark:text-white/70 dark:hover:text-white"
                    }`}
                  >
                    <span className="mr-2 font-mono text-xs opacity-60">EXP-{pad(i + 1)}</span>
                    {e.company}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.article
            key={exp.id}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl dark:border-white/15 dark:bg-darkHover"
          >
            {/* Faint drafting grid */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.5] dark:opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(120,120,120,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,120,120,0.08) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Top bar */}
            <div className="relative flex items-center justify-between gap-3 border-b border-black/10 bg-black/[0.03] px-5 py-3 dark:border-white/15 dark:bg-white/5">
              <p className="truncate font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-600 dark:text-white/60">
                Route card · EXP-{pad(active + 1)} · Rev A
              </p>
              <motion.span
                initial={reduce ? false : { scale: 1.9, opacity: 0, rotate: -14 }}
                animate={{ scale: 1, opacity: 1, rotate: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.25 }}
                className="shrink-0 rounded border-2 border-emerald-500 px-2 py-0.5 font-mono text-[11px] font-bold uppercase leading-4 tracking-widest text-emerald-600 dark:text-emerald-400"
              >
                Completed
              </motion.span>
            </div>

            {/* Title */}
            <div className="relative flex items-center gap-4 px-5 pb-6 pt-7 sm:px-8">
              <span
                aria-hidden
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-black/10 bg-amber-400/15 text-3xl dark:border-white/15"
              >
                {exp.logo}
              </span>
              <div className="min-w-0">
                <h3 className="font-Ovo text-2xl leading-tight sm:text-3xl">{exp.role}</h3>
                <p className="mt-1 text-base font-medium text-gray-600 dark:text-white/70">
                  {exp.company}
                </p>
              </div>
            </div>

            {/* Fields */}
            <div className="relative grid grid-cols-2 divide-black/10 border-y border-black/10 dark:divide-white/15 dark:border-white/15 sm:grid-cols-4 sm:divide-x [&>*:nth-child(-n+2)]:border-b [&>*:nth-child(-n+2)]:border-black/10 sm:[&>*:nth-child(-n+2)]:border-b-0 dark:[&>*:nth-child(-n+2)]:border-white/15 [&>*:nth-child(odd)]:border-r [&>*:nth-child(odd)]:border-black/10 sm:[&>*:nth-child(odd)]:border-r-0 dark:[&>*:nth-child(odd)]:border-white/15">
              <Field label="Site" value={exp.location} />
              <Field label="Duration" value={exp.period} />
              <Field label="Operations" value={`${pad(achievements.length)} completed`} />
              <Field label="Tooling" value={`${pad(technologies.length)} items`} />
            </div>

            {/* Body */}
            <div className="relative grid gap-10 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:gap-12">
              {/* Left: scope + tooling + attachment */}
              <div className="lg:col-span-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                  Scope of work
                </p>
                <p className="mt-3 text-base leading-7 text-gray-700 dark:text-white/75">
                  {exp.description}
                </p>

                {technologies.length > 0 && (
                  <>
                    <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                      Tooling &amp; processes
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-lg border border-black/15 bg-white/60 px-3 py-1.5 text-xs font-medium leading-5 transition-colors duration-300 hover:border-amber-400 hover:bg-amber-400/15 dark:border-white/20 dark:bg-white/5"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <a
                  href={report}
                  download
                  className="group mt-8 flex items-center justify-between gap-4 rounded-xl border border-dashed border-black/25 px-4 py-3 transition-colors duration-300 hover:border-amber-400 hover:bg-amber-400/10 dark:border-white/25"
                >
                  <span>
                    <span className="block font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
                      Attachment
                    </span>
                    <span className="block text-sm font-medium leading-6">Download full report (PDF)</span>
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/15 transition-all duration-300 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-black dark:border-white/20">
                    <Download className="h-4 w-4" />
                  </span>
                </a>
              </div>

              {/* Right: operations */}
              <div className="lg:col-span-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                  Operations
                </p>
                <ol className="mt-5">
                  {achievements.map((item, i) => (
                    <Operation
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

        {preview && <SectionPageLink href="/experience" label="View all" />}
      </div>
    </section>
  );
}