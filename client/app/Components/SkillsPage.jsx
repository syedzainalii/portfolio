"use client";

import { useEffect, useMemo, useState } from "react";
import { skillCategories } from "@/assets/assets";

/*
  Skills grouped by strength grade, like a materials data sheet:
  Tungsten (expert) at the top down to Copper (basic) at the bottom.
  Everything is visible without hovering, so a quick skim shows the strongest skills first.
*/

const BRUSHED = "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 3px)";

const GRADES = [
  { key: "expert", label: "Expert", min: 85, material: "Tungsten", bg: "linear-gradient(135deg,#334155,#0f172a)", fg: "#ffffff" },
  { key: "advanced", label: "Advanced", min: 70, material: "Titanium", bg: "linear-gradient(135deg,#5b6f8a,#2f3f55)", fg: "#ffffff" },
  { key: "proficient", label: "Proficient", min: 55, material: "Steel", bg: "linear-gradient(135deg,#cbd5e1,#94a3b8)", fg: "#0f172a" },
  { key: "intermediate", label: "Intermediate", min: 35, material: "Aluminium", bg: "linear-gradient(135deg,#e2e8f0,#cbd5e1)", fg: "#0f172a" },
  { key: "basic", label: "Basic", min: 0, material: "Copper", bg: "linear-gradient(135deg,#fdba74,#f59e0b)", fg: "#431407" },
];

const gradeOf = (n) => GRADES.find((g) => n >= g.min);
const metal = (g) => ({ backgroundImage: `${BRUSHED}, ${g.bg}`, color: g.fg });

export default function SkillsPage() {
  const [cat, setCat] = useState("all");
  const [ready, setReady] = useState(false);

  // Let the level bars grow from zero once, right after the page appears
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

  const filtered = all.filter((s) => cat === "all" || s.category === cat);
  const groups = GRADES.map((g) => ({
    ...g,
    items: filtered.filter((s) => gradeOf(s.percent).key === g.key).sort((a, b) => b.percent - a.percent),
  }));

  const jump = (key) =>
    document.getElementById(`grade-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const chip = (on) =>
    `min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium leading-5 transition-colors duration-200 lg:min-h-0 lg:py-1.5 ${
      on
        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
        : "border-black/15 text-gray-700 hover:border-amber-400 dark:border-white/20 dark:text-white/80"
    }`;

  return (
    <div>
      {/* Summary */}
      <p className="max-w-2xl text-base leading-7 text-gray-600 dark:text-white/70 sm:text-lg sm:leading-8">
        {filtered.length} skills across {skillCategories.length} disciplines, sorted by strength.
        The strongest are at the top.
      </p>

      {/* Discipline filter */}
      <div
        role="group"
        aria-label="Filter by discipline"
        className="-mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

      {/* Jump bar: how many skills sit in each grade, tap to go there */}
      <nav aria-label="Jump to a strength grade" className="mt-6 grid grid-cols-5 gap-1.5 sm:gap-2">
        {groups.map((g) => (
          <button
            key={g.key}
            type="button"
            disabled={g.items.length === 0}
            onClick={() => jump(g.key)}
            style={metal(g)}
            className="rounded-xl px-1 py-3 text-center outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-30 disabled:hover:translate-y-0 motion-reduce:transition-none"
          >
            <span className="block font-Ovo text-2xl leading-7 tabular-nums sm:text-3xl sm:leading-9">{g.items.length}</span>
            <span className="block truncate text-xs font-medium leading-4 sm:text-sm sm:leading-5">{g.label}</span>
          </button>
        ))}
      </nav>

      {/* Grades */}
      <div className="mt-10 space-y-10 pb-10">
        {groups
          .filter((g) => g.items.length > 0)
          .map((g) => (
            <section key={g.key} id={`grade-${g.key}`} aria-labelledby={`h-${g.key}`} className="scroll-mt-28">
              <div style={metal(g)} className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 shadow-sm">
                <div className="min-w-0">
                  <h2 id={`h-${g.key}`} className="font-Ovo text-3xl leading-9 sm:text-4xl sm:leading-10">
                    {g.label}
                  </h2>
                  <p className="text-sm leading-5 opacity-80">{g.material} grade, {g.min}% and above</p>
                </div>
                <p className="shrink-0 text-sm font-medium leading-5">
                  {g.items.length} {g.items.length === 1 ? "skill" : "skills"}
                </p>
              </div>

              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-darkHover"
                    style={{ borderLeft: `6px solid ${s.accent}` }}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="min-w-0 break-words text-base font-semibold leading-6 sm:text-lg">{s.name}</p>
                      <p className="shrink-0 font-Ovo text-2xl leading-none tabular-nums">
                        {s.percent}
                        <span className="text-sm">%</span>
                      </p>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
                      <span
                        className="block h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
                        style={{ width: ready ? `${s.percent}%` : "0%", backgroundColor: s.accent }}
                      />
                    </div>
                    {cat === "all" && <p className="mt-2 text-sm leading-5 text-gray-500 dark:text-white/55">{s.category}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  );
}