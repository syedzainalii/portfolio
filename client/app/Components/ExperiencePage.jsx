"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { experienceData } from "@/assets/assets";

/*
  Experience as an engineering drawing sheet. Every role is a revision in the
  revision table (Rev A, Rev B...), and a title block closes the sheet.
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
  return { start, months: end - start + 1 };
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

const COLS = "sm:grid-cols-[4.5rem_1fr_12rem_6rem]";

export default function ExperiencePage() {
  const roles = useMemo(
    () =>
      experienceData
        .map((r) => ({ ...r, p: parsePeriod(r.period) }))
        .sort((a, b) => (a.p?.start ?? 0) - (b.p?.start ?? 0)),
    []
  );
  const [open, setOpen] = useState(roles.length - 1); // newest revision open first

  return (
    <article className="site-container pb-20 pt-24 sm:pt-28">
      <header className="mb-10 sm:mb-12">
        <h1 className="break-words font-Ovo text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
          Work experience
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-white/65 sm:text-lg sm:leading-8">
          My roles in manufacturing, planning and development, laid out like an engineering drawing.
          Open any revision to see what I worked on.
        </p>
      </header>

    <div className="rounded-md border-2 border-black p-1.5 dark:border-white/80 sm:p-2.5">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes rev-in { from { opacity: 0; } to { opacity: 1; } }
            .rev-in { animation: rev-in 0.35s ease-out both; }
            @media (prefers-reduced-motion: reduce) { .rev-in { animation: none; } }
          `,
        }}
      />

      <div className="border border-black/70 bg-white dark:border-white/60 dark:bg-darkHover">
        {/* Zone markers, as on the border of a drawing */}
        <div aria-hidden className="grid grid-cols-6 border-b border-black/70 text-center text-xs leading-5 text-gray-500 dark:border-white/60 dark:text-white/50">
          {[1, 2, 3, 4, 5, 6].map((z) => (
            <span key={z} className="border-r border-black/30 last:border-r-0 dark:border-white/25">
              {z}
            </span>
          ))}
        </div>

        {/* Revision table header */}
        <div className={`hidden gap-4 border-b-2 border-black/70 px-4 py-2 text-sm font-semibold leading-6 dark:border-white/60 sm:grid ${COLS}`}>
          <span>Rev</span>
          <span>Role and company</span>
          <span>Period</span>
          <span>Duration</span>
        </div>

        <ol>
          {roles.map((r, i) => {
            const on = open === i;
            const ach = r.achievements ?? [];
            const tech = r.technologies ?? [];
            return (
              <li key={r.id} className="border-b border-black/20 dark:border-white/20">
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setOpen(on ? -1 : i)}
                  className={`grid w-full grid-cols-[3rem_1fr] items-center gap-x-4 gap-y-1 px-4 py-4 text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400 sm:py-5 ${COLS} ${
                    on ? "bg-amber-400/15" : "hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className={`row-span-2 font-Ovo text-4xl leading-none sm:row-span-1 ${on ? "text-amber-600 dark:text-amber-400" : ""}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="min-w-0">
                    <span className="block break-words font-Ovo text-xl leading-tight sm:text-2xl">{r.role}</span>
                    <span className="block text-sm leading-6 text-gray-500 dark:text-white/55">{r.company}</span>
                  </span>
                  <span className="col-start-2 text-sm leading-6 sm:col-start-auto">{r.period}</span>
                  <span className="hidden text-sm leading-6 text-gray-500 dark:text-white/55 sm:block">
                    {r.p ? `${r.p.months} ${r.p.months === 1 ? "month" : "months"}` : ""}
                  </span>
                </button>

                {on && (
                  <div className="rev-in grid gap-8 px-4 pb-8 pt-2 sm:pl-[6.5rem] lg:grid-cols-[1fr_15rem] lg:gap-12">
                    <div className="min-w-0">
                      {r.location && <p className="mb-3 text-sm leading-6 text-gray-500 dark:text-white/55">{r.location}</p>}
                      <p className="max-w-3xl text-base leading-7 text-gray-600 dark:text-white/70 sm:text-lg sm:leading-8">{r.description}</p>

                      {ach.length > 0 && (
                        <ol className="mt-6">
                          {ach.map((item, k) => {
                            const { lead, rest } = splitHighlight(item);
                            return (
                              <li key={item} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-t border-black/10 py-4 first:border-t-0 dark:border-white/15">
                                {/* Balloon number, as used for callouts on drawings */}
                                <span aria-hidden className="mt-1 grid h-7 w-7 place-items-center rounded-full border-2 border-amber-400 text-sm font-semibold leading-none">
                                  {k + 1}
                                </span>
                                <p className="min-w-0 break-words text-base leading-7 text-gray-500 dark:text-white/55 sm:text-lg sm:leading-8">
                                  <span className="font-Ovo text-xl leading-8 text-black dark:text-white sm:text-2xl sm:leading-9">{lead}</span>
                                  {rest}
                                </p>
                              </li>
                            );
                          })}
                        </ol>
                      )}
                    </div>

                    <aside className="min-w-0 space-y-6">
                      {tech.length > 0 && (
                        <section>
                          <h3 className="text-base font-semibold leading-6">Tools used</h3>
                          <ul className="mt-2 flex flex-wrap gap-2">
                            {tech.map((t) => (
                              <li key={t} className="rounded-md border border-black/15 px-2.5 py-1 text-sm leading-5 dark:border-white/20">
                                {t}
                              </li>
                            ))}
                          </ul>
                        </section>
                      )}
                      {r.report && (
                        <a
                          href={r.report}
                          download
                          className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white outline-none transition-colors duration-200 hover:bg-amber-400 hover:text-black focus-visible:ring-2 focus-visible:ring-amber-400 dark:bg-white dark:text-black dark:hover:bg-amber-400"
                        >
                          <Download className="h-4 w-4" />
                          Download report
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      )}
                    </aside>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        {/* Title block */}
        <dl className="grid grid-cols-2 border-t-2 border-black/70 text-sm leading-6 dark:border-white/60 sm:ml-auto sm:max-w-xl sm:grid-cols-4 sm:border-l">
          {[
            ["Drawing", "Work experience"],
            ["Drawn by", "Syed Zain Ali"],
            ["Revisions", `${roles.length}`],
            ["Sheet", "1 of 1"],
          ].map(([k, v]) => (
            <div key={k} className="border-b border-r border-black/20 px-3 py-2 last:border-r-0 dark:border-white/20 sm:border-b-0">
              <dt className="text-xs leading-5 text-gray-500 dark:text-white/50">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
    </article>
  );
}