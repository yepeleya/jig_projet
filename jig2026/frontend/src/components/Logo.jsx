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
    ? '/logo/logo_blanc.png'
    : '/logo/logo_rouge.jpeg'

  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={logoSrc}
        alt=""
        width={300}
        height={120}
        className={`${sizeClasses[size]} object-contain`}
        priority
      />
    </div>
  )
}