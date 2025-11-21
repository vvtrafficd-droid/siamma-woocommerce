"use client";
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

const Header = () => {
  const router = useRouter();
  const { email, logout } = useAuthStore();
  return (
    <section className='hidden md:block bg-gray-800 text-white'>
      <div className='container mx-auto px-6 py-2 grid grid-cols-3 items-center'>
        <div className='flex flex-wrap items-center gap-4'>
          <p className='text-sm'>Segunda a Sexta: 8am - 8pm</p>
          <span className='hidden lg:inline-block text-white/40'>•</span>
          <p className='text-sm'>Sábado e Domingo: 8am - 7pm</p>
          <span className='hidden lg:inline-block text-white/40'>•</span>
        </div>

        <div className='flex items-center justify-center gap-2'>
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

        <div className='flex items-center justify-end gap-2'>
          {email ? (
            <>
              <Button asChild variant='outline' className='bg-transparent border-white/40 text-white hover:bg-white/10'>
                <Link href='/orders'>Meus pedidos</Link>
              </Button>
              <Button asChild variant='outline' className='bg-transparent border-white/40 text-white hover:bg-white/10'>
                <Link href='/account'>Minha conta</Link>
              </Button>
              <Button
                variant='outline'
                className='bg-transparent border-white/40 text-white hover:bg-white/10'
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              >
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant='outline' className='bg-transparent border-white/40 text-white hover:bg-white/10'>
                <Link href='/login'>Entrar</Link>
              </Button>
              <Button asChild variant='outline' className='bg-transparent border-white/40 text-white hover:bg-white/10'>
                <Link href='/register'>Registar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Header