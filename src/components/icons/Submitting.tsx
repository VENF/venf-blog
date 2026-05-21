import React from 'react'

interface SubmittingIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  stop?: boolean
  className?: string
}

export const SubmittingIcon: React.FC<SubmittingIconProps> = ({
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
      aria-label="Snake"
      width={size}
      height={size}
      className={`${color} ${className}`.trim()}
      {...props}
    >
      <title>Snake</title>
      <desc>A bright dot winds through every cell in serpent order.</desc>

      <defs>
        <circle id="bg-dot-submitting" r="2.4" fill="currentColor" opacity="0.07" />
        <circle id="scan-dot-submitting" r="3.1" fill="currentColor" />
      </defs>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .submitting-layer {
          opacity: 0;
          animation: snake-winding-anim 3000ms linear infinite both;
        }
        @keyframes snake-winding-anim {
          0% { opacity: 0; }
          4% { opacity: 1; }
          26% { opacity: 0.08; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .submitting-layer {
            animation: none;
            opacity: 0.45;
          }
        }
        ${stop ? '.submitting-layer { animation-play-state: paused; opacity: 0.45; }' : ''}
        
        /* Retardos calculados para el patrón zig-zag */
        .d00 { animation-delay: 0ms; }
        .d01 { animation-delay: 103ms; }
        .d02 { animation-delay: 207ms; }
        .d03 { animation-delay: 310ms; }
        .d04 { animation-delay: 414ms; }
        .d14 { animation-delay: 517ms; }
        .d13 { animation-delay: 621ms; }
        .d12 { animation-delay: 724ms; }
        .d11 { animation-delay: 828ms; }
        .d10 { animation-delay: 931ms; }
        .d20 { animation-delay: 1034ms; }
        .d21 { animation-delay: 1138ms; }
        .d22 { animation-delay: 1241ms; }
        .d23 { animation-delay: 1345ms; }
        .d24 { animation-delay: 1448ms; }
        .d34 { animation-delay: 1552ms; }
        .d33 { animation-delay: 1655ms; }
        .d32 { animation-delay: 1759ms; }
        .d31 { animation-delay: 1862ms; }
        .d30 { animation-delay: 1966ms; }
        .d40 { animation-delay: 2069ms; }
        .d41 { animation-delay: 2172ms; }
        .d42 { animation-delay: 2276ms; }
        .d43 { animation-delay: 2379ms; }
        .d44 { animation-delay: 2483ms; }
      `,
        }}
      />

      {/* Cuadrícula estática de fondo */}
      <use href="#bg-dot-submitting" x="6" y="6" />
      <use href="#bg-dot-submitting" x="17" y="6" />
      <use href="#bg-dot-submitting" x="28" y="6" />
      <use href="#bg-dot-submitting" x="39" y="6" />
      <use href="#bg-dot-submitting" x="50" y="6" />
      <use href="#bg-dot-submitting" x="6" y="17" />
      <use href="#bg-dot-submitting" x="17" y="17" />
      <use href="#bg-dot-submitting" x="28" y="17" />
      <use href="#bg-dot-submitting" x="39" y="17" />
      <use href="#bg-dot-submitting" x="50" y="17" />
      <use href="#bg-dot-submitting" x="6" y="28" />
      <use href="#bg-dot-submitting" x="17" y="28" />
      <use href="#bg-dot-submitting" x="28" y="28" />
      <use href="#bg-dot-submitting" x="39" y="28" />
      <use href="#bg-dot-submitting" x="50" y="28" />
      <use href="#bg-dot-submitting" x="6" y="39" />
      <use href="#bg-dot-submitting" x="17" y="39" />
      <use href="#bg-dot-submitting" x="28" y="39" />
      <use href="#bg-dot-submitting" x="39" y="39" />
      <use href="#bg-dot-submitting" x="50" y="39" />
      <use href="#bg-dot-submitting" x="6" y="50" />
      <use href="#bg-dot-submitting" x="17" y="50" />
      <use href="#bg-dot-submitting" x="28" y="50" />
      <use href="#bg-dot-submitting" x="39" y="50" />
      <use href="#bg-dot-submitting" x="50" y="50" />

      {/* Capa animada (Efecto Serpiente) */}
      <use className="submitting-layer d00" href="#scan-dot-submitting" x="6" y="6" />
      <use className="submitting-layer d01" href="#scan-dot-submitting" x="17" y="6" />
      <use className="submitting-layer d02" href="#scan-dot-submitting" x="28" y="6" />
      <use className="submitting-layer d03" href="#scan-dot-submitting" x="39" y="6" />
      <use className="submitting-layer d04" href="#scan-dot-submitting" x="50" y="6" />
      <use className="submitting-layer d10" href="#scan-dot-submitting" x="6" y="17" />
      <use className="submitting-layer d11" href="#scan-dot-submitting" x="17" y="17" />
      <use className="submitting-layer d12" href="#scan-dot-submitting" x="28" y="17" />
      <use className="submitting-layer d13" href="#scan-dot-submitting" x="39" y="17" />
      <use className="submitting-layer d14" href="#scan-dot-submitting" x="50" y="17" />
      <use className="submitting-layer d20" href="#scan-dot-submitting" x="6" y="28" />
      <use className="submitting-layer d21" href="#scan-dot-submitting" x="17" y="28" />
      <use className="submitting-layer d22" href="#scan-dot-submitting" x="28" y="28" />
      <use className="submitting-layer d23" href="#scan-dot-submitting" x="39" y="28" />
      <use className="submitting-layer d24" href="#scan-dot-submitting" x="50" y="28" />
      <use className="submitting-layer d30" href="#scan-dot-submitting" x="6" y="39" />
      <use className="submitting-layer d31" href="#scan-dot-submitting" x="17" y="39" />
      <use className="submitting-layer d32" href="#scan-dot-submitting" x="28" y="39" />
      <use className="submitting-layer d33" href="#scan-dot-submitting" x="39" y="39" />
      <use className="submitting-layer d34" href="#scan-dot-submitting" x="50" y="39" />
      <use className="submitting-layer d40" href="#scan-dot-submitting" x="6" y="50" />
      <use className="submitting-layer d41" href="#scan-dot-submitting" x="17" y="50" />
      <use className="submitting-layer d42" href="#scan-dot-submitting" x="28" y="50" />
      <use className="submitting-layer d43" href="#scan-dot-submitting" x="39" y="50" />
      <use className="submitting-layer d44" href="#scan-dot-submitting" x="50" y="50" />
    </svg>
  )
}
