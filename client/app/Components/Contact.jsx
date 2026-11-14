"use client";

import { assets, contactContent } from '@/assets/assets'
import Image from 'next/image'
import SectionPageLink from './SectionPageLink'
import useContactSubmission from './useContactSubmission'

const Contact = ({ preview = false }) => {
  const { onSubmit, result } = useContactSubmission();

  return (
    <section
      id="contact"
      className='w-full py-14 sm:py-20 lg:py-24 bg-[url("/footer-bg-color.png")] bg-no-repeat bg-center bg-[length:90%_auto] dark:bg-none'
    > 
      <div className="site-container">
      <h4 className='mb-2 text-xl font-Ovo'>
        {contactContent.eyebrow}
      </h4>
      
      <h2 className='text-3xl sm:text-5xl font-Ovo'>
        {contactContent.title}
      </h2>
      
      <form onSubmit={onSubmit} className='mx-auto mt-12 max-w-3xl'>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
          <input 
            type='text' 
            placeholder={contactContent.namePlaceholder}
            required 
            className='min-h-11 w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90'
            name='name'
          />

          <input 
            type='email' 
            placeholder={contactContent.emailPlaceholder}
            required 
            className='min-h-11 w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90'
            name='email' 
          />
        </div>
        
        <textarea 
          rows='6' 
          placeholder={contactContent.messagePlaceholder}
          required 
          className='w-full break-words p-4 outline-none border-[.5px] border-gray-400 rounded-md bg-white mb-6 dark:bg-darkHover/30 dark:border-white/90'
          name='message'
        ></textarea>
        
        <button
          type='submit' 
          className='min-h-11 max-w-full py-3 px-8 w-max flex items-center justify-between gap-2 bg-black/80 text-white rounded-full mx-auto hover:bg-black duration-500 dark:bg-transparent dark:border-[0.5px] dark:hover:bg-[#282C34] hover:scale-105 transition-transform'
        > 
          Send Message 
          <Image src={assets.right_arrow_white} alt='' className='w-4'/> 
        </button>

        <p className='mt-4 text-center'>{result}</p> 
      </form>
      {preview && <SectionPageLink href="/contact" label="View all" />}
      </div>
    </section>
  )
}

export default Contact