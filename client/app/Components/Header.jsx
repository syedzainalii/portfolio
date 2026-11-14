"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

const pad = (n) => String(n).padStart(2, "0");

/* ---------- Live FEA-style mesh ---------- */
const STEP = 34;
// bucket 0 = unstressed, 1-5 = blue, green, yellow, orange, red
const HOT = ["", "56,189,248", "52,211,153", "250,204,21", "251,146,60", "239,68,68"];
const HOT_ALPHA = [0, 0.55, 0.65, 0.75, 0.85, 0.92];
const HOT_WIDTH = [1, 1, 1, 1.2, 1.4, 1.6];

function MeshBackground({ dark, reduce }) {
  const canvasRef = useRef(null);
  const darkRef = useRef(dark);

  useEffect(() => {
    darkRef.current = dark;
  }, [dark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas.parentElement;
    const ctx = canvas.getContext("2d");

    let w = 0, h = 0, cols = 0, rows = 0, raf = 0, visible = true;
    let X, Y, F;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, active: false };

    const resize = () => {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / STEP) + 3;
      rows = Math.ceil(h / STEP) + 3;
      X = new Float32Array(cols * rows);
      Y = new Float32Array(cols * rows);
      F = new Float32Array(cols * rows);
      if (!mouse.active) {
        mouse.x = mouse.tx = w * 0.7;
        mouse.y = mouse.ty = h * 0.45;
      }
      if (reduce) draw(0);
    };

    const draw = (t) => {
      if (!w || !X) return;
      const dk = darkRef.current;

      if (!mouse.active && !reduce) {
        mouse.tx = w * (0.5 + 0.32 * Math.sin(t / 2600));
        mouse.ty = h * (0.5 + 0.28 * Math.sin(t / 1900 + 1));
      }
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      const SIGMA2 = 2 * 170 * 170;
      const PUSH = 42;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const bx = (c - 1) * STEP;
          const by = (r - 1) * STEP;
          const dx = bx - mouse.x;
          const dy = by - mouse.y;
          const d2 = dx * dx + dy * dy;
          const f = Math.exp(-d2 / SIGMA2);
          const d = Math.sqrt(d2) || 1;
          X[i] = bx + (dx / d) * f * PUSH;
          Y[i] = by + (dy / d) * f * PUSH;
          F[i] = f;
        }
      }

      ctx.clearRect(0, 0, w, h);
      const paths = HOT.map(() => new Path2D());

      const edge = (a, b) => {
        const v = (F[a] + F[b]) / 2;
        const k = v < 0.04 ? 0 : Math.min(5, 1 + Math.floor((v - 0.04) / 0.16));
        paths[k].moveTo(X[a], Y[a]);
        paths[k].lineTo(X[b], Y[b]);
      };

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (c < cols - 1) edge(i, i + 1);
          if (r < rows - 1) edge(i, i + cols);
        }
      }

      paths.forEach((p, k) => {
        ctx.lineWidth = HOT_WIDTH[k];
        ctx.strokeStyle =
          k === 0
            ? dk
              ? "rgba(255,255,255,0.09)"
              : "rgba(0,0,0,0.09)"
            : `rgba(${HOT[k]},${HOT_ALPHA[k]})`;
        ctx.stroke(p);
      });
    };

    const frame = (t) => {
      if (!visible) {
        raf = 0;
        return;
      }
      draw(t);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible && !reduce) raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      const r = host.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(host);

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    resize();
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        maskImage: "radial-gradient(ellipse 75% 70% at 55% 50%, black 35%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 55% 50%, black 35%, transparent 100%)",
      }}
    />
  );
}

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
    <p className="mt-6 flex items-center gap-3">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
        I do
      </span>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden className="relative block h-9 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            initial={reduce ? false : { y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="block font-Ovo text-2xl leading-9 sm:text-3xl"
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}

/* ---------- Floating chip around the portrait ---------- */
function Chip({ children, className, delay = 0, reduce }) {
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute z-20 rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-xs font-medium leading-5 shadow-lg backdrop-blur-md dark:border-white/15 dark:bg-darkHover/80 ${className}`}
    >
      {children}
    </motion.div>
  );
}

const Header = () => {
  const { isDarkMode } = useTheme();
  const reduce = useReducedMotion();

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
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden pb-10 pt-32"
    >
      <MeshBackground dark={isDarkMode} reduce={reduce} />

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
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-1.5 text-sm leading-6 backdrop-blur-md dark:border-white/15 dark:bg-white/5"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />
            Hi! I&apos;m Syed Zain Ali
            <Image src={assets.hand_icon} alt="" className="w-4" />
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 font-Ovo text-4xl leading-[1.08] sm:text-6xl lg:text-7xl"
          >
            Mechanical Engineering Student at{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              NED UET.
            </span>
          </motion.h1>

          <motion.div variants={item} className="flex justify-center lg:justify-start">
            <RotatingService reduce={reduce} />
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
              className="group inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/60 px-8 py-3.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 dark:border-white/25 dark:bg-white/5"
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
                className="absolute -inset-6 rounded-[3rem] bg-amber-400/25 blur-3xl dark:bg-amber-400/15"
              />

              {/* Photo */}
              <div className="relative h-full overflow-hidden rounded-3xl border border-black/10 bg-gray-200 shadow-2xl dark:border-white/15 dark:bg-darkHover">
                <Image
                  src={assets.user_image}
                  alt="Syed Zain Ali"
                  fill
                  priority
                  sizes="(min-width: 1024px) 24rem, 18rem"
                  className="object-cover object-top"
                />
              </div>

              {/* Corner brackets */}
              <span aria-hidden className="absolute -left-2 -top-2 h-7 w-7 border-l-2 border-t-2 border-amber-400" />
              <span aria-hidden className="absolute -right-2 -top-2 h-7 w-7 border-r-2 border-t-2 border-amber-400" />
              <span aria-hidden className="absolute -bottom-2 -left-2 h-7 w-7 border-b-2 border-l-2 border-amber-400" />
              <span aria-hidden className="absolute -bottom-2 -right-2 h-7 w-7 border-b-2 border-r-2 border-amber-400" />

              {/* Floating chips */}
              <Chip reduce={reduce} delay={0} className="-left-4 bottom-10 hidden sm:block lg:-left-10">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Internship
                </span>
                SSGC · Meter Manufacturing
              </Chip>
              <Chip reduce={reduce} delay={1.2} className="-right-3 top-10 hidden sm:block lg:-right-8">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Tools
                </span>
                Abaqus · SolidWorks · Next.js
              </Chip>
              <Chip reduce={reduce} delay={2.4} className="-right-3 bottom-24 hidden lg:block lg:-right-10">
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
        <dl className="grid grid-cols-4 gap-6 sm:gap-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center lg:text-left">
              <dt className="order-2 font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
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