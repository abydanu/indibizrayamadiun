'use client'

import { useTheme } from '@/contexts/theme-provider'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface ThemeLogoProps {
  width?: number
  height?: number
  className?: string
  alt?: string
}

export function ThemeLogo({ 
  width = 120, 
  height = 120, 
  className = '',
  alt = 'indibiz'
}: ThemeLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <Image
        src="/logo_indibiz.svg"
        alt={alt}
        width={width}
        height={height}
        className={`${className} object-contain`}
        priority
        style={{ 
          width: 'auto', 
          height: 'auto',
          maxWidth: `${width}px`,
          maxHeight: `${height}px`
        }}
      />
    )
  }
  
  const isDark = resolvedTheme === 'dark'
  const logoSrc = isDark ? '/logo_indibiz_dark.svg' : '/logo_indibiz.svg'
  
  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} object-contain`}
      priority
      style={{ 
        width: 'auto', 
        height: 'auto',
        maxWidth: `${width}px`,
        maxHeight: `${height}px`
      }}
    />
  )
}
