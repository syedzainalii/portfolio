import {
  Box,
  ClipboardList,
  Code,
  Cpu,
  Wrench,
} from "lucide-react";
import { skillCategories } from "@/assets/assets";

const skillIcons = {
  box: Box,
  "clipboard-list": ClipboardList,
  code: Code,
  cpu: Cpu,
  wrench: Wrench,
};

function getSkillLevel(level) {
  if (level >= 85) return "Expert";
  if (level >= 70) return "Advanced";
  if (level >= 55) return "Proficient";
  if (level >= 35) return "Intermediate";
  return "Basic";
}

export default function SkillsPage() {
  return (
    <article className="site-container pt-24 pb-16">
      <header className="mb-12 grid gap-6 border-b border-black/10 pb-8 dark:border-white/15 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
            Skills / Technical Index
          </p>
          <h1 className="font-Ovo text-4xl sm:text-6xl">My Technical Skills</h1>
        </div>
        <p className="max-w-sm text-sm leading-6 text-gray-600 dark:text-white/65">
          Explore my skill set across engineering, simulation, software, and project work.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {skillCategories.map((category, index) => {
          const Icon = skillIcons[category.icon];

          return (
            <section
              key={category.title}
              className="border border-black/10 p-6 dark:border-white/15 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-5 dark:border-white/15">
                <div className="flex items-center gap-4">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-xl"
                    style={{ backgroundColor: `${category.accent}24`, color: category.accent }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-Ovo text-xl sm:text-2xl">{category.title}</h2>
                    <p className="mt-1 font-mono text-xs text-gray-500">
                      SHEET {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-sm text-gray-500">
                  {String(category.skills.length).padStart(2, "0")}
                </span>
              </div>

              <ul className="mt-2 divide-y divide-black/10 dark:divide-white/10">
                {category.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-gray-600 dark:border-white/15 dark:text-white/65">
                      {getSkillLevel(skill.level)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </article>
  );
}
