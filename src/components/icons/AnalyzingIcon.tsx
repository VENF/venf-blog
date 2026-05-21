import React from 'react'

interface DiagonalScanIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  stop?: boolean
  className?: string
}

export const AnalyzingIcon: React.FC<DiagonalScanIconProps> = ({
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
      aria-label="Diagonal Scan"
      width={size}
      height={size}
      className={`${color} ${className}`.trim()}
      {...props}
    >
      <title>Diagonal Scan</title>
      <desc>A diagonal stripe sweeps from corner to corner.</desc>

      <defs>
        <circle id="bg-dot" r="2.4" fill="currentColor" opacity="0.07" />
        <circle id="scan-dot" r="3.1" fill="currentColor" />
      </defs>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scan-layer {
          opacity: 0;
          animation: diagonal-scan-anim 2200ms cubic-bezier(0.25, 1, 0.5, 1) infinite both;
        }
        @keyframes diagonal-scan-anim {
          0% { opacity: 0; }
          8% { opacity: 1; }
          36% { opacity: 0.05; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .scan-layer {
            animation: none;
            opacity: 0.45;
          }
        }
        ${stop ? '.scan-layer { animation-play-state: paused; opacity: 0.45; }' : ''}
        .d00 { animation-delay: 0ms; }
        .d01, .d10 { animation-delay: 183ms; }
        .d02, .d11, .d20 { animation-delay: 367ms; }
        .d03, .d12, .d21, .d30 { animation-delay: 550ms; }
        .d04, .d13, .d22, .d31, .d40 { animation-delay: 733ms; }
        .d14, .d23, .d32, .d41 { animation-delay: 917ms; }
        .d24, .d33, .d42 { animation-delay: 1100ms; }
        .d34, .d43 { animation-delay: 1283ms; }
        .d44 { animation-delay: 1467ms; }
      `,
        }}
      />

      {/* Cuadrícula de fondo */}
      <use href="#bg-dot" x="6" y="6" />
      <use href="#bg-dot" x="17" y="6" />
      <use href="#bg-dot" x="28" y="6" />
      <use href="#bg-dot" x="39" y="6" />
      <use href="#bg-dot" x="50" y="6" />
      <use href="#bg-dot" x="6" y="17" />
      <use href="#bg-dot" x="17" y="17" />
      <use href="#bg-dot" x="28" y="17" />
      <use href="#bg-dot" x="39" y="17" />
      <use href="#bg-dot" x="50" y="17" />
      <use href="#bg-dot" x="6" y="28" />
      <use href="#bg-dot" x="17" y="28" />
      <use href="#bg-dot" x="28" y="28" />
      <use href="#bg-dot" x="39" y="28" />
      <use href="#bg-dot" x="50" y="28" />
      <use href="#bg-dot" x="6" y="39" />
      <use href="#bg-dot" x="17" y="39" />
      <use href="#bg-dot" x="28" y="39" />
      <use href="#bg-dot" x="39" y="39" />
      <use href="#bg-dot" x="50" y="39" />
      <use href="#bg-dot" x="6" y="50" />
      <use href="#bg-dot" x="17" y="50" />
      <use href="#bg-dot" x="28" y="50" />
      <use href="#bg-dot" x="39" y="50" />
      <use href="#bg-dot" x="50" y="50" />

      {/* Cuadrícula Activa (Escáner) */}
      <use className="scan-layer d00" href="#scan-dot" x="6" y="6" />
      <use className="scan-layer d01" href="#scan-dot" x="17" y="6" />
      <use className="scan-layer d02" href="#scan-dot" x="28" y="6" />
      <use className="scan-layer d03" href="#scan-dot" x="39" y="6" />
      <use className="scan-layer d04" href="#scan-dot" x="50" y="6" />
      <use className="scan-layer d10" href="#scan-dot" x="6" y="17" />
      <use className="scan-layer d11" href="#scan-dot" x="17" y="17" />
      <use className="scan-layer d12" href="#scan-dot" x="28" y="17" />
      <use className="scan-layer d13" href="#scan-dot" x="39" y="17" />
      <use className="scan-layer d14" href="#scan-dot" x="50" y="17" />
      <use className="scan-layer d20" href="#scan-dot" x="6" y="28" />
      <use className="scan-layer d21" href="#scan-dot" x="17" y="28" />
      <use className="scan-layer d22" href="#scan-dot" x="28" y="28" />
      <use className="scan-layer d23" href="#scan-dot" x="39" y="28" />
      <use className="scan-layer d24" href="#scan-dot" x="50" y="28" />
      <use className="scan-layer d30" href="#scan-dot" x="6" y="39" />
      <use className="scan-layer d31" href="#scan-dot" x="17" y="39" />
      <use className="scan-layer d32" href="#scan-dot" x="28" y="39" />
      <use className="scan-layer d33" href="#scan-dot" x="39" y="39" />
      <use className="scan-layer d34" href="#scan-dot" x="50" y="39" />
      <use className="scan-layer d40" href="#scan-dot" x="6" y="50" />
      <use className="scan-layer d41" href="#scan-dot" x="17" y="50" />
      <use className="scan-layer d42" href="#scan-dot" x="28" y="50" />
      <use className="scan-layer d43" href="#scan-dot" x="39" y="50" />
      <use className="scan-layer d44" href="#scan-dot" x="50" y="50" />
    </svg>
  )
}
