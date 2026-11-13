"use client";

import { useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import {
  FaAws,
  FaChartLine,
  FaCode,
  FaProjectDiagram,
  FaServer,
  FaUniversity,
  FaUserTie,
} from "react-icons/fa";
import { certificationData, certificationFilters } from "@/assets/assets";
import SectionPageLink from "./SectionPageLink";

const certificationIcons = {
  aws: FaAws,
  "chart-line": FaChartLine,
  code: FaCode,
  "project-diagram": FaProjectDiagram,
  server: FaServer,
  "user-tie": FaUserTie,
  university: FaUniversity,
};

// One accent color per category (matches the `iconBg` values in your data)
const ACCENTS = {
  devops: "#38bdf8",
  "project-management": "#a78bfa",
  "data-science": "#34d399",
};
const DEFAULT_ACCENT = "#fbbf24";

const pad = (n) => String(n).padStart(2, "0");
const hasUrl = (url) => Boolean(url) && url !== "#";

function Seal() {
  return (
    <div className="relative h-16 w-16 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden>
      <svg
        viewBox="0 0 64 64"
        className="h-full w-full animate-spin [animation-duration:24s] motion-reduce:animate-none"
      >
        <defs>
          <path id="seal-circle" d="M32,32 m-23,0 a23,23 0 1,1 46,0 a23,23 0 1,1 -46,0" />
        </defs>
        <text
          fill="currentColor"
          fontSize="6.6"
          fontWeight="700"
          letterSpacing="2.1"
          fontFamily="ui-monospace, monospace"
        >
          <textPath href="#seal-circle">VERIFIED • CREDENTIAL • VERIFIED •</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white">
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      </span>
    </div>
  );
}

function Notch({ side }) {
  return (
    <span
      aria-hidden
      className={`absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-black/10 bg-white dark:border-white/15 dark:bg-darkTheme ${
        side === "left"
          ? "left-0 -translate-x-1/2 [clip-path:inset(0_0_0_50%)]"
          : "right-0 translate-x-1/2 [clip-path:inset(0_50%_0_0)]"
      }`}
    />
  );
}

function CertTicket({ cert, serial, reduce }) {
  const ref = useRef(null);
  const accent = ACCENTS[cert.iconBg] ?? DEFAULT_ACCENT;
  const Icon = certificationIcons[cert.icon] ?? FaCode;
  const IssuerIcon = certificationIcons[cert.issuerIcon] ?? FaUniversity;

  const chips = String(cert.skills ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const shown = chips.slice(0, 4);
  const extra = chips.length - shown.length;

  const onMove = (e) => {
    const el = ref.current;
    if (!el || reduce || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 6}deg) rotateY(${
      (px - 0.5) * 8
    }deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="h-full"
    >
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative flex h-full flex-col rounded-3xl border border-black/10 bg-white shadow-lg transition-[transform,box-shadow] duration-200 ease-out hover:shadow-2xl dark:border-white/15 dark:bg-darkHover"
      >
        {/* Accent glow + cursor glare */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 45% at 50% 0%, ${accent}26, transparent 70%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.14), transparent 60%)",
            }}
          />
        </div>

        {/* Upper part */}
        <div className="relative flex-1 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span
                className="grid h-12 w-12 place-items-center rounded-2xl"
                style={{ backgroundColor: `${accent}26`, color: accent }}
              >
                <Icon className="text-2xl" />
              </span>
              <p className="mt-4 font-mono text-[11px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
                Cert · {pad(serial)}
              </p>
            </div>
            <Seal />
          </div>

          <h3 className="mt-3 text-xl font-semibold leading-7">{cert.title}</h3>
          <p className="mt-2 flex items-center gap-2 text-sm leading-6 text-gray-600 dark:text-white/65">
            <IssuerIcon className="shrink-0" />
            <span className="truncate">{cert.issuer}</span>
          </p>

          {shown.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {shown.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md border border-black/10 px-2.5 py-0.5 text-xs leading-5 text-gray-700 dark:border-white/15 dark:text-white/75"
                >
                  {skill}
                </li>
              ))}
              {extra > 0 && (
                <li className="rounded-md border border-dashed border-black/20 px-2.5 py-0.5 text-xs leading-5 text-gray-500 dark:border-white/20 dark:text-white/55">
                  +{extra} more
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Perforation */}
        <div
          aria-hidden
          className="relative h-0 border-t border-dashed border-black/20 dark:border-white/20"
        >
          <Notch side="left" />
          <Notch side="right" />
        </div>

        {/* Stub */}
        <div className="relative flex items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
              Issued
            </p>
            <p className="text-sm font-medium leading-6">{cert.date}</p>
          </div>

          {hasUrl(cert.certificateUrl) ? (
            <a
              href={cert.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View certificate: ${cert.title}`}
              className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-medium leading-6 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400 hover:text-black active:scale-95 dark:border-white/20"
            >
              View certificate
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : (
            <span className="rounded-full border border-dashed border-black/20 px-4 py-2 text-sm leading-6 text-gray-500 dark:border-white/20 dark:text-white/50">
              Certificate unavailable
            </span>
          )}
        </div>
      </div>
    </motion.li>
  );
}

const Certification = ({ preview = false }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const reduce = useReducedMotion();

  const certifications = certificationData;
  const filters = certificationFilters;

  const visible =
    activeFilter === "all"
      ? certifications
      : certifications.filter((c) => c.category === activeFilter);

  const countFor = (id) =>
    id === "all" ? certifications.length : certifications.filter((c) => c.category === id).length;

  // Summary strip numbers, all derived from the data
  const issuers = new Set(certifications.map((c) => c.issuer)).size;
  const latestTime = Math.max(
    ...certifications.map((c) => Date.parse(`1 ${c.date}`)).filter((t) => !Number.isNaN(t)),
    -Infinity
  );
  const latest = Number.isFinite(latestTime)
    ? new Date(latestTime).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  return (
    <section id="certification" className="w-full px-6 py-20 sm:px-10 lg:px-[12%]">
      {/* Heading */}
      <h4 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
        Credentials
      </h4>
      <h2 className="text-center font-Ovo text-4xl sm:text-5xl">Certifications &amp; Credentials</h2>
      <p className="mx-auto mb-10 mt-5 max-w-3xl text-center font-Ovo text-gray-600 dark:text-white/70">
        Professional certifications and credentials that validate my expertise and commitment to
        continuous learning.
      </p>

      <div className="mx-auto max-w-7xl">
        {/* Summary strip */}
        <div className="mx-auto mb-8 grid max-w-3xl grid-cols-3 divide-x divide-black/10 rounded-2xl border border-black/10 bg-black/[0.02] dark:divide-white/15 dark:border-white/15 dark:bg-white/5">
          {[
            { label: "Credentials", value: pad(certifications.length) },
            { label: "Issuers", value: pad(issuers) },
            { label: "Latest", value: latest ?? "—" },
          ].map((item) => (
            <div key={item.label} className="px-3 py-4 text-center sm:px-6">
              <p className="font-mono text-2xl font-semibold leading-8 tabular-nums sm:text-3xl sm:leading-9">
                {item.value}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div
          role="tablist"
          aria-label="Filter certifications"
          className="mx-auto mb-10 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-3xl border border-black/10 bg-black/[0.03] p-1 dark:border-white/15 dark:bg-white/5 sm:rounded-full"
        >
          {filters.map((filter) => {
            const isActive = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className="relative rounded-full px-4 py-2 text-sm font-medium leading-6"
              >
                {isActive && (
                  <motion.span
                    layoutId="cert-filter"
                    className="absolute inset-0 rounded-full bg-black dark:bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center gap-2 transition-colors duration-300 ${
                    isActive
                      ? "text-white dark:text-black"
                      : "text-gray-600 hover:text-black dark:text-white/70 dark:hover:text-white"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`rounded-full px-1.5 font-mono text-[11px] leading-5 ${
                      isActive
                        ? "bg-white/20 dark:bg-black/15"
                        : "bg-black/5 dark:bg-white/10"
                    }`}
                  >
                    {countFor(filter.id)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Tickets */}
        <LayoutGroup>
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((cert) => (
                <CertTicket
                  key={cert.id}
                  cert={cert}
                  serial={certifications.indexOf(cert) + 1}
                  reduce={reduce}
                />
              ))}
            </AnimatePresence>
          </ul>
        </LayoutGroup>

        {preview && <SectionPageLink href="/certification" label="View all" />}
      </div>
    </section>
  );
};

export default Certification;