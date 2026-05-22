import { useMemo } from 'react'
import type { FlowStatus } from '../stores/flow-store'
import { ConnectingIcon } from '@/components/icons/ConnectingIcon'
import { AnalyzingIcon } from '@/components/icons/AnalyzingIcon'
import { FeedbackIcon } from '@/components/icons/WaitingFeedback'
import { GeneratingIcon } from '@/components/icons/generating'
import { ValidatingIcon } from '@/components/icons/Validating'
import { InteractiveIcon } from '@/components/icons/Interactive'
import { SubmittingIcon } from '@/components/icons/Submitting'
import { CompleteIcon } from '@/components/icons/Complete'
import { ErrorIcon } from '@/components/icons/Error'
import type { ComponentType, SVGProps } from 'react'

interface StateIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  stop?: boolean
  className?: string
}

interface StateLabel {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  icon: ComponentType<StateIconProps>
  color: string
  stop: boolean
}

const STATE_LABELS: Record<FlowStatus, StateLabel> = {
  idle: {
    label: 'Idle',
    variant: 'outline',
    icon: ConnectingIcon,
    stop: false,
    color: 'text-white',
  },
  connecting: {
    label: 'Connecting',
    variant: 'secondary',
    icon: ConnectingIcon,
    stop: false,
    color: 'text-white',
  },
  analyzing: {
    label: 'Analyzing',
    variant: 'secondary',
    icon: AnalyzingIcon,
    stop: false,
    color: 'text-white',
  },
  waiting_feedback: {
    label: 'Needs Info',
    variant: 'outline',
    icon: FeedbackIcon,
    stop: false,
    color: 'text-white',
  },
  generating: {
    label: 'Generating',
    variant: 'default',
    icon: GeneratingIcon,
    stop: false,
    color: 'text-white',
  },
  validating: {
    label: 'Validating',
    variant: 'secondary',
    icon: ValidatingIcon,
    stop: false,
    color: 'text-white',
  },
  interactive: {
    label: 'Ready',
    variant: 'outline',
    icon: InteractiveIcon,
    stop: false,
    color: 'text-white',
  },
  submitting: {
    label: 'Submitting',
    variant: 'secondary',
    icon: SubmittingIcon,
    stop: false,
    color: 'text-white',
  },
  complete: {
    label: 'Complete',
    variant: 'outline',
    icon: CompleteIcon,
    stop: false,
    color: 'text-white',
  },
  error: {
    label: 'Error',
    variant: 'destructive',
    icon: ErrorIcon,
    stop: false,
    color: 'text-white',
  },
}

const STATE_MESSAGES: Record<FlowStatus, string> = {
  idle: 'Describe el formulario que quieres crear.',
  connecting: 'Estableciendo conexión con la IA...',
  analyzing: 'Analizando tu solicitud y definiendo campos...',
  waiting_feedback: 'La IA necesita más detalles para crear el formulario.',
  generating: 'Generando campos del formulario en tiempo real...',
  validating: 'Validando el esquema del formulario generado...',
  interactive: 'Formulario listo. Completa los campos a continuación.',
  submitting: 'Enviando tu respuesta...',
  complete: 'Formulario enviado con éxito.',
  error: 'Algo salió mal.',
}

export function useFormFlowDisplay(state: FlowStatus) {
  const badgeInfo = useMemo(
    () =>
      STATE_LABELS[state] ?? {
        label: state,
        variant: 'outline',
        icon: (() => null) as unknown as ComponentType<StateIconProps>,
        color: '',
        stop: false,
      },
    [state]
  )

  const statusMessage = useMemo(() => STATE_MESSAGES[state] ?? '', [state])

  return {
    badgeInfo,
    statusMessage,
    isActive: state !== 'idle' && state !== 'complete' && state !== 'error',
    showForm:
      state === 'generating' ||
      state === 'validating' ||
      state === 'interactive' ||
      state === 'submitting' ||
      state === 'complete',
    showPrompt: state === 'idle' || state === 'error',
  }
}
