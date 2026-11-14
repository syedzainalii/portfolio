"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { workData } from "@/assets/assets";

const AUTOPLAY_MS = 5000;
const pad = (n) => String(n).padStart(2, "0");

const Work = ({ preview = false }) => {
  const projects = preview ? workData.slice(0, 4) : workData;
  const total = projects.length;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inspect, setInspect] = useState(false);

  const sectionRef = useRef(null);
  const vLine = useRef(null);
  const hLine = useRef(null);
  const ring = useRef(null);
  const readout = useRef(null);

  const inView = useInView(sectionRef, { margin: "-20% 0px -20% 0px" });
  const reduce = useReducedMotion();
  const playing = inView && !paused && !reduce && total > 1;

  // Autoplay
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % total), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, playing, total]);

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

  const current = projects[active];
  const href = `/project/${current.slug}`;
  // Optional: add `summary: "..."` to a project in assets.js for a longer line of text here
  const body = current.summary ?? current.description;

  return (
    <section id="work" ref={sectionRef} className="w-full py-14 sm:py-20 lg:py-24">
      <div className="site-container">
        {/* Heading */}
        <h4 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
          My Projects
        </h4>
        <h2 className="text-center font-Ovo text-4xl sm:text-5xl">My latest projects</h2>
        <p className="mx-auto mb-12 mt-5 max-w-2xl text-center font-Ovo text-gray-600 dark:text-white/70">
          Here are a few projects I&apos;ve worked on recently. Want to see more?
        </p>

        <div
          className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* ===== Viewport (smaller, portrait on desktop) ===== */}
          <Link
            href={href}
            aria-label={`Open ${current.title}`}
            tabIndex={-1}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") {
                setInspect(true);
                trackPointer(e);
              }
            }}
            onPointerMove={trackPointer}
            onPointerLeave={() => setInspect(false)}
            className="relative order-1 block aspect-[4/3] cursor-crosshair overflow-hidden rounded-3xl border border-black/10 bg-slate-900 shadow-2xl dark:border-white/15 sm:aspect-[16/10] lg:order-2 lg:col-span-5 lg:aspect-[4/5]"
          >
            {/* Stacked images, crossfaded */}
            {projects.map((p, i) => (
              <Image
                key={p.title}
                src={p.bgImage}
                alt=""
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className={`object-cover transition-all duration-700 ease-out motion-reduce:transition-none ${
                  i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"
                }`}
              />
            ))}

            {/* Readability gradient + faint measurement grid */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />
            <div
              aria-hidden
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Corner brackets */}
            <span aria-hidden className="absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-amber-400" />
            <span aria-hidden className="absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-amber-400" />
            <span aria-hidden className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-amber-400" />
            <span aria-hidden className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-amber-400" />

            {/* Top status row */}
            <div className="absolute inset-x-10 top-5 flex items-center justify-between font-mono text-[11px] leading-5 tracking-wider text-white/80">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400 motion-reduce:animate-none" />
                PRJ-{pad(active + 1)} / {pad(total)}
              </span>
              <span ref={readout} className="hidden tabular-nums sm:block">
                X 000.0  Y 000.0
              </span>
            </div>

            {/* Crosshair */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
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

            {/* Open button (the title lives on the left now) */}
            <span className="absolute bottom-6 right-6 grid h-12 w-12 place-items-center rounded-full bg-amber-400 text-black shadow-lg transition-transform duration-300 hover:rotate-12">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>

          {/* ===== Left: featured project + index ===== */}
          <div className="order-2 min-w-0 lg:order-1 lg:col-span-7">
            {/* Featured */}
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="lg:min-h-[21rem]"
              aria-live="polite"
            >
              <p className="flex items-center gap-3 font-mono text-xs uppercase leading-5 tracking-[0.25em] text-amber-600 dark:text-amber-400">
                <span aria-hidden className="h-px w-8 bg-amber-400" />
                Project {pad(active + 1)}
              </p>

              <h3 className="mt-4 break-words font-Ovo text-4xl leading-[1.05] sm:text-5xl lg:text-6xl xl:text-7xl">
                {current.title}
              </h3>

              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600 dark:text-white/70 lg:text-xl lg:leading-9">
                {body}
              </p>

              {current.tools?.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2.5">
                  {current.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full border border-black/15 bg-white/60 px-4 py-1.5 text-sm font-medium leading-6 text-gray-800 dark:border-white/20 dark:bg-white/5 dark:text-white/85"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={href}
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-amber-400 px-7 py-3.5 text-base font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(202,138,4,0.7)]"
              >
                View project
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Index */}
            <div className="mt-10 lg:mt-12">
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.25em] text-gray-500 dark:text-white/45">
                  Project index
                </p>

                {preview && (
                  <Link
                    href="/project"
                    className="group inline-flex items-center gap-2 rounded-full border border-black/15 py-1.5 pl-4 pr-1.5 text-sm font-medium leading-6 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10 dark:border-white/20"
                  >
                    All projects
                    <span className="grid h-7 min-w-7 place-items-center rounded-full bg-black px-2 font-mono text-[11px] text-white transition-colors duration-300 group-hover:bg-amber-400 group-hover:text-black dark:bg-white dark:text-black">
                      {pad(workData.length)}
                    </span>
                    <ArrowUpRight className="-ml-1 mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>

              <ul>
                {projects.map((project, i) => {
                  const isActive = i === active;
                  return (
                    <li key={project.title}>
                      <button
                        type="button"
                        onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={() => setActive(i)}
                        aria-current={isActive}
                        className="group relative flex min-h-12 w-full items-center gap-4 border-t border-black/10 py-3 text-left outline-none focus-visible:bg-black/[0.03] dark:border-white/10 dark:focus-visible:bg-white/5 sm:gap-6"
                      >
                        <span
                          className={`font-mono text-sm tabular-nums transition-colors duration-300 ${
                            isActive ? "text-amber-500" : "text-gray-400 dark:text-white/40"
                          }`}
                        >
                          {pad(i + 1)}
                        </span>

                        <span
                          className={`min-w-0 flex-1 break-words font-Ovo text-lg leading-tight transition-all duration-300 sm:text-xl ${
                            isActive
                              ? "translate-x-1 opacity-100"
                              : "opacity-45 group-hover:opacity-80"
                          }`}
                        >
                          {project.title}
                        </span>

                        <span
                          className={`hidden truncate text-xs leading-5 transition-opacity duration-300 sm:block ${
                            isActive ? "opacity-70" : "opacity-0"
                          }`}
                        >
                          {project.description}
                        </span>

                        {/* Autoplay progress line */}
                        {isActive &&
                          (playing ? (
                            <motion.span
                              key={`progress-${active}`}
                              aria-hidden
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                              className="absolute -top-px left-0 h-[2px] bg-amber-400"
                            />
                          ) : (
                            <span
                              aria-hidden
                              className="absolute -top-px left-0 h-[2px] w-full bg-amber-400"
                            />
                          ))}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-black/10 dark:border-white/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;