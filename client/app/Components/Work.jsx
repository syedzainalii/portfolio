"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { workData } from "@/assets/assets";
import SectionPageLink from "./SectionPageLink";

const AUTOPLAY_MS = 5000;

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
  const reduceMotion = useReducedMotion();
  const playing = inView && !paused && !reduceMotion && total > 1;

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

  return (
    <section
      id="work"
      ref={sectionRef}
      className="w-full py-16 sm:py-20 lg:py-24"
    >
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
        className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* ===== Viewport ===== */}
        <Link
          href={`/project/${current.slug}`}
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
          className="relative order-1 block aspect-[4/3] cursor-crosshair overflow-hidden rounded-3xl border border-black/10 bg-slate-900 shadow-2xl dark:border-white/15 lg:order-2 lg:col-span-7 lg:aspect-[5/4]"
        >
          {/* Stacked images, crossfaded */}
          {projects.map((p, i) => (
            <Image
              key={p.title}
              src={p.bgImage}
              alt=""
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className={`object-cover transition-all duration-700 ease-out motion-reduce:transition-none ${
                i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"
              }`}
            />
          ))}

          {/* Readability gradient + faint measurement grid */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20" />
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
              PRJ-{String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
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

          {/* Title block */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 rounded-2xl border border-white/15 bg-black/40 p-4 backdrop-blur-md sm:inset-x-6 sm:bottom-6"
          >
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold leading-6 text-white sm:text-xl">
                {current.title}
              </h3>
              <p className="mt-1 truncate text-xs leading-5 text-white/70">
                {current.description}
              </p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-400 text-black">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </motion.div>
        </Link>

        {/* ===== Project index ===== */}
        <ul className="order-2 lg:order-1 lg:col-span-5">
          {projects.map((project, i) => {
            const isActive = i === active;
            return (
              <li key={project.title}>
                <Link
                  href={`/project/${project.slug}`}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={(e) => {
                    // Touch: first tap selects the row, second tap opens the project
                    if (!isActive) {
                      e.preventDefault();
                      setActive(i);
                    }
                  }}
                  className="group relative block border-b border-black/10 py-5 outline-none focus-visible:bg-black/[0.03] dark:border-white/10 dark:focus-visible:bg-white/5"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span
                      className={`font-mono text-sm tabular-nums transition-colors duration-300 ${
                        isActive ? "text-amber-500" : "text-gray-400 dark:text-white/40"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <h3
                      className={`flex-1 font-Ovo text-2xl leading-tight transition-all duration-300 sm:text-3xl ${
                        isActive
                          ? "translate-x-1 opacity-100"
                          : "opacity-40 group-hover:opacity-70"
                      }`}
                    >
                      {project.title}
                    </h3>

                    <span
                      className={`grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 ${
                        isActive
                          ? "border-amber-400 bg-amber-400 text-black"
                          : "border-black/15 text-gray-500 dark:border-white/20 dark:text-white/60"
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Expanding details */}
                  <div
                    className={`grid transition-all duration-500 ease-out motion-reduce:transition-none ${
                      isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden pl-9 sm:pl-12">
                      <p className="pt-3 text-sm leading-6 text-gray-600 dark:text-white/70">
                        {project.description}
                      </p>

                      {project.tools?.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {project.tools.map((tool) => (
                            <li
                              key={tool}
                              className="rounded-full border border-black/15 px-3 py-0.5 text-xs leading-5 text-gray-700 dark:border-white/20 dark:text-white/80"
                            >
                              {tool}
                            </li>
                          ))}
                        </ul>
                      )}

                      <span className="mt-4 inline-block text-sm font-medium leading-6">
                        View project &rarr;
                      </span>
                    </div>
                  </div>

                  {/* Autoplay progress line */}
                  {isActive &&
                    (playing ? (
                      <motion.span
                        aria-hidden
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                        className="absolute -bottom-px left-0 h-[2px] bg-amber-400"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="absolute -bottom-px left-0 h-[2px] w-full bg-amber-400"
                      />
                    ))}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {preview && <SectionPageLink href="/project" label="Show more" />}
      </div>
    </section>
  );
};

export default Work;