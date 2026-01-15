'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Notification, NotificationContextType } from '@/types/notification'
import { notificationService } from '@/services/notificationService'

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: React.ReactNode
  pollingInterval?: number
}

export function NotificationProvider({ 
  children, 
  pollingInterval = 30000 // 30 secondes par défaut
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchNotifications = useCallback(async () => {
    try {
      console.log('🔄 Chargement des notifications...')
      setIsLoading(true)
      const [notificationsData, unreadData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getUnreadCount()
      ])
      
      console.log('📦 Données reçues:', { notificationsData, unreadData })
      
      // Sécuriser les données reçues
      setNotifications(Array.isArray(notificationsData) ? notificationsData : [])
      setUnreadCount(unreadData?.count || 0)
      
      console.log('✅ Notifications chargées:', notificationsData?.length || 0)
    } catch (error) {
      console.error('❌ Erreur lors du chargement des notifications:', error)
      // Réinitialiser avec des valeurs sûres en cas d'erreur
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationService.markAsRead(id)
      
      // Mise à jour optimiste de l'état local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      )
      
      // Recalculer le nombre non lus
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error)
      // Recharger les données en cas d'erreur
      await fetchNotifications()
    }
  }, [fetchNotifications])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()
      
      // Mise à jour optimiste
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error)
      await fetchNotifications()
    }
  }, [fetchNotifications])

  const deleteNotification = useCallback(async (id: number) => {
    try {
      const notificationToDelete = Array.isArray(notifications) 
        ? notifications.find(n => n.id === id)
        : null
      
      await notificationService.deleteNotification(id)
      
      // Mise à jour optimiste
      setNotifications(prev => Array.isArray(prev) ? prev.filter(notif => notif.id !== id) : [])
      
      // Si la notification supprimée n'était pas lue, décrémenter le compteur
      if (notificationToDelete && !notificationToDelete.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      await fetchNotifications()
    }
  }, [notifications, fetchNotifications])

  const refreshNotifications = useCallback(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Chargement initial
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Polling pour les mises à jour en temps réel
  useEffect(() => {
    if (pollingInterval <= 0) return

    const interval = setInterval(() => {
      fetchNotifications()
    }, pollingInterval)

    return () => clearInterval(interval)
  }, [fetchNotifications, pollingInterval])

  // Gestion de la visibilité de la page pour éviter le polling en arrière-plan
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [fetchNotifications])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications doit être utilisé dans un NotificationProvider')
  }
  return context
}
