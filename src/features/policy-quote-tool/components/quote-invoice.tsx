'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { QuoteOutput } from '../store/schemas'

interface QuoteInvoiceProps {
  result: QuoteOutput
  onReset: () => void
  className?: string
}

function formatUSD(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
}

export function QuoteInvoice({ result, onReset, className }: QuoteInvoiceProps) {
  const refNum = `#2026-${String(new Date(result.date).getTime()).slice(-4)}`
  const dateStr = new Date(result.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const dashClass = 'border-t border-dashed border-[#DAD9DE]/50 dark:border-card'

  return (
    <div className="rounded-l-[12px] bg-[#DAD9DE]/50 p-[5px] dark:bg-card">
      <div
        className={cn(
          'relative z-[2] w-[550px] rounded-l-[12px] rounded-br-[12px] bg-background shadow-lg',

          'before:absolute before:top-0 before:right-0 before:h-0 before:w-0 before:border-solid',
          'before:border-t-[24px] before:border-l-[24px]',
          'before:border-t-[#DAD9DE] before:border-l-transparent dark:before:border-t-card',

          'after:absolute after:top-0 after:right-0 after:h-0 after:w-0 after:border-solid',
          'after:border-t-[24px] after:border-l-[24px]',
          'after:border-t-muted/40 dark:after:border-t-card after:border-l-transparent dark:after:border-l-card/60',
          'after:rounded-bl-[4px] after:shadow-[-2px_2px_3px_rgba(0,0,0,0.15)]',

          className
        )}
      >
        <div className="flex items-start justify-between px-8 pt-8 pb-5">
          <div className="space-y-2">
            <p className="mt-0.5 text-lg font-bold">{refNum}</p>
            <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground">
              COTIZACIÓN
            </p>
            <p className="mt-1 text-xs text-muted-foreground uppercase">{dateStr}</p>
          </div>
          <div className="space-y-2 text-right">
            <p className="text-md mt-0.5 font-bold">{result.company}</p>
            <p className="text-xs text-muted-foreground">Plan: {result.plan}</p>
            <p className="text-xs text-muted-foreground">Suma: {formatUSD(result.sumInsured)}</p>
          </div>
        </div>

        <div className={dashClass} />

        <div className="flex items-center justify-between px-8 py-5 text-sm">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground">CLIENTE</p>
            <div className="flex items-center gap-2">
              <p className="font-medium">{result.applicant}</p>
              <Separator orientation="vertical" />
              <p className="text-muted-foreground">{result.email}</p>
            </div>
            <p className="text-muted-foreground">{result.phone}</p>
          </div>
          <div>
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground">
                DETALLES
              </p>
              <p>
                <span className="text-muted-foreground">Continuidad: </span>
                {result.continuity ? 'Sí' : 'No'}
              </p>
              <p>
                <span className="text-muted-foreground">Maternidad: </span>
                {result.includesMaternity ? 'Sí' : 'No'}
              </p>
              {result.includesMaternity && result.maternitySum != null && (
                <p>
                  <span className="text-muted-foreground">Cobertura maternidad: </span>
                  {formatUSD(result.maternitySum)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={dashClass} />

        <div className="px-8 pt-5 pb-3">
          <p className="mb-3 text-xs font-semibold tracking-[0.1em] text-muted-foreground">
            PRIMAS
          </p>
          <Table>
            <TableHeader>
              <TableRow className="[&>th]:h-7 [&>th]:pb-1 [&>th]:text-xs [&>th]:text-muted-foreground">
                <TableHead>DESCRIPCIÓN</TableHead>
                <TableHead className="w-20 text-center">EDAD</TableHead>
                <TableHead className="w-28 text-right">MONTO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.group.map((p, i) => (
                <TableRow key={i} className="[&>td]:py-2">
                  <TableCell className="text-sm font-medium">{p.role}</TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {p.age}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatUSD(p.premium)}
                  </TableCell>
                </TableRow>
              ))}
              {result.maternityPremium > 0 && (
                <TableRow className="[&>td]:py-2">
                  <TableCell className="text-sm font-medium">Maternidad</TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">—</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatUSD(result.maternityPremium)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className={dashClass} />

        <div className="flex items-center justify-end gap-4 px-8 py-4">
          <span className="text-sm font-semibold">Total mensual</span>
          <span className="font-mono text-lg font-bold">{formatUSD(result.total)}</span>
        </div>

        <div className={dashClass} />

        <div className="py-20" />

        <div className="px-8 pb-5">
          <p className="mb-4 text-xs font-semibold tracking-[0.1em] text-muted-foreground">
            OPCIONES DE PAGO
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Anual:</span>
              <span className="font-mono">{formatUSD(result.paymentOptions.annual)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Semestral:</span>
              <span className="font-mono">{formatUSD(result.paymentOptions.semiannual)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trimestral:</span>
              <span className="font-mono">{formatUSD(result.paymentOptions.quarterly)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mensual:</span>
              <span className="font-mono">
                {result.paymentOptions.monthly !== null
                  ? formatUSD(result.paymentOptions.monthly)
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-8 pt-5 pb-8">
          <Button onClick={onReset} variant="outline" className="w-full text-sm cursor-pointer">
            Nueva cotización
          </Button>
        </div>
      </div>
    </div>
  )
}
