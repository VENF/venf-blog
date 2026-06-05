'use client'

import type { ReactNode } from 'react'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'

interface Props {
  value: string
  onValueChange: (value: string) => void
  items: readonly string[]
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  renderItem?: (item: string) => ReactNode
}

export function ComboboxSelect({
  value,
  onValueChange,
  items,
  placeholder,
  disabled,
  id,
  className,
  renderItem,
}: Props) {
  return (
    <Combobox
      items={items}
      value={value}
      onValueChange={(val) => {
        if (val !== null) onValueChange(val)
      }}
      disabled={disabled}
    >
      <ComboboxInput placeholder={placeholder} id={id} className={className} />
      <ComboboxContent>
        <ComboboxEmpty>Sin resultados</ComboboxEmpty>
        <ComboboxList>
          {items.map((item) => (
            <ComboboxItem key={item} value={item}>
              {renderItem ? renderItem(item) : item}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
