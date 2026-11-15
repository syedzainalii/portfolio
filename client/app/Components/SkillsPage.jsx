"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, ClipboardList, Code, Cpu, Star, Wrench } from "lucide-react";
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
  if (n >= 85) return "Expert";
  if (n >= 70) return "Advanced";
  if (n >= 55) return "Proficient";
  if (n >= 35) return "Intermediate";
  return "Basic";
}

/* ---------- Tape measure ---------- */
function Tape({ percent, accent }) {
  return (
    <div
      aria-hidden
      className="relative h-3.5 overflow-hidden rounded-sm bg-black/[0.07] dark:bg-white/10"
    >
      <div
        className="absolute inset-y-0 left-0 rounded-sm"
        style={{ width: `${percent}%`, backgroundColor: accent }}
      />
      {/* Tick marks: a line every 5% */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, transparent 0, transparent calc(5% - 1px), rgba(0,0,0,0.3) calc(5% - 1px), rgba(0,0,0,0.3) 5%)",
        }}
      />
    </div>
  );
}

/* ---------- One tool ---------- */
function ToolCard({ skill, accent, top }) {
  return (
    <li className="group relative min-w-0 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/15 dark:bg-darkHover motion-reduce:transition-none sm:p-5">
      {top && (
        <span
          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase leading-4 tracking-[0.12em] text-black"
          style={{ backgroundColor: accent }}
        >
          <Star className="h-3 w-3" fill="currentColor" />
          Top tool
        </span>
      )}

      <p className={`break-words font-Ovo text-xl leading-7 sm:text-2xl sm:leading-8 ${top ? "pr-24" : ""}`}>
        {skill.name}
      </p>

      <div className="mt-4">
        <Tape percent={skill.level} accent={accent} />
        <div className="mt-2 flex items-center justify-between gap-3 text-sm leading-5">
          <span className="font-medium">{levelOf(skill.level)}</span>
          <span className="font-mono tabular-nums text-gray-500 dark:text-white/55">
            {skill.level}%
          </span>
        </div>
      </div>
    </li>
  );
}

export default function SkillsExplorer() {
  const [strongOnly, setStrongOnly] = useState(false);
  const [active, setActive] = useState(0);

  // Zones with tools sorted strongest first
  const zones = useMemo(
    () =>
      skillCategories.map((c, i) => {
        const skills = [...c.skills].sort((a, b) => b.level - a.level);
        const avg = Math.round(skills.reduce((n, s) => n + s.level, 0) / Math.max(skills.length, 1));
        return { ...c, index: i, skills, avg, Icon: skillIcons[c.icon] ?? Wrench };
      }),
    []
  );

  const totalSkills = zones.reduce((n, z) => n + z.skills.length, 0);
  const strongCount = zones.reduce((n, z) => n + z.skills.filter((s) => s.level >= 70).length, 0);

  // Highlight the zone you are scrolled to
  useEffect(() => {
    const els = zones.map((z) => document.getElementById(`zone-${z.index}`)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setActive(Number(top.target.dataset.zone));
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [zones]);

  const chip = (on) =>
    `min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium leading-5 transition-colors duration-200 lg:min-h-0 lg:py-1.5 ${
      on
        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
        : "border-black/15 text-gray-700 hover:border-amber-400 dark:border-white/20 dark:text-white/80"
    }`;

  return (
    <div>
      {/* ===== Stats ===== */}
      <dl className="grid grid-cols-3 divide-x divide-black/10 rounded-2xl border border-black/10 dark:divide-white/15 dark:border-white/15">
        {[
          { label: "Skills", value: totalSkills },
          { label: "Zones", value: zones.length },
          { label: "Advanced +", value: strongCount },
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
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button type="button" aria-pressed={!strongOnly} onClick={() => setStrongOnly(false)} className={chip(!strongOnly)}>
          All levels
        </button>
        <button type="button" aria-pressed={strongOnly} onClick={() => setStrongOnly(true)} className={chip(strongOnly)}>
          Advanced and above
        </button>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-12 lg:gap-12">
        {/* ===== Zone map ===== */}
        <nav
          aria-label="Skill zones"
          className="sticky top-[4.5rem] z-20 -mx-5 bg-white px-5 py-2 dark:bg-darkTheme sm:-mx-8 sm:px-8 lg:top-28 lg:col-span-3 lg:mx-0 lg:bg-transparent lg:px-0 lg:py-0 dark:lg:bg-transparent"
        >
          <p className="mb-3 hidden font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45 lg:block">
            Zone map
          </p>
          <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {zones.map((z) => {
              const on = active === z.index;
              return (
                <li key={z.title} className="shrink-0">
                  <a
                    href={`#zone-${z.index}`}
                    aria-current={on ? "true" : undefined}
                    className={`relative flex min-h-11 items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 lg:min-h-0 lg:rounded-none lg:border-0 lg:border-t lg:border-black/10 lg:px-0 lg:py-4 lg:dark:border-white/15 ${
                      on
                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black lg:bg-transparent lg:text-inherit dark:lg:bg-transparent dark:lg:text-inherit"
                        : "border-black/15 text-gray-700 dark:border-white/20 dark:text-white/80 lg:text-gray-500 dark:lg:text-white/55"
                    }`}
                  >
                    {/* Amber bar (desktop) */}
                    <span
                      aria-hidden
                      className={`absolute -top-px left-0 hidden h-px bg-amber-400 transition-all duration-500 lg:block ${
                        on ? "w-full" : "w-0"
                      }`}
                    />
                    <span className={`font-mono text-xs tabular-nums ${on ? "text-amber-400 lg:text-amber-500" : "opacity-60"}`}>
                      {pad(z.index + 1)}
                    </span>
                    <span className={`whitespace-nowrap font-Ovo text-base leading-6 lg:whitespace-normal lg:text-xl ${on ? "lg:text-black dark:lg:text-white" : ""}`}>
                      {z.title}
                    </span>
                    <span className="ml-auto hidden font-mono text-xs tabular-nums opacity-60 lg:block">
                      {pad(z.skills.length)}
                    </span>
                  </a>
                </li>
              );
            })}
            <li aria-hidden className="hidden border-t border-black/10 dark:border-white/15 lg:block" />
          </ul>
        </nav>

        {/* ===== Zones ===== */}
        <div className="min-w-0 space-y-16 lg:col-span-9 lg:space-y-20">
          {zones.map((z) => {
            const list = strongOnly ? z.skills.filter((s) => s.level >= 70) : z.skills;
            const topLevel = z.skills[0]?.level;

            return (
              <section
                key={z.title}
                id={`zone-${z.index}`}
                data-zone={z.index}
                className="scroll-mt-32"
              >
                {/* Zone header */}
                <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b-2 pb-5" style={{ borderColor: z.accent }}>
                  <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                    <span
                      aria-hidden
                      className="select-none font-mono text-5xl font-bold leading-none tabular-nums text-transparent sm:text-7xl"
                      style={{ WebkitTextStroke: `1.5px ${z.accent}` }}
                    >
                      {pad(z.index + 1)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
                        Zone · {pad(z.skills.length)} tools
                      </p>
                      <h2 className="flex items-center gap-3 break-words font-Ovo text-3xl leading-tight sm:text-4xl">
                        <span
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                          style={{ backgroundColor: `${z.accent}26`, color: z.accent }}
                        >
                          <z.Icon className="h-5 w-5" />
                        </span>
                        {z.title}
                      </h2>
                    </div>
                  </div>

                  <div className="w-full min-w-[12rem] sm:w-56">
                    <p className="flex items-center justify-between font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
                      <span>Zone strength</span>
                      <span>{levelOf(z.avg)}</span>
                    </p>
                    <div className="mt-1.5">
                      <Tape percent={z.avg} accent={z.accent} />
                    </div>
                  </div>
                </header>

                {/* Tools */}
                {list.length > 0 ? (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                    {list.map((s) => (
                      <ToolCard
                        key={s.name}
                        skill={s}
                        accent={z.accent}
                        top={s.level === topLevel && z.skills.length > 1 && s === z.skills[0]}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="mt-6 rounded-2xl border border-dashed border-black/20 px-5 py-6 text-sm text-gray-500 dark:border-white/25 dark:text-white/55">
                    Nothing in this zone is at Advanced yet. Switch to &ldquo;All levels&rdquo; to see
                    every tool.
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}