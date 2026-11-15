"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, BadgeCheck, Check } from "lucide-react";
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

// Small fixed tilts, so each stamp looks hand-pressed (the same on every load)
const TILTS = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 1.8];

const pad = (n) => String(n).padStart(2, "0");
const hasUrl = (url) => Boolean(url) && url !== "#";
const skillsOf = (cert) =>
  String(cert.skills ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

function Stamp({ cert, serial, tilt, selected, onSelect }) {
  const accent = ACCENTS[cert.iconBg] ?? DEFAULT_ACCENT;
  const Icon = certificationIcons[cert.icon] ?? FaCode;
  const IssuerIcon = certificationIcons[cert.issuerIcon] ?? FaUniversity;

  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        aria-label={`${cert.title}, ${cert.issuer}, ${cert.date}`}
        onClick={onSelect}
        onFocus={onSelect}
        onPointerEnter={(e) => e.pointerType === "mouse" && onSelect()}
        className="group relative block w-full rounded-2xl p-3 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-400 motion-reduce:transition-none"
        style={{
          transform: selected ? "rotate(0deg) scale(1.03)" : `rotate(${tilt}deg)`,
        }}
      >
        {/* The stamp itself */}
        <span
          className="relative block overflow-hidden rounded-2xl border-2 bg-white p-4 transition-all duration-300 group-hover:shadow-xl dark:bg-darkHover sm:p-5"
          style={{
            borderStyle: selected ? "solid" : "dashed",
            borderColor: accent,
            boxShadow: selected ? `0 18px 40px -16px ${accent}` : undefined,
            background: `linear-gradient(160deg, ${accent}${selected ? "26" : "12"}, transparent 65%)`,
          }}
        >
          {/* Serial and date (a postmark) */}
          <span className="flex items-start justify-between gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-full text-xl"
              style={{ backgroundColor: `${accent}26`, color: accent }}
            >
              <Icon />
            </span>
            <span className="text-right font-mono text-[10px] uppercase leading-4 tracking-[0.15em] text-gray-500 dark:text-white/50">
              No. {pad(serial)}
              <br />
              {cert.date}
            </span>
          </span>

          <span className="mt-4 block break-words font-Ovo text-lg leading-6 sm:text-xl sm:leading-7">
            {cert.title}
          </span>

          <span className="mt-2 flex items-center gap-2 text-xs leading-5 text-gray-500 dark:text-white/55">
            <IssuerIcon className="shrink-0" />
            <span className="min-w-0 break-words">{cert.issuer}</span>
          </span>

          {/* Ink mark */}
          <span className="mt-4 inline-block -rotate-3 rounded border-2 border-emerald-500 px-2 py-0.5 font-mono text-[10px] font-bold uppercase leading-4 tracking-widest text-emerald-600 dark:text-emerald-400">
            Verified
          </span>
        </span>
      </button>
    </li>
  );
}

function VisaPage({ cert, serial }) {
  const accent = ACCENTS[cert.iconBg] ?? DEFAULT_ACCENT;
  const Icon = certificationIcons[cert.icon] ?? FaCode;
  const IssuerIcon = certificationIcons[cert.issuerIcon] ?? FaUniversity;
  const skills = skillsOf(cert);
  const linked = hasUrl(cert.certificateUrl);

  return (
    <div
      id="visa-page"
      className="cert-fade relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl dark:border-white/15 dark:bg-darkHover"
    >
      {/* Colour wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(90% 55% at 0% 0%, ${accent}2b, transparent 70%)` }}
      />

      {/* Top bar */}
      <div className="relative flex items-center justify-between gap-3 border-b border-black/10 bg-black/[0.03] px-5 py-3 dark:border-white/15 dark:bg-white/5 sm:px-7">
        <p className="min-w-0 truncate font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-600 dark:text-white/60">
          Visa page · No. {pad(serial)}
        </p>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] font-bold uppercase leading-5 tracking-[0.15em] text-emerald-600 dark:text-emerald-400">
          <BadgeCheck className="h-4 w-4" />
          Verified
        </span>
      </div>

      <div className="relative p-5 sm:p-7">
        <span
          className="grid h-14 w-14 place-items-center rounded-2xl text-2xl"
          style={{ backgroundColor: `${accent}26`, color: accent }}
        >
          <Icon />
        </span>

        <h2 className="mt-5 break-words font-Ovo text-3xl leading-[1.1] sm:text-4xl">
          {cert.title}
        </h2>

        <dl className="mt-6 grid grid-cols-2 gap-5 border-y border-black/10 py-5 dark:border-white/15">
          <div className="min-w-0">
            <dt className="font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
              Issued by
            </dt>
            <dd className="mt-1 flex items-center gap-2 break-words text-base font-semibold leading-6">
              <IssuerIcon className="shrink-0" />
              {cert.issuer}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
              Date
            </dt>
            <dd className="mt-1 break-words text-base font-semibold leading-6">{cert.date}</dd>
          </div>
        </dl>

        {skills.length > 0 && (
          <>
            <h3 className="mt-6 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Skills covered · {pad(skills.length)}
            </h3>
            <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {skills.map((skill) => (
                <li key={skill} className="flex items-start gap-2.5 text-sm leading-6">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-400 text-black">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="min-w-0 break-words">{skill}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-8">
          {linked ? (
            <a
              href={cert.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-amber-400 px-7 py-3 text-base font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(202,138,4,0.8)] active:scale-95 sm:w-auto"
            >
              View certificate
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ) : (
            <p className="inline-block rounded-full border border-dashed border-black/20 px-5 py-2.5 text-sm text-gray-500 dark:border-white/25 dark:text-white/50">
              Certificate unavailable
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CertificationsExplorer() {
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(certificationData[0]?.id ?? null);
  const pageRef = useRef(null);

  const visible =
    filter === "all" ? certificationData : certificationData.filter((c) => c.category === filter);

  const countFor = (id) =>
    id === "all" ? certificationData.length : certificationData.filter((c) => c.category === id).length;

  // Keep the selection inside the current filter
  const selected = visible.find((c) => c.id === selectedId) ?? visible[0] ?? null;

  const choose = (id) => {
    setSelectedId(id);
    // On phones the visa page is above the stamps, so bring it into view
    if (window.matchMedia("(max-width: 1023px)").matches) {
      window.setTimeout(() => {
        const r = pageRef.current?.getBoundingClientRect();
        if (r && (r.top < 70 || r.top > window.innerHeight * 0.4)) {
          window.scrollTo({ top: window.scrollY + r.top - 90, behavior: "smooth" });
        }
      }, 60);
    }
  };

  const selectFilter = (id) => {
    setFilter(id);
    const first = (id === "all" ? certificationData : certificationData.filter((c) => c.category === id))[0];
    if (first) setSelectedId(first.id);
  };

  const issuers = new Set(certificationData.map((c) => c.issuer)).size;

  const tab = (active) =>
    `min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium leading-5 transition-all duration-300 active:scale-95 lg:min-h-0 lg:py-1.5 ${
      active
        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
        : "border-black/15 text-gray-700 hover:border-amber-400 dark:border-white/20 dark:text-white/80"
    }`;

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes cert-fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
            .cert-fade { animation: cert-fade 0.4s ease-out both; }
            @media (prefers-reduced-motion: reduce) { .cert-fade { animation: none; } }
          `,
        }}
      />

      {/* ===== Stats ===== */}
      <dl className="grid grid-cols-3 divide-x divide-black/10 rounded-2xl border border-black/10 dark:divide-white/15 dark:border-white/15">
        {[
          { label: "Credentials", value: pad(certificationData.length) },
          { label: "Issuers", value: pad(issuers) },
          { label: "Categories", value: pad(Math.max(certificationFilters.length - 1, 1)) },
        ].map((s) => (
          <div key={s.label} className="px-2 py-4 text-center sm:px-6 sm:py-5">
            <dd className="font-mono text-3xl font-semibold leading-8 tabular-nums sm:text-5xl sm:leading-[3.25rem]">
              {s.value}
            </dd>
            <dt className="mt-1 font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
              {s.label}
            </dt>
          </div>
        ))}
      </dl>

      {/* ===== Filters ===== */}
      <div
        role="group"
        aria-label="Filter certifications"
        className="-mx-1 mt-8 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {certificationFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => selectFilter(f.id)}
            className={tab(filter === f.id)}
          >
            {f.label}
            <span className="ml-2 font-mono text-[11px] opacity-60">{pad(countFor(f.id))}</span>
          </button>
        ))}
      </div>

      {/* ===== Visa page + stamps ===== */}
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div ref={pageRef} className="min-w-0 lg:sticky lg:top-28 lg:col-span-5">
          {selected && (
            <VisaPage
              key={selected.id}
              cert={selected}
              serial={certificationData.indexOf(selected) + 1}
            />
          )}
        </div>

        <div className="min-w-0 lg:col-span-7">
          <p className="mb-2 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
            Stamps · {pad(visible.length)}
          </p>
          <ul key={filter} className="cert-fade grid grid-cols-1 gap-1 sm:grid-cols-2">
            {visible.map((cert) => (
              <Stamp
                key={cert.id}
                cert={cert}
                serial={certificationData.indexOf(cert) + 1}
                tilt={TILTS[certificationData.indexOf(cert) % TILTS.length]}
                selected={selected?.id === cert.id}
                onSelect={() => choose(cert.id)}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}