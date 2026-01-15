'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function JuryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9E1B32 0%, #7A1529 50%, #5A0F1D 100%)' }}>
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full mx-auto flex items-center justify-center text-white text-4xl">
              ⚖️
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#9E1B32' }}>
            Espace Jury JIG 2026
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            L'interface jury est actuellement en cours de déploiement. Elle sera bientôt accessible pour l'évaluation des projets.
          </p>

          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-8">
            <p className="text-red-800">
              <strong>Pour les membres du jury :</strong><br/>
              Veuillez contacter l'administrateur pour obtenir vos identifiants d'accès.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-white border-2 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              style={{ borderColor: '#9E1B32' }}
            >
              ← Retour à l'accueil
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              style={{ backgroundColor: '#9E1B32' }}
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
