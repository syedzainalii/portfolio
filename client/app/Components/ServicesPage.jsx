"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Play, RotateCcw } from "lucide-react";
import { serviceData } from "@/assets/assets";

/*
  Services as a machine control panel. On desktop a selector card (rotary knob plus
  program list) sits beside the console. On phones the card becomes a swipeable row of pills.
*/

function Knob({ n, active, onPick }) {
  const ang = (i) => (n === 1 ? 0 : -135 + (270 * i) / (n - 1));
  return (
    <svg viewBox="-110 -110 220 220" aria-hidden className="mx-auto w-full max-w-[13rem]">
      <circle r="106" className="fill-white stroke-black/15 dark:fill-darkHover dark:stroke-white/20" strokeWidth="1.5" />

      {Array.from({ length: n }, (_, i) => {
        const r = (ang(i) * Math.PI) / 180;
        const x = 84 * Math.sin(r);
        const y = -84 * Math.cos(r);
        const on = i === active;
        return (
          <g key={i} onClick={() => onPick(i)} className="cursor-pointer">
            <circle cx={x} cy={y} r="14" className={on ? "fill-amber-400" : "fill-transparent stroke-black/25 dark:stroke-white/30"} />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="600" className={on ? "fill-black" : "fill-gray-600 dark:fill-white/70"}>
              {i + 1}
            </text>
          </g>
        );
      })}

      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `rotate(${ang(active)}deg)`,
          transition: "transform 600ms cubic-bezier(.3,1.4,.5,1)",
        }}
      >
        <circle r="50" className="fill-neutral-900 stroke-amber-400 dark:fill-black" strokeWidth="3" />
        <circle r="44" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="5" strokeDasharray="2 4" />
        <line x1="0" y1="-14" x2="0" y2="-40" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function ServicesPage() {
  const n = serviceData.length;
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(-1); // -1 idle, otherwise index of the lit step
  const s = serviceData[active];
  const includes = s?.includes ?? [];
  const steps = s?.process ?? [];
  const tools = s?.tools ?? [];

  useEffect(() => {
    if (run < 0 || run >= steps.length - 1) return;
    const id = setTimeout(() => setRun((r) => r + 1), 1500);
    return () => clearTimeout(id);
  }, [run, steps.length]);

  const pick = (i, el) => {
    setActive(i);
    setRun(-1);
    el?.scrollIntoView?.({ inline: "center", block: "nearest", behavior: "smooth" });
  };

  if (!s) return null;
  const running = run >= 0 && run < steps.length - 1;
  const done = run >= steps.length - 1 && run >= 0;

  return (
    <section className="site-container pb-16 pt-28 sm:pt-32">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* No footer on this page (it is removed again when you leave the page) */
            footer { display: none !important; }
            @keyframes svc-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
            .svc-in { animation: svc-in 0.4s ease-out both; }
            @media (prefers-reduced-motion: reduce) { .svc-in { animation: none; } }
          `,
        }}
      />

      <div className="grid items-start gap-5 lg:grid-cols-[20rem_1fr] lg:gap-10">
        {/* ===== Phones and tablets: swipeable pills ===== */}
        <div
          role="group"
          aria-label="Choose a service"
          className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {serviceData.map((x, i) => {
            const on = i === active;
            return (
              <button
                key={x.link}
                type="button"
                aria-pressed={on}
                onClick={(e) => pick(i, e.currentTarget)}
                className={`inline-flex min-h-11 shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium leading-5 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  on
                    ? "border-amber-400 bg-amber-400 text-black"
                    : "border-black/15 text-gray-700 dark:border-white/20 dark:text-white/80"
                }`}
              >
                <span className="text-xs font-semibold tabular-nums">{i + 1}</span>
                {x.title}
              </button>
            );
          })}
        </div>

        {/* ===== Desktop: selector card ===== */}
        <aside className="hidden lg:sticky lg:top-28 lg:block">
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-darkHover">
            <div
              className="rounded-2xl py-4 text-black/10 dark:text-white/10"
              style={{
                backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            >
              <Knob n={n} active={active} onPick={pick} />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous service"
                onClick={() => pick((active - 1 + n) % n)}
                className="grid h-11 w-11 place-items-center rounded-full border border-black/15 outline-none transition-colors duration-200 hover:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <p className="text-sm leading-6 text-gray-500 dark:text-white/55">
                Service {active + 1} of {n}
              </p>
              <button
                type="button"
                aria-label="Next service"
                onClick={() => pick((active + 1) % n)}
                className="grid h-11 w-11 place-items-center rounded-full border border-black/15 outline-none transition-colors duration-200 hover:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <ol aria-label="Services" className="mt-4 space-y-1">
              {serviceData.map((x, i) => {
                const on = i === active;
                return (
                  <li key={x.link}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => pick(i)}
                      className={`block w-full rounded-xl border-l-4 px-3 py-3 text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                        on
                          ? "border-amber-400 bg-amber-400/15"
                          : "border-transparent text-gray-500 hover:bg-black/5 hover:text-black dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white"
                      }`}
                    >
                      <span className="block break-words font-Ovo text-lg leading-6">{x.title}</span>
                      {on && <span className="mt-1 line-clamp-2 block text-sm leading-5 text-gray-600 dark:text-white/65">{x.description}</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>

        {/* ===== Console ===== */}
        <div
          key={s.link}
          aria-live="polite"
          className="svc-in min-w-0 rounded-3xl bg-neutral-900 p-5 text-white shadow-2xl ring-1 ring-white/10 sm:p-8"
        >
          <h2 className="break-words font-Ovo text-3xl leading-tight sm:text-5xl">{s.title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            {s.detailedDescription ?? s.description}
          </p>

          {includes.length > 0 && (
            <ul className="mt-6 grid gap-x-8 gap-y-3 sm:mt-7 sm:grid-cols-2">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-400 text-black">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="min-w-0 break-words text-base leading-6">{item}</span>
                </li>
              ))}
            </ul>
          )}

          {steps.length > 0 && (
            <div className="mt-8 border-t border-white/15 pt-6 sm:mt-9 sm:pt-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold leading-7">How the work runs</h3>
                <button
                  type="button"
                  onClick={() => setRun(run < 0 || done ? 0 : run)}
                  disabled={running}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-amber-400 px-5 py-2 text-sm font-semibold text-amber-300 outline-none transition-colors duration-200 hover:bg-amber-400 hover:text-black focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50 sm:w-auto"
                >
                  {done ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {run < 0 ? "Run process cycle" : done ? "Run again" : "Running"}
                </button>
              </div>

              <ol className="mt-4 space-y-1 sm:mt-5">
                {steps.map((st, i) => {
                  const lit = run < 0 || i <= run;
                  return (
                    <li key={st.title} className={`flex gap-4 rounded-xl px-2 py-3 transition-opacity duration-500 sm:px-3 ${lit ? "opacity-100" : "opacity-30"}`}>
                      <span
                        aria-hidden
                        className={`mt-1.5 h-3 w-3 shrink-0 rounded-full transition-all duration-500 ${
                          run >= 0 && i <= run ? "bg-amber-400 shadow-[0_0_14px_3px_rgba(251,191,36,0.7)]" : "bg-white/25"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold leading-6">{st.title}</p>
                        <p className="mt-0.5 text-sm leading-6 text-white/60">{st.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {tools.length > 0 && (
            <p className="mt-6 text-sm leading-7 text-white/55 sm:mt-7">
              <span className="font-medium text-white">Software: </span>
              {tools.join(", ")}
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-amber-400 px-7 py-3 text-base font-semibold text-black outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
            >
              Request this service
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href={`/services/${s.link}`} className="group inline-flex min-h-12 items-center justify-center gap-1.5 px-2 text-sm font-medium">
              <span className="relative">
                Read full details
                <span className="absolute -bottom-1 left-0 h-px w-full bg-current opacity-30 transition-opacity duration-300 group-hover:opacity-100" />
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}