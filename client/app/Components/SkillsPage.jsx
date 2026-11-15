"use client";

import { useMemo, useState } from "react";
import { skillCategories } from "@/assets/assets";

/*
  Skills as a workshop of gears. A bigger gear with more teeth means a stronger skill.
  Gears turn slowly (bigger ones slower, neighbours in opposite directions).
*/

const levelOf = (n) =>
  n >= 85 ? "Expert" : n >= 70 ? "Advanced" : n >= 55 ? "Proficient" : n >= 35 ? "Intermediate" : "Basic";

// "Abaqus" -> "Ab", "Comsol Multiphysics" -> "CM"
function symbolOf(name) {
  const w = String(name).split(/[\s/]+/).filter(Boolean);
  if (w.length === 1) return w[0].charAt(0).toUpperCase() + w[0].charAt(1).toLowerCase();
  return (w[0].charAt(0) + w[1].charAt(0)).toUpperCase();
}

// Outline of a toothed wheel, centred on 0,0 inside a 200 x 200 box
function gearPath(teeth, ro = 92, ri = 76) {
  const step = (Math.PI * 2) / teeth;
  const at = (a, r) => `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    d += `${i ? "L" : "M"}${at(a, ri)}L${at(a + step * 0.2, ri)}L${at(a + step * 0.32, ro)}L${at(a + step * 0.58, ro)}L${at(a + step * 0.7, ri)}`;
  }
  return d + "Z";
}

function Gear({ g, on }) {
  const teeth = 8 + Math.round(g.percent / 10);
  const size = 72 + g.percent * 0.75;
  return (
    <svg viewBox="-100 -100 200 200" width={size} height={size} aria-hidden className="overflow-visible">
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          animation: `gear-turn ${(teeth * 1.3).toFixed(1)}s linear infinite`,
          animationDirection: g.index % 2 ? "reverse" : "normal",
        }}
      >
        <path
          d={gearPath(teeth)}
          fill={`${g.accent}${on ? "55" : "26"}`}
          stroke={g.accent}
          strokeWidth="4"
          strokeLinejoin="round"
          style={{ transition: "fill 300ms" }}
        />
        <circle r="58" fill="none" stroke={g.accent} strokeOpacity="0.45" strokeWidth="2" />
        <circle r="10" fill="none" stroke={g.accent} strokeWidth="3" />
      </g>
      <text textAnchor="middle" dominantBaseline="central" y="2" fontSize="44" fill={g.accent} className="font-Ovo">
        {g.symbol}
      </text>
    </svg>
  );
}

export default function SkillsPage() {
  const [cat, setCat] = useState("all");
  const [picked, setPicked] = useState(null);

  const gears = useMemo(() => {
    let i = 0;
    return skillCategories
      .flatMap((c) =>
        c.skills.map((s) => ({
          id: `${c.title}-${s.name}`,
          name: s.name,
          percent: s.level,
          category: c.title,
          accent: c.accent,
          symbol: symbolOf(s.name),
        }))
      )
      .sort((a, b) => b.percent - a.percent)
      .map((g) => ({ ...g, index: i++ }));
  }, []);

  const shown = gears.filter((g) => cat === "all" || g.category === cat);
  const sel = shown.find((g) => g.id === picked) ?? null;

  const chip = (on) =>
    `min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium leading-5 transition-colors duration-200 lg:min-h-0 lg:py-1.5 ${
      on
        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
        : "border-black/15 text-gray-700 hover:border-amber-400 dark:border-white/20 dark:text-white/80"
    }`;

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes gear-turn { to { transform: rotate(360deg); } }
            @media (prefers-reduced-motion: reduce) { svg g[style*="gear-turn"] { animation: none !important; } }
          `,
        }}
      />

      {/* Discipline filter */}
      <div
        role="group"
        aria-label="Filter by discipline"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")} className={chip(cat === "all")}>
          All skills
        </button>
        {skillCategories.map((c) => (
          <button
            key={c.title}
            type="button"
            aria-pressed={cat === c.title}
            onClick={() => setCat(c.title)}
            className={`${chip(cat === c.title)} inline-flex items-center gap-2`}
          >
            <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.accent }} />
            {c.title}
          </button>
        ))}
      </div>

      {/* Readout */}
      <div
        aria-live="polite"
        className="mt-6 flex min-h-[4.5rem] flex-wrap items-center justify-between gap-x-6 gap-y-1 rounded-2xl border border-dashed border-black/25 px-5 py-3 dark:border-white/30"
      >
        {sel ? (
          <>
            <div className="min-w-0">
              <p className="break-words font-Ovo text-2xl leading-8">{sel.name}</p>
              <p className="text-sm leading-6 text-gray-500 dark:text-white/55">{sel.category}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-28 overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
                <span className="block h-full rounded-full" style={{ width: `${sel.percent}%`, backgroundColor: sel.accent }} />
              </span>
              <span className="text-sm font-medium tabular-nums">
                {levelOf(sel.percent)}, {sel.percent}%
              </span>
            </div>
          </>
        ) : (
          <p className="text-sm leading-6 text-gray-500 dark:text-white/55">
            Tap a gear to see the skill. A bigger gear with more teeth means a stronger skill.
          </p>
        )}
      </div>

      {/* Gears */}
      <ul className="mt-8 flex flex-wrap items-end justify-center gap-x-5 gap-y-8 pb-10">
        {shown.map((g) => {
          const on = sel?.id === g.id;
          return (
            <li key={g.id}>
              <button
                type="button"
                aria-pressed={on}
                aria-label={`${g.name}, ${levelOf(g.percent)}`}
                onClick={() => setPicked(g.id)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setPicked(g.id)}
                onFocus={() => setPicked(g.id)}
                className={`group flex flex-col items-center gap-2 rounded-2xl p-2 outline-none transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-amber-400 motion-reduce:transition-none ${
                  on ? "scale-110" : "hover:scale-105"
                }`}
              >
                <Gear g={g} on={on} />
                <span className={`max-w-[7rem] break-words text-center text-sm font-medium leading-4 ${on ? "" : "text-gray-600 dark:text-white/70"}`}>
                  {g.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}