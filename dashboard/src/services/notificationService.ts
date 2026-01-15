import { Notification, NotificationAPI } from '@/types/notification'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

class NotificationService implements NotificationAPI {
  private async fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      console.log('🌐 Appel API: GET /notifications')
      const response = await this.fetchAPI<{ success: boolean, data: { notifications: Notification[] } }>('/notifications')
      console.log('📥 Réponse API complète:', JSON.stringify(response, null, 2))
      
      // Extraire les notifications de la structure correcte
      const notifications = response.data?.notifications || []
      console.log('� Notifications extraites:', notifications.length)
      
      return Array.isArray(notifications) ? notifications : []
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des notifications:', error)
      return []
    }
  }

  async getUnreadCount(): Promise<{ count: number }> {
    try {
      const response = await this.fetchAPI<{ success: boolean, data: { unreadCount: number } }>('/notifications/unread-count')
      return { count: response.data?.unreadCount || 0 }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du compteur:', error)
      return { count: 0 }
    }
  }

  async markAsRead(id: number): Promise<void> {
    await this.fetchAPI(`/notifications/${id}/read`, {
      method: 'PATCH',
    })
  }

  async markAllAsRead(): Promise<void> {
    await this.fetchAPI('/notifications/mark-all-read', {
      method: 'PATCH',
    })
  }

  async deleteNotification(id: number): Promise<void> {
    await this.fetchAPI(`/notifications/${id}`, {
      method: 'DELETE',
    })
  }
}

export const notificationService = new NotificationService()