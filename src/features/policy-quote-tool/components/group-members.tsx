import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, ArrowRight, UserCircleIcon } from 'lucide-react'
import { ComboboxSelect } from '@/components/ui/combobox-select'

const PAGE_SIZE = 2

interface Props {
  fields: { id: string; role: string; age: number }[]
  append: (value: { role: string; age: number }) => void
  remove: (index: number) => void
  roles: readonly string[]
  canAddMember: boolean
  maxSize: number
}

export function GroupMembers({ fields, append, remove, roles, canAddMember, maxSize }: Props) {
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const [newRole, setNewRole] = useState(roles[0] ?? '')
  const [newAge, setNewAge] = useState(30)

  const totalPages = Math.ceil(fields.length / PAGE_SIZE) || 1

  const pageFields = fields.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleOpenChange = (v: boolean) => {
    setOpen(v)
    if (v) {
      setNewRole(roles[0] ?? '')
      setNewAge(30)
    }
  }

  const handleAdd = () => {
    append({ role: newRole, age: newAge })
    setOpen(false)
  }

  const handleRemove = (realIndex: number) => {
    remove(realIndex)
    const newLength = fields.length - 1
    const newTotalPages = Math.ceil(newLength / PAGE_SIZE) || 1
    if (page >= newTotalPages) {
      setPage(newTotalPages - 1)
    }
  }

  return (
    <div className="my-[28px] flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          Grupo familiar ({fields.length}/{maxSize})
        </Label>

        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="xs" disabled={!canAddMember}>
              + Agregar miembro
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-3 p-3" align="end">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Rol</Label>
              <ComboboxSelect
                value={newRole}
                onValueChange={setNewRole}
                items={[...roles]}
                placeholder="Seleccionar rol"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Edad</Label>
              <Input
                type="number"
                value={newAge}
                onChange={(e) => setNewAge(Number(e.target.value))}
                min={1}
              />
            </div>

            <Button type="button" size="sm" onClick={handleAdd}>
              Agregar
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Miembro</TableHead>
            <TableHead className="w-20">Edad</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageFields.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="h-16 text-center text-muted-foreground">
                {fields.length === 0
                  ? 'Agrega al menos un miembro'
                  : 'No hay miembros en esta página'}
              </TableCell>
            </TableRow>
          )}
          {pageFields.map((field, i) => {
            const realIndex = page * PAGE_SIZE + i
            return (
              <TableRow key={field.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">
                        <UserCircleIcon className="size-6 stroke-1" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {field.role.charAt(0).toUpperCase() + field.role.slice(1).toLowerCase()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{field.age} años</TableCell>
                <TableCell>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemove(realIndex)}
                    >
                      ✕
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {fields.length}/{maxSize} miembros
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ArrowLeft />
              Anterior
            </Button>
            <span className="text-xs text-muted-foreground">
              {page + 1} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
              <ArrowRight />
            </Button>
          </div>
        </div>
      )}

      {!canAddMember && (
        <p className="text-xs text-muted-foreground">Máximo de {maxSize} miembros alcanzado</p>
      )}
    </div>
  )
}
