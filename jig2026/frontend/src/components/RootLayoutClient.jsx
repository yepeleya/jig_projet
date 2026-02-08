'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'

// Import dynamique des composants qui pourraient causer des problèmes d'hydratation
const Header = dynamic(() => import('@/components/Header'), { 
  ssr: false, 
  loading: () => <div style={{ height: '80px', backgroundColor: '#1f2937' }}></div> 
})
const AuthInitializer = dynamic(() => import('@/components/AuthInitializer'), { 
  ssr: false 
})

export default function RootLayoutClient({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <>
        <div style={{ height: '80px', backgroundColor: '#1f2937' }}></div>
        {children}
        <Footer />
      </>
    )
  }

  return (
    <>
      <AuthInitializer />
      <Header />
      {children}
      <Footer />
    </>
  )
}
