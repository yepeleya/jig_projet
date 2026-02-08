'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log l'erreur pour debugging
    console.error('Erreur capturée par error.jsx:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="max-w-md w-full mx-auto text-center px-6">
        <div className="mb-8">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Une erreur est survenue</h1>
          <p className="text-gray-600">
            Une erreur inattendue s'est produite. Veuillez réessayer ou revenir à l'accueil.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-4 bg-red-100 rounded-lg text-left">
              <summary className="cursor-pointer font-medium text-red-800">
                Détails de l'erreur (dev)
              </summary>
              <pre className="mt-2 text-xs text-red-700 overflow-auto">
                {error?.message || 'Erreur inconnue'}
              </pre>
            </details>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </button>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Link>
        </div>
      </div>
    </div>
  )
}