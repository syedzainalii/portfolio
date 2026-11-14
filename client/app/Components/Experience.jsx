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

/* ---------- Gear geometry (units = % of the square stage) ---------- */
const NA = 40; // teeth on the big gear
const NB = 14; // teeth on the small gear
const M = 1.7; // module (tooth size)
const RA = (NA * M) / 2; // pitch radius, big gear = 34
const RB = (NB * M) / 2; // pitch radius, small gear = 11.9
const OUT_A = RA + M; // outer radius (tooth tips)
const OUT_B = RB + M;
const BETA = 20; // direction from the big gear to the small one (deg, clockwise from +x)
const DIST = RA + RB; // centre distance for perfect meshing
const CA = { x: 38, y: 56 };
const CB = {
  x: CA.x + DIST * Math.cos((BETA * Math.PI) / 180),
  y: CA.y + DIST * Math.sin((BETA * Math.PI) / 180),
};
const STATION_R = 25; // radius of the ring of numbered stations

function gearPath(teeth, pitchR) {
  const tip = pitchR + M;
  const root = pitchR - 1.25 * M;
  const p = (2 * Math.PI) / teeth;
  let d = "";
  for (let k = 0; k < teeth; k++) {
    const c = k * p;
    const pts = [
      [c - 0.27 * p, root],
      [c - 0.15 * p, tip],
      [c + 0.15 * p, tip],
      [c + 0.27 * p, root],
    ];
    pts.forEach(([a, r], i) => {
      d += `${k === 0 && i === 0 ? "M" : "L"}${(r * Math.cos(a)).toFixed(3)} ${(r * Math.sin(a)).toFixed(3)} `;
    });
  }
  return `${d}Z`;
}

const PATH_A = gearPath(NA, RA);
const PATH_B = gearPath(NB, RB);

function GearSvg({ path, outer, hub, className }) {
  return (
    <svg
      viewBox={`${-outer} ${-outer} ${outer * 2} ${outer * 2}`}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <path d={path} className={className} strokeWidth="1.25" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      <circle r={hub} fill="none" className="stroke-current opacity-40" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Gears({ progress, count, active }) {
  const step = 360 / count;

  // 0 -> count-1 as you scroll, smoothed with a spring
  const t = useTransform(progress, [0, 1], [0, Math.max(count - 1, 0)]);
  const tSpring = useSpring(t, { stiffness: 90, damping: 22, mass: 0.6 });
  const theta = useTransform(tSpring, (v) => -v * step);

  // Rotations that keep the teeth correctly meshed
  const rotA = useTransform(theta, (v) => BETA + v);
  const rotB = useTransform(theta, (v) => BETA + 180 + 180 / NB - (v * NA) / NB);
  const labelRot = useTransform(rotA, (v) => -v);

  return (
    <div className="relative mx-auto aspect-square w-[min(100%,22svh)] sm:w-[min(100%,26svh)] lg:w-[min(100%,70vh)]">
      <div
        aria-hidden
        className="absolute inset-[10%] rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/15"
      />

      {/* Small gear */}
      <motion.div
        style={{
          rotate: rotB,
          left: `${CB.x - OUT_B}%`,
          top: `${CB.y - OUT_B}%`,
          width: `${OUT_B * 2}%`,
          height: `${OUT_B * 2}%`,
        }}
        className="absolute text-gray-700 dark:text-white"
      >
        <GearSvg
          path={PATH_B}
          outer={OUT_B}
          hub={3.2}
          className="fill-black/5 stroke-black/35 dark:fill-white/5 dark:stroke-white/35"
        />
      </motion.div>

      {/* Big gear with the numbered stations */}
      <motion.div
        style={{
          rotate: rotA,
          left: `${CA.x - OUT_A}%`,
          top: `${CA.y - OUT_A}%`,
          width: `${OUT_A * 2}%`,
          height: `${OUT_A * 2}%`,
        }}
        className="absolute text-gray-700 dark:text-white"
      >
        <GearSvg
          path={PATH_A}
          outer={OUT_A}
          hub={14}
          className="fill-amber-400/10 stroke-amber-600/70 dark:fill-amber-400/[0.06] dark:stroke-amber-400/60"
        />

        {Array.from({ length: count }, (_, i) => {
          const a = ((-90 + i * step - BETA) * Math.PI) / 180;
          const ring = (STATION_R / OUT_A) * 50;
          const on = i === active;
          return (
            <span
              key={i}
              style={{
                left: `${50 + ring * Math.cos(a)}%`,
                top: `${50 + ring * Math.sin(a)}%`,
              }}
              className={`absolute grid aspect-square w-[17%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 transition-colors duration-300 ${
                on
                  ? "border-amber-500 bg-amber-400 text-black shadow-[0_0_18px_rgba(251,191,36,0.6)]"
                  : "border-black/25 bg-white text-gray-500 dark:border-white/30 dark:bg-darkHover dark:text-white/60"
              }`}
            >
              <motion.span
                style={{ rotate: labelRot }}
                className="font-mono text-[10px] font-semibold leading-none sm:text-xs"
              >
                {pad(i + 1)}
              </motion.span>
            </span>
          );
        })}
      </motion.div>

      {/* Pointer */}
      <svg
        aria-hidden
        viewBox="0 0 20 16"
        className="absolute z-10 w-[6%] -translate-x-1/2 drop-shadow"
        style={{ left: `${CA.x}%`, top: `${CA.y - OUT_A - 3}%` }}
      >
        <path d="M2 2 H18 L10 15 Z" className="fill-amber-500" />
      </svg>

      {/* Hub readout */}
      <div
        className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        style={{ left: `${CA.x}%`, top: `${CA.y}%` }}
      >
        <span className="font-mono text-[9px] uppercase leading-4 tracking-[0.25em] text-gray-500 dark:text-white/45">
          Operation
        </span>
        <div className="flex items-baseline gap-1 font-mono tabular-nums">
          <span className="relative block h-7 overflow-hidden text-2xl font-semibold leading-7 sm:h-9 sm:text-4xl sm:leading-9">
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
          <span className="text-xs text-gray-400 dark:text-white/40">/ {pad(count)}</span>
        </div>
      </div>

      <p className="absolute inset-x-0 bottom-0 text-center font-mono text-[10px] uppercase leading-4 tracking-[0.25em] text-gray-400 dark:text-white/40">
        Gear train · {NA}:{NB} · scroll to turn
      </p>
    </div>
  );
}

function Meta({ exp, index, total }) {
  return (
    <p className="flex min-w-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 break-words font-mono text-[11px] uppercase leading-5 tracking-[0.18em] text-gray-500 dark:text-white/50 lg:justify-start">
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
    <a href={href} download className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium lg:min-h-0">
      <span className="relative">
        Download full report
        <span className="absolute -bottom-1 left-0 h-px w-full bg-current opacity-30 transition-opacity duration-300 group-hover:opacity-100" />
      </span>
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

/* Scroll-driven version: the gears stay pinned while you scroll */
function RoleSticky({ exp, index, total, perStep }) {
  const achievements = exp.achievements ?? [];
  const technologies = exp.technologies ?? [];
  const report = exp.report ?? "/report.pdf";
  const count = achievements.length;

  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(count - 1, Math.max(0, Math.round(v * (count - 1)))));
  });
  const hint = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  return (
    <div ref={ref} style={{ height: `${count * perStep + 100}vh` }} className="relative">
      <div className="sticky top-14 flex h-[calc(100svh-3.5rem)] items-center sm:top-16 sm:h-[calc(100svh-4rem)] md:top-20 md:h-[calc(100svh-5rem)] lg:top-0 lg:h-screen">
        <div className="grid w-full items-center gap-4 pt-3 sm:pt-4 lg:grid-cols-12 lg:gap-14 lg:pt-20">
          <div className="lg:col-span-5">
            <Gears progress={scrollYProgress} count={count} active={active} />
          </div>

          <div className="text-center lg:col-span-7 lg:text-left">
            <Meta exp={exp} index={index} total={total} />
            <h3 className="mt-3 break-words font-Ovo text-3xl leading-tight md:text-4xl lg:text-5xl">{exp.role}</h3>
            <p className="mt-3 hidden max-w-xl text-gray-600 dark:text-white/65 lg:block lg:max-w-lg">
              {exp.description}
            </p>

            <div aria-hidden className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-amber-400 sm:mt-6 lg:mx-0" />

            <div className="mt-3 sm:mt-5 lg:min-h-[11.5rem]" aria-live="polite">
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
                  className="mt-2 break-words font-Ovo text-xl leading-tight sm:text-2xl md:text-3xl lg:text-4xl lg:leading-[1.15]"
                >
                  {achievements[active]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-3 flex flex-col items-center gap-4 sm:mt-4 lg:items-start">
              {technologies.length > 0 && (
                <p className="hidden text-sm leading-7 text-gray-500 dark:text-white/55 lg:block">
                  <span className="font-medium text-gray-800 dark:text-white/85">Worked with </span>
                  {technologies.join("  ·  ")}
                </p>
              )}
              <ReportLink href={report} />
              <motion.p
                style={{ opacity: hint }}
                className="hidden font-mono text-[10px] uppercase leading-4 tracking-[0.25em] text-gray-400 dark:text-white/40 sm:block"
              >
                Scroll to turn the gears ↓
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
    <section id="experience" className="w-full py-14 sm:py-20 lg:py-24">
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