import { Inter } from 'next/font/google'
import 'aos/dist/aos.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'JIG 2026 - Authentification',
  description: 'Connexion et inscription pour la Journée de l\'Infographiste 2026 - ISTC Polytechnique',
  keywords: 'JIG 2026, authentification, connexion, inscription, ISTC, infographiste',
}

export default function AuthLayout({ children }) {
  return (
    <div className={`${inter.className} min-h-screen`}>
      {children}
    </div>
  )
}