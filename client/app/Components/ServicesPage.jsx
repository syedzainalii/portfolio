"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Play, RotateCcw } from "lucide-react";
import { serviceData } from "@/assets/assets";

/*
  Services as a machine control panel: turn the rotary selector to pick a service,
  then press "Run process cycle" to watch its steps light up one after another.
*/

function Knob({ n, active, onPick }) {
  const ang = (i) => (n === 1 ? 0 : -135 + (270 * i) / (n - 1));
  return (
    <svg viewBox="-110 -110 220 220" aria-hidden className="mx-auto w-full max-w-[16rem]">
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

      {/* Knob body with pointer: turns to the selected position */}
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: `rotate(${ang(active)}deg)`,
          transition: "transform 600ms cubic-bezier(.3,1.4,.5,1)",
        }}
      >
        <circle r="50" className="fill-neutral-900 stroke-amber-400 dark:fill-black" strokeWidth="3" />
        {/* knurled edge */}
        <circle r="44" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="5" strokeDasharray="2 4" />
        <line x1="0" y1="-14" x2="0" y2="-40" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function ServicesPage() {
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(-1); // -1 idle, otherwise index of the lit step
  const s = serviceData[active];
  const includes = s?.includes ?? [];
  const steps = s?.process ?? [];
  const tools = s?.tools ?? [];

  // Advance the cycle one step at a time
  useEffect(() => {
    if (run < 0 || run >= steps.length - 1) return;
    const id = setTimeout(() => setRun((r) => r + 1), 1500);
    return () => clearTimeout(id);
  }, [run, steps.length]);

  const pick = (i) => {
    setActive(i);
    setRun(-1);
  };

  if (!s) return null;
  const running = run >= 0 && run < steps.length - 1;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[19rem_1fr] lg:gap-12">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes svc-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
            .svc-in { animation: svc-in 0.4s ease-out both; }
            @media (prefers-reduced-motion: reduce) { .svc-in { animation: none; } }
          `,
        }}
      />

      {/* ===== Selector ===== */}
      <div className="lg:sticky lg:top-28">
        <Knob n={serviceData.length} active={active} onPick={pick} />
        <ol aria-label="Services" className="mt-6 divide-y divide-black/10 border-y border-black/10 dark:divide-white/15 dark:border-white/15">
          {serviceData.map((x, i) => {
            const on = i === active;
            return (
              <li key={x.link}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(i)}
                  className={`flex min-h-11 w-full items-center gap-3 px-1 py-2.5 text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    on ? "" : "text-gray-500 hover:text-black dark:text-white/55 dark:hover:text-white"
                  }`}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-semibold ${on ? "bg-amber-400 text-black" : "border border-black/25 dark:border-white/30"}`}>
                    {i + 1}
                  </span>
                  <span className="min-w-0 break-words font-Ovo text-lg leading-6">{x.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ===== Console ===== */}
      <section
        key={s.link}
        aria-live="polite"
        className="svc-in min-w-0 rounded-3xl bg-neutral-900 p-5 text-white shadow-2xl ring-1 ring-white/10 sm:p-8"
      >
        <h2 className="break-words font-Ovo text-3xl leading-tight sm:text-5xl">{s.title}</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
          {s.detailedDescription ?? s.description}
        </p>

        {includes.length > 0 && (
          <ul className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
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
          <div className="mt-9 border-t border-white/15 pt-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold leading-7">How the work runs</h3>
              <button
                type="button"
                onClick={() => setRun(run < 0 || run >= steps.length - 1 ? 0 : run)}
                disabled={running}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-amber-400 px-5 py-2 text-sm font-semibold text-amber-300 outline-none transition-colors duration-200 hover:bg-amber-400 hover:text-black focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
              >
                {run >= steps.length - 1 ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {run < 0 ? "Run process cycle" : run >= steps.length - 1 ? "Run again" : "Running"}
              </button>
            </div>

            <ol className="mt-5 space-y-1">
              {steps.map((st, i) => {
                const lit = run < 0 || i <= run;
                return (
                  <li key={st.title} className={`flex gap-4 rounded-xl px-3 py-3 transition-opacity duration-500 ${lit ? "opacity-100" : "opacity-30"}`}>
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
          <p className="mt-7 text-sm leading-7 text-white/55">
            <span className="font-medium text-white">Software: </span>
            {tools.join(", ")}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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
      </section>
    </div>
  );
}