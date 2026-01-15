'use client'

import { Toaster } from 'react-hot-toast'
import { HydrationWrapper } from './HydrationWrapper'

interface ToasterWrapperProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

/**
 * Wrapper pour le Toaster qui évite les erreurs d'hydratation
 */
export function ToasterWrapper({ position = 'top-right' }: ToasterWrapperProps) {
  return (
    <HydrationWrapper>
      <Toaster
        position={position}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </HydrationWrapper>
  )
}