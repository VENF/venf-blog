import React from 'react'

interface FeedbackIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  stop?: boolean
  className?: string
}

export const FeedbackIcon: React.FC<FeedbackIconProps> = ({
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
      aria-label="Beacon"
      width={size}
      height={size}
      className={`${color} ${className}`.trim()}
      {...props}
    >
      <title>Beacon</title>
      <desc>A single center dot pulses on a quiet field.</desc>

      <defs>
        <circle id="bg-dot-feedback" r="2.4" fill="currentColor" opacity="0.07" />
        <circle id="scan-dot-feedback" r="3.1" fill="currentColor" />
      </defs>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .feedback-layer {
          fill: currentColor;
          opacity: 0.12;
          animation: beacon-pulse-anim 1800ms cubic-bezier(0.16, 1, 0.3, 1) infinite both;
        }
        @keyframes beacon-pulse-anim {
          0% { opacity: 0.12; }
          14% { opacity: 1; }
          40% { opacity: 0.12; }
          100% { opacity: 0.12; }
        }
        @media (prefers-reduced-motion: reduce) {
          .feedback-layer {
            animation: none;
            opacity: 0.45;
          }
        }
        ${stop ? '.feedback-layer { animation-play-state: paused; opacity: 0.45; }' : ''}
        .d22 { animation-delay: 0ms; }
      `,
        }}
      />

      {/* Cuadrícula de fondo */}
      <use href="#bg-dot-feedback" x="6" y="6" />
      <use href="#bg-dot-feedback" x="17" y="6" />
      <use href="#bg-dot-feedback" x="28" y="6" />
      <use href="#bg-dot-feedback" x="39" y="6" />
      <use href="#bg-dot-feedback" x="50" y="6" />
      <use href="#bg-dot-feedback" x="6" y="17" />
      <use href="#bg-dot-feedback" x="17" y="17" />
      <use href="#bg-dot-feedback" x="28" y="17" />
      <use href="#bg-dot-feedback" x="39" y="17" />
      <use href="#bg-dot-feedback" x="50" y="17" />
      <use href="#bg-dot-feedback" x="6" y="28" />
      <use href="#bg-dot-feedback" x="17" y="28" />
      <use href="#bg-dot-feedback" x="28" y="28" />
      <use href="#bg-dot-feedback" x="39" y="28" />
      <use href="#bg-dot-feedback" x="50" y="28" />
      <use href="#bg-dot-feedback" x="6" y="39" />
      <use href="#bg-dot-feedback" x="17" y="39" />
      <use href="#bg-dot-feedback" x="28" y="39" />
      <use href="#bg-dot-feedback" x="39" y="39" />
      <use href="#bg-dot-feedback" x="50" y="39" />
      <use href="#bg-dot-feedback" x="6" y="50" />
      <use href="#bg-dot-feedback" x="17" y="50" />
      <use href="#bg-dot-feedback" x="28" y="50" />
      <use href="#bg-dot-feedback" x="39" y="50" />
      <use href="#bg-dot-feedback" x="50" y="50" />

      {/* Punto Central Activo (Pulso) */}
      <use className="feedback-layer d22" href="#scan-dot-feedback" x="28" y="28" />
    </svg>
  )
}
