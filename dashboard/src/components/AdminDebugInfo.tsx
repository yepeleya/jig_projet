'use client'

import { useAdminStore } from '@/store/adminStore'
import { useState } from 'react'

interface LocalStorageData {
  token: string | null
  user: unknown
  zustand: unknown
}

export default function AdminDebugInfo() {
  const { admin, token, isAuthenticated } = useAdminStore()
  const [showDebug, setShowDebug] = useState(false)

  // Fonction pour récupérer les données du localStorage à la demande
  const getLocalStorageData = (): LocalStorageData => {
    if (typeof window === 'undefined') {
      return { token: null, user: null, zustand: null }
    }
    
    const storedToken = localStorage.getItem('admin-token')
    const storedUser = localStorage.getItem('admin-user')
    const storedZustand = localStorage.getItem('admin-storage')
    
    return {
      token: storedToken,
      user: storedUser ? JSON.parse(storedUser) : null,
      zustand: storedZustand ? JSON.parse(storedZustand) : null
    }
  }

  const localStorageData = showDebug ? getLocalStorageData() : null

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Debug Info - Admin State</h3>
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="text-gray-300 hover:text-white"
        >
          {showDebug ? '▼' : '▶'}
        </button>
      </div>
      
      {showDebug && (
        <div className="space-y-2">
          <div>
            <strong>Store Admin:</strong>
            <pre className="text-xs overflow-auto bg-gray-800 p-2 rounded">
              {JSON.stringify(admin, null, 2)}
            </pre>
          </div>
          
          <div>
            <strong>Store Token:</strong> {token ? 'Présent' : 'Absent'}
          </div>
          
          <div>
            <strong>isAuthenticated():</strong> {isAuthenticated() ? 'true' : 'false'}
          </div>
          
          <div>
            <strong>LocalStorage Token:</strong> {localStorageData?.token ? 'Présent' : 'Absent'}
          </div>
          
          <div>
            <strong>LocalStorage User:</strong>
            <pre className="text-xs overflow-auto bg-gray-800 p-2 rounded">
              {JSON.stringify(localStorageData?.user, null, 2)}
            </pre>
          </div>
          
          <div>
            <strong>Zustand Storage:</strong>
            <pre className="text-xs overflow-auto bg-gray-800 p-2 rounded">
              {JSON.stringify(localStorageData?.zustand, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}