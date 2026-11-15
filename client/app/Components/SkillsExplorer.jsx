"use client";

import { useEffect, useMemo, useState } from "react";
import { skillCategories } from "@/assets/assets";

/* ---------- helpers ---------- */
const LEVELS = [
  { min: 85, label: "Expert" },
  { min: 70, label: "Advanced" },
  { min: 55, label: "Proficient" },
  { min: 35, label: "Intermediate" },
  { min: 0, label: "Basic" },
];
const levelOf = (n) => LEVELS.find((l) => n >= l.min).label;

// Gauge geometry: 270 degree sweep, starts bottom-left (-135deg), ends bottom-right (+135deg)
const SWEEP = 270;
const R = 78;
const CIRC = 2 * Math.PI * R;
const ARC = (CIRC * SWEEP) / 360;
const angleOf = (v) => -135 + (SWEEP * v) / 100;

/* ---------- gauge dial ---------- */
function Gauge({ skill, ready }) {
  const value = ready && skill ? skill.percent : 0;
  const color = skill?.accent ?? "#f59e0b";

  return (
    <figure className="relative mx-auto w-full max-w-sm">
      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label={skill ? `${skill.name} gauge at ${skill.percent} percent` : "Skill gauge"}
        className="w-full"
      >
        {/* bezel */}
        <circle cx="100" cy="100" r="96" className="fill-white stroke-black/15 dark:fill-darkHover dark:stroke-white/20" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="90" className="fill-none stroke-black/10 dark:stroke-white/10" strokeWidth="0.5" />

        {/* ticks */}
        {Array.from({ length: 21 }, (_, i) => i * 5).map((v) => {
          const major = v % 20 === 0;
          const mid = v % 10 === 0;
          return (
            <line
              key={v}
              x1="100"
              y1="14"
              x2="100"
              y2={major ? 27 : mid ? 23 : 20}
              transform={`rotate(${angleOf(v)} 100 100)`}
              className="stroke-gray-500 dark:stroke-white/55"
              strokeWidth={major ? 1.6 : 0.8}
            />
          );
        })}
        {[0, 20, 40, 60, 80, 100].map((v) => {
          const a = ((angleOf(v) - 90) * Math.PI) / 180;
          return (
            <text
              key={v}
              x={100 + 56 * Math.cos(a)}
              y={100 + 56 * Math.sin(a) + 3}
              textAnchor="middle"
              fontSize="8"
              className="fill-gray-500 dark:fill-white/55"
            >
              {v}
            </text>
          );
        })}

        {/* track + progress arc */}
        <g transform="rotate(135 100 100)" fill="none" strokeLinecap="round">
          <circle cx="100" cy="100" r={R} strokeWidth="3" strokeDasharray={`${ARC} ${CIRC}`} className="stroke-black/10 dark:stroke-white/15" />
          <circle
            cx="100"
            cy="100"
            r={R}
            strokeWidth="3"
            stroke={color}
            strokeDasharray={`${(ARC * value) / 100} ${CIRC}`}
            style={{ transition: "stroke-dasharray 900ms cubic-bezier(.2,.9,.25,1.1), stroke 300ms" }}
            className="motion-reduce:transition-none"
          />
        </g>

        {/* needle */}
        <g
          style={{
            transform: `rotate(${angleOf(value)}deg)`,
            transformOrigin: "100px 100px",
            transition: "transform 900ms cubic-bezier(.2,.9,.25,1.4)",
          }}
          className="motion-reduce:transition-none"
        >
          <line x1="100" y1="112" x2="100" y2="34" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <polygon points="100,28 96.5,40 103.5,40" fill={color} />
        </g>
        <circle cx="100" cy="100" r="7" className="fill-white stroke-black dark:fill-darkHover dark:stroke-white" strokeWidth="2" />
        <circle cx="100" cy="100" r="2" fill={color} />

        {/* readout */}
        <text x="100" y="148" textAnchor="middle" fontSize="26" className="fill-black font-Ovo dark:fill-white">
          {skill ? skill.percent : "-"}
          <tspan fontSize="11" dx="1">%</tspan>
        </text>
        <text x="100" y="164" textAnchor="middle" fontSize="9" className="fill-gray-500 dark:fill-white/60">
          {skill ? levelOf(skill.percent) : "Pick a skill"}
        </text>
      </svg>

      <figcaption className="mt-3 text-center">
        <p className="break-words font-Ovo text-2xl leading-8">{skill?.name ?? "Select a skill"}</p>
        <p className="text-sm leading-6 text-gray-500 dark:text-white/55">{skill?.category}</p>
      </figcaption>
    </figure>
  );
}

/* ---------- main ---------- */
export default function SkillsExplorer() {
  const [category, setCategory] = useState("all");
  const [pickedId, setPickedId] = useState(null);
  const [ready, setReady] = useState(false);

  // Mount flag so the gauge and rulers sweep from zero once on load
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const all = useMemo(
    () =>
      skillCategories.flatMap((c) =>
        c.skills.map((s) => ({
          id: `${c.title}-${s.name}`,
          name: s.name,
          percent: s.level,
          category: c.title,
          accent: c.accent,
        }))
      ),
    []
  );

  const list = useMemo(
    () =>
      all
        .filter((s) => category === "all" || s.category === category)
        .sort((a, b) => b.percent - a.percent),
    [all, category]
  );

  const selected = list.find((s) => s.id === pickedId) ?? list[0] ?? null;
  const average = list.length ? Math.round(list.reduce((n, s) => n + s.percent, 0) / list.length) : 0;

  const tab = (active) =>
    `min-h-11 shrink-0 rounded-md border px-4 py-2 text-sm font-medium leading-5 transition-colors duration-200 lg:min-h-0 lg:py-1.5 ${
      active
        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
        : "border-black/15 text-gray-700 hover:border-amber-400 dark:border-white/20 dark:text-white/80"
    }`;

  return (
    <div>
      {/* Discipline tabs */}
      <div
        role="group"
        aria-label="Filter by discipline"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")} className={tab(category === "all")}>
          All skills
        </button>
        {skillCategories.map((c) => (
          <button
            key={c.title}
            type="button"
            aria-pressed={category === c.title}
            onClick={() => setCategory(c.title)}
            className={`${tab(category === c.title)} inline-flex items-center gap-2 whitespace-nowrap`}
          >
            <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.accent }} />
            {c.title}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-14">
        {/* Gauge (stays in view while scrolling the list on desktop) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Gauge skill={selected} ready={ready} />
          <p className="mt-4 text-center text-sm leading-6 text-gray-500 dark:text-white/55">
            {list.length} skills shown, average {average}%
          </p>
        </div>

        {/* Caliper rulers */}
        <ul className="divide-y divide-black/10 dark:divide-white/15" aria-label="Skills">
          {list.map((s) => {
            const active = selected?.id === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setPickedId(s.id)}
                  onFocus={() => setPickedId(s.id)}
                  onClick={() => setPickedId(s.id)}
                  className="group block w-full py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <span className="flex items-baseline justify-between gap-4">
                    <span className={`break-words text-base font-medium leading-6 ${active ? "" : "text-gray-700 dark:text-white/75"}`}>
                      {s.name}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums leading-6 text-gray-500 dark:text-white/55">
                      {levelOf(s.percent)} - {s.percent}%
                    </span>
                  </span>

                  {/* the ruler */}
                  <span className="relative mt-3 block h-6">
                    {/* scale ticks: a long mark every 10, short mark every 2 */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-2.5 text-black/35 dark:text-white/40"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 2%)",
                        backgroundSize: "100% 45%",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-4 text-black/50 dark:text-white/55"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 10%)",
                      }}
                    />
                    {/* baseline */}
                    <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-black/40 dark:bg-white/45" />
                    {/* filled measurement */}
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-0 h-1.5 rounded-r-sm transition-all duration-700 ease-out motion-reduce:transition-none"
                      style={{
                        width: ready ? `${s.percent}%` : "0%",
                        backgroundColor: s.accent,
                        opacity: active ? 1 : 0.7,
                      }}
                    />
                    {/* caliper jaw */}
                    <span
                      aria-hidden
                      className="absolute bottom-0 h-6 w-0.5 -translate-x-1/2 transition-all duration-700 ease-out motion-reduce:transition-none"
                      style={{
                        left: ready ? `${s.percent}%` : "0%",
                        backgroundColor: s.accent,
                        boxShadow: active ? `0 0 0 3px ${s.accent}33` : "none",
                      }}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}