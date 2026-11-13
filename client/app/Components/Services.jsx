"use client"
import { serviceData } from '@/assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

// Fallback backgrounds, used until you add real images to serviceData
const fallbackGradients = [
  'from-sky-700 via-slate-800 to-slate-950',
  'from-orange-600 via-slate-800 to-slate-950',
  'from-emerald-700 via-slate-800 to-slate-950',
  'from-indigo-600 via-slate-800 to-slate-950',
  'from-cyan-700 via-slate-800 to-slate-950',
  'from-rose-700 via-slate-800 to-slate-950',
]

const Services = ({ preview = false }) => {
  const [active, setActive] = useState(0)

  return (
    <section id="services" className="w-full px-6 sm:px-10 lg:px-[12%] py-10">
      {/* Header */}
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <h4 className="text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold text-slate-500 dark:text-slate-400 mb-2">
            What I offer
          </h4>
          <h2 className="text-3xl sm:text-5xl font-Ovo leading-tight">
            My Services
          </h2>
          <p className="mt-4 max-w-xl text-sm sm:text-base text-gray-600 dark:text-white/70">
            Mechanical engineering services including CAD modeling, FEA analysis,
            and programming.
          </p>
        </div>

        {preview && (
          <Link
            href="/services"
            className="group hidden sm:inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap"
          >
            <span className="relative">
              Explore services
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
            </span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </div>

      {/* Panels: row of expanding strips on desktop, vertical accordion on smaller screens */}
      <div className="flex flex-col lg:flex-row gap-3 lg:h-[540px]">
        {serviceData.map((service, index) => {
          const { title, description, link, image, tools, icon } = service
          const isActive = active === index

          return (
            <Link
              key={link ?? index}
              href={`/services/${link}`}
              aria-label={title}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(index)}
              onFocus={() => setActive(index)}
              onClick={(e) => {
                // On touch: first tap expands, second tap opens the page
                if (!isActive) {
                  e.preventDefault()
                  setActive(index)
                }
              }}
              className={`group relative block min-w-0 overflow-hidden rounded-3xl
                border border-black/5 dark:border-white/10 shadow-lg
                transition-all duration-700 ease-in-out motion-reduce:transition-none
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400
                ${isActive ? 'h-[22rem] lg:h-auto lg:flex-[6]' : 'h-20 lg:h-auto lg:flex-1'}`}
            >
              {/* Background */}
              {image ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className={`object-cover transition-transform duration-1000 ${isActive ? 'scale-100' : 'scale-110'}`}
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradients[index % fallbackGradients.length]}`}>
                  {icon && (
                    <Image
                      src={icon}
                      alt=""
                      className={`absolute right-8 top-1/2 -translate-y-1/2 w-24 lg:w-32 opacity-20 transition-opacity duration-500 ${isActive ? 'opacity-30' : 'opacity-0'}`}
                    />
                  )}
                </div>
              )}

              {/* Dark overlay for readable text */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive
                    ? 'bg-gradient-to-t from-black/85 via-black/20 to-transparent'
                    : 'bg-slate-950/60'
                }`}
              />

              {/* Number badge */}
              <span
                className={`absolute top-5 left-4 lg:top-4 z-10 grid place-items-center w-10 h-10 rounded-full
                  text-xs font-bold backdrop-blur-sm transition-colors duration-500
                  ${isActive ? 'bg-amber-400 text-black' : 'bg-white/20 text-white'}`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Collapsed label (rotated on desktop) */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 flex items-center lg:items-start lg:justify-center
                  pl-[4.5rem] pr-4 lg:px-0 lg:pt-24 transition-opacity duration-300
                  ${isActive ? 'opacity-0' : 'opacity-100 delay-300'}`}
              >
                <span className="text-white font-medium whitespace-nowrap lg:[writing-mode:vertical-rl] lg:rotate-180">
                  {title}
                </span>
              </div>

              {/* Expanded content */}
              <div
                className={`absolute inset-x-0 bottom-0 z-10 p-6 lg:p-7 transition-all duration-500
                  ${isActive ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-4 pointer-events-none'}`}
              >
                <div className="h-1 w-12 rounded-full bg-amber-400 mb-4" />
                <h3 className="text-2xl lg:text-3xl font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/80 line-clamp-2">
                  {description}
                </p>

                {tools?.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {tools.slice(0, 4).map((tool) => (
                      <li
                        key={tool}
                        className="rounded-full border border-white/25 bg-white/10 px-3 py-0.5 text-xs text-white backdrop-blur-sm"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mt-4 text-sm text-white/70">View service</p>
              </div>

              {/* Arrow button */}
              <span
                className={`absolute bottom-6 right-6 lg:bottom-7 lg:right-7 z-10 grid place-items-center w-11 h-11 rounded-full
                  bg-amber-400 text-black transition-all duration-500 group-hover:rotate-12
                  ${isActive ? 'opacity-100 scale-100 delay-300' : 'opacity-0 scale-75 pointer-events-none'}`}
              >
                <ArrowUpRight className="w-5 h-5" />
              </span>
            </Link>
          )
        })}
      </div>

      {/* Mobile version of "Explore services" */}
      {preview && (
        <Link
          href="/services"
          className="sm:hidden mt-6 inline-flex items-center gap-1.5 text-sm font-medium"
        >
          Explore services <ArrowUpRight className="w-4 h-4" />
        </Link>
      )}
    </section>
  )
}

export default Services