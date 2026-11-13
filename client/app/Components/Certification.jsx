"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
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

const hasUrl = (url) => Boolean(url) && url !== "#";

function CertCard({ cert, featured, reduce }) {
  const accent = ACCENTS[cert.iconBg] ?? DEFAULT_ACCENT;
  const Icon = certificationIcons[cert.icon] ?? FaCode;
  const IssuerIcon = certificationIcons[cert.issuerIcon] ?? FaUniversity;
  const linked = hasUrl(cert.certificateUrl);

  const skills = String(cert.skills ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const Wrapper = linked ? "a" : "div";
  const wrapperProps = linked
    ? {
        href: cert.certificateUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `View certificate: ${cert.title}`,
      }
    : {};

  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className={featured ? "md:col-span-2" : ""}
    >
      <Wrapper
        {...wrapperProps}
        onPointerMove={onMove}
        className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/15 dark:bg-darkHover ${
          featured ? "p-7 sm:p-9" : "p-6 sm:p-7"
        }`}
      >
        {/* Soft color wash + cursor light */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(90% 60% at 0% 0%, ${accent}${featured ? "26" : "14"}, transparent 70%)`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(280px circle at var(--mx, 50%) var(--my, 0%), ${accent}24, transparent 65%)`,
          }}
        />

        <div className="relative flex items-start justify-between">
          <span
            className={`grid place-items-center rounded-2xl ${featured ? "h-14 w-14 text-3xl" : "h-12 w-12 text-2xl"}`}
            style={{ backgroundColor: `${accent}26`, color: accent }}
          >
            <Icon />
          </span>
          {linked && (
            <span className="grid h-10 w-10 place-items-center rounded-full border border-black/10 text-gray-500 transition-all duration-300 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-black dark:border-white/15 dark:text-white/60">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </div>

        <h3
          className={`relative mt-6 font-semibold ${
            featured ? "text-2xl leading-9 sm:text-3xl sm:leading-10" : "text-xl leading-7"
          }`}
        >
          {cert.title}
        </h3>

        <p className="relative mt-2 flex items-center gap-2 text-sm leading-6 text-gray-600 dark:text-white/65">
          <IssuerIcon className="shrink-0" />
          <span className="truncate">{cert.issuer}</span>
          <span aria-hidden>·</span>
          <span className="shrink-0">{cert.date}</span>
        </p>

        {skills.length > 0 && (
          <p
            title={skills.join(", ")}
            className={`relative mt-4 text-sm leading-6 text-gray-500 dark:text-white/50 ${
              featured ? "line-clamp-3" : "line-clamp-2"
            }`}
          >
            {skills.join("  ·  ")}
          </p>
        )}

        <div className="relative mt-auto flex items-center justify-between gap-3 pt-6 text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <BadgeCheck className="h-4 w-4" />
            Verified
          </span>
          {linked ? (
            <span className="font-medium text-gray-700 transition-colors duration-300 group-hover:text-black dark:text-white/70 dark:group-hover:text-white">
              View certificate
            </span>
          ) : (
            <span className="text-gray-400 dark:text-white/40">Certificate unavailable</span>
          )}
        </div>
      </Wrapper>
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
      <p className="mt-3 text-center text-sm text-gray-500 dark:text-white/50">
        {certifications.length} credentials from {issuers} issuers
        {latest ? ` · latest ${latest}` : ""}
      </p>

      <div className="mx-auto mt-10 max-w-6xl">
        {/* Filters */}
        <div
          role="tablist"
          aria-label="Filter certifications"
          className="mb-10 flex flex-wrap justify-center gap-x-7 gap-y-2"
        >
          {filters.map((filter) => {
            const isActive = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className="relative pb-2 text-sm font-medium leading-6"
              >
                <span
                  className={`transition-colors duration-300 ${
                    isActive
                      ? "text-black dark:text-white"
                      : "text-gray-500 hover:text-black dark:text-white/55 dark:hover:text-white"
                  }`}
                >
                  {filter.label}
                </span>
                <sup className="ml-1 text-[10px] text-gray-400 dark:text-white/40">
                  {countFor(filter.id)}
                </sup>
                {isActive && (
                  <motion.span
                    layoutId="cert-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-amber-400"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <LayoutGroup>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((cert, i) => (
                <CertCard key={cert.id} cert={cert} featured={i === 0} reduce={reduce} />
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