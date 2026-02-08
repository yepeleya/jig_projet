'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
import Hero from '@/components/Hero'
import AboutSection from '@/components/AboutSection'
import ProgramSection from '@/components/ProgramSection'
import GallerySection from '@/components/GallerySection'
import useAOS from '../hooks/useAOS'
import 'aos/dist/aos.css'

export default function HomePage() {
  useAOS() // Hook NoSSR pour AOS

  return (
    <main className="min-h-screen">
      <Hero />
      <AboutSection />
      <ProgramSection />
      <GallerySection />
    </main>
  )
}
