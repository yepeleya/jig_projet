'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Hook personnalisé pour gérer les notifications
 * Évite les notifications persistantes et les doublons
 */
export const useNotification = () => {
  const [notification, setNotification] = useState({ 
    show: false, 
    type: '', 
    message: '', 
    id: null 
  })
  
  const timeoutRef = useRef(null)
  const currentIdRef = useRef(0)

  // Nettoyer le timeout lors du démontage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const showNotification = useCallback((type, message, duration = 5000) => {
    // Effacer le timeout précédent s'il existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Générer un ID unique pour cette notification
    const notificationId = ++currentIdRef.current

    // Afficher la nouvelle notification
    setNotification({ show: true, type, message, id: notificationId })

    // Programmer la disparition automatique
    timeoutRef.current = setTimeout(() => {
      setNotification(prev => {
        // Ne masquer que si c'est la même notification (évite les conflits de timing)
        if (prev.id === notificationId) {
          return { show: false, type: '', message: '', id: null }
        }
        return prev
      })
      timeoutRef.current = null
    }, duration)
  }, [])

  const hideNotification = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setNotification({ show: false, type: '', message: '', id: null })
  }, [])

  return {
    notification,
    showNotification,
    hideNotification
  }
}