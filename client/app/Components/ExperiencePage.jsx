import { ArrowUpRight, Download } from "lucide-react";
import { experienceData } from "@/assets/assets";

export const metadata = {
  title: "Experience",
  description:
    "Work experience and internships of Syed Zain Ali in manufacturing, planning and development.",
};

const pad = (n) => String(n).padStart(2, "0");
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Reads periods like "March - April (2025)" or "March (2024)". Returns month indexes.
function parsePeriod(text) {
  const t = String(text ?? "");
  const year = t.match(/(\d{4})/);
  if (!year) return null;
  const names = t.match(/[A-Za-z]{3,}/g) ?? [];
  const idx = names
    .map((n) => MONTHS.indexOf(n.slice(0, 3).toLowerCase()))
    .filter((i) => i >= 0);
  if (!idx.length) return null;

  const y = Number(year[1]);
  const start = y * 12 + idx[0];
  let end = y * 12 + (idx[1] ?? idx[0]);
  if (end < start) end += 12; // e.g. "November - February"
  return { year: y, start, end, months: end - start + 1 };
}

const monthLabel = (m) => `${MONTH_NAMES[((m % 12) + 12) % 12]} ${Math.floor(m / 12)}`;

// Splits a highlight into a large opening phrase and the rest of the sentence
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

/* ---------- Career ruler ---------- */
function Ruler({ roles }) {
  const items = roles
    .map((r, i) => ({ r, i, p: parsePeriod(r.period) }))
    .filter((x) => x.p);
  if (!items.length) return null;

  const min = Math.min(...items.map((x) => x.p.start)) - 1;
  const max = Math.max(...items.map((x) => x.p.end)) + 2;
  const total = max - min;
  const pct = (m) => ((m - min) / total) * 100;

  const ticks = [];
  for (let m = min; m <= max; m++) if (m % 12 === 0) ticks.push(m);

  return (
    <div
      className="relative rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-darkHover sm:p-7"
      role="group"
      aria-label="Career timeline"
    >
      <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
        Career ruler · {monthLabel(min + 1)} to {monthLabel(max - 2)}
      </p>

      <div className="relative mt-4 sm:mt-5" style={{ height: `${items.length * 3.25 + 2.5}rem` }}>
        {/* Year ticks */}
        {ticks.map((m) => (
          <div
            key={m}
            aria-hidden
            className="absolute inset-y-0 border-l border-dashed border-black/15 dark:border-white/20"
            style={{ left: `${pct(m)}%` }}
          >
            <span className="absolute -top-1 left-1.5 font-mono text-[11px] leading-4 text-gray-500 dark:text-white/50">
              {m / 12}
            </span>
          </div>
        ))}

        {/* Bars */}
        {items.map(({ r, i, p }, row) => {
          const left = pct(p.start);
          const width = (p.months / total) * 100;
          const labelRight = left + width < 58;
          return (
            <a
              key={r.id}
              href={`#role-${r.id}`}
              aria-label={`Jump to ${r.role}, ${r.period}`}
              className="group absolute block h-10 w-full outline-none"
              style={{ top: `${row * 3.25 + 1.75}rem` }}
            >
              <span
                className="absolute top-1 h-8 rounded-lg bg-amber-400 shadow-[0_8px_20px_-10px_rgba(202,138,4,0.9)] transition-all duration-300 group-hover:h-10 group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-black motion-reduce:transition-none dark:group-focus-visible:ring-white"
                style={{ left: `${left}%`, width: `${Math.max(width, 1.5)}%` }}
              />
              <span
                className="absolute top-1 flex h-8 items-center whitespace-nowrap font-mono text-[11px] font-semibold leading-4 text-black"
                style={{ left: `${left}%`, width: `${Math.max(width, 1.5)}%`, justifyContent: "center" }}
              >
                {pad(i + 1)}
              </span>
              <span
                className="absolute top-1 flex h-8 max-w-[70%] items-center truncate text-sm font-medium leading-5"
                style={
                  labelRight
                    ? { left: `calc(${left + width}% + 0.6rem)` }
                    : { right: `calc(${100 - left}% + 0.6rem)`, textAlign: "right" }
                }
              >
                <span className="truncate">{r.role}</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  const roles = experienceData;
  const parsed = roles.map((r) => parsePeriod(r.period));
  const totalMonths = parsed.reduce((n, p) => n + (p ? p.months : 0), 0);
  const highlights = roles.reduce((n, r) => n + (r.achievements ?? []).length, 0);
  const toolCount = new Set(roles.flatMap((r) => r.technologies ?? [])).size;

  const stats = [
    { label: "Roles", value: pad(roles.length) },
    { label: "Months", value: pad(totalMonths) },
    { label: "Highlights", value: pad(highlights) },
    ...(toolCount > 0 ? [{ label: "Tools", value: pad(toolCount) }] : []),
  ];

  return (
    <article className="site-container pb-20 pt-24 sm:pt-28">
      {/* ===== Header ===== */}
      <header className="mb-10 sm:mb-12">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
          Experience / Logbook
        </p>
        <h1 className="break-words font-Ovo text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
          Work Experience
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-white/65 sm:text-lg sm:leading-8">
          Every role on one ruler, then the full log of what I worked on, in order.
        </p>
      </header>

      {/* ===== Stats ===== */}
      <dl
        className={`grid divide-x divide-black/10 rounded-2xl border border-black/10 dark:divide-white/15 dark:border-white/15 ${
          stats.length === 4 ? "grid-cols-4" : "grid-cols-3"
        }`}
      >
        {stats.map((s) => (
          <div key={s.label} className="px-2 py-4 text-center sm:px-6 sm:py-5">
            <dd className="font-mono text-2xl font-semibold leading-8 tabular-nums sm:text-5xl sm:leading-[3.25rem]">
              {s.value}
            </dd>
            <dt className="mt-1 font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
              {s.label}
            </dt>
          </div>
        ))}
      </dl>

      {/* ===== Ruler ===== */}
      <div className="mt-6">
        <Ruler roles={roles} />
      </div>

      {/* ===== Entries ===== */}
      <ol className="mt-14 sm:mt-20">
        {roles.map((exp, index) => {
          const p = parsed[index];
          const year = p?.year ?? String(exp.period ?? "").match(/\d{4}/)?.[0] ?? "—";
          const achievements = exp.achievements ?? [];
          const technologies = exp.technologies ?? [];

          return (
            <li
              key={exp.id}
              id={`role-${exp.id}`}
              className="scroll-mt-28 border-t border-black/15 py-10 dark:border-white/20 sm:py-14 lg:grid lg:grid-cols-12 lg:gap-12"
            >
              {/* Left: year + dates */}
              <div className="mb-8 lg:col-span-3 lg:mb-0">
                <div className="lg:sticky lg:top-28">
                  <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
                    Entry {pad(index + 1)} / {pad(roles.length)}
                  </p>
                  <p
                    aria-hidden
                    className="mt-2 select-none font-mono text-7xl font-bold leading-none tabular-nums text-transparent sm:text-8xl"
                    style={{ WebkitTextStroke: "1.5px #f59e0b" }}
                  >
                    {year}
                  </p>
                  <p className="mt-4 text-sm font-medium leading-6">{exp.period}</p>
                  {p && (
                    <p className="font-mono text-xs leading-5 text-gray-500 dark:text-white/50">
                      {p.months} {p.months === 1 ? "month" : "months"}
                    </p>
                  )}
                  <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-white/55">
                    {exp.location}
                  </p>
                </div>
              </div>

              {/* Right: the log */}
              <div className="min-w-0 lg:col-span-9">
                <h2 className="break-words font-Ovo text-3xl leading-tight sm:text-5xl">
                  {exp.role}
                </h2>
                <p className="mt-2 text-lg font-medium text-gray-600 dark:text-white/70">
                  {exp.company}
                </p>

                <p className="mt-5 max-w-3xl text-base leading-7 text-gray-600 dark:text-white/65 sm:text-lg sm:leading-8">
                  {exp.description}
                </p>

                {/* Highlights */}
                {achievements.length > 0 && (
                  <>
                    <h3 className="mb-1 mt-10 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
                      What I worked on · {pad(achievements.length)}
                    </h3>
                    <ol>
                      {achievements.map((item, i) => {
                        const { lead, rest } = splitHighlight(item);
                        return (
                          <li
                            key={item}
                            className="grid grid-cols-[3.25rem_1fr] gap-x-3 border-t border-black/10 py-5 first:border-t-0 dark:border-white/15 sm:grid-cols-[4.5rem_1fr] sm:py-6"
                          >
                            <span className="pt-1 font-mono text-xs leading-6 tracking-widest text-amber-600 dark:text-amber-400">
                              LOG {pad(i + 1)}
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

                {/* Tools */}
                {technologies.length > 0 && (
                  <p className="mt-6 text-sm leading-7 text-gray-500 dark:text-white/55">
                    <span className="font-medium text-black dark:text-white">Tooling </span>
                    {technologies.join("  ·  ")}
                  </p>
                )}

                {/* Report */}
                {exp.report && (
                  <a
                    href={exp.report}
                    download
                    className="group mt-8 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400 hover:text-black hover:shadow-[0_12px_30px_-10px_rgba(202,138,4,0.8)] dark:bg-white dark:text-black dark:hover:bg-amber-400"
                  >
                    <Download className="h-4 w-4" />
                    Download full report
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            </li>
          );
        })}
        <li aria-hidden className="border-t border-black/15 dark:border-white/20" />
      </ol>
    </article>
  );
}