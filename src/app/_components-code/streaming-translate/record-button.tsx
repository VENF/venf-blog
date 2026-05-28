'use client'

import { motion } from 'motion/react'
import { PauseIcon, PlayIcon } from 'lucide-react'
import type { CapturerState } from './types'

type Props = {
  capturerState: CapturerState
  onToggle: () => void
}

export function RecordButton({ capturerState, onToggle }: Props) {
  return (
    <motion.button
      onClick={onToggle}
      className="inline-block p-3 rounded-full border-2 cursor-pointer"
      animate={
        capturerState === 'capturing'
          ? {
              backgroundColor: '#dc2626',
              borderColor: '#dc2626',
              boxShadow: [
                '0 0 15px rgba(220,38,38,0.4)',
                '0 0 30px rgba(220,38,38,0.7)',
                '0 0 15px rgba(220,38,38,0.4)',
              ],
            }
          : {
              backgroundColor: '#151719',
              borderColor: '#111214',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
            }
      }
      transition={
        capturerState === 'capturing'
          ? {
              backgroundColor: { duration: 0.3, ease: 'easeInOut' },
              borderColor: { duration: 0.3, ease: 'easeInOut' },
              boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }
          : { duration: 0.3, ease: 'easeInOut' }
      }
    >
      {capturerState === 'capturing' ? (
        <PauseIcon className="size-5 stroke-white" />
      ) : (
        <PlayIcon className="size-5 stroke-white" />
      )}
    </motion.button>
  )
}
