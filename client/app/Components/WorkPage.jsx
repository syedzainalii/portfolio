"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { workData } from "@/assets/assets";

const pad = (n) => String(n).padStart(2, "0");

function Sheet({ project, number, total, featured }) {
  const tools = project.tools ?? [];

  return (
    <li
      className={`projects-fade ${
        featured ? "md:col-span-2" : "md:even:translate-y-10"
      }`}
    >
      <Link
        href={`/project/${project.slug}`}
        aria-label={`Open project: ${project.title}`}
        className="group block overflow-hidden rounded-3xl border border-black/15 bg-white shadow-sm outline-none transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-white/20 dark:bg-darkHover motion-reduce:transition-none"
      >
        {/* Drawing area */}
        <div
          className={`relative overflow-hidden bg-slate-900 ${
            featured ? "aspect-[4/3] sm:aspect-[16/8]" : "aspect-[4/3]"
          }`}
        >
          <Image
            src={project.bgImage}
            alt=""
            fill
            sizes={featured ? "(min-width: 1024px) 80vw, 100vw" : "(min-width: 768px) 45vw, 100vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
          />

          {/* Faint drafting grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
          />

          {/* Registration marks (appear on hover) */}
          {[
            "left-4 top-4 border-l-2 border-t-2",
            "right-4 top-4 border-r-2 border-t-2",
            "bottom-4 left-4 border-b-2 border-l-2",
            "bottom-4 right-4 border-b-2 border-r-2",
          ].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`absolute h-6 w-6 border-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${pos}`}
            />
          ))}

          {/* Open button */}
          <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-black shadow-lg transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>

        {/* Title block */}
        <div className="grid grid-cols-2 border-t-2 border-black/80 dark:border-white/70 sm:grid-cols-[auto_1fr_auto]">
          <div className="border-b border-r border-black/15 px-4 py-3 dark:border-white/20 sm:border-b-0 sm:px-5">
            <p className="font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
              Sheet
            </p>
            <p className="font-mono text-sm font-semibold leading-6 tabular-nums">
              {pad(number)}/{pad(total)}
            </p>
          </div>

          <div className="border-b border-black/15 px-4 py-3 dark:border-white/20 sm:border-b-0 sm:border-r sm:px-5">
            <p className="font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
              Tools
            </p>
            <p className="break-words text-sm font-semibold leading-6">
              {tools.length ? tools.join(" · ") : "—"}
            </p>
          </div>

          <div className="col-span-2 border-t border-black/15 px-4 py-4 dark:border-white/20 sm:col-span-1 sm:border-t-0 sm:px-5 sm:py-3">
            <p className="font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
              Type
            </p>
            <p className="break-words text-sm font-semibold leading-6">{project.description}</p>
          </div>
        </div>

        {/* Project name */}
        <div className="flex items-end justify-between gap-4 border-t border-black/15 px-4 py-5 dark:border-white/20 sm:px-6 sm:py-6">
          <h2
            className={`min-w-0 break-words font-Ovo leading-tight ${
              featured ? "text-3xl sm:text-5xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {project.title}
          </h2>
          <span className="hidden shrink-0 items-center gap-1.5 text-sm font-medium sm:inline-flex">
            <span className="relative">
              Open sheet
              <span className="absolute -bottom-1 left-0 h-px w-full bg-current opacity-30 transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function ProjectsExplorer() {
  const [tool, setTool] = useState("all");

  // Every tool used in your projects, most used first
  const tools = useMemo(() => {
    const count = new Map();
    workData.forEach((p) =>
      (p.tools ?? []).forEach((t) => count.set(t, (count.get(t) ?? 0) + 1))
    );
    return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, []);

  const visible = workData.filter((p) => tool === "all" || (p.tools ?? []).includes(tool));

  const chip = (active) =>
    `min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium leading-5 transition-all duration-300 active:scale-95 lg:min-h-0 lg:py-1.5 ${
      active
        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
        : "border-black/15 text-gray-700 hover:border-amber-400 dark:border-white/20 dark:text-white/80"
    }`;

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes projects-fade { from { opacity: 0; margin-top: 14px; } to { opacity: 1; margin-top: 0; } }
            .projects-fade { animation: projects-fade 0.45s ease-out both; }
            @media (prefers-reduced-motion: reduce) { .projects-fade { animation: none; } }
          `,
        }}
      />

      {/* Filter row */}
      {tools.length > 0 && (
        <div className="mb-8 border-y border-black/10 py-4 dark:border-white/15">
          <p className="mb-2 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
            Filter by tool · showing {pad(visible.length)} of {pad(workData.length)}
          </p>
          <div
            role="group"
            aria-label="Filter projects by tool"
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              type="button"
              aria-pressed={tool === "all"}
              onClick={() => setTool("all")}
              className={chip(tool === "all")}
            >
              All projects
            </button>
            {tools.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tool === t}
                onClick={() => setTool(t)}
                className={chip(tool === t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* The sheets (a key on the list restarts the fade when the filter changes) */}
      <ul key={tool} className="grid grid-cols-1 gap-6 pb-12 md:grid-cols-2 md:gap-x-8 md:gap-y-8">
        {visible.map((project, i) => (
          <Sheet
            key={project.slug}
            project={project}
            number={workData.indexOf(project) + 1}
            total={workData.length}
            featured={i === 0}
          />
        ))}
      </ul>
    </div>
  );
}