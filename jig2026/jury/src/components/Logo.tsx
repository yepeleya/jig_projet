'use client'

import Image from 'next/image'

interface LogoProps {
  variant?: 'red' | 'white'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-auto',
  md: 'h-12 w-auto',
  lg: 'h-16 w-auto',
  xl: 'h-24 w-auto'
}

export function Logo({ variant = 'red', size = 'md', className = '' }: LogoProps) {
  const logoSrc = variant === 'white' 
    ? '/logo/logo_blanc.jpeg'
    : '/logo/logo_rouge.jpeg'

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={logoSrc}
        alt="JIG 2026 - Journée de l'Infographiste"
        width={200}
        height={80}
        className={`${sizeClasses[size]} object-contain`}
        priority
        unoptimized
      />
    </div>
  )
}