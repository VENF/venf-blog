import React from 'react'

interface ValidatingIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  stop?: boolean
  className?: string
}

export const ValidatingIcon: React.FC<ValidatingIconProps> = ({
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
      aria-label="Column Scan"
      width={size}
      height={size}
      className={`${color} ${className}`.trim()}
      {...props}
    >
      <title>Column Scan</title>
      <desc>A vertical bar sweeps left to right, one column at a time.</desc>

      <defs>
        <circle id="bg-dot-validating" r="2.4" fill="currentColor" opacity="0.07" />
        <circle id="scan-dot-validating" r="3.1" fill="currentColor" />
      </defs>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .validating-layer {
          opacity: 0;
          animation: column-scan-anim 2200ms cubic-bezier(0.25, 1, 0.5, 1) infinite both;
        }
        @keyframes column-scan-anim {
          0% { opacity: 0; }
          8% { opacity: 1; }
          36% { opacity: 0.05; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .validating-layer {
            animation: none;
            opacity: 0.45;
          }
        }
        ${stop ? '.validating-layer { animation-play-state: paused; opacity: 0.45; }' : ''}
        .d00, .d10, .d20, .d30, .d40 { animation-delay: 0ms; }
        .d01, .d11, .d21, .d31, .d41 { animation-delay: 367ms; }
        .d02, .d12, .d22, .d32, .d42 { animation-delay: 733ms; }
        .d03, .d13, .d23, .d33, .d43 { animation-delay: 1100ms; }
        .d04, .d14, .d24, .d34, .d44 { animation-delay: 1467ms; }
      `,
        }}
      />

      {/* Cuadrícula de fondo */}
      <use href="#bg-dot-validating" x="6" y="6" />
      <use href="#bg-dot-validating" x="17" y="6" />
      <use href="#bg-dot-validating" x="28" y="6" />
      <use href="#bg-dot-validating" x="39" y="6" />
      <use href="#bg-dot-validating" x="50" y="6" />
      <use href="#bg-dot-validating" x="6" y="17" />
      <use href="#bg-dot-validating" x="17" y="17" />
      <use href="#bg-dot-validating" x="28" y="17" />
      <use href="#bg-dot-validating" x="39" y="17" />
      <use href="#bg-dot-validating" x="50" y="17" />
      <use href="#bg-dot-validating" x="6" y="28" />
      <use href="#bg-dot-validating" x="17" y="28" />
      <use href="#bg-dot-validating" x="28" y="28" />
      <use href="#bg-dot-validating" x="39" y="28" />
      <use href="#bg-dot-validating" x="50" y="28" />
      <use href="#bg-dot-validating" x="6" y="39" />
      <use href="#bg-dot-validating" x="17" y="39" />
      <use href="#bg-dot-validating" x="28" y="39" />
      <use href="#bg-dot-validating" x="39" y="39" />
      <use href="#bg-dot-validating" x="50" y="39" />
      <use href="#bg-dot-validating" x="6" y="50" />
      <use href="#bg-dot-validating" x="17" y="50" />
      <use href="#bg-dot-validating" x="28" y="50" />
      <use href="#bg-dot-validating" x="39" y="50" />
      <use href="#bg-dot-validating" x="50" y="50" />

      {/* Cuadrícula Activa (Escáner de columnas) */}
      <use className="validating-layer d00" href="#scan-dot-validating" x="6" y="6" />
      <use className="validating-layer d01" href="#scan-dot-validating" x="17" y="6" />
      <use className="validating-layer d02" href="#scan-dot-validating" x="28" y="6" />
      <use className="validating-layer d03" href="#scan-dot-validating" x="39" y="6" />
      <use className="validating-layer d04" href="#scan-dot-validating" x="50" y="6" />
      <use className="validating-layer d10" href="#scan-dot-validating" x="6" y="17" />
      <use className="validating-layer d11" href="#scan-dot-validating" x="17" y="17" />
      <use className="validating-layer d12" href="#scan-dot-validating" x="28" y="17" />
      <use className="validating-layer d13" href="#scan-dot-validating" x="39" y="17" />
      <use className="validating-layer d14" href="#scan-dot-validating" x="50" y="17" />
      <use className="validating-layer d20" href="#scan-dot-validating" x="6" y="28" />
      <use className="validating-layer d21" href="#scan-dot-validating" x="17" y="28" />
      <use className="validating-layer d22" href="#scan-dot-validating" x="28" y="28" />
      <use className="validating-layer d23" href="#scan-dot-validating" x="39" y="28" />
      <use className="validating-layer d24" href="#scan-dot-validating" x="50" y="28" />
      <use className="validating-layer d30" href="#scan-dot-validating" x="6" y="39" />
      <use className="validating-layer d31" href="#scan-dot-validating" x="17" y="39" />
      <use className="validating-layer d32" href="#scan-dot-validating" x="28" y="39" />
      <use className="validating-layer d33" href="#scan-dot-validating" x="39" y="39" />
      <use className="validating-layer d34" href="#scan-dot-validating" x="50" y="39" />
      <use className="validating-layer d40" href="#scan-dot-validating" x="6" y="50" />
      <use className="validating-layer d41" href="#scan-dot-validating" x="17" y="50" />
      <use className="validating-layer d42" href="#scan-dot-validating" x="28" y="50" />
      <use className="validating-layer d43" href="#scan-dot-validating" x="39" y="50" />
      <use className="validating-layer d44" href="#scan-dot-validating" x="50" y="50" />
    </svg>
  )
}
