"use client";

import { assets, contactContent } from '@/assets/assets'
import Image from 'next/image'
import SectionPageLink from './SectionPageLink'
import useContactSubmission from './useContactSubmission'

const Contact = ({ preview = false }) => {
  const { onSubmit, result } = useContactSubmission();

  return (
    <div
      id="contact"
      className='w-full px-[12%] py-10 bg-[url("/footer-bg-color.png")] bg-no-repeat bg-center bg-[length:90%_auto] dark:bg-none'
    > 
      <h4 className='text-center mb-1 text-xl font-Ovo'>
        {contactContent.eyebrow}
      </h4>
      
      <h2 className='text-center sm:text-5xl font-Ovo'>
        {contactContent.title}
      </h2>
      
      <p className='text-center max-w-2xl mx-auto mt-3 mb-12 font-Ovo'>
        {contactContent.description}
      </p>
    
      <form onSubmit={onSubmit} className='mx-w-2xl mx-auto'>  
        
        <div className='grid grid-cols-auto sm:grid-cols-2 gap-6 mt-10 mb-8'>
          <input 
            type='text' 
            placeholder={contactContent.namePlaceholder}
            required 
            className='flex-1 p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90' 
            name='name'
          />

          <input 
            type='email' 
            placeholder={contactContent.emailPlaceholder}
            required 
            className='flex-1 p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90' 
            name='email' 
          />
        </div>
        
        <textarea 
          rows='6' 
          placeholder={contactContent.messagePlaceholder}
          required 
          className='w-full p-4 outline-none border-[.5px] border-gray-400 rounded-md bg-white mb-6 dark:bg-darkHover/30 dark:border-white/90' 
          name='message'
        ></textarea>
        
        <button
          type='submit' 
          className='py-3 px-8 w-max flex items-center justify-between gap-2 bg-black/80 text-white rounded-full mx-auto hover:bg-black duration-500 dark:bg-transparent dark:border-[0.5px] dark:hover:bg-[#282C34] hover:scale-105 transition-transform'
        > 
          Send Message 
          <Image src={assets.right_arrow_white} alt='' className='w-4'/> 
        </button>

        <p className='mt-4 text-center'>{result}</p> 
      </form>
      {preview && <SectionPageLink href="/contact" label="View all" />}
    </div>
  )
}

export default Contact