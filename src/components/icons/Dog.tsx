import React from 'react'

export const DogFaceIcon = ({
  size = 100,
  color = '#000000',
  strokeWidth = 0,
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0,
}) => {
  const transforms = []
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`)
  if (flipHorizontal) transforms.push('scaleX(-1)')
  if (flipVertical) transforms.push('scaleY(-1)')

  const viewBoxSize = 13 + padding * 2
  const viewBoxOffset = -padding
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: size,
        height: size,
        opacity,
        transform: transforms.join(' ') || undefined,
        filter:
          shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined,
      }}
    >
      <path
        fill="currentColor"
        d="M3 4H2v2h1Zm0 0h1V2h3v2h1V2h1V1H2v1h1Zm2 8h1v-1H5ZM1 9h1V6H1V3H0v4h1Zm3 2h1v-1h1v1h1v-1h2V9H6V8H5v1H2v1h2Zm0-4h1V5H4ZM1 3h1V2H1Zm5 4h1V5H6Zm2-1h1V4H8Zm1 3h1V7h1V3h-1v3H9Zm0-6h1V2H9Zm0 0"
      />
    </svg>
  )
}
