"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { serviceData } from "@/assets/assets";

const pad = (n) => String(n).padStart(2, "0");

// Fallback backgrounds for services without an image
const gradients = [
  "from-sky-700 via-slate-800 to-slate-950",
  "from-orange-600 via-slate-800 to-slate-950",
  "from-emerald-700 via-slate-800 to-slate-950",
  "from-indigo-600 via-slate-800 to-slate-950",
  "from-cyan-700 via-slate-800 to-slate-950",
  "from-rose-700 via-slate-800 to-slate-950",
];

function Panel({ service, index }) {
  const includes = service.includes ?? [];
  const steps = service.process ?? [];
  const tools = service.tools ?? [];

  return (
    <div
      id="service-panel"
      className="services-fade overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl dark:border-white/15 dark:bg-darkHover"
    >
      {/* Picture header */}
      <div className="relative h-44 overflow-hidden bg-slate-900 sm:h-60">
        {service.image ? (
          <Image
            src={service.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]}`}>
            {service.icon && (
              <Image
                src={service.icon}
                alt=""
                className="absolute right-8 top-1/2 w-24 -translate-y-1/2 opacity-25 sm:w-32"
              />
            )}
          </div>
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <span className="absolute left-5 top-5 rounded-full bg-amber-400 px-3 py-1 font-mono text-xs font-bold leading-5 tracking-[0.15em] text-black">
          BAY {pad(index + 1)}
        </span>

        <h2 className="absolute inset-x-5 bottom-5 break-words font-Ovo text-3xl leading-tight text-white sm:text-5xl">
          {service.title}
        </h2>
      </div>

      <div className="space-y-9 p-5 sm:p-8">
        {/* Description */}
        <p className="text-base leading-7 text-gray-600 dark:text-white/70 sm:text-lg sm:leading-8">
          {service.detailedDescription ?? service.description}
        </p>

        {/* What's included */}
        {includes.length > 0 && (
          <section>
            <h3 className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
              What&apos;s included
            </h3>
            <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-400 text-black">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="min-w-0 break-words text-base leading-6">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* How it works */}
        {steps.length > 0 && (
          <section>
            <h3 className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
              How it works
            </h3>
            <ol className="mt-5 grid gap-0 sm:grid-cols-4 sm:gap-6">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="relative flex gap-4 pb-7 last:pb-0 sm:block sm:pb-0"
                >
                  {/* Connector: vertical on phones, horizontal on larger screens */}
                  {i < steps.length - 1 && (
                    <>
                      <span
                        aria-hidden
                        className="absolute bottom-0 left-5 top-10 w-px bg-amber-400/40 sm:hidden"
                      />
                      <span
                        aria-hidden
                        className="absolute left-12 right-0 top-5 hidden h-px bg-amber-400/40 sm:block"
                      />
                    </>
                  )}

                  <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-amber-400 bg-white font-mono text-sm font-bold text-amber-600 dark:bg-darkHover dark:text-amber-400">
                    {i + 1}
                  </span>

                  <div className="min-w-0 sm:mt-4">
                    <p className="font-semibold leading-6">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-white/55">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Tools */}
        {tools.length > 0 && (
          <p className="text-sm leading-7 text-gray-500 dark:text-white/55">
            <span className="font-medium text-black dark:text-white">Tools </span>
            {tools.join("  ·  ")}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-black/10 pt-6 dark:border-white/15 sm:flex-row sm:items-center">
          <Link
            href="/contact"
            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-amber-400 px-7 py-3 text-base font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(202,138,4,0.8)] active:scale-95"
          >
            Request this service
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href={`/services/${service.link}`}
            className="group inline-flex min-h-12 items-center justify-center gap-2 px-2 text-sm font-medium sm:justify-start"
          >
            <span className="relative">
              Full details
              <span className="absolute -bottom-1 left-0 h-px w-full bg-current opacity-30 transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ServicesExplorer() {
  const [active, setActive] = useState(0);
  const service = serviceData[active];

  return (
    <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-10">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes services-fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
            .services-fade { animation: services-fade 0.4s ease-out both; }
            @media (prefers-reduced-motion: reduce) { .services-fade { animation: none; } }
          `,
        }}
      />

      {/* ===== Bays list ===== */}
      <nav aria-label="Services" className="min-w-0 lg:sticky lg:top-28 lg:col-span-4">
        <p className="mb-3 hidden font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45 lg:block">
          Choose a bay · {pad(serviceData.length)} available
        </p>

        <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {serviceData.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.link} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  aria-pressed={on}
                  aria-controls="service-panel"
                  onClick={() => setActive(i)}
                  className={`group relative flex min-h-11 w-full items-center gap-3 rounded-full border px-4 py-2 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-400 motion-reduce:transition-none lg:min-h-0 lg:gap-5 lg:rounded-none lg:border-0 lg:border-t lg:px-0 lg:py-5 ${
                    on
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black lg:bg-transparent lg:text-inherit dark:lg:bg-transparent dark:lg:text-inherit"
                      : "border-black/15 text-gray-700 hover:border-amber-400 dark:border-white/20 dark:text-white/80 lg:text-inherit"
                  } lg:border-black/10 dark:lg:border-white/15`}
                >
                  {/* Amber bar (desktop) */}
                  <span
                    aria-hidden
                    className={`absolute -top-px left-0 hidden h-px origin-left bg-amber-400 transition-transform duration-500 lg:block ${
                      on ? "w-full scale-x-100" : "w-full scale-x-0"
                    }`}
                  />

                  <span
                    className={`font-mono text-xs tabular-nums lg:text-sm ${
                      on ? "text-amber-400 lg:text-amber-500" : "text-gray-400 dark:text-white/40"
                    }`}
                  >
                    {pad(i + 1)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block whitespace-nowrap font-Ovo text-sm leading-tight transition-all duration-300 lg:whitespace-normal lg:text-2xl ${
                        on ? "lg:translate-x-1" : "lg:opacity-45 lg:group-hover:opacity-80"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`mt-1 hidden text-sm leading-5 text-gray-500 transition-opacity duration-300 dark:text-white/55 lg:line-clamp-1 lg:block ${
                        on ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {s.description}
                    </span>
                  </span>

                  <ArrowUpRight
                    aria-hidden
                    className={`hidden h-5 w-5 shrink-0 transition-all duration-300 lg:block ${
                      on ? "text-amber-500 opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              </li>
            );
          })}
          <li aria-hidden className="hidden border-t border-black/10 dark:border-white/15 lg:block" />
        </ul>
      </nav>

      {/* ===== Bay panel ===== */}
      <div className="min-w-0 lg:col-span-8">
        <Panel key={service.link} service={service} index={active} />
      </div>
    </div>
  );
}