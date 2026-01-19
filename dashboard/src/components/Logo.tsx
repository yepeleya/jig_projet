'use client'

import Image from 'next/image'

const sizeClasses = {
  sm: 'h-12 w-auto',
  md: 'h-16 w-auto', 
  lg: 'h-20 w-auto',
  xl: 'h-32 w-auto'
}

interface LogoProps {
  variant?: 'red' | 'white'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Logo({ variant = 'red', size = 'md', className = '' }: LogoProps) {
  const logoSrc = variant === 'white' 
    ? '/logo/logo_blanc.jpeg'
    : '/logo/logo_rouge.jpeg'

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={logoSrc}
        alt="JIG 2026 - Journée de l'Infographiste"
        width={300}
        height={120}
        className={`${sizeClasses[size]} object-contain`}
        priority
        unoptimized
      />
    </div>
  )
}