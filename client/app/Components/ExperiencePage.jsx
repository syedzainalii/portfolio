import { experienceData } from "@/assets/assets";

export default function ExperiencePage() {
  return (
    <article className="site-container pt-24 pb-16">
      <header className="mb-12 border-b border-black/10 pb-8 dark:border-white/15">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
          Experience / Timeline
        </p>
        <h1 className="break-words font-Ovo text-3xl sm:text-6xl">Work Experience</h1>
      </header>

      <ol className="space-y-10">
        {experienceData.map((experience, index) => (
          <li
            key={experience.id}
            className="grid gap-6 border-l border-amber-500 pl-6 sm:grid-cols-[12rem_1fr] sm:gap-10 sm:pl-10"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                {experience.period}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-white/60">
                {experience.location}
              </p>
            </div>

            <section className="relative border border-black/10 p-6 dark:border-white/15 sm:p-8">
              <span className="absolute -left-[2.05rem] top-1 h-3 w-3 rounded-full border-2 border-amber-500 bg-white dark:bg-darkTheme sm:-left-[2.8rem]" />
              <p className="font-mono text-xs text-amber-600 dark:text-amber-400">
                ROLE {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 font-Ovo text-2xl sm:text-3xl">{experience.role}</h2>
              <p className="mt-1 font-medium">{experience.company}</p>
              <p className="mt-5 leading-7 text-gray-600 dark:text-white/65">
                {experience.description}
              </p>
              {experience.report && (
                <a
                  href={experience.report}
                  download
                  className="mt-4 inline-flex text-sm font-medium underline underline-offset-4"
                >
                  Download full report
                </a>
              )}

              <div
                className={`mt-8 grid gap-8 ${
                  experience.technologies.length > 0 ? "md:grid-cols-2" : ""
                }`}
              >
                <div>
                  <h3 className="font-semibold">Achievements</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-600 dark:text-white/65">
                    {experience.achievements.map((achievement) => (
                      <li key={achievement}>— {achievement}</li>
                    ))}
                  </ul>
                </div>
                {experience.technologies.length > 0 && (
                  <div>
                    <h3 className="font-semibold">Technologies &amp; Skills</h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {experience.technologies.map((technology) => (
                        <li
                          key={technology}
                          className="border border-black/10 px-3 py-1.5 text-xs dark:border-white/15"
                        >
                          {technology}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          </li>
        ))}
      </ol>
    </article>
  );
}
