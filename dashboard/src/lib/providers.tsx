'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { NotificationProvider } from '@/providers/NotificationProvider'
import { useHydrationFix } from '@/hooks/useHydrationFix'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  // Utiliser le hook pour corriger les problèmes d'hydratation
  useHydrationFix()
  
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          refetchOnWindowFocus: false,
          retry: (failureCount, error) => {
            if (error && typeof error === 'object' && 'status' in error) {
              const status = (error as { status: number }).status
              if (status >= 400 && status < 500) return false
            }
            return failureCount < 3
          },
        },
      },
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        {children}
        <Toaster position="top-right" />
      </NotificationProvider>
    </QueryClientProvider>
  )
}