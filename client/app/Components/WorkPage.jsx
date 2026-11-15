"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { workData } from "@/assets/assets";

/*
  Projects as an exploded assembly drawing: every project is a layer in a tilted stack,
  numbered with a callout balloon. Pick a layer and it lifts out of the stack.
*/

const GAP = 70; // distance between layers
const LIFT = 45; // how far the chosen layer rises

export default function WorkPage() {
  const n = workData.length;
  const [active, setActive] = useState(0);
  const p = workData[active];
  if (!p) return null;
  const tools = p.tools ?? [];

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_24rem] lg:gap-12">
      {/* ===== Exploded stack ===== */}
      <div className="relative h-[22rem] overflow-hidden sm:h-[34rem]" style={{ perspective: "1600px" }}>
        <div className="absolute inset-0 scale-[0.72] sm:scale-100" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "rotateX(58deg) rotateZ(-38deg)" }}>
            {/* Explosion axis */}
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 border-l-2 border-dashed border-amber-400/70"
              style={{ height: n * GAP + 140, transform: "translate(-50%, -50%) rotateX(90deg)" }}
            />

            {workData.map((w, i) => {
              const on = i === active;
              const z = ((n - 1) / 2 - i) * GAP + (on ? LIFT : 0);
              return (
                <button
                  key={w.slug}
                  type="button"
                  aria-pressed={on}
                  aria-label={`Layer ${i + 1}: ${w.title}`}
                  onClick={() => setActive(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`absolute left-1/2 top-1/2 h-36 w-52 overflow-hidden rounded-xl border-2 bg-slate-900 outline-none transition-all duration-500 motion-reduce:transition-none sm:h-48 sm:w-72 ${
                    on
                      ? "border-amber-400 shadow-[0_40px_60px_-15px_rgba(0,0,0,0.65)]"
                      : "border-white/70 opacity-60 hover:opacity-90 dark:border-white/30"
                  }`}
                  style={{ transform: `translate(-50%, -50%) translateZ(${z}px)` }}
                >
                  <Image src={w.bgImage} alt="" fill sizes="300px" className="object-cover" />
                  <span
                    aria-hidden
                    className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-amber-400 text-sm font-semibold text-black"
                  >
                    {i + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== Parts list + details ===== */}
      <div className="min-w-0">
        <ol aria-label="Projects" className="divide-y divide-black/10 border-y border-black/10 dark:divide-white/15 dark:border-white/15">
          {workData.map((w, i) => {
            const on = i === active;
            return (
              <li key={w.slug}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(i)}
                  className={`flex min-h-11 w-full items-center gap-3 px-1 py-3 text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    on ? "" : "text-gray-500 hover:text-black dark:text-white/55 dark:hover:text-white"
                  }`}
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors duration-300 ${
                      on ? "bg-amber-400 text-black" : "border border-black/25 dark:border-white/30"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 break-words font-Ovo text-lg leading-6">{w.title}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div key={p.slug} aria-live="polite" className="work-in mt-6">
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes work-in { from { opacity: 0; } to { opacity: 1; } }
                .work-in { animation: work-in 0.35s ease-out both; }
                @media (prefers-reduced-motion: reduce) { .work-in { animation: none; } }
              `,
            }}
          />
          <p className="text-base leading-7 text-gray-600 dark:text-white/70">{p.description}</p>
          {tools.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {tools.map((t) => (
                <li key={t} className="rounded-md border border-black/15 px-2.5 py-1 text-sm leading-5 dark:border-white/20">
                  {t}
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/project/${p.slug}`}
            className="group mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white motion-reduce:transition-none"
          >
            View full project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}