'use client'

import { useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Composant pour afficher du contenu uniquement côté client
 * Évite les erreurs d'hydratation SSR/CSR en attendant le montage côté client
 * 
 * Ce composant est utilisé pour envelopper des composants qui ne doivent 
 * s'afficher que côté client (par exemple: éléments dépendants du DOM)
 * 
 * @param children - Le contenu à afficher côté client
 * @param fallback - Le contenu à afficher pendant l'hydratation (par défaut: null)
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    // Utilisation d'un timeout pour éviter l'appel synchrone de setState
    // Cela permet d'éviter les renders en cascade et respecte les bonnes pratiques React
    const timer = setTimeout(() => {
      setHasMounted(true)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  // Afficher le fallback pendant l'hydratation SSR
  if (!hasMounted) {
    return <>{fallback}</>
  }

  // Afficher le contenu réel une fois côté client
  return <>{children}</>
}