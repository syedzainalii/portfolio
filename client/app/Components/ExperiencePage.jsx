import { experienceData } from "@/assets/assets";
import ExperienceExplorer from "./ExperienceExplorer";

export const metadata = {
  title: "Experience",
  description:
    "Work experience and internships of Syed Zain Ali in manufacturing, planning and development.",
};

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function monthsIn(text) {
  const t = String(text ?? "");
  const year = t.match(/(\d{4})/);
  const idx = (t.match(/[A-Za-z]{3,}/g) ?? [])
    .map((n) => MONTHS.indexOf(n.slice(0, 3).toLowerCase()))
    .filter((i) => i >= 0);
  if (!year || !idx.length) return 0;
  const end = idx[1] ?? idx[0];
  return (end < idx[0] ? end + 12 : end) - idx[0] + 1;
}

export default function ExperiencePage() {
  const roles = experienceData.length;
  const months = experienceData.reduce((n, r) => n + monthsIn(r.period), 0);

  return (
    <article className="site-container pb-20 pt-24 sm:pt-28">
      <header className="mb-10 sm:mb-12">
        <h1 className="break-words font-Ovo text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
          Work experience
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-white/65 sm:text-lg sm:leading-8">
          {roles} {roles === 1 ? "role" : "roles"} and {months} {months === 1 ? "month" : "months"} in
          manufacturing, planning and development. Pick a station on the line to see what I worked on.
        </p>
      </header>

      <ExperienceExplorer />
    </article>
  );
}