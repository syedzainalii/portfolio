"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { serviceData } from "@/assets/assets";
import useMediaQuery from "./useMediaQuery";

const pad = (n) => String(n).padStart(2, "0");

// Fallback backgrounds, used until a service has a real image
const fallbackGradients = [
  "from-sky-700 via-slate-800 to-slate-950",
  "from-orange-600 via-slate-800 to-slate-950",
  "from-emerald-700 via-slate-800 to-slate-950",
  "from-indigo-600 via-slate-800 to-slate-950",
  "from-cyan-700 via-slate-800 to-slate-950",
  "from-rose-700 via-slate-800 to-slate-950",
];

// Shape of each slot. Slot 0 is the focused (big) card.
// Phones: 2 columns (featured 2x2, wide, tall, small, small, wide).
// Desktop: 12 columns x 6 rows (featured 7x6, then 5x2, 3x2, 2x2, 2x2, 3x2).
const SLOTS = [
  "col-span-2 row-span-2 lg:col-span-7 lg:row-span-6",
  "col-span-2 lg:col-span-5 lg:row-span-2",
  "row-span-2 lg:col-span-3 lg:row-span-2",
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2 lg:row-span-2",
  "col-span-2 lg:col-span-3 lg:row-span-2",
];
const WIDE_SLOTS = [1, 5];

const Services = ({ preview = false }) => {
  const reduce = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const [order, setOrder] = useState(() => serviceData.map((_, i) => i));

  const gridRef = useRef(null);
  const lock = useRef(0); // ignore hover swaps until this timestamp
  const blocked = useRef(null); // the card that was just demoted under the cursor

  // Swap the chosen card with the focused one
  const activate = (idx, timestamp) => {
    const slot = order.indexOf(idx);
    if (slot <= 0) return;
    const next = [...order];
    [next[0], next[slot]] = [next[slot], next[0]];
    blocked.current = order[0];
    lock.current = timestamp + 700;
    setOrder(next);
  };

  // Mouse: focus on hover (with protection against flicker)
  const onMove = (e, idx) => {
    if (e.pointerType !== "mouse") return;
    if (e.movementX === 0 && e.movementY === 0) return;
    if (idx === blocked.current) return;
    blocked.current = null;
    if (idx === order[0]) return;
    if (e.timeStamp < lock.current) return;
    activate(idx, e.timeStamp);
  };

  // Keyboard: tabbing to a card focuses it (but not mouse or touch focus)
  const onFocus = (e, idx) => {
    if (e.currentTarget.matches(":focus-visible")) activate(idx, e.timeStamp);
  };

  // Touch/click: the first tap focuses, the second tap (on the focused card) opens
  const onClick = (e, idx) => {
    if (order[0] === idx) return;
    e.preventDefault();
    activate(idx, e.timeStamp);

    if (window.matchMedia("(max-width: 1023px)").matches) {
      window.setTimeout(() => {
        const r = gridRef.current?.getBoundingClientRect();
        if (!r) return;
        if (r.top < 80 || r.top > window.innerHeight * 0.45) {
          window.scrollTo({
            top: window.scrollY + r.top - 96,
            behavior: reduce ? "auto" : "smooth",
          });
        }
      }, 80);
    }
  };

  return (
    <section id="services" className="heavy-section w-full py-14 sm:py-20 lg:py-24">
      <div className="site-container">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
              What I offer
            </h4>
            <h2 className="font-Ovo text-4xl sm:text-5xl">My Services</h2>
          </div>

          {preview && (
            <Link
              href="/services"
              className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-black/15 py-1.5 pl-4 pr-1.5 text-sm font-medium leading-6 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/10 dark:border-white/20"
            >
              All services
              <span className="grid h-7 min-w-7 place-items-center rounded-full bg-black px-2 font-mono text-[11px] text-white transition-colors duration-300 group-hover:bg-amber-400 group-hover:text-black dark:bg-white dark:text-black">
                {pad(serviceData.length)}
              </span>
              <ArrowUpRight className="-ml-1 mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* Bento grid */}
        <ul
          ref={gridRef}
          className="grid auto-rows-[minmax(8.5rem,auto)] grid-cols-2 gap-3 sm:auto-rows-[minmax(10rem,auto)] sm:gap-4 lg:h-[36rem] lg:grid-cols-12 lg:grid-rows-6 xl:h-[40rem]"
        >
          {order.map((idx, slot) => {
            const service = serviceData[idx];
            const { title, description, detailedDescription, link, image, tools } = service;
            const featured = slot === 0;
            const wide = WIDE_SLOTS.includes(slot);

            return (
              <motion.li
                key={link ?? idx}
                layout={desktop && !reduce}
                transition={{ type: "spring", stiffness: 240, damping: 30 }}
                style={{ borderRadius: 28 }}
                data-featured={featured}
                className={`relative min-h-0 min-w-0 overflow-hidden border border-black/5 shadow-sm dark:border-white/10 lg:shadow-lg ${
                  SLOTS[slot] ?? ""
                }`}
              >
                <Link
                  href={`/services/${link}`}
                  aria-current={featured ? "true" : undefined}
                  onPointerMove={(e) => onMove(e, idx)}
                  onFocus={(e) => onFocus(e, idx)}
                  onClick={(e) => onClick(e, idx)}
                  className="group absolute inset-0 block outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400"
                >
                  {/* Background */}
                  <motion.div layout={desktop && !reduce} className="absolute inset-0">
                    {image ? (
                      <Image
                        src={image}
                        alt=""
                        fill
                        loading="lazy"
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    ) : (
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${
                          fallbackGradients[idx % fallbackGradients.length]
                        }`}
                      />
                    )}
                  </motion.div>

                  {/* Overlay */}
                  <motion.div
                    layout={desktop && !reduce}
                    className={`absolute inset-0 transition-colors duration-500 ${
                      featured
                        ? "bg-gradient-to-t from-black/85 via-black/25 to-black/10"
                        : "bg-slate-950/55 group-hover:bg-slate-950/40"
                    }`}
                  />

                  {/* Content */}
                  <motion.div
                    layout={desktop && !reduce ? "position" : false}
                    className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5 lg:p-6"
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold transition-colors duration-500 sm:h-10 sm:w-10 lg:backdrop-blur-sm ${
                          featured
                            ? "bg-amber-400 text-black"
                            : "bg-slate-950/75 text-white lg:bg-white/20"
                        }`}
                      >
                        {pad(idx + 1)}
                      </span>

                      {!featured && (
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white transition-all duration-300 group-hover:bg-amber-400 group-hover:text-black">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      )}
                    </div>

                    {featured ? (
                      <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0">
                          <div className="mb-3 h-1 w-12 rounded-full bg-amber-400 lg:mb-4" />
                          <h3 className="break-words font-Ovo text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
                            {title}
                          </h3>
                          <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-6 text-white/80 lg:mt-3 lg:line-clamp-3 lg:text-lg lg:leading-8">
                            {detailedDescription ?? description}
                          </p>

                          {tools?.length > 0 && (
                            <ul className="mt-3 flex flex-wrap gap-2 lg:mt-5">
                              {tools.slice(0, 4).map((tool, t) => (
                                <li
                                  key={tool}
                                  className={`rounded-full border border-white/25 bg-slate-950/75 px-3 py-0.5 text-xs leading-5 text-white lg:bg-white/10 lg:px-4 lg:py-1 lg:text-sm lg:backdrop-blur-sm ${
                                    t >= 3 ? "hidden sm:block" : ""
                                  }`}
                                >
                                  {tool}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <span className="hidden shrink-0 items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 group-hover:-translate-y-0.5 lg:inline-flex">
                          View service
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-400 text-black lg:hidden">
                          <ArrowUpRight className="h-5 w-5" />
                        </span>
                      </div>
                    ) : (
                      <div>
                        <h3
                          className={`break-words font-Ovo leading-tight text-white ${
                            wide ? "text-lg lg:text-2xl" : "text-base lg:text-lg"
                          }`}
                        >
                          {title}
                        </h3>
                        {wide && (
                          <p className="mt-1 line-clamp-1 text-xs text-white/70 lg:text-sm">
                            {description}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <p className="mt-5 text-center font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45 lg:hidden">
          Tap to focus · tap again to open
        </p>
      </div>
    </section>
  );
};

export default Services;