'use client'

import { useEffect, useState } from 'react'

/**
 * Hook pour éviter les erreurs d'hydratation
 * Retourne false côté serveur, true côté client après hydratation
 */
export function useHydrationFix() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Seulement côté client
    if (typeof window === 'undefined') return

    // Fonction pour nettoyer les attributs des extensions
    const cleanExtensionAttributes = () => {
      try {
        // Nettoyer seulement les attributs connus problématiques
        const knownSelectors = [
          '[bis_skin_checked]',
          '[bis_register]'
        ]
        
        knownSelectors.forEach(selector => {
          try {
            const elements = document.querySelectorAll(selector)
            elements.forEach(element => {
              const attrName = selector.replace(/[\[\]]/g, '')
              element.removeAttribute(attrName)
            })
          } catch {
            // Ignorer les erreurs de sélecteur
          }
        })
        
        // Nettoyer les attributs __processed_ sur les éléments body et html seulement
        const criticalElements = [document.body, document.documentElement]
        criticalElements.forEach(element => {
          if (element) {
            Array.from(element.attributes).forEach(attr => {
              if (attr.name.startsWith('__processed_')) {
                element.removeAttribute(attr.name)
              }
            })
          }
        })
      } catch {
        // Ignorer les erreurs silencieusement
      }
    }

    // Nettoyer immédiatement
    cleanExtensionAttributes()
    
    // Marquer comme monté après nettoyage
    const timeout = setTimeout(() => {
      cleanExtensionAttributes()
      setIsMounted(true)
    }, 100)
    
    return () => clearTimeout(timeout)
  }, [])

  return isMounted
}

/**
 * Hook pour détecter si nous sommes côté client
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0)
    return () => clearTimeout(timer)
  }, [])

  return isClient
}

/**
 * Hook pour gérer le localStorage côté client uniquement
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const isClient = useIsClient()

  useEffect(() => {
    if (isClient) {
      const timer = setTimeout(() => {
        try {
          const item = localStorage.getItem(key)
          setValue(item ? JSON.parse(item) : defaultValue)
        } catch (error) {
          console.warn(`Erreur lors de la lecture de localStorage pour la clé "${key}":`, error)
          setValue(defaultValue)
        }
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [key, defaultValue, isClient])

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue)
      if (isClient) {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    } catch (error) {
      console.warn(`Erreur lors de l'écriture dans localStorage pour la clé "${key}":`, error)
    }
  }

  return [value, setStoredValue] as const
}