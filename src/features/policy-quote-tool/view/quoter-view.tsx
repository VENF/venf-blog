'use client'
import { BadgeDollarSign, CircleCheck, File, Shield, ShieldCog } from 'lucide-react'
import { QuoteFormSection } from './quote-form-section'
import { StripedPattern } from '@/components/striped-pattern'

const BULLETS = [
  {
    icon: <BadgeDollarSign />,
    message: 'Tarifas reales basadas en tu perfil.',
  },
  {
    icon: <File />,
    message: 'Sin letras pequeñas ni costos ocultos.',
  },
  {
    icon: <CircleCheck />,
    message: 'Cierra tu póliza con un clic.',
  },
  {
    icon: <Shield />,
    message: 'Cumplimiento estricto de privacidad.',
  },
]

export const QuoterPage = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 p-5">
      <div className="flex flex-col items-center justify-between p-1">
        <div className="flex flex-col items-center justify-between p-6 md:p-12">
          <div className="space-y-6">
            <span className="flex items-center gap-2 text-muted-foreground">
              <ShieldCog />
              Cotizador Inteligente de Salud
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold">
              Tu poliza de salud sin complicaciones.
            </h1>
            <p className="w-full md:w-[80%] text-muted-foreground">
              No adivines el costo de tu tranquilidad. Nuestro motor cruza las tarifas de las
              principales compañías de salud al segundo. Obtén un desglose exacto de tu prima
              mensual o anual, respaldado por la experiencia de consultores listos para proteger tu
              patrimonio.
            </p>
            <div className="mt-12 grid w-full md:w-[80%] grid-cols-1 sm:grid-cols-2 gap-3">
              {BULLETS.map((item, i) => (
                <div key={i} className="my-2 flex items-center gap-2">
                  {item.icon}
                  <p className="text-muted-foreground">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-[50px] grid grid-cols-2 gap-6 p-1">
          <div className="flex flex-col items-center justify-center">
            <h2 className="mb-2 text-3xl sm:text-4xl md:text-6xl font-bold">100%</h2>
            <p className="w-full md:w-[60%] text-center text-muted-foreground">
              Tarifas oficiales actualizadas en tiempo real.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="mb-2 text-3xl sm:text-4xl md:text-6xl font-bold">{'< 60s'}</h2>
            <p className="w-full md:w-[60%] text-center text-muted-foreground">
              Tiempo promedio para recibir tu cotización en el correo.
            </p>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col items-center overflow-hidden bg-[#F5F5F7]/50 dark:bg-background">
        <div className="flex-1" />
        <StripedPattern direction="right" className="z-1 text-[#EDEDEF] dark:text-muted" />
        <div className="w-full border-2 border-t-0 border-r-0 border-l-0 border-dashed border-[#DAD9DE] dark:border-muted/50" />
        <div className="pointer-events-none absolute inset-y-0 left-[175px] border-l-2 border-dashed border-[#DAD9DE] dark:border-muted/50 hidden md:block" />
        <div className="pointer-events-none absolute inset-y-0 right-[175px] border-r-2 border-dashed border-[#DAD9DE] dark:border-muted/50 hidden md:block" />
        <QuoteFormSection />
        <div className="w-full border-2 border-t-0 border-r-0 border-l-0 border-dashed border-[#DAD9DE] dark:border-muted/50" />
        <div className="flex-1" />
      </div>
    </div>
  )
}
