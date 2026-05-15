'use client'

import * as React from 'react'
import { SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { RightMagnifyingGlassIcon } from './icons/Search'

export function SearchCommand() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button className='cursor-pointer' onClick={() => setOpen(true)} variant="outline" size="icon">
        <RightMagnifyingGlassIcon size={15}/>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup heading="Sugerencias">
              <CommandItem>Proyectos</CommandItem>
              <CommandItem>Blog</CommandItem>
              <CommandItem>Contacto</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
