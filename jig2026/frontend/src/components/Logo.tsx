'use client'

import React from 'react'
import Image from 'next/image'
import { useHydration } from '@/hooks/useHydration'

interface LogoProps {
  variant?: 'white' | 'red' | 'black'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Logo({ variant = 'red', size = 'md', className = '' }: LogoProps) {
  const isHydrated = useHydration()
  
  // Supprimer l'attribut bis_skin_checked pour éviter l'avertissement
  React.useEffect(() => {
    const elements = document.querySelectorAll('[bis_skin_checked]')
    elements.forEach(el => el.removeAttribute('bis_skin_checked'))
  }, [])
  
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto', 
    lg: 'h-16 w-auto',
    xl: 'h-20 w-auto'
  }

  const logoSrc = variant === 'white' 
    ? '/logo/logo_blanc.png'
    : '/logo/logo_rouge.jpeg'

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={logoSrc}
        alt="JIG 2026 - ISTC Polytechnique"
        width={300}
        height={120}
        className={`${sizeClasses[size]} object-contain`}
        priority
      />
    </div>
  )
}