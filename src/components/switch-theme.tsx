'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { BlackSunWithRaysIcon } from './icons/Sun'
import { Moon, Sun } from 'lucide-react'

export function SwitchTheme() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" className="border-none bg-transparent" size="icon" disabled>
        <BlackSunWithRaysIcon size={20} />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isLight = theme === 'light'

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      className="cursor-pointer border-none !bg-transparent"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isLight ? 'sun' : 'moon'}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {isLight ? <Sun size={20} /> : <Moon size={20} />}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
