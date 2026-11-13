import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { serviceData, serviceIntro } from "@/assets/assets";

export default function ServicesPage() {
  return (
    <article className="px-6 py-16 sm:px-10 lg:px-[12%]">
      <header className="mb-12 border-b border-black/10 pb-8 dark:border-white/15">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
          Services / Available Work
        </p>
        <h1 className="mt-4 font-Ovo text-4xl sm:text-6xl">What I offer</h1>
        <p className="mt-4 max-w-2xl leading-7 text-gray-600 dark:text-white/65">
          {serviceIntro}
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {serviceData.map((service, index) => (
          <Link
            href={`/services/${service.link}`}
            key={service.link}
            className="group flex min-h-80 flex-col border border-black/10 transition-colors hover:border-amber-500 dark:border-white/15 dark:hover:border-amber-400"
          >
            <div className="relative h-40 overflow-hidden bg-slate-900">
              {service.image ? (
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="grid h-full place-items-center bg-gradient-to-br from-emerald-700 to-slate-950">
                  <Image src={service.icon} alt="" className="w-16 opacity-80" />
                </div>
              )}
              <span className="absolute left-4 top-4 font-mono text-xs text-white">
                SVC-{String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-Ovo text-xl sm:text-2xl">{service.title}</h2>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-amber-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 dark:text-amber-400" />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-white/65">
                {service.description}
              </p>
              {service.tools?.length > 0 && (
                <ul className="mt-auto flex flex-wrap gap-2 pt-5">
                  {service.tools.map((tool) => (
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
