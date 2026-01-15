'use client'

import { useState, useSyncExternalStore } from 'react'

/**
 * Hook pour détecter si le composant est hydraté côté client
 * Utilise useSyncExternalStore pour éviter les problèmes d'hydratation
 */
export function useHydration() {
  return useSyncExternalStore(
    () => () => {}, // subscribe (pas de souscription nécessaire)
    () => true,     // getSnapshot côté client
    () => false     // getServerSnapshot côté serveur
  )
}

/**
 * Hook pour vérifier si on est côté client
 * Utilise useSyncExternalStore pour une meilleure performance
 */
export function useIsClient() {
  return useSyncExternalStore(
    () => () => {}, // subscribe (pas de souscription nécessaire)
    () => typeof window !== 'undefined', // getSnapshot côté client
    () => false // getServerSnapshot côté serveur
  )
}

/**
 * Hook pour accéder au localStorage de façon sécurisée avec typage générique
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Erreur lecture localStorage pour ${key}:`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    if (typeof window === 'undefined') return
    
    try {
      // Gérer les fonctions de mise à jour comme useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Erreur écriture localStorage pour ${key}:`, error)
    }
  }

  const removeValue = () => {
    if (typeof window === 'undefined') return
    
    try {
      setStoredValue(initialValue)
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Erreur suppression localStorage pour ${key}:`, error)
    }
  }

  return [storedValue, setValue, removeValue] as const
}