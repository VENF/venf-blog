import React from 'react'

interface GeneratingIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  stop?: boolean
  className?: string
}

export const GeneratingIcon: React.FC<GeneratingIconProps> = ({
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
      aria-label="Sparkle"
      width={size}
      height={size}
      className={`${color} ${className}`.trim()}
      {...props}
    >
      <title>Sparkle</title>
      <desc>Independent dots twinkle on a deterministic loop.</desc>

      <defs>
        <circle id="bg-dot-generating" r="2.4" fill="currentColor" opacity="0.07" />
        <circle id="scan-dot-generating" r="3.1" fill="currentColor" />
      </defs>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .generating-layer {
          opacity: 0;
          animation: sparkle-twinkle-anim 2600ms cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
        @keyframes sparkle-twinkle-anim {
          0% { opacity: 0.05; }
          40% { opacity: 0.05; }
          50% { opacity: 1; }
          60% { opacity: 0.05; }
          100% { opacity: 0.05; }
        }
        @media (prefers-reduced-motion: reduce) {
          .generating-layer {
            animation: none;
            opacity: 0.45;
          }
        }
        ${stop ? '.generating-layer { animation-play-state: paused; opacity: 0.45; }' : ''}
        .d00 { animation-delay: 0ms; }
        .d01 { animation-delay: 2283ms; }
        .d02 { animation-delay: 1617ms; }
        .d03 { animation-delay: 1466ms; }
        .d04 { animation-delay: 31ms; }
        .d10 { animation-delay: 2106ms; }
        .d11 { animation-delay: 296ms; }
        .d12 { animation-delay: 1206ms; }
        .d13 { animation-delay: 333ms; }
        .d14 { animation-delay: 2241ms; }
        .d20 { animation-delay: 1929ms; }
        .d21 { animation-delay: 967ms; }
        .d22 { animation-delay: 1238ms; }
        .d23 { animation-delay: 1004ms; }
        .d24 { animation-delay: 2252ms; }
        .d30 { animation-delay: 1955ms; }
        .d31 { animation-delay: 2517ms; }
        .d32 { animation-delay: 1139ms; }
        .d33 { animation-delay: 1076ms; }
        .d34 { animation-delay: 1362ms; }
        .d40 { animation-delay: 2132ms; }
        .d41 { animation-delay: 920ms; }
        .d42 { animation-delay: 1274ms; }
        .d43 { animation-delay: 1310ms; }
        .d44 { animation-delay: 1019ms; }
      `,
        }}
      />

      {/* Cuadrícula de fondo */}
      <use href="#bg-dot-generating" x="6" y="6" />
      <use href="#bg-dot-generating" x="17" y="6" />
      <use href="#bg-dot-generating" x="28" y="6" />
      <use href="#bg-dot-generating" x="39" y="6" />
      <use href="#bg-dot-generating" x="50" y="6" />
      <use href="#bg-dot-generating" x="6" y="17" />
      <use href="#bg-dot-generating" x="17" y="17" />
      <use href="#bg-dot-generating" x="28" y="17" />
      <use href="#bg-dot-generating" x="39" y="17" />
      <use href="#bg-dot-generating" x="50" y="17" />
      <use href="#bg-dot-generating" x="6" y="28" />
      <use href="#bg-dot-generating" x="17" y="28" />
      <use href="#bg-dot-generating" x="28" y="28" />
      <use href="#bg-dot-generating" x="39" y="28" />
      <use href="#bg-dot-generating" x="50" y="28" />
      <use href="#bg-dot-generating" x="6" y="39" />
      <use href="#bg-dot-generating" x="17" y="39" />
      <use href="#bg-dot-generating" x="28" y="39" />
      <use href="#bg-dot-generating" x="39" y="39" />
      <use href="#bg-dot-generating" x="50" y="39" />
      <use href="#bg-dot-generating" x="6" y="50" />
      <use href="#bg-dot-generating" x="17" y="50" />
      <use href="#bg-dot-generating" x="28" y="50" />
      <use href="#bg-dot-generating" x="39" y="50" />
      <use href="#bg-dot-generating" x="50" y="50" />

      {/* Cuadrícula Activa (Twinkle) */}
      <use className="generating-layer d00" href="#scan-dot-generating" x="6" y="6" />
      <use className="generating-layer d01" href="#scan-dot-generating" x="17" y="6" />
      <use className="generating-layer d02" href="#scan-dot-generating" x="28" y="6" />
      <use className="generating-layer d03" href="#scan-dot-generating" x="39" y="6" />
      <use className="generating-layer d04" href="#scan-dot-generating" x="50" y="6" />
      <use className="generating-layer d10" href="#scan-dot-generating" x="6" y="17" />
      <use className="generating-layer d11" href="#scan-dot-generating" x="17" y="17" />
      <use className="generating-layer d12" href="#scan-dot-generating" x="28" y="17" />
      <use className="generating-layer d13" href="#scan-dot-generating" x="39" y="17" />
      <use className="generating-layer d14" href="#scan-dot-generating" x="50" y="17" />
      <use className="generating-layer d20" href="#scan-dot-generating" x="6" y="28" />
      <use className="generating-layer d21" href="#scan-dot-generating" x="17" y="28" />
      <use className="generating-layer d22" href="#scan-dot-generating" x="28" y="28" />
      <use className="generating-layer d23" href="#scan-dot-generating" x="39" y="28" />
      <use className="generating-layer d24" href="#scan-dot-generating" x="50" y="28" />
      <use className="generating-layer d30" href="#scan-dot-generating" x="6" y="39" />
      <use className="generating-layer d31" href="#scan-dot-generating" x="17" y="39" />
      <use className="generating-layer d32" href="#scan-dot-generating" x="28" y="39" />
      <use className="generating-layer d33" href="#scan-dot-generating" x="39" y="39" />
      <use className="generating-layer d34" href="#scan-dot-generating" x="50" y="39" />
      <use className="generating-layer d40" href="#scan-dot-generating" x="6" y="50" />
      <use className="generating-layer d41" href="#scan-dot-generating" x="17" y="50" />
      <use className="generating-layer d42" href="#scan-dot-generating" x="28" y="50" />
      <use className="generating-layer d43" href="#scan-dot-generating" x="39" y="50" />
      <use className="generating-layer d44" href="#scan-dot-generating" x="50" y="50" />
    </svg>
  )
}
