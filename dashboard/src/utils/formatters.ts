// Utilitaires pour formater les noms et textes

/**
 * Capitalise la première lettre d'une chaîne
 */
export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Formate un nom complet (prénom + nom) avec capitalisation appropriée
 */
export function formatFullName(prenom?: string, nom?: string): string {
  if (!prenom && !nom) return 'Utilisateur'
  
  const prenomFormatted = prenom ? capitalize(prenom) : ''
  const nomFormatted = nom ? capitalize(nom) : ''
  
  return `${prenomFormatted} ${nomFormatted}`.trim()
}

/**
 * Génère les initiales à partir du prénom et nom
 */
export function getInitials(prenom?: string, nom?: string): string {
  const prenomInitial = prenom ? prenom.charAt(0).toUpperCase() : 'A'
  const nomInitial = nom ? nom.charAt(0).toUpperCase() : 'D'
  
  return `${prenomInitial}${nomInitial}`
}

/**
 * Formate une date en français
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Formate une date avec l'heure en français
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}