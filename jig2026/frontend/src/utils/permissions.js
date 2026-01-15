/**
 * Utilitaires pour la gestion des permissions et rôles
 */

// Définition des permissions par rôle
export const PERMISSIONS = {
  ETUDIANT: [
    'submit_project',    // Peut soumettre des projets
    'vote',             // Peut voter
    'comment',          // Peut commenter
    'view_projects'     // Peut voir les projets
  ],
  UTILISATEUR: [
    'vote',             // Peut voter
    'comment',          // Peut commenter  
    'view_projects'     // Peut voir les projets
  ],
  JURY: [
    'vote',             // Peut voter
    'comment',          // Peut commenter
    'view_projects',    // Peut voir les projets
    'admin_vote'        // Vote avec poids jury
  ],
  ADMIN: [
    'submit_project',
    'vote', 
    'comment',
    'view_projects',
    'admin_vote',
    'manage_users',     // Peut gérer les utilisateurs
    'manage_projects',  // Peut gérer les projets
    'manage_votes',     // Peut gérer les votes
    'view_dashboard'    // Peut accéder au dashboard
  ]
}

// Vérifier si un utilisateur a une permission spécifique
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false
  return PERMISSIONS[userRole]?.includes(permission) || false
}

// Vérifier si un utilisateur peut soumettre des projets
// Seuls les étudiants de l'EAIN (ISTC Polytechnique) peuvent soumettre
export const canSubmitProject = (user) => {
  if (!user) return false
  
  return (
    user.role === 'ETUDIANT' &&
    user.ecole === 'ISTC_POLYTECHNIQUE' &&
    user.filiere === 'EAIN'
  )
}

// Vérifier si un utilisateur peut voter
export const canVote = (user) => {
  if (!user) return false
  return ['ETUDIANT', 'UTILISATEUR'].includes(user.role)
}

// Vérifier si un utilisateur peut commenter
export const canComment = (user) => {
  if (!user) return false
  return ['ETUDIANT', 'UTILISATEUR'].includes(user.role)
}

// Vérifier si un utilisateur a accès au dashboard admin
export const canAccessDashboard = (userRole) => {
  return hasPermission(userRole, 'view_dashboard')
}

// Obtenir le type de vote selon le rôle
export const getVoteType = (userRole) => {
  switch (userRole) {
    case 'JURY':
      return 'JURY'
    case 'ETUDIANT':
      return 'ETUDIANT'
    case 'UTILISATEUR':
      return 'UTILISATEUR'
    default:
      return 'UTILISATEUR'
  }
}

// Obtenir le poids du vote selon le rôle
export const getVoteWeight = (userRole) => {
  switch (userRole) {
    case 'JURY':
      return 0.7 // 70% du poids
    case 'ETUDIANT':
    case 'UTILISATEUR':
      return 0.3 // 30% du poids
    default:
      return 0.3
  }
}

// Messages d'erreur pour les permissions
export const PERMISSION_MESSAGES = {
  submit_project: "Seuls les étudiants de l'EAIN (ISTC Polytechnique) peuvent soumettre des projets.",
  vote: "Vous devez être connecté pour voter.",
  comment: "Vous devez être connecté pour commenter.",
  admin_access: "Accès administrateur requis.",
  jury_access: "Accès jury requis."
}

// Obtenir un message d'erreur de permission
export const getPermissionMessage = (permission) => {
  return PERMISSION_MESSAGES[permission] || "Permission refusée."
}

/**
 * Obtient le label d'affichage pour le rôle
 */
export const getRoleLabel = (role) => {
  switch (role) {
    case 'ETUDIANT':
      return 'Étudiant'
    case 'UTILISATEUR':
      return 'Utilisateur'
    case 'JURY':
      return 'Jury'
    case 'ADMIN':
      return 'Administrateur'
    default:
      return role
  }
}

/**
 * Obtient des informations académiques formatées
 */
export const getAcademicInfo = (user) => {
  if (!user || user.role !== 'ETUDIANT') return null
  
  const parts = []
  
  if (user.niveau) parts.push(user.niveau)
  if (user.filiere) parts.push(user.filiere)
  if (user.ecole) {
    switch (user.ecole) {
      case 'ISTC_POLYTECHNIQUE':
        parts.push('ISTC Polytechnique')
        break
      default:
        parts.push(user.ecole)
    }
  }
  
  return parts.length > 0 ? parts.join(' - ') : null
}