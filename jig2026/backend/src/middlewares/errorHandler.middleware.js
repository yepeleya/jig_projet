export const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err)

  // Erreur de validation Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Cette donnée existe déjà',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }

  // Erreur de contrainte Prisma
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Ressource non trouvée',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    })
  }

  // Erreur de validation Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    })
  }

  // Erreur Multer (upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Fichier trop volumineux (max 10MB)'
    })
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Trop de fichiers'
    })
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Type de fichier non autorisé'
    })
  }

  // Erreurs réseau et streaming
  if (err.code === 'ENOENT') {
    return res.status(404).json({
      success: false,
      message: 'Fichier non trouvé'
    })
  }

  if (err.code === 'EACCES') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé au fichier'
    })
  }

  if (err.code === 'EADDRINUSE') {
    return res.status(500).json({
      success: false,
      message: 'Port déjà utilisé'
    })
  }

  // Erreurs de connexion réseau
  if (err.code === 'ECONNRESET' || err.code === 'EPIPE') {
    console.log('Connexion fermée par le client:', err.code)
    return // Ne pas envoyer de réponse si la connexion est fermée
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`
  })
}