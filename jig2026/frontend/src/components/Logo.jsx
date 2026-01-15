'use client'

import Image from 'next/image'

const sizeClasses = {
  sm: 'h-12 w-auto',
  md: 'h-16 w-auto', 
  lg: 'h-20 w-auto',
  xl: 'h-32 w-auto'
}

export default function Logo({ variant = 'red', size = 'md', className = '' }) {
  const logoSrc = variant === 'white' 
    ? 'http://localhost:5000/uploads/logo/logo_blanc.png'
    : 'http://localhost:5000/uploads/logo/logo_rouge.png'

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={logoSrc}
        alt="JIG 2026 - Journée de l'Infographiste"
        width={300}
        height={120}
        className={`${sizeClasses[size]} object-contain`}
        priority
      />
    </div>
  )
}