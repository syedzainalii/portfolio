"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { workData } from "@/assets/assets";

export default function ProjectDetail({ project }) {
  const otherProjects = workData.filter((item) => item.slug !== project.slug).slice(0, 3);

  return (
    <article className="site-container min-h-[100svh] pt-24 pb-16 lg:min-h-screen">
      <Link
        href="/project"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-gray-600 hover:text-amber-600 dark:text-white/65 dark:hover:text-amber-400 lg:min-h-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Project archive
      </Link>

      <header className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
            Project / {project.slug}
          </p>
          <h1 className="mt-4 break-words font-Ovo text-3xl sm:text-5xl lg:text-6xl">{project.title}</h1>
          <p className="mt-4 max-w-xl text-lg leading-7 text-gray-600 dark:text-white/65">
            {project.description}
          </p>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden border border-black/10 bg-slate-900 dark:border-white/15">
          <Image
            src={project.bgImage}
            alt={project.title}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
          <span className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 font-mono text-xs text-white">
            {project.slug}
          </span>
        </div>
      </header>

      <section className="mt-10 grid gap-8 border-y border-black/10 py-8 dark:border-white/15 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gray-500">
            Tools used
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tools?.map((tool) => (
              <li
                key={tool}
                className="border border-black/15 px-3 py-1.5 text-sm dark:border-white/20"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-amber-600 dark:hover:text-amber-400 lg:min-h-0"
        >
          Discuss a project <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between border-b border-black/10 pb-4 dark:border-white/15">
          <h2 className="font-Ovo text-2xl sm:text-3xl">More projects</h2>
          <Link href="/project" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 lg:min-h-0">
            View archive
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {otherProjects.map((otherProject) => (
            <Link
              href={`/project/${otherProject.slug}`}
              key={otherProject.slug}
              className="group border border-black/10 p-4 transition-colors hover:border-amber-500 dark:border-white/15 dark:hover:border-amber-400"
            >
              <p className="font-mono text-xs text-gray-500">{otherProject.slug}</p>
              <h3 className="mt-2 font-Ovo text-lg">{otherProject.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-white/65">
                {otherProject.description}
              </p>
              <ArrowUpRight className="mt-4 h-4 w-4 text-amber-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 dark:text-amber-400" />
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
