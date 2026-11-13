"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, BadgeCheck, Plus } from "lucide-react";
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

const ACCENTS = {
  devops: "#38bdf8",
  "project-management": "#a78bfa",
  "data-science": "#34d399",
};
const DEFAULT_ACCENT = "#fbbf24";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Reads dates like "September, 2024" (UTC, so no timezone shifts)
function parseDate(text) {
  const m = String(text).match(/([A-Za-z]+)\W+(\d{4})/);
  if (!m) return NaN;
  const month = MONTHS.indexOf(m[1].slice(0, 3).toLowerCase());
  return month < 0 ? NaN : Date.UTC(Number(m[2]), month, 1);
}

const pad = (n) => String(n).padStart(2, "0");
const hasUrl = (url) => Boolean(url) && url !== "#";

function WalletCard({ cert, index, open, onToggle, reduce }) {
  const accent = ACCENTS[cert.iconBg] ?? DEFAULT_ACCENT;
  const Icon = certificationIcons[cert.icon] ?? FaCode;
  const IssuerIcon = certificationIcons[cert.issuerIcon] ?? FaUniversity;
  const linked = hasUrl(cert.certificateUrl);

  const skills = String(cert.skills ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const panelId = `cert-panel-${cert.id}`;

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: reduce ? 0 : index * 0.07, ease: "easeOut" }}
      // Later cards sit on top of earlier ones, so each card's bottom edge is tucked under the next
      style={{ zIndex: index + 1 }}
      className="relative -mt-5 first:mt-0"
    >
      <div
        className={`group relative overflow-hidden rounded-3xl border bg-white pb-5 shadow-[0_-10px_24px_-14px_rgba(0,0,0,0.35)] transition-all duration-300 dark:bg-darkHover ${
          open
            ? "border-transparent"
            : "border-black/10 hover:-translate-y-1 dark:border-white/15"
        }`}
        style={open ? { borderColor: `${accent}99`, boxShadow: `0 18px 50px -18px ${accent}66` } : undefined}
      >
        {/* Accent wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(90% 70% at 0% 0%, ${accent}${open ? "2b" : "14"}, transparent 70%)`,
          }}
        />

        {/* Strip (always visible) */}
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="relative flex w-full items-center gap-4 p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        >
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl"
            style={{ backgroundColor: `${accent}26`, color: accent }}
          >
            <Icon />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-base font-semibold leading-6 sm:text-lg">
              {cert.title}
            </span>
            <span className="mt-0.5 flex items-center gap-2 text-xs leading-5 text-gray-500 dark:text-white/55 sm:text-sm">
              <IssuerIcon className="shrink-0" />
              <span className="truncate">{cert.issuer}</span>
              <span aria-hidden>·</span>
              <span className="shrink-0">{cert.date}</span>
            </span>
          </span>

          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
              open
                ? "rotate-45 border-amber-400 bg-amber-400 text-black"
                : "border-black/15 text-gray-500 group-hover:border-amber-400 dark:border-white/20 dark:text-white/60"
            }`}
          >
            <Plus className="h-4 w-4" />
          </span>
        </button>

        {/* Details */}
        <div
          id={panelId}
          className={`relative grid transition-all duration-500 ease-out motion-reduce:transition-none ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-5 pb-1 pt-1 sm:pl-[5.25rem]">
              {skills.length > 0 && (
                <p className="text-sm leading-7 text-gray-600 dark:text-white/65">
                  <span className="font-medium text-gray-800 dark:text-white/85">Skills </span>
                  {skills.join("  ·  ")}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck className="h-4 w-4" />
                  Verified
                </span>

                {linked ? (
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-2 text-sm font-medium transition-all duration-300 hover:border-amber-400 hover:bg-amber-400 hover:text-black dark:border-white/20"
                  >
                    View certificate
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </a>
                ) : (
                  <span className="text-sm text-gray-400 dark:text-white/40">
                    Certificate unavailable
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

const Certification = ({ preview = false }) => {
  const certifications = certificationData;
  const filters = certificationFilters;
  const reduce = useReducedMotion();

  const [activeFilter, setActiveFilter] = useState("all");
  const [openId, setOpenId] = useState(certifications[0]?.id ?? null);

  const visible =
    activeFilter === "all"
      ? certifications
      : certifications.filter((c) => c.category === activeFilter);

  const countFor = (id) =>
    id === "all" ? certifications.length : certifications.filter((c) => c.category === id).length;

  const selectFilter = (id) => {
    setActiveFilter(id);
    const first = (id === "all" ? certifications : certifications.filter((c) => c.category === id))[0];
    setOpenId(first?.id ?? null);
  };

  // One-line summary, all derived from your data
  const issuers = new Set(certifications.map((c) => c.issuer)).size;
  const times = certifications.map((c) => parseDate(c.date)).filter((t) => !Number.isNaN(t));
  const latest = times.length
    ? new Date(Math.max(...times)).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;

  return (
    <section id="certification" className="w-full px-6 py-20 sm:px-10 lg:px-[12%]">
      <h4 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
        Credentials
      </h4>
      <h2 className="text-center font-Ovo text-4xl sm:text-5xl">Certifications &amp; Credentials</h2>
      <p className="mx-auto mt-5 max-w-3xl text-center font-Ovo text-gray-600 dark:text-white/70">
        Professional certifications and credentials that validate my expertise and commitment to
        continuous learning.
      </p>

      <div className="mx-auto mt-14 grid max-w-6xl items-start gap-10 lg:grid-cols-12 lg:gap-16">
        {/* ===== Left: counter + filters ===== */}
        <div className="lg:sticky lg:top-28 lg:col-span-5">
          <div className="flex items-end gap-4">
            <span className="relative block h-24 overflow-hidden font-mono text-8xl font-semibold leading-[6rem] tabular-nums sm:h-28 sm:text-9xl sm:leading-[7rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={visible.length}
                  initial={reduce ? false : { y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block bg-gradient-to-b from-amber-400 to-amber-600 bg-clip-text text-transparent"
                >
                  {pad(visible.length)}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="pb-3 font-mono text-xs uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
              credentials
              <br />
              on file
            </span>
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-white/50">
            From {issuers} issuers{latest ? ` · latest ${latest}` : ""}
          </p>

          <div
            role="tablist"
            aria-label="Filter certifications"
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 lg:flex-col lg:gap-1"
          >
            {filters.map((filter) => {
              const isActive = filter.id === activeFilter;
              return (
                <button
                  key={filter.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => selectFilter(filter.id)}
                  className="flex items-center gap-3 py-1.5 text-left text-base leading-6"
                >
                  <span className="grid h-2 w-2 place-items-center">
                    {isActive && (
                      <motion.span
                        layoutId="cert-dot"
                        className="h-2 w-2 rounded-full bg-amber-400"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </span>
                  <span
                    className={`transition-colors duration-300 ${
                      isActive
                        ? "font-semibold text-black dark:text-white"
                        : "text-gray-500 hover:text-black dark:text-white/55 dark:hover:text-white"
                    }`}
                  >
                    {filter.label}
                  </span>
                  <span className="font-mono text-xs text-gray-400 dark:text-white/40">
                    {pad(countFor(filter.id))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== Right: the wallet ===== */}
        <div className="lg:col-span-7">
          <ul key={activeFilter} className="pt-1">
            {visible.map((cert, i) => (
              <WalletCard
                key={cert.id}
                cert={cert}
                index={i}
                open={openId === cert.id}
                onToggle={() => setOpenId((cur) => (cur === cert.id ? null : cert.id))}
                reduce={reduce}
              />
            ))}
          </ul>
        </div>
      </div>

      {preview && <SectionPageLink href="/certification" label="View all" />}
    </section>
  );
};

export default Certification;