import React from 'react'

interface CompleteIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  stop?: boolean
  className?: string
}

export const CompleteIcon: React.FC<CompleteIconProps> = ({
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
      aria-label="Breath"
      width={size}
      height={size}
      className={`${color} ${className}`.trim()}
      {...props}
    >
      <title>Breath</title>
      <desc>The whole field breathes in and out together.</desc>

      <defs>
        <circle id="bg-dot-complete" r="2.4" fill="currentColor" opacity="0.07" />
        <circle id="scan-dot-complete" r="3.1" fill="currentColor" />
      </defs>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .complete-layer {
          opacity: 0.10;
          animation: breath-pulse-anim 2800ms cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
        @keyframes breath-pulse-anim {
          0% { opacity: 0.10; }
          50% { opacity: 0.85; }
          100% { opacity: 0.10; }
        }
        @media (prefers-reduced-motion: reduce) {
          .complete-layer {
            animation: none;
            opacity: 0.45;
          }
        }
        ${stop ? '.complete-layer { animation-play-state: paused; opacity: 0.45; }' : ''}
        
        .d00, .d01, .d02, .d03, .d04,
        .d10, .d11, .d12, .d13, .d14,
        .d20, .d21, .d22, .d23, .d24,
        .d30, .d31, .d32, .d33, .d34,
        .d40, .d41, .d42, .d43, .d44 { 
          animation-delay: 0ms; 
        }
      `,
        }}
      />

      {/* Cuadrícula estática de fondo */}
      <use href="#bg-dot-complete" x="6" y="6" />
      <use href="#bg-dot-complete" x="17" y="6" />
      <use href="#bg-dot-complete" x="28" y="6" />
      <use href="#bg-dot-complete" x="39" y="6" />
      <use href="#bg-dot-complete" x="50" y="6" />
      <use href="#bg-dot-complete" x="6" y="17" />
      <use href="#bg-dot-complete" x="17" y="17" />
      <use href="#bg-dot-complete" x="28" y="17" />
      <use href="#bg-dot-complete" x="39" y="17" />
      <use href="#bg-dot-complete" x="50" y="17" />
      <use href="#bg-dot-complete" x="6" y="28" />
      <use href="#bg-dot-complete" x="17" y="28" />
      <use href="#bg-dot-complete" x="28" y="28" />
      <use href="#bg-dot-complete" x="39" y="28" />
      <use href="#bg-dot-complete" x="50" y="28" />
      <use href="#bg-dot-complete" x="6" y="39" />
      <use href="#bg-dot-complete" x="17" y="39" />
      <use href="#bg-dot-complete" x="28" y="39" />
      <use href="#bg-dot-complete" x="39" y="39" />
      <use href="#bg-dot-complete" x="50" y="39" />
      <use href="#bg-dot-complete" x="6" y="50" />
      <use href="#bg-dot-complete" x="17" y="50" />
      <use href="#bg-dot-complete" x="28" y="50" />
      <use href="#bg-dot-complete" x="39" y="50" />
      <use href="#bg-dot-complete" x="50" y="50" />

      {/* Capa animada (Efecto Respiración Sincrónica) */}
      <use className="complete-layer d00" href="#scan-dot-complete" x="6" y="6" />
      <use className="complete-layer d01" href="#scan-dot-complete" x="17" y="6" />
      <use className="complete-layer d02" href="#scan-dot-complete" x="28" y="6" />
      <use className="complete-layer d03" href="#scan-dot-complete" x="39" y="6" />
      <use className="complete-layer d04" href="#scan-dot-complete" x="50" y="6" />
      <use className="complete-layer d10" href="#scan-dot-complete" x="6" y="17" />
      <use className="complete-layer d11" href="#scan-dot-complete" x="17" y="17" />
      <use className="complete-layer d12" href="#scan-dot-complete" x="28" y="17" />
      <use className="complete-layer d13" href="#scan-dot-complete" x="39" y="17" />
      <use className="complete-layer d14" href="#scan-dot-complete" x="50" y="17" />
      <use className="complete-layer d20" href="#scan-dot-complete" x="6" y="28" />
      <use className="complete-layer d21" href="#scan-dot-complete" x="17" y="28" />
      <use className="complete-layer d22" href="#scan-dot-complete" x="28" y="28" />
      <use className="complete-layer d23" href="#scan-dot-complete" x="39" y="28" />
      <use className="complete-layer d24" href="#scan-dot-complete" x="50" y="28" />
      <use className="complete-layer d30" href="#scan-dot-complete" x="6" y="39" />
      <use className="complete-layer d31" href="#scan-dot-complete" x="17" y="39" />
      <use className="complete-layer d32" href="#scan-dot-complete" x="28" y="39" />
      <use className="complete-layer d33" href="#scan-dot-complete" x="39" y="39" />
      <use className="complete-layer d34" href="#scan-dot-complete" x="50" y="39" />
      <use className="complete-layer d40" href="#scan-dot-complete" x="6" y="50" />
      <use className="complete-layer d41" href="#scan-dot-complete" x="17" y="50" />
      <use className="complete-layer d42" href="#scan-dot-complete" x="28" y="50" />
      <use className="complete-layer d43" href="#scan-dot-complete" x="39" y="50" />
      <use className="complete-layer d44" href="#scan-dot-complete" x="50" y="50" />
    </svg>
  )
}
