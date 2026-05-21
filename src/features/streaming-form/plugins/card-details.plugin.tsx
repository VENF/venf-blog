import { z } from 'zod'
import { useId } from 'react'
import type { FieldPlugin, FieldProps } from './types'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { usePaymentInputs } from 'react-payment-inputs'
import { CreditCard } from 'lucide-react'

function CardDetailsInput({ field, value, onChange, error }: FieldProps) {
  const id = useId()
  const val = (value as { cardNumber?: string; expiry?: string; cvc?: string }) ?? {}
  const { getCardNumberProps, getExpiryDateProps, getCVCProps, wrapperProps, meta } =
    usePaymentInputs()

  return (
    <div className="flex flex-col gap-2">
      <Label id={id}>{field.label}</Label>
      <div role="group" aria-labelledby={id} {...wrapperProps} className="flex flex-col gap-2">
        <div className="relative">
          <Input
            {...getCardNumberProps()}
            value={val.cardNumber ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({ ...val, cardNumber: e.target.value })
            }
            placeholder="Número de tarjeta"
            className="pr-9"
          />
          <CreditCard className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        {meta.erroredInputs?.cardNumber && (
          <p className="text-sm text-destructive">{meta.erroredInputs.cardNumber}</p>
        )}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              {...getExpiryDateProps()}
              value={val.expiry ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({ ...val, expiry: e.target.value })
              }
              placeholder="MM/YY"
            />
            {meta.erroredInputs?.expiryDate && (
              <p className="text-sm text-destructive">{meta.erroredInputs.expiryDate}</p>
            )}
          </div>
          <div className="flex-1">
            <Input
              {...getCVCProps()}
              value={val.cvc ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({ ...val, cvc: e.target.value })
              }
              placeholder="CVC"
            />
            {meta.erroredInputs?.cvc && (
              <p className="text-sm text-destructive">{meta.erroredInputs.cvc}</p>
            )}
          </div>
        </div>
      </div>
      {!meta.erroredInputs && error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function CardDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
    </div>
  )
}

export const cardDetailsPlugin: FieldPlugin = {
  type: 'card-details',
  component: CardDetailsInput,
  skeleton: CardDetailsSkeleton,
  buildSchema: () => {
    return z.object({
      cardNumber: z.string().min(1, 'Required'),
      expiry: z.string().min(1, 'Required'),
      cvc: z.string().min(1, 'Required'),
    })
  },
  defaultValue: { cardNumber: '', expiry: '', cvc: '' },
}
