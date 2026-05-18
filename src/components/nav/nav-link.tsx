'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

interface NavLinkProps {
  href: string
  label: string
  icon: React.ElementType
  isActive: boolean
  isExternal?: boolean
}

export function NavLink({ href, label, icon: Icon, isActive, isExternal }: NavLinkProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <NavigationMenuLink asChild active={isActive}>
      <Link
        href={href}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg transition-all !bg-transparent',
          isActive ? 'text-foreground ' : 'text-muted-foreground'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        <motion.div
          animate={isHovered ? { scale: 1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
          <Icon size={20} />
        </motion.div>
        <span>{label}</span>
      </Link>
    </NavigationMenuLink>
  )
}
