'use client'

import { useState } from 'react'
import { useNotifications } from '@/providers/NotificationProvider'
import { TypeNotification } from '@/types/notification'
import { Bell, Plus, RefreshCw, CheckCheck, Trash2 } from 'lucide-react'

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification 
  } = useNotifications()

  const [testNotificationData, setTestNotificationData] = useState({
    type: TypeNotification.NOUVEAU_PROJET,
    titre: 'Test de notification',
    message: 'Ceci est un message de test pour vérifier le système de notifications'
  })

  // Fonction pour créer une notification de test
  const createTestNotification = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: testNotificationData.type,
          titre: testNotificationData.titre,
          message: testNotificationData.message,
          isRead: false
        })
      })

      if (response.ok) {
        await fetchNotifications()
        alert('Notification de test créée !')
      } else {
        alert('Erreur lors de la création de la notification')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la création de la notification')
    }
  }

  const getNotificationIcon = (type: TypeNotification): string => {
    switch (type) {
      case TypeNotification.NOUVEAU_UTILISATEUR: return '👤'
      case TypeNotification.NOUVEAU_JURY: return '👨‍⚖️'
      case TypeNotification.NOUVEAU_PROJET: return '📁'
      case TypeNotification.NOUVEAU_VOTE: return '🗳️'
      case TypeNotification.NOUVEAU_CONTACT: return '📧'
      case TypeNotification.PROJET_APPROUVE: return '✅'
      case TypeNotification.PROJET_REJETE: return '❌'
      case TypeNotification.NOUVEAU_COMMENTAIRE: return '💬'
      default: return '📢'
    }
  }

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'À l\'instant'
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`
    return `Il y a ${Math.floor(diffInSeconds / 86400)}j`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-bold leading-none text-white bg-red-600 rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez toutes vos notifications en temps réel
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={fetchNotifications}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Section de test */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">
          🧪 Zone de test des notifications
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">Type</label>
            <select
              value={testNotificationData.type}
              onChange={(e) => setTestNotificationData({
                ...testNotificationData,
                type: e.target.value as TypeNotification
              })}
              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              {Object.values(TypeNotification).map(type => (
                <option key={type} value={type}>
                  {getNotificationIcon(type)} {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">Titre</label>
            <input
              type="text"
              value={testNotificationData.titre}
              onChange={(e) => setTestNotificationData({
                ...testNotificationData,
                titre: e.target.value
              })}
              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">Message</label>
            <input
              type="text"
              value={testNotificationData.message}
              onChange={(e) => setTestNotificationData({
                ...testNotificationData,
                message: e.target.value
              })}
              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>
        
        <button
          onClick={createTestNotification}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Créer une notification de test
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{notifications?.length || 0}</p>
              <p className="text-gray-600">Total des notifications</p>
            </div>
            <Bell className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              <p className="text-gray-600">Non lues</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">{unreadCount > 99 ? '99+' : unreadCount}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {(notifications?.length || 0) - unreadCount}
              </p>
              <p className="text-gray-600">Lues</p>
            </div>
            <CheckCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Toutes les notifications
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.titre}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{formatTimeAgo(notification.createdAt)}</span>
                        <span className="capitalize">{notification.type.replace('_', ' ').toLowerCase()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Marquer comme lu"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune notification
              </h3>
              <p>Vous n&apos;avez pas encore de notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
