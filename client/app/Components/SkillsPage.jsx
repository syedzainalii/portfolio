"use client";

import { useMemo, useState } from "react";
import { Box, ClipboardList, Code, Cpu, Wrench } from "lucide-react";
import { skillCategories } from "@/assets/assets";

const skillIcons = {
  box: Box,
  "clipboard-list": ClipboardList,
  code: Code,
  cpu: Cpu,
  wrench: Wrench,
};

// Width of each board on large screens (12-column bento)
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"];

const pad = (n) => String(n).padStart(2, "0");

function levelOf(n) {
  if (n >= 85) return { label: "Expert", pips: 5 };
  if (n >= 70) return { label: "Advanced", pips: 4 };
  if (n >= 55) return { label: "Proficient", pips: 3 };
  if (n >= 35) return { label: "Intermediate", pips: 2 };
  return { label: "Basic", pips: 1 };
}

// strong = solid, mid = outlined, low = dashed and faded
function tierOf(n) {
  if (n >= 70) return "strong";
  if (n >= 55) return "mid";
  return "low";
}

/* ---------- One hanging tool tag ---------- */
function Tag({ skill, accent, dim }) {
  const lvl = levelOf(skill.level);
  const tier = tierOf(skill.level);

  const style =
    tier === "strong"
      ? { backgroundColor: accent, borderColor: accent, color: "#111" }
      : tier === "mid"
      ? { backgroundColor: `${accent}26`, borderColor: accent }
      : { borderColor: `${accent}99`, borderStyle: "dashed" };

  return (
    <li
      className={`relative min-w-0 rounded-2xl border-2 px-4 pb-3 pt-6 transition-all duration-300 motion-reduce:transition-none ${
        dim ? "opacity-20 grayscale" : "hover:-translate-y-1 hover:shadow-lg"
      } ${tier === "low" ? "text-gray-600 dark:text-white/65" : ""}`}
      style={style}
    >
      {/* Peg hole */}
      <span
        aria-hidden
        className="absolute left-3.5 top-2.5 h-2.5 w-2.5 rounded-full bg-white ring-1 ring-black/25 dark:bg-darkHover dark:ring-white/30"
      />

      <p className="break-words font-Ovo text-lg leading-6">{skill.name}</p>

      <div className="mt-2 flex items-center gap-2">
        <span aria-hidden className="flex gap-0.5">
          {[0, 1, 2, 3, 4].map((p) => (
            <span
              key={p}
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: tier === "strong" ? "#111" : accent,
                opacity: p < lvl.pips ? 1 : 0.22,
              }}
            />
          ))}
        </span>
        <span className="font-mono text-[10px] uppercase leading-4 tracking-[0.12em]">
          {lvl.label}
        </span>
      </div>
    </li>
  );
}

/* ---------- Legend swatch ---------- */
function Swatch({ kind, label }) {
  const base = "inline-block h-4 w-8 rounded-md border-2";
  const style =
    kind === "strong"
      ? { backgroundColor: "#fbbf24", borderColor: "#fbbf24" }
      : kind === "mid"
      ? { backgroundColor: "#fbbf2426", borderColor: "#fbbf24" }
      : { borderColor: "#fbbf2499", borderStyle: "dashed" };
  return (
    <span className="inline-flex items-center gap-2 text-sm leading-5 text-gray-600 dark:text-white/65">
      <span aria-hidden className={base} style={style} />
      {label}
    </span>
  );
}

export default function SkillsExplorer() {
  const [strongOnly, setStrongOnly] = useState(false);

  const zones = useMemo(
    () =>
      skillCategories.map((c, i) => {
        const skills = [...c.skills].sort((a, b) => b.level - a.level);
        const avg = Math.round(skills.reduce((n, s) => n + s.level, 0) / Math.max(skills.length, 1));
        return { ...c, index: i, skills, avg, Icon: skillIcons[c.icon] ?? Wrench };
      }),
    []
  );

  const total = zones.reduce((n, z) => n + z.skills.length, 0);
  const strong = zones.reduce((n, z) => n + z.skills.filter((s) => s.level >= 70).length, 0);

  const chip = (on) =>
    `min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium leading-5 transition-colors duration-200 lg:min-h-0 lg:py-1.5 ${
      on
        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
        : "border-black/15 text-gray-700 hover:border-amber-400 dark:border-white/20 dark:text-white/80"
    }`;

  return (
    <article className="site-container pb-20 pt-28 sm:pt-32">
      {/* ===== Header ===== */}
      <header className="mb-10 sm:mb-12">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
          Skills / Shadow board
        </p>
        <h1 className="break-words font-Ovo text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
          My Technical Skills
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-white/65 sm:text-lg sm:leading-8">
          Every discipline has its own board, and every tool hangs on it. The more solid the tag,
          the stronger the skill.
        </p>
      </header>

      {/* ===== Stats ===== */}
      <dl className="grid grid-cols-3 divide-x divide-black/10 rounded-2xl border border-black/10 dark:divide-white/15 dark:border-white/15">
        {[
          { label: "Tools", value: total },
          { label: "Boards", value: zones.length },
          { label: "Advanced +", value: strong },
        ].map((s) => (
          <div key={s.label} className="px-2 py-4 text-center sm:px-6 sm:py-5">
            <dd className="font-mono text-3xl font-semibold leading-8 tabular-nums sm:text-5xl sm:leading-[3.25rem]">
              {pad(s.value)}
            </dd>
            <dt className="mt-1 font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
              {s.label}
            </dt>
          </div>
        ))}
      </dl>

      {/* ===== Controls + legend ===== */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={!strongOnly} onClick={() => setStrongOnly(false)} className={chip(!strongOnly)}>
            All levels
          </button>
          <button type="button" aria-pressed={strongOnly} onClick={() => setStrongOnly(true)} className={chip(strongOnly)}>
            Advanced and above
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="How to read the tags">
          <Swatch kind="strong" label="Advanced +" />
          <Swatch kind="mid" label="Proficient" />
          <Swatch kind="low" label="Learning" />
        </div>
      </div>

      {/* ===== Boards ===== */}
      <div className="mt-8 grid gap-5 lg:grid-cols-12">
        {zones.map((z) => (
          <section
            key={z.title}
            aria-labelledby={`board-${z.index}`}
            className={`relative min-w-0 overflow-hidden rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-darkHover sm:p-7 ${
              SPANS[z.index] ?? "lg:col-span-6"
            }`}
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(120,120,120,0.22) 1.2px, transparent 1.5px)",
              backgroundSize: "22px 22px",
            }}
          >
            {/* Colour wash from the corner */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(70% 50% at 0% 0%, ${z.accent}22, transparent 70%)`,
              }}
            />

            {/* Board header */}
            <header className="relative flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3.5">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
                  style={{ backgroundColor: `${z.accent}2e`, color: z.accent }}
                >
                  <z.Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
                    Board {pad(z.index + 1)} · {pad(z.skills.length)} tools
                  </p>
                  <h2 id={`board-${z.index}`} className="break-words font-Ovo text-2xl leading-tight sm:text-3xl">
                    {z.title}
                  </h2>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-mono text-3xl font-semibold leading-8 tabular-nums sm:text-4xl sm:leading-9" style={{ color: z.accent }}>
                  {z.avg}
                  <span className="text-base">%</span>
                </p>
                <p className="font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
                  Strength
                </p>
              </div>
            </header>

            {/* Tools */}
            <ul className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))]">
              {z.skills.map((s) => (
                <Tag
                  key={s.name}
                  skill={s}
                  accent={z.accent}
                  dim={strongOnly && s.level < 70}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}