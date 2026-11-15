"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Send,
} from "lucide-react";
import { contactContent, serviceData } from "@/assets/assets";
import useContactSubmission from "./useContactSubmission";

// Your contact details (same as the footer). Edit them here if they change.
const EMAIL = "syedzainali4372@outlook.com";
const PHONE_DISPLAY = "+92 300 2678500";
const PHONE_LINK = "+923002678500";
const LOCATION = "Karachi, Pakistan";

const pad = (n) => String(n).padStart(2, "0");
const STEPS = 5; // name, email, topic, message, review
const REVIEW = 4;

const QUESTIONS = [
  { title: "What should I call you?", hint: "Your name" },
  { title: "Where can I reach you?", hint: "Your email" },
  { title: "What do you need help with?", hint: "Pick one (optional)" },
  { title: "Tell me about it.", hint: "Your message" },
  { title: "Ready to send?", hint: "Review" },
];

/* ---------- One contact row ---------- */
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

  const box =
    "group flex min-w-0 flex-1 items-center gap-4 rounded-2xl border border-black/10 bg-white/60 p-3 dark:border-white/15 dark:bg-white/5";

  return (
    <li className="flex items-center gap-2">
      {href ? (
        <a
          href={href}
          className={`${box} transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/70`}
        >
          {body}
        </a>
      ) : (
        <div className={box}>{body}</div>
      )}
      {action}
    </li>
  );
}

export default function ContactWizard() {
  const { onSubmit, result } = useContactSubmission();

  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [data, setData] = useState({ name: "", email: "", service: "", message: "" });
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const inputRef = useRef(null);
  const interacted = useRef(false); // only focus fields after the visitor has started

  const services = [...serviceData.map((s) => s.title), "Something else"];
  const set = (key, value) => {
    setData((d) => ({ ...d, [key]: value }));
    if (error) setError("");
  };

  // The message that is actually sent (the chosen topic goes at the top)
  const finalMessage = data.service
    ? `Service: ${data.service}\n\n${data.message.trim()}`
    : data.message.trim();

  useEffect(() => {
    if (interacted.current) inputRef.current?.focus();
  }, [step, sent]);

  const validate = (s) => {
    if (s === 0 && data.name.trim().length < 2) return "Please tell me your name.";
    if (s === 1 && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim()))
      return "That email doesn't look right. Could you check it?";
    if (s === 3 && data.message.trim().length < 5) return "A short message is needed, even one line.";
    return "";
  };

  const goTo = (s) => {
    interacted.current = true;
    setError("");
    setStep(s);
  };

  const next = () => {
    const problem = validate(step);
    if (problem) {
      setError(problem);
      inputRef.current?.focus();
      return;
    }
    goTo(Math.min(step + 1, REVIEW));
  };

  const back = () => goTo(Math.max(step - 1, 0));

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available */
    }
  };

  const handleSubmit = (e) => {
    // Pressing Enter on an earlier step moves forward instead of sending
    if (step !== REVIEW) {
      e.preventDefault();
      next();
      return;
    }
    // Check every step one last time
    for (const s of [0, 1, 3]) {
      const problem = validate(s);
      if (problem) {
        e.preventDefault();
        setError(problem);
        setStep(s);
        return;
      }
    }
    setSent(true);
    return onSubmit(e);
  };

  const restart = () => {
    setData({ name: "", email: "", service: "", message: "" });
    setError("");
    setSent(false);
    setStep(0);
  };

  const ok = /success|sent|submitted|thank/i.test(result || "");
  const q = QUESTIONS[step];

  const fieldClass =
    "mt-6 w-full border-b-2 border-black/20 bg-transparent pb-3 text-2xl leading-9 outline-none transition-colors duration-300 placeholder:text-gray-400 focus:border-amber-400 dark:border-white/25 dark:placeholder:text-white/30 sm:text-3xl sm:leading-10";

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes contact-step { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: none; } }
            .contact-step { animation: contact-step 0.35s ease-out both; }
            @media (prefers-reduced-motion: reduce) { .contact-step { animation: none; } }
          `,
        }}
      />

      {/* ===== The conversation ===== */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="order-1 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-xl dark:border-white/15 dark:bg-darkHover lg:order-2 lg:col-span-7"
      >
        {/* The values that are sent (your hook reads these by name) */}
        <input type="hidden" name="name" value={data.name.trim()} />
        <input type="hidden" name="email" value={data.email.trim()} />
        <input type="hidden" name="message" value={finalMessage} />

        {/* Progress */}
        <div className="border-b border-black/10 bg-black/[0.03] px-5 py-4 dark:border-white/15 dark:bg-white/5 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-gray-600 dark:text-white/60">
              {sent ? "Dispatched" : `Station ${pad(step + 1)} / ${pad(STEPS)}`}
            </p>
            <p className="truncate font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
              {sent ? "Done" : q.hint}
            </p>
          </div>
          <div className="mt-3 flex gap-1.5" aria-hidden>
            {Array.from({ length: STEPS }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                  sent || i <= step ? "bg-amber-400" : "bg-black/10 dark:bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step body */}
        <div className="min-h-[22rem] p-5 sm:min-h-[24rem] sm:p-8">
          {sent ? (
            <div key="sent" className="contact-step" role="status" aria-live="polite">
              <span
                className={`grid h-14 w-14 place-items-center rounded-2xl ${
                  ok ? "bg-emerald-500 text-white" : "bg-amber-400 text-black"
                }`}
              >
                {ok ? <Check className="h-7 w-7" strokeWidth={3} /> : <Send className="h-6 w-6" />}
              </span>
              <h2 className="mt-6 font-Ovo text-3xl leading-tight sm:text-4xl">
                {ok ? "Message sent." : "Dispatch status"}
              </h2>
              <p className="mt-3 text-base leading-7 text-gray-600 dark:text-white/70">
                {result || "Sending your message…"}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-base font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                >
                  Start a new message
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    goTo(REVIEW);
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 px-7 py-3 text-base font-medium transition-colors duration-300 hover:border-amber-400 dark:border-white/20"
                >
                  Back to my answers
                </button>
              </div>
            </div>
          ) : (
            <div key={step} className="contact-step">
              <h2 className="font-Ovo text-3xl leading-tight sm:text-5xl sm:leading-[1.1]">
                {q.title}
              </h2>

              {step === 0 && (
                <input
                  ref={inputRef}
                  type="text"
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), next())}
                  placeholder={contactContent.namePlaceholder}
                  aria-label="Your name"
                  className={fieldClass}
                />
              )}

              {step === 1 && (
                <input
                  ref={inputRef}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), next())}
                  placeholder={contactContent.emailPlaceholder}
                  aria-label="Your email"
                  className={fieldClass}
                />
              )}

              {step === 2 && (
                <div role="group" aria-label="Choose a service" className="mt-7 flex flex-wrap gap-2.5">
                  {services.map((s) => {
                    const on = data.service === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={on}
                        onClick={() => set("service", on ? "" : s)}
                        className={`min-h-11 rounded-full border px-5 py-2.5 text-base font-medium leading-5 transition-all duration-300 active:scale-95 ${
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
              )}

              {step === 3 && (
                <textarea
                  ref={inputRef}
                  rows={5}
                  value={data.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder={contactContent.messagePlaceholder}
                  aria-label="Your message"
                  className={`${fieldClass} resize-none break-words`}
                />
              )}

              {step === REVIEW && (
                <dl className="mt-6 divide-y divide-black/10 border-y border-black/10 dark:divide-white/15 dark:border-white/15">
                  {[
                    { label: "Name", value: data.name, at: 0 },
                    { label: "Email", value: data.email, at: 1 },
                    { label: "Topic", value: data.service || "Not specified", at: 2 },
                    { label: "Message", value: data.message, at: 3 },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4 py-4">
                      <div className="min-w-0">
                        <dt className="font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-gray-500 dark:text-white/45">
                          {row.label}
                        </dt>
                        <dd className="mt-1 whitespace-pre-wrap break-words text-base leading-6">
                          {row.value}
                        </dd>
                      </div>
                      <button
                        type="button"
                        onClick={() => goTo(row.at)}
                        aria-label={`Edit ${row.label}`}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black/15 transition-all duration-300 hover:border-amber-400 hover:bg-amber-400 hover:text-black dark:border-white/20"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </dl>
              )}

              <p
                role="alert"
                className="mt-3 min-h-6 text-sm leading-6 text-red-600 dark:text-red-400"
              >
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        {!sent && (
          <div className="flex items-center justify-between gap-3 border-t border-black/10 px-5 py-4 dark:border-white/15 sm:px-8">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-opacity duration-300 hover:text-amber-600 disabled:pointer-events-none disabled:opacity-0 dark:hover:text-amber-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {step === REVIEW ? (
              <button
                type="submit"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-amber-400 px-8 py-3 text-base font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(202,138,4,0.8)] active:scale-95"
              >
                Send message
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {step === 2 && !data.service && (
                  <button
                    type="button"
                    onClick={next}
                    className="min-h-11 rounded-full px-4 text-sm font-medium text-gray-500 transition-colors duration-300 hover:text-black dark:text-white/55 dark:hover:text-white"
                  >
                    Skip
                  </button>
                )}
                <button
                  type="button"
                  onClick={next}
                  className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-black px-7 py-3 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400 hover:text-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-amber-400"
                >
                  Next
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>
        )}
      </form>

      {/* ===== Direct channels ===== */}
      <div className="order-2 min-w-0 lg:order-1 lg:sticky lg:top-28 lg:col-span-5">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-darkHover sm:p-8 lg:shadow-lg">
          <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] text-amber-600 dark:text-amber-400">
            Direct line
          </p>
          <p className="mt-3 font-Ovo text-2xl leading-9 sm:text-3xl sm:leading-10">
            Prefer to skip the questions?
          </p>

          <ul className="mt-7 space-y-3">
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
      </div>
    </div>
  );
}