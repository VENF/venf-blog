import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { Controller } from 'react-hook-form'
import type { UseFormRegister, Control, FieldErrors } from 'react-hook-form'
import type { FormValues } from '../view/quote-form-section'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Mail, User2 } from 'lucide-react'

interface Props {
  register: UseFormRegister<FormValues>
  control: Control<FormValues>
  errors: FieldErrors<FormValues>
}

export function PersonalInfo({ register, control, errors }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          <Label htmlFor="applicant">Nombre del solicitante</Label>
          <InputGroup className="">
            <InputGroupInput
              id="applicant"
              {...register('applicant', { required: true })}
              placeholder="Ej: María Pérez"
            />
            <InputGroupAddon align="inline-end">
              <User2 className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          {errors.applicant && <span className="text-xs text-destructive">Campo requerido</span>}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Correo electrónico</Label>
          <InputGroup className="">
            <InputGroupInput
              id="email"
              type="email"
              {...register('email', {
                required: true,
                pattern: /^\S+@\S+\.\S+$/,
              })}
              placeholder="correo@ejemplo.com"
            />
            <InputGroupAddon align="inline-end">
              <Mail className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          {errors.email?.type === 'required' && (
            <span className="text-xs text-destructive">Campo requerido</span>
          )}
          {errors.email?.type === 'pattern' && (
            <span className="text-xs text-destructive">Correo electrónico inválido</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="phone">Teléfono</Label>
        <Controller
          name="phone"
          control={control}
          rules={{ required: true, minLength: 10 }}
          render={({ field }) => (
            <PhoneInput
              id="phone"
              value={field.value}
              onChange={field.onChange}
              placeholder="Número de teléfono"
              defaultCountry="VE"
            />
          )}
        />
        {errors.phone?.type === 'required' && (
          <span className="text-xs text-destructive">Campo requerido</span>
        )}
        {errors.phone?.type === 'minLength' && (
          <span className="text-xs text-destructive">Mínimo 10 dígitos</span>
        )}
      </div>
    </div>
  )
}
