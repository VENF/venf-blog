import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Controller } from 'react-hook-form'
import type { UseFormRegister, Control, FieldErrors } from 'react-hook-form'
import type { FormValues } from '../view/quote-form-section'

interface Props {
  register: UseFormRegister<FormValues>
  control: Control<FormValues>
  errors: FieldErrors<FormValues>
  includesMaternity: boolean
  showMaternity: boolean
}

export function MaternityOptions({ register, control, includesMaternity, showMaternity }: Props) {
  if (!showMaternity) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Controller
          name="includesMaternity"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="includesMaternity"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <label htmlFor="includesMaternity" className="text-sm">
          Incluir maternidad
        </label>
      </div>

      {includesMaternity && (
        <div className="flex flex-col gap-3 pl-6">
          <Label htmlFor="maternitySum">Suma de maternidad</Label>
          <Input
            id="maternitySum"
            type="number"
            {...register('maternitySum', { required: includesMaternity })}
            placeholder="Ej: 10000"
          />
        </div>
      )}
    </div>
  )
}
