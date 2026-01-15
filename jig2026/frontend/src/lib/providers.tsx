'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { ToasterWrapper } from '@/components/ToasterWrapper'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
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
      {children}
      <ToasterWrapper />
    </QueryClientProvider>
  )
}