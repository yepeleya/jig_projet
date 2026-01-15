'use client'

import { useEffect } from 'react'

export function useHydrationFix() {
  useEffect(() => {
    // Supprimer les attributs ajoutés par les extensions de navigateur
    const removeExtensionAttributes = () => {
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

    // Exécuter au chargement
    removeExtensionAttributes()
    
    // Observer les changements du DOM pour les nouveaux éléments
    const observer = new MutationObserver(() => {
      removeExtensionAttributes()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    })

    return () => observer.disconnect()
  }, [])
}