"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Plus, X } from "lucide-react";
import { serviceData } from "@/assets/assets";

/*
  Services as a shop job ticket: open a service to read how it works,
  add the ones you need to the work order, and send them in one request.
*/

/* ---------- process stepper: a rail with a marker that advances ---------- */
function ProcessRail({ steps }) {
  const [step, setStep] = useState(0);
  const last = Math.max(steps.length - 1, 1);

  return (
    <div>
      <div className="relative">
        {/* rail */}
        <span aria-hidden className="absolute left-5 right-5 top-5 h-0.5 bg-black/10 dark:bg-white/15" />
        <span
          aria-hidden
          className="absolute left-5 top-5 h-0.5 bg-amber-400 transition-all duration-500 motion-reduce:transition-none"
          style={{ width: `calc((100% - 2.5rem) * ${step / last})` }}
        />
        <ol className="relative flex justify-between">
          {steps.map((s, i) => {
            const done = i <= step;
            return (
              <li key={s.title}>
                <button
                  type="button"
                  aria-pressed={i === step}
                  aria-label={`Step ${i + 1}: ${s.title}`}
                  onClick={() => setStep(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setStep(i)}
                  className={`grid h-10 w-10 place-items-center rounded-full border-2 text-sm font-semibold outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    done
                      ? "border-amber-400 bg-amber-400 text-black"
                      : "border-black/20 bg-white text-gray-500 dark:border-white/25 dark:bg-darkHover dark:text-white/60"
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div aria-live="polite" className="mt-4 min-h-[4.5rem]">
        <p className="text-base font-semibold leading-6">{steps[step].title}</p>
        <p className="mt-1 max-w-xl text-sm leading-6 text-gray-600 dark:text-white/65">
          {steps[step].description}
        </p>
      </div>
    </div>
  );
}

/* ---------- one service (accordion item) ---------- */
function ServiceItem({ service, open, onToggle, added, onAdd }) {
  const includes = service.includes ?? [];
  const steps = service.process ?? [];
  const tools = service.tools ?? [];
  const bodyId = `svc-${service.link}`;

  return (
    <li
      className={`rounded-2xl border transition-colors duration-300 ${
        open
          ? "border-amber-400 bg-white shadow-lg dark:bg-darkHover"
          : "border-black/10 bg-white/60 hover:border-black/30 dark:border-white/15 dark:bg-transparent dark:hover:border-white/40"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-4 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <span className="min-w-0 flex-1">
            <span className="block break-words font-Ovo text-xl leading-tight sm:text-2xl">{service.title}</span>
            <span className={`mt-1 block text-sm leading-6 text-gray-500 dark:text-white/55 ${open ? "" : "line-clamp-1"}`}>
              {service.description}
            </span>
          </span>
          <ChevronDown
            aria-hidden
            className={`h-5 w-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          />
        </button>

        <button
          type="button"
          aria-pressed={added}
          aria-label={added ? `Remove ${service.title} from work order` : `Add ${service.title} to work order`}
          onClick={onAdd}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-90 ${
            added
              ? "border-amber-400 bg-amber-400 text-black"
              : "border-black/20 text-gray-700 hover:border-amber-400 dark:border-white/25 dark:text-white/80"
          }`}
        >
          {added ? <Check className="h-5 w-5" strokeWidth={3} /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      {/* Body */}
      {open && (
        <div id={bodyId} className="svc-open space-y-8 border-t border-black/10 p-4 pt-6 dark:border-white/15 sm:p-6">
          {service.image && (
            <div className="relative aspect-[16/7] overflow-hidden rounded-xl bg-slate-900">
              <Image src={service.image} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            </div>
          )}

          <p className="max-w-2xl text-base leading-7 text-gray-600 dark:text-white/70">
            {service.detailedDescription ?? service.description}
          </p>

          {includes.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold leading-7">What you get</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {includes.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-400/15 px-3 py-1.5 text-sm leading-5"
                  >
                    <Check aria-hidden className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={3} />
                    <span className="break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {steps.length > 0 && (
            <section>
              <h3 className="mb-4 text-lg font-semibold leading-7">How we will work together</h3>
              <ProcessRail steps={steps} />
            </section>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-5 dark:border-white/15">
            {tools.length > 0 ? (
              <p className="min-w-0 text-sm leading-6 text-gray-500 dark:text-white/55">
                <span className="font-medium text-black dark:text-white">Software: </span>
                {tools.join(", ")}
              </p>
            ) : (
              <span />
            )}
            <Link
              href={`/services/${service.link}`}
              className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium"
            >
              <span className="relative">
                Read full details
                <span className="absolute -bottom-1 left-0 h-px w-full bg-current opacity-30 transition-opacity duration-300 group-hover:opacity-100" />
              </span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      )}
    </li>
  );
}

/* ---------- main ---------- */
export default function ServicesExplorer() {
  const [openLink, setOpenLink] = useState(serviceData[0]?.link ?? null);
  const [picked, setPicked] = useState([]); // array of service.link, in the order added

  const toggleAdd = (link) =>
    setPicked((p) => (p.includes(link) ? p.filter((l) => l !== link) : [...p, link]));

  const pickedServices = picked.map((l) => serviceData.find((s) => s.link === l)).filter(Boolean);
  const requestHref = pickedServices.length
    ? `/contact?services=${encodeURIComponent(pickedServices.map((s) => s.title).join(", "))}`
    : "/contact";

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_20rem] lg:gap-12">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes svc-open { from { opacity: 0; } to { opacity: 1; } }
            .svc-open { animation: svc-open 0.35s ease-out both; }
            @media (prefers-reduced-motion: reduce) { .svc-open { animation: none; } }
          `,
        }}
      />

      {/* Services */}
      <ul className="min-w-0 space-y-3" aria-label="Services">
        {serviceData.map((s) => (
          <ServiceItem
            key={s.link}
            service={s}
            open={openLink === s.link}
            onToggle={() => setOpenLink(openLink === s.link ? null : s.link)}
            added={picked.includes(s.link)}
            onAdd={() => toggleAdd(s.link)}
          />
        ))}
      </ul>

      {/* Work order */}
      <aside
        aria-label="Your work order"
        className="rounded-2xl border-2 border-dashed border-black/25 bg-white p-5 dark:border-white/30 dark:bg-darkHover lg:sticky lg:top-28"
      >
        <h2 className="font-Ovo text-2xl leading-8">Your work order</h2>
        <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-white/55">
          Use the + button on any service to add it, then send everything in one request.
        </p>

        <div aria-live="polite" className="mt-5 min-h-[5rem]">
          {pickedServices.length === 0 ? (
            <p className="rounded-xl bg-black/5 px-4 py-5 text-center text-sm leading-6 text-gray-500 dark:bg-white/5 dark:text-white/55">
              Nothing added yet.
            </p>
          ) : (
            <ul className="divide-y divide-black/10 dark:divide-white/15">
              {pickedServices.map((s) => (
                <li key={s.link} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0 break-words text-sm font-medium leading-5">{s.title}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${s.title}`}
                    onClick={() => toggleAdd(s.link)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-gray-500 outline-none hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-white/60 dark:hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link
          href={requestHref}
          className="group mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-amber-400 px-6 py-3 text-base font-semibold text-black outline-none transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-black active:scale-95 dark:focus-visible:ring-white motion-reduce:transition-none"
        >
          {pickedServices.length ? `Request ${pickedServices.length} ${pickedServices.length === 1 ? "service" : "services"}` : "Get in touch"}
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </aside>
    </div>
  );
}