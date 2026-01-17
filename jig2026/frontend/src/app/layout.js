import './globals.css'
import RootLayoutClient from '@/components/RootLayoutClient'

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
      </body>
    </html>
  )
}