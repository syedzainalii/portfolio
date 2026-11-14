"use client";

import Image from 'next/image'
import React from 'react'
import { assets, contactDetails } from '@/assets/assets'
import { useTheme } from './ThemeProvider'

const Footer = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className='mt-4'>
      <div className="w-full px-5 sm:px-8 lg:px-10">
      {/* Logo */}
      <div className='mb-4 mt-4'>
        <Image src={isDarkMode ? assets.logo_dark : assets.logo} alt='' className='w-36' sizes="144px" loading="lazy"/>
      </div>
      
      {/* Contact Details - Responsive Layout */}
      <div className='flex flex-col gap-4 text-sm mb-4 mt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 lg:flex-nowrap'>
        <div className='flex min-w-0 items-center gap-2'>
          <Image src={isDarkMode ? assets.mail_icon_dark : assets.mail_icon} alt='' className='w-5 flex-shrink-0' sizes="20px" loading="lazy"/>
          <span className='min-w-0 break-all'>{contactDetails.email}</span>
        </div>
        <div className='flex min-w-0 items-center gap-2'>
          <Image src={isDarkMode ? assets.phone_dark : assets.phone} alt='' className='w-5 flex-shrink-0' sizes="20px" loading="lazy"/>
          <span className='min-w-0 break-words'>{contactDetails.phone}</span>
        </div>
        <div className='flex min-w-0 items-center gap-2'>
          <Image src={isDarkMode ? assets.location_dark : assets.location} alt='' className='w-5 flex-shrink-0' sizes="20px" loading="lazy"/>
          <span className='min-w-0 break-words'>{contactDetails.location}</span>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center sm:flex items-center justify-between border-t border-gray-400
        mt-6 py-6">
        <p className='text-sm'>© 2025 Syed Zain Ali. All rights reserved</p>
        <ul className='flex items-center gap-2 justify-center mt-4 sm:mt-0'> 
          <li>
            <a target='_blank' href={contactDetails.linkedin} className="grid h-11 w-11 place-items-center lg:h-auto lg:w-auto">
              <Image src={isDarkMode ? assets.linkendin_logo_dark : assets.linkendin_logo} alt="LinkedIn" className="w-10" sizes="40px" loading="lazy" />
            </a> 
          </li>
          <li>
            <a target='_blank' href={contactDetails.github} className="grid h-11 w-11 place-items-center lg:h-auto lg:w-auto">
              <Image src={isDarkMode ? assets.github_logo_dark : assets.github_logo} alt="GitHub" className="w-8" sizes="32px" loading="lazy" />
            </a>
          </li>
        </ul>
      </div>
      </div>
    </div>
  )
}

export default Footer