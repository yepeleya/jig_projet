'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Erreur globale captureée:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="max-w-md w-full mx-auto text-center px-6">
            <div className="mb-8">
              <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur serveur (500)</h1>
              <p className="text-gray-600">
                Une erreur critique s'est produite. Veuillez rafraîchir la page.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </button>
              
              <a 
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home className="mr-2 h-4 w-4" />
                Accueil
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}