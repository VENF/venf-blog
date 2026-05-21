declare module 'react-payment-inputs' {
  import type { InputHTMLAttributes } from 'react'

  interface ErroredInputs {
    cardNumber?: string
    expiryDate?: string
    cvc?: string
    zip?: string
  }

  interface UsePaymentInputsOptions {
    autoFocus?: boolean
    errorMessages?: Record<string, string>
    onBlur?: (input: string, event: React.FocusEvent<HTMLInputElement>) => void
    onChange?: (input: string, event: React.ChangeEvent<HTMLInputElement>) => void
    onError?: (error: string | undefined, erroredInputs: ErroredInputs) => void
    onTouch?: (input: string, event: React.FocusEvent<HTMLInputElement>) => void
    cardNumberValidator?: (options: { cardNumber: string }) => string | undefined
    cvcValidator?: (options: { cvc: string }) => string | undefined
    expiryValidator?: (options: { expiry: string }) => string | undefined
  }

  interface UsePaymentInputsReturn {
    getCardNumberProps: (props?: Record<string, unknown>) => InputHTMLAttributes<HTMLInputElement>
    getExpiryDateProps: (props?: Record<string, unknown>) => InputHTMLAttributes<HTMLInputElement>
    getCVCProps: (props?: Record<string, unknown>) => InputHTMLAttributes<HTMLInputElement>
    wrapperProps: Record<string, unknown>
    meta: {
      erroredInputs: ErroredInputs
      touchedInputs: Record<string, boolean>
    }
  }

  export function usePaymentInputs(options?: UsePaymentInputsOptions): UsePaymentInputsReturn

  export const PaymentInputsContainer: React.FC<{
    children: (props: UsePaymentInputsReturn) => React.ReactNode
    errorMessages?: Record<string, string>
  }>

  export const PaymentInputsWrapper: React.FC<{
    children: React.ReactNode
    [key: string]: unknown
  }>
}
