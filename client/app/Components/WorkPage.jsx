import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { workData } from "@/assets/assets";

export default function WorkPage() {
  return (
    <article className="px-6 py-16 sm:px-10 lg:px-[5%]">
      <header className="mb-12 flex flex-col gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between dark:border-white/15">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
            Portfolio / Selected Projects
          </p>
          <h1 className="mt-4 font-Ovo text-4xl sm:text-6xl">Projects</h1>
        </div>
        <p className="max-w-sm text-sm leading-6 text-gray-600 dark:text-white/65">
          A collection of CAD, simulation, web, data visualization, and video projects.
        </p>
      </header>

      <div className="space-y-5">
        {workData.map((project, index) => (
          <Link
            href={`/project/${project.slug}`}
            key={project.slug}
            className="group grid overflow-hidden border border-black/10 transition-colors hover:border-amber-500 dark:border-white/15 dark:hover:border-amber-400 sm:grid-cols-[minmax(12rem,0.8fr)_1.2fr]"
          >
            <div className="relative min-h-56 bg-slate-900">
              <Image
                src={project.bgImage}
                alt={project.title}
                fill
                sizes="(min-width: 640px) 40vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-amber-600 dark:text-amber-400">
                  PROJECT {String(index + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <h2 className="mt-4 font-Ovo text-2xl sm:text-3xl">{project.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-white/65">
                {project.description}
              </p>
              {project.tools?.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <li
                      key={tool}
                      className="border border-black/10 px-2.5 py-1 font-mono text-[11px] dark:border-white/15"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
