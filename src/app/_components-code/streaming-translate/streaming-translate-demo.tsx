'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { Download } from 'lucide-react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/animate-ui/components/radix/tooltip'
import { Button } from '@/components/ui/button'
import { LiveCapturer } from './live-capturer'
import { LanguageGroup } from './language-group'
import { RecordButton } from './record-button'
import { TimerDisplay } from './timer-display'
import { TranscriptDisplay } from './transcript-display'
import { useTimer } from './use-timer'
import type { CapturerState } from './types'
import { useSpeechRecognition } from '@/lib/use-speech-recognition'

export function StreamingTranslateDemo() {
  const [capturerState, setCapturerState] = useState<CapturerState>('idle')
  const { transcript, interim, start, stop, reset, isSupported } = useSpeechRecognition()
  const [hasStarted, setHasStarted] = useState(false)
  const { elapsed, resetTimer } = useTimer(capturerState === 'capturing')

  const handleToggle = () => {
    if (!isSupported) return
    setHasStarted(true)
    if (capturerState === 'capturing') {
      stop()
      setCapturerState('paused')
    } else {
      start()
      setCapturerState('capturing')
    }
  }

  const handleReset = () => {
    stop()
    setHasStarted(false)
    setCapturerState('idle')
    resetTimer()
    reset()
  }

  return (
    <div className="mt-10 sm:mt-[100px] w-[450px] p-5 space-y-2">
      <div className="border-2 p-1 w-full dark:border-[#111214] rounded-[20px]">
        <Card className="dark:bg-[#0C0C0C] shadow-lg border-none">
          <CardHeader className="flex items-center justify-between">
            <RecordButton capturerState={capturerState} onToggle={handleToggle} />
            <LiveCapturer capturerState={capturerState} />
            <TimerDisplay capturerState={capturerState} elapsed={elapsed} onReset={handleReset} />
          </CardHeader>
        </Card>
      </div>

      <div className="border-2 p-1 w-full max-w-[450px] dark:border-[#111214] rounded-[20px]">
        <Card className="dark:bg-[#0C0C0C] shadow-lg border-none">
          <CardHeader>
            <CardDescription className="text-white">
              Toma notas
              <div className="flex items-center justify-between">
                <LanguageGroup />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="bg-transparent cursor-pointer" size="icon">
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
            <TranscriptDisplay
              capturerState={capturerState}
              hasStarted={hasStarted}
              transcript={transcript}
              interim={interim}
              isSupported={isSupported}
            />
          </CardContent>
          <CardFooter className="dark:bg-[#0C0C0C] dark:border-[#111214]">
            <Button className="cursor-pointer bg-transparent text-white">Ver traduccion</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
