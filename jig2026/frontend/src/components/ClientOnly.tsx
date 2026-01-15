'use client'

import { ReactNode, useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: ReactNode
}

export default function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHasMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}