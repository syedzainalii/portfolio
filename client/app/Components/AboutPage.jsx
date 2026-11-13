import Image from "next/image";
import {
  aboutParagraphs,
  assets,
  infoList,
  toolsData,
} from "@/assets/assets";

export default function AboutPage() {
  return (
    <article className="px-6 py-16 sm:px-10 lg:px-[12%]">
      <header className="mb-12 border-b border-black/10 pb-8 dark:border-white/15">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
          About / Syed Zain Ali
        </p>
        <h1 className="mt-4 font-Ovo text-4xl sm:text-6xl">About Me</h1>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)] lg:gap-16">
        <div className="space-y-6 font-Ovo text-base leading-8 text-gray-700 dark:text-white/75 sm:text-lg">
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -left-3 -top-3 h-full w-full border border-amber-500/60" />
          <Image
            src={assets.user_image}
            alt="Syed Zain Ali"
            className="relative w-full object-cover"
            priority
          />
          <p className="relative bg-slate-950 px-4 py-3 font-mono text-xs uppercase tracking-widest text-white">
            Mechanical Engineering / NED UET
          </p>
        </div>
      </div>

      <section className="mt-16 border-t border-black/10 pt-10 dark:border-white/15">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-Ovo text-2xl sm:text-3xl">Profile</h2>
          <span className="font-mono text-xs text-gray-500">01—04</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {infoList.map(({ icon, iconDark, title, description }) => (
            <article
              key={title}
              className="border border-black/10 p-5 dark:border-white/15"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/15">
                <Image src={icon} alt="" className="h-6 w-6 dark:hidden" />
                <Image src={iconDark} alt="" className="hidden h-6 w-6 dark:block" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-white/65">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-black/10 pt-10 dark:border-white/15">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-Ovo text-2xl sm:text-3xl">Tools I use</h2>
          <span className="font-mono text-xs text-gray-500">
            {String(toolsData.length).padStart(2, "0")} TOOLS
          </span>
        </div>
        <ul className="flex flex-wrap gap-3">
          {toolsData.map((tool, index) => (
            <li
              key={index}
              className="grid h-16 w-16 place-items-center border border-black/10 p-3 dark:border-white/15"
            >
              <Image src={tool} alt="Tool" className="max-h-full w-full object-contain" />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
