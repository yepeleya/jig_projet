export enum TypeNotification {
  NOUVEAU_UTILISATEUR = 'NOUVEAU_UTILISATEUR',
  NOUVEAU_JURY = 'NOUVEAU_JURY',
  NOUVEAU_PROJET = 'NOUVEAU_PROJET',
  NOUVEAU_VOTE = 'NOUVEAU_VOTE',
  PROJET_APPROUVE = 'PROJET_APPROUVE',
  PROJET_REJETE = 'PROJET_REJETE',
  NOUVEAU_COMMENTAIRE = 'NOUVEAU_COMMENTAIRE',
  NOUVEAU_CONTACT = 'NOUVEAU_CONTACT'
}

export interface Notification {
  id: number
  type: TypeNotification
  titre: string
  message: string
  isRead: boolean
  entityId?: number
  entityType?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  fetchNotifications: () => Promise<void>
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: number) => Promise<void>
  refreshNotifications: () => void
}

export interface NotificationAPI {
  getNotifications: () => Promise<Notification[]>
  getUnreadCount: () => Promise<{ count: number }>
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: number) => Promise<void>
}