'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthInitializer from '@/components/AuthInitializer'

export default function RootLayoutClient({ children }) {
  return (
    <>
      <AuthInitializer />
      <Header />
      {children}
      <Footer />
    </>
  )
}
