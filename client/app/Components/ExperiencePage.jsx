"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Download, MapPin } from "lucide-react";
import { experienceData } from "@/assets/assets";

/*
  Experience as a stress-strain curve, the plot every mechanical engineer knows.
  Time runs left to right and the material gets stronger under load. Each role is a
  point on the curve. Pick a role and the amber line travels up the curve to it.
*/

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Reads periods like "March - April (2025)" or "March (2024)"
function parsePeriod(text) {
  const t = String(text ?? "");
  const year = t.match(/(\d{4})/);
  if (!year) return null;
  const idx = (t.match(/[A-Za-z]{3,}/g) ?? [])
    .map((x) => MONTHS.indexOf(x.slice(0, 3).toLowerCase()))
    .filter((i) => i >= 0);
  if (!idx.length) return null;
  const y = Number(year[1]);
  const start = y * 12 + idx[0];
  let end = y * 12 + (idx[1] ?? idx[0]);
  if (end < start) end += 12;
  return { year: y, start, months: end - start + 1 };
}

function splitHighlight(text) {
  const words = String(text).split(" ");
  if (words.length <= 5) return { lead: text, rest: "" };
  let n = 4;
  for (let k = 1; k < Math.min(words.length, 7); k++) {
    if (/[,;:]$/.test(words[k])) {
      n = k + 1;
      break;
    }
  }
  return { lead: words.slice(0, n).join(" "), rest: ` ${words.slice(n).join(" ")}` };
}

// Elastic climb, yield knee, then steady strain hardening
const CURVE = "M30 270 C 60 220 100 150 150 112 C 190 85 230 80 290 70 C 380 55 470 40 570 34";
const AXIS_Y = 270;

export default function ExperiencePage() {
  const roles = useMemo(
    () =>
      experienceData
        .map((r) => ({ ...r, p: parsePeriod(r.period) }))
        .sort((a, b) => (a.p?.start ?? 0) - (b.p?.start ?? 0)),
    []
  );
  const n = roles.length;
  const totalMonths = roles.reduce((m, r) => m + (r.p?.months ?? 0), 0);

  const [active, setActive] = useState(Math.max(n - 1, 0));
  const pathRef = useRef(null);
  const [total, setTotal] = useState(0);
  const [pts, setPts] = useState([]);

  // Place each role on the curve by measuring the real path
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !n) return;
    const T = path.getTotalLength();
    setTotal(T);
    setPts(
      roles.map((_, i) => {
        const len = T * (n === 1 ? 0.55 : 0.14 + (0.78 * i) / (n - 1));
        const pt = path.getPointAtLength(len);
        return { x: pt.x, y: pt.y, len };
      })
    );
  }, [roles, n]);

  const role = roles[active];
  if (!role) return null;
  const cur = pts[active];
  const ach = role.achievements ?? [];
  const tech = role.technologies ?? [];

  return (
    <section className="site-container pb-20 pt-28 sm:pt-32">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes xp-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
            .xp-draw { stroke-dasharray: 1; stroke-dashoffset: 0; animation: xp-draw 1.4s ease-out both; }
            @keyframes xp-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
            .xp-in { animation: xp-in 0.4s ease-out both; }
            @media (prefers-reduced-motion: reduce) { .xp-draw, .xp-in { animation: none; } }
          `,
        }}
      />

      <header className="mb-8 sm:mb-10">
        <h1 className="break-words font-Ovo text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">Work experience</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-white/65 sm:text-lg sm:leading-8">
          {n} {n === 1 ? "role" : "roles"} and {totalMonths} {totalMonths === 1 ? "month" : "months"} in
          manufacturing, planning and development. Like metal under load, each role made me stronger.
        </p>
      </header>

      {/* ===== The curve ===== */}
      <div className="rounded-3xl border border-black/10 bg-white p-3 shadow-sm dark:border-white/15 dark:bg-darkHover sm:p-6">
        <svg viewBox="0 0 600 310" role="img" aria-label="Career curve with one point per role" className="w-full overflow-visible">
          <defs>
            <linearGradient id="xp-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f59e0b" stopOpacity="0.22" />
              <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* axes */}
          <g className="stroke-black/35 dark:stroke-white/40" strokeWidth="1.5" fill="none">
            <path d={`M30 ${AXIS_Y} H585`} />
            <path d={`M30 ${AXIS_Y} V15`} />
          </g>
          <text x="585" y="296" textAnchor="end" fontSize="14" className="fill-gray-500 dark:fill-white/55">Time</text>
          <text x="38" y="20" fontSize="14" className="fill-gray-500 dark:fill-white/55">Growth</text>

          {/* zone names, desktop only (too small on phones) */}
          <g fontSize="13" className="hidden fill-gray-400 dark:fill-white/35 sm:block">
            <text x="52" y="200">Learning</text>
            <text x="150" y="150" dy="-34" dx="30">Yield</text>
            <text x="360" y="100">Hardening</text>
          </g>

          {/* area + base curve (draws itself once) */}
          <path d={`${CURVE} L570 ${AXIS_Y} L30 ${AXIS_Y} Z`} fill="url(#xp-area)" stroke="none" />
          <path
            ref={pathRef}
            d={CURVE}
            pathLength="1"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            className="xp-draw stroke-black/20 dark:stroke-white/25"
          />

          {/* amber progress: travels to the selected role */}
          {cur && total > 0 && (
            <path
              d={CURVE}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${cur.len} ${total}`}
              style={{ transition: "stroke-dasharray 800ms cubic-bezier(.4,0,.2,1)" }}
              className="motion-reduce:transition-none"
            />
          )}

          {/* role points */}
          {pts.map((pt, i) => {
            const on = i === active;
            const passed = i <= active;
            return (
              <g key={roles[i].id}>
                <line x1={pt.x} y1={pt.y} x2={pt.x} y2={AXIS_Y} strokeDasharray="4 5" className={on ? "stroke-amber-500" : "stroke-black/20 dark:stroke-white/25"} />
                <text x={pt.x} y={AXIS_Y + 22} textAnchor="middle" fontSize="15" fontWeight={on ? 700 : 400} className={on ? "fill-black dark:fill-white" : "fill-gray-500 dark:fill-white/55"}>
                  {roles[i].p?.year ?? ""}
                </text>
                <circle cx={pt.x} cy={pt.y} r="7" strokeWidth="3" stroke="#f59e0b" className={passed ? "fill-amber-400" : "fill-white dark:fill-darkHover"} />
                <circle cx={pt.x} cy={pt.y} r="26" fill="transparent" className="cursor-pointer" onClick={() => setActive(i)} />
              </g>
            );
          })}

          {/* travelling marker */}
          {cur && (
            <g style={{ transform: `translate(${cur.x}px, ${cur.y}px)`, transition: "transform 800ms cubic-bezier(.4,0,.2,1)" }} className="pointer-events-none motion-reduce:transition-none">
              <circle r="17" fill="#f59e0b" fillOpacity="0.25" />
              <circle r="9" fill="#f59e0b" stroke="#fff" strokeWidth="3" />
            </g>
          )}
        </svg>

        {/* Role pills: the easy tap targets, also used by keyboards and screen readers */}
        <div role="group" aria-label="Roles" className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center">
          {roles.map((r, i) => {
            const on = i === active;
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={on}
                onClick={(e) => {
                  setActive(i);
                  e.currentTarget.scrollIntoView?.({ inline: "center", block: "nearest", behavior: "smooth" });
                }}
                className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium leading-5 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  on ? "border-amber-400 bg-amber-400 text-black" : "border-black/15 text-gray-700 hover:border-amber-400 dark:border-white/20 dark:text-white/80"
                }`}
              >
                {r.p?.year ? `${r.p.year}: ` : ""}
                {r.company}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== Selected role ===== */}
      <article key={role.id} aria-live="polite" className="xp-in mt-6 rounded-3xl border border-black/10 bg-white p-5 shadow-lg dark:border-white/15 dark:bg-darkHover sm:mt-8 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="break-words font-Ovo text-3xl leading-tight sm:text-5xl">{role.role}</h2>
            <p className="mt-2 text-lg font-medium text-gray-600 dark:text-white/70">{role.company}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Previous role"
              disabled={active === 0}
              onClick={() => setActive(active - 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-black/15 outline-none transition-colors duration-200 hover:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-30 dark:border-white/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next role"
              disabled={active === n - 1}
              onClick={() => setActive(active + 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-black/15 outline-none transition-colors duration-200 hover:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-30 dark:border-white/20"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap gap-2 text-sm leading-5">
          <li className="rounded-full bg-amber-400/20 px-3 py-1.5 font-medium">{role.period}</li>
          {role.p && (
            <li className="rounded-full bg-black/5 px-3 py-1.5 dark:bg-white/10">
              {role.p.months} {role.p.months === 1 ? "month" : "months"}
            </li>
          )}
          {role.location && (
            <li className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 dark:bg-white/10">
              <MapPin aria-hidden className="h-4 w-4 text-amber-500" />
              {role.location}
            </li>
          )}
        </ul>

        <p className="mt-6 max-w-3xl text-base leading-7 text-gray-600 dark:text-white/70 sm:text-lg sm:leading-8">{role.description}</p>

        {ach.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold leading-7">What I worked on</h3>
            <ul className="mt-3">
              {ach.map((item) => {
                const { lead, rest } = splitHighlight(item);
                return (
                  <li key={item} className="border-l-4 border-amber-400 py-3 pl-4 sm:py-4 sm:pl-5">
                    <p className="break-words text-base leading-7 text-gray-500 dark:text-white/55 sm:text-lg sm:leading-8">
                      <span className="font-Ovo text-xl leading-8 text-black dark:text-white sm:text-2xl sm:leading-9">{lead}</span>
                      {rest}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {tech.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold leading-7">Tools used</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {tech.map((t) => (
                <li key={t} className="rounded-md border border-black/15 px-2.5 py-1 text-sm leading-5 dark:border-white/20">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {role.report && (
          <a
            href={role.report}
            download
            className="group mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white outline-none transition-colors duration-200 hover:bg-amber-400 hover:text-black focus-visible:ring-2 focus-visible:ring-amber-400 dark:bg-white dark:text-black dark:hover:bg-amber-400 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Download report
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </article>
    </section>
  );
}