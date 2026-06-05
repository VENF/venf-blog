import { Label } from '@/components/ui/label'

import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import type { FormValues } from '../view/quote-form-section'
import { ComboboxSelect } from '@/components/ui/combobox-select'

interface Props {
  control: Control<FormValues>
  errors: FieldErrors<FormValues>
  selectedCompany: string
  filteredPlans: string[]
  availableSums: number[]
  companies: string[]
}

function formatUSD(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export function PlanSelector({
  control,
  errors,
  selectedCompany,
  filteredPlans,
  availableSums,
  companies,
}: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          <Label htmlFor="company">Compañía</Label>
          <Controller
            name="company"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <ComboboxSelect
                id="company"
                value={field.value}
                onValueChange={field.onChange}
                items={companies}
                placeholder="Seleccionar compañía"
              />
            )}
          />
          {errors.company && (
            <span className="text-xs text-destructive">Selecciona una compañía</span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="plan">Plan</Label>
          <Controller
            name="plan"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <ComboboxSelect
                id="plan"
                value={field.value}
                onValueChange={field.onChange}
                items={filteredPlans}
                placeholder="Seleccionar plan"
                disabled={!selectedCompany}
              />
            )}
          />
          {errors.plan && <span className="text-xs text-destructive">Selecciona un plan</span>}
        </div>
      </div>

      {filteredPlans.length > 0 && (
        <div className="flex flex-col gap-3">
          <Label htmlFor="sumInsured">Suma asegurada</Label>
          <Controller
            name="sumInsured"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <ComboboxSelect
                id="sumInsured"
                value={field.value ? String(field.value) : ''}
                onValueChange={(val) => field.onChange(Number(val))}
                items={availableSums.map(String)}
                placeholder="Seleccionar suma"
                renderItem={(item) => formatUSD(Number(item))}
              />
            )}
          />
          {errors.sumInsured && (
            <span className="text-xs text-destructive">Selecciona una suma</span>
          )}
        </div>
      )}
    </>
  )
}
