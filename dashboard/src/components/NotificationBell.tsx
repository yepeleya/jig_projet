'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useNotifications } from '@/providers/NotificationProvider'
import { TypeNotification } from '@/types/notification'

// Icônes pour les différents types de notifications
const getNotificationIcon = (type: TypeNotification): string => {
  switch (type) {
    case TypeNotification.NOUVEAU_UTILISATEUR:
      return '👤'
    case TypeNotification.NOUVEAU_JURY:
      return '👨‍⚖️'
    case TypeNotification.NOUVEAU_PROJET:
      return '📁'
    case TypeNotification.NOUVEAU_VOTE:
      return '🗳️'
    case TypeNotification.NOUVEAU_CONTACT:
      return '📧'
    case TypeNotification.PROJET_APPROUVE:
      return '✅'
    case TypeNotification.PROJET_REJETE:
      return '❌'
    case TypeNotification.NOUVEAU_COMMENTAIRE:
      return '💬'
    default:
      return '📢'
  }
}

// Couleurs pour les types de notifications
const getNotificationColor = (type: TypeNotification): string => {
  switch (type) {
    case TypeNotification.NOUVEAU_UTILISATEUR:
    case TypeNotification.NOUVEAU_JURY:
      return 'text-blue-600'
    case TypeNotification.NOUVEAU_PROJET:
      return 'text-green-600'
    case TypeNotification.NOUVEAU_VOTE:
      return 'text-purple-600'
    case TypeNotification.NOUVEAU_CONTACT:
      return 'text-orange-600'
    case TypeNotification.PROJET_APPROUVE:
      return 'text-emerald-600'
    case TypeNotification.PROJET_REJETE:
      return 'text-red-600'
    case TypeNotification.NOUVEAU_COMMENTAIRE:
      return 'text-indigo-600'
    default:
      return 'text-blue-600'
  }
}

// Formater le temps relatif
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'À l\'instant'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Il y a ${minutes} min`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Il y a ${hours}h`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `Il y a ${days}j`
  }
}

export default function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications()
  
  // Debug: log des données reçues
  console.log('🔔 NotificationBell - données:', { 
    notifications: notifications?.length || 0, 
    unreadCount, 
    isLoading 
  })
  
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = async (notificationId: number, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(notificationId)
    }
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleDeleteNotification = async (notificationId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    await deleteNotification(notificationId)
  }

  // Limiter l'affichage à 10 notifications récentes - sécurisé contre undefined
  const displayedNotifications = Array.isArray(notifications)
    ? notifications.slice(0, 10)
    : []

  return (
    <div className="relative">
      {/* Bouton cloche */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-colors"
        aria-label="Notifications"
      >
        {/* Icône cloche */}
        <div className="relative">
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
            />
          </svg>
          
          {/* Badge de compteur */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown des notifications */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-sm text-gray-500">
                  ({unreadCount} non lue{unreadCount > 1 ? 's' : ''})
                </span>
              )}
            </h3>
            
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Liste des notifications */}
          {!isLoading && (
            <div className="max-h-80 overflow-y-auto">
              {displayedNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {displayedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icône du type de notification */}
                        <div className={`text-xl ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        {/* Contenu de la notification */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.titre}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                            
                            {/* Badge non lu */}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 shrink-0"></div>
                            )}
                            
                            {/* Bouton supprimer */}
                            <button
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                              className="ml-2 p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                              aria-label="Supprimer la notification"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          {Array.isArray(notifications) && notifications.length > 10 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Voir toutes les notifications ({notifications.length})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
