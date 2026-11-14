"use client";

import { useState } from "react";
import {
  FaAws,
  FaChartLine,
  FaCode,
  FaExternalLinkAlt,
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

export default function CertificationPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filteredCertifications =
    activeFilter === "all"
      ? certificationData
      : certificationData.filter((certification) => certification.category === activeFilter);

  const handleViewCertificate = (certificateUrl, title) => {
    if (certificateUrl && certificateUrl !== "#") {
      window.open(certificateUrl, "_blank", "noopener,noreferrer");
    } else {
      alert(`Certificate URL for "${title}" is not available.`);
    }
  };

  return (
    <article className="site-container pt-24 pb-16">
      <header className="mb-10 border-b border-black/10 pb-8 dark:border-white/15">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
          Credentials / Verified Learning
        </p>
        <h1 className="font-Ovo text-4xl sm:text-6xl">Certifications</h1>
        <p className="mt-5 max-w-2xl leading-7 text-gray-600 dark:text-white/65">
          Professional certifications and credentials that validate my expertise and commitment to continuous learning.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        {certificationFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            aria-pressed={activeFilter === filter.id}
            className={`border px-4 py-2 text-sm transition-colors ${
              activeFilter === filter.id
                ? "border-amber-500 bg-amber-400 text-black"
                : "border-black/15 hover:border-amber-500 dark:border-white/20"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid gap-px border border-black/10 bg-black/10 md:grid-cols-2 dark:border-white/15 dark:bg-white/15">
        {filteredCertifications.map((certification) => {
          const Icon = certificationIcons[certification.icon];
          const IssuerIcon = certificationIcons[certification.issuerIcon];

          return (
            <section
              key={certification.id}
              className="flex flex-col bg-white p-6 dark:bg-darkTheme sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center bg-amber-400/15 text-amber-700 dark:text-amber-300">
                  <Icon className="text-xl" />
                </span>
                <span className="font-mono text-xs text-gray-500">
                  {certification.date}
                </span>
              </div>
              <h2 className="mt-6 font-Ovo text-xl sm:text-2xl">
                {certification.title}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
                <IssuerIcon />
                {certification.issuer}
              </p>
              <p className="mt-5 flex-1 text-sm leading-6 text-gray-600 dark:text-white/65">
                {certification.skills}
              </p>
              <button
                onClick={() => handleViewCertificate(certification.certificateUrl, certification.title)}
                className="mt-6 inline-flex items-center gap-2 border-t border-black/10 pt-4 text-left text-sm font-medium hover:text-amber-600 dark:border-white/15 dark:hover:text-amber-400"
              >
                <FaExternalLinkAlt className="text-xs" />
                View Certificate
              </button>
            </section>
          );
        })}
      </div>
    </article>
  );
}
