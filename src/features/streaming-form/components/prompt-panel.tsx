'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  IconArrowUp,
  IconCloud,
  IconFileAnalytics,
  IconFileCertificate,
  IconFileSpark,
} from '@tabler/icons-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const PROMPTS = [
  {
    icon: IconFileSpark,
    text: 'Formulario de contacto',
    prompt:
      'Genera un formulario de contacto con nombre, correo electrónico y un mensaje de texto. Todos los campos requeridos con validación de email.',
  },
  {
    icon: IconFileCertificate,
    text: 'Registro de usuarios',
    prompt:
      'Crea un formulario de registro con nombre de usuario (mínimo 3 caracteres), correo electrónico, contraseña segura (mínimo 8 caracteres, mayúscula y número), selección de rol (usuario, editor, admin) y un switch para aceptar términos y condiciones.',
  },
  {
    icon: IconFileAnalytics,
    text: 'Configurador de producto',
    prompt:
      'Genera un formulario para configurar un producto con: nombre del producto (texto con icono), categoría (select: electrónicos, ropa, hogar), talla (radio: S, M, L, XL), cantidad (number stepper, min 1 max 10), garantía extendida (switch), etiquetas (multi-select: nuevo, oferta, popular), presupuesto máximo (slider 0-1000), comentarios (textarea con límite de 300 caracteres) y fecha de entrega (masked-time). Los selects y grupos deben ocupar 12 columnas.',
  },
]

interface PromptPanelProps {
  prompt: string
  onPromptChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  submitLabel?: string
  message?: string | null
  messageVariant?: 'muted' | 'destructive'
}

export function PromptPanel({
  prompt,
  onPromptChange,
  onSubmit,
  disabled,
  message,
  messageVariant,
}: PromptPanelProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handlePromptClick = (promptText: string) => {
    onPromptChange(promptText)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {message && (
        <p
          className={
            messageVariant === 'destructive'
              ? 'text-sm text-destructive'
              : 'text-sm text-muted-foreground'
          }
        >
          {message}
        </p>
      )}

      <div className="flex min-h-[120px] flex-col rounded-2xl cursor-text dark:bg-[#1A1A1A] dark:shadow-lg dark:border-3 dark:border-[#0C0C0C]">
        <div className="flex-1 relative overflow-y-auto max-h-[258px]">
          <Textarea
            ref={inputRef}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe el formulario que quieres crear..."
            className="w-full border-0 p-4 transition-[padding] duration-200 ease-in-out min-h-[48.4px] outline-none text-[16px] text-foreground resize-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent! whitespace-pre-wrap break-words"
          />
        </div>

        <div className="flex min-h-[40px] items-center gap-2 p-4">
          <div className="flex aspect-1 items-center gap-1 rounded-full bg-muted p-1.5 text-xs shadow-lg">
            <IconCloud className="h-4 w-4 text-muted-foreground shadow-lg" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn(
                'rounded-full transition-colors duration-100 ease-out cursor-pointer bg-primary',
                prompt && 'bg-primary hover:bg-primary/90!'
              )}
              disabled={disabled || !prompt.trim()}
              aria-label="Send message"
              onClick={onSubmit}
            >
              <IconArrowUp className="h-4 w-4 text-primary-foreground" />
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        className="flex flex-wrap justify-center gap-2"
        variants={{
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
        }}
        initial="hidden"
        animate="visible"
      >
        {PROMPTS.map(({ icon: Icon, text, prompt: promptText }) => (
          <motion.div
            key={text}
            variants={{
              hidden: { opacity: 0, filter: 'blur(8px)', scale: 0.8 },
              visible: {
                opacity: 1,
                filter: 'blur(0px)',
                scale: 1,
                transition: { duration: 0.4, ease: 'easeOut' },
              },
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Button
              variant="ghost"
              className="cursor-pointer group flex items-center gap-2 rounded-full px-3 py-2 text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/30 h-auto bg-transparent dark:bg-[#1A1A1A] dark:shadow-lg dark:border-2 dark:border-[#0C0C0C]"
              onClick={() => handlePromptClick(promptText)}
            >
              <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              <span>{text}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
