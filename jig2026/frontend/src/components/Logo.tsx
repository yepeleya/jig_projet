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
    ? '/uploads/logo/logo_blanc.png'
    : '/uploads/logo/logo_rouge.png'

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={`${backendUrl}${logoSrc}`}
        alt="JIG 2026 - ISTC Polytechnique"
        width={80}
        height={80}
        className={`${sizeClasses[size]} object-contain`}
        priority
        onError={(e) => {
          // Fallback en cas d'erreur de chargement
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          if (target.parentElement) {
            target.parentElement.innerHTML = `
              <div class="flex items-center justify-center ${sizeClasses[size]} bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-bold text-lg">
                JIG
              </div>
            `
          }
        }}
      />
    </div>
  )
}