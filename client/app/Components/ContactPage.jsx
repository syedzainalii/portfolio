"use client";

import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { contactContent, contactDetails } from "@/assets/assets";
import useContactSubmission from "./useContactSubmission";

const contactItems = [
  { icon: Mail, label: "Email", value: contactDetails.email, href: `mailto:${contactDetails.email}` },
  { icon: Phone, label: "Phone", value: contactDetails.phone, href: `tel:${contactDetails.phone.replace(/\s/g, "")}` },
  { icon: MapPin, label: "Location", value: contactDetails.location },
];

export default function ContactPage() {
  const { onSubmit, result } = useContactSubmission();

  return (
    <article className="site-container pt-24 pb-16">
      <header className="mb-12 border-b border-black/10 pb-8 dark:border-white/15">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400">
          Contact / Start a conversation
        </p>
        <h1 className="font-Ovo text-3xl sm:text-6xl">{contactContent.title}</h1>
        <p className="mt-5 max-w-2xl leading-7 text-gray-600 dark:text-white/65">
          {contactContent.description}
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <aside>
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-gray-500">
            Contact details
          </h2>
          <ul className="mt-4 divide-y divide-black/10 border-y border-black/10 dark:divide-white/15 dark:border-white/15">
            {contactItems.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="py-5">
                {href ? (
                  <a href={href} className="group flex items-center gap-4">
                    <Icon className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="min-w-0">
                      <span className="block text-xs text-gray-500">{label}</span>
                      <span className="mt-1 block break-all font-medium group-hover:underline">
                        {value}
                      </span>
                    </span>
                    <ArrowUpRight className="ml-auto h-4 w-4 shrink-0" />
                  </a>
                ) : (
                  <div className="flex items-center gap-4">
                    <Icon className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="min-w-0">
                      <span className="block text-xs text-gray-500">{label}</span>
                      <span className="mt-1 block font-medium">{value}</span>
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-5 text-sm">
            <a href={contactDetails.linkedin} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4 lg:min-h-0">
              LinkedIn
            </a>
            <a href={contactDetails.github} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4 lg:min-h-0">
              GitHub
            </a>
          </div>
        </aside>

        <form onSubmit={onSubmit} className="mx-auto w-full max-w-3xl space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              Name
              <input
                type="text"
                name="name"
                placeholder={contactContent.namePlaceholder}
                required
                className="mt-2 w-full border border-black/15 bg-transparent px-4 py-3 outline-none transition focus:border-amber-500 dark:border-white/20"
              />
            </label>
            <label className="block text-sm">
              Email
              <input
                type="email"
                name="email"
                placeholder={contactContent.emailPlaceholder}
                required
                className="mt-2 w-full border border-black/15 bg-transparent px-4 py-3 outline-none transition focus:border-amber-500 dark:border-white/20"
              />
            </label>
          </div>
          <label className="block text-sm">
            Message
            <textarea
              name="message"
              rows="7"
              placeholder={contactContent.messagePlaceholder}
              required
              className="mt-2 w-full resize-y border border-black/15 bg-transparent px-4 py-3 outline-none transition focus:border-amber-500 dark:border-white/20"
            />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="inline-flex items-center gap-3 bg-slate-950 px-6 py-3 text-white transition hover:bg-amber-500 hover:text-black dark:bg-white dark:text-black dark:hover:bg-amber-400"
            >
              Send Message <ArrowUpRight className="h-4 w-4" />
            </button>
            <p role="status" aria-live="polite" className="text-sm text-gray-600 dark:text-white/65">
              {result}
            </p>
          </div>
        </form>
      </div>
    </article>
  );
}
