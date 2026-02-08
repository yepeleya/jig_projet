'use client'

import dynamic from 'next/dynamic'
import { ReactNode, useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

const ClientOnlyInternal = ({ children }: ClientOnlyProps) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}

// Exporter en tant que composant dynamique sans SSR
export default dynamic(() => Promise.resolve(ClientOnlyInternal), {
  ssr: false,
  loading: () => null
})