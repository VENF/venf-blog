'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  AvatarGroup,
  AvatarGroupTooltip,
  AvatarGroupTooltipArrow,
} from '@/components/animate-ui/primitives/animate/avatar-group'
import { motion } from 'motion/react'

const languages = [
  {
    src: 'https://flagcdn.com/us.svg',
    fallback: 'EN',
    tooltip: 'English',
  },
  {
    src: 'https://flagcdn.com/es.svg',
    fallback: 'ES',
    tooltip: 'Español',
  },
]

export function LanguageGroup() {
  return (
    <div className="flex items-center gap-2">
      <AvatarGroup className="h-12 -space-x-3" invertOverlap>
        {languages.map((avatar, index) => (
          <Avatar key={index} className="size-8 border-3 border-2">
            <AvatarImage src={avatar.src} />
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
            <AvatarGroupTooltip className="bg-primary px-3 py-1.5 text-sm text-primary-foreground rounded-full">
              <AvatarGroupTooltipArrow className="fill-primary size-2.5" />
              <motion.p layout="preserve-aspect">{avatar.tooltip}</motion.p>
            </AvatarGroupTooltip>
          </Avatar>
        ))}
      </AvatarGroup>
      <div>
        <p>{languages.length} Idiomas</p>
      </div>
    </div>
  )
}
