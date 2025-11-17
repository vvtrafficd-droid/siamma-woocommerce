import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Header = () => {
  return (
    <section className='hidden md:block bg-gray-800 text-white'>
      <div className='container mx-auto px-6 py-2 flex justify-between items-center'>
        <div className='flex flex-wrap items-center gap-4'>
          <p className='text-sm'>Seg - Sex: 8 am - 8 pm</p>
          <span className='hidden lg:inline-block text-white/40'>•</span>
          <p className='text-sm'>Sab - Dom: 8 am - 7 pm</p>
          <span className='hidden lg:inline-block text-white/40'>•</span>
          <p className='text-sm'>Estrada nacional 105 4835517 Guimarães, Portugal</p>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' asChild className='text-white hover:text-white'>
            <Link
              href='https://www.facebook.com/p/Siamma-61573597127495/'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Facebook'
            >
              <i className='ri-facebook-fill text-xl'></i>
            </Link>
          </Button>
          <Button variant='ghost' size='icon' asChild className='text-white hover:text-white'>
            <Link
              href='https://www.instagram.com/siamma.pt/'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'
            >
              <i className='ri-instagram-line text-xl'></i>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Header