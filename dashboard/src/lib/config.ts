// Configuration centralisée pour éviter le hardcodage des URLs

// URL de l'API backend
export const getApiUrl = () => {
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  
  // S'assurer que l'URL se termine par /api
  if (apiUrl && !apiUrl.endsWith('/api')) {
    apiUrl = `${apiUrl}/api`
  }
  
  return apiUrl
}

// URL de base du backend (sans /api)
export const getBackendUrl = () => {
  const apiUrl = getApiUrl()
  return apiUrl.replace('/api', '')
}

// URL pour les fichiers uploads
export const getUploadUrl = (fileName: string) => {
  if (!fileName) return ''
  return `${getBackendUrl()}/uploads/${fileName}`
}

// URL pour les vidéos (avec proxy Next.js)
export const getVideoProxyUrl = (fileName: string) => {
  if (!fileName) return ''
  return `/api/video/${fileName}`
}

// URLs des applications
export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3002'
export const JURY_URL = process.env.NEXT_PUBLIC_JURY_URL || 'http://localhost:3000'
export const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001'

// Export par défaut
const config = {
  apiUrl: getApiUrl(),
  backendUrl: getBackendUrl(),
  frontendUrl: FRONTEND_URL,
  juryUrl: JURY_URL,
  dashboardUrl: DASHBOARD_URL,
}

export default config
