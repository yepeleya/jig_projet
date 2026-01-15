'use client'

import { useEffect } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import AboutSection from '@/components/AboutSection'
import ProgramSection from '@/components/ProgramSection'
import GallerySection from '@/components/GallerySection'
import Footer from '@/components/Footer'
import AuthInitializer from '@/components/AuthInitializer'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function HomePage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  return (
    <>
      <AuthInitializer />
      <Header />
      <main className="min-h-screen">
        <Hero />
        <AboutSection />
        <ProgramSection />
        <GallerySection />
      </main>
      <Footer />
    </>
  )
}
