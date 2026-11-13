"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { experienceData } from "@/assets/assets";
import SectionPageLink from "./SectionPageLink";

// One achievement: bright near the middle of the screen, dim elsewhere
function Statement({ text, reduce }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 15%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.35, 1, 1, 0.35]);

  return (
    <motion.li
      ref={ref}
      style={{ opacity: reduce ? 1 : opacity }}
      className="font-Ovo text-xl leading-9 sm:text-2xl sm:leading-10"
    >
      {text}
    </motion.li>
  );
}

function Role({ exp, reduce }) {
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 65%", "end 55%"],
  });

  const achievements = exp.achievements ?? [];
  const technologies = exp.technologies ?? [];
  // Add `report: "/your-file.pdf"` to an entry in assets.js to give it its own document
  const report = exp.report ?? "/report.pdf";

  return (
    <article className="grid gap-10 py-14 first:pt-0 last:pb-0 lg:grid-cols-12 lg:gap-16">
      {/* Left: stays in view while the statements scroll */}
      <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
        <span aria-hidden className="text-4xl">
          {exp.logo}
        </span>
        <h3 className="mt-4 font-Ovo text-4xl leading-tight sm:text-5xl">{exp.role}</h3>
        <p className="mt-2 text-lg text-gray-600 dark:text-white/70">{exp.company}</p>

        <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-500 dark:text-white/55">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {exp.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {exp.period}
          </span>
        </p>

        <p className="mt-6 leading-7 text-gray-600 dark:text-white/70">{exp.description}</p>

        {technologies.length > 0 && (
          <p className="mt-6 text-sm leading-7 text-gray-500 dark:text-white/55">
            <span className="font-medium text-gray-800 dark:text-white/85">Worked with </span>
            {technologies.join("  ·  ")}
          </p>
        )}

        <a
          href={report}
          download
          className="group mt-8 inline-flex items-center gap-2 text-sm font-medium"
        >
          <span className="relative">
            Download full report
            <span className="absolute -bottom-1 left-0 h-px w-full bg-current opacity-30 transition-opacity duration-300 group-hover:opacity-100" />
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      {/* Right: the story */}
      <div className="relative lg:col-span-7">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-px bg-black/10 dark:bg-white/15"
        >
          <motion.span
            style={{ scaleY: reduce ? 1 : scrollYProgress }}
            className="block h-full w-full origin-top bg-amber-400"
          />
        </span>

        <ol ref={listRef} className="space-y-14 py-2 pl-8 sm:pl-12">
          {achievements.map((item) => (
            <Statement key={item} text={item} reduce={reduce} />
          ))}
        </ol>
      </div>
    </article>
  );
}

export default function Experience({ preview = false }) {
  const reduce = useReducedMotion();

  return (
    <section id="experience" className="w-full px-6 py-20 sm:px-10 lg:px-[12%]">
      <h4 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
        My Journey
      </h4>
      <h2 className="text-center font-Ovo text-4xl sm:text-5xl">Work Experience</h2>
      <p className="mx-auto mb-16 mt-5 max-w-2xl text-center font-Ovo text-gray-600 dark:text-white/70">
        A showcase of my professional growth and the amazing teams I&apos;ve collaborated with
      </p>

      <div className="mx-auto max-w-6xl divide-y divide-black/10 dark:divide-white/15">
        {experienceData.map((exp) => (
          <Role key={exp.id} exp={exp} reduce={reduce} />
        ))}
      </div>

      {preview && <SectionPageLink href="/experience" label="View all" />}
    </section>
  );
}