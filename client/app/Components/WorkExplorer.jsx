"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MoveHorizontal } from "lucide-react";
import { workData } from "@/assets/assets";

/*
  "Section view": each project image is split by a draggable cutting plane.
  Left of the line is the finished render, right of it is the same image
  turned into a blueprint, like a cutaway in an engineering drawing.
*/

const BLUEPRINT_FILTER = "grayscale(1) invert(1) contrast(1.6) brightness(1.05)";

function SectionStage({ project }) {
  const stageRef = useRef(null);
  const [pos, setPos] = useState(100);
  const [dragging, setDragging] = useState(false);

  // Sweep the cutting plane in whenever the project changes
  useEffect(() => {
    setPos(100);
    const id = setTimeout(() => setPos(50), 60);
    return () => clearTimeout(id);
  }, [project.slug]);

  const moveTo = useCallback((clientX) => {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return;
    setPos(Math.min(100, Math.max(0, ((clientX - box.left) / box.width) * 100)));
  }, []);

  const onKey = (e) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
    if (e.key === "Home") setPos(0);
    if (e.key === "End") setPos(100);
  };

  const ease = dragging ? "" : "transition-all duration-[900ms] ease-out motion-reduce:transition-none";

  return (
    <div
      ref={stageRef}
      onPointerDown={(e) => {
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => dragging && moveTo(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      className="relative aspect-[4/3] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-2xl border border-black/15 bg-slate-900 sm:aspect-[16/10] dark:border-white/20"
    >
      {/* Finished render (full width underneath) */}
      <Image
        src={project.bgImage}
        alt={`${project.title}, finished view`}
        fill
        priority
        sizes="(min-width: 1024px) 60vw, 100vw"
        draggable={false}
        className="pointer-events-none object-cover"
      />

      {/* Blueprint layer (clipped to the right of the cutting plane) */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-[#0d3b73] ${ease}`}
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
      >
        <Image
          src={project.bgImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          draggable={false}
          className="object-cover"
          style={{ filter: BLUEPRINT_FILTER, mixBlendMode: "screen" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* View labels */}
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium leading-4 text-white backdrop-blur">
        Finished render
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium leading-4 text-[#0d3b73]">
        Blueprint view
      </span>

      {/* Cutting plane: dash-dot centre line, section markers and handle */}
      <div
        className={`absolute inset-y-0 w-0 ${ease}`}
        style={{ left: `${pos}%` }}
      >
        <span
          aria-hidden
          className="absolute inset-y-0 -translate-x-1/2 border-l-2 border-dashed border-amber-400"
        />
        <span aria-hidden className="absolute left-0 top-3 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full bg-amber-400 text-xs font-bold leading-none text-black">
          A
        </span>
        <button
          type="button"
          role="slider"
          aria-label="Section cut position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={onKey}
          className="absolute left-0 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-amber-400 bg-black/70 text-amber-400 shadow-xl outline-none backdrop-blur focus-visible:ring-2 focus-visible:ring-white"
        >
          <MoveHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default function ProjectsExplorer() {
  const [tool, setTool] = useState("all");
  const [activeSlug, setActiveSlug] = useState(workData[0]?.slug);

  const tools = useMemo(() => {
    const count = new Map();
    workData.forEach((p) => (p.tools ?? []).forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
    return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, []);

  const visible = workData.filter((p) => tool === "all" || (p.tools ?? []).includes(tool));
  const active = visible.find((p) => p.slug === activeSlug) ?? visible[0];

  const chip = (on) =>
    `min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium leading-5 transition-colors duration-200 lg:min-h-0 lg:py-1.5 ${
      on
        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
        : "border-black/15 text-gray-700 hover:border-amber-400 dark:border-white/20 dark:text-white/80"
    }`;

  return (
    <div>
      {/* Tool filter */}
      {tools.length > 0 && (
        <div
          role="group"
          aria-label="Filter projects by tool"
          className="-mx-1 mb-8 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button type="button" aria-pressed={tool === "all"} onClick={() => setTool("all")} className={chip(tool === "all")}>
            All projects
          </button>
          {tools.map((t) => (
            <button key={t} type="button" aria-pressed={tool === t} onClick={() => setTool(t)} className={chip(tool === t)}>
              {t}
            </button>
          ))}
        </div>
      )}

      {!active ? (
        <p className="py-12 text-center text-gray-500 dark:text-white/60">
          No projects use this tool yet. Pick another one above.
        </p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-12">
          {/* Project index: a drawing list on desktop, swipeable row on mobile */}
          <ul
            aria-label="Projects"
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {visible.map((p) => {
              const on = p.slug === active.slug;
              return (
                <li key={p.slug} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActiveSlug(p.slug)}
                    className={`block w-52 rounded-xl border-l-4 px-4 py-3 text-left transition-colors duration-200 lg:w-full lg:rounded-none lg:border-b lg:border-b-black/10 lg:py-4 dark:lg:border-b-white/15 ${
                      on
                        ? "border-l-amber-400 bg-amber-400/10"
                        : "border-l-transparent hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="block break-words font-Ovo text-lg leading-6">{p.title}</span>
                    <span className="mt-0.5 block text-sm leading-5 text-gray-500 dark:text-white/55">
                      {(p.tools ?? []).slice(0, 3).join(", ") || p.description}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Stage */}
          <div className="min-w-0">
            <SectionStage key={active.slug} project={active} />
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-white/55">
              Drag the amber line, or use the arrow keys, to cut through the design.
            </p>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div className="min-w-0 max-w-xl">
                <h2 className="break-words font-Ovo text-3xl leading-tight sm:text-4xl">{active.title}</h2>
                <p className="mt-2 text-base leading-7 text-gray-700 dark:text-white/75">{active.description}</p>
                {(active.tools ?? []).length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {active.tools.map((t) => (
                      <li
                        key={t}
                        className="rounded-md border border-black/15 px-2.5 py-1 text-sm leading-5 dark:border-white/20"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Link
                href={`/project/${active.slug}`}
                className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black outline-none transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white motion-reduce:transition-none"
              >
                View full project
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}