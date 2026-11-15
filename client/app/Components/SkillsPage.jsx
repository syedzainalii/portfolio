"use client";

import { useMemo, useState } from "react";
import { skillCategories } from "@/assets/assets";

const LEVELS = [
  { label: "Basic", pips: 1 },
  { label: "Intermediate", pips: 2 },
  { label: "Proficient", pips: 3 },
  { label: "Advanced", pips: 4 },
  { label: "Expert", pips: 5 },
];

function levelOf(n) {
  if (n >= 85) return LEVELS[4];
  if (n >= 70) return LEVELS[3];
  if (n >= 55) return LEVELS[2];
  if (n >= 35) return LEVELS[1];
  return LEVELS[0];
}

const pad = (n) => String(n).padStart(2, "0");

// "Abaqus" -> "Ab", "Comsol Multiphysics" -> "CM", "Git/GitHub" -> "GG"
function symbolOf(name) {
  const words = String(name)
    .split(/[\s/]+/)
    .filter(Boolean);
  if (words.length === 1) {
    const w = words[0];
    return w.charAt(0).toUpperCase() + w.charAt(1).toLowerCase();
  }
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

export default function SkillsExplorer() {
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [picked, setPicked] = useState(null);

  // One flat list of tiles, numbered like elements
  const tiles = useMemo(() => {
    let n = 0;
    return skillCategories.flatMap((c) =>
      c.skills.map((s) => {
        n += 1;
        return {
          id: `${c.title}-${s.name}`,
          number: n,
          name: s.name,
          percent: s.level,
          level: levelOf(s.level),
          symbol: symbolOf(s.name),
          category: c.title,
          accent: c.accent,
        };
      })
    );
  }, []);

  const matches = (t) =>
    (category === "all" || t.category === category) &&
    (level === "all" || t.level.label === level);

  const shown = tiles.filter(matches).length;
  const strong = tiles.filter((t) => t.level.pips >= 4).length;
  const selected = tiles.find((t) => t.id === picked) ?? null;

  const chip = (active) =>
    `min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-medium leading-5 transition-all duration-300 active:scale-95 lg:min-h-0 lg:py-1.5 ${
      active
        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
        : "border-black/15 text-gray-700 hover:border-amber-400 dark:border-white/20 dark:text-white/80"
    }`;

  return (
    <div>
      {/* ===== Stats ===== */}
      <dl className="grid grid-cols-3 divide-x divide-black/10 rounded-2xl border border-black/10 dark:divide-white/15 dark:border-white/15">
        {[
          { label: "Skills", value: tiles.length },
          { label: "Disciplines", value: skillCategories.length },
          { label: "Advanced +", value: strong },
        ].map((s) => (
          <div key={s.label} className="px-3 py-4 text-center sm:px-6 sm:py-5">
            <dd className="font-mono text-3xl font-semibold leading-8 tabular-nums sm:text-5xl sm:leading-[3.25rem]">
              {pad(s.value)}
            </dd>
            <dt className="mt-1 font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
              {s.label}
            </dt>
          </div>
        ))}
      </dl>

      {/* ===== Filters ===== */}
      <div className="mt-8 space-y-4">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
            Discipline
          </p>
          <div
            role="group"
            aria-label="Filter by discipline"
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              type="button"
              aria-pressed={category === "all"}
              onClick={() => setCategory("all")}
              className={chip(category === "all")}
            >
              All
            </button>
            {skillCategories.map((c) => (
              <button
                key={c.title}
                type="button"
                aria-pressed={category === c.title}
                onClick={() => setCategory(c.title)}
                className={`${chip(category === c.title)} inline-flex items-center gap-2 whitespace-nowrap`}
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: c.accent }}
                />
                {c.title}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
            Level
          </p>
          <div
            role="group"
            aria-label="Filter by level"
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              type="button"
              aria-pressed={level === "all"}
              onClick={() => setLevel("all")}
              className={chip(level === "all")}
            >
              All levels
            </button>
            {LEVELS.map((l) => (
              <button
                key={l.label}
                type="button"
                aria-pressed={level === l.label}
                onClick={() => setLevel(l.label)}
                className={`${chip(level === l.label)} inline-flex items-center gap-2 whitespace-nowrap`}
              >
                <span aria-hidden className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((p) => (
                    <span
                      key={p}
                      className={`h-1.5 w-1.5 rounded-full ${
                        p < l.pips ? "bg-amber-400" : "bg-current opacity-20"
                      }`}
                    />
                  ))}
                </span>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Detail bar ===== */}
      <div
        aria-live="polite"
        className="mt-6 flex min-h-[4.5rem] flex-wrap items-center justify-between gap-x-6 gap-y-1 rounded-2xl border border-dashed border-black/20 px-5 py-3 dark:border-white/25"
      >
        {selected ? (
          <>
            <div className="flex min-w-0 items-center gap-4">
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-Ovo text-xl"
                style={{ backgroundColor: `${selected.accent}2e`, color: selected.accent }}
              >
                {selected.symbol}
              </span>
              <div className="min-w-0">
                <p className="break-words text-lg font-semibold leading-6">{selected.name}</p>
                <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.15em] text-gray-500 dark:text-white/50">
                  {selected.category}
                </p>
              </div>
            </div>
            <p className="font-mono text-sm tabular-nums text-gray-600 dark:text-white/70">
              {selected.level.label} · {selected.percent}%
            </p>
          </>
        ) : (
          <p className="text-sm leading-6 text-gray-500 dark:text-white/50">
            Hover or tap an element to see its details
          </p>
        )}
      </div>

      {/* ===== The table ===== */}
      <p className="mb-3 mt-8 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
        Showing {pad(shown)} of {pad(tiles.length)}
      </p>

      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {tiles.map((t) => {
          const on = matches(t);
          const isPicked = picked === t.id;
          return (
            <li key={t.id}>
              <button
                type="button"
                aria-pressed={isPicked}
                aria-label={`${t.name}, ${t.level.label}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setPicked(t.id)}
                onFocus={() => setPicked(t.id)}
                onClick={() => setPicked(t.id)}
                className={`group relative block h-36 w-full overflow-hidden rounded-2xl border bg-white p-3 text-left shadow-sm outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-400 dark:bg-darkHover motion-reduce:transition-none sm:h-40 sm:p-4 ${
                  on
                    ? "hover:-translate-y-1 hover:shadow-xl"
                    : "opacity-25 grayscale"
                } ${isPicked ? "-translate-y-1 shadow-xl" : ""}`}
                style={{ borderColor: isPicked ? t.accent : undefined }}
              >
                {/* Liquid fill: height = skill level */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 transition-all duration-500 motion-reduce:transition-none"
                  style={{
                    height: `${t.percent}%`,
                    background: `linear-gradient(to top, ${t.accent}40, ${t.accent}14)`,
                    borderTop: `2px solid ${t.accent}`,
                  }}
                />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-white/50">
                      {pad(t.number)}
                    </span>
                    <span aria-hidden className="flex gap-0.5">
                      {[0, 1, 2, 3, 4].map((p) => (
                        <span
                          key={p}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: p < t.level.pips ? t.accent : undefined,
                            opacity: p < t.level.pips ? 1 : 0.18,
                          }}
                        />
                      ))}
                    </span>
                  </div>

                  <div>
                    <p
                      className="font-Ovo text-4xl leading-none sm:text-5xl"
                      style={{ color: t.accent }}
                    >
                      {t.symbol}
                    </p>
                    <p className="mt-2 line-clamp-2 break-words text-sm font-medium leading-4">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-4 text-gray-500 dark:text-white/55">
                      {t.level.label}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}