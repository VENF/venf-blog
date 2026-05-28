'use client'

import { motion, AnimatePresence } from 'motion/react'
import { AlertCircle } from 'lucide-react'
import type { CapturerState } from './types'

type Props = {
  capturerState: CapturerState
  hasStarted: boolean
  transcript: string
  interim: string
  isSupported: boolean
}

export function TranscriptDisplay({
  capturerState,
  hasStarted,
  transcript,
  interim,
  isSupported,
}: Props) {
  if (!isSupported) {
    return (
      <p className="flex items-center gap-2 text-sm text-red-400">
        <AlertCircle className="size-4 shrink-0" />
        La captura de voz no está disponible en este navegador.
      </p>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {capturerState === 'capturing' || capturerState === 'paused' ? (
        <motion.p
          key="active"
          initial={hasStarted ? { opacity: 0, x: -20 } : false}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {transcript}
          {capturerState === 'capturing' && interim && (
            <span className="opacity-50">{interim}</span>
          )}
        </motion.p>
      ) : (
        <motion.p
          key="idle"
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="text-[#525355]"
        >
          {transcript || 'Presiona el botón de play para comenzar a capturar'}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
