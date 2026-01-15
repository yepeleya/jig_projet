import React from 'react'
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react'

export default function NetworkErrorBanner({ 
  error, 
  isOnline, 
  onRetry, 
  onDismiss,
  className = '' 
}) {
  if (!error && isOnline) return null

  const getErrorIcon = () => {
    if (!isOnline) return <WifiOff className="w-5 h-5" />
    if (error?.includes('ERR_BLOCKED_BY_RESPONSE')) return <AlertTriangle className="w-5 h-5" />
    if (error?.includes('500')) return <AlertTriangle className="w-5 h-5" />
    return <Wifi className="w-5 h-5" />
  }

  const getErrorMessage = () => {
    if (!isOnline) return 'Pas de connexion internet'
    if (error?.includes('ERR_BLOCKED_BY_RESPONSE')) return 'Contenu bloqué par la sécurité'
    if (error?.includes('500')) return 'Erreur serveur temporaire'
    if (error?.includes('Failed to fetch')) return 'Impossible de contacter le serveur'
    return error || 'Erreur réseau'
  }

  const getErrorSolution = () => {
    if (!isOnline) return 'Vérifiez votre connexion internet'
    if (error?.includes('ERR_BLOCKED_BY_RESPONSE')) return 'Essayez de recharger la page'
    if (error?.includes('500')) return 'Le serveur rencontre des difficultés'
    return 'Cliquez sur Réessayer'
  }

  const getBannerColor = () => {
    if (!isOnline) return 'bg-red-50 border-red-200 text-red-800'
    if (error?.includes('ERR_BLOCKED_BY_RESPONSE') || error?.includes('500')) {
      return 'bg-orange-50 border-orange-200 text-orange-800'
    }
    return 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className={`border-b px-4 py-3 ${getBannerColor()}`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            {getErrorIcon()}
            <div>
              <p className="font-medium text-sm">{getErrorMessage()}</p>
              <p className="text-xs opacity-75">{getErrorSolution()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors border border-current border-opacity-20"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Réessayer
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors"
                aria-label="Fermer"
              >
                <span className="text-sm">×</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant de notification toast pour les erreurs réseau
export function NetworkErrorToast({ error, onDismiss, duration = 5000 }) {
  React.useEffect(() => {
    if (duration && onDismiss) {
      const timer = setTimeout(onDismiss, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onDismiss])

  if (!error) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Erreur réseau</p>
          <p className="text-xs opacity-90">{error}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors flex items-center justify-center"
          >
            <span className="text-sm">×</span>
          </button>
        )}
      </div>
    </div>
  )
}