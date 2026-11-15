"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  ChevronRight,
  FolderOpen,
  Wrench,
} from "lucide-react";
import { workData } from "@/assets/assets";

const pad = (n) => String(n).padStart(2, "0");

export default function WorkPage() {
  const total = workData.length;
  const [active, setActive] = useState(0);
  const [inspect, setInspect] = useState(false);

  const vLine = useRef(null);
  const hLine = useRef(null);
  const ring = useRef(null);
  const readout = useRef(null);

  const go = (dir) => setActive((a) => (a + dir + total) % total);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(-1);
    }
  };

  // Crosshair + coordinates (updated through refs, so no re-render per mouse move)
  const trackPointer = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (vLine.current) vLine.current.style.transform = `translateX(${x}px)`;
    if (hLine.current) hLine.current.style.transform = `translateY(${y}px)`;
    if (ring.current) ring.current.style.transform = `translate(${x}px, ${y}px)`;
    if (readout.current) {
      const px = ((x / r.width) * 200).toFixed(1).padStart(5, "0");
      const py = ((y / r.height) * 150).toFixed(1).padStart(5, "0");
      readout.current.textContent = `X ${px}  Y ${py}`;
    }
  };

  const p = workData[active];
  if (!p) return null;

  const href = `/project/${p.slug}`;
  const tools = p.tools ?? [];
  // Optional: add `summary: "..."` to a project in assets.js for a longer description here
  const body = p.summary ?? p.description;

  return (
    <article className="site-container pb-10 pt-28 sm:pt-32">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes proj-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
            .proj-in { animation: proj-in 0.35s ease-out both; }
            @media (prefers-reduced-motion: reduce) { .proj-in { animation: none; } }
          `,
        }}
      />

      {/* ===== Page header ===== */}
      <header className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 sm:mb-8">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
            Portfolio / Design tree
          </p>
          <h1 className="break-words font-Ovo text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            Selected Projects
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-6 text-gray-600 dark:text-white/65">
          Pick a part in the tree and it loads into the viewport. Click the viewport to open the
          project.
        </p>
      </header>

      {/* ===== The window ===== */}
      <section
        aria-label="Projects"
        onKeyDown={onKeyDown}
        className="overflow-hidden rounded-3xl border border-black/15 bg-white shadow-2xl dark:border-white/15 dark:bg-darkHover lg:flex lg:h-[max(32rem,calc(100svh-19rem))] lg:flex-col"
      >
        {/* Title bar */}
        <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-black/[0.03] px-4 py-2.5 dark:border-white/15 dark:bg-white/5">
          <div className="flex min-w-0 items-center gap-3">
            <span aria-hidden className="flex shrink-0 gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/20 dark:bg-white/25" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/20 dark:bg-white/25" />
            </span>
            <p className="truncate font-mono text-[11px] uppercase leading-5 tracking-[0.18em] text-gray-600 dark:text-white/60">
              portfolio.assembly · {pad(total)} parts
            </p>
          </div>
          <p className="shrink-0 font-mono text-[11px] uppercase leading-5 tracking-[0.18em] text-amber-600 dark:text-amber-400">
            PRJ {pad(active + 1)}/{pad(total)}
          </p>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[17.5rem_1fr]">
          {/* ===== Feature tree ===== */}
          <nav
            aria-label="Project tree"
            className="order-2 min-w-0 border-t border-black/10 dark:border-white/15 lg:order-1 lg:overflow-y-auto lg:border-r lg:border-t-0"
          >
            <div className="p-4 sm:p-5">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
                <FolderOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Feature tree · {pad(total)}
              </p>

              <ul className="ml-2 mt-3 border-l border-black/15 dark:border-white/20">
                {workData.map((w, i) => {
                  const on = i === active;
                  const wTools = w.tools ?? [];
                  return (
                    <li key={w.slug} className="relative">
                      {/* Branch line */}
                      <span
                        aria-hidden
                        className="absolute left-0 top-[1.375rem] h-px w-3 bg-black/15 dark:bg-white/20"
                      />

                      <div className="pl-3">
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() => setActive(i)}
                          className={`flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                            on
                              ? "bg-amber-400/15"
                              : "text-gray-600 hover:bg-black/5 dark:text-white/65 dark:hover:bg-white/10"
                          }`}
                        >
                          <ChevronRight
                            aria-hidden
                            className={`h-4 w-4 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                              on ? "rotate-90 text-amber-500" : "opacity-40"
                            }`}
                          />
                          <Box
                            aria-hidden
                            className={`h-4 w-4 shrink-0 ${on ? "text-amber-500" : "opacity-50"}`}
                          />
                          <span className="min-w-0 break-words font-Ovo text-base leading-5">
                            {w.title}
                          </span>
                        </button>
                      </div>

                      {/* Children: tools and the open link */}
                      <div
                        inert={!on}
                        className={`grid transition-all duration-300 motion-reduce:transition-none ${
                          on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <ul className="mb-2 ml-9 border-l border-dashed border-black/20 dark:border-white/25">
                            {wTools.map((t) => (
                              <li
                                key={t}
                                className="flex items-center gap-2 py-1 pl-3 text-sm leading-5 text-gray-600 dark:text-white/65"
                              >
                                <Wrench aria-hidden className="h-3.5 w-3.5 shrink-0 opacity-60" />
                                {t}
                              </li>
                            ))}
                            <li className="py-1 pl-3">
                              <Link
                                href={`/project/${w.slug}`}
                                className="inline-flex min-h-8 items-center gap-1 text-sm font-medium text-amber-600 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-amber-400"
                              >
                                Open project
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* ===== Stage: viewport + info ===== */}
          <div className="order-1 flex min-h-0 min-w-0 flex-col lg:order-2">
            {/* Viewport */}
            <div
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") {
                  setInspect(true);
                  trackPointer(e);
                }
              }}
              onPointerMove={trackPointer}
              onPointerLeave={() => setInspect(false)}
              className="relative aspect-[4/3] overflow-hidden bg-slate-900 sm:aspect-[16/10] lg:aspect-auto lg:min-h-0 lg:flex-1"
            >
              {/* Stacked images, crossfaded */}
              {workData.map((w, i) => (
                <Image
                  key={w.slug}
                  src={w.bgImage}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  className={`object-cover transition-all duration-700 ease-out motion-reduce:transition-none ${
                    i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
                  }`}
                />
              ))}

              {/* Click anywhere on the viewport to open the project */}
              <Link
                href={href}
                aria-label={`Open ${p.title}`}
                tabIndex={-1}
                className="absolute inset-0 z-[1] cursor-crosshair"
              />

              {/* Readability gradient + drafting grid */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Readout */}
              <div className="pointer-events-none absolute inset-x-4 top-4 z-[2] flex items-center justify-between font-mono text-[11px] leading-5 tracking-wider text-white/85">
                <span className="rounded bg-black/55 px-2 py-0.5">View · isometric</span>
                <span
                  ref={readout}
                  className="hidden rounded bg-black/55 px-2 py-0.5 tabular-nums sm:block"
                >
                  X 000.0  Y 000.0
                </span>
              </div>

              {/* Crosshair */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 z-[2] transition-opacity duration-300 ${
                  inspect ? "opacity-100" : "opacity-0"
                }`}
              >
                <span ref={vLine} className="absolute inset-y-0 left-0 w-px bg-white/40" />
                <span ref={hLine} className="absolute inset-x-0 top-0 h-px bg-white/40" />
                <span
                  ref={ring}
                  className="absolute left-0 top-0 -ml-3 -mt-3 h-6 w-6 rounded-full border border-amber-400"
                />
              </div>

              {/* Prev / next */}
              <div className="absolute bottom-4 left-4 z-[3] flex items-center gap-2 rounded-full bg-black/60 p-1.5 text-white">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous project"
                  className="grid h-11 w-11 place-items-center rounded-full outline-none transition-colors duration-200 hover:bg-amber-400 hover:text-black focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-95 lg:h-9 lg:w-9"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <span className="min-w-12 text-center font-mono text-xs tabular-nums">
                  {pad(active + 1)}/{pad(total)}
                </span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next project"
                  className="grid h-11 w-11 place-items-center rounded-full outline-none transition-colors duration-200 hover:bg-amber-400 hover:text-black focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-95 lg:h-9 lg:w-9"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Info bar */}
            <div className="border-t border-black/10 p-5 dark:border-white/15 sm:p-6 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-8">
              <div key={p.slug} aria-live="polite" className="proj-in min-w-0">
                <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
                  Part {pad(active + 1)} / {pad(total)}
                </p>
                <h2 className="mt-1 break-words font-Ovo text-3xl leading-tight sm:text-4xl">
                  {p.title}
                </h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-gray-600 dark:text-white/70">
                  {body}
                </p>
                {tools.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {tools.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-black/15 px-3 py-1 text-sm leading-5 dark:border-white/20"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Link
                href={href}
                className="group mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-amber-400 px-7 py-3 text-base font-semibold text-black outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(202,138,4,0.8)] focus-visible:ring-2 focus-visible:ring-black active:scale-95 dark:focus-visible:ring-white sm:w-auto lg:mt-0"
              >
                View full project
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Status bar (desktop) */}
        <div className="hidden items-center justify-between border-t border-black/10 bg-black/[0.03] px-4 py-2 font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:border-white/15 dark:bg-white/5 dark:text-white/45 lg:flex">
          <span>← → ↑ ↓ browse parts</span>
          <span>Click the viewport to open</span>
        </div>
      </section>
    </article>
  );
}