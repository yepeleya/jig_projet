'use client'

import { useEffect, type ReactNode } from 'react'

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  useEffect(() => {
    // Supprimer les attributs d'extension après le montage
    const removeExtensionAttributes = () => {
      if (typeof document !== 'undefined') {
        const elements = document.querySelectorAll('[bis_skin_checked]')
        elements.forEach(element => {
          element.removeAttribute('bis_skin_checked')
        })
        
        const processedElements = document.querySelectorAll('[class*="__processed_"]')
        processedElements.forEach(element => {
          Array.from(element.attributes).forEach(attr => {
            if (attr.name.includes('__processed_')) {
              element.removeAttribute(attr.name)
            }
          })
        })
      }
    }

    // Exécuter immédiatement et après un court délai
    removeExtensionAttributes()
    const timer = setTimeout(removeExtensionAttributes, 50)
    
    return () => clearTimeout(timer)
  }, [])

  // Rendu côté client uniquement après hydratation
  if (typeof window === 'undefined') {
    return <>{fallback}</>
  }

  return <>{children}</>
}