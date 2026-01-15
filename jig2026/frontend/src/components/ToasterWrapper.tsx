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
            background: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#9E1B32',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fff',
            },
          },
        }}
      />
    </HydrationWrapper>
  )
}