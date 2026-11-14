"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Cog, Copy, Mail, MapPin, Phone, Send } from "lucide-react";
import { contactContent, serviceData } from "@/assets/assets";
import useContactSubmission from "./useContactSubmission";

// Your contact details (same as the footer). Edit them here if they change.
const EMAIL = "syedzainali4372@outlook.com";
const PHONE_DISPLAY = "+92 300 2678500";
const PHONE_LINK = "+923002678500";
const LOCATION = "Karachi, Pakistan";

/* ---------- Round "full page" stamp (landing page only) ---------- */
function OpenPageStamp() {
  return (
    <Link
      href="/contact"
      aria-label="Open the full contact page"
      className="group relative grid h-24 w-24 shrink-0 place-items-center rounded-full border border-black/10 bg-white/70 transition-shadow duration-300 hover:shadow-[0_12px_30px_-10px_rgba(202,138,4,0.7)] dark:border-white/15 dark:bg-white/5"
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className="absolute inset-0 h-full w-full animate-spin text-gray-700 [animation-duration:18s] motion-reduce:animate-none dark:text-white"
      >
        <defs>
          <path id="stamp-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text
          fill="currentColor"
          fontSize="8.5"
          fontWeight="600"
          fontFamily="ui-monospace, monospace"
        >
          <textPath href="#stamp-circle" textLength="236" lengthAdjust="spacing">
            FULL PAGE • FULL PAGE • FULL PAGE •
          </textPath>
        </text>
      </svg>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-amber-400 text-black transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110">
        <ArrowUpRight className="h-5 w-5" />
      </span>
    </Link>
  );
}

/* ---------- Form field with a numbered label and an underline that draws on focus ---------- */
function Field({ n, label, children }) {
  return (
    <label className="group relative block border-b border-black/15 pb-2 pt-1 dark:border-white/20">
      <span className="flex items-center gap-2 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
        <span className="text-amber-600 dark:text-amber-400">{n}</span>
        {label}
      </span>
      {children}
      <span
        aria-hidden
        className="absolute -bottom-px left-0 h-0.5 w-full origin-left scale-x-0 bg-amber-400 transition-transform duration-300 group-focus-within:scale-x-100"
      />
    </label>
  );
}

const inputClass =
  "mt-2 w-full bg-transparent text-lg leading-7 outline-none placeholder:text-gray-400 dark:placeholder:text-white/30";

/* ---------- One contact row on the left ---------- */
function InfoRow({ icon: Icon, label, value, href, action }) {
  const body = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-600 transition-colors duration-300 group-hover:bg-amber-400 group-hover:text-black dark:text-amber-400">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
          {label}
        </span>
        <span className="block break-all text-base font-medium leading-6 sm:break-words">{value}</span>
      </span>
    </>
  );

  return (
    <li className="flex items-center gap-2">
      {href ? (
        <a
          href={href}
          className="group flex min-w-0 flex-1 items-center gap-4 rounded-2xl border border-black/10 bg-white/60 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/70 dark:border-white/15 dark:bg-white/5"
        >
          {body}
        </a>
      ) : (
        <div className="group flex min-w-0 flex-1 items-center gap-4 rounded-2xl border border-black/10 bg-white/60 p-3 dark:border-white/15 dark:bg-white/5">
          {body}
        </div>
      )}
      {action}
    </li>
  );
}

const Contact = ({ preview = false }) => {
  const { onSubmit, result } = useContactSubmission();
  const reduce = useReducedMotion();

  const [service, setService] = useState(null);
  const [copied, setCopied] = useState(false);
  const [orderNo, setOrderNo] = useState("00000000");

  // Today's date as the work order number (set after mount, so server and client match)
  useEffect(() => {
    setOrderNo(new Date().toISOString().slice(0, 10).replaceAll("-", ""));
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available */
    }
  };

  // Adds the chosen service to the top of the message, then uses your existing submit logic
  const handleSubmit = (e) => {
    const form = e.currentTarget;
    const field = form.elements?.message;
    if (service && field && !field.value.startsWith("Service:")) {
      field.value = `Service: ${service}\n\n${field.value}`;
    }
    return onSubmit(e);
  };

  const services = [...serviceData.map((s) => s.title), "Something else"];

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  });

  return (
    <section id="contact" className="w-full py-14 sm:py-20 lg:py-24">
      <div className="site-container">
        {/* Header row: title on the left, stamp on the right */}
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 sm:text-sm">
              {contactContent.eyebrow}
            </h4>
            <h2 className="font-Ovo text-3xl sm:text-5xl">{contactContent.title}</h2>
          </div>

          {preview && <OpenPageStamp />}
        </div>

        <div className="mt-10 grid items-start gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-10">
          {/* ===== Left: ways to reach me ===== */}
          <motion.div {...reveal()} className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-lg dark:border-white/15 dark:bg-darkHover sm:p-8">
              {/* Slow turning cog */}
              <Cog
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 animate-spin text-amber-400/15 [animation-duration:60s] motion-reduce:animate-none"
                strokeWidth={1}
              />

              <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
                Direct line
              </p>
              <p className="relative mt-3 font-Ovo text-2xl leading-9 sm:text-3xl sm:leading-10">
                Tell me about your project, internship or idea.
              </p>

              <ul className="relative mt-8 space-y-3">
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={EMAIL}
                  href={`mailto:${EMAIL}`}
                  action={
                    <button
                      type="button"
                      onClick={copyEmail}
                      aria-label="Copy email address"
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-black/10 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400 hover:text-black active:scale-95 dark:border-white/15"
                    >
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </button>
                  }
                />
                <InfoRow icon={Phone} label="Phone" value={PHONE_DISPLAY} href={`tel:${PHONE_LINK}`} />
                <InfoRow icon={MapPin} label="Based in" value={LOCATION} />
              </ul>

              <p className="sr-only" aria-live="polite">
                {copied ? "Email address copied" : ""}
              </p>
            </div>
          </motion.div>

          {/* ===== Right: the work order ===== */}
          <motion.form
            {...reveal(0.08)}
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl dark:border-white/15 dark:bg-darkHover lg:col-span-7"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-black/[0.03] px-5 py-3 dark:border-white/15 dark:bg-white/5 sm:px-8">
              <p className="min-w-0 truncate font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-600 dark:text-white/60">
                Work order · WO-{orderNo} · Rev A
              </p>
              <p className="flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase leading-5 tracking-[0.15em] text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />
                Open
              </p>
            </div>

            <div className="space-y-7 p-5 sm:p-8">
              <div className="grid gap-7 sm:grid-cols-2">
                <Field n="01" label="Your name">
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder={contactContent.namePlaceholder}
                    className={inputClass}
                  />
                </Field>
                <Field n="02" label="Your email">
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder={contactContent.emailPlaceholder}
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* Service chips */}
              <div>
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-500 dark:text-white/45">
                  <span className="text-amber-600 dark:text-amber-400">03</span>
                  What do you need?
                  <span className="normal-case tracking-normal opacity-60">(optional)</span>
                </p>
                <div role="group" aria-label="Choose a service" className="mt-3 flex flex-wrap gap-2">
                  {services.map((s) => {
                    const on = service === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setService(on ? null : s)}
                        className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium leading-5 transition-all duration-300 active:scale-95 lg:min-h-0 lg:py-1.5 ${
                          on
                            ? "border-amber-400 bg-amber-400 text-black shadow-[0_6px_18px_-8px_rgba(202,138,4,0.9)]"
                            : "border-black/15 text-gray-700 hover:border-amber-400 dark:border-white/20 dark:text-white/80"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Field n="04" label="Your brief">
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder={contactContent.messagePlaceholder}
                  className={`${inputClass} resize-none break-words`}
                />
              </Field>

              {/* Submit row */}
              <div className="flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                <p
                  role="status"
                  aria-live="polite"
                  className="min-h-6 text-sm leading-6 text-gray-600 dark:text-white/65"
                >
                  {result}
                </p>

                <button
                  type="submit"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-amber-400 px-8 py-3.5 text-base font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(202,138,4,0.8)] active:scale-95"
                >
                  Submit work order
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;