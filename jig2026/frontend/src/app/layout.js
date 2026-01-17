'use client'

import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthInitializer from '@/components/AuthInitializer'

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning={true}>
        <AuthInitializer />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}