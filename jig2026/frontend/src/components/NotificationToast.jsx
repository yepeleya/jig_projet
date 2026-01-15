'use client'

import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Composant de notification réutilisable
 */
export default function NotificationToast({ notification, onClose }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <FaCheckCircle className="w-5 h-5 mr-3 text-green-600" />
      case 'error':
        return <FaExclamationTriangle className="w-5 h-5 mr-3 text-red-600" />
      case 'info':
        return <FaInfoCircle className="w-5 h-5 mr-3 text-blue-600" />
      default:
        return <FaInfoCircle className="w-5 h-5 mr-3 text-gray-600" />
    }
  }

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 shadow-green-100'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 shadow-red-100'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 shadow-gray-100'
    }
  }

  return (
    <AnimatePresence>
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ 
            type: 'spring', 
            stiffness: 400, 
            damping: 25,
            duration: 0.3
          }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className={`
            p-4 rounded-lg border-l-4 shadow-lg backdrop-blur-sm
            ${getStyles()}
          `}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getIcon()}
                <span className="font-medium text-sm leading-relaxed">
                  {notification.message}
                </span>
              </div>
              <button
                onClick={onClose}
                className="ml-4 p-1 rounded-full hover:bg-white/50 transition-colors duration-200"
                aria-label="Fermer la notification"
              >
                <FaTimes className="w-3 h-3 opacity-70 hover:opacity-100" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}