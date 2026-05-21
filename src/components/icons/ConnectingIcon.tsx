import React from 'react'

interface ConnectingIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  stop?: boolean
  className?: string
}

export const ConnectingIcon: React.FC<ConnectingIconProps> = ({
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
      aria-label="Diamond"
      width={size}
      height={size}
      className={`${color} ${className}`.trim()}
      {...props}
    >
      <title>Diamond</title>
      <desc>A diamond blooms outward from the center.</desc>

      <defs>
        <circle id="bg-dot-connecting" r="2.4" fill="currentColor" opacity="0.07" />
        <circle id="scan-dot-connecting" r="3.1" fill="currentColor" />
      </defs>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .connecting-layer {
          opacity: 0;
          animation: diamond-bloom-anim 2200ms cubic-bezier(0.16, 1, 0.3, 1) infinite both;
        }
        @keyframes diamond-bloom-anim {
          0% { opacity: 0; }
          10% { opacity: 1; }
          55% { opacity: 0.85; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .connecting-layer {
            animation: none;
            opacity: 0.45;
          }
        }
        ${stop ? '.connecting-layer { animation-play-state: paused; opacity: 0.45; }' : ''}
        .d00, .d04, .d40, .d44 { animation-delay: 733ms; }
        .d01, .d03, .d10, .d14, .d30, .d34, .d41, .d43 { animation-delay: 550ms; }
        .d02, .d11, .d13, .d20, .d24, .d31, .d33, .d42 { animation-delay: 367ms; }
        .d12, .d21, .d23, .d32 { animation-delay: 183ms; }
        .d22 { animation-delay: 0ms; }
      `,
        }}
      />

      {/* Cuadrícula de fondo */}
      <use href="#bg-dot-connecting" x="6" y="6" />
      <use href="#bg-dot-connecting" x="17" y="6" />
      <use href="#bg-dot-connecting" x="28" y="6" />
      <use href="#bg-dot-connecting" x="39" y="6" />
      <use href="#bg-dot-connecting" x="50" y="6" />
      <use href="#bg-dot-connecting" x="6" y="17" />
      <use href="#bg-dot-connecting" x="17" y="17" />
      <use href="#bg-dot-connecting" x="28" y="17" />
      <use href="#bg-dot-connecting" x="39" y="17" />
      <use href="#bg-dot-connecting" x="50" y="17" />
      <use href="#bg-dot-connecting" x="6" y="28" />
      <use href="#bg-dot-connecting" x="17" y="28" />
      <use href="#bg-dot-connecting" x="28" y="28" />
      <use href="#bg-dot-connecting" x="39" y="28" />
      <use href="#bg-dot-connecting" x="50" y="28" />
      <use href="#bg-dot-connecting" x="6" y="39" />
      <use href="#bg-dot-connecting" x="17" y="39" />
      <use href="#bg-dot-connecting" x="28" y="39" />
      <use href="#bg-dot-connecting" x="39" y="39" />
      <use href="#bg-dot-connecting" x="50" y="39" />
      <use href="#bg-dot-connecting" x="6" y="50" />
      <use href="#bg-dot-connecting" x="17" y="50" />
      <use href="#bg-dot-connecting" x="28" y="50" />
      <use href="#bg-dot-connecting" x="39" y="50" />
      <use href="#bg-dot-connecting" x="50" y="50" />

      {/* Cuadrícula Activa (Expansión) */}
      <use className="connecting-layer d00" href="#scan-dot-connecting" x="6" y="6" />
      <use className="connecting-layer d01" href="#scan-dot-connecting" x="17" y="6" />
      <use className="connecting-layer d02" href="#scan-dot-connecting" x="28" y="6" />
      <use className="connecting-layer d03" href="#scan-dot-connecting" x="39" y="6" />
      <use className="connecting-layer d04" href="#scan-dot-connecting" x="50" y="6" />
      <use className="connecting-layer d10" href="#scan-dot-connecting" x="6" y="17" />
      <use className="connecting-layer d11" href="#scan-dot-connecting" x="17" y="17" />
      <use className="connecting-layer d12" href="#scan-dot-connecting" x="28" y="17" />
      <use className="connecting-layer d13" href="#scan-dot-connecting" x="39" y="17" />
      <use className="connecting-layer d14" href="#scan-dot-connecting" x="50" y="17" />
      <use className="connecting-layer d20" href="#scan-dot-connecting" x="6" y="28" />
      <use className="connecting-layer d21" href="#scan-dot-connecting" x="17" y="28" />
      <use className="connecting-layer d22" href="#scan-dot-connecting" x="28" y="28" />
      <use className="connecting-layer d23" href="#scan-dot-connecting" x="39" y="28" />
      <use className="connecting-layer d24" href="#scan-dot-connecting" x="50" y="28" />
      <use className="connecting-layer d30" href="#scan-dot-connecting" x="6" y="39" />
      <use className="connecting-layer d31" href="#scan-dot-connecting" x="17" y="39" />
      <use className="connecting-layer d32" href="#scan-dot-connecting" x="28" y="39" />
      <use className="connecting-layer d33" href="#scan-dot-connecting" x="39" y="39" />
      <use className="connecting-layer d34" href="#scan-dot-connecting" x="50" y="39" />
      <use className="connecting-layer d40" href="#scan-dot-connecting" x="6" y="50" />
      <use className="connecting-layer d41" href="#scan-dot-connecting" x="17" y="50" />
      <use className="connecting-layer d42" href="#scan-dot-connecting" x="28" y="50" />
      <use className="connecting-layer d43" href="#scan-dot-connecting" x="39" y="50" />
      <use className="connecting-layer d44" href="#scan-dot-connecting" x="50" y="50" />
    </svg>
  )
}
