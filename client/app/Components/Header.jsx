"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import {
  assets,
  certificationData,
  experienceData,
  serviceData,
  workData,
} from "@/assets/assets";
import { useTheme } from "./ThemeProvider";
import useMediaQuery from "./useMediaQuery";

const pad = (n) => String(n).padStart(2, "0");
const MeshBackground = dynamic(() => import("./MeshBackground"), { ssr: false });

/* ---------- Rotating "I do ..." line ---------- */
function RotatingService({ reduce }) {
  const words = serviceData.map((s) => s.title);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [reduce, words.length]);

  return (
    <p className="mt-6 flex min-w-0 items-center gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
        I do
      </span>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden className="relative block min-w-0 max-w-full overflow-hidden sm:h-9">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            initial={reduce ? false : { y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="block break-words font-Ovo text-lg leading-7 sm:text-3xl sm:leading-9"
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}

/* ---------- Floating chip around the portrait ---------- */
function Chip({ children, className, delay = 0, reduce, desktop }) {
  return (
    <motion.div
      animate={reduce || !desktop ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute z-20 rounded-xl border border-black/10 bg-white/95 px-3 py-2 text-xs font-medium leading-5 shadow-sm dark:border-white/15 dark:bg-darkHover/95 lg:bg-white/80 lg:backdrop-blur-md lg:dark:bg-darkHover/80 lg:shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}

const Header = () => {
  const { isDarkMode } = useTheme();
  const reduce = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const meshEnabled = useMediaQuery("(min-width: 640px)");

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.1 } },
  };
  const item = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const stats = [
    { n: serviceData.length, label: "Services" },
    { n: workData.length, label: "Projects" },
    { n: certificationData.length, label: "Certificates" },
    { n: experienceData.length, label: "Roles" },
  ];

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden pb-10 pt-32 lg:min-h-screen"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_75%_70%_at_55%_50%,transparent_35%,rgba(0,0,0,0.025)_100%),linear-gradient(to_right,rgba(0,0,0,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.07)_1px,transparent_1px)] bg-[length:auto,52px_52px,52px_52px] dark:bg-[radial-gradient(ellipse_75%_70%_at_55%_50%,transparent_35%,rgba(255,255,255,0.025)_100%),linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] max-sm:block"
      />
      {meshEnabled && <MeshBackground dark={isDarkMode} reduce={reduce} />}

      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-10">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        {/* ===== Text ===== */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center lg:col-span-7 lg:text-left"
        >
          <motion.p
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-4 py-1.5 text-sm leading-6 dark:border-white/15 dark:bg-darkHover/90 lg:bg-white/70 lg:backdrop-blur-md lg:dark:bg-white/5"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 motion-reduce:animate-none lg:animate-pulse" />
            Hi! I&apos;m Syed Zain Ali
            <Image src={assets.hand_icon} alt="" className="w-4" sizes="16px" loading="lazy" />
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 font-Ovo text-3xl leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Mechanical Engineering Student at{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              NED UET.
            </span>
          </motion.h1>

          <motion.div variants={item} className="flex justify-center lg:justify-start">
            <RotatingService reduce={reduce || !desktop} />
          </motion.div>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-xl font-Ovo text-base leading-7 text-gray-600 dark:text-white/70 lg:mx-0"
          >
            I am a Mechanical Engineering student with experience in assembly and manufacturing at
            companies like SSGC.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center"
          >
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-darkHover px-8 py-3.5 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-amber-400 hover:text-black dark:bg-white dark:text-black dark:hover:bg-amber-400"
            >
              Contact Me
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href="/my_resume.pdf"
              download="Syed_Zain_Ali_Resume.pdf"
              className="group inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/90 px-8 py-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 dark:border-white/25 dark:bg-darkHover/90 lg:bg-white/60 lg:backdrop-blur-md lg:dark:bg-white/5"
            >
              My Resume
              <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </motion.div>
        </motion.div>

        {/* ===== Portrait ===== */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="order-first lg:order-last lg:col-span-5"
        >
          <div className="relative mx-auto w-56 sm:w-72 lg:w-full lg:max-w-sm">
            {/* Figure label */}
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase leading-4 tracking-[0.25em] text-gray-500 dark:text-white/45">
              <span>Fig. 01</span>
              <span className="h-px flex-1 bg-black/15 dark:bg-white/20" />
              <span>Portrait</span>
            </div>

            <div className="relative aspect-[4/5]">
              {/* Glow */}
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[3rem] bg-[radial-gradient(ellipse,rgba(251,191,36,0.25),transparent_70%)] dark:bg-[radial-gradient(ellipse,rgba(251,191,36,0.15),transparent_70%)] lg:bg-amber-400/25 lg:blur-3xl lg:dark:bg-amber-400/15"
              />

              {/* Photo */}
              <div className="relative h-full overflow-hidden rounded-3xl border border-black/10 bg-gray-200 shadow-lg dark:border-white/15 dark:bg-darkHover lg:shadow-2xl">
                <Image
                  src={assets.user_image}
                  alt="Syed Zain Ali"
                  fill
                  priority
                  quality={70}
                  sizes="(min-width: 1024px) 24rem, (min-width: 640px) 18rem, 14rem"
                  className="object-cover object-top"
                />
              </div>

              {/* Floating chips */}
              <Chip reduce={reduce} desktop={desktop} delay={0} className="-left-4 bottom-10 hidden sm:block lg:-left-10">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Internship
                </span>
                SSGC · Meter Manufacturing
              </Chip>
              <Chip reduce={reduce} desktop={desktop} delay={1.2} className="-right-3 top-10 hidden sm:block lg:-right-8">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Tools
                </span>
                Abaqus · SolidWorks · Next.js
              </Chip>
              <Chip reduce={reduce} desktop={desktop} delay={2.4} className="-right-3 bottom-24 hidden lg:block lg:-right-10">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Certified
                </span>
                Google IT Automation
              </Chip>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ===== Bottom row: stats + legend ===== */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative z-10 mt-12 flex flex-col items-center justify-between gap-6 border-t border-black/10 pt-6 dark:border-white/15 lg:flex-row"
      >
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 sm:gap-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center lg:text-left">
              <dt className="order-2 font-mono text-xs uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45 sm:text-[10px]">
                {s.label}
              </dt>
              <dd className="font-mono text-2xl font-semibold leading-8 tabular-nums sm:text-3xl">
                {pad(s.n)}
              </dd>
            </div>
          ))}
        </dl>

        <div className="hidden items-center gap-3 font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45 lg:flex">
          <span>Move your cursor · live stress contour</span>
          <span className="flex items-center gap-2">
            Low
            <span
              className="h-1.5 w-28 rounded-full"
              style={{
                background: "linear-gradient(to right,#38bdf8,#34d399,#facc15,#fb923c,#ef4444)",
              }}
            />
            High
          </span>
        </div>
      </motion.div>
      </div>
    </section>
  );
};

export default Header;