// Middleware pour gérer les erreurs de streaming et de téléchargement
export const handleStreamingErrors = (req, res, next) => {
  // Intercepter la fermeture de connexion
  req.on('close', () => {
    console.log('Connexion fermée par le client')
  })

  req.on('aborted', () => {
    console.log('Requête annulée par le client')
  })

  res.on('error', (err) => {
    console.error('Erreur de réponse:', err.message)
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Erreur de streaming'
      })
    }
  })

  next()
}

// Middleware pour ajouter les headers de sécurité et de streaming
export const addSecurityHeaders = (req, res, next) => {
  // Headers de sécurité
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  // Headers pour le streaming
  res.setHeader('Accept-Ranges', 'bytes')
  res.setHeader('Cache-Control', 'public, max-age=31536000')
  
  // Headers CORS spécifiques pour les médias
  if (req.path.includes('/uploads/') || req.path.includes('/video/')) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Range')
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length')
  }

  next()
}

// Middleware pour détecter le type de fichier et optimiser la réponse
export const optimizeFileResponse = (req, res, next) => {
  const userAgent = req.headers['user-agent'] || ''
  const isVideoRequest = req.path.match(/\.(mp4|webm|avi|mov|mkv)$/i)
  
  if (isVideoRequest) {
    // Optimisations pour les vidéos
    res.setHeader('Content-Type', 'video/mp4') // Default, sera remplacé par le bon type
    
    // Support pour Safari qui est plus strict
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      res.setHeader('Accept-Ranges', 'bytes')
      res.setHeader('Cache-Control', 'no-cache')
    }
  }

  next()
}