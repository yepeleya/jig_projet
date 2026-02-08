import './globals.css'
import RootLayoutClient from '@/components/RootLayoutClient'
import { Analytics } from '@vercel/analytics/next'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'JIG 2026',
  description: 'Concours Innovation et Génie Étudiant'
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning={true}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
        <Analytics />
      </body>
    </html>
  )
}