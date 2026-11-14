"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, CalendarDays, Cog, MapPin } from "lucide-react";
import { experienceData } from "@/assets/assets";

const pad = (n) => String(n).padStart(2, "0");

/* ---------- Gear geometry (units = % of the square stage) ---------- */
const NA = 40; // teeth on the big gear
const NB = 14; // teeth on the small gear
const M = 1.7; // module (tooth size)
const RA = (NA * M) / 2;
const RB = (NB * M) / 2;
const OUT_A = RA + M; // outer radius (tooth tips)
const OUT_B = RB + M;
const BETA = 20; // direction from the big gear to the small one
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
    <div className="relative mx-auto aspect-square w-[min(100%,38vh)] lg:w-[min(100%,70vh)]">
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
          hub={15}
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

      {/* Pointer on the gear */}
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
        <span className="hidden font-mono text-[11px] uppercase leading-4 tracking-[0.3em] text-amber-600 dark:text-amber-400 lg:block">
          Operation
        </span>
        <span className="relative block h-10 overflow-hidden sm:h-12 lg:h-24">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={active}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="block bg-gradient-to-b from-amber-400 to-amber-600 bg-clip-text font-mono text-4xl font-bold leading-10 tabular-nums text-transparent sm:text-5xl sm:leading-[3rem] lg:text-7xl lg:leading-[6rem]"
            >
              {pad(active + 1)}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="hidden font-mono text-sm leading-5 tracking-widest text-gray-500 dark:text-white/50 lg:block">
          of {pad(count)}
        </span>
      </div>

      <p className="absolute inset-x-0 bottom-0 text-center font-mono text-[10px] uppercase leading-4 tracking-[0.25em] text-gray-400 dark:text-white/40">
        Gear train · {NA}:{NB} · scroll to turn
      </p>
    </div>
  );
}

/* ---------- "Full journey" button (landing page only) ---------- */
function FullJourneyLink() {
  return (
    <Link
      href="/experience"
      aria-label="See the full experience page"
      className="group ml-auto inline-flex shrink-0 items-center gap-2.5 rounded-full border border-amber-400/60 bg-amber-400/10 py-1.5 pl-4 pr-1.5 text-sm font-medium leading-6 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400 hover:text-black hover:shadow-[0_10px_26px_-10px_rgba(202,138,4,0.8)]"
    >
      <Cog className="h-4 w-4 text-amber-600 transition-transform duration-700 group-hover:rotate-180 group-hover:text-black dark:text-amber-400 dark:group-hover:text-black" />
      <span className="hidden sm:inline">Full journey</span>
      <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-400 text-black transition-colors duration-300 group-hover:bg-black group-hover:text-amber-400">
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* ---------- Role switcher ---------- */
function RoleTabs({ roles, value, onChange }) {
  if (roles.length < 2) return null;
  return (
    <div
      role="tablist"
      aria-label="Work experience roles"
      className="flex w-fit min-w-0 max-w-full gap-1 overflow-x-auto rounded-full border border-black/10 bg-black/[0.03] p-1 [scrollbar-width:none] dark:border-white/15 dark:bg-white/5 [&::-webkit-scrollbar]:hidden"
    >
      {roles.map((r, i) => {
        const isActive = i === value;
        return (
          <button
            key={r.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(i)}
            className="relative shrink-0 rounded-full px-4 py-2 text-sm font-medium leading-6"
          >
            {isActive && (
              <motion.span
                layoutId="exp-role-tab"
                className="absolute inset-0 rounded-full bg-black dark:bg-white"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 whitespace-nowrap transition-colors duration-300 ${
                isActive
                  ? "text-white dark:text-black"
                  : "text-gray-600 hover:text-black dark:text-white/70 dark:hover:text-white"
              }`}
            >
              <span className="mr-2 font-mono text-[10px] opacity-60">{pad(i + 1)}</span>
              {/* Add `shortName: "..."` to an entry in assets.js to customize this label */}
              {r.shortName ?? r.role}
            </span>
          </button>
        );
      })}
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

/* Scroll-driven version: one pinned stage, one role at a time */
function Stage({ roles, perStep, preview }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const exp = roles[roleIndex];
  const achievements = exp.achievements ?? [];
  const technologies = exp.technologies ?? [];
  const report = exp.report ?? "/report.pdf";
  const count = Math.max(achievements.length, 1);

  // The runway is as long as the longest role, so the page height never changes
  const maxCount = Math.max(...roles.map((r) => (r.achievements ?? []).length), 1);

  const ref = useRef(null);
  const countRef = useRef(count);
  countRef.current = count;

  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const c = countRef.current;
    setActive(Math.min(c - 1, Math.max(0, Math.round(v * (c - 1)))));
  });

  // When you switch roles, recompute the station from the current scroll position
  useEffect(() => {
    const v = scrollYProgress.get();
    setActive(Math.min(count - 1, Math.max(0, Math.round(v * (count - 1)))));
  }, [count, scrollYProgress]);

  const hint = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  const statement = achievements[active] ?? exp.description ?? "";
  const words = String(statement).split(" ");
  const fill = count > 1 ? (active + 1) / count : 1;

  return (
    <div ref={ref} style={{ height: `${maxCount * perStep + 100}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center pt-16 lg:pt-20">
        <div className="mb-3 flex items-center justify-between gap-3">
          <RoleTabs roles={roles} value={roleIndex} onChange={setRoleIndex} />
          {preview && <FullJourneyLink />}
        </div>

        <div className="grid w-full items-center gap-4 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Gears key={exp.id} progress={scrollYProgress} count={count} active={active} />
          </div>

          <div className="lg:col-span-7">
            <Meta exp={exp} index={roleIndex} total={roles.length} />
            <h3 className="mt-3 text-center font-Ovo text-2xl leading-tight text-gray-700 dark:text-white/80 sm:text-3xl lg:text-left">
              {exp.role}
            </h3>
            <p className="mt-2 hidden max-w-xl text-sm leading-6 text-gray-500 dark:text-white/55 sm:block lg:max-w-lg">
              {exp.description}
            </p>

            {/* The statement: the focus of the section */}
            <div
              className="relative mt-5 min-h-[11rem] sm:min-h-[15rem] lg:min-h-[19rem]"
              aria-live="polite"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-2 right-0 select-none font-mono text-[7rem] font-bold leading-none text-amber-400/10 sm:text-[10rem] lg:text-[13rem]"
              >
                {pad(active + 1)}
              </span>

              <div className="relative rounded-r-2xl bg-gradient-to-r from-amber-400/10 to-transparent py-4 pl-5 pr-3 sm:pl-8">
                {/* Rail that fills as you progress */}
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px] overflow-hidden rounded-full bg-black/10 dark:bg-white/15"
                >
                  <motion.span
                    initial={false}
                    animate={{ scaleY: fill }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="block h-full w-full origin-top bg-amber-400"
                  />
                </span>

                <p className="flex items-center gap-3 font-mono text-xs uppercase leading-5 tracking-[0.25em] text-amber-600 dark:text-amber-400">
                  OP {pad((active + 1) * 10)}
                  <span aria-hidden className="h-px w-10 bg-amber-400/60" />
                </p>

                {/* Pointer + text. Sizes use `em`, so the pointer scales with the text */}
                <div className="mt-3 flex items-start gap-[0.4em] font-Ovo text-3xl leading-[1.12] sm:text-5xl lg:text-6xl">
                  <motion.svg
                    key={`pointer-${active}`}
                    aria-hidden
                    viewBox="0 0 10 10"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: [0, 6, 0] }}
                    transition={{
                      opacity: { duration: 0.3 },
                      x: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
                    }}
                    className="mt-[0.285em] h-[0.55em] w-[0.55em] shrink-0 fill-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                  >
                    <path d="M1 0 L10 5 L1 10 Z" />
                  </motion.svg>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={`${roleIndex}-${active}`}
                      initial="hidden"
                      animate="show"
                      exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
                      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
                      className="min-w-0"
                    >
                      {words.map((w, i) => (
                        <motion.span
                          key={`${active}-${i}`}
                          variants={{
                            hidden: { opacity: 0, y: 18 },
                            show: { opacity: 1, y: 0 },
                          }}
                          className="mr-[0.25em] inline-block"
                        >
                          {w}
                        </motion.span>
                      ))}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
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
function StaticStage({ roles, preview }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const exp = roles[roleIndex];
  const achievements = exp.achievements ?? [];
  const technologies = exp.technologies ?? [];
  const report = exp.report ?? "/report.pdf";

  return (
    <article className="py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <RoleTabs roles={roles} value={roleIndex} onChange={setRoleIndex} />
        {preview && <FullJourneyLink />}
      </div>
      <Meta exp={exp} index={roleIndex} total={roles.length} />
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

        {reduce ? (
          <StaticStage roles={roles} preview={preview} />
        ) : (
          <Stage roles={roles} perStep={perStep} preview={preview} />
        )}
      </div>
    </section>
  );
}