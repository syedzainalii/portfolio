"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Download, MapPin } from "lucide-react";
import { experienceData } from "@/assets/assets";

/*
  Experience as a production line: each role is a station on a conveyor.
  Pick a station and the workpiece rolls to it, then the role opens as a
  route sheet, with the work listed as numbered operations (Op 10, Op 20...).
*/

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Reads periods like "March - April (2025)" or "March (2024)"
function parsePeriod(text) {
  const t = String(text ?? "");
  const year = t.match(/(\d{4})/);
  if (!year) return null;
  const idx = (t.match(/[A-Za-z]{3,}/g) ?? [])
    .map((n) => MONTHS.indexOf(n.slice(0, 3).toLowerCase()))
    .filter((i) => i >= 0);
  if (!idx.length) return null;
  const y = Number(year[1]);
  const start = y * 12 + idx[0];
  let end = y * 12 + (idx[1] ?? idx[0]);
  if (end < start) end += 12;
  return { year: y, start, months: end - start + 1 };
}

// Large opening phrase + the rest of the sentence
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

export default function ExperienceExplorer() {
  // Oldest on the left, newest on the right, like parts moving down a line
  const roles = useMemo(
    () =>
      experienceData
        .map((r) => ({ ...r, p: parsePeriod(r.period) }))
        .sort((a, b) => (a.p?.start ?? 0) - (b.p?.start ?? 0)),
    []
  );

  const [active, setActive] = useState(Math.max(roles.length - 1, 0));
  const n = roles.length;
  const role = roles[active];
  if (!role) return null;

  const achievements = role.achievements ?? [];
  const technologies = role.technologies ?? [];

  const go = (i, el) => {
    setActive(i);
    el?.scrollIntoView?.({ inline: "center", block: "nearest", behavior: "smooth" });
  };

  const onKey = (e) => {
    if (e.key === "ArrowRight") setActive((a) => Math.min(a + 1, n - 1));
    if (e.key === "ArrowLeft") setActive((a) => Math.max(a - 1, 0));
  };

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes exp-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
            .exp-in { animation: exp-in 0.4s ease-out both; }
            @media (prefers-reduced-motion: reduce) { .exp-in { animation: none; } }
          `,
        }}
      />

      {/* ===== The line ===== */}
      <div className="-mx-1 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          role="group"
          aria-label="Roles, oldest to newest"
          onKeyDown={onKey}
          className="relative grid"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(10rem, 1fr))` }}
        >
          {roles.map((r, i) => {
            const on = i === active;
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={on}
                onClick={(e) => go(i, e.currentTarget)}
                className="group min-w-0 rounded-xl px-3 pb-10 pt-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span
                  className={`block font-Ovo text-4xl leading-none transition-colors duration-300 sm:text-5xl ${
                    on ? "text-black dark:text-white" : "text-gray-400 group-hover:text-gray-600 dark:text-white/35 dark:group-hover:text-white/60"
                  }`}
                >
                  {r.p?.year ?? ""}
                </span>
                <span className={`mt-2 block break-words text-sm font-medium leading-5 ${on ? "" : "text-gray-500 dark:text-white/55"}`}>
                  {r.company}
                </span>
              </button>
            );
          })}

          {/* Conveyor belt */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-3 h-3">
            <div className="absolute inset-x-0 top-1/2 h-px bg-black/30 dark:bg-white/35" />
            {/* rollers */}
            <div
              className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 text-black/30 dark:text-white/35"
              style={{
                backgroundImage: "radial-gradient(circle, currentColor 1.5px, transparent 2px)",
                backgroundSize: "14px 8px",
              }}
            />
            {/* workpiece */}
            <div
              className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded bg-amber-400 shadow-[0_6px_16px_-4px_rgba(202,138,4,0.9)] transition-all duration-[700ms] ease-[cubic-bezier(.3,1.3,.5,1)] motion-reduce:transition-none"
              style={{
                left: `${((active + 0.5) / n) * 100}%`,
                transform: `translate(-50%, -50%) rotate(${active * 90}deg)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ===== Route sheet ===== */}
      <article
        key={role.id}
        aria-live="polite"
        className="exp-in mt-6 overflow-hidden rounded-3xl border border-black/15 bg-white shadow-lg dark:border-white/20 dark:bg-darkHover"
      >
        {/* Sheet header */}
        <header className="border-b-2 border-black/80 p-5 dark:border-white/70 sm:p-8">
          <h2 className="break-words font-Ovo text-3xl leading-tight sm:text-5xl">{role.role}</h2>
          <p className="mt-2 text-lg font-medium text-gray-600 dark:text-white/70">{role.company}</p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm leading-6 sm:flex sm:flex-wrap sm:gap-x-12">
            <div>
              <dt className="text-gray-500 dark:text-white/50">Period</dt>
              <dd className="font-medium">{role.period}</dd>
            </div>
            {role.p && (
              <div>
                <dt className="text-gray-500 dark:text-white/50">Duration</dt>
                <dd className="font-medium">
                  {role.p.months} {role.p.months === 1 ? "month" : "months"}
                </dd>
              </div>
            )}
            {role.location && (
              <div className="col-span-2 sm:col-span-1">
                <dt className="text-gray-500 dark:text-white/50">Location</dt>
                <dd className="inline-flex items-center gap-1.5 font-medium">
                  <MapPin aria-hidden className="h-4 w-4 text-amber-500" />
                  {role.location}
                </dd>
              </div>
            )}
          </dl>
        </header>

        <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-[1fr_16rem] lg:gap-14">
          <div className="min-w-0">
            <p className="max-w-3xl text-base leading-7 text-gray-600 dark:text-white/70 sm:text-lg sm:leading-8">
              {role.description}
            </p>

            {achievements.length > 0 && (
              <>
                <h3 className="mb-1 mt-9 text-lg font-semibold leading-7">Operations performed</h3>
                <ol>
                  {achievements.map((item, i) => {
                    const { lead, rest } = splitHighlight(item);
                    return (
                      <li
                        key={item}
                        className="grid grid-cols-[3.5rem_1fr] gap-x-3 border-t border-black/10 py-5 first:border-t-0 dark:border-white/15 sm:grid-cols-[4.5rem_1fr]"
                      >
                        {/* Op numbers step by 10, like a real routing sheet */}
                        <span className="pt-1.5 text-sm font-semibold leading-6 text-amber-600 dark:text-amber-400">
                          Op {(i + 1) * 10}
                        </span>
                        <p className="min-w-0 break-words text-base leading-7 text-gray-500 dark:text-white/55 sm:text-lg sm:leading-8">
                          <span className="font-Ovo text-xl leading-8 text-black dark:text-white sm:text-2xl sm:leading-9">
                            {lead}
                          </span>
                          {rest}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </>
            )}
          </div>

          {/* Side column: tooling + report */}
          <aside className="min-w-0 space-y-8 lg:border-l lg:border-black/10 lg:pl-8 dark:lg:border-white/15">
            {technologies.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold leading-7">Tools used</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {technologies.map((t) => (
                    <li key={t} className="rounded-md border border-black/15 px-2.5 py-1 text-sm leading-5 dark:border-white/20">
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {role.report && (
              <a
                href={role.report}
                download
                className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400 hover:text-black focus-visible:ring-2 focus-visible:ring-amber-400 dark:bg-white dark:text-black dark:hover:bg-amber-400 motion-reduce:transition-none"
              >
                <Download className="h-4 w-4" />
                Download report
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </aside>
        </div>
      </article>

      <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-white/55">
        Pick a station on the line, or use the left and right arrow keys, to move between roles.
      </p>
    </div>
  );
}