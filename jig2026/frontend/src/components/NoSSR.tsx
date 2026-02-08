'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

interface NoSSRProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const NoSSR = ({ children, fallback = null }: NoSSRProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Exporter comme composant dynamique pour éviter complètement SSR
export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false
})