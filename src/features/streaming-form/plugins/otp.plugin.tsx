import { z } from 'zod'
import { useId, useState, useEffect, useCallback, useRef } from 'react'
import type { FieldPlugin, FieldDef, FieldProps } from './types'
import { Skeleton } from '@/components/ui/skeleton'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { FieldWrapper } from '../components/field-wrapper'

function OtpInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const metadata = field.metadata as Record<string, unknown> | undefined
  const slots = (metadata?.slots as number) ?? 4
  const resendAfter = (metadata?.resendAfter as number) ?? 0
  const [timer, setTimer] = useState(resendAfter)
  const canResend = timer <= 0
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  useEffect(() => {
    if (resendAfter <= 0) return
    if (timer <= 0) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(intervalRef.current)
  }, [timer, resendAfter])

  const handleResend = useCallback(() => {
    setTimer(resendAfter)
  }, [resendAfter])

  const splitAt = slots === 6 ? 3 : slots === 4 ? 2 : 0

  return (
    <FieldWrapper field={field} error={error}>
      <InputOTP
        id={id}
        maxLength={slots}
        value={(value as string) ?? ''}
        onChange={(val) => onChange(val)}
        aria-invalid={!!error}
      >
        {splitAt > 0 ? (
          <>
            <InputOTPGroup>
              {Array.from({ length: splitAt }, (_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              {Array.from({ length: slots - splitAt }, (_, i) => (
                <InputOTPSlot key={i + splitAt} index={i + splitAt} />
              ))}
            </InputOTPGroup>
          </>
        ) : (
          <InputOTPGroup>
            {Array.from({ length: slots }, (_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        )}
      </InputOTP>
      {resendAfter > 0 && (
        <div className="flex items-center gap-2">
          {canResend ? (
            <Button type="button" variant="link" size="sm" onClick={handleResend}>
              Reenviar código
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">Reenviar en {timer}s</span>
          )}
        </div>
      )}
    </FieldWrapper>
  )
}

function OtpSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <div className="flex gap-2">
        <Skeleton className="size-10" />
        <Skeleton className="size-10" />
        <Skeleton className="size-10" />
        <Skeleton className="size-10" />
      </div>
    </div>
  )
}

export const otpPlugin: FieldPlugin = {
  type: 'otp',
  component: OtpInput,
  skeleton: OtpSkeleton,
  buildSchema: (def: FieldDef) => {
    const slots = (def.metadata?.slots as number) ?? 4
    let schema = z.string().length(slots, `Debe tener exactamente ${slots} dígitos`)
    if (def.required) schema = schema
    return schema
  },
  defaultValue: '',
}
