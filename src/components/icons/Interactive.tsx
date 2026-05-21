import React from 'react'

interface InteractiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  stop?: boolean
  className?: string
}

export const InteractiveIcon: React.FC<InteractiveIconProps> = ({
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
      aria-label="Cipher"
      width={size}
      height={size}
      className={`${color} ${className}`.trim()}
      {...props}
    >
      <title>Cipher</title>
      <desc>Decryption flashes ripple through the grid in waves.</desc>

      <defs>
        <circle id="bg-dot-interactive" r="2.4" fill="currentColor" opacity="0.07" />
        <circle id="scan-dot-interactive" r="3.1" fill="currentColor" />
      </defs>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .interactive-layer {
          opacity: 0;
          animation: cipher-ripple-anim 1600ms cubic-bezier(0.25, 1, 0.5, 1) infinite both;
        }
        @keyframes cipher-ripple-anim {
          0% { opacity: 0; }
          8% { opacity: 1; }
          22% { opacity: 0.05; }
          46% { opacity: 0.85; }
          58% { opacity: 0.05; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .interactive-layer {
            animation: none;
            opacity: 0.45;
          }
        }
        ${stop ? '.interactive-layer { animation-play-state: paused; opacity: 0.45; }' : ''}
        .d00, .d03, .d04, .d12, .d13, .d21, .d22, .d30, .d31, .d34, .d40, .d43, .d44 { animation-delay: 400ms; }
        .d01, .d02, .d10, .d11, .d14, .d20, .d23, .d24, .d32, .d33, .d41, .d42 { animation-delay: 1200ms; }
      `,
        }}
      />

      {/* Cuadrícula de fondo */}
      <use href="#bg-dot-interactive" x="6" y="6" />
      <use href="#bg-dot-interactive" x="17" y="6" />
      <use href="#bg-dot-interactive" x="28" y="6" />
      <use href="#bg-dot-interactive" x="39" y="6" />
      <use href="#bg-dot-interactive" x="50" y="6" />
      <use href="#bg-dot-interactive" x="6" y="17" />
      <use href="#bg-dot-interactive" x="17" y="17" />
      <use href="#bg-dot-interactive" x="28" y="17" />
      <use href="#bg-dot-interactive" x="39" y="17" />
      <use href="#bg-dot-interactive" x="50" y="17" />
      <use href="#bg-dot-interactive" x="6" y="28" />
      <use href="#bg-dot-interactive" x="17" y="28" />
      <use href="#bg-dot-interactive" x="28" y="28" />
      <use href="#bg-dot-interactive" x="39" y="28" />
      <use href="#bg-dot-interactive" x="50" y="28" />
      <use href="#bg-dot-interactive" x="6" y="39" />
      <use href="#bg-dot-interactive" x="17" y="39" />
      <use href="#bg-dot-interactive" x="28" y="39" />
      <use href="#bg-dot-interactive" x="39" y="39" />
      <use href="#bg-dot-interactive" x="50" y="39" />
      <use href="#bg-dot-interactive" x="6" y="50" />
      <use href="#bg-dot-interactive" x="17" y="50" />
      <use href="#bg-dot-interactive" x="28" y="50" />
      <use href="#bg-dot-interactive" x="39" y="50" />
      <use href="#bg-dot-interactive" x="50" y="50" />

      {/* Cuadrícula Activa (Cifrado Interactivo) */}
      <use className="interactive-layer d00" href="#scan-dot-interactive" x="6" y="6" />
      <use className="interactive-layer d01" href="#scan-dot-interactive" x="17" y="6" />
      <use className="interactive-layer d02" href="#scan-dot-interactive" x="28" y="6" />
      <use className="interactive-layer d03" href="#scan-dot-interactive" x="39" y="6" />
      <use className="interactive-layer d04" href="#scan-dot-interactive" x="50" y="6" />
      <use className="interactive-layer d10" href="#scan-dot-interactive" x="6" y="17" />
      <use className="interactive-layer d11" href="#scan-dot-interactive" x="17" y="17" />
      <use className="interactive-layer d12" href="#scan-dot-interactive" x="28" y="17" />
      <use className="interactive-layer d13" href="#scan-dot-interactive" x="39" y="17" />
      <use className="interactive-layer d14" href="#scan-dot-interactive" x="50" y="17" />
      <use className="interactive-layer d20" href="#scan-dot-interactive" x="6" y="28" />
      <use className="interactive-layer d21" href="#scan-dot-interactive" x="17" y="28" />
      <use className="interactive-layer d22" href="#scan-dot-interactive" x="28" y="28" />
      <use className="interactive-layer d23" href="#scan-dot-interactive" x="39" y="28" />
      <use className="interactive-layer d24" href="#scan-dot-interactive" x="50" y="28" />
      <use className="interactive-layer d30" href="#scan-dot-interactive" x="6" y="39" />
      <use className="interactive-layer d31" href="#scan-dot-interactive" x="17" y="39" />
      <use className="interactive-layer d32" href="#scan-dot-interactive" x="28" y="39" />
      <use className="interactive-layer d33" href="#scan-dot-interactive" x="39" y="39" />
      <use className="interactive-layer d34" href="#scan-dot-interactive" x="50" y="39" />
      <use className="interactive-layer d40" href="#scan-dot-interactive" x="6" y="50" />
      <use className="interactive-layer d41" href="#scan-dot-interactive" x="17" y="50" />
      <use className="interactive-layer d42" href="#scan-dot-interactive" x="28" y="50" />
      <use className="interactive-layer d43" href="#scan-dot-interactive" x="39" y="50" />
      <use className="interactive-layer d44" href="#scan-dot-interactive" x="50" y="50" />
    </svg>
  )
}
