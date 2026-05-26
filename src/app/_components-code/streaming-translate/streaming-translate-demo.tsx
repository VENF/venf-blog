'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertCircle, Download, PauseIcon, PlayIcon, RotateCcw } from 'lucide-react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/animate-ui/components/radix/tooltip'
import { Button } from '@/components/ui/button'
import { LiveCapturer } from './live-capturer'
import { LanguageGroup } from './language-group'
import type { CapturerState } from './types'
import { useSpeechRecognition } from '@/lib/use-speech-recognition'

function formatTimer(ms: number): string {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const millis = ms % 1000
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`
}

export function StreamingTranslateDemo() {
  const [capturerState, setCapturerState] = useState<CapturerState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const { transcript, interim, start, stop, reset, isSupported } = useSpeechRecognition()
  const elapsedRef = useRef(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (capturerState === 'capturing') start()
    else stop()
  }, [capturerState, start, stop])

  useEffect(() => {
    if (capturerState !== 'capturing') return

    const startTime = Date.now() - elapsedRef.current
    const id = setInterval(() => {
      elapsedRef.current = Date.now() - startTime
      setElapsed(elapsedRef.current)
    }, 100)
    return () => clearInterval(id)
  }, [capturerState])

  const handleToggle = () => {
    if (!isSupported) return
    setHasStarted(true)
    if (capturerState === 'capturing') {
      setCapturerState('paused')
    } else {
      setCapturerState('capturing')
    }
  }

  const handleReset = () => {
    setHasStarted(false)
    setCapturerState('idle')
    setElapsed(0)
    elapsedRef.current = 0
    reset()
  }

  return (
    <div className="border-2 p-1 mt-10 sm:mt-[100px] w-full max-w-[400px] border-[#111214] rounded-[20px]">
      <Card className="bg-[#0C0C0C] shadow-lg border-none">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleToggle}
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
                        boxShadow:
                          '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
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
              {capturerState !== 'idle' && (
                <span className="text-sm tabular-nums text-muted-foreground">
                  {formatTimer(elapsed)}
                </span>
              )}
              {capturerState !== 'idle' && (
                <button
                  onClick={handleReset}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-4 stroke-white/60" />
                </button>
              )}
            </div>
          </CardTitle>
          <div>
            <LiveCapturer capturerState={capturerState} />
          </div>
          <CardDescription className="text-white">
            Toma notas
            <div className="flex items-center justify-between">
              <LanguageGroup />
              <Tooltip>
                <TooltipTrigger>
                  <Button className="bg-transparent cursor-pointer" size="icon-lg">
                    <Download className="stroke-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Descargar Nota</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-[60px]">
          {!isSupported ? (
            <p className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="size-4 shrink-0" />
              La captura de voz no está disponible en este navegador.
            </p>
          ) : (
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
          )}
        </CardContent>
        <CardFooter className="bg-[#0C0C0C] border-[#111214]">
          <Button className="cursor-pointer bg-transparent text-white">Ver traduccion</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
