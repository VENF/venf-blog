import React from 'react'

interface ErrorIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  stop?: boolean
  className?: string
}

export const ErrorIcon: React.FC<ErrorIconProps> = ({
  size = 56,
  color = 'text-white',
  stop = false,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 56"
      role="img"
      aria-label="Plus X"
      width={size}
      height={size}
      className={`${color} ${className}`.trim()}
      {...props}
    >
      <title>Plus X</title>
      <desc>A plus and an ex trade places on opposite halves of the cycle.</desc>

      <defs>
        <circle id="bg-dot-error" r="2.4" fill="currentColor" opacity="0.07" />
        <circle id="scan-dot-error" r="3.1" fill="currentColor" />
      </defs>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .error-layer {
          opacity: 0;
          animation: plus-x-shift-anim 2200ms cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
        @keyframes plus-x-shift-anim {
          0% { opacity: 0.08; }
          14% { opacity: 1; }
          72% { opacity: 0.95; }
          100% { opacity: 0.08; }
        }
        @media (prefers-reduced-motion: reduce) {
          .error-layer {
            animation: none;
            opacity: 0.45;
          }
        }
        ${stop ? '.error-layer { animation-play-state: paused; opacity: 0.45; }' : ''}
        
        /* Retardos cruzados para alternar entre el signo '+' y la 'X' */
        .d00, .d04, .d11, .d13, .d31, .d33, .d40, .d44 { animation-delay: 1100ms; }
        .d02, .d12, .d20, .d21, .d22, .d23, .d24, .d32, .d42 { animation-delay: 0ms; }
      `,
        }}
      />

      {/* Cuadrícula estática de fondo */}
      <use href="#bg-dot-error" x="6" y="6" />
      <use href="#bg-dot-error" x="17" y="6" />
      <use href="#bg-dot-error" x="28" y="6" />
      <use href="#bg-dot-error" x="39" y="6" />
      <use href="#bg-dot-error" x="50" y="6" />
      <use href="#bg-dot-error" x="6" y="17" />
      <use href="#bg-dot-error" x="17" y="17" />
      <use href="#bg-dot-error" x="28" y="17" />
      <use href="#bg-dot-error" x="39" y="17" />
      <use href="#bg-dot-error" x="50" y="17" />
      <use href="#bg-dot-error" x="6" y="28" />
      <use href="#bg-dot-error" x="17" y="28" />
      <use href="#bg-dot-error" x="28" y="28" />
      <use href="#bg-dot-error" x="39" y="28" />
      <use href="#bg-dot-error" x="50" y="28" />
      <use href="#bg-dot-error" x="6" y="39" />
      <use href="#bg-dot-error" x="17" y="39" />
      <use href="#bg-dot-error" x="28" y="39" />
      <use href="#bg-dot-error" x="39" y="39" />
      <use href="#bg-dot-error" x="50" y="39" />
      <use href="#bg-dot-error" x="6" y="50" />
      <use href="#bg-dot-error" x="17" y="50" />
      <use href="#bg-dot-error" x="28" y="50" />
      <use href="#bg-dot-error" x="39" y="50" />
      <use href="#bg-dot-error" x="50" y="50" />

      {/* Capa animada (Efecto de Oscilación Plus / X) */}
      <use className="error-layer d00" href="#scan-dot-error" x="6" y="6" />
      <use className="error-layer d02" href="#scan-dot-error" x="28" y="6" />
      <use className="error-layer d04" href="#scan-dot-error" x="50" y="6" />
      <use className="error-layer d11" href="#scan-dot-error" x="17" y="17" />
      <use className="error-layer d12" href="#scan-dot-error" x="28" y="17" />
      <use className="error-layer d13" href="#scan-dot-error" x="39" y="17" />
      <use className="error-layer d20" href="#scan-dot-error" x="6" y="28" />
      <use className="error-layer d21" href="#scan-dot-error" x="17" y="28" />
      <use className="error-layer d22" href="#scan-dot-error" x="28" y="28" />
      <use className="error-layer d23" href="#scan-dot-error" x="39" y="28" />
      <use className="error-layer d24" href="#scan-dot-error" x="50" y="28" />
      <use className="error-layer d31" href="#scan-dot-error" x="17" y="39" />
      <use className="error-layer d32" href="#scan-dot-error" x="28" y="39" />
      <use className="error-layer d33" href="#scan-dot-error" x="39" y="39" />
      <use className="error-layer d40" href="#scan-dot-error" x="6" y="50" />
      <use className="error-layer d42" href="#scan-dot-error" x="28" y="50" />
      <use className="error-layer d44" href="#scan-dot-error" x="50" y="50" />
    </svg>
  )
}
