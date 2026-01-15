'use client'

import { useState } from 'react'
import { useNetworkErrorHandler } from '../utils/networkErrorHandler.js'
import NetworkErrorBanner from './NetworkErrorBanner.jsx'

export default function NetworkErrorProvider({ children }) {
  const { isOnline, networkError, clearError } = useNetworkErrorHandler()
  const [isDismissed, setIsDismissed] = useState(false)

  // Calculer la visibilité directement à partir des états
  const showBanner = (networkError || !isOnline) && !isDismissed

  const handleRetry = () => {
    clearError()
    setIsDismissed(false)
    // Recharger la page pour réessayer toutes les requêtes
    window.location.reload()
  }

  const handleDismiss = () => {
    clearError()
    setIsDismissed(true)
  }

  // Réinitialiser isDismissed quand une nouvelle erreur apparaît
  if ((networkError || !isOnline) && isDismissed && networkError) {
    setIsDismissed(false)
  }

  return (
    <>
      <NetworkErrorBanner
        error={networkError}
        isOnline={isOnline}
        onRetry={handleRetry}
        onDismiss={handleDismiss}
        className={showBanner ? 'block' : 'hidden'}
      />
      
      {/* Ajouter un padding-top si la bannière est visible */}
      <div className={showBanner ? 'pt-16' : ''}>
        {children}
      </div>
    </>
  )
}