"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { experienceData } from "@/assets/assets";
import SectionPageLink from "./SectionPageLink";

const pad = (n) => String(n).padStart(2, "0");

// Dial geometry: needle sweeps 240 degrees, from -120 to +120
const START = -120;
const SWEEP = 240;
const polar = (angle, r) => {
  const t = (angle * Math.PI) / 180;
  return { x: 100 + r * Math.sin(t), y: 100 - r * Math.cos(t) };
};
const MINOR_TICKS = Array.from({ length: 41 }, (_, i) => START + i * 6);
const ARC_START = polar(START, 78);
const ARC_END = polar(START + SWEEP, 78);
const ARC_PATH = `M ${ARC_START.x} ${ARC_START.y} A 78 78 0 1 1 ${ARC_END.x} ${ARC_END.y}`;

function Gauge({ progress, count, active }) {
  const smooth = useSpring(progress, { stiffness: 110, damping: 22, mass: 0.5 });
  const needleX = useTransform(smooth, (p) => polar(START + SWEEP * p, 52).x);
  const needleY = useTransform(smooth, (p) => polar(START + SWEEP * p, 52).y);
  const majors = Array.from({ length: count }, (_, i) => START + (SWEEP * (i + 0.5)) / count);

  return (
    <div className="relative mx-auto aspect-square w-48 sm:w-72 lg:w-full lg:max-w-md">
      <div
        aria-hidden
        className="absolute inset-6 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/15"
      />

      <svg
        viewBox="0 0 200 200"
        className="relative h-full w-full"
        role="img"
        aria-label={`Gauge showing operation ${active + 1} of ${count}`}
      >
        {/* Face */}
        <circle
          cx="100"
          cy="100"
          r="99"
          strokeWidth="1"
          className="fill-white/70 stroke-black/10 dark:fill-white/[0.03] dark:stroke-white/15"
        />

        {/* Minor ticks */}
        {MINOR_TICKS.map((angle) => {
          const a = polar(angle, 88);
          const b = polar(angle, 94);
          return (
            <line
              key={angle}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeWidth="1"
              className="stroke-black/20 dark:stroke-white/25"
            />
          );
        })}

        {/* Track + progress arc */}
        <path
          d={ARC_PATH}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-black/10 dark:stroke-white/10"
        />
        <motion.path
          d={ARC_PATH}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-amber-500"
          style={{ pathLength: smooth }}
        />

        {/* Major ticks + labels, one per achievement */}
        {majors.map((angle, i) => {
          const a = polar(angle, 82);
          const b = polar(angle, 96);
          const l = polar(angle, 66);
          const reached = i <= active;
          return (
            <g key={angle}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth="2.5"
                strokeLinecap="round"
                className={reached ? "stroke-amber-500" : "stroke-black/35 dark:stroke-white/40"}
              />
              <text
                x={l.x}
                y={l.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fontFamily="ui-monospace, monospace"
                className={
                  i === active
                    ? "fill-amber-600 font-bold dark:fill-amber-400"
                    : "fill-gray-400 dark:fill-white/35"
                }
              >
                {pad(i + 1)}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        <motion.line
          x1="100"
          y1="100"
          x2={needleX}
          y2={needleY}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-amber-500"
        />
        <circle cx="100" cy="100" r="7" className="fill-amber-500" />
        <circle cx="100" cy="100" r="2.5" className="fill-white dark:fill-darkTheme" />
      </svg>

      {/* Odometer */}
      <div className="absolute inset-x-0 bottom-[8%] flex flex-col items-center">
        <span className="font-mono text-[9px] uppercase leading-4 tracking-[0.25em] text-gray-500 dark:text-white/45">
          Operations
        </span>
        <div className="flex items-baseline gap-1.5 font-mono tabular-nums">
          <span className="relative block h-7 overflow-hidden text-2xl font-semibold leading-7 sm:h-9 sm:text-3xl sm:leading-9">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={active}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="block"
              >
                {pad(active + 1)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="text-sm text-gray-400 dark:text-white/40">/ {pad(count)}</span>
        </div>
      </div>
    </div>
  );
}

function Meta({ exp, index, total }) {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase leading-5 tracking-[0.18em] text-gray-500 dark:text-white/50 lg:justify-start">
      {total > 1 && (
        <span className="text-amber-600 dark:text-amber-400">
          Role {pad(index + 1)}/{pad(total)}
        </span>
      )}
      <span>{exp.company}</span>
      <span className="inline-flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5" />
        {exp.location}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5" />
        {exp.period}
      </span>
    </p>
  );
}

function ReportLink({ href }) {
  return (
    <a href={href} download className="group inline-flex items-center gap-2 text-sm font-medium">
      <span className="relative">
        Download full report
        <span className="absolute -bottom-1 left-0 h-px w-full bg-current opacity-30 transition-opacity duration-300 group-hover:opacity-100" />
      </span>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

/* Scroll-driven version: the gauge stays pinned while you scroll */
function RoleSticky({ exp, index, total, perStep }) {
  const achievements = exp.achievements ?? [];
  const technologies = exp.technologies ?? [];
  const report = exp.report ?? "/report.pdf";
  const count = achievements.length;

  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(count - 1, Math.max(0, Math.floor(v * count))));
  });
  const hint = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  return (
    <div ref={ref} style={{ height: `${count * perStep + 100}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="grid w-full items-center gap-6 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Gauge progress={scrollYProgress} count={count} active={active} />
          </div>

          <div className="text-center lg:col-span-7 lg:text-left">
            <Meta exp={exp} index={index} total={total} />
            <h3 className="mt-3 font-Ovo text-3xl leading-tight sm:text-5xl">{exp.role}</h3>
            <p className="mt-3 hidden max-w-xl text-gray-600 dark:text-white/65 sm:block lg:max-w-lg">
              {exp.description}
            </p>

            <div aria-hidden className="mx-auto mt-6 h-0.5 w-12 rounded-full bg-amber-400 lg:mx-0" />

            <div className="mt-5 min-h-[9rem] sm:min-h-[11.5rem]" aria-live="polite">
              <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
                OP {pad((active + 1) * 10)}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 font-Ovo text-2xl leading-tight sm:text-4xl sm:leading-[1.15]"
                >
                  {achievements[active]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex flex-col items-center gap-4 lg:items-start">
              {technologies.length > 0 && (
                <p className="hidden text-sm leading-7 text-gray-500 dark:text-white/55 sm:block">
                  <span className="font-medium text-gray-800 dark:text-white/85">Worked with </span>
                  {technologies.join("  ·  ")}
                </p>
              )}
              <ReportLink href={report} />
              <motion.p
                style={{ opacity: hint }}
                className="font-mono text-[10px] uppercase leading-4 tracking-[0.25em] text-gray-400 dark:text-white/40"
              >
                Scroll to calibrate ↓
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reduced-motion version: plain, readable, no scroll effects */
function RoleStatic({ exp, index, total }) {
  const achievements = exp.achievements ?? [];
  const technologies = exp.technologies ?? [];
  const report = exp.report ?? "/report.pdf";

  return (
    <article className="py-8">
      <Meta exp={exp} index={index} total={total} />
      <h3 className="mt-3 text-center font-Ovo text-3xl sm:text-5xl lg:text-left">{exp.role}</h3>
      <p className="mt-4 text-gray-600 dark:text-white/65">{exp.description}</p>
      <ol className="mt-8 space-y-4">
        {achievements.map((item, i) => (
          <li key={item} className="flex gap-4 font-Ovo text-xl leading-8">
            <span className="font-mono text-sm leading-8 text-amber-600 dark:text-amber-400">
              {pad(i + 1)}
            </span>
            {item}
          </li>
        ))}
      </ol>
      {technologies.length > 0 && (
        <p className="mt-8 text-sm leading-7 text-gray-500 dark:text-white/55">
          <span className="font-medium text-gray-800 dark:text-white/85">Worked with </span>
          {technologies.join("  ·  ")}
        </p>
      )}
      <div className="mt-6">
        <ReportLink href={report} />
      </div>
    </article>
  );
}

export default function Experience({ preview = false }) {
  const reduce = useReducedMotion();
  const perStep = preview ? 40 : 65; // vh of scrolling per achievement
  const roles = experienceData;

  return (
    <section id="experience" className="w-full py-16 sm:py-20 lg:py-24">
      <div className="site-container">
      <h4 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
        My Journey
      </h4>
      <h2 className="text-center font-Ovo text-4xl sm:text-5xl">Work Experience</h2>
      <p className="mx-auto mb-12 mt-5 max-w-2xl text-center font-Ovo text-gray-600 dark:text-white/70">
        A showcase of my professional growth and the amazing teams I&apos;ve collaborated with
      </p>

      <div>
        {roles.map((exp, i) =>
          reduce || !(exp.achievements ?? []).length ? (
            <RoleStatic key={exp.id} exp={exp} index={i} total={roles.length} />
          ) : (
            <RoleSticky
              key={exp.id}
              exp={exp}
              index={i}
              total={roles.length}
              perStep={perStep}
            />
          )
        )}
      </div>

      {preview && (
        <div>
          <SectionPageLink href="/experience" label="View all" />
        </div>
      )}
      </div>
    </section>
  );
}