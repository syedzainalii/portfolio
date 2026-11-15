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

const pad = (n) => String(n).padStart(2, "0");

function levelOf(n) {
  if (n >= 85) return { label: "Expert", pips: 5 };
  if (n >= 70) return { label: "Advanced", pips: 4 };
  if (n >= 55) return { label: "Proficient", pips: 3 };
  if (n >= 35) return { label: "Intermediate", pips: 2 };
  return { label: "Basic", pips: 1 };
}

/* ---------- One tool row: the fill behind it is the skill level ---------- */
function ToolRow({ skill, accent, dim }) {
  const lvl = levelOf(skill.level);

  return (
    <li
      className={`relative overflow-hidden rounded-xl border border-black/10 bg-black/[0.03] transition-all duration-300 dark:border-white/15 dark:bg-white/[0.04] motion-reduce:transition-none ${
        dim ? "opacity-25 grayscale" : "hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      {/* The level fill */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0"
        style={{
          width: `${skill.level}%`,
          backgroundColor: `${accent}33`,
          borderRight: `3px solid ${accent}`,
        }}
      />

      <div className="relative flex items-center justify-between gap-3 px-4 py-3.5">
        <p className="min-w-0 break-words text-lg font-medium leading-6">{skill.name}</p>

        <div className="flex shrink-0 items-center gap-3">
          <span aria-hidden className="hidden gap-1 sm:flex">
            {[0, 1, 2, 3, 4].map((p) => (
              <span
                key={p}
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: accent,
                  opacity: p < lvl.pips ? 1 : 0.2,
                }}
              />
            ))}
          </span>
          <span className="w-[5.5rem] text-right text-sm font-medium leading-5">{lvl.label}</span>
          <span className="w-9 text-right font-mono text-xs tabular-nums text-gray-500 dark:text-white/55">
            {skill.level}%
          </span>
        </div>
      </div>
    </li>
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
          Grouped by discipline, strongest first. The longer the fill behind a tool, the stronger
          the skill.
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

      {/* ===== Level toggle ===== */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" aria-pressed={!strongOnly} onClick={() => setStrongOnly(false)} className={chip(!strongOnly)}>
          All levels
        </button>
        <button type="button" aria-pressed={strongOnly} onClick={() => setStrongOnly(true)} className={chip(strongOnly)}>
          Advanced and above
        </button>
      </div>

      {/* ===== Boards: two even columns with no gaps ===== */}
      <div className="mt-8 columns-1 gap-5 lg:columns-2">
        {zones.map((z) => (
          <section
            key={z.title}
            aria-labelledby={`board-${z.index}`}
            className="relative mb-5 break-inside-avoid overflow-hidden rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-darkHover sm:p-7"
          >
            {/* Colour wash from the corner */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(70% 45% at 0% 0%, ${z.accent}22, transparent 70%)` }}
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
                <p
                  className="font-mono text-3xl font-semibold leading-8 tabular-nums sm:text-4xl sm:leading-9"
                  style={{ color: z.accent }}
                >
                  {z.avg}
                  <span className="text-base">%</span>
                </p>
                <p className="font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
                  Strength
                </p>
              </div>
            </header>

            {/* Tools */}
            <ul className="relative mt-6 space-y-2.5">
              {z.skills.map((s) => (
                <ToolRow key={s.name} skill={s} accent={z.accent} dim={strongOnly && s.level < 70} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}