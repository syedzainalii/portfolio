"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { skillCategories } from "@/assets/assets";
import {
  ArrowUpRight,
  Box,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Code,
  Cpu,
  Wrench,
} from "lucide-react";

// Set to true to show raw percentages instead of level labels
const SHOW_PERCENT = false;
const CARD_HEIGHT = 500;
const AUTOPLAY_MS = 6000;
const skillIcons = {
  box: Box,
  "clipboard-list": ClipboardList,
  code: Code,
  cpu: Cpu,
  wrench: Wrench,
};

const COUNT = skillCategories.length;
const TOTAL_SKILLS = skillCategories.reduce((n, c) => n + c.skills.length, 0);
const pad = (n) => String(n).padStart(2, "0");

// Visual pose by distance from the center card
const POSE = [
  { scale: 1, opacity: 1, rotate: 0 },
  { scale: 0.86, opacity: 0.55, rotate: 18 },
  { scale: 0.66, opacity: 0.25, rotate: 28 },
];

// xs = horizontal distance (px) of the card at offset 0 / 1 / 2 from the center.
// Calculated from the card width so the visible gap between neighbouring cards is equal.
function spread(cardW) {
  const gap = Math.round(cardW * 0.026);
  const near = Math.round(cardW * 0.93 + gap);
  const far = near + Math.round(cardW * 0.76 + gap);
  return [0, near, far];
}

function getLayout(w) {
  if (w < 640) {
    const cardW = Math.min(320, Math.round(w * 0.82));
    return { cardW, xs: [0, Math.round(cardW * 0.86), 0], visible: 1 };
  }
  if (w < 1280) {
    const cardW = 360;
    return { cardW, xs: [0, spread(cardW)[1], 0], visible: 1 };
  }
  if (w >= 1536) {
    const cardW = Math.min(430, Math.round(380 * (w / 1536)));
    return { cardW, xs: spread(cardW), visible: 2 };
  }
  const cardW = 380;
  return { cardW, xs: spread(cardW), visible: 2 };
}

function useLayout() {
  const [layout, setLayout] = useState(() => getLayout(1440));
  useEffect(() => {
    const update = () => setLayout(getLayout(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return layout;
}

// Circular distance of card i from the selected card: -2 ... 2
function offsetOf(i, selected) {
  const half = Math.floor(COUNT / 2);
  return ((i - selected + COUNT + half) % COUNT) - half;
}

function levelOf(n) {
  if (n >= 85) return { label: "Expert", pips: 5 };
  if (n >= 70) return { label: "Advanced", pips: 4 };
  if (n >= 55) return { label: "Proficient", pips: 3 };
  if (n >= 35) return { label: "Intermediate", pips: 2 };
  return { label: "Basic", pips: 1 };
}

/* ---------- "Skill matrix" button (landing page only) ---------- */
function SkillMatrixLink() {
  // Bar heights (%) at rest and on hover
  const rest = [38, 70, 52, 88, 60];
  const hover = [90, 48, 82, 40, 100];

  return (
    <Link
      href="/skills"
      aria-label="Open the full skill matrix"
      className="group inline-flex w-fit shrink-0 items-center gap-3.5 rounded-2xl border-2 border-black/80 bg-white/70 py-2.5 pl-3 pr-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-[4px_4px_0_#fbbf24] dark:border-white/80 dark:bg-transparent dark:hover:bg-white dark:hover:text-black"
    >
      {/* Mini bar chart that rearranges on hover */}
      <span
        aria-hidden
        className="flex h-9 w-9 items-end justify-between gap-[3px] rounded-lg bg-amber-400 p-1.5"
      >
        {rest.map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-black transition-[height] duration-500 ease-out"
            style={{ height: `${h}%`, transitionDelay: `${i * 40}ms` }}
            data-hover={hover[i]}
            ref={(el) => {
              if (!el) return;
              const parent = el.closest("a");
              if (!parent || el.dataset.bound) return;
              el.dataset.bound = "1";
              parent.addEventListener("mouseenter", () => (el.style.height = `${hover[i]}%`));
              parent.addEventListener("mouseleave", () => (el.style.height = `${h}%`));
            }}
          />
        ))}
      </span>

      <span className="text-left leading-tight">
        <span className="block text-sm font-semibold">Skill matrix</span>
        <span className="block font-mono text-[11px] uppercase tracking-[0.18em] opacity-60">
          {pad(COUNT)} groups · {pad(TOTAL_SKILLS)} skills
        </span>
      </span>

      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

function SkillCard({ category, offset, wrapped, layout, reduceMotion, onSelect }) {
  const abs = Math.abs(offset);
  const dir = Math.sign(offset);
  const pose = POSE[Math.min(abs, 2)];
  const hidden = abs > layout.visible;
  const active = offset === 0;
  const Icon = skillIcons[category.icon];
  const { accent } = category;

  return (
    <motion.div
      aria-hidden={!active}
      onClick={() => {
        if (!active && !hidden) onSelect();
      }}
      initial={false}
      animate={{
        x: dir * layout.xs[Math.min(abs, 2)],
        scale: pose.scale,
        rotateY: -dir * pose.rotate,
        opacity: hidden ? 0 : pose.opacity,
      }}
      transition={
        wrapped || reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 170, damping: 24, mass: 0.9 }
      }
      style={{
        width: layout.cardW,
        maxWidth: "calc(100vw - 2.5rem)",
        height: CARD_HEIGHT,
        zIndex: 10 - abs,
        pointerEvents: hidden ? "none" : "auto",
      }}
      className={`absolute inset-x-0 top-0 mx-auto ${active ? "" : "cursor-pointer"}`}
    >
      <div
        className={`relative h-full overflow-hidden rounded-3xl border bg-white p-7 transition-shadow duration-500 dark:bg-darkHover ${
          active
            ? "border-black/15 shadow-2xl dark:border-white/20"
            : "border-black/10 shadow-lg dark:border-white/10"
        }`}
      >
        {/* Accent glow at the top of the card */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(120% 55% at 50% 0%, ${accent}${
              active ? "33" : "1f"
            }, transparent 70%)`,
          }}
        />

        <div className="relative flex items-center gap-3.5">
          <span
            className="grid h-12 w-12 place-items-center rounded-xl"
            style={{ backgroundColor: `${accent}26`, color: accent }}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h3 className="break-words text-xl font-semibold leading-6">{category.title}</h3>
            <p className="text-xs leading-5 text-gray-500 dark:text-white/50">
              {category.skills.length} skills
            </p>
          </div>
        </div>

        <ul className="relative mt-7 space-y-5">
          {category.skills.map((skill, si) => {
            const lvl = levelOf(skill.level);
            return (
              <li key={skill.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 break-words text-[15px] font-medium leading-5">
                    {skill.name}
                  </span>
                  <span className="shrink-0 text-xs leading-5 text-gray-500 dark:text-white/55">
                    {SHOW_PERCENT ? `${skill.level}%` : lvl.label}
                  </span>
                </div>
                <div className="mt-2 flex gap-1" aria-hidden>
                  {[0, 1, 2, 3, 4].map((p) =>
                    p < lvl.pips ? (
                      <motion.span
                        // key changes when the card becomes active, so the fill replays
                        key={`${active}-${p}`}
                        initial={{ scaleX: active ? 0 : 1 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 0.4,
                          delay: active ? 0.2 + si * 0.06 + p * 0.05 : 0,
                        }}
                        className="h-2 flex-1 origin-left rounded-full"
                        style={{ backgroundColor: accent }}
                      />
                    ) : (
                      <span
                        key={p}
                        className="h-2 flex-1 rounded-full bg-black/10 dark:bg-white/10"
                      />
                    )
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Skills({ preview = false }) {
  // `prev` lets us detect cards that wrap from one edge to the other
  const [pos, setPos] = useState({ index: 0, prev: 0 });
  const [paused, setPaused] = useState(false);
  const layout = useLayout();
  const reduceMotion = useReducedMotion();

  const { index, prev } = pos;
  const current = skillCategories[index];

  const jump = useCallback(
    (to) => setPos((p) => ({ index: to, prev: p.index })),
    []
  );
  const go = useCallback(
    (dir) => setPos((p) => ({ index: (p.index + dir + COUNT) % COUNT, prev: p.index })),
    []
  );

  // Autoplay: pauses on hover/focus, off for reduced-motion users
  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, reduceMotion, go]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  return (
    <section id="skills" className="w-full py-14 sm:py-20 lg:py-24">
      <div className="site-container">
        {/* Header row: title on the left, button on the right */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
              SKILLS
            </h4>
            <h2 className="font-Ovo text-3xl sm:text-5xl">Technical Proficiencies</h2>
          </div>

          {preview && <SkillMatrixLink />}
        </div>

        <div
          className="mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Stage */}
          <motion.div
            role="group"
            aria-roledescription="carousel"
            aria-label="Skill categories"
            tabIndex={0}
            onKeyDown={onKeyDown}
            drag="x"
            dragSnapToOrigin
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -400) go(1);
              else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
            }}
            className="relative mx-auto w-full cursor-grab select-none rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-4 active:cursor-grabbing"
            style={{ height: CARD_HEIGHT + 40, perspective: 1600, touchAction: "pan-y" }}
          >
            {/* Soft glow that follows the active category color */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl transition-colors duration-700"
              style={{ backgroundColor: current.accent }}
            />

            {skillCategories.map((category, i) => {
              const offset = offsetOf(i, index);
              const wrapped = Math.abs(offset - offsetOf(i, prev)) > 2;
              return (
                <SkillCard
                  key={category.title}
                  category={category}
                  offset={offset}
                  wrapped={wrapped}
                  layout={layout}
                  reduceMotion={reduceMotion}
                  onSelect={() => jump(i)}
                />
              );
            })}
          </motion.div>

          <p className="sr-only" aria-live="polite">
            {current.title}, {index + 1} of {COUNT}
          </p>

          {/* Controls */}
          <div className="mt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Previous category"
              className="grid h-11 w-11 place-items-center rounded-full border border-black/15 transition duration-300 hover:bg-black hover:text-white active:scale-95 dark:border-white/20 dark:hover:bg-white dark:hover:text-black"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              role="tablist"
              aria-label="Skill categories"
              className="hidden items-center gap-1 rounded-full border border-black/10 bg-black/[0.03] p-1 dark:border-white/15 dark:bg-white/5 md:flex"
            >
              {skillCategories.map((c, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={c.title}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => jump(i)}
                    className="relative min-h-11 rounded-full px-4 py-1.5 text-sm font-medium leading-6 lg:min-h-0"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="skills-tab"
                        className="absolute inset-0 rounded-full bg-black dark:bg-white"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors duration-300 ${
                        isActive
                          ? "text-white dark:text-black"
                          : "text-gray-600 hover:text-black dark:text-white/70 dark:hover:text-white"
                      }`}
                    >
                      {c.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Compact label for phones */}
            <p className="w-36 min-w-0 text-center text-xs font-medium leading-5 tabular-nums md:hidden">
              {current.title} · {index + 1}/{COUNT}
            </p>

            <button
              onClick={() => go(1)}
              aria-label="Next category"
              className="grid h-11 w-11 place-items-center rounded-full border border-black/15 transition duration-300 hover:bg-black hover:text-white active:scale-95 dark:border-white/20 dark:hover:bg-white dark:hover:text-black"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}